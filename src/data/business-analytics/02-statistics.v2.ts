import { Module } from "../types";

export const statisticsModule: Module = {
  id: "ba-statistics",
  title: "Statistics for Business",
  description: "Master descriptive statistics, probability distributions, hypothesis testing, confidence intervals, and correlation vs. causation.",
  lessons: [
    {
      id: "ba-descriptive-stats",
      slug: "descriptive-statistics",
      title: "Descriptive Statistics",
      content: `## Descriptive Statistics

Descriptive statistics summarize and describe the main features of a dataset. They are the foundation of all business analytics and the starting point for any data analysis. HBS analytics courses emphasize that **you must understand your data descriptively before applying any advanced technique.**

### Measures of Central Tendency

**Mean (Average)**: Sum of all values divided by the count. Sensitive to outliers.

**Median**: The middle value when data is sorted. Robust to outliers. When income is discussed, median is more informative than mean because a few billionaires skew the mean upward.

**Mode**: The most frequent value. Useful for categorical data (most common product purchased, most frequent complaint type).

### Measures of Spread

**Range**: Maximum - Minimum. Simple but sensitive to outliers.

**Variance**: Average of squared deviations from the mean. Measures how spread out the data is.

**Standard Deviation**: Square root of variance. In the same units as the data, making it more interpretable.

**Interquartile Range (IQR)**: Q3 - Q1 (75th percentile minus 25th percentile). Robust to outliers.

### The 68-95-99.7 Rule (Normal Distribution)

For normally distributed data:
- 68% of values fall within 1 standard deviation of the mean
- 95% fall within 2 standard deviations
- 99.7% fall within 3 standard deviations

This rule helps identify outliers and set expectations.

### Business Applications

| Statistic | Business Use |
|-----------|-------------|
| Mean revenue per customer | Customer value assessment |
| Median response time | Service level monitoring |
| Standard deviation of sales | Demand variability for inventory |
| Percentiles | Performance benchmarking (top 10%, bottom 25%) |

### Key Takeaway

Descriptive statistics are the starting point for all analytics. Always examine your data descriptively before building models. Mean and standard deviation for symmetric data; median and IQR for skewed data.

**Sources**: Wheelan, C. (2013). *Naked Statistics*. W. W. Norton. HBS Online, "Business Analytics" course.`,
      starterCode: `# Descriptive Statistics in Python
import statistics

# Sample data: monthly revenue ($K) for 12 months
revenue = [120, 135, 128, 142, 155, 148, 162, 158, 170, 165, 175, 180]

# TODO: Calculate and print the following:
# 1. Mean revenue
# 2. Median revenue
# 3. Standard deviation
# 4. Min and Max
# 5. Range

# Hint: Use statistics.mean(), statistics.median(), statistics.stdev()
print("Monthly Revenue Analysis")
print("=" * 30)`,
      solutionCode: `# Descriptive Statistics in Python
import statistics

revenue = [120, 135, 128, 142, 155, 148, 162, 158, 170, 165, 175, 180]

print("Monthly Revenue Analysis")
print("=" * 30)
print(f"Mean:      \${statistics.mean(revenue):.1f}K")
print(f"Median:    \${statistics.median(revenue):.1f}K")
print(f"Std Dev:   \${statistics.stdev(revenue):.1f}K")
print(f"Min:       \${min(revenue)}K")
print(f"Max:       \${max(revenue)}K")
print(f"Range:     \${max(revenue) - min(revenue)}K")

# Quartiles
sorted_rev = sorted(revenue)
n = len(sorted_rev)
q1 = statistics.median(sorted_rev[:n//2])
q3 = statistics.median(sorted_rev[n//2:])
print(f"Q1:        \${q1}K")
print(f"Q3:        \${q3}K")
print(f"IQR:       \${q3 - q1}K")`,
    },
    {
      id: "ba-distributions",
      slug: "probability-distributions",
      title: "Probability Distributions",
      content: `## Probability Distributions

A probability distribution describes how likely different outcomes are. Understanding distributions is essential for business analytics because **every business metric follows some distribution**, and knowing the distribution allows you to set expectations, identify anomalies, and make predictions.

### The Normal (Gaussian) Distribution

The bell curve. Many natural phenomena approximate a normal distribution: test scores, measurement errors, heights, and many business metrics when sample sizes are large.

**Properties**: Symmetric around the mean. Fully defined by mean and standard deviation. The 68-95-99.7 rule applies.

**Business use**: Quality control (defect rates), financial modeling, setting performance benchmarks.

### The Binomial Distribution

Models the number of successes in a fixed number of independent trials, each with the same probability of success.

**Parameters**: n (number of trials), p (probability of success per trial)

**Business use**: Conversion rates (n visitors, each with probability p of converting), quality inspection (n items, each with probability p of being defective), A/B testing.

### The Poisson Distribution

Models the number of events occurring in a fixed interval of time or space, when events occur independently at a constant average rate.

**Parameter**: lambda (average number of events per interval)

**Business use**: Customer arrivals per hour, support tickets per day, server errors per minute.

### Skewed Distributions

Many business metrics are NOT normally distributed:
- **Income**: Right-skewed (most people earn moderate amounts, few earn extremely high amounts)
- **Customer spending**: Right-skewed (most customers spend a little, few spend a lot)
- **Time-to-event**: Often right-skewed (most tasks complete quickly, a few take much longer)

For skewed distributions, the median is more informative than the mean.

### Why Distributions Matter in Business

1. **Setting SLAs**: If support response times follow a log-normal distribution, you can set an SLA at the 95th percentile.
2. **Inventory planning**: Understanding demand distribution helps set safety stock levels.
3. **Risk management**: The tails of the distribution (extreme events) are where risk lives.
4. **A/B testing**: Statistical tests assume specific distributions for valid inference.

### Key Takeaway

Every business metric has a distribution. Knowing the distribution helps you set realistic expectations, identify unusual events, and apply the right analytical methods. When in doubt, plot your data -- visualization reveals the distribution faster than any formula.

**Sources**: Wheelan, C. (2013). *Naked Statistics*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-hypothesis",
      slug: "hypothesis-testing",
      title: "Hypothesis Testing",
      content: `## Hypothesis Testing

Hypothesis testing is the statistical framework for making decisions based on data. It answers the question: **is the pattern we observe in our data real, or could it have occurred by chance?** HBS analytics courses emphasize hypothesis testing as the foundation of rigorous business experimentation.

### The Framework

**Step 1: State the Hypotheses**
- Null hypothesis (H0): No effect, no difference (the status quo)
- Alternative hypothesis (H1): There IS an effect or difference

**Step 2: Choose a Significance Level**
- Alpha (typically 0.05): The probability of rejecting H0 when it is actually true (Type I error)
- A lower alpha (0.01) requires stronger evidence to reject H0

**Step 3: Collect Data and Calculate Test Statistic**

**Step 4: Calculate p-value**
- The probability of observing results as extreme as what was observed, assuming H0 is true

**Step 5: Make a Decision**
- If p-value < alpha: Reject H0 (result is "statistically significant")
- If p-value >= alpha: Fail to reject H0 (insufficient evidence)

### Common Tests

| Test | When to Use |
|------|------------|
| **t-test** | Compare means of two groups |
| **Chi-square test** | Test association between categorical variables |
| **ANOVA** | Compare means of 3+ groups |
| **Z-test** | Compare proportions (large samples) |

### Business Example: A/B Test

You run an A/B test on your website checkout page:
- Control (A): 2.1% conversion rate (1,050 conversions / 50,000 visitors)
- Treatment (B): 2.4% conversion rate (1,200 conversions / 50,000 visitors)

Is the 0.3% difference real or just random noise?

H0: Conversion rates are equal (no difference)
H1: Conversion rates are different

A statistical test yields p-value = 0.02. Since 0.02 < 0.05, we reject H0 and conclude the difference is statistically significant.

### Statistical vs. Practical Significance

**Statistical significance** means the result is unlikely due to chance.
**Practical significance** means the result matters for business.

With a large enough sample, even a 0.01% difference can be statistically significant. But is a 0.01% conversion improvement worth the engineering effort to implement? Always consider practical significance alongside statistical significance.

### Key Takeaway

Hypothesis testing provides a disciplined framework for determining whether observed patterns are real or due to chance. It is essential for A/B testing, quality control, and any data-driven decision. But always pair statistical significance with practical significance.

**Sources**: Wheelan, C. (2013). *Naked Statistics*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-confidence",
      slug: "confidence-intervals",
      title: "Confidence Intervals",
      content: `## Confidence Intervals

A confidence interval provides a range of plausible values for a population parameter based on sample data. Rather than saying "the average is 42," a confidence interval says "we are 95% confident the average is between 38 and 46." HBS teaches that **communicating uncertainty is as important as communicating estimates.**

### What a Confidence Interval Means

A 95% confidence interval means: if we repeated this sampling process many times, 95% of the intervals we construct would contain the true population value.

It does NOT mean: there is a 95% probability that the true value lies within this interval. (The true value is fixed; the interval is random.)

### Calculating a Confidence Interval

For a mean: CI = Sample Mean +/- (Critical Value x Standard Error)

Standard Error = Standard Deviation / sqrt(Sample Size)

**Key insight**: Larger sample sizes produce narrower confidence intervals (more precision). This is why sample size matters in business analytics.

### Business Applications

- **Customer satisfaction**: "Average satisfaction is 4.2 out of 5, with a 95% CI of [4.0, 4.4]"
- **Revenue forecasting**: "Expected Q4 revenue is \\$10M, with a 95% CI of [\\$8.5M, \\$11.5M]"
- **A/B testing**: "The conversion rate improvement is 0.3%, with a 95% CI of [0.1%, 0.5%]"

### Margin of Error

The margin of error is half the width of the confidence interval. Political polls report margins of error: "Candidate A leads by 52% to 48%, with a margin of error of +/- 3%." This means the true support could be anywhere from 49% to 55%.

### Confidence Level Trade-off

Higher confidence = wider interval. Lower confidence = narrower interval.

- 90% CI: Narrower (less certain, more precise)
- 95% CI: Standard (good balance)
- 99% CI: Wider (more certain, less precise)

The 95% level is conventional, but the right level depends on the cost of being wrong.

### Key Takeaway

Confidence intervals communicate both the estimate and the uncertainty around it. Always report confidence intervals alongside point estimates. Decisions based on a number without understanding its uncertainty are decisions made in the dark.

**Sources**: Wheelan, C. (2013). *Naked Statistics*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-correlation-causation",
      slug: "correlation-vs-causation",
      title: "Correlation vs. Causation",
      content: `## Correlation vs. Causation

The distinction between correlation (two things happen together) and causation (one thing causes the other) is the **single most important concept in business analytics**. HBS professors emphasize that confusing correlation with causation leads to wasted resources, failed strategies, and sometimes dangerous conclusions.

### What is Correlation?

Correlation measures the strength and direction of the linear relationship between two variables.

- **Positive correlation** (r close to +1): As one variable increases, the other tends to increase
- **Negative correlation** (r close to -1): As one variable increases, the other tends to decrease
- **No correlation** (r close to 0): No linear relationship

### Famous Spurious Correlations

- Ice cream sales and drowning deaths (both increase in summer -- heat causes both)
- Per capita cheese consumption and death by bedsheet entanglement (r = 0.95, purely coincidental)
- Nicolas Cage movies and swimming pool drownings (r = 0.67, obviously meaningless)

### Why Correlation Does Not Imply Causation

**1. Reverse Causality**: X might cause Y, or Y might cause X. Do happy employees cause high productivity, or does high productivity cause happiness?

**2. Confounding Variables**: A third variable (C) causes both X and Y. Education level (C) might cause both higher income (X) and better health (Y).

**3. Coincidence**: With enough variables, some will correlate by chance. Data mining thousands of variables will produce spurious correlations.

### Establishing Causation

To establish causation, you need one of:

**1. Randomized Controlled Experiment (RCT)**: Randomly assign subjects to treatment and control groups. If the treatment group differs, the treatment caused it. This is the gold standard (and the basis of A/B testing).

**2. Natural Experiment**: An external event creates random-like assignment. A new law affects some regions but not others, creating a natural control group.

**3. Instrumental Variables**: Advanced statistical technique that uses a third variable to isolate the causal effect.

**4. Strong theoretical basis + multiple supporting evidence**: When experiments are impossible, strong theory plus consistent correlational evidence from multiple studies can build a reasonable causal case.

### Business Implications

| Observation | Correlation or Causation? | What to Do |
|-------------|--------------------------|------------|
| Customers who use feature X have higher retention | Probably correlation (engaged customers use more features) | Run an A/B test |
| Countries with more chocolate consumption win more Nobel Prizes | Spurious correlation | Nothing |
| Employees who attend training earn more | Possibly correlation (ambitious employees seek training) | Use matched comparison |

### Key Takeaway

Correlation is useful for identifying potential relationships, but only experimentation (or quasi-experimental methods) can establish causation. Before investing in a strategy based on a correlation, ask: "Could this be explained by a third variable, reverse causality, or coincidence?" If yes, test with an experiment before scaling.

**Sources**: Wheelan, C. (2013). *Naked Statistics*. Pearl, J. (2018). *The Book of Why*. HBS Online, "Business Analytics" course.`,
    },
  ],
};
