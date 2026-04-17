import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export function stub(route: string, data?: Record<string, unknown>) {
  return NextResponse.json({ stub: true, route, ...data });
}

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
