// src/app/api/credits/balance/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-auth";
import { getBalance } from "@/lib/credits";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const balance = await getBalance(user.id);
  return NextResponse.json({ balance });
}
