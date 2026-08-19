import Link from "next/link";
import type { Drill } from "@/app/generated/prisma/client";

const SKILL_AREA_LABELS: Record<Drill["skillArea"], string> = {
  DRIVER: "Driver",
  APPROACH: "Approach",
  CHIPPING: "Chipping",
  PUTTING: "Putting",
};

const DIFFICULTY_LABELS: Record<Drill["difficultyLevel"], string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const DIFFICULTY_ORDER: Drill["difficultyLevel"][] = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
];

function groupBy<T, K extends string>(items: T[], key: (item: T) => K) {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const group = groups.get(key(item)) ?? [];
    group.push(item);
    groups.set(key(item), group);
  }
  return groups;
}

export function DrillList({ drills }: { drills: Drill[] }) {
  const bySkillArea = groupBy(drills, (d) => d.skillArea);

  return (
    <div className="flex flex-col gap-8">
      {(Object.keys(SKILL_AREA_LABELS) as Drill["skillArea"][]).map((area) => {
        const groupDrills = bySkillArea.get(area);
        if (!groupDrills?.length) return null;
        const byDifficulty = groupBy(groupDrills, (d) => d.difficultyLevel);

        return (
          <section key={area} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{SKILL_AREA_LABELS[area]}</h2>
            {DIFFICULTY_ORDER.map((tier) => {
              const tierDrills = byDifficulty.get(tier);
              if (!tierDrills?.length) return null;
              return (
                <div key={tier}>
                  <h3 className="mb-2 text-sm font-medium text-neutral-500">
                    {DIFFICULTY_LABELS[tier]}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tierDrills.map((drill) => (
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
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
