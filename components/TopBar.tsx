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
    <header className="flex items-center justify-between border-b border-sand-200 bg-sand-50 px-4 py-3">
      <span className="text-lg font-semibold text-fairway-800">ScratchGolf</span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="min-h-11 rounded-lg px-3 text-sm text-sand-600 disabled:opacity-50"
      >
        {loggingOut ? "..." : "Log out"}
      </button>
    </header>
  );
}
