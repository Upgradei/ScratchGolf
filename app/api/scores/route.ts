import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    drillId?: string;
    value?: number;
    note?: string;
  };

  if (!body.drillId || typeof body.value !== "number" || Number.isNaN(body.value)) {
    return NextResponse.json(
      { error: "drillId and a numeric value are required" },
      { status: 400 },
    );
  }

  const drill = await db.drill.findUnique({ where: { id: body.drillId } });
  if (!drill) {
    return NextResponse.json({ error: "Drill not found" }, { status: 404 });
  }

  const scoreLog = await db.scoreLog.create({
    data: {
      drillId: body.drillId,
      value: body.value,
      note: body.note || null,
    },
  });

  return NextResponse.json({ scoreLog }, { status: 201 });
}
