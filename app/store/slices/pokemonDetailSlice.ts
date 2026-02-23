import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/app/lib/apiClient';
import type { RootState } from '../store';
import type { PokemonDetail } from '@/app/types/pokemon';

// ── Async thunk ───────────────────────────────────────────────────────────────

export const fetchPokemonDetail = createAsyncThunk(
  'pokemonDetail/fetch',
  async (name: string) => {
    const response = await apiClient.get<PokemonDetail>(`/pokemon/${name}`);
    return response.data;
  },
  {
    // Skip the network call if this Pokémon is already in the cache
    condition: (name, { getState }) => {
      const { pokemonDetail } = getState() as RootState;
      return !(name in pokemonDetail.cache);
    },
  },
);

// ── State shape ───────────────────────────────────────────────────────────────

interface PokemonDetailState {
  /** name → full detail object */
  cache: Record<string, PokemonDetail>;

  /** name of the Pokémon currently being viewed */
  current: string | null;

  loading: boolean;
  error: string | null;
}

const initialState: PokemonDetailState = {
  cache: {},
  current: null,
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const pokemonDetailSlice = createSlice({
  name: 'pokemonDetail',
  initialState,
  reducers: {
    /** Set which Pokémon is currently being viewed */
    setCurrentPokemon(state, action: { payload: string }) {
      state.current = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPokemonDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonDetail.fulfilled, (state, action) => {
        state.cache[action.payload.name] = action.payload;
        state.loading = false;
      })
      .addCase(fetchPokemonDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Returns the cached detail for a given Pokémon name, or undefined */
export const selectPokemonDetail = (name: string) => (state: RootState) =>
  state.pokemonDetail.cache[name];

export const selectDetailLoading = (state: RootState) => state.pokemonDetail.loading;
export const selectDetailError   = (state: RootState) => state.pokemonDetail.error;

export const { setCurrentPokemon } = pokemonDetailSlice.actions;
export default pokemonDetailSlice.reducer;
