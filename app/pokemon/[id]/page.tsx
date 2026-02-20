'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
  sprites: {
    other: { 'official-artwork': { front_default: string } };
  };
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

const typeColors: Record<string, { bg: string; light: string; text: string }> = {
  normal:   { bg: 'bg-stone-400',   light: 'bg-stone-100 dark:bg-stone-800',    text: 'text-stone-700 dark:text-stone-300' },
  fire:     { bg: 'bg-orange-500',  light: 'bg-orange-50 dark:bg-orange-950',   text: 'text-orange-700 dark:text-orange-300' },
  water:    { bg: 'bg-blue-500',    light: 'bg-blue-50 dark:bg-blue-950',       text: 'text-blue-700 dark:text-blue-300' },
  electric: { bg: 'bg-yellow-400',  light: 'bg-yellow-50 dark:bg-yellow-950',   text: 'text-yellow-700 dark:text-yellow-300' },
  grass:    { bg: 'bg-green-500',   light: 'bg-green-50 dark:bg-green-950',     text: 'text-green-700 dark:text-green-300' },
  ice:      { bg: 'bg-cyan-400',    light: 'bg-cyan-50 dark:bg-cyan-950',       text: 'text-cyan-700 dark:text-cyan-300' },
  fighting: { bg: 'bg-red-700',     light: 'bg-red-50 dark:bg-red-950',         text: 'text-red-700 dark:text-red-300' },
  poison:   { bg: 'bg-purple-500',  light: 'bg-purple-50 dark:bg-purple-950',   text: 'text-purple-700 dark:text-purple-300' },
  ground:   { bg: 'bg-amber-600',   light: 'bg-amber-50 dark:bg-amber-950',     text: 'text-amber-700 dark:text-amber-300' },
  flying:   { bg: 'bg-sky-400',     light: 'bg-sky-50 dark:bg-sky-950',         text: 'text-sky-700 dark:text-sky-300' },
  psychic:  { bg: 'bg-pink-500',    light: 'bg-pink-50 dark:bg-pink-950',       text: 'text-pink-700 dark:text-pink-300' },
  bug:      { bg: 'bg-lime-500',    light: 'bg-lime-50 dark:bg-lime-950',       text: 'text-lime-700 dark:text-lime-300' },
  rock:     { bg: 'bg-stone-600',   light: 'bg-stone-50 dark:bg-stone-950',     text: 'text-stone-700 dark:text-stone-300' },
  ghost:    { bg: 'bg-violet-700',  light: 'bg-violet-50 dark:bg-violet-950',   text: 'text-violet-700 dark:text-violet-300' },
  dragon:   { bg: 'bg-indigo-600',  light: 'bg-indigo-50 dark:bg-indigo-950',   text: 'text-indigo-700 dark:text-indigo-300' },
  dark:     { bg: 'bg-neutral-700', light: 'bg-neutral-100 dark:bg-neutral-900', text: 'text-neutral-700 dark:text-neutral-300' },
  steel:    { bg: 'bg-slate-500',   light: 'bg-slate-50 dark:bg-slate-900',     text: 'text-slate-600 dark:text-slate-300' },
  fairy:    { bg: 'bg-rose-400',    light: 'bg-rose-50 dark:bg-rose-950',       text: 'text-rose-700 dark:text-rose-300' },
};

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpATK',
  'special-defense': 'SpDEF',
  speed: 'SPD',
};

function statBarColor(val: number) {
  if (val >= 110) return 'bg-emerald-500';
  if (val >= 80)  return 'bg-green-400';
  if (val >= 60)  return 'bg-yellow-400';
  if (val >= 40)  return 'bg-orange-400';
  return 'bg-red-400';
}

export default function PokemonDetail() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const name = params.id as string;

  useEffect(() => {
    if (!name) return;
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pokemon/${name}`);
        if (!response.ok) throw new Error('Failed to fetch pokemon');
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [name]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Loading Pokémon…</p>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <p className="text-5xl">😵</p>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200">Pokémon not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            ← Back to list
          </button>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = typeColors[primaryType] ?? typeColors.normal;
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Back button ── */}
        <button
          onClick={() => router.push('/')}
          className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
          Back to Pokédex
        </button>

        {/* ── Hero card ── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

          {/* Type-coloured banner */}
          <div className={`${typeColor.bg} relative h-48 sm:h-56 overflow-hidden`}>
            {/* Pokéball ring watermark */}
            <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full border-32 border-white/10 pointer-events-none" />
            <div className="absolute -right-8 -top-8 w-64 h-64 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10" />
            </div>

            {/* ID badge */}
            <span className="absolute top-5 left-7 text-white/60 font-black text-base tracking-widest">
              #{String(pokemon.id).padStart(4, '0')}
            </span>

            {/* Pokémon artwork – overflows below banner */}
            <div className="absolute bottom-0 right-8 sm:right-16">
              {pokemon.sprites?.other?.['official-artwork']?.front_default && (
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  width={220}
                  height={220}
                  className="w-44 h-44 sm:w-56 sm:h-56 object-contain drop-shadow-2xl translate-y-8"
                  priority
                />
              )}
            </div>
          </div>

          {/* Name + types + height/weight */}
          <div className="pt-6 pb-8 px-7 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

              <div>
                <h1 className="text-4xl sm:text-5xl font-black capitalize text-slate-900 dark:text-slate-50 tracking-tight leading-none">
                  {pokemon.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-4">
                  {pokemon.types.map((t, i) => {
                    const c = typeColors[t.type.name] ?? typeColors.normal;
                    return (
                      <span
                        key={i}
                        className={`${c.bg} text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow`}
                      >
                        {t.type.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Stat chips */}
              <div className="flex gap-3 shrink-0">
                <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-2xl px-5 py-3">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Height</p>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100">{(pokemon.height / 10).toFixed(1)}<span className="text-sm font-semibold ml-0.5">m</span></p>
                </div>
                <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-2xl px-5 py-3">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Weight</p>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100">{(pokemon.weight / 10).toFixed(1)}<span className="text-sm font-semibold ml-0.5">kg</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Abilities + Stats row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Abilities */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-7">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
              Abilities
            </h2>
            <div className="space-y-3">
              {pokemon.abilities.map((a, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 ${typeColor.light}`}
                >
                  <span className={`capitalize font-bold text-sm ${typeColor.text}`}>
                    {a.ability.name.replace('-', ' ')}
                  </span>
                  {a.is_hidden && (
                    <span className="text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Base Stats */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Base Stats
              </h2>
              <span className="text-xs font-extrabold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
                Total {totalStats}
              </span>
            </div>
            <div className="space-y-3.5">
              {pokemon.stats.map((stat, i) => {
                const pct = Math.min((stat.base_stat / 180) * 100, 100);
                const label = statLabels[stat.stat.name] ?? stat.stat.name;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-14 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">
                      {label}
                    </span>
                    <span className="w-9 text-right text-sm font-black text-slate-700 dark:text-slate-200 shrink-0 tabular-nums">
                      {stat.base_stat}
                    </span>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${statBarColor(stat.base_stat)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
