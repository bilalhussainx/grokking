import { Module } from "../types";

export const module6: Module = {
  id: "analytics-attribution",
  title: "Marketing Analytics & Attribution",
  description: "GA4 advanced analysis, UTM tracking, multi-touch attribution models, marketing dashboards, ROI calculation, and making data-driven budget decisions",
  lessons: [
    {
      id: "analytics-attribution",
      slug: "analytics-attribution",
      title: "Marketing Analytics & Attribution",
      content: `# Marketing Analytics & Attribution

Data without interpretation is noise. Marketing analytics converts clicks, sessions, and conversions into decisions: which channels to scale, which to cut, and where the budget is wasted.

---

\`\`\`concept
{
  "title": "The Attribution Problem",
  "variant": "mental-model",
  "content": "A customer sees a Google Ad on Monday, reads your blog post on Thursday via organic search, clicks a retargeting Facebook ad on Saturday, and buys via a direct visit on Sunday. Which channel gets credit? Last-click attribution gives 100% credit to Direct (the worst source to optimize for). First-click gives it all to Google Ads. Data-driven attribution distributes credit based on actual conversion probability at each touchpoint. Understanding attribution is why two marketers can look at the same data and draw opposite conclusions."
}
\`\`\`

---

## GA4 Core Reports

\`\`\`
--- Traffic Acquisition ---
Reports → Acquisition → Traffic Acquisition
Default channel groupings: Organic Search, Paid Search, Organic Social,
  Email, Direct, Referral, Display

Key metrics per channel:
• Sessions: total visits
• Engaged sessions: sessions with 10+ seconds, 2+ pages, or conversion
• Engagement rate: engaged sessions / total sessions (replaces bounce rate in GA4)
• Conversions: goal completions
• Revenue: if e-commerce tracking is set up

Red flags:
• High sessions + low engagement rate = traffic quality problem
• High engagement + zero conversions = offer/pricing problem

--- Explorations (custom analysis) ---
Reports → Explore → Blank Exploration

Funnel exploration:
Step 1: page_view where page_location = /pricing
Step 2: begin_checkout
Step 3: purchase
→ Shows where users drop off in your funnel

Cohort analysis:
Week 0: users acquired
Week 1-8: what % returned each week
→ Retention by acquisition channel (which channel gets most loyal users?)

--- User Lifetime Value report ---
Reports → Retention → Lifetime Value
→ How much revenue does an average user generate over time?
→ Compare by first user source — which acquisition channel has highest LTV?
\`\`\`

## UTM Parameters & Campaign Tracking

\`\`\`
UTM parameters tag your URLs so GA4 knows exactly where traffic came from.

--- 5 UTM parameters ---
utm_source:   where (google, facebook, newsletter, partner-site)
utm_medium:   how (cpc, email, social, banner, affiliate)
utm_campaign: which campaign (spring-sale, product-launch, brand-awareness)
utm_content:  which creative (blue-button, video-ad, text-link) [optional]
utm_term:     which keyword (for search ads) [optional]

--- Example tagged URLs ---
Google Ad:
https://mysite.com/pricing?utm_source=google&utm_medium=cpc&utm_campaign=crm-signup&utm_content=headline-a

Newsletter:
https://mysite.com/blog/guide?utm_source=email&utm_medium=newsletter&utm_campaign=weekly-digest

LinkedIn post:
https://mysite.com?utm_source=linkedin&utm_medium=social&utm_campaign=brand

--- UTM builder ---
Use Google's Campaign URL Builder:
https://ga.google/analyticsdevtools/

--- UTM consistency rules (critical) ---
• Standardize: all lowercase, use hyphens not spaces
• "Google" and "google" are different sources in GA4
• Create a UTM naming convention document and share with team
• Never use UTMs on internal links (corrupts session attribution)
\`\`\`

## Attribution Models

\`\`\`
GA4 Advertising → Attribution → Model Comparison

--- Common models ---
Last click: 100% credit to last non-direct click
  Good for: understanding final conversion drivers
  Bad for: undervalues upper-funnel (awareness) channels

First click: 100% credit to first touchpoint
  Good for: understanding acquisition/discovery channels
  Bad for: ignores nurturing and closing channels

Linear: equal credit to every touchpoint
  Good for: simple view of full journey
  Bad for: same credit regardless of conversion probability contribution

Data-driven (Google's model):
  Uses machine learning to assign credit based on observed conversion probability
  Requires 300+ conversions/month to activate
  Most accurate for accounts with sufficient data

Time decay: more credit to recent touchpoints
  Good for: short purchase cycles (e-commerce)

--- Multi-touch reporting in GA4 ---
Advertising → Attribution → Conversion paths
→ See the actual sequences people take before converting
→ Common pattern: Organic Search → Email → Direct → Convert

--- Marketing Mix Modeling (advanced) ---
Statistical regression to estimate channel contribution INCLUDING offline
Used by large brands to allocate across TV, digital, and print
Tools: Google's Meridian (open source), Robyn (Meta's open source)
\`\`\`

## Marketing ROI Dashboard

\`\`\`
--- Key metrics every marketing dashboard needs ---

Top-line:
• Total revenue (from marketing) vs total spend
• Overall ROAS (Return on Ad Spend = Revenue / Ad Spend)
• Customer Acquisition Cost (CAC = Total Marketing Spend / New Customers)
• LTV:CAC ratio (goal: > 3:1 for SaaS, > 2:1 for e-commerce)

By channel:
• Spend, Conversions, Revenue, ROAS per channel
• CPC, CTR, Conversion Rate per channel
• Cost per lead (CPL) for lead gen campaigns

Trend lines (weekly):
• New users, Leads, Demos booked, Trials started, Paid customers
• Email: list size, open rate, click rate, unsubscribe rate

--- Budget allocation framework ---
High ROAS + can scale → Increase budget 20-30%
High ROAS + can't scale → Maintain, find similar audiences
Low ROAS → Pause and diagnose (creative? targeting? landing page?)
New channel → Test with 10-15% of budget, 30-day pilot

--- CAC Payback Period ---
If CAC = \$500 and monthly revenue/customer = \$100
Payback period = 5 months (< 12 months is healthy for SaaS)
If payback > 18 months: serious problem — either reduce CAC or increase LTV
\`\`\`

\`\`\`takeaways
["Last-click attribution undervalues awareness channels — always compare models before cutting upper-funnel spend.", "UTM parameters must be consistent and lowercase — 'Google' and 'google' are different sources in GA4.", "LTV:CAC > 3:1 is the SaaS benchmark — if it's lower, either reduce CAC or extend customer lifetime.", "GA4 Exploration funnels show exactly where users drop out — prioritize the step with the largest drop-off.", "Data-driven attribution needs 300+ conversions/month to activate — smaller accounts use linear or time-decay.", "Marketing Mix Modeling (Meridian, Robyn) is the only way to measure offline channel contribution — essential for brands spending on TV or radio."]
\`\`\`
`,
    },
  ],
};
