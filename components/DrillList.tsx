import Link from "next/link";
import type { Drill } from "@/app/generated/prisma/client";

const SKILL_AREA_LABELS: Record<Drill["skillArea"], string> = {
  DRIVER: "Driver",
  APPROACH: "Approach",
  CHIPPING: "Chipping",
  PUTTING: "Putting",
};

export function DrillList({ drills }: { drills: Drill[] }) {
  const bySkillArea = new Map<Drill["skillArea"], Drill[]>();
  for (const drill of drills) {
    const group = bySkillArea.get(drill.skillArea) ?? [];
    group.push(drill);
    bySkillArea.set(drill.skillArea, group);
  }

  return (
    <div className="flex flex-col gap-8">
      {(Object.keys(SKILL_AREA_LABELS) as Drill["skillArea"][]).map((area) => {
        const groupDrills = bySkillArea.get(area);
        if (!groupDrills?.length) return null;
        return (
          <section key={area}>
            <h2 className="mb-3 text-lg font-semibold">
              {SKILL_AREA_LABELS[area]}
            </h2>
            <ul className="flex flex-col gap-2">
              {groupDrills.map((drill) => (
                <li key={drill.id}>
                  <Link
                    href={`/drills/${drill.id}`}
                    className="block rounded-lg border border-neutral-200 px-4 py-3"
                  >
                    <p className="font-medium">{drill.name}</p>
                    <p className="text-sm text-neutral-500">
                      {drill.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
