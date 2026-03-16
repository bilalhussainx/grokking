import { Module } from "../types";

export const growthModule: Module = {
  id: "bs-growth",
  title: "Growth Strategy",
  description:
    "Learn the Ansoff Matrix, organic vs. inorganic growth, strategic alliances, vertical integration, and first-mover dynamics.",
  lessons: [
    {
      id: "bs-ansoff-matrix",
      slug: "ansoff-matrix",
      title: "Ansoff Matrix: Four Paths to Growth",
      content: `## Ansoff Matrix: Four Paths to Growth

Igor Ansoff, often called the "father of strategic management," introduced his **Product/Market Expansion Grid** in 1957 in the *Harvard Business Review*. The Ansoff Matrix remains one of the most practical frameworks for identifying growth opportunities and is taught extensively in HBS strategy courses.

### The Matrix

The Ansoff Matrix maps growth strategies along two dimensions: **products** (existing vs. new) and **markets** (existing vs. new).

\`\`\`
                    EXISTING             NEW
                    PRODUCTS           PRODUCTS
                +-----------------+-----------------+
  EXISTING      |                 |                 |
  MARKETS       |    MARKET       |    PRODUCT      |
                |  PENETRATION    |  DEVELOPMENT    |
                |   (Low Risk)    |  (Medium Risk)  |
                +-----------------+-----------------+
  NEW           |                 |                 |
  MARKETS       |    MARKET       | DIVERSIFICATION |
                |  DEVELOPMENT    |   (High Risk)   |
                |  (Medium Risk)  |                 |
                +-----------------+-----------------+
\`\`\`

### Strategy 1: Market Penetration (Existing Products, Existing Markets)

This is the lowest-risk growth strategy. You sell more of what you already have to customers you already serve.

**Tactics include:**
- Increase usage frequency (Coca-Cola's "Have a Coke and a smile" campaigns)
- Win competitors' customers (aggressive pricing, superior marketing)
- Convert non-users within existing market (reach people who could buy but have not)
- Increase purchase quantity (bundle deals, larger sizes)

**When to use**: When the market is not yet saturated, when competitors are weak, when economies of scale can be achieved, when you have strong brand loyalty.

**Example**: Starbucks expanded from 1,000 stores in 1996 to 15,000 by 2007 in the US market alone -- pure market penetration through geographic saturation of an existing product in an existing market.

### Strategy 2: Market Development (Existing Products, New Markets)

Take your existing product or service to new customer segments or geographic markets.

**Tactics include:**
- Geographic expansion (domestic to international)
- New customer segments (consumer to enterprise, or vice versa)
- New distribution channels (retail to online, or online to retail)
- New use cases (baking soda marketed for cleaning, deodorizing, and cooking)

**When to use**: When your product has proven product-market fit, when new markets have similar needs to your existing market, when you have the capability to serve new markets.

**Example**: Netflix's international expansion -- taking a proven streaming product to new geographic markets. They entered 130 new countries in 2016 alone, adapting content but keeping the core platform unchanged.

### Strategy 3: Product Development (New Products, Existing Markets)

Create new products or services for your existing customer base.

**Tactics include:**
- Product line extensions (new flavors, sizes, models)
- Next-generation products (iPhone 14 to iPhone 15)
- Complementary products (Apple Watch for iPhone users)
- Completely new products for existing customers (Amazon launching AWS for its existing merchant base)

**When to use**: When you understand your customers deeply, when you have strong R&D capabilities, when existing products are maturing, when competitors are innovating.

**Example**: Apple's product development from Mac to iPod to iPhone to iPad to Apple Watch to AirPods -- each serving the same core customer base with new products.

### Strategy 4: Diversification (New Products, New Markets)

The highest-risk strategy -- entering new markets with new products. There are two types:

**Related Diversification**: Expanding into businesses that share resources, capabilities, or markets with the existing business.
- Disney expanding from animation to theme parks to merchandise to streaming
- Amazon expanding from e-commerce to cloud computing (shared infrastructure)

**Unrelated Diversification**: Expanding into businesses with no strategic connection to the existing portfolio.
- General Electric's historical conglomerate (jet engines, healthcare, finance, media)
- Berkshire Hathaway (insurance, railroads, candy, furniture)

**The evidence on diversification** is mixed. HBS research shows that related diversification creates more value than unrelated diversification on average. The "conglomerate discount" -- where diversified companies trade at lower valuations than the sum of their parts -- is well-documented.

### Risk-Return Profile

| Strategy | Risk Level | Typical Return | Success Rate |
|----------|-----------|---------------|-------------|
| Market Penetration | Low | Moderate | High (>70%) |
| Market Development | Medium | Moderate-High | Medium (40-60%) |
| Product Development | Medium | High potential | Medium (30-50%) |
| Diversification | High | Very High potential | Low (20-30%) |

### Applying the Ansoff Matrix

**Step 1**: Map your current position (existing products and markets)
**Step 2**: Evaluate all four quadrants for growth opportunities
**Step 3**: Assess the risk and resource requirements of each option
**Step 4**: Choose the strategy that best matches your capabilities and risk tolerance
**Step 5**: Sequence your growth moves (often starting with penetration before expanding)

### Key Takeaway

The Ansoff Matrix provides a simple but powerful framework for organizing growth options. The key insight is that growth always involves one of four paths, and risk increases as you move away from what you know (existing products and markets). Most successful companies grow sequentially -- mastering penetration before attempting development or diversification.

**Sources**: Ansoff, H. I. (1957). "Strategies for Diversification." *Harvard Business Review*, 35(5), 113-124. HBS Online, "Business Strategy" course. Harvard Business Review case studies on corporate growth strategy.`,
    },
    {
      id: "bs-organic-inorganic",
      slug: "organic-vs-inorganic-growth",
      title: "Organic vs. Inorganic Growth",
      content: `## Organic vs. Inorganic Growth

Every company seeking growth faces a fundamental choice: build it yourself (organic) or buy it (inorganic). This decision shapes resource allocation, organizational culture, and competitive dynamics. Harvard Business School devotes significant case study time to examining when each path is appropriate and how to execute both effectively.

### Defining the Terms

**Organic Growth** is growth generated from within the company through internal resources. It includes expanding sales, launching new products, entering new markets, hiring new employees, and building new capabilities -- all without acquisitions.

**Inorganic Growth** is growth achieved through external means: mergers, acquisitions (M&A), joint ventures, strategic alliances, and licensing agreements.

### Comparing the Two Paths

| Dimension | Organic Growth | Inorganic Growth |
|-----------|---------------|-----------------|
| **Speed** | Slower (takes time to build) | Faster (buy capability immediately) |
| **Cost** | Lower upfront, spreads over time | Higher upfront (acquisition premium) |
| **Risk** | Lower (incremental investment) | Higher (integration risk, overpayment) |
| **Culture** | Preserves existing culture | Cultural integration challenges |
| **Control** | Full control over development | Must integrate acquired entity |
| **Learning** | Deep capability building | May acquire capabilities without understanding |
| **Reversibility** | Easy to scale back | Difficult to unwind |

### When Organic Growth is Better

Organic growth is preferred when:
- **Time is available**: You have years, not months, to build capabilities
- **The market is developing**: Growing markets give you time to ramp up
- **Your capabilities are unique**: What you need cannot be easily bought
- **Cultural fit matters**: You need the capability deeply embedded in your culture
- **Capital is constrained**: You cannot afford large acquisitions

**Example**: Google's development of Android was organic. Starting in 2003 (via a small acquisition of Android Inc., then building it organically), Google invested years building the mobile operating system internally because they needed it deeply integrated with their services ecosystem.

### When Inorganic Growth is Better

Inorganic growth is preferred when:
- **Speed is critical**: The market window will close before you can build organically
- **Capabilities are available for purchase**: A company already has what you need
- **Scale matters immediately**: Network effects or market share require rapid growth
- **Talent acquisition**: The fastest way to acquire scarce talent ("acqui-hire")
- **Competitive defense**: Preventing a competitor from acquiring the target

**Example**: Facebook's acquisition of Instagram (2012, \$1B) and WhatsApp (2014, \$19B) were inorganic growth plays. Building competing social platforms organically would have been slower and less certain than acquiring products that already had massive user bases and engagement.

### The M&A Success Rate Problem

Research from Harvard Business School and McKinsey consistently shows that **60-70% of acquisitions fail to create value for the acquirer**. The primary reasons:

1. **Overpayment**: Acquisition premiums average 20-40% above market value
2. **Integration failure**: Combining cultures, systems, and processes is harder than expected
3. **Synergy overestimation**: Projected synergies rarely materialize fully
4. **Key talent departure**: Top performers at acquired companies often leave
5. **Strategic distraction**: Integration consumes management attention

### The Build-vs-Buy Decision Framework

| Factor | Build (Organic) | Buy (Inorganic) |
|--------|-----------------|------------------|
| How urgent is the need? | Can wait 2-5 years | Needed within 12 months |
| Does the capability exist externally? | No or poor fit | Strong fit available |
| How complex is the integration? | N/A | Low to moderate |
| What is our M&A track record? | N/A | Proven integration capability |
| What is the cultural risk? | Low | Assess carefully |
| What is the total cost? | Compare TCO over 5 years | Include premium + integration costs |

### Hybrid Approaches

Many successful companies combine both strategies:

**Strategic Alliances**: Partner without acquiring. Lower commitment, lower cost, lower risk. But also lower control.

**Joint Ventures**: Create a new entity with shared ownership. Common in international expansion where local knowledge is essential.

**Minority Investments**: Invest in a company without acquiring it. Provides options for future acquisition and access to innovation. Google Ventures and Intel Capital use this approach extensively.

**Acqui-hires**: Acquire a small company primarily for its team rather than its product. Common in technology (Facebook, Apple, Google do this regularly).

### Key Takeaway

The organic vs. inorganic decision is not binary. The best growth strategies often combine both approaches -- building core capabilities internally while acquiring to fill gaps, accelerate timing, or capture market position. The critical skill is matching the growth method to the strategic need.

**Sources**: Bower, J. L. (2001). "Not All M&As Are Alike." *Harvard Business Review*. Christensen, C. M., Alton, R., Rising, C., & Waldeck, A. (2011). "The Big Idea: The New M&A Playbook." *Harvard Business Review*. HBS Online, "Business Strategy" course.`,
    },
    {
      id: "bs-strategic-alliances",
      slug: "strategic-alliances",
      title: "Strategic Alliances & Partnerships",
      content: `## Strategic Alliances & Partnerships

Between the extremes of organic growth and full acquisition lies a rich middle ground: **strategic alliances and partnerships**. Harvard Business School research shows that major corporations manage an average of 30-50 active alliances at any given time, and alliance revenue accounts for nearly a third of revenue at many Fortune 500 companies.

### What is a Strategic Alliance?

A strategic alliance is a **cooperative arrangement between two or more independent organizations** that share resources, capabilities, or activities to achieve a common strategic objective while remaining separate entities.

### Types of Alliances

| Type | Description | Example |
|------|-------------|---------|
| **Joint Venture** | New entity co-owned by partners | Hulu (originally Disney + NBC + Fox) |
| **Equity Alliance** | One partner takes equity stake in the other | Google's investment in SpaceX |
| **Licensing Agreement** | One partner licenses IP to another | Qualcomm licenses chip designs |
| **Supply Chain Partnership** | Deep integration between buyer and supplier | Toyota and Denso |
| **Co-Marketing Alliance** | Joint marketing and distribution | Spotify bundled with Samsung phones |
| **R&D Consortium** | Shared research and development | SEMATECH (semiconductor research) |
| **Franchise** | Brand and system licensing | McDonald's franchise model |

### Why Form Alliances?

**1. Access Resources You Lack**
No company has all the resources it needs. Alliances provide access to technology, markets, capital, talent, or distribution that would take years to build internally.

**2. Share Risk and Cost**
Large projects (developing a new aircraft, building 5G networks, exploring oil fields) involve massive capital requirements and technological uncertainty. Alliances spread both risk and cost.

**3. Enter New Markets**
International expansion often requires a local partner who understands the regulatory environment, customer preferences, and business culture. Joint ventures are the most common entry mode in China, India, and many emerging markets.

**4. Set Industry Standards**
Technology companies form alliances to establish standards (Blu-ray was developed by an alliance including Sony, Samsung, and Apple). Being part of the winning standard creates enormous competitive advantage.

**5. Speed**
Alliances can be formed much faster than building capabilities internally. When speed matters, alliances provide a shortcut to market.

### The Alliance Life Cycle

**Phase 1: Strategy Development**
Define why you need an alliance and what success looks like. What capabilities do you seek? What will you contribute?

**Phase 2: Partner Selection**
Choose partners based on strategic fit (complementary capabilities), organizational fit (compatible cultures and processes), and operational fit (ability to work together daily).

**Phase 3: Negotiation & Structuring**
Define governance, decision-making, resource commitment, intellectual property rights, and exit provisions. The best alliances have clear agreements on who contributes what and who gets what.

**Phase 4: Management & Execution**
Manage the alliance actively. Assign dedicated alliance managers. Create joint decision-making structures. Monitor performance with agreed-upon metrics.

**Phase 5: Evolution or Termination**
Alliances are not permanent. They may evolve (deepen, expand scope), may achieve their purpose and conclude, or may fail and need to be dissolved.

### Why Alliances Fail

HBS research identifies the top reasons alliances underperform:

1. **Misaligned objectives**: Partners want different things but do not surface these differences early
2. **Cultural clash**: Different decision-making speeds, risk tolerances, and communication styles
3. **Governance gaps**: Unclear decision rights lead to paralysis or conflict
4. **Unequal commitment**: One partner invests more effort than the other, creating resentment
5. **Trust deficit**: Lack of transparency erodes cooperation
6. **Competitive tension**: Partners compete in other markets, creating conflicting incentives

### Alliance Management Best Practices

**Invest in relationship capital**: Build personal relationships between key people at both organizations. Trust is the lubricant of alliances.

**Create dedicated alliance management functions**: Companies with dedicated alliance managers achieve 25% higher success rates (research by the Association of Strategic Alliance Professionals).

**Define clear metrics**: What does success look like? Revenue targets? Market share? Technology milestones? Without clear metrics, both sides may declare success or failure based on different criteria.

**Build in flexibility**: Markets change, strategies evolve. The alliance agreement should include mechanisms for adaptation -- regular strategic reviews, scope change processes, and orderly exit provisions.

**Communicate transparently**: Share information openly. Alliances fail when partners hoard information or are surprised by decisions.

### Key Takeaway

Strategic alliances are one of the most versatile tools in a strategist's toolkit. They provide speed, flexibility, and access to capabilities that organic growth cannot match -- without the commitment and risk of full acquisition. The key success factor is not the legal structure but the quality of the relationship and alignment of incentives.

**Sources**: Kanter, R. M. (1994). "Collaborative Advantage." *Harvard Business Review*. Dyer, J. H., Kale, P., & Singh, H. (2001). "How to Make Strategic Alliances Work." *MIT Sloan Management Review*. HBS Online, "Business Strategy" course. Bamford, J. D., Gomes-Casseres, B., & Robinson, M. S. (2003). *Mastering Alliance Strategy*. Jossey-Bass.`,
    },
    {
      id: "bs-vertical-integration",
      slug: "vertical-integration",
      title: "Vertical Integration",
      content: `## Vertical Integration

Vertical integration -- the decision to own and control activities upstream or downstream in the value chain -- is one of the most consequential strategic choices a company can make. Harvard Business School case studies on vertical integration span from Henry Ford's River Rouge complex (where iron ore entered one end and finished cars exited the other) to Apple's chip design and Tesla's Gigafactories.

### What is Vertical Integration?

Vertical integration occurs when a company expands its operations into different stages of the same production path. Instead of relying on external suppliers (upstream) or distributors (downstream), the company brings those activities in-house.

**Forward (Downstream) Integration**: Moving closer to the customer. A manufacturer opens its own retail stores. Examples: Apple Stores, Tesla direct sales, Nike DTC (direct-to-consumer).

**Backward (Upstream) Integration**: Moving closer to raw materials or inputs. A manufacturer produces its own components. Examples: Apple designing its own chips, Netflix producing its own content, SpaceX manufacturing its own rocket engines.

### The Make-vs-Buy Decision

At its core, vertical integration is a **make-vs-buy decision**: should we produce this input ourselves (make) or purchase it from an external supplier (buy)?

| Factor | Favors Make (Integrate) | Favors Buy (Outsource) |
|--------|------------------------|----------------------|
| **Transaction costs** | High (complex, frequent, specific) | Low (standardized, infrequent) |
| **Asset specificity** | High (customized assets required) | Low (general-purpose assets) |
| **Supplier power** | Few reliable suppliers | Many competitive suppliers |
| **Quality control** | Critical to brand/product | Adequate from external sources |
| **Coordination needs** | Tight coordination required | Loose coordination sufficient |
| **Core competence** | Activity is core to your strategy | Activity is not differentiating |
| **Scale economics** | You can achieve efficient scale | Suppliers have better scale |

### Transaction Cost Economics

Oliver Williamson's **Transaction Cost Economics (TCE)** -- which earned him the Nobel Prize in Economics (2009) -- provides the theoretical foundation for vertical integration decisions. TCE argues that firms integrate activities when the *transaction costs* of using markets (searching for suppliers, negotiating contracts, monitoring performance, enforcing agreements) exceed the *organizational costs* of doing it internally.

Transaction costs are highest when:
- **Asset specificity** is high: The supplier must make investments that have little value outside the relationship
- **Uncertainty** is high: It is hard to write complete contracts covering all contingencies
- **Frequency** is high: Repeated transactions create ongoing contracting costs

### Benefits of Vertical Integration

**1. Reduced Transaction Costs**: Eliminate the costs of finding, negotiating with, and monitoring external partners.

**2. Supply Security**: Guarantee access to critical inputs. Apple designs its own chips (A-series, M-series) to avoid dependence on competitors like Qualcomm.

**3. Quality Control**: Direct control over production ensures consistent quality. Tesla manufactures its own battery packs because battery performance is central to the driving experience.

**4. Competitive Advantage**: Vertical integration can create capabilities that competitors cannot easily replicate. Zara's ownership of manufacturing enables its 2-week design-to-shelf cycle.

**5. Capture Margin**: Instead of paying a supplier's profit margin, capture that margin yourself.

### Risks of Vertical Integration

**1. Increased Capital Requirements**: Owning more of the value chain requires more investment.

**2. Reduced Flexibility**: You are locked into your own capacity. If demand drops, you carry the fixed costs. If technology changes, you may be stuck with obsolete capabilities.

**3. Organizational Complexity**: Managing more activities increases management burden and bureaucracy.

**4. Loss of Specialization Benefits**: External suppliers may be more efficient because they specialize and serve multiple customers, achieving economies of scale you cannot match.

**5. Core Competence Dilution**: Trying to do too many things can distract from what you do best.

### The Trend Toward Virtual Integration

In recent decades, many industries have moved toward **virtual integration** -- achieving the coordination benefits of vertical integration without the ownership. This is enabled by:

- Information technology (real-time data sharing with suppliers)
- Long-term relational contracts (trust-based partnerships)
- Industry standards (interoperability reduces coordination costs)
- Modular architectures (standardized interfaces between components)

Dell pioneered virtual integration in the PC industry, coordinating hundreds of suppliers without owning any manufacturing. Toyota's keiretsu system achieves tight supplier coordination through long-term relationships and minority equity stakes rather than full ownership.

### Key Takeaway

Vertical integration is not inherently good or bad -- it depends on industry structure, competitive dynamics, and the specific activity being considered. The decision should be driven by transaction costs, strategic importance, and whether integration creates capabilities that drive competitive advantage.

**Sources**: Williamson, O. E. (1985). *The Economic Institutions of Capitalism*. Free Press. Stuckey, J. & White, D. (1993). "When and When Not to Vertically Integrate." *MIT Sloan Management Review*. HBS case studies on Apple, Tesla, and Zara vertical integration strategies.`,
    },
    {
      id: "bs-first-mover",
      slug: "first-mover-vs-fast-follower",
      title: "First-Mover vs. Fast-Follower",
      content: `## First-Mover vs. Fast-Follower

Is it better to be first to market or to learn from pioneers' mistakes and enter later? This question has been debated in strategy literature for decades. Harvard Business School research offers a nuanced answer: **first-mover advantage is real but conditional, and fast-follower advantage is underappreciated.**

### First-Mover Advantages

Being first can create significant competitive advantages:

**1. Technology Leadership**
First movers can establish proprietary technology, accumulate patents, and ride the learning curve. Intel's early entry into microprocessors created a technological lead that persisted for decades.

**2. Preemption of Scarce Resources**
First movers can lock up the best locations, talent, suppliers, and distribution channels. In retail, Walmart secured prime small-town locations before competitors recognized the opportunity.

**3. Switching Costs and Lock-In**
Early customers invest in learning, integrating, and customizing around the first mover's product. Microsoft's early dominance in PC operating systems created enormous switching costs (documents, training, compatibility).

**4. Network Effects**
In markets with network effects, the first platform to reach critical mass can create a self-reinforcing advantage. Facebook's early network effects in college markets created a barrier that MySpace, Friendster, and others could not overcome.

**5. Brand Recognition and Reputation**
The first mover often becomes synonymous with the category. "Googling" means searching. "Ubering" means ride-sharing. "Xeroxing" means copying. This mind-share advantage is difficult for followers to overcome.

### First-Mover Disadvantages

Being first also carries significant risks:

**1. Free-Rider Problem**
Followers can learn from the first mover's R&D investments, market development efforts, and mistakes without bearing those costs. Samsung studied Apple's smartphone innovations and created competitive alternatives.

**2. Technological Uncertainty**
First movers may bet on the wrong technology. Sony's Betamax lost to VHS despite being technically superior. Early electric vehicle companies in the 1900s lost to gasoline cars.

**3. Market Uncertainty**
First movers must educate the market and shape customer preferences -- an expensive process with uncertain outcomes. Many pioneers fail because the market is not yet ready.

**4. Incumbent Inertia**
Successful first movers can become trapped by their own success. When the market evolves, their early investments become liabilities. AOL's dial-up infrastructure became obsolete as broadband emerged.

**5. High Development Costs**
Pioneers bear the full cost of R&D, regulatory approval, market education, and infrastructure development. Followers benefit from lower development costs and proven demand.

### The Fast-Follower Advantage

Research by Markides and Geroski (published in HBS-affiliated journals) shows that in many industries, **fast followers outperform first movers**:

| Category | First Mover | Fast Follower (Winner) |
|----------|-------------|----------------------|
| Web search | AltaVista, Yahoo | Google |
| Social networking | Friendster, MySpace | Facebook |
| MP3 players | Diamond Rio, Creative | Apple iPod |
| Smartphones | Palm, BlackBerry | Apple iPhone |
| E-commerce | WebVan, Pets.com | Amazon (in groceries) |
| Video streaming | RealNetworks | YouTube, Netflix |
| Electric vehicles | GM EV1 | Tesla |

Fast followers succeed by:
- Learning from pioneers' mistakes
- Entering when technology and market are more mature
- Investing in superior execution rather than exploration
- Leveraging existing resources and brand equity

### When First-Mover Advantage Holds

First-mover advantage is strongest when:

1. **Network effects are strong**: Platforms with winner-take-all dynamics reward early entrants
2. **Switching costs are high**: Once customers adopt, they are locked in
3. **Resources can be preempted**: Scarce locations, patents, or talent can be captured early
4. **Learning curves are steep**: Experience creates significant cost advantages
5. **Standards are being set**: The first mover can define the industry standard

### When Fast-Follower Advantage Holds

Fast-follower advantage is strongest when:

1. **Technology is evolving rapidly**: First-mover investments become obsolete quickly
2. **Customer preferences are uncertain**: Pioneers struggle to find product-market fit
3. **Market education is expensive**: Followers benefit from awareness created by pioneers
4. **Execution matters more than timing**: Superior products and operations can overcome first-mover lead
5. **Regulatory landscape is unclear**: Early entrants may face regulatory challenges that followers can avoid

### The Optimal Entry Timing Framework

Rather than "first" or "second," think about optimal timing:

**Too early**: Market is not ready. Technology is immature. You burn through cash educating customers who are not ready to buy.

**Optimal window**: Technology is proven, early adopters have validated demand, but the mass market has not yet been captured. This is where fast followers thrive.

**Too late**: Incumbents are entrenched, switching costs are established, network effects are locked in. Entering now requires a disruptive approach, not incremental improvement.

### Key Takeaway

First-mover advantage is not automatic -- it depends on industry characteristics, network effects, switching costs, and execution capability. In many cases, the "first mover" in popular narrative was actually a fast follower who learned from earlier pioneers. The strategic question is not "should we be first?" but "what timing gives us the best chance of winning?"

**Sources**: Lieberman, M. B. & Montgomery, D. B. (1988). "First-Mover Advantages." *Strategic Management Journal*. Markides, C. & Geroski, P. (2005). *Fast Second*. Jossey-Bass. Suarez, F. & Lanzolla, G. (2005). "The Half-Truth of First-Mover Advantage." *Harvard Business Review*.`,
    },
  ],
};
