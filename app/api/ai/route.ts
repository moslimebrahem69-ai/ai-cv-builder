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
  if (action === "match") {
    const cv = JSON.stringify(payload?.cv ?? {}).slice(0, 8000);
    const job = String(payload?.job ?? "").slice(0, 6000);
    return { json: true, prompt: `Compare this CV with the job description. Return STRICTLY JSON: {"match": number 0-100, "missingKeywords": string[] (max 10, only keywords from the job description that are absent from the CV), "suggestions": string[3]}. Write the strings in ${L}.\n\nJOB:\n${job}\n\nCV:\n${cv}` };
  }
  if (action === "translate") {
    const cv = JSON.stringify(payload?.cv ?? {}).slice(0, 8000);
    return { json: true, prompt: `Translate every human-readable text value in this CV JSON into ${L}. Keep exactly the same JSON structure, keys and id values. Do not change emails, phone numbers or URLs. Return STRICTLY the JSON only.\n\n${cv}` };
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

  const models = Array.from(new Set([
    process.env.GEMINI_MODEL || "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite",
  ]));
  const payload: any = { contents: [{ parts: [{ text: built.prompt }] }] };
  if (built.json) payload.generationConfig = { responseMimeType: "application/json" };

  let lastStatus = 0;
  outer: for (let m = 0; m < models.length; m++) {
    for (let attempt = 0; attempt < (m === 0 ? 2 : 1); attempt++) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${models[m]}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify(payload),
        });
        if (r.ok) {
          const data = await r.json();
          const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (!text) return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
          return NextResponse.json({ result: built.json ? JSON.parse(text) : text.trim() });
        }
        lastStatus = r.status;
        console.error("Gemini error", models[m], r.status, (await r.text()).slice(0, 300));
        if (r.status === 401 || r.status === 403) break outer;
        if (r.status !== 429 && r.status < 500) break;
      } catch (e) { console.error("Gemini fetch failed", models[m], e); }
      await new Promise((res) => setTimeout(res, 700));
    }
  }
  return NextResponse.json({ error: `AI provider error (${lastStatus || "network"})` }, { status: 502 });
}
