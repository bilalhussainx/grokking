import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getAnyAgencyMembership } from "@/lib/cc/agency-membership";
import { listRosterForViewer } from "@/lib/cc/student-roster";

export const runtime = "nodejs";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const m = await getAnyAgencyMembership(user.id);
  if (!m) return NextResponse.json({ error: "not in an agency" }, { status: 403 });
  const students = await listRosterForViewer(user.id);
  return NextResponse.json({ students, viewerRole: m.role });
}
