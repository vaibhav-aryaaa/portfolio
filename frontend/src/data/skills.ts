export interface SkillCategory {
  title: string;
  description: string;
  icon: string;
  skills: string[];
  color: string;
}

export const skillsData: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    description: "Building predictive models and integrating Large Language Models into modern production stacks.",
    icon: "Brain",
    skills: ["Python", "PyTorch", "XGBoost", "Pandas", "Scikit-Learn", "Groq", "Gemini API"],
    color: "bg-indigo-50 border-indigo-100 text-indigo-700"
  },
  {
    title: "Backend Engineering",
    description: "Designing robust, scalable APIs and architectures for data-heavy applications.",
    icon: "Server",
    skills: ["FastAPI", "RESTful APIs", "Docker", "SQL"],
    color: "bg-emerald-50 border-emerald-100 text-emerald-700"
  },
  {
    title: "Frontend & UI/UX",
    description: "Crafting beautiful, responsive, and highly interactive user experiences.",
    icon: "Layout",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    color: "bg-rose-50 border-rose-100 text-rose-700"
  }
];
