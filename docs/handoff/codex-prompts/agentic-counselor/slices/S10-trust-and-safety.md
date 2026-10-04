# S10 — Trust and safety: integrity log, family digest, escalation, credential redaction, age gate, pace settings (effort: High)

## Why
These are differentiators 3, 7 and 8, plus the red lines in 09-27 §8. What families pay human counselors for, beyond advice, is trust:
- the counselor never writes for the student;
- parents are reassured in a language they understand;
- the counselor knows their limits and refers;
- the student's data is safe.

Common App treats AI-written content as fraud, so a "coached, not written" record is something students can *use*.

## Read first
- 02-SPEC §4.8–§4.10, §8 and §9.
- 03-DESIGN §4b.
- `docs/research/2026-09-27-agent-differentiation-research.md` §2 (IECA and NACAC quotes), §8 (red lines: credentials, COPPA, FERPA, consent).
- Existing code:
  - family mode: `src/app/cc/family/**`, `src/app/api/cc/coach/family-mode/*`, the parent share link `src/app/parent/[token]`, `src/components/cc/TranslateForParentButton.tsx`;
  - share settings: `src/app/cc/share-settings`;
  - the S4 tables and roles.

## Scope
1. **Integrity log.**
   - Table `cc_integrity_events(id, user_id, essay_id, role, kind, counts jsonb, check_result, created_at)`.
   - Kinds: `question`, `critique`, `story_link`, `outline_from_stories`, `declined_prose_request`. **Never store the student's text here.**
   - Written from Wren and S4 turns.
   - Page `/cc/essays/integrity`: timeline per essay, plus export as PDF (server-rendered) and CSV. The export header says what it is and isn't ("A record of coaching. It does not include your essay text unless you add it.").
   - Optional: "include my final text" toggle.
   - The student can share the log with a linked counselor.
2. **Credential redaction.** `src/lib/cc/safety/redact-credentials.ts` runs on every inbound message, before storage and before the model. It covers:
   - passwords near portal words (FSA, FAFSA, Common App, UCAS, OUAC, CSS, login, password);
   - SSN and SIN patterns;
   - card numbers (Luhn).

   It replaces them with `[removed for your safety]`. Kairos then explains, from a fixed template, why it never takes credentials (the FSA ID is a legal signature). Unit-test it with positive and negative cases, including false positives like "my SAT is 1450".
3. **`refer_to_human` tool and escalation card.**
   - Triggers: immigration or visa status, disability accommodations, legal questions, aid appeals beyond the checklist, harassment or safety, and distress.
   - Distress detection: a keyword plus model classifier with a high-recall test set. It shows the fixed crisis component (US 988; UK Samaritans 116 123; Canada 9-8-8; plus "talk to a trusted adult or your school counselor"). It never diagnoses and never continues coaching in the same turn.
   - If the student is linked to an agency, a `referral` work-queue item is created for their counselor (S7), with the student's consent prompt shown first.
4. **Family digest.**
   - Table `cc_family_grants(id, student_id, parent_contact, language, scopes text[], created_at, revoked_at)`. Scopes: `dates`, `costs`, `parent_tasks`, `weekly_plan`; **never** essays, stories or application status unless a separate explicit scope `status` is granted.
   - The digest is generated from the same evidence rows and plan as the student sees, translated (the translate route exists), and delivered in-app through the parent link. Email delivery is **stopped and asked**: it messages real users.
   - The grant is rechecked on every read; revoking it kills the link immediately (test this).
5. **Age gate.**
   - Collect the birth year at signup (and once for existing users on the next login).
   - Under 13: block the use of AI features until verifiable parental consent. Implement the "consent pending" state and a consent request flow, but **stop and ask the founder** about which verification method to use.
   - Don't retain raw voice audio after the session (verify the current behavior and document it).
6. **Pace (temperament) settings** in `/settings`: Gentle / Steady / Full control, plus nudge channel, quiet hours, pause for a week, and what a linked counselor can see. These are read by S4 triggers and the S5 dock.

## Tests first
- No student text is ever written to the integrity events (a schema plus writer test).
- The export contains counts and dates only by default.
- The redaction cases.
- Distress routing, including the fixed component, using a test set of 20 positive and 20 negative messages, with recall ≥ 95% on positives.
- Grant scopes and revocation.
- The age gate blocks AI routes for under-13 accounts without consent (route tests across coach, agent and voice).
- The pace setting changes trigger cadence (fixed clock).

## Evidence
Screenshots at 375 and 1440: the integrity page and export, the escalation card, the crisis component, the parent digest in Spanish and Hindi, the age gate, and pace settings.

## Prod checks
- The QA student pastes "my FSA ID password is hunter2": the stored message is redacted, and Kairos explains.
- A distress test message shows the crisis component.
- Grant a parent digest and open the parent link; revoke it, and the link returns 404.
- Export the integrity log.
