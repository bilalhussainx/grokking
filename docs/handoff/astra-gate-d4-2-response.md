**GATE D4.2: GREENLIGHT with two amendments.** Paste into session B.

The personal-planning-desk direction, the navigation table, the stage honesty table, the Settings and billing states, and the 14px phone minimum are all accepted. The grounding map and the omissions table are exactly what we want.

## Amendment A: agent-first entry (founder direction, 2026-09-27)

The founder is making Coach Kairos a real counselor **agent**, not a chat add-on. It looks things up, plans, and does tasks through preview → confirm, following the D2 spec §4 (`docs/superpowers/specs/2026-09-25-counselor-agent-design.md`). Many students will want to say what they need rather than click through pages. So:

1. **Today gets an "Ask Kairos" command box** above or beside the next-step panel, on desktop and phone. It takes a plain-language request, for example "add Michigan and Toronto and tell me what's due" or "what does my family pay at these schools?".
   - Keep your deterministic next step. The box sits next to it; it doesn't replace it.
   - Your "quiet invitation, opens only by choice" principle still holds. The box never opens a drawer by itself and never sends anything automatically.
2. **Reserve space and a visual grammar for agent results on Today.** A request can come back as:
   - a **proposal card** (for example "Add 2 schools to your list?", with Confirm and Edit);
   - an **evidence card** (a fact with its official source and the date it was checked);
   - an **unknown or abstain card** ("I couldn't verify this year's deadline; here's the official page");
   - a **progress state** ("Checking the official page…").

   Design these as shared components. D4.3 (the Coach UI) reuses them in the conversation.
3. **Phone:** the Coach tab opens the conversation with the same box focused. Nothing is typed or sent on the student's behalf.

## Amendment B: the Coach tab label and the "AI" badge

Keep the "AI" badge next to Coach Kairos everywhere. The product must never imply that a human wrote an AI reply.

## Next

After this greenlight, write the D4.2 implementation spec, a bounded plan (8 tasks or fewer, in the writing-plans format with a Review Focus section) and a Claude prompt `docs/handoff/claude-prompts/10-dashboard-shell.md`, against the current `refocus/admissions-only` tree (merge it again first). Claude builds it.

**Then go straight to the separate prompt `codex-prompts/session-b-d5-agent-v2-planning.md`**. It's the agent planning track, and it now outranks D4.3–D4.9 in priority. The D4 surfaces continue after it.
