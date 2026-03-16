// src/app/ref/[code]/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cookieStore = await cookies();

  // Store referral code in a 30-day cookie
  cookieStore.set("referral_code", code, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  redirect("/signup");
}
