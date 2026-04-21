import { Module } from "../types";

export const businessModelModule: Module = {
  id: "ent-model",
  title: "Business Models",
  description: "Master the Business Model Canvas, revenue models, unit economics, pricing strategy, and competitive analysis.",
  lessons: [
    {
      id: "ent-bmc",
      slug: "business-model-canvas",
      title: "Business Model Canvas (Osterwalder)",
      content: `## Business Model Canvas (Osterwalder)

Alexander Osterwalder's **Business Model Canvas** (BMC), introduced in *Business Model Generation* (2010) and widely taught at HBS, provides a single-page framework for describing, designing, and analyzing a business model. It forces entrepreneurs to think holistically about how all pieces of a business fit together.

### The Nine Building Blocks

**1. Customer Segments**: Who are you creating value for? Which customers matter most? Are you serving a mass market, niche, multi-sided platform, or segmented market?

**2. Value Propositions**: What value do you deliver? What problem do you solve? This is the reason customers choose you over alternatives. Possible value: newness, performance, customization, design, brand, price, cost reduction, risk reduction, accessibility, convenience.

**3. Channels**: How do you reach customers? How do they discover, evaluate, purchase, receive, and get support for your product? Direct (own stores, website) vs. indirect (retailers, partners).

**4. Customer Relationships**: What type of relationship does each segment expect? Self-service, automated service, personal assistance, communities, co-creation.

**5. Revenue Streams**: How do you make money? Asset sales, subscription, licensing, advertising, brokerage, usage fees.

**6. Key Resources**: What assets are essential? Physical (factories, stores), intellectual (patents, data), human (talent, expertise), financial (cash, credit).

**7. Key Activities**: What critical things must you do? Production, problem-solving, platform management, supply chain, marketing.

**8. Key Partnerships**: Who are essential partners and suppliers? Strategic alliances, joint ventures, buyer-supplier relationships, coopetition.

**9. Cost Structure**: What are your biggest costs? Fixed vs. variable. What resources and activities are most expensive? Are you cost-driven or value-driven?

### How to Use the Canvas

The BMC is most powerful as a **living document** that evolves with learning:

1. Fill in your best hypotheses for each block
2. Identify the riskiest assumptions
3. Design experiments (customer interviews, MVPs) to test those assumptions
4. Update the canvas based on what you learn
5. Repeat until you have a validated business model

### Canvas vs. Business Plan

| Business Plan | Business Model Canvas |
|---------------|----------------------|
| 30-50 pages | 1 page |
| Takes weeks to write | Takes 30 minutes to draft |
| Static document | Living, evolving tool |
| Detailed financial projections | Hypotheses to be tested |
| Written for investors | Written for the founding team |

HBS professor Tom Eisenmann argues that traditional business plans are largely "fiction" for startups because they are based on untested assumptions. The BMC acknowledges uncertainty and embraces iterative learning.

### Pattern: Multi-Sided Platform Canvas

Platform businesses (Uber, Airbnb, Amazon Marketplace) have distinct canvas elements for each side of the platform. Airbnb's canvas has different customer segments (hosts vs. guests), different value propositions for each, different channels, and different relationship types. The canvas must be filled in separately for each side.

### Key Takeaway

The Business Model Canvas provides a shared language for describing, analyzing, and redesigning business models. Its power lies in making the business model visible, tangible, and testable -- not in any single block but in the relationships between all nine.

**Sources**: Osterwalder, A. & Pigneur, Y. (2010). *Business Model Generation*. Wiley. Eisenmann, T. (2021). *Why Startups Fail*. Currency. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-revenue-models",
      slug: "revenue-models",
      title: "Revenue Models",
      content: `## Revenue Models

Choosing the right revenue model is one of the most consequential decisions a startup makes. HBS professor Shikhar Ghosh found that **75% of venture-backed startups fail**, and a common factor is choosing a revenue model that does not match customer behavior or market structure.

### Major Revenue Models

**1. Subscription (SaaS)**: Customers pay a recurring fee for access to a product or service. Examples: Netflix, Salesforce, Spotify. Advantages: predictable revenue, high LTV, strong retention metrics. Challenge: must continuously deliver value to prevent churn.

**2. Freemium**: Basic version is free; premium features require payment. Examples: Dropbox, Slack, LinkedIn. Advantages: low barrier to adoption, viral growth potential. Challenge: conversion rates are typically 2-5%; must find the right free/paid balance.

**3. Marketplace/Transaction Fee**: Platform takes a percentage of each transaction. Examples: Airbnb (3-15%), Uber (25-30%), Etsy (6.5%). Advantage: scales with volume. Challenge: chicken-and-egg problem, disintermediation risk.

**4. Advertising**: Free product; revenue from advertisers. Examples: Google, Meta, YouTube. Advantage: zero cost to users enables massive scale. Challenge: requires enormous scale, user experience tensions.

**5. E-Commerce/Direct Sales**: Sell products directly to consumers. Examples: Warby Parker, Dollar Shave Club. Advantage: direct customer relationship. Challenge: inventory management, logistics, CAC.

**6. Licensing**: Charge for the right to use intellectual property. Examples: Qualcomm, ARM, Oracle. Advantage: high margins. Challenge: enforcement.

**7. Usage-Based (Pay-Per-Use)**: Charge based on consumption. Examples: AWS, Twilio, Snowflake. Advantage: low barrier to entry. Challenge: revenue unpredictability.

### Choosing Your Revenue Model

Consider:
- **Customer willingness to pay**: What payment model feels natural to them?
- **Competitive norms**: What do competitors charge? Can you differentiate on model?
- **Unit economics**: Does the model support sustainable margins?
- **Cash flow**: Subscription provides predictable cash; transaction fees are variable
- **Growth dynamics**: Freemium enables viral growth; direct sales are linear

### Revenue Model Innovation

Sometimes the biggest competitive advantage is not a better product but a better revenue model. Dollar Shave Club did not make better razors -- they changed the business model from retail to subscription. Salesforce did not invent CRM -- they moved it from on-premise to cloud subscription.

### Key Takeaway

The revenue model is not an afterthought -- it is a core strategic decision that affects product design, customer acquisition, unit economics, and growth trajectory. Test your revenue model as rigorously as you test your product.

**Sources**: HBS Online, "Entrepreneurship Essentials" course. Osterwalder, A. (2010). *Business Model Generation*. Ghosh, S. (2011). "Why Companies Fail." *Harvard Business Review*.`,
    },
    {
      id: "ent-unit-economics",
      slug: "unit-economics",
      title: "Unit Economics (CAC, LTV & Churn)",
      content: `## Unit Economics (CAC, LTV & Churn)

Unit economics answer the fundamental question: **does this business make money on a per-customer basis?** HBS teaches that startups can survive negative unit economics temporarily while achieving scale, but a business that never achieves positive unit economics is not a business -- it is a charity.

### The Core Metrics

**Customer Acquisition Cost (CAC)**: The total cost of acquiring one new customer.

CAC = Total Sales & Marketing Spend / Number of New Customers Acquired

Example: If you spend \\$100,000 on marketing and acquire 500 customers, CAC = \\$200.

**Customer Lifetime Value (LTV)**: The total revenue a customer generates over their entire relationship with your business.

For subscription businesses: LTV = ARPU x Gross Margin / Monthly Churn Rate

Example: \\$50/month ARPU x 80% gross margin / 5% monthly churn = \\$800 LTV.

**Churn Rate**: The percentage of customers who stop using your product in a given period.

Monthly Churn = Customers Lost in Month / Customers at Start of Month

A 5% monthly churn means you lose half your customers every year. A 2% monthly churn means an average customer lifetime of ~50 months.

### The Golden Ratio: LTV > 3x CAC

Venture capitalist David Skok popularized the rule that **LTV should be at least 3x CAC** for a healthy business:

| Ratio | Interpretation |
|-------|---------------|
| LTV/CAC < 1 | Losing money on every customer. Unsustainable. |
| LTV/CAC = 1-3 | Barely breaking even. Risky. |
| LTV/CAC = 3-5 | Healthy. The sweet spot. |
| LTV/CAC > 5 | Very healthy OR under-investing in growth. |

**CAC payback period** should be under 12-18 months.

### Improving Unit Economics

**To reduce CAC**: Improve conversion rates, build referral and word-of-mouth channels, invest in content/SEO, improve sales efficiency.

**To increase LTV**: Reduce churn, increase pricing (if value supports it), upsell and cross-sell, improve product engagement.

**To reduce churn**: Improve onboarding (first 30 days are critical), build habit-forming features, proactive customer success, identify churn predictors early.

### Cohort Analysis

Do not look at aggregate metrics -- they hide important trends. Analyze metrics by **cohort** (the month or quarter a customer signed up):

- Is churn improving for newer cohorts?
- Is LTV increasing over time?
- Are certain acquisition channels producing higher-quality customers?

### Key Takeaway

Unit economics are the financial heartbeat of a startup. If LTV exceeds CAC by a healthy margin, you have a scalable business. If not, growth only accelerates losses. Monitor these metrics obsessively and work continuously to improve them.

**Sources**: Skok, D. "SaaS Metrics 2.0." forEntrepreneurs.com. HBS Online, "Entrepreneurship Essentials" course. Thiel, P. (2014). *Zero to One*. Crown Business.`,
    },
    {
      id: "ent-pricing",
      slug: "pricing-strategy",
      title: "Pricing Strategy",
      content: `## Pricing Strategy

Pricing is one of the most powerful levers in business, yet most entrepreneurs spend less time on pricing than on any other strategic decision. HBS professor Rafi Mohammed argues that **a 1% improvement in pricing typically improves profitability by 8-11%** -- more than equivalent improvements in cost, volume, or fixed expenses.

### Pricing Approaches

**1. Cost-Plus Pricing**: Calculate costs, add desired margin. Simple but ignores customer willingness to pay.

**2. Value-Based Pricing**: Price based on perceived value to the customer, not your costs. Higher margins when you can demonstrate clear value. Requires deep understanding of customer value perception.

**3. Competitive Pricing**: Set prices relative to competitors. Low risk but limits differentiation.

**4. Penetration Pricing**: Low initial price to gain market share, then raise later. Effective for network-effect businesses.

**5. Skimming Pricing**: Start high targeting early adopters, then lower over time. Common in technology.

### Pricing Psychology

**Anchoring**: Present a high-priced option first to make other options seem reasonable.

**Charm Pricing**: \\$9.99 feels significantly cheaper than \\$10.00.

**Decoy Effect**: Offer three options where one is clearly dominated, making the target option look better.

**Price Framing**: "\\$1/day" feels cheaper than "\\$365/year."

**Tiered Pricing**: Three tiers (Basic, Pro, Enterprise) with the middle tier as the target. Most customers choose the middle option (the "Goldilocks effect").

### The Pricing Experimentation Approach

1. Start with a hypothesis based on customer research and competitive analysis
2. Test willingness to pay through conversations, surveys, or A/B tests
3. Launch with your best guess and measure response
4. Iterate based on data (conversion rates, churn, customer feedback)
5. Remember: you can always lower prices, but raising prices is harder

### Pricing for Startups: Common Mistakes

1. **Pricing too low**: Undervaluing your product signals low quality and leaves money on the table
2. **One-size-fits-all pricing**: Different customer segments have different willingness to pay
3. **Not testing**: Treating price as fixed rather than a variable to be optimized
4. **Competing on price**: Unless you have structural cost advantages, price competition is a race to the bottom

### Key Takeaway

Pricing is strategy, not arithmetic. The right price communicates value, drives customer behavior, and captures profit. Invest as much time in pricing strategy as in product development.

**Sources**: Mohammed, R. (2010). *The 1% Windfall*. HarperBusiness. Nagle, T. & Muller, G. (2018). *The Strategy and Tactics of Pricing*. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-competitive-analysis",
      slug: "competitive-analysis-startups",
      title: "Competitive Analysis",
      content: `## Competitive Analysis

Every investor, customer, and partner will ask: "Who are your competitors, and why are you different?" HBS teaches entrepreneurs to conduct competitive analysis not to copy competitors but to **identify white space, differentiate effectively, and anticipate competitive responses.**

### Types of Competition

**Direct Competitors**: Same product, same customers. Uber vs. Lyft.

**Indirect Competitors**: Same problem, different solution. Uber vs. public transit.

**Potential Competitors**: Could easily enter your space. Google entering any adjacent market.

**Status Quo (Inertia)**: Often the biggest competitor -- customers doing nothing or using spreadsheets.

### Competitive Analysis Framework

For each competitor, analyze:

| Dimension | Questions |
|-----------|-----------|
| **Product** | What do they offer? Strengths/weaknesses? |
| **Positioning** | How do they position themselves? What segment? |
| **Pricing** | What do they charge? What model? |
| **Channels** | How do they reach customers? |
| **Traction** | Revenue, users, growth, funding? |
| **Team** | Founders? Expertise? |
| **Vulnerabilities** | Where are they weak? Customer complaints? |

### Sustainable Competitive Advantage (Moats)

Warren Buffett's concept of a "moat" -- sustainable competitive advantage:

- **Network Effects**: More users make the product more valuable (Facebook, Uber)
- **Switching Costs**: Customers face costs to switch (Salesforce, enterprise software)
- **Economies of Scale**: Cost advantages from size (Amazon, Walmart)
- **Brand**: Trust and recognition (Apple, Nike)
- **IP**: Patents, trade secrets, proprietary technology
- **Data Moat**: Proprietary data that improves with scale (Google, Waze)

### Peter Thiel's "Competition is for Losers"

In *Zero to One*, Peter Thiel argues that the best businesses avoid competition entirely by creating something so unique that they are in a category of one. Instead of competing within an existing market, create a new market where you are the monopoly.

Thiel's framework:
- Start with a small market you can dominate
- Expand from that niche into adjacent markets
- Build technological or network-effect advantages that prevent competition

### What to Tell Investors About Competition

Never say "we have no competition." This signals either naivety or a nonexistent market. Instead:

1. Acknowledge direct and indirect competitors honestly
2. Explain how you are differentiated (and why it matters to customers)
3. Describe your unfair advantage (technology, team, data, network effects)
4. Show why you will win (timing, execution, market position)

### Key Takeaway

Competitive analysis is not about obsessing over competitors -- it is about understanding the landscape well enough to position your startup uniquely. The best competitive strategy is not being better at what competitors do but being different in a way that matters.

**Sources**: Porter, M. E. (1980). *Competitive Strategy*. Thiel, P. (2014). *Zero to One*. HBS Online, "Entrepreneurship Essentials" course.`,
    },
  ],
};
