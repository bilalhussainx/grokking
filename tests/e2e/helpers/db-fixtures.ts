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

  // 1. Wipe everything scoped to e2e-prefixed agencies (FK-respecting order).
  const { data: agencies } = await db.from('cc_agencies').select('id').like('slug', 'e2e-%');
  const agencyIds = (agencies ?? []).map(a => a.id as string);
  if (agencyIds.length) {
    await db.from('cc_agency_invite_codes').delete().in('agency_id', agencyIds);
    await db.from('cc_student_counselor_links').delete().in('agency_id', agencyIds);
    await db.from('cc_agency_members').delete().in('agency_id', agencyIds);
    await db.from('cc_agencies').delete().in('id', agencyIds);
  }

  // 2. Sweep orphan requests by persona email — robust against missing message prefixes.
  // auth.users isn't reachable via the PostgREST client even with service role,
  // so we page through the admin listUsers API to find persona userIds. One page
  // at perPage=1000 comfortably covers any e2e persona count.
  const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const personaIds = (list?.users ?? [])
    .filter(u => u.email?.startsWith('e2e-') && u.email.endsWith('@test.local'))
    .map(u => u.id);
  if (personaIds.length) {
    await db.from('cc_counselor_requests').delete().in('student_user_id', personaIds);
    await db.from('cc_counselor_requests').delete().in('counselor_user_id', personaIds);
  }
}
