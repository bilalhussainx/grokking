// GET  /api/counselor/invite-codes — list this head's agency codes
// POST /api/counselor/invite-codes — mint a new code for this head's agency
//
// Status codes:
//   201 — mint success
//   200 — list success
//   400 — invalid maxUses (mint path only)
//   401 — unauthenticated
//   403 — caller is not a head of any agency
//   500 — DB/infrastructure failure (mint path only)
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import { mintInviteCode, listInviteCodes } from "@/lib/cc/invite-codes";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") {
    return NextResponse.json({ error: "head only" }, { status: 403 });
  }
  const codes = await listInviteCodes(m.agencyId);
  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m || m.role !== "head") {
    return NextResponse.json({ error: "head only" }, { status: 403 });
  }

  let body: {
    label?: string;
    maxUses?: number;
    expiresAt?: string;
    preassignedCounselorUserId?: string;
  };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const maxUses = body.maxUses ?? 1;
  if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 1000) {
    return NextResponse.json(
      { error: "maxUses must be an integer between 1 and 1000" },
      { status: 400 },
    );
  }

  try {
    const code = await mintInviteCode(m.agencyId, user.id, {
      label: body.label,
      maxUses,
      expiresAt: body.expiresAt,
      preassignedCounselorUserId: body.preassignedCounselorUserId,
    });
    return NextResponse.json({ code }, { status: 201 });
  } catch (e) {
    console.error("[POST /api/counselor/invite-codes] failed:", e);
    return NextResponse.json(
      { error: "mint failed; please retry" },
      { status: 500 },
    );
  }
}
