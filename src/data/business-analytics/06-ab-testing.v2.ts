import { Module } from "../types";

export const abTestingModule: Module = {
  id: "ba-ab-testing",
  title: "A/B Testing & Experimentation",
  description: "Master A/B testing: experimental design, sample size, statistical power, result analysis, and common mistakes.",
  lessons: [
    {
      id: "ba-what-is-ab",
      slug: "what-is-ab-testing",
      title: "What is A/B Testing?",
      content: `## What is A/B Testing?

A/B testing (also called split testing or randomized controlled experiment) is the **gold standard for establishing causation in business**. HBS analytics courses teach that A/B testing is the most reliable way to answer "does this change actually improve our business?"

### How A/B Testing Works

1. **Randomly** divide your audience into two groups
2. **Control group (A)**: Experiences the current version
3. **Treatment group (B)**: Experiences the new version
4. **Measure** the outcome metric (conversion rate, revenue, engagement)
5. **Compare** results using statistical tests
6. **Decide**: Is the difference real (statistically significant) and meaningful (practically significant)?

### Why Randomization Matters

Randomization is what makes A/B testing powerful. By randomly assigning users to groups, you ensure that the two groups are identical on average -- the only difference is the treatment. This eliminates confounding variables and establishes causation.

Without randomization, you cannot distinguish between "our new design increased conversions" and "our new design happened to be shown to more engaged users."

### What Can Be A/B Tested?

| Area | Examples |
|------|----------|
| **Website/App** | Headlines, CTAs, layouts, colors, images, checkout flow |
| **Email** | Subject lines, send time, content, personalization |
| **Pricing** | Price points, discounts, free trial length |
| **Product** | Features, onboarding flows, recommendation algorithms |
| **Marketing** | Ad copy, targeting, landing pages, channels |

### The A/B Testing Process

**Step 1: Form a hypothesis**: "Changing the CTA button from green to orange will increase click-through rate by 10%."

**Step 2: Design the experiment**: Define the control and treatment, the success metric, sample size, and test duration.

**Step 3: Run the test**: Implement random assignment and collect data.

**Step 4: Analyze results**: Use statistical tests to determine if the difference is significant.

**Step 5: Make a decision**: Roll out the winner, iterate, or test further.

### Key Takeaway

A/B testing is the most rigorous way to evaluate business decisions. It replaces opinion with evidence and establishes causation rather than mere correlation. Every data-driven organization should have a robust A/B testing practice.

**Sources**: Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. Cambridge University Press. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-experiment-design",
      slug: "designing-experiments",
      title: "Designing Experiments",
      content: `## Designing Experiments

A well-designed experiment produces clear, actionable results. A poorly designed one wastes time and money while producing misleading conclusions. HBS analytics courses emphasize that **experiment design matters more than analysis** -- you cannot analyze your way out of a bad design.

### Key Design Decisions

**1. Define the Metric**: Choose one primary metric (the "success metric") and define it precisely. Having multiple primary metrics increases the chance of false positives.

**2. Choose the Unit of Randomization**: What are you randomizing? Users (most common), sessions, pages, or geographic regions?

**3. Determine Sample Size**: Calculate the sample size needed for statistical significance (covered in next lesson).

**4. Set the Duration**: How long to run the test? Must be long enough to capture a full business cycle and reach the required sample size.

**5. Define Success Criteria**: Before the test starts, define what constitutes a "winner." Minimum detectable effect (MDE), significance level, power.

### Experiment Design Best Practices

**Run one test at a time** (on the same metric). Multiple simultaneous tests on the same users can interact unpredictably.

**Do not peek at results early**. Statistical significance fluctuates during the test. Stopping early when results look good inflates false positive rates.

**Account for novelty effects**. Users may behave differently simply because something is new. Run tests long enough for novelty to wear off.

**Segment analysis**: After the test, examine results by segment (new vs. returning users, mobile vs. desktop). The average effect may hide important differences.

### Key Takeaway

Good experiment design requires discipline: define success clearly, calculate sample sizes, commit to the plan, and resist the temptation to peek. The investment in design pays dividends in the clarity and reliability of results.

**Sources**: Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-sample-size",
      slug: "sample-size-statistical-power",
      title: "Sample Size & Statistical Power",
      content: `## Sample Size & Statistical Power

Before running an A/B test, you must determine how many observations you need. Running a test that is too small risks missing a real effect (Type II error). Running one that is too large wastes time and resources.

### Key Concepts

**Statistical Power**: The probability of detecting a real effect when it exists. Convention: 80% power (20% chance of missing a real effect).

**Significance Level (alpha)**: The probability of detecting an effect when none exists (false positive). Convention: 5%.

**Minimum Detectable Effect (MDE)**: The smallest effect size you want to be able to detect. Smaller effects require larger samples.

**Baseline Rate**: The current performance (e.g., 3% conversion rate).

### The Sample Size Formula (Simplified)

For comparing two proportions:

n per group = (Z_alpha + Z_beta)^2 * 2 * p * (1-p) / MDE^2

Where:
- Z_alpha = 1.96 (for 5% significance)
- Z_beta = 0.84 (for 80% power)
- p = baseline proportion
- MDE = minimum detectable effect (absolute)

### Practical Rules of Thumb

| Baseline Rate | MDE | Sample Per Group |
|---------------|-----|------------------|
| 5% | 1% (5% -> 6%) | ~3,600 |
| 5% | 0.5% (5% -> 5.5%) | ~14,500 |
| 2% | 0.5% (2% -> 2.5%) | ~6,300 |
| 2% | 0.2% (2% -> 2.2%) | ~39,000 |

**Key insight**: Detecting small effects requires much larger samples. A 10% relative improvement (5% -> 5.5%) requires 4x more samples than a 20% relative improvement (5% -> 6%).

### What If You Do Not Have Enough Traffic?

1. **Increase the MDE**: Accept that you can only detect larger effects
2. **Reduce confidence**: Use 90% confidence instead of 95% (accept more risk of false positives)
3. **Run longer**: Accumulate more data over time
4. **Focus on high-traffic pages**: Test where you have the most users

### Key Takeaway

Sample size calculation is a non-negotiable step in experiment design. Running underpowered tests is worse than not testing at all -- you will get misleading results that lead to bad decisions.

**Sources**: Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-analyzing-results",
      slug: "analyzing-ab-results",
      title: "Analyzing Results",
      content: `## Analyzing A/B Test Results

Once the test has run for the planned duration and reached the required sample size, it is time to analyze. HBS analytics courses emphasize a disciplined, pre-committed approach to analysis.

### The Analysis Process

**Step 1: Check Data Quality**
- Did randomization work? (Compare control and treatment on pre-test metrics)
- Are sample sizes as expected? (No technical issues with assignment)
- Any data anomalies? (Outliers, bot traffic, technical errors)

**Step 2: Calculate the Primary Metric**
- Control: conversion rate (or other metric)
- Treatment: conversion rate
- Difference: treatment - control
- Relative lift: (treatment - control) / control * 100%

**Step 3: Statistical Test**
- For proportions (conversion rates): Z-test or chi-square test
- For means (revenue per user): t-test
- Report: p-value and confidence interval for the difference

**Step 4: Practical Significance**
- Is the effect large enough to matter? A statistically significant 0.01% improvement may not be worth the engineering cost to implement.
- Calculate the expected business impact: improvement * volume * value per conversion

**Step 5: Segment Analysis**
- Does the effect vary by user segment? (Device, geography, user tenure, traffic source)
- Be cautious of multiple comparisons -- segment analysis increases false positive risk

### Making the Decision

| Result | Action |
|--------|--------|
| Significant and practically meaningful improvement | Roll out treatment |
| Significant but tiny improvement | Consider cost of implementation vs. benefit |
| Not significant | Keep control (do NOT conclude treatment is worse unless CI excludes zero) |
| Significant degradation | Keep control; investigate why treatment hurt |

### Key Takeaway

A/B test analysis is straightforward when the test is well-designed. The hard part is discipline: committing to the pre-specified analysis plan, not peeking early, and making decisions based on both statistical and practical significance.

**Sources**: Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-ab-mistakes",
      slug: "ab-testing-mistakes",
      title: "Common A/B Testing Mistakes",
      content: `## Common A/B Testing Mistakes

A/B testing seems simple, but the details matter enormously. HBS analytics courses and industry practitioners at Google, Microsoft, and Netflix have documented the most common mistakes that lead to incorrect conclusions.

### Mistake 1: Peeking at Results

Checking results daily and stopping when they "look significant" dramatically inflates false positive rates. If you check a test 20 times during its run, you have a 64% chance of seeing a false positive (even with a 5% significance level).

**Solution**: Pre-commit to a sample size and duration. Do not analyze until the test is complete. If you must monitor, use sequential testing methods designed for continuous monitoring.

### Mistake 2: Underpowered Tests

Running tests without enough traffic to detect the expected effect size. An underpowered test will frequently conclude "no difference" when a real difference exists.

**Solution**: Calculate sample size before starting. If you cannot achieve the required sample, either accept a larger MDE or do not test.

### Mistake 3: Multiple Comparisons

Testing multiple metrics or segments inflates the chance of false positives. If you test 20 metrics, you expect 1 to be "significant" by chance (at 5% significance).

**Solution**: Designate one primary metric. Apply corrections (Bonferroni, Benjamini-Hochberg) for secondary metrics. Pre-register your analysis plan.

### Mistake 4: Ignoring Novelty and Primacy Effects

- **Novelty effect**: Users click on new things because they are new, not because they are better. The effect fades.
- **Primacy effect**: Users resist change and initially perform worse with new designs, but adapt over time.

**Solution**: Run tests long enough for these effects to stabilize (typically 2-4 weeks).

### Mistake 5: Wrong Randomization Unit

Randomizing by page view instead of by user means the same user can see both versions across different visits, contaminating the experiment.

**Solution**: Randomize at the user level. Use cookies or user IDs to ensure consistent assignment.

### Mistake 6: Testing Too Many Things at Once

Changing multiple elements simultaneously (headline + image + CTA + layout) makes it impossible to know which change drove the result.

**Solution**: Test one variable at a time. Or use multivariate testing with appropriate statistical methods.

### Mistake 7: Not Considering Downstream Effects

A change that improves click-through rate may decrease conversion rate. Optimizing one metric can harm others.

**Solution**: Monitor both the primary metric and key guardrail metrics (metrics that should not be harmed).

### Key Takeaway

A/B testing mistakes are subtle but consequential. The most common error -- peeking at results and stopping early -- produces unreliable conclusions that lead to bad decisions. Disciplined experiment design and analysis are essential.

**Sources**: Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments*. Kohavi, R. & Thomke, S. (2017). "The Surprising Power of Online Experiments." *Harvard Business Review*. HBS Online, "Business Analytics" course.`,
    },
  ],
};
