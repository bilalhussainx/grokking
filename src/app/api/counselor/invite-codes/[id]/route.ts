// DELETE /api/counselor/invite-codes/[id] — revoke a code owned by this head's agency
//
// Status codes:
//   200 — revoke success ({ ok: true })
//   401 — unauthenticated
//   403 — caller is not a head of any agency
//   500 — DB/infrastructure failure
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import { revokeInviteCode } from "@/lib/cc/invite-codes";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") {
    return NextResponse.json({ error: "head only" }, { status: 403 });
  }
  const { id } = await params;
  try {
    await revokeInviteCode(id, m.agencyId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/counselor/invite-codes/[id]] failed:", e);
    return NextResponse.json({ error: "revoke failed" }, { status: 500 });
  }
}
