import Link from 'next/link';
import Image from 'next/image';
import type { Pokemon } from '@/app/types/pokemon';

interface Props {
  pokemon: Pokemon;
}

const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export default function PokemonCard({ pokemon: p }: Props) {
  return (
    <Link href={`/pokemon/${p.name}`} className="group">
      <div className="
        bg-white dark:bg-slate-800
        rounded-2xl border-2 border-gray-100 dark:border-slate-700
        shadow-md hover:shadow-xl
        hover:border-blue-300 dark:hover:border-blue-500
        hover:scale-105
        transition-all duration-300
        overflow-hidden h-full
      ">
        {/* Artwork */}
        <div className="bg-slate-100 dark:bg-slate-700 h-44 flex items-center justify-center">
          <Image
            src={`${ARTWORK_BASE}/${p.id}.png`}
            alt={p.name}
            width={130}
            height={130}
            className="h-36 w-36 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-1">
            #{String(p.id).padStart(3, '0')}
          </p>
          <h2 className="text-base font-bold capitalize text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {p.name}
          </h2>
        </div>
      </div>
    </Link>
  );
}
