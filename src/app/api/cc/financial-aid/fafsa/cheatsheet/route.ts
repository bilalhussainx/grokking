import { NextRequest } from "next/server";
import { stub, requireAuth, unauthorized } from "../../../helpers";
import { assertCapacity, blockedResponse } from "@/lib/cc/tier-gate";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const check = await assertCapacity(auth.user.id, "fafsaWalkthrough", null);
  if (!check.ok) return blockedResponse(check);

  return stub("/api/cc/financial-aid/fafsa/cheatsheet", { pdf_url: "" });
}
