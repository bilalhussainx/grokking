import { Module } from "../types";

export const mindsetModule: Module = {
  id: "ent-mindset",
  title: "The Entrepreneurial Mindset",
  description: "Develop the entrepreneurial mindset: opportunity recognition, problem-solution fit, types of entrepreneurs, and patterns from founder stories.",
  lessons: [
    {
      id: "ent-mindset-intro",
      slug: "the-entrepreneurial-mindset",
      title: "The Entrepreneurial Mindset",
      content: `## The Entrepreneurial Mindset

Howard Stevenson, the godfather of entrepreneurship studies at Harvard Business School, defined entrepreneurship as **"the pursuit of opportunity beyond resources currently controlled."** This definition -- elegant in its simplicity -- captures the essence of what separates entrepreneurs from managers: entrepreneurs see opportunities and act on them before they have all the resources they need.

### What Sets Entrepreneurs Apart

HBS research across thousands of founders reveals that entrepreneurship is not about a personality type but about a **mindset** -- a way of seeing and acting in the world:

**1. Opportunity Orientation**: Entrepreneurs see opportunities where others see problems. They are constantly scanning the environment for unmet needs, inefficiencies, and emerging trends.

**2. Comfort with Ambiguity**: Unlike corporate managers who seek to reduce uncertainty, entrepreneurs operate in it. They make decisions with incomplete information and adjust as they learn.

**3. Bias for Action**: Entrepreneurs default to doing rather than planning. They test ideas quickly, iterate based on feedback, and move faster than the market expects.

**4. Resourcefulness**: Without the resources of established companies, entrepreneurs must be creative -- leveraging relationships, bartering, bootstrapping, and finding unconventional solutions.

**5. Resilience**: The startup journey involves constant rejection, failure, and setbacks. Entrepreneurs develop the ability to recover quickly and keep moving forward.

**6. Customer Obsession**: The best entrepreneurs are deeply empathetic to customer pain points. They build businesses around solving real problems for real people.

### The Entrepreneurial Process

HBS teaches entrepreneurship as a structured process, not a mystical talent:

\`\`\`
Opportunity --> Team --> Resources --> Deal Structure --> Value Capture
Recognition    Building  Assembly    (Terms, equity)   (Growth, exit)
\`\`\`

Each element must be managed deliberately. A great opportunity with the wrong team fails. A great team without resources stalls. Resources without a viable opportunity are wasted.

### Fixed vs. Growth Mindset in Entrepreneurship

Carol Dweck's research on mindset (Stanford, widely cited at HBS) is particularly relevant for entrepreneurs:

**Fixed Mindset**: "I am either smart enough to succeed or I am not." Avoids challenges, gives up easily, sees effort as fruitless.

**Growth Mindset**: "I can learn and improve through effort." Embraces challenges, persists through setbacks, sees effort as the path to mastery.

The entrepreneurial journey is a constant learning process. Founders who adopt a growth mindset are more likely to pivot when needed, learn from failures, and develop the skills their business requires.

### The Myth of the Solo Genius

Popular culture portrays entrepreneurs as lone visionaries. Reality is different: most successful startups are built by **teams**, not individuals. HBS research shows that companies with 2-3 co-founders raise more money, grow faster, and are less likely to fail than solo-founded companies.

The ideal founding team combines:
- **The Hacker**: Technical capability to build the product
- **The Hustler**: Sales and business development capability
- **The Hipster**: Design and user experience capability

### Key Takeaway

Entrepreneurship is a learnable discipline, not an innate talent. It requires a specific mindset -- opportunity-oriented, action-biased, resilient, and customer-obsessed -- that can be developed through practice and experience. The HBS approach treats entrepreneurship as a craft that improves with deliberate practice.

**Sources**: Stevenson, H. H. (1983). "A Perspective on Entrepreneurship." HBS Working Paper 9-384-131. Dweck, C. S. (2006). *Mindset*. Random House. HBS Online, "Entrepreneurship Essentials" course. Wasserman, N. (2012). *The Founder's Dilemmas*. Princeton University Press.`,
    },
    {
      id: "ent-identifying-opportunities",
      slug: "identifying-opportunities",
      title: "Identifying Opportunities",
      content: `## Identifying Opportunities

At Harvard Business School, entrepreneurship courses teach that opportunities are not "found" -- they are **recognized** through a combination of market awareness, customer empathy, and pattern recognition. The best entrepreneurs do not wait for inspiration; they systematically scan for opportunities using specific frameworks.

### What Makes a Good Opportunity?

Not every idea is a good business opportunity. HBS professor Bill Sahlman's framework evaluates opportunities across four dimensions:

**1. The People**: Is there a team capable of executing? Do they have domain expertise, relevant networks, and complementary skills?

**2. The Opportunity**: Is the market large enough? Is the timing right? Is the value proposition compelling?

**3. The Context**: What external factors (regulatory, technological, economic) enable or threaten this opportunity?

**4. The Deal**: Can you structure the business to attract resources (capital, talent, partners) on favorable terms?

### Sources of Entrepreneurial Opportunities

**1. Customer Pain Points**
The richest opportunities emerge from deep customer frustration. Airbnb was born from the founders' inability to afford San Francisco rent. Uber was born from the founders' inability to hail a taxi in Paris.

**2. Technological Change**
New technologies create new possibilities. The smartphone enabled Uber, Instagram, and Venmo. Cloud computing enabled Salesforce, Dropbox, and Slack. AI is enabling the current wave of startups.

**3. Regulatory Change**
New regulations create opportunities. The Affordable Care Act created opportunities for health tech startups. GDPR created opportunities for privacy and compliance companies.

**4. Demographic and Social Shifts**
Aging populations, urbanization, changing family structures, and cultural shifts all create new needs. The rise of remote work created opportunities for Zoom, Notion, and Loom.

**5. Market Inefficiencies**
Where there is information asymmetry, excessive middlemen, or poor customer experience, there is opportunity. Zillow addressed real estate information asymmetry. Robinhood addressed brokerage fee inefficiency.

### The Opportunity Assessment Framework

For any potential opportunity, evaluate:

| Dimension | Questions | Strong Signal |
|-----------|-----------|--------------|
| **Problem** | How painful is this problem? | Customers actively seeking solutions |
| **Market Size** | How many people have this problem? | TAM > $1B |
| **Timing** | Why now? What has changed? | Technology, regulation, or behavior shift |
| **Competition** | Who else is solving this? | Few direct competitors or poor existing solutions |
| **Business Model** | How will you make money? | Clear path to revenue with reasonable unit economics |
| **Defensibility** | What prevents copying? | Network effects, IP, switching costs, brand |

### Timing: The Most Underrated Factor

Marc Andreessen argues that the most common reason startups fail is not bad execution but bad timing. Bill Gross of Idealab analyzed 200+ startups and found that **timing was the single biggest factor** in startup success or failure, accounting for 42% of the difference between success and failure.

Too early: The market is not ready (WebVan in 1999 -- grocery delivery before smartphones and logistics infrastructure).
Too late: Incumbents have captured the market (launching a new search engine in 2024).
Just right: The technology exists, the market need is growing, and no dominant player has emerged.

### Key Takeaway

Opportunity recognition is a skill that can be developed. Systematically scan for customer pain points, technological shifts, regulatory changes, and market inefficiencies. Evaluate opportunities rigorously across problem severity, market size, timing, competition, and defensibility. The best opportunities lie at the intersection of deep customer pain and enabling trends.

**Sources**: Sahlman, W. A. (1997). "How to Write a Great Business Plan." *Harvard Business Review*. Gross, B. (2015). "The Single Biggest Reason Why Startups Succeed." TED Talk. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-problem-solution-fit",
      slug: "problem-solution-fit",
      title: "Problem-Solution Fit",
      content: `## Problem-Solution Fit

Before building a product, before raising money, before hiring a team, entrepreneurs must achieve **problem-solution fit** -- validating that the problem they are solving is real, painful, and frequent enough to build a business around, and that their proposed solution actually addresses it. Harvard Business School's entrepreneurship curriculum emphasizes this as the critical first milestone.

### The Problem-Solution Fit Hierarchy

\`\`\`
                Product-Market Fit
               (People pay for it at scale)
                      ^
                      |
              Problem-Solution Fit
             (Solution addresses real pain)
                      ^
                      |
              Problem Validation
            (Problem is real and painful)
                      ^
                      |
              Problem Hypothesis
            (You think there's a problem)
\`\`\`

Most failed startups skip directly from hypothesis to building, never validating the problem or the fit.

### Validating the Problem

Before designing a solution, validate that the problem is worth solving:

**The Problem Interview**: Talk to potential customers about their current experience. Do NOT pitch your solution. Ask:
- "Tell me about the last time you experienced [problem]"
- "How do you currently handle [situation]?"
- "What have you tried? What worked? What did not?"
- "How much time/money/effort does this cost you?"
- "If you could wave a magic wand, what would change?"

**Red Flags** (problem may not be worth solving):
- People cannot articulate the problem clearly
- They have the problem but it is low priority
- Existing solutions are "good enough"
- The problem is too infrequent to matter

**Green Flags** (strong problem):
- People describe the problem with emotion and frustration
- They have tried multiple solutions and are dissatisfied
- They spend significant time or money working around the problem
- They ask "When can I have this?" before you have even described a solution

### Designing the Solution

Once the problem is validated, design the minimum solution that addresses the core pain:

**The Value Proposition Canvas** (Alexander Osterwalder):

Map the customer's jobs, pains, and gains, then design your solution to address them:

| Customer Profile | Value Map |
|-----------------|-----------|
| **Jobs**: What are they trying to accomplish? | **Products/Services**: What do you offer? |
| **Pains**: What frustrates them? What risks do they face? | **Pain Relievers**: How does your solution reduce pains? |
| **Gains**: What outcomes do they desire? What would delight them? | **Gain Creators**: How does your solution create gains? |

**Fit** occurs when your pain relievers and gain creators match the customer's most important pains and gains.

### Testing Problem-Solution Fit

**The Concierge Test**: Manually deliver the solution to a small number of customers (no technology needed). Watch how they respond. Do they value it? Will they pay for it? What do they actually use vs. what you expected?

**The Wizard of Oz Test**: Create the appearance of a product while performing the work manually behind the scenes. Zappos validated online shoe buying by photographing shoes in local stores and manually fulfilling orders before building any technology.

**The Landing Page Test**: Create a simple landing page describing your solution and drive traffic to it. Measure conversion (email signups, pre-orders). If people will not click a button, they will not buy a product.

### When Problem-Solution Fit is Achieved

You know you have problem-solution fit when:
- Customers describe their problem in terms that match your solution
- Early users actively engage with your solution and request more
- Users would be disappointed if the solution disappeared
- You can articulate a clear value proposition that resonates

### Key Takeaway

Problem-solution fit is the foundation of every successful startup. Most entrepreneurs are solution-oriented -- they fall in love with their idea and build first. The best entrepreneurs are problem-oriented -- they fall in love with the problem and validate it deeply before building anything.

**Sources**: Osterwalder, A. et al. (2014). *Value Proposition Design*. Wiley. Blank, S. (2013). *The Four Steps to the Epiphany*. K&S Ranch. HBS Online, "Entrepreneurship Essentials" course.`,
    },
    {
      id: "ent-types-entrepreneurs",
      slug: "types-of-entrepreneurs",
      title: "Types of Entrepreneurs",
      content: `## Types of Entrepreneurs

Entrepreneurship is not monolithic. Harvard Business School recognizes that entrepreneurs come in many forms, each with different motivations, risk profiles, and definitions of success. Understanding these types helps aspiring entrepreneurs find their own path.

### The Four Main Types

**1. Scalable Startup Entrepreneurs**

These are the entrepreneurs most associated with Silicon Valley: they aim to build large, high-growth companies that can eventually go public or achieve a major acquisition.

*Characteristics*: Seek venture capital, aim for exponential growth, willing to take large risks for large rewards, focused on market disruption.

*Examples*: Mark Zuckerberg (Facebook), Drew Houston (Dropbox), Whitney Wolfe Herd (Bumble).

*Profile*: Typically 25-35, often technically skilled, comfortable with uncertainty, motivated by impact and wealth.

**2. Lifestyle Entrepreneurs**

These entrepreneurs build businesses that support a desired lifestyle -- freedom, flexibility, creative expression -- rather than maximizing growth or valuation.

*Characteristics*: Self-funded or bootstrapped, optimize for personal satisfaction, may intentionally limit growth, focus on profitability over scale.

*Examples*: Freelance consultants, boutique agency owners, independent app developers, artisanal producers.

*Profile*: Values autonomy and flexibility, comfortable with modest scale, motivated by independence.

**3. Social Entrepreneurs**

Social entrepreneurs apply business principles to solve social or environmental problems. Their primary metric is impact, not profit -- though sustainable business models are essential.

*Characteristics*: Mission-driven, measure social impact alongside financial performance, often operate as non-profits, B-Corps, or hybrid organizations.

*Examples*: Muhammad Yunus (Grameen Bank -- microfinance for the poor), Blake Mycoskie (TOMS Shoes), Sal Khan (Khan Academy).

*Profile*: Deeply motivated by purpose, combines business skills with social awareness, willing to accept lower financial returns for greater impact.

**4. Corporate Entrepreneurs (Intrapreneurs)**

Intrapreneurs drive innovation from within existing organizations. They identify opportunities, build business cases, assemble teams, and launch new products or business units inside large companies.

*Characteristics*: Leverage corporate resources and brand, navigate organizational politics, balance innovation with corporate constraints.

*Examples*: The team that created Gmail inside Google, the 3M engineer who invented Post-it Notes, the Amazon team that launched AWS.

*Profile*: Entrepreneurial mindset within a corporate setting, skilled at persuasion and organizational navigation, motivated by impact within constraints.

### Noam Wasserman's Founder Dilemmas

HBS professor Noam Wasserman's research in *The Founder's Dilemmas* (2012) reveals a fundamental choice every entrepreneur must make:

**Rich vs. King/Queen**: Do you want to maximize the value of your company (Rich) or maintain control over it (King/Queen)?

- **Rich founders** are willing to bring in experienced executives, share equity with investors, and give up the CEO title if it makes the company more valuable
- **King/Queen founders** want to maintain control over decision-making, culture, and direction, even if it means slower growth

Wasserman's data shows that founders who pursue "Rich" strategies build companies with **52% higher valuations** on average, but founders who pursue "King/Queen" strategies are more personally satisfied.

The dilemma: very few founders achieve both maximum wealth and maximum control. Understanding your preference early helps you make better decisions about co-founders, investors, and growth strategy.

### Founder Archetypes and Patterns

Research across thousands of startups reveals common patterns:

| Pattern | Description | Frequency |
|---------|-------------|-----------|
| **Serial Founder** | Starts multiple companies over a career | Serial entrepreneurs succeed at 2x the rate of first-timers |
| **Domain Expert** | Deep industry knowledge leads to startup | Common in enterprise software and B2B |
| **Technical Founder** | Builds the product themselves | Most common in technology startups |
| **Industry Outsider** | Brings fresh perspective to an established industry | Often behind most disruptive innovations |

### Key Takeaway

There is no single "right" way to be an entrepreneur. Understanding the different types helps you choose the path that matches your motivations, risk tolerance, and definition of success. The most important thing is alignment between your entrepreneurial type and your strategic choices.

**Sources**: Wasserman, N. (2012). *The Founder's Dilemmas*. Princeton University Press. HBS Online, "Entrepreneurship Essentials" course. Ries, E. (2011). *The Lean Startup*. Crown Business.`,
    },
    {
      id: "ent-founder-stories",
      slug: "founder-stories-patterns",
      title: "Founder Stories & Patterns",
      content: `## Founder Stories & Patterns

Harvard Business School uses founder case studies to teach entrepreneurship because patterns emerge from the messiness of real startup journeys. Across hundreds of founder stories studied at HBS, consistent patterns appear in how successful companies are born, how founders navigate early decisions, and how pivots lead to breakthroughs.

### Pattern 1: The Scratch-Your-Own-Itch Origin

Many successful startups are born when founders solve their own problem:

- **Slack** (Stewart Butterfield): Built an internal communication tool for his game development team. The game failed; the tool became a $27.7B company.
- **Spanx** (Sara Blakely): Could not find comfortable undergarments that did not show through white pants. Created Spanx, building a billion-dollar brand with $5,000 and no outside funding.
- **Basecamp** (Jason Fried): Needed project management software for his web design agency. Built Basecamp, which became the primary business.

**Pattern insight**: When you are the customer, you have deep empathy for the problem. You do not need market research -- you need to build what you wish existed.

### Pattern 2: The Pivot

Most successful startups look nothing like their original concept:

- **YouTube**: Started as a video dating site ("Tune In, Hook Up"). Pivoted to general video sharing when dating videos failed to gain traction.
- **Instagram**: Started as Burbn, a location-sharing app with too many features. Founders noticed users only cared about photo sharing. Stripped everything else, launched Instagram.
- **Twitter**: Started as Odeo, a podcasting platform. When Apple launched iTunes podcasts, Odeo became irrelevant. A side project -- a short-message service -- became Twitter.
- **Groupon**: Started as The Point, a platform for collective action. When users started organizing group buying, the founders pivoted to daily deals.

**Pattern insight**: The original idea is rarely the final product. What matters is the team's ability to recognize signals from the market and adapt quickly.

### Pattern 3: Rejection and Persistence

The gap between "no" and "yes" in entrepreneurship is often measured in dozens (or hundreds) of rejections:

- **Airbnb** was rejected by 7 of the most prominent investors in Silicon Valley. Paul Graham of Y Combinator initially thought the idea was terrible but admitted the founders to YC based on their hustle (selling Obama-themed cereal boxes to fund the company).
- **Pandora** was rejected by over 300 VCs before securing funding.
- **Starbucks** (Howard Schultz's vision): 242 of the 242 investors Schultz approached said no before he raised the money to acquire Starbucks.

**Pattern insight**: Rejection is information, not judgment. Each "no" refines the pitch, the product, and the founder's resilience.

### Pattern 4: The Second-Time Founder Advantage

Serial entrepreneurs succeed at significantly higher rates:

| Category | Success Rate |
|----------|-------------|
| First-time founders | ~18% |
| Previously successful founders | ~30% |
| Previously unsuccessful founders | ~20% |

Even founders whose previous companies failed perform better than first-timers because they have learned from experience -- how to hire, how to raise money, how to prioritize, and how to avoid common mistakes.

### Pattern 5: The Importance of Co-Founders

HBS data shows that companies with 2-3 co-founders outperform solo founders:
- They raise more capital (investors prefer teams)
- They cover more functional areas (technical + business)
- They provide emotional support through the startup roller coaster
- They make better decisions through debate and diverse perspectives

However, co-founder conflict is also the #1 reason early-stage startups fail. The Founder's Dilemmas research shows that co-founders who skip difficult early conversations about equity, roles, and vision are far more likely to have destructive conflicts later.

**Best practice**: Have explicit conversations about equity split, decision-making authority, roles, and what happens if one co-founder leaves -- before writing a single line of code.

### Pattern 6: Timing Over Talent

Across hundreds of HBS case studies, timing emerges as a more powerful predictor of success than founder talent. The most talented founders in the wrong market at the wrong time fail, while competent (but not extraordinary) founders in the right market at the right time succeed.

**Implications for aspiring founders**:
- Pay attention to macro trends (technology, regulation, behavior)
- Ask "why now?" for every opportunity
- Be willing to wait for the right moment or pivot to a more timely opportunity

### Key Takeaway

Founder stories are not fairy tales -- they are data points that reveal consistent patterns. The most common patterns: solve your own problem, be ready to pivot, persist through rejection, find great co-founders, and time your market entry well. Studying these patterns does not guarantee success, but it dramatically improves the odds.

**Sources**: Wasserman, N. (2012). *The Founder's Dilemmas*. Princeton University Press. Ries, E. (2011). *The Lean Startup*. Crown Business. HBS case studies on Airbnb, Slack, Instagram, and Netflix. Gross, B. (2015). TED Talk on startup success factors.`,
    },
  ],
};
