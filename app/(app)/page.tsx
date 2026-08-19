import Link from "next/link";
import { db } from "@/lib/db";
import { parsePlanItems } from "@/lib/weeklyPlan";
import { shouldNudgeRegeneration } from "@/lib/planNudge";
import { overallStanding, type RankableDrill } from "@/lib/standing";
import { HomeHero } from "@/components/HomeHero";
import { WeeklyPlanCard, type PlanDrill } from "@/components/WeeklyPlanCard";
import { PlanNudgeBanner } from "@/components/PlanNudgeBanner";
import { GeneratePlanButton } from "@/components/GeneratePlanButton";
import { SkillAreaPicker } from "@/components/SkillAreaPicker";
import { AREA_ORDER, toAreaId, type AreaId } from "@/components/skillMeta";

export const dynamic = "force-dynamic";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type HomeView = {
  levelLabel: string | null;
  loggedThisWeek: number;
  weakestArea: string | null;
  counts: Record<AreaId, number>;
  plan: {
    summary: string;
    drills: PlanDrill[];
    showNudge: boolean;
  } | null;
};

async function loadHomeView(): Promise<HomeView> {
  const now = new Date();

  const [drills, scoreLogs, latestPlan] = await Promise.all([
    db.drill.findMany(),
    db.scoreLog.findMany({ orderBy: { loggedAt: "desc" }, take: 400 }),
    db.weeklyPlan.findFirst({ orderBy: { generatedAt: "desc" } }),
  ]);

  // Group each drill's scores, newest first, for ranking.
  const scoresByDrill = new Map<string, number[]>();
  for (const s of scoreLogs) {
    const list = scoresByDrill.get(s.drillId) ?? [];
    list.push(s.value);
    scoresByDrill.set(s.drillId, list);
  }

  const rankable: RankableDrill[] = drills.map((d) => ({
    skillArea: d.skillArea,
    higherIsBetter: d.higherIsBetter,
    benchmarks: Array.isArray(d.benchmarks) ? (d.benchmarks as number[]) : null,
    valuesNewestFirst: scoresByDrill.get(d.id) ?? [],
  }));
  const standing = overallStanding(rankable);

  const loggedThisWeek = scoreLogs.filter(
    (s) => now.getTime() - s.loggedAt.getTime() <= WEEK_MS,
  ).length;

  const counts = AREA_ORDER.reduce(
    (acc, area) => {
      acc[area] = 0;
      return acc;
    },
    {} as Record<AreaId, number>,
  );
  for (const d of drills) counts[toAreaId(d.skillArea)]++;

  const levelLabel = standing.overall?.tier.label ?? null;

  let plan: HomeView["plan"] = null;
  if (latestPlan) {
    const items = parsePlanItems(latestPlan.items);
    const planDrills = await db.drill.findMany({
      where: { id: { in: items.map((item) => item.drillId) } },
    });
    const drillById = new Map(planDrills.map((d) => [d.id, d]));

    // A plan drill is "done" once it's been logged since the plan generated.
    const doneSincePlan = new Set(
      scoreLogs
        .filter((s) => s.loggedAt > latestPlan.generatedAt)
        .map((s) => s.drillId),
    );

    const planCardDrills: PlanDrill[] = items.map((item) => {
      const d = drillById.get(item.drillId);
      return {
        drillId: item.drillId,
        name: d?.name ?? "Drill",
        skillArea: d?.skillArea ?? "DRIVER",
        targetReps: item.targetReps,
        focusNote: item.focusNote,
        done: doneSincePlan.has(item.drillId),
      };
    });

    const newScoreLogCount = doneSincePlan.size;
    plan = {
      summary: latestPlan.summary,
      drills: planCardDrills,
      showNudge: shouldNudgeRegeneration({
        lastPlanGeneratedAt: latestPlan.generatedAt,
        newScoreLogCount,
        now,
      }),
    };
  }

  return {
    levelLabel,
    loggedThisWeek,
    weakestArea: standing.weakestArea,
    counts,
    plan,
  };
}

export default async function Home() {
  let view: HomeView;
  try {
    view = await loadHomeView();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="font-display text-xl font-semibold text-fairway-800">
          Couldn&apos;t load your plan
        </h1>
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      </main>
    );
  }

  const picker = (
    <>
      <div className="mb-3 mt-1 flex items-baseline justify-between px-0.5">
        <h2 className="section-accent font-display text-lg font-semibold text-fairway-800">
          Where to today?
        </h2>
        <Link href="/drills" className="text-[13px] font-semibold text-fairway-500">
          All drills
        </Link>
      </div>
      <SkillAreaPicker counts={view.counts} weakestArea={view.weakestArea} />
    </>
  );

  return (
    <main className="flex flex-1 flex-col">
      <HomeHero
        standing={{
          levelLabel: view.levelLabel,
          loggedThisWeek: view.loggedThisWeek,
          weakestArea: view.weakestArea,
        }}
      />
      <div className="flex flex-1 flex-col gap-5 px-[18px] pb-6 pt-5">
        {picker}

        {view.plan ? (
          <>
            <div className="flex items-baseline justify-between px-0.5">
              <h2 className="section-accent font-display text-lg font-semibold text-fairway-800">
                This week&apos;s plan
              </h2>
              <GeneratePlanButton label="Regenerate" variant="link" />
            </div>
            {view.plan.showNudge && <PlanNudgeBanner />}
            <WeeklyPlanCard
              summary={view.plan.summary}
              levelLabel={view.levelLabel}
              drills={view.plan.drills}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-[var(--card-radius)] border border-sand-200 bg-white px-6 py-8 text-center shadow-[0_10px_30px_rgba(37,79,47,0.06)]">
            <h2 className="font-display text-lg font-semibold text-fairway-800">
              No plan yet
            </h2>
            <p className="max-w-xs text-sm text-ink-500">
              Log a few drill scores, then generate your first coach-built weekly
              plan.
            </p>
            <GeneratePlanButton />
          </div>
        )}
      </div>
    </main>
  );
}
