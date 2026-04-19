import { createAdminSupabase } from "@/lib/supabase-server";

export interface EssayContext {
  studentName: string;
  activities: string[];
  honors: string[];
  academicHighlights: string;
  essayType: string;
  promptText: string;
  wordLimit: number;
  brainstormTranscript: { role: string; content: string }[] | null;
  outlineJson: Record<string, unknown> | null;
  currentDraft: string | null;
}

export async function buildEssayContext(
  userId: string,
  essayId: string
): Promise<EssayContext | null> {
  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name, legal_first_name")
    .eq("user_id", userId)
    .single();

  if (!profile) return null;

  const { data: essay } = await db
    .from("cc_essays")
    .select("*")
    .eq("id", essayId)
    .eq("student_id", profile.id)
    .single();

  if (!essay) return null;

  const { data: activities } = await db
    .from("cc_activities")
    .select("activity_type, organization, role, description_150")
    .eq("student_id", profile.id)
    .order("position");

  const { data: honors } = await db
    .from("cc_honors")
    .select("title, level, description_100")
    .eq("student_id", profile.id)
    .order("position");

  const { data: academics } = await db
    .from("cc_academic_profiles")
    .select("gpa_unweighted, sat_total, act_composite, ap_ib_courses")
    .eq("student_id", profile.id)
    .single();

  const activityList = (activities || []).map(
    (a) => `${a.role || a.activity_type} at ${a.organization}: ${a.description_150 || ""}`
  );

  const honorList = (honors || []).map(
    (h) => `${h.title} (${h.level}): ${h.description_100 || ""}`
  );

  let academicHighlights = "";
  if (academics) {
    const parts: string[] = [];
    if (academics.gpa_unweighted) parts.push(`GPA: ${academics.gpa_unweighted}`);
    if (academics.sat_total) parts.push(`SAT: ${academics.sat_total}`);
    if (academics.act_composite) parts.push(`ACT: ${academics.act_composite}`);
    if (academics.ap_ib_courses && Array.isArray(academics.ap_ib_courses)) {
      parts.push(`AP/IB: ${(academics.ap_ib_courses as string[]).length} courses`);
    }
    academicHighlights = parts.join(", ");
  }

  return {
    studentName: profile.preferred_name || profile.legal_first_name || "Student",
    activities: activityList,
    honors: honorList,
    academicHighlights,
    essayType: essay.essay_type || "personal_statement",
    promptText: essay.prompt_text || "",
    wordLimit: essay.word_limit || 650,
    brainstormTranscript: essay.brainstorm_transcript as { role: string; content: string }[] | null,
    outlineJson: essay.outline_json as Record<string, unknown> | null,
    currentDraft: essay.current_draft,
  };
}

export function getBrainstormSystemPrompt(ctx: EssayContext): string {
  const activityBlock = ctx.activities.length > 0
    ? `\nStudent's activities:\n${ctx.activities.map((a) => `- ${a}`).join("\n")}`
    : "";
  const honorBlock = ctx.honors.length > 0
    ? `\nStudent's honors:\n${ctx.honors.map((h) => `- ${h}`).join("\n")}`
    : "";

  return `You are a college essay brainstorm coach helping ${ctx.studentName} write a ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental essay"}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Ask ONE question per message to help the student discover their story
2. Never write prose, paragraphs, or essay text
3. Theme summaries must be under 15 words
4. Reference the student's actual activities and experiences
5. After 5-7 exchanges, summarize 2-3 themes as short labels (e.g. "Theme: resilience through robotics setback")
6. Let the student choose which theme to develop
${activityBlock}${honorBlock}${ctx.academicHighlights ? `\nAcademics: ${ctx.academicHighlights}` : ""}`;
}

export function getOutlineSystemPrompt(ctx: EssayContext): string {
  return `You are a college essay outline coach. Generate 3 structural outline options for ${ctx.studentName}'s chosen theme.

Essay type: ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental"}
Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Each outline has 3-5 sections (hook, development, reflection)
2. Each bullet is a structural direction, not prose — max 15 words
3. Include a suggested wordBudget per section totaling ${ctx.wordLimit}
4. Never write actual essay sentences
5. Use the student's real experiences

Return valid JSON only:
{
  "outlines": [
    {
      "title": "Option A: ...",
      "sections": [
        { "label": "Hook", "bullets": ["..."], "wordBudget": 80 },
        { "label": "Development", "bullets": ["..."], "wordBudget": 400 },
        { "label": "Reflection", "bullets": ["..."], "wordBudget": 170 }
      ]
    }
  ]
}`;
}

export function getQuickCheckSystemPrompt(ctx: EssayContext): string {
  return `You are reviewing a college essay draft in progress for ${ctx.studentName}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Give 1-3 brief structural observations
2. Never rewrite any sentence
3. Never suggest specific words or phrases longer than 15 words
4. Frame feedback as questions when possible
5. If the draft is strong, say so briefly`;
}

export function getReviewSystemPrompt(ctx: EssayContext): string {
  return `You are a college essay reviewer analyzing ${ctx.studentName}'s draft.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Reference specific paragraphs by number (0-indexed)
2. Never rewrite sentences — point out issues and ask questions
3. Check for: prompt fit, structure, voice consistency, cliches, "show don't tell", word count
4. Example snippets must be under 15 words
5. Be encouraging — highlight what works

Return valid JSON only:
{
  "comments": [
    {
      "paragraphIndex": 0,
      "type": "structure",
      "text": "Your observation here",
      "severity": "positive"
    }
  ],
  "overallNotes": "Brief summary",
  "wordCount": 0,
  "promptFitScore": 0.85
}`;
}
