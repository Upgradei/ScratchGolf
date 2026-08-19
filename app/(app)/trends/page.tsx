import Link from "next/link";
import { db } from "@/lib/db";
import { TrendChart } from "@/components/TrendChart";
import type { Drill } from "@/app/generated/prisma/client";

export const dynamic = "force-dynamic";

const SKILL_AREA_LABELS: Record<Drill["skillArea"], string> = {
  DRIVER: "Driver",
  APPROACH: "Approach",
  CHIPPING: "Chipping",
  PUTTING: "Putting",
};

export default async function TrendsPage() {
  const drills = await db.drill.findMany({
    orderBy: { name: "asc" },
    include: { scoreLogs: { orderBy: { loggedAt: "desc" } } },
  });

  // Only chart drills that have been logged — otherwise the expanded library
  // produces a wall of empty charts.
  const logged = drills.filter((d) => d.scoreLogs.length > 0);

  const bySkillArea = new Map<Drill["skillArea"], typeof logged>();
  for (const drill of logged) {
    const group = bySkillArea.get(drill.skillArea) ?? [];
    group.push(drill);
    bySkillArea.set(drill.skillArea, group);
  }

  return (
    <main className="flex flex-1 flex-col gap-8 px-4 py-6">
      <h1 className="font-display text-2xl font-semibold text-fairway-800">
        Trends
      </h1>
      {logged.length === 0 && (
        <p className="text-ink-500">
          Log a few drill scores and your trends will show up here.
        </p>
      )}
      {(Object.keys(SKILL_AREA_LABELS) as Drill["skillArea"][]).map((area) => {
        const groupDrills = bySkillArea.get(area);
        if (!groupDrills?.length) return null;
        return (
          <section key={area} className="flex flex-col gap-4">
            <h2 className="section-accent font-display text-xl font-semibold text-fairway-800">
              {SKILL_AREA_LABELS[area]}
            </h2>
            {groupDrills.map((drill) => (
              <div
                key={drill.id}
                className="flex flex-col gap-2 rounded-lg border border-sand-200 bg-white p-4"
              >
                <Link
                  href={`/drills/${drill.id}`}
                  className="font-medium text-sand-900"
                >
                  {drill.name}
                </Link>
                <TrendChart scores={drill.scoreLogs} />
              </div>
            ))}
          </section>
        );
      })}
    </main>
  );
}
