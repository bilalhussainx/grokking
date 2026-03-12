import { getGeminiModel } from "./gemini";
import type { StageName } from "@/types/writing";

export const WRITING_AGENT_PROMPTS: Record<StageName, string> = {
  outline: `You are an expert writing planner for the Grokking educational platform.
Given a topic, document type, and any requirements, create a detailed outline.

RULES:
- Create a clear thesis statement
- Break the document into logical sections with 2-4 key points each
- Estimate word count per section
- Be specific — vague outlines produce vague writing

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no code blocks, just raw JSON):
{
  "thesis": "<clear thesis statement>",
  "sections": [
    { "title": "<section title>", "keyPoints": ["<point 1>", "<point 2>"], "estimatedWords": <number> }
  ],
  "totalEstimatedWords": <number>
}`,

  research: `You are a research assistant for the Grokking educational platform.
Given an approved outline, gather supporting evidence for each section.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "sections": [
    { "title": "<section title>", "evidence": ["<evidence>"], "sources": ["<source>"], "needsPersonalInput": false, "personalInputPrompt": "" }
  ]
}`,

  draft: `You are a skilled writer for the Grokking educational platform.
Given an approved outline and research, write a complete first draft.

Write in clear, accessible prose. Use markdown formatting. Mark places needing student input with [STUDENT INPUT: description].

RESPOND IN THIS EXACT JSON FORMAT:
{
  "content": "<full markdown draft>",
  "wordCount": <number>,
  "inputsNeeded": ["<description>"]
}`,

  refine: `You are an editor for the Grokking educational platform.
Given a draft and optional teacher feedback, refine the writing. Address all feedback points. Improve clarity and flow.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "content": "<refined markdown>",
  "changes": ["<change description>"],
  "wordCount": <number>
}`,

  final: `You are a final copy editor for the Grokking educational platform.
Do a final polish pass. Fix all remaining issues. Make it publication-ready.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "content": "<final polished markdown>",
  "wordCount": <number>,
  "readabilityScore": <1-10>,
  "finalNotes": "<notes>"
}`,
};

export const WRITING_REVIEW_PROMPT = `You are a writing instructor. Analyze the student's writing and provide specific inline feedback.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "comments": [
    { "content": "<feedback>", "selectionFrom": <start>, "selectionTo": <end>, "category": "<grammar|clarity|flow|content|style|structure>", "severity": "<suggestion|warning|error>" }
  ],
  "overallFeedback": "<summary>",
  "score": <0-100>
}`;

export const WRITING_IMPROVE_PROMPT = `You are a writing assistant. Improve the selected passage following the instruction. Respond with ONLY the improved text.`;

export async function executeWritingStage(
  stageName: StageName,
  context: {
    topic?: string;
    docType?: string;
    requirements?: string;
    previousStageOutputs?: Record<string, unknown>;
    teacherFeedback?: string;
  }
): Promise<Record<string, unknown>> {
  const systemPrompt = WRITING_AGENT_PROMPTS[stageName];
  const model = getGeminiModel(systemPrompt);

  let userPrompt = "";

  switch (stageName) {
    case "outline":
      userPrompt = `Topic: ${context.topic || "Not specified"}\nDocument Type: ${context.docType || "essay"}\nRequirements: ${context.requirements || "None"}`;
      break;
    case "research":
      userPrompt = `Approved Outline:\n${JSON.stringify(context.previousStageOutputs?.outline || {}, null, 2)}\nTopic: ${context.topic || ""}`;
      break;
    case "draft":
      userPrompt = `Approved Outline:\n${JSON.stringify(context.previousStageOutputs?.outline || {}, null, 2)}\nResearch:\n${JSON.stringify(context.previousStageOutputs?.research || {}, null, 2)}\nDocument Type: ${context.docType || "essay"}`;
      break;
    case "refine":
      userPrompt = `Current Draft:\n${JSON.stringify(context.previousStageOutputs?.draft || {}, null, 2)}\n${context.teacherFeedback ? `Teacher Feedback:\n${context.teacherFeedback}` : "No specific feedback."}`;
      break;
    case "final":
      userPrompt = `Refined Draft:\n${JSON.stringify(context.previousStageOutputs?.refine || {}, null, 2)}`;
      break;
  }

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { raw: text, error: "Failed to parse AI response as JSON" };
  }
}

export async function reviewWriting(content: string, docType: string, focusAreas?: string[]): Promise<Record<string, unknown>> {
  const model = getGeminiModel(WRITING_REVIEW_PROMPT);
  const prompt = `Document Type: ${docType}\n${focusAreas?.length ? `Focus Areas: ${focusAreas.join(", ")}` : ""}\n\nStudent's Writing:\n${content}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { comments: [], overallFeedback: text, score: 0 };
  }
}

export async function improveWriting(fullContent: string, selectedText: string, instruction: string): Promise<string> {
  const model = getGeminiModel(WRITING_IMPROVE_PROMPT);
  const prompt = `Full Document:\n${fullContent}\n\nSelected Passage:\n"${selectedText}"\n\nInstruction: ${instruction}`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
