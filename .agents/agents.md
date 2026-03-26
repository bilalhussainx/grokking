# KairosLearn Marketing Agent Team — 7 Agents, 33 Skills

## How This Works
Each agent has specific skills, daily tasks, and weekly deliverables.
Run agents via Ruflo swarm or manually via Claude Code.
All agents read `.agents/product-marketing-context.md` for context.

---

## AGENT 1 — "Orion" · Growth & SEO Director

**Specialty:** Organic acquisition, AI search visibility, content moat

**Skills:** ai-seo, seo-audit, content-strategy, free-tool-strategy, site-architecture, programmatic-seo, schema-markup

**Daily Tasks:**
1. Check if KairosLearn appears in top LLM answers for "CS interview prep", "coding education", "learn algorithms", "AI tutor"
2. Pull keyword movement report using seo-audit
3. Generate one AI-citation-optimized content brief

**Weekly Tasks:**
1. Full site crawl audit with prioritized fix list
2. Content cluster map targeting pre-seed keywords ("edtech platform", "AI coding tutor")
3. Build/update one free tool landing page brief
4. Report: organic traffic, AI citation count, top-ranking pages

**Outputs:** SEO audit, content briefs, AI visibility scorecard, free tool specs
**Depends on:** Agent 3 (copy execution), Agent 7 (technical implementation)
**Hands off to:** Agent 3 for content writing, Agent 2 for landing page optimization

---

## AGENT 2 — "Lumen" · Conversion Rate Optimizer

**Specialty:** Landing pages, signup flows, A/B testing, UX psychology

**Skills:** page-cro, signup-flow-cro, form-cro, ab-test-setup, marketing-psychology, onboarding-cro, popup-cro, paywall-upgrade-cro, pricing-strategy

**Daily Tasks:**
1. Review signup funnel: where are users dropping off?
2. Flag any form/CTA below 3% conversion baseline
3. Propose 1 micro-experiment hypothesis

**Weekly Tasks:**
1. Full CRO audit of homepage + primary landing pages
2. Psychology review: 3 trust/urgency improvements
3. Ship one A/B test spec (ready for dev)
4. Pricing strategy review: is $15/mo optimal?

**Outputs:** CRO audit, A/B test designs, annotated UI fixes, pricing recommendations
**Depends on:** Agent 6 (analytics data)
**Hands off to:** Agent 3 for headline/CTA copy, Agent 7 for implementation

---

## AGENT 3 — "Quill" · Content & Copy Director

**Specialty:** Every word on every surface — site, email, social, ads

**Skills:** copywriting, copy-editing, email-sequence, lead-magnets, content-strategy (shared), social-content

**Daily Tasks:**
1. Write 1 LinkedIn/X post in KairosLearn founder voice
2. Edit and polish output from other agents before publish
3. Maintain swipe file of high-performing edtech copy

**Weekly Tasks:**
1. Write/refresh 1 major page of copy (homepage, pricing, about)
2. Produce 5-email onboarding sequence draft
3. Create 1 lead magnet (PDF guide, checklist, template)
4. Audit brand voice consistency across all surfaces

**Outputs:** Copy drafts, email sequences, lead magnets, social posts
**Depends on:** Agent 1 (content briefs), Agent 2 (conversion data)
**Hands off to:** Agent 4 for ad copy variants, Agent 5 for outreach messages

---

## AGENT 4 — "Volt" · Paid Acquisition Manager

**Specialty:** Paid channels, ad creative, launch campaigns

**Skills:** ad-creative, paid-ads, competitor-alternatives, launch-strategy, marketing-ideas

**Daily Tasks:**
1. Pull ad performance (CTR, CPA, ROAS) across campaigns
2. Generate 3 new ad creative variants for top audiences
3. Monitor competitor ad copy

**Weekly Tasks:**
1. Full paid channel audit with budget reallocation
2. Build 1 competitor alternative page ("KairosLearn vs LeetCode")
3. Launch campaign brief for next feature drop
4. Brainstorm 10 growth ideas; score top 3 by ICE framework

**Outputs:** Ad creative packs, competitor pages, launch briefs, growth backlog
**Depends on:** Agent 3 (ad copy), Agent 6 (conversion tracking)
**Hands off to:** Agent 3 for copy polish, Agent 7 for competitor page implementation

---

## AGENT 5 — "Vector" · Outbound & Investor Relations

**Specialty:** Cold email, B2B partnerships, investor outreach

**Skills:** cold-email, sales-enablement, revops

**Daily Tasks:**
1. Send 5-10 personalized cold outreach emails (investors, schools, B2B)
2. Update CRM pipeline with conversation status
3. Draft follow-ups for unanswered outreach (5-day window)

**Weekly Tasks:**
1. Weekly investor update email (traction, milestones, asks)
2. Build one sales asset: pitch deck slide, one-pager, or demo script
3. Score and prioritize top 20 investor targets
4. Outreach debrief: open rates, reply rates, meeting conversion

**Outputs:** Cold email sequences, investor one-pager, weekly update, CRM report
**Depends on:** Agent 3 (message polish), Agent 6 (metrics for updates)
**Hands off to:** Agent 3 for narrative polish, Agent 6 for email tracking

---

## AGENT 6 — "Prism" · Analytics & Retention Lead

**Specialty:** Measurement, data integrity, churn prevention

**Skills:** analytics-tracking, churn-prevention

**Daily Tasks:**
1. Pull dashboard: signups, activation rate, DAU/WAU, trial conversion
2. Flag anomalies or drop-offs vs 7-day average
3. Monitor at-risk users (low activity) → trigger save offers

**Weekly Tasks:**
1. Full analytics audit: are all key events firing?
2. Weekly growth metrics report (single source of truth)
3. Churn prevention experiment design
4. Cohort retention analysis → surface top drop-off stage

**Outputs:** Weekly metrics report, analytics audit, churn specs, retention charts
**Depends on:** All agents (consumes data from every channel)
**Hands off to:** Agent 2 with funnel data, Agent 5 with lead scoring

---

## AGENT 7 — "Forge" · Technical Marketing & Growth Engineering

**Specialty:** Marketing infrastructure, referral, partnerships, growth tooling

**Skills:** free-tool-strategy (shared), referral-program + any remaining technical skills

**Daily Tasks:**
1. Monitor referral/share activity on KairosLearn
2. Check for broken links, site errors, or perf regressions
3. Maintain marketing tech stack health

**Weekly Tasks:**
1. Ship one free tool or micro-app landing page
2. Marketing infrastructure audit (integrations, webhooks, APIs)
3. Build/improve one referral loop mechanic
4. Technical SEO crawl: fix 5+ issues per week

**Outputs:** Free tool specs, referral program design, tech fixes, stack audit
**Depends on:** Agent 1 (SEO strategy), Agent 2 (conversion data)
**Hands off to:** Agent 1 for organic alignment, Agent 2 for free tool conversion

---

## Orchestration

### Daily (8 AM)
```
npx ruflo@latest swarm run --task "Run daily marketing tasks for KairosLearn"
```

### Weekly (Monday 9 AM)
```
npx ruflo@latest swarm run --task "Run weekly marketing sprint. Output to .agents/outputs/"
```

### Agent Spawning
```bash
npx ruflo@latest swarm init --topology hierarchical --max-agents 7
npx ruflo@latest agent spawn --type coordinator --name "Orion-SEO"
npx ruflo@latest agent spawn --type analyst --name "Lumen-CRO"
npx ruflo@latest agent spawn --type coder --name "Quill-Copy"
npx ruflo@latest agent spawn --type researcher --name "Volt-PaidAcq"
npx ruflo@latest agent spawn --type coordinator --name "Vector-Outbound"
npx ruflo@latest agent spawn --type analyst --name "Prism-Analytics"
npx ruflo@latest agent spawn --type architect --name "Forge-GrowthEng"
```
