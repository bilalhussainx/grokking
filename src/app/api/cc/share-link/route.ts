import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";
import { randomBytes } from "crypto";

interface VisibleSections {
  essays: boolean;
  activities: boolean;
  schoolList: boolean;
  recommendations: boolean;
  interviewScores: boolean;
}

const DEFAULT_SECTIONS: VisibleSections = {
  essays: true,
  activities: true,
  schoolList: true,
  recommendations: true,
  interviewScores: true,
};

function buildShareUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://kairos.ai";
  return `${base}/cc/shared/${token}`;
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ shareLink: null });
  }

  const { data: link } = await db
    .from("cc_share_links")
    .select("share_token, visible_sections, is_active")
    .eq("student_id", profile.id)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ shareLink: null });
  }

  return NextResponse.json({
    shareLink: {
      shareToken: link.share_token,
      shareUrl: buildShareUrl(link.share_token),
      visibleSections: link.visible_sections,
      isActive: link.is_active,
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  // Counselor share link is Pro-only. Returning an existing active link to a
  // paid user who downgrades would still be gated here — the existing-link
  // early return happens AFTER the gate.
  const shareCheck = await assertCapacity(auth.user.id, "counselorShareLink", null);
  if (!shareCheck.ok) return blockedResponse(shareCheck);

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const { data: existing } = await db
    .from("cc_share_links")
    .select("share_token, visible_sections, is_active")
    .eq("student_id", profile.id)
    .eq("is_active", true)
    .single();

  if (existing) {
    return NextResponse.json({
      shareToken: existing.share_token,
      shareUrl: buildShareUrl(existing.share_token),
      visibleSections: existing.visible_sections,
      isActive: existing.is_active,
    });
  }

  const body = await req.json().catch(() => ({}));
  const visibleSections = { ...DEFAULT_SECTIONS, ...(body.visibleSections || {}) };
  const shareToken = randomBytes(16).toString("hex");

  const { error } = await db
    .from("cc_share_links")
    .insert({
      student_id: profile.id,
      share_token: shareToken,
      visible_sections: visibleSections,
    });

  if (error) {
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }

  return NextResponse.json({
    shareToken,
    shareUrl: buildShareUrl(shareToken),
    visibleSections,
    isActive: true,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: link } = await db
    .from("cc_share_links")
    .select("id, share_token, visible_sections")
    .eq("student_id", profile.id)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ error: "No active share link" }, { status: 404 });
  }

  const body = await req.json();

  if (body.revoke === true) {
    await db
      .from("cc_share_links")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", link.id);
    return NextResponse.json({ revoked: true });
  }

  if (body.visibleSections) {
    const updated = { ...(link.visible_sections as VisibleSections), ...body.visibleSections };
    await db
      .from("cc_share_links")
      .update({ visible_sections: updated, updated_at: new Date().toISOString() })
      .eq("id", link.id);
    return NextResponse.json({
      shareToken: link.share_token,
      shareUrl: buildShareUrl(link.share_token),
      visibleSections: updated,
      isActive: true,
    });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
