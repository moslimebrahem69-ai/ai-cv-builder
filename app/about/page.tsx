"use client";
import Link from "next/link";
import { useCV } from "@/lib/store";
import { T } from "@/lib/i18n";
import { LINKS } from "@/lib/links";
import Footer from "@/components/Footer";

export default function About() {
  const { lang } = useCV();
  const t = T[lang];
  return (
    <>
      <header className="max-w-3xl mx-auto px-4 py-5"><Link href="/" className="font-bold">← {t.home}</Link></header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold">{t.aboutTitle}</h1>
        <p className="mt-4 text-lg text-slate-700">{t.aboutText}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {Object.entries(LINKS).map(([k, v]) => (
            <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="btn btn-ghost capitalize">{k}</a>
          ))}
        </div>
      </main>
      <Footer text={t.footer} />
    </>
  );
}
