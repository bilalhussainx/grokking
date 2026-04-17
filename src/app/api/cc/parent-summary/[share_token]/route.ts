import { NextRequest } from "next/server";
import { stub } from "../../helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params;
  return stub(`/api/cc/parent-summary/${share_token}`, { summary: null });
}
