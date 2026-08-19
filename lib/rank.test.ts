import { describe, it, expect } from "vitest";
import {
  rankScore,
  ladderProgress,
  improvementPhrase,
  recentAverage,
  overallLevel,
  TIERS,
} from "./rank";

// A "higher is better" ladder: fairways hit out of 10.
const HIGHER = [2, 3, 4, 6, 7, 9];
// A "lower is better" ladder: average putts per hole (fewer is better).
const LOWER = [2.4, 2.2, 2.0, 1.9, 1.8, 1.7];

describe("rankScore (higher is better)", () => {
  it("ranks a value below Tier 0 as no tier yet, chasing Beginner", () => {
    const r = rankScore(1, HIGHER, true);
    expect(r.tier).toBeNull();
    expect(r.nextTier?.label).toBe("Beginner");
    expect(r.toNext).toBe(1); // needs 1 more to reach the 2 threshold
    expect(r.atCeiling).toBe(false);
  });

  it("ranks a mid value at the correct tier with the gap to the next", () => {
    const r = rankScore(4, HIGHER, true); // clears Bogey (4), not Single-digit (6)
    expect(r.tier?.label).toBe("Bogey golfer");
    expect(r.nextTier?.label).toBe("Single-digit");
    expect(r.toNext).toBe(2); // 6 - 4
  });

  it("caps at the ceiling once the Tour threshold is cleared", () => {
    const r = rankScore(10, HIGHER, true);
    expect(r.tier?.label).toBe("Tour");
    expect(r.nextTier).toBeNull();
    expect(r.toNext).toBeNull();
    expect(r.atCeiling).toBe(true);
    expect(r.progressPct).toBe(100);
  });

  it("lands exactly on a threshold at that tier (>= is inclusive)", () => {
    const r = rankScore(6, HIGHER, true);
    expect(r.tier?.label).toBe("Single-digit");
  });
});

describe("rankScore (lower is better)", () => {
  it("treats a high (bad) value as below Tier 0", () => {
    const r = rankScore(2.6, LOWER, false);
    expect(r.tier).toBeNull();
    expect(r.nextTier?.label).toBe("Beginner");
  });

  it("ranks a good (low) value and computes the gap downward", () => {
    const r = rankScore(2.0, LOWER, false); // clears Bogey (2.0), not Single-digit (1.9)
    expect(r.tier?.label).toBe("Bogey golfer");
    expect(r.nextTier?.label).toBe("Single-digit");
    expect(r.toNext).toBeCloseTo(0.1); // 2.0 - 1.9
  });

  it("caps at the ceiling for an excellent low value", () => {
    const r = rankScore(1.6, LOWER, false);
    expect(r.atCeiling).toBe(true);
    expect(r.tier?.label).toBe("Tour");
  });
});

describe("rankScore validation", () => {
  it("rejects a ladder without exactly 6 thresholds", () => {
    expect(() => rankScore(5, [1, 2, 3], true)).toThrow();
  });
});

describe("ladderProgress", () => {
  it("clamps to 0 below Tier 0 and 100 at the ceiling", () => {
    expect(ladderProgress(0, HIGHER, true)).toBe(0);
    expect(ladderProgress(9, HIGHER, true)).toBe(100);
  });

  it("interpolates halfway between two thresholds", () => {
    // Tier 2 (4) to Tier 3 (6); value 5 is halfway → (2 + 0.5)/5 = 50%
    expect(ladderProgress(5, HIGHER, true)).toBe(50);
  });
});

describe("improvementPhrase", () => {
  it("says 'more' for higher-is-better drills", () => {
    const r = rankScore(4, HIGHER, true);
    expect(improvementPhrase(r)).toBe("2 more to reach Single-digit");
  });

  it("says 'fewer' for lower-is-better drills", () => {
    const r = rankScore(2.0, LOWER, false);
    expect(improvementPhrase(r)).toBe("0.1 fewer to reach Single-digit");
  });

  it("returns null at the ceiling", () => {
    expect(improvementPhrase(rankScore(10, HIGHER, true))).toBeNull();
  });
});

describe("recentAverage", () => {
  it("returns null with no scores", () => {
    expect(recentAverage([])).toBeNull();
  });

  it("averages the most recent n (newest first)", () => {
    expect(recentAverage([6, 4, 2, 100], 3)).toBe(4); // (6+4+2)/3
  });

  it("uses all values when fewer than n exist", () => {
    expect(recentAverage([8, 6])).toBe(7);
  });
});

describe("overallLevel", () => {
  it("returns null with no ranked drills", () => {
    expect(overallLevel([])).toBeNull();
  });

  it("rounds the average tier index to the nearest named tier", () => {
    const result = overallLevel([2, 2, 3]); // avg 2.33 → round to 2
    expect(result?.tier.label).toBe("Bogey golfer");
    expect(result?.average).toBeCloseTo(2.33, 1);
  });

  it("never indexes out of the tier array", () => {
    expect(overallLevel([5, 5, 5])?.tier).toBe(TIERS[5]);
    expect(overallLevel([0, 0])?.tier).toBe(TIERS[0]);
  });
});
