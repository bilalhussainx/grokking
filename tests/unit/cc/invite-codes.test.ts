// tests/unit/cc/invite-codes.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { resetCounselorE2eState, ensureAgency, ensureAgencyMember, ensureCounselorRow, admin } from '../../e2e/helpers/db-fixtures';
import { ensurePersonaUser } from '../../e2e/helpers/auth-fixtures';
import { mintInviteCode, listInviteCodes, revokeInviteCode, redeemInviteCode, generateCodeString } from '@/lib/cc/invite-codes';

describe('invite-codes helpers', () => {
  let agencyId: string;
  let headUserId: string;
  let studentUserId: string;

  beforeAll(async () => {
    await resetCounselorE2eState();
    const head = await ensurePersonaUser('head');
    const student = await ensurePersonaUser('student-with-code');
    headUserId = head.userId;
    studentUserId = student.userId;
    agencyId = await ensureAgency('e2e-codes', 'E2E Codes Agency');
    await ensureCounselorRow(headUserId, 'E2E Head');
    await ensureAgencyMember(agencyId, headUserId, 'head');
  });

  it('generateCodeString produces an uppercase alphanumeric string', () => {
    const s = generateCodeString('ADASTRA');
    expect(s).toMatch(/^ADASTRA-[A-Z0-9]{6}$/);
  });

  it('mintInviteCode creates a row and returns the code', async () => {
    const code = await mintInviteCode(agencyId, headUserId, { label: 'cohort A', maxUses: 1 });
    expect(code.code).toMatch(/^E2E-CODES-/);
    expect(code.usedCount).toBe(0);
  });

  it('listInviteCodes returns minted codes ordered newest first', async () => {
    const first = await mintInviteCode(agencyId, headUserId, { label: 'order-A', maxUses: 1 });
    const second = await mintInviteCode(agencyId, headUserId, { label: 'order-B', maxUses: 1 });
    const list = await listInviteCodes(agencyId);
    expect(list.length).toBeGreaterThanOrEqual(2);
    // Newest first: the second (later) mint must precede the first.
    expect(list[0].id).toBe(second.id);
    const firstIdx = list.findIndex((c) => c.id === first.id);
    const secondIdx = list.findIndex((c) => c.id === second.id);
    expect(secondIdx).toBeLessThan(firstIdx);
  });

  it('redeemInviteCode increments used_count and creates link', async () => {
    const code = await mintInviteCode(agencyId, headUserId, { label: 'cohort B', maxUses: 1, preassignedCounselorUserId: headUserId });
    const result = await redeemInviteCode(code.code, studentUserId);
    expect(result.linkId).toBeTruthy();
    expect(result.agencyId).toBe(agencyId);

    const db = admin();
    const { data: reread } = await db.from('cc_agency_invite_codes')
      .select('used_count').eq('id', code.id).single();
    expect(reread?.used_count).toBe(1);
  });

  it('redeemInviteCode throws when code exhausted', async () => {
    const code = await mintInviteCode(agencyId, headUserId, { label: 'one-shot', maxUses: 1, preassignedCounselorUserId: headUserId });
    await redeemInviteCode(code.code, studentUserId);
    await expect(redeemInviteCode(code.code, studentUserId)).rejects.toThrow(/exhausted|used_count|already/i);
  });

  it('revokeInviteCode sets revoked_at and prevents redemption', async () => {
    const code = await mintInviteCode(agencyId, headUserId, { label: 'to revoke', maxUses: 5, preassignedCounselorUserId: headUserId });
    await revokeInviteCode(code.id, agencyId);
    await expect(redeemInviteCode(code.code, studentUserId)).rejects.toThrow(/revoked/i);
  });
});
