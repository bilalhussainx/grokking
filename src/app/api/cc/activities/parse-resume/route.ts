import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

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

const SYSTEM_PROMPT = `You are a college admissions counselor parsing a student's resume into Common App activities and honors.

RULES:
- Extract up to 10 activities and 5 honors, ordered by impact (most impressive first).
- Each activity needs: type (e.g., "Academic", "Athletics", "Community Service", "Leadership", "Work", "Research"), organization, role, description (150 char max), grades participated (9-12), hours/week, weeks/year.
- Each honor needs: title, level ("School", "State/Regional", "National", "International"), grade earned (9-12).
- description_150: Start with a strong action verb, quantify impact where possible, under 150 characters. If original bullet is too long, condense keeping the achievement/impact.
- description_100: Same discipline, under 100 characters.
- If grades aren't listed, leave grades_participated as empty array.
- If hours/weeks aren't specified, use null.
- Honor "grade" field: the grade level when it was earned (9-12), null if unknown.

Return ONLY valid JSON matching this schema, nothing else:
{
  "activities": [
    {
      "position": 1,
      "activity_type": "...",
      "organization": "...",
      "role": "...",
      "description_150": "...",
      "grades_participated": [11, 12],
      "hours_per_week": 10,
      "weeks_per_year": 40,
      "is_continuing": true
    }
  ],
  "honors": [
    {
      "position": 1,
      "title": "...",
      "level": "National",
      "grade": 11,
      "description_100": "..."
    }
  ],
  "notes": "brief note if resume was unclear, null otherwise"
}`;

type CallResult =
  | { ok: true; parsed: ParseResult }
  | { ok: false; reason: string; detail?: string };

function extractJson(text: string): ParseResult | null {
  if (!text) return null;
  // Strip ```json ... ``` fences if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const braceMatch = candidate.match(/\{[\s\S]*\}/);
  if (!braceMatch) return null;
  try {
    return JSON.parse(braceMatch[0]) as ParseResult;
  } catch {
    return null;
  }
}

async function callClaudeVision(
  fileType: "image" | "pdf",
  mimeType: string,
  base64: string,
  filename: string,
  pdfEngine: "pdf-text" | "native" | "mistral-ocr" = "pdf-text"
): Promise<CallResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { ok: false, reason: "OPENROUTER_API_KEY not configured" };

  const userContent: Array<Record<string, unknown>> = [
    {
      type: "text",
      text: "Parse this resume into Common App activities and honors. Return JSON only.",
    },
  ];

  if (fileType === "image") {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${mimeType};base64,${base64}` },
    });
  } else {
    userContent.push({
      type: "file",
      file: {
        filename,
        file_data: `data:${mimeType};base64,${base64}`,
      },
    });
  }

  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://kairoslearn.ai",
      "X-Title": "Coach Kairos",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4-6",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      plugins: fileType === "pdf" ? [{ id: "file-parser", pdf: { engine: pdfEngine } }] : undefined,
      temperature: 0.3,
      max_tokens: 3000,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    console.error("[parse-resume] OpenRouter error:", resp.status, errText);
    return {
      ok: false,
      reason: `OpenRouter returned ${resp.status}`,
      detail: errText.slice(0, 400),
    };
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || "";
  const parsed = extractJson(text);
  if (!parsed) {
    console.error("[parse-resume] Could not extract JSON from model output:", text.slice(0, 600));
    return {
      ok: false,
      reason: "Model did not return valid JSON",
      detail: text.slice(0, 200),
    };
  }
  if (!Array.isArray(parsed.activities) && !Array.isArray(parsed.honors)) {
    return {
      ok: false,
      reason: "Parsed JSON missing activities/honors arrays",
      detail: text.slice(0, 200),
    };
  }
  // Defensive defaults
  parsed.activities = parsed.activities || [];
  parsed.honors = parsed.honors || [];
  return { ok: true, parsed };
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
  }

  const mimeType = file.type || "application/octet-stream";
  const isPdf = mimeType === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = mimeType.startsWith("image/");

  if (!isPdf && !isImage) {
    return NextResponse.json({ error: "Upload a PDF or image" }, { status: 400 });
  }

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text * 5, "resume_parse");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  let result = await callClaudeVision(
    isPdf ? "pdf" : "image",
    isPdf ? "application/pdf" : mimeType,
    base64,
    file.name,
    "pdf-text"
  );

  // PDF retry: if the text-extraction engine failed, fall back to Claude's native PDF
  // handling (works for scanned/image-heavy PDFs and HTML-printed-to-PDF edge cases).
  if (!result.ok && isPdf) {
    console.warn("[parse-resume] pdf-text failed, retrying with native engine:", result.reason);
    result = await callClaudeVision("pdf", "application/pdf", base64, file.name, "native");
  }

  if (!result.ok) {
    return NextResponse.json(
      {
        error: `Couldn't read resume — ${result.reason}. Try pasting the text instead, or re-export the PDF.`,
        detail: result.detail,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ parsed: result.parsed });
}
