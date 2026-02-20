import { TYPE_COLORS } from '@/app/lib/pokemon';
import type { PokemonDetail } from '@/app/types/pokemon';

interface Props {
  abilities: PokemonDetail['abilities'];
  primaryType: string;
}

export default function AbilityList({ abilities, primaryType }: Props) {
  const typeColor = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-7">
      <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
        Abilities
      </h2>

      <div className="space-y-3">
        {abilities.map((a, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-2xl px-5 py-4 ${typeColor.light}`}
          >
            <span className={`capitalize font-bold text-sm ${typeColor.text}`}>
              {a.ability.name.replace('-', ' ')}
            </span>

            {a.is_hidden && (
              <span className="text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Hidden
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
