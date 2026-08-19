import { describe, it, expect } from "vitest";
import { buildPlanPrompt } from "./buildPlanPrompt";

const drills = [
  {
    id: "d1",
    name: "Fairway Finder",
    skillArea: "DRIVER",
    difficultyLevel: "BEGINNER",
    scoreLabel: "fairways hit / 10",
    benchmarkNote: "Scratch golfers hit 6-7 of 10 fairways.",
  },
  {
    id: "d2",
    name: "Gate Drill",
    skillArea: "PUTTING",
    difficultyLevel: "BEGINNER",
    scoreLabel: "putts through gate / 10",
    benchmarkNote: null,
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

  it("includes a drill's benchmark note when present", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("Scratch golfers hit 6-7 of 10 fairways.");
  });

  it("omits a benchmark segment for drills with no benchmark note", () => {
    const { user } = buildPlanPrompt([drills[1]], []);
    const gateLine = user.split("\n").find((line) => line.includes("Gate Drill"));
    expect(gateLine).toBeDefined();
    expect(gateLine).not.toContain("benchmark:");
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

  it("instructs the model to reference real drillIds and give a targetReps and focusNote", () => {
    const { user } = buildPlanPrompt(drills, []);
    expect(user).toContain("drillId");
    expect(user).toContain("targetReps");
    expect(user).toContain("focusNote");
  });

  it("sets a system prompt establishing the coaching role and benchmark-based reasoning", () => {
    const { system } = buildPlanPrompt(drills, []);
    expect(system.toLowerCase()).toContain("golf");
    expect(system.toLowerCase()).toContain("coach");
    expect(system.toLowerCase()).toContain("benchmark");
    expect(system.toLowerCase()).toContain("tier");
  });
});
