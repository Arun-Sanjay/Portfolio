export const SKILLS = {
  frontend: ["React Native", "Expo", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"],
  backend: ["Python", "Node.js", "PostgreSQL", "Supabase"],
  mobile: ["React Native", "Expo", "Zustand", "MMKV", "Reanimated"],
  tools: ["Git", "Claude Code", "Vercel", "TypeScript"],
};

export const ALL_SKILLS_FLAT = [
  "Python", "TypeScript", "PostgreSQL", "Next.js", "Tailwind CSS",
  "Framer Motion", "Three.js", "React Native", "Expo", "Supabase",
  "Zustand", "MMKV", "Reanimated", "Node.js", "Git",
];

export const PROJECTS = [
  {
    title: "TITAN PROTOCOL",
    subtitle: "Cross-Platform Productivity System",
    description:
      "The flagship app of the Titan ecosystem. A gamified productivity system that turns discipline into measurable progress.",
    highlights: [
      "20 beta testers in co-builder program",
      "Launched Android — March 2026",
      "Co-builder model: users shape development for lifetime access",
    ],
    stack: ["React Native", "Expo", "Zustand", "MMKV", "Reanimated", "Supabase"],
    scrollRange: { start: 0.44, end: 0.54 },
  },
  {
    title: "CAMPUSIQ",
    subtitle: "AI-Powered Academic & Placement Platform",
    description:
      "Built as an RVCE experiential learning project. An intelligent system that personalizes learning paths and prepares students for placements.",
    highlights: [
      "pgvector RAG for intelligent content retrieval",
      "Dijkstra's algorithm for shortest learning path",
      "Whisper API voice interaction + MediaPipe processing",
      "Mock interview engine with AI feedback",
    ],
    stack: ["Next.js", "Python", "PostgreSQL", "pgvector", "Whisper API", "MediaPipe"],
    team: "6-person team under Dr. Krishnappa H K",
    scrollRange: { start: 0.54, end: 0.62 },
  },
  {
    title: "GENX BUILDS",
    subtitle: "Custom PC Building Business",
    description:
      "A real business, not a side project. Commission-based custom PC building operation sourcing components from SP Road, Bangalore.",
    highlights: [
      "Independent brand via Smart Gaming Store partnership",
      "Online lead generation → price negotiation → fulfillment",
      "Full supply chain management across component markets",
      "Real revenue from real customers",
    ],
    stack: [],
    model: "Lead Gen → Negotiate → Source → Build → Deliver",
    scrollRange: { start: 0.62, end: 0.7 },
  },
] as const;

export const ACHIEVEMENTS = [
  {
    title: "META PYTORCH × HUGGING FACE",
    subtitle: "OpenEnv Hackathon — Finalist",
    description:
      "Selected for the in-person finale at Scaler SST Bangalore. Built DispatchPulse — a reinforcement learning environment for emergency 911 dispatch coordination using clinical survival curves as the reward function.",
    journey: "Initial rejection → 2-day extension → Accepted Round 2 → Finals",
    date: "April 25–26, 2026 · Bangalore",
  },
];

export const EDUCATION = {
  institution: "RVCE Bangalore",
  degree: "B.Tech Computer Science (Cyber Security)",
  semester: "4th Semester",
  years: "2024–2028",
  fullName: "Rashtreeya Vidyalaya College of Engineering",
};

export const CONTACT = {
  github: "https://github.com/Arun-Sanjay",
  email: "",
  linkedin: "",
};
