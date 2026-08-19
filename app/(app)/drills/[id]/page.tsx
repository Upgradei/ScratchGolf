import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ScoreLogForm } from "@/components/ScoreLogForm";
import { TrendChart } from "@/components/TrendChart";
import { CoachRead } from "@/components/CoachRead";
import { CoachingNotes } from "@/components/CoachingNotes";
import { AREA_META, toAreaId } from "@/components/skillMeta";

export const dynamic = "force-dynamic";

export default async function DrillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drill = await db.drill.findUnique({ where: { id } });

  if (!drill) {
    notFound();
  }

  const allScores = await db.scoreLog.findMany({
    where: { drillId: id },
    orderBy: { loggedAt: "desc" },
  });
  const recentScores = allScores.slice(0, 10);
  const meta = AREA_META[toAreaId(drill.skillArea)];
  const benchmarks = Array.isArray(drill.benchmarks)
    ? (drill.benchmarks as number[])
    : null;

  return (
    <main className="flex flex-1 flex-col gap-5 px-[18px] py-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.tagClass}`}
          >
            {meta.label}
          </span>
          <span className="rounded-full bg-fairway-100 px-2 py-0.5 text-xs font-medium text-fairway-700">
            {drill.difficultyLevel}
          </span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-fairway-800">
          {drill.name}
        </h1>
        <p className="text-ink-500">{drill.description}</p>
      </div>

      <CoachRead
        values={allScores.map((s) => s.value)}
        benchmarks={benchmarks}
        higherIsBetter={drill.higherIsBetter}
      />

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-fairway-800">
          How to run it
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
          {drill.instructions}
        </p>
        <p className="text-sm text-ink-500">Scored as: {drill.scoreLabel}</p>
      </section>

      {drill.coaching && (
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-lg font-semibold text-fairway-800">
            Technique
          </h2>
          <CoachingNotes text={drill.coaching} />
        </section>
      )}

      <section className="flex flex-col gap-2.5 rounded-[var(--card-radius)] border border-sand-200 bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-fairway-800">
          Log a score
        </h2>
        <ScoreLogForm drillId={drill.id} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-fairway-800">
          Trend
        </h2>
        <TrendChart scores={allScores} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-fairway-800">
          Recent scores
        </h2>
        {recentScores.length === 0 ? (
          <p className="text-ink-500">No scores logged yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {recentScores.map((score) => (
              <li
                key={score.id}
                className="flex items-center justify-between rounded-lg border border-sand-200 bg-white px-4 py-2"
              >
                <span className="font-medium text-sand-900">{score.value}</span>
                <span className="text-sm text-ink-500">
                  {score.loggedAt.toLocaleDateString()}
                  {score.note ? ` — ${score.note}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
