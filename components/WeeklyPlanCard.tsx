import Link from "next/link";
import type { PlanItem } from "@/lib/weeklyPlan";

export function WeeklyPlanCard({
  summary,
  generatedAt,
  items,
  drillNames,
}: {
  summary: string;
  generatedAt: Date;
  items: PlanItem[];
  drillNames: Map<string, string>;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4">
      <div>
        <p className="text-sm text-neutral-500">
          Plan from {generatedAt.toLocaleDateString()}
        </p>
        <p className="mt-1">{summary}</p>
      </div>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li
              key={`${item.drillId}-${i}`}
              className="rounded-lg bg-neutral-50 px-4 py-3"
            >
              <Link href={`/drills/${item.drillId}`} className="font-medium">
                {drillNames.get(item.drillId) ?? "Drill"}
              </Link>
              <p className="text-sm text-neutral-600">
                {item.targetReps} reps — {item.focusNote}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
