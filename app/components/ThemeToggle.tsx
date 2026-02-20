'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      suppressHydrationWarning
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="cursor-pointer w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span suppressHydrationWarning className="text-lg transition-transform duration-300 hover:scale-110">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
