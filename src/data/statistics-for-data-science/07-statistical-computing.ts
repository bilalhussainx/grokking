import { Module } from "../types";

export const module7: Module = {
  id: "statistical-computing",
  title: "Statistical Computing with Python",
  description: "SciPy statistical tests, bootstrapping and permutation tests, Monte Carlo simulation, multiple testing corrections, and building a reproducible statistical analysis workflow",
  lessons: [
    {
      id: "statistical-computing",
      slug: "statistical-computing",
      title: "Statistical Computing & Simulation",
      content: `# Statistical Computing with Python

Modern statistics is computational statistics. Bootstrapping, permutation tests, and Monte Carlo simulation replace many assumptions with computation — making statistics applicable even when classical assumptions are violated.

---

\`\`\`concept
{
  "title": "Simulation Over Assumptions",
  "variant": "mental-model",
  "content": "Classical tests make assumptions (normality, equal variance, large samples) because statisticians needed closed-form math before computers. Today, computing is cheap. Bootstrapping: resample your data 10,000 times to build an empirical sampling distribution — no normality assumption needed. Permutation test: shuffle labels 10,000 times to build the null distribution — no parametric assumption about the test statistic. When assumptions are questionable, simulate your way to an answer."
}
\`\`\`

---

## Bootstrapping

\`\`\`python
import numpy as np
from scipy import stats

# Bootstrap: estimate sampling distribution by resampling with replacement
# No assumption about the underlying distribution

np.random.seed(42)
data = np.array([23, 45, 12, 67, 34, 89, 45, 23, 56, 78, 34, 45, 67, 23, 45])

# Bootstrap confidence interval for the mean:
n_bootstrap = 10_000
bootstrap_means = [
    np.mean(np.random.choice(data, size=len(data), replace=True))
    for _ in range(n_bootstrap)
]

# Percentile CI:
ci_lower, ci_upper = np.percentile(bootstrap_means, [2.5, 97.5])
print(f"95% Bootstrap CI: ({ci_lower:.2f}, {ci_upper:.2f})")
print(f"Bootstrap SE: {np.std(bootstrap_means):.2f}")

# Bootstrap CI for any statistic (e.g., median, correlation):
bootstrap_medians = [
    np.median(np.random.choice(data, size=len(data), replace=True))
    for _ in range(n_bootstrap)
]
ci_median = np.percentile(bootstrap_medians, [2.5, 97.5])
print(f"95% Median CI: ({ci_median[0]:.2f}, {ci_median[1]:.2f})")

# Bootstrap for regression coefficients:
from sklearn.linear_model import LinearRegression
import pandas as pd

def bootstrap_regression(X, y, n_bootstrap=1000):
    coefs = []
    n = len(y)
    for _ in range(n_bootstrap):
        idx = np.random.choice(n, n, replace=True)
        model = LinearRegression().fit(X[idx], y[idx])
        coefs.append(model.coef_)
    return np.array(coefs)

coef_samples = bootstrap_regression(X_train, y_train)
# 95% CI for each coefficient:
ci = np.percentile(coef_samples, [2.5, 97.5], axis=0)
\`\`\`

## Permutation Tests

\`\`\`python
# Permutation test: build the null distribution by randomly shuffling labels
# Question: Is the observed difference between groups real or due to chance?

def permutation_test(group_a, group_b, n_permutations=10_000, statistic='mean_diff'):
    observed = np.mean(group_a) - np.mean(group_b)  # observed difference

    # Pool all observations:
    combined = np.concatenate([group_a, group_b])
    n_a = len(group_a)

    # Shuffle and recompute the statistic n_permutations times:
    null_distribution = []
    for _ in range(n_permutations):
        shuffled = np.random.permutation(combined)
        perm_a = shuffled[:n_a]
        perm_b = shuffled[n_a:]
        null_distribution.append(np.mean(perm_a) - np.mean(perm_b))

    # p-value: proportion of null stats more extreme than observed
    p_value = np.mean(np.abs(null_distribution) >= np.abs(observed))

    return observed, p_value, null_distribution

# Example: are two groups different?
control_revenue = [45, 52, 38, 61, 49, 43, 55, 47, 58, 42]
treatment_revenue = [51, 60, 55, 68, 54, 62, 58, 65, 57, 63]

diff, p_val, null_dist = permutation_test(control_revenue, treatment_revenue)
print(f"Observed difference: {diff:.2f}")
print(f"Permutation p-value: {p_val:.4f}")

# Visualize the null distribution:
import matplotlib.pyplot as plt
plt.hist(null_dist, bins=50, density=True, alpha=0.7)
plt.axvline(diff, color='red', linestyle='--', label=f'Observed: {diff:.2f}')
plt.axvline(-diff, color='red', linestyle='--')
plt.xlabel('Difference in means')
plt.title(f'Permutation test (p = {p_val:.4f})')
\`\`\`

## Monte Carlo Simulation

\`\`\`python
# Monte Carlo: simulate complex systems by sampling from probability distributions

# --- Financial risk: Value at Risk (VaR) ---
# What's the worst 1% loss on a portfolio?

portfolio_value = 1_000_000
daily_returns_mean = 0.001    # 0.1% daily return
daily_returns_std = 0.02      # 2% daily volatility

n_days = 252  # trading days in a year
n_simulations = 100_000

# Simulate annual portfolio paths:
final_values = []
for _ in range(n_simulations):
    daily_returns = np.random.normal(daily_returns_mean, daily_returns_std, n_days)
    path = portfolio_value * np.prod(1 + daily_returns)
    final_values.append(path)

final_values = np.array(final_values)
var_95 = portfolio_value - np.percentile(final_values, 5)   # 95% VaR
var_99 = portfolio_value - np.percentile(final_values, 1)   # 99% VaR

print(f"95% VaR: \${var_95:,.0f} (5% chance of losing more than this)")
print(f"99% VaR: \${var_99:,.0f} (1% chance of losing more than this)")

# --- Bootstrapped power analysis ---
def simulate_power(effect_size, n_per_group, n_simulations=5000):
    rejected = 0
    for _ in range(n_simulations):
        control = np.random.normal(0, 1, n_per_group)
        treatment = np.random.normal(effect_size, 1, n_per_group)
        _, p = stats.ttest_ind(control, treatment)
        if p < 0.05:
            rejected += 1
    return rejected / n_simulations

# Power curve:
for n in [50, 100, 200, 500, 1000]:
    power = simulate_power(effect_size=0.3, n_per_group=n)
    print(f"n={n}: power={power:.2f}")
\`\`\`

## Multiple Testing Corrections

\`\`\`python
from statsmodels.stats.multitest import multipletests

# Problem: run 20 independent tests at α=0.05 → expect 1 false positive by chance
# FWER (Family-wise error rate) and FDR corrections address this

p_values = [0.001, 0.008, 0.039, 0.041, 0.042, 0.06, 0.074, 0.200, 0.500, 0.900]

# Bonferroni: FWER control — divide α by number of tests
# Most conservative — use when you need to control ANY false positive
bonf_result = multipletests(p_values, alpha=0.05, method='bonferroni')
print("Bonferroni rejected:", bonf_result[0])
# [True, True, False, False, False, False, False, False, False, False]

# Benjamini-Hochberg (FDR): controls false discovery RATE
# Use when you can tolerate some false positives among discoveries
bh_result = multipletests(p_values, alpha=0.05, method='fdr_bh')
print("BH FDR rejected:", bh_result[0])
# [True, True, True, True, True, False, False, False, False, False]

# When to use which:
# Bonferroni: medical trials, genome-wide studies, any "single mistake is costly"
# BH FDR: exploratory analysis, feature selection, discovering candidate hypotheses

# Rule of thumb:
# Testing 5 hypotheses → Bonferroni is fine
# Testing 100+ hypotheses → use BH FDR (Bonferroni is too conservative)
\`\`\`

## Reproducible Analysis Workflow

\`\`\`python
# --- Setting random seeds ---
import numpy as np
import random
import os

def set_seeds(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    # For PyTorch: torch.manual_seed(seed)
    # For TensorFlow: tf.random.set_seed(seed)

set_seeds(42)

# --- Reproducible analysis checklist ---
# 1. Set random seeds at the start of every notebook
# 2. Save exact package versions: pip freeze > requirements.txt
# 3. Use data version control (DVC) for datasets
# 4. Pre-register analysis plan before collecting data (AsPredicted.org)
# 5. Separate exploration (EDA) from confirmation (hypothesis testing)
#    → Hypotheses generated from EDA CANNOT be tested on the same data
# 6. Report full results including non-significant findings
#    → p-hacking: running many tests and reporting only the significant ones

# --- Data pipeline with logging ---
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

def run_analysis(df, outcome_col, treatment_col, covariates):
    logging.info(f"Analysis start: n={len(df)}, treatment_rate={df[treatment_col].mean():.2%}")

    # Pre-processing:
    df_clean = df.dropna(subset=[outcome_col, treatment_col] + covariates)
    logging.info(f"After dropping NaN: n={len(df_clean)}")

    # Analysis:
    result = sm.OLS(df_clean[outcome_col],
                    sm.add_constant(df_clean[[treatment_col] + covariates])).fit()
    logging.info(f"Treatment effect: {result.params[treatment_col]:.4f}, p={result.pvalues[treatment_col]:.4f}")

    return result
\`\`\`

\`\`\`takeaways
["Bootstrap resampling replaces parametric assumptions — use it whenever you're unsure your data meets test assumptions.", "Permutation tests build the null distribution from your data — the most assumption-free approach to hypothesis testing.", "Monte Carlo is universal: if you can simulate the generative process, you can estimate any probability.", "Multiple testing: Bonferroni for strict error control (medical), BH FDR for exploratory discovery (data science).", "Pre-register your analysis before running it — prevents 'researcher degrees of freedom' and p-hacking.", "EDA and hypothesis testing must use different data splits — tests generated from EDA can't be confirmed on the same dataset."]
\`\`\`
`,
    },
  ],
};
