import { Module } from "../types";

export const unemploymentInflationModule: Module = {
  id: "macro-unemployment",
  title: "Unemployment & Inflation",
  description:
    "Analyze the two primary macroeconomic pathologies — unemployment and inflation — their measurement, causes, the Phillips Curve trade-off, and the challenge of stagflation. Resources: Mankiw Macroeconomics, Blanchard Macroeconomics, BLS Data.",
  lessons: [
    {
      id: "macro-unemployment-types",
      slug: "types-of-unemployment",
      title: "Types of Unemployment",
      content: `## Types of Unemployment

Unemployment — the condition of being willing and able to work but unable to find a job — is one of the most closely watched macroeconomic indicators. Not all unemployment is the same, however. Understanding the different types is essential for designing appropriate policy responses.

### The Three Types

**1. Frictional Unemployment**

Frictional unemployment occurs when workers are between jobs — searching for new employment, transitioning between careers, or entering the labor force for the first time. It exists even in a perfectly healthy economy because matching workers with jobs takes time.

Frictional unemployment is generally short-term and voluntary. A software engineer who quits to find a better position, a recent graduate searching for their first job, or a worker relocating to a new city all represent frictional unemployment. Search theory, developed by Diamond, Mortensen & Pissarides (Nobel Prize 2010), models how workers and firms search for each other in labor markets with imperfect information.

**2. Structural Unemployment**

Structural unemployment occurs when workers' skills, locations, or characteristics do not match the jobs available. Unlike frictional unemployment, structural unemployment can be long-term and painful.

Causes include:
- **Technological change** — automation eliminates manufacturing jobs while creating tech jobs requiring different skills
- **Globalization** — trade shifts production to lower-cost countries, displacing domestic workers
- **Geographic mismatch** — jobs are in one region but workers are in another and cannot easily relocate
- **Institutional barriers** — minimum wages above equilibrium, occupational licensing requirements, union wage premiums

Autor, Dorn & Hanson (2013, *The China Syndrome*, American Economic Review) found that U.S. manufacturing regions most exposed to Chinese import competition experienced persistent employment declines — structural unemployment that did not self-correct over decades.

**3. Cyclical Unemployment**

Cyclical unemployment is caused by insufficient aggregate demand during economic downturns. When the economy contracts, firms reduce output and lay off workers. It is the type most directly addressed by macroeconomic stabilization policy (fiscal and monetary).

During the 2008-2009 Great Recession, U.S. unemployment peaked at 10.0% (October 2009), with approximately 5 percentage points attributable to cyclical factors — the largest cyclical unemployment spike since the early 1980s (BLS).

### The Natural Rate of Unemployment

The **natural rate** (also called NAIRU — Non-Accelerating Inflation Rate of Unemployment) is the unemployment rate that prevails when the economy is at its potential output:

\`\`\`
Natural Rate = Frictional Unemployment + Structural Unemployment
\`\`\`

Cyclical unemployment is zero when the economy is at the natural rate. The U.S. natural rate is estimated at approximately 4-5%, though it changes over time with demographics, technology, and labor market institutions (Congressional Budget Office, 2024).

### Full Employment Does Not Mean Zero Unemployment

"Full employment" means cyclical unemployment is zero — the economy is at its potential. Frictional and structural unemployment still exist. An economy with 4% unemployment can be at full employment if the natural rate is 4%.

### Key Takeaway

The three types of unemployment have different causes and require different solutions. Frictional unemployment needs better job-matching; structural unemployment needs retraining and mobility; cyclical unemployment needs demand-side stimulus. Effective policy requires correctly diagnosing which type dominates.

*References: Diamond, Mortensen & Pissarides (2010), Nobel Prize Lectures; Autor, Dorn & Hanson (2013), American Economic Review; CBO (2024), Natural Rate Estimates; BLS Current Population Survey.*`,
    },
    {
      id: "macro-unemployment-measuring",
      slug: "measuring-unemployment",
      title: "Measuring Unemployment",
      content: `## Measuring Unemployment

The unemployment rate is the most widely reported labor market statistic, but its calculation involves important choices about who counts as unemployed, employed, or out of the labor force. Understanding these definitions reveals both the strengths and limitations of the headline number.

### The Bureau of Labor Statistics (BLS) Definitions

The BLS classifies the civilian working-age population (16+) into three groups:

**Employed:** Persons who worked at least 1 hour for pay during the survey reference week, or who had a job but were temporarily absent (vacation, illness).

**Unemployed:** Persons who (1) did not work during the reference week, (2) were available for work, and (3) had actively searched for work in the prior 4 weeks.

**Not in the Labor Force:** Everyone else — retirees, students, homemakers, discouraged workers, disabled persons.

### The Unemployment Rate

\`\`\`
Unemployment Rate = (Unemployed / Labor Force) × 100
Labor Force = Employed + Unemployed
Labor Force Participation Rate = (Labor Force / Working-Age Population) × 100
\`\`\`

Data comes from the **Current Population Survey (CPS)** — a monthly survey of approximately 60,000 households conducted by the Census Bureau for the BLS.

### Alternative Measures (U-1 through U-6)

The BLS publishes six measures of labor underutilization:

| Measure | Definition | Rate (Dec 2023) |
|---------|-----------|----------------|
| U-1 | Unemployed 15+ weeks | 1.2% |
| U-2 | Job losers + completed temporary jobs | 1.8% |
| **U-3** | **Official unemployment rate** | **3.7%** |
| U-4 | U-3 + discouraged workers | 3.9% |
| U-5 | U-4 + marginally attached workers | 4.5% |
| **U-6** | **U-5 + part-time for economic reasons** | **7.1%** |

U-6 is often considered the broadest and most comprehensive measure of labor market slack. It was 17.1% at the peak of the Great Recession — nearly double the official U-3 rate of 10.0%.

### Discouraged Workers and Hidden Unemployment

**Discouraged workers** have given up looking for work because they believe no jobs are available. Because they are not actively searching, they are classified as "not in the labor force" rather than unemployed. This means the official unemployment rate can understate true joblessness, particularly during prolonged recessions.

During the COVID-19 pandemic (April 2020), the labor force participation rate fell from 63.3% to 60.2% — approximately 8 million people left the labor force entirely, most of whom would be classified as "hidden unemployment" (BLS).

### The Employment-Population Ratio

\`\`\`
E/P Ratio = Employed / Working-Age Population
\`\`\`

This ratio is not affected by people entering or leaving the labor force, making it a cleaner measure of labor market health. The U.S. E/P ratio was 64.7% before the 2008 recession, fell to 58.2% in 2010, and did not fully recover until 2023.

### International Comparisons

Cross-country unemployment comparisons require caution because definitions vary. The OECD uses a standardized definition to improve comparability:

| Country | Unemployment Rate (2023) |
|---------|------------------------|
| Japan | 2.6% |
| Germany | 3.1% |
| United States | 3.6% |
| Canada | 5.4% |
| France | 7.3% |
| Spain | 11.7% |

These differences reflect structural factors (labor market flexibility, social safety nets, education systems) rather than simply cyclical conditions. Blanchard (2006, *European Unemployment*, Economic Policy) attributed Europe's historically higher unemployment to more rigid labor markets and generous unemployment benefits that reduce job search intensity.

### Key Takeaway

The unemployment rate is a useful but imperfect measure. It misses discouraged workers, underemployed part-timers, and quality-of-employment issues. Always examine U-6, the labor force participation rate, and the E/P ratio for a fuller picture of the labor market.

*References: BLS Handbook of Methods; Blanchard (2006), Economic Policy; OECD Employment Outlook 2023.*`,
    },
    {
      id: "macro-unemployment-inflation-causes",
      slug: "causes-of-inflation",
      title: "Causes of Inflation",
      content: `## Causes of Inflation

Inflation is a sustained increase in the general price level. A one-time price spike is not inflation — inflation requires prices to keep rising over time. Understanding its causes is essential for monetary policy and financial planning.

### Demand-Pull Inflation

Demand-pull inflation occurs when aggregate demand grows faster than aggregate supply — "too much money chasing too few goods."

Sources of excess demand:
- Expansionary fiscal policy (government spending or tax cuts)
- Expansionary monetary policy (lower interest rates, quantitative easing)
- Consumer or business confidence surges
- Export booms or foreign capital inflows

The post-COVID inflation of 2021-2023 had significant demand-pull elements: massive fiscal stimulus (\\\$5+ trillion in U.S. pandemic relief), combined with pent-up demand from lockdowns, flooded the economy with spending power (Blanchard, 2023, *Fiscal Policy Under Low Interest Rates*, MIT Press).

### Cost-Push Inflation

Cost-push inflation originates from the supply side — rising production costs push prices higher.

Sources:
- **Energy price shocks** — the 1973 OPEC oil embargo quadrupled oil prices, causing inflation to spike above 12% in the U.S.
- **Supply chain disruptions** — COVID-19 disrupted global supply chains, creating shortages and price increases in 2021-2022
- **Wage-price spirals** — workers demand higher wages to keep up with inflation, raising production costs, leading to higher prices, which triggers further wage demands
- **Currency depreciation** — a weaker currency raises the cost of imported goods

### Built-In (Expectations) Inflation

Inflation expectations are self-fulfilling. If workers and firms expect 5% inflation, workers demand 5% wage increases, firms raise prices by 5% to cover higher costs, and the 5% inflation materializes — regardless of the original cause.

Friedman (1968, *The Role of Monetary Policy*, American Economic Review) and Phelps (1967) independently argued that expectations are the critical determinant of inflation dynamics. Once inflation expectations become "unanchored" — no longer aligned with the central bank's target — controlling inflation becomes much more costly.

The Federal Reserve's success in maintaining low inflation from 1990-2020 was largely attributed to well-anchored expectations. Surveys show that long-term inflation expectations (University of Michigan Survey, 5-10 year horizon) remained near 2-3% even during the 2021-2023 inflation spike — suggesting expectations remained anchored (Federal Reserve Board, 2023).

### The Quantity Theory of Money

The oldest explanation of inflation is the quantity theory, formalized by Irving Fisher:
\`\`\`
M × V = P × Y
\`\`\`

Where M = money supply, V = velocity of money, P = price level, Y = real output.

If V and Y are relatively stable, an increase in M leads proportionally to an increase in P. Friedman's dictum: "Inflation is always and everywhere a monetary phenomenon" (Friedman, 1963).

This explains hyperinflations (Zimbabwe 2008: 79.6 billion percent per month; Venezuela 2018: estimated 1 million percent per year) where governments printed money to finance deficits.

However, the relationship between money growth and inflation has weakened in developed economies since the 1980s. Massive increases in the money supply after 2008 (quantitative easing) did not produce proportional inflation — partly because velocity fell and partly because much of the new money went into financial assets rather than consumer spending.

### Costs of Inflation

| Cost | Description |
|------|------------|
| **Shoe-leather costs** | Time and effort spent minimizing cash holdings |
| **Menu costs** | Expense of updating prices (catalogs, menus, vending machines) |
| **Relative price distortion** | Not all prices adjust simultaneously, distorting resource allocation |
| **Tax distortion** | Inflation interacts with the tax code (taxing nominal capital gains) |
| **Redistribution** | Transfers wealth from creditors to debtors, from fixed-income to variable-income earners |
| **Uncertainty** | High/volatile inflation increases uncertainty, discouraging long-term investment |

### Key Takeaway

Inflation has multiple causes — excess demand, supply shocks, and self-fulfilling expectations. The central bank's primary job is to anchor expectations at a low, stable level. When expectations become unanchored, restoring price stability requires painful policy action.

*References: Friedman (1968), American Economic Review; Blanchard (2023), Fiscal Policy Under Low Interest Rates (MIT Press); Federal Reserve Board (2023), Monetary Policy Report.*`,
    },
    {
      id: "macro-unemployment-phillips",
      slug: "the-phillips-curve",
      title: "The Phillips Curve",
      content: `## The Phillips Curve

The Phillips Curve is one of the most important — and most debated — relationships in macroeconomics. It posits a trade-off between inflation and unemployment: lower unemployment comes at the cost of higher inflation, and vice versa.

### The Original Phillips Curve

A.W. Phillips (1958, *The Relation Between Unemployment and the Rate of Change of Money Wage Rates in the United Kingdom*, Economica) discovered a negative relationship between unemployment and wage inflation using 97 years of British data (1861-1957). Samuelson & Solow (1960) adapted it for the United States, replacing wage inflation with price inflation.

The implication was tantalizing for policymakers: the Phillips Curve appeared to offer a **menu of choices** — stimulate the economy to reduce unemployment at the cost of somewhat higher inflation, or accept higher unemployment to keep inflation low.

### The Friedman-Phelps Critique

Milton Friedman (1968) and Edmund Phelps (1967) independently argued that the Phillips Curve trade-off is only temporary. In the long run, the economy gravitates to the natural rate of unemployment regardless of inflation.

Their argument: If the government stimulates demand to push unemployment below the natural rate, inflation rises. Initially, workers do not realize prices are rising (money illusion). But eventually, they demand higher wages to compensate for inflation. The economy returns to the natural rate of unemployment — but at a higher inflation rate.

**The expectations-augmented Phillips Curve:**
\`\`\`
Inflation = Expected Inflation - beta × (Unemployment - Natural Rate) + Supply Shock
\`\`\`

This implies the long-run Phillips Curve is **vertical** at the natural rate. There is no permanent trade-off between inflation and unemployment. Any attempt to keep unemployment below the natural rate requires continuously accelerating inflation.

### Empirical Vindication: The 1970s

The 1970s provided dramatic support for the Friedman-Phelps critique. The stable Phillips Curve relationship of the 1960s broke down:

| Year | Unemployment | Inflation |
|------|-------------|-----------|
| 1969 | 3.5% | 5.5% |
| 1973 | 4.9% | 6.2% |
| 1975 | 8.5% | 9.1% |
| 1980 | 7.1% | 13.5% |

Both unemployment and inflation rose simultaneously — the "worst of both worlds" outcome that the original Phillips Curve said was impossible.

### The Role of Expectations

The key variable in the modern Phillips Curve is expected inflation. If expectations are:
- **Anchored at 2%:** The short-run Phillips Curve is centered at 2%, and the Fed can stabilize the economy around that rate.
- **Rising (unanchored):** The short-run Phillips Curve shifts up. Reducing inflation requires pushing unemployment above the natural rate — a painful process called **disinflation**.

### The Sacrifice Ratio

The sacrifice ratio measures the cost of reducing inflation:
\`\`\`
Sacrifice Ratio = Cumulative % Increase in Unemployment / % Reduction in Inflation
\`\`\`

Ball (1994, *What Determines the Sacrifice Ratio?*, in Mankiw ed., Monetary Policy) estimated the U.S. sacrifice ratio at approximately 2.4 — meaning each 1 percentage point reduction in inflation costs approximately 2.4 percentage points of unemployment (spread over several years). The Volcker disinflation (1980-1983) reduced inflation from 13.5% to 3.2% at the cost of the deepest recession since the Great Depression.

### The Modern (Flat) Phillips Curve

Since the 1990s, the Phillips Curve has appeared remarkably flat — large changes in unemployment produce only small changes in inflation. This "missing inflation" puzzle was evident during the 2010s, when unemployment fell from 10% to 3.5% with minimal inflation increase.

Explanations include: well-anchored expectations, globalization suppressing prices, declining worker bargaining power, and measurement issues. The COVID-era inflation of 2021-2023 may have revived a steeper short-run Phillips Curve — though debate continues.

### Key Takeaway

The Phillips Curve trade-off between inflation and unemployment exists in the short run but vanishes in the long run. The critical determinant of inflation is expectations — making central bank credibility the most valuable macroeconomic asset.

*References: Phillips (1958), Economica; Friedman (1968), American Economic Review; Phelps (1967), Economica; Ball (1994), in Mankiw ed., Monetary Policy.*`,
    },
    {
      id: "macro-unemployment-stagflation",
      slug: "stagflation",
      title: "Stagflation",
      content: `## Stagflation

Stagflation — the simultaneous occurrence of stagnant economic growth, high unemployment, and high inflation — is the macroeconomist's nightmare. It defies the traditional Phillips Curve trade-off and leaves policymakers with no good options: stimulating the economy worsens inflation, while fighting inflation deepens the recession.

### The Great Stagflation (1970s)

The term "stagflation" was coined during the 1970s, when the U.S. and other developed economies experienced a combination previously thought impossible:

| Year | Real GDP Growth | Unemployment | Inflation |
|------|----------------|-------------|-----------|
| 1973 | 5.6% | 4.9% | 6.2% |
| 1974 | -0.5% | 5.6% | 11.0% |
| 1975 | -0.2% | 8.5% | 9.1% |
| 1979 | 3.2% | 5.8% | 11.3% |
| 1980 | -0.3% | 7.1% | 13.5% |

### What Caused It?

**1. Oil Price Shocks**

The 1973 OPEC oil embargo quadrupled the price of oil from \\\$3 to \\\$12 per barrel. The 1979 Iranian Revolution caused a second shock, pushing prices from \\\$14 to \\\$35. Since oil was an input to virtually everything, this represented a massive **adverse supply shock** — shifting the aggregate supply curve leftward, simultaneously raising prices and reducing output (Hamilton, 1983, *Oil and the Macroeconomy Since World War II*, Journal of Political Economy).

**2. Accommodative Monetary Policy**

The Federal Reserve, under Chair Arthur Burns, initially responded to higher oil prices by loosening monetary policy to cushion the employment effect. This validated the higher price level and allowed inflation expectations to become unanchored — converting a one-time price increase into persistent inflation.

**3. Wage-Price Controls**

Nixon's 1971 wage and price controls temporarily suppressed inflation but created distortions. When controls were lifted in 1973, prices surged as pent-up inflationary pressures were released.

**4. Breakdown of Bretton Woods**

The collapse of the Bretton Woods fixed exchange rate system (1971-1973) removed an anchor for monetary policy and introduced currency volatility that contributed to imported inflation.

### The Volcker Disinflation

Paul Volcker, appointed Fed Chair in August 1979, broke stagflation through aggressive monetary tightening:
- Raised the federal funds rate to 20% in June 1981
- Triggered the most severe recession since the Great Depression (unemployment peaked at 10.8% in November 1982)
- Reduced inflation from 13.5% (1980) to 3.2% (1983)

The Volcker disinflation demonstrated that breaking entrenched inflation requires inflicting real economic pain — but the long-run payoff was two decades of low, stable inflation. Goodfriend & King (2005, *The Incredible Volcker Disinflation*, Journal of Monetary Economics) estimated that the benefits of restored price stability vastly exceeded the costs of the 1981-1982 recession.

### Aggregate Supply-Demand Framework

Stagflation is explained by the AS-AD model as a **leftward shift of aggregate supply**:

- **Demand shock (rightward AD shift):** Prices rise, output rises (standard inflation)
- **Supply shock (leftward AS shift):** Prices rise, output falls (stagflation)

The policy dilemma: expansionary policy (to address unemployment) shifts AD right, further increasing inflation. Contractionary policy (to address inflation) shifts AD left, further increasing unemployment.

### Lessons for Today

The 2021-2023 inflation episode raised fears of a return to stagflation, though conditions differed from the 1970s:
- Energy price increases were smaller relative to the economy
- Central banks raised rates faster and more aggressively
- Inflation expectations remained relatively anchored
- Supply chain disruptions (a form of supply shock) resolved more quickly

Summers (2021, *The Biden Stimulus Is Admirably Ambitious*, Washington Post) warned early that excessive fiscal stimulus risked overheating the economy. Blanchard (2022) argued the inflation was a mix of demand-pull and cost-push, requiring both monetary tightening and patience for supply normalization.

### Key Takeaway

Stagflation occurs when adverse supply shocks coincide with accommodative monetary policy and unanchored inflation expectations. It is the hardest macroeconomic problem to solve because the two objectives — reducing inflation and reducing unemployment — require opposite policy responses.

> "The most important lesson of the 1970s is that if you let the inflation genie out of the bottle, getting it back in is extremely painful." — Alan Blinder, Princeton University

*References: Hamilton (1983), Journal of Political Economy; Goodfriend & King (2005), Journal of Monetary Economics; Blanchard (2022), NBER Working Paper; Mankiw (2021), Macroeconomics (Worth).*`,
    },
  ],
};
