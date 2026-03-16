import { Module } from "../types";

export const bondsModule: Module = {
  id: "iw-bonds",
  title: "Bonds & Fixed Income",
  description:
    "Understand how bonds work, the relationship between interest rates and bond prices, credit risk, and how fixed income stabilizes a portfolio. Resources: Investopedia, PIMCO Education, Vanguard Fixed Income Research.",
  lessons: [
    {
      id: "iw-how-bonds-work",
      slug: "how-bonds-work",
      title: "How Bonds Work",
      content: `## How Bonds Work

<!-- voice:key_insight insight="A bond is a loan you make to a government or corporation. They pay you interest on a fixed schedule and return your principal at maturity. It is that simple -- and that powerful." -->

Bonds are the second most important asset class after stocks. They provide income, reduce portfolio volatility, and serve as a counterbalance during stock market downturns. Yet many investors skip them entirely because they seem boring. That is a mistake.

### The Anatomy of a Bond

When you buy a bond, you are lending money. Here are the key terms:

| Term | Definition | Example |
|------|-----------|---------|
| **Face Value (Par)** | The amount the bond will pay at maturity | \\$1,000 |
| **Coupon Rate** | The annual interest rate paid on face value | 4% = \\$40/year |
| **Maturity Date** | When the issuer returns your principal | 10 years from issuance |
| **Yield** | Your actual annual return based on purchase price | Varies with market price |
| **Credit Rating** | Risk assessment by agencies (Moody's, S&P, Fitch) | AAA (safest) to D (default) |

### How You Make Money

**Interest payments (coupons):** A \\$1,000 bond with a 4% coupon pays you \\$40/year (typically \\$20 every six months) until maturity.

**Capital gains:** If you buy a bond at a discount (below face value) and hold to maturity, you earn the difference. If you buy a \\$1,000 bond for \\$950 and hold to maturity, you earn \\$50 in capital gains plus all coupon payments.

### Types of Bonds

| Type | Issuer | Risk | Typical Yield |
|------|--------|------|---------------|
| **U.S. Treasury** | Federal government | Virtually zero credit risk | Lower (3-5%) |
| **Municipal** | State/local government | Very low; often tax-exempt | Moderate (2-4%) |
| **Investment-grade corporate** | Strong companies (AAA to BBB) | Low to moderate | Moderate (4-6%) |
| **High-yield (junk)** | Weaker companies (BB and below) | Higher | Higher (6-10%+) |
| **TIPS** | U.S. Treasury, inflation-adjusted | Zero credit risk | Low + inflation |

<!-- voice:section_check concept="bond fundamentals" -->

### The Interest Rate-Bond Price Relationship

This is the most important concept in bond investing, and it confuses nearly everyone at first:

**When interest rates rise, bond prices fall. When interest rates fall, bond prices rise.**

Why? Imagine you hold a bond paying 3%. The Federal Reserve raises rates, and new bonds now pay 5%. Nobody wants your 3% bond at full price anymore -- so its market price drops until its effective yield matches the new rate.

This inverse relationship caused significant losses in 2022 when the Fed raised rates aggressively. The Bloomberg U.S. Aggregate Bond Index fell approximately 13% -- one of the worst years for bonds in modern history.

### Duration: Measuring Interest Rate Sensitivity

**Duration** measures how sensitive a bond's price is to interest rate changes. A bond with a duration of 5 years will lose approximately 5% in value for every 1% rise in interest rates.

| Duration | Rate Rise of 1% | Rate Rise of 2% |
|----------|-----------------|-----------------|
| 2 years | -2% price change | -4% |
| 5 years | -5% | -10% |
| 10 years | -10% | -20% |

Short-duration bonds are safer in rising-rate environments. Long-duration bonds offer higher yields but more volatility.

### Key Takeaway

Bonds are not exciting, and that is precisely the point. They provide predictable income, reduce portfolio volatility, and act as ballast when stocks sink. Every serious investor needs to understand how they work, especially the inverse relationship between interest rates and bond prices.

> "Bonds are the anchor that keeps your portfolio from capsizing in a storm." -- Coach Morgan

*Resources: PIMCO Bond Basics, Investopedia Bond Guide, Vanguard Fixed Income Perspectives.*`,
    },
    {
      id: "iw-bond-strategy",
      slug: "bond-portfolio-strategy",
      title: "Bond Portfolio Strategy",
      content: `## Bond Portfolio Strategy

<!-- voice:key_insight insight="Bonds are not just 'safe investments.' Strategic bond allocation can enhance returns, reduce risk, and provide income throughout market cycles." -->

Now that you understand bond mechanics, let us discuss how to actually use them in your portfolio.

### The Role of Bonds by Life Stage

The traditional rule of thumb: **hold your age as a percentage in bonds**. A 30-year-old holds 30% bonds, 70% stocks. A 60-year-old holds 60% bonds, 40% stocks.

This rule has been updated by Vanguard and other firms. Many advisors now recommend **"age minus 10"** or even **"age minus 20"** because life expectancies are longer and retirees need more growth:

| Age | Traditional | Modern Aggressive | Modern Moderate |
|-----|-------------|-------------------|-----------------|
| 25 | 25% bonds | 5% bonds | 10% bonds |
| 40 | 40% bonds | 20% bonds | 25% bonds |
| 55 | 55% bonds | 35% bonds | 40% bonds |
| 65 | 65% bonds | 45% bonds | 50% bonds |

### Bond Ladder Strategy

A bond ladder spreads your fixed-income investments across different maturity dates. For example, instead of buying one \\$50,000 bond maturing in 10 years, you buy:

- \\$10,000 maturing in 2 years
- \\$10,000 maturing in 4 years
- \\$10,000 maturing in 6 years
- \\$10,000 maturing in 8 years
- \\$10,000 maturing in 10 years

As each bond matures, you reinvest at current rates. This protects you against interest rate risk -- if rates rise, your maturing bonds capture the higher rates. If rates fall, your longer-term bonds lock in the higher rates.

<!-- voice:section_check concept="bond allocation and laddering" -->

### TIPS: Inflation Protection

Treasury Inflation-Protected Securities (TIPS) adjust their principal based on the Consumer Price Index (CPI). If inflation rises 3%, your TIPS principal increases 3%. This makes TIPS the only U.S. government bond that guarantees a real (after-inflation) return.

TIPS are particularly valuable for retirees who need purchasing power protection.

### The 60/40 Portfolio: A Classic That Works

The 60% stocks / 40% bonds portfolio has been a staple of investment management for decades. From 1926 to 2023, a 60/40 portfolio returned approximately 9.1% annually with significantly less volatility than a 100% stock portfolio.

| Portfolio | Avg Annual Return | Worst Year | Recovery Time |
|-----------|-------------------|------------|---------------|
| 100% Stocks | ~10.3% | -43.1% | ~4.5 years |
| 60/40 | ~9.1% | -26.6% | ~2.5 years |
| 40/60 | ~8.0% | -18.4% | ~1.5 years |

The 60/40 portfolio captured about 88% of stock returns with substantially less downside risk.

### When Bonds Fail

2022 was a cautionary tale. Both stocks and bonds fell simultaneously -- the S&P 500 dropped ~19% while the aggregate bond index fell ~13%. This "correlation spike" happens during rapid interest rate increases and is rare but painful. It reminded investors that bonds are not risk-free; they are lower-risk.

### Key Takeaway

Bonds are a tool, and like any tool, their effectiveness depends on how you use them. Match your bond allocation to your life stage, consider a ladder strategy for income needs, and use TIPS to protect against inflation. Bonds may not make you rich, but they help you stay rich.

> "The purpose of bonds is not to make you money. It is to keep you from losing money at the worst possible time." -- Coach Morgan

*Resources: Vanguard Bond Fund Overview, Investopedia Bond Laddering, PIMCO TIPS Guide, Morningstar 60/40 Portfolio Analysis.*`,
    },
    {
      id: "iw-checkpoint-3",
      slug: "iw-checkpoint-3",
      title: "Checkpoint: Bonds & Fixed Income",
      content: `## Module 3 Checkpoint

<!-- voice:section_check concept="bonds and fixed income review" -->

Bonds may seem straightforward, but the details matter enormously. Let us check your understanding.

---

### Question 1 (Multiple Choice)

When interest rates rise, what happens to existing bond prices?

- A) They rise proportionally
- B) They stay the same
- C) They fall
- D) It depends on the stock market

<details>
<summary>Answer</summary>

**C) They fall.** Bond prices and interest rates have an inverse relationship. When new bonds offer higher rates, existing bonds with lower rates become less attractive, and their market price drops to compensate.
</details>

---

### Question 2 (Multiple Choice)

A bond with a duration of 7 years will lose approximately what percentage of its value if interest rates rise by 1%?

- A) 1%
- B) 3.5%
- C) 7%
- D) 14%

<details>
<summary>Answer</summary>

**C) 7%.** Duration approximately equals the percentage price change for a 1% change in interest rates. A 7-year duration bond loses roughly 7% when rates rise 1%.
</details>

---

### Question 3 (Short Answer)

What is a bond ladder, and how does it protect against interest rate risk?

<details>
<summary>Sample Answer</summary>

A bond ladder is a strategy where you buy bonds with staggered maturity dates (e.g., 2, 4, 6, 8, and 10 years). As each bond matures, you reinvest the proceeds at current interest rates. This protects against interest rate risk because if rates rise, your maturing bonds capture the new higher rates. If rates fall, your longer-term bonds still pay the previously locked-in higher rates. The ladder provides a balance between rate exposure and reinvestment opportunity.
</details>

---

### Question 4 (Multiple Choice)

What type of bond adjusts its principal based on inflation?

- A) Municipal bonds
- B) Corporate bonds
- C) TIPS (Treasury Inflation-Protected Securities)
- D) High-yield bonds

<details>
<summary>Answer</summary>

**C) TIPS.** Treasury Inflation-Protected Securities adjust their principal based on the Consumer Price Index. If inflation rises 3%, the TIPS principal increases 3%, guaranteeing a real return above inflation.
</details>

---

### Question 5 (Application)

The classic 60/40 portfolio captured approximately 88% of stock market returns with significantly less volatility. Why might someone still choose a 100% stock portfolio despite this?

<details>
<summary>Sample Answer</summary>

A 100% stock portfolio makes sense for investors with a very long time horizon (20+ years), high risk tolerance, stable income, and no near-term need for the money. Over 30+ year periods, stocks have always outperformed bonds, and the young investor can ride out volatility. The extra ~1.2% annual return (10.3% vs 9.1%) compounds significantly over decades. However, the investor must have the discipline not to sell during the inevitable 30-40% drawdowns.
</details>

---

You have completed Module 3. Next, we will explore the investment vehicles most experts recommend for the majority of investors: index funds and ETFs.`,
    },
  ],
};
