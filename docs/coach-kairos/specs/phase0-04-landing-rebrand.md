# Phase 0.4 — Landing Page, Rebrand & UI Cleanup

## Goal
"Someone visiting kairoslearn.com understands it is a college counselor for first-gen students." (PRD Phase 0 milestone)

## Deliverables

### A. New Landing Page (`src/app/page.tsx`)
Replace the existing learning-platform hero with a college-counselor-first design:

1. **Hero section**: "Your free AI college counselor. For first-gen students. In your language."
2. **3 persona testimonials** (animated cards below fold):
   - Maria — first-gen Latina, parents speak Spanish, applied to 12 schools
   - Jamal — low-income Black student, no college-educated relatives
   - Priya — international student from India, navigating US admissions
3. **Single CTA**: "Start your free plan" → links to `/intake` (future) or `/signup`
4. **Below fold**: feature highlights (voice coaching, school list, essay help, financial aid, jargon translator)
5. **"Supplemental Learning" section**: collapsed/de-emphasized course catalog
6. **Footer**: keep existing but add Coach Kairos branding

### B. Rebrand Coach Alex → Coach Kairos (copy only)
- Find/replace "Coach Alex" → "Coach Kairos" across all user-facing strings
- Do NOT change the coaching logic — Phase 1 handles multi-agent upgrade
- Files: AICoach.tsx, SessionNotes.tsx, about/page.tsx, blog posts, onboarding, providers.tsx, etc.

### C. Hide Blockchain Credential UI
- Feature-flag the `/credentials` page (show only if `NEXT_PUBLIC_CREDENTIALS_ENABLED=true`)
- Remove credentials from navigation/TopNav
- Keep all code in place — just hide from student-facing routes

### D. Hide Tech-Interview Personas under /career
- Move tech-interview content to `/career` sub-route
- Remove from main nav and landing page
- Keep functional — just relocated

### E. Seed 50 Schools
- Create `scripts/seed-schools.ts` with top 50 US schools by application volume
- Fields: name, city, state, type, acceptance_rate, avg_net_price, test_policy, app_deadline, website

## Acceptance Criteria
- [ ] Landing page clearly communicates "AI college counselor for first-gen students"
- [ ] Three persona testimonials render with animations
- [ ] Single CTA ("Start your free plan") is prominent
- [ ] Course catalog is present but de-emphasized
- [ ] All "Coach Alex" strings replaced with "Coach Kairos"
- [ ] /credentials hidden from nav (accessible only with env flag)
- [ ] Tech-interview personas accessible at /career, not on landing
- [ ] 50 schools seeded in cc_schools
