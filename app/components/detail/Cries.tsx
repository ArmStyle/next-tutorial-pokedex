'use client';

import { useState } from 'react';
import type { PokemonDetail } from '@/app/types/pokemon';

interface Props {
  pokemon: PokemonDetail;
}

export default function Cries({ pokemon }: Props) {
  const cries = pokemon.cries;
  const [playingCry, setPlayingCry] = useState<'latest' | 'legacy' | null>(null);

  if (!cries || (!cries.latest && !cries.legacy)) {
    return (
      <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
        <div className="text-center text-slate-500 dark:text-slate-400">
          No cry data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-6">
        Pokémon Cry
      </h2>

      {/* Cry Players */}
      <div className="space-y-4">
        {/* Latest Cry */}
        {cries.latest && (
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">
                Latest Cry
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                (Generation VIII+)
              </p>
            </div>
            <button
              onClick={() => {
                const audio = new Audio(cries.latest as string);
                audio.play();
                setPlayingCry('latest');
                setTimeout(() => setPlayingCry(null), 2000);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🔊</span>
              {playingCry === 'latest' ? 'Playing...' : 'Play'}
            </button>
          </div>
        )}

        {/* Legacy Cry */}
        {cries.legacy && (
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">
                Legacy Cry
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                (Generation I-VII)
              </p>
            </div>
            <button
              onClick={() => {
                if (cries.legacy) {
                  const audio = new Audio(cries.legacy);
                  audio.play();
                  setPlayingCry('legacy');
                  setTimeout(() => setPlayingCry(null), 2000);
                }
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🔊</span>
              {playingCry === 'legacy' ? 'Playing...' : 'Play'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
