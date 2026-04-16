import { Module } from "../types";

export const module5: Module = {
  id: "conversion-optimization",
  title: "Conversion Rate Optimization (CRO)",
  description: "Landing page psychology, A/B testing methodology, heatmaps and session recordings, funnel analysis, copywriting frameworks, and turning traffic into customers",
  lessons: [
    {
      id: "conversion-optimization",
      slug: "conversion-optimization",
      title: "CRO & Landing Page Optimization",
      content: `# Conversion Rate Optimization

Getting traffic is expensive. Converting it is where the money is made. A page that converts at 4% instead of 2% doubles revenue from the same ad spend.

---

\`\`\`concept
{
  "title": "CRO is Applied Psychology",
  "variant": "mental-model",
  "content": "Visitors don't read pages — they scan. They decide in 3-5 seconds whether to stay. Every element on a landing page either reduces friction or increases desire. CRO is the discipline of systematically testing what reduces friction and increases desire for YOUR specific audience. The critical rule: never trust your intuition. Always test. The button color you hate might convert 30% better. Your gut is biased toward what you like, not what works."
}
\`\`\`

---

## Landing Page Anatomy

\`\`\`
The hero section (above the fold) is everything:

--- What must be above the fold ---
1. Headline: Who is this for + what problem does it solve
   Bad:  "Welcome to Our Platform"
   Good: "The CRM Built for Sales Teams That Close Deals Faster"

2. Sub-headline: Expand the headline with the key benefit or differentiator

3. Hero image/video: Show the product in use (not a stock photo of people smiling)
   Video demos convert 80% better than static images for SaaS products

4. Primary CTA button: Clear action verb + no friction
   Bad:  "Submit" / "Learn More"
   Good: "Start Free Trial" / "See a Demo" / "Get My Free Report"

5. Social proof: Trust signal near the CTA
   "Trusted by 10,000+ sales teams" + 3-5 company logos

--- Page structure below the fold ---
• Pain → Agitate → Solution (PAS copywriting)
• Feature → Benefit (never list features alone)
• Social proof: testimonials with photo + name + company
• Objection handling: FAQ section addressing top hesitations
• Risk reversal: money-back guarantee, free trial, no credit card
• Closing CTA: repeat the button at the bottom
\`\`\`

## Copywriting Frameworks

\`\`\`
--- PAS (Pain → Agitate → Solution) ---
Pain:    "Managing spreadsheets for 50+ clients is exhausting."
Agitate: "You miss follow-ups, lose deals, and spend Sundays catching up."
Solution: "SalesFlow automates your pipeline so nothing falls through the cracks."

--- FAB (Feature → Advantage → Benefit) ---
Feature:   "AI-powered lead scoring"
Advantage: "Prioritizes your hottest leads automatically"
Benefit:   "So you spend time on deals that close, not ones that don't"

--- The 4Cs of copy ---
Clear:    Can a 12-year-old understand it?
Concise:  Remove every word that doesn't pull its weight
Compelling: Does it answer "what's in it for me?"
Credible:  Does it have proof? (numbers, testimonials, logos)

--- Headlines that convert ---
"How [Target Audience] [Achieves Desired Outcome] Without [Main Pain Point]"
"The [Adjective] Way to [Achieve Outcome] in [Timeframe]"
"[Number] [Audience] Use This to [Outcome]"

--- Microcopy (buttons, form labels) ---
Button: "Get My Free Report" > "Download" (possessive = more personal)
Checkbox: "Yes, I want more leads" > "Subscribe to newsletter"
Form help text: "We never share your email" under email field
\`\`\`

## A/B Testing Methodology

\`\`\`
--- What to test (in priority order) ---
1. Headline (biggest impact)
2. CTA button text and placement
3. Hero image/video
4. Social proof positioning
5. Form length (fewer fields = more completions)
6. Page layout (single column vs two column)
7. Pricing presentation
8. Smaller elements last (button color, etc.)

--- Statistical validity ---
Required: 95% confidence level, 80% statistical power
Minimum sample: 1,000+ conversions per variant (not just visitors)
Duration: minimum 2 weeks (capture full weekly cycles)

--- The peeking problem ---
NEVER stop a test early because one variant looks like it's winning.
Early stopping inflates false positives dramatically.
Set your sample size BEFORE launching, test until you hit it.

--- Tools ---
Google Optimize (free, sunsetted — use Optimizely or VWO)
VWO: visual editor, heatmaps, session recordings
Optimizely: enterprise, full-stack experimentation
PostHog: open-source, self-hosted, feature flags + A/B testing

--- Interpreting results ---
Winner = statistically significant improvement (p < 0.05)
No winner = insights still learned (this variant doesn't matter)
Loser = your hypothesis was wrong — record WHY for next test

--- Document every test ---
Hypothesis → Test design → Result → Insight
Build a hypothesis library — your organization's conversion knowledge
\`\`\`

## Heatmaps & Session Recording

\`\`\`
Tools: Hotjar, Microsoft Clarity (free), FullStory, Heap

--- Heatmaps ---
Click map: where people click (are they clicking on non-clickable elements?)
Move map: where mouse moves (correlates with where people read)
Scroll map: how far down people scroll (is key content seen?)

Scroll depth benchmark:
• Only 50% of visitors scroll past the fold
• 25% reach the bottom of a typical marketing page
• Solution: put your most important offer above the 50% scroll line

--- Session recordings ---
Watch real users navigate your site
Look for:
• Rage clicks (frustrated clicking on broken elements)
• Hesitation before form submission (what's causing doubt?)
• Where people exit (where does the journey end?)
• Confusing navigation patterns

--- Form analytics ---
Which fields have the highest abandonment rate?
Long name fields, phone numbers, and "company size" fields are top abandonment causes
Test: remove each optional field and measure completion rate increase

--- Funnel analysis ---
Step 1: Product page → 100 visitors
Step 2: Add to cart → 40 visitors (60% drop — problem here?)
Step 3: Checkout start → 25 visitors
Step 4: Payment → 15 visitors
Step 5: Confirmation → 12 visitors

The biggest drop is your priority: diagnose with session recordings
\`\`\`

\`\`\`takeaways
["Your headline has 3 seconds to earn a scroll — test it first, it has the highest impact on conversion rate.", "Never stop a test early — peeking inflates false positives. Set sample size before launch.", "Show the product in context (screenshot of the UI, video of it working), not abstract benefits.", "Remove one form field at a time and measure the conversion lift — phone number removal alone often increases signups 20%.", "Scroll maps reveal that 50% of visitors never see below-the-fold content — move your key CTA up.", "Document every test result — your hypothesis library is a competitive advantage that compounds over time."]
\`\`\`
`,
    },
  ],
};
