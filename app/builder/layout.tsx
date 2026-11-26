import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اكتب سيرتك الذاتية الآن | صانع السيرة الذاتية AI",
  description: "محرر سيرة ذاتية مجاني بالعربي والإنجليزي مع معاينة مباشرة، 4 قوالب، تحسين بالذكاء الاصطناعي وتحميل PDF.",
  alternates: { canonical: "/builder" },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
