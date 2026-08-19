"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function ScoreLogForm({ drillId }: { drillId: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        drillId,
        value: Number(value),
        note: note || undefined,
      }),
    });

    if (res.ok) {
      setValue("");
      setNote("");
      router.refresh();
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Something went wrong");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="number"
        inputMode="decimal"
        step="any"
        required
        placeholder="Score"
        aria-label="Score"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-12 rounded-lg border border-sand-300 px-4 text-lg text-sand-900 placeholder:text-sand-400"
      />
      <input
        type="text"
        placeholder="Note (optional)"
        aria-label="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-12 rounded-lg border border-sand-300 px-4 text-sand-900 placeholder:text-sand-400"
      />
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="min-h-12 rounded-lg bg-fairway-600 font-medium text-white disabled:opacity-50"
      >
        {submitting ? "Logging..." : "Log score"}
      </button>
    </form>
  );
}
