import { NextRequest } from "next/server";
import { stub, requireAuth, unauthorized } from "../../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  return stub("/api/cc/npc/simulate", { estimated_low: 0, estimated_high: 0 });
}
