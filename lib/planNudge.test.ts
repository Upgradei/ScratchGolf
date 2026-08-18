import { describe, it, expect } from "vitest";
import { shouldNudgeRegeneration } from "./planNudge";

const NOW = new Date("2026-08-18T12:00:00Z");

describe("shouldNudgeRegeneration", () => {
  it("nudges when no plan has ever been generated", () => {
    expect(
      shouldNudgeRegeneration({ lastPlanGeneratedAt: null, newScoreLogCount: 0, now: NOW }),
    ).toBe(true);
  });

  it("does not nudge when the plan is recent and few scores were logged", () => {
    const generatedAt = new Date("2026-08-16T12:00:00Z"); // 2 days ago
    expect(
      shouldNudgeRegeneration({
        lastPlanGeneratedAt: generatedAt,
        newScoreLogCount: 3,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("nudges once 7 or more days have passed since the last plan", () => {
    const generatedAt = new Date("2026-08-11T12:00:00Z"); // exactly 7 days ago
    expect(
      shouldNudgeRegeneration({
        lastPlanGeneratedAt: generatedAt,
        newScoreLogCount: 0,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("does not nudge at 6 days and 23 hours since the last plan", () => {
    const generatedAt = new Date("2026-08-11T13:00:00Z"); // just under 7 days
    expect(
      shouldNudgeRegeneration({
        lastPlanGeneratedAt: generatedAt,
        newScoreLogCount: 0,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("nudges once 10 or more new scores have been logged since the last plan", () => {
    const generatedAt = new Date("2026-08-18T00:00:00Z"); // today
    expect(
      shouldNudgeRegeneration({
        lastPlanGeneratedAt: generatedAt,
        newScoreLogCount: 10,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("does not nudge at 9 new scores logged since the last plan", () => {
    const generatedAt = new Date("2026-08-18T00:00:00Z");
    expect(
      shouldNudgeRegeneration({
        lastPlanGeneratedAt: generatedAt,
        newScoreLogCount: 9,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("nudges when both thresholds are crossed", () => {
    const generatedAt = new Date("2026-08-01T00:00:00Z");
    expect(
      shouldNudgeRegeneration({
        lastPlanGeneratedAt: generatedAt,
        newScoreLogCount: 20,
        now: NOW,
      }),
    ).toBe(true);
  });
});
