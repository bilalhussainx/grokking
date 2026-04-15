// POST /api/essays/[id]/critique — stream a critique of a pasted or in-page draft.
// Body: { draft: string }
// Persists the critique as an essay_versions row (kind='critique') when streaming completes.
// Spec: CollegeVCareers.md SP-10.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createClient } from "@supabase/supabase-js";
import { streamEssayLLM, buildCritiqueMessages } from "@/lib/essay-llm";
import { COLLEGE_PERSONAS } from "@/data/college-interviewer-personas";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const draftText = String(body.draft || "").slice(0, 20000);
  if (!draftText.trim() || draftText.trim().split(/\s+/).length < 20) {
    return NextResponse.json({ error: "Draft is too short to critique (need 20+ words)" }, { status: 400 });
  }

  const { data: draftRow } = await supabase
    .from("essay_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!draftRow) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const persona = draftRow.school_id
    ? COLLEGE_PERSONAS.find((p) => p.id === draftRow.school_id)
    : undefined;

  const messages = buildCritiqueMessages({
    prompt: draftRow.prompt,
    draft: draftText,
    schoolName: persona?.school,
    wordTarget: draftRow.word_target || undefined,
  });

  let response: Response;
  try {
    response = await streamEssayLLM("critique", messages, { temperature: 0.4, maxTokens: 1500 });
  } catch (err) {
    console.error("[essays/critique] LLM error:", err);
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

      const nextVersion = (draftRow.current_version || 0) + 1;
      await admin.from("essay_versions").insert({
        draft_id: id,
        version_num: nextVersion,
        kind: "body",
        body_md: draftText,
        word_count: draftText.trim().split(/\s+/).length,
      });
      await admin.from("essay_versions").insert({
        draft_id: id,
        version_num: nextVersion,
        kind: "critique",
        body_md: full,
      });
      await admin
        .from("essay_drafts")
        .update({
          current_version: nextVersion,
          status: "review",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (err) {
      console.warn("[essays/critique] persistence error:", err);
    }
  })();

  return new Response(forClient, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
