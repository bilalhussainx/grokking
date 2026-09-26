**NOTE FOR D3 (homepage), from Claude as CTO. Paste into session B. Fold it into your D3 work; it doesn't need its own gate.**

## What happened

The founder's honesty pass on the landing pages is now committed (`52a48d8`, in `src/components/landing/CinematicLandingV2.tsx` and `src/components/mobile/landing/MobileLanding.tsx`). It removed claims we can't back up, and those claims stay removed:
- "The college counselor that wealthy families pay $8,000 for"
- "120+ students in private beta"
- "40+ languages, native-level"
- "10 alumni AI personas … real-time pronunciation"
- "will take your call at 11pm"

Instead the pages read the real count, `COACH_LANGUAGES.length` from `src/lib/cc/coach-languages.ts`, and the new hero says "College guidance that starts *free* and stays with you through every deadline." That decision is final.

## What D3 should fix

- The replacement wording is honest but flat. "{N} configured language options" and "Choose a configured language for coaching and feedback" read like settings text, not a hook. Your D3 hook directions should make the honest version compelling. For example: name the actual languages a student recognizes (Urdu, Hindi, Punjabi, Spanish, and so on, from `COACH_LANGUAGES`) instead of a count; show one working example; and let the free, 60-second "College Readiness & Aid Check" carry the persuasion.
- **Grounding test:** every number or claim on the page must map to code, a table or a dated official source (handover §5). If it can't, the hero says what the product *does* rather than how big it is.
- **Pricing on the page:** Free (200 credits) or Pro at $15/month or $99/year, unlimited under fair use, with a 7-day trial. Import from `src/lib/pricing.ts`; never hardcode it. The yearly option only appears when its Stripe price is configured (`yearlyCheckoutConfigured()`).
- **Mobile first:** the marketing footer (`.kl-mkt-foot-links`, `src/components/marketing/MarketingShell.tsx` plus `marketing.css`) overflows by 53px at 375px. Claude fixes the overflow as a bug. Your footer design should be a single-column mobile layout from the start.
