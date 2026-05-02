import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();

  const { data: essay } = await db
    .from("cc_essays")
    .select("share_token")
    .eq("id", id)
    .single();

  if (!essay) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  let shareToken = essay.share_token;
  if (!shareToken) {
    shareToken = randomBytes(16).toString("hex");
    await db
      .from("cc_essays")
      .update({ share_token: shareToken })
      .eq("id", id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kairoslearn.com";
  return NextResponse.json({
    share_token: shareToken,
    share_url: `${baseUrl}/cc/essays/shared/${shareToken}`,
  });
}
