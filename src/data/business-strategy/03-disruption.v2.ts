import { Module } from "../types";

export const disruptionModule: Module = {
  id: "bs-disruption",
  title: "Disruption & Innovation",
  description: "Explore Clayton Christensen's disruptive innovation theory, the innovator's dilemma, jobs-to-be-done, and platform business models.",
  lessons: [
    {
      id: "bs-disruptive-innovation",
      slug: "disruptive-innovation-theory",
      title: "Disruptive Innovation Theory (Christensen)",
      content: `## Disruptive Innovation Theory

Clayton Christensen, one of Harvard Business School's most influential professors, introduced the theory of **disruptive innovation** in his 1997 book *The Innovator's Dilemma*. This theory fundamentally changed how business leaders, investors, and policymakers think about technological change, competitive dynamics, and industry evolution.

### The Core Theory

Disruptive innovation describes a process by which a product or service starts at the **bottom of a market** -- or creates an **entirely new market** -- and then relentlessly moves upmarket, eventually displacing established competitors.

The key insight is that **disruption is not about better technology**. It is about a different value proposition that initially appeals to a different set of customers.

### How Disruption Works

\`\`\`
Performance
    ^
    |        ___________  Incumbent trajectory
    |       /            (exceeds customer needs)
    |      /
    |     /     ___________  Customer needs
    |    /     /
    |   /     /
    |  /     /    ________  Disruptor trajectory
    | /     /    /          (starts below needs,
    |/     /    /            then catches up)
    +------|------|--------> Time
           T1    T2
\`\`\`

**Phase 1**: Incumbents serve mainstream customers and continuously improve along traditional performance dimensions. They overshoot customer needs -- offering more performance than most customers require.

**Phase 2**: A new entrant introduces a product that is *worse* on traditional metrics but offers other advantages (simpler, cheaper, more convenient, more accessible).

**Phase 3**: The disruptor improves over time, eventually meeting the needs of mainstream customers while retaining its other advantages.

**Phase 4**: Mainstream customers switch. Incumbents, who dismissed the disruptor as irrelevant, find themselves displaced.

### The Two Types of Disruption

**Low-End Disruption**: Targets customers at the bottom of an existing market who are overserved by existing products. These customers do not need all the features incumbents offer and would prefer a simpler, cheaper option.

*Example*: Southwest Airlines disrupted traditional carriers by offering no-frills, point-to-point flights at dramatically lower prices. Business travelers stayed with United and American, but price-sensitive leisure travelers flocked to Southwest.

**New-Market Disruption**: Creates demand where none existed by targeting non-consumers -- people who previously could not access or afford the existing product.

*Example*: The personal computer disrupted mainframes not by being better for existing mainframe users but by making computing accessible to individuals and small businesses who never used mainframes.

### Why Incumbents Fail

Christensen's most provocative finding is that **well-managed companies fail precisely *because* they are well-managed**. Good management practices -- listening to customers, investing in the highest-margin opportunities, focusing on the biggest markets -- systematically lead incumbents to ignore disruptive threats.

The reasons:
1. **Customer dependency**: Existing customers do not want the disruptive product, so incumbents rationally ignore it
2. **Margin pressure**: Disruptive products start in small, low-margin markets that are unattractive to large companies
3. **Resource allocation**: Internal processes direct resources toward sustaining innovations that serve profitable customers
4. **Organizational inertia**: Structures, incentives, and culture are optimized for the existing business

### Classic Examples of Disruption

| Disruptor | Incumbent | Disruption Type |
|-----------|-----------|----------------|
| Netflix streaming | Blockbuster | Low-end (started with less selection) |
| Digital cameras | Kodak film | New-market (casual photographers) |
| Wikipedia | Encyclopaedia Britannica | New-market (free access) |
| Uber/Lyft | Traditional taxis | New-market + low-end |
| Transistor radios | Vacuum tube radios | New-market (teenagers) |

### What is NOT Disruption

Christensen was careful to note that not every innovation is disruptive. **Sustaining innovations** -- even radical ones -- improve products along dimensions existing customers already value. The iPhone was not disruptive to smartphones (it was a sustaining innovation in the smartphone market); it was disruptive to laptops, cameras, and GPS devices.

Tesla is a debated case. Christensen argued Tesla was not disruptive because it entered at the *top* of the market (luxury segment) rather than the bottom. Others disagree. The debate illustrates the precision required in applying the theory.

### Key Takeaway

Disruptive innovation theory explains why leading companies fail despite doing everything "right." The solution is not to abandon good management but to develop organizational structures that can pursue disruptive opportunities alongside the core business.

**Sources**: Christensen, C. M. (1997). *The Innovator's Dilemma*. Harvard Business School Press. Christensen, C. M. (2015). "What Is Disruptive Innovation?" *Harvard Business Review*. HBS Online, "Disruptive Strategy" course.`,
    },
    {
      id: "bs-sustaining-vs-disruptive",
      slug: "sustaining-vs-disruptive",
      title: "Sustaining vs. Disruptive Innovation",
      content: `## Sustaining vs. Disruptive Innovation

One of the most common misapplications of Christensen's theory is calling every new technology "disruptive." At Harvard Business School, students learn to rigorously distinguish between **sustaining innovations** and **disruptive innovations** -- a distinction that has profound implications for strategic response.

### Defining the Two Types

**Sustaining Innovation** improves existing products along dimensions that mainstream customers already value. It helps companies serve their best customers better.

**Disruptive Innovation** initially underperforms existing products on traditional metrics but offers simplicity, convenience, affordability, or accessibility that appeals to overlooked segments or non-consumers.

### The Critical Difference

| Dimension | Sustaining | Disruptive |
|-----------|-----------|------------|
| **Target customer** | Existing, demanding customers | Overserved or non-consumers |
| **Initial performance** | Better than current products | Worse on traditional metrics |
| **Value proposition** | Improved features/performance | Simpler, cheaper, more convenient |
| **Profit margins** | Equal to or higher than existing | Initially lower |
| **Incumbent response** | Embrace and invest | Ignore or dismiss |
| **Strategic risk** | Competitive but manageable | Existential if unchecked |

### Sustaining Innovation Examples

Most innovation is sustaining. Every year, Intel releases faster processors. Apple releases iPhones with better cameras. BMW engineers better engines. These are sustaining innovations -- they make good products better for existing customers.

Even *radical* breakthroughs can be sustaining. When the automobile replaced the horse-drawn carriage, it was a radical technological change but a sustaining innovation in personal transportation -- it served the same customers (travelers) with better performance on the same dimension (speed, comfort, range).

### Why the Distinction Matters Strategically

**If facing a sustaining innovation**: Incumbents usually win. They have the resources, customer relationships, distribution channels, and organizational capabilities to adopt sustaining innovations. Historically, incumbents prevail in sustaining innovation battles about two-thirds of the time (Christensen's research).

**If facing a disruptive innovation**: Incumbents usually lose. Their processes and priorities are optimized for the existing business. They cannot profitably serve the small, low-margin market where disruption begins. By the time the disruption is large enough to notice, it is often too late.

### The Strategic Response Matrix

\`\`\`
                   Is the innovation sustaining
                   or disruptive?

                   SUSTAINING           DISRUPTIVE
                +-----------------+------------------+
  Are you the   |                 |                  |
  INCUMBENT?    | INVEST HEAVILY  | CREATE SEPARATE  |
                | Stay ahead      | UNIT             |
                | Fight on your   | Different cost   |
                | turf            | structure &      |
                |                 | incentives       |
                +-----------------+------------------+
  Are you the   |                 |                  |
  CHALLENGER?   | THINK TWICE     | FULL SPEED       |
                | Incumbents have | Asymmetric       |
                | advantages here | competition      |
                | Consider a      | favors you       |
                | different angle |                  |
                +-----------------+------------------+
\`\`\`

### Case Study: Kodak and Digital Photography

Kodak is often cited as a company that "missed" digital photography. But the full story is more nuanced and illustrates the sustaining/disruptive distinction perfectly.

**Kodak invented digital photography in 1975.** Engineer Steve Sasson built the first digital camera at Kodak. The company invested billions in digital technology over the following decades. They were not ignorant of the technology.

The problem was that digital photography was **disruptive to Kodak's business model**, not just its technology. Kodak's profits came from film, paper, and chemical processing -- a razor-and-blades model. Digital photography eliminated the "blades" (consumables). No amount of technological capability could solve a business model disruption.

Meanwhile, digital photography was a **sustaining innovation** for companies like Canon and Nikon (camera manufacturers whose business model was selling cameras, not consumables). They thrived in the digital transition.

**Lesson**: The same technology can be sustaining for one company and disruptive for another. The key variable is **business model fit**, not technological capability.

### The Disruption Audit

When evaluating a new technology or competitor, ask these questions:

1. Does the innovation improve performance along dimensions current customers value? (Sustaining)
2. Does the innovation start in low-end or new-market segments? (Disruptive)
3. Does it initially underperform on traditional metrics? (Disruptive)
4. Does our current business model work with this innovation? (Critical for response)
5. Would our best customers want this today? (If no, watch out -- this is how disruption begins)

### Key Takeaway

Not all innovation is disruptive, and misidentifying the type leads to poor strategic decisions. Incumbents should invest aggressively in sustaining innovations and create autonomous units to explore disruptive ones. Challengers should seek asymmetric competition where incumbents' strengths become weaknesses.

**Sources**: Christensen, C. M. (1997). *The Innovator's Dilemma*. Harvard Business School Press. Christensen, C. M. & Raynor, M. E. (2003). *The Innovator's Solution*. HBS Press. HBS Online, "Disruptive Strategy" course.`,
    },
    {
      id: "bs-innovators-dilemma",
      slug: "innovators-dilemma",
      title: "The Innovator's Dilemma",
      content: `## The Innovator's Dilemma

Clayton Christensen's *The Innovator's Dilemma* (1997) is consistently ranked among the most important business books of the past fifty years. It was selected by *The Economist* and *Forbes* as one of the most influential business books ever written, and it forms the foundation of HBS's "Disruptive Strategy" course.

### The Central Paradox

The innovator's dilemma is this: **the management practices that enable companies to be successful are the very same practices that cause them to miss disruptive innovations.**

This is not about incompetence. The companies Christensen studied -- Sears, IBM, Xerox, Digital Equipment Corporation -- were extremely well-managed. They listened to their customers, invested in improving their products, studied market trends carefully, and allocated resources to the most profitable opportunities. And yet they failed.

### Why Good Management Leads to Failure

Christensen identified five principles that explain why well-managed companies fail when faced with disruptive change:

**Principle 1: Companies Depend on Customers and Investors for Resources**

Companies cannot invest in markets their customers do not want. Resource allocation processes -- both formal and informal -- channel investments toward projects that current customers demand. When a disruptive technology emerges in a small, low-margin market, it cannot compete for resources against sustaining innovations that serve large, profitable customers.

**Principle 2: Small Markets Do Not Solve the Growth Needs of Large Companies**

A $50 billion company needs to find billions in new revenue each year to maintain growth rates. A disruptive market that is currently worth $10 million -- even if growing at 100% per year -- is simply too small to matter. By the time the market is large enough to be interesting, it is too late.

**Principle 3: Markets That Do Not Exist Cannot Be Analyzed**

Traditional market research, competitive analysis, and financial planning all assume that markets already exist and can be studied. Disruptive innovations create *new* markets. You cannot survey customers about a product category that does not exist yet. Conventional planning tools fail.

**Principle 4: An Organization's Capabilities Define Its Disabilities**

Organizational capabilities are embedded in processes (how things get done) and values (what the organization prioritizes). These capabilities become **disabilities** when the organization faces a disruptive challenge that requires different processes and different priorities.

**Principle 5: Technology Supply May Not Equal Market Demand**

Technologies can progress faster than market demand. When a product overshoots what customers need, it creates an opportunity for a disruptor to offer "good enough" performance with other advantages (simplicity, convenience, lower cost).

### The RPV Framework

Christensen introduced the **Resources, Processes, and Values (RPV)** framework to explain organizational capability and disability:

| Element | Definition | Example |
|---------|-----------|---------|
| **Resources** | What a firm has (people, technology, cash, brand) | Kodak had digital photography patents |
| **Processes** | How a firm does things (workflows, decision-making, coordination) | Kodak's processes optimized for film manufacturing |
| **Values** | What a firm prioritizes (margins, market size, customer needs) | Kodak valued high-margin consumables; digital had low margins |

Resources are flexible -- they can be redirected. Processes and values are much harder to change. This is why simply acquiring new technology (a resource) rarely solves the innovator's dilemma. The processes and values must also change.

### Solutions to the Dilemma

Christensen proposed several approaches:

**1. Create an Autonomous Organization**
Establish a separate unit with its own cost structure, processes, and values. This unit can pursue the disruptive opportunity without being constrained by the parent organization's priorities. IBM did this with the PC division (initially based in Boca Raton, far from headquarters).

**2. Acquire a Small Disruptor**
Buy a company that is already succeeding in the disruptive market. The key is to *not* integrate it into the parent organization, which would impose the same processes and values that prevent disruption.

**3. Spin Off a New Division**
Create a new subsidiary that can develop its own processes and values appropriate for the disruptive market. Dayton Hudson (now Target) did this when it created Target as a separate brand from its department stores.

### The Discovery-Driven Planning Approach

For disruptive opportunities where traditional planning fails, Christensen recommended **discovery-driven planning** (developed by Rita McGrath and Ian MacMillan). Instead of projecting revenue and costs from known data, you:

1. Start with the profit requirement
2. Work backward to the assumptions that must prove true
3. Plan a series of low-cost experiments to test each assumption
4. Commit resources incrementally as assumptions are validated

This approach accepts uncertainty and builds learning into the investment process.

### Key Takeaway

The innovator's dilemma is not a failure of management but a structural challenge inherent in how successful organizations operate. Solving it requires organizational design changes -- separate units, different metrics, different processes -- not just better awareness.

**Sources**: Christensen, C. M. (1997). *The Innovator's Dilemma*. Harvard Business School Press. McGrath, R. G. & MacMillan, I. C. (1995). "Discovery-Driven Planning." *Harvard Business Review*. HBS Online, "Disruptive Strategy" course.`,
    },
    {
      id: "bs-jobs-to-be-done",
      slug: "jobs-to-be-done",
      title: "Jobs-to-be-Done Framework",
      content: `## Jobs-to-be-Done Framework

The **Jobs-to-be-Done (JTBD)** framework, developed by Clayton Christensen and his collaborators at Harvard Business School, offers a fundamentally different way to understand customer behavior and drive innovation. Instead of asking "who is the customer?" JTBD asks "what job is the customer trying to get done?"

### The Milkshake Story

The most famous illustration of JTBD comes from Christensen's consulting work with a fast-food chain trying to improve milkshake sales. Traditional market research segmented customers by demographics (age, income, lifestyle) and asked them what would make milkshakes better (thicker? cheaper? more flavors?). None of the resulting changes moved sales.

Christensen's team took a different approach. They watched who bought milkshakes and *when*. They discovered two completely different "jobs":

**Job 1: Morning Commute Companion**
Nearly half of milkshakes were bought before 8 AM by solo commuters. The "job" was to make a long, boring commute more interesting while filling them up until lunch. Competitors for this job were not other milkshakes -- they were bagels, bananas, doughnuts, and Snickers bars. The milkshake was "hired" because it was thick (lasted the whole commute), could be consumed one-handed, and was filling.

**Job 2: Afternoon Kid Treat**
Later in the day, parents bought milkshakes for children as a reward or treat. Here the "job" was to be a good parent. Competitors were toys, trips to the park, and ice cream. The milkshake was hired because it made the child happy.

**The insight**: The same product was hired for two completely different jobs. Improvements that helped one job (making shakes thicker for commuters) hurt the other (children struggled with thick shakes). Demographic segmentation completely missed this.

### The JTBD Framework

**Core Principle**: People do not buy products -- they "hire" products and services to make progress in specific circumstances.

A "job" has three dimensions:

| Dimension | Description | Example (Morning Milkshake) |
|-----------|-------------|----------------------------|
| **Functional** | The practical task to be accomplished | Satisfy hunger until lunch, consume during commute |
| **Emotional** | How the customer wants to feel | Less bored, in control of morning routine |
| **Social** | How the customer wants to be perceived | Not relevant here (solo consumption) |

### How to Identify Jobs

**Method 1: Observation**
Watch what people actually do, not what they say they want. The milkshake insight came from observation, not surveys.

**Method 2: The "Struggling Moment"**
Look for moments when people are struggling to make progress. What are they trying to accomplish? What obstacles are they facing? What workarounds have they created?

**Method 3: The "Job Story" Format**
Instead of user stories ("As a [persona], I want [feature] so that [benefit]"), use job stories:

> When [situation], I want to [motivation], so I can [expected outcome].

> When I am driving to work on a long morning commute, I want something that keeps me engaged and fills me up, so I can arrive at work alert and not hungry until lunch.

### JTBD and Competitive Analysis

JTBD redefines competition. Your real competitors are not just companies in your industry category -- they are **every solution the customer considers for the same job**.

Netflix's competitors are not just other streaming services. Depending on the job:
- "Help me unwind after a stressful day" -> competitors include wine, social media, video games, a bath
- "Help my family bond on Friday night" -> competitors include board games, dining out, backyard activities
- "Help me learn something new" -> competitors include podcasts, books, YouTube, online courses

This wider competitive lens reveals opportunities that industry-focused analysis misses.

### JTBD and Innovation

The framework drives innovation by focusing development on the job rather than on product features:

**Step 1**: Identify the most important, underserved jobs in your market
**Step 2**: Understand the full context in which the job arises
**Step 3**: Design a solution optimized for that job in that context
**Step 4**: Create a business model that delivers the solution profitably
**Step 5**: Integrate the experience around the job (not around the product category)

### Practical Application: Job Mapping

Break a job into eight process steps and identify opportunities at each:

1. **Define** the job
2. **Locate** the inputs needed
3. **Prepare** for the job
4. **Confirm** readiness
5. **Execute** the core job
6. **Monitor** progress
7. **Modify** as needed
8. **Conclude** the job

At each step, ask: what could go wrong? What takes too long? What is frustrating? These pain points are innovation opportunities.

### Key Takeaway

The Jobs-to-be-Done framework shifts the unit of analysis from the customer to the *circumstance*. It reveals why customers make the choices they do and provides a precise target for innovation. Companies that understand the job their product is hired for can innovate with purpose rather than guessing.

**Sources**: Christensen, C. M., Hall, T., Dillon, K., & Duncan, D. S. (2016). "Know Your Customers' Jobs to Be Done." *Harvard Business Review*. Christensen, C. M. (2016). *Competing Against Luck*. HBS Press. HBS Online, "Disruptive Strategy" course.`,
    },
    {
      id: "bs-platform-models",
      slug: "platform-business-models",
      title: "Platform Business Models",
      content: `## Platform Business Models

Platform businesses are among the most valuable companies in the world. Seven of the ten most valuable public companies by market capitalization -- Apple, Microsoft, Alphabet (Google), Amazon, Meta, Nvidia, and Tesla -- are platform companies. Harvard Business School has dedicated significant research to understanding why platforms win and how they differ from traditional "pipeline" businesses.

### Pipeline vs. Platform

**Pipeline (Linear) Businesses** create value by controlling a linear series of activities -- the classic value chain. Raw materials go in one end, products come out the other. Examples: Toyota, Procter & Gamble, Walmart (traditional retail).

**Platform Businesses** create value by facilitating exchanges between two or more interdependent groups, usually consumers and producers. The platform does not own the means of production -- it owns the means of *connection*. Examples: Uber, Airbnb, Amazon Marketplace, YouTube.

| Dimension | Pipeline | Platform |
|-----------|----------|----------|
| **Value creation** | Internal production | External interactions |
| **Key asset** | Physical/IP assets | Network of users |
| **Scaling** | Linear (more output = more cost) | Non-linear (more users = more value) |
| **Growth driver** | Supply-side economies | Demand-side economies (network effects) |
| **Competitive moat** | Scale, brand, patents | Network effects, data, switching costs |

### Network Effects: The Platform Engine

The defining characteristic of platform businesses is **network effects** -- the phenomenon where each additional user makes the platform more valuable for all other users.

**Direct (Same-Side) Network Effects**: More users of the same type increase value for each other. Examples: telephone networks, social networks (more friends on Facebook = more valuable for each user).

**Indirect (Cross-Side) Network Effects**: More users of one type increase value for users of another type. Examples: more riders on Uber attract more drivers, which reduces wait times, which attracts more riders.

**Data Network Effects**: More users generate more data, which improves the product (via algorithms), which attracts more users. Examples: Google Search, Waze, Netflix recommendations.

### Platform Design Principles

Harvard Business School professor Andrei Hagiu and his colleagues have identified key principles for platform design:

**1. Solve the Chicken-and-Egg Problem**
Every platform faces a bootstrapping challenge: buyers will not come without sellers, and sellers will not come without buyers. Strategies include:
- **Subsidize one side**: Offer free access to one group to attract the other (ladies' night at bars; free for riders, charge drivers)
- **Seed with content**: Create initial supply yourself (Reddit founders seeded early content)
- **Marquee users**: Attract high-profile users who draw others (Clubhouse launched with celebrity conversations)
- **Single-player mode**: Provide value even without the other side (OpenTable was useful to restaurants for reservations before diners joined)

**2. Design for Trust**
Platforms must overcome the trust deficit inherent in transactions between strangers. Mechanisms include:
- Reviews and ratings (Airbnb, Uber)
- Verification and background checks (Airbnb host verification)
- Escrow and payment protection (eBay buyer protection)
- Insurance (Airbnb host guarantee)

**3. Minimize Transaction Costs**
Reduce the friction of finding, negotiating, and completing transactions. The platform that makes transactions easiest wins.

**4. Curate Quality**
Open access drives growth but can destroy value (spam, scams, low quality). Successful platforms balance openness with curation.

### Platform Competition

Platforms compete differently from pipeline businesses:

**Winner-Take-All Dynamics**: Network effects can create winner-take-all or winner-take-most markets. Once a platform achieves critical mass, it becomes increasingly difficult for competitors to dislodge it. This explains market concentration in search (Google), social networking (Meta), and ride-sharing (Uber in US, Didi in China).

**Multi-Homing**: The tendency of users to use multiple platforms simultaneously. When multi-homing costs are low (using both Uber and Lyft), winner-take-all dynamics are weakened. When multi-homing costs are high (switching social networks), they are strengthened.

**Envelopment**: A platform in one market uses its user base and data to enter an adjacent market. Google used Android to enter mobile commerce. Amazon used e-commerce to enter cloud computing (AWS). Apple used hardware to enter services (App Store, Apple Music, Apple TV+).

### The Platform Canvas

When designing or analyzing a platform business, map these elements:

| Element | Question |
|---------|----------|
| **Core interaction** | What exchange does the platform facilitate? |
| **Participants** | Who are the producers and consumers? |
| **Value unit** | What is being exchanged? (goods, services, content, information) |
| **Filter** | How does the platform match producers with consumers? |
| **Monetization** | How does the platform capture value? (transaction fees, subscriptions, advertising) |

### Key Takeaway

Platform business models have fundamentally changed competitive dynamics. They scale through network effects rather than asset accumulation, compete through ecosystems rather than products, and create value through connections rather than production. Understanding platform dynamics is essential for strategy in the digital economy.

**Sources**: Parker, G., Van Alstyne, M., & Choudary, S. P. (2016). *Platform Revolution*. W. W. Norton. Hagiu, A. & Wright, J. (2015). "Multi-Sided Platforms." *International Journal of Industrial Organization*. HBS Online, "Disruptive Strategy" and "Business Strategy" courses. Cusumano, M. A., Gawer, A., & Yoffie, D. B. (2019). *The Business of Platforms*. HBS Press.`,
    },
  ],
};
