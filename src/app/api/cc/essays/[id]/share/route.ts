import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { getOwnedEssay } from "@/lib/cc/ownership";
import { randomBytes } from "crypto";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();
  // Only the essay's owner may mint or read its share link. Returning an
  // existing token to anyone else would publish their essay.
  const owned = await getOwnedEssay(db, auth.user.id, id);
  if (!owned) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  let shareToken = owned.share_token;
  if (!shareToken) {
    shareToken = randomBytes(16).toString("hex");
    await db
      .from("cc_essays")
      .update({ share_token: shareToken })
      .eq("id", owned.id)
      .eq("student_id", owned.student_id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kairoslearn.com";
  return NextResponse.json({
    share_token: shareToken,
    share_url: `${baseUrl}/cc/essays/shared/${shareToken}`,
  });
}
