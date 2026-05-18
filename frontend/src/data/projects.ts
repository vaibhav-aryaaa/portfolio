export interface Project {
  id: string;
  category: string;
  title: string;
  thumbnail: string;
  description: string;
  technologies: string[];
  links: { label: string; url: string }[];
  screenshots: string[];
}

export const projectsData: Project[] = [
  {
    id: "1",
    category: "Hackathon winner",
    title: "SolveIQ",
    thumbnail: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=600&auto=format&fit=crop",
    description: "An AI-powered math copilot that solves complex geometry and algebra problems by analyzing canvas drawings. Built to help students visualize and solve problems interactively in real-time.",
    technologies: ["React", "FastAPI", "Groq Llama 3", "Canvas API"],
    links: [
      { label: "SolveIQ App", url: "#" },
      { label: "GitHub Repository", url: "#" }
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    category: "WebApp",
    title: "NutriSense",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
    description: "An intelligent nutrition wizard and dietary platform. NutriSense utilizes Gemini Flash to provide users with personalized, context-aware meal plans and food swap recommendations.",
    technologies: ["Next.js", "Tailwind CSS", "Gemini API", "Python"],
    links: [
      { label: "Live Demo", url: "#" },
      { label: "GitHub Repository", url: "#" }
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1498837167922-41cfa6f310f1?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "3",
    category: "Machine Learning",
    title: "Predictive Engine",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    description: "A high-performance MLOps pipeline designed to predict machine failure and calculate Remaining Useful Life (RUL) using NASA's turbofan engine dataset and XGBoost.",
    technologies: ["Python", "XGBoost", "Pandas", "Scikit-Learn"],
    links: [
      { label: "View Analysis", url: "#" }
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];
