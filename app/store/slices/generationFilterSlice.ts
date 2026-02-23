import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Pokemon } from '@/app/types/pokemon';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract numeric id from Pokemon URL and attach it */
function withId(list: Pokemon[]): Pokemon[] {
  return list.map(p => ({
    ...p,
    id: Number(p.url.split('/').filter(Boolean).pop()),
  }));
}

// ── Async thunk ───────────────────────────────────────────────────────────────

export const fetchPokemonByGeneration = createAsyncThunk(
  'generationFilter/fetch',
  async (generation: number) => {
    const res = await fetch(`/api/pokemon/by-generation/${generation}`);
    if (!res.ok) throw new Error(`Failed to fetch generation ${generation}`);
    const data = await res.json();
    return {
      ...data,
      results: withId(data.results as Pokemon[]),
    };
  }
);

// ── State shape ───────────────────────────────────────────────────────────────

interface GenerationFilterState {
  /** Current selected generation (null = show all) */
  selectedGeneration: number | null;

  /** Region name of selected generation */
  selectedRegion: string | null;

  /** Pokémon list for selected generation */
  pokemon: Pokemon[];

  /** Total count in generation */
  count: number;

  /** Loading / error flags */
  loading: boolean;
  error: string | null;
}

const initialState: GenerationFilterState = {
  selectedGeneration: null,
  selectedRegion: null,
  pokemon: [],
  count: 0,
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const generationFilterSlice = createSlice({
  name: 'generationFilter',
  initialState,
  reducers: {
    /** Clear generation filter (show all Pokémon) */
    clearGenerationFilter(state) {
      state.selectedGeneration = null;
      state.selectedRegion = null;
      state.pokemon = [];
      state.count = 0;
      state.error = null;
    },
    /** Set the region name for the selected generation */
    setSelectedRegion(state, action: { payload: string }) {
      state.selectedRegion = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPokemonByGeneration.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonByGeneration.fulfilled, (state, action) => {
        state.selectedGeneration = action.payload.generation;
        state.pokemon = action.payload.results;
        state.count = action.payload.pokemon_count;
        state.loading = false;
      })
      .addCase(fetchPokemonByGeneration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch generation';
      });
  },
});

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectSelectedGeneration = (state: RootState) =>
  state.generationFilter.selectedGeneration;

export const selectSelectedRegion = (state: RootState) =>
  state.generationFilter.selectedRegion;

export const selectGenerationPokemon = (state: RootState) =>
  state.generationFilter.pokemon;

export const selectGenerationCount = (state: RootState) =>
  state.generationFilter.count;

export const selectGenerationLoading = (state: RootState) =>
  state.generationFilter.loading;

export const selectGenerationError = (state: RootState) =>
  state.generationFilter.error;

export const { clearGenerationFilter, setSelectedRegion } = generationFilterSlice.actions;
export default generationFilterSlice.reducer;
