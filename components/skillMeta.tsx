import type { ReactNode } from "react";

export type AreaId = "driver" | "approach" | "chipping" | "putting";

// Line icons drawn with currentColor so they inherit the surrounding text
// color (green on cards, gold when "hot", etc.).
function DriverIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]">
      <path d="M4 20c9-2 13-8 16-17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 3h3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}

function ApproachIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]">
      <path d="M3 21c4-9 10-13 18-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 5l6 1-1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]">
      <path d="M4 18c3-6 7-9 12-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="8" r="2" fill="currentColor" />
      <path d="M5 21h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PuttIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]">
      <path d="M9 20V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 5l7 2.5L9 10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="9" cy="20" rx="6" ry="1.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export const AREA_META: Record<
  AreaId,
  { label: string; icon: ReactNode; tagClass: string }
> = {
  driver: {
    label: "Driver",
    icon: <DriverIcon />,
    tagClass: "bg-[#e4eee2] text-[#2c6a3a]",
  },
  approach: {
    label: "Approach",
    icon: <ApproachIcon />,
    tagClass: "bg-[#eae6d3] text-[#8a6d1a]",
  },
  chipping: {
    label: "Chipping",
    icon: <ChipIcon />,
    tagClass: "bg-[#e6ede9] text-[#316b56]",
  },
  putting: {
    label: "Putting",
    icon: <PuttIcon />,
    tagClass: "bg-[#f3e6bd] text-[#8a6d1a]",
  },
};

export const AREA_ORDER: AreaId[] = ["driver", "approach", "chipping", "putting"];

/** Map a DB SkillArea enum ("DRIVER") to our lowercase AreaId. */
export function toAreaId(skillArea: string): AreaId {
  return skillArea.toLowerCase() as AreaId;
}
