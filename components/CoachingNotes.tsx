// Splits a coaching string ("Feel: ... Checkpoint: ... Common fault: ...
// Fix: ...") into labeled segments and renders them as a technique breakdown.

const LABELS = ["Feel", "Checkpoint", "Common fault", "Fix"] as const;

function parseCoaching(text: string): { label: string; body: string }[] {
  const pattern = new RegExp(`(${LABELS.join("|")}):`, "g");
  const segments: { label: string; body: string }[] = [];
  const matches = [...text.matchAll(pattern)];

  if (matches.length === 0) {
    return [{ label: "Technique", body: text.trim() }];
  }

  matches.forEach((m, i) => {
    const start = m.index! + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    segments.push({ label: m[1], body: text.slice(start, end).trim() });
  });
  return segments;
}

export function CoachingNotes({ text }: { text: string }) {
  const segments = parseCoaching(text);
  return (
    <dl className="flex flex-col gap-2.5">
      {segments.map((seg) => (
        <div
          key={seg.label}
          className="rounded-xl border border-sand-200 bg-white px-3.5 py-3"
        >
          <dt className="text-[11px] font-bold uppercase tracking-wide text-fairway-600">
            {seg.label}
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink-700">
            {seg.body}
          </dd>
        </div>
      ))}
    </dl>
  );
}
