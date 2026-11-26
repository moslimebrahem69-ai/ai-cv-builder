"use client";
import { useState } from "react";
import { useCV } from "@/lib/store";
import { T } from "@/lib/i18n";
import { callAI } from "@/lib/ai";

type Tab = "personal" | "summary" | "experience" | "education" | "skills" | "match" | "ai";
const uid = () => Math.random().toString(36).slice(2, 9);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-semibold mb-1">{label}</span>{children}</label>;
}

function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 300, c = document.createElement("canvas");
      c.width = c.height = size;
      const s = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function Editor() {
  const { cv, setCV, lang, reset } = useCV();
  const t = T[lang];
  const [tab, setTab] = useState<Tab>("personal");
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<any>(null);
  const [job, setJob] = useState("");
  const [matchRes, setMatchRes] = useState<any>(null);

  const run = async (action: "enhance" | "skills" | "score" | "match" | "translate", payload: unknown, target = lang) => {
    setBusy(true);
    try { return await callAI(action, payload, target); }
    catch (e: any) { alert(e?.message || t.error); return null; }
    finally { setBusy(false); }
  };

  const enhance = async (text: string, kind: "summary" | "bullets", apply: (v: string) => void) => {
    if (text.trim().length < 5) return alert(t.fillFirst);
    const r = await run("enhance", { text, kind });
    if (r) apply(r);
  };

  const tabs: [Tab, string][] = [["personal", t.personal], ["summary", t.summary], ["experience", t.experience], ["education", t.education], ["skills", t.skills], ["match", t.match], ["ai", t.ai]];
  const text = (k: "name" | "title" | "email" | "phone" | "address" | "linkedin", label: string) => (
    <Field label={label}><input className="input" value={cv[k]} onChange={(e) => setCV({ [k]: e.target.value })} /></Field>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 print:hidden">
      <div className="flex flex-wrap gap-1 mb-4" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`btn text-sm ${tab === id ? "btn-primary" : "btn-ghost"}`}>{label}</button>
        ))}
      </div>

      {busy && <p className="mb-3 text-sm text-teal font-semibold" role="status">{t.working}</p>}

      <div className="space-y-4">
        {tab === "personal" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {text("name", t.name)}{text("title", t.title)}{text("email", t.email)}{text("phone", t.phone)}{text("address", t.address)}{text("linkedin", t.linkedin)}
            </div>
            <Field label={t.photo}>
              <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setCV({ photo: await resizePhoto(f) }); }} />
            </Field>
            {cv.photo && <button className="btn btn-ghost text-sm" onClick={() => setCV({ photo: "" })}>{t.remove}</button>}
            <button className="btn btn-ghost text-sm text-red-700" onClick={() => confirm(t.confirmReset) && reset()}>{t.reset}</button>
          </>
        )}

        {tab === "summary" && (
          <>
            <textarea className="input min-h-40" value={cv.summary} onChange={(e) => setCV({ summary: e.target.value })} />
            <button className="btn btn-primary" disabled={busy} onClick={() => enhance(cv.summary, "summary", (v) => setCV({ summary: v }))}>{t.enhance}</button>
          </>
        )}

        {tab === "experience" && (
          <>
            {cv.experience.map((e, i) => {
              const upd = (p: object) => setCV({ experience: cv.experience.map((x, j) => (j === i ? { ...x, ...p } : x)) });
              return (
                <div key={e.id} className="border border-slate-200 rounded-lg p-3 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label={t.jobTitle}><input className="input" value={e.title} onChange={(ev) => upd({ title: ev.target.value })} /></Field>
                    <Field label={t.company}><input className="input" value={e.company} onChange={(ev) => upd({ company: ev.target.value })} /></Field>
                    <Field label={t.from}><input className="input" value={e.start} onChange={(ev) => upd({ start: ev.target.value })} /></Field>
                    <Field label={t.to}><input className="input" value={e.end} onChange={(ev) => upd({ end: ev.target.value })} /></Field>
                  </div>
                  <Field label={t.desc}><textarea className="input min-h-28" value={e.description} onChange={(ev) => upd({ description: ev.target.value })} /></Field>
                  <div className="flex gap-2">
                    <button className="btn btn-primary text-sm" disabled={busy} onClick={() => enhance(e.description, "bullets", (v) => upd({ description: v }))}>{t.enhance}</button>
                    <button className="btn btn-ghost text-sm" onClick={() => setCV({ experience: cv.experience.filter((_, j) => j !== i) })}>{t.remove}</button>
                  </div>
                </div>
              );
            })}
            <button className="btn btn-ghost" onClick={() => setCV({ experience: [...cv.experience, { id: uid(), title: "", company: "", start: "", end: "", description: "" }] })}>+ {t.add}</button>
          </>
        )}

        {tab === "education" && (
          <>
            {cv.education.map((e, i) => {
              const upd = (p: object) => setCV({ education: cv.education.map((x, j) => (j === i ? { ...x, ...p } : x)) });
              return (
                <div key={e.id} className="border border-slate-200 rounded-lg p-3 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label={t.school}><input className="input" value={e.school} onChange={(ev) => upd({ school: ev.target.value })} /></Field>
                    <Field label={t.degree}><input className="input" value={e.degree} onChange={(ev) => upd({ degree: ev.target.value })} /></Field>
                    <Field label={t.from}><input className="input" value={e.start} onChange={(ev) => upd({ start: ev.target.value })} /></Field>
                    <Field label={t.to}><input className="input" value={e.end} onChange={(ev) => upd({ end: ev.target.value })} /></Field>
                  </div>
                  <button className="btn btn-ghost text-sm" onClick={() => setCV({ education: cv.education.filter((_, j) => j !== i) })}>{t.remove}</button>
                </div>
              );
            })}
            <button className="btn btn-ghost" onClick={() => setCV({ education: [...cv.education, { id: uid(), school: "", degree: "", start: "", end: "" }] })}>+ {t.add}</button>
          </>
        )}

        {tab === "skills" && (
          <>
            <Field label={t.skillsHint}>
              <textarea className="input min-h-28" value={cv.skills.join(", ")}
                onChange={(e) => setCV({ skills: e.target.value.split(/[،,]/).map((s) => s.trim()).filter(Boolean) })} />
            </Field>
            <button className="btn btn-primary" disabled={busy} onClick={async () => {
              if (!cv.title.trim()) return alert(t.fillFirst);
              const r = await run("skills", { title: cv.title });
              if (Array.isArray(r)) setCV({ skills: Array.from(new Set([...cv.skills, ...r.map(String)])) });
            }}>{t.suggest}</button>
          </>
        )}

        {tab === "match" && (
          <>
            <textarea className="input min-h-48" placeholder={t.jobPaste} value={job} onChange={(e) => setJob(e.target.value)} />
            <button className="btn btn-primary" disabled={busy} onClick={async () => {
              if (job.trim().length < 30) return alert(t.fillFirst);
              const { photo, ...rest } = cv;
              const r = await run("match", { cv: rest, job });
              if (r) setMatchRes(r);
            }}>{t.matchBtn}</button>
            {matchRes && (
              <div className="space-y-4">
                <div className="bg-teal-soft rounded-lg p-3 text-center"><div className="text-3xl font-extrabold text-teal">{String(matchRes.match)}%</div><div className="text-sm">{t.matchScore}</div></div>
                <div>
                  <h4 className="font-bold">{t.missing}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">{(matchRes.missingKeywords ?? []).map((k: string) => <span key={k} className="px-2 py-1 rounded bg-slate-100 text-sm">{k}</span>)}</div>
                  {(matchRes.missingKeywords ?? []).length > 0 && (
                    <button className="btn btn-ghost text-sm mt-3" onClick={() => setCV({ skills: Array.from(new Set([...cv.skills, ...matchRes.missingKeywords.map(String)])) })}>{t.addMissing}</button>
                  )}
                </div>
                <div><h4 className="font-bold">{t.suggestions}</h4><ul className="list-disc ms-5 text-sm">{(matchRes.suggestions ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
              </div>
            )}
          </>
        )}

        {tab === "ai" && (
          <>
            <button className="btn btn-primary" disabled={busy} onClick={async () => { const { photo, ...rest } = cv; const r = await run("score", { cv: rest }); if (r) setScore(r); }}>{t.scoreBtn}</button>
            {score && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[[t.overall, score.overall], [t.ats, score.ats], [t.pro, score.professionalism]].map(([l, v]) => (
                    <div key={String(l)} className="bg-teal-soft rounded-lg p-3"><div className="text-3xl font-extrabold text-teal">{String(v)}</div><div className="text-sm">{l}</div></div>
                  ))}
                </div>
                <div><h4 className="font-bold">{t.strengths}</h4><ul className="list-disc ms-5 text-sm">{(score.strengths ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                <div><h4 className="font-bold">{t.improve}</h4><ul className="list-disc ms-5 text-sm">{(score.improvements ?? []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
              </div>
            )}
            <div className="border-t border-slate-200 pt-4">
              <h4 className="font-bold mb-2">{t.translateTitle}</h4>
              <button className="btn btn-ghost" disabled={busy} onClick={async () => {
                const other = lang === "ar" ? "en" : "ar";
                const { photo, ...rest } = cv;
                const r = await run("translate", { cv: rest }, other);
                if (!r || !Array.isArray(r.experience) || !Array.isArray(r.education) || !Array.isArray(r.skills)) return r && alert(t.error);
                setCV({
                  name: String(r.name ?? cv.name), title: String(r.title ?? ""), address: String(r.address ?? cv.address), summary: String(r.summary ?? ""),
                  experience: cv.experience.map((e, i) => ({ ...e, ...(r.experience[i] ?? {}), id: e.id })),
                  education: cv.education.map((e, i) => ({ ...e, ...(r.education[i] ?? {}), id: e.id })),
                  skills: r.skills.map(String),
                });
                useCV.getState().setLang(other);
              }}>{t.translateBtn}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
