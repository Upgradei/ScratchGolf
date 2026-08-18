import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DrillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drill = await db.drill.findUnique({ where: { id } });

  if (!drill) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-3 px-4 py-6">
      <h1 className="text-2xl font-semibold">{drill.name}</h1>
      <p className="text-neutral-600">{drill.description}</p>
      <p className="whitespace-pre-wrap">{drill.instructions}</p>
      <p className="text-sm text-neutral-500">Scored as: {drill.scoreLabel}</p>
    </main>
  );
}
