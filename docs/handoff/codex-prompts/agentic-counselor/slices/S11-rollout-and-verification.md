# S11 — Rollout: flags on, live checks in all voice languages, claims sync (effort: Medium)

## Why
Everything so far ships behind flags and allowlists. This slice turns it on safely, measures it in production, and makes the marketing claims match the measurements.

## Pre-conditions (the founder does these; Codex prepares a checklist and stops until they're done)
- All migrations from S1, S3, S4, S7, S8 and S10 are applied to production, and the S3 evidence seed is loaded (list the files).
- An Exa or Firecrawl key is set for the S3 refresh job, or the founder accepts curated-only evidence for launch.
- The founder has chosen the under-13 consent verification method (S10), or under-13 signups are blocked.
- `AGENT_CONFIRM_SECRET` is set (≥ 32 chars).
- The OpenRouter account has a balance for real traffic (at least $50 suggested), and the per-key limit is set.
- Native reviewers have marked the Indic languages they approve in `docs/qa/evidence/voice/<date>-indic-review.md`.
- The founder answers the [OPEN] items in 02-SPEC §9 (data-sale commitment).

## Scope
1. **Staged flag rollout:**
   - **Stage 1:** QA accounts plus founder accounts (`AGENT_S1_USER_IDS`), for 48 h.
   - **Stage 2:** 10% of active students. Add percentage support to `s1-flag.ts` by hashing the user id, with a test.
   - **Stage 3:** everyone. Each stage needs the founder's go.
   - A kill switch: `AGENT_S1_ENABLED=0` must return everything to legacy within one deploy. Test it.
2. **Monitoring** (no new vendor): an admin-only page `/admin/agent-health` that shows, from the logs and tables:
   - turns per day and agent error codes (`AGENT_ERROR_CODES`);
   - proposal confirm and decline rates;
   - nudge send, open and dismiss counts;
   - voice latency p50 and p90 per language (`voice_latency_events`);
   - overlong replies;
   - evidence health: published, stale and quarantined counts, refresh job failures, and the share of agent facts answered "not yet verified";
   - rule-engine conflicts raised and resolved;
   - safety: credential redactions, referrals and distress components shown (counts only).
3. **Verified voice languages:** `src/lib/voice/verified-voice-languages.ts`.
   - The probe (S1/S2) runs against production for all 17 languages, and the results are written into this file.
   - A language is `verified` only if it passes: the latency target for its group, 100% language-correct, ≤ 35 words median, and (Indic) native-review approved.
   - The landing voice band, FAQ and any "N languages for voice" copy read from this file.
   - The text coach keeps `COACH_LANGUAGE_COUNT` (18).
4. **Claims sync:** run the S6 claims test with the real config, update copy, and redeploy. Record the final claims in `docs/qa/evidence/codex-S11/claims.md` with the evidence for each.
5. **Golden-set run:** run the full 120-case golden set plus the 40 seeds from 09-27 §4 through the role engine once, with a $5 cap. Commit the report and fix any rule violations before Stage 3. Hard zero is required for: prose, ungrounded dates, personal probabilities and accepted credentials.

## Acceptance
- Stage 1 has run 48 h with:
  - zero 5xx spikes;
  - zero secrets in client payloads (re-run the secrets checks);
  - proposals committing and undoing correctly;
  - voice p50 within targets for the verified set.
- The claims file matches production.

## Final report
Include:
- the per-language latency table (p50 and p90);
- verified versus unverified languages, with reasons;
- the rollout stage reached;
- the open founder items.
