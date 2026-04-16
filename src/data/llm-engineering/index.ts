import { Course } from "../types";
import { module1 } from "./01-llm-apis-prompting";
import { module2 } from "./02-rag-agents";

export const llmEngineeringCourse: Course = {
  id: "llm-engineering",
  slug: "llm-engineering",
  title: "LLM Engineering",
  description: "Build production AI systems: OpenAI and Anthropic APIs, advanced prompt engineering, RAG pipelines with vector databases, function calling, and agentic systems that reason and act.",
  icon: "🧠",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "advanced",
  prerequisiteIds: ["python-fundamentals"],
  modules: [
    module1,
    module2,
  ],
};
