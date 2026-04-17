export const SKILLS: Record<string, string[]> = {
  frontend: ['React Native', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  backend: ['Python', 'Node.js', 'PostgreSQL', 'Supabase'],
  mobile: ['Expo', 'Zustand', 'MMKV', 'Reanimated'],
  tools: ['Git', 'Claude Code', 'Vercel', 'TypeScript'],
};

export const PROJECTS = [
  {
    id: 'titan',
    number: '01',
    title: 'TITAN PROTOCOL',
    subtitle: 'Cross-Platform Productivity System',
    description:
      'The flagship app of the Titan ecosystem. A gamified productivity system that turns discipline into XP.',
    year: '2026',
    status: 'LAUNCHED',
    statusColor: '#5CE0D2',
    highlights: ['20+ beta testers', 'Android launched March 2026', 'Gamified XP system'],
    stack: ['React Native', 'Expo', 'Zustand', 'MMKV', 'Reanimated', 'Supabase'],
    theme: 'titan',
  },
  {
    id: 'campusiq',
    number: '02',
    title: 'CAMPUSIQ',
    subtitle: 'AI-Powered Academic & Placement Platform',
    description:
      'RVCE project using pgvector RAG, Dijkstra\'s algorithm, Whisper API, and MediaPipe for an end-to-end academic platform.',
    year: '2025\u20132026',
    status: 'IN DEVELOPMENT',
    statusColor: '#FFB800',
    highlights: [
      'Peer team under Dr. Krishnappa H K',
      'pgvector RAG pipeline',
      'Whisper + MediaPipe integration',
      'Dijkstra\'s pathfinding',
    ],
    stack: ['Next.js', 'Python', 'PostgreSQL', 'pgvector', 'Whisper', 'MediaPipe'],
    theme: 'campus',
  },
  {
    id: 'genx',
    number: '03',
    title: 'GENX BUILDS',
    subtitle: 'Custom PC Building Business',
    description:
      'Commission-based custom PC building from SP Road, Bangalore. Lead generation, sourcing, assembly, and delivery.',
    year: '2025\u20132026',
    status: 'OPERATIONAL',
    statusColor: '#FF6B1A',
    highlights: [
      'SP Road sourcing network',
      'Partnership with Smart Gaming Store',
      'End-to-end build service',
      'Commission-based model',
    ],
    stack: [],
    tags: ['LOGISTICS', 'SOURCING', 'CUSTOM BUILDS'],
    theme: 'genx',
  },
] as const;

export const ACHIEVEMENTS = [
  {
    title: 'META PYTORCH \u00d7 HUGGING FACE',
    subtitle: 'OpenEnv Hackathon \u2014 Finalist',
    description:
      'Built DispatchPulse \u2014 a reinforcement learning environment for 911 dispatch coordination using clinical survival curves as the reward function.',
    journey: 'Applied \u2192 Accepted \u2192 Finals',
    date: 'April 25\u201326, 2026 \u00b7 Scaler SST Bangalore',
    stats: ['70K+ APPLIED', '2K SELECTED'],
  },
];

export const EDUCATION = {
  institution: 'RVCE Bangalore',
  fullName: 'Rashtreeya Vidyalaya College of Engineering',
  degree: 'B.Tech Computer Science (Cyber Security)',
  semester: '4th Semester',
  years: '2024\u20132028',
};

export const CONTACT = {
  github: 'https://github.com/Arun-Sanjay',
  email: '',
  linkedin: '',
  phone: '6360363095',
  location: 'Bangalore, India',
  timezone: 'IST (UTC+5:30)',
};

export const TECH_STRIP =
  'PYTHON \u00b7 TYPESCRIPT \u00b7 REACT NATIVE \u00b7 NEXT.JS \u00b7 SUPABASE \u00b7 THREE.JS \u00b7 FRAMER MOTION \u00b7 GSAP \u00b7 TAILWIND \u00b7 POSTGRES';
