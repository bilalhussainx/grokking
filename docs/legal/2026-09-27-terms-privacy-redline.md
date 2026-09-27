# Terms and Privacy redline: admissions-only product and new pricing

_Drafted by Claude on 2026-09-27 for the founder's approval. Nothing here is live until you say "apply the redline". It isn't legal advice; if you have counsel, run it past them._

**Why:** the pre-deploy check found that `/terms` and `/privacy` still describe the retired course product, and `/terms` describes the old free plan. The new free plan is 200 credits once, not "first three schools" with monthly resets. Pricing numbers in the page stay wired to `src/lib/pricing.ts`.

## /terms (`src/app/terms/page.tsx`)

**§2 Description of service.**
- The paragraph says "Coach Kairos available in 18 languages". Drop the count or name the languages. Use the list in `src/lib/cc/coach-languages.ts`; don't hard-code a number.
- Delete: "The platform also includes a library of interactive courses and AI voice tutoring."

**§4 Free plan.**
- Replace: "Free forever for your first three schools, with limited AI coaching credits, free courses, and basic voice tutoring. Free accounts may have usage limits that reset monthly."
- With: "Free accounts get {PRICING.free.signupCredits} AI credits once, at signup. Credits don't reset. When they run out, the AI features pause until you upgrade; everything you saved stays yours."

**§4 Pro plan.**
- Replace: "Unlimited schools, essays, voice sessions, languages, mock interviews, the full financial-aid comparator, and access to all courses. New users get a free 7-day Pro trial with no card required."
- With: "Pro is unlimited under fair use: every admissions tool, including school list, essays, activities, interview practice, and the financial-aid and net-price tools. Daily fair-use limits apply to coach messages and voice minutes. New users get a free {PRICING.pro.trialDays}-day Pro trial with no card required."
- Check before approving: is "no card required" still true of the Stripe trial flow?

**§6 Acceptable use.**
- Replace "copy course content" with "copy platform content".

**§7 Intellectual property.**
- Replace: "All course content, lesson materials, code exercises, and platform design… You may use course content for personal learning but may not redistribute…"
- With: "The platform, its design, and the content we create (guides, prompts, and tools) are the intellectual property of KairosLearn. Your essays, activities, and other work you create remain yours."
- Adding that ownership sentence is a policy decision. Keep it only if you agree.

**§8 heading and list.**
- "AI Counseling and Tutoring Disclaimer" becomes "AI Counseling Disclaimer".
- Delete the bullet "Health and wellness course content is educational only — not medical advice".

## /privacy (`src/app/privacy/page.tsx`)

- **Line 28:** "Learning preferences, language settings, and course progress" becomes "Language settings, grade, school list, and application progress".
- **Line 30:** "Audio from voice tutoring sessions" becomes "Audio from voice coaching sessions".
- **Line 35:** "Pages visited, courses accessed, lesson completion, time spent learning" becomes "Pages visited and features used".
- **Line 43:** "Personalize your learning experience and AI tutoring" becomes "Personalize your college guidance and AI coaching".
- **Line 46:** "improve our courses and features" becomes "improve our features".
- **Line 54:** "Deepgram: Speech-to-text and text-to-speech for voice tutoring" becomes "…for voice coaching".

**Data we still hold from the retired course product:** course progress, XP and credentials rows. They stay in the database for at least 30 days (spec rule 1). The privacy page doesn't need to change for that. If you later drop those tables (follow-up F3), nothing here changes either.
