import { Module } from "../types";

export const module7: Module = {
  id: "ma-pricing-advanced",
  title: "M&A, Pricing Strategy & Advanced Case Types",
  description: "Mergers & acquisitions due diligence, synergy analysis, pricing strategy frameworks, and advanced case types including private equity, turnaround, and digital transformation",
  lessons: [
    {
      id: "ma-cases",
      slug: "ma-cases",
      title: "M&A and Due Diligence Cases",
      content: `# Mergers & Acquisitions Cases

M&A cases — "Should we acquire this company?" — appear in interviews at all major firms but especially at PE-focused shops (Bain, McKinsey PE practice). They test whether you can evaluate a deal from both strategic and financial perspectives.

---

\`\`\`concept
{
  "title": "The Two Questions in Every M&A Case",
  "variant": "mental-model",
  "content": "Every M&A case reduces to: (1) Is this a good business to own? (2) Are we paying the right price? A strategically attractive acquisition at the wrong price destroys value. A mediocre business at a bargain price might still be a poor investment. The consultant's role in M&A is to stress-test the deal thesis — the buyer's theory of why this acquisition creates value — and quantify whether the synergies are real, achievable, and worth the premium paid."
}
\`\`\`

---

## M&A Case Framework

\`\`\`
M&A EVALUATION FRAMEWORK:

1. STRATEGIC RATIONALE (Why acquire at all?)
   ├── Horizontal (same industry): scale, market share, eliminate competitor
   ├── Vertical (supplier/customer): control inputs or distribution
   ├── Diversification: new market entry, risk reduction
   └── Capability acquisition: technology, talent, IP

2. TARGET QUALITY (Is this a good business?)
   ├── Revenue quality: growing/stable? recurring/one-time? concentrated?
   ├── Profitability: margins vs industry benchmark? trends improving/worsening?
   ├── Competitive position: #1/#2 in market? durable advantages?
   └── Management quality: will key people stay post-acquisition?

3. SYNERGY ANALYSIS (Where does 1+1=3?)
   Revenue synergies:
   ├── Cross-sell target's products to our customers (and vice versa)
   ├── Geographic expansion (enter markets the target has)
   └── Bundling/upsell opportunities

   Cost synergies:
   ├── Shared back-office (finance, HR, legal, IT)
   ├── Procurement leverage (combined purchasing volume)
   ├── Facility consolidation (close duplicate offices/factories)
   └── Headcount reduction (duplicate roles)

4. FINANCIAL ANALYSIS
   ├── Valuation: EV/EBITDA, P/E, DCF — is the price fair?
   ├── Synergy NPV vs premium paid
   ├── Payback period (years to recover the acquisition premium)
   └── Integration cost (often underestimated — use 10-20% of deal value)

5. RISKS
   ├── Integration risk (cultures clash, systems incompatibility)
   ├── Customer attrition (target's customers leave post-acquisition)
   ├── Key talent departure (founders leave, taking knowledge with them)
   └── Regulatory risk (antitrust if significant market concentration)
\`\`\`

## Synergy Calculation: The Math

\`\`\`
WORKED EXAMPLE:

Scenario: Telecom acquiring a cable company for \$8B.
Current EBITDA of target: \$800M (10x EV/EBITDA acquisition multiple)

SYNERGY IDENTIFICATION AND SIZING:

Cost Synergies:
• Network infrastructure consolidation: \$150M/year (fiber overlap, data centers)
• Shared headquarters and back-office: \$80M/year
• Combined procurement (content, equipment): \$50M/year
• Headcount reduction (1,500 roles at avg \$70K fully-loaded): \$105M/year
Total cost synergies: \$385M/year

Revenue Synergies:
• Cross-sell broadband to telecom's 5M mobile customers
  5M × 10% penetration × \$600/year = \$300M incremental revenue
  × 40% margin = \$120M EBITDA
• Bundle discount reduces churn by 2% per year
  2M customers × 2% × \$900/year avg = \$36M retained revenue
  × 40% margin = \$14M EBITDA
Total revenue synergy EBITDA: ~\$134M/year

Total synergies: \$519M/year (vs \$800M standalone EBITDA = 65% increase)

SYNERGY NPV:
Assume 5-year realization (phased in over 3 years, full run-rate year 4):
PV of synergies (at 10% discount rate, 80% probability-adjusted): ~\$1.6B

PREMIUM PAID:
Market cap of cable company pre-deal: \$5.5B
Acquisition price: \$8B
Premium: \$2.5B (45% premium — typical range is 25-35%, this is HIGH)

SANITY CHECK:
Synergy NPV (\$1.6B) < Premium paid (\$2.5B)
→ Even with these synergies, the buyer is overpaying
→ Recommendation: either reduce the offer price or find \$900M more in synergies
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "An acquirer pays a 40% premium for a target. The cost synergies are \$100M/year. At a 10x multiple, the synergies are worth \$1B. The premium paid is \$2B. What is your assessment?",
      "options": [
        "This is a good deal — \$1B in synergies is significant",
        "This is a bad deal — the synergies don't justify the premium",
        "Need more information about revenue synergies before deciding",
        "Need to calculate the IRR first"
      ],
      "answer": 2,
      "explanation": "The right answer is C. Cost synergies of \$1B justify only half the \$2B premium. Before concluding this is a bad deal, you must analyze revenue synergies, strategic optionality (does this block a competitor?), and the cost of NOT doing the deal. In M&A cases, always push to quantify ALL synergy sources before passing judgment. If the total synergy NPV still doesn't justify the premium after exhaustive analysis, THEN recommend against at this price — or suggest a lower bid."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["M&A cases: Is this a good business to own? Are we paying the right price? Answer both.", "Synergy NPV must exceed premium paid — otherwise the acquisition destroys value.", "Cost synergies (back-office, procurement, headcount) are more certain; revenue synergies are riskier but larger.", "Always haircut synergies: apply a probability adjustment (70-80%) and phase-in timeline (3-5 years to full run-rate).", "Integration costs are chronically underestimated — budget 10-20% of deal value for systems, culture, legal, and transition.", "Key M&A red flags: customer concentration, founder dependency, cultural mismatch, and regulatory headwinds."]
\`\`\`
`,
    },
    {
      id: "pricing-strategy",
      slug: "pricing-strategy",
      title: "Pricing Strategy Cases",
      content: `# Pricing Strategy Cases

Pricing cases ask: "What should we charge, and why?" They appear surprisingly often — because pricing is the single highest-leverage variable in any business (a 1% price increase typically yields 10-20x the profit impact of a 1% volume increase).

---

## The Pricing Triangle

\`\`\`concept
{
  "title": "Three Anchors of Every Pricing Decision",
  "variant": "mental-model",
  "content": "Any price must balance three anchors: (1) Value to the customer — the maximum they'd pay (willingness to pay, or WTP). Price above this and they don't buy. (2) Cost to produce — the minimum you can charge while covering costs. Price below this and you destroy value. (3) Competitor prices — the reference point customers use. Ignore this and you'll lose to substitutes. Great pricing maximizes value capture between the cost floor and the WTP ceiling, informed by competitive positioning."
}
\`\`\`

## Pricing Strategies

\`\`\`compare
{
  "title": "Pricing Strategy Comparison",
  "items": [
    {
      "name": "Value-Based Pricing",
      "description": "Set price = % of value delivered to customer. Example: Software that saves a company \$1M/year can price at \$100K (10% value share) regardless of cost to build. Best for: B2B software, consulting, premium consumer goods. Challenge: requires quantifying customer value — often the hardest research to do. This is the HIGHEST-margin approach when executed correctly."
    },
    {
      "name": "Cost-Plus Pricing",
      "description": "Price = Cost × (1 + margin%). Simple and guarantees profitability. Widely used in manufacturing, government contracts, and commodity markets. Problem: ignores customer WTP (you may leave money on the table) and competitor pricing (you may price yourself out of the market). Use this as a floor, not a ceiling."
    },
    {
      "name": "Competitive Pricing",
      "description": "Price relative to competitors (at parity, premium, or discount). Works when products are similar and customers can compare. Risk: price wars destroy industry margins. Differentiation strategy: identify the attributes customers value most and price at premium on those. Price leadership: if you're the cost leader, your price creates the market's floor."
    },
    {
      "name": "Dynamic / Segmented Pricing",
      "description": "Charge different prices to different segments based on WTP. Examples: airlines (book early = cheaper), software (enterprise vs startup pricing), concerts (floor vs nosebleeds). Keys to success: segments must be separable (no arbitrage between them), and price differences must be based on value received, not just price discrimination that feels unfair."
    }
  ]
}
\`\`\`

## Pricing Case Structure

\`\`\`
PRICING CASE FRAMEWORK:

STEP 1: UNDERSTAND THE PRODUCT AND CUSTOMER
→ Who are the customers? What segments?
→ What problem does this solve? What is the value of solving it?
→ What are substitutes and their prices?

STEP 2: ESTIMATE WILLINGNESS TO PAY
Methods:
• Conjoint analysis (survey customers on feature-price tradeoffs)
• Van Westendorp Price Sensitivity Meter (4 price questions)
• Reference pricing (analogous products in market)
• Customer interviews ("What would this have cost you before?")

STEP 3: UNDERSTAND COST FLOOR
→ Variable cost per unit (minimum viable price for any sale)
→ Fully-loaded cost (price needed for profitability at expected volume)

STEP 4: ASSESS COMPETITIVE POSITIONING
→ Price relative to substitutes
→ Price-quality perception in this market

STEP 5: RECOMMEND PRICING ARCHITECTURE
→ Single price vs tiered vs dynamic
→ Entry-level vs premium options (Good / Better / Best)
→ Bundling opportunities

STEP 6: QUANTIFY THE RECOMMENDATION
→ Revenue impact of new price at current volume
→ Volume impact (price elasticity consideration)
→ Net profit impact
\`\`\`

## Price Elasticity Math

\`\`\`
Price elasticity of demand = % change in quantity / % change in price

Elastic demand (|elasticity| > 1): 10% price increase → >10% volume decline
  → Common in: commodities, price-sensitive consumers, competitive markets

Inelastic demand (|elasticity| < 1): 10% price increase → <10% volume decline
  → Common in: necessities, prescription drugs, premium brands, B2B switching-cost-heavy

CASE MATH EXAMPLE:
Current: \$50 price, 100K units sold = \$5M revenue
Proposed: \$55 price (+10%)

Scenario A (elastic, -15% volume): 85K units × \$55 = \$4.675M → WORSE
Scenario B (inelastic, -5% volume): 95K units × \$55 = \$5.225M → BETTER
Scenario C (very inelastic, -2% volume): 98K units × \$55 = \$5.39M → MUCH BETTER

Key rule: Price increase is profitable when (1 + margin%) × (1 - volume decline%) > 1
At 40% gross margin:
  If volume decline < 20%, price increase is profitable
  If volume decline > 20%, revenue increase doesn't cover lost contribution margin
\`\`\`

\`\`\`takeaways
["Price is the highest-leverage variable: 1% price increase typically yields 8-11% profit improvement.", "Three pricing anchors: value to customer (ceiling), cost to produce (floor), competitor prices (reference).", "Value-based pricing is highest-margin: quantify the economic value delivered, then capture a % of it.", "Price elasticity: if |e| < 1 (inelastic), raise prices. If |e| > 1 (elastic), lower prices to gain volume.", "Good-Better-Best (tiered pricing) captures both price-sensitive and premium customers — anchors to premium.", "Price segmentation only works if segments can't arbitrage between each other (no 'gray market' for cheaper tier)."]
\`\`\`
`,
    },
  ],
};
