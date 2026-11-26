import type { Lang } from "./types";
export async function callAI(action: "enhance" | "skills" | "score" | "match" | "translate", payload: unknown, lang: Lang) {
  const res = await fetch("/api/ai", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload, lang }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return data.result;
}
