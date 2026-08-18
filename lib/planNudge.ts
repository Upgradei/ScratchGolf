const DAYS_THRESHOLD = 7;
const NEW_SCORES_THRESHOLD = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function shouldNudgeRegeneration({
  lastPlanGeneratedAt,
  newScoreLogCount,
  now,
}: {
  lastPlanGeneratedAt: Date | null;
  newScoreLogCount: number;
  now: Date;
}): boolean {
  if (!lastPlanGeneratedAt) return true;

  const daysSincePlan =
    (now.getTime() - lastPlanGeneratedAt.getTime()) / MS_PER_DAY;

  return daysSincePlan >= DAYS_THRESHOLD || newScoreLogCount >= NEW_SCORES_THRESHOLD;
}
