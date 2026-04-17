import { NextRequest } from "next/server";
import { stub, requireAuth, unauthorized } from "../../helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  return stub("/api/cc/timeline", { tasks: [] });
}
