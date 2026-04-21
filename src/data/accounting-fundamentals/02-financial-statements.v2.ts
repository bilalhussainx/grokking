import { Module } from "../types";

export const financialStatementsModule: Module = {
  id: "acct-statements",
  title: "Financial Statements",
  description: "Master the four core financial statements — the income statement, balance sheet, cash flow statement, and statement of stockholders' equity — and learn how they interconnect. Resources: FASB Conceptual Framework, Penman (2013) Financial Statement Analysis, SEC EDGAR filings.",
  lessons: [
    {
      id: "acct-statements-income",
      slug: "income-statement",
      title: "Income Statement",
      content: `## The Income Statement

The income statement (also called the profit and loss statement or P&L) reports a company's revenues, expenses, and net income over a specific period. It answers the fundamental question: **Did the company make money?**

### Structure

The income statement follows a top-down format:

\`\`\`
Revenue
- Cost of Goods Sold (COGS)
= Gross Profit
- Operating Expenses
= Operating Income (EBIT)
- Interest Expense
+/- Other Income/Expenses
= Income Before Taxes
- Income Tax Expense
= Net Income
\`\`\`

### Revenue Recognition

Under ASC 606 (Revenue from Contracts with Customers), revenue is recognized when five criteria are met: (1) identify the contract, (2) identify performance obligations, (3) determine the transaction price, (4) allocate the price to obligations, and (5) recognize revenue as obligations are satisfied (FASB, 2014). This replaced the older realization and matching rules.

### Key Line Items Explained

**Gross Profit** = Revenue - COGS. This measures the profitability of the core product or service before overhead. A declining gross margin may indicate rising input costs or pricing pressure.

**Operating Income (EBIT)** = Gross Profit - Operating Expenses (SG&A, R&D, depreciation). This reflects the profitability of core business operations, excluding financing and tax effects.

**Net Income** = the "bottom line" — what remains after all expenses, interest, and taxes. This is what flows into retained earnings on the balance sheet.

### Single-Step vs Multi-Step

A **single-step** income statement groups all revenues together and all expenses together, subtracting once to get net income. A **multi-step** income statement separates operating and non-operating items, providing more analytical detail. Public companies almost universally use the multi-step format (Revsine et al., 2015, *Financial Reporting and Analysis*, McGraw-Hill).

### Earnings Per Share (EPS)

Public companies must report EPS on the face of the income statement (ASC 260):

\`\`\`
Basic EPS = Net Income / Weighted Average Shares Outstanding
\`\`\`

Diluted EPS accounts for stock options, convertible bonds, and other potentially dilutive securities.

### Real-World Example

Microsoft's fiscal year 2023 income statement (10-K Filing, SEC EDGAR) reported:
- Revenue: \\$211.9 billion
- Cost of revenue: \\$65.9 billion
- Gross profit: \\$146.1 billion (69% margin)
- Operating income: \\$88.5 billion (42% margin)
- Net income: \\$72.4 billion

### Common-Size Analysis

A common-size income statement expresses every line item as a percentage of revenue. This allows comparison across companies of different sizes and across time periods. Research by Palepu, Healy & Peek (2019, *Business Analysis and Valuation*, Cengage) demonstrates that common-size analysis reveals structural changes in profitability that absolute numbers may obscure.

### Limitations

The income statement uses accrual accounting — revenue and expenses are recognized when earned or incurred, not when cash changes hands. A company can report strong net income while running out of cash. This is why the cash flow statement (Lesson 3) is essential.

### Key Takeaway

The income statement measures performance over time. It tells you whether a business is profitable, but not whether it has cash. Always analyze it alongside the balance sheet and cash flow statement.

> "Revenue is vanity, profit is sanity, cash is reality." — Common financial proverb

*References: FASB ASC 606 (2014); Revsine et al. (2015), Financial Reporting and Analysis (McGraw-Hill); Palepu, Healy & Peek (2019), Business Analysis and Valuation (Cengage); Microsoft 10-K FY2023, SEC EDGAR.*`,
    },
    {
      id: "acct-statements-balance-sheet",
      slug: "balance-sheet",
      title: "Balance Sheet",
      content: `## The Balance Sheet

The balance sheet (also called the statement of financial position) reports a company's assets, liabilities, and equity **at a specific point in time**. Unlike the income statement, which covers a period, the balance sheet is a snapshot — a photograph of financial position on a single date.

### Structure

The balance sheet is organized around the accounting equation:

\`\`\`
Assets = Liabilities + Stockholders' Equity
\`\`\`

**Assets** are listed in order of liquidity (most liquid first):
- Current Assets: Cash, Short-term investments, Accounts receivable, Inventory, Prepaid expenses
- Non-Current Assets: Property, plant & equipment (net of depreciation), Intangible assets, Goodwill, Long-term investments

**Liabilities** are listed in order of maturity:
- Current Liabilities: Accounts payable, Accrued expenses, Short-term debt, Current portion of long-term debt, Unearned revenue
- Non-Current Liabilities: Long-term debt, Bonds payable, Deferred tax liabilities, Pension obligations

**Stockholders' Equity:**
- Common stock (par value)
- Additional paid-in capital
- Retained earnings
- Accumulated other comprehensive income (AOCI)
- Treasury stock (contra account)

### Classified vs Unclassified

A **classified balance sheet** separates current from non-current items. This distinction is required under both GAAP (ASC 210) and IFRS (IAS 1). The current/non-current boundary is typically one year or the operating cycle, whichever is longer.

### Working Capital

\`\`\`
Working Capital = Current Assets - Current Liabilities
\`\`\`

Positive working capital indicates the company can meet its short-term obligations. Negative working capital is a warning sign — though some industries (like retail) routinely operate with negative working capital due to fast inventory turnover (Berk & DeMarzo, 2020, *Corporate Finance*, Pearson).

### Book Value vs Market Value

The balance sheet reports **book value** — the historical cost of assets minus accumulated depreciation. This often differs dramatically from market value. For example, Apple's balance sheet reports approximately \\$62 billion in equity, while its market capitalization exceeds \\$3 trillion. This gap reflects the value of brand, innovation, and future earnings that historical cost accounting does not capture (Penman, 2013, *Financial Statement Analysis and Security Valuation*, McGraw-Hill).

### Off-Balance-Sheet Items

Not everything of value appears on the balance sheet. Operating leases (before ASC 842), certain derivatives, and contingent liabilities may not be fully reflected. The Enron scandal revealed how off-balance-sheet entities could hide massive liabilities. Post-Enron reforms (Sarbanes-Oxley Act, 2002) and ASC 842 (2016) brought many of these items onto the balance sheet.

### Comparative Balance Sheets

Companies present at least two years of balance sheet data for comparison. Analyzing changes between periods reveals trends in asset growth, debt levels, and capital structure changes.

### Key Takeaway

The balance sheet shows what a company owns and owes at a moment in time. It is the foundation for liquidity analysis, solvency assessment, and understanding the capital structure of a business.

> "The balance sheet is a window into the financial health of a company. But remember — it only shows what the accounting rules allow it to show." — Stephen Penman, Columbia University

*References: FASB ASC 210; IASB IAS 1; Berk & DeMarzo (2020), Corporate Finance (Pearson); Penman (2013), Financial Statement Analysis (McGraw-Hill); Sarbanes-Oxley Act of 2002.*`,
    },
    {
      id: "acct-statements-cash-flow",
      slug: "cash-flow-statement",
      title: "Cash Flow Statement",
      content: `## The Cash Flow Statement

The statement of cash flows reports the actual cash inflows and outflows during an accounting period, classified into three categories: operating, investing, and financing activities. It bridges the gap between accrual-based net income and actual cash generation.

### Why Cash Flow Matters

Accrual accounting can paint a misleading picture. A company might report rising profits while burning through cash — a pattern that preceded the bankruptcy of Enron (2001) and WorldCom (2002). The cash flow statement, required by FASB since 1987 (SFAS 95, now ASC 230), provides a reality check on earnings quality.

Research by Dechow, Ge & Schrand (2010, *Understanding Earnings Quality: A Review of the Proxies*, Journal of Accounting and Economics) found that companies with large gaps between net income and operating cash flow are significantly more likely to have overstated earnings.

### The Three Sections

**1. Operating Activities** — Cash from core business operations.

Includes: cash received from customers, cash paid to suppliers and employees, interest and taxes paid. This is the most important section because it shows whether the business can sustain itself from its core operations.

Two methods are used to prepare this section:
- **Direct method**: Lists actual cash receipts and payments (preferred by FASB but rarely used in practice)
- **Indirect method**: Starts with net income and adjusts for non-cash items and working capital changes (used by ~95% of companies)

**Indirect Method Format:**
\`\`\`
Net Income
+ Depreciation & Amortization
+/- Changes in Working Capital
  - Increase in Accounts Receivable
  + Decrease in Inventory
  + Increase in Accounts Payable
= Cash from Operating Activities
\`\`\`

**2. Investing Activities** — Cash from buying/selling long-term assets.

Includes: purchase of property and equipment (capital expenditures), sale of investments, acquisitions of other businesses. Negative investing cash flow usually indicates a company is investing in growth.

**3. Financing Activities** — Cash from debt and equity transactions.

Includes: issuing stock, borrowing money, repaying debt, paying dividends, buying back shares.

### Free Cash Flow

Free cash flow (FCF) is not on the statement but is derived from it:

\`\`\`
FCF = Operating Cash Flow - Capital Expenditures
\`\`\`

FCF represents the cash available to return to shareholders or reinvest. Warren Buffett considers owner earnings (similar to FCF) the single most important measure of a company's value (Buffett, 1986, Berkshire Hathaway Annual Letter).

### Real-World Example

Amazon's 2023 cash flow statement (10-K, SEC EDGAR):
- Operating cash flow: \\$84.9 billion
- Capital expenditures: -\\$48.4 billion
- Free cash flow: \\$36.5 billion

Despite sometimes reporting thin net income margins, Amazon has consistently generated massive operating cash flow — demonstrating why cash flow analysis is essential.

### Cash Flow Patterns

| Pattern | Operating | Investing | Financing | Interpretation |
|---------|-----------|-----------|-----------|----------------|
| Growth company | + | - | + | Profitable, investing, raising capital |
| Mature company | + | - | - | Profitable, investing, returning cash |
| Declining company | - | + | - | Selling assets to pay debt |

### Key Takeaway

The cash flow statement reveals the truth that the income statement and balance sheet cannot: how much actual cash a business generates. It is indispensable for assessing liquidity, solvency, and the sustainability of earnings.

> "Cash flow is a fact. Profit is an opinion." — Alfred Rappaport

*References: FASB ASC 230; Dechow, Ge & Schrand (2010), Journal of Accounting and Economics; Buffett (1986), Berkshire Hathaway Annual Letter; Amazon 10-K FY2023, SEC EDGAR.*`,
    },
    {
      id: "acct-statements-stockholders-equity",
      slug: "statement-of-stockholders-equity",
      title: "Statement of Stockholders' Equity",
      content: `## Statement of Stockholders' Equity

The statement of stockholders' equity (also called the statement of changes in equity) explains all changes in each equity component during the accounting period. It provides the bridge between the income statement (which feeds retained earnings) and the equity section of the balance sheet.

### Why a Separate Statement?

The balance sheet shows equity at a point in time, but it does not explain *how* it changed. Multiple events can increase or decrease equity during a period: net income, dividends, stock issuances, share repurchases, and other comprehensive income items. This statement disaggregates those changes (FASB ASC 505; IASB IAS 1).

### Structure

The statement typically has columns for each equity component and rows for each type of change:

| | Common Stock | APIC | Retained Earnings | AOCI | Treasury Stock | Total Equity |
|---|---|---|---|---|---|---|
| Beginning Balance | \\$100 | \\$500 | \\$800 | \\$20 | (\\$50) | \\$1,370 |
| Net Income | | | +\\$200 | | | +\\$200 |
| Dividends | | | -\\$60 | | | -\\$60 |
| Stock Issued | +\\$10 | +\\$90 | | | | +\\$100 |
| Share Repurchase | | | | | -\\$30 | -\\$30 |
| Other Comprehensive Income | | | | +\\$15 | | +\\$15 |
| **Ending Balance** | **\\$110** | **\\$590** | **\\$940** | **\\$35** | **(\\$80)** | **\\$1,595** |

### Key Components Explained

**Common Stock and Additional Paid-In Capital (APIC):** When a company issues stock, it records the par value in Common Stock and the excess in APIC. For example, issuing 1,000 shares with \\$1 par value at \\$100 per share creates \\$1,000 in Common Stock and \\$99,000 in APIC.

**Retained Earnings:** The cumulative net income earned since the company's inception, minus all dividends declared. The retained earnings formula is:

\`\`\`
Ending RE = Beginning RE + Net Income - Dividends
\`\`\`

**Accumulated Other Comprehensive Income (AOCI):** Includes gains and losses that bypass the income statement under GAAP, such as unrealized gains/losses on available-for-sale securities, foreign currency translation adjustments, and pension adjustments (ASC 220). These items are considered "comprehensive" income — they affect equity but are not part of net income.

**Treasury Stock:** Shares repurchased by the company. Reported as a negative (contra) equity item. Companies buy back shares to return cash to shareholders, reduce dilution, or signal confidence. In 2023, S&P 500 companies spent over \\$795 billion on share repurchases (S&P Dow Jones Indices, 2024).

### Comprehensive Income

Total comprehensive income = Net Income + Other Comprehensive Income (OCI). FASB requires companies to report comprehensive income either as a separate statement or as a combined statement with the income statement (ASC 220).

### What Analysts Look For

1. **Consistency of retained earnings growth** — indicates sustainable profitability
2. **Dividend payout ratio** — dividends / net income; reveals distribution policy
3. **Share repurchase activity** — reducing shares outstanding boosts EPS
4. **AOCI volatility** — large swings may indicate currency or investment risk

Research by Dhaliwal, Subramanyam & Trezevant (1999, *Is Comprehensive Income Superior to Net Income?*, Journal of Accounting and Economics) found that comprehensive income components have incremental predictive power for future cash flows beyond net income alone.

### Connecting to Other Statements

The statement of stockholders' equity is the **linking mechanism** between the income statement and the balance sheet:

- Net income flows from the income statement → Retained Earnings column
- Ending equity balances flow to the balance sheet equity section
- Dividends paid appear on the cash flow statement (financing activities)

### Key Takeaway

The statement of stockholders' equity explains every change to the ownership interest in a company. It reveals dividend policy, capital structure decisions, and comprehensive income items that the income statement alone cannot show.

> "Retained earnings is the memory of the income statement — it records every dollar of profit the company has ever earned and not returned to shareholders." — Charles T. Horngren

*References: FASB ASC 505, ASC 220; Dhaliwal, Subramanyam & Trezevant (1999), Journal of Accounting and Economics; S&P Dow Jones Indices (2024), Quarterly Buyback Report.*`,
    },
    {
      id: "acct-statements-connections",
      slug: "how-statements-connect",
      title: "How the Financial Statements Connect",
      content: `## How the Financial Statements Connect

The four financial statements are not independent documents — they form an integrated system where information flows from one statement to the next. Understanding these connections is critical for financial analysis and detecting reporting errors.

### The Flow of Information

The statements are prepared in a specific order because each depends on the previous one:

\`\`\`
Income Statement
    ↓ (Net Income)
Statement of Stockholders' Equity
    ↓ (Ending Equity balances)
Balance Sheet
    ↓ (Beginning & Ending balances)
Cash Flow Statement
\`\`\`

### Connection 1: Income Statement → Statement of Stockholders' Equity

Net income from the income statement flows directly into the Retained Earnings column of the stockholders' equity statement. This is the first and most important link. If net income is \\$500,000 and dividends declared are \\$100,000, retained earnings increases by \\$400,000.

### Connection 2: Stockholders' Equity Statement → Balance Sheet

The ending balances of all equity components (common stock, APIC, retained earnings, AOCI, treasury stock) become the equity section of the balance sheet. The balance sheet equity must exactly match the totals from the equity statement.

### Connection 3: Income Statement → Cash Flow Statement (Indirect Method)

The cash flow statement begins with net income from the income statement and adjusts it for non-cash items to arrive at operating cash flow. Non-cash items include:

- **Depreciation and amortization** — added back (expense that reduced net income but involved no cash outflow)
- **Gains/losses on asset sales** — removed from operating and reclassified to investing
- **Changes in working capital** — adjustments for timing differences between accrual recognition and cash receipt/payment

### Connection 4: Cash Flow Statement → Balance Sheet

The ending cash balance on the cash flow statement must equal the cash balance on the balance sheet. This is a fundamental check:

\`\`\`
Beginning Cash + Net Change in Cash = Ending Cash (Balance Sheet)
\`\`\`

### Connection 5: Balance Sheet Changes → Cash Flow Statement

Every change in a balance sheet account (other than cash) appears somewhere on the cash flow statement:

| Balance Sheet Change | Cash Flow Section |
|---------------------|-------------------|
| Increase in Accounts Receivable | Operating (subtracted) |
| Decrease in Inventory | Operating (added) |
| Purchase of Equipment | Investing (outflow) |
| Issuance of Long-term Debt | Financing (inflow) |
| Payment of Dividends | Financing (outflow) |

### The Articulation Framework

Accounting scholars use the term **articulation** to describe how financial statements interlock. Ohlson (1995, *Earnings, Book Values, and Dividends in Equity Valuation*, Contemporary Accounting Research) formalized the "clean surplus relation":

\`\`\`
Ending Book Value = Beginning Book Value + Net Income - Dividends + Other Comprehensive Income
\`\`\`

This equation ensures that all changes in equity are accounted for through either the income statement or other comprehensive income. Violations of this relation indicate reporting errors or aggressive accounting.

### Practical Verification

When analyzing financial statements, use these cross-checks:

1. **Net income on the income statement = net income on the equity statement = starting figure on the cash flow statement (indirect method)**
2. **Ending retained earnings on the equity statement = retained earnings on the balance sheet**
3. **Ending cash on the cash flow statement = cash on the balance sheet**
4. **Total assets = total liabilities + total equity on the balance sheet**

If any of these checks fail, there is an error in the financials.

### Why Integration Matters

A study by Sloan (1996, *Do Stock Prices Fully Reflect Information in Accruals and Cash Flows?*, The Accounting Review) demonstrated that investors who analyze statements in isolation — particularly those who focus only on net income without examining cash flows — make systematically worse investment decisions. The accrual anomaly he documented shows that high-accrual firms (large gap between income and cash flow) tend to underperform, suggesting the market initially overvalues accrual-based earnings.

### Key Takeaway

Financial statements are a system, not a collection. Each statement answers a different question, but only by understanding how they connect can you form a complete picture of a company's financial health. The ability to trace a transaction through all four statements is the hallmark of accounting literacy.

> "Financial statements are like a jigsaw puzzle. Each piece tells part of the story, but only when assembled together do you see the full picture." — Stephen Penman, Columbia University

*References: Ohlson (1995), Contemporary Accounting Research; Sloan (1996), The Accounting Review; Penman (2013), Financial Statement Analysis (McGraw-Hill).*`,
    },
  ],
};
