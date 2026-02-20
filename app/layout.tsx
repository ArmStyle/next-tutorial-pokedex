import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import './globals.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import StoreProvider from './store/StoreProvider';

export const metadata: Metadata = {
  title: 'Pokédex - Explore all Pokémon',
  description: 'A beautiful Pokédex application built with Next.js and Tailwind CSS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <StoreProvider>
          <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col">

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 transition-colors duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-700/70">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-2.5 group shrink-0"
                >
                  {/* Pokéball icon */}
                  <div className="relative w-8 h-8 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-linear-to-b from-red-500 to-red-600 shadow-md group-hover:shadow-red-300 dark:group-hover:shadow-red-900 transition-shadow" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-slate-800/40 dark:bg-black/50" />
                    </div>
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full h-1/2 rounded-b-full bg-white/90 dark:bg-slate-300/90" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-100 border-2 border-slate-700/50 dark:border-black/50 z-10" />
                  </div>
                  <span className="text-xl font-black tracking-tight bg-linear-to-r from-red-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                    Pokédex
                  </span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
                  >
                    <Icon icon="mdi:format-list-bulleted" className="w-4 h-4" />
                    <span className="hidden sm:inline">All Pokémon</span>
                  </Link>

                  <a
                    href="https://pokeapi.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
                  >
                    <Icon icon="mdi:external-link" className="w-4 h-4" />
                    <span className="hidden sm:inline">PokéAPI</span>
                  </a>

                  {/* Divider */}
                  <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                  <ThemeToggle />
                </div>
              </div>
            </nav>

            <main className="flex-1">{children}</main>

            {/* ── Footer ── */}
            <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 text-slate-400 py-10 transition-colors duration-300">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-linear-to-b from-red-500 to-red-600" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-black/40" />
                    </div>
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full h-1/2 rounded-b-full bg-white/80" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white border border-black/30 z-10" />
                  </div>
                  <span className="font-semibold text-slate-300">Pokédex</span>
                </div>
                <p>
                  Built with{' '}
                  <span className="text-white font-semibold">Next.js</span>
                  {' & '}
                  <span className="text-white font-semibold">Tailwind CSS</span>
                  {' · '}Data from{' '}
                  <a
                    href="https://pokeapi.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    PokéAPI
                  </a>
                </p>
                <p className="text-slate-500">{new Date().getFullYear()} © All rights reserved</p>
              </div>
            </footer>

          </div>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
