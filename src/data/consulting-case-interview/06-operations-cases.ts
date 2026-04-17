import { Module } from "../types";

export const module6: Module = {
  id: "operations-cases",
  title: "Operations, Supply Chain & Cost Reduction Cases",
  description: "Process improvement, capacity planning, supply chain optimization, and cost-cutting cases with lean/six sigma tools adapted for consulting interviews",
  lessons: [
    {
      id: "operations-framework",
      slug: "operations-framework",
      title: "Operations Cases: The Framework",
      content: `# Operations & Process Improvement Cases

Operations cases ask: "How do we produce more, faster, cheaper?" They appear across manufacturing, retail, healthcare, logistics, and tech. Unlike profitability cases (which diagnose), operations cases prescribe concrete process changes.

---

\`\`\`concept
{
  "title": "The Operations Consulting Mindset",
  "variant": "mental-model",
  "content": "Operations consultants think in systems: inputs → process → outputs. Every inefficiency is either a capacity constraint (can't produce enough), a quality problem (producing the wrong things or defects), or a cost problem (producing at too high a cost). The Lean Manufacturing framework says waste (muda) takes 8 forms: Transportation, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, and Skills underuse (TIMWOODS). Identifying which waste is the largest driver tells you where to intervene."
}
\`\`\`

---

## The Operations Framework

\`\`\`
OPERATIONS CASE STRUCTURE:

1. PROCESS MAPPING
   ├── What are the inputs? (labor, materials, capital equipment)
   ├── What are the process steps? (in order)
   ├── Where are the bottlenecks? (slowest step = throughput constraint)
   └── What are the outputs? (units, customers served, transactions)

2. CAPACITY ANALYSIS
   ├── Current capacity vs demand
   ├── Utilization rate (are we at 60% or 95%?)
   ├── Bottleneck identification (Theory of Constraints)
   └── Peak vs average load

3. EFFICIENCY / WASTE ANALYSIS
   ├── Cycle time per unit (how long does one unit take?)
   ├── Defect rates and rework costs
   ├── Downtime / changeover time
   └── Labor productivity vs industry benchmark

4. COST STRUCTURE
   ├── Fixed vs variable cost split
   ├── Cost per unit vs industry
   └── Where do costs concentrate?

5. RECOMMENDATIONS
   ├── Quick wins (low cost, fast impact)
   ├── Medium-term improvements (process redesign)
   └── Strategic investments (automation, outsourcing)
\`\`\`

## Bottleneck Analysis: Theory of Constraints

\`\`\`concept
{
  "title": "Theory of Constraints: Find the Bottleneck",
  "variant": "how-it-works",
  "content": "Eli Goldratt's Theory of Constraints says every system has exactly one bottleneck — the step that limits total throughput. Improving any non-bottleneck step is waste. The 5-step process: (1) Identify the constraint, (2) Exploit it — maximize what it can do, (3) Subordinate everything else to the constraint, (4) Elevate it — invest in removing it, (5) Find the next constraint and repeat. In cases, the bottleneck is usually the step with the longest cycle time or the highest queue before it."
}
\`\`\`

\`\`\`
WORKED EXAMPLE: Hospital Emergency Room

Process: Triage → Registration → Doctor Exam → Tests → Discharge
Cycle times: 5 min → 12 min → 45 min → 30 min → 10 min

Bottleneck = Doctor Exam (45 min)
Current throughput = 60 min / 45 min × doctors = rate-limited by docs

Exploiting the bottleneck:
→ Remove admin tasks from doctors (nurses pre-fill charts)
→ Standardize common exam protocols to reduce variation
→ Parallel processing: tests ordered DURING exam, not after

Elevating the constraint:
→ Add one physician assistant (PA) → throughput +30%
→ Fast-track lane for non-urgent cases (bypasses ER MD)

Cost of bottleneck (what it costs to NOT fix):
45 patients × 15 min delay each = 11.25 hours of patient time/day
Revenue lost from turned-away patients: 5 patients/day × \$800 avg = \$4,000/day = \$1.46M/year
\`\`\`

## Capacity Planning

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Utilization Math",
      "content": "Utilization = Actual Output / Maximum Capacity\n\nExample:\n'A factory runs 20 hours/day (1 shift), 5 days/week.\nEach machine can produce 100 units/hour.\nActual production: 1,400 units/day.'\n\nMax capacity = 20 hours × 100 units = 2,000 units/day\nUtilization = 1,400 / 2,000 = 70%\n\nKey benchmarks:\n• Manufacturing: 75-85% utilization is healthy (buffer for maintenance)\n• Airlines: 80%+ load factor needed for profitability\n• Hotels: 65-70% target (premium pricing at peak)\n• Call centers: 85%+ risks burnout and quality decline\n\nAt 95%+ utilization:\n→ Queues build up, lead times increase, quality drops\n→ Any demand spike causes complete service failure\n→ Solution: either reduce demand (price, triage) or expand capacity"
    },
    {
      "label": "Demand vs Supply",
      "content": "Three scenarios and responses:\n\n1. DEMAND > CAPACITY (overloaded)\n   Symptoms: long queues, backlogs, customer complaints, employee burnout\n   Solutions:\n   → Short term: overtime, temp workers, prioritization (serve high-value customers first)\n   → Medium: process improvement, outsourcing peaks\n   → Long: capital investment in capacity\n\n2. DEMAND < CAPACITY (underloaded)\n   Symptoms: idle assets, high fixed cost per unit, low morale\n   Solutions:\n   → Demand side: marketing, pricing discounts, new segments\n   → Supply side: mothball capacity, consolidate facilities, share capacity (white-label)\n\n3. DEMAND = CAPACITY (balanced but fragile)\n   Any disruption causes crisis\n   → Build in 15-20% buffer capacity for resilience\n   → Cross-train workers for flexibility"
    },
    {
      "label": "Make vs Buy vs Outsource",
      "content": "A common operations case variant: 'Should we make this in-house or outsource?'\n\nDecision framework:\n\nMake in-house when:\n• Core competency (you do it better than vendors)\n• Sensitive IP or customer data\n• In-house is cheaper at your scale\n• Speed/flexibility advantage\n\nBuy/outsource when:\n• Not a core competency\n• Vendor has scale advantages you can't match\n• Capital you'd need is better deployed elsewhere\n• Activity is standardized (commoditized)\n\nFinancial analysis:\nIn-house cost: Fixed cost (facility, equipment, management) + Variable (labor, materials)\nOutsource cost: Per-unit price × volume + transition costs\n\nBreakeven volume:\n(Fixed cost of in-house) / (Outsource price - Variable cost of in-house) = Units\nAbove this volume → in-house is cheaper\nBelow this volume → outsource is cheaper"
    }
  ]
}
\`\`\`

## Supply Chain Cases

\`\`\`
SUPPLY CHAIN RISK FRAMEWORK:

The bullwhip effect: Small demand fluctuations amplify upstream in the supply chain.
  Consumer orders fluctuate 10% → Retailer orders 20% → Distributor 40% → Manufacturer 80%

Supply chain resilience analysis:

1. SINGLE POINTS OF FAILURE
   → Which suppliers are sole-source?
   → Which regions have all facilities?
   → Concentration risk = vulnerability

2. LEAD TIME ANALYSIS
   → Time from order to delivery (by node)
   → Where are the longest lead times?
   → JIT vs safety stock tradeoff

3. INVENTORY OPTIMIZATION
   Safety stock formula (simplified):
   Safety stock = Z × σ_demand × √Lead_time
   Where Z = service level (1.65 for 95%, 2.33 for 99%)

4. COST DRIVERS
   → Transportation (optimize routing, modes)
   → Warehousing (consolidate SKUs, optimize locations)
   → Inventory carrying cost (typically 20-30% of inventory value/year)

Case example: COVID supply chain crisis
→ Single-source supplier from one geography = total disruption
→ Lean inventory (JIT) left no buffer = stockouts in weeks
→ Response: nearshoring, dual sourcing, strategic inventory buffers
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "A factory's fastest process step takes 10 min/unit and its slowest takes 40 min/unit. If you add capacity to the 10-min step, throughput will:",
      "options": [
        "Increase by approximately 25%",
        "Remain the same — the 40-min step is the bottleneck",
        "Increase proportionally to the added capacity",
        "Decrease due to overproduction upstream"
      ],
      "answer": 1,
      "explanation": "Theory of Constraints: improving non-bottleneck steps doesn't increase total throughput. The 40-min step is the constraint — it determines the system's maximum output. Adding capacity to the 10-min step just means that step finishes faster and then waits for the bottleneck. To increase throughput, you must improve the 40-min bottleneck step. In a case, always identify the bottleneck before recommending investments."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Operations cases are about inputs → process → outputs. Map the process before diagnosing.", "Theory of Constraints: every system has one bottleneck. Only improving the bottleneck increases throughput.", "Utilization benchmarks: manufacturing 75-85%, airlines 80%+, call centers <85%.", "The 8 wastes (TIMWOODS): Transportation, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, Skills underuse.", "Make vs outsource: compare total in-house cost (fixed + variable) vs outsource unit price × volume. Breakeven = fixed costs / (outsource price - variable cost).", "Supply chain resilience: identify single points of failure, dual-source critical suppliers, balance JIT efficiency with safety stock buffers."]
\`\`\`
`,
    },
    {
      id: "cost-reduction-cases",
      slug: "cost-reduction-cases",
      title: "Cost Reduction & Restructuring Cases",
      content: `# Cost Reduction & Restructuring Cases

"Cut costs by 20% without killing the business" is one of the most common CEO mandates — and one of the most common case types. The skill is identifying sustainable cuts vs. cuts that destroy value.

---

\`\`\`concept
{
  "title": "The Cost Reduction Trap",
  "variant": "warning",
  "content": "Naive cost cutting destroys value. Cutting R&D saves money this year but kills product pipeline. Cutting customer service saves money but increases churn. Cutting the sales team saves money but revenue collapses. The consultant's job is to distinguish between: (1) Structural waste — costs that generate no value (redundant processes, legacy systems, unnecessary overhead), (2) Underperforming investments — costs that generate some value but less than the opportunity cost, and (3) Value-generating costs — costs that drive revenue or protect the business and must be protected. Never recommend across-the-board percentage cuts — they're intellectually lazy and strategically harmful."
}
\`\`\`

---

## Cost Reduction Framework

\`\`\`
SYSTEMATIC COST REDUCTION APPROACH:

PHASE 1: COST MAPPING (where does money go?)
→ Build the cost structure: list every cost category and its % of total
→ Identify the top 3-5 categories (usually 80% of costs in 20% of categories)
→ Benchmark each category vs industry peers

PHASE 2: OPPORTUNITY IDENTIFICATION (where can we cut?)
For each major cost category, ask:
→ Is this cost necessary? (do we need this activity at all?)
→ Is this cost efficient? (are we doing it at market cost?)
→ Is this cost optimally sized? (are we over/under-investing?)
→ Can this be done differently? (technology, outsourcing, process change)

PHASE 3: IMPACT vs RISK ASSESSMENT
Categorize opportunities:

HIGH IMPACT / LOW RISK (do first):
→ Vendor renegotiation (same service, lower price)
→ Process automation (reduce labor for repetitive tasks)
→ Eliminate truly redundant activities

HIGH IMPACT / HIGH RISK (do carefully):
→ Headcount reductions
→ Facility consolidations
→ Cutting R&D or marketing budgets

LOW IMPACT / LOW RISK (do last or not at all):
→ Expense policy tightening
→ Travel restrictions
→ Minor procurement savings

PHASE 4: IMPLEMENTATION SEQUENCING
→ Quick wins first (build credibility, fund other changes)
→ Restructuring with clear communication
→ Reinvestment plan for savings
\`\`\`

## Worked Example: Retail Cost Reduction

\`\`\`
Case: "A specialty retailer has \$500M revenue and 12% operating margin (\$60M).
The board wants operating margin at 18% within 18 months.
That requires \$30M in cost savings. How do we get there?"

COST MAPPING:
COGS: \$275M (55% of revenue) — inventory, product cost
Labor: \$80M (16%) — store staff, HQ, logistics
Occupancy: \$50M (10%) — rent, utilities, maintenance
Marketing: \$30M (6%) — digital, brand
Distribution: \$25M (5%) — warehousing, shipping
Technology: \$20M (4%) — systems, IT staff
G&A: \$15M (3%) — finance, legal, HR
Other: \$5M (1%)

TOP OPPORTUNITIES ANALYSIS:

1. COGS (55% of revenue — biggest lever):
   'What is our gross margin vs industry benchmark?'
   Benchmark: specialty retail averages 48% COGS (52% gross margin)
   Our COGS: 55% → we're 7 points WORSE than peers
   Potential: \$500M × 7% = \$35M opportunity
   How: renegotiate supplier terms (volume discounts, payment terms)
        reduce slow-moving SKUs (improved inventory turnover)
        private-label shift on high-volume basics

2. LABOR (16% of revenue):
   Question: 'What is our revenue per employee vs peers?'
   If we have 20% more staff per store than benchmark → opportunity
   Approach: task automation (self-checkout, scheduling software)
   Risk: HIGH — customer service impact, union implications
   Estimate: 5-10% efficiency gain = \$4-8M savings

3. OCCUPANCY (10% of revenue):
   Question: 'Which stores are underperforming on revenue per sq ft?'
   If bottom 20% stores have 40% lower revenue/sqft → close or renegotiate
   Estimate: closing 10 underperforming stores = \$5M savings (net of fixed costs)

RECOMMENDATION:
'I recommend a 3-lever approach targeting \$31M:
(1) COGS optimization — \$18M through vendor renegotiation and SKU rationalization
(2) Store portfolio rationalization — \$8M through closing 8-10 underperforming locations
(3) Labor efficiency — \$5M through scheduling software and task automation
This avoids cutting marketing (demand-generating) or technology (enabler of other savings).'
\`\`\`

\`\`\`takeaways
["Distinguish structural waste (safe to cut) from underperforming investments (cut carefully) from value-generating costs (protect).", "Never recommend across-the-board percentage cuts — always identify specific inefficiencies.", "Cost structure: start with the biggest categories (usually 80% of costs in top 3-5 categories).", "Always benchmark costs vs industry peers — being 7% above benchmark on COGS is quantified, actionable.", "Implementation sequencing: quick wins first (vendor renegotiation) before risky structural changes (headcount).", "Always include a reinvestment plan — cost savings fund the growth agenda, not just margin expansion."]
\`\`\`
`,
    },
  ],
};
