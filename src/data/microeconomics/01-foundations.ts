import { Module } from "../types";

export const foundationsModule: Module = {
  id: "micro-foundations",
  title: "Foundations of Economics",
  description:
    "Build a solid foundation in economic thinking — scarcity, opportunity cost, the production possibilities frontier, comparative advantage, and economic systems. Resources: Mankiw Principles of Economics, Samuelson & Nordhaus Economics, The Economist.",
  lessons: [
    {
      id: "micro-foundations-what-is-economics",
      slug: "what-is-economics",
      title: "What is Economics?",
      content: `## What is Economics?

Economics is the study of how individuals, firms, and societies allocate scarce resources among competing uses. It is fundamentally about **choice** — every decision involves trade-offs, and economics provides the framework for understanding those trade-offs.

### The Central Problem: Scarcity

Scarcity is the foundational concept of economics. Human wants are virtually unlimited, but the resources available to satisfy those wants — land, labor, capital, and entrepreneurship — are finite. This gap between wants and resources forces every individual, firm, and government to make choices.

As Lionel Robbins defined it in his influential 1932 essay: "Economics is the science which studies human behaviour as a relationship between ends and scarce means which have alternative uses" (Robbins, 1932, *An Essay on the Nature and Significance of Economic Science*, Macmillan).

### Microeconomics vs Macroeconomics

Economics is divided into two major branches:

| Branch | Focus | Key Questions |
|--------|-------|---------------|
| **Microeconomics** | Individual agents — consumers, firms, markets | How do consumers decide what to buy? How do firms set prices? What determines wages? |
| **Macroeconomics** | The economy as a whole | What causes recessions? Why do prices rise? How does monetary policy work? |

This course focuses on microeconomics — the study of how individual decision-makers interact within markets.

### Positive vs Normative Economics

**Positive economics** describes the world as it is — factual, testable statements:
- "A minimum wage of \\\$15 per hour reduces employment among teenagers by 3%."
- "A 10% increase in the price of cigarettes reduces consumption by 4%."

**Normative economics** prescribes what should be — value judgments:
- "The government should raise the minimum wage to \\\$15."
- "Cigarette taxes should be higher to discourage smoking."

The distinction matters because economic policy debates often conflate positive analysis (what will happen) with normative preferences (what should happen). Friedman (1953, *Essays in Positive Economics*, University of Chicago Press) argued that economics as a science must be judged by the accuracy of its positive predictions, not by the realism of its assumptions.

### The Economic Way of Thinking

Economists approach problems using several core principles:

1. **People respond to incentives** — change the costs or benefits, and behavior changes
2. **Every choice has an opportunity cost** — the value of the next best alternative forgone
3. **Rational decision-making occurs at the margin** — "Should I study one more hour?" not "Should I study?"
4. **Trade creates value** — voluntary exchange makes both parties better off
5. **Markets coordinate activity** — prices serve as signals that guide resource allocation

### The Invisible Hand

Adam Smith (1776, *An Inquiry into the Nature and Causes of the Wealth of Nations*) introduced the concept of the "invisible hand" — the idea that individuals pursuing their own self-interest inadvertently promote the welfare of society. When a baker bakes bread, he does it for profit — but in doing so, he feeds the community.

This insight is the foundation of market economics: under the right conditions, decentralized decision-making by millions of self-interested individuals produces outcomes that are remarkably efficient — without any central planner directing them.

### Economic Models

Economists build simplified models to understand complex reality. A good model captures the essential features of a situation while abstracting away unnecessary details. The circular flow model, supply and demand curves, and the production possibilities frontier (next lesson) are all examples.

As George Box famously stated: "All models are wrong, but some are useful." Economic models do not perfectly describe reality — they illuminate key relationships and generate testable predictions (Mankiw, 2021, *Principles of Economics*, Cengage).

### Key Takeaway

Economics is the science of scarcity and choice. It provides a systematic framework for understanding how individuals make decisions, how markets allocate resources, and why some policies work while others fail. The principles you learn in this course will change how you see the world.

> "Economics is the study of mankind in the ordinary business of life." — Alfred Marshall, Principles of Economics, 1890

*References: Robbins (1932), An Essay on the Nature and Significance of Economic Science; Friedman (1953), Essays in Positive Economics; Smith (1776), The Wealth of Nations; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-foundations-scarcity-opportunity-cost",
      slug: "scarcity-and-opportunity-cost",
      title: "Scarcity & Opportunity Cost",
      content: `## Scarcity & Opportunity Cost

Opportunity cost is the most important concept in economics. It is the value of the next best alternative you give up when making a choice. Every decision — from what to eat for lunch to whether to attend college — involves an opportunity cost.

### Defining Opportunity Cost

\`\`\`
Opportunity Cost = Value of the Best Forgone Alternative
\`\`\`

Opportunity cost includes both **explicit costs** (direct monetary payments) and **implicit costs** (the value of resources you could have used differently):

| Cost Type | Examples |
|-----------|---------|
| **Explicit** | Tuition, textbooks, lab fees |
| **Implicit** | Wages forgone by not working, interest forgone on savings spent |

### The True Cost of College

Consider the decision to attend a four-year university:

| Cost Category | Annual Amount | Explicit or Implicit? |
|--------------|--------------|----------------------|
| Tuition & fees | \\\$30,000 | Explicit |
| Textbooks | \\\$1,200 | Explicit |
| Room & board (above what you'd pay anyway) | \\\$5,000 | Explicit |
| Forgone salary (working full-time) | \\\$35,000 | Implicit |
| **Total annual opportunity cost** | **\\\$71,200** | |

Notice that forgone wages — which never appear on any bill — are the largest single cost. Economists insist on counting implicit costs because they represent real sacrifices of value.

Research by Abel & Deitz (2014, *Do the Benefits of College Still Outweigh the Costs?*, Federal Reserve Bank of New York) found that despite rising tuition, the average return on a bachelor's degree remains approximately 14% per year — well above the long-run stock market return of 7-10%. This is because college graduates earn significantly more over their lifetimes.

### Sunk Costs Are Not Opportunity Costs

A **sunk cost** is a cost that has already been incurred and cannot be recovered. Rational decision-makers should ignore sunk costs because they are the same regardless of what you choose going forward.

**Example:** You bought a \\\$100 concert ticket. On the night of the concert, a friend offers you free tickets to a game you would enjoy more. The rational choice is to attend the game — the \\\$100 is gone regardless. But studies by Thaler (1980, *Toward a Positive Theory of Consumer Choice*, Journal of Economic Behavior & Organization) show that people frequently fall for the "sunk cost fallacy" — attending the concert because they "already paid for it."

### Marginal Thinking

Economists emphasize decisions at the **margin** — the additional benefit versus the additional cost of one more unit:

\`\`\`
Optimal decision: Continue until Marginal Benefit = Marginal Cost
\`\`\`

Should you study one more hour for the exam? If the expected improvement in your grade (marginal benefit) exceeds the value of what you would do instead (marginal cost — sleep, work, leisure), then study. If not, stop.

### Scarcity Beyond Money

Scarcity applies to all resources, not just money:
- **Time** — you have 24 hours in a day; every hour spent on one activity is an hour not spent on another
- **Attention** — cognitive resources are limited; multitasking reduces effectiveness
- **Natural resources** — clean water, arable land, and fossil fuels are finite

Herbert Simon (1971, *Designing Organizations for an Information-Rich World*) argued that in the modern era, the scarce resource is not information but attention — "a wealth of information creates a poverty of attention."

### Trade-Offs in Policy

Governments face opportunity costs too. Spending \\\$1 billion on military equipment means \\\$1 billion less for healthcare, education, or infrastructure. This "guns vs butter" trade-off illustrates that government budgets, like household budgets, are constrained.

### Key Takeaway

Opportunity cost forces you to think about the full cost of every decision — not just the money you pay, but the value of what you sacrifice. The economist's habit of asking "What am I giving up?" is perhaps the most practically useful lesson in this entire course.

> "There is no such thing as a free lunch." — Milton Friedman

*References: Abel & Deitz (2014), Federal Reserve Bank of New York; Thaler (1980), Journal of Economic Behavior & Organization; Simon (1971), Designing Organizations for an Information-Rich World; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-foundations-ppf",
      slug: "production-possibilities-frontier",
      title: "Production Possibilities Frontier",
      content: `## The Production Possibilities Frontier (PPF)

The Production Possibilities Frontier (also called the Production Possibilities Curve) is a model that illustrates the trade-offs facing an economy that produces two goods using a fixed set of resources and technology. It is one of the first and most important models in economics.

### What the PPF Shows

The PPF is a curve showing all possible combinations of two goods that can be produced when all resources are fully and efficiently employed.

Consider an economy that produces only two goods — computers and wheat:

\`\`\`
Wheat (millions of tons)
  |
6 |  A
  |    \\
5 |      B
  |        \\
4 |          C
  |            \\
3 |              D
  |                \\
0 |________________ E___
  0    1    2    3    4   Computers (millions)
\`\`\`

Each point on the curve represents a different allocation of resources between the two goods.

### Key Properties

**1. Points on the curve are efficient** — all resources are fully utilized. Moving from point B to point C means producing more computers but fewer tons of wheat.

**2. Points inside the curve are inefficient** — some resources are unemployed or misallocated. Unemployment, underutilized factories, and poor management all push an economy inside its PPF.

**3. Points outside the curve are unattainable** — given current resources and technology.

**4. The curve is typically bowed outward (concave)** — reflecting increasing opportunity costs.

### Increasing Opportunity Cost

The PPF's concave shape reflects the **law of increasing opportunity cost**: as you produce more of one good, the opportunity cost of each additional unit increases. Why? Because resources are not perfectly adaptable. Farmland is better suited to growing wheat than assembling computers. As you shift more farmland toward computer production, you sacrifice increasingly large amounts of wheat for each additional computer (Samuelson & Nordhaus, 2010, *Economics*, McGraw-Hill).

If the PPF were a straight line, opportunity costs would be constant — implying resources are equally suited to both goods. This is unrealistic for most economies.

### Economic Growth: Shifting the PPF Outward

The PPF shifts outward when an economy increases its productive capacity through:

- **Capital accumulation** — investment in new machinery, factories, infrastructure
- **Technological progress** — innovation that makes production more efficient
- **Population growth** — more workers available
- **Education and training** — improving the quality of the labor force (human capital)

Solow (1956, *A Contribution to the Theory of Economic Growth*, Quarterly Journal of Economics) demonstrated mathematically that technological progress is the primary driver of long-run economic growth — a finding that earned him the Nobel Prize in 1987.

### The PPF and Opportunity Cost of Growth

A country at point B on its PPF must choose how to allocate between consumer goods (immediate satisfaction) and capital goods (future productive capacity). Choosing more capital goods means less consumption today — but shifts the PPF outward tomorrow, enabling more of both goods in the future. This is the fundamental trade-off between present and future consumption.

### Efficiency vs Equity

The PPF shows **productive efficiency** — producing the maximum output from available resources. But it says nothing about **allocative efficiency** (producing the combination consumers actually want) or **equity** (how output is distributed). An economy can be on its PPF — fully efficient — while distributing output in a highly unequal manner.

### Real-World Applications

During World War II, the United States dramatically shifted its PPF toward military production. Automobile factories were retooled to build tanks, and consumer goods were rationed. The civilian economy operated well inside its "peacetime PPF" for consumer goods while maximizing military output (Higgs, 1992, *Wartime Prosperity?*, The Independent Review).

### Key Takeaway

The PPF model captures the fundamental economic concepts of scarcity, trade-offs, opportunity cost, efficiency, and growth in a single diagram. It demonstrates that producing more of one thing always means producing less of another — unless the economy grows.

*References: Samuelson & Nordhaus (2010), Economics (McGraw-Hill); Solow (1956), Quarterly Journal of Economics; Higgs (1992), The Independent Review; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-foundations-comparative-advantage",
      slug: "comparative-advantage",
      title: "Comparative Advantage",
      content: `## Comparative Advantage

The principle of comparative advantage is one of the most powerful and counterintuitive ideas in economics. It explains why trade benefits all parties — even when one party is absolutely better at producing everything.

### Absolute Advantage vs Comparative Advantage

**Absolute advantage:** The ability to produce a good using fewer resources than another producer.

**Comparative advantage:** The ability to produce a good at a lower opportunity cost than another producer.

The key insight: **What matters for trade is not who is the best producer, but who gives up the least to produce each good.**

### David Ricardo's Example

David Ricardo (1817, *On the Principles of Political Economy and Taxation*) demonstrated comparative advantage using England and Portugal producing wine and cloth:

| Country | Hours to Produce 1 Unit of Cloth | Hours to Produce 1 Unit of Wine |
|---------|--------------------------------|-------------------------------|
| England | 100 | 120 |
| Portugal | 90 | 80 |

Portugal has an **absolute advantage** in both goods — it produces each using fewer hours. One might conclude Portugal should produce everything and England should produce nothing.

But look at the opportunity costs:

**England:**
- 1 cloth costs 100/120 = 0.83 wine
- 1 wine costs 120/100 = 1.20 cloth

**Portugal:**
- 1 cloth costs 90/80 = 1.125 wine
- 1 wine costs 80/90 = 0.89 cloth

England has a **comparative advantage** in cloth (gives up only 0.83 wine vs Portugal's 1.125 wine). Portugal has a comparative advantage in wine (gives up 0.89 cloth vs England's 1.20 cloth).

### Gains from Trade

If each country specializes in its comparative advantage and trades:

- England produces cloth at a cost of 0.83 wine per cloth
- Portugal produces wine at a cost of 0.89 cloth per wine
- They trade at any ratio between these opportunity costs (say, 1 cloth for 1 wine)

Both countries end up with more of both goods than they could produce alone. This is the miracle of comparative advantage — **trade is not zero-sum**.

### Why Comparative Advantage Always Exists

A critical mathematical point: it is impossible for one party to have a comparative advantage in everything. If Country A has a comparative advantage in Good X, then by definition Country B has a comparative advantage in Good Y. This means there are always mutual gains from trade (Krugman, Obstfeld & Melitz, 2018, *International Economics*, Pearson).

### Modern Applications

Comparative advantage applies far beyond international trade:

**Individuals:** A lawyer who can type faster than her secretary still benefits from hiring the secretary — the lawyer's time is better spent on legal work (where her comparative advantage is greatest).

**Companies:** Apple designs iPhones in California (comparative advantage in design and innovation) and manufactures them in China (comparative advantage in assembly due to scale, supply chain proximity, and labor costs).

**Cities and regions:** Silicon Valley specializes in technology, Wall Street in finance, Hollywood in entertainment — each leveraging its comparative advantage.

### Critiques and Limitations

While theoretically elegant, comparative advantage has real-world complications:

1. **Adjustment costs** — workers displaced by trade face unemployment and retraining costs (Autor, Dorn & Hanson, 2013, *The China Syndrome*, American Economic Review, found that U.S. regions more exposed to Chinese imports experienced significant declines in manufacturing employment)
2. **Dynamic comparative advantage** — countries can develop new advantages through strategic investment (South Korea's transformation from agriculture to electronics)
3. **Terms of trade** — the actual prices at which countries trade determine how the gains are distributed

### Key Takeaway

Comparative advantage proves that specialization and trade benefit everyone, even the less productive. It is the economic foundation for free trade, and understanding it is essential for evaluating trade policies and their consequences.

> "If a foreign country can supply us with a commodity cheaper than we ourselves can make it, better buy it of them with some part of the produce of our own industry." — Adam Smith, The Wealth of Nations

*References: Ricardo (1817), On the Principles of Political Economy and Taxation; Krugman, Obstfeld & Melitz (2018), International Economics (Pearson); Autor, Dorn & Hanson (2013), American Economic Review.*`,
    },
    {
      id: "micro-foundations-economic-systems",
      slug: "economic-systems",
      title: "Economic Systems",
      content: `## Economic Systems

Every society must answer three fundamental economic questions: **What** to produce? **How** to produce it? **For whom** to produce it? Different economic systems answer these questions through different mechanisms — markets, government planning, tradition, or some combination.

### The Three Core Questions

| Question | What It Asks |
|----------|-------------|
| **What to produce?** | Which goods and services should be produced? In what quantities? |
| **How to produce?** | What resources and technologies should be used? |
| **For whom to produce?** | How should the output be distributed among members of society? |

### Market Economy (Capitalism)

In a market economy, the three questions are answered primarily through **voluntary exchange in markets**. Prices, determined by supply and demand, serve as signals that coordinate the decisions of millions of independent producers and consumers.

**Key features:**
- Private ownership of property and means of production
- Prices determined by supply and demand
- Profit motive drives production decisions
- Consumer sovereignty — producers make what consumers want to buy
- Limited government role (enforcement of contracts, property rights, rule of law)

**Strengths:** Efficiency in resource allocation, innovation incentives, consumer choice, decentralized decision-making.

**Weaknesses:** Income inequality, market failures (externalities, public goods, monopoly power), boom-bust business cycles.

Adam Smith (1776) and Friedrich Hayek (1945, *The Use of Knowledge in Society*, American Economic Review) argued that markets process dispersed information far more effectively than any central planner could. Hayek's insight — that no single person or committee possesses enough information to coordinate an entire economy — remains one of the strongest arguments for market-based systems.

### Command Economy (Socialism/Communism)

In a command economy, the government answers the three questions through **central planning**. A planning committee determines what to produce, how to produce it, and how to distribute the output.

**Key features:**
- Government or collective ownership of resources
- Central planning boards set production targets
- Prices are administratively set, not market-determined
- Distribution based on need or political criteria

**Strengths:** Can mobilize resources quickly (wartime production), reduce inequality, provide universal basic services.

**Weaknesses:** Information problems (Hayek's critique), lack of innovation incentives, bureaucratic inefficiency, political corruption, shortages and surpluses.

The Soviet Union's Gosplan (State Planning Committee) attempted to coordinate the production of millions of goods across thousands of factories. The system ultimately collapsed in 1991, unable to match the efficiency and innovation of market economies (Kornai, 1992, *The Socialist System*, Princeton University Press).

### Mixed Economy

In practice, every modern economy is a **mixed economy** — combining market mechanisms with government intervention. The question is not "market or government?" but "how much of each?"

| Country | Market Orientation | Government Role |
|---------|-------------------|----------------|
| United States | High | Moderate regulation, limited welfare state |
| Sweden | High | Extensive welfare state, high taxes |
| China | Moderate (growing) | State ownership of key industries, economic planning |
| Cuba | Low | Extensive government control |

### Traditional Economy

In traditional economies, the three questions are answered by **custom, tradition, and cultural practices**. Production methods and distribution rules are inherited from previous generations. Examples include subsistence farming communities and indigenous societies. While rare in the modern world, elements of tradition persist — family businesses passing from generation to generation, for instance.

### Evaluating Economic Systems

Economists evaluate systems on several criteria:

| Criterion | Definition |
|-----------|-----------|
| **Efficiency** | Does the system minimize waste and maximize output from available resources? |
| **Equity** | Is the distribution of income and wealth fair? |
| **Growth** | Does the system promote innovation and rising living standards? |
| **Stability** | Does the system avoid extreme fluctuations (inflation, unemployment, crises)? |
| **Freedom** | Do individuals have the freedom to make economic choices? |

No system excels on all criteria simultaneously. Markets excel at efficiency and growth but may produce inequality. Command economies may achieve greater equality but sacrifice efficiency and freedom. This is why economic debates are ultimately about values and trade-offs, not just facts (Acemoglu & Robinson, 2012, *Why Nations Fail*, Crown).

### The Role of Institutions

Acemoglu & Robinson (2012) argue that the single most important determinant of economic prosperity is the quality of a nation's institutions — property rights, rule of law, inclusive political systems, and market-supporting regulations. Countries with "extractive" institutions (where elites capture resources at the expense of the population) remain poor regardless of their natural resource endowments.

### Key Takeaway

Economic systems exist on a spectrum from pure market to pure command, with every real economy falling somewhere in between. The choice of system determines how a society allocates resources, distributes wealth, and incentivizes innovation.

> "The curious task of economics is to demonstrate to men how little they really know about what they imagine they can design." — Friedrich Hayek, The Fatal Conceit

*References: Hayek (1945), American Economic Review; Kornai (1992), The Socialist System (Princeton); Acemoglu & Robinson (2012), Why Nations Fail (Crown); Mankiw (2021), Principles of Economics (Cengage).*`,
    },
  ],
};
