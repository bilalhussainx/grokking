import { Module } from "../types";

export const module5: Module = {
  id: "mental-math",
  title: "Quantitative Skills & Mental Math",
  description: "Consulting-speed mental math drills, percentage calculations, CAGR, breakeven analysis, NPV basics, and how to set up and narrate calculations under interview pressure",
  lessons: [
    {
      id: "mental-math-drills",
      slug: "mental-math-drills",
      title: "Mental Math for Case Interviews",
      content: `# Mental Math for Case Interviews

Math mistakes kill offers. Not because consultants need to be human calculators, but because a numerical error signals imprecision — the opposite of what clients pay for. Master these techniques and math becomes a strength, not a liability.

---

\`\`\`concept
{
  "title": "The Consulting Math Mindset",
  "variant": "practical",
  "content": "Consultants don't do math for its own sake — they do it to generate insights. The number means nothing until you interpret it: 'Our client's breakeven point is 2.3 million units — given the market is only 8 million units and they currently sell 1.5 million, this is achievable but requires a 53% market share gain, which is aggressive.' Always: (1) set up the math clearly, (2) narrate as you calculate (so the interviewer can catch errors), (3) round aggressively to keep the math clean, (4) interpret what the number means for the case."
}
\`\`\`

---

## Core Mental Math Techniques

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Percentages",
      "content": "The most common math in cases. Three patterns:\n\n1. X% of Y:\n   15% of 320 → 10% of 320 = 32, 5% of 320 = 16, total = 48\n   Always decompose into 10% + 5% + 1% chunks\n\n2. What % is X of Y?\n   45 is what % of 180? → 45/180 = 1/4 = 25%\n   Look for fractions: 45/180 = 9/36 = 1/4\n\n3. % change:\n   From 240 to 288: change = 48, base = 240\n   48/240 = 48/240. Simplify: 1/5 = 20%\n\nKey trick: Convert to fractions whenever possible\n   1/8 = 12.5%, 1/6 = 16.7%, 1/3 = 33.3%, 3/8 = 37.5%"
    },
    {
      "label": "Large Number Arithmetic",
      "content": "Break large numbers into manageable pieces:\n\n560M × 15% = ?\n→ 560M × 10% = 56M\n→ 560M × 5% = 28M\n→ Total = 84M\n\n1.2B × 8% = ?\n→ 1.2B × 8% = 1.2B × 0.08\n→ = 1.2 × 80M = 96M\n\nMultiplying large numbers — decompose:\n340 × 25 = 340 × 25\n→ 340 × 25 = 340 × (100/4) = 34,000 / 4 = 8,500\n\nOr: 340 × 25 = 300×25 + 40×25 = 7,500 + 1,000 = 8,500\n\nAlways round strategically:\n'\$487M at 12.3% margin' → call it \$500M × 12% = \$60M\nNote the rounding and adjust at end if needed"
    },
    {
      "label": "CAGR & Growth",
      "content": "Compound Annual Growth Rate (CAGR) appears constantly.\n\nFormula: CAGR = (End/Start)^(1/years) - 1\n\nRule of 72: at X% growth, doubles in 72/X years\n  8% growth → doubles in 9 years\n  12% growth → doubles in 6 years\n  3% growth → doubles in 24 years\n\nEstimating CAGR without a calculator:\n'Market grew from \$40B to \$60B in 4 years. CAGR?'\n→ Growth = 50% over 4 years\n→ Simple estimate: 50%/4 ≈ 12.5%/year (slightly overstates for small growth)\n→ Rule of 72 reverse: to grow 50% you need ~ 4 years → roughly 10%\n→ Answer: ~10-12% CAGR\n\nActual CAGR = (60/40)^(1/4) - 1 = (1.5)^0.25 - 1 = 10.7%\nYour estimate of 10-12% is excellent."
    },
    {
      "label": "Breakeven",
      "content": "Breakeven questions: 'How many units must we sell to cover our fixed costs?'\n\nFormula: Breakeven units = Fixed Costs / (Price - Variable Cost per unit)\n= Fixed Costs / Contribution Margin per unit\n\nExample:\n'A new factory costs \$50M (fixed). We sell widgets at \$12 each.\nVariable cost per widget is \$7. Breakeven?'\n\nContribution margin = \$12 - \$7 = \$5/widget\nBreakeven = \$50M / \$5 = 10 million widgets\n\nInterpretation: 'Given market size of 80M units and our current 3% share (2.4M units), we need to grow share to 12.5% to break even. That's a 4x increase — we need to assess whether this is achievable and how long it takes.'\n\nAlways connect the breakeven back to market reality."
    }
  ]
}
\`\`\`

## Common Case Math Templates

\`\`\`
MARKET SHARE:
Our revenue in market / Total market size = Market share %
Example: \$240M revenue in a \$3B market = 8% share

PRICE × VOLUME = REVENUE decomposition:
If revenue fell 20%: was it price or volume?
Ask for split. If volume fell 15% and price fell 5%:
  Revenue decline = (1 - 0.15) × (1 - 0.05) - 1 = 0.85 × 0.95 - 1 = -19.25% ✓

MARGIN CALCULATIONS:
Gross Margin = (Revenue - COGS) / Revenue
'If COGS is 60% of revenue, gross margin is 40%'
'If gross margin is 65% and revenue is \$800M, gross profit = \$520M'

PAYBACK PERIOD:
Investment / Annual Cash Flow = Years to payback
'\$120M investment, \$30M annual savings → 4-year payback'

NPV (simple version for cases):
Don't need DCF precision — use simple multiples
'If EBITDA is \$50M/year and we pay 8x EBITDA = \$400M acquisition price'
'At a 10% discount rate, \$50M in perpetuity = \$500M NPV'
(Perpetuity value = Annual Cash Flow / Discount Rate)
\`\`\`

## Narrating Math Under Pressure

\`\`\`
The right way to handle math in a case:

SETUP (before calculating):
"To calculate the breakeven, I need:
  Fixed costs ÷ (Price per unit - Variable cost per unit)
I'll use the numbers you gave me: \$50M fixed, \$12 price, \$7 variable cost."

NARRATE WHILE CALCULATING:
"Contribution margin = 12 - 7 = \$5 per unit.
Breakeven = 50M ÷ 5 = 10 million units."

INTERPRET:
"So we need to sell 10 million units to break even.
Given you said the market is 80 million units and we currently have 3% share —
about 2.4 million units — we need roughly 4x our current volume.
That seems ambitious for a 3-year timeframe. I'd want to understand
what's driving customer acquisition and whether our current sales channels
can support that growth."

Why narrate: (1) Interviewer can catch errors before you go far wrong
(2) Shows thought process even if the final number is off by a bit
(3) Keeps the conversation flowing — silent calculation is awkward
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "A client's revenue was \$480M last year and is projected to reach \$648M in 3 years. What is the approximate CAGR?",
      "options": [
        "10%",
        "11%",
        "12.5%",
        "15%"
      ],
      "answer": 0,
      "explanation": "Growth from \$480M to \$648M = \$168M increase = 35% total growth over 3 years. Using Rule of 72 in reverse: 35% growth → estimate roughly 10-11% per year. More precisely: (648/480)^(1/3) - 1 = (1.35)^(0.333) - 1 ≈ 1.105 - 1 = 10.5%. The closest answer is 10%. In a case, 'approximately 10%' is a perfect answer — don't waste time computing the exact decimal."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Always narrate your math — this lets interviewers catch errors and shows your reasoning process.", "Decompose percentages: 15% = 10% + 5%. Decompose large multiplications into parts.", "Rule of 72: at X% growth, a number doubles in 72/X years. Use for quick CAGR estimates.", "Breakeven = Fixed Costs / Contribution Margin. Always interpret the number in context of market size.", "Round aggressively (\$487M → \$500M, 12.3% → 12%) — note the rounding, but keep the math clean.", "Contribution margin = Price - Variable Cost per unit. The higher it is, the fewer units you need to break even."]
\`\`\`
`,
    },
  ],
};
