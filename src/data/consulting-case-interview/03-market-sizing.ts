import { Module } from "../types";

export const module3: Module = {
  id: "market-sizing",
  title: "Market Sizing & Fermi Estimation",
  description: "Estimate any market from first principles, build top-down and bottom-up models, Fermi estimation for impossible questions, and presenting your sizing with confidence",
  lessons: [
    {
      id: "market-sizing-fundamentals",
      slug: "market-sizing-fundamentals",
      title: "Market Sizing from First Principles",
      content: `# Market Sizing & Fermi Estimation

"How many golf balls fit in this room?" "What is the size of the US coffee market?" These aren't trick questions — they test whether you can reason systematically from limited data to a defensible estimate.

---

\`\`\`concept
{
  "title": "Why Market Sizing Tests Good Consultants",
  "variant": "mental-model",
  "content": "Consultants are asked to estimate things no one has measured: the revenue opportunity in a new market, how many units a new product will sell, what a competitor's cost structure looks like. There's no database for these questions. The skill tested is: can you build a logical model from assumptions you can defend, reach a plausible answer, and sanity-check it? The actual number matters less than the reasoning. Interviewers have rejected candidates who gave the 'right' number through bad logic, and passed candidates who reached a different number through clean structure."
}
\`\`\`

---

## Two Approaches: Top-Down vs Bottom-Up

\`\`\`compare
{
  "title": "Market Sizing Approaches",
  "items": [
    {
      "name": "Top-Down",
      "description": "Start with the total population → narrow to target segment → estimate penetration. Best for consumer markets. Example: US coffee market → 330M Americans → 65% drink coffee → 2 cups/day → \$3.50/cup → annual market = 330M × 0.65 × 2 × 365 × \$3.50 = \$545B. Start big, narrow down."
    },
    {
      "name": "Bottom-Up",
      "description": "Start from supply-side unit economics → scale up. Best for B2B or when supply constraints are clearer. Example: US dentist market → ~200K dentists × \$400K avg revenue = \$80B market. Or: supply side × industry utilization rate. Cross-check your top-down estimate with a bottom-up."
    }
  ]
}
\`\`\`

## Key Numbers to Memorize

\`\`\`
These numbers come up repeatedly. Memorize them:

POPULATION:
• US population: 330 million
• UK: 67M, Germany: 84M, France: 67M
• China: 1.4B, India: 1.4B, World: 8B

US HOUSEHOLD/DEMOGRAPHIC:
• US households: ~130M (avg 2.5 people)
• US adults (18+): ~260M
• US working age (18-65): ~200M
• Median US household income: ~\$70K
• US GDP: ~\$27 trillion (2024)

COMMON REFERENCE POINTS:
• 1 billion seconds ≈ 31.7 years (useful for sanity checks)
• 1 mile ≈ 1.6 km
• A typical car: 15 feet long
• An Olympic pool: 50m × 25m × 2m = 2,500 cubic meters

RULE OF 72:
• Money doubles in 72/interest_rate years (at 8%, doubles in 9 years)
\`\`\`

## Worked Market Sizing Examples

\`\`\`tabs
{
  "tabs": [
    {
      "label": "US Coffee Market",
      "content": "Question: 'Estimate the size of the US coffee market.'\n\nTop-down approach:\n1. US population: 330M\n2. % who drink coffee: ~65% = 215M coffee drinkers\n3. Cups per day per drinker: ~2 cups (mix of home and café)\n4. Split: 70% home-brewed, 30% café\n\nHome market:\n215M × 70% × 2 cups × 365 days × \$0.25/cup (cost of grounds) = ~\$27B\n\nCafé market:\n215M × 30% × 2 cups × 365 days × \$4.50/cup = ~\$212B\n\nTotal: ~\$239B (rough)\n\nSanity check: US GDP is \$27T. Coffee at ~\$240B = ~0.9% of GDP. Sounds right for a daily habit of 215M people.\n\nActual market: ~\$100-110B (retail + foodservice, 2023). Our estimate was high — explain the assumption that drove it (cups/day may be 1.5 not 2 for café).'"
    },
    {
      "label": "US Piano Teachers",
      "content": "Question: 'How many piano teachers are there in the US?'\n\nDemand approach:\n1. US children (5-18): ~55M\n2. % taking music lessons: ~15% = 8.25M\n3. % of those learning piano specifically: ~30% = 2.5M piano students\n4. Add adult learners: ~0.5M additional\n5. Total piano students: ~3M\n\nSupply approach:\n6. Students per teacher (typical lesson schedule): ~20 students (4 per hour × 5 hours teaching per day × 5 days, minus breaks)\n7. Actually more like 15-20 active students for part-time teachers\n\nEstimate: 3M students ÷ 20 students/teacher = 150,000 piano teachers\n\nSanity check: US has 2M+ square miles. 150K teachers / 330M people = 1 per 2,200 people. Sounds right for a moderately common but not universal activity.\n\nActual: ~100-120K music teachers in the US. Our estimate is in the right ballpark."
    },
    {
      "label": "Annual Revenue of a McDonald's",
      "content": "Question: 'Estimate annual revenue of a typical US McDonald's.'\n\nSupply-side approach:\n1. Operating hours: 6am-12am = 18 hours/day\n2. Customers per hour: varies by time\n   • Peak (12-1pm lunch, 5-6pm dinner): ~100/hour\n   • Off-peak: ~30/hour\n   • Roughly: 4 peak hours × 100 + 14 off-peak × 30 = 400 + 420 = ~820 customers/day\n3. Average order: ~\$8 (Big Mac meal ≈ \$10, but kids meals, singles pull avg down)\n4. Daily revenue: 820 × \$8 = \$6,560\n5. Annual revenue: \$6,560 × 365 = ~\$2.4M\n\nSanity check: McDonald's US has ~14,000 locations, total US revenue ~\$15B.\n\$15B / 14,000 = \$1.07M avg company-owned location.\nMany are franchised (lower reported revenue). Our estimate of \$2.4M is high but in the right range.\n\nActual: A typical US McDonald's does \$3-4M/year in revenue. Our estimate is reasonable."
    }
  ]
}
\`\`\`

## Presenting Your Sizing

\`\`\`
The #1 market sizing mistake: jumping to the calculation without explaining structure.

BAD: (just starts calculating)
"So 330 million people... maybe 60% drink coffee... times 2 cups... times \$3.50..."

GOOD:
"I'll approach this top-down, starting with the US population and narrowing to coffee purchasers.
Let me outline my structure before calculating:
  [1] Total US population
  [2] × % who consume coffee
  [3] × Average consumption rate (cups/day)
  [4] × Average price per cup
  [5] = Annual market size

Then I'll check my answer with a sanity test. Does that approach make sense before I start?

[After confirming] Let me walk through each assumption..."

Three rules:
1. State your structure before calculating
2. Label each assumption and explain WHY you chose it
3. Always sanity-check your answer at the end
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "You estimate the US haircut market. Top-down: 260M adults × 8 haircuts/year × \$20/cut = \$41.6B. What is the BEST sanity check for this estimate?",
      "options": [
        "Check if 260M adults is accurate",
        "Bottom-up: estimate number of US hair salons × revenue per salon",
        "Compare to US restaurant industry size",
        "Check if \$20 is the right average price"
      ],
      "answer": 1,
      "explanation": "The strongest sanity check is a completely different approach that should arrive at the same number. Bottom-up: ~1M hair salons in US (rough) × \$150K average annual revenue per location = \$150B. Wait — that's 3.6x our top-down estimate. That's a red flag. Either our top-down is low (maybe more than 8 cuts/year, or higher price) or our bottom-up salon count is too high. Investigating the discrepancy reveals where your assumptions need adjustment. This is exactly what interviewers want to see."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Always state your structure before calculating — label each variable and explain your assumption.", "Top-down: start with population, narrow to target segment, estimate penetration.", "Bottom-up: start from supply unit economics (capacity × price × utilization) and scale up.", "Sanity-check with a completely different approach — a 2-3x discrepancy reveals which assumption to challenge.", "Memorize key numbers: US pop 330M, 130M households, median income \$70K, GDP \$27T.", "The interviewer cares more about reasoning clarity than the exact number — defend your assumptions confidently."]
\`\`\`
`,
    },
  ],
};
