# Vaibhav Arya - AI Engineer | Grounding Knowledge Base

This is the official, comprehensive grounding database for Vaibhav Arya. It contains verified details about his professional profile, technical stack, key projects (SolveIQ & AgentFlow), experience, engineering philosophy, and detailed FAQs.

---

## 1. Professional Profile
*   **Role**: AI Engineer / Full-Stack Developer
*   **Location**: India
*   **Backstory & Philosophy**: Vaibhav builds intelligent products that solve complex mathematical, research, and data problems. He believes AI should act as a low-latency, conversational copilot that augments human intelligence. He focuses on modular backend engineering, highly interactive frontend user experiences, and multi-agent system design.
*   **Design Approach**: Clean, glassmorphic dark-mode-first user interfaces (Tailwind, Framer Motion, Mantine) integrated with low-latency LLM engines (Groq, Gemini).

---

## 2. Technical Skills Stack

### Artificial Intelligence & Machine Learning
*   **Languages**: Python
*   **Orchestration & Frameworks**: LangGraph, LangChain, LLM APIs, Prompt Engineering, Structured JSON Outputs
*   **RAG & Vector Tech**: Semantic Search, Vector Embeddings, pgvector, Context Chunking
*   **ML Libraries**: TensorFlow, XGBoost, Pandas, NumPy, Scikit-Learn

### Full-Stack Software Engineering
*   **Backend**: FastAPI, RESTful APIs, Python-dotenv, Uvicorn
*   **Frontend**: React (React 19), Next.js, TypeScript, JavaScript
*   **UI & Animation**: Tailwind CSS, Mantine UI, Framer Motion, HTML5 Canvas API, MathJax (LaTeX rendering)
*   **Databases**: MongoDB, PostgreSQL, SQL

### DevOps & Cloud Infrastructure
*   **Containerization**: Docker, Docker Compose
*   **Cloud Deployment**: Vercel (Serverless Functions), Streamlit Cloud, Render
*   **DevOps**: Git, GitHub Actions, CI/CD pipelines

---

## 3. Detailed Projects Portfolio

### 1. SolveIQ (AI-Powered Math Intelligence Canvas)
*   **Description**: A next-generation mathematical playground that bridges the gap between digital ink and artificial intelligence. Users draw equations, geometric shapes, and algebraic graphs directly onto an interactive, low-latency drawing canvas and receive step-by-step verified proofs.
*   **Architecture & Core Technologies**:
    *   **Frontend**: React 19 (Vite), TypeScript, Mantine UI, and custom HTML5 Canvas API for stroke capturing. Features draggable step-by-step visual proofs.
    *   **Backend**: FastAPI (Python) server.
    *   **AI Interpretation**: Integrates **Google Gemini 2.0 Multimodal API** (Flash/Pro) for vision-based canvas stroke interpretation.
    *   **Chat Copilot**: Uses **Groq (Llama 3.3)** for a session-aware, sub-second latency conversation engine.
    *   **Math Rendering**: Dynamically parses outputs and renders beautiful LaTeX equations in real time using **MathJax**.
*   **Key Engineering Challenges Solved**:
    *   *Agentic State Memory*: Created a state-management system that "remembers" variables (e.g., if a user writes `x = 5` in one area of the canvas, subsequent equations drawn in other areas calculate correctly using that constant).
    *   *Stroke Serialization*: Optimized base64 image data pipelines, cleaning up background noises using Pillow (PIL) before sending to Gemini, keeping prompt overhead low.
*   **Links**:
    *   Live App: `https://solveiq-two.vercel.app/`
    *   GitHub: `https://github.com/vaibhav-aryaaa/maths-notes`
*   **Screenshots**: `/assets/projects/solveiq-ss1.jpg`, `/assets/projects/solveiq-ss2.jpg`, `/assets/projects/solveiq-ss3.jpg`

### 2. AgentFlow (Multi-Agent Research Intelligence)
*   **Description**: A production-grade, multi-agent AI research platform designed to synthesize high-fidelity, academic-quality manuscripts. It orchestrates a specialized team of AI agents that collaborate to search the deep web, extract scholarly data, write reports, and criticize them for accuracy.
*   **Architecture & Core Technologies**:
    *   **Orchestration**: Built on **LangGraph** and **LangChain** to enforce structured, loop-free sequential state transitions.
    *   **LLM Brain**: Groq (Llama 3.3 70B Versatile) for high-reasoning, low-latency agent decisions.
    *   **Search Engine**: Tavily Search API with **Scholar Mode** enabled (actively prioritizing ArXiv, Nature, ScienceDirect, JSTOR, and ResearchGate while automatically filtering out blog posts and social media noise).
    *   **Frontend**: Streamlit with custom CSS glassmorphism, dynamic trending research query chips, and real-time state progress cards.
*   **Specialized Agent Pipeline**:
    1.  *The Researcher*: Scans academic databases and fetches top citations.
    2.  *The Deep Reader*: Extracts specific data points, methodologies, and claims from PDF files.
    3.  *The Synthesizer*: Compiles research into structured academic Markdown chapters.
    4.  *The Critic*: Conducts peer review, checks for citation accuracy and logical consistency, and routes feedback back to the Synthesizer if revisions are required.
*   **Key Engineering Challenges Solved**:
    *   *Deadlock Prevention*: Structured LangGraph conditional edges to prevent infinite loops during the Critique-Synthesizer revision stage.
    *   *Information Density*: Optimized context token consumption by summarizing documents locally before passing them to the final report compiler.
*   **Links**:
    *   Live Demo: `https://multi-agent-research-system-69.streamlit.app/`
    *   GitHub: `https://github.com/vaibhav-aryaaa/multi-agent-research-system`
*   **Screenshots**: `/assets/projects/agentflow-ss1.jpg`

---

## 4. Professional Experience

### 1. Applied AI Intern at 1M1B (One Million One Billion)
*   **Period**: Jun 2026 - Present (Ongoing)
*   **Key Project - SmartAQI**:
    *   Designing and building an AI-powered air quality monitoring system to track and forecast pollutants (PM2.5, PM10, CO) across high-density urban areas.
    *   Engineering a FastAPI data ingestion pipeline with Pydantic validation and PostgreSQL/Supabase database logging.
    *   Developing Scikit-Learn ML models (XGBoost/LSTM) for spatial-temporal sensor anomaly detection (quarantining reading outliers) and forecasting next-day AQI trends based on weather variables.
    *   Integrating automated Telegram Bot alerts and dynamic React dashboard updates via WebSockets for real-time notifications.

### 2. Co-Founder & UI/UX Designer at Kavyalok (kavyalok.in)
*   **Period**: Oct 2025 - Present (Ongoing)
*   **Details**: Co-founded a modern digital platform dedicated to poetry, literature, and art.
*   **UX/UI Execution**:
    *   Designed the entire product design system, wireframes, user flows, and aesthetic guidelines.
    *   Translated high-fidelity Figma components into clean, responsive Next.js/Tailwind code, ensuring cross-device readability.
    *   Analyzed user reading behavior to improve layout structures, leading to a highly engaging community interface.

### 3. Head of Social Media at KavyaRang Society
*   **Period**: Feb 2024 - Apr 2026 (Completed)
*   **Details**: Managed digital outreach, brand strategy, and event promotion for a major cultural and literary society.
*   **Key Contributions**:
    *   Coordinated promotional campaigns and content scheduling across 4 core departments.
    *   Analyzed audience engagement metrics to adjust posting schedules and budgets, driving a **23% growth in event attendance**.

---

## 5. Contact & Socials
*   **Email**: `vaibhavarya338@gmail.com`
*   **LinkedIn**: `linkedin.com/in/vaibhav-arya`
*   **GitHub**: `github.com/vaibhav-aryaaa`
*   **Instagram**: `instagram.com/vaibhav.aryaa` (social username: `@vaibhav.aryaa`)

---

## 6. Detailed General FAQs (Recruiter-Grade Q&A)

### Q1: What is Vaibhav's engineering background and daily workflow?
Vaibhav is an AI Engineer who focuses on backend optimization and interactive AI applications. His standard development environment includes Git for version control, Docker for environment isolation, and VS Code. He builds modular FastAPI servers in Python, writes type-safe React/TS frontends, and automates builds via GitHub Actions CI/CD pipelines.

### Q2: Why did Vaibhav transition from traditional full-stack into AI Engineering?
While building traditional CRUD apps, Vaibhav realized that static layouts were limited in adapting to user needs. He became fascinated by Large Language Models and multi-agent systems, seeing them as the ultimate tools to build self-learning, adaptive user experiences. This inspired him to build projects like `SolveIQ` (which makes canvas math interactive) and `AgentFlow` (which automates heavy academic research).

### Q3: What is the benefit of using LangGraph in projects like AgentFlow?
LangGraph allows developers to build stateful, multi-actor applications with LLMs. Unlike simple linear chains, LangGraph supports cycles and loops (essential for a Writer/Critic flow), state persistence across steps, and precise human-in-the-loop validation, which makes agent coordination robust and debugging straightforward.

### Q4: How does Vaibhav handle project deployments?
For AI backends, he deploys using Vercel Serverless Functions (Python runtime) or Koyeb to ensure 24/7 uptime without cold start latencies. Frontend applications are hosted on Vercel or Streamlit Cloud, utilizing automated CI/CD connections linked directly to his GitHub repositories.

### Q5: Is there a resume download link available?
Yes, a PDF copy of Vaibhav's resume is downloadable via the "Resume" button located at the top-left of the landing page.
