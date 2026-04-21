import { Module } from "../types";

export const changeModule: Module = {
  id: "lm-change",
  title: "Leading Change",
  description: "Master Kotter's 8-step change model, overcome resistance, shape organizational culture, communicate change, and lead turnarounds.",
  lessons: [
    {
      id: "lm-kotter-change",
      slug: "leading-change-kotter",
      title: "Leading Change (Kotter's 8 Steps)",
      content: `## Leading Change (Kotter's 8 Steps)

John Kotter's *Leading Change* (1996) is one of the most influential business books in Harvard Business School history. Based on his observation that **70% of change efforts fail**, Kotter identified eight sequential steps that successful transformations follow -- and eight corresponding errors that cause failure.

### Why Change Fails

Kotter's research identified the most common reasons organizational change efforts fail:

1. Allowing too much complacency (no urgency)
2. Failing to build a powerful guiding coalition
3. Underestimating the power of vision
4. Under-communicating the vision by a factor of 10x (or 100x or 1000x)
5. Permitting obstacles to block the new vision
6. Failing to create short-term wins
7. Declaring victory too soon
8. Neglecting to anchor changes in culture

### The 8-Step Process

**Step 1: Create a Sense of Urgency**

Change starts when people feel that the status quo is more dangerous than the unknown. Without urgency, people will not make the sacrifices needed for change.

Tactics: Share competitive data, identify crises or potential crises, show what happens if you do not change. Aim for 75% of leadership genuinely convinced that business-as-usual is unacceptable.

**Step 2: Build a Guiding Coalition**

No single leader can drive transformation alone. You need a powerful coalition with enough power, expertise, credibility, and leadership to guide the effort.

Characteristics of an effective guiding coalition: position power (enough key players), expertise (diverse viewpoints), credibility (good reputations), and leadership (proven leaders who can drive the process).

**Step 3: Form a Strategic Vision and Initiatives**

Create a clear picture of the future that is easy to communicate and appealing to stakeholders. The vision should be imaginable, desirable, feasible, focused, flexible, and communicable.

Test: Can you describe the vision in five minutes or less and get a reaction that signals both understanding and interest?

**Step 4: Enlist a Volunteer Army (Communicate the Vision)**

Kotter's research found that most companies under-communicate their change vision by a factor of 10. Leaders use only a fraction of 1% of available communication channels to share the vision.

Rules for communicating change: Keep it simple. Use metaphors and analogies. Use every vehicle possible (meetings, memos, informal conversations). Repeat, repeat, repeat. Lead by example (walk the talk). Explain apparent inconsistencies. Listen and be listened to.

**Step 5: Enable Action by Removing Barriers**

Empowerment means removing obstacles that prevent people from acting on the vision: structural barriers (outdated systems, rigid hierarchies), skill barriers (training gaps), systemic barriers (misaligned incentives), and human barriers (supervisors who undermine the change).

**Step 6: Generate Short-Term Wins**

Change takes time, and people lose momentum without visible progress. Plan for and create short-term performance improvements that are visible, unambiguous, and clearly related to the change effort.

Short-term wins serve three purposes: they provide evidence that sacrifices are worth it, they reward change agents, and they undermine cynics and resistors.

**Step 7: Sustain Acceleration**

After early wins, do not declare victory. Use the credibility from short-term wins to tackle bigger problems: systems, structures, and policies that do not fit the vision. Hire, promote, and develop people who can implement the vision. Reinvigorate the process with new projects and themes.

**Step 8: Institute Change in the Culture**

Culture changes last, not first. New approaches sink into the culture only after it is clear that they work and are better than the old ways. Articulate the connections between new behaviors and organizational success. Ensure that the next generation of leaders embody the new approach.

### Common Mistakes in Each Step

| Step | Common Mistake |
|------|---------------|
| 1. Urgency | Confusing urgency with anxiety or crisis mode |
| 2. Coalition | Building a coalition of managers but not leaders |
| 3. Vision | Creating a vision that is too complicated to communicate |
| 4. Communication | Relying on a single announcement instead of ongoing communication |
| 5. Barriers | Not addressing the biggest barrier (often a powerful individual) |
| 6. Short-term wins | Not planning for wins (hoping they happen organically) |
| 7. Acceleration | Declaring victory after the first wins |
| 8. Culture | Trying to change culture first (culture is the outcome, not the input) |

### Key Takeaway

Change is a process, not an event. Kotter's 8 steps provide a roadmap that, when followed in sequence, dramatically increases the probability of successful transformation. The most common errors are moving too fast (skipping steps), not building enough urgency, and declaring victory too early.

**Sources**: Kotter, J. P. (1996). *Leading Change*. Harvard Business Review Press. Kotter, J. P. (2012). "Accelerate!" *Harvard Business Review*. HBS Online, "Leadership Principles" course.`,
    },
    {
      id: "lm-resistance",
      slug: "resistance-to-change",
      title: "Resistance to Change",
      content: `## Resistance to Change

Resistance to change is not a bug -- it is a feature of human psychology. Harvard Business School professor Rosabeth Moss Kanter identified that **people do not resist change per se; they resist the losses they associate with change**. Understanding the psychology of resistance allows leaders to anticipate, address, and even leverage it.

### Why People Resist Change

**1. Loss of Control**: Change imposed on people feels coercive. When people feel they have no voice in the change process, resistance is almost guaranteed.

**2. Excess Uncertainty**: People can handle change better when they know what to expect. The unknown is more threatening than the known, even when the known is bad.

**3. Fear of Incompetence**: "Will I be able to succeed in the new system?" People worry that skills that made them successful will become irrelevant.

**4. Loss of Identity**: "This is not who we are." When change threatens core aspects of professional identity, resistance is deeply emotional.

**5. Disruption of Relationships**: Reorganizations break up teams and reporting relationships that people value. The social cost of change is often underestimated.

**6. Perceived Unfairness**: "Why is this being done to us and not to them?" If change feels inequitable, people resist on principle.

**7. Past Experience**: "We tried this before and it failed." Organizational scar tissue from previous failed changes creates cynicism about new ones.

### The Change Curve

Based on the Kubler-Ross grief model, the **change curve** describes the emotional journey people go through during organizational change:

\`\`\`
Performance
    ^
    |  *
    | * * Shock/    Exploration *  *  *
    |*   Denial    /           * Commitment
    |     *      /            *
    |      *   Resistance   *
    |       * *   /       *
    |        *  Valley  *
    |         * * * * *
    +--------------------------------> Time
\`\`\`

**Phase 1: Shock/Denial** -- "This can't be happening." Productivity drops as people process the news.

**Phase 2: Resistance** -- "This is wrong/unfair/stupid." Active or passive opposition. Productivity hits its lowest point.

**Phase 3: Exploration** -- "Maybe this could work." People begin experimenting with new behaviors. Productivity starts recovering.

**Phase 4: Commitment** -- "This is the new normal." People embrace the change and perform at or above previous levels.

**Leader's role**: Do not try to skip phases. Help people move through them faster by providing information (reduces shock), listening to concerns (validates resistance), offering support and training (enables exploration), and celebrating successes (reinforces commitment).

### Strategies for Overcoming Resistance

**Strategy 1: Education and Communication**
When resistance stems from misinformation or lack of understanding, communicate the rationale for change clearly and repeatedly. Share the business case, the vision, and the expected benefits.

**Strategy 2: Participation and Involvement**
Involve potential resistors in designing the change. People who participate in creating the solution are far less likely to resist it. This is slower but produces stronger buy-in.

**Strategy 3: Facilitation and Support**
When resistance stems from anxiety about competence, provide training, coaching, and emotional support. Show people that they will be equipped to succeed in the new environment.

**Strategy 4: Negotiation**
When specific groups lose something tangible in the change, negotiate incentives or accommodations. This is appropriate when resistors have significant power.

**Strategy 5: Co-optation**
Give a resistor a meaningful role in the change effort. This can convert an opponent into an advocate. But it must be genuine -- tokenism backfires.

**Strategy 6: Explicit and Implicit Coercion**
In urgent situations, leaders may need to use authority to force compliance. This is a last resort because it creates resentment and compliance without commitment.

### Resistance as Useful Information

Savvy leaders do not just overcome resistance -- they **listen to it**:

- Resistance may signal real problems with the change plan
- Frontline employees often see implementation challenges that leaders miss
- The intensity of resistance reveals which aspects of the change are most threatening
- Addressing legitimate concerns early improves the final outcome

### Key Takeaway

Resistance to change is natural and often rational. Effective leaders do not suppress it -- they understand its sources, address legitimate concerns, and create conditions where people can move through the change curve with support rather than coercion.

**Sources**: Kanter, R. M. (2012). "Ten Reasons People Resist Change." *Harvard Business Review*. Kotter, J. P. & Schlesinger, L. A. (2008). "Choosing Strategies for Change." *Harvard Business Review*. Bridges, W. (2009). *Managing Transitions*. Da Capo Press.`,
    },
    {
      id: "lm-org-culture",
      slug: "organizational-culture",
      title: "Organizational Culture (Schein)",
      content: `## Organizational Culture (Schein)

Edgar Schein, professor emeritus at MIT Sloan and one of the most cited scholars in HBS organizational behavior courses, defined organizational culture as **"a pattern of shared basic assumptions learned by a group as it solved its problems of external adaptation and internal integration."** Culture is the invisible force that shapes how people think, feel, and act within an organization.

### Schein's Three Levels of Culture

Schein's most enduring contribution is his model of culture as existing on three levels, from visible to invisible:

**Level 1: Artifacts (Visible)**
What you see, hear, and feel when you walk into an organization:
- Office design and layout
- Dress code
- Technology and tools
- Published values and mission statements
- Rituals and ceremonies
- Stories and legends
- Language and jargon

Artifacts are easy to observe but hard to interpret. An open office plan might signal collaboration or might signal cost-cutting. You cannot understand culture from artifacts alone.

**Level 2: Espoused Beliefs and Values**
What the organization says it believes:
- Strategy statements
- Goals and philosophy
- Justifications for behavior

Espoused values may or may not match actual behavior. A company may say "we value work-life balance" but promote people who work 80-hour weeks. The gap between espoused values and actual behavior is a critical diagnostic tool.

**Level 3: Underlying Assumptions (Invisible)**
The deepest level -- the unconscious, taken-for-granted beliefs that actually drive behavior:
- Assumptions about the nature of human relationships (competitive or collaborative?)
- Assumptions about time (short-term or long-term orientation?)
- Assumptions about human nature (are people basically lazy or basically motivated?)
- Assumptions about truth (is truth determined by authority, consensus, or evidence?)

These assumptions are so deeply embedded that people are not even aware of them. They are "the way things are done around here."

### Culture Eats Strategy for Breakfast

This famous quote (often attributed to Peter Drucker) captures a reality that HBS professors consistently emphasize: **no matter how brilliant your strategy, it will fail if the culture is not aligned.** Strategy tells you *what* to do; culture determines *whether* people will actually do it.

Examples of culture undermining strategy:
- A company pursuing innovation with a risk-averse, blame-oriented culture
- A company pursuing customer centricity with a bureaucratic, internally focused culture
- A company pursuing collaboration with a culture that rewards individual heroes

### How Culture Forms

Schein identifies several mechanisms through which leaders create and reinforce culture:

**Primary Embedding Mechanisms** (most powerful):
1. What leaders pay attention to, measure, and control
2. How leaders react to critical incidents and organizational crises
3. How leaders allocate resources
4. How leaders role-model, teach, and coach
5. How leaders allocate rewards and status
6. How leaders recruit, select, promote, and excommunicate

**Secondary Reinforcement Mechanisms**:
- Organizational design and structure
- Systems and procedures
- Rites and rituals
- Design of physical spaces
- Stories, legends, and myths
- Formal statements of philosophy

### Culture Assessment: The Competing Values Framework

Robert Quinn and Kim Cameron developed the **Competing Values Framework** (CVF), widely used in HBS courses, which identifies four culture types:

| Culture Type | Focus | Values |
|-------------|-------|--------|
| **Clan (Collaborate)** | Internal, flexible | Teamwork, mentoring, participation |
| **Adhocracy (Create)** | External, flexible | Innovation, risk-taking, agility |
| **Market (Compete)** | External, controlled | Results, competition, achievement |
| **Hierarchy (Control)** | Internal, controlled | Efficiency, consistency, process |

Most organizations have elements of all four, but typically one or two types dominate. Understanding your cultural profile helps explain why certain strategies succeed and others fail.

### Changing Culture

Culture change is the hardest type of organizational change. It takes 3-7 years to fundamentally shift an organizational culture.

Steps for culture change:
1. **Diagnose the current culture** honestly (not the espoused values, the actual assumptions)
2. **Define the target culture** aligned with strategic needs
3. **Identify the gap** between current and target
4. **Change leader behavior first** (culture change starts at the top)
5. **Align systems** (incentives, hiring, promotion) with the target culture
6. **Create new rituals and stories** that embody the target culture
7. **Be patient and persistent** (culture change is measured in years, not months)

### Key Takeaway

Culture is the most powerful and most persistent force in any organization. It determines what actually happens regardless of what leaders say should happen. Leaders who want to change their organizations must start by understanding and deliberately shaping culture -- through their own behavior, their decisions about who gets hired, promoted, and rewarded, and the systems they build.

**Sources**: Schein, E. H. (2010). *Organizational Culture and Leadership*. Jossey-Bass. Cameron, K. S. & Quinn, R. E. (2011). *Diagnosing and Changing Organizational Culture*. Jossey-Bass. HBS case studies on cultural transformation.`,
    },
    {
      id: "lm-change-communication",
      slug: "change-communication",
      title: "Change Communication",
      content: `## Change Communication

Harvard Business School research consistently identifies communication as the **single most important factor** in determining whether a change effort succeeds or fails. John Kotter found that most organizations under-communicate the change vision by a factor of 10 to 100. The result: confusion, anxiety, resistance, and ultimately failed transformation.

### Why Change Communication is Different

Communicating change is fundamentally different from normal business communication:

| Normal Communication | Change Communication |
|---------------------|---------------------|
| Informational | Emotional and informational |
| One-time announcement | Continuous and evolving |
| Rational appeal | Must address fears, hopes, and identity |
| One channel sufficient | Requires multiple channels and repetition |
| Facts are enough | Stories and vision are essential |
| Sender-focused | Receiver-focused |

### The Communication Framework for Change

**Phase 1: Preparing for Announcement**
Before announcing any change, prepare:
- Key messages (clear, simple, consistent)
- FAQ document (anticipate every question)
- Manager talking points (managers are the primary communication channel)
- Timeline of what will happen and when
- Support resources (who to contact with questions)

**Phase 2: The Announcement**
The initial announcement sets the tone for everything that follows:
- Be honest about what is changing and why
- Acknowledge the difficulty and the losses
- Paint a clear picture of the future state
- Explain what will NOT change (stability anchors)
- Describe the timeline and next steps
- Provide channels for questions and feedback

**Phase 3: Ongoing Communication**
Change communication is not "one and done." People need repeated, evolving messages:
- Weekly updates on progress
- Stories of early wins and positive outcomes
- Honest acknowledgment of challenges
- Answers to emerging questions
- Recognition of people who are embracing the change

### The Recipient's Questions

When people hear about change, they immediately ask (consciously or unconsciously):

1. **Why?** "Why are we doing this?" (Rational justification)
2. **What?** "What exactly is changing?" (Clarity about scope)
3. **How?** "How will this work?" (Implementation details)
4. **When?** "When will this happen?" (Timeline)
5. **What about me?** "How does this affect me personally?" (The most important question)

Most change communication focuses on #1-4 and neglects #5. Yet **"what about me?" is the question people most want answered**. Until it is answered, they cannot process anything else.

### Channels and Timing

| Channel | Best For | Limitations |
|---------|----------|-------------|
| Town hall / All-hands | Major announcements, vision-casting | Limited Q&A, one-way |
| Manager 1-on-1s | Personal impact, emotional support | Depends on manager quality |
| Email / written memo | Detailed information, reference | Easily ignored, no emotion |
| Video message from leader | Personal connection at scale | One-way, no dialogue |
| Team meetings | Discussion, Q&A, problem-solving | Small audience |
| Intranet / FAQ page | Reference, self-service answers | Requires people to seek it out |
| Informal conversations | Real concerns, honest feedback | Unstructured, may spread rumors |

**Best practice**: Use **all** channels, not just one. Research shows that people need to hear a message **7-12 times** through different channels before it truly registers.

### The Manager's Critical Role

Direct managers are the most important communication channel for change. Employees trust their direct manager more than senior leadership, company email, or town hall meetings.

This means:
- Train managers on the change *before* the general announcement
- Give managers talking points, FAQs, and time to process their own reactions
- Equip managers to have honest conversations about personal impact
- Create feedback loops so managers can surface concerns upward

### Common Communication Mistakes

1. **Corporate-speak**: Using jargon and euphemisms ("right-sizing" instead of "layoffs") destroys trust
2. **False optimism**: Pretending everything is positive when people are losing jobs or facing disruption
3. **Information vacuum**: Saying nothing creates rumor mills that are worse than the truth
4. **One-and-done**: A single announcement followed by silence
5. **Inconsistent messages**: Different leaders saying different things
6. **Ignoring emotion**: Focusing only on rational arguments while people are experiencing fear and grief

### Key Takeaway

Change communication is not about crafting the perfect message -- it is about creating an ongoing dialogue that helps people understand the change, process their emotions, and find their place in the new reality. Communicate more than you think is necessary, through more channels than you think are needed, and always answer the question people most want answered: "What does this mean for me?"

**Sources**: Kotter, J. P. (1996). *Leading Change*. HBS Press. Heath, C. & Heath, D. (2010). *Switch: How to Change Things When Change Is Hard*. Broadway Books. HBS Online, "Leadership Principles" course.`,
    },
    {
      id: "lm-turnaround",
      slug: "turnaround-management",
      title: "Turnaround Management",
      content: `## Turnaround Management

A turnaround is the most intense leadership challenge: reviving a company that is failing or in severe decline. Harvard Business School case studies on turnarounds -- from IBM under Lou Gerstner to Apple under Steve Jobs to Marvel Entertainment under Ike Perlmutter -- reveal consistent patterns in what works and what does not.

### When is a Turnaround Needed?

Warning signs that a turnaround is necessary:
- Consecutive quarters of declining revenue or margin
- Cash flow problems and liquidity concerns
- Loss of key customers or market share
- Departure of top talent
- Low employee morale and engagement
- Board/investor loss of confidence in management
- Competitive threats that current strategy cannot address

### The Turnaround Process

**Phase 1: Crisis Stabilization (Days 1-90)**

The first priority is stopping the bleeding. This requires swift, decisive action:

- **Assess the situation**: How bad is it really? What is the cash position? What are the most urgent threats?
- **Secure liquidity**: Ensure the company can survive long enough to execute the turnaround. This may require cost cuts, asset sales, renegotiating debt, or emergency financing.
- **Cut costs aggressively**: Eliminate unprofitable products, close underperforming locations, reduce headcount if necessary. This is painful but essential.
- **Communicate honestly**: Tell employees, customers, and investors the truth about the situation. Credibility is the turnaround leader's most important asset.

**Phase 2: Strategic Assessment (Days 30-120)**

While stabilizing the crisis, begin the strategic diagnosis:

- What is the root cause of decline? (Not symptoms -- root causes)
- What are the company's core strengths and competitive advantages?
- Which businesses, products, or markets should be kept, fixed, or divested?
- What does the competitive landscape look like?
- What strategic options exist?

**Phase 3: Strategic Renewal (Months 3-18)**

Based on the assessment, make bold strategic choices:

- **Focus**: Narrow the company's scope to its strongest businesses
- **Differentiate**: Rebuild competitive advantage in core areas
- **Invest**: Direct resources to the highest-potential opportunities
- **Restructure**: Redesign the organization to support the new strategy
- **Culture change**: Begin shifting mindsets and behaviors

**Phase 4: Growth and Sustainability (Year 1-3+)**

Once the company is stabilized and refocused, shift to growth:

- Reinvest in innovation and capability building
- Rebuild customer relationships
- Attract and develop talent
- Build organizational capabilities for sustained performance

### Case Study: IBM (Lou Gerstner, 1993)

When Lou Gerstner became CEO of IBM in 1993, the company had lost $8 billion in the previous year and was days from being broken up. Gerstner's turnaround is studied as a masterclass at HBS:

1. **Stabilized the crisis**: Cut $8.9 billion in costs, reduced headcount by 35,000
2. **Made the strategic bet**: Kept IBM integrated (against conventional wisdom to break it up). His insight: customers wanted integrated solutions, not a collection of parts
3. **Shifted the business model**: From hardware to services and software. IBM Global Services became the growth engine.
4. **Changed the culture**: From arrogant and bureaucratic to customer-focused and collaborative. Gerstner said: "Culture isn't just one aspect of the game -- it IS the game."
5. **Results**: IBM's market cap grew from $29 billion to $168 billion during his tenure

### Key Turnaround Leadership Behaviors

**Urgency without panic**: Create a sense that change is imperative while maintaining enough calm for people to think clearly and act effectively.

**Honesty with hope**: Tell the truth about how bad things are while painting a credible picture of a better future.

**Decisive action**: Make tough decisions quickly. In a turnaround, the cost of delay usually exceeds the cost of imperfect decisions.

**Focus**: The biggest temptation in a turnaround is trying to fix everything at once. The best turnaround leaders identify the 3-5 most critical issues and concentrate all energy there.

**Talent decisions**: The most impactful turnaround actions involve people -- putting the right leaders in key positions and, when necessary, removing those who cannot adapt.

### Why Turnarounds Fail

1. **Acting too slowly**: The turnaround leader tries to study the situation for months before acting. By then, it is too late.
2. **Not going deep enough**: Making superficial cuts instead of addressing root causes
3. **Losing key talent**: Good people leave during crises, and without them, the turnaround stalls
4. **Trying to preserve everything**: Unwillingness to make painful trade-offs
5. **Cultural inertia**: Old habits and mindsets persist despite new strategies

### Key Takeaway

Turnarounds require a rare combination of analytical rigor (diagnosing root causes), emotional courage (making painful decisions), and inspirational leadership (giving people hope for the future). The best turnaround leaders stabilize the crisis quickly, make bold strategic bets, and rebuild the organization's culture and capability for sustained success.

**Sources**: Gerstner, L. V. (2002). *Who Says Elephants Can't Dance?* HBS Press. Slatter, S. & Lovett, D. (1999). *Corporate Turnaround*. Penguin. HBS case studies on IBM, Apple, and Marvel turnarounds. Kotter, J. P. (1996). *Leading Change*. HBS Press.`,
    },
  ],
};
