import { NextRequest, NextResponse } from "next/server";
import { runCoachExtraction } from "@/lib/cc/coach-extract";

export async function POST(req: NextRequest) {
  const { student_id, mode } = await req.json();
  if (!student_id || !mode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const result = await runCoachExtraction(student_id, mode);
  return NextResponse.json(result, { status: result.error ? 500 : 200 });
}
