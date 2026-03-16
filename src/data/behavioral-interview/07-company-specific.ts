import { Module } from "../types";

export const companySpecificModule: Module = {
  id: "behavioral-company-specific",
  title: "Company-Specific Preparation",
  description: "Tailor your behavioral preparation for Amazon, Google, Meta, Microsoft, and other top tech companies.",
  lessons: [
    {
      id: "amazon-leadership-principles",
      slug: "amazon-leadership-principles",
      title: "Amazon Leadership Principles",
      content: `# Amazon Leadership Principles

## The Foundation of Amazon's Interview Process

Amazon's behavioral interview is unlike any other in tech. Every single interviewer in your loop is assigned specific **Leadership Principles (LPs)** to evaluate. There are 16 LPs, and Amazon takes them seriously — they are not corporate wallpaper. Interviewers have rubrics tied directly to these principles, and the debrief committee discusses each LP by name.

## All 16 Leadership Principles at a Glance

| # | Principle | Core Question | What They Want to See |
|---|---|---|---|
| 1 | **Customer Obsession** | Do you start with the customer? | Decisions driven by customer impact, not internal convenience |
| 2 | **Ownership** | Do you think beyond your team? | Long-term thinking; never saying "that's not my job" |
| 3 | **Invent and Simplify** | Do you find simpler solutions? | Innovation that reduces complexity, not adds it |
| 4 | **Are Right, A Lot** | Do you have good judgment? | Strong instincts informed by data; willingness to change your mind |
| 5 | **Learn and Be Curious** | Do you keep growing? | Self-driven learning; exploring beyond your domain |
| 6 | **Hire and Develop the Best** | Do you raise the talent bar? | Mentoring, hiring standards, developing others |
| 7 | **Insist on the Highest Standards** | Do you refuse to accept mediocrity? | Pushing for quality even when "good enough" is tempting |
| 8 | **Think Big** | Do you set bold direction? | Vision that goes beyond incremental improvement |
| 9 | **Bias for Action** | Do you act without waiting? | Speed over perfection when decisions are reversible |
| 10 | **Frugality** | Do you do more with less? | Resourcefulness; achieving results without throwing money at problems |
| 11 | **Earn Trust** | Do you listen and speak candidly? | Vulnerability, honesty, benchmarking yourself against the best |
| 12 | **Dive Deep** | Do you get into the details? | Metrics awareness; no task is beneath you |
| 13 | **Have Backbone; Disagree and Commit** | Do you challenge and then commit? | Respectful pushback when you disagree, then full commitment to the decision |
| 14 | **Deliver Results** | Do you deliver on time and with quality? | Focus on key inputs; delivering despite setbacks |
| 15 | **Strive to be Earth's Best Employer** | Do you care about your people? | Creating safe, productive, diverse work environments |
| 16 | **Success and Scale Bring Broad Responsibility** | Do you consider broader impact? | Environmental and social awareness in decision-making |

## How Amazon Interviews Actually Work

Each interviewer in your loop (typically 4-5 people) is assigned 2-3 LPs to evaluate. They will ask behavioral questions specifically designed to probe those LPs. The structure is:

1. **One question per LP** — "Tell me about a time when..." mapped to a specific principle
2. **Deep follow-up probes** — Amazon interviewers probe harder than most. Expect 4-6 follow-ups per story.
3. **The Bar Raiser** — One interviewer in your loop is a specially trained "Bar Raiser" from outside your target team. Their job is to ensure the hiring bar stays high. They can veto an offer.

## Mapping Your Stories to LPs

The most effective Amazon prep strategy is building an LP coverage matrix:

| Story | Primary LP | Secondary LP | Tertiary LP |
|---|---|---|---|
| Payment system recovery | Customer Obsession | Dive Deep | Deliver Results |
| Pushed back on PM's timeline | Have Backbone | Ownership | Insist on Highest Standards |
| Mentored junior engineer | Hire and Develop the Best | Earn Trust | Learn and Be Curious |

Aim for at least 2 stories per LP. Some LPs (Customer Obsession, Ownership, Deliver Results) come up in almost every loop. Others (Think Big, Frugality) appear less frequently but you should still have stories ready.

## The Amazon Follow-Up Depth

Amazon interviewers are trained to probe until they hit bedrock. A typical sequence:

> "Tell me about a time you disagreed with your manager."
> "What specifically did you disagree about?"
> "How did you communicate your disagreement?"
> "What data did you use to support your position?"
> "What happened after you disagreed?"
> "If your manager still disagreed, what did you do?"
> "Looking back, were you right?"

Prepare for 5+ follow-ups on every story. If you cannot answer at this depth, the story is not ready.

## Key LP Combinations

Certain LPs frequently appear together in a single question:

- **Customer Obsession + Dive Deep** — "Tell me about a time you dug into data to solve a customer problem"
- **Ownership + Bias for Action** — "Tell me about a time you took on something outside your scope without being asked"
- **Have Backbone + Earn Trust** — "Tell me about a time you disagreed with your team and how you handled it"

## Practice Prompt

Pick three LPs from the table above. For each, identify a story from your experience that demonstrates it. Can you survive 5 follow-up probes on each story? If not, mine for a deeper story or build out more detail.`
    },
    {
      id: "google-googliness",
      slug: "google-googliness",
      title: "Google's Googliness & Leadership",
      content: `# Google's Googliness & Leadership

## What Google Actually Evaluates

Google's interview process evaluates four signals. Two are technical (General Cognitive Ability and Role-Related Knowledge) and two are behavioral: **Leadership** and **Googliness**. The behavioral round is a standalone 45-minute interview focused on these two dimensions.

## The Four Google Hiring Signals

| Signal | What It Means | How It's Tested |
|---|---|---|
| **General Cognitive Ability** | Problem-solving and learning ability | Technical interviews |
| **Role-Related Knowledge** | Skills specific to the job | Technical interviews |
| **Leadership** | Ability to influence, step up, and navigate ambiguity | Behavioral questions |
| **Googliness** | Culture fit, collaboration, comfort with ambiguity, doing the right thing | Behavioral questions |

## Understanding Googliness

"Googliness" is Google's most unique and most misunderstood evaluation criterion. It is NOT about being quirky or fun. It evaluates:

| Googliness Trait | What They Look For | Example Signal |
|---|---|---|
| **Comfort with ambiguity** | Can you make progress without perfect information? | "I had 60% of the data I wanted but moved forward because delay was costlier than imperfection" |
| **Collaborative nature** | Do you default to teamwork or individual heroics? | "I brought in the security team early because their perspective would strengthen the design" |
| **Intellectual humility** | Can you change your mind when presented with evidence? | "I was wrong about the architecture choice, and here's how I recognized that" |
| **Bias toward action** | Do you act or analyze endlessly? | "I proposed a 2-week experiment instead of a 6-week study" |
| **Doing the right thing** | Do you prioritize ethics and user well-being? | "I pushed back on a dark pattern even though it would have boosted our engagement metrics" |

## Realistic STAR Example for Googliness

> **Question:** "Tell me about a time you had to navigate ambiguity."
>
> **Situation:** "I was asked to improve the performance of our search indexing pipeline, but the request was deliberately vague — my manager said, 'It's too slow. Figure out what that means and fix it.' No target latency, no specific complaints, no deadline."
>
> **Task:** "I needed to define the problem before I could solve it. I had to decide what 'too slow' meant, for whom, and what 'fixed' would look like."
>
> **Action:** "I started by talking to the three main consumer teams of the pipeline. The content team needed fresh search results within 15 minutes of publishing — they were currently seeing 45-minute delays. The analytics team needed end-of-day completeness, not speed. The ML team needed consistent throughput for training data and was getting variable batch sizes. These were three different performance problems. I proposed a phased approach: first, address the content team's latency issue since it directly affected user-facing search quality. I profiled the pipeline and found that 70% of the delay was in a single serialization step that could be parallelized. I set a target of under 15 minutes for content freshness, implemented the parallel serialization, and measured against that target. For the other two teams, I wrote up the findings and proposed next steps for the following quarter."
>
> **Result:** "Content indexing latency dropped from 45 minutes to 8 minutes. The content team stopped complaining. My manager's feedback was that he appreciated that I had scoped the ambiguous request into concrete sub-problems with clear success criteria before starting to code. The phased plan for the other two teams was approved and executed the next quarter."

## Google's Leadership Signal

Google's definition of leadership is broader than "managing people." They evaluate **emergent leadership** — the ability to step up and lead when the situation demands it, regardless of your title:

| Leadership Indicator | What It Looks Like |
|---|---|
| **Stepping up** | You took ownership of a problem nobody else was addressing |
| **Influencing without authority** | You convinced a peer team to change their approach |
| **Navigating conflict** | You mediated a disagreement and drove resolution |
| **Setting direction** | You defined the roadmap for a project or initiative |
| **Developing others** | You mentored someone and they grew as a result |

You do not need management experience. Some of the strongest leadership stories come from individual contributors who influenced outcomes through expertise and persuasion.

## Google-Specific Interview Tips

1. **Use "I" not "we"** — Google interviewers are explicitly trained to listen for individual contribution
2. **Show intellectual humility** — Stories where you changed your mind score higher than stories where you were right all along
3. **Demonstrate collaborative instincts** — Google's culture prizes "working across boundaries." Show that you seek input rather than operate in isolation
4. **Be concise** — Google behavioral interviews typically cover 4-5 questions in 45 minutes. If you spend 15 minutes on one answer, you lose opportunities to demonstrate range

## Common Follow-Up Questions at Google

- "What would you do if you had more time/data/resources?"
- "How did others on the team view your approach?"
- "What was the most uncertain moment, and how did you handle it?"
- "Would you make the same decision today?"

## Practice Prompt

Identify a story that demonstrates comfort with ambiguity — a time when you had to define the problem, not just solve it. Can you explain how you scoped the ambiguity into concrete sub-problems? Can you show intellectual humility somewhere in the story? Practice telling it in 90 seconds.`
    },
    {
      id: "meta-core-values",
      slug: "meta-core-values",
      title: "Meta's Core Values",
      content: `# Meta's Core Values

## How Meta Evaluates Behavioral Fitness

Meta's behavioral interview evaluates candidates against their core operating values. Unlike Amazon's exhaustive LP system, Meta focuses on a tighter set of values that reflect their engineering culture: speed, boldness, impact, and openness.

## Meta's Core Values

| Value | What It Means at Meta | What They Ask About |
|---|---|---|
| **Move Fast** | Ship quickly; prefer speed over perfection for reversible decisions | "Tell me about a time you shipped something quickly" |
| **Be Bold** | Take smart risks; try big things even if they might fail | "When did you take a risk that others wouldn't?" |
| **Focus on Impact** | Work on what matters most, not what's most comfortable | "How do you decide what to work on?" |
| **Be Open** | Share information freely; give and receive direct feedback | "Tell me about a time you gave tough feedback" |
| **Build Social Value** | Consider the broader societal impact of your work | "How do you think about the downstream effects of what you build?" |

## The Meta Engineering Culture

Understanding Meta's engineering culture helps you choose the right stories:

- **Code wins arguments** — Meta values engineers who build prototypes to test ideas rather than debating in documents
- **Ownership is expected** — There is no "that's not my team's code." If you find a bug, you fix it.
- **Impact is measured in shipped products** — Internal tools and processes matter less than things that reach users
- **Direct communication** — Meta's feedback culture is famously direct. Sugarcoating is seen as a weakness, not politeness.

## Realistic STAR Example for "Move Fast"

> **Question:** "Tell me about a time you had to move fast."
>
> **Situation:** "Our competitive intelligence team flagged that a competitor was about to launch a feature nearly identical to one we had been planning for Q3. We were in early design phase — at our current pace, we were 8 weeks from launch."
>
> **Task:** "My product manager asked if there was any way to launch a viable version in 3 weeks. I was the senior engineer on the feature."
>
> **Action:** "I spent one day identifying the minimum feature set that would deliver the core user value — I cut the scope from 12 requirements to 4, focusing on the three that users would actually see on day one and one infrastructure requirement for data integrity. I proposed cutting our custom analytics integration and using our existing event logging with a post-launch migration plan. I also identified two parallelization opportunities: the frontend and backend could develop against a shared API contract simultaneously, and I could do the database migration while the frontend engineer built the UI. I set up a shared Slack channel with daily 15-minute standups — no other meetings. When the QA team flagged that full regression testing would take 5 days, I proposed a risk-based testing strategy: full coverage on the data path, smoke tests on the UI, and a 5% canary rollout that would catch UX issues with real users before full launch."
>
> **Result:** "We launched in 18 days — beating the competitor by 4 days. The initial feature had 91% of the engagement of what our full design would have delivered. We shipped the remaining features over the next three weeks. The PM told me it was the fastest she had ever seen a feature go from concept to production. The approach — scope-cutting to minimum viable value, parallel workstreams, and risk-based testing — became a playbook our team reused for two more time-sensitive launches that year."

## Realistic STAR Example for "Focus on Impact"

> **Question:** "How do you decide what to work on?"
>
> **Situation:** "After joining a new team, I inherited a backlog of about 40 items that the previous engineer had accumulated. Some were bug fixes, some were feature requests, and some were tech debt items. My manager said I had full autonomy to prioritize."
>
> **Task:** "I needed to determine which of these 40 items would create the most impact for our users and the team."
>
> **Action:** "I spent two days building an impact-effort matrix. For each item, I estimated the user-facing impact (using our analytics data to determine how many users were affected) and the engineering effort. I then plotted all 40 items on a 2x2 grid. The results surprised me: the three highest-impact items were not the ones flagged as urgent. The 'urgent' items were mostly internal tooling requests from one loud stakeholder. The true high-impact items were a checkout flow bug affecting 12% of mobile conversions, an API timeout causing 3% of search requests to fail, and a missing cache layer that was costing us \$8K/month in unnecessary compute. I presented the analysis to my manager with a clear recommendation: tackle these three first, then address the stakeholder tooling requests. I included the data showing the relative impact."
>
> **Result:** "The checkout fix alone recovered an estimated \$180K in annual revenue. The API timeout fix reduced search errors from 3% to 0.1%. The cache optimization cut our compute bill by \$8K/month. All three shipped in the first six weeks. The stakeholder whose tooling requests were deprioritized was initially frustrated, but when I showed them the impact comparison, they agreed with the prioritization. My manager called it 'the best first month any engineer has had on this team.'"

## Meta-Specific Interview Tips

1. **Lead with action, not analysis** — Meta values doing over deliberating. Show that you built, shipped, and measured.
2. **Show boldness in risk-taking** — Stories about calculated risks score high. Stories about playing it safe do not.
3. **Quantify with user impact** — Frame results in terms of users affected, not internal metrics.
4. **Demonstrate direct communication** — Stories where you gave or received uncomfortable but honest feedback resonate with Meta's culture.
5. **Keep answers tight** — Meta behavioral rounds move fast. Aim for 90-second initial answers.

## Common Follow-Up Questions at Meta

- "What would you cut if you had even less time?"
- "How did you know the risk was worth taking?"
- "What was the biggest tradeoff you made?"
- "How do you balance speed with quality?"

## Practice Prompt

Find a story that shows you moving fast without sacrificing what matters. What did you cut? What did you protect? How did you decide which was which? Can you tell it in 90 seconds?`
    },
    {
      id: "microsoft-growth-mindset",
      slug: "microsoft-growth-mindset",
      title: "Microsoft's Growth Mindset",
      content: `# Microsoft's Growth Mindset

## The Cultural Transformation That Changed Microsoft's Hiring

When Satya Nadella became CEO in 2014, he made "growth mindset" the centerpiece of Microsoft's cultural transformation. It is not a buzzword — it fundamentally changed how Microsoft interviews, promotes, and evaluates employees. If you are interviewing at Microsoft, growth mindset is not just one signal among many. It is **the** lens through which everything else is evaluated.

## Fixed vs. Growth Mindset at Microsoft

The concept, drawn from Carol Dweck's research, distinguishes two orientations:

| Fixed Mindset | Growth Mindset |
|---|---|
| "I'm smart enough to figure this out alone" | "I don't know this yet, but I can learn" |
| Avoids challenges that might expose weakness | Seeks challenges as opportunities to grow |
| Views feedback as criticism | Views feedback as data |
| Feels threatened by others' success | Is inspired by and learns from others' success |
| Proves competence | Develops competence |

Microsoft interviewers are specifically trained to listen for growth mindset signals. A technically brilliant candidate with a fixed mindset will often lose to a slightly less experienced candidate who demonstrates genuine curiosity and learning orientation.

## Microsoft's Three Behavioral Pillars

Microsoft structures its behavioral evaluation around three pillars, all viewed through the growth mindset lens:

| Pillar | Key Questions | Growth Mindset Signal |
|---|---|---|
| **Collaborate** | How do you work with others? Do you seek diverse perspectives? | "I realized I had a blind spot, so I brought in someone with a different background" |
| **Drive Results** | How do you achieve outcomes despite obstacles? | "The first approach failed, so I tried a fundamentally different strategy" |
| **Customer Focus** | How do you understand and serve customer needs? | "I thought I knew what users wanted, but the data showed something different, so I changed course" |

## Realistic STAR Example

> **Question:** "Tell me about a time you had to learn something new to solve a problem."
>
> **Situation:** "Our team was tasked with building a machine learning pipeline for detecting anomalous user behavior. I was a backend engineer with zero ML experience. The data science team had built the model, but they needed an engineer to build the production inference pipeline, and I was the only one available."
>
> **Task:** "I needed to build a reliable, low-latency inference service that could run the data science team's model in production — something I had never done before."
>
> **Action:** "I was honest with my manager that I had a significant learning curve. Rather than pretending I could figure it out alone, I asked the data science team lead if I could shadow her for two days to understand how the model worked, what inputs it needed, and what failure modes were expected. I then spent one week going through an online course on ML serving patterns — specifically batch vs. real-time inference, feature stores, and model versioning. I read three engineering blog posts from companies that had built similar systems. By week two, I had enough context to design the pipeline. I leaned heavily on the data science team for model-specific decisions while owning the infrastructure: containerized model serving, a feature store for real-time lookups, and a monitoring system that tracked model drift. I held weekly design reviews with the data science lead so she could catch misunderstandings early."
>
> **Result:** "The anomaly detection pipeline shipped in six weeks. It processed 2 million events per day with p99 latency under 200ms. The data science lead told my manager it was the smoothest handoff she had experienced from an engineer. More importantly for my growth, I had built a functional ML engineering skillset. I went on to lead two more ML pipeline projects that year and was asked to write the team's ML serving best practices guide. That guide is still used for onboarding new engineers."

## What Microsoft Interviewers Listen For

| Growth Mindset Signal | Example Phrase |
|---|---|
| Intellectual humility | "I didn't know this, so I asked for help" |
| Learning from failure | "The first approach didn't work, and here's what I learned from that" |
| Curiosity about others' perspectives | "I sought input from the design team because they see user behavior differently than engineers" |
| Embracing challenge | "I volunteered for this because I wanted to grow in this area" |
| Developing others | "I paired with a junior engineer because teaching reinforces my own understanding" |

| Fixed Mindset Red Flag | Example Phrase |
|---|---|
| Intellectual arrogance | "I'm the kind of person who just gets things right" |
| Blame-shifting on failure | "The project failed because the PM didn't scope it properly" |
| Defensiveness about feedback | "My manager's feedback was wrong — I was already doing that" |
| Avoiding stretch assignments | "I stuck with what I knew because the risk wasn't worth it" |
| Competitive framing | "I'm better than most engineers at this" |

## Microsoft-Specific Interview Tips

1. **Show your learning process explicitly** — Don't just say you learned something. Describe *how*: "I read X, asked Y, experimented with Z."
2. **Credit others genuinely** — Microsoft values collaborative success. Naming specific people who helped you is a strength, not a weakness.
3. **Include a failure-to-growth arc** — The most powerful Microsoft stories start with a gap in your knowledge or a wrong assumption, and end with demonstrated growth.
4. **Mention diverse perspectives** — Microsoft cares deeply about inclusion. Stories where you sought out viewpoints different from your own score well.
5. **Demonstrate ongoing curiosity** — End stories with what you are still learning or want to explore next.

## Common Follow-Up Questions at Microsoft

- "What did you learn from that experience?"
- "How would you approach it differently now?"
- "Who helped you along the way?"
- "What are you currently learning or curious about?"

## Practice Prompt

Think of a time you were out of your depth on a project. How did you respond — did you pretend you knew, or did you openly seek help? What was your specific learning strategy? How do you know you actually grew from the experience? Tell the story in under 2 minutes.`
    },
    {
      id: "questions-for-interviewer",
      slug: "preparing-questions-for-interviewer",
      title: "Preparing Questions for the Interviewer",
      content: `# Preparing Questions for the Interviewer

## The Most Underrated Part of the Interview

"Do you have any questions for me?" is not a formality — it is an evaluation opportunity. Interviewers assess the quality of your questions as a signal of your judgment, curiosity, and seriousness about the role. A candidate who asks thoughtful questions leaves a stronger impression than one who says "No, I think you've covered everything."

## What Your Questions Signal

| Question Type | What It Signals | Score Impact |
|---|---|---|
| Thoughtful and specific to the role | Genuine interest, good research, strong judgment | Positive |
| Generic but reasonable | Adequate preparation | Neutral |
| No questions | Low interest, low curiosity, or arrogance | Negative |
| Questions about perks, hours, or vacation first | Wrong priorities | Negative |
| Questions that challenge or dig deeper | Intellectual curiosity, confidence | Strong positive |

## The Question Categories Framework

Prepare 8-10 questions across these categories. You won't ask all of them — pick 2-3 based on who is interviewing you and what has already been discussed.

### Category 1: Team and Role

These show you are thinking seriously about the day-to-day reality of the position.

| Question | Why It's Effective |
|---|---|
| "What does the first 90 days look like for someone in this role?" | Shows you are thinking about ramping up and contributing quickly |
| "What is the biggest technical challenge the team is facing right now?" | Signals that you want hard problems, not easy wins |
| "How does the team decide what to work on each quarter?" | Shows interest in prioritization and product strategy |
| "What does the on-call rotation look like?" | Practical and shows you are thinking about real responsibilities |

### Category 2: Engineering Culture

These reveal how the team operates and whether it matches your working style.

| Question | Why It's Effective |
|---|---|
| "How are design decisions made? Is there a formal RFC process?" | Shows you care about engineering rigor |
| "What does code review look like on this team?" | Signals collaboration awareness |
| "How does the team balance feature work with tech debt?" | Shows engineering maturity |
| "What's the deployment process — how often do you ship to production?" | Practical and reveals engineering velocity |

### Category 3: Growth and Development

These signal growth mindset — especially valuable at Microsoft and Google.

| Question | Why It's Effective |
|---|---|
| "How does the team support professional development?" | Shows you value continuous learning |
| "What does the path from [current level] to [next level] look like here?" | Shows ambition and planning |
| "Is there an opportunity to work across teams or rotate to adjacent areas?" | Signals breadth of interest |

### Category 4: Interviewer-Specific

The most impressive questions are tailored to the specific person interviewing you.

| Question | When to Use It |
|---|---|
| "What made you join this team, and what has kept you here?" | For anyone — builds rapport and gives genuine insight |
| "What's something about this team that surprised you when you joined?" | Surfaces culture details that job descriptions never mention |
| "What do you wish you had known before joining?" | Reveals honest challenges |
| "If you could change one thing about how the team operates, what would it be?" | Shows you understand no team is perfect |

## Questions to Avoid

| Bad Question | Why It's Bad |
|---|---|
| "What does the company do?" | Shows zero research |
| "How much does this role pay?" | Save for the recruiter |
| "How many hours a week do people work?" | Signals wrong priorities for this stage |
| "Did I get the job?" | Puts the interviewer in an awkward position |
| "I don't have any questions" | Signals low interest or low curiosity |
| Questions you could easily Google | Shows laziness |

## Adapting to Your Interviewer

Your questions should vary based on who is asking:

| Interviewer | Best Question Types |
|---|---|
| **Engineering Manager** | Team structure, growth paths, decision-making process |
| **Peer Engineer** | Day-to-day work, tech stack, code review culture |
| **Senior/Staff Engineer** | Architecture decisions, technical challenges, mentorship |
| **Product Manager** | Eng-PM collaboration, how priorities are set |
| **Bar Raiser (Amazon)** | Company culture, cross-team collaboration |

## The Follow-Up Technique

When the interviewer answers your question, follow up with a brief related question. This turns a Q&A into a conversation:

> **You:** "What's the biggest technical challenge the team is facing?"
> **Interviewer:** "We're migrating from a monolith to microservices and it's been complex."
> **You:** "Interesting — how are you handling data consistency across services during the migration? That's been a thorny problem in my experience."

This demonstrates genuine engagement and technical depth simultaneously.

## The Preparation Checklist

Before any behavioral interview, prepare:

| Preparation Item | Status |
|---|---|
| 2-3 questions about the team and role | |
| 2-3 questions about engineering culture | |
| 1-2 questions about growth | |
| 1-2 interviewer-specific questions | |
| Researched the interviewer's LinkedIn profile | |
| Read recent company engineering blog posts | |

## Practice Prompt

For your next interview, write out 8 questions across all four categories. Then for each question, write a follow-up question you could ask based on a plausible answer. Having this preparation makes the Q&A section feel natural instead of scripted.`
    }
  ]
};
