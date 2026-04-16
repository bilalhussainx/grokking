import { Module } from "../types";

export const module7: Module = {
  id: "growth-strategy",
  title: "Growth Strategy & Marketing Automation",
  description: "Product-led growth, viral loops, referral programs, marketing automation workflows, CRM strategy, and building a scalable marketing system",
  lessons: [
    {
      id: "growth-strategy",
      slug: "growth-strategy",
      title: "Growth Strategy & Marketing Automation",
      content: `# Growth Strategy & Marketing Automation

Sustainable growth comes from systems, not campaigns. The best marketing teams build flywheels — loops where growth creates more growth — and automate the repetitive parts so humans can focus on strategy.

---

\`\`\`concept
{
  "title": "The Growth Flywheel vs The Funnel",
  "variant": "mental-model",
  "content": "The traditional funnel is linear: attract → convert → close. It ends. A flywheel is circular: happy customers refer new customers who become happy customers who refer more. Amazon's flywheel: more customers → more sellers → lower prices → more customers. Your job as a growth marketer is to identify your flywheel's friction points (where it slows) and grease them. Every dollar reducing friction compounds — unlike funnel dollars that run through once and stop."
}
\`\`\`

---

## Product-Led Growth (PLG)

\`\`\`
PLG: the product itself drives acquisition, conversion, and expansion
Examples: Slack (invite coworkers), Dropbox (share files), Figma (collaborate)

--- PLG motion ---
Free → Upgrade path:
1. Remove friction from the signup (no credit card, no sales call)
2. Deliver "aha moment" as fast as possible
   Slack: first message sent + first reply received
   Dropbox: first file synced across 2 devices
3. Trigger upgrade when user hits natural limit (storage, users, features)

--- Viral coefficient (K-factor) ---
K = (number of invites per user) × (invite conversion rate)
K > 1 = viral growth (each user brings > 1 new user)
K = 0.5 = still grows if paired with paid acquisition

--- How to increase virality ---
• Collaboration features (invite teammates to see/edit)
• Share outputs (Canva designs, Typeform links, Notion pages)
• Co-branding ("Made with [Product]" watermarks)
• Referral programs with bilateral rewards (both parties benefit)

--- PLG metrics ---
Product Qualified Lead (PQL): user who has completed key in-product actions
  Define PQL: "completed 3 projects + invited 1 teammate"
Time-to-value (TTV): how long from signup to aha moment?
  Target: under 5 minutes for B2C, under 30 minutes for B2B
Activation rate: % of signups who reach aha moment
  Benchmark: 25-40% is healthy, < 10% = onboarding problem
\`\`\`

## Referral Programs

\`\`\`
--- Program design ---
Reward structure options:
• Cash reward (PayPal, Venmo): highest conversion, highest cost
• Account credits: cheaper, incentivizes product usage
• Discount on next purchase: works for e-commerce
• Tiered rewards: more referrals = better rewards (gamification)

Best practices:
• Bilateral: refer a friend AND the friend gets a reward (Uber: \$10 for both)
• Make sharing dead simple: pre-filled email, one-click social share
• Show progress: "You've referred 3 friends — 2 more for Silver status"
• Time-limit: "Share by Friday for a bonus reward"

--- Tracking ---
Unique referral links per user (not a generic code)
Track: shares, clicks, signups, revenue from referred users
Compare LTV of referred vs. non-referred customers
  Referred customers typically have 25-30% higher LTV (trust transfer)

--- Tools ---
ReferralHero, Viral Loops, Referral Rock (SaaS)
For e-commerce: Shopify + Klaviyo integration
For enterprise: Salesforce + Gainsight referral programs
\`\`\`

## Marketing Automation Workflows

\`\`\`
Tools: HubSpot, Marketo, Klaviyo (e-commerce), ActiveCampaign, Customer.io

--- Lead nurturing sequence (B2B SaaS) ---
Trigger: form fill → downloaded lead magnet

Day 0:  Deliver lead magnet + welcome (manual send, personalized)
Day 2:  Educational content related to lead magnet topic
Day 5:  Case study: how similar company solved the problem
Day 8:  Common objections addressed
Day 12: Invite to webinar or live demo
Day 15: Direct pitch email: "Ready to discuss?"
Day 20: Breakup email: "Is this still relevant?"
         (Breakup emails often reactivate 5-10% of cold leads)

--- Behavioral triggers ---
If opened last 3 emails AND visited pricing page:
  → Alert sales rep immediately (hot lead)
  → Add to "high intent" segment
  → Send 1:1 personalized email from rep

If didn't open last 4 emails:
  → Move to re-engagement sequence
  → Subject line: "Should I remove you from this list?"
  → If still no open: unsubscribe (improves deliverability)

--- E-commerce automation flows ---
Abandoned cart (most valuable): trigger 1h, 24h, 72h after abandonment
  Email 1: "You left something behind" + product image
  Email 2: "Still thinking it over?" + social proof
  Email 3: Discount offer (5-10%) with urgency

Post-purchase: delivery confirmation → review request → cross-sell
Win-back: 60 days inactive → "We miss you" + offer
\`\`\`

## CRM Strategy & Sales-Marketing Alignment

\`\`\`
--- CRM as the source of truth ---
All leads, contacts, and deals live in the CRM
Marketing automation syncs to CRM (bidirectional)
Sales sees full contact history: emails opened, pages visited, content downloaded

--- Lead scoring model ---
Action → Points:
+20: Visited pricing page
+15: Downloaded case study
+10: Opened last 3 emails
+10: Attended webinar
+5:  Visited homepage
-10: Job seeker / student
-15: Competitor domain

SQL threshold (Marketing Qualified → Sales Qualified): 50+ points
Automated: high-score leads routed to sales within minutes

--- SLA (Service Level Agreement) between Marketing and Sales ---
Marketing delivers: 100 MQLs per month at < \$150 CPL
Sales commits: respond to MQLs within 1 business hour
              Follow up 5 times before marking as dead lead

Without this SLA, leads fall through gaps
Track: MQL-to-SQL rate (target: 15-25%), SQL-to-close rate (varies by industry)

--- Attribution alignment ---
Marketing owns: awareness, leads, MQLs
Sales owns: SQLs, demos, closed deals
Share: revenue attribution (which channels produce closed deals, not just leads?)
Marketing should optimize for revenue, not just lead volume
\`\`\`

\`\`\`takeaways
["Build flywheels, not funnels — systems where growth creates more growth compound indefinitely.", "Viral coefficient (K) > 1 means exponential growth — engineer every sharing moment to increase K.", "Product Qualified Leads (PQLs) convert 3-5x better than MQLs — define your aha moment and track who reaches it.", "Breakup emails ('Should I remove you?') reactivate 5-10% of cold leads — schedule them at day 20.", "Lead scoring routes hot leads to sales instantly — time-to-contact matters: leads contacted within 1 hour convert 7x more than 24-hour responses.", "Marketing should optimize for closed revenue, not MQL volume — otherwise you get lots of leads that don't close."]
\`\`\`
`,
    },
  ],
};
