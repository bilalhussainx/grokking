import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { error } = await getSupabase()
      .from("survey_responses")
      .insert(body);

    if (error) {
      console.error("[Survey] Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Survey] Error:", err);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}
