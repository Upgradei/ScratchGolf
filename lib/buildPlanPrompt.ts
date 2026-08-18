export type PromptDrill = {
  id: string;
  name: string;
  skillArea: string;
  scoreLabel: string;
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
    "You are a golf training coach helping a solo player become a scratch " +
    "golfer as efficiently as possible. You write a short, specific weekly " +
    "training plan based on their recent drill scores. Focus on their " +
    "weakest or most stagnant areas. Be concrete and encouraging, not generic.";

  const drillList = drills
    .map(
      (d) => `- id: ${d.id} | ${d.name} (${d.skillArea}) — scored as: ${d.scoreLabel}`,
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

  const user = `Here is the drill library:\n${drillList}\n\nHere are the player's recent scores, most recent first:\n${scoreHistory}\n\nWrite this week's training plan: a short summary (1-3 sentences) explaining the focus for the week, and a list of focus items. Each focus item must reference a real drillId from the drill library above, a targetReps (a sensible number of reps/attempts for the week, typically 10-50), and a focusNote (one sentence on why this drill was chosen). Prioritize drills where scores are weak, trending down, or haven't been practiced recently. If there's no score history yet, build a balanced starter plan across all four skill areas.`;

  return { system, user };
}
