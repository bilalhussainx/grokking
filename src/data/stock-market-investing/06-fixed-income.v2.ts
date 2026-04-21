import { Module } from "../types";

export const fixedIncomeModule: Module = {
  id: "sm-bonds",
  title: "Fixed Income & Bonds",
  description: "Understand the bond market — from basic mechanics and pricing to yield curves and credit analysis.",
  lessons: [
    {
      id: "sm-bonds-basics",
      slug: "bond-basics",
      title: "Bond Basics",
      content: `## Bond Basics

A bond is a loan that you make to a borrower — typically a government or corporation. In exchange for lending your money, the borrower promises to pay you regular interest payments (called coupons) and return your principal at a specified future date (maturity). Bonds are the foundation of the fixed income market, which is actually larger than the stock market by total value outstanding.

### How Bonds Work

When a company or government needs to borrow money, it issues bonds. Each bond has key terms defined at issuance:

| Term | Definition | Example |
|------|-----------|---------|
| **Face Value (Par)** | The principal amount, repaid at maturity | $1,000 |
| **Coupon Rate** | Annual interest rate as a percentage of face value | 5% |
| **Coupon Payment** | Dollar amount of each interest payment | $50/year ($25 semi-annually) |
| **Maturity Date** | When the principal is repaid | January 15, 2035 |
| **Issuer** | The entity borrowing the money | US Treasury, Apple Inc, City of Chicago |

A typical bond: You buy a bond with a $1,000 face value, a 5% coupon rate, and a 10-year maturity. Every six months, you receive $25 (half the annual coupon). At the end of 10 years, you receive your final $25 coupon payment plus the $1,000 face value back.

### Types of Bonds

**Government Bonds:**
- **US Treasury bonds**: Backed by the US government (considered risk-free). Maturities from 2 to 30 years.
- **Treasury notes**: 2 to 10-year maturities
- **Treasury bills (T-bills)**: Less than 1 year, sold at a discount (no coupon)
- **Municipal bonds**: Issued by state and local governments. Interest is typically exempt from federal taxes.
- **Foreign government bonds**: Issued by other countries' governments

**Corporate Bonds:**
- **Investment-grade**: Rated BBB-/Baa3 or above. Lower risk, lower yield.
- **High-yield (junk)**: Rated below BBB-/Baa3. Higher risk of default, higher yield to compensate.

**Other Fixed Income:**
- **Mortgage-backed securities (MBS)**: Pools of home mortgages packaged into bonds
- **Asset-backed securities (ABS)**: Pools of other loans (auto, credit card, student)
- **Convertible bonds**: Can be converted into the issuer's stock
- **Floating-rate notes**: Coupon adjusts with interest rates

### Why Invest in Bonds?

**Income**: Bonds provide predictable cash flow through regular coupon payments.

**Capital preservation**: High-quality bonds (Treasuries, investment-grade) have low default risk, protecting your principal.

**Diversification**: Bonds often move in the opposite direction of stocks, reducing portfolio volatility.

**Deflation hedge**: In deflationary environments (falling prices), fixed bond payments become more valuable in real terms.

### Risks of Bond Investing

| Risk | Description |
|------|-------------|
| **Interest rate risk** | Bond prices fall when interest rates rise |
| **Credit/default risk** | The issuer may fail to make payments |
| **Inflation risk** | Inflation erodes the real value of fixed payments |
| **Reinvestment risk** | Coupons may need to be reinvested at lower rates |
| **Liquidity risk** | Some bonds are difficult to sell quickly at a fair price |
| **Call risk** | The issuer may repay the bond early, forcing reinvestment |

### The Inverse Relationship: Price and Yield

This is the most important concept in bond investing: **when interest rates go up, bond prices go down, and vice versa.**

Why? If you hold a bond paying 4% and new bonds are issued at 5%, no one will pay full price for your 4% bond. Its price must fall until the effective yield matches the market rate. Conversely, if rates drop to 3%, your 4% bond becomes more valuable and its price rises.

### Key Takeaway

Bonds are the conservative anchor of a diversified portfolio. They provide income, reduce volatility, and protect capital. While they are simpler than stocks in many ways, the bond market has its own complexities — interest rate risk, credit risk, and the inverse relationship between prices and yields. Understanding these fundamentals is essential before building the fixed income portion of your portfolio.`,
    },
    {
      id: "sm-bonds-pricing-duration",
      slug: "bond-pricing-duration",
      title: "Bond Pricing & Duration",
      content: `## Bond Pricing & Duration

Bond pricing and duration are the two most important technical concepts for fixed income investors. Price tells you what a bond is worth today. Duration tells you how sensitive that price is to changes in interest rates. Together, they allow you to make informed decisions about which bonds to own and how to manage interest rate risk.

### Bond Pricing

A bond's price is the present value of all its future cash flows — the coupon payments and the return of principal at maturity — discounted at the current market interest rate (yield to maturity).

**Bond Price = Sum of [Coupon / (1 + y)^t] + [Face Value / (1 + y)^n]**

Where:
- Coupon = periodic coupon payment
- y = yield to maturity (per period)
- t = each payment period
- n = total number of periods

**Price vs. Yield example (10-year, 5% coupon, $1,000 face value):**

| Market Yield | Bond Price | Relationship |
|-------------|-----------|-------------|
| 3% | $1,170 | Price above par (premium) — coupon exceeds market rate |
| 5% | $1,000 | Price at par — coupon equals market rate |
| 7% | $859 | Price below par (discount) — coupon is below market rate |

### Premium, Par, and Discount

| Condition | Price | Why |
|-----------|-------|-----|
| **Premium** (above $1,000) | Coupon rate > Market yield | Investors pay extra for the above-market coupon |
| **Par** (exactly $1,000) | Coupon rate = Market yield | The bond pays exactly the market rate |
| **Discount** (below $1,000) | Coupon rate < Market yield | Investors demand a discount for the below-market coupon |

As a bond approaches maturity, its price converges to par value regardless of where it traded before — this is called "pull to par."

### Yield to Maturity (YTM)

YTM is the total annualized return you would earn if you bought the bond at its current price and held it to maturity, reinvesting all coupons at the same rate. It is the bond market's equivalent of an IRR.

YTM accounts for:
- Current coupon payments
- Any gain or loss if you bought at a discount or premium
- The time to maturity
- Reinvestment of coupons

### Duration

Duration measures a bond's sensitivity to interest rate changes. It is expressed in years and tells you approximately how much a bond's price will change for a 1% move in interest rates.

**Modified Duration approximation:**
Price change percentage approximately equals -(Duration x Change in yield)

Example: A bond with duration of 7 years would lose approximately 7% of its value if rates rise by 1%, and gain approximately 7% if rates fall by 1%.

### Factors Affecting Duration

| Factor | Effect on Duration |
|--------|-------------------|
| **Longer maturity** | Higher duration (more rate-sensitive) |
| **Lower coupon rate** | Higher duration (less cash flow received early) |
| **Lower yield** | Higher duration (future cash flows worth more) |
| **Zero coupon bond** | Duration equals maturity (no intermediate cash flows) |

### Types of Duration

**Macaulay Duration**: The weighted average time to receive all cash flows. Measured in years. Primarily a theoretical concept.

**Modified Duration**: Macaulay Duration adjusted for yield. This is the practical measure — it directly tells you price sensitivity.

**Effective Duration**: Accounts for bonds with embedded options (callable bonds, mortgage-backed securities) where cash flows change with interest rates.

### Convexity

Duration is a linear approximation, but the actual price-yield relationship is curved (convex). **Convexity** measures this curvature.

Positive convexity means:
- When rates fall, the bond price rises MORE than duration predicts
- When rates rise, the bond price falls LESS than duration predicts

This is beneficial for investors — you gain more on the upside than you lose on the downside. Bonds with higher convexity are more desirable, all else being equal.

### Practical Application

| If You Expect... | Then... |
|-----------------|---------|
| Rates will rise | Shorten duration (own shorter-term bonds) |
| Rates will fall | Lengthen duration (own longer-term bonds) |
| Rates are uncertain | Hold intermediate duration, diversify across maturities |

### Key Takeaway

Bond pricing is driven by the mathematical relationship between coupon rates and market yields. Duration quantifies the interest rate risk embedded in that relationship. Understanding these concepts allows you to make deliberate choices about the maturity and sensitivity of your bond holdings — matching your interest rate outlook and risk tolerance to your fixed income portfolio.`,
    },
    {
      id: "sm-bonds-treasuries",
      slug: "treasuries",
      title: "US Treasury Securities",
      content: `## US Treasury Securities

US Treasury securities are debt obligations issued by the US Department of the Treasury. They are considered the safest investments in the world because they are backed by the full faith and credit of the US government — the only entity that can levy taxes and, theoretically, print money to meet its obligations. Treasuries form the foundation of the global financial system.

### Types of Treasury Securities

| Security | Maturity | Coupon | Minimum Purchase |
|----------|----------|--------|-----------------|
| **Treasury Bills (T-Bills)** | 4-52 weeks | None (sold at discount) | $100 |
| **Treasury Notes (T-Notes)** | 2-10 years | Semi-annual | $100 |
| **Treasury Bonds (T-Bonds)** | 20-30 years | Semi-annual | $100 |
| **TIPS** | 5, 10, or 30 years | Semi-annual (inflation-adjusted) | $100 |
| **I Bonds** | 30 years (redeemable after 1 year) | Semi-annual (inflation-adjusted) | $25 (electronic) |
| **FRNs** | 2 years | Quarterly (floating rate) | $100 |

### Treasury Bills

T-Bills do not pay coupons. Instead, they are sold at a discount to their face value, and you receive the full face value at maturity. The difference is your return.

Example: You buy a 26-week T-Bill for $975 with a $1,000 face value. At maturity, you receive $1,000. Your return is $25 / $975 = 2.56% over 26 weeks, or approximately 5.2% annualized.

### Treasury Notes and Bonds

T-Notes (2-10 years) and T-Bonds (20-30 years) pay semi-annual coupons at a fixed rate. The 10-year Treasury note is the most important benchmark in finance — its yield is used as the risk-free rate in CAPM, the baseline for mortgage rates, and a barometer of economic expectations.

### TIPS (Treasury Inflation-Protected Securities)

TIPS protect against inflation by adjusting the principal value based on the Consumer Price Index (CPI):
- If CPI rises 3%, the principal increases by 3%
- Coupon payments are calculated on the adjusted principal
- At maturity, you receive the greater of the adjusted principal or the original face value

TIPS are ideal for investors concerned about inflation eroding their purchasing power.

### I Bonds (Series I Savings Bonds)

I Bonds are savings bonds with inflation protection:
- Interest rate has two components: a fixed rate (set at purchase, never changes) plus an inflation rate (adjusts every 6 months based on CPI)
- Cannot be sold on the secondary market (non-marketable)
- Must hold for at least 1 year; penalty of last 3 months' interest if redeemed before 5 years
- Purchase limit of $10,000 per person per year (electronic)
- Tax advantages: federal tax only (exempt from state/local), and tax can be deferred until redemption

### How to Buy Treasuries

**TreasuryDirect (treasurydirect.gov)**: Buy directly from the US government. No fees, no middleman. Best for T-Bills, I Bonds, and TIPS you plan to hold to maturity.

**Through your brokerage**: Most brokerages allow you to buy Treasury securities on the secondary market. Useful for T-Notes and T-Bonds you may want to sell before maturity.

**Treasury ETFs**: Funds like SHY (short-term), IEF (intermediate), and TLT (long-term) provide easy, liquid access to Treasuries.

### The Role of Treasuries in Your Portfolio

Treasuries serve several functions:

1. **Safety**: Capital preservation during market turmoil
2. **Income**: Predictable, reliable cash flow
3. **Diversification**: Low or negative correlation with stocks
4. **Liquidity**: The most liquid securities market in the world
5. **Benchmark**: The risk-free rate against which all other investments are measured

### Tax Treatment

Treasury interest is subject to federal income tax but exempt from state and local taxes. This tax advantage makes Treasuries particularly attractive for investors in high-tax states (New York, California, New Jersey).

### Key Takeaway

US Treasury securities are the bedrock of the global financial system and the safest component of any portfolio. For most investors, Treasury exposure through index bond funds or direct purchases via TreasuryDirect provides the safety, income, and diversification needed for the fixed income portion of their portfolio. Understanding the different types and their characteristics allows you to choose the right Treasury instruments for your specific needs.`,
    },
    {
      id: "sm-bonds-corporate",
      slug: "corporate-bonds-ratings",
      title: "Corporate Bonds & Credit Ratings",
      content: `## Corporate Bonds & Credit Ratings

Corporate bonds are debt securities issued by companies to fund operations, expansions, acquisitions, or refinancing. They offer higher yields than government bonds to compensate for the additional credit risk — the possibility that the company might not be able to make its payments. Understanding credit ratings and credit analysis is essential for evaluating corporate bond investments.

### How Corporate Bonds Work

Corporate bonds function like government bonds — fixed coupon payments and return of principal at maturity — but with a key difference: the issuer can potentially default.

Corporate bonds are typically issued in $1,000 face value increments with semi-annual coupon payments. They trade on the over-the-counter (OTC) market through broker-dealers, which can make pricing less transparent than Treasury bonds.

### Credit Ratings

Credit rating agencies assess the likelihood that a bond issuer will meet its payment obligations. The three major agencies are Standard & Poor's (S&P), Moody's, and Fitch.

| S&P/Fitch | Moody's | Grade | Description |
|-----------|---------|-------|-------------|
| AAA | Aaa | Investment Grade | Highest quality, minimal risk |
| AA+/AA/AA- | Aa1/Aa2/Aa3 | Investment Grade | High quality, very low risk |
| A+/A/A- | A1/A2/A3 | Investment Grade | Upper medium quality |
| BBB+/BBB/BBB- | Baa1/Baa2/Baa3 | Investment Grade | Medium quality, moderate risk |
| BB+/BB/BB- | Ba1/Ba2/Ba3 | High Yield (Junk) | Speculative, substantial risk |
| B+/B/B- | B1/B2/B3 | High Yield | Highly speculative |
| CCC and below | Caa and below | High Yield | Near or in default |

The dividing line between investment grade and high yield (BBB-/Baa3) is one of the most important boundaries in finance. Many institutional investors (pension funds, insurance companies) are only allowed to hold investment-grade bonds. When a bond is downgraded from BBB- to BB+ (a "fallen angel"), these institutions must sell, creating forced selling pressure.

### Credit Spreads

The **credit spread** is the additional yield a corporate bond offers above a comparable Treasury bond:

Credit Spread = Corporate Bond Yield - Treasury Bond Yield of Same Maturity

| Rating | Typical Spread (basis points) |
|--------|-------------------------------|
| AAA | 30-60 bps |
| AA | 50-100 bps |
| A | 80-150 bps |
| BBB | 120-250 bps |
| BB | 200-400 bps |
| B | 350-600 bps |
| CCC | 600-1500+ bps |

Spreads widen during economic stress (investors demand more compensation for risk) and narrow during economic strength (confidence increases). Monitoring credit spreads is a key indicator of market stress.

### Analyzing Corporate Bonds

Key metrics for evaluating corporate bond issuers:

**Leverage ratios:**
- Debt/EBITDA: How many years of earnings to repay debt. Below 3x is conservative; above 5x is aggressive.
- Debt/Equity: How much debt relative to equity. Higher means more financial risk.

**Coverage ratios:**
- Interest Coverage (EBITDA/Interest): How easily the company can cover interest payments. Above 3x is comfortable; below 1.5x is concerning.
- Fixed Charge Coverage: Broader measure including rent, preferred dividends.

**Cash flow metrics:**
- Free Cash Flow / Debt: What portion of debt could be repaid from one year's free cash flow
- Cash on hand relative to upcoming maturities

### Historical Default Rates

| Rating | 5-Year Cumulative Default Rate |
|--------|-------------------------------|
| AAA | 0.1% |
| AA | 0.3% |
| A | 0.7% |
| BBB | 2.4% |
| BB | 8.2% |
| B | 20.1% |
| CCC | 46.8% |

Investment-grade default rates are very low. High-yield default rates are meaningful and must be factored into your expected return. Even with defaults, high-yield bonds have historically provided positive returns on average because the higher yields more than compensate for losses — but diversification is essential.

### Key Takeaway

Corporate bonds offer a risk-return spectrum between ultra-safe Treasuries and volatile equities. Credit ratings provide a standardized framework for assessing default risk, but they are not infallible — always supplement ratings with your own analysis of financial health. For most investors, corporate bond exposure is best achieved through diversified bond funds rather than individual bonds, to spread default risk across hundreds of issuers.`,
    },
    {
      id: "sm-bonds-yield-curves",
      slug: "yield-curves",
      title: "Understanding Yield Curves",
      content: `## Understanding Yield Curves

The yield curve is a graph that plots the interest rates of bonds with different maturities — from short-term (3 months) to long-term (30 years). It is one of the most closely watched indicators in finance because its shape reflects collective market expectations about economic growth, inflation, and monetary policy. Every professional investor monitors the yield curve.

### The Normal Yield Curve

In a healthy economy, the yield curve slopes upward — longer-term bonds offer higher yields than shorter-term bonds:

\`\`\`
Yield
  |                                     ____---
  |                          ____---^^^^
  |               ____---^^^^
  |     ____---^^^
  |_^^^^
  |_________________________________________
  3M    1Y    2Y    5Y    10Y    20Y    30Y
                  Maturity
\`\`\`

Why does it slope upward? Three reasons:
1. **Term premium**: Investors demand extra compensation for locking up their money longer (more uncertainty)
2. **Inflation expectations**: Over longer periods, inflation erodes purchasing power more
3. **Economic growth expectations**: A growing economy tends to push interest rates higher over time

### Yield Curve Shapes

**Normal (Upward Sloping)**: Economy is healthy, growth is expected. Long-term rates exceed short-term rates by a comfortable margin. This is the most common shape.

**Flat**: Short-term and long-term rates are approximately equal. Often occurs during transitions between economic regimes — the market is uncertain about the direction of the economy. Can signal an economic slowdown ahead.

**Inverted (Downward Sloping)**: Short-term rates exceed long-term rates. This is the most ominous shape — it has preceded every US recession since 1960 (with a lead time of 6-18 months).

Why does inversion signal recession? When the market expects the economy to weaken, it anticipates that the central bank will eventually cut short-term rates. Investors buy long-term bonds as a safe haven, driving long-term yields down. Meanwhile, the central bank may still be keeping short-term rates high to fight inflation.

**Steep**: An unusually large gap between short-term and long-term rates. Often seen in the early stages of economic recovery, when the central bank holds short-term rates low while growth expectations push long-term rates higher.

### Key Yield Curve Spreads

| Spread | What It Measures | Significance |
|--------|-----------------|-------------|
| **10Y - 2Y** | Most-watched recession indicator | Inversion preceded every recession since 1960 |
| **10Y - 3M** | Fed's preferred recession indicator | Strong predictive power, research by NY Fed |
| **30Y - 10Y** | Long-term expectations | Reflects inflation and growth outlook |
| **10Y - Fed Funds** | Policy vs. market | Shows market expectations vs. Fed stance |

### The Yield Curve and Fed Policy

The Federal Reserve directly controls very short-term rates (the federal funds rate). Long-term rates are determined by market forces. The interaction between Fed policy and market expectations shapes the yield curve:

- **Fed raises rates**: Short end rises, curve may flatten or invert
- **Fed cuts rates**: Short end falls, curve may steepen
- **Quantitative Easing (QE)**: Fed buys long-term bonds, pushing long-term yields down
- **Quantitative Tightening (QT)**: Fed reduces bond holdings, pushing long-term yields up

### Yield Curve Strategies

**If you expect rates to rise across all maturities**: Shorten duration by holding short-term bonds. This reduces price losses from rising rates.

**If you expect a bull steepener** (short rates fall more than long rates): Hold a barbell — some short-term and some long-term bonds. Benefit from short-term rates falling while long-term bonds may gain less.

**If you expect a flattener** (long rates fall relative to short rates): Extend duration by holding longer-term bonds to capture price gains as long-term yields decline.

### What Investors Should Know

For long-term investors who are not bond traders, the yield curve serves three practical functions:

1. **Economic forecasting**: An inverted curve is a warning to reduce risk exposure and increase cash reserves
2. **Bond selection**: In a steep curve, you get significantly more yield by extending maturity. In a flat curve, there is little reward for taking duration risk.
3. **Context for all investments**: The yield curve affects stock valuations (through discount rates), real estate (through mortgage rates), and corporate profitability (through borrowing costs).

### Key Takeaway

The yield curve is the market's collective forecast of the economic future. A normal upward slope signals confidence. Flattening signals caution. Inversion signals danger. While no indicator is perfect, the yield curve's track record as a recession predictor commands respect. Even if you never trade a bond directly, understanding the yield curve makes you a better investor across all asset classes.`,
    },
  ],
};
