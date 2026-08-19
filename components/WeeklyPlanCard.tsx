import Link from "next/link";
import { AREA_META, toAreaId } from "@/components/skillMeta";

export type PlanDrill = {
  drillId: string;
  name: string;
  skillArea: string;
  targetReps: number;
  focusNote: string;
  done: boolean;
};

export function WeeklyPlanCard({
  summary,
  levelLabel,
  drills,
}: {
  summary: string;
  levelLabel: string | null;
  drills: PlanDrill[];
}) {
  const doneCount = drills.filter((d) => d.done).length;
  const total = drills.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <section className="overflow-hidden rounded-[var(--card-radius)] border border-sand-200 bg-white shadow-[0_10px_30px_rgba(37,79,47,0.06)]">
      <div className="flex items-center justify-between px-[18px] pb-3 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-fairway-700 text-gold-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 21V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 4l9 3-9 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <div className="font-display text-base font-semibold leading-none text-fairway-800">
              This week&apos;s focus
            </div>
            <div className="mt-[3px] text-[11.5px] text-ink-500">
              {levelLabel ? `Built for your ${levelLabel} level` : "Tuned to your recent scores"}
            </div>
          </div>
        </div>
        {total > 0 && (
          <span className="rounded-full border border-sand-200 bg-sand-100 px-2.5 py-1 text-[11px] font-semibold text-fairway-700">
            {doneCount} / {total}
          </span>
        )}
      </div>

      {summary && (
        <p className="px-[18px] pb-1 text-[13px] leading-relaxed text-ink-700">
          {summary}
        </p>
      )}

      {total > 0 && (
        <div className="px-[18px] pb-1.5 pt-2">
          <div className="h-[7px] overflow-hidden rounded-full bg-sand-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fairway-500 to-gold-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-[7px] flex justify-between text-[11px] font-medium text-ink-500">
            <span>{doneCount} logged this week</span>
            <span>{pct}%</span>
          </div>
        </div>
      )}

      <ul>
        {drills.map((d, i) => {
          const meta = AREA_META[toAreaId(d.skillArea)];
          return (
            <li key={`${d.drillId}-${i}`}>
              <Link
                href={`/drills/${d.drillId}`}
                className="flex min-h-[62px] items-center gap-3 border-t border-sand-100 px-[18px] py-3.5 active:bg-sand-50"
              >
                <span
                  className={`grid h-[26px] w-[26px] flex-shrink-0 place-items-center rounded-lg text-xs font-bold ${
                    d.done
                      ? "bg-fairway-600 text-white"
                      : "bg-sand-100 text-fairway-700"
                  }`}
                >
                  {d.done ? "✓" : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[14.5px] font-semibold leading-tight ${
                      d.done
                        ? "text-ink-500 line-through decoration-sand-300"
                        : "text-fairway-900"
                    }`}
                  >
                    {d.name}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-[11.5px] text-ink-500">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.tagClass}`}
                    >
                      {meta.label}
                    </span>
                    {d.done ? "Logged this week" : `Target: ${d.targetReps} reps`}
                  </span>
                  {!d.done && d.focusNote && (
                    <span className="mt-1 block text-[11.5px] leading-snug text-ink-500">
                      {d.focusNote}
                    </span>
                  )}
                </span>
                {!d.done && (
                  <span className="flex-shrink-0 text-sand-300" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
