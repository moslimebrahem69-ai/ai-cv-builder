"use client";
import type { CV, Lang, TemplateId } from "@/lib/types";

const bullets = (s: string) => s.split("\n").map((b) => b.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
const L = {
  ar: { summary: "الملخص المهني", exp: "الخبرات العملية", edu: "التعليم", skills: "المهارات", contact: "التواصل" },
  en: { summary: "Professional Summary", exp: "Experience", edu: "Education", skills: "Skills", contact: "Contact" },
};

function Experience({ cv, color }: { cv: CV; color: string }) {
  return (
    <>
      {cv.experience.map((e) => (
        <div key={e.id} className="mb-4 break-inside-avoid">
          <div className="flex justify-between gap-3 font-bold"><span>{e.title}</span><span className="text-sm font-normal text-slate-500">{e.start} – {e.end}</span></div>
          <div className="text-sm font-semibold" style={{ color }}>{e.company}</div>
          <ul className="list-disc ms-5 mt-1 text-sm space-y-0.5">{bullets(e.description).map((b, i) => <li key={i}>{b}</li>)}</ul>
        </div>
      ))}
    </>
  );
}

function Education({ cv }: { cv: CV }) {
  return (
    <>
      {cv.education.map((e) => (
        <div key={e.id} className="mb-3 text-sm">
          <div className="font-bold">{e.degree}</div>
          <div className="text-slate-600">{e.school} · {e.start} – {e.end}</div>
        </div>
      ))}
    </>
  );
}

export default function Preview({ cv, lang, template, color }: { cv: CV; lang: Lang; template: TemplateId; color: string }) {
  const t = L[lang];
  const accent = template === "ats" ? "#111827" : color;
  const contact = [cv.email, cv.phone, cv.address, cv.linkedin].filter(Boolean);
  const H = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-extrabold pb-1 mb-2 border-b-2" style={{ borderColor: accent, color: accent }}>{children}</h3>
  );

  if (template === "classic" || template === "ats") {
    return (
      <div id="cv-print" dir={lang === "ar" ? "rtl" : "ltr"} className="bg-white shadow-xl w-[210mm] min-h-[297mm] p-[16mm] text-slate-900">
        <header className="flex items-center gap-5 pb-4 mb-5 border-b-4" style={{ borderColor: accent }}>
          {cv.photo && template !== "ats" && <img src={cv.photo} alt="" className="w-24 h-24 rounded-full object-cover" />}
          <div>
            <h1 className="text-3xl font-extrabold">{cv.name}</h1>
            <p className="text-lg font-semibold" style={{ color: accent }}>{cv.title}</p>
            <p className="text-sm text-slate-600 mt-1">{contact.join("  |  ")}</p>
          </div>
        </header>
        {cv.summary && <section className="mb-5"><H>{t.summary}</H><p className="text-sm leading-relaxed">{cv.summary}</p></section>}
        {cv.experience.length > 0 && <section className="mb-5"><H>{t.exp}</H><Experience cv={cv} color={accent} /></section>}
        {cv.education.length > 0 && <section className="mb-5"><H>{t.edu}</H><Education cv={cv} /></section>}
        {cv.skills.length > 0 && <section><H>{t.skills}</H><p className="text-sm">{cv.skills.join(" • ")}</p></section>}
      </div>
    );
  }

  if (template === "bold") {
    return (
      <div id="cv-print" dir={lang === "ar" ? "rtl" : "ltr"} className="bg-white shadow-xl w-[210mm] min-h-[297mm] text-slate-900">
        <header className="px-[14mm] py-[11mm] text-white flex items-center gap-5" style={{ background: color }}>
          {cv.photo && <img src={cv.photo} alt="" className="w-28 h-28 rounded-lg object-cover border-4 border-white/70" />}
          <div>
            <h1 className="text-4xl font-extrabold">{cv.name}</h1>
            <p className="text-xl font-semibold opacity-90">{cv.title}</p>
            <p className="text-sm mt-2 opacity-90">{contact.join("  |  ")}</p>
          </div>
        </header>
        <div className="grid grid-cols-[1fr_58mm] gap-8 p-[13mm]">
          <div>
            {cv.summary && <section className="mb-5"><H>{t.summary}</H><p className="text-sm leading-relaxed">{cv.summary}</p></section>}
            {cv.experience.length > 0 && <section><H>{t.exp}</H><Experience cv={cv} color={color} /></section>}
          </div>
          <div>
            {cv.education.length > 0 && <section className="mb-5"><H>{t.edu}</H><Education cv={cv} /></section>}
            {cv.skills.length > 0 && <section><H>{t.skills}</H><div className="flex flex-wrap gap-1.5">{cv.skills.map((s) => <span key={s} className="text-xs px-2 py-1 rounded text-white" style={{ background: color }}>{s}</span>)}</div></section>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cv-print" dir={lang === "ar" ? "rtl" : "ltr"} className="bg-white shadow-xl w-[210mm] min-h-[297mm] flex text-slate-900">
      <aside className="w-[68mm] shrink-0 p-[9mm] text-white" style={{ background: color }}>
        {cv.photo && <img src={cv.photo} alt="" className="w-32 h-32 rounded-full object-cover mx-auto mb-5 border-4 border-white/70" />}
        <h2 className="font-extrabold text-sm border-b border-white/50 pb-1 mb-2">{t.contact}</h2>
        <ul className="text-xs space-y-2 mb-6 break-words">{contact.map((c) => <li key={c}>{c}</li>)}</ul>
        {cv.skills.length > 0 && (
          <>
            <h2 className="font-extrabold text-sm border-b border-white/50 pb-1 mb-2">{t.skills}</h2>
            <ul className="text-xs space-y-1.5">{cv.skills.map((s) => <li key={s}>{s}</li>)}</ul>
          </>
        )}
      </aside>
      <div className="flex-1 p-[11mm]">
        <h1 className="text-3xl font-extrabold">{cv.name}</h1>
        <p className="text-lg font-semibold mb-5" style={{ color }}>{cv.title}</p>
        {cv.summary && <section className="mb-5"><H>{t.summary}</H><p className="text-sm leading-relaxed">{cv.summary}</p></section>}
        {cv.experience.length > 0 && <section className="mb-5"><H>{t.exp}</H><Experience cv={cv} color={color} /></section>}
        {cv.education.length > 0 && <section><H>{t.edu}</H><Education cv={cv} /></section>}
      </div>
    </div>
  );
}
