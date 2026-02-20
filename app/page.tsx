'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Pokemon {
  name: string;
  url: string;
  id?: number;
}

function PokemonCard({ p }: { p: Pokemon }) {
  return (
    <Link href={`/pokemon/${p.name}`} className="group">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full border-2 border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transform hover:scale-105">
        <div className="bg-slate-100 dark:bg-slate-700 h-44 flex items-center justify-center relative overflow-hidden">
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
            alt={p.name}
            width={130}
            height={130}
            className="h-36 w-36 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
          />
        </div>
        <div className="p-5">
          <p className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-1">#{String(p.id).padStart(3, '0')}</p>
          <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {p.name}
          </h2>
        </div>
      </div>
    </Link>
  );
}

/* Highlight matched portion of text */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-700/60 text-inherit rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

/* Inline suggestion dropdown item */
function SuggestionItem({ p, query, onSelect }: { p: Pokemon; query: string; onSelect: () => void }) {
  return (
    <Link
      href={`/pokemon/${p.name}`}
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
        alt={p.name}
        width={36}
        height={36}
        className="w-9 h-9 object-contain"
      />
      <span className="capitalize font-semibold text-slate-800 dark:text-slate-100 text-sm">
        <HighlightText text={p.name} query={query} />
      </span>
      <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-bold tabular-nums">
        #{String(p.id).padStart(3, '0')}
      </span>
    </Link>
  );
}

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Fetch paginated list ── */
  const fetchPokemon = async (currentOffset: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pokemon?limit=20&offset=${currentOffset}`);
      const data = await response.json();
      const withIds = data.results.map((p: Pokemon) => ({
        ...p,
        id: Number(p.url.split('/').filter(Boolean).pop()),
      }));
      if (currentOffset === 0) {
        setPokemon(withIds);
      } else {
        setPokemon(prev => [...prev, ...withIds]);
      }
      setHasMore(data.next !== null);
    } catch (error) {
      console.error('Failed to fetch pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch full name list once for instant suggestions ── */
  useEffect(() => {
    fetch('/api/pokemon?limit=1500&offset=0')
      .then(r => r.json())
      .then(data => {
        const withIds = data.results.map((p: Pokemon) => ({
          ...p,
          id: Number(p.url.split('/').filter(Boolean).pop()),
        }));
        setAllPokemon(withIds);
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchPokemon(offset); }, [offset]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Filter suggestions ── */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const q = query.toLowerCase();
    const matched = allPokemon
      .filter(p => p.name.includes(q))
      .slice(0, 8);
    setSuggestions(matched);
    setShowDropdown(matched.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const loadMore = () => setOffset(prev => prev + 20);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-red-500 via-yellow-500 to-blue-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Pokédex
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {allPokemon.length > 0 ? `${allPokemon.length.toLocaleString()} Pokémon` : 'Explore all Pokémon'}
          </p>

          {/* ── Search bar ── */}
          <div className="max-w-xl mx-auto relative">
            <div
              className={`flex items-center gap-3 bg-white dark:bg-slate-800 border-2 rounded-2xl px-4 py-3 shadow-lg transition-all duration-200 ${
                searchOpen
                  ? 'border-blue-500 dark:border-blue-400 shadow-blue-100 dark:shadow-blue-900/30'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            >
              {/* Search icon */}
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search Pokémon by name…"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => { setSearchOpen(true); if (suggestions.length) setShowDropdown(true); }}
                onBlur={() => setSearchOpen(false)}
                className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base font-medium"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  onMouseDown={e => { e.preventDefault(); clearSearch(); }}
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-slate-500 dark:text-slate-300 text-sm font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* ── Dropdown suggestions ── */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="py-1.5">
                  {suggestions.map(p => (
                    <SuggestionItem
                      key={p.name}
                      p={p}
                      query={searchQuery}
                      onSelect={() => { setShowDropdown(false); setSearchQuery(''); }}
                    />
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
                  {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} · press Enter to go to first result
                </div>
              </div>
            )}

            {/* No results hint */}
            {searchQuery && !showDropdown && allPokemon.length > 0 && (
              <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
                No Pokémon found for &quot;<span className="font-semibold text-slate-600 dark:text-slate-300">{searchQuery}</span>&quot;
              </p>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading && pokemon.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-slate-400 dark:text-slate-500 font-medium">Loading Pokémon…</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                All Pokémon
              </h2>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                {pokemon.length} shown
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-10">
              {pokemon.map(p => <PokemonCard key={p.name} p={p} />)}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-2xl transition-colors shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading…
                    </>
                  ) : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
