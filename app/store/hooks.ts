// ─────────────────────────────────────────────────────────────────────────────
// Typed Redux hooks
//
// Use these instead of the plain `useDispatch` / `useSelector` from react-redux
// so TypeScript knows the full RootState shape and dispatch signature.
// ─────────────────────────────────────────────────────────────────────────────

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
