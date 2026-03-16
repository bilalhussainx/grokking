import { Module } from "../types";

export const globalizationModule: Module = {
  id: "ie-globalization",
  title: "Globalization",
  description:
    "Trace the history and future of globalization — from global supply chains and offshoring to immigration economics and the forces driving deglobalization.",
  lessons: [
    {
      id: "ie-glob-history",
      slug: "history-of-globalization",
      title: "History of Globalization",
      content: `## History of Globalization

Globalization — the integration of economies, cultures, and populations across borders — is not a modern invention. It has ebbed and flowed for centuries, driven by technology, politics, and economic incentives. Understanding its history reveals that the current era of globalization is neither inevitable nor irreversible.

### The First Globalization (1870-1914)

The late 19th century saw an explosion of international economic integration often called the **first era of globalization**. Several factors drove this:

**Technology:** Steamships reduced transatlantic shipping time from weeks to days. Railways connected interiors to ports. The telegraph enabled near-instantaneous communication across continents. Refrigeration allowed perishable goods (meat from Argentina, butter from New Zealand) to be traded globally for the first time.

**Policy:** Britain, the world's dominant economic power, championed free trade after repealing the Corn Laws in 1846. Bilateral trade treaties spread across Europe. The gold standard provided a stable monetary framework for international transactions.

**Migration:** Between 1870 and 1914, approximately 60 million Europeans emigrated — primarily to the Americas, Australia, and South Africa. This was the largest peacetime migration in human history, facilitated by cheap steamship passage and open borders.

**Capital flows:** British capital financed railways, mines, and plantations across the empire and beyond. By 1914, foreign investment as a share of world GDP was comparable to (and in some measures exceeded) today's levels.

**Results:** Trade as a share of world GDP approximately doubled between 1870 and 1914. Price gaps between countries narrowed dramatically. Wages converged across the Atlantic as labor migrated from where it was abundant to where it was scarce.

### The Great Reversal (1914-1945)

World War I shattered the first globalization. Borders closed, trade routes were disrupted, and governments imposed controls on trade, capital, and migration. The interwar period made things worse:

- The US Smoot-Hawley tariff (1930) triggered a global trade war
- Capital controls became universal
- Immigration restrictions tightened (the US Immigration Act of 1924 severely limited entry)
- The gold standard collapsed during the Great Depression
- World trade fell by 65% between 1929 and 1934

The lesson was clear: globalization requires political support and institutional frameworks. Without them, it collapses — and the consequences can be catastrophic.

### The Second Globalization (1945-Present)

The postwar order was deliberately designed to promote economic integration while avoiding the instability of the pre-1914 era. Key institutions included:

- **GATT/WTO** — multilateral trade liberalization
- **IMF and World Bank** — international monetary stability and development
- **Bretton Woods system** — fixed exchange rates anchored to the dollar
- **Marshall Plan** — US aid to rebuild Europe

Globalization accelerated in distinct phases:

**Phase 1 (1945-1980): Trade in goods.** Tariffs fell through successive GATT rounds. Trade grew faster than GDP. But capital controls remained, migration was limited, and developing countries pursued import substitution.

**Phase 2 (1980-2008): Hyperglobalization.** Capital account liberalization, the fall of the Soviet Union, China's opening (1978), India's liberalization (1991), containerized shipping, and the internet combined to create an unprecedented surge in global integration. Trade as a share of GDP rose from 36% (1980) to 61% (2008). Foreign direct investment exploded. Global supply chains spread manufacturing across dozens of countries.

**Phase 3 (2008-Present): Slowbalization.** The 2008 financial crisis, followed by the US-China trade war, COVID-19 pandemic, and the Russia-Ukraine war, has slowed or partially reversed globalization. Trade growth has decelerated. Supply chains are being reorganized for resilience rather than pure efficiency. Geopolitical rivalry is replacing economic cooperation.

### Measuring Globalization

The **KOF Globalization Index** (published by ETH Zurich) ranks countries on economic, social, and political globalization. As of 2023, the most globalized countries are Singapore, the Netherlands, Belgium, Switzerland, and Ireland. The least globalized include North Korea, Somalia, and Eritrea. The US ranks surprisingly modestly (around 30th) due to its large domestic market.

### Key Takeaway

Globalization is not a one-way street. It has been reversed before — by war, depression, and political backlash — and it could be reversed again. The institutions and political consensus that sustain globalization require constant maintenance.

> "The world is flat... until it is not." — adapted from Thomas Friedman

*Resources: Baldwin, The Great Convergence; Rodrik, The Globalization Paradox; O'Rourke & Williamson, Globalization and History.*`,
    },
    {
      id: "ie-glob-supply-chains",
      slug: "global-supply-chains",
      title: "Global Supply Chains",
      content: `## Global Supply Chains

A modern smartphone contains components from over 40 countries. The glass comes from the US (Corning), the processor from Taiwan (TSMC), the memory from South Korea (Samsung), the rare earth minerals from China, and the assembly happens in China (Foxconn) or Vietnam. This is the reality of **global supply chains** — the complex networks that break production into stages spread across the world.

### How Supply Chains Became Global

Until the 1980s, most manufacturing was vertically integrated within national borders. A car company would source steel, stamp body panels, build engines, and assemble vehicles all in the same country. Several forces changed this:

**Containerized shipping (1956 onward):** Malcolm McLean's invention of the standardized shipping container reduced cargo handling costs by over 90%. Shipping a container from Shanghai to Los Angeles costs roughly \\\$2,000-\\\$5,000 — sometimes less than trucking it across the US.

**Trade liberalization:** Falling tariffs and trade agreements made it cheaper to cross borders.

**ICT revolution:** The internet, enterprise software (ERP systems), and telecommunications enabled real-time coordination across thousands of miles.

**Wage differentials:** A manufacturing worker in China earned 1/20th the wage of an American worker in the early 2000s. Even with shipping costs, labor cost savings were enormous.

### The Structure of Modern Supply Chains

Global supply chains are organized around **lead firms** — large multinational corporations that design products and manage brand relationships — and **suppliers** at various tiers:

**Tier 1:** Direct suppliers that deliver major components or sub-assemblies (e.g., Bosch supplying automotive parts to BMW)
**Tier 2:** Suppliers to Tier 1 firms (e.g., a circuit board manufacturer supplying Bosch)
**Tier 3+:** Raw material and commodity suppliers

| Industry | Supply Chain Characteristic | Key Hub |
|----------|---------------------------|---------|
| Electronics | Highly complex, many tiers | China/Taiwan/South Korea |
| Automotive | Regional clusters (EU, NAFTA, Asia) | Germany, Japan, US |
| Apparel | Labor-intensive, frequently shifts | Bangladesh, Vietnam, Ethiopia |
| Pharmaceuticals | Concentrated active ingredient production | India, China |
| Food/Agriculture | Commodity-based, long-distance | Brazil, US, Australia |

### Benefits of Global Supply Chains

**Lower costs:** Producing each component where it is cheapest reduces final product prices. Consumers benefit from affordable electronics, clothing, and food.

**Specialization:** Countries and firms develop deep expertise in specific stages of production. Taiwan's TSMC dominates advanced chip fabrication; Bangladesh specializes in garment assembly.

**Innovation diffusion:** Supply chain relationships transfer technology, management practices, and quality standards from advanced to developing countries.

**Employment:** Supply chains have created hundreds of millions of manufacturing jobs in developing countries, driving economic growth and poverty reduction.

### Vulnerabilities Exposed

Recent crises have revealed the fragility of global supply chains:

**COVID-19 (2020):** Factory shutdowns in China disrupted supply chains worldwide. Auto manufacturers could not get semiconductor chips. Hospitals faced shortages of personal protective equipment, much of which was produced in China. The pandemic exposed the risks of concentrated production.

**Suez Canal blockage (2021):** The container ship Ever Given ran aground, blocking the canal for six days. An estimated \\\$9 billion in trade per day was delayed, disrupting supply chains across Europe and Asia.

**Russia-Ukraine war (2022):** Ukraine is a major producer of neon gas (critical for semiconductor manufacturing) and grain. Russia supplies about 40% of Europe's natural gas. The war caused energy price spikes, food shortages, and supply chain disruptions.

**US-China tensions:** Tariff wars, export controls on semiconductors, and fears of a Taiwan contingency have pushed companies to reconsider China-centric supply chains.

### The Reshoring and Friendshoring Trend

In response to these vulnerabilities, companies and governments are restructuring supply chains:

**Reshoring:** Bringing production back to the home country. The US CHIPS Act (\\\$52 billion in subsidies) is designed to rebuild domestic semiconductor manufacturing.

**Nearshoring:** Moving production closer to home. Mexican manufacturing is booming as US companies shift from China to Mexico.

**Friendshoring:** Concentrating supply chains within geopolitically allied countries. The US, EU, Japan, and allies are trying to reduce dependence on China for critical goods.

**Diversification:** "China plus one" strategies add production in Vietnam, India, or Indonesia alongside existing Chinese operations.

### The Trade-Off: Efficiency vs. Resilience

The fundamental tension in supply chain design is between **efficiency** (minimizing cost through concentration and just-in-time inventory) and **resilience** (maintaining redundancy, diversification, and buffer stocks). The pre-2020 world optimized for efficiency. The post-2020 world is shifting toward resilience — but resilience is expensive.

### Key Takeaway

Global supply chains have delivered enormous efficiency gains and lifted hundreds of millions out of poverty. But their complexity and concentration create vulnerabilities to disruption. The coming decade will see a fundamental restructuring as companies and governments balance cost, speed, and security.

*Resources: Baldwin, The Great Convergence; Shih, "What Global Supply Chains Really Look Like" (HBR); World Bank, World Development Report 2020.*`,
    },
    {
      id: "ie-glob-offshoring",
      slug: "offshoring",
      title: "Offshoring & Outsourcing",
      content: `## Offshoring & Outsourcing

**Offshoring** and **outsourcing** are often used interchangeably, but they are distinct concepts. **Outsourcing** means contracting out a business function to an external firm. **Offshoring** means moving a business function to another country. A company can offshore without outsourcing (by setting up its own foreign subsidiary) or outsource without offshoring (by hiring a domestic third party).

### The Rise of Offshoring

Offshoring accelerated dramatically in the 1990s and 2000s, driven by:

**Cost differentials:** A software engineer in India earned approximately \\\$10,000 per year in 2000, compared to \\\$80,000 in the US. Even accounting for productivity differences and management overhead, the savings were substantial.

**Technology:** High-speed internet and fiber optic cables made it possible to transmit data, voice, and video across the globe instantly. Work that previously required physical presence could now be done remotely.

**Education:** Countries like India and the Philippines produced large numbers of English-speaking, technically educated graduates.

**Trade liberalization:** The WTO's General Agreement on Trade in Services (GATS) reduced barriers to cross-border services trade.

### Types of Offshoring

| Type | Description | Example |
|------|-------------|---------|
| **Manufacturing offshoring** | Moving production of physical goods | Nike factories in Vietnam |
| **IT offshoring** | Software development, maintenance | Indian IT firms (Infosys, TCS, Wipro) |
| **Business Process Outsourcing (BPO)** | Back-office functions: HR, accounting, data entry | Philippine call centers |
| **Knowledge Process Outsourcing (KPO)** | Higher-value: research, analytics, legal review | Legal research in India |
| **R&D offshoring** | Moving research and development activities | Pharma research in China and India |

### The India Story

India became the world's premier offshoring destination for IT and business services. Several factors aligned:

- Large English-speaking population
- Strong technical education system (IITs, engineering colleges)
- Time zone advantage (12.5 hours ahead of US West Coast — enabling "follow the sun" work)
- Government policies promoting IT exports (Software Technology Parks, tax incentives)
- Early mover advantage — companies like Infosys, Wipro, and TCS built global reputations

India's IT services exports grew from approximately \\\$1 billion in 1997 to over \\\$190 billion by 2023, employing over 5 million workers directly and supporting millions more indirectly.

### The Philippines Story

The Philippines emerged as the global leader in **voice-based BPO** (call centers). Factors included:
- American colonial history created strong English proficiency with a neutral accent
- Cultural affinity with the US (familiarity with American brands, TV, sports)
- Lower costs than India for voice services
- Government support and special economic zones

The Philippine BPO industry employs approximately 1.6 million workers and generates over \\\$30 billion in revenue, making it one of the country's largest export earners.

### Economic Effects in Developed Countries

Offshoring's impact on developed-country workers has been hotly debated:

**Job displacement:** Routine, codifiable tasks are most vulnerable to offshoring — data entry, basic programming, customer service, accounting. Studies estimate that 20-30% of US jobs involve tasks that could potentially be performed offshore, though actual offshoring is much lower.

**Wage effects:** Alan Blinder estimated that 22-29% of US jobs are potentially "offshorable." Workers in exposed occupations face wage pressure even if their specific jobs are not actually moved.

**Compensating effects:** Offshoring reduces costs for firms, which can lead to lower prices for consumers, higher profits for shareholders, and freed-up resources that can be reinvested in higher-value activities. Some studies find that offshoring increases domestic employment in complementary tasks.

**Net effect:** Most empirical studies find that offshoring has modest negative effects on wages and employment for directly affected workers, but positive effects on aggregate productivity and consumer welfare. The distributional consequences — concentrated losses for some workers, diffuse gains for consumers — mirror the trade policy debate more broadly.

### The Future of Offshoring

Several trends are reshaping offshoring:

**Automation and AI:** Robotic process automation (RPA) and AI can now perform many tasks that were previously offshored — data entry, basic customer service, routine coding. This may reduce the offshoring of low-skill tasks while increasing demand for high-skill workers everywhere.

**Remote work normalization:** COVID-19 demonstrated that knowledge work can be done from anywhere. This may accelerate offshoring of professional services (consulting, design, engineering) as companies realize they can access global talent pools.

**Rising wages in offshore destinations:** Indian IT salaries have risen significantly, narrowing the cost gap. Some companies are shifting to "next wave" destinations: Vietnam, Poland, Romania, Colombia, Kenya.

**Geopolitical risks:** Data privacy regulations, national security concerns, and geopolitical tensions are causing some companies to reshore sensitive functions.

### Key Takeaway

Offshoring is a natural extension of comparative advantage to the services sector. It has created millions of jobs in developing countries while delivering cost savings and productivity gains to developed-country firms. But like goods trade, it creates winners and losers — and managing the distributional consequences remains a policy challenge.

*Resources: Blinder, "How Many US Jobs Might Be Offshorable?" (2009); NASSCOM India IT reports; Friedman, The World Is Flat.*`,
    },
    {
      id: "ie-glob-immigration",
      slug: "immigration-economics",
      title: "Immigration Economics",
      content: `## Immigration Economics

Immigration is one of the most politically charged topics in economics. The economic analysis of immigration is often drowned out by cultural, identity, and security debates. But the economic evidence is surprisingly clear on many questions — even if the policy conclusions remain contested.

### Scale of Global Migration

As of 2023, approximately **281 million people** (3.6% of the world's population) live outside their country of birth. The number has nearly tripled since 1990. The largest migration corridors are:

| Corridor | Migrants | Driver |
|----------|----------|--------|
| Mexico to US | ~11 million | Wage differential, proximity |
| India to UAE | ~3.5 million | Oil economy labor demand |
| Syria to Turkey | ~3.6 million | Conflict/refugees |
| Ukraine to Poland | ~1.5 million | Conflict + EU proximity |
| Philippines to US | ~2 million | Historical ties, nursing/healthcare demand |

### The Fiscal Impact: Who Pays, Who Benefits?

**Short-term fiscal impact:** Immigrants who arrive as working-age adults are net fiscal contributors — they pay taxes immediately while consuming fewer services (they did not use the host country's education system as children, and they are not yet drawing pensions). Low-skilled immigrants may consume more in social services than they pay in taxes, but the net effect depends heavily on the specific program.

**Long-term fiscal impact:** A landmark National Academy of Sciences study (2017) found that over a 75-year horizon, the average immigrant to the US has a **positive net fiscal impact** of approximately \\\$259,000, driven primarily by the taxes paid by their children and grandchildren.

**Key finding:** The fiscal impact depends almost entirely on education level and age at arrival. Young, educated immigrants are large net fiscal contributors. Older, less-educated immigrants are net fiscal costs. But across all immigrants, the long-run impact is positive.

### The Labor Market Impact

The central fear about immigration is that it drives down wages and takes jobs from native workers. The empirical evidence is more nuanced:

**The Mariel Boatlift study (David Card, 1990):** In 1980, Fidel Castro allowed 125,000 Cubans to emigrate from the port of Mariel to Miami, increasing Miami's labor force by 7% virtually overnight. Card found **no significant impact** on wages or unemployment of native workers in Miami, compared to other cities. The Miami labor market absorbed 125,000 workers without apparent harm.

**George Borjas's counter-argument:** Harvard economist George Borjas reanalyzed the Mariel data, focusing on low-skilled native workers (high school dropouts), and found a temporary wage decline of 10-30% for this specific group. The debate between Card and Borjas has continued for decades.

**The emerging consensus:** Most economists believe immigration has:
- **Small negative effects** on wages of directly competing native workers (especially low-skilled workers competing with low-skilled immigrants)
- **Positive effects** on wages of complementary workers (e.g., native managers benefit when immigrant workers join their teams)
- **Small positive effects** on overall economic output and productivity
- **Positive effects** on innovation (immigrants are disproportionately represented among patent holders, startup founders, and Nobel laureates in the US)

### The Brain Drain vs. Brain Gain Debate

When educated individuals emigrate from developing countries, it is called **brain drain**. The Philippines loses nurses, India loses engineers, and Africa loses doctors — all trained at domestic expense. This appears to harm the sending country.

But the picture is more complex:

**Remittances:** Migrants send money home. Global remittances totaled approximately \\\$656 billion in 2023 (World Bank). For many countries, remittances exceed foreign aid. India (\\\$125 billion), Mexico (\\\$67 billion), and China (\\\$50 billion) are the largest recipients.

**Return migration:** Many migrants return home with skills, capital, and networks. Taiwan's and India's tech industries were built partly by returning diaspora members who brought Silicon Valley expertise.

**Diaspora networks:** Migrants create business connections between their home and host countries, facilitating trade and investment.

**Incentive effects:** The possibility of emigrating to higher-wage countries increases the return to education, potentially leading more people to invest in skills than actually leave. This "brain gain" effect has been documented in several small developing countries.

### The Economic Case for Open Borders

Economist Michael Clemens has argued that restrictions on international migration are the biggest distortion in the global economy. His key claim: if borders were open, global GDP would roughly double because workers would move from where they are least productive (poor countries with few machines and weak institutions) to where they are most productive.

The estimated gains from removing migration barriers dwarf the gains from removing all remaining trade barriers. A Haitian worker who moves to the US increases their productivity (and income) by a factor of 5-10, simply by changing location.

Of course, fully open borders are politically impossible. But even modest liberalization of migration — guest worker programs, skill-based immigration, regional free movement — could generate enormous economic gains.

### Key Takeaway

Immigration is economically beneficial in aggregate — it boosts GDP, supports innovation, and has a positive long-run fiscal impact. But the distributional effects are real: native workers who directly compete with immigrants may face wage pressure. The policy challenge is to design immigration systems that maximize economic benefits while addressing the legitimate concerns of affected workers and communities.

> "Labor is the one thing that when it crosses a border, it becomes vastly more productive. That is the trillion-dollar bills on the sidewalk." — Michael Clemens

*Resources: Card, "The Impact of the Mariel Boatlift" (1990); National Academy of Sciences, The Economic and Fiscal Consequences of Immigration (2017); Clemens, "Economics and Emigration" (2011).*`,
    },
    {
      id: "ie-glob-deglobalization",
      slug: "deglobalization",
      title: "Deglobalization",
      content: `## Deglobalization

After decades of relentless integration, the global economy appears to be shifting into reverse. **Deglobalization** — the slowing, stalling, or unwinding of international economic integration — has become one of the defining trends of the 2020s. Some call it "slowbalization"; others see the beginning of a fundamental restructuring of the global economic order.

### Evidence of Deglobalization

Several indicators point to a retreat from peak globalization:

**Trade intensity has plateaued:** Global trade as a share of GDP peaked at approximately 61% in 2008 and has not regained that level. It hovered around 52-56% through the 2010s and 2020s.

**Foreign direct investment has declined:** Cross-border FDI flows fell from \\\$2 trillion in 2015 to approximately \\\$1.3 trillion in 2023 (UNCTAD). Governments are screening and blocking more foreign investments on national security grounds.

**Tariffs are rising:** After decades of decline, average tariff rates have ticked up — driven primarily by the US-China trade war, which raised tariffs on hundreds of billions of dollars in bilateral trade.

**Supply chain restructuring:** Companies are diversifying supply chains away from China ("China plus one"), reshoring production, and building redundancy at the cost of efficiency.

**Financial fragmentation:** Sanctions on Russia after the 2022 Ukraine invasion froze approximately \\\$300 billion in Russian central bank reserves and cut major Russian banks off from the SWIFT payment system. This demonstrated that the global financial system can be weaponized, prompting China and other countries to develop alternative payment systems and reduce dollar dependence.

### Drivers of Deglobalization

**1. US-China rivalry:** The defining geopolitical contest of the 21st century is reshaping the global economy. The US has imposed export controls on advanced semiconductors to China, restricted Chinese investment in critical technology, and pressured allies to follow suit. China is pursuing technological self-sufficiency in chips, AI, and other strategic sectors.

**2. Supply chain vulnerabilities:** COVID-19, the Suez Canal blockage, and the Russia-Ukraine war exposed the fragility of just-in-time global supply chains. Governments and firms are prioritizing resilience over efficiency.

**3. National security concerns:** The boundary between economic policy and national security has blurred. Semiconductors, critical minerals, pharmaceutical ingredients, and AI are all now treated as strategic goods. Governments are subsidizing domestic production and restricting exports of sensitive technologies.

**4. Political backlash:** Public opinion in many countries has turned against aspects of globalization. Concerns about job losses, inequality, immigration, and loss of sovereignty have fueled populist movements from Brexit to "America First" trade policies.

**5. Industrial policy revival:** After decades of market orthodoxy, governments are embracing industrial policy. The US CHIPS Act (\\\$52 billion), the Inflation Reduction Act (\\\$369 billion in clean energy subsidies), and the EU's Green Deal Industrial Plan all represent massive government interventions to shape economic activity.

### What Deglobalization Means in Practice

Deglobalization does not mean a return to autarky (complete self-sufficiency). Rather, it involves:

**Bloc formation:** The world may fragment into economic blocs centered on the US and China, with each bloc developing parallel supply chains, technology standards, and payment systems. Countries in between (India, Southeast Asia, Africa) may benefit from playing both sides.

**Regionalization:** Trade is becoming more regional. The share of intra-regional trade has increased in North America (USMCA), Europe (EU), and Asia (RCEP). "Nearshoring" to Mexico, Eastern Europe, or Southeast Asia replaces offshoring to distant China.

**Selective decoupling:** Not all sectors will deglobalize equally. Consumer goods trade may continue relatively freely, while trade in strategic technologies (chips, AI, quantum computing, biotech) faces increasing restrictions.

**Higher costs:** Reshoring, friendshoring, and supply chain diversification all cost more than the old model of concentrated, lowest-cost production. Some estimates suggest that supply chain restructuring could increase costs by 5-15% in affected industries, contributing to inflationary pressures.

### Winners and Losers

**Potential winners:**
- Mexico, Vietnam, India — benefiting from supply chain diversification away from China
- Domestic manufacturers in the US and EU — protected by industrial policy and subsidies
- Countries rich in critical minerals (lithium, cobalt, rare earths)

**Potential losers:**
- China — facing technology restrictions and supply chain shifts
- Small, open economies dependent on global trade (Singapore, Hong Kong, Taiwan)
- Consumers worldwide — facing higher prices from less efficient supply chains
- The poorest countries — left out of both major economic blocs

### Is This Time Different?

The history of globalization suggests that periods of integration alternate with periods of retreat. The first globalization (1870-1914) was followed by devastating reversal. The current slowdown has not yet reached that level of severity — trade volumes remain enormous, capital flows are substantial, and digital connectivity continues to deepen.

The critical question is whether the current deglobalization trend becomes self-reinforcing (as in the 1930s) or stabilizes into a new equilibrium of "managed globalization" — with continued trade and investment but more government oversight, strategic sector protection, and regional bloc formation.

### Key Takeaway

Deglobalization is real but selective. The era of unconstrained hyperglobalization is over. In its place is emerging a more fragmented, regionalized, and politically managed world economy. This transition will reshape industries, investment patterns, and geopolitics for decades to come.

> "We are witnessing the end of globalization as we have known it. What comes next is still being written." — Adam Tooze

*Resources: Baldwin, "Globotics Upheaval"; Tooze, "Polycrisis"; UNCTAD World Investment Report; McKinsey Global Institute.*`,
    },
  ],
};
