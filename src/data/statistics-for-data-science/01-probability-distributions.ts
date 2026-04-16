import { Module } from "../types";

export const module1: Module = {
  id: "probability-distributions",
  title: "Probability, Distributions & Central Limit Theorem",
  description: "Probability fundamentals, common distributions (Normal, Binomial, Poisson), and the Central Limit Theorem that makes statistical inference possible",
  lessons: [
    {
      id: "probability-fundamentals",
      slug: "probability-fundamentals",
      title: "Probability, Distributions & the CLT",
      content: `# Statistics for Data Science

Statistics is the language of uncertainty. Without it, you can't tell whether your A/B test result is real or noise, whether your model improved or just got lucky.

---

\`\`\`concept
{
  "title": "Why Statistics Matters in Data Science",
  "variant": "mental-model",
  "content": "A data scientist without statistics is dangerous. They'll see a 2% improvement in A/B test and ship it — not knowing there's a 30% chance it's random noise. They'll train a model that performs better in testing and not realize it was p-hacked with 50 hyperparameter configurations. Statistics tells you what you can and cannot conclude from data."
}
\`\`\`

---

## Probability Fundamentals

\`\`\`python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# Probability rules:
# P(A or B) = P(A) + P(B) - P(A and B)     (addition rule)
# P(A and B) = P(A) * P(B|A)               (multiplication rule)
# P(A|B) = P(B|A) * P(A) / P(B)            (Bayes' theorem)

# Conditional probability example:
# Medical test: 1% of population has disease
# Test: 99% sensitivity (P(positive | disease)), 95% specificity (P(negative | healthy))
p_disease = 0.01
p_positive_given_disease = 0.99   # sensitivity
p_positive_given_healthy = 0.05   # 1 - specificity (false positive rate)

p_healthy = 1 - p_disease
p_positive = (p_positive_given_disease * p_disease +
              p_positive_given_healthy * p_healthy)

# Bayes' theorem: P(disease | positive test) =
p_disease_given_positive = (p_positive_given_disease * p_disease) / p_positive
print(f"P(disease | positive test) = {p_disease_given_positive:.2%}")
# Only 16.5%! Even with a 99% sensitive test, most positives are false positives
# when the disease is rare. This is the base rate fallacy.
\`\`\`

## Key Probability Distributions

\`\`\`python
from scipy import stats
import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 8))

# 1. Normal (Gaussian) — continuous, symmetric
norm = stats.norm(loc=0, scale=1)    # mean=0, std=1 (standard normal)
x = np.linspace(-4, 4, 100)
axes[0,0].plot(x, norm.pdf(x))
axes[0,0].set_title('Normal(μ=0, σ=1)\\nHeight, IQ, Measurement errors')
# P(X between a and b):
print(f"P(-1 < X < 1) = {norm.cdf(1) - norm.cdf(-1):.2%}")  # 68%
print(f"P(-2 < X < 2) = {norm.cdf(2) - norm.cdf(-2):.2%}")  # 95%
print(f"P(-3 < X < 3) = {norm.cdf(3) - norm.cdf(-3):.2%}")  # 99.7% (68-95-99.7 rule)

# 2. Binomial — discrete, count of successes in n trials
binom = stats.binom(n=20, p=0.3)    # 20 trials, 30% success rate
k = np.arange(0, 21)
axes[0,1].bar(k, binom.pmf(k))
axes[0,1].set_title('Binomial(n=20, p=0.3)\\nCoin flips, A/B test conversions')
print(f"P(X=6) = {binom.pmf(6):.4f}")         # Exact
print(f"P(X<=6) = {binom.cdf(6):.4f}")        # CDF (cumulative)
print(f"Mean = {binom.mean()}, Std = {binom.std():.2f}")

# 3. Poisson — discrete, events per unit time/space
poisson = stats.poisson(mu=3)   # avg 3 events per hour
k = np.arange(0, 15)
axes[0,2].bar(k, poisson.pmf(k))
axes[0,2].set_title('Poisson(λ=3)\\nCustomer arrivals, Bug reports, Defects')
print(f"P(X=0) = {poisson.pmf(0):.4f}")   # Prob of 0 events in an hour

# 4. Exponential — time between events (continuous)
exp_dist = stats.expon(scale=1/3)  # rate=3 events/hour → mean wait = 1/3 hr
x = np.linspace(0, 3, 100)
axes[1,0].plot(x, exp_dist.pdf(x))
axes[1,0].set_title('Exponential(λ=3)\\nTime between events, Survival analysis')

# 5. Uniform — equal probability everywhere
uniform = stats.uniform(loc=0, scale=10)   # [0, 10]
x = np.linspace(-1, 11, 100)
axes[1,1].plot(x, uniform.pdf(x))
axes[1,1].set_title('Uniform(0, 10)\\nRandom sampling, p-values under H0')

plt.tight_layout()
plt.show()
\`\`\`

## The Central Limit Theorem

\`\`\`python
# CLT: Sum/mean of many independent samples → Normal, regardless of original distribution
# This is WHY most statistical tests assume normality

np.random.seed(42)
n_experiments = 10000

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Start from a very non-normal distribution (exponential):
for i, sample_size in enumerate([1, 10, 100]):
    sample_means = [
        np.random.exponential(scale=1, size=sample_size).mean()
        for _ in range(n_experiments)
    ]
    axes[i].hist(sample_means, bins=50, density=True)
    axes[i].set_title(f'n={sample_size}: {"Original" if sample_size==1 else "Sample means"}')

plt.suptitle('Central Limit Theorem: Exponential → Normal as n increases')
plt.tight_layout()
plt.show()

# CLT enables:
# - Confidence intervals for any distribution
# - Hypothesis tests based on z/t statistics
# - A/B test analysis even when click rates are non-normal
# "n > 30" rule of thumb: CLT approximation is good enough for most applications

# Standard Error of the Mean:
# SEM = std / sqrt(n)
# As sample size increases, the sampling distribution of the mean becomes narrower
population_std = 10
for n in [10, 100, 1000]:
    sem = population_std / np.sqrt(n)
    print(f"n={n}: SEM = {sem:.2f}")
# n=10:  SEM = 3.16
# n=100: SEM = 1.00
# n=1000: SEM = 0.32  ← 4x more data → 2x more precise (square root law)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "A medical test has 99% sensitivity and 95% specificity. The disease prevalence is 1%. What is the probability that a person who tests positive actually has the disease?",
      "options": [
        "99% (same as sensitivity)",
        "95% (same as specificity)",
        "About 16.5% — most positive results are false positives due to the low base rate",
        "About 50%"
      ],
      "answer": 2,
      "explanation": "This is the base rate fallacy. Using Bayes: P(disease|+) = P(+|disease) × P(disease) / P(+). P(+) = 0.99×0.01 + 0.05×0.99 = 0.0099 + 0.0495 = 0.0594. P(disease|+) = 0.0099/0.0594 ≈ 16.7%. Even excellent tests give mostly false positives for rare conditions. This is why screening tests need follow-up confirmatory tests."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
