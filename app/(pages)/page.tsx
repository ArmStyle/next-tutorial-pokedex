"use client";

import { useEffect } from "react";
import PokemonCard from "@/app/components/PokemonCard";
import SearchBar from "@/app/components/SearchBar";
import GenerationFilter from "@/app/components/GenerationFilter";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchAllPokemon,
  fetchPokemonPage,
  loadNextPage,
} from "@/app/store/slices/pokemonListSlice";
import {
  selectSelectedGeneration,
  selectGenerationPokemon,
  selectGenerationLoading,
  selectSelectedRegion,
} from "@/app/store/slices/generationFilterSlice";
import { toRomanNumeral } from "@/app/lib/roman";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-slate-400 dark:text-slate-500 font-medium">
        Loading Pokémon…
      </p>
    </div>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();

  // Select what we need from the store
  const allPokemon = useAppSelector((s) => s.pokemonList.allPokemon);
  const allLoaded = useAppSelector((s) => s.pokemonList.allLoaded);
  const page = useAppSelector((s) => s.pokemonList.page);
  const offset = useAppSelector((s) => s.pokemonList.offset);
  const hasMore = useAppSelector((s) => s.pokemonList.hasMore);
  const loading = useAppSelector((s) => s.pokemonList.loadingPage);

  // Generation filter selectors
  const selectedGeneration = useAppSelector(selectSelectedGeneration);
  const generationPokemon = useAppSelector(selectGenerationPokemon);
  const generationLoading = useAppSelector(selectGenerationLoading);
  const selectedRegion = useAppSelector(selectSelectedRegion);

  // Show filtered Pokemon if generation is selected, otherwise show paginated list
  const displayPokemon = selectedGeneration ? generationPokemon : page;
  const isLoading = selectedGeneration ? generationLoading : loading;

  // Fetch full list once for SearchBar suggestions
  useEffect(() => {
    if (!allLoaded) dispatch(fetchAllPokemon());
  }, [allLoaded, dispatch]);

  // Fetch a page whenever offset changes (only if not filtered by generation)
  useEffect(() => {
    if (!selectedGeneration) {
      dispatch(fetchPokemonPage(offset));
    }
  }, [offset, dispatch, selectedGeneration]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ── Hero + Search ── */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-red-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Pokédex
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {allPokemon.length > 0
              ? `${allPokemon.length.toLocaleString()} Pokémon`
              : "Explore all Pokémon"}
          </p>
          <SearchBar allPokemon={allPokemon} />
        </div>

        {/* ── Generation Filter ── */}
        <GenerationFilter />

        {/* ── Pokémon Grid ── */}
        {isLoading && displayPokemon.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* List header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                {selectedGeneration ? `Pokémon Generation ${toRomanNumeral(selectedGeneration)} ${selectedRegion ? ` (${selectedRegion})` : ''}` : 'All Pokémon'}
              </h2>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                {displayPokemon.length} shown
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-10">
              {displayPokemon.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {/* Load more - only show when not filtered by generation */}
            {!selectedGeneration && hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => dispatch(loadNextPage())}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-2xl transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
