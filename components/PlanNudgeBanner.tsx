export function PlanNudgeBanner() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-amber-50 px-4 py-3">
      <p className="text-sm text-amber-900">
        It&apos;s a good time to refresh your training plan.
      </p>
      <button
        type="button"
        disabled
        title="Coming soon"
        className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white opacity-50"
      >
        Regenerate
      </button>
    </div>
  );
}
