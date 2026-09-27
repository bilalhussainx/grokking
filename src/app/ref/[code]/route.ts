// /ref/<code> — remember a referral code for 30 days, then go to signup.
// A route handler, because a page component may not set cookies (Next 16):
// the old page returned HTTP 500 for every referral link.
import { NextRequest, NextResponse } from "next/server";

const VALID = /^[A-Za-z0-9_-]{4,40}$/;

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const res = NextResponse.redirect(new URL("/signup", req.url));
  if (VALID.test(code) && code !== "null" && code !== "undefined") {
    res.cookies.set("referral_code", code, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return res;
}
