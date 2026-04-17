import { NextRequest } from "next/server";
import { stub, requireAuth, unauthorized } from "../../helpers";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  return stub("/api/cc/profile/financial");
}
