import { NextRequest } from "next/server";
import { stub } from "../../helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return stub(`/api/cc/schools/${id}`, { school: null });
}
