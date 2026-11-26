"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CV, Lang, TemplateId } from "./types";

export const sampleCV: CV = {
  name: "أحمد محمد", title: "مهندس برمجيات", email: "ahmed@example.com", phone: "+20 100 000 0000",
  address: "القاهرة، مصر", linkedin: "", photo: "",
  summary: "مطور ويب لديه خبرة في بناء تطبيقات React وNode.js، ويهتم بجودة الكود وتجربة المستخدم.",
  experience: [{ id: "1", title: "مطور ويب", company: "شركة التقنية الذكية", start: "2022", end: "الآن",
    description: "- طوّرت لوحة تحكم أدارت بيانات أكثر من 5000 مستخدم\n- قلّلت زمن تحميل الصفحات بنسبة 40%" }],
  education: [{ id: "1", school: "جامعة القاهرة", degree: "بكالوريوس هندسة حاسبات", start: "2018", end: "2022" }],
  skills: ["JavaScript", "React", "Node.js", "Tailwind CSS"],
};

type State = {
  cv: CV; lang: Lang; template: TemplateId; color: string;
  setCV: (p: Partial<CV>) => void; setLang: (l: Lang) => void;
  setTemplate: (t: TemplateId) => void; setColor: (c: string) => void; reset: () => void;
};

export const useCV = create<State>()(
  persist(
    (set) => ({
      cv: sampleCV, lang: "ar", template: "modern", color: "#0F766E",
      setCV: (p) => set((s) => ({ cv: { ...s.cv, ...p } })),
      setLang: (lang) => set({ lang }),
      setTemplate: (template) => set({ template }),
      setColor: (color) => set({ color }),
      reset: () => set({ cv: { ...sampleCV, name: "", title: "", email: "", phone: "", address: "", summary: "", experience: [], education: [], skills: [] } }),
    }),
    { name: "ai-cv-builder-v1" }
  )
);
