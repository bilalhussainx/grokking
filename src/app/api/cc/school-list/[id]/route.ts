import { NextRequest } from "next/server";
import { stub, requireAuth, unauthorized } from "../../helpers";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;
  return stub(`/api/cc/school-list/${id}`);
}
