import { Module } from "../types";

export const internationalModule: Module = {
  id: "macro-international",
  title: "International Macroeconomics",
  description: "Analyze the global economy — exchange rates, balance of payments, trade deficits, purchasing power parity, and the impossible trinity of open-economy macroeconomics. Resources: Krugman Obstfeld & Melitz International Economics, Mankiw Macroeconomics.",
  lessons: [
    {
      id: "macro-intl-exchange-rates",
      slug: "exchange-rates",
      title: "Exchange Rates",
      content: `## Exchange Rates

An exchange rate is the price of one currency expressed in terms of another. Exchange rates affect the price of every internationally traded good, service, and financial asset — making them among the most important prices in the global economy.

### Definitions

**Nominal exchange rate (e):** The rate at which one currency trades for another. If 1 USD = 0.85 EUR, the dollar/euro nominal rate is 0.85.

**Real exchange rate (RER):** The nominal rate adjusted for relative price levels between countries:
\`\`\`
RER = e × (P_domestic / P_foreign)
\`\`\`

The real exchange rate measures the relative cost of goods across countries. If the U.S. dollar appreciates nominally but U.S. prices rise faster than European prices, the real exchange rate may not change.

**Appreciation:** A currency becomes stronger (buys more foreign currency). U.S. exports become more expensive to foreigners; imports become cheaper for Americans.

**Depreciation:** A currency becomes weaker. U.S. exports become cheaper to foreigners; imports become more expensive.

### Exchange Rate Regimes

| Regime | Description | Examples |
|--------|-----------|---------|
| **Free floating** | Market supply and demand determine the rate | USD, EUR, JPY, GBP |
| **Managed float** | Central bank intervenes occasionally to smooth volatility | India, Brazil |
| **Fixed (pegged)** | Government fixes the rate to another currency or basket | Hong Kong (pegged to USD), Denmark (pegged to EUR) |
| **Currency board** | Fixed rate backed by foreign reserves; no independent monetary policy | Hong Kong |
| **Dollarization/Euroization** | Country adopts another nation's currency | Ecuador, Panama (use USD) |

### Determinants of Exchange Rates

In the short run, exchange rates are driven primarily by **capital flows** — money moving between countries seeking higher returns:

- **Interest rate differentials:** Higher domestic interest rates attract foreign capital → currency appreciates
- **Expected future exchange rate:** If investors expect appreciation, they buy the currency now
- **Risk and uncertainty:** Safe-haven currencies (USD, CHF, JPY) appreciate during global crises

In the long run, exchange rates gravitate toward levels consistent with **purchasing power parity** and **relative productivity** (covered in Lesson 4).

### The Foreign Exchange Market

The forex market is the largest financial market in the world, with daily turnover exceeding \\$7.5 trillion (Bank for International Settlements, 2022). It operates 24 hours a day across global financial centers (London, New York, Tokyo, Singapore).

Approximately 88% of all forex transactions involve the U.S. dollar on one side, reflecting the dollar's role as the world's reserve currency. The most traded pair is EUR/USD, followed by USD/JPY and GBP/USD.

### Exchange Rates and Trade

A depreciation of the domestic currency makes:
- Exports cheaper (boosting export demand)
- Imports more expensive (reducing import demand)
- Net exports increase → GDP increases

However, the **J-curve effect** means that a depreciation may initially worsen the trade balance before improving it. Import prices rise immediately, but the quantity of exports adjusts slowly. Empirical evidence from Bahmani-Oskooee & Ratha (2004, *The J-Curve*, Journal of International Economics) confirms J-curve behavior for most countries, with the improvement in the trade balance taking 6-18 months.

### Key Takeaway

Exchange rates are prices that connect national economies. They affect trade competitiveness, capital flows, inflation, and the transmission of economic shocks across borders. Understanding exchange rate dynamics is essential for navigating the global economy.

*References: Bank for International Settlements (2022), Triennial Central Bank Survey; Bahmani-Oskooee & Ratha (2004), Journal of International Economics; Krugman, Obstfeld & Melitz (2018), International Economics (Pearson).*`,
    },
    {
      id: "macro-intl-bop",
      slug: "balance-of-payments",
      title: "Balance of Payments",
      content: `## Balance of Payments

The balance of payments (BOP) is a comprehensive record of all economic transactions between residents of a country and the rest of the world during a specific period. It provides the accounting framework for understanding international capital flows, trade balances, and a country's external financial position.

### Structure

The BOP consists of two main accounts:

**1. Current Account**

Records transactions in goods, services, income, and unilateral transfers:

| Component | Examples |
|-----------|---------|
| **Trade balance (goods)** | Exports and imports of merchandise |
| **Services balance** | Tourism, financial services, shipping, intellectual property |
| **Primary income** | Investment income (dividends, interest), worker remittances |
| **Secondary income** | Foreign aid, personal transfers |

\`\`\`
Current Account = Trade Balance + Services + Primary Income + Secondary Income
\`\`\`

**2. Financial (Capital) Account**

Records transactions in financial assets — purchases and sales of stocks, bonds, real estate, and direct investments across borders:

| Component | Examples |
|-----------|---------|
| **Foreign Direct Investment (FDI)** | Building a factory abroad, acquiring a foreign company |
| **Portfolio investment** | Purchasing foreign stocks and bonds |
| **Other investment** | Bank loans, deposits, trade credit |
| **Reserve assets** | Central bank purchases of foreign currencies |

### The BOP Must Balance

By double-entry accounting:
\`\`\`
Current Account + Financial Account + Statistical Discrepancy = 0
\`\`\`

A current account deficit must be financed by a financial account surplus (capital inflow) — and vice versa.

### The U.S. Current Account

The United States has run a current account deficit continuously since 1982. In 2023, the deficit was approximately \\$818 billion (3.0% of GDP). This means the U.S. imports more than it exports — but it also means the rest of the world sends capital to the U.S. (buying U.S. Treasury bonds, investing in U.S. companies, and holding dollar reserves).

Bernanke (2005, *The Global Saving Glut and the U.S. Current Account Deficit*, Federal Reserve Board) argued that the U.S. deficit reflects not American profligacy but a "global savings glut" — excess savings in Asia and oil-exporting countries seeking safe, liquid investment destinations.

### Twin Deficits Hypothesis

The "twin deficits" hypothesis suggests that government budget deficits cause current account deficits through the national saving identity:

\`\`\`
Current Account = Private Saving - Private Investment + (Tax Revenue - Government Spending)
CA = (S - I) + (T - G)
\`\`\`

If the government runs a deficit (T < G) without an offsetting increase in private saving, the current account deteriorates. Empirical evidence is mixed — the relationship holds loosely in U.S. data but not universally (Chinn & Prasad, 2003, *Medium-Term Determinants of Current Accounts*, Journal of International Economics).

### Sudden Stops

For developing countries, large current account deficits financed by volatile capital flows create vulnerability to **sudden stops** — abrupt reversals of capital inflows. When foreign investors lose confidence, capital flows out, the currency collapses, and the country faces a balance of payments crisis.

Calvo (1998, *Capital Flows and Capital-Market Crises*, Journal of Applied Economics) documented the pattern: large capital inflows → current account deficits → sudden reversal → currency crisis → deep recession. This pattern characterized the Asian Financial Crisis (1997-98), the Russian Crisis (1998), and the Argentine Crisis (2001-02).

### Key Takeaway

The balance of payments records a country's economic interactions with the world. A current account deficit is not inherently bad — it may reflect attractive investment opportunities — but persistent deficits financed by volatile capital flows create vulnerability to sudden stops and currency crises.

*References: Bernanke (2005), Federal Reserve Board; Calvo (1998), Journal of Applied Economics; Chinn & Prasad (2003), Journal of International Economics; IMF Balance of Payments Manual.*`,
    },
    {
      id: "macro-intl-trade-deficits",
      slug: "trade-deficits",
      title: "Trade Deficits",
      content: `## Trade Deficits

A trade deficit occurs when a country imports more goods and services than it exports. The U.S. has run a trade deficit every year since 1975, reaching \\$773 billion in 2023. Whether this is a problem is one of the most misunderstood issues in economics.

### What the Trade Balance Measures

\`\`\`
Trade Balance = Exports - Imports
\`\`\`

Positive = trade surplus (exports > imports)
Negative = trade deficit (imports > exports)

### Common Misconceptions

**Misconception 1: "A trade deficit means we are losing."**

Trade is not a competition. A deficit in goods simply means Americans are buying more foreign goods than foreigners are buying American goods. In return, foreigners are investing in the U.S. — buying Treasury bonds, funding startups, or building factories. The "loss" in trade is offset by a "gain" in capital investment.

**Misconception 2: "Trade deficits destroy jobs."**

The trade balance has little relationship with overall employment. The U.S. had its lowest unemployment (3.4%, 2023) while running one of its largest trade deficits. Employment depends on aggregate demand, labor market conditions, and macroeconomic policy — not the trade balance per se.

However, specific sectors can suffer. Autor, Dorn & Hanson (2013, *The China Syndrome*, American Economic Review) found that U.S. communities exposed to increased Chinese imports experienced significant manufacturing job losses, lower wages, and higher disability claims — the concentrated costs of trade, even when aggregate welfare improves.

**Misconception 3: "Tariffs fix trade deficits."**

Tariffs (taxes on imports) reduce imports of targeted goods but tend to raise the exchange rate, making all exports more expensive and other imports relatively cheaper. The net effect on the overall trade balance is typically small. The U.S. trade deficit with China narrowed after 2018 tariffs, but the total U.S. trade deficit widened — trade was redirected through other countries (Fajgelbaum et al., 2020, *The Return to Protectionism*, Quarterly Journal of Economics).

### Determinants of the Trade Balance

The trade balance is fundamentally determined by the gap between national saving and national investment:

\`\`\`
Trade Balance = National Saving - National Investment
\`\`\`

If a country invests more than it saves (attractive investment opportunities, government deficits), it must borrow from abroad — which means importing capital and running a trade deficit. This is an accounting identity, not a theory.

### When Trade Deficits Are Problematic

Trade deficits can be problematic when:
1. **Financed by unsustainable capital flows** — hot money that can reverse suddenly (Asian Crisis 1997)
2. **Driven by consumption rather than investment** — borrowing to consume today at the expense of tomorrow
3. **Reflecting currency manipulation** — trading partners artificially suppress their currencies to boost exports
4. **Causing concentrated harm** — even if aggregate welfare rises, specific communities suffer disproportionately

### When Trade Deficits Are Benign

Trade deficits are benign (or even positive) when:
1. **Financed by FDI** — foreign companies building factories in the U.S. is investment, not debt
2. **Reflecting strong domestic demand** — a growing economy imports more
3. **Reflecting the reserve currency role** — the world needs dollars, which requires the U.S. to export them (run deficits)

### Key Takeaway

Trade deficits are neither inherently good nor bad. They reflect the difference between national saving and investment. The critical questions are: what is financing the deficit, and are the borrowed funds being used productively?

> "A trade deficit is not a scorecard — it is a reflection of capital flows, investment opportunities, and saving behavior." — Gregory Mankiw

*References: Autor, Dorn & Hanson (2013), American Economic Review; Fajgelbaum et al. (2020), Quarterly Journal of Economics; Mankiw (2021), Macroeconomics (Worth).*`,
    },
    {
      id: "macro-intl-ppp",
      slug: "purchasing-power-parity",
      title: "Purchasing Power Parity",
      content: `## Purchasing Power Parity

Purchasing Power Parity (PPP) is the theory that exchange rates should adjust so that identical goods cost the same in every country when expressed in a common currency. While PPP rarely holds precisely, it provides a useful benchmark for evaluating whether currencies are over- or undervalued and for comparing living standards across countries.

### The Law of One Price

The foundation of PPP is the **law of one price**: in efficient markets, identical goods sold in different countries must sell for the same price when expressed in a common currency:

\`\`\`
P_domestic = e × P_foreign
\`\`\`

If a bushel of wheat costs \\$5 in the U.S. and EUR 4 in Germany, the implied exchange rate is \\$5/EUR 4 = 1.25 USD/EUR. If the actual exchange rate differs, arbitrage opportunities exist — buy wheat where it is cheap, sell where it is expensive.

### Absolute PPP

Absolute PPP extends the law of one price to the entire price level:
\`\`\`
e = P_domestic / P_foreign
\`\`\`

The exchange rate should equal the ratio of domestic to foreign price levels. If U.S. prices are twice Japan's, the exchange rate should be 2 USD per unit of Japanese currency.

### Relative PPP

Relative PPP says the **change** in the exchange rate should reflect the **difference** in inflation rates:
\`\`\`
% Change in e = Inflation_domestic - Inflation_foreign
\`\`\`

If U.S. inflation is 5% and Japanese inflation is 1%, the dollar should depreciate by approximately 4% per year against the yen. This version is more useful empirically because it does not require that price levels be equal — only that they move in the same direction.

### The Big Mac Index

The Economist magazine's Big Mac Index, published since 1986, uses the price of a McDonald's Big Mac as a lighthearted test of PPP. In January 2024:
- U.S.: \\$5.69
- Switzerland: \\$8.17 (Swiss franc overvalued by 44%)
- India: \\$2.34 (rupee undervalued by 59%)
- Eurozone: \\$5.28 (euro undervalued by 7%)

While simplified, the Big Mac Index captures real PPP deviations remarkably well. Ong (2003, *One for All: The Big Mac Index and PPP*, IMF Working Paper) found the Big Mac Index predicts long-run exchange rate movements as well as more sophisticated models.

### Why PPP Fails in the Short Run

PPP rarely holds in the short run for several reasons:

**1. Transportation costs and trade barriers** — shipping goods internationally is expensive; tariffs and quotas prevent arbitrage.

**2. Non-traded goods** — services like haircuts, restaurant meals, and housing cannot be traded internationally, and their prices differ widely across countries (the Balassa-Samuelson effect).

**3. Product differentiation** — a Toyota in Japan is not identical to a Toyota in the U.S. (different specifications, warranties, regulations).

**4. Capital flows** — in the short run, exchange rates are dominated by capital movements (interest rate differentials, speculation), not goods trade.

### The Balassa-Samuelson Effect

Balassa (1964) and Samuelson (1964) independently explained why prices are systematically lower in poor countries. Rich countries have higher productivity in the **traded goods** sector (manufacturing, agriculture), which raises wages across the entire economy — including the **non-traded** sector (services). Since service prices are higher in rich countries, overall price levels are higher, and PPP-adjusted GDP per capita is closer than nominal GDP per capita suggests.

This is why India's GDP per capita is about \\$2,500 at market exchange rates but about \\$9,000 at PPP — the cost of non-traded goods (housing, food, services) is much lower in India.

### Key Takeaway

PPP provides a long-run anchor for exchange rates and an essential tool for comparing living standards across countries. While it fails in the short run due to capital flows and non-traded goods, deviations from PPP tend to correct over periods of 3-10 years.

*References: Balassa (1964), Journal of Political Economy; Ong (2003), IMF Working Paper; Rogoff (1996), Journal of Economic Literature; The Economist, Big Mac Index.*`,
    },
    {
      id: "macro-intl-impossible-trinity",
      slug: "the-impossible-trinity",
      title: "The Impossible Trinity",
      content: `## The Impossible Trinity

The impossible trinity (also called the trilemma) is one of the most important insights in international macroeconomics: a country cannot simultaneously maintain all three of the following:

1. **Free capital mobility** (open financial markets)
2. **Fixed exchange rate**
3. **Independent monetary policy**

A country can achieve any two, but not all three.

### The Logic

**Why not all three?** Suppose a country has a fixed exchange rate and free capital mobility. If it tries to lower interest rates (independent monetary policy), capital flows out (investors seek higher returns abroad), putting downward pressure on the currency. To maintain the fixed rate, the central bank must sell foreign reserves and buy domestic currency — effectively raising interest rates back up. The monetary policy is nullified.

This insight was formalized by Mundell (1963, *Capital Mobility and Stabilization Policy Under Fixed and Flexible Exchange Rates*, Canadian Journal of Economics) and Fleming (1962), becoming the Mundell-Fleming model — which earned Mundell the 1999 Nobel Prize.

### The Three Policy Combinations

**Option 1: Fixed Exchange Rate + Free Capital Mobility (sacrifice monetary independence)**
- The country pegs its currency and allows capital to flow freely, but surrenders control of interest rates.
- Examples: Hong Kong (currency board pegged to USD), Eurozone members (share a currency, no independent monetary policy)
- Advantage: Exchange rate stability promotes trade and investment
- Disadvantage: Cannot respond to domestic economic shocks

**Option 2: Independent Monetary Policy + Free Capital Mobility (sacrifice fixed exchange rate)**
- The country allows the currency to float and sets interest rates independently.
- Examples: United States, Japan, United Kingdom, Australia
- Advantage: Can respond to domestic conditions
- Disadvantage: Exchange rate volatility

**Option 3: Fixed Exchange Rate + Independent Monetary Policy (sacrifice capital mobility)**
- The country imposes capital controls — restrictions on cross-border financial flows.
- Examples: China (partially), many developing countries in the 1960s-1980s
- Advantage: Exchange rate stability + monetary flexibility
- Disadvantage: Capital controls distort financial markets and are increasingly difficult to enforce in a globalized world

### Historical Illustrations

**The Gold Standard (1870-1914):** Fixed exchange rates + free capital mobility → no independent monetary policy. Countries accepted deflation and unemployment to maintain their gold pegs. The system broke down when World War I required independent monetary financing.

**Bretton Woods (1944-1971):** Fixed exchange rates + limited capital mobility → some monetary independence. When capital became more mobile in the 1960s, the system became unsustainable. Nixon ended dollar-gold convertibility in 1971.

**The Asian Financial Crisis (1997-98):** Thailand, Indonesia, and South Korea attempted to maintain fixed exchange rates with open capital markets while pursuing independent monetary policies. When investors lost confidence, massive capital outflows made the fixed rates unsustainable. Currencies collapsed 30-50%, triggering deep recessions.

Obstfeld & Taylor (2004, *Global Capital Markets: Integration, Crisis, and Growth*, Cambridge University Press) documented how countries have oscillated between the three corners of the trilemma throughout history, with each era defined by which two objectives were prioritized.

### The Modern Consensus

Most developed countries today choose Option 2: floating exchange rates with independent monetary policy and open capital markets. This reflects the view that monetary policy independence is too valuable to sacrifice and that capital controls are difficult to maintain in a globalized financial system.

However, Rey (2015, *Dilemma Not Trilemma*, NBER Working Paper) challenged the trilemma, arguing that U.S. monetary policy transmits globally through capital flows regardless of exchange rate regime — reducing the trilemma to a "dilemma" between capital mobility and monetary autonomy.

### Key Takeaway

The impossible trinity forces every country to make a fundamental choice about its macroeconomic framework. Understanding the trilemma is essential for analyzing currency crises, evaluating exchange rate regimes, and predicting the consequences of capital market liberalization.

*References: Mundell (1963), Canadian Journal of Economics; Obstfeld & Taylor (2004), Global Capital Markets (Cambridge); Rey (2015), NBER Working Paper; Mankiw (2021), Macroeconomics (Worth).*`,
    },
  ],
};
