import { Module } from "../types";

export const orgDesignModule: Module = {
  id: "lm-org-design",
  title: "Organizational Design",
  description:
    "Learn organizational structures, span of control, cross-functional collaboration, high-performance culture, and scaling organizations.",
  lessons: [
    {
      id: "lm-org-structures",
      slug: "organizational-structures",
      title: "Organizational Structures",
      content: `## Organizational Structures

The way an organization is structured fundamentally shapes how information flows, how decisions are made, and how strategy is executed. Harvard Business School research by Jay Galbraith, Michael Tushman, and others shows that **there is no universally best structure -- the right structure depends on the organization's strategy, environment, and stage of development**.

### The Major Structural Types

**1. Functional Structure**
Organized by business functions: marketing, engineering, finance, operations, HR.

\`\`\`
            CEO
     /    |    |    \\
  Marketing Eng Finance Ops
\`\`\`

*Advantages*: Deep functional expertise, clear career paths, economies of scale within functions, efficient for single-product companies.
*Disadvantages*: Silos between functions, slow cross-functional coordination, "the left hand doesn't know what the right hand is doing."
*Best for*: Small to mid-size companies with a single product line or limited product variety.

**2. Divisional Structure**
Organized by product lines, geographies, or customer segments. Each division operates as a semi-autonomous business unit.

\`\`\`
            CEO
     /      |       \\
  Product A  Product B  Product C
  (all funcs) (all funcs) (all funcs)
\`\`\`

*Advantages*: Accountability is clear (each division has its own P&L), faster decision-making within divisions, can adapt to different markets.
*Disadvantages*: Duplication of functions (each division has its own marketing, HR, etc.), less cross-division coordination, potential for internal competition.
*Best for*: Large, diversified companies with distinct product lines or geographic markets.

**3. Matrix Structure**
Dual reporting: employees report to both a functional manager AND a product/project/geographic manager.

\`\`\`
        Functional Heads
        Marketing  Eng  Finance
Product A   x       x      x
Product B   x       x      x
Product C   x       x      x
\`\`\`

*Advantages*: Combines functional depth with product focus, flexible resource allocation, encourages cross-functional collaboration.
*Disadvantages*: Dual reporting creates confusion ("who is my real boss?"), decision-making can be slow (two bosses must agree), political conflict between functional and product managers.
*Best for*: Complex organizations that need both deep functional expertise and product responsiveness (consulting firms, aerospace, global companies).

**4. Network (Flat) Structure**
Minimal hierarchy, self-organizing teams, distributed decision-making.

*Advantages*: Speed, agility, innovation, employee empowerment.
*Disadvantages*: Lack of clear accountability, coordination challenges at scale, not suitable for all types of work.
*Best for*: Startups, creative organizations, technology companies with highly autonomous teams.

### Choosing Your Structure

| Strategic Need | Recommended Structure |
|---------------|----------------------|
| Deep expertise and efficiency | Functional |
| Market responsiveness and accountability | Divisional |
| Both expertise and responsiveness | Matrix |
| Speed and innovation | Network/Flat |
| Global presence with local adaptation | Geographic divisional or matrix |

### The Pendulum of Organizational Design

Organizations often swing between centralization (efficiency, control) and decentralization (responsiveness, speed). Neither extreme works permanently. The art of organizational design is finding the right balance for the current strategic context -- and being willing to restructure when the context changes.

### Key Takeaway

Structure is not destiny, but it powerfully shapes behavior. Choose a structure that aligns with your strategy, and be prepared to evolve it as your strategy evolves. The best organizational design is the one that enables the right information to reach the right people to make the right decisions at the right speed.

**Sources**: Galbraith, J. R. (2014). *Designing Organizations*. Jossey-Bass. Mintzberg, H. (1979). *The Structuring of Organizations*. Prentice Hall. HBS Online, "Management Essentials" course.`,
    },
    {
      id: "lm-span-delegation",
      slug: "span-of-control-delegation",
      title: "Span of Control & Delegation",
      content: `## Span of Control & Delegation

Span of control -- the number of direct reports a manager has -- is one of the most fundamental decisions in organizational design. Too narrow, and the organization becomes bureaucratic with too many layers. Too wide, and managers cannot provide adequate oversight, coaching, and support.

### What is Span of Control?

Span of control refers to the **number of people who report directly to a single manager**. It determines the shape of the organizational hierarchy:

- **Narrow span** (3-5 reports): Creates tall organizations with many management layers
- **Wide span** (10-20+ reports): Creates flat organizations with few layers

### Factors That Determine Optimal Span

| Factor | Favors Wider Span | Favors Narrower Span |
|--------|-------------------|---------------------|
| Work complexity | Simple, routine | Complex, varied |
| Employee experience | Highly experienced, autonomous | New, require guidance |
| Geographic distribution | Co-located | Distributed/remote |
| Interdependence | Independent work | Highly interdependent |
| Manager capability | Strong delegator | Developing manager |
| Support systems | Strong processes, tools | Limited infrastructure |

### The Delegation Spectrum

Delegation is not binary (delegate or do not delegate). It exists on a spectrum:

\`\`\`
Level 1: "Wait for me to tell you what to do"
Level 2: "Look into this and tell me the situation. I'll decide"
Level 3: "Look into this and recommend an action. I'll approve"
Level 4: "Look into this, decide, and let me know what you did"
Level 5: "Look into this, decide, and take action. No need to check"
\`\`\`

The appropriate level depends on the task's importance, the employee's capability, and the risk of failure.

### Why Leaders Fail to Delegate

**1. "I can do it better/faster"** -- Perhaps true today, but not scalable. Your job is to build organizational capability, not to be the best individual contributor.

**2. "I don't trust them to do it right"** -- If you never delegate, they will never develop competence, and you will never develop trust. It is a self-fulfilling prophecy.

**3. "I'll lose control"** -- Delegation is not abdication. You can delegate the task while retaining oversight and accountability.

**4. "It takes too long to explain"** -- The upfront investment in explaining pays dividends. Each time you delegate, the next time requires less explanation.

**5. Identity attachment** -- Some leaders' identity is tied to being the expert or the doer. Letting go feels like losing their value.

### The RACI Matrix

For complex projects, clarify delegation using the RACI framework:

- **R**esponsible: Who does the work?
- **A**ccountable: Who makes the final decision and is ultimately answerable? (Only one person per task)
- **C**onsulted: Who provides input before a decision?
- **I**nformed: Who is told about the decision after it is made?

### Effective Delegation Process

1. **Choose the right task**: Delegate tasks that develop others, that others can do well enough, and that do not require your unique expertise
2. **Choose the right person**: Match the task to the person's development needs and capability
3. **Communicate clearly**: Define the outcome, deadline, authority level, and available resources
4. **Set checkpoints**: Agree on progress review points (not micromanaging, but not abandoning)
5. **Provide support**: Be available for questions without hovering
6. **Review and feedback**: After completion, discuss what went well and what to improve

### Key Takeaway

Span of control and delegation are interconnected. A manager with a wide span *must* delegate effectively or become a bottleneck. A manager who delegates well *can* manage a wider span successfully. The goal is not to optimize the org chart on paper but to ensure that every person has the right level of support, autonomy, and accountability.

**Sources**: Urwick, L. F. (1956). "The Manager's Span of Control." *Harvard Business Review*. HBS case studies on organizational design. McChrystal, S. (2015). *Team of Teams*. Portfolio/Penguin.`,
    },
    {
      id: "lm-cross-functional",
      slug: "cross-functional-collaboration",
      title: "Cross-Functional Collaboration",
      content: `## Cross-Functional Collaboration

Harvard Business School research by Donald Sull found that **strategies requiring cross-functional collaboration fail three times more often than those that do not**. Yet almost every significant strategic initiative -- new product launches, digital transformations, customer experience improvements -- requires multiple functions to work together effectively.

### Why Cross-Functional Collaboration is Hard

**1. Different goals and metrics**: Marketing optimizes for leads, sales optimizes for revenue, engineering optimizes for technical quality. These goals can conflict.

**2. Different cultures and languages**: Finance speaks in numbers, engineering speaks in systems, marketing speaks in customer stories. Translation is needed.

**3. Resource competition**: Functions compete for budget, headcount, and executive attention.

**4. Accountability gaps**: When a cross-functional project fails, who is responsible? Shared accountability often means no accountability.

**5. Physical and organizational distance**: Functions may be located in different buildings, cities, or time zones.

### Strategies for Effective Cross-Functional Collaboration

**Strategy 1: Create Cross-Functional Teams with Clear Mandates**
Establish teams with representatives from each relevant function. Give them a clear charter, decision-making authority, and shared goals.

**Strategy 2: Assign a Single Accountable Leader**
Every cross-functional initiative needs one person who is clearly accountable for the outcome -- not a committee, but an individual who can make decisions and drive progress.

**Strategy 3: Create Shared Metrics**
When functions share metrics, they align their efforts. If marketing and sales share a revenue target (not just leads or conversions independently), they collaborate to optimize the entire funnel.

**Strategy 4: Implement Liaison Roles**
Designate individuals in each function whose specific job includes coordinating with other functions. Product managers often serve this role between engineering, design, and business teams.

**Strategy 5: Build Relationships Across Silos**
Formal structures are necessary but insufficient. Real collaboration requires personal relationships. Create opportunities for cross-functional relationship building: joint off-sites, rotation programs, shared social events.

**Strategy 6: Use Structured Decision-Making Processes**
When cross-functional teams disagree, having a predefined escalation process prevents deadlock. The RAPID framework is particularly useful for clarifying cross-functional decision roles.

### Amazon's Two-Pizza Teams

Amazon structures around small, autonomous teams (6-10 people) that own a specific customer experience or service end-to-end. Each team has all the functional capabilities it needs (engineering, product, design). This minimizes the need for cross-team coordination by embedding collaboration within the team.

**Trade-off**: This approach reduces coordination overhead but can create duplication (each team may build its own tools) and makes organization-wide consistency harder.

### Key Takeaway

Cross-functional collaboration does not happen naturally -- it must be deliberately designed through shared goals, clear accountability, relationship building, and structured processes. Leaders who invest in cross-functional capability create organizations that execute complex strategies more effectively.

**Sources**: Sull, D., Homkes, R., & Sull, C. (2015). "Why Strategy Execution Unravels." *Harvard Business Review*. Galbraith, J. R. (2014). *Designing Organizations*. Jossey-Bass. McChrystal, S. (2015). *Team of Teams*. Portfolio/Penguin.`,
    },
    {
      id: "lm-high-performance-culture",
      slug: "building-high-performance-culture",
      title: "Building High-Performance Culture",
      content: `## Building High-Performance Culture

Harvard Business School professors James Heskett and Earl Sasser's research on organizational culture found that **culture can account for 20-30% of the differential in corporate performance** compared to "culturally unremarkable" competitors. Building a high-performance culture is not about ping pong tables and free lunch -- it is about creating an environment where excellence is expected, supported, and sustained.

### What Defines a High-Performance Culture

High-performance cultures share common characteristics:

**1. Clear, Ambitious Standards**: Everyone knows what "great" looks like. Standards are explicit, measurable, and consistently enforced.

**2. Accountability**: People take ownership of outcomes. Blame is rare; learning from failure is expected. Poor performance is addressed directly and promptly.

**3. Psychological Safety**: People feel safe to take risks, speak up, and admit mistakes. High performance and psychological safety are not contradictory -- they are synergistic.

**4. Continuous Learning**: The organization invests in development. People grow their skills. Feedback is frequent and constructive.

**5. Recognition and Reward**: High performers are recognized and rewarded. There is a clear connection between contribution and compensation/advancement.

**6. Purpose and Meaning**: People understand how their work contributes to something larger. Purpose drives discretionary effort beyond what compensation alone can motivate.

### Netflix Culture: A Case Study

Netflix's culture deck (HBS case study) is one of the most influential documents in modern management. Key principles:

- **Freedom and Responsibility**: Give people enormous autonomy and expect them to act in the company's best interest. No vacation tracking, no expense approval process.
- **Context, not Control**: Leaders set context (strategy, goals, constraints) and trust people to make good decisions within that context.
- **Adequate Performance Gets a Generous Severance**: Netflix expects high performance. People who perform adequately but not excellently are let go with respect and generous severance. "We are a team, not a family."
- **Keeper Test**: Managers regularly ask themselves: "If this person told me they were leaving, would I fight to keep them?" If the answer is no, it is time for a conversation.

**Controversy**: Critics argue this culture is anxiety-inducing and works only for a specific type of high-performing individual. Proponents argue it attracts top talent and maintains excellence.

### The Values-to-Behavior Translation

Many companies have values on the wall that no one follows. High-performance cultures translate values into specific, observable behaviors:

| Value | Vague | Specific Behavior |
|-------|-------|------------------|
| Innovation | "We value creativity" | "Everyone can propose experiments; failures are celebrated in retrospectives" |
| Customer focus | "Customers come first" | "Every team reviews 5 customer support tickets weekly" |
| Transparency | "We communicate openly" | "All meeting notes are posted in a shared channel within 24 hours" |
| Accountability | "We take ownership" | "Every project has a single DRI (Directly Responsible Individual)" |

### Building Culture: A Practical Guide

**1. Define it explicitly**: Write down the 3-5 cultural values that matter most and translate each into specific behaviors.

**2. Hire for it**: Use behavioral interviews that assess cultural fit alongside competence. One person who does not share the values can erode culture faster than 10 people can build it.

**3. Model it from the top**: Culture is caught, not taught. Leaders must embody the values personally and visibly. If leaders say "we value transparency" but hoard information, the real message is clear.

**4. Reward it**: Promote, celebrate, and compensate people who exemplify the culture. Publicly recognize behaviors you want to reinforce.

**5. Enforce it**: Address violations consistently. A high performer who violates cultural values sends a devastating message if not addressed: "results matter more than values."

**6. Evolve it**: Culture is not static. As the company grows and the environment changes, cultural norms must evolve. What works for 50 people may not work for 5,000.

### Key Takeaway

High-performance culture is not about being tough or demanding -- it is about creating an environment where talented people can do their best work. This requires clear standards, genuine psychological safety, consistent accountability, and leaders who model the values they espouse. Culture is the invisible architecture of performance.

**Sources**: Heskett, J. L. & Sasser, W. E. (2012). *The Culture Cycle*. FT Press. Hastings, R. & Meyer, E. (2020). *No Rules Rules*. Penguin. McCord, P. (2018). *Powerful*. Silicon Guild. HBS case studies on Netflix, Amazon, and high-performance cultures.`,
    },
    {
      id: "lm-scaling-org",
      slug: "scaling-an-organization",
      title: "Scaling an Organization",
      content: `## Scaling an Organization

Scaling -- growing an organization from a small team to hundreds or thousands of people while maintaining effectiveness -- is one of the most difficult leadership challenges. Harvard Business School professor Robert Sutton and Stanford professor Huggy Rao wrote *Scaling Up Excellence* (2014) based on extensive research into what works and what fails when organizations try to grow.

### The Scaling Challenge

What works at 10 people breaks at 100. What works at 100 breaks at 1,000. Each order of magnitude requires different structures, processes, and leadership approaches.

| Stage | Size | Key Challenge |
|-------|------|--------------|
| Startup | 1-20 | Finding product-market fit |
| Growth | 20-100 | Establishing repeatable processes |
| Scale | 100-500 | Building management layers and culture |
| Enterprise | 500-5000+ | Maintaining agility while adding structure |

### The Catholic vs. Buddhist Dilemma

Sutton and Rao frame the central scaling question as the **"Catholic vs. Buddhist" dilemma**:

**Catholic approach**: Replicate exactly. Every new location, team, or unit follows the exact same playbook. McDonald's, Starbucks, and franchise models use this approach. Advantages: consistency, quality control, efficiency. Disadvantages: rigidity, lack of adaptation.

**Buddhist approach**: Provide guiding principles and let each team adapt. Google, Spotify, and many tech companies use this approach. Advantages: innovation, local adaptation, employee autonomy. Disadvantages: inconsistency, coordination challenges.

Most successful scaling efforts **blend both**: standardize what should be consistent (core values, key processes, quality standards) while allowing flexibility in implementation.

### What to Standardize vs. What to Customize

| Standardize (Catholic) | Customize (Buddhist) |
|------------------------|---------------------|
| Core values and culture | Local market adaptations |
| Customer experience standards | Team-level processes |
| Compliance and legal requirements | Innovation and experimentation |
| Technology platforms | Implementation details |
| Hiring bar and process | Role-specific requirements |
| Performance expectations | Development approaches |

### The Scaling Playbook

**Phase 1: Document What Works (20-100 people)**
Before you can scale, you must understand *what* you are scaling. Document the processes, practices, and cultural norms that drive your success.

**Phase 2: Build the Management Layer (100-300 people)**
The founder/CEO can no longer manage everyone directly. You need experienced managers who can maintain the culture while adding structure. This is where the leadership pipeline becomes critical.

**Phase 3: Systematize (300-1000 people)**
Replace heroic individual effort with systems: hiring processes, onboarding programs, performance management, communication infrastructure, decision-making frameworks.

**Phase 4: Decentralize (1000+ people)**
Central control becomes a bottleneck. Push decision-making to the edges while maintaining strategic alignment. This requires trust, clear values, and robust information systems.

### Common Scaling Mistakes

**1. Scaling chaos**: Growing headcount without establishing processes. The result: more people doing things differently, leading to conflicts and inefficiency.

**2. Scaling bureaucracy**: Adding too much process too early. The result: slow decision-making, frustrated employees, loss of agility.

**3. Losing culture in growth**: Hiring too fast without maintaining cultural standards. Each bad cultural hire requires 3-5 good hires to offset.

**4. Founder bottleneck**: The founder refuses to delegate, creating a bottleneck that limits organizational capacity.

**5. Premature scaling**: Scaling before achieving product-market fit. Startup Genome research found this is the #1 cause of startup failure.

### The "Subtraction" Principle

Sutton and Rao's most counterintuitive finding: **scaling excellence often requires subtraction, not addition**. Before adding new processes, roles, or initiatives, ask: "What should we stop doing?" Removing unnecessary complexity, outdated processes, and low-value activities is often more valuable than adding new ones.

### Key Takeaway

Scaling is not simply "doing more of the same." Each stage of growth requires deliberate organizational design choices about structure, process, culture, and leadership. The most successful scaling efforts balance standardization (for consistency) with customization (for adaptation) and invest in the management capability required to maintain excellence at scale.

**Sources**: Sutton, R. I. & Rao, H. (2014). *Scaling Up Excellence*. Crown Business. Gulati, R. & DeSantola, A. (2016). "Start-Ups That Last." *Harvard Business Review*. HBS case studies on organizational scaling.`,
    },
  ],
};
