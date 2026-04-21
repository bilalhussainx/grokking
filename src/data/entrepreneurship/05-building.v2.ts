import { Module } from "../types";

export const buildingModule: Module = {
  id: "ent-building",
  title: "Building the Company",
  description: "Learn founding team dynamics, product development, go-to-market strategy, startup sales, and early culture building.",
  lessons: [
    {
      id: "ent-founding-team",
      slug: "building-the-founding-team",
      title: "Building the Founding Team",
      content: `## Building the Founding Team

HBS professor Noam Wasserman's research in *The Founder's Dilemmas* (2012) analyzed 10,000+ founders and found that **65% of high-potential startups fail due to conflict within the founding team**. Team-related issues -- not product, market, or funding problems -- are the #1 cause of early-stage startup failure.

### Co-Founder Selection

The co-founder relationship is often compared to a marriage, and the analogy is apt: you will spend more waking hours with your co-founder than with your spouse, navigate high-stress situations together, and make decisions that affect each other's financial futures.

**What to look for in a co-founder:**
- **Complementary skills**: If you are technical, find someone with business expertise (and vice versa)
- **Shared values**: Alignment on work ethic, risk tolerance, and vision for the company
- **Trust**: You must trust this person with your career, money, and reputation
- **Conflict resolution ability**: Disagreements are inevitable; the ability to resolve them constructively is essential
- **Resilience**: Startups are emotionally brutal. You need someone who does not crumble under pressure

### The Conversations You Must Have

Before committing, discuss:
1. **Equity split**: How will you divide ownership? (Address this early -- it only gets harder)
2. **Roles and responsibilities**: Who does what? Who is CEO?
3. **Decision-making**: How do you resolve disagreements? Who has final say on what?
4. **Commitment level**: Full-time or part-time? How long before re-evaluating?
5. **Exit scenarios**: What happens if one founder wants to leave?
6. **Vesting**: All founder shares should vest over 4 years with a 1-year cliff

### Building the Early Team

The first 10 hires define the company's culture, capability, and trajectory.

**Hire for versatility**: Early employees must wear multiple hats. Specialists come later.

**Hire for culture**: Skills can be taught; values and work ethic cannot. The first employees become the cultural DNA.

**Hire slowly, fire quickly**: A bad early hire is catastrophic in a 5-person company. Take time to get it right, and address mistakes promptly.

**Equity compensation**: Early employees take significant risk. Compensate them with meaningful equity (typically 0.5-2% for first employees, depending on stage and role).

### Key Takeaway

The founding team is the most important factor in a startup's success or failure. Invest as much time selecting and aligning your co-founders and early team as you do building your product. The best product in the world cannot overcome a dysfunctional founding team.

**Sources**: Wasserman, N. (2012). *The Founder's Dilemmas*. Princeton University Press. HBS Online, "Entrepreneurship Essentials" and "Launching Tech Ventures" courses.`,
    },
    {
      id: "ent-product-dev",
      slug: "product-development-process",
      title: "Product Development Process",
      content: `## Product Development Process

Building a product that customers love requires a systematic process that balances speed with quality. HBS and leading product organizations have converged on an approach that combines **design thinking, agile development, and continuous discovery**.

### The Double Diamond

The Design Council's Double Diamond framework, taught in HBS innovation courses, describes the product development process as two phases of divergent and convergent thinking:

**Diamond 1: Discover and Define (the right problem)**
- Diverge: Research broadly -- customer interviews, observation, data analysis
- Converge: Define the specific problem to solve

**Diamond 2: Develop and Deliver (the right solution)**
- Diverge: Generate many possible solutions -- brainstorming, prototyping
- Converge: Build, test, and launch the best solution

### Agile Development for Startups

Agile principles (from the Agile Manifesto) are well-suited to startup product development:

1. **Working software over comprehensive documentation**: Ship something customers can use
2. **Customer collaboration over contract negotiation**: Build with customers, not for them
3. **Responding to change over following a plan**: Be ready to pivot
4. **Individuals and interactions over processes and tools**: Small teams, fast communication

### The Sprint Cycle

Most startups use 1-2 week sprints:
1. **Plan**: What are the highest-priority items? What will we build this sprint?
2. **Build**: Develop features, write code, create designs
3. **Test**: Quality assurance, user testing, bug fixing
4. **Release**: Ship to users (ideally continuously)
5. **Learn**: Measure results, gather feedback, plan next sprint

### Continuous Discovery (Teresa Torres)

Teresa Torres' *Continuous Discovery Habits* advocates for weekly touchpoints with customers throughout the product development process -- not just at the beginning and end. This ensures you are always building what customers actually need.

### Key Takeaway

Product development is not a linear process from idea to launch. It is an iterative cycle of discovery, building, measuring, and learning. The startups that build the best products are those that maintain the tightest feedback loops with their customers.

**Sources**: Torres, T. (2021). *Continuous Discovery Habits*. Product Talk. Ries, E. (2011). *The Lean Startup*. HBS Online, "Launching Tech Ventures" course.`,
    },
    {
      id: "ent-go-to-market",
      slug: "go-to-market-strategy",
      title: "Go-to-Market Strategy",
      content: `## Go-to-Market Strategy

A go-to-market (GTM) strategy defines how a company will reach its target customers and achieve competitive advantage. HBS teaches that **even the best products fail without an effective GTM strategy** -- the graveyard of startups is full of superior products that nobody knew about.

### GTM Strategy Components

**1. Target Market Definition**: Who is your ideal customer? Be specific. "Small businesses" is too broad. "E-commerce companies with 10-50 employees doing \\$1M-\\$10M in annual revenue" is actionable.

**2. Value Proposition**: Why should this specific customer choose you? What is the measurable benefit?

**3. Channel Strategy**: How will you reach customers?
- **Direct sales**: Sales team contacts customers directly (enterprise)
- **Inside sales**: Phone/video sales for mid-market
- **Self-service**: Product-led growth, customer signs up online (SMB/consumer)
- **Channel partners**: Resellers, distributors, integrators
- **Marketplace**: Sell through platforms (App Store, AWS Marketplace)

**4. Pricing and Packaging**: How is the product priced and packaged for the target segment?

**5. Marketing Strategy**: How will you generate awareness and demand?
- Content marketing, SEO
- Paid advertising (Google, social media)
- Events and conferences
- PR and media
- Partnerships and co-marketing
- Community building

### The Beachhead Strategy

Geoffrey Moore's *Crossing the Chasm* (frequently assigned at HBS) argues that startups should focus on a **single beachhead market** -- one specific segment where they can dominate -- before expanding.

The bowling pin strategy: Win one niche. Use that success to knock down adjacent niches. Each win creates references, case studies, and word-of-mouth that make the next market easier.

### Product-Led Growth (PLG)

The modern GTM innovation: let the product itself drive customer acquisition, expansion, and retention. Users discover, try, and buy the product without talking to a salesperson.

PLG companies: Slack, Dropbox, Zoom, Figma, Notion.

PLG requires: low friction onboarding, immediate value delivery, viral/sharing mechanics, transparent pricing.

### Key Takeaway

Go-to-market strategy is as important as product strategy. The right GTM approach depends on your customer, your product, and your market. Start focused (beachhead), prove the playbook, then expand.

**Sources**: Moore, G. (2014). *Crossing the Chasm*. HarperBusiness. Weinberg, G. & Mares, J. (2015). *Traction*. Portfolio/Penguin. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-startup-sales",
      slug: "sales-marketing-startups",
      title: "Sales & Marketing for Startups",
      content: `## Sales & Marketing for Startups

Mark Roberge, HBS senior lecturer and former CRO of HubSpot, transformed startup sales from an art into a science. His book *The Sales Acceleration Formula* demonstrates how data-driven approaches to hiring, training, and managing salespeople can create predictable, scalable revenue growth.

### The Startup Sales Stages

**Stage 1: Founder-Led Sales (0-10 customers)**
Founders must sell the product themselves initially. This is non-negotiable because:
- You learn directly what customers want
- You discover objections and refine the pitch
- You build credibility with early customers
- You develop the sales playbook that future salespeople will follow

**Stage 2: Build the Playbook (10-50 customers)**
Document what works: the ideal customer profile, the pitch, common objections and responses, the sales process, typical deal size and cycle.

**Stage 3: Hire Salespeople (50+ customers)**
Hire salespeople who can execute the playbook. Roberge's key insight: hire for coachability, curiosity, prior success, intelligence, and work ethic -- in that order.

**Stage 4: Scale the Machine**
Optimize the sales process with data: conversion rates at each stage, average deal size, sales cycle length, CAC by channel.

### The Startup Marketing Funnel

\`\`\`
Awareness: How do prospects discover you?
    |
Interest: How do they learn more?
    |
Consideration: How do they evaluate you?
    |
Decision: How do they buy?
    |
Retention: How do they stay and expand?
    |
Referral: How do they tell others?
\`\`\`

### Marketing Channels for Startups

| Channel | Cost | Speed | Scalability |
|---------|------|-------|-------------|
| Content/SEO | Low | Slow (months) | High |
| Paid ads (Google/social) | Medium-High | Fast | High |
| Email marketing | Low | Medium | Medium |
| Social media | Low | Medium | Medium |
| PR/media | Variable | Fast | Low |
| Events/conferences | High | Medium | Low |
| Partnerships | Low | Medium | Medium |
| Referral programs | Low | Medium | High |

### Key Takeaway

Startup sales and marketing is about finding repeatable, scalable processes for acquiring customers. Start with founder-led sales to learn, document what works into a playbook, and then hire people to scale it. Data-driven iteration beats intuition.

**Sources**: Roberge, M. (2015). *The Sales Acceleration Formula*. Wiley. Weinberg, G. & Mares, J. (2015). *Traction*. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-early-culture",
      slug: "building-company-culture-early",
      title: "Building Company Culture Early",
      content: `## Building Company Culture Early

HBS professor Frances Frei argues that **culture is the most powerful and enduring competitive advantage a startup can build**, yet most founders treat it as an afterthought. The first 20 hires establish the cultural DNA that persists for years -- for better or worse.

### Why Culture Matters for Startups

In large companies, processes and systems guide behavior. In startups, **culture is the operating system**. When there are no formal policies, people rely on cultural norms to make decisions:
- Should I stay late to fix this bug? (Work ethic norms)
- Should I tell the founder about this problem? (Transparency norms)
- Should I help a colleague even though it is not my job? (Collaboration norms)

### How Culture Forms

Startup culture forms through three mechanisms:

**1. Founder behavior**: What founders do -- not what they say -- becomes the cultural norm. If founders work weekends, working weekends becomes normal. If founders admit mistakes publicly, honesty becomes the norm.

**2. Who gets hired**: Each new hire either reinforces or dilutes the culture. "Culture fit" is not about hiring people who look like you -- it is about hiring people who share core values.

**3. Who gets rewarded and who gets fired**: Nothing communicates culture more powerfully than who gets promoted, who gets recognized, and who gets let go. If a toxic high performer is tolerated, the message is clear: results matter more than behavior.

### Defining Your Startup Culture

**Step 1: Identify 3-5 core values** that genuinely matter to the founding team. Not aspirational values -- actual values that describe how you already operate at your best.

**Step 2: Define behaviors** for each value. "We value transparency" is vague. "We share all company financials with every employee monthly" is specific.

**Step 3: Hire for values**. Include cultural values in the interview process. Ask behavioral questions that reveal whether candidates share your values.

**Step 4: Reinforce constantly**. Recognize people who exemplify values. Address behavior that contradicts values. Tell stories about cultural moments.

### Culture as a Competitive Advantage

Companies with strong, distinctive cultures:
- Attract better talent (people want to work somewhere meaningful)
- Retain talent longer (culture creates belonging)
- Make faster decisions (shared values provide a decision framework)
- Innovate more (psychological safety enables risk-taking)
- Recover from setbacks faster (shared identity provides resilience)

### Key Takeaway

Startup culture is not ping pong tables and beer fridges. It is the set of values, behaviors, and norms that determine how people work together. It forms whether you design it or not. The best founders are intentional about culture from day one.

**Sources**: Frei, F. & Morriss, A. (2020). *Unleashed*. HBS Press. Horowitz, B. (2019). *What You Do Is Who You Are*. HarperBusiness. HBS Online, "Entrepreneurship Essentials" course.`,
    },
  ],
};
