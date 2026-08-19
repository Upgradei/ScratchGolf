import { describe, it, expect } from "vitest";
import { drillTierIndex, overallStanding, type RankableDrill } from "./standing";

const HIGHER = [2, 3, 4, 6, 7, 9];

describe("drillTierIndex", () => {
  it("returns null without benchmarks", () => {
    expect(
      drillTierIndex({
        skillArea: "DRIVER",
        higherIsBetter: true,
        benchmarks: null,
        valuesNewestFirst: [5],
      }),
    ).toBeNull();
  });

  it("returns null without scores", () => {
    expect(
      drillTierIndex({
        skillArea: "DRIVER",
        higherIsBetter: true,
        benchmarks: HIGHER,
        valuesNewestFirst: [],
      }),
    ).toBeNull();
  });

  it("ranks the recent average to a tier index", () => {
    expect(
      drillTierIndex({
        skillArea: "DRIVER",
        higherIsBetter: true,
        benchmarks: HIGHER,
        valuesNewestFirst: [4, 4, 4],
      }),
    ).toBe(2); // Bogey golfer
  });

  it("floors a below-Beginner value to tier 0", () => {
    expect(
      drillTierIndex({
        skillArea: "DRIVER",
        higherIsBetter: true,
        benchmarks: HIGHER,
        valuesNewestFirst: [1],
      }),
    ).toBe(0);
  });
});

describe("overallStanding", () => {
  it("is empty with no rankable drills", () => {
    const s = overallStanding([
      { skillArea: "DRIVER", higherIsBetter: true, benchmarks: null, valuesNewestFirst: [] },
    ]);
    expect(s.overall).toBeNull();
    expect(s.weakestArea).toBeNull();
    expect(s.rankedDrillCount).toBe(0);
  });

  it("computes overall level, weakest area, and count", () => {
    const drills: RankableDrill[] = [
      { skillArea: "DRIVER", higherIsBetter: true, benchmarks: HIGHER, valuesNewestFirst: [7] }, // tier 4
      { skillArea: "PUTTING", higherIsBetter: true, benchmarks: HIGHER, valuesNewestFirst: [2] }, // tier 0
    ];
    const s = overallStanding(drills);
    expect(s.rankedDrillCount).toBe(2);
    expect(s.weakestArea).toBe("PUTTING");
    expect(s.overall?.average).toBe(2); // (4 + 0) / 2
  });
});
