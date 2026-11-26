import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const hits = new Map<string, { n: number; t: number }>();
const LIMIT = 20;
const WINDOW = 10 * 60 * 1000;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > WINDOW) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n++;
  return h.n > LIMIT;
}

function buildPrompt(action: string, payload: any, lang: string) {
  const L = lang === "en" ? "English" : "Arabic";
  if (action === "enhance") {
    const text = String(payload?.text ?? "").slice(0, 3000);
    const kind = payload?.kind === "bullets"
      ? "job duties into 3-5 concise achievement bullets, each line starting with '- ', starting with a strong action verb, with metrics only if present in the original"
      : "professional summary into 2-3 polished sentences";
    return { json: false, prompt: `You are an expert resume writer. Rewrite the following ${kind}. Do not invent facts. Return ONLY the rewritten text. Write in ${L}.\n\nText:\n${text}` };
  }
  if (action === "skills") {
    const title = String(payload?.title ?? "").slice(0, 120);
    return { json: true, prompt: `Suggest 15 relevant professional skills for a "${title}". Return STRICTLY a JSON array of strings. Write in ${L}.` };
  }
  if (action === "score") {
    const cv = JSON.stringify(payload?.cv ?? {}).slice(0, 8000);
    return { json: true, prompt: `Evaluate this CV. Return STRICTLY JSON: {"overall": number 0-100, "ats": number 0-100, "professionalism": number 0-100, "strengths": string[3], "improvements": string[3]}. Write the strings in ${L}.\n\nCV:\n${cv}` };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY is not set on the server" }, { status: 500 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many requests, try again in a few minutes" }, { status: 429 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const built = buildPrompt(body?.action, body?.payload, body?.lang);
  if (!built) return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const payload: any = { contents: [{ parts: [{ text: built.prompt }] }] };
  if (built.json) payload.generationConfig = { responseMimeType: "application/json" };

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(payload),
    });
    if (!r.ok) return NextResponse.json({ error: `AI provider error (${r.status})` }, { status: 502 });
    const data = await r.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!text) return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
    return NextResponse.json({ result: built.json ? JSON.parse(text) : text.trim() });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 502 });
  }
}
