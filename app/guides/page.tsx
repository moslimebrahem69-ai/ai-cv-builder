import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "مقالات ونصائح السيرة الذاتية | صانع السيرة الذاتية AI",
  description: "نصائح عملية لكتابة سيرة ذاتية قوية وتجاوز أنظمة ATS وتجنب أشهر الأخطاء.",
  alternates: { canonical: "/guides" },
};

export default function Guides() {
  return (
    <>
      <header className="max-w-3xl mx-auto px-4 py-5"><Link href="/" className="font-bold">← الرئيسية</Link></header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold">مقالات ونصائح السيرة الذاتية</h1>
        <ul className="mt-8 space-y-6">
          {guides.map((g) => (
            <li key={g.slug} className="border-b border-slate-200 pb-6">
              <Link href={`/guides/${g.slug}`} className="text-xl font-bold hover:text-teal">{g.title}</Link>
              <p className="mt-2 text-slate-600">{g.description}</p>
            </li>
          ))}
        </ul>
      </main>
      <Footer text="صُنع بواسطة مسلم إبراهيم" />
    </>
  );
}
