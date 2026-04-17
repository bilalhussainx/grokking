import { NextRequest } from "next/server";
import { stub } from "../helpers";

export async function GET(req: NextRequest) {
  return stub("/api/cc/glossary", { terms: [] });
}
