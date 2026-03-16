import { Module } from "../types";

export const developmentModule: Module = {
  id: "ie-development",
  title: "Economic Development",
  description:
    "Examine how countries develop — from measuring development to growth theories, the foreign aid debate, microfinance, and the rise of emerging markets.",
  lessons: [
    {
      id: "ie-dev-measuring",
      slug: "measuring-development",
      title: "Measuring Development (GDP/HDI/Gini)",
      content: `## Measuring Development (GDP/HDI/Gini)

How do we determine whether a country is "developed" or "developing"? The answer depends entirely on what we measure. Different metrics capture different dimensions of development, and the choice of measure shapes policy priorities.

### GDP: The Standard Yardstick

**Gross Domestic Product (GDP)** is the total market value of all final goods and services produced within a country in a given period. It is the most widely used measure of economic output and, by extension, economic development.

**GDP per capita** (GDP divided by population) allows comparisons across countries of different sizes. As of 2023:

| Country | GDP per capita (nominal) | GDP per capita (PPP) |
|---------|------------------------|---------------------|
| Luxembourg | \\\$126,000 | \\\$137,000 |
| United States | \\\$80,000 | \\\$80,000 |
| China | \\\$12,700 | \\\$23,400 |
| India | \\\$2,600 | \\\$9,200 |
| Burundi | \\\$230 | \\\$780 |

Note the difference between **nominal GDP per capita** (converted at market exchange rates) and **PPP-adjusted GDP per capita** (adjusted for differences in price levels). PPP adjustment typically narrows the gap between rich and poor countries because prices are lower in developing countries (the Balassa-Samuelson effect we discussed in Module 3).

### Limitations of GDP

GDP has well-known blind spots:

**Distribution:** GDP per capita is an average that tells us nothing about inequality. A country where one billionaire earns \\\$1 billion and 999 people earn \\\$1,000 has a per capita income of about \\\$1 million — misleading in the extreme.

**Non-market production:** GDP misses household work (cooking, childcare, elder care), subsistence farming, and the informal economy. In developing countries, the informal sector can account for 30-60% of economic activity.

**Quality of life:** GDP does not capture health, education, leisure, environmental quality, safety, or personal freedom. The US has a much higher GDP per capita than France, but the French enjoy universal healthcare, five weeks of vacation, and lower infant mortality.

**Environmental costs:** GDP counts environmental destruction as positive economic activity. If a factory pollutes a river and a company is hired to clean it up, both the pollution and the cleanup add to GDP.

**Sustainability:** GDP measures current output, not whether that output can be maintained. A country depleting its natural resources shows high GDP today but may face collapse tomorrow.

### Human Development Index (HDI)

The **HDI**, created by Pakistani economist Mahbub ul Haq and Indian Nobel laureate Amartya Sen in 1990, measures development across three dimensions:

1. **Health:** Life expectancy at birth
2. **Education:** Mean years of schooling and expected years of schooling
3. **Income:** GNI per capita (PPP-adjusted), with diminishing returns (logarithmic scale)

The HDI ranges from 0 to 1:
- **Very high:** 0.800+ (Norway: 0.961, US: 0.921)
- **High:** 0.700-0.799 (Brazil: 0.754, China: 0.768)
- **Medium:** 0.550-0.699 (India: 0.633, Bangladesh: 0.614)
- **Low:** Below 0.550 (Niger: 0.394, Somalia: 0.380)

HDI reveals discrepancies that GDP misses. Cuba has a GDP per capita of only \\\$10,000 (PPP) but an HDI of 0.764 — comparable to much richer countries — because of strong performance in health and education. Equatorial Guinea has high GDP per capita from oil but low HDI because the wealth is concentrated and social services are poor.

### Gini Coefficient: Measuring Inequality

The **Gini coefficient** measures income inequality on a scale from 0 (perfect equality — everyone earns the same) to 1 (perfect inequality — one person earns everything).

| Country | Gini Coefficient | Interpretation |
|---------|-----------------|----------------|
| Slovenia | 0.24 | Very equal |
| Sweden | 0.28 | Low inequality |
| United States | 0.39 | Moderate-high inequality |
| Brazil | 0.49 | High inequality |
| South Africa | 0.63 | Extreme inequality |

The Gini coefficient is derived from the **Lorenz curve**, which plots the cumulative share of income received by the cumulative share of the population. A 45-degree line represents perfect equality. The further the actual curve bows away from this line, the higher the Gini coefficient.

### Other Development Indicators

| Indicator | Measures | Example |
|-----------|----------|---------|
| **Multidimensional Poverty Index** | Overlapping deprivations in health, education, living standards | Used by UNDP since 2010 |
| **Gender Inequality Index** | Reproductive health, empowerment, labor market participation | Highlights gender gaps |
| **Genuine Progress Indicator** | GDP adjusted for inequality, environmental costs, social factors | GDP with corrections |
| **Happy Planet Index** | Life satisfaction, life expectancy, ecological footprint | Wellbeing per unit of resource use |

### Key Takeaway

No single number can capture "development." GDP measures economic output but ignores distribution, health, education, and sustainability. HDI broadens the picture but still misses inequality. The Gini coefficient captures inequality but not absolute living standards. Good development analysis uses multiple indicators to build a complete picture.

> "The welfare of a nation can scarcely be inferred from a measurement of national income." — Simon Kuznets, creator of GDP

*Resources: UNDP Human Development Reports; World Bank Development Indicators; Sen, Development as Freedom.*`,
    },
    {
      id: "ie-dev-growth-theories",
      slug: "growth-theories",
      title: "Growth Theories",
      content: `## Growth Theories

Why are some countries rich and others poor? Why do some economies grow rapidly while others stagnate for decades? These are the central questions of economic development, and economists have proposed several theories to explain the vast differences in wealth across nations.

### The Solow Growth Model (1956)

Robert Solow's neoclassical growth model is the workhorse of growth economics. It identifies three sources of growth:

1. **Capital accumulation** — investment in machines, factories, infrastructure
2. **Labor force growth** — more workers produce more output
3. **Technological progress** — better ways of producing things (the "residual")

The model's key prediction is **convergence**: poor countries should grow faster than rich countries because they have more room to accumulate capital. Investing in a country with few machines yields high returns; adding another machine to a factory that already has many yields diminishing returns.

**The Solow Residual:** When Solow applied his model to US growth data, he found that capital and labor together explained less than half of growth. The rest — the **Solow residual** — was attributed to technological progress. This meant that the most important driver of growth was the hardest to explain.

**Does convergence happen?** Conditionally, yes. Among countries with similar institutions, policies, and savings rates (like OECD countries or US states), convergence is strong. Across all countries globally, there is no unconditional convergence — many poor countries have grown slowly or not at all.

### Endogenous Growth Theory (Romer, Lucas, 1980s-90s)

Dissatisfied with technological progress being treated as an unexplained external force, **Paul Romer** (Nobel Prize 2018) and **Robert Lucas** developed endogenous growth models where technological progress arises from within the economy.

Key insights:
- **Ideas are non-rival** — once someone invents a new technology, everyone can use it. This makes ideas fundamentally different from physical goods.
- **Human capital** (education, skills) drives growth by making workers more productive and enabling innovation
- **R&D investment** produces new ideas that raise productivity for the entire economy
- **Positive externalities** from knowledge creation mean the private sector underinvests in R&D, justifying government support for education and research

These models predict that **countries can sustain permanent growth** through investment in human capital and R&D, without diminishing returns. They also explain why convergence may fail: countries that do not invest in education and innovation get left behind.

### Institutional Theories (North, Acemoglu)

Economists Douglass North (Nobel Prize 1993) and Daron Acemoglu (Nobel Prize 2024) argued that **institutions** — the rules of the game governing economic and political life — are the fundamental determinant of long-run growth.

**Inclusive institutions** (property rights, rule of law, competitive markets, pluralistic politics) encourage investment, innovation, and broad-based prosperity. **Extractive institutions** (concentrated power, weak property rights, corruption, rent-seeking) transfer wealth from the many to the few and discourage productive economic activity.

Acemoglu and Robinson's *Why Nations Fail* (2012) argued that:
- Colonial history created divergent institutional paths — colonies with good institutions (like the US) prospered, while colonies with extractive institutions (like the Congo) stagnated
- North Korea vs. South Korea demonstrates that institutions, not geography or culture, determine outcomes
- Political institutions shape economic institutions — democratic accountability leads to inclusive economic rules

### Geography and Culture Theories

Not all economists agree that institutions are the primary driver:

**Jeffrey Sachs** argues that **geography** matters enormously. Tropical countries face higher disease burdens (malaria), less productive agriculture, and landlocked countries face high transport costs. These geographic disadvantages are persistent and hard to overcome.

**Cultural theories** suggest that values, religion, work ethic, and social norms affect economic behavior. Max Weber's *The Protestant Ethic and the Spirit of Capitalism* (1905) argued that Protestant values encouraged the accumulation and reinvestment of wealth. Modern versions point to trust, social capital, and attitudes toward entrepreneurship.

### The Growth Diagnostic Approach (Hausmann, Rodrik, Velasco)

Rather than seeking a universal theory of growth, the **growth diagnostics** framework asks: what is the **binding constraint** on growth in a specific country at a specific time?

Is it:
- Lack of finance? (high returns to investment but no access to capital)
- Poor infrastructure? (transport, energy, telecommunications)
- Insufficient human capital? (education, health)
- Bad governance? (corruption, weak rule of law)
- Macroeconomic instability? (inflation, fiscal crises)

The answer differs across countries and over time. The policy implication is that one-size-fits-all prescriptions (like the Washington Consensus) are likely to fail. Instead, countries should identify and address their most binding constraint first.

### Key Takeaway

Growth theory has evolved from simple models of capital accumulation (Solow) to theories emphasizing ideas and human capital (Romer) to institutional explanations (Acemoglu). In reality, growth depends on all of these factors — and the relative importance of each varies by country and context.

> "The consequences for human welfare involved in questions about economic growth are simply staggering: once one starts to think about them, it is hard to think about anything else." — Robert Lucas

*Resources: Solow, "A Contribution to the Theory of Economic Growth" (1956); Acemoglu & Robinson, Why Nations Fail (2012); Rodrik, One Economics, Many Recipes.*`,
    },
    {
      id: "ie-dev-foreign-aid",
      slug: "foreign-aid-debate",
      title: "The Foreign Aid Debate",
      content: `## The Foreign Aid Debate

Few topics in development economics generate as much passion as foreign aid. Since the end of World War II, wealthy nations have transferred trillions of dollars to developing countries through bilateral aid, multilateral institutions, and NGOs. Has this aid worked? The answer depends on whom you ask.

### The Scale of Aid

Official Development Assistance (ODA) from OECD donor countries totaled approximately \\\$204 billion in 2023. The largest donors in absolute terms are the United States (\\\$56 billion), Germany (\\\$34 billion), and Japan (\\\$17 billion). As a share of national income, the most generous donors are Luxembourg, Sweden, Norway, and Denmark — all exceeding the UN target of 0.7% of GNI. The US gives only about 0.24% of GNI.

Aid flows are substantial but small relative to the economies they support. For the average low-income country, aid represents about 8% of national income. For some aid-dependent countries (like Afghanistan or Mozambique), aid can exceed 20% of GDP.

### The Case for Aid (Jeffrey Sachs)

Columbia University economist **Jeffrey Sachs** is the most prominent advocate for increased aid. In *The End of Poverty* (2005), Sachs argued that:

- Many poor countries are caught in a **poverty trap** — they are too poor to invest in the infrastructure, health, and education needed for growth
- A "big push" of aid can break the trap by simultaneously addressing multiple barriers: disease, lack of roads, inadequate schools, poor water systems
- Aid should be massively scaled up (to approximately \\\$195 billion per year) and targeted at specific, measurable interventions
- Success stories exist: smallpox eradication, green revolution agriculture, oral rehydration therapy

Sachs's **Millennium Villages Project** (2005-2015) attempted to demonstrate this approach in 10 African villages, providing comprehensive aid packages. The results were mixed — some health and education indicators improved, but economic transformation was limited, and the project's cost per village was high.

### The Case Against Aid (William Easterly)

New York University economist **William Easterly** is the most prominent aid skeptic. In *The White Man's Burden* (2006), Easterly argued that:

- Top-down "planning" approaches to development (big, comprehensive aid programs) consistently fail because outsiders cannot understand local conditions
- Aid creates **dependency** — governments rely on aid instead of developing domestic tax capacity and accountability
- Aid is often **captured by corrupt elites** who use it to maintain power rather than serve their populations
- "Searcher" approaches (bottom-up, market-driven, experimental) work better than "planner" approaches
- After \\\$2.3 trillion in aid since the 1960s, many recipient countries are no better off

### The Randomista Revolution (Esther Duflo and Abhijit Banerjee)

MIT economists **Esther Duflo** and **Abhijit Banerjee** (Nobel Prize 2019) pioneered a middle path using **randomized controlled trials (RCTs)** to evaluate specific aid interventions.

Rather than asking "does aid work?", they ask "**which specific interventions work?**" Their findings:

**Interventions that work well:**
- Deworming medication for schoolchildren (extremely cost-effective — a few cents per child improves school attendance significantly)
- Bed nets for malaria prevention (free distribution works better than subsidized sales)
- Cash transfers (direct cash to poor households often outperforms in-kind aid)
- Micronutrient supplementation (iron, iodine, vitamin A)

**Interventions with mixed results:**
- Microcredit (helps some borrowers, but average effects are modest)
- Training programs (effects often fade without ongoing support)
- Building schools (increases enrollment but not necessarily learning)

**The key insight:** Aid is not one thing. It is thousands of different interventions, some highly effective and others wasteful. The challenge is to scale up what works and stop funding what does not.

### Aid and Governance

A critical finding in the aid literature is that **aid works better in countries with good governance**. Burnside and Dollar (2000) found that aid promotes growth in countries with sound fiscal, monetary, and trade policies, but has no effect (or negative effects) in countries with poor policies. This finding has been debated and partially challenged, but the broad conclusion — that institutional quality mediates aid effectiveness — is widely accepted.

This creates a dilemma: the countries that most need aid often have the worst governance, and aid itself can undermine governance by reducing government dependence on domestic taxation (and thus accountability to citizens).

### China's Alternative Model

China's development approach offers a starkly different model from traditional Western aid. Chinese financing in developing countries (primarily through the Belt and Road Initiative) emphasizes:
- Infrastructure loans (roads, railways, ports, power plants)
- No political conditionality (no requirements for democracy or human rights)
- Use of Chinese firms and workers for construction
- Resource-backed financing (loans repaid with commodity exports)

Whether this represents a superior development model or a new form of debt imperialism is actively debated.

### Key Takeaway

The aid debate has evolved from "does aid work?" to "which specific interventions work, under what conditions, and how can we scale them?" The evidence suggests that targeted, well-evaluated interventions can save lives and improve wellbeing, but aid alone cannot transform economies without good institutions and domestic policy reform.

> "We do not need to know everything before we act. We just need to know what works." — Esther Duflo

*Resources: Sachs, The End of Poverty; Easterly, The White Man's Burden; Banerjee & Duflo, Poor Economics.*`,
    },
    {
      id: "ie-dev-microfinance",
      slug: "microfinance",
      title: "Microfinance",
      content: `## Microfinance

**Microfinance** — the provision of small loans, savings accounts, and insurance products to low-income individuals who lack access to traditional banking — was once hailed as a revolutionary tool for poverty reduction. Its story is one of soaring expectations, genuine achievements, and sobering realities.

### The Origins: Muhammad Yunus and Grameen Bank

The microfinance movement began in 1976 when **Muhammad Yunus**, an economics professor at Chittagong University in Bangladesh, lent \\\$27 of his own money to 42 women in the village of Jobra. The women used the money to buy materials for making bamboo stools, earning enough to repay the loans and lift themselves out of poverty.

This experiment grew into the **Grameen Bank**, founded in 1983, which pioneered a group lending model:
- Small loans (typically \\\$50-\\\$200) to groups of 5 women
- No collateral required — the group provides social pressure for repayment
- Weekly repayment meetings
- Graduated loan sizes — repay the first loan, get a bigger one
- Savings requirements — borrowers must save regularly

Grameen achieved remarkable repayment rates (over 95%) and served millions of borrowers. By 2006, when Yunus and Grameen won the Nobel Peace Prize, the microfinance movement had spread globally. Institutions like BRAC (Bangladesh), BancoSol (Bolivia), and Compartamos (Mexico) served tens of millions of borrowers.

### The Promise

Microfinance's appeal was powerful: it offered a market-based solution to poverty that required no government redistribution and empowered the poor (especially women) to lift themselves up through entrepreneurship. The theory was straightforward:

1. The poor have entrepreneurial talent but lack capital
2. Microloans provide the capital to start or expand small businesses
3. Business profits repay the loan and raise household income
4. Repeat borrowing creates a virtuous cycle of growth
5. Women's empowerment reduces gender inequality and improves children's outcomes

### The Evidence

The microfinance enthusiasm of the 2000s gave way to a more nuanced picture as rigorous evaluations (RCTs) were conducted:

**Banerjee, Duflo et al. (2015)** conducted the most comprehensive study, analyzing six RCTs across four continents (India, Bosnia, Ethiopia, Mexico, Mongolia, Morocco). Their findings:

- **Modest positive effects:** Access to microcredit increased small business investment and self-employment
- **No transformative impact:** Average household income did not significantly increase. Microloans did not lift large numbers of people out of poverty
- **No magic for women's empowerment:** Effects on women's decision-making power, education spending, and health outcomes were minimal
- **Useful for some:** Microloans helped existing entrepreneurs expand, but most borrowers used loans for consumption smoothing (managing cash flow) rather than starting businesses

### The Criticisms

As the evidence accumulated, several problems with the microfinance model became apparent:

**High interest rates:** Microfinance institutions (MFIs) charge annual interest rates of 30-100% or more. While these rates are lower than informal moneylenders (who may charge 200-1000%), they are still very high. The operating costs of administering thousands of tiny loans are substantial.

**Over-indebtedness:** In several markets, aggressive lending led to borrowers taking multiple loans from different MFIs, creating unsustainable debt burdens. The Andhra Pradesh microfinance crisis (2010) in India saw a wave of borrower suicides linked to aggressive collection practices by MFIs, leading to a regulatory crackdown that nearly destroyed the industry in the region.

**Commercialization concerns:** The IPO of Compartamos in Mexico (2007) generated enormous profits for investors, raising questions about whether microfinance had become a tool for extracting profits from the poor rather than helping them. Yunus himself criticized the commercialization trend.

**Not reaching the poorest:** The very poorest individuals — those living on less than \\\$1 per day — are often excluded from microfinance because they cannot reliably repay even small loans. Graduation programs that combine asset transfers with training and support may be more effective for this group.

### Beyond Microcredit: Microsavings and Insurance

The microfinance field has evolved beyond credit:

**Microsavings** may actually be more important than microcredit. Research shows that the poor want to save but lack safe, convenient places to do so. Providing savings accounts helps households build buffers against shocks and accumulate capital for investment.

**Microinsurance** protects against health emergencies, crop failures, and natural disasters — events that can push vulnerable families back into poverty. Weather-indexed crop insurance, which pays out automatically based on rainfall data, has shown promise in India and East Africa.

**Mobile money** (like Kenya's M-Pesa) has revolutionized financial access by turning mobile phones into bank accounts. Over 1.6 billion people worldwide now have mobile money accounts, enabling transfers, savings, and payments without traditional bank infrastructure.

### Key Takeaway

Microfinance is neither the revolutionary poverty solution its early advocates claimed nor the exploitative failure its critics allege. It is a useful financial service that helps some households manage cash flow and invest in small businesses, but it is not a substitute for broader economic development, education, healthcare, and institutional reform.

> "Microcredit is not a miracle cure that can eliminate poverty in one fell swoop. But it can make a major contribution." — Muhammad Yunus (revised view)

*Resources: Banerjee et al., "The Miracle of Microfinance?" (2015); Roodman, Due Diligence: An Impertinent Inquiry into Microfinance; Yunus, Banker to the Poor.*`,
    },
    {
      id: "ie-dev-emerging-markets",
      slug: "emerging-markets",
      title: "Emerging Markets",
      content: `## Emerging Markets

The term **"emerging market"** was coined by Antoine van Agtmael of the International Finance Corporation (part of the World Bank Group) in 1981 to replace the unflattering label "Third World." Emerging markets are countries transitioning from low-income, developing status toward becoming advanced, industrialized economies. They are home to some of the most dramatic economic transformations in history — and some of the most spectacular financial crises.

### Defining Emerging Markets

There is no universally agreed definition, but emerging markets generally share several characteristics:

| Feature | Description |
|---------|-------------|
| **Rapid growth** | GDP growth rates above the global average (often 4-8% annually) |
| **Industrialization** | Shifting from agriculture to manufacturing and services |
| **Rising middle class** | Growing consumer spending power |
| **Improving infrastructure** | Investment in roads, ports, telecommunications, energy |
| **Financial market development** | Stock exchanges, banking systems, but often immature |
| **Institutional gaps** | Weaker rule of law, governance, regulatory frameworks than advanced economies |
| **Higher volatility** | Greater economic, political, and financial market fluctuations |

Major emerging market classifications include the **BRICS** (Brazil, Russia, India, China, South Africa), the **MINT** countries (Mexico, Indonesia, Nigeria, Turkey), and the **Frontier Markets** (smaller, less developed than typical emerging markets — Vietnam, Kenya, Bangladesh, Sri Lanka).

### The Growth Miracle: China and India

**China** is the greatest development success story in human history. Between 1978 (when Deng Xiaoping launched economic reforms) and 2023, China's GDP grew from \\\$150 billion to over \\\$17 trillion. Over 800 million people were lifted out of extreme poverty. China's strategy combined:
- Special Economic Zones for foreign investment
- Massive infrastructure investment (roads, railways, ports)
- Export-oriented manufacturing
- Gradual (not shock) liberalization
- State direction of strategic industries

**India** has followed a different path. After decades of slow "Hindu rate of growth" (3-4% annually) under heavy regulation, India liberalized in 1991 following a balance of payments crisis. Growth accelerated to 6-8% annually, driven by IT services, a demographic dividend, and domestic consumption. India's challenge is that growth has been less inclusive than China's — hundreds of millions remain in poverty, and infrastructure gaps persist.

### Why Emerging Markets Matter

Emerging markets now account for approximately:
- **60% of global GDP** (PPP-adjusted)
- **85% of the world's population**
- **75% of global GDP growth** over the past decade
- **40% of global stock market capitalization**

For investors, businesses, and policymakers, understanding emerging markets is no longer optional — it is essential.

### Investment Opportunities and Risks

**Opportunities:**
- Higher growth rates translate into faster corporate earnings growth
- Demographic dividends (young, growing populations) support long-term consumption growth
- Urbanization drives demand for infrastructure, housing, and services
- Technology leapfrogging (mobile banking, e-commerce) can skip stages of development

**Risks:**
- **Currency risk:** Emerging market currencies can depreciate sharply and suddenly
- **Political risk:** Regime changes, expropriation, regulatory uncertainty
- **Liquidity risk:** Markets may be thin, with limited ability to sell assets quickly
- **Governance risk:** Weaker corporate governance, less transparency, more corruption
- **Contagion:** Crises in one emerging market can spread to others (the "Asian flu" of 1997)

### The Middle-Income Trap

Many emerging markets face the **middle-income trap** — the observation that it is much harder to grow from middle income to high income than from low income to middle income. Countries like Brazil, Mexico, Turkey, and South Africa have been "emerging" for decades without fully arriving.

The trap occurs because:
- Low-wage manufacturing jobs move to even cheaper countries
- Innovation and productivity growth are needed but require strong institutions, education, and R&D
- Political resistance to reforms from entrenched interests
- Resource curses in commodity-dependent economies

Countries that have escaped the trap (South Korea, Taiwan, Singapore, Israel) all invested heavily in education, technology, and institutional quality. Those stuck in the trap often have weaker institutions and more inequality.

### The Future of Emerging Markets

Several trends will shape emerging markets in the coming decades:

**Demographics:** Africa's population will double to 2.5 billion by 2050, while China faces rapid aging. India will be the world's most populous country (already is as of 2023).

**Technology:** Mobile technology, AI, and renewable energy may allow emerging markets to leapfrog traditional development paths.

**Geopolitics:** The US-China rivalry is reshaping trade patterns, supply chains, and investment flows. Emerging markets may benefit from "friend-shoring" as companies diversify away from China.

**Climate change:** Many emerging markets are highly vulnerable to rising temperatures, sea level rise, and extreme weather, threatening decades of development gains.

### Key Takeaway

Emerging markets represent the future of global economic growth. They offer enormous opportunities but carry risks that developed markets do not. Understanding their unique dynamics — high growth, institutional gaps, demographic shifts, and volatility — is essential for anyone engaged in international economics, business, or investment.

> "If the 19th century belonged to Europe and the 20th to America, the 21st century will belong to the emerging world." — Jim O'Neill (creator of the BRIC concept)

*Resources: O'Neill, The Growth Map; World Bank Development Indicators; IMF World Economic Outlook.*`,
    },
  ],
};
