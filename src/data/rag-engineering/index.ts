import { Course } from "../types";
import { ragFundamentalsModule } from "./01-rag-fundamentals";
import { queryEnhancementModule } from "./02-query-enhancement";
import { retrievalAdvancedModule } from "./03-retrieval-advanced";
import { contextEnrichmentModule } from "./04-context-enrichment";
import { advancedArchitecturesModule } from "./05-advanced-architectures";
import { productionRagModule } from "./06-production-rag";

export const ragEngineeringCourse: Course = {
  id: "rag-engineering",
  slug: "rag-engineering",
  title: "RAG Engineering: Build Production Retrieval Systems",
  description:
    "Master Retrieval-Augmented Generation from fundamentals to production. Learn vector databases, chunking strategies, query enhancement, hybrid search, reranking, Graph RAG, RAPTOR, Self-RAG, CRAG, and production deployment. Based on the RAG Techniques repository (25.9k stars).",
  icon: "\u{1F4DA}",
  tier: "pro",
  modules: [
    ragFundamentalsModule,
    queryEnhancementModule,
    retrievalAdvancedModule,
    contextEnrichmentModule,
    advancedArchitecturesModule,
    productionRagModule,
  ],
};
