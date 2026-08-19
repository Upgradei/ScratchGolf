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
    <div className="flex flex-col gap-4 rounded-lg border border-sand-200 bg-white p-4">
      <div>
        <p className="text-sm text-sand-500">
          Plan from {generatedAt.toLocaleDateString()}
        </p>
        <p className="mt-1 text-sand-800">{summary}</p>
      </div>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={`${item.drillId}-${i}`}>
              <Link
                href={`/drills/${item.drillId}`}
                className="block rounded-lg bg-fairway-50 px-4 py-3"
              >
                <span className="font-medium text-fairway-800">
                  {drillNames.get(item.drillId) ?? "Drill"}
                </span>
                <p className="text-sm text-sand-600">
                  {item.targetReps} reps — {item.focusNote}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
