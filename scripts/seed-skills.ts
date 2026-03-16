/**
 * Seed skills taxonomy, course-skill mappings, and career roles.
 *
 * Run: npx tsx scripts/seed-skills.ts
 *
 * Prerequisites:
 * 1. SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 2. NEXT_PUBLIC_SUPABASE_URL in .env.local
 * 3. Run migration 009_skills_radar.sql in Supabase
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local manually (no dotenv dependency needed)
try {
  const envFile = readFileSync(".env.local", "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// Skills Taxonomy (~50 skills)
// ---------------------------------------------------------------------------

interface SkillEntry {
  skill_id: string;
  skill_name: string;
  skill_type: "technical" | "soft" | "tool";
  category: string;
  description: string;
}

const SKILLS: SkillEntry[] = [
  // Technical — Programming Languages
  { skill_id: "python", skill_name: "Python", skill_type: "technical", category: "Programming Languages", description: "General-purpose programming with Python" },
  { skill_id: "javascript", skill_name: "JavaScript", skill_type: "technical", category: "Programming Languages", description: "Client and server-side JavaScript programming" },
  { skill_id: "typescript", skill_name: "TypeScript", skill_type: "technical", category: "Programming Languages", description: "Typed JavaScript for scalable applications" },
  { skill_id: "cpp", skill_name: "C++", skill_type: "technical", category: "Programming Languages", description: "Systems programming with C++" },
  { skill_id: "csharp", skill_name: "C#", skill_type: "technical", category: "Programming Languages", description: ".NET ecosystem programming with C#" },
  // Technical — Web & Frameworks
  { skill_id: "react", skill_name: "React", skill_type: "technical", category: "Web & Frameworks", description: "Building UIs with React and component architecture" },
  { skill_id: "nodejs", skill_name: "Node.js", skill_type: "technical", category: "Web & Frameworks", description: "Server-side JavaScript with Node.js" },
  { skill_id: "nextjs", skill_name: "Next.js", skill_type: "technical", category: "Web & Frameworks", description: "Full-stack React framework" },
  { skill_id: "html-css", skill_name: "HTML/CSS", skill_type: "technical", category: "Web & Frameworks", description: "Web markup and styling" },
  { skill_id: "dom", skill_name: "DOM Manipulation", skill_type: "technical", category: "Web & Frameworks", description: "Browser DOM APIs and event handling" },
  { skill_id: "express", skill_name: "Express.js", skill_type: "technical", category: "Web & Frameworks", description: "Web server framework for Node.js" },
  // Technical — Data & Databases
  { skill_id: "sql", skill_name: "SQL", skill_type: "technical", category: "Data & Databases", description: "Relational database querying" },
  { skill_id: "mongodb", skill_name: "MongoDB", skill_type: "technical", category: "Data & Databases", description: "NoSQL document database" },
  { skill_id: "data-structures", skill_name: "Data Structures", skill_type: "technical", category: "Computer Science", description: "Arrays, trees, graphs, hash tables, and more" },
  { skill_id: "algorithms", skill_name: "Algorithms", skill_type: "technical", category: "Computer Science", description: "Sorting, searching, graph algorithms, dynamic programming" },
  // Technical — Architecture & DevOps
  { skill_id: "system-design", skill_name: "System Design", skill_type: "technical", category: "Architecture", description: "Designing scalable distributed systems" },
  { skill_id: "rest-apis", skill_name: "REST APIs", skill_type: "technical", category: "Architecture", description: "Designing and consuming RESTful APIs" },
  { skill_id: "graphql", skill_name: "GraphQL", skill_type: "technical", category: "Architecture", description: "Query language for APIs" },
  { skill_id: "docker", skill_name: "Docker", skill_type: "technical", category: "DevOps", description: "Containerization and container orchestration" },
  { skill_id: "ci-cd", skill_name: "CI/CD", skill_type: "technical", category: "DevOps", description: "Continuous integration and deployment pipelines" },
  { skill_id: "aws", skill_name: "AWS", skill_type: "technical", category: "DevOps", description: "Amazon Web Services cloud platform" },
  { skill_id: "testing", skill_name: "Testing", skill_type: "technical", category: "Engineering Practices", description: "Unit, integration, and end-to-end testing" },
  // Technical — CS Theory
  { skill_id: "oop", skill_name: "OOP", skill_type: "technical", category: "Computer Science", description: "Object-oriented programming principles" },
  { skill_id: "functional-programming", skill_name: "Functional Programming", skill_type: "technical", category: "Computer Science", description: "Functional programming paradigms" },
  { skill_id: "concurrency", skill_name: "Concurrency", skill_type: "technical", category: "Computer Science", description: "Multithreading, async, and parallel programming" },
  { skill_id: "dynamic-programming", skill_name: "Dynamic Programming", skill_type: "technical", category: "Computer Science", description: "DP patterns and optimization techniques" },
  // Technical — AI/ML
  { skill_id: "machine-learning", skill_name: "Machine Learning", skill_type: "technical", category: "AI/ML", description: "ML models, training, and evaluation" },
  { skill_id: "neural-networks", skill_name: "Neural Networks", skill_type: "technical", category: "AI/ML", description: "Deep learning architectures" },
  { skill_id: "prompt-engineering", skill_name: "Prompt Engineering", skill_type: "technical", category: "AI/ML", description: "Designing effective AI prompts" },
  { skill_id: "rag", skill_name: "RAG", skill_type: "technical", category: "AI/ML", description: "Retrieval-augmented generation systems" },
  { skill_id: "ai-agents", skill_name: "AI Agents", skill_type: "technical", category: "AI/ML", description: "Building autonomous AI agent systems" },
  { skill_id: "statistics", skill_name: "Statistics", skill_type: "technical", category: "Data Science", description: "Statistical analysis and inference" },
  // Tools
  { skill_id: "git", skill_name: "Git", skill_type: "tool", category: "Version Control", description: "Git version control and branching strategies" },
  { skill_id: "github", skill_name: "GitHub", skill_type: "tool", category: "Version Control", description: "GitHub workflows, PRs, and collaboration" },
  { skill_id: "vscode", skill_name: "VS Code", skill_type: "tool", category: "Editors", description: "Visual Studio Code editor and extensions" },
  { skill_id: "figma", skill_name: "Figma", skill_type: "tool", category: "Design", description: "UI/UX design and prototyping" },
  { skill_id: "postman", skill_name: "Postman", skill_type: "tool", category: "API Testing", description: "API testing and documentation" },
  { skill_id: "chrome-devtools", skill_name: "Chrome DevTools", skill_type: "tool", category: "Debugging", description: "Browser debugging and performance profiling" },
  { skill_id: "claude-code", skill_name: "Claude Code", skill_type: "tool", category: "AI Tools", description: "AI pair programming with Claude" },
  { skill_id: "mcp", skill_name: "MCP", skill_type: "tool", category: "AI Tools", description: "Model Context Protocol for AI tool integration" },
  // Soft Skills
  { skill_id: "problem-solving", skill_name: "Problem Solving", skill_type: "soft", category: "Cognitive", description: "Analytical thinking and structured problem solving" },
  { skill_id: "communication", skill_name: "Communication", skill_type: "soft", category: "Interpersonal", description: "Clear written and verbal communication" },
  { skill_id: "leadership", skill_name: "Leadership", skill_type: "soft", category: "Management", description: "Team leadership and decision making" },
  { skill_id: "project-management", skill_name: "Project Management", skill_type: "soft", category: "Management", description: "Planning, execution, and delivery of projects" },
  { skill_id: "critical-thinking", skill_name: "Critical Thinking", skill_type: "soft", category: "Cognitive", description: "Evaluating arguments and evidence objectively" },
  { skill_id: "negotiation", skill_name: "Negotiation", skill_type: "soft", category: "Interpersonal", description: "Negotiation tactics and influence" },
  // Finance Skills
  { skill_id: "financial-analysis", skill_name: "Financial Analysis", skill_type: "technical", category: "Finance", description: "Analyzing financial statements and metrics" },
  { skill_id: "accounting", skill_name: "Accounting", skill_type: "technical", category: "Finance", description: "Financial and managerial accounting principles" },
  { skill_id: "investment-analysis", skill_name: "Investment Analysis", skill_type: "technical", category: "Finance", description: "Evaluating investment opportunities" },
  { skill_id: "risk-management", skill_name: "Risk Management", skill_type: "technical", category: "Finance", description: "Identifying and mitigating financial risk" },
  { skill_id: "excel-modeling", skill_name: "Excel/Modeling", skill_type: "tool", category: "Finance Tools", description: "Financial modeling in Excel" },
  { skill_id: "blockchain", skill_name: "Blockchain", skill_type: "technical", category: "Finance", description: "Distributed ledger technology and crypto" },
];

// ---------------------------------------------------------------------------
// Course-to-Skill Mappings
// ---------------------------------------------------------------------------

interface CourseMapping {
  course_id: string;
  skills: string[];
}

const COURSE_SKILL_MAP: CourseMapping[] = [
  { course_id: "python-fundamentals", skills: ["python", "data-structures", "problem-solving", "oop"] },
  { course_id: "javascript-fundamentals", skills: ["javascript", "html-css", "dom", "problem-solving"] },
  { course_id: "react-development", skills: ["react", "javascript", "typescript", "html-css"] },
  { course_id: "nodejs-backend", skills: ["nodejs", "rest-apis", "sql", "mongodb", "express"] },
  { course_id: "mern-stack", skills: ["mongodb", "express", "react", "nodejs", "rest-apis"] },
  { course_id: "web-development", skills: ["html-css", "javascript", "dom", "git"] },
  { course_id: "cpp-fundamentals", skills: ["cpp", "data-structures", "oop", "problem-solving"] },
  { course_id: "csharp-fundamentals", skills: ["csharp", "oop", "problem-solving"] },
  { course_id: "coding-interview", skills: ["algorithms", "data-structures", "problem-solving"] },
  { course_id: "coding-interview-premium", skills: ["algorithms", "data-structures", "dynamic-programming", "problem-solving"] },
  { course_id: "system-design", skills: ["system-design", "aws", "docker", "rest-apis"] },
  { course_id: "advanced-system-design", skills: ["system-design", "aws", "docker", "ci-cd"] },
  { course_id: "modern-system-design", skills: ["system-design", "aws", "docker"] },
  { course_id: "data-structures-algorithms", skills: ["data-structures", "algorithms", "problem-solving"] },
  { course_id: "dp-patterns", skills: ["dynamic-programming", "algorithms", "problem-solving"] },
  { course_id: "ood-interview", skills: ["oop", "system-design", "problem-solving"] },
  { course_id: "ml-interview", skills: ["machine-learning", "python", "statistics"] },
  { course_id: "behavioral-interview", skills: ["communication", "leadership", "problem-solving"] },
  { course_id: "ds-interview", skills: ["data-structures", "algorithms", "problem-solving"] },
  { course_id: "api-design-interview", skills: ["rest-apis", "graphql", "system-design"] },
  { course_id: "concurrency-multithreading", skills: ["concurrency", "problem-solving"] },
  { course_id: "game-development", skills: ["csharp", "oop", "problem-solving"] },
  { course_id: "mcp-claude-code", skills: ["claude-code", "mcp", "typescript", "ai-agents"] },
  { course_id: "ai-agents", skills: ["ai-agents", "python", "prompt-engineering"] },
  { course_id: "prompt-engineering", skills: ["prompt-engineering", "critical-thinking"] },
  { course_id: "nn-zero-to-hero", skills: ["neural-networks", "python", "machine-learning"] },
  { course_id: "rag-engineering", skills: ["rag", "python", "ai-agents"] },
  { course_id: "claude-code-mastery", skills: ["claude-code", "mcp", "typescript"] },
  { course_id: "personal-finance", skills: ["financial-analysis", "risk-management", "critical-thinking"] },
  { course_id: "corporate-finance", skills: ["financial-analysis", "accounting", "excel-modeling"] },
  { course_id: "accounting-fundamentals", skills: ["accounting", "financial-analysis"] },
  { course_id: "investment-banking", skills: ["investment-analysis", "financial-analysis", "excel-modeling"] },
  { course_id: "quantitative-finance", skills: ["statistics", "python", "risk-management"] },
  { course_id: "fintech-blockchain", skills: ["blockchain", "python", "financial-analysis"] },
  { course_id: "stock-market-investing", skills: ["investment-analysis", "risk-management", "financial-analysis"] },
  { course_id: "financial-modeling", skills: ["excel-modeling", "financial-analysis", "accounting"] },
  { course_id: "microeconomics", skills: ["critical-thinking", "financial-analysis"] },
  { course_id: "macroeconomics", skills: ["critical-thinking", "financial-analysis", "statistics"] },
  { course_id: "business-strategy", skills: ["critical-thinking", "leadership", "communication"] },
  { course_id: "business-analytics", skills: ["statistics", "python", "critical-thinking"] },
  { course_id: "leadership-management", skills: ["leadership", "communication", "project-management"] },
  { course_id: "entrepreneurship", skills: ["leadership", "communication", "critical-thinking", "project-management"] },
  { course_id: "negotiation-influence", skills: ["negotiation", "communication", "critical-thinking"] },
];

// ---------------------------------------------------------------------------
// Career Roles
// ---------------------------------------------------------------------------

interface CareerRoleEntry {
  role_id: string;
  title: string;
  description: string;
  category: string;
  avg_salary_usd: number;
  growth_outlook: string;
  required_skills: string[];
}

const CAREER_ROLES: CareerRoleEntry[] = [
  {
    role_id: "frontend-developer",
    title: "Frontend Developer",
    description: "Build user interfaces and web experiences using modern frameworks",
    category: "Engineering",
    avg_salary_usd: 115000,
    growth_outlook: "Strong — growing demand for React/Next.js developers",
    required_skills: ["react", "javascript", "typescript", "html-css", "git", "testing"],
  },
  {
    role_id: "backend-developer",
    title: "Backend Developer",
    description: "Design and build server-side systems, APIs, and databases",
    category: "Engineering",
    avg_salary_usd: 127000,
    growth_outlook: "Strong — backend systems underpin all software products",
    required_skills: ["nodejs", "sql", "rest-apis", "docker", "system-design", "ci-cd", "git"],
  },
  {
    role_id: "full-stack-developer",
    title: "Full Stack Developer",
    description: "End-to-end development across frontend, backend, and infrastructure",
    category: "Engineering",
    avg_salary_usd: 135000,
    growth_outlook: "Very strong — companies value developers who can own entire features",
    required_skills: ["react", "javascript", "typescript", "nodejs", "sql", "rest-apis", "docker", "git", "html-css", "system-design"],
  },
  {
    role_id: "data-scientist",
    title: "Data Scientist",
    description: "Analyze data and build ML models to drive business decisions",
    category: "Data",
    avg_salary_usd: 140000,
    growth_outlook: "Very strong — AI/ML demand continues to accelerate",
    required_skills: ["python", "sql", "machine-learning", "statistics", "algorithms", "neural-networks"],
  },
  {
    role_id: "product-manager",
    title: "Product Manager",
    description: "Define product strategy, prioritize features, and align stakeholders",
    category: "Product",
    avg_salary_usd: 145000,
    growth_outlook: "Strong — every tech company needs product leadership",
    required_skills: ["communication", "leadership", "project-management", "critical-thinking", "problem-solving"],
  },
  {
    role_id: "finance-analyst",
    title: "Finance Analyst",
    description: "Analyze financial data, build models, and advise on investment decisions",
    category: "Finance",
    avg_salary_usd: 95000,
    growth_outlook: "Stable — core function in every organization",
    required_skills: ["financial-analysis", "accounting", "excel-modeling", "risk-management", "statistics", "critical-thinking"],
  },
];

// ---------------------------------------------------------------------------
// Main seeding function
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Seeding Skills Radar ===\n");

  // 1. Upsert skills taxonomy
  console.log(`Inserting ${SKILLS.length} skills...`);
  const { error: skillsError } = await supabase
    .from("skills_taxonomy")
    .upsert(SKILLS, { onConflict: "skill_id" });

  if (skillsError) {
    console.error("Failed to insert skills:", skillsError);
    process.exit(1);
  }
  console.log(`  Done: ${SKILLS.length} skills upserted.\n`);

  // 2. Upsert course-skill mappings
  const mappingRows = COURSE_SKILL_MAP.flatMap((cm) =>
    cm.skills.map((skillId) => ({
      course_id: cm.course_id,
      skill_id: skillId,
      relevance: 1.0,
    }))
  );
  console.log(`Inserting ${mappingRows.length} course-skill mappings...`);
  const { error: mapError } = await supabase
    .from("course_skill_map")
    .upsert(mappingRows, { onConflict: "course_id,skill_id" });

  if (mapError) {
    console.error("Failed to insert course-skill mappings:", mapError);
    process.exit(1);
  }
  console.log(`  Done: ${mappingRows.length} mappings upserted.\n`);

  // 3. Upsert career roles
  console.log(`Inserting ${CAREER_ROLES.length} career roles...`);
  const { error: rolesError } = await supabase
    .from("career_roles")
    .upsert(CAREER_ROLES, { onConflict: "role_id" });

  if (rolesError) {
    console.error("Failed to insert career roles:", rolesError);
    process.exit(1);
  }
  console.log(`  Done: ${CAREER_ROLES.length} roles upserted.\n`);

  console.log("=== Skills Radar seeding complete! ===");
  console.log(`  Skills: ${SKILLS.length}`);
  console.log(`  Course mappings: ${mappingRows.length}`);
  console.log(`  Career roles: ${CAREER_ROLES.length}`);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
