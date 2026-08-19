import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ScoreLogForm } from "@/components/ScoreLogForm";
import { TrendChart } from "@/components/TrendChart";

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

  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-fairway-800">
            {drill.name}
          </h1>
          <span className="rounded-full bg-fairway-100 px-2 py-0.5 text-xs font-medium text-fairway-700">
            {drill.difficultyLevel}
          </span>
        </div>
        <p className="text-sand-600">{drill.description}</p>
        <p className="whitespace-pre-wrap text-sand-800">
          {drill.instructions}
        </p>
        <p className="text-sm text-sand-500">Scored as: {drill.scoreLabel}</p>
        {drill.benchmarkNote && (
          <p className="rounded-lg bg-gold-100 px-3 py-2 text-sm text-gold-700">
            {drill.benchmarkNote}
          </p>
        )}
      </div>

      <ScoreLogForm drillId={drill.id} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-fairway-800">Trend</h2>
        <TrendChart scores={allScores} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-fairway-800">
          Recent scores
        </h2>
        {recentScores.length === 0 ? (
          <p className="text-sand-500">No scores logged yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {recentScores.map((score) => (
              <li
                key={score.id}
                className="flex items-center justify-between rounded-lg border border-sand-200 bg-white px-4 py-2"
              >
                <span className="font-medium text-sand-900">
                  {score.value}
                </span>
                <span className="text-sm text-sand-500">
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
