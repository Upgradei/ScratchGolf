// Ranking engine — the coaching "brain" that turns a raw drill score into a
// read on where the player currently stands and what it takes to level up.
//
// Every drill carries a `benchmarks` ladder: six score thresholds, one per
// skill tier, ordered from Tier 0 (Beginner) to Tier 5 (Tour). For a
// "higher is better" drill (fairways hit /10) the thresholds ascend; for a
// "lower is better" drill (avg putts, dispersion in feet) they descend. The
// engine is direction-aware so the rest of the app never has to be.

export type Tier = {
  index: number;
  label: string;
  /** Rough on-course handicap this drill tier corresponds to. */
  hcp: string;
};

// Six tiers spanning a developing amateur up to tour level. The handicap
// labels are the bridge between "how did I do on this drill" and "what kind
// of golfer plays like this".
export const TIERS: Tier[] = [
  { index: 0, label: "Beginner", hcp: "28+ hcp" },
  { index: 1, label: "Developing", hcp: "~20 hcp" },
  { index: 2, label: "Bogey golfer", hcp: "~15 hcp" },
  { index: 3, label: "Single-digit", hcp: "~8 hcp" },
  { index: 4, label: "Scratch", hcp: "0 hcp" },
  { index: 5, label: "Tour", hcp: "PGA level" },
];

export const TIER_COUNT = TIERS.length;

export type Rank = {
  /** Highest tier the value clears, or null when below Tier 0's threshold. */
  tier: Tier | null;
  /** The tier being chased next, or null once at the ceiling. */
  nextTier: Tier | null;
  /** Score units still needed to reach nextTier (>= 0), or null at ceiling. */
  toNext: number | null;
  /** true once the value clears the Tour threshold. */
  atCeiling: boolean;
  /** Position along the whole ladder, 0-100, for a progress bar. */
  progressPct: number;
  /** true when scores get better as the number goes up. */
  higherIsBetter: boolean;
};

function meets(value: number, threshold: number, higherIsBetter: boolean): boolean {
  return higherIsBetter ? value >= threshold : value <= threshold;
}

/**
 * Rank a single value against a drill's six-threshold benchmark ladder.
 * `benchmarks[i]` is the score needed to reach TIERS[i].
 */
export function rankScore(
  value: number,
  benchmarks: number[],
  higherIsBetter: boolean,
): Rank {
  if (benchmarks.length !== TIER_COUNT) {
    throw new Error(
      `benchmarks must have exactly ${TIER_COUNT} thresholds, got ${benchmarks.length}`,
    );
  }

  // Highest tier index whose threshold the value clears (-1 = below Tier 0).
  let achieved = -1;
  for (let i = 0; i < TIER_COUNT; i++) {
    if (meets(value, benchmarks[i], higherIsBetter)) {
      achieved = i;
    }
  }

  const tier = achieved >= 0 ? TIERS[achieved] : null;
  const atCeiling = achieved === TIER_COUNT - 1;
  const nextTier = atCeiling ? null : TIERS[achieved + 1];

  let toNext: number | null = null;
  if (nextTier) {
    const target = benchmarks[nextTier.index];
    toNext = Math.max(0, higherIsBetter ? target - value : value - target);
  }

  return {
    tier,
    nextTier,
    toNext,
    atCeiling,
    progressPct: ladderProgress(value, benchmarks, higherIsBetter),
    higherIsBetter,
  };
}

/**
 * Where the value sits across the full ladder as a 0-100 percentage,
 * interpolating linearly between adjacent thresholds. Below Tier 0 clamps to
 * 0; at/above Tour clamps to 100. Used to fill a progress bar.
 */
export function ladderProgress(
  value: number,
  benchmarks: number[],
  higherIsBetter: boolean,
): number {
  const span = TIER_COUNT - 1; // segments between the 6 thresholds
  if (!meets(value, benchmarks[0], higherIsBetter)) return 0;
  if (meets(value, benchmarks[span], higherIsBetter)) return 100;

  for (let i = 0; i < span; i++) {
    const lo = benchmarks[i];
    const hi = benchmarks[i + 1];
    // value is between tier i and i+1 thresholds
    if (meets(value, lo, higherIsBetter) && !meets(value, hi, higherIsBetter)) {
      const frac = (value - lo) / (hi - lo); // direction cancels out in the ratio
      return Math.round(((i + frac) / span) * 100);
    }
  }
  return 0;
}

/**
 * Human phrase for the gap to the next tier, respecting drill direction.
 * e.g. "2 more to reach Single-digit" / "3 fewer to reach Scratch".
 */
export function improvementPhrase(rank: Rank): string | null {
  if (rank.atCeiling || !rank.nextTier || rank.toNext === null) return null;
  const amount = Number.isInteger(rank.toNext)
    ? String(rank.toNext)
    : rank.toNext.toFixed(1);
  const verb = rank.higherIsBetter ? "more" : "fewer";
  return `${amount} ${verb} to reach ${rank.nextTier.label}`;
}

/**
 * Average of the most recent `n` scores (newest-first array), for a stable
 * read of current form rather than reacting to a single lucky/unlucky rep.
 */
export function recentAverage(valuesNewestFirst: number[], n = 3): number | null {
  if (valuesNewestFirst.length === 0) return null;
  const slice = valuesNewestFirst.slice(0, n);
  return slice.reduce((sum, v) => sum + v, 0) / slice.length;
}

/**
 * Roll per-drill tier indices into one overall standing for the hero header.
 * Returns the nearest tier plus the raw average so the UI can show momentum.
 */
export function overallLevel(tierIndices: number[]): {
  tier: Tier;
  average: number;
} | null {
  if (tierIndices.length === 0) return null;
  const average =
    tierIndices.reduce((sum, i) => sum + i, 0) / tierIndices.length;
  const nearest = Math.min(TIER_COUNT - 1, Math.max(0, Math.round(average)));
  return { tier: TIERS[nearest], average };
}
