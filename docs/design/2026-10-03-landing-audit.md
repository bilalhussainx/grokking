# KairosLearn signed-out marketing site audit (2026-10-03)

Scope: https://www.kairoslearn.com, live master 7c58b6c. Pages audited at 1440x900 and 375x812: `/`, `/pricing`, `/signup`, `/login`, `/find-counselor`, `/faq`, `/about`, `/product/counselor|essays|schools`, `/stories`, `/integrity`, `/privacy`, `/terms`. No login, no payment, no accounts created. Evidence: `landing-evidence/` (fold and full-page PNGs per page and viewport, `crawl-all.json` with raw metrics, `hero-*.png`). Scripts: `landing-audit/`.

## Headline verdict

The homepage is calm, warm and well-made, but it never says what KairosLearn is. The pages behind it contradict the homepage on price, trial terms and language count, and `/stories` shows named, fabricated-looking admits. The site also uses three unrelated visual systems. A 17-year-old would not learn from the hero that this is an AI counselor. The UK is not mentioned anywhere on the homepage.

Severity key: Blocker / Major / Minor / Polish. Separated into Broken, Confusing and Missing where it helps.

## 1. Five-second test

Hero copy (verbatim): eyebrow "COLLEGE GUIDANCE, AT YOUR PACE"; H1 "Your future. One good next step."; sub "Three answers. One thing you can do next."; card "Let's start where you are." with three selects (Your stage / Where you might study / What is on your mind?) and the button "Find my next step". Footnote: "No signup. Your answers stay on this page."

- Student (17): can say "college help, a quiz of some kind". Cannot say it is an AI counselor, that it is a product, or why it beats ChatGPT, a school counselor or Crimson. The words "AI", "counselor", "essay coaching" and "Coach Kairos" do not appear above the fold. They first show up in the Pro card, far down the page. (Major)
- Parent: sees a soft, pleasant page. Nothing says who it is for, what it costs, who runs it, or whether it is safe. The family section is mid-page and about "a conversation". (Major)
- Tab title says "Your AI college counselor, for every student". The og:title says "Your future. One good next step." The page itself says neither. The strongest positioning line is in the `<title>` only.
- Hero select options: stage (Grade 9-10, 11, 12 applying, 12 submitted, 12 decisions, Transfer), study place (US, Canada, Still exploring), topic (school list, what it could cost, my essay). **There is no UK option**, though the product serves US, UK and Canada. This contradicts the research white space. (Major, Missing)

## 2. Differentiation vs the research white space

| White space | Communicated? | Evidence |
|---|---|---|
| Proactive, not just answering | No | Hero is reactive: you pick three dropdowns. No promise like "Coach reaches out when a deadline is near." |
| US + UK + Canada + transfer | Partial | Transfer and Canada are in the quiz. UK is absent from the homepage, product pages, FAQ and about. Zero hits for UK or UCAS in `src/app/page.tsx`. |
| Affordable vs $25k+ firms | Weak | Homepage shows $15/month but never contrasts it. The pricing page has "Less than one hour with a private counselor". The about page says "$5,000 consultant". Best line is buried. |
| Not selling student attention | No | There is no ads, no data-selling or "no recruiter outreach" statement. `/privacy` was not found linked from the hero or any claim. CollegeVine's recruiter funding model is the most-complained-about gap in the research, and we leave it unused. |
| Never writes essays (integrity) | Yes, strong | "You write every essay" appears on the homepage 4 times, plus `/integrity`. This is the best-communicated point. Keep it. |

## 3. CTA and funnel

- Interactive hero: it does something real. I ran Grade 12 applying + Canada + essay, and Transfer + US + school list. Each returns "One thing to do next" and "A question to answer" with no signup. (Good, keep.)
- Quality of the answer: it is canned. The Canada essay answer is "name a decision you made..." plus "Look at the specific program as well as the university's admissions page." The Canada choice changed only a generic line. A teen will see it is a lookup table, not the AI counselor.
- The answer card has **no CTA attached** and no "Keep going with Coach Kairos". Links inside the result are only "Thinking about cost first?" and "Find the first missing piece". The result appears below the 900px fold on desktop and further down on mobile, so users may not see it after clicking. (Major)
- Empty submit shows only the browser's native "Please select an item in the list" bubble. (Polish)
- Primary CTA: "Start free ↗" in the header (desktop only). **On mobile (375px) the header has no Start free button and no menu**: only language select and "Sign in". The first mobile "Start free" is in the Plans section, after about 3 screens. (Major)
- The CTA arrow "↗" implies an external link; it goes to `/signup`. (Polish)
- Clicks to first value: 0 clicks (quiz, canned answer). 2 clicks to an account (Start free, Create Account or Google). Signup page says "Free 7-day Pro trial for students — 200 AI credits to start" and nothing about what happens next (no onboarding preview, no "you'll tell Coach your grade and countries").
- Signup form: Google or email+password, "Min 6 characters". There is no consent or privacy line at the form, and no parent or under-18 note. (Minor)
- Funnel dead end: `/find-counselor` shows "No counselors match your filters. Try widening the search." with empty filters, i.e. the public directory is empty. The copy promises "counselors with a verified admit history". There are no profile pages to audit. (Major, Broken or Missing). It is also not in the header or footer, but it is in the sitemap.

## 4. Trust

Unsupported, invented or risky claims:

1. **`/stories` (Blocker).** Three named testimonials: "Ayesha R. Accepted — Stanford '29, Karachi", "Jaskaran S.", "Maya A. Accepted — Grinnell, full aid". The only disclosure is small text at the bottom ("illustrative voices... We're collecting verified, named outcomes"). It sits in the sitemap, uses headline "Students who got in where they didn't expect to", and quotes like "my Stanford supplement twice over" and "graduating debt-free". This is fabricated proof of admission, which contradicts "never promise admission" and the integrity brand. Remove it or replace with real, consented stories.
2. **Pricing says "Free forever" and "unlimited everything"** while the homepage says Free = 200 credits once, not renewing, and Pro has fair use (300 coach messages and 120 voice minutes a day). The pricing and FAQ copy describe an older plan: "3 schools, 1 essay draft, 3 voice sessions/month, English only, 1 mock". (Blocker, see section 7)
3. **"18 languages"** on about, FAQ, product and pricing vs **5 languages** on the homepage (English, Español, हिन्दी, ਪੰਜਾਬੀ, اردو). The FAQ lists 10. Pick one true number.
4. **"sub-second latency"** (product/counselor): no evidence. Drop or measure.
5. **"415 students per counselor"** (about, product): no source cited. Link ASCA/NCES or reword.
6. **"verified admit history"** (find-counselor): there are no counselors listed, so it is unsupported.
7. **"alumni AI personas"** and **"reach/match/safety chancing"** (FAQ, about): "chancing" edges toward admission odds. Keep it clearly labeled as an estimate, or cut it.
8. About page: "We're raising our pre-seed round now to bring this to 1 million students worldwide" and "Built with Claude Code" on a student-facing page. Investor copy and build tooling do not reassure a parent. (Minor)
9. `/terms` still mentions "access to all courses" (course product was removed). Stale legal copy. (Minor)

Missing trust elements: no visible founder or team on the homepage (only on `/about`), no privacy summary near signup (only "Your story stays yours" in the footer), no mention of data handling for minors, no counselor or school logos (none should be invented).

Good trust points: hero line "This check uses your entries. It does not estimate what a school will award you." is honest; the cost check labels unknowns ("Nothing is treated as zero unless you enter zero."); the stories page does at least disclose illustrative status.

## 5. Visual and design quality

- **Three different visual systems** (Broken consistency, Major):
  1. Home, `/faq`, `/about`: warm cream "Daybreak" with Nunito-style type, sun illustration. Matches the signed-in Daybreak app.
  2. `/pricing`, `/product/*`, `/stories`: near-black navy with gold, Cormorant serif, "k" square logo.
  3. `/signup`, `/login`, `/find-counselor`, `/faq`, `/about` (nav): pure black app shell with "Search ⌘K", "Sign In / Sign Up", a round circular logo.
  A visitor going home to pricing to signup sees three brands. The signed-in app is Daybreak; only the homepage matches it.
- **Double-logo / mixed emblem issue (confirmed):** every navy page (`/pricing`, `/product/*`, `/stories`) has the navy header with the gold "k" logo and, at the bottom, a cream footer with the circular BRAND-1 emblem. See `pricing-d-full.png`. The cream block against the black page reads as a pasted-in footer. `/signup` also shows two logos at once (header logo and a large circular emblem in the card; `signup-d-fold.png`).
- Homepage: strong hierarchy, generous space, clear contrast on the large type. Small footnote text (e.g. "No signup. Your answers stay on this page.") is small and mid-tone. I judged contrast visually. I did not run a computed ratio.
- Hero illustration has `alt=""` (decorative, OK). All 3 homepage images have empty alt, acceptable here as they are decorative.
- Mobile 375px: no horizontal overflow on any page (scrollWidth 375 on all 14). The homepage hero stacks well, and selects are full width. Mobile gaps: no header CTA (see section 3), pricing mobile uses a hamburger while home has none.
- Language switcher "Quick check language" in the header only translates the quiz. A user may expect the whole site to switch. (Minor, Confusing)
- Homepage jumps from hero to a language banner before explaining the product. That banner uses prime space for "आपका स्वागत है" etc. It is nice, but it pushes the "what is this" explanation below the fold.

## 6. Technical

Measured by Playwright (Chromium, one run, warm connection, so treat as best-case):

- Weight: about 1.4 MiB transferred for `/` (48 requests), 1.6-1.7 MiB on `/pricing` and `/product/*` (72 requests). Hero is mostly text; this is heavy for a text-only page. Worth a bundle review. (Minor)
- LCP: 208 ms desktop, 2588 ms mobile on the homepage (single run, mobile CPU not throttled; verify with Lighthouse/CrUX). TTFB about 14-57 ms. First paint 208 ms. Other pages LCP 90-300 ms except `/signup` and `/login` (about 800 ms).
- Console: no errors. One warning on `/find-counselor` and `/faq`: a preloaded CSS chunk not used within a few seconds. (Polish)
- **Canonical and domain mismatch (Major):** every page's canonical, `og:image` and the sitemap and robots `Sitemap:` line use the apex `https://kairoslearn.com`. The apex returns **307 Temporary Redirect** to `https://www.kairoslearn.com/`. So canonical points to a URL that redirects to the real page. Pick one host; make the redirect 308/301 and the canonical match the final URL. Also the og:image URL (`https://kairoslearn.com/opengraph-image?...`) goes through that redirect, which some scrapers do not follow.
- **Canonical is wrong on subpages:** `/pricing`, `/signup`, `/login`, `/about`, `/product/*`, `/stories`, `/find-counselor` all report `canonical = https://kairoslearn.com/` (homepage). Only `/faq` has its own. Search engines may treat these as duplicates of the homepage. (Major)
- **Titles and OG:** `/signup`, `/login`, `/find-counselor` use the generic homepage title. `/pricing`, `/product/*`, `/stories`, `/about` have unique titles, but their og:title is the homepage's "Your future. One good next step." Only `/faq` has a page-specific OG title. `/pricing` title has the brand twice: "Pricing — KairosLearn | KairosLearn" (same on the product, stories, about, faq, legal pages). (Minor)
- Meta descriptions: homepage "College guidance, at your pace..." is good. `/pricing` description says "Free forever for the first three schools... unlimited everything", wrong against current pricing. `/about` says "Harvard CS grad turned educator... speaks 18 languages". `/signup` and `/login` reuse the homepage description.
- robots: `User-agent: *`, Allow `/`, Disallow `/api/`, `/admin/`, `/settings/`; fine. Sitemap lists 13 URLs including `/stories` (see trust issue) and `/find-counselor` (empty). `/find-counselor` should not be indexed while empty.
- Headings: homepage has a single H1 and sensible H2/H3. The footer uses H2s for "Platform / Resources / Legal", which pollutes the outline (Polish). `/login` H1 is "KairosLearn" (brand, not page purpose). The signup H1 "Join KairosLearn" is fine.
- Image alt: 3 images on the homepage, all alt="" (decorative). Pricing and product pages not exhaustively checked.
- Footer links to `/cc`, `/schools`, `/cc/interview-prep` ("Coach Kairos", "School list", "Interview prep"): these are signed-in app routes; a signed-out visitor presumably lands on a login wall. I did not follow them. (Confusing, to verify)
- The login page still says "Sign in to continue learning" (legacy course-product copy) and "Get Started Free — 200 Credits". (Polish)

## 7. Pricing page

- Free vs Pro is visually clear (two cards, comparison table). The content is out of date against the founder's current model (`src/lib/pricing.ts`: Free = 200 credits once; Pro = $15/mo or $99/yr, 7-day trial, fair use).

| Item | Homepage | /pricing, /faq | Source of truth |
|---|---|---|---|
| Free plan | 200 credits, once, no renewal | "$0 forever", 3 schools, 1 essay, 3 voice sessions/mo, English only | 200 credits once |
| Pro limits | Fair use 300 coach messages/day, 120 voice min/day | "Unlimited everything", "unlimited (fair use)" | Fair use |
| Languages | 5 in the quiz | 18 | unknown, needs a decision |
| Trial | "7-day Pro trial, then $15/month USD or $99/year USD" | "Free 7-day trial. No card required." and "Try Pro for 7 days, free." | Signup grants a 7-day trial (no Stripe sub); billing starts only if the user subscribes |

- Trial honesty: "No card required" appears consistent with the code path (a signup trial with no Stripe subscription; first charge is deferred or immediate if under 48 h remain; see `src/app/api/billing/stripe/__tests__/checkout.test.ts:88-101`). But the pricing page buttons say "START PRO — $15/MONTH" and "START PRO FREE", which go to checkout. A user cannot tell if clicking charges them. Say plainly: "7 days free, no card. After day 7 you choose whether to subscribe." and what the button will do ("Subscribe now" vs "Start trial"). (Major, Confusing)
- The homepage phrase "7-day Pro trial, then $15/month" reads as auto-billing, the opposite of the pricing page. Align wording.
- Free access link: "First-generation or low-income student? You may qualify for free Pro access" is a strong equity message; keep it, but it is a banner and not in the homepage plans.
- "Why $15 instead of free?" FAQ question: honest and good.
- The comparison table's "Priority support", "Reuse detector across supplements", "Activities optimizer": not verified as shipped; confirm.

## Prioritized improvements

### NOW (copy and quick fixes, days)

1. **Unpublish or replace `/stories`** (remove from nav, sitemap and robots, or keep a "coming" page with no named admits). Rationale: fabricated outcomes are the biggest brand and legal risk. Effect: removes the one claim most likely to destroy trust with counselors and parents.
2. **Make pricing, FAQ and meta descriptions match `pricing.ts`** (200 credits once, fair use, no "free forever", no "unlimited everything"). One source of truth for plan facts; also fix `/terms` "all courses". Effect: avoids refund and trust disputes, consistent funnel.
3. **Pick one language count** and use it everywhere (5 vs 10 vs 18). Effect: removes a verifiable inconsistency.
4. **Add the identity line to the hero.** One sentence under the H1 naming AI counselor, countries, essay promise (see rewrites). Effect: passes the five-second test.
5. **Add UK to the hero quiz** ("US, UK, Canada, Still exploring") and a UK path to the result lookup. Effect: signals the cross-system white space; unblocks UK students.
6. **Mobile header CTA:** add "Start free" to the mobile header. Effect: first CTA visible without scrolling.
7. **Attach a CTA to the quiz result** ("Keep going with Coach Kairos, free: 200 credits, no card") and scroll the result into view. Effect: converts the one real engagement moment.
8. **Fix canonical and OG:** per-page canonicals, one host (www), 301/308 not 307, page-specific og:title, and de-duplicate "| KairosLearn | KairosLearn". Add page titles to `/signup`, `/login`, `/find-counselor`. Effect: SEO hygiene and correct link previews.
9. **De-index `/find-counselor`** until it lists real counselors, or hide it from the sitemap. Remove "verified admit history" copy.
10. **Rewrite trial wording** on home, pricing, signup into one sentence stating what is charged and when.
11. Drop or source "sub-second latency" and "415 students"; remove "raising pre-seed" and "Built with Claude Code" from the student-facing about page (move to a separate investor page).

### NEXT (structure, 1-3 weeks)

1. **Unify the visual system** on Daybreak across home, pricing, product, stories, about, signup, login. Retire the navy/gold marketing theme and the black app shell on signed-out pages. Use one header and one footer (this also resolves the double-logo problem). Effect: continuity into the signed-in app.
2. **Restructure the homepage:** hero (what it is + quiz) then proof of differentiation (proactive, three systems, essay promise, price vs firms) then how it works then pricing then FAQ. Move the language banner below the "what it is" block.
3. **Add a "Why not ChatGPT / a school counselor / a $25k firm" comparison block** using only verifiable statements (no competitor price claims without citation; the research file marks many as unverified).
4. **Trust section:** founder, privacy summary ("we don't sell your data, no college recruiter outreach", only if true), essay integrity badge, who sees what (parents, counselors). Link `/privacy` from the signup form.
5. **Signup expectations:** short "what happens next" panel (about 2 minutes: grade, countries, first school) and a parent or under-18 note.
6. Make the footer links go to public pages (`/product/*`) rather than login-walled app routes.

### LATER (new hero or interactive demo)

1. A **live mini-coach**: let the visitor type one real question ("Can I apply to UCAS and Common App together?") and get a short real answer from Coach Kairos, rate-limited and with sources, followed by "Save this plan: free". Replaces the canned lookup. Effect: shows the actual product versus ChatGPT, strongest conversion lever.
2. **Proactive-agent demo**: a mock timeline showing "Coach nudges you 14 days before an OUAC deadline" built from real deadline data. Effect: makes the proactive white space visible.
3. Verified, consented outcome stories and counselor profiles once real.
4. Cost calculator tied to the real net price data, with a sources line.

## Proposed hero rewrites

**Alternative A (plain, student-first)**
- Eyebrow: AI college counselor for the US, UK and Canada
- H1: A college counselor that's there when you are.
- Sub: Build your school list, plan every deadline and get feedback on your essays. You write every word. Free to start, no card.
- Primary CTA: Start free. Secondary: "Try the 3-question check" (scrolls to the quiz).

**Alternative B (parent-and-student, price and integrity)**
- Eyebrow: Not a $25,000 consultant. Not a chatbot that writes your essay.
- H1: Real college guidance, at a price a family can say yes to.
- Sub: Coach Kairos plans your applications across the US, UK and Canada, and tells you what to do next. It coaches your essays and never writes them. Pro is $15/month after a free 7-day trial.
- Primary CTA: Start free. Secondary: "See what the coach says in 30 seconds."

Notes: the "$25,000" line is based on third-party estimates in the research file (marked unverified); use "private firms charge thousands" unless a source is added. Do not promise admission in either version.

## What is already good (keep)

- The essay-integrity message ("AI can interview, structure and critique. You write every essay.") and `/integrity` page.
- The no-signup quiz concept and the honest cost check ("does not estimate what a school will award you", unknown is not zero).
- The Daybreak homepage visual quality, calm tone and no overflow on mobile at 375px.
- Single clear H1 and heading outline on the homepage; robots.txt rules; `/faq` has its own canonical and OG title.
- Pricing structure: two clear plans, comparison table, the first-gen or low-income free-Pro banner, "Why $15 instead of free?" FAQ.
- Multilingual welcome (Hindi, Punjabi, Urdu, Spanish) as an equity signal, and Family Mode as a differentiator.
- Fast first paint and low TTFB.

## Not verified (so you know)

- Contrast ratios were judged by eye, not computed.
- LCP and weight are single warm-run Chromium numbers without throttling.
- Did not follow `/cc`, `/schools`, `/cc/interview-prep` footer links, the product/essays and product/schools page text, `/integrity`, `/privacy` and `/terms` in depth, or the post-signup flow (no account created).
- No counselor profile pages exist to audit: the public directory returned zero counselors.
