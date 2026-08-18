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
        <h1 className="text-2xl font-semibold">{drill.name}</h1>
        <p className="text-neutral-600">{drill.description}</p>
        <p className="whitespace-pre-wrap">{drill.instructions}</p>
        <p className="text-sm text-neutral-500">Scored as: {drill.scoreLabel}</p>
      </div>

      <ScoreLogForm drillId={drill.id} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Trend</h2>
        <TrendChart scores={allScores} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Recent scores</h2>
        {recentScores.length === 0 ? (
          <p className="text-neutral-500">No scores logged yet.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {recentScores.map((score) => (
              <li
                key={score.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2"
              >
                <span className="font-medium">{score.value}</span>
                <span className="text-sm text-neutral-500">
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
