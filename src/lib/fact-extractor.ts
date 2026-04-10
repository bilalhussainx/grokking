// src/lib/fact-extractor.ts
// Extracts knowledge graph facts from conversation content.
// Uses rule-based pattern matching (fast, deterministic, no LLM cost).
// Called async after each agent interaction — does not block the response.

import { upsertFact } from "@/lib/knowledge-graph";
import type { AgentType } from "@/lib/agent-memory-store";

interface ExtractionContext {
  userId: string;
  agentType: AgentType;
  userMessage: string;
  assistantMessage: string;
  metadata?: Record<string, unknown>;
}

/**
 * Extract and store knowledge graph facts from a conversation turn.
 * Fire-and-forget — wrap calls in .catch(() => {}).
 */
export async function extractAndStoreFacts(ctx: ExtractionContext): Promise<void> {
  const facts = extractFacts(ctx);
  for (const fact of facts) {
    await upsertFact(ctx.userId, {
      subject: fact.subject,
      predicate: fact.predicate,
      object: fact.object,
      confidence: fact.confidence,
      sourceAgent: ctx.agentType,
      evidence: fact.evidence,
    });
  }
}

interface ExtractedFact {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  evidence: string;
}

/**
 * Rule-based fact extraction. Fast and deterministic.
 * Returns facts to be upserted into the knowledge graph.
 */
function extractFacts(ctx: ExtractionContext): ExtractedFact[] {
  const facts: ExtractedFact[] = [];
  const combined = `${ctx.userMessage} ${ctx.assistantMessage}`.toLowerCase();

  // --- Coach-specific patterns ---
  if (ctx.agentType === "coach") {
    const courseSlug = (ctx.metadata?.courseSlug as string) || "";
    const lessonSlug = (ctx.metadata?.lessonSlug as string) || "";

    // Detect struggle: assistant mentions "not quite", "close but", "try again"
    const strugglePatterns = [
      /not quite/i, /close,? but/i, /try again/i, /that's not right/i,
      /almost/i, /let me give you a hint/i, /common mistake/i,
    ];
    for (const pattern of strugglePatterns) {
      if (pattern.test(ctx.assistantMessage)) {
        const topic = lessonSlug || courseSlug;
        if (topic) {
          facts.push({
            subject: "user",
            predicate: "struggled_with",
            object: topic,
            confidence: 0.6,
            evidence: `Coach corrected user during ${lessonSlug} in ${courseSlug}`,
          });
        }
        break;
      }
    }

    // Detect mastery: assistant says "exactly", "perfect", "you got it"
    const masteryPatterns = [
      /exactly right/i, /perfect/i, /you got it/i, /well done/i,
      /that's correct/i, /nailed it/i,
    ];
    for (const pattern of masteryPatterns) {
      if (pattern.test(ctx.assistantMessage)) {
        const topic = lessonSlug || courseSlug;
        if (topic) {
          facts.push({
            subject: "user",
            predicate: "understands",
            object: topic,
            confidence: 0.7,
            evidence: `Coach confirmed understanding during ${lessonSlug}`,
          });
        }
        break;
      }
    }
  }

  // --- Interviewer-specific patterns ---
  if (ctx.agentType === "interviewer") {
    const companyId = (ctx.metadata?.companyId as string) || "";
    const inlineScore = ctx.metadata?.inlineScore as number | undefined;

    if (inlineScore !== undefined && inlineScore < 5) {
      const topic = (ctx.metadata?.questionTopic as string) || "interview_question";
      facts.push({
        subject: "user",
        predicate: "weak_at",
        object: topic,
        confidence: Math.min(0.9, (10 - inlineScore) / 10),
        evidence: `Scored ${inlineScore}/10 on ${topic} in ${companyId} interview`,
      });
    }

    if (inlineScore !== undefined && inlineScore >= 8) {
      const topic = (ctx.metadata?.questionTopic as string) || "interview_question";
      facts.push({
        subject: "user",
        predicate: "strong_at",
        object: topic,
        confidence: Math.min(1.0, inlineScore / 10),
        evidence: `Scored ${inlineScore}/10 on ${topic} in ${companyId} interview`,
      });
    }
  }

  // --- Language tutor-specific patterns ---
  if (ctx.agentType === "language_tutor") {
    const language = (ctx.metadata?.language as string) || "";
    const level = (ctx.metadata?.proficiencyLevel as string) || "";

    if (language && level) {
      facts.push({
        subject: "user",
        predicate: "speaks",
        object: `${language}:${level}`,
        confidence: 0.8,
        evidence: `Language tutor session at ${level} level`,
      });
    }
  }

  // --- Career coach patterns ---
  if (ctx.agentType === "career_coach") {
    // Detect target company mentions
    const companyPatterns = [
      /i want to (?:work at|join|apply to|interview at) (\w+)/i,
      /my target (?:company|employer) is (\w+)/i,
      /preparing for (\w+) interview/i,
    ];
    for (const pattern of companyPatterns) {
      const match = ctx.userMessage.match(pattern);
      if (match) {
        facts.push({
          subject: "user",
          predicate: "targets_company",
          object: match[1].toLowerCase(),
          confidence: 0.9,
          evidence: `User stated: "${ctx.userMessage.slice(0, 100)}"`,
        });
        break;
      }
    }

    // Detect target role mentions
    const rolePatterns = [
      /i want to (?:be|become) (?:a |an )?(.+?)(?:\.|$)/i,
      /my (?:target|dream|goal) (?:role|position|job) is (.+?)(?:\.|$)/i,
    ];
    for (const pattern of rolePatterns) {
      const match = ctx.userMessage.match(pattern);
      if (match) {
        facts.push({
          subject: "user",
          predicate: "targets_role",
          object: match[1].trim().toLowerCase().slice(0, 50),
          confidence: 0.9,
          evidence: `User stated: "${ctx.userMessage.slice(0, 100)}"`,
        });
        break;
      }
    }
  }

  void combined; // suppress unused variable warning
  return facts;
}
