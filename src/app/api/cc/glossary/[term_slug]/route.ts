import { NextRequest } from "next/server";
import { stub } from "../../helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ term_slug: string }> }) {
  const { term_slug } = await params;
  return stub(`/api/cc/glossary/${term_slug}`, { term: null });
}
