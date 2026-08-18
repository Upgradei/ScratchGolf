import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { db } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { buildPlanPrompt } from "@/lib/buildPlanPrompt";
import { GeneratedPlanSchema } from "@/lib/weeklyPlan";

// Claude's response can take longer than Vercel's default 10s function
// limit, especially with adaptive thinking - allow up to the platform max.
export const maxDuration = 60;

export async function POST() {
  const drills = await db.drill.findMany();
  const recentScoreLogs = await db.scoreLog.findMany({
    orderBy: { loggedAt: "desc" },
    take: 50,
    include: { drill: true },
  });

  const { system, user } = buildPlanPrompt(
    drills.map((d) => ({
      id: d.id,
      name: d.name,
      skillArea: d.skillArea,
      scoreLabel: d.scoreLabel,
    })),
    recentScoreLogs.map((s) => ({
      drillId: s.drillId,
      drillName: s.drill.name,
      value: s.value,
      loggedAt: s.loggedAt,
    })),
  );

  let response;
  try {
    response = await anthropic.messages.parse({
      model: "claude-opus-5",
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
      output_config: {
        effort: "medium",
        format: zodOutputFormat(GeneratedPlanSchema),
      },
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Anthropic API key is missing or invalid" },
        { status: 502 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited by Anthropic API, try again shortly" },
        { status: 502 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic API error: ${error.message}` },
        { status: 502 },
      );
    }
    throw error;
  }

  const parsed = response.parsed_output;
  if (!parsed) {
    return NextResponse.json(
      { error: "Failed to generate a valid plan" },
      { status: 502 },
    );
  }

  const validDrillIds = new Set(drills.map((d) => d.id));
  const invalidItem = parsed.items.find((item) => !validDrillIds.has(item.drillId));
  if (invalidItem) {
    return NextResponse.json(
      { error: "Generated plan referenced an unknown drill" },
      { status: 502 },
    );
  }

  const weeklyPlan = await db.weeklyPlan.create({
    data: {
      summary: parsed.summary,
      items: parsed.items,
    },
  });

  return NextResponse.json({ weeklyPlan }, { status: 201 });
}
