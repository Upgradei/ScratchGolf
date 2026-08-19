"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopBar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between bg-fairway-700 px-5 pt-[env(safe-area-inset-top)] text-sand-50">
      <div className="flex items-center gap-2.5 py-3">
        <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-gold-500 shadow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21V6" stroke="#2a2306" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M12 6l7 2.6L12 11.4" stroke="#2a2306" strokeWidth="2.2" strokeLinejoin="round" />
            <circle cx="6.5" cy="21" r="1.6" fill="#2a2306" />
          </svg>
        </span>
        <span className="font-display text-lg font-semibold tracking-[0.2px]">
          ScratchGolf
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="min-h-11 rounded-lg px-3 text-sm font-medium text-sand-50/80 disabled:opacity-50"
      >
        {loggingOut ? "..." : "Log out"}
      </button>
    </header>
  );
}
