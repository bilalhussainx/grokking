import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { generateCourse } from "@/lib/course-generator";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query, url } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return NextResponse.json(
        { error: "Query must be at least 3 characters" },
        { status: 400 }
      );
    }

    const courseId = await generateCourse(query.trim(), {
      sourceUrl: url || undefined,
      createdBy: user.id,
      isCurated: false,
    });

    return NextResponse.json({ courseId, status: "generating" });
  } catch (err) {
    console.error("[API] Course generation error:", err);
    return NextResponse.json(
      { error: "Failed to start course generation" },
      { status: 500 }
    );
  }
}
