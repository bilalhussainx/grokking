import { NextRequest, NextResponse } from "next/server";
import { reviewWriting } from "@/lib/ai-writing-agents";

export async function POST(req: NextRequest) {
  try {
    const { content, doc_type, focus_areas } = await req.json();
    if (!content) return NextResponse.json({ error: "content required" }, { status: 400 });
    const result = await reviewWriting(content, doc_type || "essay", focus_areas);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
