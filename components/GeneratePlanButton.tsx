"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regeneratePlan } from "@/lib/regeneratePlan";

export function GeneratePlanButton({
  label = "Generate my first plan",
  variant = "primary",
}: {
  label?: string;
  variant?: "primary" | "link";
}) {
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

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="min-h-11 text-[13px] font-semibold text-fairway-500 disabled:opacity-50"
      >
        {pending ? "Working..." : label}
        {error && <span className="ml-2 text-red-600">{error}</span>}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="min-h-12 rounded-lg bg-fairway-600 px-6 font-medium text-white disabled:opacity-50"
      >
        {pending ? "Generating..." : label}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
