// ─────────────────────────────────────────────────────────────────────────────
// Root Redux store
// ─────────────────────────────────────────────────────────────────────────────

import { configureStore } from '@reduxjs/toolkit';
import pokemonListReducer   from '@/app/store/slices/pokemonListSlice';
import pokemonDetailReducer from '@/app/store/slices/pokemonDetailSlice';

export const store = configureStore({
  reducer: {
    pokemonList:   pokemonListReducer,
    pokemonDetail: pokemonDetailReducer,
  },
});

// Infer RootState and AppDispatch from the store itself
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
