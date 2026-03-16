import { Module } from "../types";

export const pitchbooksModule: Module = {
  id: "ib-pitchbooks",
  title: "Pitchbooks & Client Presentations",
  description:
    "Learn to create compelling pitchbooks — the primary tool investment bankers use to win mandates and advise clients.",
  lessons: [
    {
      id: "ib-pitchbooks-what-is",
      slug: "what-is-a-pitchbook",
      title: "What is a Pitchbook?",
      content: `## What is a Pitchbook?

A pitchbook is a presentation document created by investment bankers to pitch their services to potential or existing clients. It is the primary sales tool in investment banking — the vehicle through which banks win mandates worth millions of dollars in fees. Creating pitchbooks consumes a significant portion of an analyst's time, and mastering the format is a core skill.

### Purpose of a Pitchbook

Pitchbooks serve several distinct purposes depending on the context:

**Pitch for a new mandate**: The bank is competing against other banks to be hired for a specific transaction (M&A sale, IPO, debt issuance). The pitchbook must demonstrate expertise, propose a compelling strategy, and differentiate the bank from competitors.

**General market update**: The bank proactively shares industry insights, valuation trends, and potential strategic opportunities with a client. This builds the relationship and positions the bank for future mandates.

**Live deal presentation**: Once engaged, the bank presents updates on deal progress — buyer interest, valuation analyses, negotiation status, and recommendations.

**Board presentation**: Formal presentations to a company's board of directors, often requiring a higher level of polish, legal review, and precision.

### The Anatomy of a Pitchbook

While every pitchbook is customized, the standard structure includes:

| Section | Content | Pages |
|---------|---------|-------|
| **Cover page** | Bank logo, client name, date, confidentiality notice | 1 |
| **Table of contents** | Section listing | 1 |
| **Executive summary** | Key recommendations in 1-2 pages | 1-2 |
| **Situation overview** | Client's current position, market context | 3-5 |
| **Strategic alternatives** | Options available (sell, acquire, IPO, stay private) | 3-5 |
| **Valuation analysis** | DCF, comps, precedents, football field | 5-10 |
| **Transaction process** | Proposed timeline, key milestones | 2-3 |
| **Buyer/investor universe** | Potential counterparties with profiles | 3-5 |
| **Credentials** | Bank's relevant experience (tombstones) | 2-3 |
| **Team biographies** | Senior bankers assigned to the engagement | 1-2 |
| **Appendix** | Supporting data, detailed analyses | Variable |

A typical pitchbook runs **30-60 pages** and takes an analyst team 1-3 weeks to produce.

### What Makes a Great Pitchbook

**Insight, not just information.** Anyone can compile market data. The pitchbook should offer a point of view — "Here is what we think you should do, and here is why."

**Client-centric, not bank-centric.** The client cares about their situation, not about how great your bank is. Lead with their strategic options, not your credentials.

**Clean, professional formatting.** Every chart must be labeled, every number must be sourced, and the visual design must be consistent. Sloppy formatting signals sloppy thinking.

**Actionable recommendations.** End each section with a clear "so what" — what should the client do next?

### The Production Process

Creating a pitchbook is a team effort:

1. **MD/Director** defines the strategic narrative and key messages
2. **VP** outlines the structure and reviews drafts
3. **Associate** manages the production process and contributes analytical content
4. **Analyst** builds the models, creates the charts, formats the slides, and assembles the final document

Multiple rounds of review are standard. It is not uncommon for a pitchbook to go through 5-10 revision cycles before the MD approves it for client presentation.

### Key Takeaway

Pitchbooks are where analysis meets storytelling. They combine rigorous financial analysis with strategic insight and persuasive communication. For junior bankers, pitchbook production is the primary training ground — it teaches you to think about client situations holistically, communicate complex ideas clearly, and deliver polished work under pressure.`,
    },
    {
      id: "ib-pitchbooks-situation-overview",
      slug: "situation-overview",
      title: "The Situation Overview Section",
      content: `## The Situation Overview Section

The situation overview is typically the first substantive section of a pitchbook (after the executive summary). Its purpose is to demonstrate that you understand the client's business, their market, and the forces shaping their strategic options. Done well, it builds credibility instantly. Done poorly, it signals that the bank has not done its homework.

### What to Include

The situation overview should cover four key areas:

**1. Company Profile**
A concise summary of the client's business:
- Revenue, EBITDA, and key financial metrics (historical and current)
- Business segments and their relative contribution
- Geographic footprint and customer concentration
- Key competitive advantages and strategic assets
- Recent performance trends (improving, stable, or declining)

Present this visually — a one-page company snapshot with a revenue breakdown pie chart, a financial summary table, and a stock price chart (if public).

**2. Industry Landscape**
Position the client within their industry:
- Market size and growth rate
- Key industry trends and drivers
- Competitive dynamics (market share, consolidation, disruption)
- Regulatory environment and upcoming changes

Use industry data from research reports, trade publications, and government sources. Cite your sources — credibility matters.

**3. Market Conditions**
Assess the current environment for the contemplated transaction:
- M&A activity in the sector (deal volume, average multiples)
- Capital markets conditions (availability of financing, investor appetite)
- Public market valuations for comparable companies
- Recent relevant transactions and their outcomes

This section should answer: "Is now a good time to do this deal?"

**4. Key Considerations**
Frame the strategic questions the client faces:
- What are the company's biggest growth opportunities?
- What risks or headwinds are on the horizon?
- How does the company compare to its peers on valuation?
- What would a potential acquirer or investor find most attractive (and most concerning)?

### Structuring the Pages

A typical situation overview runs 3-5 pages:

**Page 1: Company at a Glance**
One-page visual summary with key financial metrics, business description, and stock performance chart.

**Page 2: Financial Performance**
Historical financials (3-5 years) showing revenue, EBITDA, margins, and growth. Use bar charts for revenue trends and line charts for margin trends.

**Page 3: Industry Overview**
Market size, growth, competitive landscape, and key trends. Use a market map showing major players and their positioning.

**Page 4: Market Conditions**
M&A activity, comparable valuations, and capital markets environment. Include a chart showing sector deal volume and average multiples over time.

**Page 5: Key Themes**
Three to five bullet points framing the strategic questions, leading into the next section (strategic alternatives).

### Common Mistakes

- **Too much data, not enough insight**: Listing 20 financial metrics without explaining what they mean for the client's situation
- **Generic industry slides**: Using the same industry overview for every client in the sector without customization
- **No "so what"**: Presenting facts without drawing conclusions or connecting them to the client's decision
- **Outdated information**: Using market data that is more than 3-6 months old in a fast-moving market
- **Ignoring the elephant in the room**: If the company has a clear weakness (declining revenue, customer concentration), address it proactively rather than hoping no one notices

### Key Takeaway

The situation overview sets the tone for the entire pitchbook. It should demonstrate that you have done deep diligence on the client's business and market, and that your strategic recommendations (which come later) are grounded in this understanding. Think of it as the "diagnosis" before the "prescription."`,
    },
    {
      id: "ib-pitchbooks-valuation-summary",
      slug: "valuation-summary",
      title: "The Valuation Summary",
      content: `## The Valuation Summary

The valuation summary is the analytical heart of any pitchbook. It presents the bank's view on what the company is worth — or could be worth in a transaction — using multiple methodologies. This section transforms all of the modeling work (DCF, comps, precedents, LBO) into a clear, decision-relevant output.

### Structure of the Valuation Summary

A complete valuation summary typically includes 5-8 pages:

**Page 1: Valuation Overview (Football Field)**
The summary page showing all valuation methodologies on a single horizontal bar chart. This is often the single most important page in the pitchbook because it communicates the range of values at a glance.

**Page 2: Comparable Companies Analysis**
The full comps table showing the peer set, their financial metrics, and valuation multiples. Highlight the median and show the implied value range when the median multiple is applied to the target.

**Page 3: Precedent Transactions Analysis**
The precedent transactions table with deal details, multiples paid, and premiums. Show the implied value range.

**Page 4-5: DCF Analysis**
Key assumptions summary (WACC, terminal growth rate, margin assumptions) and the sensitivity table showing enterprise value across a range of WACC and terminal value assumptions.

**Page 6: LBO Analysis (if applicable)**
For sell-side pitches, the LBO analysis shows what a financial sponsor would pay. This sets the "floor" for valuation because PE firms need to achieve target returns (20%+ IRR).

**Page 7: Premiums Paid Analysis**
Analysis of premiums paid in comparable transactions — what percentage above the pre-deal share price did acquirers pay? This helps set expectations for the client if they are considering a sale.

**Page 8: Valuation Summary Table**
A clean table summarizing the implied value range from each methodology:

| Methodology | Low | Midpoint | High |
|-------------|-----|----------|------|
| Trading Comps (EV/EBITDA) | \$42 | \$48 | \$55 |
| Precedent Transactions | \$50 | \$57 | \$64 |
| DCF (Perpetuity Growth) | \$44 | \$52 | \$62 |
| DCF (Exit Multiple) | \$46 | \$54 | \$63 |
| LBO (20% IRR) | \$40 | \$45 | \$50 |
| 52-Week Range | \$38 | — | \$52 |
| **Reference Range** | **\$48** | **\$54** | **\$60** |

The **reference range** is the bank's recommended valuation range, informed by all methodologies but weighted toward the ones most relevant to the specific situation.

### Choosing the Lead Methodology

Different situations call for different lead methodologies:

| Situation | Lead Method | Rationale |
|-----------|------------|-----------|
| Stable, public company M&A | Trading comps + premiums | Market already prices the company; premium is the key variable |
| High-growth private company | DCF | Future cash flows drive value, no public trading history |
| PE buyout | LBO analysis | Buyer's return requirements dictate the price |
| Distressed company | Asset-based / liquidation | Cash flow models are unreliable |
| IPO | Comparable companies | IPO pricing is benchmarked to public peers |

### Presenting Uncertainty

A common mistake is presenting a single "answer" for valuation. Sophisticated clients and boards know that valuation is uncertain. Your presentation should:

1. Show the range, not just the midpoint
2. Explain what drives the high and low ends
3. Identify which assumptions have the greatest impact
4. Discuss scenarios where the valuation range would shift materially

### Formatting Best Practices

- Use consistent decimal places (one decimal for multiples, whole numbers for per-share values)
- Include the "as of" date for all market data
- Source all comparable data (Capital IQ, Bloomberg, public filings)
- Use consistent color coding across all valuation pages
- Label axes on every chart
- Include footnotes explaining any adjustments or assumptions

### Key Takeaway

The valuation summary is where analytical rigor meets practical decision-making. It should present a defensible range informed by multiple methodologies, clearly communicate the key assumptions and sensitivities, and lead the client toward an informed decision. The best valuation summaries do not just show numbers — they tell a story about what the company is worth and why.`,
    },
    {
      id: "ib-pitchbooks-transaction-comparison",
      slug: "transaction-comparison",
      title: "Transaction Comparison Pages",
      content: `## Transaction Comparison Pages

Transaction comparison pages showcase relevant completed deals to provide context for the contemplated transaction. These pages serve dual purposes: they validate the bank's recommended approach by showing that similar deals have been done successfully, and they calibrate pricing expectations by showing what acquirers have historically paid.

### Types of Transaction Comparison Pages

**1. Selected M&A Transaction Summary**

A table of 8-15 relevant completed transactions showing:

| Column | Data |
|--------|------|
| Date | Announcement date |
| Target | Company acquired |
| Acquirer | Buyer name |
| EV (\$M) | Enterprise value of the deal |
| EV/Revenue | Valuation multiple |
| EV/EBITDA | Valuation multiple |
| Premium | Premium to pre-deal stock price |
| Deal Type | Strategic vs. financial, cash vs. stock |

Transactions should be ordered by date (most recent first) or by relevance. Highlight the most comparable transactions in a different color or with bold text.

**2. Premium Analysis**

A focused analysis on premiums paid in change-of-control transactions:

- Premium to 1-day prior: What the market missed
- Premium to 30-day VWAP: Smooths out short-term volatility
- Premium to 52-week high: Shows willingness to pay above recent peaks
- Premium to unaffected price: If rumors leaked before the announcement

Typical premiums in M&A:

| Context | Typical Premium |
|---------|----------------|
| Friendly strategic acquisition | 25-40% |
| Competitive auction | 30-50% |
| PE buyout | 20-35% |
| Going-private transaction | 25-45% |
| Hostile takeover | 40-60% |

**3. Transaction Multiples Over Time**

A chart showing how deal multiples have evolved over the past 5-10 years. This contextualizes whether current multiples are historically high, low, or normal.

For example, software deal multiples might have been 8x EV/EBITDA in 2019, peaked at 20x in 2021, and normalized to 12x in 2024. Knowing where we are in the cycle is critical for timing advice.

**4. Comparable Transaction Profiles**

For the 3-5 most relevant deals, provide a one-page profile for each:

- Transaction overview (buyer, target, price, structure)
- Strategic rationale (why the buyer wanted the target)
- Financial summary (target's revenue, EBITDA, growth)
- Multiples paid (EV/Revenue, EV/EBITDA, premium)
- Financing structure (how the deal was funded)
- Synergies announced (cost savings, revenue synergies)
- Outcome (stock price reaction, integration success if known)

### How to Source Transaction Data

| Source | Best For |
|--------|---------|
| Capital IQ / Bloomberg | Deal terms, multiples, dates |
| SEC filings (DEFM14A) | Definitive proxy with full deal details |
| Press releases | Initial announcement terms |
| Equity research | Analyst commentary on deal rationale |
| Fairness opinions | Independent valuation used by the board |
| News articles | Context on competitive dynamics, leaked bids |

### Selecting the Right Transactions

Not all deals are equally relevant. Apply these filters:

1. **Recency**: Prioritize deals from the last 3 years
2. **Industry match**: Same sub-sector as the target
3. **Size**: Within 0.5x to 3x of the contemplated transaction
4. **Deal type**: Match the type (strategic vs. financial, auction vs. negotiated)
5. **Market conditions**: Flag deals done in unusual environments

### Key Takeaway

Transaction comparison pages ground the pitchbook in real-world evidence. They show the client that the bank's recommendations are not theoretical — they are based on what has actually happened in the market. The best comparison pages do not just list deals; they extract insights about pricing trends, buyer behavior, and market conditions that directly inform the client's decision-making.`,
    },
    {
      id: "ib-pitchbooks-presenting",
      slug: "presenting-to-clients",
      title: "Presenting to Clients",
      content: `## Presenting to Clients

Creating the pitchbook is only half the job — presenting it effectively is equally important. The in-room presentation is where mandates are won or lost, where boards make decisions, and where the bank's reputation is built. For senior bankers, presenting is a core competency. For junior bankers, understanding the dynamics of client presentations is essential for career development.

### Preparation

**Know the material cold.** You should be able to discuss every number, every assumption, and every chart in the pitchbook without looking at it. The presentation is not a reading exercise — it is a conversation guided by the slides.

**Anticipate questions.** For every key data point or recommendation, prepare for the "Why?" and "What if?" questions:
- "Why did you choose these comparable companies?"
- "What happens if the market corrects by 20%?"
- "Why do you recommend a sale now versus waiting 12 months?"

**Know your audience.** A presentation to a CEO requires a different approach than a presentation to a board of directors or a private equity investment committee:

| Audience | Focus | Style |
|----------|-------|-------|
| CEO / CFO | Strategic options, actionable steps | Conversational, detail-oriented |
| Board of Directors | Fiduciary considerations, risk | Formal, concise, balanced |
| PE Investment Committee | Returns, risk factors, thesis | Data-driven, direct |
| M&A counterparty | Negotiation leverage, valuation | Assertive, well-supported |

**Rehearse.** Senior bankers rehearse important presentations, and the deal team should do a dry run at least once. This catches formatting errors, awkward transitions, and logical gaps.

### The Presentation Itself

**Opening (2-3 minutes)**
Set the context and preview the key message. The audience should know within 60 seconds what you are going to recommend and why.

"Good morning. Based on our analysis, we believe the optimal path is to pursue a sale process in Q3, targeting strategic acquirers in the healthcare technology space. We believe the company can achieve a valuation of 12 to 14 times EBITDA, representing a 30 to 40 percent premium to current trading levels. Let me walk you through the analysis that supports this recommendation."

**Body (20-40 minutes)**
Walk through the key sections of the pitchbook. Do not present every page — focus on the slides that matter most:
- The situation overview (1-2 slides)
- The strategic alternatives analysis (1-2 slides)
- The valuation summary (football field and key supporting pages)
- The proposed process and timeline
- The buyer universe

**Skip slides gracefully.** Say "I will skip past the detailed comps table — it is in your materials — and focus on the key takeaway" rather than awkwardly clicking through 10 pages.

**Closing (5 minutes)**
Summarize the key recommendation, outline next steps, and open for questions.

### Handling Questions

**The golden rule: Never guess.** If you do not know the answer, say: "That is a great question — let me come back to you with the precise data point after this meeting." This is infinitely better than guessing wrong.

**Bridge to your strengths.** If a question takes you into uncomfortable territory, acknowledge the point and redirect: "That is a fair concern about the macroeconomic environment. What our analysis shows is that even in a downside scenario, the valuation floor is well above the current trading price because of..."

**Let the MD lead.** In a team presentation, the MD handles strategic questions and client relationship dynamics. The VP handles execution questions. Junior bankers should only speak when directly addressed or when they have specific data to contribute.

### Common Pitfalls

1. **Reading the slides**: The audience can read. Add value by providing context and insight beyond what is on the page.
2. **Too much detail**: A board meeting is not the time to walk through every DCF assumption. Present the conclusion and have the supporting detail ready if asked.
3. **No clear recommendation**: Presenting three options without a point of view is not helpful. The client is paying for your judgment — use it.
4. **Ignoring body language**: If the audience looks confused or disengaged, pause and check in. "Would it be helpful if I spent more time on the valuation methodology?"
5. **Over-promising**: Never guarantee a specific outcome ("We will definitely get you 15x EBITDA"). Use ranges and probabilities.

### Key Takeaway

Presenting to clients is the culmination of all the analytical and preparatory work. The best presentations are confident but not arrogant, data-driven but not overwhelming, and opinionated but open to dialogue. For junior bankers, observing how senior bankers present — how they handle tough questions, build rapport, and drive decisions — is one of the most valuable learning experiences in the industry.`,
    },
  ],
};
