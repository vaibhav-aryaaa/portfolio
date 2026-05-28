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
    skills: ["Python", "TensorFlow", "Scikit-Learn", "LLM APIs", "Prompt Engineering", "LangChain", "Vector Databases", "RAG"],
    color: "bg-indigo-50 border-indigo-100 text-indigo-700"
  },
  {
    title: "Cloud & DevOps",
    description: "Deploying, scaling, and automating workloads in cloud environments.",
    icon: "Cloud",
    skills: ["AWS", "Docker", "GitHub Actions", "Vercel", "CI/CD"],
    color: "bg-sky-50 border-sky-100 text-sky-700"
  },
  {
    title: "Backend Engineering",
    description: "Designing robust, scalable APIs and architectures for data-heavy applications.",
    icon: "Server",
    skills: ["FastAPI", "RESTful APIs", "Flask"],
    color: "bg-emerald-50 border-emerald-100 text-emerald-700"
  },
  {
    title: "Database",
    description: "Managing relational and non-relational database systems and data modeling.",
    icon: "Database",
    skills: ["MongoDB", "SQL"],
    color: "bg-amber-50 border-amber-100 text-amber-700"
  },
  {
    title: "Frontend & UI/UX",
    description: "Crafting beautiful, responsive, and highly interactive user experiences.",
    icon: "Layout",
    skills: ["React", "Next.js", "Tailwind CSS", "Shadcn UI", "TypeScript", "Framer Motion"],
    color: "bg-rose-50 border-rose-100 text-rose-700"
  }
];
