// Feature 1B — translate brag-sheet / aid summary / scholarship list / generic
// counselor doc text into the parent's language. NOT a formal-submission
// translation; explicitly framed as 'for parent comprehension only'.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../helpers";
import { chatOnce } from "@/lib/cc/openrouter";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const ALLOWED_LANGS = new Set(COACH_LANGUAGES.map((l) => l.code).filter((c) => c !== "en"));

const DOC_KIND_LABELS: Record<string, string> = {
  brag_sheet: "the student's brag sheet (achievements summary the teacher uses to write recommendations)",
  aid_summary: "the student's financial aid summary (need-based aid offers and net price)",
  scholarship_list: "the student's scholarship list (external scholarships they qualify for)",
  general: "a general counselor document for the parent",
};

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    content?: string;
    targetLang?: string;
    docKind?: string;
  };

  const content = body.content?.trim();
  const targetLang = body.targetLang ?? "";
  const docKind = body.docKind ?? "general";

  if (!content || content.length < 10) {
    return NextResponse.json({ error: "Content too short" }, { status: 400 });
  }
  if (!ALLOWED_LANGS.has(targetLang)) {
    return NextResponse.json({ error: "Unsupported target language" }, { status: 400 });
  }
  if (content.length > 12000) {
    return NextResponse.json({ error: "Content too long (12k char max)" }, { status: 400 });
  }

  const langInfo = COACH_LANGUAGES.find((l) => l.code === targetLang);
  const langName = langInfo?.name ?? targetLang;
  const isRTL = langInfo?.isRTL ?? false;

  const docContext = DOC_KIND_LABELS[docKind] ?? DOC_KIND_LABELS.general;

  const systemPrompt = `You translate U.S. college-counseling documents into ${langName} for parents who don't read English.

Context: This is ${docContext}. The translation is for the parent to understand — NOT for formal submission.

Rules:
- Translate fluently into ${langName}, using natural phrasing a parent would understand.
- Keep proper nouns in English: school names (MIT, Harvard), program names (QuestBridge), form names (CSS Profile, FAFSA), test names (SAT, ACT), and dollar amounts.
- Briefly gloss any technical term in parentheses the first time it appears (e.g. "merit scholarship (یعنی تعلیمی کارکردگی پر مبنی وظیفہ)").
- Preserve the document's structure: keep headings, lists, and paragraph breaks.
- Be respectful and warm — this parent is making a financial decision based on what you write.
${isRTL ? `- Output in ${langName} (RTL script). Do not transliterate.` : ""}

Respond with the translated document only. No preamble, no notes.`;

  let translated: string;
  try {
    translated = await chatOnce([
      { role: "system", content: systemPrompt },
      { role: "user", content },
    ]);
  } catch (err) {
    console.error("[translate-doc] LLM error", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 503 });
  }

  return NextResponse.json({
    translated,
    targetLang,
    targetLangName: langName,
    isRTL,
    docKind,
  });
}
