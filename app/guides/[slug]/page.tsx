import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { guides, getGuide } from "@/lib/guides";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug);
  if (!g) return {};
  return { title: `${g.title} | صانع السيرة الذاتية AI`, description: g.description, alternates: { canonical: `/guides/${g.slug}` } };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug);
  if (!g) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, inLanguage: "ar", author: { "@type": "Person", name: "مسلم إبراهيم" } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-3xl mx-auto px-4 py-5 flex justify-between">
        <Link href="/guides" className="font-bold">← المقالات</Link>
        <Link href="/builder" className="btn btn-primary">ابدأ سيرتك</Link>
      </header>
      <article className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{g.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{g.description}</p>
        {g.sections.map((s) => (
          <section key={s.h} className="mt-8">
            <h2 className="text-2xl font-bold">{s.h}</h2>
            {s.p.map((p, i) => <p key={i} className="mt-3 leading-loose text-lg text-slate-800">{p}</p>)}
          </section>
        ))}
        <div className="mt-12 border-t-4 border-teal pt-5">
          <p className="font-bold text-xl">جاهز تطبّق اللي قريته؟</p>
          <Link href="/builder" className="btn btn-primary inline-block mt-3">اكتب سيرتك مجاناً</Link>
        </div>
      </article>
      <Footer text="صُنع بواسطة مسلم إبراهيم" />
    </>
  );
}
