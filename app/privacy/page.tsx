import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "سياسة الخصوصية | صانع السيرة الذاتية AI", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  const items: [string, string][] = [
    ["البيانات التي تدخلها", "بيانات سيرتك تُحفظ في متصفحك فقط (localStorage) ولا نخزنها على خوادمنا، ولا يوجد تسجيل حساب."],
    ["ميزات الذكاء الاصطناعي", "عند استخدام التحسين أو التقييم أو المطابقة أو الترجمة، يُرسل النص المعني إلى خدمة Google Gemini لمعالجته وإرجاع النتيجة. لا ترسل معلومات حساسة لا تريد مشاركتها. الصورة الشخصية لا تُرسل أبداً."],
    ["الحد من الاستخدام", "نستخدم عنوان IP مؤقتاً في ذاكرة الخادم لتحديد عدد الطلبات ومنع إساءة الاستخدام، ولا نحتفظ به."],
    ["الإعلانات وملفات الارتباط", "قد يعرض الموقع إعلانات من أطراف ثالثة مثل Google AdSense، وقد تستخدم هذه الأطراف ملفات تعريف الارتباط لعرض إعلانات مناسبة. يمكنك إدارة ذلك من إعدادات متصفحك أو من إعدادات الإعلانات في حسابك على Google."],
    ["التواصل", "لأي استفسار تواصل مع المطور مسلم إبراهيم عبر الروابط الموجودة أسفل الصفحة."],
  ];
  return (
    <>
      <header className="max-w-3xl mx-auto px-4 py-5"><Link href="/" className="font-bold">← الرئيسية</Link></header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold">سياسة الخصوصية</h1>
        {items.map(([h, p]) => (
          <section key={h} className="mt-6"><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 leading-loose text-slate-800">{p}</p></section>
        ))}
      </main>
      <Footer text="صُنع بواسطة مسلم إبراهيم" />
    </>
  );
}
