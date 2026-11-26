import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "صانع السيرة الذاتية AI | AI CV Builder",
  description: "أنشئ سيرة ذاتية احترافية بالعربي والإنجليزي مع تحسين الصياغة وتقييم ATS بالذكاء الاصطناعي، وحمّلها PDF مجاناً.",
  openGraph: { title: "صانع السيرة الذاتية AI", description: "سيرة ذاتية احترافية بالذكاء الاصطناعي، مجاناً.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.variable}>{children}</body>
    </html>
  );
}
