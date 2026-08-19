import {
  rankScore,
  recentAverage,
  improvementPhrase,
  TIERS,
} from "@/lib/rank";

// The headline coaching feedback: given the player's recent form on a drill,
// name the level they're playing at and exactly what it takes to level up.
export function CoachRead({
  values,
  benchmarks,
  higherIsBetter,
}: {
  values: number[]; // newest first
  benchmarks: number[] | null;
  higherIsBetter: boolean;
}) {
  if (!benchmarks) return null;

  const avg = recentAverage(values);
  if (avg === null) {
    return (
      <div className="rounded-[var(--card-radius)] border border-sand-200 bg-white p-4 shadow-[0_10px_30px_rgba(37,79,47,0.06)]">
        <p className="text-sm text-ink-500">
          Log a score to see what level you&apos;re playing at and how close you
          are to the next tier.
        </p>
      </div>
    );
  }

  const rank = rankScore(avg, benchmarks, higherIsBetter);
  const tierLabel = rank.tier ? rank.tier.label : "Beginner";
  const tierHcp = rank.tier ? rank.tier.hcp : "building the basics";
  const phrase = improvementPhrase(rank);

  return (
    <div className="rounded-[var(--card-radius)] border border-sand-200 bg-white p-4 shadow-[0_10px_30px_rgba(37,79,47,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        Coach&apos;s read · recent avg {avg.toFixed(1)}
      </p>
      <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-fairway-800">
        You&apos;re playing like a {tierLabel}
        <span className="text-ink-500"> ({tierHcp})</span>
      </p>
      <p className="mt-1 text-sm text-fairway-600">
        {rank.atCeiling
          ? "Tour level — you've maxed this drill. Keep it sharp."
          : phrase
            ? `${phrase[0].toUpperCase()}${phrase.slice(1)}.`
            : "Keep logging to track your progress."}
      </p>

      {/* Tier ladder */}
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-sand-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fairway-500 to-gold-500"
            style={{ width: `${rank.progressPct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[9px] font-semibold uppercase tracking-tight text-ink-500">
          {TIERS.map((t) => (
            <span
              key={t.index}
              className={
                rank.tier && t.index === rank.tier.index
                  ? "text-fairway-700"
                  : ""
              }
            >
              {t.label.split(" ")[0].split("-")[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
