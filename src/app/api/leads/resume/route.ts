// Resume-link data migration. Called from /resume/[token] AFTER the user has
// created their real account (via supabase.auth.signUp on the client). We
// verify the current session owns the same email as the lead, then re-home
// the anon user's cc_* data onto the new account.
//
// Because cc_student_profiles is the only table keying on auth.users.id and
// all cc_* children reference cc_student_profiles.id (student_id), updating a
// single user_id column migrates the whole subtree.
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase-server";

interface Body {
  token?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = (body.token || "").trim();
  if (!token || token.length < 24) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (user.is_anonymous) {
    // An anon user clicking the resume link in the same browser is a weird
    // state — their session is already the guest_user_id we'd migrate TO
    // nothing. Upgrade path for them is SignupSoftPrompt, not this endpoint.
    return NextResponse.json(
      { error: "Sign up first to claim resume link" },
      { status: 400 }
    );
  }

  const admin = createAdminSupabase();

  const { data: lead } = await admin
    .from("marketing_leads")
    .select("id, email, guest_user_id, converted_user_id")
    .eq("resume_token", token)
    .maybeSingle();

  if (!lead) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  if (lead.converted_user_id && lead.converted_user_id !== user.id) {
    // Someone else already claimed this token. Refuse to avoid data leaks
    // (e.g., shared or forwarded email).
    return NextResponse.json({ error: "Token already claimed" }, { status: 409 });
  }

  // Verify the signed-in user's email matches the lead's email. This is the
  // trust boundary — without it, any logged-in user could POST any token and
  // inherit an unrelated guest's data.
  if ((user.email || "").toLowerCase() !== (lead.email || "").toLowerCase()) {
    return NextResponse.json(
      { error: "Email mismatch — sign in with the email you received the link at" },
      { status: 403 }
    );
  }

  const guestUserId = lead.guest_user_id as string | null;
  let migratedTables: Record<string, number> = {};

  if (guestUserId && guestUserId !== user.id) {
    migratedTables = await migrateGuestData(guestUserId, user.id);
  }

  // Mark the lead as converted.
  await admin
    .from("marketing_leads")
    .update({
      converted_user_id: user.id,
      converted_at: new Date().toISOString(),
    })
    .eq("id", lead.id);

  // Mark the guest audit row as upgraded (best-effort — table/column is
  // optional and the row may not exist if the audit API was unreachable).
  if (guestUserId) {
    await admin
      .from("guest_sessions_audit")
      .update({ upgraded_to_free_at: new Date().toISOString() })
      .eq("user_id", guestUserId)
      .then(() => undefined, () => undefined);
  }

  return NextResponse.json({ migrated: true, tables: migratedTables });
}

/**
 * Re-home a guest user's cc_* data onto a real account.
 *
 * Foreign-key shape: cc_student_profiles is the only cc_* table keying on
 * auth.users.id. Every other cc_* table keys on cc_student_profiles.id
 * (student_id). So flipping user_id on the profile row silently migrates the
 * entire subtree — no per-child UPDATEs needed.
 */
async function migrateGuestData(
  guestUserId: string,
  newUserId: string
): Promise<Record<string, number>> {
  const admin = createAdminSupabase();
  const counts: Record<string, number> = {};

  const { data: guestProfile } = await admin
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", guestUserId)
    .maybeSingle();

  if (!guestProfile) {
    // Guest never got a profile row — nothing to migrate.
    return counts;
  }

  // If the new user already has an auto-created empty profile (from
  // ensureProfile during signup), delete it first so the user_id flip below
  // doesn't hit a unique constraint. The guest profile has the user's
  // actual work-in-progress; the auto-created one is empty.
  const { data: existingNewProfile } = await admin
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", newUserId)
    .maybeSingle();

  if (existingNewProfile && existingNewProfile.id !== guestProfile.id) {
    await admin
      .from("cc_student_profiles")
      .delete()
      .eq("id", existingNewProfile.id);
  }

  const { error } = await admin
    .from("cc_student_profiles")
    .update({ user_id: newUserId })
    .eq("id", guestProfile.id);

  if (error) {
    throw new Error(`Failed to re-home profile: ${error.message}`);
  }
  counts["cc_student_profiles"] = 1;
  return counts;
}
