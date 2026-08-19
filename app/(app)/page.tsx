import Link from "next/link";
import { db } from "@/lib/db";
import { parsePlanItems } from "@/lib/weeklyPlan";
import { shouldNudgeRegeneration } from "@/lib/planNudge";
import { WeeklyPlanCard } from "@/components/WeeklyPlanCard";
import { PlanNudgeBanner } from "@/components/PlanNudgeBanner";
import { GeneratePlanButton } from "@/components/GeneratePlanButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const latestPlan = await db.weeklyPlan.findFirst({
      orderBy: { generatedAt: "desc" },
    });

    if (!latestPlan) {
      return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-xl font-semibold text-fairway-800">
            No plan yet
          </h1>
          <p className="max-w-xs text-sand-600">
            Browse the drills, log a few scores, then generate your first
            weekly plan.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/drills"
              className="flex min-h-12 items-center rounded-lg border border-sand-300 px-6 font-medium text-sand-700"
            >
              Browse drills
            </Link>
            <GeneratePlanButton />
          </div>
        </main>
      );
    }

    const items = parsePlanItems(latestPlan.items);
    const drills = await db.drill.findMany({
      where: { id: { in: items.map((item) => item.drillId) } },
    });
    const drillNames = new Map(drills.map((d) => [d.id, d.name]));

    const newScoreLogCount = await db.scoreLog.count({
      where: { loggedAt: { gt: latestPlan.generatedAt } },
    });
    const showNudge = shouldNudgeRegeneration({
      lastPlanGeneratedAt: latestPlan.generatedAt,
      newScoreLogCount,
      now: new Date(),
    });

    return (
      <main className="flex flex-1 flex-col gap-4 px-4 py-6">
        <h1 className="text-xl font-semibold text-fairway-800">
          This week&apos;s plan
        </h1>
        {showNudge && <PlanNudgeBanner />}
        <WeeklyPlanCard
          summary={latestPlan.summary}
          generatedAt={latestPlan.generatedAt}
          items={items}
          drillNames={drillNames}
        />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="text-xl font-semibold text-fairway-800">
          Couldn&apos;t load your plan
        </h1>
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      </main>
    );
  }
}
