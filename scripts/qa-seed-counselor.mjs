// QA seed: give the e2e-head persona a full agency workspace so the counselor
// screens have real content to test. Idempotent. Reads PGURL-less — uses
// NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from env (.env.local).
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('missing supabase env'); process.exit(1); }
const db = createClient(URL, KEY, { auth: { persistSession: false } });

async function ensureUser(email, password) {
  const { data: created } = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (created?.user) return created.user.id;
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const u = list?.users.find((x) => x.email === email);
  if (!u) throw new Error('cannot find/create ' + email);
  await db.auth.admin.updateUserById(u.id, { password, email_confirm: true });
  return u.id;
}

const PW = 'E2eTestPass!1';
const headId = await ensureUser('e2e-head@test.local', PW);
const stu1 = await ensureUser('e2e-student1@test.local', PW);
const stu2 = await ensureUser('e2e-student2@test.local', PW);

// counselor row for head
await db.from('cc_counselors').upsert({ user_id: headId, slug: 'e2e-qa-head', display_name: 'QA Head Counselor' }, { onConflict: 'user_id' });

// agency
const { data: agency } = await db.from('cc_agencies').upsert({ slug: 'e2e-qa-agency', name: 'QA Demo Agency' }, { onConflict: 'slug' }).select('id').single();
const agencyId = agency.id;

// head membership
await db.from('cc_agency_members').upsert({ agency_id: agencyId, user_id: headId, role: 'head', requires_review: false }, { onConflict: 'agency_id,user_id' });

// two invite codes (one used, one fresh)
await db.from('cc_agency_invite_codes').delete().eq('agency_id', agencyId);
await db.from('cc_agency_invite_codes').insert([
  { agency_id: agencyId, code: 'E2E-QA-AGENCY-AB3K9P', label: 'cohort A', max_uses: 1, used_count: 1, created_by_user_id: headId },
  { agency_id: agencyId, code: 'E2E-QA-AGENCY-QM7T2X', label: 'cohort B', max_uses: 5, used_count: 0, created_by_user_id: headId },
]);

// two linked students with profiles
await db.from('cc_student_counselor_links').upsert([
  { agency_id: agencyId, student_user_id: stu1, primary_counselor_user_id: headId, status: 'active' },
  { agency_id: agencyId, student_user_id: stu2, primary_counselor_user_id: headId, status: 'active' },
], { onConflict: 'agency_id,student_user_id' });

// profiles (delete-then-insert: cc_student_profiles has no UNIQUE(user_id))
for (const [uid, prof] of [
  [stu1, { preferred_name: 'Maya Chen', grade_level: 11, graduation_year: 2027, high_school_name: 'Lincoln High', state_province: 'CA', profile_completion_pct: 64, is_transfer_student: false }],
  [stu2, { preferred_name: 'Devon Park', grade_level: 12, graduation_year: 2026, high_school_name: 'Riverside Prep', state_province: 'TX', profile_completion_pct: 88, is_transfer_student: false }],
]) {
  await db.from('cc_student_profiles').delete().eq('user_id', uid);
  await db.from('cc_student_profiles').insert({ user_id: uid, ...prof });
}

console.log('SEEDED head=' + headId.slice(0, 8) + ' agency=' + agencyId.slice(0, 8) + ' (2 codes, 2 students)');
