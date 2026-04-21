import { Module } from "../types";

export const exchangeRatesModule: Module = {
  id: "ie-forex",
  title: "Exchange Rates",
  description: "Understand the foreign exchange market, how exchange rates are determined, and the role of central banks in managing currencies.",
  lessons: [
    {
      id: "ie-forex-market",
      slug: "forex-market",
      title: "The Foreign Exchange Market",
      content: `## The Foreign Exchange Market

The **foreign exchange (forex) market** is the largest financial market in the world, with daily trading volume exceeding \\$7.5 trillion as of 2022 (Bank for International Settlements). It dwarfs the stock market, bond market, and commodities markets combined. Every international transaction — trade in goods, services, investment, tourism — ultimately involves exchanging one currency for another.

### What is an Exchange Rate?

An **exchange rate** is the price of one currency expressed in terms of another. If the USD/EUR exchange rate is 1.10, it costs \\$1.10 to buy one euro. Exchange rates can be quoted two ways:

- **Direct quote (for a US perspective):** How many dollars per unit of foreign currency? USD/EUR = 1.10 means \\$1.10 per euro
- **Indirect quote:** How many units of foreign currency per dollar? EUR/USD = 0.91 means 0.91 euros per dollar

These are simply reciprocals of each other (1/1.10 = 0.91).

### Market Structure

The forex market is unique among financial markets:

**Decentralized:** There is no single exchange building. Trading occurs electronically across a global network of banks, brokers, and electronic platforms, 24 hours a day from Monday to Friday.

**Hierarchical:** The market has layers. At the top, large commercial banks trade with each other in the **interbank market** (about 40% of trading). Below that, banks deal with corporations, hedge funds, central banks, and retail traders.

**Major trading centers:** London (the largest, handling about 38% of daily volume), New York (19%), Singapore (9%), Hong Kong (7%), and Tokyo (5%).

### Market Participants

| Participant | Motivation | Share of Volume |
|-------------|-----------|----------------|
| **Commercial banks** | Market-making, speculation, client orders | ~40% |
| **Institutional investors** | Hedge funds, pension funds, insurance companies | ~25% |
| **Corporations** | Paying for imports, converting export revenue | ~10% |
| **Central banks** | Managing reserves, intervening to stabilize | ~5% |
| **Retail traders** | Speculation | ~5% |
| **Other** | Governments, international organizations | ~15% |

### Types of Forex Transactions

**Spot transactions:** Immediate exchange of currencies (settlement in two business days). This is the benchmark rate you see quoted in news.

**Forward contracts:** Agreement to exchange currencies at a specified future date and rate. Used by companies to hedge against exchange rate risk. If a US firm will receive 1 million euros in 90 days, it can lock in today's rate with a forward contract.

**Swaps:** Simultaneous spot purchase and forward sale (or vice versa) of a currency. These are the most traded instrument in forex, accounting for nearly half of all transactions.

**Options:** The right (but not obligation) to exchange currencies at a specified rate by a certain date. More flexible than forwards but more expensive.

### Exchange Rate Regimes

Countries choose how to manage their exchange rates:

**Floating (flexible):** The exchange rate is determined by supply and demand in the forex market. The US dollar, euro, Japanese yen, and British pound all float. Most large, developed economies use floating rates.

**Fixed (pegged):** The government commits to maintaining the exchange rate at a specific level. Hong Kong has pegged its dollar to the US dollar at approximately 7.80 since 1983. The central bank must buy or sell its currency to maintain the peg.

**Managed float (dirty float):** The rate floats but the central bank intervenes to smooth volatility or prevent excessive appreciation/depreciation. Many emerging market currencies (Indian rupee, Chinese yuan) operate under managed floats.

**Currency board:** A strict form of fixed rate where the central bank must back every unit of domestic currency with foreign reserves. Limited monetary policy flexibility.

### Currency Codes and Major Pairs

The most traded currency pairs are called "majors":
- **EUR/USD** — the most traded pair globally
- **USD/JPY** — dollar-yen
- **GBP/USD** — "cable" (named after the transatlantic telegraph cable)
- **USD/CHF** — dollar-Swiss franc

### Why Exchange Rates Matter

Exchange rates affect virtually every aspect of an open economy:
- **Trade competitiveness:** A weaker currency makes exports cheaper and imports more expensive
- **Inflation:** Currency depreciation raises the price of imports, pushing up domestic prices
- **Investment returns:** Foreign investors must account for currency movements when calculating returns
- **Debt burden:** Countries with dollar-denominated debt face higher repayment costs when their currency weakens
- **Purchasing power:** Travelers, immigrants sending remittances, and consumers of imported goods all feel exchange rate movements

### Key Takeaway

The forex market is the backbone of international finance, facilitating every cross-border transaction. Understanding exchange rates and how they are determined is essential for grasping international economics, investment, and business strategy.

> "The foreign exchange market is the closest thing to the economist's ideal of a perfectly competitive market." — Mark Taylor

*Resources: BIS Triennial Central Bank Survey (2022); Copeland, Exchange Rates and International Finance; Feenstra & Taylor, International Economics.*`,
    },
    {
      id: "ie-forex-determination",
      slug: "exchange-rate-determination",
      title: "Exchange Rate Determination",
      content: `## Exchange Rate Determination

What makes the US dollar strengthen against the euro or the Japanese yen weaken against the British pound? Exchange rate determination is one of the most studied — and most debated — topics in international economics. Several theories compete to explain exchange rate movements, each capturing part of the truth.

### Supply and Demand Framework

At the most basic level, exchange rates are prices determined by supply and demand. The demand for a currency comes from:

- **Importers** in other countries who need the currency to pay for goods
- **Foreign investors** who want to buy assets (stocks, bonds, real estate) denominated in the currency
- **Speculators** who expect the currency to appreciate
- **Central banks** building foreign reserves

The supply of a currency comes from:

- **Domestic importers** selling the currency to buy foreign goods
- **Domestic investors** buying foreign assets
- **Speculators** who expect the currency to depreciate

When demand exceeds supply, the currency appreciates. When supply exceeds demand, it depreciates.

### Fundamental Factors Driving Exchange Rates

**1. Interest Rate Differentials**

Higher interest rates attract foreign capital. If US interest rates rise relative to European rates, investors move money into dollar-denominated assets, increasing demand for dollars and causing the dollar to appreciate. This is one of the strongest short-to-medium-term drivers of exchange rates.

The relationship is not perfect because higher interest rates may also signal higher inflation (which weakens a currency) or higher risk (which deters investors). What matters is the **real interest rate** — the nominal rate minus expected inflation.

**2. Inflation Differentials**

Countries with higher inflation tend to see their currencies depreciate. If US prices rise 5% while European prices rise 2%, American goods become relatively more expensive, reducing demand for US exports (and thus for dollars). Over the long run, exchange rates tend to adjust to equalize price levels across countries — the Purchasing Power Parity theory (next lesson).

**3. Current Account Balance**

A country with a large **current account deficit** (importing more than it exports) is a net seller of its own currency — it needs foreign currency to pay for imports. Persistent deficits tend to put downward pressure on the exchange rate. However, the US has run persistent current account deficits for decades without a collapse in the dollar, because foreign investors are willing to finance the deficit by buying US assets.

**4. Economic Growth**

Strong economic growth attracts foreign investment, increasing demand for the domestic currency. However, rapid growth may also increase imports (as consumers and businesses buy more foreign goods), putting downward pressure on the currency. The net effect depends on whether capital inflows or trade deficits dominate.

**5. Political Stability and Risk**

Investors prefer to hold assets in politically stable countries with strong rule of law. Political turmoil, war, or institutional collapse causes capital flight and currency depreciation. The Swiss franc and US dollar are considered "safe haven" currencies that appreciate during global crises.

**6. Speculation and Market Sentiment**

In the short run, exchange rates are heavily influenced by market expectations and positioning. If traders expect a central bank to raise interest rates, they buy the currency in anticipation, causing it to appreciate before the rate hike even occurs. Approximately 90% of forex trading is speculative rather than trade-related.

### The Monetary Model

The **monetary approach** to exchange rate determination argues that exchange rates are determined by the relative supply of and demand for money in two countries. If a country's money supply grows faster than its money demand, the excess money spills into foreign exchange markets, depressing the currency.

The monetary model predicts that exchange rates depend on:
- Relative money supplies
- Relative real income levels
- Relative interest rates

### The Asset Market Model

The **asset market approach** views currencies as assets. Investors hold portfolios of assets denominated in different currencies and adjust their holdings based on expected returns. The exchange rate adjusts to make investors willing to hold the existing stocks of each currency.

This model emphasizes **expectations** — the exchange rate today depends on expected future fundamentals (interest rates, inflation, growth). This explains why exchange rates often jump on news announcements: new information changes expectations, which immediately changes asset demands and thus exchange rates.

### Why Exchange Rate Forecasting is So Hard

Despite decades of research, economists cannot reliably forecast exchange rates in the short to medium run. A famous 1983 paper by Richard Meese and Kenneth Rogoff showed that a simple random walk (assuming tomorrow's rate equals today's rate) outperforms every economic model at horizons up to one year. This "exchange rate disconnect puzzle" remains one of the great unsolved problems in international economics.

### Key Takeaway

Exchange rates are determined by the interplay of interest rates, inflation, trade flows, capital flows, growth, and expectations. Economic models explain long-run trends reasonably well but fail at short-term prediction. For businesses and investors, exchange rate risk is a fundamental feature of operating internationally.

*Resources: Meese & Rogoff, "Empirical Exchange Rate Models of the Seventies" (1983); Copeland, Exchange Rates and International Finance.*`,
    },
    {
      id: "ie-forex-ppp",
      slug: "purchasing-power-parity",
      title: "Purchasing Power Parity (PPP)",
      content: `## Purchasing Power Parity (PPP)

**Purchasing Power Parity** is one of the oldest and most intuitive theories of exchange rate determination. At its core, PPP says that exchange rates should adjust so that identical goods cost the same in every country when converted to a common currency. A shirt that costs \\$20 in New York should cost the equivalent of \\$20 in London, Tokyo, or Buenos Aires.

### The Law of One Price

PPP is built on the **Law of One Price (LOOP):** in competitive markets with no trade barriers or transportation costs, identical goods must sell for the same price in every location. If a bushel of wheat costs \\$5 in Chicago and 4 euros in Paris, the exchange rate should be \\$1.25/euro (5/4). If the actual exchange rate is \\$1.10/euro, wheat is cheaper in Paris, and arbitrageurs will buy wheat in Paris and sell it in Chicago, driving prices toward equilibrium.

### Absolute PPP

**Absolute PPP** extends the Law of One Price to the overall price level: the exchange rate between two currencies should equal the ratio of the two countries' price levels.

If a basket of goods costs \\$100 in the US and 80 euros in Europe, absolute PPP predicts an exchange rate of \\$1.25/euro (100/80).

**Formula:** E = P_domestic / P_foreign

Where E is the exchange rate, P_domestic is the domestic price level, and P_foreign is the foreign price level.

### Relative PPP

Since absolute PPP rarely holds exactly (due to trade barriers, transport costs, and non-traded goods), economists use **relative PPP**, which makes a weaker prediction: the **change** in the exchange rate should equal the **difference in inflation rates** between two countries.

If US inflation is 5% and European inflation is 2%, the dollar should depreciate by approximately 3% against the euro.

**Formula:** Percentage change in E ≈ Inflation_domestic - Inflation_foreign

This makes intuitive sense: if US prices rise faster than European prices, US goods become relatively more expensive, reducing demand for dollars and causing the dollar to weaken.

### The Big Mac Index

The Economist magazine created the **Big Mac Index** in 1986 as a lighthearted test of PPP. Since a Big Mac is a standardized product available in over 100 countries, comparing Big Mac prices reveals whether currencies are overvalued or undervalued relative to PPP.

As of 2024:
- A Big Mac costs \\$5.69 in the US
- A Big Mac costs 27.4 yuan in China (implying a PPP rate of 4.81 yuan/dollar)
- The actual exchange rate is about 7.2 yuan/dollar
- This suggests the yuan is approximately 33% undervalued relative to PPP

The Big Mac Index is not a precise forecasting tool, but it captures a real phenomenon: currencies of developing countries tend to be "undervalued" relative to PPP because prices are generally lower in poorer countries.

### Why PPP Fails in the Short Run

PPP is a poor predictor of exchange rates over short horizons (months to a few years). Actual exchange rates deviate from PPP by large and persistent amounts. Reasons include:

**1. Transportation costs and trade barriers:** Moving goods between countries is costly. Tariffs, shipping, and customs procedures prevent arbitrage from equalizing prices.

**2. Non-traded goods:** Many goods and services (haircuts, housing, restaurant meals) cannot be traded internationally. Their prices reflect local costs, especially wages, and do not converge across countries.

**3. Product differentiation:** A BMW is not the same as a Toyota. Brand differences, quality variations, and local tastes prevent perfect price equalization.

**4. Sticky prices:** Prices in goods markets adjust slowly — contracts are fixed, menus are printed, wages are negotiated annually. Exchange rates can move 2% in a day, but prices take months to adjust.

**5. Capital flows:** Short-run exchange rate movements are driven by capital flows (interest rate differentials, risk sentiment) rather than goods market arbitrage.

### The Balassa-Samuelson Effect

Economists Bela Balassa and Paul Samuelson explained why prices are systematically lower in developing countries. In rich countries, productivity in **traded goods** (manufacturing) is much higher than in poor countries, driving up wages economy-wide. But productivity in **non-traded goods** (services) is similar across countries. Higher wages in rich countries make services more expensive, pushing up the overall price level. This is why a haircut costs \\$50 in New York but \\$3 in Hanoi.

### PPP in the Long Run

While PPP fails badly in the short run, it works reasonably well over very long horizons (decades). Studies show that real exchange rates (adjusted for inflation) tend to revert toward PPP over periods of 3-10 years. This means that a currency that is significantly overvalued relative to PPP will tend to depreciate over time, and vice versa.

### Key Takeaway

PPP is a powerful long-run anchor for exchange rates: currencies of high-inflation countries depreciate over time. But in the short and medium run, capital flows, interest rate differentials, and market sentiment overwhelm goods market forces. PPP is best used as a benchmark for identifying misaligned currencies rather than a trading strategy.

> "In the long run, exchange rates move toward PPP. The problem is that the long run can be very long." — Kenneth Rogoff

*Resources: Rogoff, "The Purchasing Power Parity Puzzle" (1996); The Economist Big Mac Index; Taylor & Taylor, "The Purchasing Power Parity Debate" (2004).*`,
    },
    {
      id: "ie-forex-interest-rate-parity",
      slug: "interest-rate-parity",
      title: "Interest Rate Parity",
      content: `## Interest Rate Parity

While PPP links exchange rates to goods prices, **Interest Rate Parity (IRP)** links exchange rates to **financial asset returns**. It is one of the most important relationships in international finance and the foundation of currency pricing in forward markets.

### The Core Idea

Interest Rate Parity says that the difference in interest rates between two countries should be exactly offset by the change in the exchange rate. If US interest rates are 5% and European rates are 2%, the dollar should be expected to **depreciate** by 3% against the euro. Otherwise, investors could earn risk-free profits by borrowing in the low-interest currency and investing in the high-interest currency.

### Covered Interest Rate Parity (CIP)

**Covered IRP** uses the forward exchange rate to eliminate exchange rate risk. It states that the interest rate differential between two countries must equal the forward premium or discount on the exchange rate.

**Formula:** (F - S) / S = (i_domestic - i_foreign) / (1 + i_foreign)

Where:
- F = forward exchange rate
- S = spot exchange rate
- i_domestic = domestic interest rate
- i_foreign = foreign interest rate

**Example:** If the spot rate is \\$1.10/euro, US interest rates are 5%, and European rates are 2%, the 1-year forward rate should be approximately:

F = 1.10 x (1.05/1.02) = \\$1.1324/euro

The dollar trades at a forward **discount** (more dollars per euro in the future) because US interest rates are higher. This discount exactly offsets the interest rate advantage, ensuring no risk-free profit.

**Why CIP holds:** If the forward rate deviated from IRP, banks and hedge funds would engage in **covered interest arbitrage** — borrowing in one currency, investing in another, and hedging with a forward contract — until the deviation was eliminated. In practice, CIP holds very closely in normal times, deviating only during financial crises (like 2008) when counterparty risk disrupts the arbitrage mechanism.

### Uncovered Interest Rate Parity (UIP)

**Uncovered IRP** makes a stronger claim: the expected change in the spot exchange rate should equal the interest rate differential. Unlike CIP, this is not hedged with a forward contract — the investor bears exchange rate risk.

**Formula:** Expected change in S = i_domestic - i_foreign

If US rates are 5% and European rates are 2%, UIP predicts the dollar will depreciate by 3% over the next year. An investor who borrows euros at 2% and invests in dollars at 5% would earn 3% on the interest rate differential but lose 3% on the exchange rate movement, ending up with the same return as investing in euros.

### The Carry Trade: Why UIP Fails

In practice, UIP is systematically violated. High-interest-rate currencies tend to depreciate **less** than UIP predicts, or even appreciate. This creates a profitable (but risky) strategy called the **carry trade**:

1. Borrow in a low-interest-rate currency (e.g., Japanese yen at 0.1%)
2. Convert to a high-interest-rate currency (e.g., Australian dollar at 4.5%)
3. Invest in the high-yield currency
4. If the exchange rate stays stable, you earn the interest rate differential as profit

The carry trade has historically been profitable on average, violating UIP. Possible explanations include:
- **Risk premium:** High-interest currencies are riskier (more volatile, more likely to crash)
- **Peso problem:** Rare but catastrophic losses wipe out years of carry trade profits
- **Central bank intervention:** Some countries keep interest rates low while intervening to prevent currency appreciation

The carry trade blew up spectacularly in 2008 when the yen surged 30% against the Australian dollar in just a few months, causing massive losses for carry traders.

### Real-World Applications

**Corporate hedging:** Multinational companies use IRP to determine the cost of hedging foreign currency exposure. If a US firm will receive euros in 6 months, the forward rate (determined by IRP) tells them the exact dollar amount they can lock in today.

**Central bank signaling:** When a central bank raises interest rates, IRP predicts the currency will appreciate in the spot market and trade at a forward discount. Markets respond to interest rate announcements partly through this channel.

**Currency valuation:** If the forward rate deviates significantly from IRP, it signals stress in financial markets (as happened during the 2008 crisis when dollar funding became scarce).

### The Impossible Trinity

IRP is intimately connected to the **impossible trinity** (or trilemma): a country cannot simultaneously maintain a fixed exchange rate, free capital movement, and independent monetary policy. It can have any two of the three:

- **US:** Floating rate + free capital + independent monetary policy
- **Hong Kong:** Fixed rate + free capital + no independent monetary policy
- **China (historically):** Fixed rate + capital controls + independent monetary policy

### Key Takeaway

Interest Rate Parity links exchange rates to interest rate differentials. Covered IRP holds tightly and governs forward currency pricing. Uncovered IRP fails empirically, creating opportunities (and risks) for carry traders. Together with PPP, IRP provides the theoretical framework for understanding exchange rate movements.

*Resources: Froot & Thaler, "Anomalies: Foreign Exchange" (1990); Engel, "The Forward Discount Anomaly" (1996); Feenstra & Taylor, International Economics.*`,
    },
    {
      id: "ie-forex-central-bank-intervention",
      slug: "central-bank-intervention",
      title: "Central Bank Intervention",
      content: `## Central Bank Intervention

Central banks are among the most powerful players in the foreign exchange market. While most developed economies allow their currencies to float, central banks frequently intervene — buying or selling currencies — to influence exchange rates. Understanding how and why central banks intervene is crucial for anyone involved in international trade, investment, or policy.

### Why Central Banks Intervene

Central banks intervene in forex markets for several reasons:

**1. Preventing excessive volatility:** Sharp currency movements can destabilize trade and investment. A central bank may intervene to smooth short-term fluctuations without trying to change the long-run trend.

**2. Defending a currency peg:** Countries with fixed exchange rates must constantly intervene to maintain the peg. If the market wants to push the currency below the peg, the central bank buys its own currency using foreign reserves. If the market pushes it above, the central bank sells its currency.

**3. Countering speculative attacks:** When speculators bet against a currency, the central bank may intervene to signal its commitment to the exchange rate and inflict losses on speculators.

**4. Managing competitiveness:** Some countries intervene to prevent their currency from appreciating too much, which would hurt export competitiveness. Japan has frequently intervened to weaken the yen when it strengthens sharply.

**5. Building reserves:** Emerging market central banks buy foreign currencies (especially US dollars) to build reserves as insurance against future crises.

### How Intervention Works

**Sterilized intervention:** The central bank buys or sells foreign currency but offsets the impact on the domestic money supply through open market operations. For example, if the Bank of Japan sells yen to buy dollars (weakening the yen), it simultaneously sells Japanese government bonds to absorb the extra yen from the money supply. Sterilized intervention changes the currency composition of assets but not the money supply.

**Unsterilized intervention:** The central bank allows its forex operations to affect the money supply. Selling domestic currency to buy foreign currency increases the money supply (expansionary), while the reverse contracts it. Unsterilized intervention is more powerful because it combines exchange rate intervention with monetary policy.

### Famous Interventions and Their Outcomes

**The Plaza Accord (1985):** By the mid-1980s, the US dollar had appreciated approximately 50% in real terms since 1980, making US exports uncompetitive. In September 1985, finance ministers of the G-5 countries (US, Japan, Germany, France, UK) met at the Plaza Hotel in New York and agreed to coordinate intervention to weaken the dollar. The result was dramatic — the dollar fell approximately 40% against the yen and Deutsche mark over the next two years. The Plaza Accord is the most successful example of coordinated intervention in history.

**George Soros vs. the Bank of England (1992):** Britain was part of the European Exchange Rate Mechanism (ERM), which required the pound to stay within a narrow band against the Deutsche mark. Speculator George Soros bet approximately \\$10 billion that the pound was overvalued and would be forced to devalue. On "Black Wednesday" (September 16, 1992), the Bank of England spent billions in reserves and raised interest rates from 10% to 15% in a single day, but could not hold the peg. Britain withdrew from the ERM, the pound fell 15%, and Soros reportedly made \\$1 billion in profit.

**Swiss National Bank (2011-2015):** In 2011, the Swiss franc surged as a safe haven during the European debt crisis, threatening Swiss exporters. The Swiss National Bank (SNB) set a floor at 1.20 francs per euro and defended it by buying unlimited amounts of euros. The SNB accumulated over \\$500 billion in foreign reserves. In January 2015, the SNB abruptly abandoned the floor, and the franc surged 30% in minutes, causing billions in losses across global financial markets.

### Effectiveness of Intervention

The effectiveness of central bank intervention is hotly debated:

**Arguments for effectiveness:**
- Intervention can provide a focal point for market expectations
- Coordinated intervention (multiple central banks acting together) is more credible
- Unsterilized intervention, which changes monetary conditions, is clearly effective
- In some cases, the signal of central bank commitment is enough to change market behavior

**Arguments against effectiveness:**
- Central bank forex reserves (\\$12 trillion globally) are dwarfed by daily forex turnover (\\$7.5 trillion)
- Sterilized intervention may change asset composition but not fundamentals
- If the exchange rate is misaligned due to fundamental factors, intervention only delays the inevitable adjustment
- Failed interventions damage central bank credibility

### Foreign Reserve Accumulation

Emerging market central banks have accumulated massive foreign reserves since the late 1990s, partly as insurance against the kind of currency crises that devastated East Asia in 1997-98. China holds approximately \\$3.2 trillion in reserves, Japan \\$1.3 trillion, and Switzerland \\$800 billion.

This reserve accumulation has important global effects:
- It keeps emerging market currencies weaker than they would otherwise be, boosting exports
- It funds purchases of US Treasury bonds, keeping US interest rates lower
- It creates a "global savings glut" (as Ben Bernanke termed it) that may have contributed to asset bubbles

### Key Takeaway

Central bank intervention is a powerful but imperfect tool for managing exchange rates. Coordinated, credible intervention can move markets. But no central bank can indefinitely fight market fundamentals. The history of intervention is a history of both spectacular successes and costly failures.

> "Markets can remain irrational longer than you can remain solvent." — John Maynard Keynes (often quoted in the context of currency speculation)

*Resources: Dominguez & Frankel, Does Foreign Exchange Intervention Work?; Obstfeld, Shambaugh & Taylor, "The Trilemma in History" (2005); BIS Annual Reports.*`,
    },
  ],
};
