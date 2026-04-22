import { NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export function stub(route: string, data?: Record<string, unknown>) {
  return NextResponse.json({ stub: true, route, ...data });
}

export async function requireAuth() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Ensure a cc_student_profiles row exists for the given auth user. Required
// for guest-trial flow: anon users need a profile before they can add schools
// or save essays. Called at the top of any route that needs profile.id.
export async function ensureStudentProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ id: string }> {
  const { data: existing } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return existing as { id: string };

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("cc_student_profiles")
    .insert({ user_id: user.id, country: "US" })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create student profile: ${error.message}`);
  }
  return data as { id: string };
}

export { createAdminSupabase };
