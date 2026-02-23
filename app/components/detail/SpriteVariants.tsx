'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PokemonDetail } from '@/app/types/pokemon';

interface Props {
  pokemon: PokemonDetail;
}

type SpriteType = 'front_default' | 'front_shiny' | 'back_default' | 'back_shiny';

export default function SpriteVariants({ pokemon }: Props) {
  const [selectedType, setSelectedType] = useState<SpriteType>('front_default');

  if (!pokemon.sprites) {
    return null;
  }

  const sprites = {
    Front: {
      Default: pokemon.sprites.front_default,
      Shiny: pokemon.sprites.front_shiny,
    },
    Back: {
      Default: pokemon.sprites.back_default,
      Shiny: pokemon.sprites.back_shiny,
    },
  };

  const currentSprite = pokemon.sprites[selectedType];

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-6">
        Sprite Variants
      </h2>

      {/* Main Display */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-8 mb-6 flex items-center justify-center min-h-48">
        {currentSprite ? (
          <Image
            src={currentSprite}
            alt={`${pokemon.name} ${selectedType}`}
            width={192}
            height={192}
            className="image-rendering-pixelated"
          />
        ) : (
          <div className="text-slate-500 dark:text-slate-400">No sprite available</div>
        )}
      </div>

      {/* Sprite Grid */}
      <div className="space-y-4">
        {Object.entries(sprites).map(([direction, variants]) => (
          <div key={direction}>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">
              {direction}
            </p>
            <div className="flex gap-3">
              {Object.entries(variants).map(([variant, url]) => (
                <button
                  key={`${direction}-${variant}`}
                  onClick={() => {
                    const typeKey = `${direction.toLowerCase()}_${variant.toLowerCase()}` as SpriteType;
                    setSelectedType(typeKey);
                  }}
                  className={`cursor-pointer flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedType === `${direction.toLowerCase()}_${variant.toLowerCase()}`
                      ? 'border-blue-600 bg-blue-100 dark:bg-blue-900'
                      : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:border-blue-400'
                  } ${!url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!url}
                >
                  {url ? (
                    <div className="space-y-2">
                      <Image
                        src={url}
                        alt={`${pokemon.name} ${direction} ${variant}`}
                        width={96}
                        height={96}
                        className="mx-auto"
                      />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {variant}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center">N/A</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
