import { Module } from "../types";

export const executionModule: Module = {
  id: "bs-execution",
  title: "Strategy Execution",
  description:
    "Bridge the strategy-execution gap with the Balanced Scorecard, OKRs, resource allocation, and organizational alignment.",
  lessons: [
    {
      id: "bs-execution-gap",
      slug: "strategy-execution-gap",
      title: "The Strategy-Execution Gap",
      content: `## The Strategy-Execution Gap

According to research published in the *Harvard Business Review*, **67% of well-formulated strategies fail due to poor execution**. This gap between strategic intent and operational reality is one of the most studied -- and most persistent -- problems in management. HBS professors have dedicated decades to understanding why brilliant strategies die in implementation and what leaders can do about it.

### The Scope of the Problem

A landmark study by Donald Sull, Rebecca Homkes, and Charles Sull, published in HBR in 2015, surveyed 7,600 managers in 262 companies across 30 industries. Their findings were sobering:

- Only **28%** of managers could list three of their company's strategic priorities
- **84%** of managers said they could rely on their boss to support them, but only **9%** said they could rely on colleagues in other departments
- Strategies that require cross-functional collaboration fail **three times more often** than those that do not
- Companies lose **40%** of their strategy's value due to breakdowns in execution

### Why Strategies Fail in Execution

**1. Communication Breakdown**
Leaders assume that announcing a strategy is the same as communicating it. In reality, the average employee is exposed to strategy messaging only a few times per year, while receiving hundreds of operational messages daily. Strategy gets lost in the noise.

**2. Silo Mentality**
Most organizations are structured functionally (marketing, engineering, finance, operations). Strategy typically requires cross-functional coordination -- marketing and engineering working together on a new product, or sales and operations aligning on delivery promises. Functional silos resist this collaboration.

**3. Resource Misallocation**
Companies allocate resources through budgeting processes that are backward-looking. Last year's budget, adjusted by a small percentage, becomes this year's budget. This "peanut butter" approach spreads resources evenly rather than concentrating them on strategic priorities.

**4. Lack of Accountability**
Strategic objectives often lack clear owners, deadlines, and metrics. Everyone is responsible, which means no one is responsible.

**5. Competing Priorities**
Managers are pulled between "running the business" (operational demands) and "changing the business" (strategic initiatives). Urgent operational issues almost always win over important strategic projects.

**6. Short-Term Pressure**
Quarterly earnings expectations, annual bonus cycles, and monthly performance reviews all incentivize short-term results at the expense of long-term strategic investments.

### The Execution Premium

Robert Kaplan and David Norton (creators of the Balanced Scorecard, covered in the next lesson) coined the term "execution premium" -- the additional value captured by organizations that excel at both formulating and executing strategy. Their research found that companies in the top quartile of execution capability achieved **returns 2-3 times higher** than companies with similar strategies but weaker execution.

### Closing the Gap: Five Practices

**Practice 1: Translate Strategy into Clear Objectives**
Convert abstract strategy into 3-5 concrete objectives that every employee can understand and act on. "Become the market leader in digital services" is abstract. "Increase digital revenue from 15% to 40% of total revenue by 2026" is concrete.

**Practice 2: Cascade and Align**
Each level of the organization should have objectives that connect directly to the level above. A frontline employee should be able to trace a line from their daily work to the company's strategic priorities.

**Practice 3: Allocate Resources Dynamically**
Stop spreading resources evenly. Identify the 3-5 initiatives that matter most and fund them fully, even if it means defunding other initiatives. Google's "70-20-10" resource allocation model dedicates resources by strategic priority.

**Practice 4: Create Cross-Functional Accountability**
Strategic objectives that span departments need explicit owners, joint metrics, and regular cross-functional reviews. Make collaboration visible and rewarded.

**Practice 5: Review and Adapt Regularly**
Strategy execution is not "set and forget." Monthly strategy reviews (separate from operational reviews) allow leaders to track progress, identify obstacles, and adjust course.

### Key Takeaway

The strategy-execution gap is not inevitable. It results from specific organizational failures -- poor communication, misaligned resources, silo thinking, and weak accountability. Leaders who invest as much effort in execution systems as they do in strategy formulation capture significantly more value.

**Sources**: Sull, D., Homkes, R., & Sull, C. (2015). "Why Strategy Execution Unravels." *Harvard Business Review*. Kaplan, R. S. & Norton, D. P. (2008). *The Execution Premium*. Harvard Business Press. Mankins, M. C. & Steele, R. (2005). "Turning Great Strategy into Great Performance." *Harvard Business Review*.`,
    },
    {
      id: "bs-balanced-scorecard",
      slug: "balanced-scorecard",
      title: "Balanced Scorecard (Kaplan & Norton)",
      content: `## Balanced Scorecard

In 1992, Robert Kaplan and David Norton published "The Balanced Scorecard: Measures That Drive Performance" in the *Harvard Business Review*. What began as a performance measurement system evolved into one of the most influential strategy execution frameworks in management history. By 2020, over 50% of Fortune 500 companies had adopted some form of the Balanced Scorecard.

### The Problem It Solves

Traditional performance measurement relies almost exclusively on financial metrics -- revenue, profit, ROI. But financial metrics are **lagging indicators** -- they tell you what already happened. By the time you see poor financial results, the damage is done.

Kaplan and Norton argued that organizations need a balanced set of metrics across four perspectives that include both **leading indicators** (predictors of future performance) and **lagging indicators** (results).

### The Four Perspectives

\`\`\`
                    FINANCIAL
            "How do we look to
              shareholders?"
                     |
    CUSTOMER --------+-------- INTERNAL
"How do customers    |     BUSINESS PROCESS
   see us?"          |    "What must we
                     |     excel at?"
                     |
              LEARNING & GROWTH
            "Can we continue to
          improve and create value?"
\`\`\`

**1. Financial Perspective**: Revenue growth, profitability, return on capital, economic value added. These are the ultimate measures of strategic success but they are outcomes, not drivers.

**2. Customer Perspective**: Customer satisfaction, retention, acquisition, market share, brand equity. How do target customers perceive us? What value proposition do we deliver?

**3. Internal Business Process Perspective**: Operational excellence, innovation processes, customer management processes, regulatory and social processes. What processes must we excel at to deliver our value proposition?

**4. Learning & Growth Perspective**: Employee skills and satisfaction, information systems capability, organizational alignment, culture. What capabilities must we develop to sustain our competitive advantage?

### The Strategy Map

Kaplan and Norton later introduced the **Strategy Map** -- a visual representation of how objectives in each perspective link to each other in a cause-and-effect chain:

\`\`\`
Learning & Growth --> Internal Process --> Customer --> Financial

Example chain:
Train engineers  --> Reduce defect   --> Increase    --> Increase
in Six Sigma        rate by 50%         customer       profit
                                        satisfaction   margin
                                        to 90%         to 15%
\`\`\`

The strategy map makes the organization's theory of value creation explicit. If we invest in employee training (learning), we should improve process quality (internal), which should increase customer satisfaction (customer), which should drive financial results (financial).

### Building a Balanced Scorecard

**Step 1: Clarify Vision and Strategy**
Start with the organization's strategy. The Balanced Scorecard is not a strategy tool -- it is a strategy *execution* tool. You must have a clear strategy before you can build a scorecard.

**Step 2: Develop Objectives for Each Perspective**
Identify 3-5 strategic objectives per perspective. These should be specific, action-oriented, and linked to the strategy.

**Step 3: Select Measures for Each Objective**
Choose 1-2 metrics per objective. Include both leading (predictive) and lagging (outcome) measures.

**Step 4: Set Targets**
Define specific, time-bound targets for each measure. "Improve customer satisfaction" is not enough. "Increase NPS from 35 to 55 by Q4" is actionable.

**Step 5: Identify Initiatives**
What specific projects and investments will drive improvement? Link each initiative to specific scorecard objectives.

### Example Balanced Scorecard (SaaS Company)

| Perspective | Objective | Measure | Target |
|------------|-----------|---------|--------|
| Financial | Increase recurring revenue | ARR growth rate | 40% YoY |
| Financial | Improve profitability | Gross margin | 80% |
| Customer | Increase retention | Net revenue retention | 120% |
| Customer | Improve satisfaction | NPS score | 60+ |
| Internal | Accelerate product delivery | Release cycle time | 2 weeks |
| Internal | Reduce churn drivers | Support ticket resolution | < 4 hours |
| Learning | Build engineering capability | Engineers with cloud certification | 80% |
| Learning | Improve employee engagement | eNPS score | 40+ |

### Criticisms and Limitations

**Complexity**: A full Balanced Scorecard with strategy maps, cascaded objectives, and regular reviews requires significant organizational commitment.

**Measurement obsession**: Organizations can become so focused on measuring that they lose sight of managing. The scorecard is a tool, not an end in itself.

**Static design**: The original framework assumes a relatively stable strategy. In fast-moving industries, objectives and measures may need to change quarterly.

**Causality assumptions**: The cause-and-effect links between perspectives are hypotheses, not proven relationships. Organizations should test these assumptions regularly.

### Key Takeaway

The Balanced Scorecard transforms strategy from a document into a management system. By measuring performance across four perspectives -- financial, customer, internal process, and learning -- organizations can monitor both results and the drivers of future results. The power is not in the metrics themselves but in the discipline of aligning the entire organization around strategic priorities.

**Sources**: Kaplan, R. S. & Norton, D. P. (1992). "The Balanced Scorecard: Measures That Drive Performance." *Harvard Business Review*. Kaplan, R. S. & Norton, D. P. (1996). *The Balanced Scorecard*. Harvard Business Press. HBS Online, "Business Strategy" course.`,
    },
    {
      id: "bs-okrs",
      slug: "okrs",
      title: "OKRs (Objectives & Key Results)",
      content: `## OKRs (Objectives & Key Results)

While the Balanced Scorecard emerged from HBS in the 1990s, the **OKR framework** -- Objectives and Key Results -- emerged from Intel and was popularized by Google, becoming the dominant goal-setting system in Silicon Valley and increasingly in traditional enterprises. Harvard Business School has incorporated OKRs into its innovation and entrepreneurship courses as a complement to traditional strategy execution tools.

### Origins

Andy Grove, legendary CEO of Intel, developed OKRs in the 1970s as an evolution of Peter Drucker's "Management by Objectives" (MBO). Grove's key innovation was separating the *inspirational goal* (Objective) from the *measurable outcomes* (Key Results).

John Doerr, a former Intel engineer turned venture capitalist at Kleiner Perkins, brought OKRs to Google in 1999 when the company had just 40 employees. Google has used OKRs every quarter since, and the framework has spread to LinkedIn, Twitter, Spotify, Amazon, and thousands of other organizations.

### How OKRs Work

**Objective**: A qualitative, inspirational goal that defines *what* you want to achieve. Objectives should be ambitious, action-oriented, and time-bound.

**Key Results**: 2-5 quantitative, measurable outcomes that define *how* you will know you achieved the objective. Key Results must be specific, time-bound, and verifiable -- you can clearly say "yes, we hit it" or "no, we did not."

### The OKR Formula

> I will [Objective] as measured by [Key Results].

**Example:**

**Objective**: Become the most trusted brand in our category.

**Key Results**:
1. Increase Net Promoter Score from 35 to 55 by end of Q4
2. Achieve 4.5+ star average rating across 1,000+ reviews on G2
3. Increase organic referral rate from 15% to 30% of new customers
4. Reduce customer complaint resolution time from 48 hours to 4 hours

### OKRs vs. KPIs vs. Balanced Scorecard

| Feature | OKRs | KPIs | Balanced Scorecard |
|---------|------|------|-------------------|
| **Purpose** | Drive change and ambition | Monitor health | Align strategy to metrics |
| **Timeframe** | Quarterly (typically) | Ongoing | Annual with quarterly reviews |
| **Ambition** | Stretch goals (70% achievement is good) | 100% achievement expected | Targets set to be achievable |
| **Direction** | Top-down AND bottom-up | Top-down | Top-down cascade |
| **Flexibility** | Reset every quarter | Rarely changed | Annually reviewed |

### The OKR Cadence

**Annual OKRs**: Company-level strategic objectives (3-5) set by leadership. These rarely change mid-year.

**Quarterly OKRs**: Team and individual OKRs set at the beginning of each quarter, aligned with annual objectives. These are the primary operating rhythm.

**Weekly Check-ins**: Brief progress updates on Key Results. Are we on track? What is blocking us? What do we need to adjust?

**Quarterly Review**: Score each Key Result (typically 0.0 to 1.0), reflect on what worked and what did not, and set new OKRs for the next quarter.

### Scoring OKRs

At Google, OKRs are scored on a 0.0 to 1.0 scale:

- **0.0 - 0.3**: No real progress
- **0.4 - 0.6**: Progress made but fell short
- **0.7 - 0.8**: Delivered (the "sweet spot" for stretch goals)
- **0.9 - 1.0**: Fully achieved (may mean the goal was not ambitious enough)

The crucial cultural element: **OKRs are not tied to compensation or performance reviews.** This separation allows teams to set truly ambitious goals without fear of punishment for falling short. If OKRs are tied to bonuses, people will sandbag their targets.

### Common OKR Mistakes

**1. Too Many OKRs**: 3-5 objectives with 2-5 key results each. More than that dilutes focus. If everything is a priority, nothing is.

**2. Key Results That Are Really Tasks**: "Launch new website" is a task, not a key result. "Increase website conversion rate from 2% to 4%" is a key result. Key results measure *outcomes*, not *outputs*.

**3. Business-as-Usual OKRs**: OKRs should drive *change*, not maintain the status quo. "Maintain 99.9% uptime" is a KPI, not an OKR. "Reduce incident recovery time from 4 hours to 15 minutes" is an OKR.

**4. No Alignment**: Team OKRs should visibly connect to company OKRs. If a team's OKRs do not relate to any company objective, something is wrong.

**5. Set and Forget**: OKRs without weekly check-ins become forgotten documents. The cadence of regular review is what makes OKRs effective.

### OKRs in Practice: Google Example

**Company Objective**: Organize the world's information and make it universally accessible.

**Team Objective (Search Quality)**: Deliver the most relevant search results in the industry.

**Key Results**:
1. Achieve top-1 result satisfaction rate of 85% (up from 78%)
2. Reduce average search-to-click time by 20%
3. Increase zero-click answer accuracy to 90%

### Key Takeaway

OKRs provide a lightweight, flexible framework for translating strategy into action. Their power comes from ambitious goal-setting, measurable outcomes, transparent sharing, and a regular cadence of review and adjustment. When implemented well, OKRs create focus, alignment, and accountability without the bureaucratic overhead of more complex systems.

**Sources**: Doerr, J. (2018). *Measure What Matters*. Penguin. Grove, A. S. (1983). *High Output Management*. Random House. Wodtke, C. (2016). *Radical Focus*. Cucina Media. HBS Online, "Business Strategy" and "Entrepreneurship Essentials" courses.`,
    },
    {
      id: "bs-resource-allocation",
      slug: "resource-allocation",
      title: "Resource Allocation",
      content: `## Resource Allocation

Joseph Bower, a Harvard Business School professor, spent decades studying how large companies actually allocate resources. His research revealed a troubling finding: **the formal strategic planning process has surprisingly little influence on how resources are actually allocated.** Instead, resource allocation is driven by internal politics, historical precedent, and middle managers' interpretations of what top management wants.

### Why Resource Allocation Matters

Strategy is expressed not through mission statements or slide decks but through **where a company puts its money, people, and attention**. As Andy Grove famously said: "To understand a company's actual strategy, look at what they actually do -- especially where they allocate resources."

Clayton Christensen built on Bower's work, arguing that **the resource allocation process is the mechanism through which the innovator's dilemma operates**. Well-managed companies allocate resources to the most profitable customers and largest markets -- which systematically starves disruptive innovations of funding.

### How Resource Allocation Actually Works

| What leadership thinks happens | What actually happens |
|-------------------------------|----------------------|
| Strategy drives resource allocation | Resource allocation reveals actual strategy |
| Top management decides priorities | Middle managers filter which proposals reach the top |
| Budgets reflect strategic priorities | Budgets reflect last year's budgets +/- small adjustments |
| Innovation is funded generously | Innovation funding is first cut during downturns |
| Resources move fluidly to best opportunities | Resources get stuck in existing businesses |

### The Three Allocation Traps

**Trap 1: The Peanut Butter Trap**
Resources are spread thinly and evenly across all business units, rather than concentrated on the highest-priority strategic initiatives. This feels fair but is strategically disastrous. If every division gets the same 3% budget increase, strategic priorities are indistinguishable from business-as-usual.

**Trap 2: The Inertia Trap**
This year's budget looks like last year's budget. HBS research shows that in a typical large company, **92% of capital allocation** in any given year goes to the same businesses that received it the previous year. Only 8% is truly reallocated. Markets change much faster than corporate budgets.

**Trap 3: The Squeaky Wheel Trap**
Resources flow to the managers who are most persuasive, most politically connected, or most persistent -- not necessarily to the initiatives with the greatest strategic value. The business unit with the best presenter gets funded, regardless of strategic merit.

### Best Practices for Strategic Resource Allocation

**Practice 1: Zero-Based Budgeting**
Instead of starting with last year's budget, start from zero and require every expenditure to be justified. This forces a fresh evaluation of where resources should go based on current strategic priorities, not historical patterns.

**Practice 2: Strategy-Linked Portfolio Management**
Treat the company's initiatives like an investment portfolio. Categorize initiatives as "core" (maintain current business), "adjacent" (extend current business), and "transformational" (create new business). Set allocation targets for each category (e.g., 70/20/10).

**Practice 3: Stage-Gate Investment**
Do not fund large initiatives all at once. Break them into stages with clear milestones. Fund the next stage only when the current stage delivers results. This reduces the risk of large, irreversible commitments.

**Practice 4: Kill Sessions**
Regularly review the portfolio and explicitly decide which initiatives to stop. Most organizations are better at starting things than stopping them. Warren Buffett's principle applies: "The most important thing to do when you find yourself in a hole is to stop digging."

**Practice 5: Separate the "Run" and "Change" Budgets**
Create distinct budgets for running existing operations and for strategic change initiatives. This prevents operational urgency from consuming strategic investment.

### Dynamic Resource Allocation

McKinsey research (frequently cited in HBS courses) shows that companies that **actively reallocate resources** -- shifting more than 50% of capital across business units over a decade -- create 50% more value than companies that passively maintain historical allocations.

The most effective resource allocators share three traits:
1. They review allocations continuously, not just annually
2. They have explicit criteria for shifting resources
3. They are willing to defund underperforming initiatives

### The Personal Dimension

Resource allocation applies to individuals too. How you allocate your own time, energy, and attention reflects your actual priorities. Clayton Christensen, in his final HBS lecture published as *How Will You Measure Your Life?*, argued that people face the same allocation challenges as corporations -- we over-invest in urgent, visible activities (career) and under-invest in important but invisible ones (family, health, relationships).

### Key Takeaway

Resource allocation is where strategy becomes real. Organizations that align resource allocation with strategic priorities outperform those that do not. The key is overcoming inertia, politics, and the peanut butter approach to create dynamic, strategy-linked resource allocation processes.

**Sources**: Bower, J. L. (1970). *Managing the Resource Allocation Process*. Harvard Business School Press. Christensen, C. M. (1997). *The Innovator's Dilemma*. HBS Press. Mankins, M. C. & Steele, R. (2005). "Turning Great Strategy into Great Performance." *Harvard Business Review*. Hall, S., Lovallo, D., & Musters, R. (2012). "How to Put Your Money Where Your Strategy Is." *McKinsey Quarterly*.`,
    },
    {
      id: "bs-org-alignment",
      slug: "organizational-alignment",
      title: "Organizational Alignment",
      content: `## Organizational Alignment

Harvard Business School research consistently shows that the single biggest predictor of strategy execution success is **organizational alignment** -- the degree to which an organization's structure, culture, incentives, processes, and people all point in the same strategic direction. Misalignment is the silent killer of strategy.

### What is Organizational Alignment?

Organizational alignment exists when **every element of the organization reinforces the strategy**. It means that:
- Structure supports strategic priorities
- Culture enables the behaviors the strategy requires
- Incentives reward strategic outcomes
- Processes are designed to deliver the value proposition
- People have the skills and mindset the strategy demands
- Resources flow to strategic priorities

### The 7-S Framework (McKinsey/HBS)

The most comprehensive alignment framework was developed by Tom Peters and Robert Waterman at McKinsey, in collaboration with HBS professors. The **7-S Model** identifies seven interdependent elements that must be aligned:

\`\`\`
                    STRATEGY
                       |
              STRUCTURE --- SYSTEMS
                 |             |
    SHARED VALUES (center of all)
                 |             |
              STYLE   ---   STAFF
                       |
                    SKILLS
\`\`\`

**Hard elements** (easier to identify and manage):
- **Strategy**: The plan for building and maintaining competitive advantage
- **Structure**: How the organization is organized (hierarchy, divisions, teams)
- **Systems**: Procedures, processes, and routines (IT systems, budgeting, performance management)

**Soft elements** (harder to identify, influenced by culture):
- **Shared Values**: Core beliefs and attitudes that shape organizational behavior
- **Style**: Leadership style and organizational culture
- **Staff**: The people and their general capabilities
- **Skills**: The distinctive competencies of the organization

### How Misalignment Destroys Strategy

**Example 1: Innovation Strategy with Control Culture**
A company declares "innovation" as its top strategic priority but maintains rigid approval processes, punishes failure, and rewards only proven results. The structure (hierarchical), systems (risk-averse approval chains), and style (command-and-control) all contradict the strategy. Employees hear "innovate" but experience "do not make mistakes."

**Example 2: Customer-Centricity with Internal Metrics**
A company commits to being "the most customer-centric" in its industry but measures employees on internal efficiency metrics (calls per hour, tickets closed) rather than customer outcomes (satisfaction, retention, lifetime value). The systems undermine the strategy.

**Example 3: Collaboration Strategy with Individual Incentives**
A company needs cross-functional collaboration to deliver integrated solutions but compensates employees solely on individual and departmental performance. Rational employees optimize for their own metrics, not for collaboration.

### The Alignment Audit

To assess organizational alignment, examine each element against the strategy:

| Element | Alignment Question |
|---------|-------------------|
| **Structure** | Does our org structure enable or hinder our strategic priorities? |
| **Systems** | Do our measurement and reward systems drive strategic behavior? |
| **Staff** | Do we have the right people in the right roles? |
| **Skills** | Do we have the capabilities our strategy requires? |
| **Style** | Does leadership behavior model what the strategy demands? |
| **Shared Values** | Does our culture support or resist the strategy? |

For each element, rate alignment as Strong, Partial, or Weak. Any "Weak" alignment is a potential strategy killer.

### Creating Alignment

**1. Start with Structure**
Ensure that the organizational structure reflects strategic priorities. If cross-functional collaboration is essential, create cross-functional teams with shared goals. If speed matters, flatten the hierarchy and reduce approval layers.

**2. Align Incentives**
People do what they are rewarded for. If you want innovation, reward experimentation (even failed experiments). If you want collaboration, include team-based metrics in performance evaluations. If you want long-term thinking, tie compensation to multi-year outcomes.

**3. Fix Systems and Processes**
Review every major process (budgeting, hiring, promotion, performance review, decision-making) and ask: "Does this process support or undermine our strategy?" Remove or redesign processes that create misalignment.

**4. Develop Required Skills**
Identify the gap between current organizational capabilities and what the strategy requires. Invest in training, hire for missing skills, and redeploy people whose skills match strategic needs.

**5. Shape Culture Deliberately**
Culture change is the hardest alignment challenge. It requires consistent leadership behavior, storytelling, rituals, and consequences. As Edgar Schein (MIT, frequently cited at HBS) argues, culture is shaped by what leaders pay attention to, measure, reward, and how they react to critical incidents.

### The Congruence Model (Tushman & Nadler)

HBS professor Michael Tushman and David Nadler developed the **Congruence Model**, which argues that organizational effectiveness depends on the "fit" between four elements: the task (the work), the people (who does it), the formal organization (structure, systems), and the informal organization (culture, norms). The greater the congruence among these four elements, the more effective the organization.

### Key Takeaway

Organizational alignment is not a one-time exercise -- it is an ongoing discipline. Every strategic change requires a corresponding organizational realignment. Leaders who invest in alignment create organizations where strategy flows naturally into execution, rather than being blocked by structural, cultural, or incentive barriers.

**Sources**: Waterman, R. H., Peters, T. J., & Phillips, J. R. (1980). "Structure Is Not Organization." *Business Horizons*. Tushman, M. L. & Nadler, D. A. (1980). "A Model for Diagnosing Organizational Behavior." *Organizational Dynamics*. Kaplan, R. S. & Norton, D. P. (2006). *Alignment*. Harvard Business Press. HBS Online, "Business Strategy" course.`,
    },
  ],
};
