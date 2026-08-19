import { rankScore, recentAverage, overallLevel, type Tier } from "./rank";

export type RankableDrill = {
  skillArea: string;
  higherIsBetter: boolean;
  benchmarks: number[] | null;
  /** This drill's scores, newest first. */
  valuesNewestFirst: number[];
};

/**
 * The tier index a drill is currently performing at (0 = Beginner ... 5 =
 * Tour). Below the Beginner threshold counts as 0 for aggregation — you're on
 * the bottom rung, working up. null when the drill can't be ranked yet
 * (no benchmarks or no scores).
 */
export function drillTierIndex(d: RankableDrill): number | null {
  if (!d.benchmarks) return null;
  const avg = recentAverage(d.valuesNewestFirst);
  if (avg === null) return null;
  const rank = rankScore(avg, d.benchmarks, d.higherIsBetter);
  return rank.tier ? rank.tier.index : 0;
}

export type Standing = {
  /** Overall level across every ranked drill, or null with no data. */
  overall: { tier: Tier; average: number } | null;
  /** SkillArea with the lowest average tier — where the strokes are hiding. */
  weakestArea: string | null;
  /** How many drills contributed a rank. */
  rankedDrillCount: number;
};

/** Roll per-drill ranks into one overall standing for the hero header. */
export function overallStanding(drills: RankableDrill[]): Standing {
  const indices: number[] = [];
  const areaIndices = new Map<string, number[]>();

  for (const d of drills) {
    const ti = drillTierIndex(d);
    if (ti === null) continue;
    indices.push(ti);
    const list = areaIndices.get(d.skillArea) ?? [];
    list.push(ti);
    areaIndices.set(d.skillArea, list);
  }

  let weakest: { area: string; avg: number } | null = null;
  for (const [area, list] of areaIndices) {
    const avg = list.reduce((a, b) => a + b, 0) / list.length;
    if (!weakest || avg < weakest.avg) weakest = { area, avg };
  }

  return {
    overall: overallLevel(indices),
    weakestArea: weakest?.area ?? null,
    rankedDrillCount: indices.length,
  };
}
