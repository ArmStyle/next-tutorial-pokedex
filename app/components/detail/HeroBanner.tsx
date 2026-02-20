import Image from 'next/image';
import { TYPE_COLORS } from '@/app/lib/pokemon';
import type { PokemonDetail } from '@/app/types/pokemon';

interface Props {
  pokemon: PokemonDetail;
}

export default function HeroBanner({ pokemon }: Props) {
  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;
  const artworkUrl = pokemon.sprites?.other?.['official-artwork']?.front_default;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

      {/* Coloured banner */}
      <div className={`${typeColor.bg} relative h-48 sm:h-56 overflow-hidden`}>
        {/* Pokéball watermark ring */}
        <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full border-32 border-white/10 pointer-events-none" />
        <div className="absolute -right-8 -top-8 w-64 h-64 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10" />
        </div>

        {/* ID badge */}
        <span className="absolute top-5 left-7 text-white/60 font-black text-base tracking-widest">
          #{String(pokemon.id).padStart(4, '0')}
        </span>

        {/* Artwork overflowing below banner */}
        {artworkUrl && (
          <div className="absolute bottom-0 right-8 sm:right-16">
            <Image
              src={artworkUrl}
              alt={pokemon.name}
              width={220}
              height={220}
              className="w-44 h-44 sm:w-56 sm:h-56 object-contain drop-shadow-2xl translate-y-8"
              priority
            />
          </div>
        )}
      </div>

      {/* Name, types, height/weight */}
      <div className="pt-6 pb-8 px-7 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">

          {/* Name + type badges */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-black capitalize text-slate-900 dark:text-slate-50 tracking-tight leading-none">
              {pokemon.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {pokemon.types.map((t, i) => {
                const c = TYPE_COLORS[t.type.name] ?? TYPE_COLORS.normal;
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

          {/* Height / Weight chips */}
          <div className="flex gap-3 shrink-0">
            <MeasurementChip label="Height" value={`${(pokemon.height / 10).toFixed(1)}`} unit="m" />
            <MeasurementChip label="Weight" value={`${(pokemon.weight / 10).toFixed(1)}`} unit="kg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MeasurementChip({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center bg-slate-100 dark:bg-slate-700 rounded-2xl px-5 py-3">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-xl font-black text-slate-800 dark:text-slate-100">
        {value}
        <span className="text-sm font-semibold ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
