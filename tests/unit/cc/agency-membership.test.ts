// tests/unit/cc/agency-membership.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { admin, ensureAgency, ensureCounselorRow, ensureAgencyMember, resetCounselorE2eState } from '../../e2e/helpers/db-fixtures';
import { ensurePersonaUser } from '../../e2e/helpers/auth-fixtures';
import { getAgencyMembership, listAgencyMembers, setRequiresReview } from '@/lib/cc/agency-membership';

describe('agency-membership helpers', () => {
  let agencyId: string;
  let headUserId: string;
  let counselorUserId: string;

  beforeAll(async () => {
    await resetCounselorE2eState();
    const head = await ensurePersonaUser('head');
    const counselor = await ensurePersonaUser('counselor');
    headUserId = head.userId;
    counselorUserId = counselor.userId;
    agencyId = await ensureAgency('e2e-membership', 'E2E Membership Agency');
    await ensureCounselorRow(headUserId, 'E2E Head');
    await ensureCounselorRow(counselorUserId, 'E2E Counselor');
    await ensureAgencyMember(agencyId, headUserId, 'head');
    await ensureAgencyMember(agencyId, counselorUserId, 'counselor', true);
  });

  it('getAgencyMembership returns role + requires_review for member', async () => {
    const m = await getAgencyMembership(headUserId, agencyId);
    expect(m).toEqual(expect.objectContaining({ role: 'head', requiresReview: false }));
  });

  it('getAgencyMembership returns null for non-member', async () => {
    const m = await getAgencyMembership('00000000-0000-0000-0000-000000000000', agencyId);
    expect(m).toBeNull();
  });

  it('listAgencyMembers returns both members ordered by role then joined_at', async () => {
    const ms = await listAgencyMembers(agencyId);
    expect(ms).toHaveLength(2);
    expect(ms[0].role).toBe('head');
  });

  it('setRequiresReview flips the flag', async () => {
    await setRequiresReview(agencyId, counselorUserId, false);
    const m = await getAgencyMembership(counselorUserId, agencyId);
    expect(m?.requiresReview).toBe(false);
  });
});

// Suppress noisy "admin is unused" lint — it's part of the public fixture surface.
void admin;
