export async function regeneratePlan(): Promise<{ error?: string }> {
  const res = await fetch("/api/plan/regenerate", { method: "POST" });
  if (res.ok) return {};
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return { error: data.error ?? "Something went wrong" };
}
