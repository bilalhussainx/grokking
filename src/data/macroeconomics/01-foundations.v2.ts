import { Module } from "../types";

export const foundationsModule: Module = {
  id: "macro-foundations",
  title: "Foundations of Macroeconomics",
  description: "Understand the big picture — what macroeconomics studies, how GDP is measured, the difference between real and nominal, price indices, and key economic indicators. Resources: Mankiw Macroeconomics, Blanchard Macroeconomics, Bureau of Economic Analysis.",
  lessons: [
    {
      id: "macro-foundations-what-is-macro",
      slug: "what-is-macroeconomics",
      title: "What is Macroeconomics?",
      content: `## What is Macroeconomics?

Macroeconomics studies the economy as a whole — aggregate output, employment, inflation, and economic growth. While microeconomics examines individual markets and decisions, macroeconomics asks the big questions: Why do economies grow? Why do recessions happen? What determines the overall price level?

### The Birth of Macroeconomics

Macroeconomics as a distinct field was born from the Great Depression. Before the 1930s, the prevailing view held that markets were self-correcting — unemployment would automatically resolve through wage adjustments. The Depression shattered this belief: by 1933, U.S. unemployment reached 25%, industrial output had fallen 47% from its 1929 peak, and the economy showed no signs of self-correction.

John Maynard Keynes (1936, *The General Theory of Employment, Interest and Money*, Macmillan) argued that aggregate demand — the total spending in the economy — could be persistently insufficient, trapping the economy in a low-output, high-unemployment equilibrium. This insight revolutionized economics and created the field of macroeconomics.

### The Three Central Questions

**1. What determines the level of economic output (GDP)?**
In the short run, output fluctuates around its potential — expansions and recessions. In the long run, output growth depends on technology, capital accumulation, and human capital.

**2. What determines the price level and inflation?**
Why do prices generally rise over time? What determines whether inflation is 2% or 20%? And why is deflation dangerous?

**3. What determines employment and unemployment?**
Why can millions of willing workers not find jobs during recessions? Is there a natural rate of unemployment that the economy gravitates toward?

### Macroeconomic Goals

Governments pursue three primary macroeconomic objectives:

| Goal | Measure | Target |
|------|---------|--------|
| **Economic growth** | Real GDP growth rate | 2-3% per year (developed economies) |
| **Price stability** | Inflation rate (CPI) | ~2% per year (most central banks) |
| **Full employment** | Unemployment rate | 4-5% (natural rate, U.S.) |

These goals can conflict. Stimulating growth may increase inflation. Reducing inflation may increase unemployment. Managing these trade-offs is the central challenge of macroeconomic policy.

### Macroeconomic Schools of Thought

**Keynesian economics:** Emphasizes aggregate demand, market failures, and the role of government (fiscal policy) in stabilizing the economy. Dominant from the 1930s-1970s and resurgent after 2008.

**Monetarism:** Milton Friedman (1963, *A Monetary History of the United States*, Princeton) argued that the money supply is the primary determinant of economic activity and inflation. "Inflation is always and everywhere a monetary phenomenon."

**New Classical:** Robert Lucas (1976) and others emphasized rational expectations and argued that systematic government policy is ineffective because people anticipate and offset it.

**New Keynesian:** Combines Keynesian insights with rigorous microfoundations. Emphasizes sticky prices and wages as the source of short-run non-neutrality of money. The dominant framework in modern central banking (Mankiw, 2021, *Macroeconomics*, Worth).

### Why Macroeconomics Matters

Macroeconomic conditions affect every person and every business:
- Recessions destroy jobs, wipe out savings, and cause long-term damage to career prospects (Kahn, 2010, *The Long-Term Labor Market Consequences of Graduating from College in a Bad Economy*, Labour Economics)
- Inflation erodes purchasing power, particularly for retirees and fixed-income earners
- Interest rate policy affects mortgage rates, business investment, and asset prices

### Key Takeaway

Macroeconomics provides the framework for understanding the forces that shape the overall economy — growth, recessions, inflation, and unemployment. The debates between schools of thought are not merely academic; they directly determine the policies that affect billions of lives.

*References: Keynes (1936), The General Theory; Friedman & Schwartz (1963), A Monetary History of the United States (Princeton); Mankiw (2021), Macroeconomics (Worth); Kahn (2010), Labour Economics.*`,
    },
    {
      id: "macro-foundations-gdp-measurement",
      slug: "gdp-measurement",
      title: "GDP Measurement",
      content: `## GDP Measurement

Gross Domestic Product (GDP) is the most widely used measure of an economy's total output. It represents the market value of all final goods and services produced within a country's borders during a specific period. GDP is the single number most closely watched by policymakers, investors, and the public.

### Definition

\`\`\`
GDP = Market value of all final goods and services produced within a country in a given period
\`\`\`

Key terms:
- **Market value** — goods are valued at their market prices, allowing aggregation
- **Final goods** — only goods sold to the end user count (intermediate goods are excluded to avoid double-counting)
- **Within a country** — GDP measures production by location, not by nationality
- **In a given period** — GDP is a flow variable (per quarter or per year), not a stock

### Three Approaches to Measuring GDP

Because every dollar spent is a dollar earned, GDP can be measured three equivalent ways:

**1. Expenditure Approach (most common):**
\`\`\`
GDP = C + I + G + NX
\`\`\`

| Component | Definition | U.S. Share (2023) |
|-----------|-----------|------------------|
| **C** (Consumption) | Household spending on goods and services | ~68% |
| **I** (Investment) | Business spending on capital + residential construction + inventory changes | ~18% |
| **G** (Government) | Government spending on goods and services (not transfers) | ~17% |
| **NX** (Net Exports) | Exports - Imports | ~-3% |

**2. Income Approach:**
\`\`\`
GDP = Wages + Rent + Interest + Profits + Depreciation + Net Foreign Factor Income + Indirect Taxes
\`\`\`

**3. Production (Value-Added) Approach:**
Sum the value added at each stage of production across all industries. Value added = output - intermediate inputs.

All three methods yield the same GDP figure by definition — this is the national income accounting identity (Kuznets, 1941, *National Income and Its Composition*, NBER).

### U.S. GDP: Scale and Composition

U.S. GDP in 2023 was approximately \\$27.4 trillion (Bureau of Economic Analysis). The U.S. accounts for about 26% of world GDP, followed by China (~17%), Japan (~4%), and Germany (~4%).

### What GDP Does NOT Measure

GDP has well-known limitations:

1. **Non-market production** — household labor (cooking, childcare, cleaning) is excluded. Folbre (2001, *The Invisible Heart*, New Press) estimated U.S. household production at 20-30% of GDP.
2. **Underground economy** — illegal activities and unreported income are excluded. Schneider (2005) estimated the shadow economy at 7-8% of U.S. GDP and 25-40% in developing countries.
3. **Environmental degradation** — GDP counts pollution-producing output as positive but does not subtract environmental damage.
4. **Income distribution** — GDP per capita can rise while most people see no improvement if gains are concentrated at the top.
5. **Leisure and quality of life** — A country could increase GDP by working more hours, but welfare may decrease.

Robert Kennedy (1968) famously criticized GDP: "It measures everything, in short, except that which makes life worthwhile."

### Alternative Measures

**GDP per capita** — adjusts for population size, enabling cross-country comparisons.

**Purchasing Power Parity (PPP)** — adjusts for differences in price levels across countries. India's GDP per capita at market exchange rates is about \\$2,500, but at PPP it is about \\$9,000.

**Human Development Index (HDI)** — combines income, education, and life expectancy (UNDP).

**Genuine Progress Indicator (GPI)** — adjusts GDP for income distribution, environmental costs, and non-market contributions.

### Key Takeaway

GDP is an imperfect but indispensable measure of economic activity. It enables comparisons across time and across countries and serves as the foundation for virtually all macroeconomic analysis. Understanding what it measures — and what it does not — is essential for interpreting economic data.

*References: Kuznets (1941), National Income and Its Composition (NBER); Bureau of Economic Analysis; Folbre (2001), The Invisible Heart (New Press); Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-foundations-real-nominal",
      slug: "real-vs-nominal-gdp",
      title: "Real vs Nominal GDP",
      content: `## Real vs Nominal GDP

One of the most important distinctions in macroeconomics is between nominal and real values. Nominal GDP measures output using current prices, while real GDP adjusts for inflation — isolating changes in the actual quantity of goods and services produced.

### The Problem with Nominal GDP

If nominal GDP rises from \\$20 trillion to \\$22 trillion, did the economy produce 10% more goods and services? Not necessarily. If prices rose by 10% and output stayed the same, nominal GDP would increase by 10% with zero real growth. Nominal GDP conflates price changes with output changes.

### Definitions

**Nominal GDP:** Output valued at current-year prices.
\`\`\`
Nominal GDP = Sum of (P_current × Q_current) for all goods
\`\`\`

**Real GDP:** Output valued at base-year prices, removing the effect of price changes.
\`\`\`
Real GDP = Sum of (P_base × Q_current) for all goods
\`\`\`

### Example

An economy produces only two goods — pizza and coffee:

| Year | Pizza Price | Pizza Qty | Coffee Price | Coffee Qty | Nominal GDP | Real GDP (base=2020) |
|------|-----------|----------|-------------|-----------|------------|---------------------|
| 2020 | \\$10 | 100 | \\$3 | 200 | \\$1,600 | \\$1,600 |
| 2021 | \\$12 | 110 | \\$4 | 210 | \\$2,160 | \\$1,730 |
| 2022 | \\$14 | 105 | \\$5 | 220 | \\$2,570 | \\$1,710 |

Nominal GDP grew 35% from 2020 to 2021 — but real GDP grew only 8.1%. The remaining growth was inflation.

From 2021 to 2022, nominal GDP grew 19%, but real GDP actually *fell* by 1.2%. The economy was in a real recession masked by inflation.

### The GDP Deflator

The GDP deflator converts nominal GDP to real GDP:

\`\`\`
GDP Deflator = (Nominal GDP / Real GDP) × 100
\`\`\`

\`\`\`
Real GDP = Nominal GDP / (GDP Deflator / 100)
\`\`\`

The GDP deflator measures the overall price level for all domestically produced goods and services. Unlike the CPI (next lesson), it is not based on a fixed basket — it automatically adjusts for changes in the composition of output.

For 2021 in our example: Deflator = (2,160 / 1,730) × 100 = 124.9

### Chain-Weighted Real GDP

The Bureau of Economic Analysis uses a chain-weighted method that updates the base year continuously, averaging price weights from adjacent years. This avoids the "substitution bias" that occurs when consumers shift spending toward goods whose relative prices have fallen — a bias that fixed-base methods cannot capture (Landefeld, Seskin & Fraumeni, 2008, *Taking the Pulse of the Economy*, Journal of Economic Perspectives).

### Why Real GDP Matters

Real GDP is the measure that matters for living standards, business cycles, and policy:

- **Economic growth** is measured by the growth rate of real GDP, not nominal GDP
- **Recessions** are officially defined (in the U.S.) by the NBER as "a significant decline in economic activity" — measured in real terms
- **Per-capita living standards** are compared using real GDP per capita at PPP

### Real vs Nominal in Other Contexts

The real-nominal distinction applies beyond GDP:

| Variable | Nominal | Real |
|----------|---------|------|
| GDP | Current-price output | Constant-price output |
| Interest rate | Stated rate | Nominal rate minus inflation |
| Wages | Dollar amount on paycheck | Purchasing power of wages |
| Exchange rate | Currency price | Adjusted for relative price levels |

The **Fisher equation** relates real and nominal interest rates:
\`\`\`
Real Interest Rate ≈ Nominal Interest Rate - Inflation Rate
\`\`\`

Named after Irving Fisher (1930, *The Theory of Interest*, Macmillan), this approximation is central to monetary economics.

### Key Takeaway

Always think in real terms. Nominal values are misleading because they mix quantity changes with price changes. Real GDP, real wages, and real interest rates strip away the inflation illusion and reveal what is actually happening in the economy.

*References: Landefeld, Seskin & Fraumeni (2008), Journal of Economic Perspectives; Fisher (1930), The Theory of Interest; Bureau of Economic Analysis; Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-foundations-deflator-cpi",
      slug: "gdp-deflator-and-cpi",
      title: "GDP Deflator & CPI",
      content: `## GDP Deflator & CPI

Two primary measures track the overall price level: the GDP deflator and the Consumer Price Index (CPI). While both measure inflation, they differ in scope, methodology, and the questions they answer.

### The Consumer Price Index (CPI)

The CPI measures the cost of a fixed basket of goods and services purchased by a typical urban consumer. The Bureau of Labor Statistics (BLS) surveys prices of approximately 80,000 items per month across 23,000 retail outlets in 75 urban areas.

**How CPI is calculated:**
\`\`\`
CPI = (Cost of basket in current period / Cost of basket in base period) × 100
\`\`\`

**The basket** includes eight major categories with approximate weights (2023):

| Category | Weight |
|----------|--------|
| Housing (shelter, utilities) | 34% |
| Transportation | 16% |
| Food & beverages | 15% |
| Medical care | 8% |
| Education & communication | 7% |
| Recreation | 6% |
| Apparel | 3% |
| Other | 11% |

**Inflation rate:**
\`\`\`
Inflation = ((CPI_current - CPI_previous) / CPI_previous) × 100
\`\`\`

### CPI Biases

The Boskin Commission (1996, chaired by Michael Boskin of Stanford) estimated that the CPI overstates inflation by approximately 1.1 percentage points per year due to four biases:

**1. Substitution bias (0.4 pp):** When beef prices rise, consumers buy more chicken. The fixed basket does not reflect this substitution, overstating the cost of maintaining the same utility level.

**2. New product bias (0.3 pp):** The basket is updated infrequently. New products (smartphones, streaming services) that improve quality of life are not immediately included.

**3. Quality change bias (0.3 pp):** A \\$1,000 computer today is far more powerful than a \\$1,000 computer in 2005. If the price stays the same but quality improves, the effective price per unit of computing has fallen — but the CPI does not fully capture this.

**4. Outlet substitution bias (0.1 pp):** Consumers shift toward discount retailers (Walmart, Costco, Amazon). The CPI may not fully reflect these savings.

The BLS has addressed some biases (using geometric means for substitution since 1999), but the CPI likely still overstates inflation by 0.5-0.8 percentage points per year.

### GDP Deflator vs CPI

| Feature | CPI | GDP Deflator |
|---------|-----|-------------|
| **Scope** | Consumer goods and services only | All domestically produced goods (including investment, government, exports) |
| **Basket** | Fixed (updated infrequently) | Variable (changes with production mix) |
| **Imports** | Included (consumers buy imported goods) | Excluded (only domestic production) |
| **Substitution bias** | Present (fixed basket) | Absent (variable basket) |
| **Published by** | Bureau of Labor Statistics | Bureau of Economic Analysis |
| **Frequency** | Monthly | Quarterly |

### Core Inflation

**Core CPI** excludes food and energy prices, which are volatile:
\`\`\`
Core CPI = CPI excluding food and energy
\`\`\`

The Federal Reserve prefers the **Personal Consumption Expenditures (PCE) Price Index** for policy decisions. Core PCE tends to run 0.3-0.5 percentage points below core CPI because it uses a broader basket, accounts for substitution, and uses different weights. The Fed's 2% inflation target is defined in terms of core PCE.

### Why Inflation Measurement Matters

Even small measurement errors compound dramatically over time. If inflation is overstated by 1 percentage point per year:
- Real GDP growth is understated by 1 pp/year
- Social Security payments (indexed to CPI) are higher than necessary — costing the government an estimated \\$148 billion per decade (Congressional Budget Office, 2022)
- Tax brackets (indexed to CPI) are too generous — reducing tax revenue
- Real wage growth is understated — workers may be better off than statistics suggest

### Key Takeaway

The CPI and GDP deflator are complementary price measures. The CPI tracks the cost of living for consumers; the GDP deflator tracks the price of domestic production. Both are essential for converting nominal values to real values and for guiding monetary policy.

*References: Boskin Commission Report (1996); Bureau of Labor Statistics CPI Documentation; Congressional Budget Office (2022); Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-foundations-indicators",
      slug: "economic-indicators",
      title: "Economic Indicators",
      content: `## Economic Indicators

Economic indicators are statistical measures that provide insights into the current state and future direction of the economy. Investors, policymakers, and businesses rely on these indicators to make decisions about investment, policy, and strategy.

### Classification by Timing

| Type | Definition | Examples |
|------|-----------|---------|
| **Leading indicators** | Change before the economy changes direction | Stock market, building permits, consumer confidence, new orders |
| **Coincident indicators** | Move simultaneously with the economy | GDP, employment, industrial production, personal income |
| **Lagging indicators** | Change after the economy has already shifted | Unemployment rate, CPI, prime rate, average duration of unemployment |

### The Conference Board Leading Economic Index (LEI)

The LEI combines 10 leading indicators into a single index. Three consecutive monthly declines in the LEI have preceded every U.S. recession since 1960 with a lead time of 7-20 months (Conference Board, 2023).

The 10 components:
1. Average weekly hours (manufacturing)
2. Average weekly initial claims for unemployment insurance
3. New orders for consumer goods
4. ISM new orders index
5. New orders for nondefense capital goods
6. Building permits for new private housing
7. S&P 500 stock index
8. Leading Credit Index
9. Interest rate spread (10-year Treasury minus federal funds rate)
10. Average consumer expectations for business conditions

### Key Individual Indicators

**GDP Growth Rate:** The broadest measure of economic health. The U.S. has averaged approximately 2-3% real GDP growth since World War II. Two consecutive quarters of negative real GDP growth is often used as a rule-of-thumb definition of recession (though the NBER uses a broader assessment).

**Unemployment Rate:** The percentage of the labor force that is jobless and actively seeking work. The U.S. natural rate is estimated at approximately 4-5%. The unemployment rate is a lagging indicator — it continues rising even after the economy has begun to recover.

**Inflation Rate (CPI/PCE):** The rate at which the general price level increases. The Federal Reserve targets 2% inflation as measured by the PCE deflator. Inflation above this target prompts interest rate increases; inflation below it may prompt cuts.

**Interest Rates:** The federal funds rate (the overnight interbank lending rate) is the primary tool of monetary policy. The yield curve — the spread between long-term and short-term rates — is a powerful recession predictor. An **inverted yield curve** (short-term rates exceed long-term rates) has preceded every U.S. recession since 1955 with only one false signal (Estrella & Mishkin, 1996, *The Yield Curve as a Predictor of U.S. Recessions*, Current Issues in Economics and Finance, Federal Reserve Bank of New York).

**Consumer Confidence:** The Conference Board Consumer Confidence Index measures how optimistic consumers feel about the economy. Since consumer spending represents 68% of GDP, confidence shifts can be self-fulfilling — pessimistic consumers spend less, reducing GDP, confirming their pessimism.

**Purchasing Managers' Index (PMI):** Based on a monthly survey of supply chain managers. A PMI above 50 indicates expansion; below 50 indicates contraction. The ISM Manufacturing PMI has a strong correlation with GDP growth and is released on the first business day of each month — making it one of the earliest monthly indicators.

### Interpreting Indicators: Common Pitfalls

**1. Revisions:** Initial GDP estimates are frequently revised. The Bureau of Economic Analysis releases advance (1 month), second (2 months), and third (3 months) estimates, each incorporating more complete data. Initial estimates can be revised by a full percentage point.

**2. Seasonal adjustment:** Raw economic data contains seasonal patterns (holiday spending, construction shutdowns in winter). Seasonally adjusted data removes these patterns to reveal underlying trends — but the adjustment process itself introduces estimation error.

**3. Data mining:** With hundreds of indicators available, it is always possible to find one that supports any narrative. Responsible analysis uses multiple indicators and established frameworks.

**4. Correlation vs causation:** The Super Bowl Indicator (NFC wins correlate with stock market gains) is a classic example of spurious correlation. Always demand theoretical justification for indicator relationships.

### The Sahm Rule

Claudia Sahm (2019, *Direct Stimulus Payments to Individuals*, Brookings Institution) developed a recession indicator based on the unemployment rate: a recession has begun when the three-month moving average of the national unemployment rate rises by 0.5 percentage points or more relative to its low in the previous 12 months. This rule has correctly identified every U.S. recession since 1970 in real time.

### Key Takeaway

Economic indicators are the dashboard of the macroeconomy. No single indicator tells the full story — effective analysis requires monitoring multiple indicators, understanding their timing properties, and recognizing their limitations.

*References: Estrella & Mishkin (1996), Federal Reserve Bank of New York; Conference Board (2023), Leading Economic Index Methodology; Sahm (2019), Brookings Institution; Bureau of Economic Analysis.*`,
    },
  ],
};
