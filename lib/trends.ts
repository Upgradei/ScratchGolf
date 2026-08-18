export type TrendPoint = { loggedAt: Date; value: number };

/**
 * Normalizes score logs into chronological (x, y) points for charting,
 * where x is 0..1 (share of the time range) so charts don't need to deal
 * with real date math.
 */
export function toTrendPoints(
  scores: TrendPoint[],
): { x: number; y: number; value: number; loggedAt: Date }[] {
  const sorted = [...scores].sort(
    (a, b) => a.loggedAt.getTime() - b.loggedAt.getTime(),
  );

  if (sorted.length === 0) return [];
  if (sorted.length === 1) {
    return [{ x: 0.5, y: 0.5, value: sorted[0].value, loggedAt: sorted[0].loggedAt }];
  }

  const minTime = sorted[0].loggedAt.getTime();
  const maxTime = sorted[sorted.length - 1].loggedAt.getTime();
  const timeRange = maxTime - minTime || 1;

  const values = sorted.map((s) => s.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  return sorted.map((s) => ({
    x: (s.loggedAt.getTime() - minTime) / timeRange,
    y: valueRange === 0 ? 0.5 : (s.value - minValue) / valueRange,
    value: s.value,
    loggedAt: s.loggedAt,
  }));
}
