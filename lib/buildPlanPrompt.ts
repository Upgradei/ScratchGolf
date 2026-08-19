export type PromptDrill = {
  id: string;
  name: string;
  skillArea: string;
  difficultyLevel: string;
  scoreLabel: string;
  benchmarkNote: string | null;
};

export type PromptScoreLog = {
  drillId: string;
  drillName: string;
  value: number;
  loggedAt: Date;
};

export function buildPlanPrompt(
  drills: PromptDrill[],
  recentScores: PromptScoreLog[],
): { system: string; user: string } {
  const system =
    "You are a world-class golf coach helping a solo player become a " +
    "scratch golfer as efficiently as possible. You write a short, " +
    "specific weekly training plan based on their recent drill scores. " +
    "Each drill has a difficulty tier (BEGINNER/INTERMEDIATE/ADVANCED) and " +
    "a benchmark of what a scratch golfer typically scores. Reason like a " +
    "real coach: compare the player's scores against the benchmark, not " +
    "just against their own past scores. Where a player is consistently " +
    "at or near the benchmark for a drill, prescribe the next difficulty " +
    "tier in that skill area instead of repeating the same drill. Where " +
    "they're well below benchmark, prescribe more reps of that drill or an " +
    "easier drill in the same skill area to rebuild the fundamental before " +
    "progressing. Be concrete and encouraging, not generic.";

  const drillList = drills
    .map(
      (d) =>
        `- id: ${d.id} | ${d.name} (${d.skillArea}, ${d.difficultyLevel}) — scored as: ${d.scoreLabel}` +
        (d.benchmarkNote ? ` — benchmark: ${d.benchmarkNote}` : ""),
    )
    .join("\n");

  const scoreHistory =
    recentScores.length === 0
      ? "No scores have been logged yet."
      : recentScores
          .map(
            (s) =>
              `- ${s.drillName}: ${s.value} (${s.loggedAt.toISOString().slice(0, 10)})`,
          )
          .join("\n");

  const user = `Here is the drill library, with each drill's difficulty tier and scratch-golfer benchmark:\n${drillList}\n\nHere are the player's recent scores, most recent first:\n${scoreHistory}\n\nWrite this week's training plan: a short summary (1-3 sentences) explaining the focus for the week, and a list of focus items. Each focus item must reference a real drillId from the drill library above, a targetReps (a sensible number of reps/attempts for the week, typically 10-50), and a focusNote (one sentence on why this drill was chosen, referencing the benchmark comparison or tier progression where relevant). Prioritize drills where scores are weak relative to benchmark, trending down, or haven't been practiced recently, and progress players to the next difficulty tier once they're consistently near benchmark. If there's no score history yet, build a balanced starter plan using BEGINNER drills across all four skill areas.`;

  return { system, user };
}
