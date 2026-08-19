"use client";

import Link from "next/link";
import { useState } from "react";

type SkillArea = "driver" | "approach" | "chipping" | "putting";

const AREAS: {
  id: SkillArea;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "driver",
    label: "Driver",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M5 19 17 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 5c1.5-1.5 4-1.5 4 1s-2.5 4.5-4 4.5c-1 0-1.5-.5-1.5-1.5S14 6.5 15 5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "approach",
    label: "Approach",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M6 21c3-6 9-6 12-12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 3.2"
        />
        <path
          d="M18 4v6l4-3-4-3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="21" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "chipping",
    label: "Chipping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M4 20c4-1 8-8 12-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M2 20h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "putting",
    label: "Putting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <ellipse cx="12" cy="20" rx="8" ry="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 20V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 5l6 2.5L12 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="20" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
];

export function SkillAreaPicker() {
  const [active, setActive] = useState<number | null>(null);

  // Pupils shift left-to-right based on which panel (0..3) is active.
  const lookX = active === null ? 0 : ((active - 1.5) / 1.5) * 3.5;

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-fairway-800 px-4 py-6">
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
        <circle cx="32" cy="34" r="20" fill="#f4e3c8" />
        <path d="M12 30a20 20 0 0 1 40 0c-6-4-34-4-40 0Z" fill="#254f2f" />
        <g style={{ transition: "transform 200ms ease" }}>
          <circle
            cx={24 + lookX}
            cy={34}
            r="2.4"
            fill="#1c2b20"
            style={{ transition: "transform 200ms ease" }}
          />
          <circle
            cx={40 + lookX}
            cy={34}
            r="2.4"
            fill="#1c2b20"
            style={{ transition: "transform 200ms ease" }}
          />
        </g>
        <path
          d="M25 44q7 5 14 0"
          stroke="#1c2b20"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="grid w-full grid-cols-2 gap-2">
        {AREAS.map((area, i) => (
          <Link
            key={area.id}
            href={`/drills#${area.id}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onTouchStart={() => setActive(i)}
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg bg-fairway-700 py-2 text-fairway-50 transition-colors hover:bg-fairway-600"
          >
            {area.icon}
            <span className="text-xs font-medium">{area.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
