import { Module } from "../types";

export const foundationsModule: Module = {
  id: "bs-foundations",
  title: "Foundations of Strategy",
  description:
    "Understand what strategy really means, how it differs from tactics and operations, and the core frameworks every strategist needs.",
  lessons: [
    {
      id: "bs-what-is-strategy",
      slug: "what-is-strategy",
      title: "What is Strategy? (Porter's View)",
      content: `## What is Strategy?

In 1996, Michael Porter published his landmark Harvard Business Review article "What is Strategy?" and fundamentally reshaped how business leaders think about competitive advantage. Porter argued that **strategy is not operational effectiveness** -- it is about making deliberate choices to be *different*.

### The Core Insight

Many companies confuse being better with being different. Porter's central thesis is that **strategy means performing different activities from rivals, or performing similar activities in different ways**. Operational effectiveness -- doing the same things better -- is necessary but not sufficient for sustained competitive advantage.

> "The essence of strategy is choosing what *not* to do." -- Michael Porter, Harvard Business Review, 1996

### Strategy vs. Operational Effectiveness

| Dimension | Operational Effectiveness | Strategy |
|-----------|--------------------------|----------|
| Goal | Do the same things better | Do different things |
| Scope | Best practices, efficiency | Unique positioning |
| Sustainability | Easily copied | Hard to replicate |
| Example | Faster delivery times | IKEA's self-serve model |

### The Productivity Frontier

Porter introduced the concept of the **productivity frontier** -- the maximum value a company can deliver at a given cost using the best available technologies and practices. Companies competing only on operational effectiveness all converge toward this frontier, leading to **competitive convergence** where no one wins.

### Strategic Positioning

Porter identified three bases of strategic positioning:

1. **Variety-based positioning**: Serving a wide range of customers but only for a subset of their needs (e.g., Jiffy Lube focuses only on oil changes)
2. **Needs-based positioning**: Serving most or all needs of a particular customer segment (e.g., IKEA targets young furniture buyers who want style at low cost)
3. **Access-based positioning**: Segmenting customers by how they can be reached (e.g., Carmike Cinemas targets small-town markets)

### Trade-offs: The Heart of Strategy

Strategy requires **trade-offs**. You cannot be all things to all people. Continental Airlines tried to match Southwest's low-cost model while maintaining its full-service operations. The result was a disaster -- neither strategy worked well because the activities conflicted.

Trade-offs arise from:
- **Inconsistencies in image or reputation** (a luxury brand cannot also be a discount brand)
- **Activities themselves** (different positions require different equipment, skills, and systems)
- **Limits on internal coordination** (you cannot optimize for contradictory goals)

### Activity Systems and Fit

The most sustainable strategies are built on **systems of interlocking activities** that reinforce each other. Porter calls this "fit." IKEA's strategy works because self-service, flat-pack furniture, in-store childcare, suburban locations, and Swedish food court all reinforce one another. Copying one element without the others yields little benefit.

### HBS Case Method Connection

At Harvard Business School, strategy courses use the case method to examine real companies facing strategic choices. The question is never "what is the right answer?" but rather "what trade-offs is this company willing to make, and do its activities reinforce each other?"

### Key Takeaway

Strategy is about deliberately choosing a set of activities that deliver a unique mix of value. It requires trade-offs, and its power comes from the fit among activities -- not from any single element in isolation.

**Sources**: Porter, M. E. (1996). "What Is Strategy?" *Harvard Business Review*, 74(6), 61-78. HBS Online, "Business Strategy" course module on competitive positioning.`,
    },
    {
      id: "bs-strategy-vs-tactics",
      slug: "strategy-vs-tactics",
      title: "Strategy vs. Tactics vs. Operations",
      content: `## Strategy vs. Tactics vs. Operations

One of the most common sources of confusion in business is conflating strategy, tactics, and operations. Leaders who cannot distinguish between these three levels often find their organizations busy but directionless. Harvard Business School emphasizes this distinction as foundational to effective management.

### Defining the Three Levels

**Strategy** answers the question: *Where will we play, and how will we win?* It involves long-term choices about markets, positioning, and competitive advantage.

**Tactics** answer the question: *What specific actions will we take to execute our strategy?* They are medium-term plans that translate strategic intent into concrete initiatives.

**Operations** answer the question: *How do we run the business day to day?* They involve the systems, processes, and routines that keep the organization functioning.

### A Practical Example

Consider Starbucks:

| Level | Starbucks Example |
|-------|-------------------|
| **Strategy** | Create a "third place" between home and work; premium coffee experience |
| **Tactics** | Launch mobile ordering app; introduce seasonal drinks (Pumpkin Spice Latte) |
| **Operations** | Barista training programs; supply chain management; store opening procedures |

### The Hierarchy in Practice

Think of these three levels as a cascade:

\`\`\`
Strategy (WHY & WHERE)
    |
    v
Tactics (WHAT & WHEN)
    |
    v
Operations (HOW & WHO)
\`\`\`

Each level should flow naturally from the one above it. When tactics are disconnected from strategy, you get random acts of improvement. When operations are disconnected from tactics, you get efficient execution of the wrong things.

### Common Mistakes

**Mistake 1: Calling tactics "strategy."** A company that says "Our strategy is to launch a mobile app" is confusing tactics with strategy. The strategy might be "to create the most convenient customer experience in our industry." The mobile app is one tactic in service of that strategy.

**Mistake 2: Spending all time on operations.** Many managers are so consumed by day-to-day firefighting that they never step back to think strategically. As Harvard Business Review research shows, executives spend an average of only 15% of their time on strategic thinking.

**Mistake 3: Strategy without execution.** A brilliant strategy means nothing without tactical plans and operational capability to deliver it. The *strategy-execution gap* (covered later in this course) is one of the most studied problems in management.

### The "Ladder of Abstraction"

Roger Martin, former dean of the Rotman School of Management and frequent HBS collaborator, describes the relationship between strategy and execution as a **"ladder of abstraction."** At the top, you have broad strategic choices. As you descend, each rung becomes more concrete and actionable.

The key insight: **every level is both strategy and execution**. A VP's "tactic" is a director's "strategy." Context determines which label applies.

### Testing Your Understanding

Ask yourself these questions about any business initiative:
- **Does it define where to compete and how to win?** -> Strategy
- **Does it describe a specific action plan?** -> Tactic
- **Does it involve running a recurring process?** -> Operations

### Key Takeaway

Great organizations maintain alignment across all three levels. Strategy sets direction, tactics translate it into action, and operations deliver results consistently. Confusing these levels leads to wasted effort and strategic drift.

**Sources**: Porter, M. E. (1996). "What Is Strategy?" *Harvard Business Review*. Martin, R. (2014). "The Big Lie of Strategic Planning." *Harvard Business Review*. HBS Online, "Business Strategy" course.`,
    },
    {
      id: "bs-mission-vision-values",
      slug: "mission-vision-values",
      title: "Mission, Vision & Values Framework",
      content: `## Mission, Vision & Values Framework

Every enduring organization is built on three foundational elements: a **mission** (why we exist), a **vision** (where we are going), and **values** (how we behave along the way). Harvard Business School's strategy curriculum treats these not as corporate platitudes but as strategic tools that guide decision-making at every level.

### Definitions

**Mission Statement**: Defines the organization's fundamental purpose -- why it exists beyond making money. It answers: *What do we do, for whom, and why does it matter?*

**Vision Statement**: Describes a desired future state -- what the world looks like if the organization succeeds. It answers: *Where are we going?*

**Values**: The principles and behaviors that guide how people in the organization work. They answer: *What do we stand for?*

### Examples from World-Class Companies

| Company | Mission | Vision | Core Values |
|---------|---------|--------|-------------|
| **Patagonia** | Build the best product, cause no unnecessary harm, use business to inspire solutions to the environmental crisis | A world where business heals the planet | Quality, integrity, environmentalism, not bound by convention |
| **Tesla** | Accelerate the world's transition to sustainable energy | A future powered entirely by renewable energy | Innovation, sustainability, speed, first-principles thinking |
| **Amazon** | To be Earth's most customer-centric company | Every product available, delivered to every doorstep | Customer obsession, ownership, invent and simplify, bias for action |

### Why This Matters Strategically

Jim Collins and Jerry Porras, in their landmark HBS research published in *Built to Last* (1994), found that **visionary companies outperformed the general stock market by a factor of 15 over 65 years**. The common thread was not specific strategies but rather a clear core ideology (mission + values) combined with bold, long-term vision.

Collins later introduced the concept of a **BHAG (Big Hairy Audacious Goal)** -- a 10-to-30-year ambitious vision that energizes the entire organization. Microsoft's original BHAG: "A computer on every desk and in every home." This was not a vague aspiration -- it was a concrete, measurable vision.

### The Strategic Function of Each Element

**Mission** provides a decision filter. When Amazon debates entering a new market, they ask: "Does this serve our mission of being the most customer-centric company?" If yes, proceed. If no, reconsider.

**Vision** provides direction and motivation. It tells employees and stakeholders what success looks like. Without vision, an organization may execute efficiently but drift aimlessly.

**Values** provide behavioral guardrails. Netflix's famous culture deck (which HBS studied as a case) lists values like "freedom and responsibility" that actively shape hiring, firing, and promotion decisions. Values that do not influence real decisions are just wall decorations.

### How to Craft Effective Statements

For a **Mission Statement**, use this structure:
- We [action verb] [what we do] for [whom] to [impact/outcome].
- Keep it under 25 words. If your mission needs a paragraph, it is too complex.

For a **Vision Statement**:
- Describe a future state, not a current activity
- Make it aspirational but not delusional
- Set a time horizon (10-30 years)

For **Values**:
- Limit to 3-7 core values
- Each value should have specific behavioral examples
- Test: Would you fire a high performer who violates this value? If not, it is not a real value.

### The Alignment Test

Patrick Lencioni argues in *The Advantage* that organizational health -- the alignment of mission, vision, values, strategy, and culture -- is the single greatest competitive advantage. Ask six random employees: "What is our mission?" If you get six different answers, you have an alignment problem.

### Key Takeaway

Mission, vision, and values are not decorative -- they are strategic infrastructure. They guide resource allocation, shape culture, and provide the foundation on which all other strategic choices rest.

**Sources**: Collins, J. & Porras, J. (1994). *Built to Last*. HBS Press. Lencioni, P. (2012). *The Advantage*. HBS Online, "Business Strategy" course. Netflix Culture Deck (HBS Case Study).`,
    },
    {
      id: "bs-swot-analysis",
      slug: "swot-analysis",
      title: "SWOT Analysis",
      content: `## SWOT Analysis

SWOT analysis is one of the most widely used strategic planning tools in the world. Developed at Stanford Research Institute in the 1960s and popularized through Harvard Business School case studies, SWOT provides a structured way to evaluate an organization's **Strengths, Weaknesses, Opportunities, and Threats**.

### The SWOT Matrix

\`\`\`
                    HELPFUL              HARMFUL
                  (to objectives)     (to objectives)
               +-------------------+-------------------+
  INTERNAL     |                   |                   |
  (company)    |    STRENGTHS      |    WEAKNESSES     |
               |                   |                   |
               +-------------------+-------------------+
  EXTERNAL     |                   |                   |
  (environment)|   OPPORTUNITIES   |     THREATS       |
               |                   |                   |
               +-------------------+-------------------+
\`\`\`

### Definitions

**Strengths** (Internal, Helpful): Resources, capabilities, and advantages your organization possesses. What do you do better than competitors?

**Weaknesses** (Internal, Harmful): Limitations, gaps, and disadvantages. Where are you vulnerable?

**Opportunities** (External, Helpful): Favorable external conditions you could exploit. What trends or changes could benefit you?

**Threats** (External, Harmful): Unfavorable external conditions that could cause trouble. What competitors, regulations, or market shifts could hurt you?

### Example: Netflix (circa 2010)

| | Helpful | Harmful |
|---|---------|---------|
| **Internal** | **Strengths**: Recommendation algorithm, brand loyalty, first-mover in streaming, data-driven culture | **Weaknesses**: No original content, dependent on studio licenses, high content costs |
| **External** | **Opportunities**: Global internet adoption, cord-cutting trend, mobile viewing growth | **Threats**: Studios launching own platforms, piracy, net neutrality risks |

Netflix's strategic response? They addressed their weakness (content dependency) by investing in original content, turning a weakness into a strength and creating a massive competitive moat.

### How to Conduct a SWOT Analysis

**Step 1: Gather Input Broadly**
Do not do SWOT alone. Include people from different functions -- sales, engineering, finance, customer support. Each sees different strengths and weaknesses.

**Step 2: Be Specific, Not Generic**
Bad: "We have a strong brand." Good: "Our Net Promoter Score of 72 is 2x the industry average, giving us a 30% lower customer acquisition cost."

**Step 3: Prioritize**
Not all items are equal. Rank each quadrant by impact. Focus on the 2-3 most significant items in each category.

**Step 4: Generate Strategic Options**
The real value of SWOT is not the matrix itself but the strategic options it generates:

- **S-O Strategies**: Use strengths to capture opportunities
- **W-O Strategies**: Address weaknesses to unlock opportunities
- **S-T Strategies**: Use strengths to mitigate threats
- **W-T Strategies**: Address weaknesses to avoid threats

### Limitations of SWOT

Harvard Business School professors have noted several limitations:

1. **Static snapshot**: SWOT captures a moment in time. Markets change continuously.
2. **Subjective**: One person's "strength" may be another's "weakness." Without data, SWOT becomes a wish list.
3. **No prioritization built in**: The basic framework does not distinguish between critical and minor factors.
4. **Can be superficial**: Teams often list items without analyzing root causes or implications.

### TOWS Matrix: A Stronger Variant

To address the "so what?" problem, Heinz Weihrich developed the **TOWS Matrix**, which explicitly matches external and internal factors to generate strategic alternatives. This variant is taught in many MBA programs as a more actionable extension of basic SWOT.

### When to Use SWOT

- **Strategic planning sessions** (annual or quarterly)
- **New market entry decisions**
- **Competitive analysis**
- **Product launch evaluations**
- **M&A due diligence**

SWOT works best as a starting point, not an ending point. Use it to frame the conversation, then move to more rigorous frameworks (Porter's Five Forces, Value Chain Analysis) for deeper analysis.

### Key Takeaway

SWOT analysis is a simple but powerful starting framework for strategic thinking. Its value lies not in filling four quadrants but in the strategic options those quadrants generate. Always follow a SWOT with "so what?" -- translating observations into action.

**Sources**: Learned, E. P., Christensen, C. R., Andrews, K. R., & Guth, W. D. (1965). *Business Policy: Text and Cases*. HBS Press. Weihrich, H. (1982). "The TOWS Matrix." *Long Range Planning*. HBS Online, "Business Strategy" course.`,
    },
    {
      id: "bs-strategy-diamond",
      slug: "strategy-diamond",
      title: "The Strategy Diamond (Hambrick & Fredrickson)",
      content: `## The Strategy Diamond

In 2001, Donald Hambrick and James Fredrickson published "Are You Sure You Have a Strategy?" in the *Academy of Management Executive*. Their answer to the pervasive confusion about what constitutes a complete strategy was the **Strategy Diamond** -- a framework with five interconnected facets that together define a coherent strategy.

### The Problem the Diamond Solves

Many companies have a "strategy" that is really just a collection of initiatives, goals, or buzzwords. "Be the market leader in digital transformation" is not a strategy. Hambrick and Fredrickson argued that a complete strategy must address five specific questions, and that **all five facets must be aligned with each other**.

### The Five Facets

\`\`\`
                    ARENAS
                   (Where?)
                      |
           VEHICLES --+-- STAGING
          (How get     |   (Speed &
           there?)     |   sequence?)
                      |
              DIFFERENTIATORS
              (How we win?)
                      |
              ECONOMIC LOGIC
             (How we profit?)
\`\`\`

### Facet 1: Arenas -- Where Will We Be Active?

Arenas define the playing field: which product categories, market segments, geographic areas, core technologies, and value-creation stages the company will compete in.

This is not just "our industry." It requires specificity:
- Which specific market segments?
- Which geographic regions?
- Which parts of the value chain?

**Example**: IKEA's arenas are home furnishings (not fashion), targeting price-conscious consumers (not luxury), in suburban retail locations (not downtown), globally but with standardized offerings.

### Facet 2: Vehicles -- How Will We Get There?

Vehicles are the means for reaching your arenas. Options include:
- **Internal development** (build it yourself)
- **Acquisitions** (buy a company that is already there)
- **Joint ventures & alliances** (partner with someone)
- **Licensing** (use someone else's IP)
- **Franchising** (let others operate under your brand)

The choice of vehicle is a strategic decision, not an afterthought. Cisco's strategy of growth-through-acquisition (buying 200+ companies) is fundamentally different from Apple's strategy of internal development.

### Facet 3: Differentiators -- How Will We Win?

Differentiators are what sets you apart from competitors in the arenas you have chosen. Porter's generic strategies (cost leadership, differentiation, focus) are relevant here, but Hambrick and Fredrickson push for more specificity:
- **Image** (brand, reputation)
- **Customization** (tailored solutions)
- **Price** (lowest cost)
- **Styling/design** (aesthetics)
- **Product reliability** (quality, durability)
- **Speed** (faster delivery, faster innovation)

The critical insight: **you cannot differentiate on everything**. Choosing differentiators means accepting that you will be average or below average in other areas.

### Facet 4: Staging -- What Will Be Our Speed and Sequence?

Staging addresses the timing and sequencing of strategic moves. It answers: What comes first? How fast do we move? What can wait?

**Example**: Amazon's staging was masterful. Books first (low complexity, high SKU count), then media (CDs, DVDs), then electronics, then everything. Each stage built capabilities for the next.

Staging considerations include:
- Which markets to enter first
- How fast to scale
- Which capabilities to build in what order
- Resource constraints and sequencing

### Facet 5: Economic Logic -- How Will We Earn Returns?

Economic logic is the central facet -- it explains how the strategy generates profit. The two fundamental approaches are:
- **Cost advantages**: economies of scale, scope, or learning that allow lower-than-competitor costs
- **Premium prices**: differentiation that allows charging more than competitors

A strategy without a clear economic logic is not a strategy. "We will grow revenue" is not economic logic. "We will achieve 40% gross margins through proprietary technology that reduces manufacturing costs by 60% compared to competitors" is economic logic.

### The Alignment Test

The Strategy Diamond's greatest value is as an **alignment test**. All five facets must fit together coherently. If your arenas require rapid global expansion but your vehicles are limited to internal development, there is a misalignment. If your differentiator is low price but your economic logic depends on premium margins, the strategy is incoherent.

### Applying the Framework

When evaluating any strategy -- your own or a competitor's -- map out all five facets and then ask:
1. Are all five facets specified with enough detail to guide action?
2. Do the five facets fit together and reinforce each other?
3. Is the strategy distinctive, or does it describe what every competitor could also claim?

### Key Takeaway

A strategy is not a goal, a vision, or a list of initiatives. It is a coherent set of choices across five dimensions -- arenas, vehicles, differentiators, staging, and economic logic -- that together describe how an organization will achieve superior returns. If any facet is missing or misaligned, the strategy is incomplete.

**Sources**: Hambrick, D. C. & Fredrickson, J. W. (2001). "Are You Sure You Have a Strategy?" *Academy of Management Executive*, 15(4), 48-59. HBS Online, "Business Strategy" course. Harvard Business Review case studies on strategic alignment.`,
    },
  ],
};
