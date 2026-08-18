export type PlanItem = {
  drillId: string;
  focusNote: string;
  targetReps: number;
};

export function parsePlanItems(items: unknown): PlanItem[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item): item is PlanItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as PlanItem).drillId === "string" &&
      typeof (item as PlanItem).focusNote === "string" &&
      typeof (item as PlanItem).targetReps === "number",
  );
}
