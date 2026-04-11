import { Module } from "../types";

export const insuranceEstateModule: Module = {
  id: "pf-insurance",
  title: "Insurance & Estate Planning",
  description: "Protect what you have built with insurance and estate planning — from health coverage to generational wealth. Resources: Investopedia, NerdWallet, Nolo Estate Planning, Khan Academy.",
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
| **Premium** | Monthly cost for coverage | \\$350/month |
| **Deductible** | Amount you pay before insurance kicks in | \\$2,000/year |
| **Copay** | Fixed amount per visit or service | \\$25 per doctor visit |
| **Coinsurance** | Your percentage share after deductible | 20% of costs |
| **Out-of-pocket maximum** | Most you pay in a year (then insurance covers 100%) | \\$8,000/year |
| **Network** | Doctors/hospitals that accept your plan at negotiated rates | In-network vs out-of-network |

### How It Works: A Medical Scenario

You have a plan with: \\$300/month premium, \\$2,000 deductible, 20% coinsurance, \\$7,000 out-of-pocket maximum.

You break your arm. Total bill: \\$15,000.

| Phase | You Pay | Insurance Pays |
|-------|---------|----------------|
| **Premiums (12 months)** | \\$3,600 | — |
| **Deductible (first \\$2,000)** | \\$2,000 | \\$0 |
| **Coinsurance (20% of remaining \\$13,000)** | \\$2,600 | \\$10,400 |
| **After out-of-pocket max (\\$7,000 reached)** | \\$0 | Covers rest |

Your total cost: \\$3,600 (premiums) + \\$4,600 (deductible + coinsurance up to max) = **\\$8,200**

Without insurance: **\\$15,000** — and that is a relatively minor procedure.

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
- Higher deductible (\\$1,600+ individual, \\$3,200+ family in 2024)
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

- Average employer plan premium (2023, per KFF): \\$8,435/year individual, \\$23,968/year family
- Employee share: approximately \\$1,400/year individual, \\$6,575/year family

Employer plans are usually cheaper than marketplace plans due to group rates and employer subsidies.

### Real-World Example: Choosing the Right Plan

Tom, 32, is healthy and rarely visits the doctor. His employer offers two plans:

| Feature | PPO Plan | HDHP with HSA |
|---------|----------|---------------|
| Monthly premium | \\$400 | \\$200 |
| Deductible | \\$500 | \\$3,000 |
| Annual premium cost | \\$4,800 | \\$2,400 |
| HSA employer contribution | N/A | \\$500 |

If Tom has fewer than 2 doctor visits/year, the HDHP saves \\$2,400 in premiums plus he gets a \\$500 HSA contribution and triple-tax-advantaged investing. If he has a major medical event, the out-of-pocket maximum protects him.

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

**Example:** Earning \\$80,000 with two young children, \\$200,000 mortgage, \\$30,000 student loans:
- Income replacement: \\$80,000 x 18 years = \\$1,440,000
- Debts: \\$230,000
- College: \\$200,000
- Funeral: \\$15,000
- Minus savings/investments: -\\$100,000
- **Coverage needed: approximately \\$1,785,000**
- Round to: \\$2,000,000 policy

### Term Life Insurance

Term life provides coverage for a specific period (10, 20, or 30 years). If you die during the term, your beneficiaries receive the death benefit. If you outlive the term, coverage ends.

**Example rates (healthy 30-year-old, non-smoker):**

| Coverage | 20-Year Term | 30-Year Term |
|----------|-------------|-------------|
| \\$500,000 | ~\\$22/month | ~\\$30/month |
| \\$1,000,000 | ~\\$35/month | ~\\$50/month |
| \\$2,000,000 | ~\\$60/month | ~\\$85/month |

**Pros:** Very affordable, simple to understand, covers the years when dependents need protection most.

**Cons:** No cash value, coverage expires, premiums increase dramatically if you try to renew.

### Whole Life Insurance

Whole life provides coverage for your entire life (as long as premiums are paid). It includes a cash value component that grows over time at a guaranteed rate.

**Example rates (healthy 30-year-old):**

| Coverage | Monthly Premium |
|----------|----------------|
| \\$500,000 | ~\\$350-500/month |
| \\$1,000,000 | ~\\$700-1,000/month |

**Pros:** Lifetime coverage, cash value accumulation, guaranteed death benefit, potential dividends.

**Cons:** 10-15x more expensive than term, cash value grows slowly (2-3%), high fees, complex.

### The Math: Term + Invest the Difference

The most common advice from fee-only financial planners: **buy term life insurance and invest the premium savings**.

**Comparison over 30 years:**

**Option A — Whole Life:**
- Premium: \\$500/month for \\$500,000 policy
- Cash value after 30 years: approximately \\$140,000
- Death benefit: \\$500,000

**Option B — Term Life + Invest:**
- Term premium: \\$30/month for \\$500,000 policy
- Invest the \\$470/month difference in index funds at 8%
- Investment value after 30 years: approximately **\\$710,000**
- Plus \\$500,000 death benefit during the term

Option B produces five times the cash value while providing the same death benefit. This is why most financial educators (Dave Ramsey, Suze Orman, the Bogleheads community) recommend term over whole.

### When Whole Life Might Make Sense

In limited situations, whole life has a role:
- **Estate planning for very high net worth** (\\$10M+): provides liquidity to pay estate taxes
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
- \\$100,000 per person for bodily injury
- \\$300,000 per accident for bodily injury
- \\$100,000 per accident for property damage

**Minimum coverage** (e.g., 25/50/25) is often insufficient. A serious accident can easily exceed those limits, leaving you personally liable. Most financial experts recommend at least 100/300/100.

### How to Save on Auto Insurance

1. **Increase your deductible**: Going from \\$500 to \\$1,000 deductible can save 15-25% on premiums
2. **Bundle home/renters + auto**: Typically saves 10-20%
3. **Shop around annually**: Rates vary dramatically between companies for the same coverage
4. **Ask about discounts**: Good driver, good student, low mileage, defensive driving, paperless billing
5. **Drop collision/comprehensive on old cars**: If your car is worth less than 10x the annual premium for these coverages, consider dropping them

### Real-World Example: The Coverage Decision

Alex drives a 2015 Honda Civic worth approximately \\$12,000:
- Current annual premium: \\$1,800 (full coverage, \\$500 deductible)
- If Alex raises deductible to \\$1,000: saves ~\\$300/year
- If Alex drops collision/comprehensive (car worth \\$12,000, paying \\$600/year for these): keeps the coverage because the car value is 20x the premium cost

In 3 years, when the car is worth \\$8,000 and collision/comp costs \\$650:
- Ratio: 12x — getting closer to the drop threshold
- Alex might switch to liability-only and self-insure the car's value

### Umbrella Insurance

For high-net-worth individuals, an **umbrella policy** provides additional liability coverage (typically \\$1-5 million) above your auto and homeowners limits. It is remarkably cheap:
- \\$1 million umbrella: ~\\$150-300/year
- \\$2 million umbrella: ~\\$200-400/year

If your net worth exceeds your auto/home liability limits, an umbrella policy protects your assets from lawsuits.

### Renters Insurance: The Most Overlooked Coverage

Only about 55% of renters carry renters insurance, despite it being incredibly affordable (average: \\$15-30/month). It covers:

**Personal property**: Theft, fire, water damage, vandalism — covers your belongings up to the policy limit (typically \\$20,000-50,000).

**Liability**: If someone is injured in your apartment, covers legal expenses and medical bills (typically \\$100,000).

**Additional living expenses**: If your apartment becomes uninhabitable (fire, flood), covers hotel and food costs while you find new housing.

### What Renters Insurance Does NOT Cover

- Flood damage (requires separate flood insurance)
- Earthquake damage (requires separate policy)
- Roommate's belongings (each person needs their own policy)
- Your car (covered by auto insurance)
- Intentional damage

### Real-World Example: Why You Need Renters Insurance

Sarah's apartment building catches fire from a neighbor's unit. She loses:
- Laptop: \\$1,200
- Clothing: \\$3,000
- Furniture: \\$4,000
- Electronics: \\$2,500
- Kitchen items: \\$800
- **Total: \\$11,500**

With renters insurance (\\$20/month, \\$500 deductible): Sarah pays \\$500, insurance covers \\$11,000.

Without renters insurance: Sarah pays \\$11,500 out of pocket — plus hotel costs for temporary housing.

The landlord's insurance covers the building, NOT your belongings.

### Replacement Cost vs Actual Cash Value

| Type | How It Pays | Example (5-year-old laptop, paid \\$1,500) |
|------|-----------|------------------------------------------|
| **Replacement cost** | Cost to buy a comparable new item | Pays \\$1,400 (current price of equivalent laptop) |
| **Actual cash value** | Depreciated value | Pays \\$500 (original price minus 5 years of depreciation) |

Always choose **replacement cost** coverage — it costs slightly more per month but pays significantly more in a claim.

### Key Takeaway

Auto insurance is mandatory but should be optimized through higher deductibles, shopping around, and appropriate coverage levels. Renters insurance is optional but incredibly valuable at just \\$15-30/month. Both protect you from financial catastrophes that would otherwise set you back years.

*Resources: NerdWallet Auto Insurance Guide, The Zebra Insurance Comparison, Investopedia Renters Insurance, NAIC (National Association of Insurance Commissioners).*`,
    },
    {
      id: "pf-estate-planning",
      slug: "estate-planning-basics",
      title: "Estate Planning Basics",
      content: `\`\`\`concept
{"title": "Estate Planning in One Sentence", "variant": "mental-model", "content": "Estate planning is the act of writing instructions today so a stranger in a black robe doesn’t make them for you tomorrow."}
\`\`\`

Estate planning is not a “rich-person” checkbox—it’s the process of arranging who manages your money, your kids, and your medical care if you’re alive-but-unable or no longer here. Skip it and state law writes the script: rigid formulas, public court fights, frozen accounts, and guardians you never chose.

\`\`\`callout
{"type": "warning", "title": "The 46 % Problem", "content": "Gallup 2023: fewer than half of U.S. adults have a will. Everyone else is betting the state’s one-size-fits-all rules match their family, their values, and their timeline. Spoiler: they rarely do."}
\`\`\`

## What Happens If You Do Nothing (a.k.a. Dying “Intestate”)

| Consequence | Real-world pain |
|-------------|-----------------|
| State decides heirs | Your favorite niece gets nothing; a distant cousin you’ve never met might |
| No guardian named | Court hearing; grandparents on both sides lawyer-up |
| Assets frozen | Mortgage, tuition, daycare bills keep arriving; cash is locked |
| Public probate | Neighbors can read your inventory online |
| Possible extra tax | No marital or charitable tricks = bigger tax bite |

\`\`\`quiz
{"title": "Quick Check: Intestacy", "questions": [
  {"question": "If you die without a will, who chooses the guardian for your minor children?", "options": ["Your parents", "The family by mutual agreement", "A judge", "The state’s child-services agency"], "answer": 2, "explanation": "A judge holds a hearing and appoints a guardian; family members can petition, but the court decides."},
  {"question": "Which assets bypass your will entirely?", "options": ["House in your name alone", "Car titled to you", "401(k) with a named beneficiary", "Checking account with no POD"], "answer": 2, "explanation": "Beneficiary-designation assets (retirement accounts, life insurance, POD/TOD accounts) go straight to the named person—will or no will."},
  {"question": "Approximately what percentage of estates pay federal estate tax in 2024?", "options": ["10 %", "3 %", "0.1 %", "25 %"], "answer": 2, "explanation": "The exemption is $13.61 million per person; only about 1 in 1,000 estates owe federal tax."}
]}
\`\`\`

## The Core Four Documents

1. **Will** – who gets what, who raises the kids, who’s in charge.
2. **Revocable Living Trust** – owns your stuff while you’re alive, transfers it instantly at death, skips probate.
3. **Durable Power of Attorney** – someone you trust signs your checks if you can’t.
4. **Healthcare Directive** – your medical wishes + who speaks for you when you can’t speak.

\`\`\`compare
{"variant": "before-after", "before": {"label": "Only a Will", "code": "House → 9-month probate\\nKids → court picks guardian\\nFinances → frozen until probate ends\\nPublic record → anyone can read"}, "after": {"label": "Will + Trust + POA + Healthcare", "code": "House → transfers in weeks, no probate\\nKids → your chosen guardian sworn in immediately\\nFinances → agent pays bills day 1\\nPrivacy → no public inventory"}}
\`\`\`

### Wills vs. Living Trust—When Does Each Shine?

\`\`\`tabs
{"tabs": [
  {"label": "Simple & Cheap", "content": "**Will**\\n- Cost: $200–500 online or attorney\\n- Good if: no real estate, assets <$100k, okay with probate\\n- Downside: 6–12-month probate, public"},
  {"label": "Privacy & Speed", "content": "**Revocable Living Trust**\\n- Cost: $1k–3k attorney, $400–700 online\\n- Good if: real estate, assets >$100k, hate probate, want incapacity plan\\n- Downside: must re-title assets into trust"},
  {"label": "Hybrid Route", "content": "Pour-over will + small trust\\n- Will catches forgotten items and sends them into your trust\\n- Keeps guardianship provisions\\n- Still avoids probate on major assets"}
]}
\`\`\`

### Beneficiary Designations—The Invisible Will

Retirement plans, life insurance, and most bank accounts pass **outside** your will. If the beneficiary form still names your ex from 2009, that ex wins—regardless of what your fancy new will says.

\`\`\`steps
{"title": "Annual 15-Minute Beneficiary Audit", "steps": [
  {"title": "List", "content": "Write every account that asks for a beneficiary: 401(k), IRA, HSA, life insurance, brokerage, bank savings with POD."},
  {"title": "Match", "content": "Read the name on each form. Does it match your current wish?"},
  {"title": "Update", "content": "Log in or call; change forms in minutes; save PDF confirmations."},
  {"title": "Backup", "content": "Email copies to your executor/trustee so they know these assets exist."}
]}
\`\`\`

### Estate Taxes: The Line in the Sand

- **Federal**: 2024 exemption $13.61 million per person (≈ $27 million for a couple). Rate on the excess: 18–40 %. Roughly 0.1 % of estates owe anything.
- **State gotchas**: Oregon taxes estates >$1 million, Massachusetts >$2 million, New York >$6.94 million. Live there? Plan early—gifting, trusts, or life-insurance trusts can shrink the taxable pile.

\`\`\`calculator
{"type": "compound-interest", "title": "Gifting to Shrink a Taxable Estate", "inputs": [
  {"id": "p", "label": "Annual gifts per couple", "default": 34000, "min": 0, "max": 100000, "prefix": "$"},
  {"id": "r", "label": "Growth rate", "default": 6, "min": 0, "max": 12, "suffix": "%"},
  {"id": "t", "label": "Years of gifting", "default": 20, "min": 5, "max": 40, "suffix": " yrs"}
]}
\`\`\`

## Real-World Walk-Through: David’s 8-Month Freeze

David, 42, remarried but never updated his 401(k) beneficiary. After a car accident:

\`\`\`trace
{"title": "What Hit the Family’s Cash-Flow", "language": "python", "code": "# David's assets and flow\\nassets = {'home_joint': 400000, '401k': 200000, 'savings': 50000}\\nbeneficiaries = {'401k': 'ex-wife', 'home': 'wife', 'savings': 'estate'}\\n\\nprint('Day 1:')\\nprint('  Home → wife (joint) ✓')\\nprint('  401k → ex-wife 😟')\\nprint('  Savings → PROBATE (frozen)')\\n\\nprint('\\\\nMonth 8: probate closed')\\nprint('  Savings → wife (after $3k fees)')", "frames": [
  {"line": 1, "vars": {"assets": {"home_joint": 400000, "401k": 200000, "savings": 50000}}, "note": "Total = $650k", "stdout": ""},
  {"line": 5, "vars": {"beneficiaries": {"401k": "ex-wife", "home": "wife", "savings": "estate"}}, "note": "Ex-wife still on 401(k) form", "stdout": "Day 1:\\n  Home → wife (joint) ✓\\n  401k → ex-wife 😟\\n  Savings → PROBATE (frozen)"},
  {"line": 10, "vars": {}, "note": "Wife finally accesses savings", "stdout": "Month 8: probate closed\\n  Savings → wife (after $3k fees)"}
]}
\`\`\`

Guardianship hearings added legal bills and family tension—avoidable with a 2-hour update.

## Your Minimum-Viable Plan

1. Draft a will (online $100–300) – name executor & guardian.
2. Complete or update every beneficiary form.
3. Sign state-specific healthcare directive + durable POA (free templates at most hospitals).
4. Move big-ticket assets (house, large brokerage) into a revocable living trust if probate sounds awful.
5. Store originals in a fire-safe; tell your key people where it lives; calendar an annual 15-minute review.

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Estate planning is for every adult, not just the wealthy; without it, state law writes your script.", "Four documents cover 90 % of needs: will, revocable living trust, durable power of attorney, healthcare directive.", "Beneficiary designations override your will—review them yearly and after every life change.", "Federal estate tax hits only the top 0.1 %, but a dozen states grab smaller estates; know your local threshold.", "A two-hour annual check (documents + beneficiaries) can save your family months of probate, thousands in fees, and endless stress."]}
\`\`\``,
    },
    {
      id: "pf-generational-wealth",
      slug: "generational-wealth",
      title: "Building Generational Wealth",
      content: `## Building Generational Wealth

Generational wealth is financial assets passed from one generation to the next — money, investments, real estate, businesses, and financial knowledge. It is what separates families that start each generation from scratch from those that compound advantages over decades.

### The Wealth Gap Reality

According to the Federal Reserve's 2022 Survey of Consumer Finances:
- Median family net worth in the U.S.: \\$192,900
- Families that received an inheritance have 2.5x the median net worth
- Only about 20% of Americans receive a meaningful inheritance

Research from the Brookings Institution shows that intergenerational wealth transfers — both financial and in the form of education, networks, and opportunities — are the primary driver of wealth inequality.

### The Three Pillars of Generational Wealth

\`\`\`concept
{
  "title": "The Three Pillars of Generational Wealth",
  "variant": "mental-model",
  "content": "Think of generational wealth as a three-legged stool. Remove any leg and the entire structure collapses:\\n\\n1. **Financial Assets** - The money and investments you can pass on\\n2. **Real Estate** - Property that appreciates and generates income\\n3. **Financial Literacy** - The knowledge that ensures the next generation can manage and grow what they receive\\n\\nMost families focus only on the first pillar, but without all three, wealth typically disappears within two generations."
}
\`\`\`

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

\`\`\`callout
{
  "type": "warning",
  "title": "The 70/90 Rule Reality Check",
  "content": "While these statistics are widely cited, they originate from a single 1987 study focused on business succession rather than overall family wealth preservation. However, the core insight remains valid: without proper planning and education, wealth tends to dissipate across generations. The real lesson is that building wealth is only half the battle — preserving it requires equal attention."
}
\`\`\`

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

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "The Thompson Family: Starting Over Each Generation",
    "code": "Generation 1: Earns $75,000/year, spends it all\\n- No savings or investments\\n- No financial education passed down\\n- House paid off by retirement\\n\\nGeneration 2: Starts from zero\\n- Takes on student loans and mortgage\\n- No inheritance received\\n- Repeats parents' spending patterns\\n\\nGeneration 3: The cycle continues\\n- No financial head start\\n- Accumulates debt early in adulthood\\n- Wealth gap grows exponentially"
  },
  "after": {
    "label": "The Martinez Family: Compounding Across Generations",
    "code": "Generation 1: Invests $500/month from age 30-65\\n- Portfolio grows to ~$1.13M at 8% return\\n- Teaches children budgeting and investing\\n- Creates estate plan with trusts\\n\\nGeneration 2: Receives $500,000 inheritance\\n- Already financially literate\\n- Continues investing strategy\\n- Adds $1,000/month to family portfolio\\n\\nGeneration 3: Starts with advantages\\n- College funded through 529 plans\\n- Receives down payment help for first home\\n- Inherits $2M+ and knows how to manage it"
  }
}
\`\`\`

### Strategies for Transferring Wealth Tax-Efficiently

| Strategy | Benefit | 2024 Limit |
|----------|---------|------------|
| **Annual gift exclusion** | Gift without triggering gift tax | \\$18,000 per recipient per year |
| **529 contributions** | Tax-free education funding | \\$18,000/year (or \\$90,000 superfunded over 5 years) |
| **Roth IRA conversion** | Tax-free inheritance | Based on contribution limits |
| **Irrevocable life insurance trust** | Death benefit outside taxable estate | Varies |
| **Family limited partnership** | Discounted asset transfers | Complex, needs attorney |
| **Stepped-up basis** | Eliminates capital gains on inherited assets | Automatic at death |
| **Charitable remainder trust** | Income stream + charity + tax deduction | Complex, needs attorney |

### Teaching Financial Literacy to Children

\`\`\`steps
{
  "title": "Age-Appropriate Financial Education",
  "steps": [
    {
      "title": "Ages 5-10: Foundation Building",
      "content": "- **Allowance tied to chores** - Connect work with earning\\n- **Three-jar system** - Spend, Save, Give jars for money management\\n- **Basic concepts** - Understanding that money is earned and choices must be made\\n- **Games** - Monopoly Junior, The Game of Life for fun financial lessons"
    },
    {
      "title": "Ages 11-14: Real-World Practice",
      "content": "- **Bank account** - Open a savings account and explain interest\\n- **Budgeting basics** - Plan for desired purchases\\n- **Compound interest** - Show how money grows over time with the Rule of 72\\n- **Critical thinking** - Analyze advertising and understand marketing tactics"
    },
    {
      "title": "Ages 15-18: Preparing for Independence",
      "content": "- **Part-time job** - Earned income qualifies for Roth IRA contributions\\n- **Roth IRA** - Start investing early (even $500/year makes a difference)\\n- **Credit education** - How credit scores work and why they matter\\n- **College planning** - Understanding student loans, scholarships, and ROI"
    },
    {
      "title": "Ages 18-25: Full Independence",
      "content": "- **Complete financial toolkit** - Budgeting, taxes, investing, insurance\\n- **Investment strategy** - Asset allocation, index funds, tax-advantaged accounts\\n- **Debt management** - Student loans, credit cards, mortgage basics\\n- **Career planning** - Salary negotiation, benefits evaluation, entrepreneurship"
    }
  ]
}
\`\`\`

### The Long View

Generational wealth is not about creating a trust-fund lifestyle. It is about giving each successive generation a better starting point — less debt, more education, earlier investing, and the financial literacy to make wise decisions.

A \\$100,000 inheritance invested at 8% for 40 years becomes \\$2.17 million. That is the potential of compound growth across generations — if the recipients know how to manage it.

### Key Takeaway

Building generational wealth requires three things: accumulating financial assets, protecting them through estate planning, and transferring financial knowledge to the next generation. The knowledge may be more valuable than the money, because it ensures the wealth compounds rather than dissipates.

> "Someone is sitting in the shade today because someone planted a tree a long time ago." — Warren Buffett

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Generational wealth includes both financial assets AND financial knowledge — without education, 70% of families lose wealth by the second generation",
    "The three pillars are financial assets, real estate, and financial literacy — neglect any one and wealth typically disappears",
    "Tax-efficient transfer strategies like annual gifting, 529 plans, and stepped-up basis can preserve more wealth for heirs",
    "Start teaching financial literacy early and match lessons to your child's age and maturity level",
    "Building generational wealth begins with securing your own financial foundation first — you can't transfer what you don't have"
  ]
}
\`\`\``,
    },
  ],
};
