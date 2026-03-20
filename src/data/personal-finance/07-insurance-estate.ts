import { Module } from "../types";

export const insuranceEstateModule: Module = {
  id: "pf-insurance",
  title: "Insurance & Estate Planning",
  description:
    "Protect what you have built with insurance and estate planning — from health coverage to generational wealth. Resources: Investopedia, NerdWallet, Nolo Estate Planning, Khan Academy.",
  lessons: [
    {
      id: "pf-health-insurance",
      slug: "health-insurance-basics",
      title: "Health Insurance Basics",
      content: `## Health Insurance Basics

Health insurance is one of the most complex and important aspects of personal finance. Medical debt is the leading cause of bankruptcy in the United States, and a single major medical event without insurance can cost hundreds of thousands of dollars. Understanding how health insurance works protects both your health and your wealth.

### Key Health Insurance Terms

| Term | Definition | Example |
|------|-----------|---------|
| **Premium** | Monthly cost for coverage | \\\$350/month |
| **Deductible** | Amount you pay before insurance kicks in | \\\$2,000/year |
| **Copay** | Fixed amount per visit or service | \\\$25 per doctor visit |
| **Coinsurance** | Your percentage share after deductible | 20% of costs |
| **Out-of-pocket maximum** | Most you pay in a year (then insurance covers 100%) | \\\$8,000/year |
| **Network** | Doctors/hospitals that accept your plan at negotiated rates | In-network vs out-of-network |

### How It Works: A Medical Scenario

You have a plan with: \\\$300/month premium, \\\$2,000 deductible, 20% coinsurance, \\\$7,000 out-of-pocket maximum.

You break your arm. Total bill: \\\$15,000.

| Phase | You Pay | Insurance Pays |
|-------|---------|----------------|
| **Premiums (12 months)** | \\\$3,600 | — |
| **Deductible (first \\\$2,000)** | \\\$2,000 | \\\$0 |
| **Coinsurance (20% of remaining \\\$13,000)** | \\\$2,600 | \\\$10,400 |
| **After out-of-pocket max (\\\$7,000 reached)** | \\\$0 | Covers rest |

Your total cost: \\\$3,600 (premiums) + \\\$4,600 (deductible + coinsurance up to max) = **\\\$8,200**

Without insurance: **\\\$15,000** — and that is a relatively minor procedure.

### Types of Health Insurance Plans

**HMO (Health Maintenance Organization):**
- Must choose a primary care physician (PCP)
- Need referrals to see specialists
- Lower premiums, smaller networks
- Best for people who want lower costs and do not mind limited choices

**PPO (Preferred Provider Organization):**
- No referrals needed for specialists
- Larger networks, out-of-network coverage (at higher cost)
- Higher premiums than HMO
- Best for people who want flexibility

**HDHP (High-Deductible Health Plan):**
- Higher deductible (\\\$1,600+ individual, \\\$3,200+ family in 2024)
- Lower premiums
- Qualifies for HSA (Health Savings Account)
- Best for healthy people who want to save on premiums and invest via HSA

### The ACA Marketplace

The Affordable Care Act (ACA) created health insurance marketplaces (healthcare.gov) where individuals can purchase coverage. Key features:

- **No denial for pre-existing conditions**
- **Essential health benefits** required (hospitalization, prescriptions, maternity, mental health, etc.)
- **Premium subsidies** for households earning 100-400% of the Federal Poverty Level
- **Open enrollment** typically November-January (special enrollment for qualifying life events)

### Employer-Sponsored Insurance

Most Americans (about 155 million) get health insurance through their employer. The employer typically pays 70-80% of the premium:

- Average employer plan premium (2023, per KFF): \\\$8,435/year individual, \\\$23,968/year family
- Employee share: approximately \\\$1,400/year individual, \\\$6,575/year family

Employer plans are usually cheaper than marketplace plans due to group rates and employer subsidies.

### Real-World Example: Choosing the Right Plan

Tom, 32, is healthy and rarely visits the doctor. His employer offers two plans:

| Feature | PPO Plan | HDHP with HSA |
|---------|----------|---------------|
| Monthly premium | \\\$400 | \\\$200 |
| Deductible | \\\$500 | \\\$3,000 |
| Annual premium cost | \\\$4,800 | \\\$2,400 |
| HSA employer contribution | N/A | \\\$500 |

If Tom has fewer than 2 doctor visits/year, the HDHP saves \\\$2,400 in premiums plus he gets a \\\$500 HSA contribution and triple-tax-advantaged investing. If he has a major medical event, the out-of-pocket maximum protects him.

For most healthy young adults, the HDHP + HSA combination is financially optimal.

### Key Takeaway

Health insurance is not optional — one serious medical event can bankrupt you. Understand your plan's terms (deductible, coinsurance, out-of-pocket max), choose the plan type that matches your health needs and financial situation, and if eligible, use an HSA to maximize tax benefits.

*Resources: Healthcare.gov, KFF Health Insurance Basics, Investopedia Health Insurance Guide, NerdWallet Health Insurance Comparison.*`,
    },
    {
      id: "pf-life-insurance",
      slug: "life-insurance",
      title: "Life Insurance: Term vs Whole",
      content: `## Life Insurance: Term vs Whole

Life insurance provides a financial safety net for your dependents if you die. It is one of the most important — and most oversold — financial products. Understanding the difference between term and whole life insurance can save you thousands of dollars while still protecting your family.

\`\`\`mermaid
graph TD
    A[Insurance] --> B[Health]
    A --> C[Auto]
    A --> D[Home / Renters]
    A --> E[Life]
    A --> F[Disability]
    E --> E1[Term Life]
    E --> E2[Whole Life]
\`\`\`

### Who Needs Life Insurance?

You need life insurance if someone depends on your income:
- Spouse who relies on your earnings
- Children (minor or dependent)
- Co-signer on debts (mortgage, student loans)
- Business partners (key person insurance)

You probably **do not** need life insurance if:
- You are single with no dependents
- Your spouse has sufficient income
- Your children are financially independent
- You have enough savings to cover all obligations

### How Much Coverage Do You Need?

A common rule: **10-12 times your annual income**. A more precise method:

\`\`\`
Coverage needed =
  Income replacement (annual income x years until youngest child is 18)
+ Outstanding debts (mortgage, student loans, car loans)
+ Future expenses (college funding, funeral costs)
- Existing assets (savings, investments, other insurance)
\`\`\`

**Example:** Earning \\\$80,000 with two young children, \\\$200,000 mortgage, \\\$30,000 student loans:
- Income replacement: \\\$80,000 x 18 years = \\\$1,440,000
- Debts: \\\$230,000
- College: \\\$200,000
- Funeral: \\\$15,000
- Minus savings/investments: -\\\$100,000
- **Coverage needed: approximately \\\$1,785,000**
- Round to: \\\$2,000,000 policy

### Term Life Insurance

Term life provides coverage for a specific period (10, 20, or 30 years). If you die during the term, your beneficiaries receive the death benefit. If you outlive the term, coverage ends.

**Example rates (healthy 30-year-old, non-smoker):**

| Coverage | 20-Year Term | 30-Year Term |
|----------|-------------|-------------|
| \\\$500,000 | ~\\\$22/month | ~\\\$30/month |
| \\\$1,000,000 | ~\\\$35/month | ~\\\$50/month |
| \\\$2,000,000 | ~\\\$60/month | ~\\\$85/month |

**Pros:** Very affordable, simple to understand, covers the years when dependents need protection most.

**Cons:** No cash value, coverage expires, premiums increase dramatically if you try to renew.

### Whole Life Insurance

Whole life provides coverage for your entire life (as long as premiums are paid). It includes a cash value component that grows over time at a guaranteed rate.

**Example rates (healthy 30-year-old):**

| Coverage | Monthly Premium |
|----------|----------------|
| \\\$500,000 | ~\\\$350-500/month |
| \\\$1,000,000 | ~\\\$700-1,000/month |

**Pros:** Lifetime coverage, cash value accumulation, guaranteed death benefit, potential dividends.

**Cons:** 10-15x more expensive than term, cash value grows slowly (2-3%), high fees, complex.

### The Math: Term + Invest the Difference

The most common advice from fee-only financial planners: **buy term life insurance and invest the premium savings**.

**Comparison over 30 years:**

**Option A — Whole Life:**
- Premium: \\\$500/month for \\\$500,000 policy
- Cash value after 30 years: approximately \\\$140,000
- Death benefit: \\\$500,000

**Option B — Term Life + Invest:**
- Term premium: \\\$30/month for \\\$500,000 policy
- Invest the \\\$470/month difference in index funds at 8%
- Investment value after 30 years: approximately **\\\$710,000**
- Plus \\\$500,000 death benefit during the term

Option B produces five times the cash value while providing the same death benefit. This is why most financial educators (Dave Ramsey, Suze Orman, the Bogleheads community) recommend term over whole.

### When Whole Life Might Make Sense

In limited situations, whole life has a role:
- **Estate planning for very high net worth** (\\\$10M+): provides liquidity to pay estate taxes
- **Special needs dependents**: lifelong coverage for a child who will always need support
- **Business succession planning**: guaranteed payout for buy-sell agreements
- **Already maxed all tax-advantaged accounts**: the cash value grows tax-deferred

For 90%+ of Americans, term life insurance is the right choice.

### Real-World Example: The Insurance Agent Pitch

Insurance agents earn much higher commissions on whole life (40-110% of first-year premium) compared to term (30-80% of first-year premium, which is much lower). This creates a strong incentive to sell whole life even when term is more appropriate.

When an agent says "whole life is an investment," remember: a 2-3% return with high fees is not competitive with index funds averaging 8-10%.

### Key Takeaway

Buy term life insurance for 20-30 years (covering the period your dependents need protection), invest the premium savings in low-cost index funds, and you will come out far ahead. Whole life insurance is appropriate only in specialized situations for high-net-worth estate planning.

*Resources: Policygenius Life Insurance Guide, Dave Ramsey Term vs Whole Life, Investopedia Life Insurance, NerdWallet Life Insurance Calculator.*`,
    },
    {
      id: "pf-auto-renters-insurance",
      slug: "auto-renters-insurance",
      title: "Auto & Renters Insurance",
      content: `## Auto & Renters Insurance

Auto insurance is legally required in almost every state, and renters insurance is one of the most affordable protections you can buy. Yet many people overpay for auto coverage and skip renters insurance entirely. This lesson covers both.

### Auto Insurance: The Six Coverages

| Coverage | What It Covers | Required? |
|----------|---------------|-----------|
| **Liability (bodily injury)** | Other people's injuries in an accident you cause | Yes (in most states) |
| **Liability (property damage)** | Other people's property you damage | Yes (in most states) |
| **Collision** | Your car's damage from an accident | No (but lender may require) |
| **Comprehensive** | Your car's damage from non-collision events (theft, weather, animals) | No (but lender may require) |
| **Uninsured/underinsured motorist** | Covers you when the other driver has no/insufficient insurance | Varies by state |
| **Medical payments / PIP** | Your medical bills regardless of fault | Varies by state |

### Understanding Liability Limits

Liability coverage is expressed as three numbers: 100/300/100 means:
- \\\$100,000 per person for bodily injury
- \\\$300,000 per accident for bodily injury
- \\\$100,000 per accident for property damage

**Minimum coverage** (e.g., 25/50/25) is often insufficient. A serious accident can easily exceed those limits, leaving you personally liable. Most financial experts recommend at least 100/300/100.

### How to Save on Auto Insurance

1. **Increase your deductible**: Going from \\\$500 to \\\$1,000 deductible can save 15-25% on premiums
2. **Bundle home/renters + auto**: Typically saves 10-20%
3. **Shop around annually**: Rates vary dramatically between companies for the same coverage
4. **Ask about discounts**: Good driver, good student, low mileage, defensive driving, paperless billing
5. **Drop collision/comprehensive on old cars**: If your car is worth less than 10x the annual premium for these coverages, consider dropping them

### Real-World Example: The Coverage Decision

Alex drives a 2015 Honda Civic worth approximately \\\$12,000:
- Current annual premium: \\\$1,800 (full coverage, \\\$500 deductible)
- If Alex raises deductible to \\\$1,000: saves ~\\\$300/year
- If Alex drops collision/comprehensive (car worth \\\$12,000, paying \\\$600/year for these): keeps the coverage because the car value is 20x the premium cost

In 3 years, when the car is worth \\\$8,000 and collision/comp costs \\\$650:
- Ratio: 12x — getting closer to the drop threshold
- Alex might switch to liability-only and self-insure the car's value

### Umbrella Insurance

For high-net-worth individuals, an **umbrella policy** provides additional liability coverage (typically \\\$1-5 million) above your auto and homeowners limits. It is remarkably cheap:
- \\\$1 million umbrella: ~\\\$150-300/year
- \\\$2 million umbrella: ~\\\$200-400/year

If your net worth exceeds your auto/home liability limits, an umbrella policy protects your assets from lawsuits.

### Renters Insurance: The Most Overlooked Coverage

Only about 55% of renters carry renters insurance, despite it being incredibly affordable (average: \\\$15-30/month). It covers:

**Personal property**: Theft, fire, water damage, vandalism — covers your belongings up to the policy limit (typically \\\$20,000-50,000).

**Liability**: If someone is injured in your apartment, covers legal expenses and medical bills (typically \\\$100,000).

**Additional living expenses**: If your apartment becomes uninhabitable (fire, flood), covers hotel and food costs while you find new housing.

### What Renters Insurance Does NOT Cover

- Flood damage (requires separate flood insurance)
- Earthquake damage (requires separate policy)
- Roommate's belongings (each person needs their own policy)
- Your car (covered by auto insurance)
- Intentional damage

### Real-World Example: Why You Need Renters Insurance

Sarah's apartment building catches fire from a neighbor's unit. She loses:
- Laptop: \\\$1,200
- Clothing: \\\$3,000
- Furniture: \\\$4,000
- Electronics: \\\$2,500
- Kitchen items: \\\$800
- **Total: \\\$11,500**

With renters insurance (\\\$20/month, \\\$500 deductible): Sarah pays \\\$500, insurance covers \\\$11,000.

Without renters insurance: Sarah pays \\\$11,500 out of pocket — plus hotel costs for temporary housing.

The landlord's insurance covers the building, NOT your belongings.

### Replacement Cost vs Actual Cash Value

| Type | How It Pays | Example (5-year-old laptop, paid \\\$1,500) |
|------|-----------|------------------------------------------|
| **Replacement cost** | Cost to buy a comparable new item | Pays \\\$1,400 (current price of equivalent laptop) |
| **Actual cash value** | Depreciated value | Pays \\\$500 (original price minus 5 years of depreciation) |

Always choose **replacement cost** coverage — it costs slightly more per month but pays significantly more in a claim.

### Key Takeaway

Auto insurance is mandatory but should be optimized through higher deductibles, shopping around, and appropriate coverage levels. Renters insurance is optional but incredibly valuable at just \\\$15-30/month. Both protect you from financial catastrophes that would otherwise set you back years.

*Resources: NerdWallet Auto Insurance Guide, The Zebra Insurance Comparison, Investopedia Renters Insurance, NAIC (National Association of Insurance Commissioners).*`,
    },
    {
      id: "pf-estate-planning",
      slug: "estate-planning-basics",
      title: "Estate Planning Basics",
      content: `## Estate Planning Basics

Estate planning is not just for the wealthy. It is the process of arranging for the management and distribution of your assets after death (or incapacity). Without a plan, the state decides who gets your property, who raises your children, and who makes medical decisions for you.

### Why Everyone Needs an Estate Plan

According to a 2023 Gallup poll, only 46% of American adults have a will. The consequences of dying without one (called dying "intestate"):

- **The state decides** who inherits your assets — following a rigid formula that may not match your wishes
- **No guardian is named** for minor children — the court appoints one
- **Family conflict** — disputes over inheritance are common and devastating
- **Probate delays** — assets may be frozen for months or years
- **Tax inefficiency** — without planning, your estate may pay more in taxes than necessary

### The Four Essential Estate Planning Documents

**1. Will (Last Will and Testament)**

A will specifies:
- Who inherits your property (beneficiaries)
- Who raises your minor children (guardian)
- Who manages the process (executor)

A will must go through **probate** — a court process that validates the will and oversees distribution. Probate is public, can take 6-12 months, and costs 3-7% of the estate.

**2. Revocable Living Trust**

A trust holds your assets during your lifetime and transfers them to beneficiaries at death — **bypassing probate entirely**.

| Feature | Will | Living Trust |
|---------|------|-------------|
| Probate required | Yes | No |
| Public record | Yes | No (private) |
| Effective during incapacity | No | Yes |
| Cost to create | \\\$200-500 | \\\$1,000-3,000 |
| Complexity | Simple | Moderate |

**When a trust makes sense:** Owning real estate, having assets over \\\$100,000, wanting privacy, or living in a state with expensive probate (California, Florida).

**3. Durable Power of Attorney (POA)**

Designates someone to make financial decisions if you become incapacitated (accident, illness, cognitive decline):
- Pay your bills
- Manage your investments
- Handle your real estate
- File your taxes

Without a POA, your family must petition the court for conservatorship — expensive, time-consuming, and public.

**4. Healthcare Directive (Living Will + Healthcare POA)**

Two components:
- **Living will:** States your wishes for end-of-life medical care (life support, resuscitation, organ donation)
- **Healthcare proxy (POA):** Designates someone to make medical decisions if you cannot

### Beneficiary Designations: The Override

**Critical:** Beneficiary designations on accounts (401(k), IRA, life insurance, bank accounts) **override your will**. If your will says "leave everything to my spouse" but your 401(k) beneficiary is your ex-spouse from 10 years ago, the ex gets the 401(k).

**Action item:** Review beneficiary designations on all accounts at least annually and after any major life event (marriage, divorce, birth, death).

### Real-World Example: The Cost of No Plan

David, 42, dies unexpectedly in a car accident. He has:
- \\\$400,000 home (owned jointly with wife)
- \\\$200,000 401(k) (ex-wife listed as beneficiary — never updated after remarriage)
- \\\$50,000 savings account (in his name only)
- Two minor children

**What happens:**
- House: transfers to wife automatically (joint ownership)
- 401(k): goes to **ex-wife** (beneficiary designation overrides everything)
- Savings: frozen in probate for 8 months; wife cannot access it for bills
- Children's guardianship: David's parents and wife's parents both petition the court, creating a legal battle

If David had spent 2 hours updating his beneficiary designations and creating basic estate documents, all of this would have been avoided.

### Estate Taxes: Who Pays?

For 2024, the federal estate tax exemption is **\\\$13.61 million per person** (\\\$27.22 million for married couples). Estates below this threshold pay no federal estate tax. Only about 0.1% of estates are affected.

However, some states have lower thresholds:
- Oregon: \\\$1 million
- Massachusetts: \\\$2 million
- New York: \\\$6.94 million

### Getting Started: Minimum Viable Estate Plan

1. **Create a will** — Online services (Trust & Will, LegalZoom, Nolo) cost \\\$100-300
2. **Designate beneficiaries** on all financial accounts
3. **Set up healthcare directive** and durable POA
4. **Organize documents** and tell your executor/trustee where to find them
5. **Review annually** and after life events

### Key Takeaway

Estate planning ensures your wishes are followed, your family is protected, and your assets transfer efficiently. At minimum, every adult needs a will, updated beneficiary designations, a power of attorney, and a healthcare directive. The cost of not planning is far greater than the cost of planning.

*Resources: Nolo Estate Planning Guide, AARP Estate Planning, Trust & Will (online estate planning), Investopedia Estate Planning Basics.*`,
    },
    {
      id: "pf-generational-wealth",
      slug: "generational-wealth",
      title: "Building Generational Wealth",
      content: `## Building Generational Wealth

Generational wealth is financial assets passed from one generation to the next — money, investments, real estate, businesses, and financial knowledge. It is what separates families that start each generation from scratch from those that compound advantages over decades.

### The Wealth Gap Reality

According to the Federal Reserve's 2022 Survey of Consumer Finances:
- Median family net worth in the U.S.: \\\$192,900
- Families that received an inheritance have 2.5x the median net worth
- Only about 20% of Americans receive a meaningful inheritance

Research from the Brookings Institution shows that intergenerational wealth transfers — both financial and in the form of education, networks, and opportunities — are the primary driver of wealth inequality.

### The Three Pillars of Generational Wealth

**Pillar 1: Financial Assets**
- Retirement accounts, investment portfolios, savings
- These can be passed through beneficiary designations, trusts, and inheritance
- Subject to estate taxes above the exemption threshold

**Pillar 2: Real Estate**
- Primary residence, rental properties, land
- Real estate appreciates over time and can generate rental income
- Benefits from the stepped-up basis at death (heirs inherit at current market value, not original purchase price)

**Pillar 3: Financial Literacy**
- Teaching children about money, investing, and entrepreneurship
- This may be the most valuable inheritance because it ensures the next generation can maintain and grow what they receive
- Without financial education, inherited wealth is often depleted within two generations

### The Shirtsleeves-to-Shirtsleeves Problem

Research consistently shows that **70% of wealthy families lose their wealth by the second generation**, and **90% lose it by the third**. This phenomenon is known as "shirtsleeves to shirtsleeves in three generations."

Common causes:
- Heirs lack financial education
- Lifestyle inflation consumes the inheritance
- Poor investment decisions or scams
- Family conflict over money
- No estate plan leading to unnecessary taxes and probate costs

### Building Wealth to Transfer

**Step 1: Build your own financial foundation first**
You cannot pour from an empty cup. Follow the principles from this course:
- Eliminate high-interest debt
- Build an emergency fund
- Max out tax-advantaged accounts
- Invest consistently in low-cost index funds

**Step 2: Protect your wealth**
- Adequate insurance (life, health, umbrella)
- Estate plan (will, trust, beneficiary designations)
- Asset protection strategies

**Step 3: Grow transferable assets**
- Real estate (builds equity, generates income, appreciates)
- Roth accounts (tax-free to heirs)
- 529 plans (tax-free education funding for children/grandchildren)
- Taxable brokerage accounts (benefit from stepped-up basis at death)

### Real-World Example: The Two Families

**The Martinez Family:**
- Parents invest \\\$500/month in index funds starting at age 30
- By 65: approximately \\\$1,130,000
- They teach their children about budgeting, investing, and compound interest
- At death, children inherit remaining portfolio (tax-advantaged through stepped-up basis)
- Children continue investing and add to the family's wealth
- Grandchildren start life with both financial assets AND financial knowledge

**The Thompson Family:**
- Parents earn the same income but spend it all
- No savings, no investments, no financial education for children
- At death, nothing to pass on except possibly a paid-off house
- Children start from zero, repeating the cycle

Over three generations, the wealth gap between these families grows exponentially.

### Strategies for Transferring Wealth Tax-Efficiently

| Strategy | Benefit | 2024 Limit |
|----------|---------|------------|
| **Annual gift exclusion** | Gift without triggering gift tax | \\\$18,000 per recipient per year |
| **529 contributions** | Tax-free education funding | \\\$18,000/year (or \\\$90,000 superfunded over 5 years) |
| **Roth IRA conversion** | Tax-free inheritance | Based on contribution limits |
| **Irrevocable life insurance trust** | Death benefit outside taxable estate | Varies |
| **Family limited partnership** | Discounted asset transfers | Complex, needs attorney |
| **Stepped-up basis** | Eliminates capital gains on inherited assets | Automatic at death |
| **Charitable remainder trust** | Income stream + charity + tax deduction | Complex, needs attorney |

### Teaching Financial Literacy to Children

Age-appropriate financial education is the highest-return investment you can make:

**Ages 5-10:** Allowance tied to chores, saving jars (spend/save/give), basic concepts of earning and spending.

**Ages 11-14:** Bank account, budgeting basics, the concept of compound interest, understanding advertising and marketing.

**Ages 15-18:** Part-time job, Roth IRA (with earned income), investing basics, understanding credit, college financial planning.

**Ages 18-25:** Full financial independence training — budgeting, taxes, investing, insurance, debt management.

### The Long View

Generational wealth is not about creating a trust-fund lifestyle. It is about giving each successive generation a better starting point — less debt, more education, earlier investing, and the financial literacy to make wise decisions.

A \\\$100,000 inheritance invested at 8% for 40 years becomes \\\$2.17 million. That is the potential of compound growth across generations — if the recipients know how to manage it.

### Key Takeaway

Building generational wealth requires three things: accumulating financial assets, protecting them through estate planning, and transferring financial knowledge to the next generation. The knowledge may be more valuable than the money, because it ensures the wealth compounds rather than dissipates.

> "Someone is sitting in the shade today because someone planted a tree a long time ago." — Warren Buffett

*Resources: Brookings Institution Wealth Mobility Studies, The Millionaire Next Door by Thomas Stanley, Investopedia Generational Wealth Guide, Khan Academy Teaching Kids About Money.*`,
    },
  ],
};
