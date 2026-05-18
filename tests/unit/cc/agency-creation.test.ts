import { describe, it, expect, beforeAll } from 'vitest';
import { resetCounselorE2eState, admin } from '../../e2e/helpers/db-fixtures';
import { ensurePersonaUser } from '../../e2e/helpers/auth-fixtures';
import { createAgencyAndMakeHead } from '@/lib/cc/agency-creation';

describe('createAgencyAndMakeHead', () => {
  let userId: string;
  beforeAll(async () => {
    await resetCounselorE2eState();
    const user = await ensurePersonaUser('head');
    userId = user.userId;
  });

  it('creates the agency, ensures counselor row, and inserts head membership', async () => {
    const { agencyId, agencySlug } = await createAgencyAndMakeHead(userId, {
      name: 'E2E Creation Agency',
      slug: 'e2e-creation',
      displayName: 'E2E Creator',
    });

    expect(agencyId).toBeTruthy();
    expect(agencySlug).toBe('e2e-creation');

    const db = admin();
    const { data: member } = await db.from('cc_agency_members')
      .select('role').eq('agency_id', agencyId).eq('user_id', userId).single();
    expect(member?.role).toBe('head');

    const { data: counselor } = await db.from('cc_counselors')
      .select('id').eq('user_id', userId).single();
    expect(counselor?.id).toBeTruthy();
  });

  it('is idempotent — second call returns same agency', async () => {
    const first = await createAgencyAndMakeHead(userId, {
      name: 'E2E Creation Agency',
      slug: 'e2e-creation',
      displayName: 'E2E Creator',
    });
    const second = await createAgencyAndMakeHead(userId, {
      name: 'E2E Creation Agency',
      slug: 'e2e-creation',
      displayName: 'E2E Creator',
    });
    expect(first.agencyId).toBe(second.agencyId);
  });
});
