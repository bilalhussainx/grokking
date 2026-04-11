import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import {
  getActivePathway,
  listPathways,
  createPathway,
  updatePathway,
  deletePathway,
} from "@/lib/career-coach";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = req.nextUrl.searchParams.get("all") === "1";
  if (all) {
    const pathways = await listPathways(user.id);
    return NextResponse.json({ pathways });
  }
  const pathway = await getActivePathway(user.id);
  return NextResponse.json({ pathway });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.targetRole) {
    return NextResponse.json({ error: "targetRole is required" }, { status: 400 });
  }

  const pathway = await createPathway(user.id, {
    targetRole: body.targetRole,
    targetCompanies: body.targetCompanies,
    targetTimeline: body.targetTimeline,
    requiredSkills: body.requiredSkills,
    recommendedCourses: body.recommendedCourses,
    nextAction: body.nextAction,
  });

  if (!pathway) {
    return NextResponse.json({ error: "Failed to create pathway" }, { status: 500 });
  }
  return NextResponse.json({ pathway }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const pathway = await updatePathway(user.id, body.id, body);
  if (!pathway) {
    return NextResponse.json({ error: "Pathway not found" }, { status: 404 });
  }
  return NextResponse.json({ pathway });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param required" }, { status: 400 });

  const ok = await deletePathway(user.id, id);
  if (!ok) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
