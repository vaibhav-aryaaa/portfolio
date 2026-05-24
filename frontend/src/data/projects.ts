export interface Project {
  id: string;
  category: string;
  title: string;
  thumbnail: string;
  fallbackThumbnail?: string;
  description: string;
  technologies: string[];
  links: { label: string; url: string }[];
  screenshots: string[];
  fallbackScreenshots?: string[];
}

export const projectsData: Project[] = [
  {
    id: "1",
    category: "AI in Mathematics",
    title: "SolveIQ",
    thumbnail: "/assets/projects/solveiq-thumb.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=600&auto=format&fit=crop",
    description: "An AI-powered math copilot that solves complex geometry and algebra problems by analyzing canvas drawings. Built to help students visualize and solve problems interactively in real-time.",
    technologies: ["FastAPI", "Groq Llama 3", "Canvas API","Next.js", "Tailwind CSS", "TypeScript", "MathJax"],
    links: [
      { label: "SolveIQ App", url: "https://solveiq-two.vercel.app/" },
      { label: "GitHub Repository", url: "https://github.com/vaibhav-aryaaa/maths-notes" }
    ],
    screenshots: [
      "/assets/projects/solveiq-ss1.jpg",
      "/assets/projects/solveiq-ss2.jpg",
      "/assets/projects/solveiq-ss3.jpg"
    ],
    fallbackScreenshots: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    category: "AI in Research",
    title: "AgentFlow",
    thumbnail: "/assets/projects/agentflow-thumb.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
    description: "AgentFlow(Multi-Agent Research System) is an AI-powered research assistant built using a multi-agent architecture, where specialized agents collaborate to gather, analyze, and summarize information efficiently. The project focuses on automating complex research workflows using LLMs, tool calling, and intelligent task delegation to generate structured, high-quality insights.",
    technologies: ["Next.js", "Tailwind CSS", "Gemini API", "Python", "LangChain", "FastAPI", "Vercel", "PostgreSQL", "Docker", "Firebase", "TypeScript"],
    links: [
      { label: "Live Demo", url: "https://multi-agent-research-system-69.streamlit.app/" },
      { label: "GitHub Repository", url: "https://github.com/vaibhav-aryaaa/multi-agent-research-system" }
    ],
    screenshots: [
      "/assets/projects/agentflow-ss1.jpg"
    ],
    fallbackScreenshots: [
      "https://images.unsplash.com/photo-1498837167922-41cfa6f310f1?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];
