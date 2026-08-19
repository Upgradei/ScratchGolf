import { describe, it, expect } from "vitest";
import { buildPlanPrompt, type PromptDrill } from "./buildPlanPrompt";

const drills: PromptDrill[] = [
  {
    id: "d1",
    name: "Fairway Finder",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    scoreLabel: "fairways hit / 10",
    benchmarkNote: "Scratch golfers hit 6-7 of 10 fairways.",
    coaching: "Feel: commit to one shape every time.",
    higherIsBetter: true,
    benchmarks: [2, 3, 4, 6, 7, 9],
  },
  {
    id: "d2",
    name: "Gate Drill",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    scoreLabel: "putts through gate / 10",
    benchmarkNote: null,
    coaching: "Feel: rock the stroke from the shoulders.",
    higherIsBetter: true,
    benchmarks: [5, 6, 7, 8, 9, 10],
  },
];

describe("buildPlanPrompt", () => {
  it("lists every drill's id, name, difficulty tier, and score label in the user prompt", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("d1");
    expect(user).toContain("Fairway Finder");
    expect(user).toContain("BEGINNER");
    expect(user).toContain("fairways hit / 10");
    expect(user).toContain("d2");
    expect(user).toContain("Gate Drill");
  });

  it("includes each drill's technique coaching in the drill list", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("commit to one shape");
    expect(user).toContain("rock the stroke from the shoulders");
  });

  it("tells the model to build a balanced starter plan when there is no score history", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("No scores have been logged yet.");
    expect(user.toLowerCase()).toContain("balanced starter plan");
  });

  it("includes recent score values and dates when history exists", () => {
    const { user } = buildPlanPrompt(drills, [
      { drillId: "d1", drillName: "Fairway Finder", value: 7, loggedAt: new Date("2026-08-10") },
    ]);
    expect(user).toContain("Fairway Finder: 7");
    expect(user).toContain("2026-08-10");
  });

  it("computes and includes the player's current tier rank for practiced drills", () => {
    const { user } = buildPlanPrompt(drills, [
      { drillId: "d1", drillName: "Fairway Finder", value: 4, loggedAt: new Date("2026-08-10") },
    ]);
    // recent avg 4 → Bogey golfer, 2 more to reach Single-digit
    expect(user).toContain("Bogey golfer");
    expect(user).toContain("Single-digit");
  });

  it("notes when no drills have enough scores to rank yet", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("No drills have enough scores to rank yet.");
  });

  it("instructs the model to reference real drillIds and give a targetReps and focusNote", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("drillId");
    expect(user).toContain("targetReps");
    expect(user).toContain("focusNote");
  });

  it("sets a system prompt establishing the coaching role and tier-based reasoning", () => {
    const { system } = buildPlanPrompt(drills, []);
    expect(system.toLowerCase()).toContain("golf");
    expect(system.toLowerCase()).toContain("coach");
    expect(system.toLowerCase()).toContain("tier");
  });
});
