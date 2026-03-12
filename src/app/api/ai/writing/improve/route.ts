import { NextRequest, NextResponse } from "next/server";
import { improveWriting } from "@/lib/ai-writing-agents";

export async function POST(req: NextRequest) {
  try {
    const { content, selected_text, instruction } = await req.json();
    if (!content || !selected_text || !instruction) return NextResponse.json({ error: "content, selected_text, instruction required" }, { status: 400 });
    const improved = await improveWriting(content, selected_text, instruction);
    return NextResponse.json({ improved });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
