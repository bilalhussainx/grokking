// QA seed: one student per dashboard variant (selectVariant in
// src/app/cc/dashboard/variants.ts), so tests/e2e/student-variants.spec.ts can
// walk every student type. Idempotent. Touches ONLY e2e-v-*@test.local users
// and their own profile / school / essay rows. Service role from .env.local.
//
//   node scripts/qa-seed-student-variants.mjs
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("missing supabase env"); process.exit(1); }
const db = createClient(URL, KEY, { auth: { persistSession: false } });
const PW = "E2eTestPass!1";

// variant → grade, transfer flag, school statuses
const VARIANTS = [
  { key: "g9", grade: 9, transfer: false, statuses: [] },
  { key: "g10", grade: 10, transfer: false, statuses: [] },
  { key: "junior", grade: 11, transfer: false, statuses: ["considering"] },
  { key: "senior-writing", grade: 12, transfer: false, statuses: ["considering", "applying"] },
  { key: "senior-post-submit", grade: 12, transfer: false, statuses: ["submitted", "applying"] },
  { key: "senior-decisions", grade: 12, transfer: false, statuses: ["accepted", "waitlisted"] },
  { key: "transfer", grade: null, transfer: true, statuses: ["considering"] },
  { key: "unknown", grade: null, transfer: false, statuses: [] },
];

async function ensureUser(email, fullName) {
  const { data: created } = await db.auth.admin.createUser({
    email, password: PW, email_confirm: true, user_metadata: { full_name: fullName },
  });
  if (created?.user) return created.user.id;
  for (let page = 1; page <= 20; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
    const u = data?.users.find((x) => x.email === email);
    if (u) {
      await db.auth.admin.updateUserById(u.id, { password: PW, email_confirm: true });
      return u.id;
    }
    if (!data || data.users.length < 200) break;
  }
  throw new Error(`cannot find or create ${email}`);
}

// cc_student_profiles has no unique user_id: select-then-update/insert.
async function ensureProfile(userId, v, name) {
  const fields = {
    preferred_name: name,
    grade_level: v.grade,
    is_transfer_student: v.transfer,
    transfer_current_school: v.transfer ? "QA Community College" : null,
    transfer_target_term: v.transfer ? "Fall 2027" : null,
    home_language: "en",
    language_picker_seen_at: new Date().toISOString(),
    intake_completed_at: new Date().toISOString(),
  };
  const { data: rows, error } = await db.from("cc_student_profiles").select("id").eq("user_id", userId);
  if (error) throw error;
  if (rows.length) {
    const { error: e } = await db.from("cc_student_profiles").update(fields).eq("id", rows[0].id);
    if (e) throw e;
    return { id: rows[0].id, duplicates: rows.length - 1 };
  }
  const { data: ins, error: e } = await db.from("cc_student_profiles").insert({ user_id: userId, ...fields }).select("id").single();
  if (e) throw e;
  return { id: ins.id, duplicates: 0 };
}

const { data: schools, error: se } = await db.from("cc_schools").select("id, name").in("name", ["University of Toronto", "Harvard University", "University of Michigan"]);
if (se) throw se;
if (!schools?.length || schools.length < 2) throw new Error("need at least two known cc_schools rows (University of Toronto / Harvard University / University of Michigan)");

for (const v of VARIANTS) {
  const email = `e2e-v-${v.key}@test.local`;
  const name = `QA ${v.key}`;
  const userId = await ensureUser(email, name);
  const profile = await ensureProfile(userId, v, name);

  await db.from("cc_student_schools").delete().eq("student_id", profile.id);
  if (v.statuses.length) {
    const { error } = await db.from("cc_student_schools").insert(
      v.statuses.map((status, i) => ({
        student_id: profile.id,
        school_id: schools[i % schools.length].id,
        application_status: status,
        submitted_at: ["submitted", "accepted", "waitlisted"].includes(status) ? new Date().toISOString() : null,
      })),
    );
    if (error) throw error;
  }

  await db.from("cc_essays").delete().eq("student_id", profile.id);
  const { error: ee } = await db.from("cc_essays").insert({
    student_id: profile.id,
    essay_type: "personal_statement",
    prompt_text: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
    word_limit: 650,
    phase: "brainstorm",
  });
  if (ee) throw ee;

  console.log(`${v.key.padEnd(20)} → user ${userId.slice(0, 8)} grade=${v.grade ?? "-"} transfer=${v.transfer} schools=[${v.statuses.join(",")}] dupProfiles=${profile.duplicates}`);
}
