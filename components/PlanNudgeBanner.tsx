"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regeneratePlan } from "@/lib/regeneratePlan";

export function PlanNudgeBanner() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegenerate() {
    setPending(true);
    setError(null);
    const result = await regeneratePlan();
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-amber-50 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-amber-900">
          It&apos;s a good time to refresh your training plan.
        </p>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={pending}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {pending ? "Generating..." : "Regenerate"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
