import { Module } from "../types";

export const module4: Module = {
  id: "social-media-paid",
  title: "Social Media Marketing & Paid Advertising",
  description: "Platform-specific strategies for LinkedIn, Instagram, and TikTok, Google Ads campaigns, Meta Ads targeting, audience building, and performance measurement",
  lessons: [
    {
      id: "social-media-paid",
      slug: "social-media-paid",
      title: "Social Media & Paid Ads",
      content: `# Social Media Marketing & Paid Advertising

Organic content builds brand. Paid advertising scales it. The best digital marketers use both — organic to find what resonates, paid to amplify what works.

---

\`\`\`concept
{
  "title": "Organic vs Paid: The Right Mental Model",
  "variant": "mental-model",
  "content": "Organic social media is compound interest — it takes time, but the audience you build owns itself. Paid advertising is renting attention — immediate but expensive. The smart playbook: use organic content to A/B test messaging. When a post resonates organically (high engagement rate), put paid budget behind it. You're not guessing what to promote — you know it works. This is why successful brands don't run ads on content they haven't tested organically first."
}
\`\`\`

---

## Platform Strategy

\`\`\`compare
{
  "title": "Platform Selection Guide",
  "items": [
    {
      "name": "LinkedIn",
      "description": "B2B audiences, professionals, decision-makers. Best content: thought leadership, case studies, industry data, hiring announcements. Organic reach is higher than other platforms for B2B. Ads: Lead Gen Forms (fill without leaving LinkedIn). CPL is high but lead quality is best for enterprise B2B."
    },
    {
      "name": "Instagram / Reels",
      "description": "Visual brands, e-commerce, lifestyle. Reels get 3x more reach than static posts. Stories for daily engagement + polls/questions. Shopping tags for e-commerce. Meta Ads manager handles Instagram + Facebook together — powerful cross-platform targeting."
    },
    {
      "name": "TikTok",
      "description": "Youngest demographic, highest organic reach potential. Authenticity beats production quality. Trends move fast — post 1-3x daily for reach. Great for B2C brands willing to embrace entertainment-first content. TikTok Shop for direct commerce."
    },
    {
      "name": "YouTube",
      "description": "Second largest search engine. Educational, how-to, and review content performs best. Long-form (10-20 min) earns ad revenue; Shorts (60s) for discovery. A video ranking on YouTube also ranks in Google Search — double the distribution."
    }
  ]
}
\`\`\`

## Google Ads: Search Campaigns

\`\`\`
--- Campaign structure (SKAGs are outdated — use tighter ad groups) ---
Account → Campaign → Ad Groups → Keywords → Ads

Campaign: "CRM Software"
  Ad Group: "CRM for Sales Teams"
    Keywords: crm software for sales, sales crm tool, best crm for salespeople
    Ads: 2-3 responsive search ads
  Ad Group: "CRM Pricing"
    Keywords: crm software pricing, how much does crm cost, crm price comparison
    Ads: 2-3 ads with pricing focus

--- Keyword match types ---
Broad match:    crm software           → also matches "client management app" (uses AI)
Phrase match:  "crm software"          → matches "best crm software for startups"
Exact match:   [crm software]          → matches "crm software" only (or close variants)

Use exact for high-intent, low-volume keywords
Use phrase for mid-funnel research queries
Use broad match ONLY with Smart Bidding + conversion tracking (otherwise burns budget)

--- Negative keywords (essential) ---
Add to prevent wasted spend:
- If you're paid SaaS: add "free", "open source", "github"
- If B2B: add "job", "career", "salary", "interview"
- Irrelevant industries: check Search Terms report weekly

--- Bidding strategy ---
Maximize Conversions: Google spends budget to get most conversions (no CPA target)
Target CPA: Google spends to hit cost-per-acquisition target (needs 30-50 conversions/month)
Target ROAS: optimize for revenue/spend ratio (needs 50+ conversions/month)
Manual CPC: full control, more work, best for small budgets or new campaigns

--- Quality Score (1-10) ---
= Expected CTR + Ad Relevance + Landing Page Experience
Higher QS → lower CPC for same position
Improve: tighten keyword-to-ad relevance, improve landing page load speed
\`\`\`

## Meta Ads: Facebook & Instagram

\`\`\`
--- Campaign objectives ---
Awareness: Reach, Brand Awareness (top of funnel)
Consideration: Traffic, Engagement, Video Views, Lead Generation
Conversion: Sales, Catalog Sales (best for e-commerce)

Always choose objective based on your actual business goal:
If you want purchases → choose Conversions (not Traffic)
If you want email signups → choose Lead Generation or Conversions

--- Audience targeting ---
Core audiences (interest/demographic): broad, good for awareness
Custom audiences: your email list, website visitors, video viewers
Lookalike audiences: 1-10% of people similar to your custom audience
  - 1% LAL = most similar, smallest, most expensive
  - 5% LAL = broader, cheaper, more scale

--- Retargeting funnel ---
Cold audience (interest targeting) → Video View custom audience → Purchase retargeting
→ Layer: show different creative at each stage

--- Creative best practices ---
• Hook in first 3 seconds (thumb-stopping)
• Square (1:1) or vertical (4:5) format — takes more screen space
• Show the product in use, not just product photos
• UGC (user-generated content) outperforms polished ads 60% of the time
• Test 3-5 creative variants per ad set, kill losers after \$50-100 spend

--- Meta Pixel / Conversions API ---
Install Meta Pixel on all pages
Set up Conversions API (server-side) for iOS 14+ accuracy
Track: ViewContent, AddToCart, InitiateCheckout, Purchase
Without this: campaign optimization is flying blind
\`\`\`

## Email Marketing Funnels

\`\`\`
--- The email funnel ---
Lead magnet → Opt-in → Welcome sequence → Nurture → Offer → Re-engagement

--- Welcome sequence (most important) ---
Email 1 (immediate): Deliver lead magnet + who you are
Email 2 (day 2): Your best piece of content (establish credibility)
Email 3 (day 4): Address the main objection to your offer
Email 4 (day 7): Social proof (case study, testimonial)
Email 5 (day 10): Soft pitch → introduce paid offer

--- Key metrics ---
Open rate: 20-40% is healthy (varies by industry)
Click rate: 2-5% is good
Unsubscribe rate: < 0.5% per send (higher = content/frequency problem)
Deliverability: check spam score before sending (mail-tester.com)

--- Subject line frameworks ---
Curiosity gap: "The mistake 80% of marketers make with SEO"
Specificity: "How we grew from 0 to 10,000 subscribers in 6 months"
Personalization: "\${first_name}, your account is ready"
Urgency: "Last chance: sale ends midnight"
\`\`\`

\`\`\`takeaways
["Test content organically before paying to amplify it — promoted posts that already have engagement outperform cold ads.", "Google Search Ads: negative keywords are as important as keywords — add irrelevant terms weekly from the Search Terms report.", "Meta Ads: always choose the objective matching your actual goal — choosing Traffic when you want sales costs 3-5x more per purchase.", "Lookalike audiences from your email list or purchasers outperform interest targeting for conversion campaigns.", "Welcome email sequences have 4x higher open rates than regular campaigns — invest heavily in your first 5 emails.", "Install both Meta Pixel AND Conversions API — server-side tracking recovers 20-30% of conversions lost to iOS privacy changes."]
\`\`\`
`,
    },
  ],
};
