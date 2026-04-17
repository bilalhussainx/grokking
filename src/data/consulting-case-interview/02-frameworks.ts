import { Module } from "../types";

export const module2: Module = {
  id: "core-frameworks",
  title: "Core Business Frameworks",
  description: "The essential frameworks every consultant uses: Profitability, Porter's Five Forces, BCG Matrix, 4Ps, 3Cs, value chain analysis, and when to use each",
  lessons: [
    {
      id: "profitability-framework",
      slug: "profitability-framework",
      title: "The Profitability Framework",
      content: `# The Profitability Framework

The profitability framework is the single most common case type. Master this and you'll handle ~40% of all cases.

---

\`\`\`concept
{
  "title": "Why Profitability Cases Are Everywhere",
  "variant": "mental-model",
  "content": "Every business ultimately exists to generate profit. 'Our profits are declining' is the CEO's most common reason to hire consultants. The profitability framework is the Swiss Army knife of consulting: it applies directly to profitability cases but also underlies market entry cases (will this new market be profitable?), M&A cases (is this acquisition worth it?), and pricing cases (what price maximizes profit?). Learn this framework completely before moving to others."
}
\`\`\`

---

## The Framework Structure

\`\`\`
Profit = Revenue - Costs

REVENUE
├── Volume (# units sold)
│   ├── New customers acquired
│   │   ├── Market size × Market share
│   │   └── Sales funnel (Awareness → Interest → Purchase)
│   └── Existing customer retention (churn rate)
│       └── Repeat purchase rate
└── Price per unit
    ├── Absolute price (relative to competitors)
    └── Product mix (premium vs economy products)

COSTS
├── Fixed Costs (don't change with volume)
│   ├── Rent / facility
│   ├── Salaries (management, R&D)
│   ├── Depreciation (equipment, PP&E)
│   └── Interest expense
└── Variable Costs (scale with volume)
    ├── COGS (raw materials, direct labor)
    ├── Sales & marketing spend per unit
    └── Distribution / shipping costs

PROFIT
├── Gross Profit = Revenue - COGS
├── EBITDA = Revenue - COGS - Operating Expenses
└── Net Income = EBITDA - Depreciation - Interest - Taxes
\`\`\`

## Applying the Framework: Worked Example

\`\`\`
Case: "Our client is a European budget airline. Profits have fallen 20% over
two years despite stable revenue. What's going on?"

STEP 1: Confirm revenue is stable
→ "You mentioned revenue is stable. Can you confirm that means both volume
  (passengers) and pricing are roughly flat?"
Interviewer: "Yes, total revenue is roughly flat."

STEP 2: Identify which cost category grew
→ "Since revenue is flat, the profit decline must be cost-driven. Could you
  share a breakdown of cost categories and how they've trended?"

Interviewer provides data:
  Labor costs:     +3%  (minor)
  Fuel costs:      +22% (significant!)
  Airport fees:    +5%  (moderate)
  Maintenance:     +8%  (moderate)

STEP 3: Form hypothesis and drill down
→ "Fuel costs increasing 22% stands out significantly. Is this driven by
  higher jet fuel prices globally, or has fuel consumption increased?"

Interviewer: "Fuel prices are actually down 5% globally over this period."

→ NEW HYPOTHESIS: Fuel consumption increased despite stable passenger volume.
  "Could we look at fuel burn per flight and aircraft utilization data?"

Interviewer: "Good insight. The fleet has aged — average aircraft age went
from 6 to 11 years. Older aircraft are 18% less fuel-efficient."

STEP 4: Quantify the impact
Revenue: €500M
Fuel cost (historic): €100M
Fuel cost (now): €100M × (1 + 18% inefficiency) × (0.95 price factor)
                = €100M × 1.18 × 0.95 = €112.1M
Incremental fuel cost: +€12.1M

Net income decline: €25M (from 20% profit decline)
Fleet inefficiency explains: €12.1M / €25M = 48% of the decline

→ "Fleet aging explains roughly half the profit decline. I'd recommend
  looking at aircraft replacement economics next."
\`\`\`

## Common Profitability Case Variations

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Revenue decline",
      "content": "If revenue is down:\nVolume question: 'Is volume down across all products/regions or concentrated?'\n  → If concentrated: new competitor in that market? Distribution problem?\n  → If across-the-board: market shrinking? Brand issue?\n\nPrice question: 'Is average selling price declining?'\n  → If yes: are we discounting more? Mix shift to cheaper products? Competitor price war?\n\nKey insight: Volume × Price decomposition forces precision. 'Revenue is down 10%' could mean -10% volume at flat price, OR -10% price at flat volume, OR -5% each — and each has a completely different solution."
    },
    {
      "label": "Cost increase",
      "content": "If costs are up:\nFixed vs Variable split: 'Has the cost increase tracked with volume, or has it happened even when volume is flat?'\n  → If tracks with volume: variable cost issue (input prices, efficiency)\n  → If happened despite flat volume: fixed cost increase (rent, headcount)\n\nBenchmarking: 'How do our costs compare to industry benchmarks and competitors?'\n  → Above benchmark: operational inefficiency\n  → Inline with industry: entire industry facing cost increase (commodities, regulation)\n\nOne-time vs structural: 'Is this a one-time cost (restructuring charge) or ongoing?'\n  → One-time: may not need intervention\n  → Ongoing: requires structural solution"
    },
    {
      "label": "Profit decline with revenue UP",
      "content": "The counter-intuitive case: revenue growing but profits shrinking.\nThis is almost always a cost problem, but a specific one:\n\nScaling problem: costs growing faster than revenue\n  → Check: are variable costs per unit increasing?\n  → Could be: supplier price increases, labor inflation outpacing revenue growth\n\nMarginal customer problem: new customers are less profitable\n  → Check: what is the margin on new vs existing customers?\n  → Could be: expansion into lower-margin geographies or segments\n\nGrowth investment: profits deliberately suppressed for growth\n  → Not a problem per se, but important to distinguish from an actual margin issue"
    }
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "A retailer's revenue grew 15% but net profit fell 8%. Which analysis should you prioritize FIRST?",
      "options": [
        "Investigate which products are driving the revenue increase",
        "Split costs into fixed vs variable to see which category grew faster than revenue",
        "Check if the CEO made poor investment decisions",
        "Analyze competitor pricing"
      ],
      "answer": 1,
      "explanation": "Revenue up + profit down = costs growing faster than revenue. Your first job is to identify which cost category is outpacing revenue growth. The fixed vs variable split is the right starting point: if variable costs grew faster, it's an efficiency/input-cost issue. If fixed costs jumped, it could be an investment in capacity or overhead. Once you know which category, you can drill into specifics. Analyzing revenue composition or competitor pricing might become relevant later but isn't the priority when the issue is clearly cost-driven."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "strategic-frameworks",
      slug: "strategic-frameworks",
      title: "Porter's Five Forces, BCG Matrix & the 3Cs",
      content: `# Strategic Frameworks: Porter, BCG & 3Cs

Profitability tells you *what* happened. Strategic frameworks tell you *why* and *what to do about it*.

---

## Porter's Five Forces

\`\`\`concept
{
  "title": "Porter's Five Forces: Industry Attractiveness",
  "variant": "how-it-works",
  "content": "Porter's Five Forces (1979) determines the long-run profitability potential of an industry. The insight: profit isn't determined by how hard you work or how smart you are — it's largely determined by your industry's structure. Airlines have brutal five forces (commodity product, powerful suppliers like Boeing and fuel, intense rivalry, low switching costs). Software (especially SaaS) has attractive forces (switching costs, network effects, scalable distribution). Knowing an industry's structure helps you recommend strategy — or tell a client whether to enter at all."
}
\`\`\`

\`\`\`
PORTER'S FIVE FORCES ANALYSIS:

1. THREAT OF NEW ENTRANTS (Barriers to entry)
   High threat (low barriers): Easy to start, lots of competition enters
   Low threat (high barriers): Patents, capital requirements, regulations, brand, scale

   Questions to ask:
   • How much capital does a new entrant need?
   • Are there regulatory approvals required?
   • Do incumbents have cost advantages from scale?
   • Is there strong brand loyalty in the market?

2. BARGAINING POWER OF SUPPLIERS
   High power: Few suppliers, no substitutes, switching costs high
   Low power: Many suppliers, commoditized inputs, easy to switch

   Questions to ask:
   • Are there 1-2 dominant suppliers or many?
   • Can we substitute inputs?
   • Are inputs commodities (oil, steel) or specialized?

3. BARGAINING POWER OF BUYERS
   High power: Few large buyers, low switching costs, product is commodity
   Low power: Many small buyers, high switching costs, differentiated product

   Questions to ask:
   • Are buyers concentrated (Walmart buying from small suppliers = high power)
   • What are the switching costs for buyers?
   • How price-sensitive are buyers?

4. THREAT OF SUBSTITUTES
   High threat: Alternative ways to meet the same need exist
   Low threat: No good alternatives

   Example: Taxi → rideshare is a substitute, not direct competition
   Airlines: High-speed rail, video conferencing are substitutes

5. COMPETITIVE RIVALRY
   Intense: Many similar competitors, slow growth, undifferentiated products, high exit costs
   Mild: Few competitors, high growth, differentiated, low exit costs

   In consulting cases: assess rivalry intensity, then recommend how to differentiate
\`\`\`

## BCG Growth-Share Matrix

\`\`\`
The BCG Matrix (1970) helps companies allocate resources across a portfolio of businesses.

MARKET GROWTH RATE
     High  │ Question Marks │    Stars    │
           │ (invest or cut)│ (invest)    │
           │────────────────┼─────────────│
     Low   │    Dogs        │ Cash Cows   │
           │ (divest)       │ (harvest)   │
           └────────────────┴─────────────┘
                Low               High
              RELATIVE MARKET SHARE

Stars: High growth, high share — invest heavily to maintain position
Cash Cows: Low growth, high share — milk for cash, fund other quadrants
Question Marks: High growth, low share — invest to win or exit
Dogs: Low growth, low share — typically divest unless strategic reason to keep

When to use in cases:
• "Should our client expand their product portfolio?"
• "Which business units should they invest in vs divest?"
• "They have limited capital — where should they prioritize?"

Classic case structure:
1. Map client's businesses on the matrix
2. Identify if they're over-investing in Dogs (common problem)
3. Recommend: harvest Cash Cows to fund Stars, evaluate Question Marks
\`\`\`

## The 3Cs Framework

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Company",
      "content": "Internal analysis of the client:\n• What are our products/services and how do they perform?\n• What are our core competencies and competitive advantages?\n• What is our cost structure and margin profile?\n• What are our operational capabilities and constraints?\n• What resources do we have (financial, human, IP)?\n\nKey question: What can we do better than anyone else, and what do we do worse?"
    },
    {
      "label": "Customers",
      "content": "Understanding who buys and why:\n• Who are our target customers? (demographics, segments)\n• What do they value most? (price, quality, convenience, status)\n• How do they buy? (channel, decision process)\n• How price-sensitive are they?\n• What drives loyalty vs churn?\n\nKey question: Are we serving the right customers in the right way?"
    },
    {
      "label": "Competitors",
      "content": "Competitive landscape assessment:\n• Who are our direct and indirect competitors?\n• How do we compare on price, quality, features, service?\n• What are competitors' strategies? (cost leadership, differentiation, focus)\n• Where are competitors investing? Growing or retreating?\n• What is our sustainable competitive advantage vs them?\n\nKey question: Why would a customer choose us over them, and how durable is that reason?"
    }
  ]
}
\`\`\`

## Choosing the Right Framework

\`\`\`compare
{
  "title": "Framework Selection Guide",
  "items": [
    {
      "name": "Profitability Framework",
      "description": "Use when: 'Profits/margins are declining.' Revenue = Volume × Price. Costs = Fixed + Variable. ALWAYS your first framework for any P&L problem."
    },
    {
      "name": "Porter's Five Forces",
      "description": "Use when: 'Should we enter this market?' or 'Why is our industry so competitive?' Analyzes industry structure, not individual company. Helps decide whether to enter or exit."
    },
    {
      "name": "BCG Matrix",
      "description": "Use when: 'Client has multiple business units and needs capital allocation advice.' Maps portfolio by growth rate and market share. Identifies where to invest vs harvest vs divest."
    },
    {
      "name": "3Cs (Company, Customer, Competitor)",
      "description": "Use when: 'Should we launch this new product?' or 'How do we grow?' Balances internal capabilities with external opportunity. Good for strategy and growth cases."
    },
    {
      "name": "4Ps (Product, Price, Place, Promotion)",
      "description": "Use when: 'How do we market this product?' or 'Evaluate our go-to-market strategy.' Covers the full marketing mix. Often appears in consumer goods cases."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Porter's Five Forces assesses industry attractiveness — use it for market entry and strategy cases.", "The BCG Matrix allocates capital across a portfolio: Stars (invest), Cash Cows (harvest), Question Marks (decide), Dogs (divest).", "3Cs (Company, Customer, Competitor) is the versatile strategy framework for growth and new product cases.", "Never start a case by stating a framework — first understand the problem, then select the right tool.", "Frameworks are starting checklists, not straitjackets — adapt them to the specific case context.", "In market entry cases, combine Porter's Five Forces (industry attractiveness) with 3Cs (can WE win here?)."]
\`\`\`
`,
    },
  ],
};
