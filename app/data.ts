export type Project = {
  name: string;
  what: string;
  outcome?: string;
  stack: string[];
  url?: string;
  category: "edtech" | "product" | "freelance";
};

export const projects: Project[] = [
  {
    category: "edtech",
    name: "EdTech Hub — LMS + RAG",
    what: "Context-aware AI answers for educators inside the learning platform, so teachers get working answers instead of another search box.",
    outcome: "Live in production",
    stack: ["Python", "RAG", "LMS", "LLM"],
  },
  {
    category: "edtech",
    name: "Digitized Curriculum Modules",
    what: "Turns printed curricula into interactive learning modules students can actually work through.",
    outcome: "60+ modules shipped",
    stack: ["Elixir", "Authoring", "LMS"],
  },
  {
    category: "edtech",
    name: "MoE Telegram Bots",
    what: "Bots that put government guidance and AI answers where school leaders already are: on their phones.",
    outcome: "4,000+ school leaders",
    stack: ["Telegram", "Python", "AI", "Bot"],
  },
  {
    category: "product",
    name: "NARD Candles — E-commerce",
    what: "An online storefront where customers can browse and buy candles end-to-end.",
    outcome: "Live store",
    stack: ["React", "Tailwind", "Chapa"],
  },
  {
    category: "product",
    name: "Cry Dev — Logistics App",
    what: "A mobile app for tracking logistics operations on the ground.",
    outcome: "In use",
    stack: ["Flutter", "Dart"],
  },
  {
    category: "product",
    name: "Gemini Question Generator",
    what: "Auto-generates practice questions from content so teachers spend less time writing them.",
    outcome: "Study tool",
    stack: ["Gemini API", "AI"],
  },
  {
    category: "freelance",
    name: "Freelance Portfolio Sites",
    what: "Clean, fast, responsive sites built for clients who needed a real web presence.",
    outcome: "Ships on time",
    stack: ["Next.js", "React"],
  },
];

export type Experience = {
  where: string;
  role: string;
  range: string;
  outcomes: string[];
};

export const experienceMain: Experience[] = [
  {
    where: "EdTech Hub",
    role: "Tech Lead",
    range: "2025 — Present",
    outcomes: [
      "Run end-to-end project lifecycles on major EdTech initiatives and manage the platform suite behind them.",
      "Scale multiple digital platforms — including the LMS — and build RAG-based, context-aware tooling on top of them.",
    ],
  },
  {
    where: "Elixir Research and Consultancy",
    role: "Developer · UI/UX",
    range: "2025 — 2026",
    outcomes: [
      "Led the digitization of PDF-based curricula into interactive, gamified, lesson-based modules.",
      "Co-designed 60+ modules with the design team, plus AI-assisted course materials, context-aware assessments, and a tracked digital book for educators.",
      "Shipped custom Python Telegram bots for user tracking and progress recording.",
    ],
  },
  {
    where: "Ministry of Education Ethiopia",
    role: "Instructional Designer · Developer",
    range: "2025 — Present",
    outcomes: [
      "Built Telegram bots that put digital modules in front of 4,000+ remote school leaders.",
      "Shipped a knowledge-bound AI chatbot trained on MoE's own training modules.",
      "Contributed to UNESCO Schoolnet and UNICEF School Leadership, with CoP chat built into the modules.",
    ],
  },
  {
    where: "Edify",
    role: "Data Collection",
    range: "2024",
    outcomes: [
      "Assessed pre- and post-training effects on Grade 3 numeracy and literacy.",
      "Compiled and delivered metadata for 40+ schools across Ethiopia.",
    ],
  },
];

export const experienceBuild: Experience[] = [
  {
    where: "NARD Candles",
    role: "Full-Stack Developer",
    range: "2024",
    outcomes: [
      "Shipped an e-commerce storefront in React and Tailwind, with Chapa payments and a custom cart.",
      "Carried it through test, staging, and deploy with the client — documented throughout.",
    ],
  },
  {
    where: "Cry Dev Team",
    role: "Software Developer",
    range: "2022 — 2024",
    outcomes: [
      "Built a Flutter cargo-and-delivery app with full user profiles and secure, integrated payments.",
      "Engineered a Gemini API question generator for teachers and students as part of a Google Developers Forum project.",
    ],
  },
  {
    where: "IT – Freelance",
    role: "Software Developer",
    range: "2018 — 2022",
    outcomes: [
      "Built portfolio sites for pharmacies, education PLCs, and startups.",
      "Worked the craft side too: music production, UI/UX design, and community programs.",
    ],
  },
];

export type SkillCategory = {
  name: string;
  accent: "amber" | "violet";
  skills: { label: string; level: number; note?: string }[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: "Build",
    accent: "violet",
    skills: [
      { label: "Full-stack web", level: 90, note: "Next.js, React, Node" },
      { label: "AI / RAG pipelines", level: 85, note: "LLMs, retrieval" },
      { label: "Mobile", level: 75, note: "Flutter" },
    ],
  },
  {
    name: "Design",
    accent: "amber",
    skills: [
      { label: "UI / UX", level: 80, note: "Systems thinking" },
      { label: "Instructional design", level: 85, note: "Curriculum to modules" },
    ],
  },
  {
    name: "Production",
    accent: "amber",
    skills: [
      { label: "Audio mixing", level: 80, note: "FL Studio, Soundtoys, FabFilter" },
      { label: "Music production", level: 78, note: "Full signal chain" },
    ],
  },
];

export type Achievement = {
  title: string;
  outcome: string;
};

export const achievements: Achievement[] = [
  {
    title: "Tablet distribution — Oromia & Somali",
    outcome: "Helped put 100+ tablets into schools so kids had devices, not just plans.",
  },
  {
    title: "UNICEF School Leadership",
    outcome: "Contributed to a program that reached hundreds of school leaders with real training.",
  },
  {
    title: "EdTech Hub recognition",
    outcome: "System adopted at scale — 40+ schools running on it, not a pilot in a drawer.",
  },
];

export const languages = [
  { name: "English", accent: "amber" as const },
  { name: "Amharic", accent: "amber" as const },
  { name: "Afan Oromo", accent: "amber" as const },
  { name: "Spanish", accent: "amber" as const },
];

export const contact = {
  location: "Addis Ababa, Ethiopia",
  email: "reaches@yabsera.dev",
  phone: "+251 900 000 000",
};
