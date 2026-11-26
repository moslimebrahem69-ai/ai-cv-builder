import Link from "next/link";
import { LINKS } from "@/lib/links";

export default function Footer({ text }: { text: string }) {
  const items = [["LinkedIn", LINKS.linkedin], ["Facebook", LINKS.facebook], ["GitHub", LINKS.github]];
  return (
    <footer className="border-t border-slate-200 mt-16 py-6 text-sm text-slate-600 print:hidden">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
        <span>{text}</span>
        <nav className="flex flex-wrap gap-4">
          <Link href="/guides" className="hover:text-teal font-semibold">المقالات</Link>
          <Link href="/privacy" className="hover:text-teal font-semibold">الخصوصية</Link>
          {items.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-teal font-semibold">{label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
