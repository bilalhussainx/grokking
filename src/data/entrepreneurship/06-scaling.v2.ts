import { Module } from "../types";

export const scalingModule: Module = {
  id: "ent-scaling",
  title: "Scaling Up",
  description: "Learn when to scale, scaling operations, hiring at scale, managing hypergrowth, and blitzscaling.",
  lessons: [
    {
      id: "ent-when-to-scale",
      slug: "when-to-scale",
      title: "When to Scale (Product-Market Fit Signals)",
      content: `## When to Scale

Premature scaling is the #1 cause of startup death. The Startup Genome Project analyzed 3,200+ startups and found that **74% of high-growth startups fail due to premature scaling** -- growing headcount, spending, and complexity before achieving product-market fit.

### What is Product-Market Fit?

Marc Andreessen coined the term: "Product-market fit means being in a good market with a product that can satisfy that market." When you have it, you know -- customers are pulling the product out of your hands.

Sean Ellis' test: **Survey customers and ask "How would you feel if you could no longer use this product?" If 40%+ say "very disappointed," you have product-market fit.**

### Signals of Product-Market Fit

| Signal | Metric | Threshold |
|--------|--------|-----------|
| Retention | Month 3 retention rate | >40% (consumer), >80% (B2B SaaS) |
| Organic growth | % of new users from referral/organic | >50% |
| Sean Ellis test | "Very disappointed" responses | >40% |
| Revenue growth | Month-over-month growth | >15% for 3+ months |
| Usage depth | DAU/MAU ratio | >30% (consumer) |
| NPS | Net Promoter Score | >50 |
| Inbound demand | Customers finding you without marketing | Significant and growing |

### Premature Scaling Signals

- Hiring salespeople before the founders can sell the product
- Spending heavily on marketing before retention is strong
- Building features nobody asked for
- Expanding to new markets before dominating the first
- Raising a large round before proving the business model

### The Right Time to Scale

Scale when:
1. Product-market fit is validated (multiple signals confirmed)
2. Unit economics are positive or have a clear path to positive
3. The sales/marketing playbook is repeatable
4. The team can handle increased complexity
5. Capital is available (or the business generates enough cash)

### Key Takeaway

The most dangerous thing a startup can do is scale before it is ready. Product-market fit is not a binary state -- it develops gradually. Watch the signals, be honest about where you are, and do not let investor pressure or competitive anxiety push you to scale prematurely.

**Sources**: Andreessen, M. (2007). "Product/Market Fit." Pmarchive.com. Ellis, S. & Brown, M. (2017). *Hacking Growth*. Crown Business. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-scaling-ops",
      slug: "scaling-operations",
      title: "Scaling Operations",
      content: `## Scaling Operations

Scaling operations means building systems that allow the company to grow without proportionally increasing costs or degrading quality. HBS cases on Amazon, Uber, and Airbnb illustrate how operational excellence at scale is a decisive competitive advantage.

### The Scaling Checklist

**1. Standardize Processes**: Document how core activities are performed. Create playbooks for sales, customer success, engineering, and operations. What works at 10 people must be codified before you can teach it to 100.

**2. Automate Repetitive Tasks**: Identify tasks performed manually that could be automated. Prioritize automation by: frequency x time per occurrence x error rate.

**3. Build Infrastructure**: Invest in systems that scale: CRM (Salesforce, HubSpot), project management (Asana, Jira), communication (Slack), data infrastructure, and monitoring.

**4. Create Metrics and Dashboards**: You cannot manage what you cannot measure. Build dashboards that track key operational metrics in real time.

**5. Design for 10x**: When building any system or process, design it to handle 10x your current volume. This prevents the constant rebuilding that slows growing companies.

### The Three Phases of Operational Scaling

**Phase 1: Do Things That Do Not Scale (1-100 customers)**
Paul Graham's famous advice: manually do everything. Learn deeply about your customers and operations before automating.

**Phase 2: Build the Machine (100-1000 customers)**
Create repeatable processes, hire specialists, implement systems. This is where you transition from heroic individual effort to systematic operations.

**Phase 3: Optimize the Machine (1000+ customers)**
Fine-tune processes, reduce unit costs, improve quality, and build redundancy. Operations become a competitive moat.

### Key Takeaway

Scaling operations is about replacing heroic individual effort with systems and processes that produce consistent results at increasing volume. The companies that scale best invest in operational infrastructure early -- before they desperately need it.

**Sources**: Sutton, R. I. & Rao, H. (2014). *Scaling Up Excellence*. Graham, P. (2013). "Do Things That Don't Scale." Y Combinator. HBS case studies on operational scaling.`,
    },
    {
      id: "ent-hiring-at-scale",
      slug: "hiring-at-scale",
      title: "Hiring at Scale",
      content: `## Hiring at Scale

Hiring at scale -- growing from 20 to 200 to 2,000 employees -- is one of the most challenging aspects of building a high-growth startup. HBS professor Ranjay Gulati's research shows that **companies that grow headcount faster than 50% per year face significant organizational strain** that can derail even the most promising businesses.

### The Hiring Scaling Framework

**1. Define the Hiring Bar**: Establish clear, consistent standards for what "great" looks like. Amazon's "bar raiser" program assigns an interviewer from outside the hiring team whose sole job is to ensure the candidate meets the company-wide bar.

**2. Build a Recruiting Pipeline**: As you scale, recruiting shifts from a founder activity to a dedicated function. Invest in: employer branding, referral programs, recruiting team, structured interview processes, and candidate experience.

**3. Structure the Interview Process**: Use structured interviews with standardized questions and rubrics. This reduces bias, improves consistency, and allows meaningful comparison across candidates.

**4. Onboard Effectively**: A great hire with bad onboarding becomes a mediocre employee. Create a structured onboarding program: week 1 (company culture, tools, team introductions), month 1 (role clarity, first projects), month 3 (first review, full productivity).

### Common Scaling Hiring Mistakes

1. **Hiring too fast**: Speed without quality creates a talent debt that takes years to repay
2. **Hiring clones**: Diversity of thought, background, and skill makes better teams
3. **Not hiring managers**: Technical experts promoted to management without training create organizational dysfunction
4. **Ignoring culture in hiring**: Each bad cultural hire requires 3-5 good hires to offset
5. **Founder dependency**: If only founders can sell, manage, or make decisions, the company cannot scale

### Key Takeaway

Hiring at scale is a capability that must be built deliberately. The companies that scale best treat recruiting as a strategic function, maintain high hiring bars even under pressure, and invest heavily in onboarding.

**Sources**: Gulati, R. & DeSantola, A. (2016). "Start-Ups That Last." *Harvard Business Review*. HBS case studies on organizational scaling. Bock, L. (2015). *Work Rules!* Twelve.`,
    },
    {
      id: "ent-hypergrowth",
      slug: "managing-hypergrowth",
      title: "Managing Hypergrowth",
      content: `## Managing Hypergrowth

Hypergrowth -- growing revenue or headcount at 40%+ per year -- creates unique management challenges. HBS case studies on companies like Uber, WeWork, and Stripe illustrate both the exhilaration and the dangers of rapid scaling.

### What Hypergrowth Feels Like

"Every day is the worst day of the company's life" -- a common refrain from hypergrowth founders. Everything is simultaneously breaking and succeeding:

- Systems that worked last month are overwhelmed
- New employees outnumber veterans
- Communication breaks down as the team grows
- Quality and culture are under constant pressure
- Technical debt accumulates faster than it can be repaid

### The Hypergrowth Challenges

**1. Communication Breakdown**: At 10 people, everyone knows everything. At 100, information silos emerge. At 1,000, alignment requires deliberate systems.

**2. Culture Dilution**: When half the company has been there less than 6 months, cultural norms weaken. New employees learn culture from other new employees rather than from founders.

**3. Technical Debt**: The systems built for 100 users break at 10,000. Infrastructure must be rebuilt while the plane is flying.

**4. Management Gap**: Many early employees are excellent individual contributors but lack management experience. Growing the company requires growing managers.

**5. Decision Quality**: As the organization grows, decisions move further from the customer and further from the data. Bureaucracy creeps in.

### Strategies for Managing Hypergrowth

- **Over-communicate**: When in doubt, communicate more. Company all-hands, written memos, Slack channels, team meetings. Repeat key messages across multiple channels.
- **Invest in management development**: Promote from within where possible, but train new managers deliberately. External management training programs are worth the investment.
- **Build culture deliberately**: Create onboarding programs, cultural artifacts, and rituals that transmit culture to new employees.
- **Hire ahead of need**: In hypergrowth, by the time you feel the pain, you are already months behind on hiring.
- **Accept imperfection**: Not everything can be done perfectly during hypergrowth. Prioritize ruthlessly and accept "good enough" for non-critical activities.

### Key Takeaway

Hypergrowth is a privilege and a challenge. The companies that navigate it successfully invest in management capability, communication systems, and cultural infrastructure before they desperately need them. The companies that fail treat growth as an unmitigated good and neglect the organizational scaffolding required to support it.

**Sources**: Ismail, S. (2014). *Exponential Organizations*. Diversion Books. Gulati, R. (2019). "The Messy Truth About Organizational Transformation." *Harvard Business Review*. HBS case studies on Uber, Stripe, and Airbnb.`,
    },
    {
      id: "ent-blitzscaling",
      slug: "blitzscaling",
      title: "Blitzscaling (Reid Hoffman)",
      content: `## Blitzscaling (Reid Hoffman)

Reid Hoffman (LinkedIn co-founder, Greylock partner, and HBS/Stanford lecturer) coined **blitzscaling** to describe the strategy of prioritizing speed over efficiency in an environment of uncertainty -- deliberately accepting significant inefficiency and risk to capture a market before competitors can respond.

### What is Blitzscaling?

Blitzscaling is not just fast growth. It is **prioritizing speed of market capture above all else**, including profitability, efficiency, and even some aspects of quality. The logic: in winner-take-all markets with strong network effects, the company that reaches scale first often wins permanently.

### When to Blitzscale

Blitzscaling makes sense only when specific conditions are met:

1. **Winner-take-all or winner-take-most market**: Network effects, switching costs, or economies of scale create a situation where the market leader captures disproportionate value
2. **Speed is the critical success factor**: Being first to scale matters more than being most efficient
3. **Capital is available**: Blitzscaling burns cash -- you need enough runway to reach scale
4. **The market is large enough**: The eventual market must justify the investment in rapid scaling

### Blitzscaling Stages

| Stage | Size | Key Challenge |
|-------|------|---------------|
| Family | 1-9 | Finding product-market fit |
| Tribe | 10-99 | Building the team and culture |
| Village | 100-999 | Creating management infrastructure |
| City | 1,000-9,999 | Maintaining culture and execution quality |
| Nation | 10,000+ | Sustaining innovation and avoiding bureaucracy |

### The Risks of Blitzscaling

**Cash burn**: Blitzscaling companies can burn tens of millions per month. If growth stalls before reaching sustainability, the company may fail catastrophically (WeWork is the cautionary tale).

**Culture damage**: Rapid hiring without careful cultural attention creates dysfunction. The organizational culture that forms during blitzscaling may not be the culture you want long-term.

**Technical debt**: Building fast means cutting corners. The technical debt accumulated during blitzscaling must be repaid eventually.

**Ethical risks**: Speed can lead to ethical shortcuts -- ignoring regulations, mistreating employees, or externalizing costs to communities.

### The WeWork Cautionary Tale

WeWork is studied at HBS as a blitzscaling failure. The company raised \\$12 billion and expanded to 800+ locations in 120+ cities before its IPO collapsed in 2019. The problems:
- Blitzscaling without unit economics (losing money on every location)
- Governance failures (co-mingling of CEO's personal interests)
- Overvaluation driven by narrative rather than fundamentals
- No winner-take-all dynamics (office space lacks strong network effects)

The lesson: blitzscaling requires discipline, not just speed. Growth without unit economics is not blitzscaling -- it is blitz-spending.

### Key Takeaway

Blitzscaling is a powerful strategy in the right context -- winner-take-all markets with strong network effects where speed to scale is decisive. In other contexts, it is a recipe for disaster. The key question is not "how fast can we grow?" but "does the market structure reward the first to scale?" If yes, blitzscale. If no, focus on sustainable growth.

**Sources**: Hoffman, R. & Yeh, C. (2018). *Blitzscaling*. Currency. HBS case studies on LinkedIn, Airbnb, and WeWork. Thiel, P. (2014). *Zero to One*.`,
    },
  ],
};
