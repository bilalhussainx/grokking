import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface ParsedActivity {
  position: number;
  activity_type: string | null;
  organization: string | null;
  role: string | null;
  description_150: string | null;
  grades_participated: number[];
  hours_per_week: number | null;
  weeks_per_year: number | null;
  is_continuing: boolean;
}

interface ParsedHonor {
  position: number;
  title: string | null;
  level: string | null;
  grade: number | null;
  description_100: string | null;
}

interface ParseResult {
  activities: ParsedActivity[];
  honors: ParsedHonor[];
  notes: string | null;
}

const SYSTEM_PROMPT = `You are a college admissions counselor parsing a student's pasted activity list into Common App activities and honors.

RULES:
- Extract up to 10 activities and 5 honors, ordered by impact (most impressive first).
- Each activity: type (Academic, Athletics, Community Service, Leadership, Work, Research, etc.), organization, role, description (150 char max), grades participated (9-12), hours/week, weeks/year.
- Each honor: title, level (School, State/Regional, National, International), grade earned (9-12).
- description_150: Start with concrete action verb, quantify impact, under 150 characters.
- description_100: Same discipline, under 100 characters.
- If grades aren't listed, empty array. If hours/weeks aren't specified, null.
- Be generous interpreting sloppy bullet lists — infer type from context.

Return JSON ONLY:
{
  "activities": [{"position": 1, "activity_type": "...", "organization": "...", "role": "...", "description_150": "...", "grades_participated": [11,12], "hours_per_week": 10, "weeks_per_year": 40, "is_continuing": true}],
  "honors": [{"position": 1, "title": "...", "level": "National", "grade": 11, "description_100": "..."}],
  "notes": "brief note if input was ambiguous, null otherwise"
}`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { text } = (await req.json()) as { text?: string };
  if (!text || text.trim().length < 20) {
    return NextResponse.json({ error: "Paste at least a few lines" }, { status: 400 });
  }

  if (text.length > 15000) {
    return NextResponse.json({ error: "Too long — trim to under 15,000 characters" }, { status: 413 });
  }

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text * 3, "activities_parse_text");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Parse this into Common App activities and honors:\n\n${text}` },
  ];

  const parsed = await callLLMJSON<ParseResult>(messages, { maxTokens: 3000, temperature: 0.3 });

  if (!parsed) {
    return NextResponse.json({ error: "Couldn't parse — try cleaning up the text" }, { status: 500 });
  }

  return NextResponse.json({ parsed });
}
