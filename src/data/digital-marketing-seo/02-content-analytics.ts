import { Module } from "../types";

export const module2: Module = {
  id: "content-analytics",
  title: "Content Marketing, Analytics & Paid Channels",
  description: "Build content that ranks and converts, measure with GA4, run Google and Meta ads profitably, and build email funnels that drive LTV",
  lessons: [
    {
      id: "content-strategy-analytics",
      slug: "content-strategy-analytics",
      title: "Content Strategy, GA4 Analytics & Paid Advertising",
      content: `# Digital Marketing: Content, Analytics & Paid Channels

Modern digital marketing is three loops: attract (SEO/ads), engage (content), and retain (email). Each loop measures differently.

---

## Content Marketing Strategy

\`\`\`compare
{
  "title": "Content Marketing Frameworks",
  "items": [
    {
      "name": "Topic Cluster Model",
      "description": "One pillar page (comprehensive guide on broad topic) + multiple cluster pages (specific subtopics) linking back to it. Example: Pillar = 'Complete TypeScript Guide', Clusters = 'TypeScript generics', 'TypeScript decorators', 'TypeScript vs JavaScript'. Signals topical authority to Google."
    },
    {
      "name": "SERP-First Approach",
      "description": "Search the keyword before writing. Analyze top 5 results: What headings do they use? What questions do they answer? What do they all miss? Write to answer the full intent PLUS fill the gap others miss. The gap is your competitive advantage."
    },
    {
      "name": "The Content Upgrade",
      "description": "Offer a downloadable resource related to the specific post (checklist, template, cheat sheet) in exchange for email. Converts 5-10x better than generic newsletter sign-ups because the offer matches the reader's current intent."
    }
  ]
}
\`\`\`

## Google Analytics 4 (GA4)

\`\`\`javascript
// GA4 uses an event-based data model (vs session-based in UA)
// Key events to track for a course platform:

// 1. Install GA4 tag (via Google Tag Manager or direct):
gtag('config', 'G-XXXXXXXXXX');

// 2. Track custom events:
// Course enrollment:
gtag('event', 'course_enroll', {
  course_id: 'typescript-complete',
  course_tier: 'pro',
  value: 10,
  currency: 'USD',
});

// Lesson completion:
gtag('event', 'lesson_complete', {
  course_id: 'typescript-complete',
  lesson_id: 'type-system',
  lesson_number: 1,
  time_spent_seconds: 420,
});

// Checkout start:
gtag('event', 'begin_checkout', {
  currency: 'USD',
  value: 10,
  items: [{ item_id: 'pro_monthly', item_name: 'Pro Plan', price: 10 }],
});
\`\`\`

**Key GA4 Reports for a Learning Platform:**
- **Acquisition**: Where do new users come from? (Organic/Paid/Social)
- **Engagement**: Which courses keep users engaged longest?
- **Conversions**: Funnel from landing page → free signup → Pro upgrade
- **Retention**: Day 1/7/30 cohort retention — are users coming back?

## Google Ads: Search Campaign

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Search Ads",
      "icon": "🔍",
      "content": "### Google Search Ads (PPC)\\n\\nShows when users search specific keywords. Pay per click (CPC). Highest purchase intent of any channel.\\n\\n**Campaign structure:**\\n\`\`\`\\nCampaign: TypeScript Courses\\n  Ad Group: TypeScript Online Course\\n    Keywords: [typescript online course] (exact)\\n               typescript course (broad)\\n               +learn +typescript (broad match modifier)\\n    Ad 1: Headline 1 | Headline 2 | Headline 3\\n          Description 1 | Description 2\\n    Ad 2: (different angle)\\n\`\`\`\\n\\n**Metrics:**\\n- CTR (Click-through rate): 3-5% is good for search\\n- CPC (Cost per click): target < LTV / 3\\n- Quality Score (1-10): relevance of ad → keyword → landing page\\n- ROAS (Return on ad spend): revenue / ad spend. Target > 3x"
    },
    {
      "label": "Meta (Facebook/Instagram)",
      "icon": "📱",
      "content": "### Meta Ads: Interest & Lookalike Targeting\\n\\nMeta doesn't search by keyword — targets by interest, behavior, demographics, and lookalikes.\\n\\n**Campaign structure:**\\n- **Awareness**: Video views, brand recall — top of funnel\\n- **Consideration**: Traffic, lead gen — middle of funnel\\n- **Conversion**: Purchase, sign-up — bottom of funnel\\n\\n**The Lookalike Audience:** Upload your paying customer list → Meta finds people with similar profiles. Typically 2-5x better ROAS than interest targeting.\\n\\n**Retargeting:** Show ads to people who visited your pricing page but didn't convert. Add Meta Pixel to site, build custom audiences by URL visited."
    },
    {
      "label": "Email Marketing",
      "icon": "📧",
      "content": "### Email: Highest-ROI Channel (42:1 average ROI)\\n\\n**Funnel design:**\\n1. Lead magnet (free cheat sheet/course) → email capture\\n2. Welcome sequence (5-7 emails, 10-14 days):\\n   - Email 1: Deliver lead magnet + introduce brand\\n   - Email 2: Your story / why this matters\\n   - Email 3: Most useful tip / quick win\\n   - Email 4: Case study / social proof\\n   - Email 5: Soft pitch (here's how we can help more)\\n   - Email 6-7: Handle objections + strong CTA\\n3. Ongoing: 1-2x/week value emails, monthly promotion\\n\\n**Key metrics:**\\n- Open rate: 20-30% good for SaaS/education\\n- Click rate: 2-5% good\\n- Unsubscribe rate: < 0.5% (above = list quality problem)"
    }
  ]
}
\`\`\`

## Marketing Measurement Framework

\`\`\`sysdiag
{
  "type": "funnel",
  "title": "Full Funnel Metrics",
  "stages": [
    { "stage": "Awareness", "metric": "Impressions, Reach, Organic Traffic", "tool": "GA4, Search Console, Social Analytics" },
    { "stage": "Consideration", "metric": "Sessions, Pages/Session, Email Signups", "tool": "GA4 Engagement, Email Platform" },
    { "stage": "Conversion", "metric": "Trial Rate, Purchase Rate, Revenue", "tool": "GA4 Conversions, Stripe/Paddle" },
    { "stage": "Retention", "metric": "Churn Rate, LTV, NPS", "tool": "Mixpanel, Customer.io" },
    { "stage": "Referral", "metric": "Referral Traffic, Reviews, Social Shares", "tool": "GA4, Trustpilot, Social Listening" }
  ]
}
\`\`\`

\`\`\`takeaways
["Topic cluster model: one comprehensive pillar + many specific clusters interlinked — signals topical authority", "SERP-first content: analyze top 5 results, answer everything they answer + fill the gap they miss", "GA4 event tracking: measure course enrollments, lesson completions, checkout starts — not just pageviews", "Google Ads Quality Score: higher score = lower CPC. Improve by matching ad, keyword, and landing page tightly.", "Meta Lookalike Audiences from existing customers consistently outperform interest-based targeting", "Email welcome sequence: 5-7 emails over 14 days. Deliver value first, pitch last. Highest-engagement window."]
\`\`\`
`,
    },
  ],
};
