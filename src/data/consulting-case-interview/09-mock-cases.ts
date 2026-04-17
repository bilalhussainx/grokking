import { Module } from "../types";

export const module9: Module = {
  id: "mock-cases",
  title: "Full Mock Cases with Worked Solutions",
  description: "Three complete end-to-end mock cases with interviewer guide, sample candidate dialogue, common mistakes, and scoring notes — practice the full 35-minute case experience",
  lessons: [
    {
      id: "mock-case-profitability",
      slug: "mock-case-profitability",
      title: "Mock Case 1: Hospital Profitability Decline",
      content: `# Mock Case 1: Hospital Profitability Decline

This is a profitability case with a healthcare twist. It's representative of McKinsey Health & Life Sciences and BCG healthcare cases.

---

\`\`\`concept
{
  "title": "How to Use This Mock Case",
  "variant": "practical",
  "content": "Practice this with a partner: one person plays the interviewer (reads the script), the other solves the case without reading ahead. After completing, review the worked solution and scoring notes. Solo practice: cover the worked solution, attempt each phase independently, then check your reasoning. The goal is to internalize the diagnostic process, not memorize this specific case. A real case you've never seen will follow the same structure."
}
\`\`\`

---

## The Case Prompt

\`\`\`
INTERVIEWER READS:
"Our client is a regional hospital system in the US Midwest with 5 hospitals
and approximately \$2 billion in annual revenue. Over the past three years,
operating margins have declined from 8% to 3%. The CFO has engaged McKinsey
to identify the root cause and recommend a path to restoring margins.
What questions do you have for me to clarify the situation?"
\`\`\`

## Phase 1: Clarification

\`\`\`
CANDIDATE SHOULD ASK (any 2-3 of these):

Good questions:
• "Has revenue declined, or has it been stable while costs increased?"
  [INTERVIEWER: Revenue has grown 5% annually but costs have grown faster]

• "Is the margin decline consistent across all 5 hospitals, or concentrated?"
  [INTERVIEWER: Three hospitals are performing roughly as expected; two are significantly worse]

• "How do our margins compare to regional and national benchmarks?"
  [INTERVIEWER: Regional peers average 5-6% operating margin — we were above benchmark, now below]

• "Is this driven by payer mix changes? (Medicare/Medicaid/commercial)"
  [INTERVIEWER: Good question — yes, we've seen a shift in payer mix, I'll share data shortly]

BAD QUESTIONS (flag as rookie mistakes):
• "What's the hospital's strategic vision?" (too abstract, not diagnostic)
• "How many employees do they have?" (premature, irrelevant to margin diagnosis)
• More than 4 questions total (shows inability to prioritize)
\`\`\`

## Phase 2: Framework

\`\`\`
CANDIDATE SHOULD PRESENT:

Strong framework:
"I'd like to approach this profitability problem across two dimensions: revenue and costs.

On the revenue side, I'd examine:
  1. Volume — are we serving fewer patients?
  2. Pricing/payer mix — are we being paid less per patient?
  3. Service mix — have we shifted toward lower-margin service lines?

On the cost side:
  1. Labor costs — nurses, physicians, admin (typically 50-60% of hospital costs)
  2. Supply chain — medical supplies, pharmaceuticals
  3. Overhead — facilities, technology, administrative

I'd also want to look at whether this is concentrated in the two underperforming hospitals,
and if so, what's different about them. Does that structure make sense?"

SCORING NOTE: The candidate should ask whether the structure makes sense before diving in.
Good candidates lead the interview — they propose direction and confirm it.
\`\`\`

## Phase 3: Analysis

\`\`\`
INTERVIEWER PROVIDES DATA (as candidate asks the right questions):

DATA SET 1 — Revenue breakdown:
Payer mix 3 years ago: 45% commercial, 35% Medicare, 20% Medicaid
Payer mix today:       35% commercial, 40% Medicare, 25% Medicaid

CANDIDATE INSIGHT NEEDED:
Commercial payers reimburse ~\$1.20 per \$1.00 of costs (profitable)
Medicare reimburses ~\$0.95 per \$1.00 of costs (slightly below break-even)
Medicaid reimburses ~\$0.80 per \$1.00 of costs (loss-making)

10 percentage point shift AWAY from commercial and INTO Medicare/Medicaid
= significant revenue per unit decline without volume changing

CANDIDATE CALCULATION:
'If we have 2B revenue and commercial was 45% → now 35%:
That's \$200M in revenue that shifted from commercial to Medicare/Medicaid payers.
At roughly a 20-25 cent differential in margin per dollar billed:
Impact ≈ \$200M × 20% = \$40M incremental margin loss from payer mix alone.
Given total margin decline from 8% to 3% on \$2B = \$100M decline,
payer mix explains ~40% of the decline. There's more to find.'

DATA SET 2 — Labor costs:
Labor as % of revenue: 55% (3 years ago) → 63% today
Industry benchmark: 58%

CANDIDATE INSIGHT:
'Labor is 5 percentage points above benchmark and 8 points above where we were.
On \$2B revenue, 5 points above benchmark = \$100M in excess labor cost annually.
Given the total margin decline is also \$100M, this is the primary driver.'

Follow-up: 'Is the labor cost increase driven by more FTEs, higher wages, or both?'
INTERVIEWER: 'Primarily wages — travel nurses hired at 3-4x staff nurse rates during COVID
have not been fully replaced with permanent staff.'
\`\`\`

## Phase 4: Recommendation

\`\`\`
STRONG RECOMMENDATION:

"Based on my analysis, two factors are driving the \$100M margin decline:

First — and most impactful — labor costs have increased \$100M above benchmark,
primarily from expensive travel nurses. This is the #1 priority.

Second — payer mix has shifted, reducing revenue per patient by approximately \$40M.
This compounds the labor issue.

My recommendations:

Immediate (0-6 months): Labor cost reduction
  Convert travel nurse positions to permanent staff (saves \$60-80M over 3 years)
  Implement predictive scheduling to reduce agency overtime
  Benchmark compensation to region, not national rates

Medium-term (6-18 months): Revenue mix improvement
  Expand specialty service lines (orthopedics, cardiology, oncology) that attract
  commercial payers and have better reimbursement
  Build referral partnerships with commercial-plan employers in the region

Risk: Any staff reduction that reduces patient capacity will hurt volume — I'd want
to confirm the two underperforming hospitals aren't capacity-constrained before cutting headcount.

Expected impact: \$80M+ operating improvement within 24 months — restoring margins to ~7%."
\`\`\`

## Scoring Notes

\`\`\`
WHAT SEPARATES STRONG FROM AVERAGE CANDIDATES:

STRONG (hire):
✓ Immediately identified payer mix as a revenue-quality issue (not just volume)
✓ Quantified each driver: payer mix = ~\$40M, labor = ~\$100M
✓ Recognized that fixing labor is the highest-leverage action
✓ Included risk mitigation (don't cut capacity if hospitals are at capacity)
✓ Gave quantified expected outcome (\$80M improvement)

AVERAGE (borderline):
∼ Identified cost increase but didn't benchmark against peers
∼ Identified payer mix shift but couldn't calculate the impact
∼ Recommendation was directionally correct but not quantified
∼ Missed the travel nurse angle even after the hint

WEAK (no hire):
✗ Jumped to solutions before diagnosing (recommend EHR upgrade before understanding the problem)
✗ Didn't ask about payer mix (missed the most important revenue driver in healthcare)
✗ No quantification at any stage
✗ Recommendation lacked prioritization or sequencing
\`\`\`

\`\`\`takeaways
["Healthcare profitability: payer mix (commercial vs Medicare vs Medicaid) is often the key revenue driver.", "Always benchmark costs vs industry peers — in this case, 5 points above benchmark on labor = \$100M.", "Two-driver cases: identify BOTH drivers and quantify each before recommending. Don't stop at the first root cause.", "Strong recommendations: immediate, medium-term, and long-term actions with risks and quantified expected impact.", "Travel nurse premiums became a widespread hospital cost crisis post-COVID — a real-world anchor for healthcare cases.", "Lead the case: confirm your framework, ask the right questions, and drive to a quantified recommendation."]
\`\`\`
`,
    },
    {
      id: "mock-case-market-entry",
      slug: "mock-case-market-entry",
      title: "Mock Case 2: EV Charging Network Entry",
      content: `# Mock Case 2: EV Charging Network Market Entry

This is a market entry case in a high-growth, tech-adjacent sector. It's representative of BCG and Bain cases for candidates with business/strategy backgrounds.

---

## The Case Prompt

\`\`\`
INTERVIEWER READS:
"Our client is a large US utility company with \$15 billion in annual revenue.
They operate the electricity grid across three Midwestern states.
The CEO is considering entering the electric vehicle (EV) public charging network
business — installing and operating public fast-charging stations.
Should they do it, and if so, how?"
\`\`\`

## Framework

\`\`\`
STRONG FRAMEWORK FOR THIS CASE:

"Market entry cases have two core questions: Is the market attractive, and can WE win in it?
Let me structure this across four areas:

1. MARKET ATTRACTIVENESS
   → Current market size and growth trajectory
   → Profitability structure: who makes money in EV charging today?
   → Competitive intensity: ChargePoint, Blink, Tesla Supercharger, etc.

2. STRATEGIC FIT (Can the utility win?)
   → What assets and advantages does a utility bring?
   → What capabilities does it lack?
   → Is this a natural extension or a leap?

3. ENTRY STRATEGY
   → Organic build vs acquisition vs partnership
   → Geography: where to start? (their own service territory?)
   → Customer segment: highway corridors vs urban vs workplace?

4. FINANCIAL FEASIBILITY
   → Capital required (installation cost per station × number of stations)
   → Revenue model (per-kWh charging fees)
   → Breakeven and return profile
   → Regulatory considerations (utilities face strict oversight)

Does this structure make sense?"
\`\`\`

## Key Data Points

\`\`\`
INTERVIEWER PROVIDES (as candidate asks):

Market size:
• US public EV charging market 2024: ~\$3.5B, growing 35% annually
• Projected 2030: \$20B+ (federal infrastructure bill + EV adoption curve)
• Currently 160,000 public charging stations in US (mostly Level 2, slow)
• Fast chargers (DC Fast Charge / DCFC): ~10% of stations, but 60% of revenue

Unit economics of DCFC stations:
• Installation cost: \$50,000-\$150,000 per station
• Annual maintenance: \$5,000-\$8,000 per station
• Revenue: at 15% utilization, \$20-25K/year per station (improving as EV adoption grows)
• Breakeven: ~7-8 years at current utilization

Utility's competitive position:
• Already owns the grid — has electricity at wholesale cost (saves ~30% vs competitors)
• Has relationships with municipalities for permitting (speeds deployment)
• Has balance sheet for capital-intensive deployment (\$500M+ available)
• LACKS: software/app for customer experience, brand recognition in retail, EV expertise

Competitive landscape:
• Tesla Supercharger: closed network (Tesla only), gold standard for experience
• ChargePoint: largest network, hardware + software, franchise model
• EVgo: fast-charger focused, partnerships with GM/Volvo
• Blink: widespread but poor reliability reputation
\`\`\`

## Working Through the Financials

\`\`\`
CANDIDATE CALCULATION SEQUENCE:

'Let me size the opportunity for our client specifically.

If they started with their 3-state service territory:
  Population: ~8M people (Midwest states are mid-size)
  EV penetration today: ~4%, growing to 20% by 2030 (national projections)
  EV fleet in territory today: ~320,000 vehicles
  Rule of thumb: 1 public fast charger per 100 EVs (mostly charge at home)
  Stations needed now: ~3,200 DCFC stations in their territory

Current installed base in their territory (estimate): ~800 fast chargers (by competitors)
Gap to fill: ~2,400 stations needed as EVs grow

Investment required (capturing 50% of the gap = 1,200 stations):
  1,200 × \$100K avg installation = \$120M upfront
  Operating costs: 1,200 × \$7K = \$8.4M/year
  Revenue at 15% utilization: 1,200 × \$22K = \$26.4M/year
  Net operating income: \$18M/year
  Payback period: \$120M / \$18M = 6.7 years

By 2030 (utilization grows to 25% as EV fleet 5x's):
  Revenue: 1,200 × \$37K = \$44.4M/year
  NOI: ~\$36M/year
  At 8x EBITDA multiple: portfolio value = \$288M

IRR on \$120M invested → \$288M exit over 6 years = ~15.5% IRR
→ Attractive for a utility (typically earns 8-10% on regulated assets)'
\`\`\`

## Recommendation

\`\`\`
STRONG RECOMMENDATION:

"I recommend the utility enter the EV charging market, with a phased approach:

Phase 1 (Year 1-2): Pilot in own service territory
  → Start with 200-300 stations along major highway corridors and urban centers
  → Focus on DCFC (higher revenue, aligns with utility's wholesale power advantage)
  → Partner with ChargePoint for software/app (white-label their network management
    rather than building from scratch) — builds customer experience quickly
  → Investment: ~\$25M (200 stations × \$125K fully-loaded)

Phase 2 (Year 3-5): Scale within territory
  → If pilot achieves >15% utilization within 12 months, accelerate to 1,000+ stations
  → Consider in-house software development or acquire a small software platform
  → Total investment: \$120M for the full territorial buildout

Strategic reasons to enter:
  1. The utility's wholesale electricity cost advantage (30% lower opex vs competitors)
     creates a durable moat that ChargePoint and EVgo cannot match
  2. Federal infrastructure funding (NEVI program) subsidizes up to 80% of station costs
     — radically improves the economics to 2-3 year payback
  3. First-mover in their territory creates network effects; latecomers face a built-out
     competing network

Key risk: Regulatory. Utilities are heavily regulated — commissions may object to
competitive ventures. I'd recommend getting a regulatory opinion on whether this
requires a separate subsidiary, and engaging proactively with the commission early."
\`\`\`

\`\`\`takeaways
["Market entry: industry-specific knowledge matters. In utilities, regulatory risk is always a consideration.", "Unit economics first: know the payback period and IRR before recommending capital-intensive investments.", "Leverage existing assets: the utility's wholesale electricity advantage is a structural cost moat.", "Phased entry reduces risk: pilot → scale → expand. Don't recommend betting the balance sheet on an unproven market.", "Federal subsidies (NEVI program) change the math dramatically — always ask about government incentives in infrastructure cases.", "Software is the gap: utilities are great at hard infrastructure, terrible at consumer software. White-label or acquire rather than build."]
\`\`\`
`,
    },
  ],
};
