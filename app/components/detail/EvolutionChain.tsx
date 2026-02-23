'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EvolutionNode, EvolutionDetail } from '@/app/store/slices/evolutionChainSlice';

interface Props {
  chain: EvolutionNode | null;
  currentPokemonName: string;
}

const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

function getPokemonIdFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).pop());
}

function getEvolutionDescription(details: EvolutionDetail[]): string {
  if (!details || details.length === 0) return 'Starting form';

  const detail = details[0];

  if (detail.min_level) {
    return `Level ${detail.min_level}`;
  }
  if (detail.item?.name) {
    return `Use ${detail.item.name}`;
  }
  if (detail.trade_species?.name) {
    return `Trade for ${detail.trade_species.name}`;
  }
  if (detail.known_move?.name) {
    return `Know move: ${detail.known_move.name}`;
  }
  if (detail.min_happiness) {
    return `Happiness: ${detail.min_happiness}`;
  }
  if (detail.min_beauty) {
    return `Beauty: ${detail.min_beauty}`;
  }
  if (detail.location?.name) {
    return `At ${detail.location.name}`;
  }
  if (detail.time_of_day) {
    return `During ${detail.time_of_day}`;
  }

  return 'Evolution';
}

function EvolutionNodeComponent({
  node,
  currentPokemonName,
  isFirst = false,
}: {
  node: EvolutionNode;
  currentPokemonName: string;
  isFirst?: boolean;
}) {
  const pokemonId = getPokemonIdFromUrl(node.url);
  const isCurrent = node.name === currentPokemonName.toLowerCase();

  return (
    <div className="flex flex-col items-center">
      <Link
        href={`/pokemon/${node.name}`}
        className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
          isCurrent
            ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <Image
            src={`${ARTWORK_BASE}/${pokemonId}.png`}
            alt={node.name}
            width={96}
            height={96}
            className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow"
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
            #{String(pokemonId).padStart(3, '0')}
          </p>
          <p className="text-sm font-bold capitalize text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {node.name}
          </p>
        </div>
      </Link>

      {/* Evolution conditions */}
      {!isFirst && node.evolutionDetails.length > 0 && (
        <div className="mt-2 text-xs text-center font-semibold text-slate-600 dark:text-slate-400 px-2">
          {getEvolutionDescription(node.evolutionDetails)}
        </div>
      )}

      {/* Arrow and next evolutions */}
      {node.evolvesTo.length > 0 && (
        <>
          {/* Arrow down */}
          <div className="mt-4 text-2xl text-slate-400 dark:text-slate-600">↓</div>

          {/* Multiple branches */}
          {node.evolvesTo.length > 1 ? (
            <div className="flex gap-8 mt-4 flex-wrap justify-center">
              {node.evolvesTo.map((nextNode, idx) => (
                <EvolutionNodeComponent
                  key={idx}
                  node={nextNode}
                  currentPokemonName={currentPokemonName}
                  isFirst={false}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EvolutionNodeComponent
                node={node.evolvesTo[0]}
                currentPokemonName={currentPokemonName}
                isFirst={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EvolutionChain({ chain, currentPokemonName }: Props) {
  if (!chain) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400">
        No evolution chain available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-8">
        Evolution Chain
      </h2>

      {/* Evolution Tree */}
      <div className="flex justify-center overflow-x-auto py-4">
        <EvolutionNodeComponent
          node={chain}
          currentPokemonName={currentPokemonName}
          isFirst={true}
        />
      </div>
    </div>
  );
}
