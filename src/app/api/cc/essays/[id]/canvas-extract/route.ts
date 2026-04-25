import { NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { extractCanvasFragment } from "@/lib/cc/canvas-extract";
import { streamLLM, collectStream } from "@/lib/cc/llm-stream";

type Fragment = {
  turnId: string;
  fragment: string;
  tags: string[];
  createdAt: string;
};

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();
  const { data: essay, error } = await db
    .from("cc_essays")
    .select("id, student_id, brainstorm_transcript, canvas_fragments")
    .eq("id", id)
    .single();
  if (error || !essay) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();
  if (!profile || profile.id !== essay.student_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // brainstorm_transcript is stored as TEXT (JSON-stringified) but Supabase may
  // auto-parse it; handle both shapes.
  const raw = essay.brainstorm_transcript as unknown;
  let transcript: { role: string; content: string }[] = [];
  if (Array.isArray(raw)) transcript = raw;
  else if (typeof raw === "string") {
    try { transcript = JSON.parse(raw); } catch { transcript = []; }
  }
  if (transcript.length < 2) {
    return NextResponse.json({ fragment: "", tags: [] });
  }

  const last = transcript[transcript.length - 1];
  const prev = transcript[transcript.length - 2];
  if (last.role !== "assistant" || prev.role !== "user") {
    return NextResponse.json({ fragment: "", tags: [] });
  }

  const callLLM = async (system: string, user: string) => {
    const result = await streamLLM(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { maxTokens: 200, temperature: 0.2 },
    );
    if (!result) return "";
    return collectStream(result.stream);
  };

  let extract;
  try {
    extract = await extractCanvasFragment(prev.content, last.content, callLLM);
  } catch (err) {
    console.warn("[canvas-extract] callLLM failed", err);
    return NextResponse.json({ fragment: "", tags: [] });
  }

  if (!extract.fragment) {
    return NextResponse.json({ fragment: "", tags: [] });
  }

  const turnId = `${id}-${transcript.length - 1}`;
  const newFragment: Fragment = {
    turnId,
    fragment: extract.fragment,
    tags: extract.tags,
    createdAt: new Date().toISOString(),
  };
  const updated: Fragment[] = [...((essay.canvas_fragments ?? []) as Fragment[]), newFragment];

  await db.from("cc_essays").update({ canvas_fragments: updated }).eq("id", id);

  return NextResponse.json(newFragment);
}
