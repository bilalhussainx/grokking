// POST /api/essays/[id]/ideate — stream 3 angles for the draft's prompt.
// Also persists the result as an essay_versions row (kind='angles') when streaming completes.
// Spec: CollegeVCareers.md SP-10.

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createClient } from "@supabase/supabase-js";
import { streamEssayLLM, buildIdeationMessages } from "@/lib/essay-llm";
import { COLLEGE_PERSONAS } from "@/data/college-interviewer-personas";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: draft } = await supabase
    .from("essay_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Pull applicant profile for personalization
  const { data: profile } = await supabase
    .from("college_applicant_profile")
    .select("intended_major, top_project_title, top_project_description, recent_influence")
    .eq("user_id", user.id)
    .maybeSingle();

  const persona = draft.school_id
    ? COLLEGE_PERSONAS.find((p) => p.id === draft.school_id)
    : undefined;

  const messages = buildIdeationMessages({
    prompt: draft.prompt,
    schoolName: persona?.school,
    wordTarget: draft.word_target || undefined,
    applicantProfile: profile
      ? {
          intendedMajor: profile.intended_major || undefined,
          topProjectTitle: profile.top_project_title || undefined,
          topProjectDescription: profile.top_project_description || undefined,
          recentInfluence: profile.recent_influence || undefined,
        }
      : undefined,
  });

  let response: Response;
  try {
    response = await streamEssayLLM("ideate", messages, { temperature: 0.8, maxTokens: 1200 });
  } catch (err) {
    console.error("[essays/ideate] LLM error:", err);
    return NextResponse.json({ error: "LLM request failed" }, { status: 502 });
  }

  // Tee the stream so we can both return it to the client AND persist the full text.
  const [forClient, forDb] = response.body!.tee();

  // Fire-and-forget persistence using the service role (RLS bypasses need service key)
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

      const nextVersion = (draft.current_version || 0) + 1;
      await admin.from("essay_versions").insert({
        draft_id: id,
        version_num: nextVersion,
        kind: "angles",
        body_md: full,
      });
      await admin
        .from("essay_drafts")
        .update({
          current_version: nextVersion,
          status: draft.status === "ideation" ? "ideation" : draft.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (err) {
      console.warn("[essays/ideate] persistence error:", err);
    }
  })();

  return new Response(forClient, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
