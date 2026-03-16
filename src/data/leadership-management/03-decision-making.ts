import { Module } from "../types";

export const decisionMakingModule: Module = {
  id: "lm-decisions",
  title: "Decision Making",
  description:
    "Master decision-making frameworks, data-driven decisions, managing uncertainty, cognitive biases, and group decision dynamics.",
  lessons: [
    {
      id: "lm-decision-frameworks",
      slug: "decision-making-frameworks",
      title: "Decision-Making Frameworks",
      content: `## Decision-Making Frameworks

Harvard Business School's case method is fundamentally a decision-making training ground. Every case asks: "What would you do?" HBS professor David Garvin studied how effective leaders make decisions and found that the best decision-makers do not rely on intuition alone -- they use **structured frameworks** that improve both the quality and speed of decisions.

### Why Decision Quality Matters

McKinsey research (cited in HBS courses) found that the quality of decisions explains **95% of the variation in business performance**. Yet most organizations invest heavily in execution and almost nothing in improving how decisions are made.

### Framework 1: The Decision Matrix (Weighted Scoring)

For decisions with multiple criteria and multiple options, a weighted decision matrix brings rigor to the process:

1. List your options (columns)
2. List your criteria (rows)
3. Assign weights to each criterion (how important is it, 1-10?)
4. Score each option on each criterion (1-10)
5. Multiply scores by weights and sum

| Criterion | Weight | Option A | Option B | Option C |
|-----------|--------|----------|----------|----------|
| Cost | 8 | 7 (56) | 9 (72) | 5 (40) |
| Speed | 6 | 5 (30) | 3 (18) | 9 (54) |
| Quality | 9 | 9 (81) | 6 (54) | 7 (63) |
| **Total** | | **167** | **144** | **157** |

### Framework 2: The RAPID Model (Decision Roles)

Bain & Company's RAPID framework (taught at HBS) clarifies *who* plays what role in a decision:

- **R**ecommend: Who gathers facts and proposes a course of action?
- **A**gree: Who must agree (has veto power)?
- **P**erform: Who executes the decision?
- **I**nput: Who is consulted for information?
- **D**ecide: Who makes the final call?

The most common source of decision paralysis is unclear roles -- everyone thinks they have a vote, or no one knows who has the final say.

### Framework 3: Bezos' Type 1 vs. Type 2

Jeff Bezos categorizes decisions into two types:

**Type 1 (One-Way Door)**: Irreversible or nearly irreversible decisions. Take your time, gather data, consult broadly. Examples: entering a new market, acquiring a company, hiring a senior executive.

**Type 2 (Two-Way Door)**: Reversible decisions. Move fast, delegate, iterate. Examples: feature design, pricing tests, process changes.

Bezos argues that organizations slow themselves down by treating too many Type 2 decisions as Type 1. Most decisions are Type 2 -- make them quickly and correct course if needed.

### Framework 4: Pre-Mortem Analysis

Psychologist Gary Klein developed the **pre-mortem** -- imagining that a decision has already failed and working backward to identify why. This technique counteracts overconfidence bias:

1. The team assumes the decision was implemented and failed spectacularly
2. Each member independently writes down every reason they can think of for the failure
3. The team shares and discusses all reasons
4. The team decides which risks need to be mitigated before proceeding

Research shows pre-mortems increase the ability to identify reasons for future outcomes by **30%**.

### Framework 5: The 10/10/10 Rule

When facing an emotional or high-stakes decision, ask: How will I feel about this decision...
- **10 minutes** from now?
- **10 months** from now?
- **10 years** from now?

This framework combats short-term emotional thinking and helps leaders consider long-term implications.

### Decision Speed vs. Decision Quality

There is an inherent tension between speed and quality. Jeff Bezos addresses this with the "70% rule": **if you have 70% of the information you wish you had, make the decision.** Waiting for 90% certainty means you are almost certainly too slow.

Amazon's approach:
- Make decisions quickly with ~70% information
- Most decisions are reversible (Type 2) -- just decide and iterate
- Be good at recognizing and correcting bad decisions quickly
- "Disagree and commit" -- once a decision is made, everyone commits even if they disagreed

### Decision Journals

One of the most effective tools for improving decision quality over time is a **decision journal**. Before each important decision, write down:
- What the decision is
- What information you have
- What you decided and why
- What you expect to happen
- Your confidence level

Later, review the journal to identify patterns in your decision-making -- where you are consistently right and where you are systematically wrong.

### Key Takeaway

Great decision-making is a skill, not a talent. It can be improved through structured frameworks, clear role assignment, appropriate speed, and reflective practice. The best leaders are not those who are always right -- they are those who make decisions quickly, learn from outcomes, and correct course effectively.

**Sources**: Garvin, D. A. & Roberto, M. A. (2001). "What You Don't Know About Making Decisions." *Harvard Business Review*. Kahneman, D., Lovallo, D., & Sibony, O. (2011). "Before You Make That Big Decision." *Harvard Business Review*. Rogers, P. & Blenko, M. (2006). "Who Has the D?" *Harvard Business Review*.`,
    },
    {
      id: "lm-data-driven",
      slug: "data-driven-decisions",
      title: "Data-Driven Decisions",
      content: `## Data-Driven Decisions

Harvard Business School professor Thomas Davenport's landmark 2006 HBR article "Competing on Analytics" argued that data-driven decision-making is a **source of competitive advantage**, not just an operational improvement. His research showed that companies that use analytics strategically outperform competitors by significant margins. Yet most organizations still rely primarily on intuition, experience, and politics for major decisions.

### The Case for Data-Driven Decisions

Research from MIT Sloan (frequently cited at HBS) found that data-driven organizations are:
- **5% more productive** than their competitors
- **6% more profitable** than their competitors
- More likely to make faster decisions
- More likely to execute decisions as intended

### The Data-Driven Decision Process

**Step 1: Frame the Question**
Before looking at data, clearly define: What specific question are we trying to answer? What decision will this inform?

Bad: "Let's look at customer data."
Good: "What are the top three reasons customers churn within the first 90 days, and which is most addressable?"

**Step 2: Identify the Data You Need**
What data would answer this question? Where does it exist? How reliable is it? What is missing?

**Step 3: Analyze the Data**
Apply appropriate analytical methods. For descriptive questions: dashboards and summary statistics. For predictive questions: regression, machine learning. For causal questions: experiments (A/B tests), natural experiments, or quasi-experimental methods.

**Step 4: Interpret the Results**
What does the data tell us? What does it *not* tell us? What are the limitations? What alternative explanations exist?

**Step 5: Decide and Act**
Use the data to inform (not replace) judgment. Communicate the decision and its rationale. Track outcomes to validate the decision.

### The HiPPO Problem

In many organizations, decisions are made by the HiPPO -- the **Highest Paid Person's Opinion**. When the CEO or VP expresses a preference, data that contradicts them is ignored or suppressed.

Google explicitly fights this. When a senior leader proposes a product change, the team can say: "Let's test it." Data resolves disagreements, not hierarchy. This culture requires leadership that is genuinely open to being wrong.

### Building a Data-Driven Culture

| Practice | Description |
|----------|-------------|
| **Ask "What does the data say?"** | Make this a standard question in every meeting |
| **Invest in data literacy** | Train all managers in basic statistics and data interpretation |
| **Democratize data access** | Give teams self-service analytics tools |
| **Celebrate data-driven wins** | Share stories of decisions improved by data |
| **Accept data-driven losses** | When data leads to a wrong decision, learn from it without punishing |
| **Hire analytically** | Include data reasoning in interview processes |

### When NOT to Use Data

Data is powerful but not omniscient. Data-driven decision-making has limits:

**1. Novel Situations**: When facing something truly unprecedented, historical data may be irrelevant. No amount of data predicted COVID-19's impact on business.

**2. Values Decisions**: "Should we enter this market?" may involve ethical considerations that data cannot resolve. Data can inform the business case but not the values judgment.

**3. Speed Constraints**: When a decision must be made in minutes, there may not be time for data analysis. Develop heuristics (rules of thumb) for fast decisions and validate them with data later.

**4. Small Sample Sizes**: When you have very few data points, statistical analysis can be misleading. The law of small numbers leads to spurious patterns.

**5. Measuring the Wrong Thing**: Data-driven organizations sometimes optimize for easily measurable metrics while ignoring important but hard-to-measure outcomes (employee morale, customer trust, innovation quality).

### Correlation vs. Causation

The most common analytical error in business is confusing correlation with causation. Ice cream sales and drowning deaths are correlated (both increase in summer), but ice cream does not cause drowning.

To establish causation, you need:
- **Randomized controlled experiments** (A/B tests): The gold standard
- **Natural experiments**: When circumstances create random-like conditions
- **Regression with controls**: Statistically holding other factors constant
- **Instrumental variables and difference-in-differences**: Advanced econometric techniques

For most business decisions, a strong correlation with a plausible causal mechanism is sufficient for action. Perfect causal proof is a luxury.

### Key Takeaway

Data-driven decision-making is a competitive advantage, but it requires more than just having data. It requires asking the right questions, building analytical capability throughout the organization, and maintaining the judgment to know when data should lead and when it should inform.

**Sources**: Davenport, T. H. (2006). "Competing on Analytics." *Harvard Business Review*. Brynjolfsson, E. & McElheran, K. (2016). "The Rapid Adoption of Data-Driven Decision-Making." *American Economic Review*. Kahneman, D. (2011). *Thinking, Fast and Slow*. HBS Online, "Management Essentials" course.`,
    },
    {
      id: "lm-uncertainty-risk",
      slug: "managing-uncertainty-risk",
      title: "Managing Uncertainty & Risk",
      content: `## Managing Uncertainty & Risk

Frank Knight, in his seminal 1921 work *Risk, Uncertainty, and Profit*, drew a distinction that remains central to HBS strategy courses: **risk** is when you do not know the outcome but can assign probabilities; **uncertainty** is when you cannot even assign probabilities because the situation is fundamentally unpredictable. Leaders must manage both.

### Risk vs. Uncertainty

| Dimension | Risk | Uncertainty |
|-----------|------|------------|
| **Probabilities** | Known or estimable | Unknown or unknowable |
| **Historical data** | Available | Limited or irrelevant |
| **Examples** | Insurance, poker, product defect rates | Disruptive innovation, pandemics, political upheaval |
| **Management approach** | Quantify and hedge | Scenario plan and build optionality |

### Managing Risk: Quantitative Approaches

**Expected Value Analysis**: For decisions with known probabilities, calculate the expected value of each option:

Expected Value = (Probability of Success x Value of Success) + (Probability of Failure x Cost of Failure)

**Decision Trees**: Map out sequential decisions and chance events to evaluate complex, multi-stage choices:

\`\`\`
Decision: Launch new product?
|
+-- Launch (Cost: \$5M)
|   +-- Success (60%): Revenue \$20M -> Net \$15M
|   +-- Failure (40%): Revenue \$2M  -> Net -\$3M
|
+-- Don't Launch: \$0

Expected Value of Launch = (0.6 x \$15M) + (0.4 x -\$3M) = \$7.8M
\`\`\`

**Monte Carlo Simulation**: For complex decisions with many variables, simulate thousands of scenarios to understand the range of possible outcomes. Used extensively in finance, operations, and strategic planning.

### Managing Uncertainty: Qualitative Approaches

When probabilities are unknown, quantitative tools break down. Leaders must use different approaches:

**Scenario Planning**: Developed at Royal Dutch Shell and taught extensively at HBS. Instead of predicting the future, construct 3-4 plausible scenarios and develop strategies that are robust across multiple futures.

Steps:
1. Identify the two most important and uncertain drivers
2. Construct a 2x2 matrix of scenarios
3. Develop a detailed narrative for each scenario
4. Identify strategic implications for each scenario
5. Build a strategy that performs reasonably well across all scenarios (or create options to pivot)

**Real Options Thinking**: Treat strategic investments like financial options -- they give you the *right but not the obligation* to pursue a course of action. This reframes uncertainty from a threat to an opportunity:

- **Option to expand**: Start small, invest more if signals are positive
- **Option to abandon**: Build in exit points that limit downside
- **Option to defer**: Wait for more information before committing
- **Option to switch**: Design flexibility into systems and processes

**Minimum Viable Commitment**: Instead of making large, irreversible bets, break decisions into smaller commitments with learning milestones. This is discovery-driven planning (McGrath & MacMillan, HBS):

1. Define the outcome you want
2. Identify the assumptions that must be true for success
3. Design low-cost experiments to test each assumption
4. Commit more resources only as assumptions are validated

### Nassim Taleb's Antifragility

Nassim Nicholas Taleb (whose work is discussed in HBS risk management courses) introduces the concept of **antifragility** -- systems that *benefit* from volatility and uncertainty rather than merely surviving it.

| Category | Response to Stress | Example |
|----------|-------------------|---------|
| **Fragile** | Breaks under pressure | A rigid supply chain with single suppliers |
| **Robust** | Withstands pressure | A diversified supply chain |
| **Antifragile** | Grows stronger under pressure | A company that learns from market shocks and adapts |

To build antifragility:
- Maintain optionality (many small bets, not one big bet)
- Embrace small failures as learning opportunities
- Build slack and reserves (cash, talent, capacity)
- Avoid catastrophic downside (the "barbell strategy": very safe + very speculative, nothing in between)

### Common Decision Traps Under Uncertainty

1. **Analysis paralysis**: Waiting for certainty that will never arrive
2. **False precision**: Treating rough estimates as exact numbers
3. **Overconfidence**: Believing you can predict the unpredictable
4. **Anchoring**: Fixating on the first scenario or number you encounter
5. **Sunk cost fallacy**: Continuing a failing project because of prior investment

### Key Takeaway

Risk can be managed with data and probability. Uncertainty requires scenario planning, optionality, and the humility to act without complete information. The best leaders are not those who avoid uncertainty but those who build organizations capable of thriving in it.

**Sources**: Knight, F. H. (1921). *Risk, Uncertainty, and Profit*. Houghton Mifflin. Schwartz, P. (1991). *The Art of the Long View*. Doubleday. McGrath, R. G. & MacMillan, I. C. (1995). "Discovery-Driven Planning." *Harvard Business Review*. Taleb, N. N. (2012). *Antifragile*. Random House.`,
    },
    {
      id: "lm-cognitive-biases",
      slug: "cognitive-biases-leadership",
      title: "Cognitive Biases in Leadership",
      content: `## Cognitive Biases in Leadership

Daniel Kahneman's *Thinking, Fast and Slow* (2011) -- required reading in many HBS courses -- revealed that human decision-making is systematically flawed. Our brains use mental shortcuts (heuristics) that are usually helpful but can lead to **predictable, systematic errors** (biases). Leaders who understand these biases can design processes that counteract them.

### System 1 vs. System 2 Thinking

Kahneman identifies two modes of thinking:

**System 1 (Fast)**: Automatic, intuitive, effortless. Operates unconsciously. Prone to biases.
- Recognizing a friend's face
- Sensing that someone is angry
- Completing "bread and ..."

**System 2 (Slow)**: Deliberate, analytical, effortful. Requires conscious attention. More accurate but easily depleted.
- Calculating 17 x 24
- Evaluating a business case
- Comparing two job candidates

Most business decisions are made by System 1, even when they should be made by System 2. This is because System 2 is "lazy" -- it requires energy, and our brains conserve energy by defaulting to System 1 whenever possible.

### The Most Dangerous Biases for Leaders

**1. Confirmation Bias**
We seek, interpret, and remember information that confirms our existing beliefs while ignoring information that contradicts them.

*Leadership impact*: A CEO who believes a strategy is working will unconsciously filter data to support that belief. Bad news gets dismissed; good news gets amplified.

*Countermeasure*: Actively seek disconfirming evidence. Assign someone the role of "devil's advocate." Ask: "What evidence would change my mind?"

**2. Overconfidence Bias**
We systematically overestimate our knowledge, abilities, and the precision of our beliefs. Studies show that when people say they are "90% certain," they are correct only about 70% of the time.

*Leadership impact*: Leaders overestimate their ability to predict market trends, project timelines, and strategic outcomes. This leads to overly ambitious plans with insufficient contingencies.

*Countermeasure*: Use reference class forecasting -- compare your situation to similar past situations rather than relying on your own projections.

**3. Anchoring Bias**
We are disproportionately influenced by the first piece of information we encounter (the "anchor"), even when it is irrelevant.

*Leadership impact*: In negotiations, the first number mentioned heavily influences the final outcome. In budgeting, last year's budget anchors this year's allocation.

*Countermeasure*: Be deliberate about which information you see first. Generate your own estimate before looking at others' numbers.

**4. Sunk Cost Fallacy**
We continue investing in a losing proposition because of what we have already invested, rather than evaluating the decision based on future costs and benefits.

*Leadership impact*: Companies pour more money into failing projects because "we've already invested \$50 million." The past investment is irrelevant to the future decision.

*Countermeasure*: Ask: "If we were starting from scratch today, would we invest in this?" If no, stop investing.

**5. Availability Bias**
We overweight information that is easily recalled (recent, vivid, emotional) and underweight information that is harder to recall.

*Leadership impact*: A dramatic product failure gets disproportionate attention, while a slow-building competitive threat goes unnoticed because it is not vivid.

*Countermeasure*: Use data and systematic analysis rather than relying on memory. Ask: "Am I reacting to data or to a recent anecdote?"

**6. Status Quo Bias**
We prefer the current state of affairs and resist change, even when change would be beneficial.

*Leadership impact*: Organizations continue strategies, processes, and structures long after they have stopped working because change feels risky.

*Countermeasure*: Regularly ask: "If we were designing this from scratch, would we do it this way?"

**7. Survivorship Bias**
We study successes and draw conclusions while ignoring failures that are equally informative but invisible.

*Leadership impact*: "Steve Jobs dropped out of college, so formal education does not matter." This ignores the millions who dropped out and did not become Steve Jobs.

*Countermeasure*: Always ask: "What does the full population look like, including failures?"

### Debiasing Strategies

| Strategy | Biases It Addresses |
|----------|-------------------|
| Devil's advocate | Confirmation bias, groupthink |
| Pre-mortem analysis | Overconfidence, planning fallacy |
| Reference class forecasting | Overconfidence, anchoring |
| Decision journals | All biases (through reflection) |
| Diverse decision teams | Confirmation bias, groupthink |
| Checklists and structured processes | Availability bias, anchoring |
| Blind evaluations | Halo effect, confirmation bias |

### Key Takeaway

Cognitive biases are not character flaws -- they are features of how the human brain works. Leaders cannot eliminate biases, but they can design decision-making processes that reduce their impact. The most important step is awareness: knowing that your brain systematically misleads you is the first defense against being misled.

**Sources**: Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux. Kahneman, D., Lovallo, D., & Sibony, O. (2011). "Before You Make That Big Decision." *Harvard Business Review*. Bazerman, M. H. & Moore, D. A. (2013). *Judgment in Managerial Decision Making*. Wiley.`,
    },
    {
      id: "lm-group-decisions",
      slug: "group-decision-making",
      title: "Group Decision Making (Groupthink & Devil's Advocate)",
      content: `## Group Decision Making

Irving Janis' concept of **Groupthink** (1972), extensively analyzed at Harvard Business School, describes one of the most dangerous dynamics in organizational decision-making: when a group's desire for harmony and conformity overrides realistic appraisal of alternatives, leading to irrational or disastrous decisions.

### Groupthink: The Pathology of Group Decisions

Janis studied some of the worst policy decisions in US history -- the Bay of Pigs invasion, the escalation of the Vietnam War, the failure to anticipate Pearl Harbor -- and found a common pattern: highly intelligent, well-intentioned groups made catastrophically bad decisions because **social pressure suppressed dissent and critical thinking**.

### Symptoms of Groupthink

1. **Illusion of invulnerability**: The group believes it cannot fail, leading to excessive risk-taking
2. **Collective rationalization**: Warnings and disconfirming data are dismissed
3. **Belief in inherent morality**: The group assumes its decisions are morally right, discouraging ethical questioning
4. **Stereotyping outsiders**: Critics and opponents are viewed as incompetent or hostile
5. **Pressure on dissenters**: Members who question the consensus face social pressure to conform
6. **Self-censorship**: Individuals withhold doubts to maintain group harmony
7. **Illusion of unanimity**: Silence is interpreted as agreement
8. **Self-appointed mindguards**: Some members protect the group from information that might shatter consensus

### Conditions That Breed Groupthink

| Condition | Description |
|-----------|-------------|
| High group cohesion | Members value group membership and fear exclusion |
| Insulation from outside opinions | The group does not seek external input |
| Directive leadership | The leader states preferences early, signaling the "right" answer |
| Lack of formal procedures | No structured process for evaluating alternatives |
| Homogeneity | Members share similar backgrounds and perspectives |
| High stress with low hope | External threats create urgency that shortcuts critical thinking |

### Case Study: The Space Shuttle Challenger (1986)

The Challenger disaster is perhaps the most cited groupthink case in business education:

- NASA engineers at Morton Thiokol warned that O-ring seals could fail in cold temperatures
- The launch was politically pressured (teacher-in-space program, multiple delays)
- Engineers who raised concerns were pressured to prove the launch was *unsafe* rather than proving it was *safe* (a reversal of the normal burden of proof)
- Dissenting engineers were overruled by managers
- The shuttle launched in 36-degree weather and exploded 73 seconds later, killing all seven crew members

**Groupthink dynamics present**: Pressure on dissenters, collective rationalization, illusion of invulnerability, self-censorship by junior engineers.

### Antidotes to Groupthink

**1. Devil's Advocate**
Formally assign someone the role of challenging every assumption, conclusion, and recommendation. Rotate the role so no one person is always "the critic."

**2. Red Team / Blue Team**
Split the group into two teams. One team develops the proposal (Blue). The other team's sole job is to find flaws, risks, and alternatives (Red). Used extensively by the US military and intelligence agencies.

**3. Leader Speaks Last**
The leader withholds their opinion until everyone else has spoken. When leaders speak first, they anchor the conversation and discourage dissent. Jeff Bezos is known for letting subordinates present their views before sharing his own.

**4. Anonymous Input**
Collect opinions anonymously before group discussion. This eliminates social pressure and reveals the true distribution of views. Tools: anonymous surveys, written pre-meeting input, blind voting.

**5. Outside Experts**
Invite external perspectives -- consultants, advisors, customers, or colleagues from other departments. Fresh eyes see things the in-group cannot.

**6. Second-Chance Meetings**
After reaching a preliminary decision, schedule a second meeting where the sole purpose is to voice doubts and reconsider. This gives "sleeping on it" a formal structure.

**7. Diverse Teams**
Research consistently shows that diverse teams (in background, experience, thinking style) make better decisions because they bring different perspectives and challenge each other's assumptions. Homogeneous teams reach consensus faster but with lower quality.

### When Groups Outperform Individuals

Despite groupthink risks, groups *can* make better decisions than individuals when:

- The problem requires diverse knowledge and perspectives
- The group has a structured decision process
- Dissent is encouraged and rewarded
- The leader facilitates rather than directs
- Information is shared openly

James Surowiecki's *The Wisdom of Crowds* argues that groups outperform individuals when four conditions are met: diversity of opinion, independence (members form opinions without peer pressure), decentralization (members have different information), and aggregation (there is a mechanism for combining opinions).

### Psychological Safety: The Foundation

Amy Edmondson, Harvard Business School professor, established that **psychological safety** -- the belief that one will not be punished for speaking up -- is the prerequisite for avoiding groupthink. Without psychological safety, all the formal techniques (devil's advocate, red teams) are empty rituals because people will not genuinely challenge the consensus.

Leaders create psychological safety by:
- Acknowledging their own mistakes publicly
- Thanking people for raising concerns
- Never punishing bearers of bad news
- Asking questions rather than making statements
- Responding to challenges with curiosity, not defensiveness

### Key Takeaway

Group decision-making is powerful when done well and dangerous when done poorly. The key is creating structures that encourage dissent, diverse perspectives, and rigorous analysis while maintaining the cohesion needed for effective action. The leader's role is not to have the best answer but to create conditions where the best answer can emerge.

**Sources**: Janis, I. L. (1972). *Victims of Groupthink*. Houghton Mifflin. Edmondson, A. C. (2019). *The Fearless Organization*. Wiley. Surowiecki, J. (2004). *The Wisdom of Crowds*. Doubleday. HBS case studies on Challenger, Bay of Pigs, and organizational decision failures.`,
    },
  ],
};
