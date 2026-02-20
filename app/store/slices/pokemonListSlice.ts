// ─────────────────────────────────────────────────────────────────────────────
// pokemonListSlice
//
// Manages two separate concerns:
//   1. allPokemon  – full name list (fetched once, used by SearchBar)
//   2. page        – paginated cards shown on the home page
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Pokemon } from '@/app/types/pokemon';

// ── Helpers ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

/** Attach numeric id derived from the PokeAPI URL */
function withId(list: Pokemon[]): Pokemon[] {
  return list.map(p => ({
    ...p,
    id: Number(p.url.split('/').filter(Boolean).pop()),
  }));
}

// ── Async thunks ─────────────────────────────────────────────────────────────

/** Fetch the complete Pokémon name list (≈ 1 500 entries) for search suggestions. */
export const fetchAllPokemon = createAsyncThunk(
  'pokemonList/fetchAll',
  async () => {
    const res = await fetch('/api/pokemon?limit=1500&offset=0');
    if (!res.ok) throw new Error('Failed to fetch all Pokémon');
    const data = await res.json();
    return withId(data.results as Pokemon[]);
  },
);

/** Fetch one page of Pokémon (PAGE_SIZE entries at the given offset). */
export const fetchPokemonPage = createAsyncThunk(
  'pokemonList/fetchPage',
  async (offset: number) => {
    const res = await fetch(`/api/pokemon?limit=${PAGE_SIZE}&offset=${offset}`);
    if (!res.ok) throw new Error('Failed to fetch Pokémon page');
    const data = await res.json();
    return {
      results: withId(data.results as Pokemon[]),
      hasMore: data.next !== null,
      offset,
    };
  },
);

// ── State shape ──────────────────────────────────────────────────────────────

interface PokemonListState {
  /** Full list — fetched once, never re-fetched */
  allPokemon: Pokemon[];
  allLoaded: boolean;

  /** Paginated display list */
  page: Pokemon[];
  offset: number;
  hasMore: boolean;

  /** Loading / error flags */
  loadingPage: boolean;
  loadingAll: boolean;
  error: string | null;
}

const initialState: PokemonListState = {
  allPokemon: [],
  allLoaded: false,

  page: [],
  offset: 0,
  hasMore: true,

  loadingPage: false,
  loadingAll: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const pokemonListSlice = createSlice({
  name: 'pokemonList',
  initialState,
  reducers: {
    /** Increment offset to trigger the next page fetch */
    loadNextPage(state) {
      state.offset += PAGE_SIZE;
    },
  },
  extraReducers: builder => {
    // ── fetchAllPokemon ──
    builder
      .addCase(fetchAllPokemon.pending, state => {
        state.loadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllPokemon.fulfilled, (state, action) => {
        state.allPokemon = action.payload;
        state.allLoaded = true;
        state.loadingAll = false;
      })
      .addCase(fetchAllPokemon.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.error.message ?? 'Unknown error';
      });

    // ── fetchPokemonPage ──
    builder
      .addCase(fetchPokemonPage.pending, state => {
        state.loadingPage = true;
        state.error = null;
      })
      .addCase(fetchPokemonPage.fulfilled, (state, action) => {
        const { results, hasMore, offset } = action.payload;
        // First page → replace; subsequent pages → append (with deduplication)
        if (offset === 0) {
          state.page = results;
        } else {
          const existingIds = new Set(state.page.map(p => p.id));
          const newResults = results.filter(r => !existingIds.has(r.id));
          state.page = [...state.page, ...newResults];
        }
        state.hasMore = hasMore;
        state.loadingPage = false;
      })
      .addCase(fetchPokemonPage.rejected, (state, action) => {
        state.loadingPage = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { loadNextPage } = pokemonListSlice.actions;
export default pokemonListSlice.reducer;
