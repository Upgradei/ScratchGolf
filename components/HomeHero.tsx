import { AREA_META, toAreaId } from "@/components/skillMeta";

export type HeroStanding = {
  levelLabel: string | null;
  loggedThisWeek: number;
  weakestArea: string | null;
};

// Continues the green from the TopBar into a greeting + honest stat strip
// built from the player's real standing. Full-bleed, square bottom — the
// content cards below lift over it on cream.
export function HomeHero({ standing }: { standing: HeroStanding }) {
  const eyebrow = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const focus = standing.weakestArea
    ? AREA_META[toAreaId(standing.weakestArea)].label
    : "All areas";

  return (
    <header className="relative bg-gradient-to-b from-fairway-700 to-fairway-800 px-5 pb-8 pt-6 text-sand-50">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[1.4px] text-gold-100/85">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 font-display text-[27px] font-semibold leading-tight text-white">
          Let&apos;s chase that
          <br />
          scratch handicap, Nader.
        </h1>
      </div>

      <div className="relative z-10 mt-5 flex gap-2.5">
        <Stat
          value={standing.levelLabel ?? "New"}
          label={standing.levelLabel ? "Your level" : "Log a drill to rank"}
          small
        />
        <Stat value={String(standing.loggedThisWeek)} label="Logged this week" />
        <Stat value={focus} label="Sharpen next" small />
      </div>
    </header>
  );
}

function Stat({
  value,
  label,
  small,
}: {
  value: string;
  label: string;
  small?: boolean;
}) {
  return (
    <div className="flex-1 rounded-[15px] border border-white/12 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <div
        className={`font-display font-semibold leading-none text-white ${
          small ? "text-base" : "text-xl"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium text-white/75">{label}</div>
    </div>
  );
}
