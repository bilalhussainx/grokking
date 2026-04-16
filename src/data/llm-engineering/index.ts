import { Course } from "../types";
import { module1 } from "./01-llm-apis-prompting";
import { module2 } from "./02-rag-agents";
import { module3 } from "./03-fine-tuning-peft";
import { module4 } from "./04-evaluation-production";
import { module5 } from "./05-langchain-langgraph";
import { module6 } from "./06-security-guardrails";

export const llmEngineeringCourse: Course = {
  id: "llm-engineering",
  slug: "llm-engineering",
  title: "LLM Engineering",
  description: "Build production AI systems: OpenAI and Anthropic APIs, advanced RAG pipelines, fine-tuning with LoRA/QLoRA, evaluation with RAGAS and LLM-as-judge, LangGraph agentic workflows, cost optimization with caching and model routing, and LLM security and guardrails.",
  icon: "🧠",
  tier: "pro",
  featured: true,
  domain: "computer-science",
  level: "advanced",
  prerequisiteIds: ["python-fundamentals"],
  modules: [
    module1,
    module2,
    module3,
    module4,
    module5,
    module6,
  ],
};
