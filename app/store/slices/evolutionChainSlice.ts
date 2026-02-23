import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/app/lib/apiClient';
import type { RootState } from '../store';

// ── Types ───────────────────────────────────────────────────────────────────

export interface EvolutionDetail {
  item?: { name: string; url: string } | null;
  trigger: { name: string; url: string };
  gender?: number | null;
  held_item?: { name: string; url: string } | null;
  known_move?: { name: string; url: string } | null;
  known_move_type?: { name: string; url: string } | null;
  location?: { name: string; url: string } | null;
  min_level?: number | null;
  min_happiness?: number | null;
  min_beauty?: number | null;
  min_affection?: number | null;
  needs_overworld_rain?: boolean;
  party_species?: { name: string; url: string } | null;
  party_type?: { name: string; url: string } | null;
  relative_physical_stats?: number | null;
  time_of_day?: string;
  trade_species?: { name: string; url: string } | null;
  turn_upside_down?: boolean;
  region?: { name: string; url: string } | null;
  base_form?: { name: string; url: string } | null;
  used_move?: { name: string; url: string } | null;
  min_move_count?: number | null;
  min_steps?: number | null;
  min_damage_taken?: number | null;
}

export interface EvolutionNode {
  name: string;
  url: string;
  isBaby: boolean;
  evolutionDetails: EvolutionDetail[];
  evolvesTo: EvolutionNode[];
}

export interface EvolutionChainState {
  /** Current Pokemon's evolution chain */
  chain: EvolutionNode | null;

  /** Loading / error flags */
  loading: boolean;
  error: string | null;

  /** Cache to avoid re-fetching */
  cache: Record<string, EvolutionNode>;
}

// ── Async thunk ───────────────────────────────────────────────────────────────

export const fetchEvolutionChain = createAsyncThunk(
  'evolutionChain/fetch',
  async (pokemonName: string) => {
    const response = await apiClient.get<{
      id: number;
      evolution_chain: EvolutionNode;
    }>(`/pokemon/evolution-chain/${pokemonName}`);
    return response.data;
  },
  {
    // Skip if already in cache
    condition: (pokemonName, { getState }) => {
      const { evolutionChain } = getState() as RootState;
      return !(pokemonName in evolutionChain.cache);
    },
  }
);

// ── Initial State ──────────────────────────────────────────────────────────────

const initialState: EvolutionChainState = {
  chain: null,
  loading: false,
  error: null,
  cache: {},
};

// ── Slice ──────────────────────────────────────────────────────────────────────

const evolutionChainSlice = createSlice({
  name: 'evolutionChain',
  initialState,
  reducers: {
    clearEvolutionChain(state) {
      state.chain = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvolutionChain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvolutionChain.fulfilled, (state, action) => {
        state.chain = action.payload.evolution_chain;
        state.cache[action.meta.arg] = action.payload.evolution_chain;
        state.loading = false;
      })
      .addCase(fetchEvolutionChain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch evolution chain';
      });
  },
});

// ── Selectors ──────────────────────────────────────────────────────────────────

export const selectEvolutionChain = (state: RootState) => state.evolutionChain.chain;
export const selectEvolutionLoading = (state: RootState) => state.evolutionChain.loading;
export const selectEvolutionError = (state: RootState) => state.evolutionChain.error;

export const { clearEvolutionChain } = evolutionChainSlice.actions;
export default evolutionChainSlice.reducer;
