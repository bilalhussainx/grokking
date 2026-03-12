import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { executeWritingStage } from "@/lib/ai-writing-agents";
import type { StageName } from "@/types/writing";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { run_id, stage_name, topic, doc_type, requirements, teacher_feedback } = await req.json();
    if (!run_id || !stage_name) return NextResponse.json({ error: "run_id and stage_name required" }, { status: 400 });

    const { data: stages } = await supabase.from("pipeline_stages").select("*").eq("run_id", run_id).order("stage_order", { ascending: true });
    const previousOutputs: Record<string, unknown> = {};
    for (const s of stages || []) {
      if (s.status === "approved" || s.status === "completed") previousOutputs[s.stage_name] = s.ai_output;
    }

    await supabase.from("pipeline_stages").update({ status: "running", started_at: new Date().toISOString() }).eq("run_id", run_id).eq("stage_name", stage_name);

    const output = await executeWritingStage(stage_name as StageName, { topic, docType: doc_type, requirements, previousStageOutputs: previousOutputs, teacherFeedback: teacher_feedback });

    const { data, error } = await supabase.from("pipeline_stages").update({ ai_output: output, status: "awaiting_approval", completed_at: new Date().toISOString() }).eq("run_id", run_id).eq("stage_name", stage_name).select().single();
    await supabase.from("writing_pipeline_runs").update({ status: "awaiting_approval", current_stage: stage_name }).eq("id", run_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
