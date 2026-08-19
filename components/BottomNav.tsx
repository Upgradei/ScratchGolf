"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Plan" },
  { href: "/drills", label: "Drills" },
  { href: "/trends", label: "Trends" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex border-t border-sand-200 bg-sand-50 pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex min-h-14 flex-1 items-center justify-center text-sm font-medium ${
              active ? "text-fairway-700" : "text-sand-500"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
