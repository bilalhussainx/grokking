import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { run_id, stage_name, action, feedback, approved_by } = await req.json();
    if (!run_id || !stage_name || !action) return NextResponse.json({ error: "run_id, stage_name, action required" }, { status: 400 });

    if (action === "approve") {
      await supabase.from("pipeline_stages").update({ status: "approved", approved_by, approved_at: new Date().toISOString(), teacher_feedback: feedback || null }).eq("run_id", run_id).eq("stage_name", stage_name);

      const { data: nextStage } = await supabase.from("pipeline_stages").select("*").eq("run_id", run_id).eq("status", "pending").order("stage_order", { ascending: true }).limit(1).single();
      if (nextStage) {
        await supabase.from("writing_pipeline_runs").update({ current_stage: nextStage.stage_name, status: "running" }).eq("id", run_id);
      } else {
        await supabase.from("writing_pipeline_runs").update({ status: "completed" }).eq("id", run_id);
      }
      return NextResponse.json({ success: true, next_stage: nextStage?.stage_name || null });
    } else if (action === "reject") {
      await supabase.from("pipeline_stages").update({ status: "rejected", teacher_feedback: feedback }).eq("run_id", run_id).eq("stage_name", stage_name);
      await supabase.from("writing_pipeline_runs").update({ status: "running" }).eq("id", run_id);
      return NextResponse.json({ success: true, action: "rejected" });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
