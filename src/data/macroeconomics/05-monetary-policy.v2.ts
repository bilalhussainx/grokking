import { Module } from "../types";

export const monetaryPolicyModule: Module = {
  id: "macro-monetary",
  title: "Monetary Policy",
  description: "Explore how central banks manage the money supply and interest rates — the Federal Reserve's tools, open market operations, quantitative easing, and the Taylor Rule. Resources: Mankiw Macroeconomics, Mishkin Economics of Money Banking and Financial Markets.",
  lessons: [
    {
      id: "macro-monetary-central-banks",
      slug: "central-banks",
      title: "Central Banks",
      content: `## Central Banks

A central bank is the institution responsible for managing a nation's money supply, setting interest rates, and maintaining financial stability. It is arguably the most powerful economic institution in any country — its decisions affect every business, household, and financial market.

### The Federal Reserve System

The Federal Reserve ("the Fed"), established in 1913, is the central bank of the United States. Its structure reflects the political compromise between centralized control and regional representation:

- **Board of Governors** — 7 members appointed by the President, confirmed by the Senate, for 14-year terms. Located in Washington, D.C.
- **12 Regional Federal Reserve Banks** — located in major cities across the country
- **Federal Open Market Committee (FOMC)** — the policy-making body that sets the federal funds rate. Consists of the 7 governors plus 5 of the 12 regional bank presidents (rotating).

### The Dual Mandate

The Federal Reserve Act (amended 1977) gives the Fed two objectives:
1. **Maximum employment** — keep unemployment close to its natural rate
2. **Stable prices** — the Fed interprets this as 2% inflation (measured by core PCE)

These goals can conflict. Reducing inflation may require raising interest rates, which increases unemployment. The art of central banking is balancing these objectives — what Alan Blinder called "driving while looking through the rearview mirror" (Blinder, 1998, *Central Banking in Theory and Practice*, MIT Press).

### Independence

Central bank independence — the ability to make monetary policy decisions without political interference — is considered essential for credible inflation control. Politicians face incentives to stimulate the economy before elections, leading to higher inflation. Alesina & Summers (1993, *Central Bank Independence and Macroeconomic Performance*, Journal of Money, Credit and Banking) found that countries with more independent central banks have lower average inflation without sacrificing growth.

### Other Major Central Banks

| Central Bank | Mandate | Key Rate |
|-------------|---------|----------|
| European Central Bank (ECB) | Price stability (below but close to 2%) | Main refinancing rate |
| Bank of England (BoE) | 2% inflation target | Bank Rate |
| Bank of Japan (BoJ) | 2% inflation target (often missed) | Overnight call rate |
| People's Bank of China (PBoC) | Multiple: stability, growth, exchange rate | Loan Prime Rate |

### Lender of Last Resort

Central banks serve as the lender of last resort during financial crises — providing liquidity to solvent but illiquid banks to prevent bank runs and systemic collapse. This function, articulated by Bagehot (1873, *Lombard Street*), proved critical during the 2008 financial crisis when the Fed extended over \\$1 trillion in emergency lending to financial institutions.

### Central Bank Communication

Modern central banks rely heavily on communication — "forward guidance" — to shape market expectations. By signaling future policy intentions, the Fed can affect long-term interest rates and financial conditions before actually changing the policy rate. Woodford (2005, *Central Bank Communication and Policy Effectiveness*, NBER) argued that managing expectations is at least as important as the actual setting of the policy rate.

### Key Takeaway

Central banks are the guardians of monetary stability. Their independence, credibility, and communication are essential for maintaining low inflation, stable financial markets, and sustainable economic growth.

*References: Blinder (1998), Central Banking in Theory and Practice (MIT); Alesina & Summers (1993), Journal of Money, Credit and Banking; Bagehot (1873), Lombard Street; Woodford (2005), NBER.*`,
    },
    {
      id: "macro-monetary-interest-rates",
      slug: "interest-rates-and-money-supply",
      title: "Interest Rates & Money Supply",
      content: `## Interest Rates & the Money Supply

The relationship between interest rates and the money supply is the transmission mechanism of monetary policy. By controlling the money supply, the central bank influences interest rates, which in turn affect investment, consumption, asset prices, and ultimately output and inflation.

### The Money Supply

Money supply is measured in several aggregates:

| Measure | Components |
|---------|-----------|
| **M0 (Monetary Base)** | Currency in circulation + bank reserves at the Fed |
| **M1** | M0 + demand deposits + other checkable deposits |
| **M2** | M1 + savings deposits + small time deposits + money market funds |

The Fed directly controls M0 (the monetary base). M1 and M2 are determined by the interaction of the Fed, commercial banks, and the public through the money multiplier process.

### The Money Multiplier

Banks hold only a fraction of deposits as reserves and lend the rest. This creates a multiplier:
\`\`\`
Money Multiplier = 1 / Reserve Ratio
\`\`\`

If the reserve ratio is 10%, each dollar of reserves supports \\$10 of deposits. However, the actual multiplier is smaller because banks hold excess reserves and the public holds cash.

Since 2008, the traditional money multiplier has broken down. Massive excess reserves (created by quantitative easing) did not produce proportional increases in lending — partly because banks were recapitalizing and partly because demand for loans was weak (Mishkin, 2019, *The Economics of Money, Banking, and Financial Markets*, Pearson).

### The Federal Funds Rate

The **federal funds rate** is the interest rate at which banks lend reserves to each other overnight. It is the primary tool of monetary policy because it influences all other short-term interest rates.

**Transmission mechanism:**
\`\`\`
Fed changes federal funds rate
→ Short-term interest rates change
→ Long-term rates change (via expectations)
→ Asset prices change (stocks, bonds, real estate)
→ Investment, consumption, and net exports change
→ Output and inflation change
\`\`\`

This chain has multiple links, each with uncertain timing and magnitude — which is why monetary policy is often described as "pulling on a string" (easy to push the economy down with high rates, harder to pull it up with low rates).

### The Liquidity Preference Theory

Keynes (1936) proposed that the interest rate is determined by the supply and demand for money:

- **Money demand** decreases as the interest rate rises (higher rates mean higher opportunity cost of holding non-interest-bearing money)
- **Money supply** is set by the central bank (vertical line)

The equilibrium interest rate clears the money market.

### The Fisher Effect

Nominal interest rates adjust for expected inflation:
\`\`\`
Nominal Rate = Real Rate + Expected Inflation
\`\`\`

If the central bank increases the money supply and this raises inflation expectations, nominal rates will eventually rise — not fall. This long-run positive relationship between money growth and interest rates (the Fisher effect) contrasts with the short-run negative relationship (increasing money supply lowers rates temporarily).

Friedman (1968) emphasized this distinction: "Low interest rates are generally a sign that monetary policy has been tight — in the sense that the quantity of money has grown slowly. High interest rates are a sign that monetary policy has been easy."

### The Zero Lower Bound

When the federal funds rate reaches zero, the Fed cannot lower it further (the "zero lower bound" or ZLB). This constraint was binding from 2008-2015 and briefly during COVID-19, forcing the Fed to use unconventional tools (quantitative easing, forward guidance) to provide additional stimulus.

### Key Takeaway

The central bank controls the money supply and thereby influences interest rates, which affect the entire economy. Understanding the transmission mechanism — and its limitations at the zero lower bound — is essential for evaluating monetary policy decisions.

*References: Keynes (1936), The General Theory; Friedman (1968), American Economic Review; Mishkin (2019), Economics of Money, Banking, and Financial Markets (Pearson).*`,
    },
    {
      id: "macro-monetary-omo",
      slug: "open-market-operations",
      title: "Open Market Operations",
      content: `## Open Market Operations

Open market operations (OMOs) are the primary tool through which the Federal Reserve implements monetary policy. By buying and selling government securities, the Fed expands or contracts the money supply, steering the federal funds rate toward its target.

### How OMOs Work

**Expansionary (buying bonds):**
1. The Fed buys Treasury securities from banks and dealers
2. Payment is credited to the sellers' reserve accounts at the Fed
3. Bank reserves increase → more funds available for lending
4. The federal funds rate falls (more supply of reserves)

**Contractionary (selling bonds):**
1. The Fed sells Treasury securities to banks and dealers
2. Payment is debited from the buyers' reserve accounts
3. Bank reserves decrease → fewer funds available for lending
4. The federal funds rate rises (less supply of reserves)

### The Federal Funds Market

Banks are required to maintain minimum reserves. Banks with excess reserves lend to banks with deficient reserves in the federal funds market. The interest rate in this market — the federal funds rate — is the operational target of monetary policy.

The FOMC sets a **target range** for the federal funds rate (e.g., 5.25%-5.50%) and the New York Fed's Open Market Trading Desk conducts OMOs to keep the effective rate within that range.

### The Reserves Framework

Since 2008, the Fed has operated in an "ample reserves" framework. With trillions of dollars in excess reserves (created by QE), the traditional mechanism of adjusting reserve scarcity through small OMOs is less relevant. Instead, the Fed uses two administered rates to control the federal funds rate:

- **Interest on Reserve Balances (IORB):** The rate the Fed pays banks on their reserves. This acts as a floor — banks will not lend below the rate they can earn risk-free from the Fed.
- **Overnight Reverse Repo Rate (ON RRP):** The rate the Fed pays non-bank financial institutions (money market funds) for overnight deposits. This creates a secondary floor.

These tools allow the Fed to control short-term rates even with abundant reserves — a significant innovation in monetary policy implementation (Ihrig, Meade & Weinbach, 2015, *Monetary Policy 101*, Federal Reserve Board).

### Permanent vs Temporary OMOs

**Permanent OMOs:** Outright purchases or sales of securities that permanently change the size of the Fed's balance sheet. Used for secular adjustments to the money supply.

**Temporary OMOs (repos and reverse repos):** Short-term lending arrangements that temporarily adjust reserves. The Fed buys securities with an agreement to sell them back (repo) or sells with an agreement to repurchase (reverse repo). Used for day-to-day management of money market conditions.

### Historical Context

OMOs were not always the primary tool. Before 1920, the Fed relied primarily on the discount rate. The shift to OMOs occurred after the Fed discovered (somewhat accidentally) during the 1920s that buying government securities expanded bank reserves and stimulated lending (Friedman & Schwartz, 1963, *A Monetary History of the United States*).

The importance of OMOs was cemented by the Treasury-Federal Reserve Accord of 1951, which freed the Fed from the obligation to maintain low interest rates on Treasury debt, allowing it to conduct independent monetary policy through OMOs.

### Key Takeaway

Open market operations are the mechanism through which monetary policy decisions are translated into changes in the money supply and interest rates. Understanding OMOs is essential for understanding how central bank announcements translate into real economic effects.

*References: Friedman & Schwartz (1963), A Monetary History of the United States (Princeton); Ihrig, Meade & Weinbach (2015), Federal Reserve Board; Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-monetary-qe",
      slug: "quantitative-easing",
      title: "Quantitative Easing",
      content: `## Quantitative Easing

Quantitative easing (QE) is an unconventional monetary policy tool in which a central bank purchases large quantities of financial assets — primarily government bonds and mortgage-backed securities — to lower long-term interest rates and stimulate the economy when the conventional tool (the federal funds rate) is already at or near zero.

### Why QE Was Needed

By December 2008, the Fed had cut the federal funds rate to 0-0.25% — the zero lower bound. The economy was in free fall (GDP contracted 8.9% in Q4 2008), but the Fed had exhausted its conventional ammunition. QE was the emergency response.

### How QE Works

**1. Portfolio balance channel:** By buying long-term bonds, the Fed reduces their supply in the market, pushing down long-term interest rates. Lower long-term rates reduce mortgage rates, corporate borrowing costs, and discount rates — stimulating investment and consumption.

**2. Signaling channel:** QE signals the Fed's commitment to keeping monetary policy accommodative for an extended period, reinforcing forward guidance.

**3. Wealth effect:** Lower rates push up asset prices (stocks, bonds, real estate), increasing household wealth and encouraging spending.

### The Fed's QE Programs

| Program | Period | Purchases | Balance Sheet Impact |
|---------|--------|-----------|---------------------|
| QE1 | 2008-2010 | \\$1.75 trillion (MBS + Treasuries) | \\$900B → \\$2.3T |
| QE2 | 2010-2011 | \\$600 billion (Treasuries) | \\$2.3T → \\$2.9T |
| Operation Twist | 2011-2012 | Sold short-term, bought long-term (no net expansion) | Unchanged |
| QE3 | 2012-2014 | \\$85B/month (open-ended) | \\$2.9T → \\$4.5T |
| COVID QE | 2020-2022 | Unlimited initially, then \\$120B/month | \\$4.2T → \\$8.9T |

### Did QE Work?

The evidence suggests QE was effective but with diminishing returns:

Gagnon et al. (2011, *The Financial Market Effects of the Federal Reserve's Large-Scale Asset Purchases*, International Journal of Central Banking) found that QE1 reduced 10-year Treasury yields by approximately 50-100 basis points — a substantial effect equivalent to cutting the federal funds rate by 1.5-3 percentage points.

Krishnamurthy & Vissing-Jorgensen (2011, *The Effects of Quantitative Easing on Interest Rates*, Brookings Papers on Economic Activity) found that QE's primary effect operated through reducing mortgage rates and risk premiums, rather than through the traditional money supply channel.

### Criticisms and Risks

**1. Inflation risk:** Creating trillions of dollars in new money was feared to cause inflation. In the event, inflation remained below 2% for most of the QE era (2009-2020) — partly because the money went into excess reserves rather than circulating in the economy.

**2. Asset price inflation:** Critics argue QE inflated stock and real estate prices, benefiting wealthy asset owners while doing little for workers and the poor — increasing wealth inequality (Montecino & Epstein, 2017, *Did Quantitative Easing Increase Income Inequality?*, PERI Working Paper).

**3. Moral hazard:** Persistent QE may encourage excessive risk-taking by creating an expectation that the Fed will always intervene during market downturns (the "Fed put").

**4. Diminishing returns:** Each successive round of QE appears to have had smaller effects on interest rates and economic activity.

### Quantitative Tightening (QT)

The reverse of QE — the Fed allows bonds to mature without reinvesting the proceeds, gradually shrinking its balance sheet. The Fed began QT in 2022, reducing its balance sheet at up to \\$95 billion per month. The challenge is tightening without disrupting financial markets — the 2019 "repo market crisis" demonstrated the risks of reducing reserves too quickly.

### Key Takeaway

QE was an unprecedented experiment that lowered long-term interest rates, stabilized financial markets, and supported economic recovery — but at the cost of an enormous central bank balance sheet and concerns about inequality and moral hazard. Its legacy will shape monetary policy thinking for decades.

*References: Gagnon et al. (2011), International Journal of Central Banking; Krishnamurthy & Vissing-Jorgensen (2011), Brookings Papers; Bernanke (2020), The New Tools of Monetary Policy (Brookings).*`,
    },
    {
      id: "macro-monetary-taylor",
      slug: "the-taylor-rule",
      title: "The Taylor Rule",
      content: `## The Taylor Rule

The Taylor Rule is a formula that prescribes how a central bank should set its interest rate target based on inflation and the output gap. Proposed by John Taylor (1993, *Discretion Versus Policy Rules in Practice*, Carnegie-Rochester Conference Series on Public Policy), it has become the most influential monetary policy rule in both academic research and central bank practice.

### The Formula

\`\`\`
Federal Funds Rate = r* + pi + 0.5(pi - pi*) + 0.5(y - y*)
\`\`\`

Where:
- r* = equilibrium real interest rate (approximately 2%)
- pi = current inflation rate
- pi* = target inflation rate (2% for the Fed)
- y = actual real GDP (log)
- y* = potential real GDP (log)
- (y - y*) = output gap (positive when economy is above potential)

### Interpretation

The rule says: start with the neutral rate (r* + pi*), then adjust upward if inflation exceeds the target and/or if output exceeds potential.

**Inflation above target:** The coefficient of 0.5 on the inflation gap means the Fed should raise the nominal rate by more than one-for-one with inflation — ensuring the **real** interest rate rises. This is the **Taylor principle** — arguably the most important insight of the rule. If the real rate does not rise when inflation does, monetary policy is effectively accommodating the inflation, allowing it to spiral.

**Output above potential:** The coefficient of 0.5 on the output gap means the Fed should lean against overheating — raising rates when the economy is running hot and cutting when it is running cool.

### Example Calculation

Suppose: r* = 2%, current inflation = 4%, target inflation = 2%, output gap = 1%:
\`\`\`
Rate = 2 + 4 + 0.5(4 - 2) + 0.5(1) = 2 + 4 + 1 + 0.5 = 7.5%
\`\`\`

The Taylor Rule prescribes 7.5% — significantly above the 4% inflation rate, ensuring a positive real rate.

### Historical Fit

Taylor (1993) showed that the rule closely tracked actual Fed policy during the Volcker-Greenspan era (1987-1993). However, there are notable departures:

- **2002-2006:** The actual federal funds rate was well below the Taylor Rule prescription (1% vs 3-4%). Taylor argued this excessively loose policy fueled the housing bubble and contributed to the 2008 financial crisis (Taylor, 2009, *Getting Off Track*, Hoover Institution Press).

- **2009-2015:** The Taylor Rule prescribed negative rates (as low as -5%), which were impossible to implement. This motivated the use of QE and forward guidance as unconventional substitutes.

- **2021-2022:** The Taylor Rule suggested much earlier and more aggressive rate increases than the Fed actually implemented, as the Fed initially characterized inflation as "transitory."

### Variations and Extensions

Several modifications have been proposed:

**Inertia (smoothing):** Adding a lagged interest rate term to avoid abrupt changes:
\`\`\`
Rate(t) = 0.85 × Rate(t-1) + 0.15 × Taylor Rule Rate
\`\`\`

**Higher output gap coefficient:** Some economists (including Janet Yellen) prefer a coefficient of 1.0 on the output gap rather than 0.5, giving more weight to employment.

**Asset prices:** Should the Taylor Rule include stock market or housing prices? Bernanke & Gertler (2001, *Should Central Banks Respond to Movements in Asset Prices?*, American Economic Review) argued no — respond only to the extent asset prices affect inflation and output forecasts.

### Rules vs Discretion

The Taylor Rule represents the broader debate between:
- **Rules** — commit to a systematic, predictable policy framework (reduces uncertainty, anchors expectations)
- **Discretion** — allow policymakers to respond flexibly to unique circumstances

Kydland & Prescott (1977, *Rules Rather Than Discretion*, Journal of Political Economy; Nobel Prize 2004) proved that discretionary policy is time-inconsistent — policymakers are tempted to deviate from announced plans, undermining credibility. Rules, by tying the central bank's hands, can produce better outcomes.

In practice, most central banks follow a "constrained discretion" approach — using rules like the Taylor Rule as a benchmark while retaining the flexibility to deviate in extraordinary circumstances.

### Key Takeaway

The Taylor Rule provides a simple, transparent framework for monetary policy. Its greatest contribution is the Taylor Principle — the insight that central banks must raise real interest rates in response to rising inflation, not just nominal rates. Deviations from the rule have often coincided with policy errors.

*References: Taylor (1993), Carnegie-Rochester Conference Series; Kydland & Prescott (1977), Journal of Political Economy; Taylor (2009), Getting Off Track (Hoover); Bernanke & Gertler (2001), American Economic Review.*`,
    },
  ],
};
