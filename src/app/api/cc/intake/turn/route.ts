import { NextRequest } from "next/server";
import { stub } from "../../helpers";

export async function POST(req: NextRequest) {
  return stub("/api/cc/intake/turn", { next_question: "What grade are you in?" });
}
