import { Module } from "../types";

export const globalModule: Module = {
  id: "bs-global",
  title: "Global Strategy",
  description:
    "Master global strategy frameworks, market entry modes, cultural considerations, emerging market strategy, and geopolitical risk.",
  lessons: [
    {
      id: "bs-global-frameworks",
      slug: "global-strategy-frameworks",
      title: "Global Strategy Frameworks (CAGE/Ghemawat)",
      content: `## Global Strategy Frameworks

Pankaj Ghemawat, one of the youngest professors ever tenured at Harvard Business School, challenged the widespread belief that the world is "flat" and that globalization eliminates all barriers. His research shows that the world is **semi-globalized** -- some barriers have fallen, but significant distances remain between countries. His **CAGE Distance Framework** provides a systematic way to assess these distances and make better international strategy decisions.

### The CAGE Distance Framework

CAGE identifies four dimensions of "distance" between countries that affect the success of international business:

**C -- Cultural Distance**
Differences in language, religion, social norms, values, and assumptions about how business is conducted.

- Language barriers (only 5% of the world speaks English as a first language)
- Religious and ethical norms (interest-free banking in Islamic countries)
- Social hierarchy and relationship expectations (guanxi in China)
- Attitudes toward uncertainty, time, individualism (Hofstede's dimensions)

**A -- Administrative Distance**
Differences in government policies, legal systems, institutions, and political relationships.

- Trade agreements and tariffs (EU single market vs. external tariffs)
- Regulatory requirements (FDA approval vs. EU CE marking)
- Political relationships (sanctions, embargoes)
- Legal systems (common law vs. civil law vs. religious law)
- Corruption levels and institutional quality

**G -- Geographic Distance**
Physical distance, time zones, climate, and infrastructure.

- Transportation costs and logistics complexity
- Time zone differences (coordination challenges)
- Climate and terrain (product adaptation requirements)
- Border effects (customs, inspections, delays)

**E -- Economic Distance**
Differences in income levels, economic development, and resource availability.

- Consumer purchasing power (income per capita)
- Cost of labor, materials, and infrastructure
- Financial market development and currency stability
- Distribution and logistics infrastructure

### Applying CAGE

For each pair of countries (home market and potential target), assess the distance along all four dimensions:

| Dimension | Low Distance (Easy) | High Distance (Hard) |
|-----------|-------------------|---------------------|
| Cultural | Similar language, values | Different language, religion, norms |
| Administrative | Trade agreements, aligned regulations | Tariffs, different legal systems |
| Geographic | Close, good infrastructure | Far, poor logistics |
| Economic | Similar income levels | Large income disparity |

### Beyond CAGE: Global Strategy Archetypes

Ghemawat identified three fundamental approaches to global strategy, which he calls the **AAA Framework**:

**Adaptation**: Adjusting products, services, and strategies to fit local markets. Focus on local responsiveness.
- McDonald's serving McAloo Tikki in India and Teriyaki Burgers in Japan
- Netflix investing in local-language original content for each market

**Aggregation**: Creating economies of scale by standardizing across markets. Focus on global efficiency.
- IKEA selling the same products worldwide with minimal adaptation
- Coca-Cola maintaining a consistent global brand and product

**Arbitrage**: Exploiting differences between markets for advantage. Focus on leveraging distance.
- Manufacturing in low-cost countries and selling in high-income countries
- Hiring engineers in India to serve clients in the US
- Registering intellectual property in favorable jurisdictions

Most successful global companies combine elements of all three, but typically emphasize one.

### Other Global Strategy Frameworks

**Porter's Diamond of National Advantage**: Explains why certain nations are home to leading companies in particular industries. Four factors: factor conditions, demand conditions, related/supporting industries, and firm strategy/structure/rivalry.

**Bartlett & Ghoshal's Integration-Responsiveness Framework**: Maps companies along two dimensions -- global integration (efficiency) vs. local responsiveness (adaptation):
- **Global** (high integration, low responsiveness): Intel, Boeing
- **Multidomestic** (low integration, high responsiveness): Nestle, Unilever (historically)
- **Transnational** (high integration, high responsiveness): The ideal but hardest to achieve -- P&G, ABB
- **International** (low integration, low responsiveness): Companies in early stages of globalization

### Common Global Strategy Mistakes

1. **Assuming the world is flat**: Ignoring CAGE distances leads to expensive market entry failures
2. **Copying the home market playbook**: What works in the US may not work in China, India, or Brazil
3. **Underestimating cultural distance**: Language translation is the easy part; behavioral and normative differences are the hard part
4. **Over-centralizing or over-decentralizing**: Neither pure global standardization nor pure local autonomy works. The balance depends on the industry and CAGE distances.

### Key Takeaway

Global strategy requires understanding and managing the distances between countries -- cultural, administrative, geographic, and economic. The CAGE framework provides a systematic way to assess these distances and choose between adaptation, aggregation, and arbitrage strategies. The world is not flat, but it is not impenetrable either.

**Sources**: Ghemawat, P. (2001). "Distance Still Matters." *Harvard Business Review*. Ghemawat, P. (2007). *Redefining Global Strategy*. Harvard Business Review Press. Bartlett, C. A. & Ghoshal, S. (1989). *Managing Across Borders*. Harvard Business School Press.`,
    },
    {
      id: "bs-entry-modes",
      slug: "market-entry-modes",
      title: "Entry Modes: Export, License, JV & FDI",
      content: `## Entry Modes: Export, License, JV & FDI

Once a company decides to enter a foreign market, it must choose *how* to enter. The entry mode decision determines the level of investment, risk, control, and commitment -- and it is notoriously difficult to reverse. Harvard Business School case studies repeatedly show that the wrong entry mode can doom an otherwise sound international strategy.

### The Entry Mode Spectrum

Entry modes range from low commitment/low control to high commitment/high control:

\`\`\`
Low commitment                                High commitment
Low control                                   High control
Low risk                                      High risk

Exporting -> Licensing -> Franchising -> Joint Venture -> Wholly-Owned Subsidiary
                                                         (Greenfield or Acquisition)
\`\`\`

### Mode 1: Exporting

**Description**: Selling products made in the home country to foreign markets.

**Advantages**:
- Lowest risk and investment
- Maintains production economies of scale at home
- Easy to start and stop

**Disadvantages**:
- High transportation costs for bulky/heavy products
- Tariffs and trade barriers
- Limited understanding of local market
- Dependent on local distributors

**Best when**: Testing a new market, products are lightweight/high-value, transportation costs are low relative to product value.

**Example**: Many SMEs begin international expansion through exporting. Harley-Davidson exported motorcycles globally before establishing local operations.

### Mode 2: Licensing

**Description**: Granting a foreign company the right to produce and sell your product using your intellectual property (patents, trademarks, technology) in exchange for royalties.

**Advantages**:
- Low investment and risk
- Leverages licensee's local knowledge
- Quick market entry
- Generates passive income

**Disadvantages**:
- Limited control over quality and brand
- Risk of creating a future competitor (licensee learns your technology)
- Lower revenue than direct operations
- IP protection challenges

**Best when**: You have strong IP but limited resources for direct investment; the product requires significant local adaptation or manufacturing.

**Example**: Disney licenses its characters to manufacturers worldwide. Qualcomm licenses its chip designs to phone manufacturers.

### Mode 3: Franchising

**Description**: A specialized form of licensing where the franchisor provides a complete business system (brand, operations manual, training, supply chain) and the franchisee operates under that system.

**Advantages**:
- Rapid expansion with limited capital
- Franchisees have strong financial motivation
- Standardized customer experience
- Leverages local entrepreneurial talent

**Disadvantages**:
- Quality control challenges
- Franchisee conflicts and non-compliance
- Complex legal and regulatory requirements
- Franchise fees may limit top talent

**Best when**: The business model is replicable, brand consistency is important, and local operational knowledge matters.

**Example**: McDonald's operates 93% of its restaurants through franchisees. Marriott franchises many of its hotel brands.

### Mode 4: Joint Venture

**Description**: Creating a new company co-owned by the entering company and a local partner. Both partners contribute resources and share risks, costs, and profits.

**Advantages**:
- Access to local partner's knowledge, relationships, and distribution
- Shared investment and risk
- May be required by local regulations (China historically required JVs in many industries)
- Faster market entry than building from scratch

**Disadvantages**:
- Shared control leads to decision-making conflicts
- Risk of partner opportunism (appropriating technology or customers)
- Profit sharing reduces returns
- Difficult to exit if relationship sours

**Best when**: Local knowledge is critical, regulations require local ownership, the market is high-risk, or significant investment is needed.

**Example**: Starbucks entered China through joint ventures with local companies before transitioning to full ownership. Sony Ericsson was a JV combining Sony's brand with Ericsson's telecom technology.

### Mode 5: Wholly-Owned Subsidiary

**Description**: The company establishes a fully owned operation in the foreign market, either by building from scratch (greenfield) or by acquiring an existing local company.

**Greenfield** (build from scratch):
- Full control over design, culture, and operations
- Slower startup
- Higher initial investment
- Best when: no suitable acquisition targets; company wants to establish its own culture

**Acquisition** (buy an existing company):
- Immediate market presence, customers, and revenue
- Faster entry
- Integration risk and cultural challenges
- Best when: speed matters; strong local company is available

**Advantages of both**:
- Maximum control
- Full profit capture
- Protect proprietary technology
- Deepest market learning

**Disadvantages of both**:
- Highest risk and investment
- Full exposure to country risk
- Complex to manage from headquarters

### Choosing the Right Entry Mode

| Factor | Favors Low Commitment (Export/License) | Favors High Commitment (JV/WOS) |
|--------|---------------------------------------|----------------------------------|
| Market size | Small or uncertain | Large and growing |
| IP sensitivity | Low risk of IP theft | High risk requires control |
| Cultural distance | High (need local partner) | Low (can manage directly) |
| Regulatory environment | Restrictive (JV required) | Open to foreign ownership |
| Strategic importance | Low (test market) | High (core market) |
| Available resources | Limited capital | Significant capital |
| Speed needed | Moderate | Fast (acquisition) |

### Key Takeaway

Entry mode selection is one of the most consequential decisions in international strategy. The right choice depends on market characteristics, competitive dynamics, regulatory requirements, and organizational capabilities. Most companies evolve their entry modes over time -- starting with lower-commitment modes and deepening involvement as they learn and grow.

**Sources**: Hill, C. W. L. (2021). *International Business*. McGraw-Hill. Root, F. R. (1994). *Entry Strategies for International Markets*. Jossey-Bass. HBS case studies on international market entry strategies.`,
    },
    {
      id: "bs-cultural-strategy",
      slug: "cultural-considerations",
      title: "Cultural Considerations in Strategy",
      content: `## Cultural Considerations in Strategy

Erin Meyer, whose work is widely taught at Harvard Business School and featured in the *Harvard Business Review*, created the **Culture Map** -- a framework for understanding how cultural differences affect business interactions across eight dimensions. Her research demonstrates that cultural blindness is one of the top causes of international business failure.

### Why Culture Matters in Strategy

Culture affects every aspect of business: how decisions are made, how feedback is given, how trust is built, how time is perceived, and how conflict is handled. A strategy that works in one culture may fail spectacularly in another -- not because it is a bad strategy, but because it is culturally misaligned.

**The Cost of Cultural Blindness:**
- Walmart lost over \$1 billion exiting Germany (2006) partly due to cultural missteps -- American-style customer greeting and employee chants alienated German customers and workers
- eBay lost to local competitors in Japan, China, and South Korea because its standardized platform did not accommodate local relationship-building norms
- DaimlerChrysler's "merger of equals" (1998) collapsed partly due to irreconcilable cultural differences between German and American management styles

### The Culture Map: Eight Dimensions

Erin Meyer identifies eight scales on which cultures differ:

**1. Communicating: Low-Context vs. High-Context**
- **Low-context** (US, Germany, Netherlands): Communication is explicit, clear, and direct. Say exactly what you mean.
- **High-context** (Japan, Korea, Indonesia): Communication is implicit, layered, and indirect. Meaning is embedded in context, relationships, and what is *not* said.

**2. Evaluating: Direct Negative Feedback vs. Indirect Negative Feedback**
- **Direct** (Netherlands, Russia, France): Criticism is given openly and frankly
- **Indirect** (Japan, Thailand, Saudi Arabia): Criticism is softened, implied, or delivered through intermediaries

**3. Persuading: Principles-First vs. Applications-First**
- **Principles-first** (France, Italy, Spain): Start with theory and reasoning, then present conclusions
- **Applications-first** (US, Canada, Australia): Start with conclusions, then provide supporting evidence

**4. Leading: Egalitarian vs. Hierarchical**
- **Egalitarian** (Denmark, Netherlands, Sweden): Flat structures, open-door policies, consensus
- **Hierarchical** (Japan, Korea, Nigeria): Formal hierarchies, deference to authority, top-down decisions

**5. Deciding: Consensual vs. Top-Down**
- **Consensual** (Japan, Sweden, Germany): Decisions involve extensive consultation, take longer but have broader buy-in
- **Top-down** (US, China, India): Leaders decide, execution follows quickly

Note: Germany is hierarchical in leadership style but consensual in decision-making. Japan is hierarchical but also consensual. The US is egalitarian but top-down in decisions.

**6. Trusting: Task-Based vs. Relationship-Based**
- **Task-based** (US, Denmark, Netherlands): Trust is built through business performance, reliability, and credentials
- **Relationship-based** (China, Brazil, Saudi Arabia): Trust is built through personal connection, shared meals, socializing, and time

**7. Disagreeing: Confrontational vs. Avoids Confrontation**
- **Confrontational** (France, Germany, Israel): Open debate is valued, disagreement is not personal
- **Avoids confrontation** (Japan, Indonesia, Thailand): Harmony is prioritized, open disagreement is uncomfortable

**8. Scheduling: Linear-Time vs. Flexible-Time**
- **Linear-time** (Germany, Switzerland, Scandinavia): Punctuality is essential, one thing at a time, strict deadlines
- **Flexible-time** (Nigeria, Saudi Arabia, India): Time is fluid, interruptions are normal, multitasking is natural

### Strategic Implications

**Product Strategy**: Products may need adaptation beyond translation. Colors, symbols, humor, imagery, and even product features carry different cultural meanings.

**Marketing Strategy**: Persuasion styles differ dramatically. American-style direct selling may be off-putting in relationship-based cultures. Testimonials and celebrity endorsements have different weight in different cultures.

**Negotiation Strategy**: In the US, getting to the point quickly is valued. In Japan, building the relationship before discussing business is essential. In China, the concept of "face" (mianzi) profoundly affects negotiation dynamics.

**Management Strategy**: Delegation, feedback, performance reviews, and meeting norms all vary by culture. A manager who succeeds in New York may struggle in Tokyo or Riyadh without cultural adaptation.

### Building Cultural Intelligence

1. **Self-awareness**: Understand your own cultural biases and assumptions
2. **Study**: Learn about the target culture through research and training
3. **Observe**: Pay attention to how people actually behave, not just what they say
4. **Adapt**: Adjust your communication, leadership, and decision-making style
5. **Hire locally**: Local team members provide cultural insight that expatriates cannot replicate

### Key Takeaway

Cultural considerations are not a "nice to have" in global strategy -- they are a strategic imperative. Companies that invest in cultural intelligence achieve better outcomes in international negotiations, partnerships, and market entry. The Culture Map provides a practical framework for navigating cultural differences systematically.

**Sources**: Meyer, E. (2014). *The Culture Map*. PublicAffairs. Hofstede, G. (2001). *Culture's Consequences*. Sage. HBS case studies on cross-cultural management. Harvard Business Review articles on cultural intelligence in global business.`,
    },
    {
      id: "bs-emerging-markets",
      slug: "emerging-market-strategy",
      title: "Emerging Market Strategy",
      content: `## Emerging Market Strategy

Emerging markets -- a term coined by IFC economist Antoine van Agtmael in 1981 -- represent some of the largest growth opportunities in the global economy. Harvard Business School has extensively researched the unique challenges and opportunities of competing in these markets, with notable contributions from professors Tarun Khanna, Krishna Palepu, and Rawi Abdelal.

### What Makes Emerging Markets Different

Khanna and Palepu, in their foundational HBS research, identified the core challenge: **institutional voids**. Emerging markets lack the institutions that facilitate business in developed economies:

| Institution | Developed Market | Emerging Market Void |
|------------|-----------------|---------------------|
| **Capital markets** | Deep, liquid, regulated | Limited access, high cost, informational asymmetry |
| **Labor markets** | Large talent pools, professional norms | Talent scarcity, different employment expectations |
| **Product markets** | Reliable information, consumer protection | Limited information, brand unfamiliarity |
| **Contract enforcement** | Strong legal system, courts | Weak enforcement, relationship-based trust |
| **Regulatory framework** | Clear, stable rules | Changing regulations, bureaucracy, corruption |

### Strategies for Emerging Markets

**Strategy 1: Replicate the Developed-Market Model (with Adaptation)**
Bring your existing business model but adapt it for local conditions.

- Unilever's "sachets strategy" -- selling shampoo and detergent in single-use packets affordable for low-income consumers
- McDonald's adapting menus to local tastes while maintaining operational consistency
- Risk: Over-adaptation may dilute the brand; under-adaptation may miss the market

**Strategy 2: Build Missing Institutions**
Fill institutional voids as part of your business model.

- Infosys built India's first world-class corporate campus, creating an institution (a reliable employer brand) that the market lacked
- M-Pesa in Kenya built a mobile payment system that filled the void left by inadequate banking infrastructure
- Risk: Expensive, slow, but creates enormous moats if successful

**Strategy 3: Partner with Local Conglomerates**
In many emerging markets, diversified conglomerates (Samsung in Korea, Tata in India, Grupo Salinas in Mexico) fill institutional voids through their reputation, relationships, and capabilities.

- Local partners provide regulatory navigation, distribution networks, and cultural knowledge
- Risk: Partner dependency, potential conflicts, shared control

**Strategy 4: Reverse Innovation**
Develop products specifically for emerging markets, then bring them back to developed markets.

- GE Healthcare developed a portable, low-cost ultrasound machine for rural China and India, then sold it in the US for point-of-care use
- Tata Nano (cheapest car in the world) inspired frugal engineering principles adopted by Western automakers
- Risk: Developed-market customers may perceive "emerging market products" as inferior

### The Bottom of the Pyramid

C.K. Prahalad (Michigan, with frequent HBS collaboration) argued in *The Fortune at the Bottom of the Pyramid* (2004) that the 4+ billion people earning less than \$2 per day represent an enormous untapped market. Serving this market requires:

- **Radical cost innovation**: Products must be 90% cheaper, not 10% cheaper
- **New distribution models**: Traditional retail may not reach rural or informal markets
- **Appropriate technology**: Products must work in environments with unreliable electricity, water, or connectivity
- **Trust building**: Brand unfamiliarity requires grassroots community engagement

### Digital Leapfrogging

Emerging markets often leapfrog developed markets by skipping intermediate technology stages:

- **Mobile banking** (M-Pesa): Kenya went from limited banking to mobile payments, bypassing branch banking entirely
- **Mobile internet**: Many emerging markets went from no internet directly to smartphone-based internet, bypassing desktop computing
- **Renewable energy**: Some regions are building solar microgrids instead of extending traditional power grids
- **Digital payments**: India's UPI system processes more digital transactions than most developed countries

### Common Mistakes in Emerging Markets

1. **Treating emerging markets as a monolith**: China, India, Nigeria, and Brazil are vastly different
2. **Assuming the developed-market playbook works**: Different institutions require different strategies
3. **Underestimating local competition**: Local companies understand the institutional voids and may be better adapted
4. **Ignoring government relationships**: In many emerging markets, government relationships are essential for business success
5. **Short time horizons**: Emerging market investments often require 5-10 years to generate returns

### Key Takeaway

Emerging markets require fundamentally different strategies from developed markets because of institutional voids. Success requires understanding these voids, choosing between adapting, building, or partnering to fill them, and maintaining patience for long-term returns. The companies that get it right gain access to the world's fastest-growing consumer markets.

**Sources**: Khanna, T. & Palepu, K. (2010). *Winning in Emerging Markets*. Harvard Business Press. Prahalad, C. K. (2004). *The Fortune at the Bottom of the Pyramid*. Wharton School Publishing. Khanna, T. & Palepu, K. (1997). "Why Focused Strategies May Be Wrong for Emerging Markets." *Harvard Business Review*.`,
    },
    {
      id: "bs-geopolitical-risk",
      slug: "managing-geopolitical-risk",
      title: "Managing Geopolitical Risk",
      content: `## Managing Geopolitical Risk

In an increasingly fragmented global order, geopolitical risk has moved from the periphery to the center of corporate strategy. Harvard Business School professor Rawi Abdelal and economist Condoleezza Rice (Stanford, with HBS collaboration) argue that **geopolitical risk is now a core strategic variable** -- not an external shock to be reacted to, but a factor that must be integrated into strategic planning.

### What is Geopolitical Risk?

Geopolitical risk is the risk that political events, decisions, and conflicts between nations will materially affect business operations, supply chains, markets, or profitability.

### Types of Geopolitical Risk

| Type | Description | Example |
|------|-------------|---------|
| **Sanctions and trade wars** | Government restrictions on trade or financial transactions | US-China tariffs, Russia sanctions |
| **Regulatory divergence** | Different countries imposing conflicting regulations | EU GDPR vs. US data regulation |
| **Political instability** | Regime change, civil unrest, policy reversals | Arab Spring, Myanmar coup |
| **Territorial disputes** | Conflicts over borders, resources, or sovereignty | South China Sea, Taiwan Strait |
| **Technology decoupling** | Nations restricting technology transfer or access | US restrictions on semiconductor exports to China |
| **Resource nationalism** | Governments asserting control over natural resources | Indonesia's nickel export ban, Chile's lithium nationalization |

### Why Geopolitical Risk is Increasing

Several structural trends are amplifying geopolitical risk:

1. **Great power competition**: The US-China rivalry is reshaping global trade, technology, and supply chains
2. **Technology weaponization**: Semiconductors, AI, and data have become tools of geopolitical power
3. **Supply chain vulnerability**: COVID-19 revealed how concentrated and fragile global supply chains are
4. **Climate and resources**: Competition for energy, water, and critical minerals is intensifying
5. **Information warfare**: Social media enables rapid spread of misinformation and political instability
6. **Deglobalization trends**: Rising nationalism and protectionism in many countries

### A Framework for Managing Geopolitical Risk

**Step 1: Identify Exposures**
Map your business activities (supply chains, markets, talent, technology, capital) against geopolitical risk factors. Where are you most exposed?

Questions to ask:
- Which countries are critical to our supply chain?
- What percentage of revenue comes from politically unstable or sanctioned regions?
- Does our technology depend on components from countries in geopolitical tension?
- Are our data practices compliant with all relevant jurisdictions?

**Step 2: Scenario Planning**
Develop scenarios for how geopolitical events could unfold and assess the impact on your business. Peter Schwartz's scenario planning methodology (developed at Royal Dutch Shell and taught at HBS) is particularly useful:

- Identify the two most uncertain and impactful geopolitical drivers
- Construct four scenarios based on different combinations of these drivers
- Assess business impact under each scenario
- Develop strategies that are robust across multiple scenarios

**Step 3: Build Resilience**

| Strategy | Description |
|----------|-------------|
| **Supply chain diversification** | Reduce dependence on any single country or supplier ("China+1" strategy) |
| **Geographic hedging** | Operate in multiple jurisdictions to reduce concentration risk |
| **Regulatory compliance infrastructure** | Build capability to comply with divergent regulations |
| **Political intelligence** | Invest in understanding political dynamics in key markets |
| **Stakeholder relationships** | Build relationships with governments, regulators, and communities |
| **Financial hedging** | Use financial instruments to manage currency and commodity risk |

**Step 4: Create Optionality**
Do not bet everything on a single geopolitical outcome. Instead, create strategic options that give you flexibility:
- Develop alternative suppliers who can ramp up if primary sources are disrupted
- Maintain relationships with regulators in multiple jurisdictions
- Design products that can be adapted to different regulatory environments
- Build modular supply chains that can be reconfigured

### Case Study: Semiconductor Supply Chain Risk

The global semiconductor industry illustrates geopolitical risk perfectly:
- TSMC (Taiwan) manufactures over 60% of the world's advanced semiconductors
- Taiwan's status is a flashpoint in US-China relations
- A disruption to TSMC could cost the global economy an estimated \$500 billion annually

Strategic responses:
- **US**: CHIPS Act (\$52 billion) to reshore semiconductor manufacturing
- **EU**: European Chips Act to build domestic capacity
- **Companies**: Apple, Nvidia, and others diversifying to Samsung (Korea) and Intel (US) foundries

### The Role of Boards and Leadership

HBS research shows that most corporate boards spend less than 5% of their time on geopolitical risk. Leading companies are changing this:
- Creating dedicated geopolitical risk committees
- Hiring former diplomats and intelligence analysts
- Incorporating geopolitical scenarios into strategic planning
- Conducting regular "wargaming" exercises to test preparedness

### Key Takeaway

Geopolitical risk is no longer an edge case -- it is a central feature of the business environment. Companies that integrate geopolitical analysis into their strategic planning, build resilient supply chains, and create strategic optionality will outperform those that are caught off guard by political disruptions.

**Sources**: Rice, C. & Zelikow, P. (2019). *Political Risk*. Twelve/Hachette. Ghemawat, P. (2017). *The New Global Road Map*. Harvard Business Review Press. Bremmer, I. & Keat, P. (2009). *The Fat Tail*. Oxford University Press. HBS case studies on geopolitical risk management.`,
    },
  ],
};
