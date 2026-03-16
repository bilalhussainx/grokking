import { Module } from "../types";

export const journalEntriesModule: Module = {
  id: "acct-journal",
  title: "Journal Entries & the Recording Process",
  description:
    "Master the mechanics of recording business transactions — T-accounts, debits and credits, adjusting entries, closing entries, and the trial balance. Resources: Horngren et al. Accounting, Weygandt Financial Accounting, FASB Codification.",
  lessons: [
    {
      id: "acct-journal-debits-credits",
      slug: "debits-and-credits",
      title: "Debits & Credits (T-Accounts)",
      content: `## Debits & Credits and T-Accounts

The T-account is the visual tool accountants use to analyze how transactions affect individual accounts. Named for its T-shape, it divides each account into a debit (left) side and a credit (right) side.

### The T-Account Structure

\`\`\`
        Account Name
    ┌─────────┬─────────┐
    │  Debit  │ Credit  │
    │  (Left) │ (Right) │
    └─────────┴─────────┘
\`\`\`

### Normal Balances Revisited

Every account has a "normal balance" — the side on which increases are recorded:

| Account Type | Normal Balance | Increased By | Decreased By |
|-------------|---------------|--------------|--------------|
| Assets | Debit | Debit | Credit |
| Liabilities | Credit | Credit | Debit |
| Equity | Credit | Credit | Debit |
| Revenue | Credit | Credit | Debit |
| Expenses | Debit | Debit | Credit |
| Dividends | Debit | Debit | Credit |

The logic follows from the accounting equation. Assets are on the left side of the equation, so they have left (debit) normal balances. Liabilities and equity are on the right side, so they have right (credit) normal balances. Revenue increases equity (credit), while expenses and dividends decrease equity (debit) (Horngren, Sundem & Elliott, 2014, *Introduction to Financial Accounting*, Pearson).

### Working Through a T-Account Example

Let us trace cash transactions for a startup's first month:

\`\`\`
                Cash
    ┌─────────────┬─────────────┐
    │ (1) 50,000  │ (3) 12,000  │
    │ (5)  8,000  │ (4)  2,500  │
    │             │ (6)  1,800  │
    ├─────────────┼─────────────┤
    │ Bal: 41,700 │             │
    └─────────────┴─────────────┘
\`\`\`

Transactions: (1) Owner invests \\\$50,000; (3) Buys equipment \\\$12,000; (4) Pays rent \\\$2,500; (5) Receives \\\$8,000 cash from clients; (6) Pays utilities \\\$1,800.

Debit total: \\\$58,000. Credit total: \\\$16,300. Balance: \\\$41,700 (debit — normal for an asset).

### Multiple Account Analysis

For transaction (1), both accounts are affected:

\`\`\`
          Cash                    Common Stock
    ┌──────────┬──────┐     ┌──────┬──────────┐
    │ 50,000   │      │     │      │  50,000  │
    └──────────┴──────┘     └──────┴──────────┘
\`\`\`

Cash (asset) is debited; Common Stock (equity) is credited. The accounting equation stays balanced.

### Common Errors and How to Catch Them

**Transposition errors**: Writing \\\$5,400 instead of \\\$4,500. The difference is always divisible by 9.

**Slide errors**: Writing \\\$450 instead of \\\$4,500. The difference is divisible by 9 as well.

**One-sided entries**: Recording only the debit or credit. The trial balance will not balance.

Research by Treadway Commission (COSO, 2013, *Internal Control — Integrated Framework*) found that approximately 26% of financial restatements involve basic recording errors that T-account analysis would have caught.

### Compound Entries

Some transactions affect more than two accounts. For example, purchasing \\\$10,000 of equipment with \\\$4,000 cash and a \\\$6,000 note payable:

\`\`\`
    Equipment          Cash           Notes Payable
    ┌───────┬───┐  ┌───┬───────┐  ┌───┬───────┐
    │10,000 │   │  │   │ 4,000 │  │   │ 6,000 │
    └───────┴───┘  └───┴───────┘  └───┴───────┘
\`\`\`

Total debits (\\\$10,000) = Total credits (\\\$4,000 + \\\$6,000). Even compound entries must balance.

### Key Takeaway

T-accounts are the accountant's workbench. They provide a visual method for analyzing how each transaction affects the accounting equation. Mastering T-accounts is the prerequisite for recording formal journal entries.

> "The T-account is to the accountant what the free body diagram is to the engineer — a tool for making the invisible visible." — Horngren et al.

*References: Horngren, Sundem & Elliott (2014), Introduction to Financial Accounting (Pearson); COSO (2013), Internal Control — Integrated Framework; Weygandt, Kimmel & Kieso, Financial Accounting (Wiley).*`,
    },
    {
      id: "acct-journal-recording-transactions",
      slug: "recording-transactions",
      title: "Recording Transactions",
      content: `## Recording Transactions

A journal entry is the formal record of a business transaction in the accounting system. It is the first step in converting an economic event into financial information. Every journal entry must include a date, accounts affected, amounts, and a brief narration.

### The General Journal Format

\`\`\`
Date    Account Title                    Debit    Credit
────────────────────────────────────────────────────────
Jan 5   Accounts Receivable              8,000
            Sales Revenue                          8,000
        (Sold services on credit to Client A)
\`\`\`

**Conventions:**
- The debited account is listed first, flush left
- The credited account is indented
- A brief narration (memo) describes the transaction
- Dollar signs are omitted in journal entries

### Source Documents

Every journal entry must be supported by a source document — objective evidence that a transaction occurred:

| Source Document | Transaction Type |
|----------------|-----------------|
| Sales invoice | Revenue earned |
| Purchase order / vendor invoice | Expense incurred |
| Bank statement | Cash received or paid |
| Payroll records | Wages expense |
| Loan agreement | Borrowing |
| Board resolution | Dividend declaration |

The Sarbanes-Oxley Act (2002, Section 802) makes it a federal crime to alter, destroy, or falsify source documents with intent to obstruct an investigation.

### Common Transaction Types and Their Entries

**1. Cash Sale:**
\`\`\`
    Cash                    5,000
        Sales Revenue                   5,000
\`\`\`

**2. Sale on Credit:**
\`\`\`
    Accounts Receivable     5,000
        Sales Revenue                   5,000
\`\`\`

**3. Collecting a Receivable:**
\`\`\`
    Cash                    5,000
        Accounts Receivable             5,000
\`\`\`

**4. Paying Rent:**
\`\`\`
    Rent Expense            3,000
        Cash                            3,000
\`\`\`

**5. Purchasing Inventory on Credit:**
\`\`\`
    Inventory              10,000
        Accounts Payable               10,000
\`\`\`

**6. Paying Salaries:**
\`\`\`
    Salaries Expense        7,500
        Cash                            7,500
\`\`\`

**7. Borrowing from a Bank:**
\`\`\`
    Cash                   50,000
        Notes Payable                  50,000
\`\`\`

### The Posting Process

After journal entries are recorded, they are **posted** to the general ledger — transferred from the journal (organized by date) to the ledger (organized by account). Modern accounting software does this automatically, but understanding the flow is essential for interpreting the books.

Journal → General Ledger → Subsidiary Ledgers

### Special Journals

High-volume businesses use **special journals** to reduce recording effort:

- **Sales Journal** — credit sales only
- **Purchases Journal** — credit purchases only
- **Cash Receipts Journal** — all cash inflows
- **Cash Disbursements Journal** — all cash outflows

Only transactions that do not fit these categories go in the general journal. Research by Romney & Steinbart (2018, *Accounting Information Systems*, Pearson) found that special journals can reduce recording time by 40-60% in high-transaction businesses.

### Key Takeaway

Journal entries are the atomic unit of accounting. Every financial event starts as a journal entry. Accuracy at this stage determines the integrity of every financial statement that follows.

> "A journal entry is a promise that the accounting equation will be maintained." — Weygandt, Kimmel & Kieso

*References: Sarbanes-Oxley Act of 2002; Romney & Steinbart (2018), Accounting Information Systems (Pearson); Weygandt, Kimmel & Kieso, Financial Accounting (Wiley).*`,
    },
    {
      id: "acct-journal-adjusting-entries",
      slug: "adjusting-entries",
      title: "Adjusting Entries",
      content: `## Adjusting Entries

Adjusting entries are journal entries made at the end of an accounting period to ensure that revenues and expenses are recognized in the correct period. They are the mechanism that converts cash-basis records into accrual-basis financial statements.

### Why Adjustments Are Necessary

Under accrual accounting (required by GAAP and IFRS), revenue is recognized when earned and expenses when incurred — regardless of when cash changes hands. Many economic events span multiple periods, creating timing differences that adjusting entries resolve.

The FASB Conceptual Framework (2010) identifies two key principles that drive adjusting entries:
1. **Revenue recognition principle** — recognize revenue when performance obligations are satisfied
2. **Matching principle** — recognize expenses in the same period as the related revenue

### The Four Types of Adjusting Entries

**1. Prepaid Expenses (Deferrals — Asset to Expense)**

A prepaid expense is cash paid before the expense is incurred. As time passes, the asset is consumed and becomes an expense.

Example: On January 1, a company pays \\\$12,000 for a 12-month insurance policy.

Initial entry:
\`\`\`
    Prepaid Insurance       12,000
        Cash                            12,000
\`\`\`

Monthly adjusting entry:
\`\`\`
    Insurance Expense        1,000
        Prepaid Insurance                1,000
\`\`\`

**2. Unearned Revenue (Deferrals — Liability to Revenue)**

Unearned revenue is cash received before the service is performed. As service is delivered, the liability becomes revenue.

Example: A law firm receives \\\$6,000 retainer on March 1 for six months of service.

Initial entry:
\`\`\`
    Cash                     6,000
        Unearned Revenue                 6,000
\`\`\`

Monthly adjusting entry:
\`\`\`
    Unearned Revenue         1,000
        Service Revenue                  1,000
\`\`\`

**3. Accrued Expenses (Expense before Cash Payment)**

An accrued expense has been incurred but not yet paid. The expense must be recorded in the current period even though cash will flow later.

Example: Employees earn \\\$5,000 in wages during the last week of December, paid on January 5.

December 31 adjusting entry:
\`\`\`
    Salaries Expense         5,000
        Salaries Payable                 5,000
\`\`\`

**4. Accrued Revenue (Revenue before Cash Receipt)**

Accrued revenue has been earned but not yet received. The revenue must be recorded when earned.

Example: A bank earns \\\$800 in interest on a loan during December, to be received January 15.

December 31 adjusting entry:
\`\`\`
    Interest Receivable        800
        Interest Revenue                   800
\`\`\`

### Depreciation: A Special Adjusting Entry

Depreciation allocates the cost of a long-lived asset over its useful life. It is recorded as an adjusting entry each period:

\`\`\`
    Depreciation Expense     2,000
        Accumulated Depreciation         2,000
\`\`\`

Note that Accumulated Depreciation is a **contra asset** — it reduces the book value of the asset without removing it from the books. The net book value = Cost - Accumulated Depreciation.

### Impact of Omitting Adjustments

Failure to make adjusting entries causes errors in both the income statement and balance sheet:

| Omitted Adjustment | Income Effect | Balance Sheet Effect |
|-------------------|---------------|---------------------|
| Prepaid expense | Expenses understated, Net income overstated | Assets overstated |
| Unearned revenue | Revenue overstated, Net income overstated | Liabilities understated |
| Accrued expense | Expenses understated, Net income overstated | Liabilities understated |
| Accrued revenue | Revenue understated, Net income understated | Assets understated |

A study by Dechow & Dichev (2002, *The Quality of Accruals and Earnings*, The Accounting Review) found that firms with poor accrual estimation quality (i.e., inaccurate adjusting entries) exhibit lower earnings persistence and higher cost of capital.

### Key Takeaway

Adjusting entries are the bridge between cash and accrual accounting. They ensure financial statements reflect economic reality, not just cash timing. Mastering the four types of adjustments is essential for accurate financial reporting.

*References: FASB Conceptual Framework (2010); Dechow & Dichev (2002), The Accounting Review; Horngren et al. (2014), Introduction to Financial Accounting (Pearson).*`,
    },
    {
      id: "acct-journal-closing-entries",
      slug: "closing-entries",
      title: "Closing Entries",
      content: `## Closing Entries

Closing entries are journal entries made at the very end of the accounting period — after financial statements are prepared — to reset all temporary accounts to zero. This prepares the books for the next period's transactions.

### Temporary vs Permanent Accounts

**Temporary accounts** accumulate data for a single accounting period and are reset to zero at the end of each period:
- Revenue accounts
- Expense accounts
- Dividends (or Drawings for sole proprietorships)
- Income Summary (a clearing account used during the closing process)

**Permanent accounts** carry their balances forward from period to period:
- All asset accounts
- All liability accounts
- All equity accounts (Common Stock, APIC, Retained Earnings, AOCI, Treasury Stock)

The distinction exists because the income statement reports activity *for a period*, while the balance sheet reports position *at a point in time*. Without closing entries, revenues and expenses would accumulate indefinitely, making period comparisons impossible (Kieso, Weygandt & Warfield, 2019, *Intermediate Accounting*, Wiley).

### The Four Closing Entries

The closing process uses a temporary clearing account called **Income Summary**:

**Step 1: Close Revenue Accounts to Income Summary**
\`\`\`
    Sales Revenue           150,000
    Service Revenue          30,000
    Interest Revenue          2,000
        Income Summary                 182,000
\`\`\`

All revenue accounts are debited (reducing them to zero), and Income Summary is credited.

**Step 2: Close Expense Accounts to Income Summary**
\`\`\`
    Income Summary          120,000
        Cost of Goods Sold              65,000
        Salaries Expense                30,000
        Rent Expense                    12,000
        Depreciation Expense             8,000
        Utilities Expense                3,000
        Interest Expense                 2,000
\`\`\`

All expense accounts are credited (reducing them to zero), and Income Summary is debited.

**Step 3: Close Income Summary to Retained Earnings**

If revenues exceeded expenses (net income = \\\$62,000):
\`\`\`
    Income Summary           62,000
        Retained Earnings               62,000
\`\`\`

If expenses exceeded revenues (net loss), the entry would be reversed — debiting Retained Earnings and crediting Income Summary.

**Step 4: Close Dividends to Retained Earnings**
\`\`\`
    Retained Earnings        20,000
        Dividends                       20,000
\`\`\`

After this entry, Dividends has a zero balance, and Retained Earnings has been reduced by the amount distributed to shareholders.

### Post-Closing Trial Balance

After closing entries are posted, a post-closing trial balance is prepared. This trial balance should contain **only permanent accounts** — all temporary accounts should have zero balances. If any temporary account still has a balance, the closing entries contain an error.

### The Income Summary Account

Income Summary exists solely for the closing process. It is:
- Credited with total revenues (Step 1)
- Debited with total expenses (Step 2)
- The difference (net income or net loss) is transferred to Retained Earnings (Step 3)
- After Step 3, Income Summary has a zero balance

Some companies skip Income Summary and close revenue and expense accounts directly to Retained Earnings. Both methods produce the same result.

### Automation in Modern Systems

Modern accounting software automates the closing process. QuickBooks, Xero, and enterprise systems like SAP automatically close temporary accounts at period-end with a single command. However, understanding the manual process is critical for:
- Auditing the automated output
- Troubleshooting errors when the system produces unexpected results
- Understanding how the income statement feeds the balance sheet

Research by Vasarhelyi & Alles (2008, *The "Now" Economy and the Traditional Accounting Reporting Model*, Accounting Horizons) argued that real-time closing capabilities in modern ERP systems could eventually eliminate the traditional periodic closing cycle, enabling continuous financial reporting.

### Key Takeaway

Closing entries reset temporary accounts to zero and transfer net income (or loss) to retained earnings. This process completes the accounting cycle and prepares the books for a new period.

> "Closing the books is like resetting the odometer — the car (the company) continues, but the trip meter (period income) starts fresh." — Kieso, Weygandt & Warfield

*References: Kieso, Weygandt & Warfield (2019), Intermediate Accounting (Wiley); Vasarhelyi & Alles (2008), Accounting Horizons.*`,
    },
    {
      id: "acct-journal-trial-balance",
      slug: "trial-balance",
      title: "Trial Balance",
      content: `## The Trial Balance

A trial balance is a listing of all general ledger account balances at a specific date, organized into debit and credit columns. Its primary purpose is to verify that total debits equal total credits — a necessary (but not sufficient) condition for accurate books.

### Purpose and Structure

The trial balance serves three functions:
1. **Verification** — confirms the mechanical accuracy of the double-entry system
2. **Summary** — provides a concise overview of all account balances
3. **Preparation tool** — serves as the starting point for financial statement preparation

**Format:**

| Account | Debit | Credit |
|---------|-------|--------|
| Cash | \\\$41,700 | |
| Accounts Receivable | \\\$15,000 | |
| Equipment | \\\$12,000 | |
| Accumulated Depreciation | | \\\$2,000 |
| Accounts Payable | | \\\$8,500 |
| Unearned Revenue | | \\\$3,000 |
| Common Stock | | \\\$50,000 |
| Retained Earnings | | \\\$5,200 |
| **Totals** | **\\\$68,700** | **\\\$68,700** |

### Three Types of Trial Balances

The accounting cycle uses three trial balances at different stages:

**1. Unadjusted Trial Balance** — prepared after posting all journal entries but before adjusting entries. This is the raw summary of recorded transactions.

**2. Adjusted Trial Balance** — prepared after adjusting entries are posted. This is the basis for preparing financial statements and is the most important of the three.

**3. Post-Closing Trial Balance** — prepared after closing entries. Contains only permanent accounts (assets, liabilities, equity). All temporary accounts should show zero balances.

### What a Balanced Trial Balance Proves

A balanced trial balance proves that:
- Every transaction was recorded with equal debits and credits
- All postings from the journal to the ledger maintained the debit/credit equality
- The mathematical additions in the ledger are correct

### What a Balanced Trial Balance Does NOT Prove

A trial balance can balance perfectly and still contain errors:

| Error Type | Example | Detected by Trial Balance? |
|-----------|---------|---------------------------|
| **Error of omission** | A transaction was completely unrecorded | No |
| **Error of commission** | Debited wrong asset account (Equipment instead of Supplies) | No |
| **Error of principle** | Recorded a capital expenditure as an expense | No |
| **Error of original entry** | Recorded \\\$540 instead of \\\$450 in both debit and credit | No |
| **Compensating errors** | One error offsets another | No |
| **Transposition error** | Recorded \\\$5,400 instead of \\\$4,500 (one-sided) | Yes |

This limitation was noted by Littleton (1933, *Accounting Evolution to 1900*, American Institute Publishing) as inherent to double-entry systems. It underscores why reconciliations, audits, and internal controls are necessary beyond the trial balance.

### Locating Errors When the Trial Balance Does Not Balance

When total debits do not equal total credits, systematic procedures help find the error:

1. **Recompute column totals** — simple addition errors are the most common cause
2. **Calculate the difference** — if divisible by 2, look for a debit/credit reversal of half that amount; if divisible by 9, suspect a transposition or slide error
3. **Compare ledger balances to the trial balance** — verify each account was listed correctly
4. **Verify postings** — trace journal entries to ledger accounts
5. **Re-examine journal entries** — check that debits equal credits for each entry

### The Worksheet

Accountants often use a **worksheet** (or working trial balance) — a multi-column spreadsheet that combines the unadjusted trial balance, adjustments, adjusted trial balance, income statement, and balance sheet columns. This tool, while informal, streamlines the period-end process.

### Modern Relevance

In computerized systems, the trial balance is generated automatically and always balances (because the software rejects unbalanced entries). However, the concept remains crucial for:
- Understanding how accounting information flows
- Auditing — auditors request trial balances as a starting point
- Error investigation — when reports seem wrong, the trial balance is the first place to check

According to PricewaterhouseCoopers' Global Annual Review (2023), trial balance analytics — using data analytics on trial balance data to detect anomalies — is one of the fastest-growing areas in audit technology.

### Key Takeaway

The trial balance is the accounting system's health check. While it cannot catch all errors, it is the essential verification step that ensures the double-entry system is functioning correctly before financial statements are prepared.

> "The trial balance is proof that the books are in balance. It is not proof that the books are correct." — A.C. Littleton

*References: Littleton (1933), Accounting Evolution to 1900; PwC Global Annual Review 2023; Kieso, Weygandt & Warfield (2019), Intermediate Accounting (Wiley).*`,
    },
  ],
};
