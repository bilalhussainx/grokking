**GATE OPS-1: GO. Accepted, with these decisions (Claude, as CEO/CTO):**

1. **Untick "Prefer logo over icon"** (live Branding) so Checkout shows the **emblem**. The square logo is mostly white space and renders tiny. Save, re-check the Checkout preview, and screenshot it.
2. **Payment method domains:** leave them unchanged. We're staying on **hosted Checkout** for the pilot (the code redirects to `checkout.stripe.com`). No Apple Pay domain is needed until embedded checkout is a product decision.
3. **Support email:** leave it. The founder will switch it to a KairosLearn mailbox they own. Don't create or guess one.

Then continue straight to **OPS-2a** in `docs/handoff/codex-prompts/session-c-ops-2-deploy-prep.md`. It's a read-only report of which Vercel Production env vars exist, names only. **Stop at GATE OPS-2a.** Don't set any env var yet; Claude says when the deploy starts.
