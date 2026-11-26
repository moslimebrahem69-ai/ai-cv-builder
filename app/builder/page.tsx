"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCV } from "@/lib/store";
import { T } from "@/lib/i18n";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import Footer from "@/components/Footer";

const COLORS = ["#0F766E", "#14213D", "#9F1239", "#B45309", "#4338CA"];

export default function Builder() {
  const { cv, lang, setLang, template, setTemplate, color, setColor } = useCV();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; }, [lang]);
  if (!ready) return null;
  const t = T[lang];

  return (
    <>
      <header className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/" className="font-extrabold text-lg">{t.app}</Link>
        <div className="flex flex-wrap items-center gap-3">
          <select className="input !w-auto" value={template} onChange={(e) => setTemplate(e.target.value as "classic" | "modern")} aria-label={t.template}>
            <option value="modern">{t.modern}</option><option value="classic">{t.classic}</option>
          </select>
          <div className="flex gap-1.5" role="group" aria-label={t.color}>
            {COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} aria-label={c} className="w-7 h-7 rounded-full border-2"
                style={{ background: c, borderColor: color === c ? "#14213D" : "transparent" }} />
            ))}
          </div>
          <button className="btn btn-ghost" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "English" : "عربي"}</button>
          <button className="btn btn-primary" onClick={() => window.print()}>{t.export}</button>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-4 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-start">
        <Editor />
        <div className="overflow-x-auto"><Preview cv={cv} lang={lang} template={template} color={color} /></div>
      </main>
      <Footer text={t.footer} />
    </>
  );
}
