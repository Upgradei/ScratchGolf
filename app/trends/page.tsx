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

  const bySkillArea = new Map<Drill["skillArea"], typeof drills>();
  for (const drill of drills) {
    const group = bySkillArea.get(drill.skillArea) ?? [];
    group.push(drill);
    bySkillArea.set(drill.skillArea, group);
  }

  return (
    <main className="flex flex-1 flex-col gap-8 px-4 py-6">
      <h1 className="text-2xl font-semibold">Trends</h1>
      {(Object.keys(SKILL_AREA_LABELS) as Drill["skillArea"][]).map((area) => {
        const groupDrills = bySkillArea.get(area);
        if (!groupDrills?.length) return null;
        return (
          <section key={area} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">
              {SKILL_AREA_LABELS[area]}
            </h2>
            {groupDrills.map((drill) => (
              <div
                key={drill.id}
                className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-4"
              >
                <Link href={`/drills/${drill.id}`} className="font-medium">
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
