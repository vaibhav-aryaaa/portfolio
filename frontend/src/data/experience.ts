export interface Experience {
  id: string;
  period: string;
  company: string;
  role: string;
  startMonth: string;
  endMonth: string;
  ongoing: boolean;
  bullets: string[];
}

export const experienceData: Experience[] = [
  {
    id: "3",
    period: "2026-Present",
    company: "1M1B (One Million One Billion)",
    role: "Applied AI Intern",
    startMonth: "Jun 2026",
    endMonth: "Present",
    ongoing: true,
    bullets: [
      "Developing SmartAQI, an AI-powered air quality monitoring and decision support system designed to track dominant environmental pollutants (PM2.5, PM10, CO) across Indian cities.",
      "Building data pipelines using FastAPI for telemetry ingestion, Pydantic schema validation, and PostgreSQL/Supabase databases for secure logging.",
      "Implementing Scikit-Learn regression models (LSTM/XGBoost) to perform spatial-temporal anomaly filtering and forecast next-day AQI trends, integrated with real-time Telegram Bot alerts."
    ]
  },
  {
    id: "1",
    period: "2025-Present",
    company: "Kavyalok (kavyalok.in)",
    role: "Co-Founder & UI/UX Designer",
    startMonth: "Oct 2025",
    endMonth: "Present",
    ongoing: true,
    bullets: [
      "Leading the design vision and user experience strategy for the platform. Responsible for creating intuitive, visually appealing, and user-centric interfaces while ensuring a seamless digital experience across devices.",
      "Worked on wireframes, user flows, prototyping, and overall product aesthetics, collaborating closely on transforming ideas into engaging and accessible user experiences."
    ]
  },
  {
    id: "2",
    period: "2024-2026",
    company: "KavyaRang Society",
    role: "Head of Social Media",
    startMonth: "Feb 2024",
    endMonth: "Apr 2026",
    ongoing: false,
    bullets: [
      "Directed comprehensive social media strategies and digital collaboration across 4 departments.",
      "Oversaw content scheduling, digital marketing budgets, and analytics tracking. By optimizing online promotional efforts based on engagement data, drove a 23% growth in event attendance."
    ]
  }
];
