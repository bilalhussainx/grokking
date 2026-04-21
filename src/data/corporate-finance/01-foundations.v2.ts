import { Module } from "../types";

export const foundationsModule: Module = {
  id: "cf-foundations",
  title: "Foundations of Corporate Finance",
  description: "Understand the purpose and structure of corporate finance — from firm objectives and governance to the evolving role of the CFO.",
  lessons: [
    {
      id: "cf-what-is-corporate-finance",
      slug: "what-is-corporate-finance",
      title: "What is Corporate Finance?",
      content: `## What is Corporate Finance?

Corporate finance is the area of finance that deals with how corporations make **funding decisions**, **investment decisions**, and **return decisions**. Every business, from a neighborhood coffee shop to Apple Inc., faces three fundamental questions:

1. **What long-term investments should we make?** (Capital budgeting)
2. **How should we pay for those investments?** (Capital structure)
3. **How should we manage day-to-day cash flows?** (Working capital management)

### The Three Pillars

| Pillar | Question | Example |
|--------|----------|---------|
| Capital Budgeting | Should we build a new factory? | Tesla's Gigafactory investment |
| Capital Structure | Should we use debt or equity? | Apple issuing bonds despite holding $200B cash |
| Working Capital | Can we pay next month's bills? | Managing inventory and receivables |

### Why It Matters

According to McKinsey's *Valuation* (7th edition, 2020), companies that consistently make value-creating investment decisions outperform peers by 3-5% in total shareholder returns annually. Corporate finance provides the analytical framework to make those decisions rigorously rather than by gut feeling.

### Real-World Example: Apple's Capital Allocation

In 2012, Apple had over $100 billion in cash and no dividend. Under pressure from Carl Icahn and other investors, Apple began returning capital through dividends and buybacks. By 2023, Apple had returned over **$600 billion** to shareholders — the largest capital return program in history (Source: Apple 10-K filings, SEC.gov).

This single decision — how to distribute excess cash — is a core corporate finance problem. It involves trade-offs between reinvestment, tax efficiency, signaling, and shareholder preferences.

### Corporate Finance vs. Other Finance Fields

- **Personal finance** deals with individual money decisions (budgeting, retirement).
- **Public finance** covers government revenue and spending.
- **Corporate finance** focuses on **maximizing the value of the firm** for its stakeholders through investment and financing decisions.

### The Tools You Will Learn

Throughout this course, you will master the analytical tools that CFOs, investment bankers, and financial analysts use daily:

- **Time value of money** — the foundation of all valuation
- **NPV and IRR** — for investment decisions
- **WACC** — for determining the cost of capital
- **DCF analysis** — for valuing companies and projects
- **Capital structure theory** — for financing decisions

### Key Takeaway

Corporate finance is ultimately about **creating value**. Every tool and framework you learn in this course answers one question: does this decision make the firm more valuable? The discipline provides a rigorous, quantitative approach to answering that question.

**Sources:** Berk, J. & DeMarzo, P. *Corporate Finance* (5th ed., Pearson, 2020); Koller, T., Goedhart, M., & Wessels, D. *Valuation: Measuring and Managing the Value of Companies* (McKinsey, 7th ed., 2020).`,
    },
    {
      id: "cf-goal-of-firm",
      slug: "goal-of-firm",
      title: "The Goal of the Firm",
      content: `## The Goal of the Firm: Shareholder Value vs. Stakeholder Theory

What should a corporation optimize for? This is one of the most debated questions in finance and business ethics. Two dominant frameworks compete for the answer.

### Shareholder Value Maximization

The **shareholder primacy** view, championed by Milton Friedman in his famous 1970 *New York Times* essay, argues that the sole responsibility of a business is to increase its profits for shareholders. The logic:

1. Shareholders are the **residual claimants** — they get paid last, after employees, suppliers, and creditors.
2. Because they bear the most risk, the firm should be managed in their interest.
3. If the firm maximizes its stock price, society benefits through efficient capital allocation.

This view dominated corporate America from the 1980s through the 2010s. Jack Welch at GE became its poster child, relentlessly pursuing earnings growth and stock price appreciation.

### Stakeholder Theory

**Stakeholder theory**, formalized by R. Edward Freeman in *Strategic Management: A Stakeholder Approach* (1984), argues that firms should balance the interests of **all** stakeholders — employees, customers, suppliers, communities, and shareholders.

The Business Roundtable's 2019 statement, signed by 181 CEOs (including Jamie Dimon and Tim Cook), redefined the purpose of a corporation to benefit **all stakeholders** — a dramatic shift from their 1997 statement that endorsed shareholder primacy.

### Real-World Tension: The Boeing Case

Boeing's 737 MAX crisis illustrates the danger of excessive shareholder focus. After the 2013 merger culture shift, Boeing:

- Moved headquarters away from engineering centers
- Prioritized cost-cutting and stock buybacks ($43 billion from 2013-2019)
- Reduced oversight of the 737 MAX development

The result: two fatal crashes killing 346 people, $20+ billion in losses, and massive reputational damage (Source: U.S. House Committee on Transportation and Infrastructure Report, 2020).

### The Modern View: Enlightened Shareholder Value

Most finance textbooks now advocate **enlightened shareholder value** — the idea that long-term stock price maximization *requires* treating stakeholders well. Research by Alex Edmans (*Grow the Pie*, 2020) shows that companies with high employee satisfaction outperformed peers by 2.3-3.8% per year over a 28-year period.

### ESG and the Evolving Debate

Environmental, Social, and Governance (ESG) factors have entered mainstream corporate finance. As of 2023, over $35 trillion in assets were managed under ESG criteria globally (Global Sustainable Investment Alliance, 2022). Whether ESG genuinely creates value or is "greenwashing" remains actively debated.

### Key Takeaway

In practice, the goal of the firm in corporate finance is typically stated as **maximizing the market value of existing shareholders' equity**. But modern practitioners recognize that sustainable value creation requires attending to all stakeholders. The tools in this course — NPV, DCF, WACC — are agnostic to this debate; they measure value creation regardless of whose interests you prioritize.

**Sources:** Friedman, M. "The Social Responsibility of Business" (*NYT*, 1970); Freeman, R.E. *Strategic Management: A Stakeholder Approach* (1984); Edmans, A. *Grow the Pie* (Cambridge UP, 2020).`,
    },
    {
      id: "cf-agency-problems",
      slug: "agency-problems",
      title: "Agency Problems",
      content: `## Agency Problems in Corporate Finance

An **agency problem** arises when one party (the **agent**) is supposed to act in the interest of another (the **principal**) but has incentives to act in their own interest instead. In corporate finance, the most important agency relationships are:

1. **Shareholders vs. Managers** — managers may pursue empire-building, perks, or risk avoidance instead of maximizing firm value.
2. **Shareholders vs. Creditors** — shareholders may take excessive risks because they capture the upside while creditors bear the downside.
3. **Controlling vs. Minority Shareholders** — controlling shareholders may extract private benefits at minority shareholders' expense.

### The Classic Principal-Agent Problem

Michael Jensen and William Meckling formalized the agency problem in their landmark 1976 paper, "Theory of the Firm: Managerial Behavior, Agency Costs, and Ownership Structure" (*Journal of Financial Economics*). They showed that when managers own less than 100% of a firm, they have incentives to:

- **Consume perquisites** — corporate jets, lavish offices, excessive staff
- **Avoid risk** — reject positive-NPV projects to protect their job
- **Empire build** — pursue acquisitions that increase firm size (and their compensation) but destroy value

### Real-World Example: Enron

Enron's 2001 collapse is a textbook agency failure. Executives used off-balance-sheet entities (SPEs) to hide debt and inflate profits. CEO Jeffrey Skilling and CFO Andrew Fastow enriched themselves while shareholders lost $74 billion in market value. The fraud was enabled by misaligned incentives: executives were compensated based on short-term stock price, not long-term value creation (Source: Bratton, W. "Enron and the Dark Side of Shareholder Value," *Tulane Law Review*, 2002).

### Agency Costs

Jensen and Meckling identified three types of agency costs:

| Cost Type | Description | Example |
|-----------|-------------|---------|
| **Monitoring costs** | Principal's cost of watching the agent | Board of directors, auditors |
| **Bonding costs** | Agent's cost of proving alignment | Financial disclosures, covenants |
| **Residual loss** | Value destroyed despite monitoring/bonding | Suboptimal investment decisions |

### Mechanisms to Reduce Agency Problems

Corporate finance has developed several tools to align incentives:

1. **Compensation design** — Stock options and restricted stock tie manager wealth to shareholder wealth. However, options can also encourage excessive risk-taking (as seen in the 2008 financial crisis).
2. **Board oversight** — Independent directors monitor management. The Sarbanes-Oxley Act (2002) strengthened board independence requirements after Enron.
3. **Debt as discipline** — Jensen's "Free Cash Flow" theory (1986) argues that debt forces managers to disgorge cash rather than waste it on bad projects.
4. **Market for corporate control** — The threat of hostile takeover disciplines managers. If a firm is poorly managed, its stock drops, making it a takeover target.
5. **Activist investors** — Hedge funds like Elliott Management and Pershing Square acquire stakes and push for changes.

### The Shareholder-Creditor Conflict

When a firm is near financial distress, shareholders have incentives to "gamble for resurrection" — taking on high-risk projects because they have nothing to lose (limited liability protects them) while creditors bear the downside. This is called **asset substitution**. Debt covenants exist specifically to prevent this behavior.

### Key Takeaway

Agency problems are unavoidable in any organization where ownership and control are separated. Corporate governance, compensation design, and capital structure decisions are all, in part, attempts to minimize agency costs. Understanding these conflicts is essential for evaluating corporate decisions.

**Sources:** Jensen, M. & Meckling, W. "Theory of the Firm" (*JFE*, 1976); Jensen, M. "Agency Costs of Free Cash Flow" (*AER*, 1986); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 1.`,
    },
    {
      id: "cf-corporate-governance",
      slug: "corporate-governance",
      title: "Corporate Governance",
      content: `## Corporate Governance

**Corporate governance** is the system of rules, practices, and processes by which a company is directed and controlled. It defines the distribution of rights and responsibilities among the board of directors, managers, shareholders, and other stakeholders.

### The Governance Structure

A typical public corporation has a layered governance structure:

\`\`\`
Shareholders (owners)
    └── Elect Board of Directors
            └── Appoints CEO & Senior Management
                    └── Runs day-to-day operations
\`\`\`

### The Board of Directors

The board's primary duties include:

1. **Hiring and firing the CEO** — perhaps the most consequential decision
2. **Approving major strategic decisions** — M&A, capital raises, dividends
3. **Overseeing risk management** — ensuring the firm doesn't take excessive risks
4. **Protecting shareholder interests** — fiduciary duty of care and loyalty

### Independence and Composition

After the corporate scandals of the early 2000s (Enron, WorldCom, Tyco), the **Sarbanes-Oxley Act (2002)** and updated stock exchange rules required:

- A **majority of independent directors** on the board
- An **independent audit committee**
- CEO/CFO certification of financial statements
- Whistleblower protections

Research by Gompers, Ishii, and Metrick ("Corporate Governance and Equity Prices," *Quarterly Journal of Economics*, 2003) found that firms with stronger governance outperformed those with weaker governance by 8.5% per year during the 1990s, using their "G-Index" of 24 governance provisions.

### Real-World Example: WeWork's Governance Failure

WeWork's failed 2019 IPO exposed extreme governance deficiencies:

- CEO Adam Neumann had **supervoting shares** giving him majority control
- He leased buildings he personally owned back to WeWork
- The board had limited independence and oversight
- Neumann cashed out $700 million before the IPO attempt

When the S-1 filing revealed these issues, the valuation collapsed from $47 billion to under $10 billion, and Neumann was forced out (Source: WeWork S-1 filing, SEC, 2019; Wiedeman, R. *Billion Dollar Loser*, 2020).

### Global Governance Models

| Model | Countries | Key Feature |
|-------|-----------|-------------|
| **Anglo-American** | US, UK, Australia | Dispersed ownership, strong stock market |
| **Continental European** | Germany, France | Bank-centric, two-tier boards |
| **Japanese (Keiretsu)** | Japan | Cross-shareholdings, relationship banking |
| **Family-controlled** | Asia, Latin America, Middle East | Founding family retains control |

### Proxy Fights and Shareholder Activism

When shareholders are dissatisfied, they can wage a **proxy fight** — soliciting votes from other shareholders to replace board members. Notable examples:

- **Nelson Peltz vs. Procter & Gamble (2017)** — the most expensive proxy fight in history ($60M+ spent)
- **Engine No. 1 vs. ExxonMobil (2021)** — a tiny hedge fund ($40M) won 3 board seats at a $250B company by rallying ESG-focused institutional investors

### The Role of Institutional Investors

Institutional investors (pension funds, mutual funds, sovereign wealth funds) now own over **70% of U.S. public equities** (Source: ICI, 2022). The "Big Three" — BlackRock, Vanguard, and State Street — collectively hold significant stakes in virtually every S&P 500 company, giving them enormous governance influence.

### Key Takeaway

Good governance reduces agency costs, protects investors, and is associated with higher firm valuations. As a finance professional, evaluating a company's governance structure is as important as analyzing its financial statements.

**Sources:** Gompers, P., Ishii, J., & Metrick, A. "Corporate Governance and Equity Prices" (*QJE*, 2003); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 29.`,
    },
    {
      id: "cf-role-of-cfo",
      slug: "role-of-cfo",
      title: "The Role of the CFO",
      content: `## The Role of the CFO

The **Chief Financial Officer (CFO)** is the senior executive responsible for managing the financial activities of a corporation. Once considered a back-office "bean counter," the modern CFO has evolved into a strategic leader who sits at the intersection of finance, operations, and strategy.

### Historical Evolution

The CFO role has transformed dramatically over the past few decades:

| Era | Primary Role | Key Activities |
|-----|-------------|----------------|
| **Pre-2000** | Controller/Accountant | Financial reporting, compliance |
| **2002-2010** | Risk Manager | SOX compliance, internal controls (post-Enron) |
| **2010-2020** | Strategic Partner | M&A, capital allocation, investor relations |
| **2020+** | Digital Transformer | Data analytics, AI/automation, ESG reporting |

According to McKinsey's 2021 survey of 200+ CFOs, **72% of CFOs now spend more time on strategy than on traditional finance activities**, compared to just 31% in 2009.

### Core Responsibilities

**1. Financial Planning & Analysis (FP&A)**

The CFO oversees budgeting, forecasting, and financial modeling. This includes building the company's annual operating plan, conducting variance analysis, and advising the CEO on resource allocation.

**2. Capital Allocation**

Deciding how to deploy the firm's capital is arguably the CFO's most value-creating function:
- Which projects to invest in (capital budgeting)
- How to finance those investments (debt vs. equity)
- How much to return to shareholders (dividends and buybacks)

Warren Buffett has called capital allocation "the most important job of management," noting that a CEO who deploys $10 billion over a decade is making consequential investment decisions whether they realize it or not (Source: Berkshire Hathaway Annual Letter, 2014).

**3. Risk Management**

The CFO manages financial risks including:
- **Interest rate risk** — using swaps and hedges
- **Currency risk** — hedging foreign exchange exposure
- **Liquidity risk** — ensuring the firm can meet obligations
- **Credit risk** — managing counterparty exposure

**4. Investor Relations**

Public company CFOs are the primary interface with Wall Street. They manage earnings calls, analyst meetings, and investor conferences. Research by Graham, Harvey, and Rajgopal ("The Economic Implications of Corporate Financial Reporting," *Journal of Accounting and Economics*, 2005) found that 78% of CFOs would sacrifice long-term value to smooth short-term earnings — revealing the intense pressure CFOs face from capital markets.

**5. Treasury Operations**

Managing the firm's cash, investments, and banking relationships. During COVID-19, treasury management became critical: CFOs scrambled to draw down credit lines, issue bonds, and preserve liquidity. Companies raised over $2 trillion in bonds during 2020 alone (Source: SIFMA, 2021).

### Real-World Example: Ruth Porat at Alphabet

When Ruth Porat joined Google (now Alphabet) as CFO in 2015 from Morgan Stanley, she brought Wall Street discipline to a company known for "moonshot" spending. She:

- Implemented stricter cost controls on Other Bets (non-core businesses)
- Improved financial transparency in earnings reports
- Initiated Alphabet's first-ever dividend and $70 billion buyback program (2024)

Under her tenure as CFO (2015-2023), Alphabet's market cap grew from $375 billion to over $1.7 trillion (Source: Alphabet 10-K filings, SEC.gov).

### The CFO-CEO Relationship

The CFO serves as a check on the CEO's ambitions. A strong CFO provides independent financial analysis and pushes back on value-destroying decisions. Research by Bedard, Hoitash, & Hoitash ("Chief Financial Officers as Inside Directors," *Contemporary Accounting Research*, 2014) found that CFO quality — measured by prior experience and credentials — is significantly associated with better financial reporting quality.

### Key Takeaway

The modern CFO is a strategic leader, not just a financial reporter. They make decisions that directly impact firm value through capital allocation, risk management, and strategic planning. Understanding the CFO's role helps you see how corporate finance theory translates into real executive decisions.

**Sources:** Graham, J., Harvey, C., & Rajgopal, S. "The Economic Implications of Corporate Financial Reporting" (*JAE*, 2005); McKinsey & Company, "The New CFO Mandate" (2021); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 1.`,
    },
  ],
};
