import { describe, it, expect } from "vitest";
import { toTrendPoints } from "./trends";

describe("toTrendPoints", () => {
  it("returns an empty array for no scores", () => {
    expect(toTrendPoints([])).toEqual([]);
  });

  it("places a single score at the center of the chart", () => {
    const points = toTrendPoints([{ loggedAt: new Date("2026-01-01"), value: 7 }]);
    expect(points).toEqual([
      { x: 0.5, y: 0.5, value: 7, loggedAt: new Date("2026-01-01") },
    ]);
  });

  it("sorts scores chronologically regardless of input order", () => {
    const points = toTrendPoints([
      { loggedAt: new Date("2026-01-03"), value: 5 },
      { loggedAt: new Date("2026-01-01"), value: 3 },
      { loggedAt: new Date("2026-01-02"), value: 4 },
    ]);
    expect(points.map((p) => p.value)).toEqual([3, 4, 5]);
  });

  it("maps the earliest and latest scores to x=0 and x=1", () => {
    const points = toTrendPoints([
      { loggedAt: new Date("2026-01-01"), value: 3 },
      { loggedAt: new Date("2026-01-05"), value: 6 },
      { loggedAt: new Date("2026-01-10"), value: 9 },
    ]);
    expect(points[0].x).toBe(0);
    expect(points[points.length - 1].x).toBe(1);
  });

  it("maps the lowest and highest values to y=0 and y=1", () => {
    const points = toTrendPoints([
      { loggedAt: new Date("2026-01-01"), value: 2 },
      { loggedAt: new Date("2026-01-02"), value: 8 },
    ]);
    const values = points.map((p) => p.y);
    expect(Math.min(...values)).toBe(0);
    expect(Math.max(...values)).toBe(1);
  });

  it("gives every point y=0.5 when all values are identical", () => {
    const points = toTrendPoints([
      { loggedAt: new Date("2026-01-01"), value: 5 },
      { loggedAt: new Date("2026-01-02"), value: 5 },
    ]);
    expect(points.every((p) => p.y === 0.5)).toBe(true);
  });
});
