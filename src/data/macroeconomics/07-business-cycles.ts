import { Module } from "../types";

export const businessCyclesModule: Module = {
  id: "macro-cycles",
  title: "Business Cycles & Crises",
  description:
    "Understand business cycle phases, the competing Keynesian and Classical explanations, the IS-LM and AD-AS models, and lessons from the 2008 financial crisis. Resources: Mankiw Macroeconomics, Blanchard Macroeconomics, Bernanke et al.",
  lessons: [
    {
      id: "macro-cycles-phases",
      slug: "business-cycle-phases",
      title: "Business Cycle Phases",
      content: `## Business Cycle Phases

The business cycle describes the recurring pattern of expansion and contraction in economic activity. Understanding where the economy is in the cycle is essential for investment decisions, business planning, and policy-making.

### The Four Phases

**1. Expansion:** Real GDP grows, employment rises, consumer and business confidence increase, investment spending grows. This is the "good times" phase. Expansions have averaged about 5 years in the post-war U.S. economy, though the 2009-2020 expansion lasted a record 128 months.

**2. Peak:** The economy reaches its maximum output. Growth slows, capacity constraints emerge, inflation may accelerate, and the central bank often raises interest rates. Peaks are identified retrospectively by the NBER.

**3. Contraction (Recession):** Real GDP declines, employment falls, business investment contracts, consumer confidence drops. The NBER defines a recession as "a significant decline in economic activity that is spread across the economy and lasts more than a few months." Post-war U.S. recessions have averaged about 11 months.

**4. Trough:** The economy hits its lowest point. Output stabilizes, excess inventory is worked off, the central bank cuts rates aggressively, and conditions set the stage for the next expansion.

### NBER Dating

The National Bureau of Economic Research (NBER) Business Cycle Dating Committee is the official arbiter of U.S. recessions. The committee examines multiple indicators — real GDP, employment, industrial production, personal income, and wholesale-retail sales — rather than relying on any single metric.

Notable U.S. business cycles:

| Recession | Duration | Peak Unemployment | GDP Decline |
|-----------|----------|-------------------|-------------|
| 1973-75 | 16 months | 9.0% | -3.2% |
| 1981-82 | 16 months | 10.8% | -2.7% |
| 2001 | 8 months | 6.3% | -0.3% |
| 2007-09 (Great Recession) | 18 months | 10.0% | -4.3% |
| 2020 (COVID) | 2 months | 14.7% | -19.2% (Q2 annualized) |

### What Causes Business Cycles?

Business cycles are driven by **shocks** — unexpected events that disrupt the economy:

**Demand shocks:** Changes in consumer or business spending, government policy, or financial conditions. The 2008 crisis was primarily a negative demand shock triggered by the collapse of the housing market and financial system.

**Supply shocks:** Changes in production costs or capacity. The 1973 oil embargo was a negative supply shock. The post-COVID supply chain disruptions were supply shocks that contributed to inflation.

**Financial shocks:** Banking crises, credit crunches, and asset price collapses. Reinhart & Rogoff (2009, *This Time Is Different*, Princeton University Press) documented over 800 years of financial crises, finding that banking crises typically lead to deeper and longer recessions than ordinary business cycle downturns.

### Leading, Coincident, and Lagging Indicators

As covered in Module 1, different economic indicators move at different points in the cycle:
- **Leading indicators** (stock market, building permits, new orders) turn before the economy
- **Coincident indicators** (GDP, employment, industrial production) move with the economy
- **Lagging indicators** (unemployment rate, CPI, bank lending) turn after the economy

### The Great Moderation

From approximately 1984 to 2007, business cycle volatility decreased dramatically — GDP fluctuations were smaller, recessions were milder, and inflation was more stable. Stock & Watson (2002, *Has the Business Cycle Changed and Why?*, NBER Macroeconomics Annual) attributed this "Great Moderation" to better monetary policy, structural economic changes, and good luck. The 2008 crisis abruptly ended the Great Moderation — or at least the "good luck" component.

### Key Takeaway

Business cycles are inherent to market economies. While their severity and duration vary, the pattern of expansion, peak, contraction, and trough has repeated throughout economic history. Understanding the current phase of the cycle is essential for investment, business, and policy decisions.

*References: NBER Business Cycle Dating Committee; Reinhart & Rogoff (2009), This Time Is Different (Princeton); Stock & Watson (2002), NBER Macroeconomics Annual; Burns & Mitchell (1946), Measuring Business Cycles (NBER).*`,
    },
    {
      id: "macro-cycles-keynesian-classical",
      slug: "keynesian-vs-classical",
      title: "Keynesian vs Classical Views",
      content: `## Keynesian vs Classical Views

The debate between Keynesian and Classical economics is the defining intellectual conflict in macroeconomics. It centers on a fundamental question: **Are market economies self-correcting, or do they require active government intervention to maintain full employment?**

### The Classical View

**Core belief:** Markets are self-correcting. If left alone, the economy automatically returns to full employment through flexible prices and wages.

**Key propositions:**
1. **Say's Law:** "Supply creates its own demand." Production generates enough income to purchase all output. General overproduction is impossible.
2. **Flexible prices and wages:** If there is a surplus of labor (unemployment), wages fall, making it profitable to hire more workers. Prices adjust until all markets clear.
3. **Monetary neutrality:** Changes in the money supply affect only the price level, not real output or employment (the classical dichotomy).
4. **Government intervention is unnecessary and often harmful.** Fiscal stimulus crowds out private spending; monetary expansion causes inflation.

Classical economics dominated from Adam Smith (1776) through the early 20th century. Its modern descendants include **New Classical economics** (Lucas, Sargent, Barro) and **Real Business Cycle theory** (Kydland & Prescott).

### The Keynesian View

**Core belief:** Markets can fail to self-correct. Economies can get stuck in prolonged periods of high unemployment because prices and wages are "sticky" — they do not adjust quickly enough.

**Key propositions:**
1. **Demand determines output** in the short run. If aggregate demand falls (consumers and businesses stop spending), output falls and workers are laid off — regardless of whether prices eventually adjust.
2. **Sticky prices and wages:** Menu costs, long-term contracts, efficiency wages, and money illusion prevent rapid adjustment. In the time it takes for prices to fully adjust, millions of workers may lose their jobs and years of output may be lost.
3. **The paradox of thrift:** If everyone tries to save more during a recession, aggregate demand falls further, reducing income and making saving even harder. Individual virtue becomes collective vice.
4. **Government has a role:** Fiscal and monetary policy can stabilize the economy, reducing the severity and duration of recessions.

### The Great Depression: The Defining Battle

The Great Depression (1929-1939) was the crucible that tested both views:

**Classical prediction:** Prices and wages would fall, restoring equilibrium. The economy would self-correct.

**What happened:** Unemployment reached 25%, GDP fell 47%, and the economy showed no signs of self-correction after three years. Wages and prices did fall — but so did demand, in a vicious deflationary spiral.

Keynes (1936) argued that the classical model failed because in a severe downturn, falling wages reduce income and spending, further depressing demand. The economy can reach a **equilibrium below full employment** — a concept the classical model denied was possible.

### The New Keynesian Synthesis

Modern macroeconomics has converged on a **New Keynesian** framework that incorporates insights from both traditions:

- From Classical economics: rational expectations, microfoundations, long-run neutrality of money
- From Keynesian economics: sticky prices/wages, short-run non-neutrality of money, the role of aggregate demand, the effectiveness of stabilization policy

Woodford (2003, *Interest and Prices*, Princeton University Press) provided the definitive synthesis, building a model with rational, forward-looking agents in a world of sticky prices — demonstrating that monetary policy can stabilize the economy even when people are fully rational.

### Policy Implications

| Issue | Classical | Keynesian |
|-------|----------|-----------|
| Recessions | Self-correcting | Require intervention |
| Fiscal policy | Crowding out; ineffective | Effective, especially in recessions |
| Monetary policy | Affects prices only | Affects real output in short run |
| Unemployment | Voluntary or frictional | Can be involuntary |
| Government role | Minimal | Active stabilization |

### Key Takeaway

The Keynesian-Classical debate is not about whether markets work — both sides agree they do in the long run. The debate is about how long the "long run" takes and how much damage occurs while waiting. Keynes's famous retort captures the stakes: "In the long run we are all dead."

*References: Keynes (1936), The General Theory; Lucas (1976), Econometric Policy Evaluation; Woodford (2003), Interest and Prices (Princeton); Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-cycles-islm",
      slug: "is-lm-model",
      title: "The IS-LM Model",
      content: `## The IS-LM Model

The IS-LM model, developed by John Hicks (1937, *Mr. Keynes and the Classics*, Econometrica; Nobel Prize 1972), is the workhorse model for analyzing the simultaneous determination of output and interest rates. It synthesizes the goods market (IS) and the money market (LM) into a single framework.

### The IS Curve (Investment-Saving)

The IS curve shows all combinations of the interest rate (r) and output (Y) where the goods market is in equilibrium — planned spending equals output.

\`\`\`
Y = C(Y-T) + I(r) + G + NX
\`\`\`

**The IS curve slopes downward** because a lower interest rate stimulates investment, increasing aggregate demand and output.

**Shifts of the IS curve:**
- Increase in G → IS shifts right (higher output at every r)
- Tax cut → IS shifts right
- Increase in consumer confidence → IS shifts right
- Decrease in exports → IS shifts left

### The LM Curve (Liquidity Preference-Money Supply)

The LM curve shows all combinations of r and Y where the money market is in equilibrium — money demand equals money supply.

\`\`\`
M/P = L(r, Y)
\`\`\`

Money demand depends positively on Y (more transactions) and negatively on r (higher opportunity cost of holding money).

**The LM curve slopes upward** because higher output increases money demand; to maintain money market equilibrium, the interest rate must rise.

**Shifts of the LM curve:**
- Increase in money supply → LM shifts right (lower r at every Y)
- Increase in money demand → LM shifts left

### Equilibrium

The economy is in simultaneous equilibrium at the intersection of IS and LM — both the goods market and money market clear at the same (r, Y) pair.

### Fiscal and Monetary Policy in the IS-LM Model

**Fiscal expansion** (increase G or cut T):
- IS shifts right
- Output rises, interest rate rises
- The rise in interest rates partially crowds out private investment (partial offset)

**Monetary expansion** (increase money supply):
- LM shifts right
- Output rises, interest rate falls
- Lower rates stimulate investment (no crowding out)

**Policy mix:** Using both fiscal and monetary policy simultaneously can achieve desired combinations of r and Y. For example, fiscal expansion + monetary expansion shifts both IS and LM right — increasing output with a smaller change in interest rates.

### The Liquidity Trap

If the interest rate falls to zero (the ZLB), the LM curve becomes horizontal at r = 0. In this case:
- Monetary policy is ineffective — the Fed cannot push rates below zero
- Fiscal policy is highly effective — there is no crowding out because rates cannot rise
- This is the IS-LM justification for aggressive fiscal stimulus during the Great Recession and COVID-19

Krugman (1998, *It's Baaack: Japan's Slump and the Return of the Liquidity Trap*, Brookings Papers on Economic Activity) used the IS-LM framework to analyze Japan's "Lost Decade" and argue for unconventional monetary policy (quantitative easing).

### Modern Relevance

While central banks today use the more sophisticated New Keynesian DSGE models for policy analysis, the IS-LM model remains the standard teaching tool because:
- It captures the core interactions between goods and money markets
- It clearly illustrates fiscal and monetary policy effects
- It explains the liquidity trap and the ZLB constraint
- It provides intuition that more complex models often obscure

Mankiw (2006, *The Macroeconomist as Scientist and Engineer*, Journal of Economic Perspectives) argued that IS-LM remains "the right model" for policy discussion — simple enough to be transparent, rich enough to capture first-order effects.

### Key Takeaway

The IS-LM model shows how fiscal policy (shifting IS) and monetary policy (shifting LM) jointly determine output and interest rates. It remains the most useful framework for understanding the short-run macroeconomic effects of policy changes.

*References: Hicks (1937), Econometrica; Krugman (1998), Brookings Papers; Mankiw (2006), Journal of Economic Perspectives; Blanchard (2021), Macroeconomics (Pearson).*`,
    },
    {
      id: "macro-cycles-adas",
      slug: "ad-as-model",
      title: "The AD-AS Model",
      content: `## The AD-AS Model

The Aggregate Demand-Aggregate Supply (AD-AS) model is the framework for analyzing the determination of the overall price level and real GDP. It extends the IS-LM model by explicitly incorporating the price level, enabling analysis of inflation, deflation, and supply shocks.

### Aggregate Demand (AD)

The AD curve shows all combinations of the price level (P) and real output (Y) where both the goods market and money market are in equilibrium. It is derived from the IS-LM model: when the price level rises, real money balances (M/P) fall, the LM curve shifts left, and output falls.

**AD slopes downward for three reasons:**

1. **Wealth effect (Pigou effect):** Higher prices reduce the real value of households' financial assets → less consumption
2. **Interest rate effect (Keynes effect):** Higher prices reduce real money balances → interest rates rise → less investment
3. **Exchange rate effect (Mundell-Fleming effect):** Higher prices → higher interest rates → currency appreciates → net exports fall

### Aggregate Supply

**Short-Run Aggregate Supply (SRAS)** slopes upward because:
- Sticky wages: wages are set by contracts and adjust slowly; higher output prices increase profit margins
- Sticky prices: some firms adjust prices slowly (menu costs, contracts)
- Misperceptions: firms temporarily confuse general price increases with relative price increases for their own products (Lucas, 1972)

**Long-Run Aggregate Supply (LRAS)** is vertical at the economy's potential output (Y*). In the long run, all prices and wages fully adjust, and output depends only on real factors (capital, labor, technology) — not the price level.

### Short-Run Equilibrium

The economy's short-run equilibrium is at the intersection of AD and SRAS. This may be above, below, or at potential output.

### Long-Run Adjustment

If the economy is below potential (recession):
- Unemployment is high → wages gradually fall → SRAS shifts right
- The economy returns to Y* at a lower price level (or lower inflation rate)
- This is the classical self-correction mechanism — but it may take years

If the economy is above potential (overheating):
- Labor markets are tight → wages rise → SRAS shifts left
- The economy returns to Y* at a higher price level
- This adjustment is typically faster (inflation accelerates quickly)

### Analyzing Shocks

**Demand shock (recession):** AD shifts left
- Short run: output falls, price level falls (or inflation decreases)
- Long run: wages and prices adjust, economy returns to Y*
- Policy response: fiscal or monetary stimulus shifts AD back right

**Supply shock (stagflation):** SRAS shifts left
- Short run: output falls, price level rises (stagflation)
- Long run: if no policy response, wages eventually fall and SRAS shifts back
- Policy dilemma: expansionary policy addresses unemployment but worsens inflation; contractionary policy addresses inflation but worsens unemployment

### The AD-AS Model and the COVID-19 Recession

The COVID-19 shock was both a demand and supply shock:
- **Demand shock:** Lockdowns reduced consumer spending dramatically (AD shifted left)
- **Supply shock:** Factory closures and supply chain disruptions reduced production capacity (SRAS shifted left)

The unprecedented fiscal and monetary response (AD shifted right aggressively) restored output but — combined with persistent supply constraints — generated the 2021-2023 inflation surge. The AD-AS model predicted this outcome: if AD shifts right faster than SRAS shifts right, the result is higher prices (Blanchard, 2023).

### Key Takeaway

The AD-AS model is the most comprehensive short-run macroeconomic framework. It explains recessions (AD shifts left), inflation (AD shifts right or SRAS shifts left), stagflation (SRAS shifts left), and the self-correcting mechanism that eventually restores full employment in the long run.

*References: Lucas (1972), Journal of Economic Theory; Blanchard (2023), Fiscal Policy Under Low Interest Rates (MIT); Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-cycles-2008",
      slug: "financial-crises-2008",
      title: "Financial Crises: 2008",
      content: `## The 2008 Financial Crisis

The 2008 global financial crisis was the most severe economic disruption since the Great Depression. It destroyed \\\$2 trillion in bank capital, triggered the longest U.S. recession since World War II, and reshaped economic thinking about financial regulation, monetary policy, and the limits of free markets.

### Origins: The Housing Bubble

The crisis had roots in the U.S. housing market:

1. **Loose lending standards:** Banks issued mortgages to borrowers with poor credit ("subprime" loans), often with adjustable rates, no down payment, and minimal documentation ("NINJA loans" — No Income, No Job, No Assets).

2. **Securitization:** Banks bundled mortgages into Mortgage-Backed Securities (MBS) and sold them to investors worldwide. This dispersed risk but also disconnected originators from the consequences of bad lending.

3. **Rating agency failure:** Moody's, S&P, and Fitch rated these securities AAA (investment grade) despite containing risky subprime mortgages — using models that assumed housing prices would never fall nationally.

4. **Excessive leverage:** Major financial institutions operated with leverage ratios of 20:1 to 30:1 (or higher with off-balance-sheet entities). Small percentage declines in asset values could wipe out capital entirely.

5. **Housing price bubble:** U.S. home prices rose 124% from 1997-2006 (Case-Shiller Index). When prices stopped rising in 2006 and began to fall, the entire edifice collapsed.

### The Crisis Unfolds (2007-2009)

**2007:** Subprime mortgage defaults spike. Two Bear Stearns hedge funds collapse. BNP Paribas freezes three investment funds.

**March 2008:** Bear Stearns collapses and is acquired by JPMorgan (with Fed assistance) at \\\$2/share (down from \\\$172).

**September 2008:** Lehman Brothers files for bankruptcy (\\\$639 billion in assets — the largest bankruptcy in history). The government takes over Fannie Mae and Freddie Mac. AIG receives an \\\$85 billion emergency loan from the Fed. Panic spreads through global financial markets.

**October-December 2008:** Congress passes the \\\$700 billion Troubled Asset Relief Program (TARP). Stock markets lose 40%+ of their value. Credit markets freeze — even healthy companies cannot borrow.

### The Macroeconomic Impact

| Indicator | Pre-Crisis (2007) | Worst Point | Recovery |
|-----------|------------------|-------------|----------|
| Real GDP | +1.9% | -8.9% (Q4 2008) | +2.7% (2010) |
| Unemployment | 4.6% | 10.0% (Oct 2009) | 4.7% (2016) |
| S&P 500 | 1,468 | 677 (Mar 2009) | 1,468 (Mar 2013) |
| Home prices | Peak | -33% (2012) | Recovered by 2016 |

### The Policy Response

**Federal Reserve:**
- Cut the federal funds rate from 5.25% to 0-0.25%
- Launched QE1 (\\\$1.75 trillion in asset purchases)
- Created emergency lending facilities (over \\\$1 trillion in credit)
- Bernanke's decision to let Lehman fail remains the most debated policy choice of the crisis

**Congress/Treasury:**
- TARP: \\\$700 billion to recapitalize banks
- ARRA stimulus: \\\$787 billion in spending and tax cuts
- Auto industry bailout: \\\$80 billion for GM and Chrysler

### Regulatory Reforms

The **Dodd-Frank Wall Street Reform Act (2010)** was the most significant financial regulation since the 1930s:
- Created the Financial Stability Oversight Council (FSOC)
- Established the Consumer Financial Protection Bureau (CFPB)
- Imposed stress testing and higher capital requirements for large banks
- Restricted proprietary trading (Volcker Rule)
- Required central clearing of standardized derivatives

### Lessons Learned

Bernanke, Geithner & Paulson (2019, *Firefighting: The Financial Crisis and Its Lessons*, Penguin) identified key lessons:

1. **Financial crises can happen in advanced economies** — they are not limited to emerging markets
2. **Leverage is the accelerant** — small shocks become catastrophic when the system is highly leveraged
3. **Speed of response matters** — delays in providing liquidity and recapitalizing banks deepen and prolong crises
4. **Regulation must evolve with financial innovation** — securitization, derivatives, and shadow banking created risks that pre-crisis regulation did not address
5. **Moral hazard is real but manageable** — the alternative to bailouts (systemic collapse) is worse

### Key Takeaway

The 2008 crisis demonstrated that financial instability can devastate the real economy and that the tools of macroeconomics — monetary policy, fiscal stimulus, and financial regulation — are essential for preventing and mitigating catastrophic economic events.

> "More money has been lost because of four words than at the point of a gun. Those words are: 'This time is different.'" — Carmen Reinhart & Kenneth Rogoff

*References: Bernanke, Geithner & Paulson (2019), Firefighting (Penguin); Reinhart & Rogoff (2009), This Time Is Different (Princeton); Financial Crisis Inquiry Commission (2011), Final Report; Gorton (2010), Slapped by the Invisible Hand (Oxford).*`,
    },
  ],
};
