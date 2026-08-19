"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regeneratePlan } from "@/lib/regeneratePlan";

export function GeneratePlanButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
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
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="min-h-12 rounded-lg bg-fairway-600 px-6 font-medium text-white disabled:opacity-50"
      >
        {pending ? "Generating..." : "Generate my first plan"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
