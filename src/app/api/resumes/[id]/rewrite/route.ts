// POST /api/resumes/[id]/rewrite — stream LLM-rewritten resume targeted at a role.
// Body: { target_role: string, target_jd?: string }
// Persists the rewrite to resume_rewrites when streaming completes.
// Spec: CollegeVCareers.md SP-16.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createClient } from "@supabase/supabase-js";
import { streamEssayLLM, type ChatMessage } from "@/lib/essay-llm";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const targetRole = String(body.target_role || "").slice(0, 200).trim();
  const targetJd = String(body.target_jd || "").slice(0, 8000).trim();
  if (!targetRole) return NextResponse.json({ error: "target_role required" }, { status: 400 });

  const { data: doc } = await supabase
    .from("resume_docs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const system = `You are a senior recruiter + resume coach. You have rewritten thousands of resumes for ${targetRole} roles. You know what passes the 10-second recruiter skim and what passes an ATS keyword match.

Your job: rewrite the student's resume for a ${targetRole} target. Be honest — if experience is thin, don't fake it, reframe what is there.

RULES:
- Keep the candidate's real facts. Do not invent jobs, schools, or metrics.
- Every bullet must start with a strong verb. No "Responsible for…" or "Helped with…".
- Quantify where the original hints at it; if the original has no numbers, leave a [quantify?] placeholder rather than fabricate.
- Lead bullets with impact, not task. "Shipped X that did Y" beats "Used Z to do W".
- Cut fluff. If a bullet is not relevant to ${targetRole}, drop it or retitle it.
- Keep the same section order as the original (Experience, Education, etc.) unless the original is genuinely misordered.
- Match vocabulary the target role uses (from JD if provided; otherwise use standard industry language).

OUTPUT FORMAT (markdown, no code fences around the whole thing):

## Rewritten resume

[Full rewritten resume in markdown. Use ## for section headings, **bold** for roles/schools, and plain bullets. Keep it scannable.]

## What changed and why

A 4-6 bullet list of the biggest rewrite decisions. Quote the original bullet and the new one so the student can see the move.

## What to strengthen

2-3 concrete things the student should add or clarify before this resume goes out. Examples: "Add a metric to your bullet about X", "The gap between 2024-06 and 2025-01 will get flagged — add a line explaining it".
${targetJd ? "\n\nTARGET JOB DESCRIPTION (tune language and keywords to this):\n" + targetJd : ""}`;

  const user_msg = `Original resume (raw extracted text):\n\n${doc.raw_text}\n\nRewrite this for: ${targetRole}`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user_msg },
  ];

  let response: Response;
  try {
    response = await streamEssayLLM("rewrite", messages, { temperature: 0.4, maxTokens: 2200 });
  } catch (err) {
    console.error("[resumes/rewrite] LLM error:", err);
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
  }

  const [forClient, forDb] = response.body!.tee();

  (async () => {
    try {
      const reader = forDb.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
      }
      if (!full.trim()) return;

      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      );

      // Split the output on the "## What changed and why" heading so we store
      // body and notes separately for cleaner display later.
      const splitIdx = full.indexOf("## What changed and why");
      const body_md = splitIdx > 0 ? full.slice(0, splitIdx).trim() : full.trim();
      const notes_md = splitIdx > 0 ? full.slice(splitIdx).trim() : "";

      await admin.from("resume_rewrites").insert({
        doc_id: id,
        target_role: targetRole,
        target_jd: targetJd || null,
        body_md,
        notes_md,
      });
      await admin
        .from("resume_docs")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch (err) {
      console.warn("[resumes/rewrite] persistence error:", err);
    }
  })();

  return new Response(forClient, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
