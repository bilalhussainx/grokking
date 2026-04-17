import { NextRequest } from "next/server";
import { stub } from "../../helpers";

export async function POST(req: NextRequest) {
  return stub("/api/cc/intake/complete", { profile_summary: {} });
}
