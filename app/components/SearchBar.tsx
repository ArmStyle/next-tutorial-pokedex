'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Pokemon } from '@/app/types/pokemon';

// ─── Sub-components ───────────────────────────────────────────────────────────

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-700/60 text-inherit rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

function SuggestionItem({
  pokemon: p,
  query,
  onSelect,
}: {
  pokemon: Pokemon;
  query: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={`/pokemon/${p.name}`}
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <Image
        src={`${SPRITE_BASE}/${p.id}.png`}
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

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  allPokemon: Pokemon[];
}

export default function SearchBar({ allPokemon }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedOutsideInput = !inputRef.current?.contains(e.target as Node);
      const clickedOutsideDropdown = !dropdownRef.current?.contains(e.target as Node);
      if (clickedOutsideInput && clickedOutsideDropdown) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const matched = allPokemon
      .filter(p => p.name.includes(value.toLowerCase()))
      .slice(0, 8);
    setSuggestions(matched);
    setShowDropdown(matched.length > 0);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleSelect = () => {
    setShowDropdown(false);
    setQuery('');
  };

  const hasNoResults = query.trim() && !showDropdown && allPokemon.length > 0;

  return (
    <div className="max-w-xl mx-auto relative">
      {/* Input */}
      <div className={`
        flex items-center gap-3
        bg-white dark:bg-slate-800
        border-2 rounded-2xl px-4 py-3
        shadow-lg transition-all duration-200
        ${isFocused
          ? 'border-blue-500 dark:border-blue-400 shadow-blue-100 dark:shadow-blue-900/30'
          : 'border-slate-200 dark:border-slate-600'
        }
      `}>
        {/* Search icon */}
        <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search Pokémon by name…"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { setIsFocused(true); if (suggestions.length) setShowDropdown(true); }}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base font-medium"
        />

        {/* Clear button */}
        {query && (
          <button
            onMouseDown={e => { e.preventDefault(); clearSearch(); }}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-slate-500 dark:text-slate-300 text-sm font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          <div className="py-1.5">
            {suggestions.map(p => (
              <SuggestionItem key={p.name} pokemon={p} query={query} onSelect={handleSelect} />
            ))}
          </div>
          <p className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
            {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* No results */}
      {hasNoResults && (
        <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
          No Pokémon found for &quot;
          <span className="font-semibold text-slate-600 dark:text-slate-300">{query}</span>
          &quot;
        </p>
      )}
    </div>
  );
}
