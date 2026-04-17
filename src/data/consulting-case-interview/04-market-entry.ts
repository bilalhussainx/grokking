import { Module } from "../types";

export const module4: Module = {
  id: "market-entry",
  title: "Market Entry & Growth Strategy Cases",
  description: "Should the client enter a new market? Full framework covering market attractiveness, competitive position, entry strategy, and financial viability with real worked examples",
  lessons: [
    {
      id: "market-entry-framework",
      slug: "market-entry-framework",
      title: "Market Entry Framework",
      content: `# Market Entry Cases

"Should our client enter the Japanese market?" "Should Nike launch a luggage line?" "Should this hospital system acquire a competitor?" Market entry cases are the second most common type — and they have a definitive structure.

---

\`\`\`concept
{
  "title": "The Two Core Questions in Any Market Entry",
  "variant": "mental-model",
  "content": "Every market entry case reduces to two questions: (1) Is the market attractive? (2) Can WE win in it? Answering only the first is incomplete — an attractive market that you have no competitive advantage in is a value-destroying entry. Answering only the second is also incomplete — you might be great at something, but if the market is structurally unattractive (low margins, fierce incumbents), winning a bad market still loses you money. The best cases deliver a clear answer to both questions, supported by quantitative evidence."
}
\`\`\`

---

## The Market Entry Framework

\`\`\`
MARKET ENTRY DECISION TREE:

1. MARKET ATTRACTIVENESS
   ├── Market size (is this big enough to matter?)
   ├── Market growth rate (expanding or shrinking?)
   ├── Profitability (what do margins look like in this industry?)
   └── Structural factors (Porter's Five Forces)

2. COMPETITIVE POSITION (Can WE win?)
   ├── Existing capabilities that transfer (expertise, brand, technology)
   ├── Customer relationships that transfer
   ├── Cost advantages we'd have
   └── Gaps we'd need to close (build, buy, or partner?)

3. ENTRY STRATEGY
   ├── Organic growth (build from scratch)
   ├── Acquisition (buy a player that's already there)
   ├── Partnership / JV (share risk, share upside)
   └── Licensing (minimal investment, minimal control)

4. FINANCIAL FEASIBILITY
   ├── Revenue model and projected revenue
   ├── Required investment and timeline to profitability
   ├── NPV / IRR analysis
   └── Risk-adjusted return vs alternative uses of capital

5. RISKS & MITIGANTS
   ├── Execution risks (can we actually build this?)
   ├── Competitive response (how will incumbents react?)
   └── Regulatory / market-specific risks
\`\`\`

## Worked Example: Full Market Entry Case

\`\`\`
Case: "Our client is a major US sports apparel brand (think Nike-tier). They're
considering entering the premium luggage market. Should they do it?"

STEP 1: Clarify
"A few clarifying questions:
• By 'enter' do we mean organic launch, acquisition, or partnership?
• What's driving this interest — is this CEO-driven or market-opportunity-driven?
• What's the target timeline and minimum financial return threshold?"

Interviewer: "Open to any entry mode. CEO sees brand extension opportunity.
5-year horizon, want to understand if this is a compelling use of capital."

STEP 2: Framework
"I'll structure this as: Market attractiveness → Our competitive position →
Entry options → Financial feasibility → Recommendation."

MARKET ATTRACTIVENESS:
"Can you share data on the premium luggage market size and growth?"

Data provided:
• US premium luggage market: \$3.5B, growing 8%/year
• Global market: \$18B
• Key players: Rimowa (\$600M revenue), Away (\$400M), Samsonite Black Label
• Gross margins in premium luggage: 55-65%
• Brand loyalty is high — customers replace luggage every 7-10 years

Assessment: Market is medium-sized, growing faster than GDP, high margins.
Porter's: Rivalry is moderate (few dominant players), barriers moderate (brand + distribution),
buyers have high switching costs once loyal, suppliers are contract manufacturers.

OUR COMPETITIVE POSITION:
"What are our client's current strengths in adjacent categories?"

Data:
• Strong brand in athletics (30M+ US customers)
• Existing retail distribution (1,200 stores + direct e-commerce)
• No luggage design or manufacturing capability
• Supply chain for apparel — not luggage (different factories)

Assessment: Brand and distribution are major advantages. No manufacturing expertise.
Customers overlap partially (active travelers buy sports apparel AND luggage).

ENTRY OPTIONS:
1. Organic: Build from scratch — 3-5 year timeline, high investment, unproven
2. Acquire Away or similar: Faster, costs \$800M-\$1.2B based on comparables
3. License our brand to a luggage manufacturer: Minimal investment, minimal control

FINANCIAL FEASIBILITY (Acquisition of Away):
Acquisition cost: \$900M (estimated)
Revenue synergies: Cross-selling to 30M customer base → 5% conversion × \$400 avg purchase
= 1.5M new customers × \$400 = \$600M incremental revenue over 5 years
Away current revenue: \$400M × 8% growth = ~\$587M in year 5
Combined revenue at Year 5: ~\$1.2B
At 60% gross margin → GM = \$720M → after OpEx: EBITDA ~\$180M
\$900M acquisition ÷ \$180M EBITDA = 5x EV/EBITDA (reasonable for premium brand)

RECOMMENDATION:
"I recommend entering the premium luggage market via strategic acquisition.
Three reasons: (1) The market is growing at 8% with 55%+ margins — structurally attractive.
(2) Our brand creates a ready-made customer base that competing entrants can't match — over 30M
US customers who trust us for premium performance gear.
(3) Acquisition of a brand like Away avoids the 3-5 year build timeline and immediately provides
manufacturing and supply chain capability we lack.

Key risks: Premium acquisition multiples in a rising rate environment, brand dilution if luggage quality
underwhelms, and potential cannibalization of retail shelf space.

I'd mitigate these by conducting thorough due diligence on Away's NPS and return rates,
and positioning luggage as a separate 'premium travel' sub-brand rather than mainline.
"
\`\`\`

## Entry Mode Decision: Build vs Buy vs Partner

\`\`\`compare
{
  "title": "Entry Mode Trade-offs",
  "items": [
    {
      "name": "Build (Organic)",
      "description": "Pros: Full control, no acquisition premium, customized to your needs. Cons: Slowest (3-5 years to scale), highest execution risk, no existing customer base. Best when: You have deep expertise, market is new/nascent, no good acquisition targets."
    },
    {
      "name": "Buy (Acquisition)",
      "description": "Pros: Fastest path to scale, acquires talent + customers + technology. Cons: Integration risk, premium price (20-40% above market), culture clashes. Best when: Market is proven, speed matters, target has irreplaceable assets (brand, technology, customer base)."
    },
    {
      "name": "Partner / License / JV",
      "description": "Pros: Lowest investment, fastest to test, shared risk. Cons: Shared upside, dependency, IP protection concerns, harder to exit. Best when: Uncertain about the market, regulation requires local partner, testing before committing."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Market entry cases have two core questions: Is the market attractive? Can WE win in it? Answer both.", "Structure: Market attractiveness → Competitive position → Entry options → Financials → Recommendation.", "Always quantify: estimate market size, revenue potential, investment required, and payback period.", "Build vs Buy vs Partner trade-off: Buy is fastest, Build gives control, Partner tests with minimal risk.", "State a clear recommendation with 3 reasons and 2-3 risks — avoid wishy-washy 'it depends' conclusions.", "Use Porter's Five Forces to assess market attractiveness, 3Cs to assess competitive position."]
\`\`\`
`,
    },
  ],
};
