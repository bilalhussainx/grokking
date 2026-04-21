import { Module } from "../types";

export const optimizationModule: Module = {
  id: "ba-optimization",
  title: "Optimization",
  description: "Learn linear programming, sensitivity analysis, integer programming, network optimization, and real-world applications.",
  lessons: [
    {
      id: "ba-linear-programming",
      slug: "linear-programming",
      title: "Linear Programming",
      content: `## Linear Programming

Linear programming (LP) is a mathematical method for finding the best outcome (maximum profit, minimum cost) given a set of constraints. HBS analytics courses teach LP as the foundation of prescriptive analytics -- it answers "what should we do?" rather than "what happened?" or "what will happen?"

### The Structure of an LP Problem

Every LP problem has three components:

**1. Decision Variables**: What you can control (e.g., how many units of each product to produce)

**2. Objective Function**: What you want to maximize or minimize (e.g., maximize profit)

**3. Constraints**: Limitations on your decisions (e.g., limited raw materials, labor hours, budget)

### A Simple Example

A furniture company makes tables and chairs:
- Tables: \\$70 profit, require 4 hours labor and 30 board-feet of wood
- Chairs: \\$50 profit, require 3 hours labor and 20 board-feet of wood
- Available: 240 labor hours and 1,500 board-feet of wood per week

**Decision variables**: x1 = tables, x2 = chairs
**Objective**: Maximize 70*x1 + 50*x2
**Constraints**: 4*x1 + 3*x2 <= 240 (labor), 30*x1 + 20*x2 <= 1500 (wood), x1 >= 0, x2 >= 0

### Business Applications

| Application | Objective | Constraints |
|-------------|-----------|-------------|
| Production planning | Maximize profit | Capacity, materials, demand |
| Portfolio optimization | Maximize return | Risk tolerance, budget, diversification |
| Transportation | Minimize shipping cost | Supply, demand, capacity |
| Workforce scheduling | Minimize labor cost | Demand coverage, labor laws |
| Marketing mix | Maximize reach | Budget, channel capacity |

### Key Takeaway

Linear programming transforms complex business decisions into solvable mathematical problems. When you face a decision involving allocating scarce resources among competing uses, LP provides the optimal answer.

**Sources**: HBS Online, "Business Analytics" course. Bertsimas, D. & Freund, R. M. (2004). *Data, Models, and Decisions*. Dynamic Ideas.`,
    },
    {
      id: "ba-sensitivity",
      slug: "sensitivity-analysis",
      title: "Sensitivity Analysis",
      content: `## Sensitivity Analysis

Sensitivity analysis asks: **how much do the results change when the inputs change?** In business analytics, this is critical because inputs (costs, demand, capacity) are rarely known with certainty.

### What Sensitivity Analysis Tells You

1. **Which parameters matter most**: Some inputs significantly affect the optimal solution; others barely matter. Focus your attention on the sensitive ones.

2. **How robust is the solution**: Does the optimal decision change if inputs vary within reasonable ranges? A solution that changes dramatically with small input changes is fragile.

3. **Where to invest in better data**: If the solution is sensitive to a particular parameter, invest in improving the accuracy of that estimate.

### Types of Sensitivity Analysis

**One-at-a-Time**: Change one input while holding others constant. Simple and intuitive.

**Scenario Analysis**: Define 3-5 scenarios (best case, worst case, most likely) and evaluate the solution under each.

**Monte Carlo Simulation**: Randomly vary multiple inputs simultaneously (based on probability distributions) and observe the distribution of outcomes.

### Shadow Prices (in LP)

In linear programming, the **shadow price** of a constraint tells you how much the objective function would improve if you could relax that constraint by one unit.

Example: If the shadow price of labor hours is \\$15, then one additional hour of labor would increase profit by \\$15. If overtime costs \\$12/hour, it is worth doing.

### Business Applications

- **Financial modeling**: How do revenue projections change with different growth rate assumptions?
- **Pricing**: How does profit change if we raise prices by 5% and demand drops by 3%?
- **Supply chain**: Which disruptions have the biggest impact on delivery times?
- **Project planning**: Which delays have the biggest impact on project completion?

### Key Takeaway

Sensitivity analysis is essential for any analytical model. It reveals which assumptions matter, how robust your solution is, and where additional information would be most valuable. Never present an optimization result without sensitivity analysis.

**Sources**: HBS Online, "Business Analytics" course. Clemen, R. T. & Reilly, T. (2014). *Making Hard Decisions with DecisionTools*. Cengage.`,
    },
    {
      id: "ba-integer-programming",
      slug: "integer-programming",
      title: "Integer Programming",
      content: `## Integer Programming

Many business decisions are inherently discrete: you build a factory or you do not; you assign a person to a shift or you do not; you select a project or you do not. **Integer programming (IP)** extends linear programming to handle decisions that must be whole numbers.

### Types of Integer Variables

**Binary (0/1)**: Yes/no decisions
- Build a warehouse in this city? (0 = no, 1 = yes)
- Assign this employee to this shift? (0 = no, 1 = yes)

**General Integer**: Whole number decisions
- How many trucks to send on each route?
- How many machines to purchase?

### Business Applications

**Capital Budgeting**: Select the optimal portfolio of projects given a limited budget. Each project is a binary decision (fund or not fund).

**Facility Location**: Choose where to open warehouses, stores, or factories from a set of candidate locations.

**Scheduling**: Assign workers to shifts, vehicles to routes, or tasks to machines.

**Network Design**: Design distribution networks that minimize cost while meeting demand.

### Why IP is Harder Than LP

Linear programs can be solved very efficiently (polynomial time). Integer programs are fundamentally harder (NP-hard). For large problems with thousands of variables, finding the optimal solution may be computationally expensive. In practice, modern solvers (Gurobi, CPLEX) handle most business-sized problems within minutes.

### Key Takeaway

Integer programming handles the discrete decisions that linear programming cannot. When your business decision involves yes/no choices or whole-number quantities, IP is the appropriate tool.

**Sources**: HBS Online, "Business Analytics" course. Bertsimas, D. & Freund, R. M. (2004). *Data, Models, and Decisions*.`,
    },
    {
      id: "ba-network-opt",
      slug: "network-optimization",
      title: "Network Optimization",
      content: `## Network Optimization

Network optimization solves problems involving flows through networks -- transportation, supply chains, telecommunications, and logistics. HBS analytics courses use network models because they represent a huge class of real business problems.

### Network Model Components

- **Nodes**: Locations (factories, warehouses, stores, customers)
- **Arcs**: Connections between nodes (routes, links)
- **Capacity**: Maximum flow on each arc
- **Cost**: Cost per unit of flow on each arc
- **Supply/Demand**: How much is produced at each source and needed at each destination

### Classic Network Problems

**Transportation Problem**: Ship goods from factories to warehouses to minimize total shipping cost.

**Assignment Problem**: Assign workers to tasks (one-to-one) to minimize total cost or maximize total skill match.

**Shortest Path**: Find the cheapest or fastest route through a network (GPS routing, logistics planning).

**Maximum Flow**: Determine the maximum throughput a network can handle (bandwidth, pipeline capacity).

### Supply Chain Optimization

The most common business application of network optimization is **supply chain design**:

1. Where should we locate factories and warehouses?
2. Which factories should serve which markets?
3. How should inventory be distributed across the network?
4. What is the least-cost way to move products from production to consumption?

### Key Takeaway

Network optimization is one of the most practically useful areas of analytics. Supply chain costs typically represent 60-70% of total costs for manufacturing companies. Even small improvements in network efficiency translate to significant savings.

**Sources**: HBS Online, "Business Analytics" course. Ahuja, R. K., Magnanti, T. L., & Orlin, J. B. (1993). *Network Flows*. Prentice Hall.`,
    },
    {
      id: "ba-real-world-opt",
      slug: "optimization-applications",
      title: "Real-World Applications",
      content: `## Real-World Optimization Applications

Optimization is not an academic exercise -- it drives billions of dollars in business value across industries. HBS case studies showcase how companies use optimization to gain competitive advantages in supply chain, pricing, scheduling, and resource allocation.

### Case 1: Revenue Management (Airlines)

Airlines use optimization to maximize revenue by dynamically adjusting prices and seat allocation across fare classes. American Airlines' revenue management system generates an estimated **\\$1.4 billion in additional annual revenue**.

The optimization: allocate seats across fare classes (economy, business, first) to maximize expected revenue, considering demand uncertainty, cancellation rates, and overbooking risk.

### Case 2: Supply Chain Optimization (Amazon)

Amazon uses optimization at every stage of its supply chain:
- **Inventory placement**: Which products to stock at which fulfillment center
- **Pick-pack-ship**: Optimal routing within warehouses
- **Last-mile delivery**: Route optimization for delivery drivers
- **Network design**: Where to build new fulfillment centers

Amazon's logistics optimization is a primary source of its cost advantage over competitors.

### Case 3: Workforce Scheduling (Hospitals)

Hospitals use integer programming to create nurse schedules that:
- Meet patient care requirements at all times
- Respect labor laws and union agreements
- Balance workload fairly across nurses
- Minimize overtime costs
- Accommodate nurse preferences where possible

### Case 4: Portfolio Optimization (Finance)

Harry Markowitz's Modern Portfolio Theory (Nobel Prize, 1990) uses optimization to construct investment portfolios that maximize expected return for a given level of risk (or minimize risk for a given return).

### Case 5: Dynamic Pricing (Uber, Hotels)

Uber's surge pricing is an optimization problem: set prices to balance supply (available drivers) and demand (ride requests) in real time. Hotels use similar optimization to adjust room rates based on demand forecasts, competitor prices, and events.

### Key Takeaway

Optimization creates enormous value in virtually every industry. The companies that master optimization -- in supply chain, pricing, scheduling, and resource allocation -- gain structural cost advantages and superior customer experiences.

**Sources**: HBS case studies on Amazon, American Airlines, and Uber. Bertsimas, D. & Freund, R. M. (2004). *Data, Models, and Decisions*. HBS Online, "Business Analytics" course.`,
    },
  ],
};
