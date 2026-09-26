# Pro price change notice (draft for the founder to send)

Claude does not send this. Edit, send from your own account, then follow the checklist.

---

**Subject:** A change to KairosLearn Pro pricing

Hi {first name},

Thank you for being a KairosLearn Pro member.

Starting with your first renewal on or after **{effective date}**, Pro will be **$15/month**, up from $12. Nothing changes before then, and you keep everything Pro includes.

If you'd rather pay once a year, Pro is now also available for **$99/year**, about 45% less than paying monthly. You can switch from your billing page.

If you'd like to cancel instead, you can do it any time before {effective date} from **Settings → Billing → Manage subscription**, and you won't be charged the new price.

Questions? Just reply to this email.

— {founder name}, KairosLearn

---

## Checklist

1. Choose the effective date. Give at least the notice your terms promise: `src/app/terms/page.tsx` says "30 days' notice to existing subscribers".
2. Send the email above to every active Pro subscriber on the $12 price.
3. After the effective date, run the dry run and check the count and IDs:
   `npx tsx scripts/stripe/migrate-pro-price.ts --old=<$12 price id> --new=<$15 price id> --live`
4. Apply with the count the dry run printed:
   `npx tsx scripts/stripe/migrate-pro-price.ts --old=<$12 price id> --new=<$15 price id> --apply --expect=<N> --live`
5. Each moved subscription is billed $15 from its next renewal (no proration).
