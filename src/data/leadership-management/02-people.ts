import { Module } from "../types";

export const peopleModule: Module = {
  id: "lm-people",
  title: "Managing People",
  description:
    "Master hiring, motivation theory, performance management, coaching, and leading remote and hybrid teams.",
  lessons: [
    {
      id: "lm-hiring-teams",
      slug: "hiring-and-building-teams",
      title: "Hiring & Building Teams",
      content: `## Hiring & Building Teams

"Getting the right people on the bus" is how Jim Collins describes the most important leadership task. Harvard Business School research consistently shows that **the quality of hiring decisions has a greater impact on organizational performance than almost any other managerial activity**. Yet most managers spend less time preparing for interviews than they do for routine meetings.

### The Cost of Bad Hires

Research from the Society for Human Resource Management estimates that a bad hire costs **30-50% of the person's annual salary** for entry-level positions and **up to 5x annual salary** for executive-level positions when you factor in recruitment costs, training, lost productivity, team disruption, and eventual termination.

More importantly, bad hires create **cascading damage**: they demoralize high performers, lower team standards, consume management attention, and in leadership roles, make their own bad hires.

### What to Hire For

Google's Project Oxygen (studied at HBS) analyzed thousands of internal performance reviews to identify what makes an effective employee. The surprising finding: technical skills ranked *last* among eight key attributes. The top predictors were:

1. Being a good coach
2. Empowering the team (not micromanaging)
3. Creating an inclusive environment
4. Being productive and results-oriented
5. Being a good communicator
6. Supporting career development
7. Having a clear vision and strategy
8. Technical expertise

### Structured Interviewing

HBS and organizational psychology research strongly favors **structured interviews** over unstructured conversations:

| Approach | Predictive Validity | Description |
|----------|-------------------|-------------|
| Unstructured interviews | 0.20 (low) | Casual conversation, different questions per candidate |
| Structured interviews | 0.51 (moderate-high) | Same questions, clear rubrics, multiple interviewers |
| Work sample tests | 0.54 (high) | Candidates perform actual job tasks |
| Cognitive ability tests | 0.51 (moderate-high) | Standardized problem-solving assessments |

**How to structure an interview:**
1. Define the competencies required for the role (3-5 key capabilities)
2. Create behavioral questions for each competency ("Tell me about a time when...")
3. Use a consistent rating rubric (1-5 scale with behavioral anchors)
4. Have multiple interviewers assess independently before comparing notes
5. Make decisions based on evidence, not "gut feel"

### Building High-Performance Teams

Patrick Lencioni's *The Five Dysfunctions of a Team* (widely taught at HBS) identifies the five most common team failures as a pyramid:

\`\`\`
              INATTENTION
              TO RESULTS
            (Status and ego)
         AVOIDANCE OF
         ACCOUNTABILITY
       (Low standards)
      LACK OF COMMITMENT
     (Ambiguity, no buy-in)
    FEAR OF CONFLICT
   (Artificial harmony)
  ABSENCE OF TRUST
 (Invulnerability)
\`\`\`

**Layer 1 (Foundation): Trust** -- Team members must feel safe being vulnerable with each other. Without trust, people protect themselves rather than engaging honestly.

**Layer 2: Healthy Conflict** -- Teams that trust each other can engage in productive debate. Without conflict, decisions lack input and commitment.

**Layer 3: Commitment** -- After healthy debate, the team commits to decisions even when individuals disagree. Without commitment, ambiguity reigns.

**Layer 4: Accountability** -- Team members hold each other accountable to standards. Without peer accountability, only the leader polices behavior.

**Layer 5: Results** -- The team focuses on collective results rather than individual status. Without results focus, politics and ego dominate.

### Google's Project Aristotle

Google's research on team effectiveness (Project Aristotle, studied at HBS) found that the single most important factor in team performance is **psychological safety** -- team members' belief that they can take risks, ask questions, and admit mistakes without being punished or humiliated.

The five factors of effective teams (in order of importance):
1. **Psychological safety**: Can we take risks without feeling insecure or embarrassed?
2. **Dependability**: Can we count on each other to do high-quality work on time?
3. **Structure and clarity**: Are goals, roles, and plans clear?
4. **Meaning**: Is the work personally meaningful to each team member?
5. **Impact**: Do we believe our work matters?

### Team Composition

Research by Meredith Belbin identifies nine team roles that high-performing teams need:

- **Action-oriented roles**: Shaper (drives action), Implementer (turns ideas into plans), Completer Finisher (ensures quality)
- **People-oriented roles**: Coordinator (chairs and coordinates), Team Worker (supports harmony), Resource Investigator (explores opportunities)
- **Thinking-oriented roles**: Plant (creative ideas), Monitor Evaluator (analytical judgment), Specialist (deep expertise)

No single person embodies all roles. The best teams have a diversity of roles represented.

### Key Takeaway

Hiring and team-building are the highest-leverage leadership activities. Invest disproportionate time in getting the right people, use structured processes to reduce bias and improve accuracy, and build teams on a foundation of trust and psychological safety.

**Sources**: Collins, J. (2001). *Good to Great*. HBS Press. Lencioni, P. (2002). *The Five Dysfunctions of a Team*. Jossey-Bass. Duhigg, C. (2016). "What Google Learned From Its Quest to Build the Perfect Team." *New York Times*. HBS Online, "Management Essentials" course.`,
    },
    {
      id: "lm-motivation-theory",
      slug: "motivation-theory",
      title: "Motivation Theory (Maslow, Herzberg & Self-Determination)",
      content: `## Motivation Theory

Understanding what motivates people is one of the most important capabilities a leader can develop. Harvard Business School's management curriculum draws on decades of motivation research, from Maslow's hierarchy to modern self-determination theory, to help leaders create environments where people do their best work.

### Maslow's Hierarchy of Needs (1943)

Abraham Maslow proposed that human needs exist in a hierarchy -- lower-level needs must be satisfied before higher-level needs become motivating:

\`\`\`
        /\\
       /  \\  Self-
      / 5  \\ Actualization
     /------\\
    /   4    \\ Esteem
   /----------\\
  /     3      \\ Belonging
 /--------------\\
/       2        \\ Safety
/------------------\\
        1           \\ Physiological
\`\`\`

1. **Physiological**: Food, water, shelter, basic survival
2. **Safety**: Physical safety, financial security, health, stability
3. **Belonging**: Friendship, intimacy, family, community, sense of connection
4. **Esteem**: Achievement, status, recognition, respect
5. **Self-Actualization**: Realizing personal potential, creativity, purpose

**Workplace application**: Before employees can be motivated by purpose and growth (Levels 4-5), their basic needs must be met -- fair pay (Level 1-2), job security (Level 2), positive relationships (Level 3).

**Criticism**: The strict hierarchy is not always observed. People may pursue self-actualization (an artist starving for their art) while neglecting lower needs. The model is a useful heuristic, not a rigid law.

### Herzberg's Two-Factor Theory (1959)

Frederick Herzberg studied what makes people satisfied and dissatisfied at work. His surprising finding: **satisfaction and dissatisfaction are not opposites on the same spectrum -- they are driven by different factors entirely.**

**Hygiene Factors** (prevent dissatisfaction but do not motivate):
- Company policies and administration
- Salary and benefits
- Working conditions
- Job security
- Relationships with supervisors and peers
- Status

**Motivator Factors** (drive satisfaction and intrinsic motivation):
- Achievement
- Recognition
- The work itself (interesting, challenging, meaningful)
- Responsibility
- Growth and advancement
- Learning

**The critical insight**: Paying someone more money eliminates dissatisfaction but does not create motivation. Motivation comes from the *nature of the work* -- autonomy, challenge, meaning, and growth.

**Practical application**: Leaders must address hygiene factors (fair pay, reasonable policies, safe environment) to prevent dissatisfaction. But to actually *motivate* people, they must design work that provides achievement, recognition, autonomy, and growth.

### Self-Determination Theory (Deci & Ryan, 1985)

Edward Deci and Richard Ryan's **Self-Determination Theory (SDT)** is the most influential modern framework for understanding motivation. It has been extensively validated and is frequently cited in HBS courses. SDT identifies three basic psychological needs that, when satisfied, produce intrinsic motivation:

**1. Autonomy**: The need to feel in control of your own behavior and goals. People want to feel that they are the origin of their actions, not merely executing orders.

- **Leader action**: Give people freedom in *how* they accomplish goals, even when the goals themselves are non-negotiable
- **Example**: Netflix's "Freedom and Responsibility" culture gives employees enormous autonomy in exchange for high performance

**2. Competence**: The need to feel effective and capable. People want to master their environment and develop new skills.

- **Leader action**: Provide challenging work, clear feedback, and opportunities for skill development
- **Example**: Google's "20% time" allowed engineers to work on passion projects, building competence in new areas

**3. Relatedness**: The need to feel connected to others. People want to belong, to care for and be cared for.

- **Leader action**: Build team cohesion, encourage collaboration, create a culture of mutual support
- **Example**: Pixar's open office design and daily screenings create a strong sense of community

### Intrinsic vs. Extrinsic Motivation

| Type | Definition | Examples | Effect |
|------|-----------|----------|--------|
| **Intrinsic** | Doing something because it is inherently interesting or enjoyable | Learning, creative work, challenging problems | Sustained, deep engagement |
| **Extrinsic** | Doing something for external reward or to avoid punishment | Bonuses, promotions, avoiding firing | Short-term compliance, potential undermining of intrinsic motivation |

**The Overjustification Effect**: Research shows that adding extrinsic rewards to intrinsically motivating activities can actually *reduce* intrinsic motivation. When people receive a bonus for work they already enjoy, they may reframe the activity as "something I do for the money" rather than "something I do because I love it."

This does not mean compensation does not matter -- it means that **compensation should not be the primary motivational tool for creative, complex work**. Pay people fairly (address Herzberg's hygiene factors), then focus on intrinsic motivators (autonomy, mastery, purpose).

### Dan Pink's Drive (2009)

Daniel Pink synthesized decades of motivation research (including SDT) in *Drive*, widely read in HBS courses. His framework identifies three pillars of intrinsic motivation:

1. **Autonomy**: The desire to direct our own lives
2. **Mastery**: The urge to get better at something that matters
3. **Purpose**: The yearning to do what we do in service of something larger than ourselves

Pink argues that traditional "carrot and stick" motivation (rewards and punishments) works for simple, algorithmic tasks but actually *harms* performance on complex, creative tasks -- which describes most knowledge work.

### Key Takeaway

Effective motivation is not about bigger bonuses or stricter oversight. It is about creating conditions where people experience autonomy, competence, and relatedness. Leaders who understand this shift from "motivating people" (external) to "creating an environment where people are motivated" (internal).

**Sources**: Maslow, A. (1943). "A Theory of Human Motivation." *Psychological Review*. Herzberg, F. (1959). *The Motivation to Work*. Wiley. Deci, E. L. & Ryan, R. M. (1985). *Intrinsic Motivation and Self-Determination in Human Behavior*. Plenum. Pink, D. (2009). *Drive*. Riverhead Books. HBS Online, "Management Essentials" course.`,
    },
    {
      id: "lm-performance-management",
      slug: "performance-management-feedback",
      title: "Performance Management & Feedback",
      content: `## Performance Management & Feedback

Performance management is one of the most universally disliked -- yet critically important -- management activities. A CEB (now Gartner) study found that **95% of managers are dissatisfied with their company's performance management process**, and 90% of HR leaders do not believe it yields accurate information. Harvard Business School research has explored why traditional performance management fails and what effective alternatives look like.

### Why Traditional Performance Reviews Fail

The annual performance review -- a formal, once-a-year evaluation tied to compensation decisions -- has been the standard approach for decades. Research shows it is deeply flawed:

**1. Recency Bias**: Managers remember the last few weeks, not the full year. Performance in January is forgotten by December.

**2. Halo/Horns Effect**: One positive or negative trait colors the entire evaluation. A charismatic employee gets inflated ratings; a quiet but effective employee gets overlooked.

**3. Central Tendency**: Managers cluster ratings in the middle to avoid difficult conversations. Everyone is "meets expectations."

**4. Forced Ranking Damage**: Jack Welch's famous "rank and yank" system (stack ranking employees and firing the bottom 10%) created toxic competition and political behavior. Microsoft, GE, and many others have abandoned it.

**5. Backward-Looking**: Annual reviews focus on what happened rather than how to improve. By the time feedback is delivered, it is too late to change the behavior.

**6. Anxiety-Inducing**: When feedback is rare and tied to compensation, every review becomes high-stakes, triggering defensive reactions rather than learning.

### The Shift to Continuous Feedback

Leading organizations have moved from annual reviews to **continuous performance management**:

| Traditional | Modern |
|-------------|--------|
| Annual review | Ongoing feedback (weekly/monthly) |
| Backward-looking | Forward-looking (growth-oriented) |
| Manager-driven | Two-way conversation |
| Tied to compensation | Separated from compensation |
| Formal, documented | Frequent, informal check-ins |
| Rating scale (1-5) | Qualitative development conversations |

Companies like Adobe (Check-In), Microsoft (Growth Mindset), Deloitte, and GE have all replaced traditional annual reviews with continuous feedback systems.

### The SBI Feedback Model

The **Situation-Behavior-Impact (SBI)** model, developed by the Center for Creative Leadership and widely taught at HBS, provides a simple structure for effective feedback:

**Situation**: Describe the specific situation (when, where)
**Behavior**: Describe the observable behavior (what you saw or heard)
**Impact**: Describe the impact of the behavior (on you, the team, the project)

**Example of effective feedback:**
> "In yesterday's client meeting [Situation], when you interrupted Sarah twice while she was presenting [Behavior], it undermined her credibility with the client and made our team look disorganized [Impact]."

**Why SBI works:**
- It is specific (not vague like "you need to communicate better")
- It focuses on behavior (changeable) not personality (fixed)
- It describes impact (helps the person understand *why* it matters)
- It avoids judgment (describes what happened, not what the person *is*)

### Giving Difficult Feedback

Kim Scott's **Radical Candor** framework (widely read in HBS leadership courses) argues that effective feedback requires two things simultaneously:

\`\`\`
                    Challenge Directly
                         |
         Obnoxious  _____|_____  Radical
         Aggression |    |    | Candor
                    |    |    | (IDEAL)
         ---------- +----+----+ ----------
                    |    |    |
         Manipu-   |    |    | Ruinous
         lative    |____|____| Empathy
         Insincerity     |
                    Care Personally
\`\`\`

**Radical Candor** = Caring personally + Challenging directly. You care enough about the person to tell them the truth, even when it is uncomfortable.

**Ruinous Empathy** = Caring personally but not challenging. You like the person too much to give honest feedback. This is the most common failure mode for kind managers.

**Obnoxious Aggression** = Challenging directly but not caring personally. You tell the truth but in a way that is harsh and demoralizing.

**Manipulative Insincerity** = Neither caring nor challenging. Political behavior -- saying what people want to hear, backstabbing behind closed doors.

### Receiving Feedback

Leaders must also model effective feedback *reception*:

1. **Listen without defending**: The natural response to critical feedback is defensiveness. Resist it.
2. **Ask clarifying questions**: "Can you give me a specific example?"
3. **Thank the person**: Even if you disagree, thank them for the courage to share.
4. **Reflect before responding**: Take 24 hours before deciding what to do with the feedback.
5. **Follow up**: Tell the person what you did with their feedback. This encourages future candor.

### Goal Setting: SMART vs. Stretch

Effective performance management requires clear goals:

**SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound. Good for operational objectives where predictability matters.

**Stretch Goals (OKRs)**: Ambitious targets that push beyond what feels achievable. Good for innovation and growth objectives where breakthrough thinking is needed.

The best systems use both: SMART goals for baseline expectations and stretch goals for development and innovation.

### Key Takeaway

Performance management is shifting from annual judgment to continuous development. The most effective approach combines frequent informal feedback (using models like SBI), radical candor (caring personally while challenging directly), and clear goal-setting. The purpose is not to evaluate people but to help them grow.

**Sources**: Buckingham, M. & Goodall, A. (2015). "Reinventing Performance Management." *Harvard Business Review*. Scott, K. (2017). *Radical Candor*. St. Martin's Press. Cappelli, P. & Tavis, A. (2016). "The Performance Management Revolution." *Harvard Business Review*. HBS Online, "Management Essentials" course.`,
    },
    {
      id: "lm-coaching-mentoring",
      slug: "coaching-and-mentoring",
      title: "Coaching & Mentoring",
      content: `## Coaching & Mentoring

Google's internal research (Project Oxygen) found that **the #1 behavior of effective managers is being a good coach**. Harvard Business School's leadership curriculum treats coaching not as a "nice to have" but as a core leadership competency -- one that directly drives team performance, employee retention, and organizational capability.

### Coaching vs. Mentoring vs. Managing

| Dimension | Coaching | Mentoring | Managing |
|-----------|---------|-----------|---------|
| **Focus** | Performance and development in current role | Career and long-term development | Results and accountability |
| **Approach** | Ask questions, draw out insights | Share experience, provide advice | Direct, assign, evaluate |
| **Relationship** | Often direct manager | Usually not direct manager | Direct manager |
| **Duration** | Ongoing, role-specific | Longer-term, career-spanning | Continuous |
| **Power** | Equal (collaborative) | Asymmetric (mentor is more experienced) | Hierarchical |

### The GROW Model

The **GROW model**, developed by Sir John Whitmore and widely taught in executive education at HBS, provides a simple coaching conversation structure:

**G -- Goal**: What do you want to achieve?
- "What outcome are you looking for?"
- "What would success look like?"
- "What is the specific goal for this conversation?"

**R -- Reality**: What is the current situation?
- "What is happening now?"
- "What have you tried so far?"
- "What obstacles are you facing?"

**O -- Options**: What could you do?
- "What are your options?"
- "What else could you try?"
- "What would you do if you had unlimited resources?"
- "What would you advise someone else in this situation?"

**W -- Will (Way Forward)**: What will you do?
- "Which option will you pursue?"
- "What is your first step?"
- "When will you do it?"
- "How will I know you have done it?"

### The Coaching Mindset

Effective coaching requires a fundamental mindset shift: from "I have the answer" to "you have the answer, and I will help you find it."

**The Manager's Default**: Tell, direct, solve. "Here's what you should do..."
**The Coach's Approach**: Ask, listen, empower. "What do you think you should do?"

Michael Bungay Stanier's *The Coaching Habit* (recommended reading in HBS courses) identifies seven essential coaching questions:

1. **The Kickstart Question**: "What's on your mind?" (opens the conversation)
2. **The AWE Question**: "And what else?" (goes deeper)
3. **The Focus Question**: "What's the real challenge here for you?" (identifies the core issue)
4. **The Foundation Question**: "What do you want?" (clarifies the goal)
5. **The Lazy Question**: "How can I help?" (avoids assuming you know what they need)
6. **The Strategic Question**: "If you're saying yes to this, what are you saying no to?" (forces trade-offs)
7. **The Learning Question**: "What was most useful for you?" (reinforces learning)

### Why Leaders Do Not Coach

Despite its proven effectiveness, most managers do not coach consistently. Common barriers:

**"I don't have time."** Coaching conversations can take 10-15 minutes. The time spent coaching saves hours of correcting, re-doing, and managing problems.

**"It's faster to just tell them."** In the short term, yes. But telling creates dependency. Coaching builds capability that compounds over time.

**"I don't know how."** Coaching is a skill that can be learned. Start with the GROW model and the seven questions above.

**"They should know this already."** Maybe. But they clearly do not, or you would not be having the problem. Meet people where they are, not where you think they should be.

### Building a Coaching Culture

Organizations with strong coaching cultures outperform their peers. Research from the International Coach Federation (ICF) and Human Capital Institute found that organizations with strong coaching cultures have:
- 51% higher revenue compared to peer organizations
- 62% higher employee engagement
- 46% higher employee satisfaction

To build a coaching culture:
1. **Train all managers in basic coaching skills** (GROW model, active listening, powerful questions)
2. **Make coaching a leadership expectation** (include it in performance evaluations)
3. **Model coaching from the top** (senior leaders must coach, not just command)
4. **Create peer coaching structures** (coaching circles, buddy systems)
5. **Measure and reward coaching behavior** (track coaching conversations, gather feedback from direct reports)

### Mentoring Best Practices

For mentoring relationships:
- **Match thoughtfully**: Shared values and mutual respect matter more than shared background
- **Set expectations**: How often will you meet? What is the purpose? What are the boundaries?
- **Focus on the mentee's agenda**: The mentee drives the conversation; the mentor provides wisdom and perspective
- **Share stories, not prescriptions**: "Here is what I experienced" is more powerful than "Here is what you should do"
- **Be honest about failures**: Mentees learn more from mentors' mistakes than from their successes
- **Know when to end**: Mentoring relationships have natural lifespans. End gracefully when the purpose has been served

### Key Takeaway

Coaching is the highest-leverage leadership activity. It builds capability that compounds over time, creates engagement and retention, and develops the next generation of leaders. The shift from "manager as problem-solver" to "manager as coach" is the single most impactful leadership development a manager can make.

**Sources**: Whitmore, J. (2009). *Coaching for Performance*. Nicholas Brealey. Stanier, M. B. (2016). *The Coaching Habit*. Box of Crayons Press. Ibarra, H. & Scoular, A. (2019). "The Leader as Coach." *Harvard Business Review*. HBS Online, "Management Essentials" course.`,
    },
    {
      id: "lm-remote-hybrid",
      slug: "managing-remote-hybrid-teams",
      title: "Managing Remote & Hybrid Teams",
      content: `## Managing Remote & Hybrid Teams

The COVID-19 pandemic forced the largest remote work experiment in human history. Harvard Business School professors Tsedal Neeley, Prithwiraj Choudhury, and others have extensively researched what makes remote and hybrid work successful. Their findings reveal that **remote work is not simply "office work done from home" -- it requires fundamentally different management approaches**.

### The New Reality

By 2024, hybrid work has become the dominant model for knowledge work:
- **12-15%** of workers are fully remote
- **55-60%** work in hybrid arrangements (some days office, some days remote)
- **25-30%** are fully on-site

Research from Stanford professor Nicholas Bloom (frequently cited at HBS) shows that hybrid work increases productivity by approximately **3-5%** while significantly improving employee satisfaction and retention.

### Challenges of Remote and Hybrid Work

**1. Communication Breakdown**
In an office, information flows informally -- hallway conversations, overhearing discussions, lunch chatter. Remote work eliminates this "ambient information." Important context gets lost, and misunderstandings multiply.

**2. Proximity Bias**
In hybrid environments, managers unconsciously favor employees they see in person. On-site workers get more mentoring, better assignments, and faster promotions. This creates a two-tier system that erodes trust and fairness.

**3. Isolation and Disconnection**
Remote workers report higher rates of loneliness and disconnection from team culture. New employees struggle to build relationships and learn organizational norms.

**4. Work-Life Boundary Erosion**
Without physical separation between work and home, many remote workers work longer hours and struggle to disconnect. Burnout risk increases.

**5. Coordination Challenges**
When team members are in different locations and time zones, scheduling meetings, collaborating in real-time, and maintaining project momentum become harder.

### Tsedal Neeley's Remote Work Framework

Professor Neeley's research identifies five key practices for effective remote leadership:

**1. Establish Clear Norms and Processes**
Remote teams need more explicit structure than co-located teams:
- Communication norms: When to use email vs. Slack vs. video call
- Response time expectations: How quickly should messages be answered?
- Meeting protocols: Camera on or off? Who facilitates? How are decisions recorded?
- Working hours: When is everyone expected to be available?

**2. Over-communicate with Intention**
In remote settings, the default is under-communication. Leaders must deliberately increase communication frequency and richness:
- Share context that would normally be absorbed by proximity
- Repeat key messages across multiple channels
- Use video for complex or sensitive conversations
- Document decisions and share them broadly

**3. Build Trust Deliberately**
Trust must be actively constructed in remote environments:
- Start meetings with personal check-ins (not just task updates)
- Create virtual social spaces (optional coffee chats, team events)
- Share personal stories and vulnerabilities
- Follow through on commitments consistently

**4. Focus on Outputs, Not Activity**
Remote management must shift from monitoring hours to evaluating results:
- Set clear, measurable objectives
- Trust people to manage their own time
- Evaluate based on deliverables, not "time online"
- Resist the urge to surveillance (monitoring mouse movement, requiring cameras on all day)

**5. Invest in Technology and Digital Fluency**
Remote teams need the right tools and the skills to use them:
- Collaboration platforms (Slack, Teams, Notion)
- Video conferencing (Zoom, Teams)
- Project management (Asana, Jira, Linear)
- Shared documentation (Google Docs, Confluence)
- Virtual whiteboarding (Miro, FigJam)

### Managing Hybrid Teams: Additional Challenges

Hybrid adds complexity because you are managing two different experiences simultaneously:

**The Core Principle: Design for Remote First**
Even if most people are in the office most of the time, design processes as if everyone is remote. This means:
- All meetings include a video link (no "room-only" meetings)
- All documents are digital and accessible from anywhere
- All decisions are documented in shared spaces (not just verbal agreements in the office)
- All social events have a remote participation option

**Structured Hybrid Schedules:**
- **Anchor days**: Designate specific days when the whole team is in the office together (e.g., Tuesday and Thursday). Use these days for collaboration, brainstorming, and social connection.
- **Flexible days**: Allow people to choose when to work from home. Trust them to optimize.
- **Quiet days**: Designate certain days as meeting-free for deep work.

### The Manager's Checklist for Remote/Hybrid Teams

| Practice | Frequency |
|----------|-----------|
| One-on-one check-ins | Weekly (30 min) |
| Team meetings | Weekly (structured agenda) |
| Informal team social time | Weekly or bi-weekly |
| Goal and progress reviews | Monthly |
| In-person team gatherings | Quarterly (for remote teams) |
| Career development conversations | Quarterly |
| Anonymous team health surveys | Quarterly |

### Key Takeaway

Managing remote and hybrid teams requires intentional design of communication, trust-building, and evaluation systems. The managers who succeed are those who move from presence-based management (I see you working) to outcome-based management (I see your results) while investing in the human connection that remote work can erode.

**Sources**: Neeley, T. (2021). *Remote Work Revolution*. Harper Business. Choudhury, P. (2020). "Our Work-from-Anywhere Future." *Harvard Business Review*. Bloom, N. (2023). "Hybrid Is the Future of Work." Stanford Research. HBS Online, "Management Essentials" course.`,
    },
  ],
};
