import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const STAGES = [
  { name: "outline", order: 1 },
  { name: "research", order: 2 },
  { name: "draft", order: 3 },
  { name: "refine", order: 4 },
  { name: "final", order: 5 },
];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { document_id, initiated_by, pipeline_type } = await req.json();
    if (!document_id || !initiated_by) return NextResponse.json({ error: "document_id and initiated_by required" }, { status: 400 });

    const { data: run, error: runError } = await supabase.from("writing_pipeline_runs").insert({
      document_id, initiated_by, pipeline_type: pipeline_type || "essay", status: "running", current_stage: "outline",
    }).select().single();
    if (runError) return NextResponse.json({ error: runError.message }, { status: 500 });

    const stageRecords = STAGES.map((s) => ({
      run_id: run.id, stage_name: s.name, stage_order: s.order,
      status: s.order === 1 ? "running" : "pending",
      ...(s.order === 1 ? { started_at: new Date().toISOString() } : {}),
    }));
    await supabase.from("pipeline_stages").insert(stageRecords);

    return NextResponse.json(run);
  } catch { return NextResponse.json({ error: "Failed to start pipeline" }, { status: 500 }); }
}
