'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchPokemonByGeneration,
  selectSelectedGeneration,
  selectGenerationLoading,
  clearGenerationFilter,
  setSelectedRegion,
} from '@/app/store/slices/generationFilterSlice';

interface Generation {
  id: number;
  name: string;
  region: string;
}

const GENERATIONS: Generation[] = [
  { id: 1, name: 'Gen I', region: 'Kanto' },
  { id: 2, name: 'Gen II', region: 'Johto' },
  { id: 3, name: 'Gen III', region: 'Hoenn' },
  { id: 4, name: 'Gen IV', region: 'Sinnoh' },
  { id: 5, name: 'Gen V', region: 'Unova' },
  { id: 6, name: 'Gen VI', region: 'Kalos' },
  { id: 7, name: 'Gen VII', region: 'Alola' },
  { id: 8, name: 'Gen VIII', region: 'Galar' },
  { id: 9, name: 'Gen IX', region: 'Paldea' },
];

export default function GenerationFilter() {
  const dispatch = useAppDispatch();
  const selectedGeneration = useAppSelector(selectSelectedGeneration);
  const loading = useAppSelector(selectGenerationLoading);

  const handleGenerationChange = (generation: number) => {
    const gen = GENERATIONS.find(g => g.id === generation);
    if (selectedGeneration === generation) {
      // Clear filter if clicking the same generation
      dispatch(clearGenerationFilter());
    } else {
      // Fetch new generation and set its region
      dispatch(fetchPokemonByGeneration(generation));
      if (gen) {
        dispatch(setSelectedRegion(gen.region));
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-4">
          Filter by Generation
        </h3>
      </div>

      {/* Generation buttons grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            onClick={() => handleGenerationChange(gen.id)}
            disabled={loading && selectedGeneration !== gen.id}
            className={`
              cursor-pointer relative py-2 px-2 sm:px-3 rounded-lg font-bold text-sm
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${
                selectedGeneration === gen.id
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }
            `}
            title={gen.region}
          >
            <span className="block text-xs sm:text-sm">{gen.name}</span>
            <span className="block text-xs text-opacity-75 mt-0.5">
              {gen.region}
            </span>
          </button>
        ))}
      </div>

      {/* Clear filter button */}
      {selectedGeneration && (
        <button
          onClick={() => dispatch(clearGenerationFilter())}
          className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
