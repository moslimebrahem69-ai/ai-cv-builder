"use client";
import Link from "next/link";
import { useCV } from "@/lib/store";
import { T } from "@/lib/i18n";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
  const { lang, setLang } = useCV();
  const t = T[lang];
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; }, [lang]);
  const feats = [[t.f1, t.f1d], [t.f2, t.f2d], [t.f3, t.f3d]];
  return (
    <>
      <header className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <span className="font-extrabold text-lg">{t.app}</span>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/guides">المقالات</Link>
          <Link href="/about">{t.about}</Link>
          <button className="btn btn-ghost" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{lang === "ar" ? "English" : "عربي"}</button>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-4">
        <section className="grid md:grid-cols-2 gap-10 items-center py-14">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t.heroTitle}</h1>
            <p className="mt-5 text-lg text-slate-600 max-w-prose">{t.heroSub}</p>
            <Link href="/builder" className="btn btn-primary inline-block mt-8 text-lg">{t.start}</Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-6 rotate-1" aria-hidden>
            <div className="h-5 w-1/2 bg-ink rounded" />
            <div className="h-3 w-1/3 bg-teal rounded mt-3" />
            {[80, 95, 70, 88, 60].map((w, i) => <div key={i} className="h-2.5 bg-slate-200 rounded mt-4" style={{ width: `${w}%` }} />)}
            <div className="flex gap-2 mt-6">{[40, 56, 48].map((w, i) => <div key={i} className="h-6 bg-teal-soft rounded" style={{ width: w }} />)}</div>
          </div>
        </section>
        <section className="grid md:grid-cols-3 gap-6 py-8">
          {feats.map(([h, d]) => (
            <div key={h} className="border-t-4 border-teal pt-4">
              <h2 className="font-bold text-xl">{h}</h2>
              <p className="mt-2 text-slate-600">{d}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer text={t.footer} />
    </>
  );
}
