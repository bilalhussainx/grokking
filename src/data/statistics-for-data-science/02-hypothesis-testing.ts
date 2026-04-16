import { Module } from "../types";

export const module2: Module = {
  id: "hypothesis-testing",
  title: "Hypothesis Testing, A/B Tests & Regression",
  description: "p-values, statistical power, t-tests, chi-square tests, running rigorous A/B tests, linear regression, and Bayesian thinking",
  lessons: [
    {
      id: "hypothesis-ab-testing",
      slug: "hypothesis-ab-testing",
      title: "Hypothesis Testing & A/B Experiments",
      content: `# Hypothesis Testing & A/B Tests

The most common statistical task in industry is A/B testing. Doing it correctly requires understanding p-values, power, and effect sizes — not just "is p < 0.05?"

---

## The Hypothesis Testing Framework

\`\`\`python
from scipy import stats
import numpy as np

# Hypothesis testing framework:
# H0 (null hypothesis): No effect — differences are random noise
# H1 (alternative): Effect exists
# α (significance level): Threshold for "statistically significant" (usually 0.05)
# p-value: P(observing this data or more extreme | H0 is true)
# If p < α: Reject H0 (evidence for H1)

# Example: Did our new checkout flow improve conversion rate?
control   = {'conversions': 1200, 'visitors': 10000}   # 12%
treatment = {'conversions': 1350, 'visitors': 10000}   # 13.5%

# 2-proportion z-test:
count = np.array([treatment['conversions'], control['conversions']])
nobs  = np.array([treatment['visitors'],    control['visitors']])

z_stat, p_value = stats.proportions_ztest(count, nobs, alternative='larger')

print(f"Z-statistic: {z_stat:.4f}")
print(f"P-value: {p_value:.4f}")
print(f"Significant at α=0.05: {p_value < 0.05}")
\`\`\`

## What p-values Actually Mean

\`\`\`compare
{
  "title": "p-value Myths vs Reality",
  "items": [
    {
      "name": "❌ Myth: p < 0.05 means 95% probability the effect is real",
      "description": "FALSE. p-value is P(data | H0 is true) — not P(H0 is false | data). A p-value says nothing about the probability that your hypothesis is correct."
    },
    {
      "name": "❌ Myth: p = 0.049 is significant; p = 0.051 is not",
      "description": "FALSE. The 0.05 threshold is arbitrary. p = 0.049 and p = 0.051 are essentially the same evidence. Report the actual p-value, not just whether it crosses a threshold."
    },
    {
      "name": "✅ Reality: p < 0.05 means...",
      "description": "If there truly were no effect (H0 true), we would observe data this extreme or more extreme only 5% of the time by chance. A small p-value means the data would be surprising if H0 were true."
    },
    {
      "name": "✅ Effect size matters more",
      "description": "A tiny effect can be statistically significant with enough data. Always compute and report effect size (Cohen's d, relative lift, odds ratio). Statistical significance ≠ practical significance."
    }
  ]
}
\`\`\`

## Statistical Power & Sample Size

\`\`\`python
from statsmodels.stats.power import NormalIndPower, TTestIndPower

# Power = P(detect effect | effect exists) = 1 - β (Type II error rate)
# Standard: power = 0.80 (80% chance to detect a real effect)

# Sample size calculation (before running the experiment!):
analysis = NormalIndPower()

# How many users do we need to detect a 1% absolute lift in conversion (10% → 11%)?
p1 = 0.10    # control conversion rate
p2 = 0.11    # treatment conversion rate (minimum detectable effect)
effect_size = (p2 - p1) / np.sqrt((p1*(1-p1) + p2*(1-p2)) / 2)  # Cohen's h

n = analysis.solve_power(
    effect_size=effect_size,
    alpha=0.05,    # significance level
    power=0.80,    # desired power
    alternative='two-sided',
)
print(f"Required sample size per group: {int(np.ceil(n))}")
# Run for 2*n total users (n per group)

# NEVER PEEK AT RESULTS EARLY (without corrections):
# Each peek increases Type I error rate.
# If you peek 5 times, your actual α is ~0.14, not 0.05.
# Use: Sequential testing (alpha spending), Bayesian methods, or fix run time in advance.
\`\`\`

## Common Statistical Tests

\`\`\`python
# --- t-test: Compare means ---
# One-sample: Is the mean different from a value?
t_stat, p = stats.ttest_1samp(data, popmean=100)

# Independent samples: Are two groups different?
t_stat, p = stats.ttest_ind(group_a, group_b, equal_var=False)  # Welch's t-test (safer)

# Paired: Before vs after for SAME subjects
t_stat, p = stats.ttest_rel(before, after)

# --- Chi-square: Compare proportions/categorical ---
# Are two categorical variables independent?
contingency_table = np.array([[1200, 8800], [1350, 8650]])  # [converted, not converted] × [control, treatment]
chi2, p, dof, expected = stats.chi2_contingency(contingency_table)

# --- Mann-Whitney U: Non-parametric (for non-normal data) ---
stat, p = stats.mannwhitneyu(group_a, group_b, alternative='two-sided')
# Use when n < 30 or distribution is clearly non-normal
\`\`\`

## Linear Regression: Statistical Interpretation

\`\`\`python
import statsmodels.api as sm

X = sm.add_constant(df[['sqft', 'bedrooms', 'age']])  # Adds intercept
y = df['price']

model = sm.OLS(y, X).fit()
print(model.summary())

# Output includes:
# - Coefficient: β₁ (effect of 1-unit change in sqft on price)
# - Std Error: uncertainty in coefficient estimate
# - t-statistic: coefficient / std_error
# - P>|t|: p-value for H0: βᵢ = 0 (feature has no effect)
# - [0.025, 0.975]: 95% confidence interval for coefficient
# - R-squared: % of variance explained by model (not model quality by itself)
# - F-statistic: Overall model significance

# Confidence Intervals:
# β ± 1.96 * SE  (for large n)
# Interpretation: "95% confident the true coefficient is in this range"
# NOT: "95% probability the coefficient is in this range"
\`\`\`

\`\`\`takeaways
["p-value = P(data | H0) — not P(H0 | data). Never say 'probability effect is real' from a p-value alone.", "Calculate sample size BEFORE running A/B test. Rule of thumb: n ≥ (2.5/effect_size)^2 per group.", "Peeking invalidates p-values — every extra look inflates Type I error. Fix test duration in advance.", "Effect size (Cohen's d, relative lift) matters more than p-value — statistically significant tiny effects aren't worth shipping.", "Welch's t-test (equal_var=False) is safer than Student's t-test — doesn't assume equal variances between groups.", "Mann-Whitney U is the nonparametric alternative to t-test — use it for skewed data or small samples"]
\`\`\`
`,
    },
  ],
};
