# صانع السيرة الذاتية AI — AI CV Builder

موقع لإنشاء سيرة ذاتية احترافية (عربي / English) مع تحسين الصياغة واقتراح المهارات وتقييم ATS بالذكاء الاصطناعي، وتحميلها PDF.

**المطور:** مسلم إبراهيم — [LinkedIn](https://www.linkedin.com/in/moslim-ebrahim-0ba71b2b9/) · [Facebook](https://www.facebook.com/share/1F51FLGJFY/) · [GitHub](https://github.com/moslimebrahem69-ai/-)

## المميزات
- محرر بـ 5 أقسام (بيانات، ملخص، خبرات، تعليم، مهارات) ومعاينة مباشرة
- قالبان (عصري بعمودين / كلاسيكي) مع اختيار اللون
- واجهة عربية RTL وإنجليزية
- تحسين النص واقتراح المهارات وتقييم السيرة عبر Gemini
- مفتاح الـ API محفوظ على السيرفر فقط، مع حد استخدام لكل IP
- حفظ تلقائي في المتصفح، وتحميل PDF بصيغة A4

## التشغيل محلياً
```bash
npm install
cp .env.example .env.local   # ضع GEMINI_API_KEY
npm run dev
```
مفتاح مجاني من: https://aistudio.google.com/apikey

## النشر على Vercel
1. ارفع المشروع على GitHub.
2. من vercel.com اختر **Add New → Project** واستورد الريبو.
3. في **Environment Variables** أضف `GEMINI_API_KEY` (واختيارياً `GEMINI_MODEL`).
4. اضغط **Deploy**.

## ملاحظات
- الـ rate limit في الذاكرة (20 طلب / 10 دقائق لكل IP) ويكفي للبداية. للزوار الكثيرين استخدم Upstash Redis.
- لتحميل PDF اختر "Save as PDF" من نافذة الطباعة وفعّل "Background graphics".
# ai-cv-builder
