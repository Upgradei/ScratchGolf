import Link from "next/link";
import { db } from "@/lib/db";
import { parsePlanItems } from "@/lib/weeklyPlan";
import { WeeklyPlanCard } from "@/components/WeeklyPlanCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestPlan = await db.weeklyPlan.findFirst({
    orderBy: { generatedAt: "desc" },
  });

  if (!latestPlan) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">ScratchGolf</h1>
        <p className="text-neutral-500">
          No training plan yet. Browse the drills, log a few scores, then
          generate your first weekly plan.
        </p>
        <Link
          href="/drills"
          className="rounded-lg bg-emerald-600 px-6 py-3 text-white"
        >
          Browse drills
        </Link>
      </main>
    );
  }

  const items = parsePlanItems(latestPlan.items);
  const drills = await db.drill.findMany({
    where: { id: { in: items.map((item) => item.drillId) } },
  });
  const drillNames = new Map(drills.map((d) => [d.id, d.name]));

  return (
    <main className="flex flex-1 flex-col gap-4 px-4 py-6">
      <h1 className="text-2xl font-semibold">This week&apos;s plan</h1>
      <WeeklyPlanCard
        summary={latestPlan.summary}
        generatedAt={latestPlan.generatedAt}
        items={items}
        drillNames={drillNames}
      />
    </main>
  );
}
