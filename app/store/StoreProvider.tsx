'use client';

// ─────────────────────────────────────────────────────────────────────────────
// StoreProvider
//
// Wraps the application with the Redux <Provider> so every client component
// can access the store via hooks.  Must be a Client Component.
// ─────────────────────────────────────────────────────────────────────────────

import { Provider } from 'react-redux';
import { store } from '@/app/store/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
