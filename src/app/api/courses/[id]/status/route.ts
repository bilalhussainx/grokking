import { NextRequest, NextResponse } from "next/server";
import { getGenerationStatus } from "@/lib/course-generator";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
  }

  const status = await getGenerationStatus(id);

  if (!status) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(status);
}
