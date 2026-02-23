'use client';

import { useState } from 'react';
import type { PokemonDetail } from '@/app/types/pokemon';

interface Props {
  pokemon: PokemonDetail;
}

interface Move {
  name: string;
  learnMethod: string;
  levelLearned: number;
}

interface MovesByMethod {
  levelUp: Move[];
  tm: Move[];
  tutor: Move[];
  egg: Move[];
}

function parseMoves(pokemonMoves: Array<{
  move: { name: string };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: { name: string };
  }>;
}> = []): MovesByMethod {
  const moves: Move[] = pokemonMoves.map((moveData) => {
    const versionDetails = (moveData.version_group_details || [])[0];
    const moveInfo = moveData.move;
    return {
      name: moveInfo?.name || '',
      learnMethod: (versionDetails?.move_learn_method?.name) || 'unknown',
      levelLearned: (versionDetails?.level_learned_at) || 0,
    };
  });

  return {
    levelUp: moves.filter((m: Move) => m.learnMethod === 'level-up').sort((a: Move, b: Move) => a.levelLearned - b.levelLearned),
    tm: moves.filter((m: Move) => m.learnMethod === 'machine'),
    tutor: moves.filter((m: Move) => m.learnMethod === 'tutor'),
    egg: moves.filter((m: Move) => m.learnMethod === 'egg'),
  };
}

export default function Moveset({ pokemon }: Props) {
  const [activeTab, setActiveTab] = useState<'levelUp' | 'tm' | 'tutor' | 'egg'>('levelUp');
  
  const movesByMethod = parseMoves(pokemon.moves || []);
  const moves = movesByMethod[activeTab] || [];

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-6">
        Moveset
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['levelUp', 'tm', 'tutor', 'egg'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {tab === 'levelUp' && `Level Up (${movesByMethod.levelUp.length})`}
            {tab === 'tm' && `TM/HM (${movesByMethod.tm.length})`}
            {tab === 'tutor' && `Tutor (${movesByMethod.tutor.length})`}
            {tab === 'egg' && `Egg (${movesByMethod.egg.length})`}
          </button>
        ))}
      </div>

      {/* Moves List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {moves.length > 0 ? (
          moves.map((move: Move) => (
            <div
              key={`${move.name}-${move.levelLearned}`}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                {move.name.replace(/-/g, ' ')}
              </span>
              {activeTab === 'levelUp' && move.levelLearned > 0 && (
                <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">
                  Lvl {move.levelLearned}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No moves found
          </div>
        )}
      </div>
    </div>
  );
}
