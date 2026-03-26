export interface Pathway {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  roles: string[];
  courses: string[];
  interviewTypes: (
    | "technical"
    | "behavioral"
    | "system-design"
    | "recruiter-screen"
  )[];
  estimatedWeeks: number;
}

export const pathways: Pathway[] = [
  {
    id: "frontend-engineer",
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    description:
      "Master HTML, CSS, JavaScript, and React to build beautiful, performant user interfaces. This pathway covers everything from web fundamentals to modern component-driven development and interview preparation.",
    icon: "\uD83C\uDF10",
    color: "from-cyan-500 to-blue-500",
    roles: [
      "Frontend Engineer",
      "UI Developer",
      "React Developer",
      "Web Developer",
    ],
    courses: [
      "web-development",
      "javascript-fundamentals",
      "react-development",
      "coding-interview",
    ],
    interviewTypes: ["technical", "behavioral", "recruiter-screen"],
    estimatedWeeks: 12,
  },
  {
    id: "backend-engineer",
    slug: "backend-engineer",
    title: "Backend Engineer",
    description:
      "Build scalable server-side applications with Python and Node.js. Learn API design, system architecture, and how to ace backend-focused technical interviews.",
    icon: "\u2699\uFE0F",
    color: "from-emerald-500 to-teal-500",
    roles: [
      "Backend Engineer",
      "API Developer",
      "Platform Engineer",
      "Server-Side Developer",
    ],
    courses: [
      "python-fundamentals",
      "nodejs-backend",
      "system-design",
      "api-design-interview",
      "coding-interview",
    ],
    interviewTypes: ["technical", "system-design", "recruiter-screen"],
    estimatedWeeks: 14,
  },
  {
    id: "full-stack-developer",
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    description:
      "Go end-to-end: from React frontends to Node.js backends, databases, and deployment. The most versatile engineering pathway, covering the entire MERN stack and system design fundamentals.",
    icon: "\uD83D\uDCE6",
    color: "from-violet-500 to-purple-500",
    roles: [
      "Full Stack Developer",
      "Software Engineer",
      "MERN Stack Developer",
      "Product Engineer",
    ],
    courses: [
      "web-development",
      "javascript-fundamentals",
      "react-development",
      "nodejs-backend",
      "mern-stack",
      "system-design",
    ],
    interviewTypes: ["technical", "system-design", "behavioral", "recruiter-screen"],
    estimatedWeeks: 18,
  },
  {
    id: "ml-ai-engineer",
    slug: "ml-ai-engineer",
    title: "ML / AI Engineer",
    description:
      "From Python fundamentals to neural networks, RAG pipelines, and prompt engineering. This pathway prepares you to build and deploy machine learning systems and ace ML-focused interviews.",
    icon: "\uD83E\uDDE0",
    color: "from-pink-500 to-rose-500",
    roles: [
      "ML Engineer",
      "AI Engineer",
      "Data Scientist",
      "Applied Scientist",
      "NLP Engineer",
    ],
    courses: [
      "python-fundamentals",
      "ai-ml-fundamentals",
      "nn-zero-to-hero",
      "rag-engineering",
      "prompt-engineering",
      "ml-interview",
    ],
    interviewTypes: ["technical", "system-design", "recruiter-screen"],
    estimatedWeeks: 16,
  },
  {
    id: "dsa-mastery",
    slug: "dsa-mastery",
    title: "Data Structures & Algorithms",
    description:
      "The definitive pathway for coding interview preparation. Master arrays, trees, graphs, dynamic programming, and every pattern that top tech companies test for.",
    icon: "\uD83C\uDFAF",
    color: "from-amber-500 to-orange-500",
    roles: [
      "Software Engineer (any level)",
      "Competitive Programmer",
      "Tech Interview Candidate",
    ],
    courses: [
      "data-structures-algorithms",
      "dp-patterns",
      "grokking-dsa-python",
      "coding-interview",
      "coding-interview-premium",
    ],
    interviewTypes: ["technical"],
    estimatedWeeks: 14,
  },
  {
    id: "system-design-specialist",
    slug: "system-design-specialist",
    title: "System Design Specialist",
    description:
      "Design distributed systems at scale. From fundamentals through advanced topics like consensus protocols, API design, and concurrency. Essential for senior engineering roles.",
    icon: "\uD83C\uDFD7\uFE0F",
    color: "from-sky-500 to-indigo-500",
    roles: [
      "Senior Software Engineer",
      "Staff Engineer",
      "Solutions Architect",
      "Platform Engineer",
    ],
    courses: [
      "system-design",
      "advanced-system-design",
      "modern-system-design",
      "api-design-interview",
      "concurrency-multithreading",
    ],
    interviewTypes: ["system-design", "technical"],
    estimatedWeeks: 14,
  },
  {
    id: "finance-professional",
    slug: "finance-professional",
    title: "Finance Professional",
    description:
      "Build a comprehensive finance foundation: personal finance, corporate finance, accounting, investment banking, quantitative methods, financial modeling, and stock market investing.",
    icon: "\uD83D\uDCB0",
    color: "from-green-500 to-emerald-500",
    roles: [
      "Financial Analyst",
      "Investment Banker",
      "Portfolio Manager",
      "Quantitative Analyst",
      "CFO",
    ],
    courses: [
      "personal-finance",
      "corporate-finance",
      "accounting-fundamentals",
      "investment-banking",
      "quantitative-finance",
      "financial-modeling",
      "stock-market-investing",
    ],
    interviewTypes: ["technical", "behavioral", "recruiter-screen"],
    estimatedWeeks: 20,
  },
  {
    id: "cybersecurity-analyst",
    slug: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    description:
      "Learn ethical hacking techniques and the Python scripting skills needed to automate security workflows. A focused pathway for breaking into the cybersecurity field.",
    icon: "\uD83D\uDD12",
    color: "from-red-500 to-rose-500",
    roles: [
      "Cybersecurity Analyst",
      "Penetration Tester",
      "Security Engineer",
      "SOC Analyst",
    ],
    courses: ["ethical-hacking", "python-fundamentals"],
    interviewTypes: ["technical", "behavioral", "recruiter-screen"],
    estimatedWeeks: 8,
  },
  {
    id: "tech-lead",
    slug: "tech-lead",
    title: "Tech Lead / Engineering Manager",
    description:
      "Transition from individual contributor to technical leader. Covers system design thinking, behavioral interview mastery, leadership skills, and negotiation techniques.",
    icon: "\uD83D\uDE80",
    color: "from-yellow-500 to-amber-500",
    roles: [
      "Tech Lead",
      "Engineering Manager",
      "VP of Engineering",
      "Principal Engineer",
    ],
    courses: [
      "system-design",
      "behavioral-interview",
      "leadership-management",
      "leadership-growth",
      "negotiation-influence",
    ],
    interviewTypes: ["behavioral", "system-design", "recruiter-screen"],
    estimatedWeeks: 12,
  },
  {
    id: "product-manager",
    slug: "product-manager",
    title: "Product Manager",
    description:
      "Develop the strategic thinking, analytical skills, and communication abilities needed to lead product teams. Covers business strategy, analytics, behavioral interviews, and entrepreneurship.",
    icon: "\uD83D\uDCCB",
    color: "from-fuchsia-500 to-pink-500",
    roles: [
      "Product Manager",
      "Product Owner",
      "Program Manager",
      "Business Analyst",
    ],
    courses: [
      "business-strategy",
      "business-analytics",
      "behavioral-interview",
      "entrepreneurship",
    ],
    interviewTypes: ["behavioral", "recruiter-screen"],
    estimatedWeeks: 10,
  },
];

export function getPathwayBySlug(slug: string): Pathway | undefined {
  return pathways.find((p) => p.slug === slug);
}

export function getPathwaysForCourse(courseSlug: string): Pathway[] {
  return pathways.filter((p) => p.courses.includes(courseSlug));
}
