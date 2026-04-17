import { Module } from "../types";

export const module1: Module = {
  id: "case-interview-fundamentals",
  title: "The Consulting Industry & Case Interview Fundamentals",
  description: "What management consulting is, how elite firms recruit, the anatomy of a case interview, what interviewers are actually evaluating, and how to build the winning mindset",
  lessons: [
    {
      id: "what-is-consulting",
      slug: "what-is-consulting",
      title: "What Is Management Consulting?",
      content: `# What Is Management Consulting?

McKinsey, Bain, and BCG collectively place 10,000+ MBAs and undergrads per year — and reject 97% of applicants. Understanding the industry is the first step to breaking in.

---

\`\`\`concept
{
  "title": "The Consulting Value Proposition",
  "variant": "mental-model",
  "content": "Consulting firms sell three things: expertise (industry/functional knowledge the client doesn't have), bandwidth (teams of smart people to solve problems the client doesn't have time for), and credibility ('McKinsey told us to do it' provides political cover for hard decisions). A McKinsey partner typically charges \$500K-\$2M per project. The ROI justification is that one insight — a market to enter, a cost to cut, a strategy to adopt — can be worth tens or hundreds of millions."
}
\`\`\`

---

## The Consulting Landscape

\`\`\`compare
{
  "title": "Firm Tiers & What They're Known For",
  "items": [
    {
      "name": "MBB (McKinsey, BCG, Bain)",
      "description": "Top tier. Global strategy. McKinsey: transformations, CEO-level work, PST. BCG: strategy, BCG matrix inventors, strong analytics. Bain: private equity, results orientation, 'Bain World' culture. Acceptance rate: 1-3%. Starting salary: \$100K-\$190K undergrad."
    },
    {
      "name": "Big 4 Strategy (Deloitte S&O, PwC Strategy&, EY-Parthenon, KPMG)",
      "description": "Strong in implementation, digital transformation, public sector. Less prestige than MBB but broader hiring. More accessible with technical/accounting backgrounds. Strategy arms (Deloitte S&O, EY-Parthenon) are close to MBB in strategy work."
    },
    {
      "name": "Boutique Consultancies (Roland Berger, Kearney, Oliver Wyman, LEK)",
      "description": "Industry-specialized. Oliver Wyman: financial services. LEK: life sciences, private equity. Kearney: operations, supply chain. Roland Berger: European HQ, strong in industrial. Often better work-life balance than MBB."
    },
    {
      "name": "Tech/Strategy Hybrids (Accenture, Capgemini, IBM Consulting)",
      "description": "Digital transformation focus. Lower prestige ceiling but massive scale. Technology implementation expertise. Growing rapidly as all consulting goes digital."
    }
  ]
}
\`\`\`

## Career Trajectory

\`\`\`
Typical MBB Path:

Undergrad Analyst (2 years)
  → Associate/Consultant post-MBA (2-3 years)
    → Engagement Manager (2-3 years)
      → Principal/Project Leader (2-3 years)
        → Partner/Director (8-10 years in)

Exit opportunities after 2-3 years:
• Private Equity (most common for top performers)
• Corporate Strategy (F500 companies)
• Startup (Chief of Staff, COO)
• MBA (Harvard, Wharton, Stanford — 80%+ from consulting)
• Entrepreneurship (funded by former consulting network)

Compensation:
• Analyst (undergrad): \$100-115K base + \$10-25K bonus
• Associate (post-MBA): \$165-190K base + \$30-50K bonus
• Engagement Manager: \$250-350K total
• Principal: \$400-600K total
• Partner: \$1M-\$5M+ total (carry, profit sharing)
\`\`\`

## The Recruiting Timeline

\`\`\`
For undergrads (recruiting 12+ months before start date):

September-October (junior year):
  → Resume drop + networking (coffee chats with consultants)

October-November:
  → First round: resume screen + behavioral interviews (some firms)

November-January:
  → Case interview rounds (2-3 rounds of 2 cases each)

January-February:
  → Offer decisions

Key dates vary by firm:
• McKinsey: typically November final rounds for undergrads
• BCG: similar timeline, OCR-heavy (on-campus recruiting)
• Bain: "Super Day" format — multiple interviews in one day

For MBAs:
• First-year summer internship = the primary path
• Recruiting Oct-Jan of first year → summer between years 1 and 2
• Return offer rate: 60-80% (not guaranteed)
\`\`\`
`,
    },
    {
      id: "anatomy-of-a-case",
      slug: "anatomy-of-a-case",
      title: "Anatomy of a Case Interview",
      content: `# Anatomy of a Case Interview

Every case interview follows a recognizable structure. Knowing the format removes anxiety and lets you focus on thinking.

---

\`\`\`concept
{
  "title": "What Interviewers Are Actually Testing",
  "variant": "mental-model",
  "content": "Interviewers aren't testing if you get the 'right answer' — cases rarely have one. They're testing: (1) Structured thinking — can you break a complex problem into a logical framework without being told? (2) Hypothesis-driven reasoning — do you form early hypotheses and test them rather than boiling the ocean? (3) Quantitative comfort — can you do mental math under pressure and interpret numbers correctly? (4) Communication — can you explain your thinking clearly while thinking? (5) Composure — can you handle ambiguity, course-correct, and stay confident when stuck? These are the skills consultants use daily with clients."
}
\`\`\`

---

## The 5 Phases of Every Case

\`\`\`tabs
{
  "tabs": [
    {
      "label": "1. Setup (2 min)",
      "content": "Interviewer reads the case prompt. You listen actively, take notes, confirm your understanding.\n\nExample prompt: 'Our client is a European airline that has seen profits decline 15% over the past two years. The CEO has asked us to help identify the cause and recommend a path forward.'\n\nYour job: Restate the objective in your own words. Confirm the goal. Clarify any ambiguity.\n\n'To confirm — our goal is to identify why profits have declined 15% over two years and recommend how to improve profitability. Is there a specific profit target or timeline we're working toward?'"
    },
    {
      "label": "2. Clarification (2 min)",
      "content": "Ask 2-3 focused clarifying questions BEFORE structuring. Not too many (shows indecision), not zero (shows you don't think).\n\nGood clarifying questions:\n• 'Has revenue declined, costs increased, or both?'\n• 'Is the decline across all routes or concentrated in specific markets?'\n• 'Are competitors seeing the same decline, or is this specific to our client?'\n\nBad clarifying questions:\n• 'What country are they in?' (irrelevant)\n• 'How many employees do they have?' (premature detail)\n• 20 questions (shows inability to prioritize)"
    },
    {
      "label": "3. Framework (3 min)",
      "content": "Ask for 60-90 seconds of silence to structure your approach. Build your framework on paper, then present it.\n\nSay: 'I'd like to take a minute to structure my approach.'\n\nThen walk the interviewer through your framework:\n'I'd like to look at this profitability problem across two buckets: Revenue and Costs. On the revenue side, I'd examine volume (passengers and routes) and pricing. On the cost side, I'd look at fixed costs like fleet and labor, and variable costs like fuel and airport fees. I'd also look at external factors like competitive and regulatory environment. Does this approach make sense before I dive in?'"
    },
    {
      "label": "4. Analysis (15-20 min)",
      "content": "The heart of the case. Interviewer provides data, you ask questions, run calculations, interpret findings.\n\nKey behaviors:\n• Lead the interview — YOU drive the direction, don't wait to be spoon-fed\n• Form hypotheses, then test them: 'My hypothesis is that costs have increased due to fuel prices. Can we look at cost data to test this?'\n• Do math out loud — narrate your calculations so interviewer can follow and help if needed\n• Synthesis — after each data point, say what it tells you and update your hypothesis\n• Stay in the framework — regularly refer back to your structure"
    },
    {
      "label": "5. Recommendation (2 min)",
      "content": "Deliver a clear, concise, CEO-level recommendation. Start with your conclusion, then support it.\n\nStructure: 'Based on my analysis, I recommend [X]. My top three reasons are [1], [2], [3]. The key risks to this recommendation are [A] and [B], which we'd mitigate by [strategy].'\n\nCommon mistakes:\n• Wishy-washy: 'It depends on many factors...' — BE DECISIVE\n• Bottom-up: listing all findings before the conclusion — START with the conclusion\n• No risks: shows incomplete thinking — always acknowledge key risks\n• Too long: 60-90 seconds maximum for the recommendation"
    }
  ]
}
\`\`\`

## Scoring Rubric: What Interviewers Write Down

\`\`\`
McKinsey uses a 1-3 scale (3=hire, 2=borderline, 1=no hire) across dimensions:

  PROBLEM SOLVING
  ├── Problem structuring: MECE framework, covers the right areas
  ├── Analytical rigor: correct math, logical inferences
  ├── Insight generation: identifies the key driver, not just describes data
  └── Creativity: novel approaches, second-order thinking

  COMMUNICATION
  ├── Clarity: structured responses, signposting ("First... Second... Third...")
  ├── Listening: incorporates interviewer hints and redirections
  └── Executive presence: confident, concise, not rambling

  PERSONAL IMPACT
  ├── Drive/initiative: leads the case, doesn't wait passively
  ├── Composure: handles tough follow-up questions without panic
  └── Authenticity: genuine personality, not robotic

You need 2.5+ average across dimensions to receive an offer.
A perfect framework with poor communication or weak math still fails.
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "A candidate gives a brilliant, detailed analysis but starts their final recommendation with 'So in summary, there are many factors at play here, including fuel costs, revenue mix, competitor pricing...' What is the primary mistake?",
      "options": [
        "The recommendation is too detailed",
        "They started with supporting points instead of leading with the conclusion",
        "They should have covered more factors",
        "The recommendation is too short"
      ],
      "answer": 1,
      "explanation": "Consulting recommendations must be 'top-down' — lead with your conclusion, then support it. This is called the Pyramid Principle (Barbara Minto). Interviewers simulate CEOs who are busy; they want the answer first, then the reasoning. Starting with 'many factors at play' signals bottom-up academic thinking, not consulting thinking."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Cases have 5 phases: Setup → Clarify → Framework → Analyze → Recommend. Know which phase you're in.", "Interviewers test structured thinking, quantitative skill, communication, and composure — not just the 'right answer'.", "Ask 2-3 focused clarifying questions before structuring — not zero (shows you don't think) and not 10 (shows indecision).", "Always take 60-90 seconds of silence to build your framework before presenting it — rushing produces weak structure.", "Lead the interview: form hypotheses, drive the analysis direction, don't wait passively for guidance.", "Recommendations must be top-down: conclusion first, then three supporting reasons, then key risks."]
\`\`\`
`,
    },
    {
      id: "mece-hypothesis",
      slug: "mece-hypothesis",
      title: "MECE Thinking & Hypothesis-Driven Analysis",
      content: `# MECE Thinking & Hypothesis-Driven Analysis

The two most distinctive consulting thinking tools are MECE (how to structure) and hypothesis-driven analysis (how to investigate). Together they separate consultants from academics.

---

\`\`\`concept
{
  "title": "MECE: The Foundation of Consulting Thinking",
  "variant": "mental-model",
  "content": "MECE stands for Mutually Exclusive, Collectively Exhaustive — coined by Barbara Minto at McKinsey. Mutually Exclusive: categories don't overlap (no double-counting). Collectively Exhaustive: together they cover the entire problem space (no gaps). A MECE breakdown of 'why is revenue declining?' is 'Volume × Price' — every revenue dollar is either a price effect or a volume effect, and there's no overlap. A non-MECE breakdown: 'marketing, sales, pricing, customer service' — overlapping (marketing affects both sales and customers) and incomplete (misses product quality, distribution). MECE structures are faster to investigate because you eliminate entire buckets and know you haven't missed anything."
}
\`\`\`

---

## MECE in Practice

\`\`\`tabs
{
  "tabs": [
    {
      "label": "MECE Check",
      "content": "Test any structure by asking:\n1. Can a single data point fit in two buckets? → Not Mutually Exclusive\n2. Is there a data point that doesn't fit in ANY bucket? → Not Collectively Exhaustive\n\nExample: 'Why is our market share declining?'\n\nNon-MECE: Product quality, Customer service, Marketing, Sales force, Pricing\n• 'Our product has bugs' → fits Product Quality AND could fit Customer Service\n• 'Competitor launched new feature' → fits nowhere\n\nMECE: Internal factors vs External factors\n• Internal: Product, Price, Promotion, Placement (4Ps)\n• External: Competitors, Customers, Macro environment\n→ Every cause fits exactly one bucket. No gaps."
    },
    {
      "label": "MECE Structures",
      "content": "Most MECE structures follow one of four patterns:\n\n1. Math identity: Revenue = Volume × Price (always MECE)\n2. Process decomposition: Input → Process → Output (supply chain: Sourcing → Manufacturing → Distribution)\n3. Customer segmentation: by geography, by size, by product line (if mutually exclusive)\n4. Time: Historical → Current → Projected\n\nCommon non-MECE traps:\n• Listing things that came to mind rather than building a structure\n• Using 'and/or' (signals overlap)\n• Mixing levels of abstraction (mixing 'pricing' with 'competitor intensity')"
    },
    {
      "label": "Issue Trees",
      "content": "An issue tree is a MECE hierarchical breakdown of a question.\n\nTop question: Why is profit declining?\n\n├── Revenue down? (Yes, 20% decline)\n│   ├── Volume down?\n│   │   ├── Fewer new customers?\n│   │   └── Higher churn?\n│   └── Price/unit down?\n│       ├── Price cuts?\n│       └── Product mix shift to lower margin?\n└── Costs up?\n    ├── Fixed costs up?\n    └── Variable costs up?\n        ├── Input costs up?\n        └── Efficiency loss?\n\nWork the tree left to right: confirm which branches matter before drilling down. This prevents wasted analysis."
    }
  ]
}
\`\`\`

## Hypothesis-Driven Thinking

\`\`\`
Academic vs Consulting approach to problem solving:

ACADEMIC APPROACH:
1. Gather all data
2. Analyze everything
3. Eventually form conclusions

CONSULTING APPROACH:
1. Form a hypothesis immediately (best guess)
2. Identify the single test that would disprove or confirm it
3. Run that test (gather minimum necessary data)
4. Update hypothesis → repeat

Why it matters: A McKinsey engagement is 8 weeks. If you "gather all the data" you'll run out of time. Consultants are forced to make directional decisions with incomplete information — the same skill used in cases.

Example:
Case: Retail chain profits declining.
Data: Revenue flat, costs up 15%.

Hypothesis: Labor costs are driving the cost increase.
Test: Request cost breakdown by category.
Result: Labor up 3%, rent up 8%, supply chain up 4%.

Update hypothesis: Rent cost increase is the primary driver.
Test: Identify which stores/regions drove the rent increase.
→ This takes 2 data requests vs. 20.
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "You're building a profitability framework and structure your costs as: 'Labor, Rent, Marketing, Technology, and Other.' What is the MECE problem with this structure?",
      "options": [
        "It has too many categories",
        "'Other' makes it collectively exhaustive but doesn't tell us anything useful for analysis",
        "Marketing overlaps with Labor (marketing employees)",
        "Both B and C are correct — 'Marketing' includes people costs (overlap with Labor) AND 'Other' is a dump category that hides structure"
      ],
      "answer": 3,
      "explanation": "Two problems: (1) 'Marketing' costs include people — if there's a separate Labor bucket, marketing labor is double-counted. Better structure: Fixed vs Variable, or Direct vs Indirect. (2) 'Other' is a MECE cheat — it makes the structure technically exhaustive but provides no analytical value. Better to use a clean hierarchy: Fixed costs (Rent, Depreciation) vs Variable costs (COGS, Labor per unit). Always ask: does each bucket point to a distinct investigation path?"
    }
  ]
}
\`\`\`

\`\`\`takeaways
["MECE = Mutually Exclusive, Collectively Exhaustive. Test by checking if any item fits in two buckets (ME) or no bucket (CE).", "The most reliable MECE structure is a math identity: Revenue = Volume × Price, Profit = Revenue - Cost.", "Issue trees decompose problems hierarchically. Work left-to-right: confirm which branch matters before drilling down.", "Hypothesis-driven thinking: form a guess, identify the minimal test to disprove it, run that test, update. Repeat.", "Academic thinking gathers all data then concludes. Consulting thinking forms conclusions first, then gathers minimum data to validate.", "In a case, always state your hypothesis explicitly: 'My hypothesis is X. To test it, I'd like to look at Y.'"]
\`\`\`
`,
    },
  ],
};
