import { Module } from "../types";

export const introModule: Module = {
  id: "acct-intro",
  title: "Introduction to Accounting",
  description:
    "Explore the language of business — what accounting is, the fundamental equation, double-entry bookkeeping, account types, and the full accounting cycle. Resources: Weygandt et al. Financial Accounting, FASB Conceptual Framework, Khan Academy Accounting.",
  lessons: [
    {
      id: "acct-intro-what-is-accounting",
      slug: "what-is-accounting",
      title: "What is Accounting?",
      content: `## What is Accounting?

Accounting is the systematic process of recording, classifying, summarizing, and interpreting financial transactions to provide useful information for decision-making. Often called the "language of business," accounting enables stakeholders — investors, creditors, managers, and regulators — to understand an organization's financial health.

### A Brief History

Accounting traces its roots to ancient Mesopotamia, where clay tablets recorded grain inventories around 3000 BCE. The modern system of double-entry bookkeeping was formalized by Luca Pacioli in his 1494 treatise *Summa de Arithmetica*. Pacioli did not invent the method — Venetian merchants had used it for decades — but his codification earned him the title "Father of Accounting" (Sangster, 2010, *Accounting History*).

### The Purpose of Accounting

The Financial Accounting Standards Board (FASB) states that the primary objective of financial reporting is to provide information that is "useful to present and potential investors, creditors, and other users in making rational investment, credit, and similar decisions" (FASB Statement of Financial Accounting Concepts No. 8, 2010).

Accounting serves three main functions:

| Function | Description | Primary Users |
|----------|-------------|---------------|
| **Scorekeeping** | Recording all financial transactions | Internal managers |
| **Attention-directing** | Highlighting problems and opportunities | Management, auditors |
| **Problem-solving** | Providing data for specific decisions | Analysts, investors |

### Types of Accounting

**Financial Accounting** focuses on preparing reports for external users — shareholders, regulators, and creditors. These reports follow standardized rules such as Generally Accepted Accounting Principles (GAAP) in the United States or International Financial Reporting Standards (IFRS) globally.

**Managerial (Management) Accounting** provides information to internal decision-makers. It is forward-looking and not bound by GAAP. Topics include budgeting, cost analysis, and performance evaluation, which we cover in Module 6.

**Tax Accounting** deals with compliance with tax laws and regulations. Tax rules often differ from GAAP, creating a separate discipline focused on minimizing tax liability within legal boundaries.

**Auditing** involves the independent examination of financial statements to ensure accuracy and compliance. We explore auditing in Module 7.

### The Role of Accountants in the Modern Economy

According to the Bureau of Labor Statistics (2024), there are approximately 1.6 million accountants and auditors employed in the United States. The profession is projected to grow 4% through 2032. The rise of automation and AI has shifted the accountant's role from manual bookkeeping toward strategic analysis and advisory services (Frey & Osborne, 2017, *The Future of Employment*, Oxford Martin Programme).

### Accounting Standards and Regulation

The accounting profession is governed by several bodies:

- **FASB** (Financial Accounting Standards Board) — sets U.S. GAAP
- **IASB** (International Accounting Standards Board) — sets IFRS, used in over 140 countries
- **SEC** (Securities and Exchange Commission) — enforces disclosure requirements for public companies
- **AICPA** (American Institute of CPAs) — sets auditing standards and the CPA exam

### Why Accounting Matters for Everyone

Whether you plan to become an accountant, start a business, or simply manage your personal finances, understanding accounting gives you the ability to read financial statements, detect red flags, evaluate investment opportunities, and communicate effectively with financial professionals.

As Warren Buffett once stated: "Accounting is the language of business, and you have to be as good at it as you are at your mother tongue to really evaluate businesses."

### Key Takeaway

Accounting is far more than bookkeeping. It is a comprehensive information system that captures economic events, processes them into financial reports, and communicates insights to stakeholders who depend on accurate data for critical decisions.

> "The objective of general purpose financial reporting is to provide financial information about the reporting entity that is useful to existing and potential investors, lenders, and other creditors." — FASB Conceptual Framework, 2010

*References: Weygandt, Kimmel & Kieso, Financial Accounting (Wiley); FASB Concepts Statement No. 8; Sangster (2010), Accounting History; BLS Occupational Outlook Handbook 2024.*`,
    },
    {
      id: "acct-intro-accounting-equation",
      slug: "the-accounting-equation",
      title: "The Accounting Equation (A = L + E)",
      content: `## The Accounting Equation: Assets = Liabilities + Equity

The accounting equation is the foundation of the entire double-entry bookkeeping system. Every financial transaction a business records must satisfy this equation. If it does not balance, an error has occurred.

### The Equation

\`\`\`
Assets = Liabilities + Owners' Equity
\`\`\`

Or equivalently:

\`\`\`
A = L + E
\`\`\`

This equation states that everything a company **owns** (assets) is financed either by what it **owes** (liabilities) or by what the **owners have invested** (equity). It must always balance — this is not a rule of thumb but a mathematical identity (Horngren et al., 2012, *Accounting*, Pearson).

### Defining the Components

**Assets** are resources controlled by the entity as a result of past events, from which future economic benefits are expected to flow. Examples include cash, accounts receivable, inventory, equipment, and patents.

**Liabilities** are present obligations arising from past events, the settlement of which is expected to result in an outflow of resources. Examples include accounts payable, loans, bonds payable, and unearned revenue.

**Owners' Equity** (also called stockholders' equity or net assets) represents the residual interest in the assets after deducting liabilities. It includes contributed capital (stock issued) and retained earnings (accumulated profits not distributed as dividends).

### Expanded Equation

The accounting equation can be expanded to show the components of equity:

\`\`\`
Assets = Liabilities + Contributed Capital + Retained Earnings
\`\`\`

Since Retained Earnings = Beginning RE + Revenue - Expenses - Dividends:

\`\`\`
Assets = Liabilities + Contributed Capital + Beginning RE + Revenue - Expenses - Dividends
\`\`\`

This expanded form shows how every income statement item ultimately flows into the balance sheet (Stickney et al., 2010, *Financial Accounting: An Introduction to Concepts, Methods, and Uses*, Cengage).

### Transaction Analysis

Every transaction affects at least two accounts while keeping the equation in balance. Consider these examples for a new company:

| Transaction | Assets | = | Liabilities | + | Equity |
|------------|--------|---|-------------|---|--------|
| Owner invests \\\$50,000 cash | +\\\$50,000 (Cash) | | | | +\\\$50,000 (Common Stock) |
| Borrows \\\$20,000 from bank | +\\\$20,000 (Cash) | | +\\\$20,000 (Notes Payable) | | |
| Buys equipment for \\\$15,000 cash | -\\\$15,000 (Cash), +\\\$15,000 (Equipment) | | | | |
| Earns \\\$8,000 revenue on account | +\\\$8,000 (Accounts Receivable) | | | | +\\\$8,000 (Revenue) |
| Pays \\\$3,000 rent expense | -\\\$3,000 (Cash) | | | | -\\\$3,000 (Expense) |

After all five transactions: Assets = \\\$75,000, Liabilities = \\\$20,000, Equity = \\\$55,000. The equation balances: \\\$75,000 = \\\$20,000 + \\\$55,000.

### Why the Equation Always Balances

The accounting equation is not an empirical observation — it is a definitional identity. Equity is *defined* as Assets minus Liabilities. Therefore A = L + E is true by construction. The practical importance is that if your books do not balance, you have made a recording error (Wolk, Dodd & Rozycki, 2017, *Accounting Theory*, Sage).

### Real-World Scale

Apple Inc.'s balance sheet as of September 2023 reported total assets of \\\$352.6 billion, total liabilities of \\\$290.4 billion, and stockholders' equity of \\\$62.1 billion. The equation holds: \\\$352.6B = \\\$290.4B + \\\$62.1B (Apple 10-K Filing, SEC EDGAR).

### Key Takeaway

The accounting equation is the DNA of accounting. Every journal entry, every financial statement, and every audit ultimately traces back to the requirement that assets equal liabilities plus equity.

> "The balance sheet is a snapshot of the accounting equation at a point in time." — Horngren, Sundem & Elliott, Introduction to Financial Accounting

*References: Horngren et al. (2012), Accounting (Pearson); Stickney et al. (2010), Financial Accounting (Cengage); Apple Inc. 10-K Annual Report, FY2023, SEC EDGAR.*`,
    },
    {
      id: "acct-intro-double-entry",
      slug: "double-entry-bookkeeping",
      title: "Double-Entry Bookkeeping",
      content: `## Double-Entry Bookkeeping

Double-entry bookkeeping is the recording system in which every financial transaction is entered in at least two accounts — a debit in one and a credit in another. This mechanism ensures the accounting equation always remains in balance and provides a built-in error-detection system.

### Historical Origins

As mentioned earlier, Luca Pacioli documented double-entry bookkeeping in 1494, but evidence suggests Florentine and Venetian merchants used the system as early as the 13th century. The Medici Bank's ledgers from the 1400s are among the earliest surviving examples of systematic double-entry records (de Roover, 1963, *The Rise and Decline of the Medici Bank*, Harvard University Press).

### The Core Principle

For every transaction, the total debits must equal the total credits. This is not merely a convention — it is the operational expression of the accounting equation. When you increase one side of the equation, you must increase the other side or decrease the same side by an equal amount.

### Debit and Credit Rules

The terms "debit" (left side) and "credit" (right side) do not mean "good" or "bad." They are simply directional indicators:

| Account Type | Increase | Decrease | Normal Balance |
|-------------|----------|----------|----------------|
| **Assets** | Debit | Credit | Debit |
| **Liabilities** | Credit | Debit | Credit |
| **Equity** | Credit | Debit | Credit |
| **Revenue** | Credit | Debit | Credit |
| **Expenses** | Debit | Credit | Debit |

The mnemonic **DEALER** helps: Dividends, Expenses, Assets are increased by Debits; Liabilities, Equity, Revenue are increased by Credits.

### Example: Recording a Sale

Suppose a company sells \\\$5,000 of merchandise on credit (cost of goods: \\\$3,000).

**Entry 1 — Record the sale:**

| Account | Debit | Credit |
|---------|-------|--------|
| Accounts Receivable | \\\$5,000 | |
| Sales Revenue | | \\\$5,000 |

**Entry 2 — Record cost of goods sold:**

| Account | Debit | Credit |
|---------|-------|--------|
| Cost of Goods Sold | \\\$3,000 | |
| Inventory | | \\\$3,000 |

Total debits = \\\$8,000. Total credits = \\\$8,000. The equation balances.

### Single-Entry vs Double-Entry

Single-entry bookkeeping — essentially a checkbook register — tracks only cash inflows and outflows. It is simpler but dangerous for any business beyond a sole proprietorship because it cannot track receivables, payables, or accrued items. A study by the World Bank found that small businesses adopting double-entry systems showed 15-20% improvement in financial management outcomes compared to those using single-entry methods (World Bank Development Report, 2019).

### The Ledger System

Double-entry bookkeeping uses several books:

1. **Journal** (book of original entry) — transactions recorded chronologically
2. **General Ledger** — all accounts organized by category
3. **Subsidiary Ledgers** — detailed breakdowns (e.g., individual customer accounts within Accounts Receivable)

The process flows: Source Documents → Journal → Ledger → Trial Balance → Financial Statements.

### Why It Endures

Despite 500+ years of evolution in accounting technology — from quill pens to cloud-based ERP systems — the fundamental logic of double-entry bookkeeping has never been replaced. It remains the global standard because of its mathematical elegance and built-in self-checking mechanism (Ijiri, 1967, *The Foundations of Accounting Measurement*, Prentice-Hall).

### Key Takeaway

Double-entry bookkeeping is the engine of modern accounting. By requiring equal debits and credits for every transaction, it ensures the accounting equation stays balanced and provides a systematic method for tracking the full economic impact of business activities.

> "There is no substitute for double-entry bookkeeping. Every attempt to replace it has failed." — Yuji Ijiri, Carnegie Mellon University

*References: de Roover (1963), The Rise and Decline of the Medici Bank (Harvard); Ijiri (1967), Foundations of Accounting Measurement (Prentice-Hall); World Bank Development Report 2019.*`,
    },
    {
      id: "acct-intro-types-of-accounts",
      slug: "types-of-accounts",
      title: "Types of Accounts",
      content: `## Types of Accounts

In accounting, every transaction is classified into specific account types. Understanding these categories is essential for recording transactions correctly, preparing financial statements, and analyzing business performance.

### The Five Major Account Types

All accounts fall into five categories, directly tied to the accounting equation and the financial statements:

**1. Asset Accounts**

Assets represent what a company owns or controls. They are classified by liquidity — how quickly they can be converted to cash.

| Classification | Examples | Timeframe |
|---------------|----------|-----------|
| **Current Assets** | Cash, Accounts Receivable, Inventory, Prepaid Expenses | Converted within 1 year |
| **Non-Current Assets** | Property, Plant & Equipment (PP&E), Intangible Assets, Long-term Investments | Held longer than 1 year |

The distinction matters for financial analysis. The International Accounting Standards Board (IAS 1) requires separate classification of current and non-current assets on the balance sheet to help users assess liquidity (IASB, IAS 1 Presentation of Financial Statements, 2007).

**2. Liability Accounts**

Liabilities represent what a company owes to external parties.

| Classification | Examples | Due Date |
|---------------|----------|----------|
| **Current Liabilities** | Accounts Payable, Short-term Loans, Accrued Expenses, Unearned Revenue | Due within 1 year |
| **Non-Current Liabilities** | Long-term Debt, Bonds Payable, Lease Obligations, Pension Liabilities | Due after 1 year |

**3. Equity Accounts**

Equity represents the owners' residual claim on assets after liabilities are settled.

- **Common Stock** — par value of shares issued
- **Additional Paid-In Capital** — amount paid above par value
- **Retained Earnings** — accumulated net income not distributed as dividends
- **Treasury Stock** — shares repurchased by the company (a contra-equity account)

**4. Revenue Accounts**

Revenue represents inflows from the entity's ordinary activities. Under ASC 606 (Revenue from Contracts with Customers), revenue is recognized when a performance obligation is satisfied — that is, when control of a good or service transfers to the customer (FASB ASC 606, 2014).

- **Sales Revenue** — from selling goods
- **Service Revenue** — from providing services
- **Interest Revenue** — from lending money
- **Rental Revenue** — from leasing property

**5. Expense Accounts**

Expenses represent outflows or consumption of assets in generating revenue. The matching principle requires that expenses be recorded in the same period as the revenue they help generate (Paton & Littleton, 1940, *An Introduction to Corporate Accounting Standards*, AAA).

- **Cost of Goods Sold (COGS)** — direct cost of inventory sold
- **Salaries Expense** — employee compensation
- **Rent Expense** — facility costs
- **Depreciation Expense** — allocation of asset cost over useful life
- **Interest Expense** — cost of borrowing

### Contra Accounts

Contra accounts are paired with a related account and carry an opposite normal balance. They provide additional detail without altering the main account:

| Contra Account | Related Account | Purpose |
|---------------|----------------|---------|
| Accumulated Depreciation | PP&E (Asset) | Shows total depreciation taken |
| Allowance for Doubtful Accounts | Accounts Receivable (Asset) | Estimates uncollectible receivables |
| Sales Returns & Allowances | Sales Revenue | Tracks returned merchandise |

### The Chart of Accounts

A chart of accounts is the organized listing of all accounts used by a business, typically numbered for easy reference:

- **1000-1999** — Assets
- **2000-2999** — Liabilities
- **3000-3999** — Equity
- **4000-4999** — Revenue
- **5000-5999** — Expenses

Research by Bragg (2018, *The New Controller Guidebook*, AccountingTools) found that companies with well-structured charts of accounts reduce month-end closing time by an average of 30%.

### Key Takeaway

The five account types — assets, liabilities, equity, revenue, and expenses — form the complete vocabulary of accounting. Every transaction affects at least two of these accounts. Mastering their classification is the prerequisite for recording journal entries, which we cover next.

*References: IASB IAS 1 (2007); FASB ASC 606 (2014); Paton & Littleton (1940), An Introduction to Corporate Accounting Standards (AAA); Bragg (2018), The New Controller Guidebook.*`,
    },
    {
      id: "acct-intro-accounting-cycle",
      slug: "the-accounting-cycle",
      title: "The Accounting Cycle",
      content: `## The Accounting Cycle

The accounting cycle is the complete sequence of steps a business follows to record, process, and report financial information during an accounting period. It transforms raw transactions into polished financial statements.

### The Nine Steps

The accounting cycle consists of nine sequential steps, repeated every accounting period (monthly, quarterly, or annually):

| Step | Action | Frequency |
|------|--------|-----------|
| 1 | **Identify and analyze transactions** | As they occur |
| 2 | **Record in the journal** (journalizing) | As they occur |
| 3 | **Post to the general ledger** | Periodically |
| 4 | **Prepare an unadjusted trial balance** | End of period |
| 5 | **Record adjusting entries** | End of period |
| 6 | **Prepare an adjusted trial balance** | End of period |
| 7 | **Prepare financial statements** | End of period |
| 8 | **Record closing entries** | End of period |
| 9 | **Prepare a post-closing trial balance** | End of period |

This framework was standardized in early 20th-century accounting textbooks and remains the universal process used by organizations worldwide (Needles & Powers, 2013, *Principles of Financial Accounting*, Cengage).

### Step 1: Identify and Analyze Transactions

Not every business event is a transaction. An accounting transaction must be measurable in monetary terms and affect the financial position of the entity. Source documents — invoices, receipts, bank statements, contracts — provide evidence that a transaction occurred.

### Step 2: Journalizing

Each transaction is recorded as a journal entry in chronological order. The journal entry includes the date, accounts affected, amounts debited and credited, and a brief description.

### Step 3: Posting to the Ledger

Journal entries are transferred (posted) to the general ledger, where each account has its own page or section. This organizes transactions by account rather than by date.

### Step 4: Unadjusted Trial Balance

At period-end, all ledger account balances are listed to verify that total debits equal total credits. If they do not, errors must be found and corrected before proceeding. A balanced trial balance does not guarantee error-free books — transposition errors, omitted transactions, or entries to wrong accounts can still exist.

### Step 5: Adjusting Entries

Adjusting entries ensure that revenue and expenses are recognized in the correct period, following the accrual basis of accounting. The four types of adjustments are:

1. **Prepaid expenses** (deferrals) — assets that become expenses over time (e.g., prepaid rent)
2. **Unearned revenue** (deferrals) — liabilities that become revenue as service is delivered
3. **Accrued expenses** — expenses incurred but not yet paid (e.g., wages payable)
4. **Accrued revenue** — revenue earned but not yet received (e.g., interest receivable)

The matching principle and revenue recognition principle (ASC 606) govern when these adjustments are made (FASB, 2014).

### Step 6: Adjusted Trial Balance

After posting adjusting entries, a new trial balance is prepared. This adjusted trial balance serves as the direct source for preparing financial statements.

### Step 7: Financial Statements

From the adjusted trial balance, four financial statements are prepared in this order:

1. **Income Statement** — revenues and expenses for the period
2. **Statement of Retained Earnings** — changes in retained earnings
3. **Balance Sheet** — assets, liabilities, and equity at period-end
4. **Cash Flow Statement** — cash inflows and outflows

### Step 8: Closing Entries

Temporary accounts (revenue, expenses, dividends) are closed — their balances are transferred to Retained Earnings. This resets them to zero for the next period. Only temporary accounts are closed; permanent accounts (assets, liabilities, equity) carry their balances forward.

### Step 9: Post-Closing Trial Balance

A final trial balance verifies that only permanent accounts remain with balances and that debits still equal credits.

### Technology and the Accounting Cycle

Modern accounting software (QuickBooks, Xero, SAP) automates Steps 3, 4, 6, and 9. However, Steps 1, 2, 5, 7, and 8 still require professional judgment. A survey by the Association of Chartered Certified Accountants (ACCA, 2020) found that 85% of routine bookkeeping tasks can be automated, but adjusting entries and financial statement analysis remain largely human-driven.

### Key Takeaway

The accounting cycle is the backbone of financial reporting. By following its nine steps systematically, businesses produce reliable financial statements that stakeholders can trust. Understanding this cycle is essential before diving into the details of journal entries and financial statements.

> "The accounting cycle converts economic events into the financial information that drives business decisions." — Needles & Powers, Principles of Financial Accounting

*References: Needles & Powers (2013), Principles of Financial Accounting (Cengage); FASB ASC 606 (2014); ACCA (2020), Digital Accountancy Forum Report.*`,
    },
  ],
};
