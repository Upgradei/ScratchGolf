export async function regeneratePlan(): Promise<{ error?: string }> {
  const res = await fetch("/api/plan/regenerate", { method: "POST" });
  if (res.ok) return {};
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  return { error: data?.error ?? `Request failed (${res.status})` };
}
