export type Exp = { id: string; title: string; company: string; start: string; end: string; description: string };
export type Edu = { id: string; school: string; degree: string; start: string; end: string };
export type CV = {
  name: string; title: string; email: string; phone: string; address: string; linkedin: string; photo: string;
  summary: string; experience: Exp[]; education: Edu[]; skills: string[];
};
export type Lang = "ar" | "en";
export type TemplateId = "classic" | "modern";
