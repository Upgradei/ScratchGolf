import { db } from "@/lib/db";
import { DrillList } from "@/components/DrillList";

export const dynamic = "force-dynamic";

export default async function DrillsPage() {
  const drills = await db.drill.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="flex flex-1 flex-col gap-4 px-4 py-6">
      <h1 className="text-2xl font-semibold">Drills</h1>
      {drills.length === 0 ? (
        <p className="text-neutral-500">No drills yet.</p>
      ) : (
        <DrillList drills={drills} />
      )}
    </main>
  );
}
