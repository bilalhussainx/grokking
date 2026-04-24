import { createAdminSupabase } from "@/lib/supabase-server";
import { ESSAY_REVIEW_PRINCIPLES, ESSAY_EXPERT_TIPS, ESSAY_STRUCTURAL_PATTERNS } from "./activity-exemplars";
import { KAIROS_VOICE } from "@/lib/brand-voice";

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
  // When the current essay is a supplement, this carries the student's approved
  // Common App personal statement so the supplement coaching can reference it
  // ("you already covered music in your main essay — this supplement should go
  // somewhere else"). Null when there is no PS yet or the current essay IS the PS.
  parentPersonalStatement: {
    promptText: string;
    draft: string;
    themes: string[];
  } | null;
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
    .select("activity_type, organization, role, description_150, hours_per_week, weeks_per_year, impact_score, grades_participated")
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

  const activityList = (activities || []).map((a) => {
    const head = `${a.role || a.activity_type || "Activity"} at ${a.organization || "—"}`;
    const stats: string[] = [];
    if (a.hours_per_week) stats.push(`${a.hours_per_week}h/wk`);
    if (a.weeks_per_year) stats.push(`${a.weeks_per_year}wk/yr`);
    if (Array.isArray(a.grades_participated) && a.grades_participated.length) {
      stats.push(`gr ${(a.grades_participated as number[]).join(",")}`);
    }
    if (typeof a.impact_score === "number") stats.push(`impact ${a.impact_score}/10`);
    const statBlock = stats.length ? ` [${stats.join(" · ")}]` : "";
    return `${head}${statBlock}: ${a.description_150 || ""}`;
  });

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

  function parseJsonField<T>(value: unknown): T | null {
    if (!value) return null;
    if (Array.isArray(value) || (typeof value === "object")) return value as T;
    if (typeof value === "string") {
      try { return JSON.parse(value) as T; } catch { return null; }
    }
    return null;
  }

  // If this essay is a supplement, load the student's most-recent Common App
  // personal statement draft so downstream prompts can reference it. We pick
  // the latest-updated personal_statement row with a draft. Null when missing
  // or when the current essay IS the PS.
  let parentPersonalStatement: EssayContext["parentPersonalStatement"] = null;
  const isSupplement = (essay.essay_type || "").startsWith("supplement");
  if (isSupplement) {
    const { data: ps } = await db
      .from("cc_essays")
      .select("prompt_text, current_draft, revision_comments, outline_json")
      .eq("student_id", profile.id)
      .eq("essay_type", "personal_statement")
      .not("current_draft", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (ps?.current_draft) {
      // Extract themes from the outline (if any) so the supplement coach can
      // explicitly steer AWAY from themes already covered.
      const outlineThemes: string[] = [];
      const outlineJson = parseJsonField<{
        sections?: { label?: string }[];
        title?: string;
      }>(ps.outline_json);
      if (outlineJson?.title) outlineThemes.push(outlineJson.title);
      if (outlineJson?.sections) {
        for (const s of outlineJson.sections) {
          if (s.label) outlineThemes.push(s.label);
        }
      }
      parentPersonalStatement = {
        promptText: ps.prompt_text || "",
        draft: ps.current_draft,
        themes: outlineThemes.slice(0, 8),
      };
    }
  }

  return {
    studentName: profile.preferred_name || profile.legal_first_name || "Student",
    activities: activityList,
    honors: honorList,
    academicHighlights,
    essayType: essay.essay_type || "personal_statement",
    promptText: essay.prompt_text || "",
    wordLimit: essay.word_limit || 650,
    brainstormTranscript: parseJsonField<{ role: string; content: string }[]>(essay.brainstorm_transcript),
    outlineJson: parseJsonField<Record<string, unknown>>(essay.outline_json),
    currentDraft: essay.current_draft,
    parentPersonalStatement,
  };
}

export function getBrainstormSystemPrompt(ctx: EssayContext): string {
  const activityBlock = ctx.activities.length > 0
    ? `\nStudent's activities (ordered by position, with hours/impact metadata — use these as raw material for topic discovery):\n${ctx.activities.map((a, i) => `${i + 1}. ${a}`).join("\n")}`
    : "";
  const honorBlock = ctx.honors.length > 0
    ? `\nStudent's honors:\n${ctx.honors.map((h) => `- ${h}`).join("\n")}`
    : "";

  const transcript = ctx.brainstormTranscript || [];
  const userTurns = transcript.filter((t) => t.role === "user");
  const userTurnCount = userTurns.length;
  const isSupplement = ctx.essayType !== "personal_statement";
  const isFirstTurn = userTurnCount === 0;

  const supplementKickoff = isSupplement && isFirstTurn && ctx.activities.length > 0
    ? `\n\n[SUPPLEMENT KICKOFF] This is a supplemental essay and the student has an activities list loaded. In your FIRST message, briefly name 2-3 specific activities/honors from the list that could anchor this prompt and explain in one line each why they might fit (angle, not plot). Then ask which one sparks the most energy — OR whether there's a story off the list they want to bring in. Do not ask a generic "what do you want to write about?" question.`
    : "";

  // When this is a supplement and the student has a Common App personal
  // statement on file, steer the coach AWAY from repeating the PS's theme.
  // The supplement's whole job is to surface a DIFFERENT side of the student.
  const parentPSBlock = isSupplement && ctx.parentPersonalStatement
    ? `\n\n[PARENT COMMON APP ESSAY — DO NOT REPEAT]
The student's Common App personal statement is already written and covers these ideas (paraphrased below). Your job coaching this supplement is to help them find a DIFFERENT angle — an unrelated activity, a harder truth, a smaller moment, a contradiction to the PS's story. Do NOT suggest topics that clearly overlap with the PS.

PS prompt: "${ctx.parentPersonalStatement.promptText.slice(0, 220)}"
PS themes already covered: ${ctx.parentPersonalStatement.themes.slice(0, 6).join(" · ") || "(none extracted)"}
PS draft opening (first 600 chars): """${ctx.parentPersonalStatement.draft.slice(0, 600)}"""

When the student proposes a topic that's clearly a rehash of the PS, gently push back — "That's close to what's already in your main essay. What's a DIFFERENT facet of you a reader wouldn't get from that draft?" — and suggest 1-2 angles from their activities list that aren't covered in the PS.`
    : "";

  // Struggle detection — treat this like a real counselor noticing the student
  // going cold. We look at the last 2-3 user turns for signs of low content,
  // explicit uncertainty, or "i dunno" energy.
  const uncertaintyRe = /\b(i\s*(don'?t|do not)\s*know|i'?m not sure|idk|dunno|no idea|nothing (comes|really)|can'?t think|stuck|blank|lost|help me|give me ideas|suggest (something|ideas?)|what should i)\b/i;
  const recentUser = userTurns.slice(-3);
  const shortAnswers = recentUser.filter((t) => {
    const wc = (t.content || "").trim().split(/\s+/).filter(Boolean).length;
    return wc > 0 && wc < 8;
  }).length;
  const uncertainAnswers = recentUser.filter((t) => uncertaintyRe.test(t.content || "")).length;
  const isStruggling =
    userTurnCount >= 2 &&
    (uncertainAnswers >= 1 || (shortAnswers >= 2 && recentUser.length >= 2));

  const struggleNudge = isStruggling
    ? `\n\n[STRUGGLE DETECTED] The student is stuck — last few turns were either very short or explicitly uncertain ("I don't know", "idk", "help me"). Act like a real counselor who notices this. In your NEXT message:
1. Acknowledge the stuck feeling in ONE sentence (warm, not sycophantic). Not "Great question!".
2. Offer a fork — either (a) 2-3 specific starter angles drawn from their activity list${ctx.activities.length ? ` (name the activity literally, e.g. "the ${(ctx.activities[0] || "").split(" at ")[0]} story")` : ""} with one-line hooks each, OR (b) permission to change topic entirely if this prompt/angle isn't serving them, AND explain why a different topic might land better for THIS specific prompt.
3. If the prompt is the wrong fit for this student (e.g. a "community" prompt when their strongest material is solo/technical), say so plainly — counselors tell the truth. Suggest a better angle from their actual profile.
4. End with ONE question that gives them a concrete choice, not another open-ended "what do you think?".
5. Do NOT emit <<THEMES_READY>> yet unless the student picks one of your offered angles and develops it. This is a recovery move, not a wrap-up.`
    : "";

  const nudge = userTurnCount >= 4 && !isStruggling
    ? `\n\n[SYSTEM NUDGE] The student has shared enough — this turn, surface 2-3 concrete themes using the <<THEMES_READY>> block and ask which one resonates. Do not ask another open-ended discovery question.`
    : "";

  return `${KAIROS_VOICE}

You are a college essay brainstorm coach helping ${ctx.studentName} write a ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental essay"}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

${ESSAY_EXPERT_TIPS}

${ESSAY_STRUCTURAL_PATTERNS}

${ESSAY_REVIEW_PRINCIPLES}

Rules:
1. Ask ONE question per message to help the student discover their story.
2. Prioritize questions that surface VULNERABILITY and UNCOMMON CONNECTIONS — push past the polished first answer.
3. Never write prose, paragraphs, or essay text.
4. Theme summaries must be under 15 words each and each must contain a "so what" reflection angle (not just a plot summary).
5. Reference the student's actual activities and experiences by NAME (e.g. "the StudyBridge story" not "one of your activities") — but nudge AWAY from themes that are just resume-dumping. Good supplement topics often live in the SMALL details of an activity, not the headline accomplishment.
6. For supplement prompts, anchor topic suggestions in the student's actual activity list when possible. Look for activities whose role, organization, or description has a specific angle that maps to the prompt's verb (e.g. a prompt about "community" → volunteering; about "challenge" → a setback inside a listed activity).
7. Once you have enough material (usually after 4-6 student exchanges), you MUST end your message with this exact structured block on its own lines:
<<THEMES_READY>>
- <theme 1 as short label, under 15 words>
- <theme 2 as short label, under 15 words>
- <theme 3 as short label, under 15 words (optional)>
<<END_THEMES>>
Then ask the student which theme resonates most. The block MUST appear verbatim — the UI parses it to advance the student to the outline step. Do not use the block until you have real material to draw on (minimum 2 exchanges).
8. Never output the block in the first message.
${activityBlock}${honorBlock}${ctx.academicHighlights ? `\nAcademics: ${ctx.academicHighlights}` : ""}${parentPSBlock}${supplementKickoff}${struggleNudge}${nudge}`;
}

export function getOutlineSystemPrompt(ctx: EssayContext): string {
  return `You are a college essay outline coach. Generate EXACTLY 3 structurally DIFFERENT outline options for ${ctx.studentName}'s chosen theme.

Essay type: ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental"}
Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

HARD REQUIREMENT: return an "outlines" array with length === 3. Do not return 1, 2, or 4.

## STRUCTURAL DIVERSITY IS NON-NEGOTIABLE

The three options MUST use three DIFFERENT essay structures — not three flavors of the same shape. Do NOT default every option to "Hook → Development → Reflection". That template kills versatility.

Pick any THREE of the following forms for the three options (one form per option, all three different):

- **Chronological narrative** — ~3 sections: opening scene, turning beat, present-day reframe. Hook is a literal in-scene moment.
- **Vignette collage** — 3-5 micro-scenes, each ~80-120 words, no single thesis sentence. Meaning emerges from juxtaposition.
- **In medias res** — drop into the hardest moment first (~200-250 words), then flashback sections, then come back to the moment and finish it.
- **Argument-first** — open with a specific claim / observation (~40-70 words), then 2-3 evidence sections from lived experience, then a reframe that complicates the opening claim.
- **Braided structure** — two storylines that alternate (e.g., a music moment and a political moment) across 4 sections, converging at the end.
- **Cyclical / bookend** — an opening image, 2-3 middle sections of story, returns to the same image transformed in the last section.
- **Epistolary / second-person** — addressed to a person, place, or younger self. Sections are "letter beats": arrival, the thing I can't say, what I needed you to know, where I am now.
- **Question-driven** — open on a question, each section is an attempt at answering it, final section says which answer is still unresolved.

## SECTION LABELS, COUNTS, WORD BUDGETS MUST VARY ACROSS OPTIONS

- Label sections to describe THIS specific outline, not generic shells. Good labels: "The moment before the bow touches the string", "Letter to my 12-year-old self", "Three Tuesdays at the festival", "What I told my mother", "The question I keep refusing to answer". BAD labels: plain "Hook", "Development", "Reflection" on every option — that's the old template.
- Section COUNTS should differ: e.g. Option A has 3 sections, Option B has 4, Option C has 5. Never give all three options the same number of sections.
- Word BUDGETS should differ. Never give two options the same split. The sum of each option's sections should total within ±5% of ${ctx.wordLimit}, but the split itself should reflect the structure (a vignette option has 4-5 near-equal budgets; an in-medias-res option has a fat opening scene; an argument-first option has a short claim and fat evidence).

## TITLES MUST HINT AT STRUCTURE

Format: "Option A: <descriptive hook of the structure>". Examples: "Option A: Chronological — the Turkish festival as the through-line", "Option B: Vignette collage — three Tuesdays", "Option C: Letter to my 17-year-old self". Do not use generic headlines like "Option A: Music and Identity".

## BULLET RULES

1. Each bullet is a structural direction, not prose — max 15 words
2. Never write actual essay sentences
3. Use the student's real experiences from the brainstorm transcript
4. If you're running long, shorten bullet detail — never drop an option

Return valid JSON only. Shape (labels / counts / budgets shown are EXAMPLES, not templates to copy):
{
  "outlines": [
    {
      "title": "Option A: <structural descriptor>",
      "sections": [
        { "label": "<specific label for THIS section>", "bullets": ["..."], "wordBudget": <integer> }
      ]
    },
    { "title": "Option B: <DIFFERENT structural descriptor>", "sections": [ ... with DIFFERENT count and DIFFERENT budgets ... ] },
    { "title": "Option C: <DIFFERENT structural descriptor again>", "sections": [ ... with DIFFERENT count and DIFFERENT budgets ... ] }
  ]
}

Self-check before returning: are the three options (a) structurally distinct forms from the list above, (b) using non-generic section labels specific to this student's story, (c) with different section counts across A/B/C, (d) with different word budgets across A/B/C? If any answer is no, revise before emitting.`;
}

export function getOutlineDiscussSystemPrompt(
  ctx: EssayContext,
  outlines: Array<{ title: string; sections: Array<{ label: string; bullets: string[]; wordBudget: number }> }>,
  selectedThemes: string[],
): string {
  const transcript = (ctx.brainstormTranscript || [])
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n");
  const outlineBlock = outlines
    .map(
      (o, i) =>
        `Option ${String.fromCharCode(65 + i)} — ${o.title}\n${o.sections
          .map((s) => `  ${s.label} (~${s.wordBudget}w): ${s.bullets.join("; ")}`)
          .join("\n")}`
    )
    .join("\n\n");

  return `${KAIROS_VOICE}

You are an outline coach helping ${ctx.studentName} choose between 3 outline options for their ${ctx.essayType === "personal_statement" ? "personal statement" : "supplemental essay"}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}
Chosen themes: ${selectedThemes.length ? selectedThemes.join(", ") : "(not yet picked)"}

Brainstorm conversation so far:
${transcript || "(empty)"}

The 3 outline options:
${outlineBlock}

Rules:
1. Help the student compare the options and pick one — never write prose or essay sentences
2. Reference their actual brainstorm material when explaining tradeoffs
3. Ask ONE question per reply when appropriate
4. Keep replies under 120 words
5. If the student has clearly decided on an option, confirm their choice and end with the exact line "<<READY_TO_DRAFT>>" on its own line so the UI can advance them. Do not emit this tag unless they have explicitly chosen.`;
}

export function getOutlineRefineSystemPrompt(
  ctx: EssayContext,
  outlines: Array<{ title: string; sections: Array<{ label: string; bullets: string[]; wordBudget: number }> }>,
  selectedThemes: string[],
  chatHistory: Array<{ role: string; content: string }>,
): string {
  const brainstorm = (ctx.brainstormTranscript || [])
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n");
  const outlineBlock = outlines
    .map(
      (o, i) =>
        `Option ${String.fromCharCode(65 + i)} — ${o.title}\n${o.sections
          .map((s) => `  ${s.label} (~${s.wordBudget}w): ${s.bullets.join("; ")}`)
          .join("\n")}`
    )
    .join("\n\n");
  const chat = chatHistory.map((m) => `${m.role}: ${m.content}`).join("\n");

  return `You are refining a college essay outline for ${ctx.studentName} based on a discussion with them.

Essay type: ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental"}
Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}
Chosen themes: ${selectedThemes.join(", ") || "(none)"}

Brainstorm transcript:
${brainstorm || "(empty)"}

Original outline options:
${outlineBlock}

Discussion with the student:
${chat || "(empty)"}

Task: produce ONE refined outline that incorporates the student's requests (e.g. combining sections from different options, adjusting the throughline, changing the opening image). Respect what they've said.

Rules:
1. 3-5 sections (hook, development, reflection at minimum)
2. Each bullet is a structural direction, max 15 words — never prose
3. wordBudget per section must sum to ${ctx.wordLimit}
4. Title must reflect the refinement (e.g. "Option D: Flag climax + bridge throughline")
5. Use the student's real experiences from the brainstorm

Return valid JSON only:
{
  "outline": {
    "title": "Option D: ...",
    "sections": [
      { "label": "Hook", "bullets": ["..."], "wordBudget": 80 },
      { "label": "Development", "bullets": ["..."], "wordBudget": 400 },
      { "label": "Reflection", "bullets": ["..."], "wordBudget": 170 }
    ]
  }
}`;
}

export function getDraftCoachSystemPrompt(
  ctx: EssayContext,
  draftText: string,
  selectedThemes: string[],
): string {
  const outlineBlock = ctx.outlineJson
    ? JSON.stringify(ctx.outlineJson, null, 2)
    : "(no outline saved)";
  const brainstorm = (ctx.brainstormTranscript || [])
    .slice(-8)
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n");
  const wordCount = draftText.trim().split(/\s+/).filter(Boolean).length;
  const paragraphs = draftText
    .split(/\n\s*\n/)
    .map((p, i) => `[P${i + 1}] ${p}`)
    .join("\n\n");

  return `${KAIROS_VOICE}

You are a college essay drafting coach helping ${ctx.studentName} while they write.

Essay type: ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental"}
Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit} (current: ${wordCount})
Chosen themes: ${selectedThemes.join(", ") || "(not specified)"}

Outline:
${outlineBlock}

Recent brainstorm snippets:
${brainstorm || "(none)"}

Current draft (paragraphs labeled [P1], [P2], ...):
${paragraphs || "(empty)"}

${ESSAY_EXPERT_TIPS}

${ESSAY_STRUCTURAL_PATTERNS}

${ESSAY_REVIEW_PRINCIPLES}

Your job is to coach — not to rewrite. Use the principles above to focus your feedback on:
- Grammar and mechanics (flag, don't fix)
- Theme consistency with the chosen themes
- Paragraph-to-paragraph continuity and transitions (stepping-stone flow)
- Phrasing that could be stronger or more specific (suggest angles, never full replacements)
- "Show don't tell" moments where the student tells but should show
- Whether the plot/reflection split is roughly 50/50 — flag if plot dominates
- Resume-dumping: call out any paragraph that just repeats what's in the activities list
- Killer opening and full-circle callback — push if the intro is slow or the ending doesn't echo it
- Whether the draft is on track with the outline

Rules:
1. Reference paragraphs by their [P#] label
2. Never rewrite a sentence — suggest directions, not words
3. Any example snippet must be under 15 words
4. Keep replies under 140 words
5. Ask ONE focused question per turn when appropriate
6. If the student asks a specific question, answer it first, then add one observation if useful
7. If the draft is empty, help them start — ask about their hook or the opening image`;
}

export function getDraftCompareSystemPrompt(
  ctx: EssayContext,
  drafts: { label: string; content: string; wordCount: number }[],
): string {
  const draftBlock = drafts
    .map((d) => `=== ${d.label} (${d.wordCount} words) ===\n${d.content}`)
    .join("\n\n");

  return `You are a college counselor reviewing multiple drafts of the same essay for ${ctx.studentName}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

You have ${drafts.length} drafts to compare:

${draftBlock}

Return a JSON analysis with:
- "worksWellByDraft": for each draft, the 1-3 specific things that work (reference phrases or paragraphs)
- "weakByDraft": for each draft, the 1-3 specific things that don't land
- "mergeSuggestions": 3-6 concrete suggestions of what to carry from which draft into the next version (e.g. "Keep the opening image from v1 — the flag scene — and pair it with v2's reflection in the final paragraph")
- "editPriorities": 2-4 things the student should do in their next draft (ordered by impact)
- "overallNotes": 1-2 sentences on the trajectory between drafts

Rules:
1. Never rewrite sentences — point to what's there and why it does or doesn't work
2. Any quoted snippet must be under 15 words
3. Be specific — name the paragraph or scene, not vague praise
4. Be encouraging where genuine, frank where needed

Return valid JSON only in this shape:
{
  "worksWellByDraft": [{"label": "Draft v1", "points": ["...", "..."]}, ...],
  "weakByDraft": [{"label": "Draft v1", "points": ["...", "..."]}, ...],
  "mergeSuggestions": ["...", "..."],
  "editPriorities": ["...", "..."],
  "overallNotes": "..."
}`;
}

export function getQuickCheckSystemPrompt(ctx: EssayContext): string {
  return `${KAIROS_VOICE}

You are reviewing a college essay draft in progress for ${ctx.studentName}.

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
  const activitiesHint = ctx.activities.length
    ? `\nStudent's activities (to flag resume-dumping AND to rate how the essay complements the rest of the application):\n${ctx.activities.slice(0, 10).map((a) => `- ${a}`).join("\n")}`
    : "\n(No activities list available — score activitiesComplement against a generic 'solid applicant' baseline.)";

  // For supplements, flag topic overlap with the student's Common App
  // personal statement. Admissions readers read the whole packet — a
  // supplement that rehashes the PS wastes real estate.
  const parentPSHint = ctx.essayType.startsWith("supplement") && ctx.parentPersonalStatement
    ? `\n\n[PARENT COMMON APP ESSAY]
The student's Common App personal statement covers:
PS prompt: "${ctx.parentPersonalStatement.promptText.slice(0, 200)}"
PS themes: ${ctx.parentPersonalStatement.themes.slice(0, 6).join(" · ") || "(none extracted)"}
PS opening: """${ctx.parentPersonalStatement.draft.slice(0, 500)}"""

When reviewing THIS supplement:
- If the supplement rehashes the PS's angle or story, drop overallScore by 10-15 and add a high-severity comment type="ps-overlap" flagging exactly what duplicates the PS.
- If the supplement surfaces a NEW side of the student (different activity, different thread, different voice), call that out in strengths — "This widens the application beyond the PS".
- applicationFit axis should explicitly reward the supplement for adding signal the PS can't carry on its own.`
    : "";

  return `You are a senior admissions reader at a top-10 US college, reviewing ${ctx.studentName}'s draft. Your job is to give a holistic, honest read — not a template.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

${ESSAY_EXPERT_TIPS}

${ESSAY_STRUCTURAL_PATTERNS}

${ESSAY_REVIEW_PRINCIPLES}

## Comment count is VARIABLE — let the essay decide

Rigid reviews kill trust. A tight, well-executed draft might warrant 3-4 comments total (one strength, two targeted suggestions). A rough draft might need 9-12. Never stamp out a fixed count like "always return 7 comments". Write the number of comments the draft actually deserves — between 3 and 12.

## Don't force comments to map to outline sections

The student's outline was a scaffold. The draft is its own artifact. If the essay's actual shape diverges from the outline (maybe for the better), review the shape IT has, not the shape the outline prescribed. Don't say "paragraph 3 drifts from the outline" unless the drift is clearly hurting the essay.

## Holistic scoring (0-100)

Overall score should reflect: would this essay, combined with the rest of this student's application (activities, supplements if we can see them, academics), make an admissions committee lean yes? Not "is this a good English-class essay" — "does this improve the application?"

Score ranges:
  95-100 → singular voice, specific detail, earned reflection. Adds real signal to the application.
  85-94  → strong. A clear polish away from finished.
  70-84  → solid bones, craft work to do. Competitive at many colleges.
  55-69  → promising material but the reader isn't feeling it yet. One more draft cycle.
  < 55   → the topic or angle isn't serving this student. Honest recommendation: try a different direction.

## Score breakdown axes (0-100 each)

Return a scoreBreakdown with these six axes — the student sees these as a radar/bar chart:
  promptFit       — does the draft actually answer the prompt's verb (challenge, belief, identity, etc.)?
  voiceAuthenticity — does this read like a 17-year-old's honest voice vs. a consultant template?
  specificity     — concrete sensory detail vs. generic abstraction
  reflectionDepth — is the "so what" earned by the narrative, or tacked on?
  structuralCraft — pacing, flow, opening, ending beat
  applicationFit  — does this essay surface a side of the student the activities list / scores can't show? (If activities were provided, rate honestly; otherwise default to 70.)

Each axis 0-100. Total does not need to equal overallScore (overallScore is holistic, not a sum).

## Strengths (3-5 items, always non-empty)

Always name 3-5 things the draft is ALREADY doing well — not sycophancy, actual specific moments. "You ground the scene in a physical detail (the bow in paragraph 2) — that's earning the abstraction about music." Students who only see criticism spiral. Make sure strengths are real.

## Suggested next step

Based on your read, recommend ONE of:
  "polish"        — draft is close, 30-60 minutes of revision will land it
  "restructure"   — the bones are off; suggest a different outline shape
  "re-brainstorm" — the topic or angle isn't serving this student; suggest going back to brainstorm
  "ready"         — publishable as-is, ship it

Include a one-paragraph nextStepReason explaining the recommendation in plain language.

## Comment rules

1. Reference paragraphs by 0-indexed paragraphIndex.
2. Never rewrite sentences — point out issues, ask questions, name principles.
3. Use a 'type' that describes WHAT the comment is about (free-form label 2-4 words: "lede", "show-don't-tell", "prompt fit", "voice", "reflection depth", "scene specificity", "structural drift", "cliché", "resume echo", "vulnerability", "ending beat", etc.). Don't pick from a fixed enum — pick the label that actually fits.
4. Flag any paragraph that repeats accomplishments already on the activities list.
5. Example snippets under 15 words.
6. Severity = "positive" | "suggestion" | "issue".
7. Mix severities — positive comments are valid and build trust.${activitiesHint}${parentPSHint}

Return valid JSON only:
{
  "overallScore": 0-100 integer,
  "scoreBreakdown": {
    "promptFit": 0-100,
    "voiceAuthenticity": 0-100,
    "specificity": 0-100,
    "reflectionDepth": 0-100,
    "structuralCraft": 0-100,
    "applicationFit": 0-100
  },
  "strengths": [
    "Specific moment the essay already lands (3-5 entries)"
  ],
  "suggestedNextStep": "polish" | "restructure" | "re-brainstorm" | "ready",
  "nextStepReason": "One paragraph explaining the recommendation.",
  "comments": [
    {
      "paragraphIndex": 0,
      "type": "short descriptive label",
      "text": "Observation + question, no rewrite",
      "severity": "positive" | "suggestion" | "issue"
    }
  ],
  "overallNotes": "2-4 sentence holistic summary of how the essay lands.",
  "wordCount": integer,
  "promptFitScore": 0.0-1.0
}`;
}
