import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";

/**
 * POST /api/call/status
 * Twilio status callback — called when a call ends.
 * Logs duration and deducts credits.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid") as string;
    const callStatus = formData.get("CallStatus") as string;
    const callDuration = parseInt(formData.get("CallDuration") as string || "0", 10);

    console.log(`[Call Status] ${callSid}: ${callStatus}, ${callDuration}s`);

    if (callStatus === "completed" && callDuration > 0) {
      const admin = createAdminSupabase();

      // Find the call session
      const { data: session } = await admin
        .from("call_sessions")
        .select("id, caller_id")
        .or(`twilio_call_sid_a.eq.${callSid},twilio_call_sid_b.eq.${callSid}`)
        .single();

      if (session) {
        const minutes = Math.ceil(callDuration / 60);
        const creditsUsed = minutes * 5; // 5 credits per minute

        // Update session
        await admin
          .from("call_sessions")
          .update({
            duration_seconds: callDuration,
            credits_used: creditsUsed,
            status: "completed",
            ended_at: new Date().toISOString(),
          })
          .eq("id", session.id);

        // Deduct credits from caller
        if (session.caller_id) {
          await admin.rpc("deduct_credits", {
            p_user_id: session.caller_id,
            p_amount: creditsUsed,
            p_action: "translated_call",
            p_ref_id: session.id,
          });
        }
      }
    }
  } catch (err) {
    console.error("[Call Status] Error:", err);
  }

  return NextResponse.json({ ok: true });
}
