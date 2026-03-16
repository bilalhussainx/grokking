import { Course } from "../types";
import { fundamentalsModule } from "./01-fundamentals";
import { reasoningModule } from "./02-reasoning";
import { advancedModule } from "./03-advanced";
import { applicationsModule } from "./04-applications";
import { modelSpecificModule } from "./05-model-specific";
import { safetyModule } from "./06-safety";
import { productionModule } from "./07-production";

export const promptEngineeringCourse: Course = {
  id: "prompt-engineering",
  slug: "prompt-engineering",
  title: "Prompt Engineering Masterclass",
  description:
    "Master the art and science of prompting LLMs. Covers zero-shot, few-shot, chain-of-thought, RAG, ReAct, model-specific strategies, safety, and production deployment.",
  icon: "\u2728",
  tier: "pro",
  modules: [
    fundamentalsModule,
    reasoningModule,
    advancedModule,
    applicationsModule,
    modelSpecificModule,
    safetyModule,
    productionModule,
  ],
};
