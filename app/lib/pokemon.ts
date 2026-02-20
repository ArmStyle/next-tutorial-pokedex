// ─────────────────────────────────────────────
// Pokémon constants: type colours, stat labels,
// and shared helper functions
// ─────────────────────────────────────────────

export interface TypeColor {
  bg: string;    // solid background, e.g. badge / hero banner
  light: string; // subtle tinted background for ability cards
  text: string;  // matching text colour
}

export const TYPE_COLORS: Record<string, TypeColor> = {
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

export const STAT_LABELS: Record<string, string> = {
  hp:               'HP',
  attack:           'ATK',
  defense:          'DEF',
  'special-attack': 'SpATK',
  'special-defense':'SpDEF',
  speed:            'SPD',
};

/** Returns a Tailwind bg colour class based on the stat value */
export function getStatBarColor(value: number): string {
  if (value >= 110) return 'bg-emerald-500';
  if (value >= 80)  return 'bg-green-400';
  if (value >= 60)  return 'bg-yellow-400';
  if (value >= 40)  return 'bg-orange-400';
  return 'bg-red-400';
}

/** Extracts the numeric Pokémon ID from its PokeAPI URL */
export function getIdFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).pop());
}
