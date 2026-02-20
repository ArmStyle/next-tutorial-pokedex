import { STAT_LABELS, getStatBarColor } from '@/app/lib/pokemon';
import type { PokemonDetail } from '@/app/types/pokemon';

interface Props {
  stats: PokemonDetail['stats'];
}

const MAX_STAT = 180;

export default function StatsList({ stats }: Props) {
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Base Stats
        </h2>
        <span className="text-xs font-extrabold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
          Total {total}
        </span>
      </div>

      {/* Stat rows */}
      <div className="space-y-3.5">
        {stats.map((stat, i) => {
          const pct = Math.min((stat.base_stat / MAX_STAT) * 100, 100);
          const label = STAT_LABELS[stat.stat.name] ?? stat.stat.name;
          return (
            <div key={i} className="flex items-center gap-3">
              {/* Label */}
              <span className="w-14 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wide shrink-0">
                {label}
              </span>
              {/* Value */}
              <span className="w-9 text-right text-sm font-black text-slate-700 dark:text-slate-200 shrink-0 tabular-nums">
                {stat.base_stat}
              </span>
              {/* Bar */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getStatBarColor(stat.base_stat)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
