"use client";

import Link from "next/link";
import { useState } from "react";
import { AREA_META, AREA_ORDER, toAreaId, type AreaId } from "@/components/skillMeta";

export function SkillAreaPicker({
  counts,
  weakestArea,
}: {
  counts: Record<AreaId, number>;
  weakestArea?: string | null;
}) {
  const watching = weakestArea ? toAreaId(weakestArea) : "putting";
  // Which area the caddie is looking at. Defaults to the area to sharpen next.
  const [gaze, setGaze] = useState<AreaId>(watching);

  // Left column looks left, right column looks right; top row up a touch.
  const col = AREA_ORDER.indexOf(gaze) % 2; // 0 = left, 1 = right
  const row = Math.floor(AREA_ORDER.indexOf(gaze) / 2);
  const dx = col === 0 ? -4 : 4;
  const dy = row === 0 ? -2 : 1;

  return (
    <section className="rounded-[var(--card-radius)] border border-sand-200 bg-white px-4 pb-4 pt-[18px] shadow-[0_10px_30px_rgba(37,79,47,0.06)]">
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-[radial-gradient(120%_120%_at_50%_20%,var(--color-fairway-600),var(--color-fairway-800))] shadow-[inset_0_-6px_14px_rgba(0,0,0,0.22),0_6px_16px_rgba(37,79,47,0.28)]">
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <ellipse cx="32" cy="34" rx="19" ry="20" fill="#f4e3c8" />
            <path d="M13 30c0-12 9-19 19-19s19 7 19 19" fill="#254f2f" />
            <rect x="12" y="27" width="40" height="7" rx="3.5" fill="#254f2f" />
            <circle cx={26 + dx} cy={34 + dy} r="3.1" fill="#2a2a24" />
            <circle cx={40 + dx} cy={34 + dy} r="3.1" fill="#2a2a24" />
            <path d="M27 44c2 2.4 8 2.4 10 0" stroke="#b98a5e" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-center text-[12.5px] font-medium text-ink-500">
          <span className="font-semibold text-fairway-700">Your caddie</span> is
          watching your {AREA_META[watching].label.toLowerCase()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {AREA_ORDER.map((area) => {
          const meta = AREA_META[area];
          const hot = area === gaze;
          return (
            <Link
              key={area}
              href={`/drills#${area}`}
              onMouseEnter={() => setGaze(area)}
              onFocus={() => setGaze(area)}
              onTouchStart={() => setGaze(area)}
              className={`flex items-center gap-2.5 rounded-2xl border px-3 py-3 text-left transition-all active:scale-[0.97] ${
                hot
                  ? "-translate-y-0.5 border-fairway-500 bg-white shadow-[0_8px_20px_rgba(37,79,47,0.16)]"
                  : "border-sand-200 bg-sand-50"
              }`}
            >
              <span
                className={`grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[11px] ${
                  hot ? "bg-gold-500 text-[#2a2306]" : "bg-fairway-700 text-sand-50"
                }`}
              >
                {meta.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-fairway-900">
                  {meta.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-ink-500">
                  {counts[area]} drills
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
