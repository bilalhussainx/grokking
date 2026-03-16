import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { getTrendsForUser } from "@/lib/trends";

/**
 * GET /api/trends
 *
 * Returns personalized trend notifications for the authenticated user.
 * Matches external content (arXiv papers, GitHub repos) to lessons the
 * user has completed using vector similarity.
 *
 * Query params:
 *   limit     — max items to return (default 5, max 20)
 *   lessonId  — unused today but reserved for future lesson-scoped filtering
 */
export async function GET(request: Request) {
  // Authenticate
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse query params
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "5", 10) || 5, 1),
    20
  );

  try {
    const trends = await getTrendsForUser(user.id, limit);
    return NextResponse.json({ trends });
  } catch (err) {
    console.error("Failed to fetch trends:", err);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
