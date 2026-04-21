import { Module } from "../types";

export const validationModule: Module = {
  id: "ent-validation",
  title: "Validation & Lean Startup",
  description: "Master customer discovery, the lean startup methodology, MVPs, customer interviews, and the art of pivoting.",
  lessons: [
    {
      id: "ent-customer-discovery",
      slug: "customer-discovery",
      title: "Customer Discovery (Steve Blank)",
      content: `## Customer Discovery (Steve Blank)

Steve Blank, serial entrepreneur and Stanford/HBS lecturer, revolutionized how startups are built with his **Customer Development** methodology. His core insight: **startups fail not because they cannot build products, but because they build products nobody wants.** The antidote is getting out of the building and talking to customers before building anything.

### The Customer Development Process

Blank's process has four stages:

\`\`\`
Customer     Customer     Customer     Company
Discovery -> Validation -> Creation -> Building
(Search)     (Search)     (Execute)   (Execute)
\`\`\`

**Customer Discovery**: Test whether customers have the problem you think they have. Do NOT sell. Listen.

**Customer Validation**: Test whether customers will pay for your solution. This is where product-market fit begins.

**Customer Creation**: Scale demand through marketing and sales.

**Company Building**: Transition from startup to formal organization.

Most entrepreneurs jump directly to execution (building product and company). Blank argues that the first two stages -- search -- must come first.

### How to Conduct Customer Discovery

**Step 1: State Your Hypotheses**
Write down every assumption about your business: who the customer is, what problem they have, how they currently solve it, what they would pay, and how you would reach them.

**Step 2: Get Out of the Building**
Conduct 50-100 customer interviews. Not surveys. Not focus groups. One-on-one conversations with potential customers.

**Step 3: Test Your Hypotheses**
Do the interviews confirm or contradict your assumptions? Be honest. Confirmation bias is the entrepreneur's worst enemy.

**Step 4: Iterate or Pivot**
If hypotheses are confirmed, proceed to validation. If not, revise your hypotheses and conduct more interviews.

### The Mom Test (Rob Fitzpatrick)

Rob Fitzpatrick's *The Mom Test* provides rules for customer conversations that yield honest information:

1. **Talk about their life, not your idea.** Do not pitch. Ask about their experience.
2. **Ask about specifics in the past, not generics about the future.** "Tell me about the last time you..." not "Would you ever..."
3. **Talk less, listen more.** You should be talking less than 30% of the time.
4. **Do not ask leading questions.** "Would this be useful?" always gets "yes."
5. **Look for commitment signals.** Time (will they do a pilot?), reputation (will they refer you?), or money (will they pre-pay?).

### Key Takeaway

Customer discovery is the cheapest, fastest way to de-risk a startup. Every hour spent talking to customers saves weeks of wasted development. The goal is not to validate your idea but to understand the truth about your market -- even if that truth is uncomfortable.

**Sources**: Blank, S. (2013). *The Four Steps to the Epiphany*. K&S Ranch. Fitzpatrick, R. (2013). *The Mom Test*. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-lean-startup",
      slug: "lean-startup",
      title: "The Lean Startup (Eric Ries)",
      content: `## The Lean Startup (Eric Ries)

Eric Ries' *The Lean Startup* (2011) is one of the most influential entrepreneurship books of the 21st century and is widely assigned in HBS entrepreneurship courses. Building on Steve Blank's Customer Development methodology and Toyota's lean manufacturing principles, Ries provides a systematic approach to building businesses under conditions of extreme uncertainty.

### The Core Principle: Validated Learning

The fundamental unit of progress for a startup is **validated learning** -- demonstrating empirically that you have discovered a truth about your market. Revenue, users, and features are not progress unless they are connected to validated learning about what customers actually want.

### The Build-Measure-Learn Loop

\`\`\`
       BUILD
      /     \\\\
     /       \\\\
  LEARN <--- MEASURE
\`\`\`

**Build**: Create the minimum product needed to test a specific hypothesis. This is the MVP (Minimum Viable Product).

**Measure**: Collect data on how customers respond to the MVP. Focus on actionable metrics (not vanity metrics).

**Learn**: Analyze the data. Was the hypothesis confirmed or refuted? What did you learn?

The goal is to cycle through this loop **as fast as possible**. The startup that learns fastest wins.

### Vanity Metrics vs. Actionable Metrics

| Vanity Metrics (Misleading) | Actionable Metrics (Useful) |
|-----------------------------|-----------------------------|
| Total registered users | Active users (DAU/MAU) |
| Total revenue (cumulative) | Revenue growth rate |
| Page views | Conversion rate |
| App downloads | Retention rate |
| Total customers | Customer lifetime value (LTV) |

Vanity metrics always go up and to the right but do not tell you whether the business is healthy. Actionable metrics can go up OR down and drive specific decisions.

### Innovation Accounting

Ries introduced **innovation accounting** -- a way to measure startup progress that is more meaningful than traditional financial metrics:

1. **Establish a baseline**: Measure where you are today on key metrics
2. **Tune the engine**: Make changes and measure whether the metrics improve
3. **Pivot or persevere**: If improvements plateau and you cannot reach your target, consider a pivot

### The Pivot

A pivot is a **structured course correction** designed to test a new fundamental hypothesis about the product, strategy, or engine of growth. It is NOT a random change -- it is a deliberate decision based on learning.

Common pivot types:
- **Zoom-in Pivot**: A single feature becomes the whole product (Instagram)
- **Zoom-out Pivot**: The whole product becomes a single feature of a larger product
- **Customer Segment Pivot**: Same product, different customer
- **Value Capture Pivot**: Change how you monetize
- **Channel Pivot**: Change how you reach customers
- **Technology Pivot**: Same solution, different technology

### Key Takeaway

The Lean Startup methodology replaces "build it and they will come" with "test, measure, learn, and adapt." Its power lies in reducing waste -- the waste of building features nobody wants, targeting customers who do not care, and spending months on a plan that has not been validated.

**Sources**: Ries, E. (2011). *The Lean Startup*. Crown Business. Blank, S. (2013). "Why the Lean Startup Changes Everything." *Harvard Business Review*. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-mvp",
      slug: "minimum-viable-product",
      title: "Minimum Viable Product (MVP)",
      content: `## Minimum Viable Product (MVP)

The MVP is one of the most misunderstood concepts in entrepreneurship. It is NOT a crappy first version of your product. As Eric Ries defines it: **"The minimum viable product is that version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort."**

### What an MVP Is (and Is Not)

| MVP IS | MVP IS NOT |
|--------|------------|
| A learning tool | A half-baked product |
| The smallest experiment to test a hypothesis | The cheapest thing you can ship |
| Designed to answer a specific question | A feature-incomplete version of your vision |
| Something real customers interact with | A prototype shown only to friends |

### Types of MVPs

**1. Landing Page MVP**
Create a webpage describing your product and its value proposition. Measure how many visitors sign up or express interest. Dropbox used a landing page with a demo video to gauge demand before building the product -- overnight signups went from 5,000 to 75,000.

**2. Concierge MVP**
Manually deliver the service to a small number of customers. No technology required. Food on the Table started by personally going grocery shopping with one customer, creating recipes based on their preferences and local store sales.

**3. Wizard of Oz MVP**
Create the appearance of a functioning product while performing the work manually behind the scenes. Zappos photographed shoes in stores and bought them at retail when orders came in.

**4. Single-Feature MVP**
Build one feature -- the one that addresses the core value proposition -- and nothing else. Twitter launched with just the ability to post 140-character messages. No photos, no retweets, no threads.

**5. Crowdfunding MVP**
Launch on Kickstarter or Indiegogo to validate demand before building. Pebble Watch raised $10.3 million on Kickstarter, validating massive demand for smartwatches before producing a single unit.

### The MVP Decision Framework

For each MVP decision, ask:
1. **What is the riskiest assumption?** (What, if wrong, would kill the business?)
2. **What is the cheapest experiment to test that assumption?**
3. **What data will tell us whether the assumption is true or false?**
4. **What is the minimum we need to build to run that experiment?**

### Common MVP Mistakes

**1. Building too much**: The "V" in MVP stands for Viable, not Valuable. You are not building a product -- you are running an experiment.

**2. Not defining success criteria in advance**: Before launching the MVP, define what success looks like. "If X people sign up in Y days, we proceed. Otherwise, we pivot."

**3. Ignoring qualitative data**: Numbers tell you what happened. Conversations tell you why. Combine quantitative metrics with qualitative customer feedback.

**4. Being embarrassed by the MVP**: Reid Hoffman (LinkedIn co-founder) famously said: "If you are not embarrassed by the first version of your product, you have launched too late."

**5. Only building MVPs for the product**: You also need to validate your channels (can you reach customers?), your pricing (will they pay?), and your operations (can you deliver?).

### Key Takeaway

The MVP is not about shipping a minimal product -- it is about maximizing learning with minimal effort. The best MVPs test the riskiest assumption in the cheapest way possible, generating data that drives the next decision.

**Sources**: Ries, E. (2011). *The Lean Startup*. Crown Business. Blank, S. & Dorf, B. (2012). *The Startup Owner's Manual*. K&S Ranch. HBS Online, "Entrepreneurship Essentials" and "Launching Tech Ventures" courses.`,
    },
    {
      id: "ent-customer-interviews",
      slug: "customer-interviews-surveys",
      title: "Customer Interviews & Surveys",
      content: `## Customer Interviews & Surveys

Customer interviews are the single most important research method for early-stage entrepreneurs. Harvard Business School's entrepreneurship courses emphasize that **no amount of market research, competitive analysis, or financial modeling can substitute for direct conversations with potential customers.**

### When to Use Interviews vs. Surveys

| Method | Best For | Limitations |
|--------|----------|-------------|
| **Interviews** | Deep understanding, "why" questions, early exploration, emotional context | Time-intensive, small sample sizes |
| **Surveys** | Quantitative validation, larger samples, measuring frequency/severity | Superficial answers, response bias, no follow-up |

**Rule of thumb**: Start with interviews (qualitative discovery), then validate with surveys (quantitative confirmation).

### Structuring Customer Interviews

**1. Set the Context (2 minutes)**
Explain who you are and what you are doing. Make clear that you want honest opinions, not politeness. "There are no right answers -- I'm trying to learn."

**2. Explore the Problem (10-15 minutes)**
Ask open-ended questions about their current experience:
- "Walk me through how you currently handle [situation]"
- "What is the most frustrating part of that process?"
- "How much time/money does this cost you?"
- "Tell me about the last time this was a real problem"

**3. Probe for Alternatives (5 minutes)**
- "What solutions have you tried?"
- "What did you like and dislike about them?"
- "What would the ideal solution look like?"

**4. Test Your Concept (5 minutes, optional)**
Only after fully understanding the problem, briefly describe your concept and ask for honest reactions.

**5. Close with Commitment (2 minutes)**
Ask for a concrete commitment that signals real interest: "Would you be willing to try a prototype?" "Can I follow up in two weeks?" "Would you introduce me to a colleague who has this problem?"

### Designing Effective Surveys

If you use surveys to complement interviews:

**Keep it short**: 5-10 questions maximum. Every additional question reduces completion rate.

**Ask one thing at a time**: "How satisfied are you with the speed and reliability of your current tool?" is two questions disguised as one.

**Use a mix of question types**: Closed-ended (multiple choice, rating scale) for quantitative data. One open-ended question for qualitative insight.

**Avoid leading questions**: "Don't you think our product is better than competitors?" will not yield useful data.

**Sample size matters**: For statistical significance, aim for at least 100 responses. For directional insight, 30-50 can be sufficient.

### Analyzing Interview Data

After 15-20 interviews, look for patterns:

1. **What themes recur?** If 12 of 15 interviewees mention the same pain point, that is a strong signal.
2. **What surprises you?** Unexpected findings are often the most valuable -- they reveal assumptions you did not know you had.
3. **What segments emerge?** Not all customers are the same. You may discover distinct segments with different needs.
4. **What is the intensity?** Mild annoyance vs. severe pain. Businesses are built on severe pain.

### Key Takeaway

Customer interviews are the highest-return activity for an early-stage entrepreneur. They are cheap, fast, and generate insights that no amount of desk research can provide. The key is asking the right questions (about the problem, not the solution), listening more than talking, and being honest with yourself about what you hear.

**Sources**: Fitzpatrick, R. (2013). *The Mom Test*. Blank, S. (2013). *The Four Steps to the Epiphany*. Torres, T. (2021). *Continuous Discovery Habits*. Product Talk. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-pivot-persevere",
      slug: "pivoting-vs-persevering",
      title: "Pivoting vs. Persevering",
      content: `## Pivoting vs. Persevering

One of the hardest decisions in entrepreneurship is knowing when to pivot (change direction) and when to persevere (stay the course). Harvard Business School case studies show that **almost every successful startup pivoted at least once**, but also that premature pivoting can be as destructive as stubbornly persisting.

### The Pivot Decision

Eric Ries defines a pivot as a **structured course correction designed to test a new fundamental hypothesis** about the product, business model, or engine of growth. A pivot is not:
- Giving up
- Random thrashing
- Changing everything at once
- An excuse for not having a plan

A pivot retains what you have learned while changing what is not working.

### When to Pivot

**Signal 1: Flat metrics despite iteration**
You have been running the Build-Measure-Learn loop, making improvements, but key metrics (activation, retention, revenue) are not improving. The engine of growth is stalled.

**Signal 2: Customer indifference**
Customers try your product but do not come back. They say "it's nice" but do not recommend it, pay for it, or use it regularly. Indifference is worse than hatred -- at least hatred means they care.

**Signal 3: Wrong customer segment**
You find traction with a different customer than you expected. Slack was built for game developers but found product-market fit with all knowledge workers.

**Signal 4: Feature vs. product**
Customers love one feature but ignore the rest. Your "product" may actually be a feature of a different product. Instagram pivoted from Burbn (a complex social app) when they realized users only cared about photo filters.

**Signal 5: Unsustainable unit economics**
You can acquire customers but cannot serve them profitably. The business model does not work.

### When to Persevere

**Signal 1: Growing engagement**
Even if growth is slow, if existing users are deeply engaged (high retention, increasing usage), you may just need more time.

**Signal 2: Strong customer feedback**
Customers tell you the product is essential but need specific improvements. This is not a signal to pivot -- it is a signal to iterate.

**Signal 3: External validation**
Competitors are entering the space, which validates the market. Industry analysts are writing about the trend. The tailwind is building.

**Signal 4: Insufficient testing**
Have you actually tested enough? Many entrepreneurs pivot before giving their current approach a fair chance. Ensure you have run enough experiments before concluding the approach does not work.

### The Pivot Framework

Before pivoting, answer these questions:

1. **What have we learned?** Document all validated learnings from the current approach.
2. **What is not working?** Be specific about which hypothesis has been invalidated.
3. **What pivot options exist?** List 2-3 possible pivots.
4. **What assumptions does each pivot require?** What must be true for the pivot to succeed?
5. **Can we test the pivot cheaply?** A pivot should be validated, not just a guess.
6. **What do we carry forward?** Technology, customer relationships, market knowledge, team capability.

### Famous Pivots

| Company | Before | After | Type of Pivot |
|---------|--------|-------|---------------|
| YouTube | Video dating | Video sharing | Customer need pivot |
| Twitter | Podcast platform (Odeo) | Microblogging | Platform pivot |
| Shopify | Online snowboard store | E-commerce platform | Zoom-out pivot |
| Yelp | Email recommendation service | Review platform | Value capture pivot |
| Nintendo | Playing card company | Video game company | Business model pivot |

### The Emotional Dimension

Pivoting is intellectually simple but emotionally brutal. Founders invest their identity, relationships, and resources into their original vision. Admitting it is not working feels like personal failure.

HBS research shows that founders who can **separate their identity from their idea** make better pivot decisions. The idea is not you. Killing an idea is not killing part of yourself. The best founders are in love with the problem, not the solution.

### Key Takeaway

The pivot is one of entrepreneurship's most powerful tools, but it requires discipline: pivot based on data, not frustration. Persevere based on evidence, not stubbornness. The goal is not to be right the first time -- it is to find the truth as quickly and cheaply as possible.

**Sources**: Ries, E. (2011). *The Lean Startup*. Crown Business. HBS case studies on YouTube, Twitter, Instagram, and Slack pivots. Blank, S. (2013). "Why the Lean Startup Changes Everything." *Harvard Business Review*.`,
    },
  ],
};
