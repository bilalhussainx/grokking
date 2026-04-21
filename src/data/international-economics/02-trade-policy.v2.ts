import { Module } from "../types";

export const tradePolicyModule: Module = {
  id: "ie-policy",
  title: "Trade Policy",
  description: "Examine the tools governments use to manage trade — tariffs, quotas, trade agreements, and the political economy of protectionism.",
  lessons: [
    {
      id: "ie-policy-tariffs",
      slug: "tariffs",
      title: "Tariffs",
      content: `## Tariffs

A **tariff** is a tax imposed on imported goods. It is the oldest and most common instrument of trade policy, dating back thousands of years. Tariffs raise the price of imported goods, making domestic producers more competitive and generating revenue for the government. Despite their simplicity, tariffs have complex economic effects that ripple through entire economies.

### Types of Tariffs

| Type | Description | Example |
|------|-------------|---------|
| **Specific tariff** | Fixed dollar amount per unit imported | \\$0.50 per kilogram of imported steel |
| **Ad valorem tariff** | Percentage of the import's value | 25% tariff on imported automobiles |
| **Compound tariff** | Combination of specific and ad valorem | \\$0.10/kg plus 5% of value |
| **Revenue tariff** | Designed primarily to raise government income | Historically common before income taxes existed |
| **Protective tariff** | Designed primarily to shield domestic industry | Most modern tariffs |

### Economic Effects of a Tariff

When a small country imposes a tariff on imports, several effects follow:

**Price effect:** The domestic price of the imported good rises by (approximately) the amount of the tariff. If a \\$100 imported widget faces a 25% tariff, its domestic price rises to roughly \\$125.

**Consumption effect:** Consumers buy less of the now-more-expensive good. Some switch to domestic substitutes; others simply buy less. Consumer surplus falls.

**Production effect:** Domestic producers, now shielded from full foreign competition, produce more. They can charge higher prices and still sell. Producer surplus rises.

**Revenue effect:** The government collects tariff revenue equal to the tariff rate multiplied by the quantity of imports.

**Deadweight loss:** The tariff creates two triangles of deadweight loss — one from inefficient domestic production (resources diverted to an industry where the country lacks comparative advantage) and one from reduced consumption. These represent the net cost to society.

### Who Wins and Who Loses?

- **Winners:** Domestic producers in the protected industry (higher prices and sales), government (tariff revenue)
- **Losers:** Domestic consumers (higher prices, less variety), foreign exporters (reduced market access), domestic firms that use the imported good as an input

### The Large Country Case

If the importing country is large enough to affect world prices (like the US or EU), a tariff can improve the country's **terms of trade** by forcing foreign exporters to lower their prices to maintain sales. In this case, the large country captures some of the tariff burden from foreign producers. However, this "optimal tariff" argument invites retaliation, which erases the gains.

### Real-World Example: US Steel Tariffs

In 2018, the United States imposed 25% tariffs on steel imports and 10% on aluminum, citing national security concerns under Section 232. The effects were:

- US steel prices rose approximately 9% within months
- Domestic steel production increased modestly (about 6%)
- Downstream industries (auto manufacturing, construction, appliances) faced higher input costs
- An estimated 75,000 jobs were created in steel production but up to 400,000 jobs were lost in steel-consuming industries
- Trading partners (EU, Canada, China) retaliated with their own tariffs on US exports

This illustrates a recurring pattern: tariffs help the protected industry but harm the broader economy, especially industries that use the protected good as an input.

### Effective Rate of Protection

The **nominal tariff rate** (the rate on the final good) does not capture the full picture. What matters is the **effective rate of protection** — how much the tariff increases value added in the domestic industry. If a country places a 20% tariff on imported cars but allows car parts to enter duty-free, the effective protection for the car assembly industry is much higher than 20%, because the tariff protects only the assembly stage while inputs remain cheap.

### Why Tariffs Persist

Despite the clear net costs, tariffs remain popular because:
- The benefits are concentrated among a few vocal producers
- The costs are spread thinly across millions of consumers
- Tariffs are politically easy to implement and generate visible revenue
- National security and strategic industry arguments provide political cover

### Key Takeaway

Tariffs raise domestic prices, protect domestic producers, generate government revenue, and impose deadweight losses on the economy. They help specific industries at the expense of consumers and downstream industries. The net effect is almost always negative for the imposing country.

> "Protectionism is like locking yourself in a dark room. You keep out the sunlight, but you also keep out the fresh air." — Kofi Annan

*Resources: Irwin, Free Trade Under Fire; Feenstra & Taylor, International Economics; US International Trade Commission reports.*`,
    },
    {
      id: "ie-policy-quotas-ntbs",
      slug: "quotas-and-ntbs",
      title: "Quotas & Non-Tariff Barriers",
      content: `## Quotas & Non-Tariff Barriers

While tariffs are the most transparent form of trade restriction, governments have developed a vast arsenal of **non-tariff barriers (NTBs)** to protect domestic industries. As tariffs have declined under WTO rules, NTBs have become the dominant form of trade restriction in the modern global economy.

### Import Quotas

An **import quota** is a quantitative restriction on the amount of a good that can be imported during a given period. For example, a country might limit sugar imports to 500,000 tons per year.

**How quotas work:** Once the quota limit is reached, no additional imports are allowed regardless of price. This creates a wedge between the world price and the domestic price, similar to a tariff. Domestic producers benefit from reduced competition, and domestic prices rise.

**Key difference from tariffs:** With a tariff, the government collects revenue. With a quota, the price difference is captured as **quota rents** — excess profits earned by whoever holds the right to import under the quota. If the government auctions quota licenses, it captures the rents. If licenses are allocated to foreign exporters (as with Voluntary Export Restraints), the rents flow abroad.

### Voluntary Export Restraints (VERs)

A **VER** is an agreement where the exporting country "voluntarily" limits its exports to the importing country. In practice, VERs are negotiated under threat of harsher measures. The most famous VER was the 1981 agreement limiting Japanese automobile exports to the US to 1.68 million cars per year.

The ironic result: Japanese automakers responded by shifting to higher-priced, higher-margin vehicles (Lexus, Acura, Infiniti), ultimately making them stronger competitors. VERs are now banned under WTO rules, but their legacy illustrates the unintended consequences of trade restrictions.

### Types of Non-Tariff Barriers

| NTB Type | Description | Example |
|----------|-------------|---------|
| **Technical standards** | Product must meet domestic specifications | EU safety standards for electronics |
| **Sanitary/phytosanitary (SPS)** | Health and safety rules for food/agriculture | Banning beef treated with hormones |
| **Licensing requirements** | Importers must obtain government permits | Pharmaceutical import licenses |
| **Local content requirements** | Products must contain a minimum % of domestic inputs | Auto manufacturing in Brazil |
| **Government procurement** | Government contracts reserved for domestic firms | "Buy American" provisions |
| **Subsidies** | Government financial support for domestic producers | EU Common Agricultural Policy |
| **Anti-dumping duties** | Tariffs on goods sold below cost | US duties on Chinese solar panels |
| **Customs delays** | Slow processing of imports at borders | Bureaucratic inspections |

### The Rise of Regulatory Protectionism

As tariffs have fallen (the average global tariff dropped from over 20% in 1990 to under 5% by 2020), NTBs have proliferated. The WTO estimates that NTBs now affect over 50% of global trade. They are harder to identify, measure, and challenge than tariffs because they often serve legitimate purposes (food safety, environmental protection) alongside protectionist ones.

**The EU-US hormone beef dispute** illustrates this tension. The EU banned imports of US beef raised with growth hormones, citing consumer health concerns. The US argued this was disguised protectionism, since scientific evidence showed no health risk. The WTO ruled in favor of the US, but the EU maintained its ban and accepted retaliatory tariffs instead. Was the ban about health or about protecting European farmers? The answer is genuinely ambiguous.

### Subsidies: The Hidden Trade Barrier

**Agricultural subsidies** are among the most contentious trade barriers. The US, EU, and Japan spend hundreds of billions annually subsidizing their farmers. These subsidies allow domestic farmers to sell at artificially low prices, undercutting farmers in developing countries who receive no such support.

Cotton subsidies provide a stark example. US cotton subsidies totaled approximately \\$5 billion per year in the early 2000s, depressing world cotton prices and devastating farmers in West African countries like Mali, Burkina Faso, and Chad — some of the world's poorest nations.

### Measuring NTBs

Economists measure the trade impact of NTBs by estimating their **tariff equivalent** — the tariff rate that would reduce trade by the same amount. Studies consistently find that NTBs impose a larger trade restriction than remaining tariffs. UNCTAD estimates that NTBs are equivalent to an average tariff of 10-15%, compared to actual average tariffs of under 5%.

### Key Takeaway

As tariffs have declined, non-tariff barriers have become the primary obstacle to free trade. They are harder to detect, measure, and negotiate away, and they often blend legitimate regulatory goals with protectionist intent. Modern trade negotiations focus as much on regulatory harmonization as on tariff reduction.

*Resources: WTO World Trade Report; UNCTAD Trade Analysis; Bhagwati, Protectionism.*`,
    },
    {
      id: "ie-policy-trade-agreements",
      slug: "trade-agreements",
      title: "Trade Agreements (WTO/NAFTA/EU)",
      content: `## Trade Agreements (WTO/NAFTA/EU)

Countries do not trade in a vacuum. The rules governing international trade are shaped by a complex web of bilateral, regional, and multilateral agreements. Understanding these institutions is essential for understanding why trade flows the way it does.

### The Multilateral System: GATT and the WTO

The modern trading system was born from the ashes of World War II. The Great Depression of the 1930s had triggered a wave of protectionism — the US Smoot-Hawley Tariff of 1930 raised duties on over 20,000 goods, and retaliatory tariffs from other countries collapsed world trade by 65%. This beggar-thy-neighbor spiral deepened the Depression and contributed to the political instability that led to war.

In 1947, 23 countries signed the **General Agreement on Tariffs and Trade (GATT)** to prevent a repeat. GATT established two core principles:

**1. Most Favored Nation (MFN):** Any trade concession given to one member must be extended to all members. If the US lowers its tariff on French wine, it must offer the same rate to all GATT members.

**2. National Treatment:** Once imported goods clear customs, they must be treated no worse than domestic goods in terms of taxes and regulations.

Through eight rounds of negotiations (1947-1994), GATT reduced average tariffs from approximately 40% to under 5%. The final round, the **Uruguay Round** (1986-1994), created the **World Trade Organization (WTO)** in 1995.

### The WTO Today

The WTO has 164 member countries covering over 98% of world trade. It provides:

- A **forum for trade negotiations** — though the current Doha Round (launched 2001) has stalled over agricultural subsidies and developing country concerns
- A **dispute settlement system** — the WTO's "court" adjudicates trade conflicts. Over 600 disputes have been filed since 1995
- **Trade monitoring** — the WTO publishes data and reviews member trade policies

The WTO faces serious challenges. The Doha Round's failure to reach agreement reflects deep divisions between developed and developing countries. The US has blocked appointments to the WTO's Appellate Body since 2019, effectively paralyzing the dispute settlement system. And the rise of China — whose state-directed economic model does not fit neatly into WTO rules — has strained the institution.

### Regional Trade Agreements

Frustrated by the slow pace of multilateral negotiations, countries have increasingly turned to **regional trade agreements (RTAs)**. Over 350 RTAs are currently in force, compared to fewer than 50 in 1990.

**NAFTA/USMCA (North America):** The North American Free Trade Agreement (1994) created a free trade zone among the US, Canada, and Mexico. It eliminated most tariffs, liberalized investment rules, and included side agreements on labor and environment. NAFTA was renegotiated as the USMCA in 2018-2020, with updated provisions for digital trade, stronger labor rules for Mexico, and modified auto industry rules of origin.

**The European Union:** The EU is the world's deepest economic integration, going far beyond a simple trade agreement:
- Free movement of goods, services, capital, and people
- A common external tariff (customs union)
- A shared currency (the euro, for 20 members)
- Common regulations and standards
- A supranational court (European Court of Justice)

**Other major RTAs:** CPTPP (11 Pacific Rim countries), RCEP (15 Asia-Pacific countries including China), African Continental Free Trade Area (AfCFTA, 54 African countries), Mercosur (South American bloc).

### Trade Creation vs. Trade Diversion

Economist Jacob Viner (1950) identified two effects of regional trade agreements:

**Trade creation:** When an RTA causes a member country to replace expensive domestic production with cheaper imports from a partner country. This is welfare-improving.

**Trade diversion:** When an RTA causes a member to replace cheap imports from a non-member with more expensive imports from a partner country (which now gets tariff-free access). This is welfare-reducing.

A good RTA creates more trade than it diverts. The EU and NAFTA have been found to be net trade-creating, though both have diverted some trade from non-members.

### The Spaghetti Bowl Problem

The proliferation of overlapping RTAs creates a "spaghetti bowl" of different rules, tariff schedules, and rules of origin. A firm exporting from Vietnam to Japan faces different rules depending on whether it uses the CPTPP, RCEP, or the bilateral Japan-Vietnam agreement. This complexity raises compliance costs and can offset some of the benefits of free trade.

### Key Takeaway

Trade agreements — from the multilateral WTO to regional pacts like the EU and USMCA — have been the primary driver of trade liberalization since WWII. But the multilateral system is under strain, and the proliferation of regional agreements creates new complexities.

*Resources: WTO Annual Reports; Irwin, Clashing Over Commerce; Baldwin, The Great Convergence.*`,
    },
    {
      id: "ie-policy-trade-wars",
      slug: "trade-wars",
      title: "Trade Wars",
      content: `## Trade Wars

A **trade war** occurs when countries retaliate against each other with escalating trade restrictions — tariffs, quotas, sanctions, and other barriers. Trade wars are as old as international trade itself, but they remain one of the most destructive forces in the global economy.

### Anatomy of a Trade War

Trade wars follow a predictable pattern:

1. **Trigger:** One country imposes a trade barrier, often citing unfair practices, national security, or domestic political pressure
2. **Retaliation:** The targeted country responds with its own restrictions on the first country's exports
3. **Escalation:** Each round of retaliation prompts further measures, expanding the range of affected products
4. **Economic damage:** Both countries suffer from higher prices, reduced trade, and uncertainty
5. **Resolution (maybe):** Negotiations eventually produce a deal, or the restrictions become the new normal

### The Smoot-Hawley Disaster (1930)

The most infamous trade war in history began with the US Smoot-Hawley Tariff Act of 1930, which raised tariffs on over 20,000 imported goods to record levels. Over 1,000 economists signed a petition urging President Hoover to veto the bill. He signed it anyway.

The consequences were catastrophic:
- US trading partners retaliated immediately — Canada, Britain, France, Germany, and others raised their own tariffs
- World trade collapsed by approximately 65% between 1929 and 1934
- The tariff war deepened and prolonged the Great Depression
- The economic devastation contributed to political extremism in Europe

The lesson of Smoot-Hawley shaped the entire postwar trading system. GATT and the WTO were explicitly designed to prevent a repeat.

### The US-China Trade War (2018-Present)

The most significant modern trade war began in 2018 when the Trump administration imposed tariffs on approximately \\$360 billion worth of Chinese goods, citing intellectual property theft, forced technology transfer, and the US-China trade deficit (\\$375 billion in 2017). China retaliated with tariffs on approximately \\$110 billion of US goods.

**The US imposed:**
- 25% tariffs on \\$250 billion of Chinese imports (machinery, electronics, industrial goods)
- 7.5% tariffs on an additional \\$110 billion (consumer goods)
- Restrictions on Chinese tech companies (Huawei, ZTE)

**China retaliated with:**
- Tariffs of 5-25% on US agricultural products (soybeans, pork, dairy)
- Tariffs on US manufactured goods (autos, chemicals)
- Restrictions on rare earth mineral exports

**Economic Impact:**
- US consumers paid an estimated \\$51 billion more per year in higher prices (Tax Foundation)
- US agricultural exports to China fell from \\$24 billion to \\$14 billion
- Chinese manufacturing shifted to Vietnam, Mexico, and other countries (trade diversion, not reduction)
- Global supply chains were disrupted, increasing uncertainty for businesses worldwide
- The Phase One trade deal (January 2020) paused escalation but resolved few underlying issues

### The Chicken Tax and Other Historical Trade Wars

Trade wars are not always dramatic confrontations. Some become embedded in policy for decades:

**The Chicken Tax (1963):** France and Germany imposed tariffs on US chicken imports. The US retaliated with a 25% tariff on light trucks, which remains in effect today. This tariff is the primary reason foreign automakers build pickup trucks in the US rather than importing them, and it has protected the enormously profitable American truck market for over 60 years.

**The Banana Wars (1993-2009):** The EU gave preferential access to banana imports from former colonies in Africa and the Caribbean, discriminating against Latin American bananas produced by US companies (Chiquita, Dole). The US won multiple WTO cases, but the dispute took 16 years to resolve.

### Why Trade Wars Are (Almost) Always Harmful

Economic theory and historical evidence both show that trade wars reduce economic welfare:

- **Both sides pay higher prices** — tariffs are paid by domestic importers and passed to consumers
- **Retaliation ensures mutual damage** — the initial tariff's benefit to domestic producers is offset by lost export markets
- **Uncertainty depresses investment** — firms delay decisions when trade policy is unpredictable
- **Supply chain disruption** is costly — modern production spans multiple countries, and tariffs on intermediate goods cascade through supply chains
- **Trade diversion, not reduction** — trade often shifts to third countries rather than returning home

### When Might Trade Restrictions Be Justified?

Economists generally agree that trade wars are net negative but acknowledge limited exceptions:
- **National security** — ensuring domestic production of essential goods (defense, pharmaceuticals, semiconductors)
- **Bargaining leverage** — using tariff threats to extract concessions (though this is risky)
- **Addressing genuine unfair practices** — when countries subsidize exports or steal intellectual property

### Key Takeaway

Trade wars raise prices for consumers, disrupt supply chains, reduce investment, and rarely achieve their stated objectives. History shows that escalation is easy and de-escalation is hard. The postwar trading system was built specifically to prevent the kind of tit-for-tat protectionism that deepened the Great Depression.

> "When goods do not cross borders, soldiers will." — attributed to Frederic Bastiat

*Resources: Irwin, Peddling Protectionism (on Smoot-Hawley); Bown, "The 2018 US-China Trade Conflict" (Brookings); WTO Trade Monitoring.*`,
    },
    {
      id: "ie-policy-infant-industry",
      slug: "infant-industry-argument",
      title: "The Infant Industry Argument",
      content: `## The Infant Industry Argument

The **infant industry argument** is the most intellectually respected case for protectionism. It holds that new industries in developing countries may need temporary protection from foreign competition to grow, achieve economies of scale, and eventually become globally competitive.

### The Logic

Consider a developing country that wants to build a semiconductor industry. Existing producers (in the US, South Korea, Taiwan) have decades of experience, massive scale, established supply chains, and deep pools of skilled workers. A new entrant cannot compete on day one — its costs are too high, its technology is immature, and it lacks the learning that comes from years of production.

Without protection, the infant industry would be destroyed by imports before it ever gets the chance to mature. With temporary tariffs or subsidies, the infant can:

1. **Learn by doing** — production experience reduces costs over time
2. **Achieve economies of scale** — larger output lowers per-unit costs
3. **Develop supply chains** — upstream and downstream industries emerge
4. **Train workers** — a skilled workforce develops within the industry
5. **Innovate** — R&D spending produces technological improvements

Once the industry matures and reaches world-class competitiveness, the protection can be removed.

### Historical Success Stories

Several countries have used infant industry protection to build globally competitive industries:

**South Korea:** In the 1960s, South Korea was poorer than many African countries. The government protected and subsidized heavy industries — steel (POSCO), automobiles (Hyundai), electronics (Samsung), and shipbuilding. By the 1990s, these former "infants" were world leaders. South Korea's GDP per capita grew from \\$158 in 1960 to over \\$35,000 by 2023.

**Japan:** Japan protected its auto and electronics industries in the 1950s-60s through tariffs, quotas, and industrial policy administered by MITI (Ministry of International Trade and Industry). Toyota, Honda, and Sony were nurtured behind protective barriers before becoming global giants.

**China:** China's post-1978 development strategy combined infant industry protection with export promotion. Chinese firms were shielded from import competition in key sectors (telecom, banking, internet) while being pushed to export in others (manufacturing). Companies like Huawei, Lenovo, and BYD grew behind protective walls before becoming international competitors.

**The United States:** America's first Treasury Secretary, Alexander Hamilton, advocated infant industry protection in his 1791 *Report on Manufactures*. The US maintained high tariffs throughout the 19th century, protecting its manufacturing sector from British competition. By 1900, the US was the world's largest industrial economy.

### Conditions for Success

The infant industry argument works only under specific conditions:

**1. Genuine learning potential:** The industry must have real scope for cost reduction through experience. Not every industry has significant learning curves.

**2. Temporary protection:** Protection must be time-limited. If firms know protection will last forever, they have no incentive to become efficient. The key is a credible commitment to remove protection.

**3. Net present value test:** The future benefits of a competitive industry must exceed the present costs of protection (higher prices for consumers during the protection period).

**4. Market failure justification:** Protection is only justified if the private sector cannot capture the benefits of learning. If learning spills over to other firms (knowledge externalities) or if capital markets fail to provide patient financing, there is a market failure that government intervention can address.

### The Critics' Case

Despite its logical appeal and historical examples, the infant industry argument faces serious criticisms:

**Government failure:** Picking winners requires governments to identify industries with genuine learning potential and to resist political pressure to protect industries indefinitely. In practice, protection often goes to politically connected industries rather than those with the highest growth potential.

**Perpetual infancy:** Once an industry receives protection, it lobbies fiercely to keep it. The "infant" never grows up because it never has to. Many protected industries remain inefficient for decades.

**Rent-seeking:** Protection creates profits (rents) that firms spend on lobbying rather than innovation. Resources flow to securing government favors rather than improving products.

**Alternative instruments:** If the goal is to support learning and scale, subsidies are generally more efficient than tariffs. Subsidies directly reduce the firm's costs without raising consumer prices. Even better, investments in education, infrastructure, and R&D address the underlying market failures without distorting trade.

**Empirical evidence is mixed:** For every South Korea, there are many cases where infant industry protection failed — Latin American import substitution industrialization in the 1950s-70s produced inefficient, uncompetitive industries that eventually collapsed when protection was removed.

### Modern Applications

The infant industry argument has resurged in debates about green energy (should countries protect domestic solar panel or battery manufacturers?), semiconductors (the US CHIPS Act provides \\$52 billion in subsidies), and AI (should governments support domestic AI champions?).

### Key Takeaway

The infant industry argument is the strongest theoretical case for protectionism: temporary protection to allow new industries to achieve competitiveness. It has worked spectacularly in some countries (South Korea, Japan) but failed in many others. Success requires disciplined, time-limited protection with credible sunset clauses — conditions that are politically very hard to maintain.

> "The infant industry argument is the best theoretical case for protection, and also the most abused in practice." — Paul Krugman

*Resources: Chang, Kicking Away the Ladder; Hamilton, Report on Manufactures (1791); Krugman & Obstfeld, International Economics.*`,
    },
  ],
};
