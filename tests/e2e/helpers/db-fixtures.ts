import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function admin(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
}

export async function ensureCounselorRow(userId: string, displayName: string): Promise<string> {
  const db = admin();
  const slug = `e2e-${userId.slice(0, 8)}`;
  const { data } = await db
    .from('cc_counselors')
    .upsert({ user_id: userId, slug, display_name: displayName }, { onConflict: 'user_id' })
    .select('id')
    .single();
  if (!data) throw new Error('counselor upsert failed');
  return data.id as string;
}

export async function ensureAgency(slug: string, name: string): Promise<string> {
  const db = admin();
  const { data } = await db
    .from('cc_agencies')
    .upsert({ slug, name }, { onConflict: 'slug' })
    .select('id')
    .single();
  if (!data) throw new Error('agency upsert failed');
  return data.id as string;
}

export async function ensureAgencyMember(
  agencyId: string,
  userId: string,
  role: 'head' | 'counselor',
  requiresReview = false,
): Promise<void> {
  const db = admin();
  const { error } = await db
    .from('cc_agency_members')
    .upsert({ agency_id: agencyId, user_id: userId, role, requires_review: requiresReview }, { onConflict: 'agency_id,user_id' });
  if (error) throw new Error(`member upsert failed: ${error.message}`);
}

export async function resetCounselorE2eState(): Promise<void> {
  // Idempotent: wipe e2e-scoped agency rows by slug prefix so reruns start clean.
  const db = admin();
  const { data: agencies } = await db.from('cc_agencies').select('id').like('slug', 'e2e-%');
  if (!agencies?.length) return;
  const ids = agencies.map(a => a.id as string);
  await db.from('cc_agency_invite_codes').delete().in('agency_id', ids);
  await db.from('cc_student_counselor_links').delete().in('agency_id', ids);
  await db.from('cc_agency_members').delete().in('agency_id', ids);
  await db.from('cc_agencies').delete().in('id', ids);
  await db.from('cc_counselor_requests').delete().like('message', 'e2e:%');
}
