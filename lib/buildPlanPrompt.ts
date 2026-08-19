import { rankScore, recentAverage, type Rank } from "./rank";

export type PromptDrill = {
  id: string;
  name: string;
  skillArea: string;
  difficultyLevel: string;
  scoreLabel: string;
  benchmarkNote: string | null;
  coaching: string | null;
  higherIsBetter: boolean;
  benchmarks: number[] | null;
};

export type PromptScoreLog = {
  drillId: string;
  drillName: string;
  value: number;
  loggedAt: Date;
};

function rankSummary(rank: Rank): string {
  const tier = rank.tier ? rank.tier.label : "below Beginner";
  if (rank.atCeiling) return `currently ${tier} (Tour level — maxed)`;
  if (rank.nextTier && rank.toNext !== null) {
    const dir = rank.higherIsBetter ? "more" : "fewer";
    return `currently ${tier}; ${rank.toNext} ${dir} to reach ${rank.nextTier.label}`;
  }
  return `currently ${tier}`;
}

export function buildPlanPrompt(
  drills: PromptDrill[],
  recentScores: PromptScoreLog[],
): { system: string; user: string } {
  const system =
    "You are a world-class golf coach with one student: a solo amateur " +
    "working to lower their handicap toward scratch and, one day, elite " +
    "play. You write a short, specific weekly training plan.\n\n" +
    "Coach like a real professional, not a stats dashboard:\n" +
    "- Each drill sits on a six-tier ladder (Beginner ~28 hcp, Developing " +
    "~20, Bogey golfer ~15, Single-digit ~8, Scratch 0, Tour). For drills " +
    "the player has logged, you're told which tier they're currently " +
    "performing at and exactly how much improvement reaches the next tier. " +
    "Speak to THAT: name the level they're playing like and the concrete " +
    "next step, never a generic 'scratch players do X'.\n" +
    "- Prescribe drills that build technique and feel (the how-to-hit-it " +
    "drills), not only outcome-counting tests. Use each drill's coaching " +
    "notes to justify why it fixes what's holding them back.\n" +
    "- Progress a player to the next difficulty tier in a skill area once " +
    "they're consistently at or near tier benchmark; when they're well " +
    "below, prescribe the fundamental/technique drill that rebuilds it " +
    "before advancing.\n" +
    "- Prioritize the weakest skill areas and the drills furthest from the " +
    "next tier — that's where strokes are hiding. Be concrete, specific, " +
    "and encouraging.";

  const drillList = drills
    .map((d) => {
      const parts = [
        `- id: ${d.id} | ${d.name} (${d.skillArea}, ${d.difficultyLevel}) — scored as: ${d.scoreLabel}`,
      ];
      if (d.coaching) parts.push(`    coaching: ${d.coaching}`);
      return parts.join("\n");
    })
    .join("\n");

  // Roll each drill's recent scores into a current-tier read so the model
  // coaches against the player's actual standing, not raw numbers.
  const scoresByDrill = new Map<string, number[]>();
  for (const s of recentScores) {
    const list = scoresByDrill.get(s.drillId) ?? [];
    list.push(s.value);
    scoresByDrill.set(s.drillId, list);
  }

  const rankLines: string[] = [];
  for (const drill of drills) {
    const values = scoresByDrill.get(drill.id);
    if (!values || !drill.benchmarks) continue;
    const avg = recentAverage(values);
    if (avg === null) continue;
    const rank = rankScore(avg, drill.benchmarks, drill.higherIsBetter);
    rankLines.push(
      `- ${drill.name}: recent avg ${avg.toFixed(1)} → ${rankSummary(rank)}`,
    );
  }
  const rankBlock =
    rankLines.length > 0
      ? rankLines.join("\n")
      : "No drills have enough scores to rank yet.";

  const scoreHistory =
    recentScores.length === 0
      ? "No scores have been logged yet."
      : recentScores
          .map(
            (s) =>
              `- ${s.drillName}: ${s.value} (${s.loggedAt.toISOString().slice(0, 10)})`,
          )
          .join("\n");

  const user = `Here is the drill library, with each drill's difficulty tier and technique coaching:\n${drillList}\n\nHere is where the player currently RANKS on the drills they've practiced (their tier and the gap to the next tier):\n${rankBlock}\n\nHere are their recent raw scores, most recent first:\n${scoreHistory}\n\nWrite this week's training plan: a short summary (1-3 sentences) naming the focus for the week and, where possible, the level they're playing at and what they're chasing. Then a list of focus items. Each focus item must reference a real drillId from the library, a targetReps (typically 10-50), and a focusNote (one sentence tying the drill to the player's current rank, the technique it builds, or a tier progression). Prioritize the skill areas and drills furthest from the next tier, or the technique drills that rebuild a weak fundamental. If there's no score history yet, build a balanced starter plan of BEGINNER technique drills across all four skill areas.`;

  return { system, user };
}
