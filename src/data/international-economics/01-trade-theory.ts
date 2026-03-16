import { Module } from "../types";

export const tradeTheoryModule: Module = {
  id: "ie-trade",
  title: "Trade Theory",
  description:
    "Explore the fundamental theories explaining why nations trade — from classical comparative advantage to modern theories of economies of scale and network effects.",
  lessons: [
    {
      id: "ie-trade-why-countries-trade",
      slug: "why-countries-trade",
      title: "Why Countries Trade",
      content: `## Why Countries Trade

International trade is one of the most powerful forces shaping the modern world. Every day, trillions of dollars' worth of goods and services cross national borders — oil from Saudi Arabia, electronics from China, software from the United States, wine from France. But why do countries trade at all? Why not simply produce everything domestically?

### The Core Motivation: Mutual Gain

The fundamental insight of trade theory is that **trade is not zero-sum**. When two countries voluntarily exchange goods, both can be better off. This seems counterintuitive — if one country is buying something, is it not losing money? The answer lies in the concept of **opportunity cost**.

Consider a simple example. Country A can produce either 100 cars or 200 tons of wheat with its resources. Country B can produce either 50 cars or 300 tons of wheat. Even though Country A is better at making cars, and Country B is better at growing wheat, both benefit if each specializes in what it does relatively well and trades for the rest.

### Key Drivers of Trade

Several factors motivate international trade:

| Driver | Explanation | Example |
|--------|-------------|---------|
| **Resource endowments** | Countries have different natural resources | Saudi Arabia exports oil; Brazil exports coffee |
| **Technology differences** | Nations develop expertise in different industries | Japan in robotics; Germany in precision engineering |
| **Economies of scale** | Larger markets allow lower per-unit costs | Boeing and Airbus serve the global market |
| **Consumer preferences** | People want variety beyond domestic production | French wine, Swiss chocolate, Italian fashion |
| **Cost differences** | Labor and capital costs vary across countries | Textile manufacturing in Bangladesh vs. Sweden |

### Gains from Trade: A Numerical Example

Suppose the United States can produce 1 computer in 10 labor hours or 1 ton of rice in 5 labor hours. Vietnam can produce 1 computer in 100 labor hours or 1 ton of rice in 10 labor hours. The US is more productive at both goods (this is called **absolute advantage**). Should trade still occur?

Yes. The US gives up 2 tons of rice to make 1 computer (10/5), while Vietnam gives up 10 tons of rice to make 1 computer (100/10). The US has a lower opportunity cost for computers, so it should specialize in computers. Vietnam has a lower opportunity cost for rice (0.1 computers vs. 0.5 computers), so it should specialize in rice. Both countries end up with more total output than if they each tried to produce both goods.

### Trade in the Real World

Global trade has grown enormously over the past century. World exports as a share of GDP rose from about 8% in 1950 to over 30% by 2023. This growth has been driven by:

- **Falling transportation costs** — containerized shipping reduced costs by over 90%
- **Trade agreements** — the WTO, NAFTA/USMCA, and the EU reduced tariffs
- **Technology** — the internet enabled trade in services (outsourcing, remote work)
- **Political stability** — the post-WWII order encouraged economic cooperation

### Who Benefits from Trade?

Trade creates winners and losers within each country. Consumers generally benefit from lower prices and greater variety. Industries that export gain access to larger markets. However, workers in industries that face import competition may lose jobs or see wages decline. This distributional tension — aggregate gains but concentrated losses — is the central political challenge of trade policy.

### The Anti-Trade Argument

Critics of free trade point to job losses in manufacturing (such as the decline of the US Rust Belt), environmental concerns (shipping goods thousands of miles), and national security risks (dependence on foreign suppliers for critical goods like semiconductors or pharmaceuticals). These concerns are legitimate and are addressed through trade policy, which we explore in the next module.

### Key Takeaway

Countries trade because specialization and exchange allow both parties to consume more than they could in isolation. The theoretical foundation for this — comparative advantage — is one of the most powerful ideas in all of economics.

> "If a foreign country can supply us with a commodity cheaper than we ourselves can make it, better buy it of them with some part of the produce of our own industry." — Adam Smith, *The Wealth of Nations* (1776)

*Resources: Krugman, Obstfeld & Melitz, International Economics; WTO World Trade Statistical Review.*`,
    },
    {
      id: "ie-trade-absolute-comparative-advantage",
      slug: "absolute-comparative-advantage",
      title: "Absolute & Comparative Advantage",
      content: `## Absolute & Comparative Advantage

The concepts of absolute and comparative advantage form the intellectual bedrock of international trade theory. Understanding the distinction between them is essential for grasping why trade benefits all parties — even when one country appears to be better at producing everything.

### Absolute Advantage (Adam Smith, 1776)

Adam Smith introduced the concept of **absolute advantage** in *The Wealth of Nations*. A country has an absolute advantage in producing a good if it can produce that good using fewer resources (or more output per unit of input) than another country.

**Example:** If France can produce 1 bottle of wine using 2 hours of labor, while England requires 6 hours, France has an absolute advantage in wine production. If England can produce 1 yard of cloth in 3 hours while France requires 4 hours, England has an absolute advantage in cloth.

Smith's insight was straightforward: countries should export goods where they have an absolute advantage and import goods where they do not. Both countries benefit. But what happens when one country has an absolute advantage in **everything**?

### Comparative Advantage (David Ricardo, 1817)

David Ricardo's answer to this question is arguably the most important insight in economics. Even if one country is more productive in every good, **both countries still benefit from trade** as long as their relative productivities differ.

The key concept is **opportunity cost** — what you give up to produce one more unit of a good.

| Country | Hours to Produce 1 Unit of Wine | Hours to Produce 1 Unit of Cloth |
|---------|--------------------------------|----------------------------------|
| Portugal | 80 | 90 |
| England | 120 | 100 |

Portugal has an absolute advantage in both goods (it uses fewer hours for each). But look at the opportunity costs:

- **Portugal's opportunity cost of wine:** 80/90 = 0.89 units of cloth
- **England's opportunity cost of wine:** 120/100 = 1.20 units of cloth
- **Portugal's opportunity cost of cloth:** 90/80 = 1.13 units of wine
- **England's opportunity cost of cloth:** 100/120 = 0.83 units of wine

Portugal has a lower opportunity cost for wine (0.89 < 1.20), so Portugal has a **comparative advantage** in wine. England has a lower opportunity cost for cloth (0.83 < 1.13), so England has a **comparative advantage** in cloth.

### The Magic of Specialization

If each country specializes in its comparative advantage good and trades, total world output increases. Before trade, each country divides its labor between both goods. After specialization and trade, the same total labor produces more wine and more cloth. This is the fundamental theorem of trade: **specialization according to comparative advantage expands the consumption possibilities of all trading partners**.

### Common Misconceptions

**"A country that is worse at everything cannot benefit from trade."** False. Comparative advantage guarantees gains from trade even for the less productive country. What matters is relative, not absolute, productivity.

**"Comparative advantage is static."** In reality, comparative advantage evolves. South Korea shifted from rice and textiles in the 1960s to semiconductors and automobiles by the 2000s. Countries can invest in education, infrastructure, and technology to change their comparative advantage over time.

**"Low wages create comparative advantage."** Low wages alone do not determine trade patterns. What matters is productivity relative to wages. A country with low wages but even lower productivity may have no cost advantage at all.

### Empirical Evidence

Economists have tested Ricardian trade theory extensively. Dornbusch, Fischer, and Samuelson (1977) showed that in a multi-good model, countries export goods where their relative productivity is highest. Balassa (1963) confirmed that US exports were concentrated in industries where US labor productivity exceeded British productivity by the largest margins — exactly as Ricardo predicted.

### Modern Extensions

While Ricardo's model uses only labor as a factor of production, modern trade theory extends comparative advantage to include capital, land, technology, and institutions. The Heckscher-Ohlin model (next lesson) adds factor endowments. New Trade Theory adds economies of scale. But the core Ricardian insight remains: **differences in opportunity costs drive mutually beneficial trade**.

### Key Takeaway

Comparative advantage shows that every country has something to gain from trade, regardless of its absolute productivity. It is opportunity cost, not absolute efficiency, that determines trade patterns.

> "It is not by the absolute but by the comparative cost of production that trade between nations is governed." — David Ricardo

*Resources: Ricardo, On the Principles of Political Economy and Taxation (1817); Krugman & Obstfeld, International Economics.*`,
    },
    {
      id: "ie-trade-heckscher-ohlin",
      slug: "heckscher-ohlin",
      title: "Heckscher-Ohlin Model",
      content: `## Heckscher-Ohlin Model

While Ricardo explained trade through differences in labor productivity, the **Heckscher-Ohlin (H-O) model** offers a different explanation: countries trade because they have different **factor endowments** — different relative amounts of labor, capital, and land.

### The Core Idea

Developed by Swedish economists Eli Heckscher (1919) and Bertil Ohlin (1933), the H-O model predicts that a country will export goods that use its **abundant factor** intensively and import goods that use its **scarce factor** intensively.

- A **labor-abundant** country (e.g., Bangladesh) will export labor-intensive goods (textiles, garments)
- A **capital-abundant** country (e.g., the United States) will export capital-intensive goods (aircraft, software, pharmaceuticals)
- A **land-abundant** country (e.g., Australia) will export land-intensive goods (wheat, wool, minerals)

### Model Assumptions

The H-O model makes several important assumptions:

1. **Two countries, two goods, two factors** (the "2x2x2" framework)
2. **Identical technology** across countries — unlike Ricardo, productivity differences are not the driver
3. **Different factor endowments** — this is the only source of trade
4. **Constant returns to scale** — doubling inputs doubles output
5. **Perfect competition** — no monopolies or market power
6. **Free trade** — no tariffs or transport costs
7. **Factor immobility** across borders — workers and capital do not move between countries

### A Concrete Example

Consider the United States (capital-abundant) and China (labor-abundant). The US has relatively more machines, technology, and infrastructure per worker. China has a larger workforce relative to its capital stock.

| Good | Factor Intensity | Who Exports? |
|------|-----------------|--------------|
| Commercial aircraft | Capital-intensive | United States |
| Textiles & apparel | Labor-intensive | China |
| Software | Capital & skill-intensive | United States |
| Assembled electronics | Labor-intensive | China |

This pattern broadly matches real-world trade flows, though the reality is more complex than the simple model suggests.

### Key Theorems from the H-O Framework

The H-O model generates several important results:

**1. The Heckscher-Ohlin Theorem:** Countries export goods intensive in their abundant factor. This is the core prediction.

**2. The Stolper-Samuelson Theorem:** Trade increases the real return to the abundant factor and decreases the real return to the scarce factor. In the US, trade raises returns to capital (profits) and lowers returns to unskilled labor (wages). This theorem explains why free trade has both supporters and opponents within every country.

**3. The Rybczynski Theorem:** If a country's endowment of one factor grows (say, more capital through investment), it will produce more of the capital-intensive good and less of the labor-intensive good at constant prices.

**4. The Factor Price Equalization Theorem:** Under free trade, factor prices (wages, rental rates) will converge across countries. If true, trade in goods substitutes for migration of labor and capital. In practice, full equalization does not occur due to trade barriers and other frictions.

### The Leontief Paradox

In 1953, Wassily Leontief tested the H-O model using US trade data and found a puzzling result: US exports were actually more labor-intensive than US imports, despite the US being the most capital-abundant country in the world. This became known as the **Leontief Paradox**.

Explanations for the paradox include:
- The US has abundant **skilled labor** (human capital), which Leontief did not separate from raw labor
- US trade policy protected capital-intensive industries, distorting trade patterns
- The two-factor model is too simple — you need to distinguish human capital, physical capital, natural resources, and technology

### Modern Relevance

The H-O model helps explain major trade patterns: why developing countries tend to export manufactured goods while developed countries export high-tech products and services. It also explains why trade creates distributional conflicts — workers in import-competing industries (like US manufacturing) bear the cost while consumers and export industries benefit.

### Key Takeaway

The Heckscher-Ohlin model shows that trade patterns arise from differences in factor endowments. Countries export what they have in abundance. But trade creates winners and losers within each country, making trade policy inherently political.

> "International trade is but a special case of the general problem of the location of economic activity." — Bertil Ohlin

*Resources: Feenstra & Taylor, International Economics; Krugman, Obstfeld & Melitz, International Economics.*`,
    },
    {
      id: "ie-trade-new-trade-theory",
      slug: "new-trade-theory",
      title: "New Trade Theory (Krugman)",
      content: `## New Trade Theory (Krugman)

Classical trade theories (Ricardo, H-O) explain trade between dissimilar countries — wine from Portugal, cloth from England, textiles from Bangladesh, aircraft from the US. But they struggle to explain the dominant pattern of modern trade: **similar countries trading similar goods**. Germany exports BMWs to Japan while Japan exports Toyotas to Germany. The US exports Boeing aircraft to Europe while importing Airbus aircraft from Europe. Why?

### The Puzzle of Intra-Industry Trade

By the 1970s, economists noticed that the majority of trade among developed countries was **intra-industry trade** — the exchange of similar products within the same industry. France exports cars to Germany and imports cars from Germany. This makes no sense under Ricardo or H-O, which predict countries should specialize in different industries.

Paul Krugman's **New Trade Theory**, developed in a series of papers starting in 1979, provided the explanation. For this work, Krugman received the Nobel Prize in Economics in 2008.

### The Key Ingredients

New Trade Theory rests on two pillars that classical models assumed away:

**1. Economies of Scale (Increasing Returns)**

Many industries exhibit **increasing returns to scale** — as a firm produces more, its average cost falls. Manufacturing a car requires billions in R&D and factory setup, but these fixed costs are spread over more units as production increases. A firm producing 1 million cars has much lower per-unit costs than one producing 10,000.

This means it is efficient for the world to have only a few producers of each differentiated product, rather than every country producing every variety.

**2. Product Differentiation (Consumer Love of Variety)**

Consumers prefer variety. A BMW is not a perfect substitute for a Toyota — they differ in design, features, brand image, and driving experience. Because consumers value variety, there is demand for multiple differentiated products within the same industry.

### How New Trade Theory Works

Combine these two ingredients and trade emerges even between identical countries:

1. Economies of scale mean each country can only efficiently produce a **limited number of varieties**
2. Consumers want **more varieties** than any single country produces
3. Trade allows consumers to access the full range of global varieties
4. Each country specializes in different varieties of the same good

Germany produces BMWs, Mercedes, and Audis. Japan produces Toyotas, Hondas, and Nissans. Both countries export cars to each other, and consumers in both countries enjoy a wider selection than either could produce alone.

### The Role of History and Luck

New Trade Theory has a radical implication: **trade patterns may be arbitrary**. Unlike comparative advantage (which is determined by productivity or endowments), specialization under increasing returns may depend on **history, luck, and first-mover advantages**.

Why is the US dominant in commercial aircraft? Partly because Boeing got an early start (boosted by military contracts during WWII). Why is Switzerland famous for watches? Historical accident and accumulated expertise. Once a country establishes a lead in an industry with increasing returns, it is very hard for competitors to catch up.

### Policy Implications: Strategic Trade Policy

If trade patterns are partly arbitrary and driven by first-mover advantages, governments might be able to **shift comparative advantage** through industrial policy. This idea, known as **strategic trade policy**, suggests that subsidies to high-tech industries could help domestic firms capture economies of scale and earn excess profits in global markets.

Krugman himself was cautious about this implication. While theoretically possible, strategic trade policy requires governments to "pick winners" — something they historically do poorly. The risk of politically motivated subsidies, retaliation by trading partners, and rent-seeking by firms makes strategic trade policy dangerous in practice.

### Empirical Support

Intra-industry trade now accounts for roughly 60-70% of trade among developed countries. The gravity model of trade — which shows that trade between two countries is proportional to their economic size and inversely proportional to distance — is consistent with New Trade Theory's predictions. Countries trade most with large, nearby, similar economies.

### Key Takeaway

New Trade Theory explains why similar countries trade similar products: economies of scale limit the number of varieties each country can produce, and consumers value variety. Trade patterns may depend as much on history and luck as on fundamental economic differences.

> "Economists have traditionally emphasized the idea that countries trade because they are different. But much of world trade is between countries that are quite similar." — Paul Krugman

*Resources: Krugman, "Increasing Returns, Monopolistic Competition, and International Trade" (1979); Krugman, Nobel Prize Lecture (2008).*`,
    },
    {
      id: "ie-trade-winners-losers",
      slug: "winners-and-losers",
      title: "Winners & Losers from Trade",
      content: `## Winners & Losers from Trade

International trade increases total economic output — this is the clear prediction of every major trade theory. But total gains tell only part of the story. Within each country, trade creates **winners and losers**, and the distributional consequences of trade are among the most politically contentious issues in economics.

### Who Wins from Trade?

**Consumers:** Trade lowers prices and increases variety. When the US imports clothing from Bangladesh, American consumers pay less for shirts and have more styles to choose from. The US International Trade Commission estimated that trade liberalization saved the average American household approximately \\\$10,000 per year in lower prices.

**Export industries:** Firms in sectors where a country has comparative advantage gain access to larger markets. US tech companies, German automakers, and Australian mining firms all benefit enormously from trade.

**Owners of abundant factors:** The Stolper-Samuelson theorem predicts that trade raises returns to a country's abundant factor. In capital-abundant countries like the US, trade increases profits and returns to skilled workers. In labor-abundant countries like Vietnam, trade raises wages for manufacturing workers.

### Who Loses from Trade?

**Workers in import-competing industries:** When a country opens to trade, industries facing foreign competition may contract. The classic example is US manufacturing. Between 2000 and 2010, the US lost approximately 5.5 million manufacturing jobs. Research by David Autor, David Dorn, and Gordon Hanson (the "China Shock" studies) found that regions most exposed to Chinese import competition experienced:

- Significant job losses in manufacturing
- Lower wages for remaining workers
- Increased use of disability insurance and government transfers
- Slower recovery than expected — many workers never found equivalent employment

**Owners of scarce factors:** In capital-abundant countries, unskilled labor tends to lose from trade. In land-scarce countries, landowners lose when food imports flood in.

### The Compensation Problem

Economists often argue that trade creates enough total gains to compensate the losers while still leaving everyone better off. This is technically true — the aggregate gains exceed the losses. But in practice, **compensation rarely happens**.

The US Trade Adjustment Assistance (TAA) program, designed to help workers displaced by trade, has been chronically underfunded and reaches only a fraction of affected workers. Studies show that TAA benefits cover only 10-20% of the lifetime earnings losses experienced by displaced manufacturing workers.

This creates a fundamental political problem: the gains from trade are diffuse (slightly lower prices for millions of consumers) while the losses are concentrated (devastating job losses in specific communities). Concentrated losers are more politically organized than diffuse winners.

### The China Shock

The most important empirical work on trade's distributional effects is the "China Shock" literature. When China joined the WTO in 2001, its exports to the US surged from \\\$100 billion to over \\\$500 billion by 2015. Autor, Dorn, and Hanson found that:

- US regions more exposed to Chinese imports saw larger declines in manufacturing employment
- The labor market adjustment was slower and more painful than trade theory predicted
- Affected workers did not smoothly transition to other industries — many left the labor force entirely
- These economic shocks contributed to political polarization and support for protectionist candidates

### Beyond Manufacturing: Services Trade

The distributional effects of trade are evolving. As trade increasingly involves services (call centers, software development, medical imaging), white-collar workers in developed countries face new competitive pressures. Indian IT firms, Philippine call centers, and Eastern European software developers compete with workers in the US and Europe.

### Policy Responses

How should societies address trade's distributional effects? Options include:

1. **Trade Adjustment Assistance** — retrain and support displaced workers (needs much more funding)
2. **Wage insurance** — supplement earnings when displaced workers take lower-paying jobs
3. **Place-based policies** — invest in communities hardest hit by trade competition
4. **Education and skills** — prepare workers for industries where the country has comparative advantage
5. **Gradual liberalization** — phase in trade openness to allow industries time to adjust

### Key Takeaway

Trade makes countries richer in aggregate but creates real losers. The political sustainability of free trade depends on whether societies compensate those who are harmed. When they fail to do so, backlash against globalization — from Brexit to trade wars — becomes inevitable.

> "Trade does not just create winners and losers among countries; it creates winners and losers within countries. And the losers have votes." — Dani Rodrik

*Resources: Autor, Dorn & Hanson, "The China Shock" (2016); Rodrik, The Globalization Paradox; Stolper & Samuelson (1941).*`,
    },
  ],
};
