import { Module } from "../types";

export const competitiveAdvantageModule: Module = {
  id: "bs-competitive",
  title: "Competitive Advantage",
  description:
    "Master Porter's Five Forces, generic strategies, value chain analysis, competitive positioning, and Blue Ocean Strategy.",
  lessons: [
    {
      id: "bs-five-forces",
      slug: "porters-five-forces",
      title: "Porter's Five Forces",
      content: `## Porter's Five Forces

In 1979, a young Harvard Business School professor named Michael Porter published "How Competitive Forces Shape Strategy" in the *Harvard Business Review*. The framework he introduced -- the **Five Forces** -- became the most widely taught tool in strategic management and remains central to HBS's strategy curriculum today.

### The Core Idea

Industry profitability is not random. It is determined by the structure of the industry -- specifically, five competitive forces that collectively determine how much value an industry creates and how that value is divided among competitors, customers, suppliers, and potential entrants.

### The Five Forces

**1. Threat of New Entrants**

How easy is it for new competitors to enter your industry? The higher the barriers to entry, the more protected existing firms are.

Key barriers to entry:
- Economies of scale (incumbents have cost advantages)
- Capital requirements (expensive to start)
- Switching costs (customers are locked in)
- Access to distribution channels
- Government regulation and patents
- Network effects (more users = more valuable)

**Example**: The airline industry has moderate barriers (capital-intensive but deregulated). The pharmaceutical industry has high barriers (patents, FDA approval, R&D costs).

**2. Bargaining Power of Suppliers**

How much leverage do suppliers have over your industry? Powerful suppliers can squeeze profitability by raising prices or reducing quality.

Suppliers are powerful when:
- Few suppliers dominate the market
- No substitute inputs exist
- The industry is not an important customer of the supplier
- Switching costs are high
- Suppliers can credibly threaten forward integration

**Example**: Intel had enormous supplier power over PC manufacturers in the 1990s-2000s. "Intel Inside" gave them direct consumer demand.

**3. Bargaining Power of Buyers**

How much leverage do customers have? Powerful buyers can demand lower prices, higher quality, or more service.

Buyers are powerful when:
- Few buyers purchase large volumes
- Products are standardized or undifferentiated
- Switching costs are low
- Buyers can credibly threaten backward integration
- The product is a significant cost for the buyer

**Example**: Walmart has enormous buyer power over consumer goods manufacturers because of its purchasing volume and ability to switch suppliers.

**4. Threat of Substitute Products**

Are there alternative products or services that serve the same need? Substitutes place a ceiling on prices and limit profitability.

Substitutes are threatening when:
- They offer a better price-performance trade-off
- Switching costs to the substitute are low
- Buyer propensity to substitute is high

**Example**: Video conferencing (Zoom) is a substitute for business air travel. Streaming services are substitutes for cable television.

**5. Rivalry Among Existing Competitors**

How intensely do current competitors compete? High rivalry drives down profitability through price wars, advertising battles, and product introductions.

Rivalry is intense when:
- Numerous or equally balanced competitors exist
- Industry growth is slow
- Fixed costs are high (pressure to fill capacity)
- Exit barriers are high
- Products are undifferentiated

**Example**: The soft drink industry has moderate rivalry (duopoly with high brand differentiation). The airline industry has intense rivalry (price-sensitive customers, high fixed costs, undifferentiated seats).

### How to Use the Framework

| Step | Action |
|------|--------|
| 1 | Define the industry boundaries clearly |
| 2 | Assess each force as high, medium, or low |
| 3 | Identify the 1-2 strongest forces |
| 4 | Determine how these forces affect profitability |
| 5 | Develop strategy to improve your position relative to these forces |

### Strategic Implications

Companies can improve their position by:
- **Positioning** where forces are weakest
- **Exploiting changes** in forces (e.g., technology reducing supplier power)
- **Reshaping forces** in their favor (e.g., raising switching costs, increasing differentiation)

### Key Takeaway

Five Forces analysis shifts the focus from "how do we beat competitors?" to "what structural forces determine profitability in this industry?" By understanding industry structure, firms can choose where to compete and how to position themselves for sustained advantage.

**Sources**: Porter, M. E. (1979). "How Competitive Forces Shape Strategy." *Harvard Business Review*. Porter, M. E. (2008). "The Five Competitive Forces That Shape Strategy." *Harvard Business Review*. HBS Online, "Business Strategy" course.`,
    },
    {
      id: "bs-generic-strategies",
      slug: "generic-strategies",
      title: "Generic Strategies: Cost, Differentiation & Focus",
      content: `## Generic Strategies

In *Competitive Strategy* (1980) and *Competitive Advantage* (1985), Michael Porter argued that there are only three internally consistent strategic positions a firm can adopt. These **generic strategies** provide the foundation for competitive advantage and are a cornerstone of HBS strategy courses.

### The Three Generic Strategies

\`\`\`
                        STRATEGIC ADVANTAGE
                   Uniqueness        Low Cost
                   Perceived         Position
                  +--------------+--------------+
  STRATEGIC  Broad|              |              |
  TARGET    Target| DIFFERENTIA- | COST         |
                  | TION         | LEADERSHIP   |
                  +--------------+--------------+
            Narrow|              |              |
            Target| FOCUS        | FOCUS        |
                  | (differentia-| (cost)       |
                  | tion)        |              |
                  +--------------+--------------+
\`\`\`

### Strategy 1: Cost Leadership

The cost leader aims to become the **lowest-cost producer** in its industry while maintaining acceptable quality. Cost advantages come from:

- **Economies of scale**: spreading fixed costs over high volume
- **Learning curve effects**: getting better and cheaper over time
- **Process innovation**: finding cheaper ways to produce
- **Access to low-cost inputs**: cheaper raw materials, labor, or technology
- **Capacity utilization**: running at optimal volume

**Example**: Walmart achieves cost leadership through massive purchasing power, sophisticated logistics (cross-docking distribution), and relentless operational efficiency. Their "Everyday Low Prices" promise is backed by a cost structure competitors cannot match.

**Risk**: Cost leaders can be disrupted by technology shifts that reset cost structures or by competitors who find entirely new ways to serve customers cheaply.

### Strategy 2: Differentiation

The differentiator creates products or services that are **perceived as unique** across the industry, allowing it to command premium prices. Differentiation can come from:

- **Product features and quality** (Apple's design and ecosystem)
- **Brand image** (luxury goods, premium brands)
- **Technology and innovation** (Tesla's electric drivetrain)
- **Customer service** (Nordstrom, Ritz-Carlton)
- **Distribution and delivery** (Amazon Prime's speed)
- **Network effects** (more users make the product more valuable)

**Example**: Apple's differentiation strategy combines design excellence, ecosystem lock-in (iPhone + Mac + Apple Watch + iCloud), brand prestige, and a premium retail experience. Customers willingly pay 30-50% more for Apple products.

**Risk**: The price premium may become too large. Competitors may narrow the differentiation gap. Customer preferences may shift.

### Strategy 3: Focus

The focus strategy targets a **narrow segment** of the market and serves it better than broad-market competitors. Within that segment, the firm pursues either cost leadership or differentiation.

**Cost Focus Example**: Spirit Airlines focuses on price-sensitive leisure travelers, stripping out all amenities to offer the absolute lowest fares on short-haul routes.

**Differentiation Focus Example**: Rolls-Royce focuses on ultra-high-net-worth individuals who want the most prestigious automobile, regardless of price.

### "Stuck in the Middle"

Porter's most controversial claim is that firms must **choose** one strategy. Companies that try to pursue cost leadership and differentiation simultaneously end up "stuck in the middle" -- they lack the cost structure to compete on price and the uniqueness to command a premium.

**The Counterargument**: Critics point to companies like Toyota (high quality AND efficient production) as evidence that firms can pursue both. Porter responded that Toyota's production system *is* its differentiation -- the "both/and" is an illusion.

**Modern View**: Many HBS professors now argue that digital technology has enabled some companies (Amazon, for instance) to pursue cost leadership and differentiation simultaneously through data, automation, and network effects. However, this remains the exception rather than the rule.

### Choosing Your Strategy

| Question | If Yes... |
|----------|-----------|
| Can you achieve structurally lower costs? | Consider cost leadership |
| Can you create something customers value uniquely? | Consider differentiation |
| Is there an underserved niche? | Consider focus |
| Are you trying to be everything to everyone? | You may be stuck in the middle |

### Key Takeaway

Generic strategies force a fundamental choice: compete on cost, compete on uniqueness, or focus on a narrow market. This choice shapes every subsequent decision -- from hiring to R&D to marketing. The worst position is having no clear choice at all.

**Sources**: Porter, M. E. (1980). *Competitive Strategy*. Free Press. Porter, M. E. (1985). *Competitive Advantage*. Free Press. HBS Online, "Business Strategy" course.`,
    },
    {
      id: "bs-value-chain",
      slug: "value-chain-analysis",
      title: "Value Chain Analysis",
      content: `## Value Chain Analysis

In *Competitive Advantage* (1985), Michael Porter introduced the **Value Chain** as a systematic way to examine all the activities a firm performs and how they interact. The value chain disaggregates a company into its strategically relevant activities to understand the behavior of costs and the sources of differentiation.

### The Value Chain Model

Porter divides a firm's activities into two categories: **primary activities** (directly involved in creating and delivering the product) and **support activities** (that underpin the primary activities).

\`\`\`
+-----------------------------------------------------------+
|               FIRM INFRASTRUCTURE                          |
|          (General Management, Planning, Finance, Legal)    |
+-----------------------------------------------------------+
|               HUMAN RESOURCE MANAGEMENT                    |
|          (Recruiting, Training, Compensation)              |
+-----------------------------------------------------------+
|               TECHNOLOGY DEVELOPMENT                       |
|          (R&D, Process Automation, Design)                 |
+-----------------------------------------------------------+
|               PROCUREMENT                                  |
|          (Purchasing Inputs)                               |
+---+----------+----------+----------+-----------+----------+
|   | Inbound  |          | Outbound | Marketing |          |
|   | Logistics| Operations| Logistics| & Sales  | Service  |
|   |          |          |          |           |          |
+---+----------+----------+----------+-----------+----------+
    PRIMARY ACTIVITIES --------------------------------> MARGIN
\`\`\`

### Primary Activities

**1. Inbound Logistics**: Receiving, storing, and distributing inputs. Examples: warehouse management, inventory control, supplier scheduling, returns to suppliers.

**2. Operations**: Transforming inputs into the final product. Examples: machining, assembly, packaging, equipment maintenance, testing, facility operations.

**3. Outbound Logistics**: Collecting, storing, and distributing the product to buyers. Examples: finished goods warehousing, order processing, delivery scheduling, transportation.

**4. Marketing & Sales**: Providing a means by which buyers can purchase the product and inducing them to do so. Examples: advertising, promotion, sales force, channel selection, pricing.

**5. Service**: Providing service to enhance or maintain the value of the product. Examples: installation, repair, training, parts supply, product adjustment.

### Support Activities

**Firm Infrastructure**: General management, planning, finance, accounting, legal, government affairs, quality management. Unlike other support activities, infrastructure supports the *entire* chain.

**Human Resource Management**: Recruiting, hiring, training, development, and compensation of all types of personnel.

**Technology Development**: Every value activity involves technology -- whether it is know-how, procedures, or technology embodied in process equipment. This includes R&D, process design, and IT systems.

**Procurement**: The function of purchasing inputs used in the firm's value chain. Procurement is not the inputs themselves but the process of acquiring them.

### How to Use Value Chain Analysis

**Step 1: Map Your Activities**
List every activity your company performs and categorize it as primary or support.

**Step 2: Analyze Cost Drivers**
For each activity, identify what drives its cost. Is it scale? Learning? Capacity utilization? Linkages with other activities?

**Step 3: Identify Differentiation Sources**
Which activities contribute to uniqueness? Where can you create more value for customers?

**Step 4: Compare to Competitors**
How does your value chain differ from competitors? Where do you have advantages? Where are you weaker?

**Step 5: Optimize Linkages**
Often the most powerful source of competitive advantage is not any single activity but the **linkages** between activities. Just-in-time manufacturing, for instance, links inbound logistics tightly with operations to reduce inventory costs.

### Case Example: Zara (Inditex)

Zara's value chain is radically different from traditional fashion retailers:

| Activity | Traditional Retailer | Zara |
|----------|---------------------|------|
| Design | 12-month design cycle | 2-week design cycle |
| Procurement | Outsource to low-cost countries | 60% produced in-house/nearby |
| Operations | Large batches, few styles | Small batches, many styles |
| Outbound Logistics | Seasonal shipments | Twice-weekly store deliveries |
| Marketing | Heavy advertising | Minimal advertising; stores are the marketing |

Zara's competitive advantage comes not from any single activity but from the *system* -- the tight linkages between rapid design, proximate manufacturing, and frequent delivery create fast fashion that competitors cannot replicate by copying just one element.

### The Value System

Porter also introduced the concept of the **Value System** -- the larger stream of activities in which a firm's value chain is embedded. This includes supplier value chains, channel value chains, and buyer value chains. Understanding the entire value system reveals opportunities for vertical integration, outsourcing, or partnership.

### Key Takeaway

Value chain analysis reveals that competitive advantage comes from specific activities and their linkages -- not from the firm as a whole. By understanding which activities create value and which destroy it, managers can make targeted investments and strategic decisions.

**Sources**: Porter, M. E. (1985). *Competitive Advantage*. Free Press. HBS Online, "Business Strategy" course. Ghemawat, P. & Nueno, J. L. (2006). "Zara: Fast Fashion." HBS Case Study 9-703-497.`,
    },
    {
      id: "bs-competitive-positioning",
      slug: "competitive-positioning",
      title: "Competitive Positioning",
      content: `## Competitive Positioning

Competitive positioning is the art and science of defining *how* your company will compete and *where* it will direct its efforts. While Porter's Five Forces analyze industry structure and generic strategies define broad approaches, competitive positioning gets specific about the unique space your company occupies in the minds of customers and relative to competitors.

### What is a Competitive Position?

A competitive position is the **specific combination of value you offer to a specific set of customers that is distinct from what competitors offer**. It answers: "Why should customers choose us over alternatives?"

### The Positioning Statement

A clear positioning statement follows this structure:

> For [target customer] who [need/opportunity], [company/product] is the [category] that [key benefit] because [reason to believe].

**Example**: "For busy professionals who need quick, healthy meals, Sweetgreen is the fast-casual restaurant that provides chef-crafted salads with locally sourced ingredients because of our farm-to-counter supply chain."

### Strategic Group Mapping

One powerful tool for understanding competitive positioning is the **Strategic Group Map**. This plots companies in an industry along two key dimensions of strategy, revealing clusters of firms that compete similarly.

**How to create a strategic group map:**

1. Identify two important strategic dimensions in the industry (e.g., price level and product range)
2. Plot each competitor on a two-dimensional graph
3. Draw circles around clusters of similar competitors
4. The size of each circle can represent market share

**Example: Automobile Industry**

\`\`\`
High Price  |  [Rolls-Royce]  [Ferrari]
            |
            |     [BMW]  [Mercedes]  [Porsche]
            |
            |  [Toyota]  [Honda]  [Ford]
            |
Low Price   |  [Kia]  [Hyundai]  [Dacia]
            +--------------------------------
            Narrow Range        Broad Range
\`\`\`

Strategic group maps reveal **mobility barriers** -- the factors that make it difficult to move from one strategic group to another. A mass-market automaker cannot easily become a luxury brand because of brand perception, manufacturing capabilities, dealer networks, and customer expectations.

### Perceptual Mapping

While strategic group maps plot objective strategic dimensions, **perceptual maps** plot how customers perceive competing products. These are based on customer survey data and reveal the mental models that drive purchasing decisions.

Perceptual maps are critical because **positioning exists in the mind of the customer**, not in the boardroom. If customers perceive your product as a commodity regardless of its actual features, that perception is your competitive position.

### Repositioning

Companies sometimes need to change their competitive position. This is called **repositioning** and it is one of the most difficult strategic maneuvers.

**Successful Repositioning Examples:**
- **Apple** (1997-2007): From niche computer maker to consumer electronics leader
- **Netflix** (2007-2013): From DVD-by-mail to streaming platform
- **IBM** (1990s-2000s): From hardware manufacturer to IT services and consulting

**Why Repositioning is Hard:**
- Existing customers may resist the change
- Internal capabilities may not match the new position
- Brand associations are deeply embedded
- Competitors may already occupy the desired position

### The Positioning Trade-off Matrix

| Approach | Advantage | Risk |
|----------|-----------|------|
| **Unique Position** | Low direct competition | Market may be too small |
| **Head-to-Head** | Large, proven market | Must outperform established competitors |
| **Niche Focus** | Deep customer loyalty | Vulnerable to market shifts |
| **Repositioning** | Access to new growth | May alienate existing customers |

### Sustainable Positioning

A competitive position is sustainable when it is protected by:

1. **Activity system fit** (Porter): Interlocking activities that reinforce each other
2. **Unique resources and capabilities** (Resource-Based View): Assets competitors cannot easily acquire
3. **Switching costs**: Customers face costs or inconvenience in switching
4. **Network effects**: The product becomes more valuable as more people use it
5. **Brand equity**: Customer trust and loyalty built over time

### Key Takeaway

Competitive positioning is not about being the best -- it is about being *different* in a way that matters to a specific set of customers. The best positions are specific, defensible, and aligned with the company's overall strategy.

**Sources**: Porter, M. E. (1996). "What Is Strategy?" *Harvard Business Review*. Ries, A. & Trout, J. (2001). *Positioning: The Battle for Your Mind*. HBS Online, "Business Strategy" course. McGahan, A. M. (2004). "How Industries Change." *Harvard Business Review*.`,
    },
    {
      id: "bs-blue-ocean",
      slug: "blue-ocean-strategy",
      title: "Blue Ocean Strategy (Kim & Mauborgne)",
      content: `## Blue Ocean Strategy

In 2005, W. Chan Kim and Renee Mauborgne of INSEAD published *Blue Ocean Strategy*, which has since been adopted into the curricula of major business schools including Harvard. The book challenges Porter's competitive framework by arguing that the most profitable strategies are not about competing *within* existing industries but about creating entirely *new* market spaces.

### Red Oceans vs. Blue Oceans

| Characteristic | Red Ocean | Blue Ocean |
|---------------|-----------|------------|
| **Market space** | Existing industries | Uncontested market space |
| **Competition** | Beat the competition | Make competition irrelevant |
| **Demand** | Exploit existing demand | Create and capture new demand |
| **Value/Cost** | Value-cost trade-off | Break the value-cost trade-off |
| **Strategy** | Differentiation OR low cost | Differentiation AND low cost |

**Red oceans** are the known market spaces -- all industries in existence today. In red oceans, industry boundaries are defined and accepted, and companies try to outperform rivals to grab a greater share of existing demand. As the market gets more crowded, profits and growth shrink, and products become commodities.

**Blue oceans** are the unknown market spaces -- industries that do not exist yet. In blue oceans, demand is *created* rather than fought over, and there is ample opportunity for growth that is both profitable and rapid.

### The Four Actions Framework

The central analytical tool of Blue Ocean Strategy is the **Four Actions Framework**, which asks four questions about an industry's current competitive factors:

1. **ELIMINATE**: Which factors that the industry takes for granted should be eliminated?
2. **REDUCE**: Which factors should be reduced well below the industry standard?
3. **RAISE**: Which factors should be raised well above the industry standard?
4. **CREATE**: Which factors should be created that the industry has never offered?

### The Strategy Canvas

The **Strategy Canvas** is a diagnostic and action framework. It captures the current state of play in the known market space and visualizes where competitors invest and what factors they compete on.

\`\`\`
High  |       *         *
      |      / \\       / \\
Value |     /   \\     /   *----*
      |    /     \\   /
      |   *       \\ /
      |            *
Low   +--------------------------------
      Factor Factor Factor Factor Factor
        1      2      3      4      5

      --- Competitor A (red ocean)
      *** Blue Ocean entrant
\`\`\`

The goal is not to beat competitors on every factor but to create a **divergent value curve** -- a fundamentally different profile of what you offer.

### Case Study: Cirque du Soleil

The most famous Blue Ocean example is **Cirque du Soleil**, which reinvented the circus industry:

| Action | Traditional Circus | Cirque du Soleil |
|--------|-------------------|------------------|
| **Eliminate** | -- | Star performers, animal shows, aisle concessions, multiple show arenas |
| **Reduce** | -- | Fun and humor, thrill and danger |
| **Raise** | -- | Unique venue |
| **Create** | -- | Theme, refined environment, multiple productions, artistic music and dance |

Cirque did not try to be a better circus. They created a new entertainment form that combined elements of circus, theater, and opera. They made traditional circuses irrelevant rather than trying to outcompete them.

### Six Paths Framework

Kim and Mauborgne provide six systematic approaches for finding blue oceans:

**Path 1: Look Across Alternative Industries**
What alternatives do customers choose between? Southwest Airlines looked across airlines AND car travel.

**Path 2: Look Across Strategic Groups**
Can you combine the advantages of different strategic groups? Toyota's Lexus combined BMW's quality with Toyota's price.

**Path 3: Look Across the Chain of Buyers**
Who are the overlooked users, purchasers, or influencers? Bloomberg targeted traders directly instead of IT departments.

**Path 4: Look Across Complementary Products and Services**
What happens before, during, and after your product is used? Nespresso added machine design, capsule variety, and club membership to coffee.

**Path 5: Look Across Functional or Emotional Appeal**
If your industry competes on function, add emotion (and vice versa). Swatch made watches an emotional fashion accessory.

**Path 6: Look Across Time**
What trends will change what customers value? Apple saw that digital music distribution would transform how people access music.

### Criticisms

Harvard Business School professors have raised valid critiques:
- **Survivorship bias**: We only study the blue oceans that succeeded. Many failed attempts go unrecorded.
- **Sustainability**: Blue oceans eventually become red oceans as imitators enter.
- **Not always applicable**: Some industries have limited opportunity for value innovation.

Despite these critiques, Blue Ocean Strategy provides a valuable complement to Porter's competitive frameworks by encouraging leaders to think beyond existing industry boundaries.

### Key Takeaway

Blue Ocean Strategy argues that the most profitable path is not competing harder in existing markets but creating new markets where competition is irrelevant. The Four Actions Framework and Strategy Canvas provide practical tools for identifying and creating these opportunities.

**Sources**: Kim, W. C. & Mauborgne, R. (2005). *Blue Ocean Strategy*. Harvard Business Review Press. Kim, W. C. & Mauborgne, R. (2015). "Red Ocean Traps." *Harvard Business Review*. HBS Online case studies on value innovation.`,
    },
  ],
};
