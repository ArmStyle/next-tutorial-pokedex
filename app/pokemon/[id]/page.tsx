"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchPokemonDetail,
  selectPokemonDetail,
  selectDetailLoading,
  selectDetailError,
} from "@/app/store/slices/pokemonDetailSlice";
import HeroBanner from "@/app/components/detail/HeroBanner";
import AbilityList from "@/app/components/detail/AbilityList";
import StatsList from "@/app/components/detail/StatsList";

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const name = params.id as string;

  // Select from cache — undefined if not yet fetched
  const pokemon = useAppSelector(selectPokemonDetail(name));
  const loading = useAppSelector(selectDetailLoading);
  const error = useAppSelector(selectDetailError);

  useEffect(() => {
    if (name) dispatch(fetchPokemonDetail(name)); // no-op if already cached
  }, [name, dispatch]);

  /* ── Loading ── */
  if (loading && !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Loading Pokémon…
          </p>
        </div>
      </div>
    );
  }

  /* ── Error / Not found ── */
  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <p className="text-5xl">😵</p>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
            Pokémon not found
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            ← Back to list
          </button>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? "normal";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Back button ── */}
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">
            ←
          </span>
          Back to Pokédex
        </button>

        {/* ── Hero banner ── */}
        <HeroBanner pokemon={pokemon} />

        {/* ── Abilities + Stats row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <AbilityList
              abilities={pokemon.abilities}
              primaryType={primaryType}
            />
          </div>
          <div className="lg:col-span-3">
            <StatsList stats={pokemon.stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
