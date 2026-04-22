import { NextRequest } from "next/server";
import { stub, requireAuth, unauthorized } from "../../helpers";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  // scholarshipMatching: guest=none, free=view (browse only), pro=full (personalized matching + alerts).
  // Only "full" passes assertCapacity; view + none both return 402 here.
  const check = await assertCapacity(auth.user.id, "scholarshipMatching", null);
  if (!check.ok) return blockedResponse(check);

  return stub("/api/cc/scholarships/match", { matches: [] });
}
