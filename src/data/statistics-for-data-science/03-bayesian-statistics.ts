import { Module } from "../types";

export const module3: Module = {
  id: "bayesian-statistics",
  title: "Bayesian Statistics & Probabilistic Thinking",
  description: "Bayesian vs frequentist inference, prior and posterior distributions, Bayesian updating, credible intervals vs confidence intervals, and PyMC for probabilistic programming",
  lessons: [
    {
      id: "bayesian-statistics",
      slug: "bayesian-statistics",
      title: "Bayesian Statistics",
      content: `# Bayesian Statistics

Frequentist statistics asks: "Is this result unlikely if the null hypothesis is true?" Bayesian statistics asks: "Given this data, what should I now believe?" The Bayesian framework is more intuitive and handles small samples more honestly.

---

\`\`\`concept
{
  "title": "Frequentist vs Bayesian: The Core Difference",
  "variant": "mental-model",
  "content": "Frequentist: probability is the long-run frequency of events. Parameters are fixed but unknown — they don't have probability distributions. P-values tell you how surprising the data is under a hypothesis. Bayesian: probability represents degree of belief. Parameters have distributions reflecting uncertainty. You start with a prior belief, observe data, and update to a posterior belief. The result is a distribution over possible parameter values — not a single point estimate with a p-value. Bayesian is better for: small samples, sequential updating, incorporating domain knowledge, and communicating uncertainty naturally."
}
\`\`\`

---

## Bayes' Theorem in Practice

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Bayes' theorem: P(θ | data) ∝ P(data | θ) × P(θ)
# Posterior ∝ Likelihood × Prior

# --- Example: Estimating a conversion rate ---
# Prior belief: conversion rate is probably around 10% (± 5%)
# Data: 150 conversions from 1,000 visitors

# Prior: Beta distribution (natural choice for probabilities)
alpha_prior = 10   # prior "successes"
beta_prior = 90    # prior "failures"
# → Encodes belief: roughly 10/100 = 10% with moderate confidence

# Likelihood: Binomial (k successes in n trials)
n_visitors = 1000
k_conversions = 150

# Posterior: Beta distribution (conjugate prior — closed-form update!)
# Posterior Beta(alpha + k, beta + n - k):
alpha_posterior = alpha_prior + k_conversions      # = 160
beta_posterior = beta_prior + (n_visitors - k_conversions)  # = 940

prior = stats.beta(alpha_prior, beta_prior)
posterior = stats.beta(alpha_posterior, beta_posterior)

x = np.linspace(0, 0.30, 1000)
plt.plot(x, prior.pdf(x), label='Prior')
plt.plot(x, posterior.pdf(x), label='Posterior')
plt.xlabel('Conversion Rate')
plt.legend()
plt.title('Bayesian Updating: Conversion Rate Estimation')
plt.show()

# Posterior statistics:
print(f"Posterior mean: {posterior.mean():.3f}")         # 0.145
print(f"Posterior std: {posterior.std():.3f}")           # 0.010
print(f"95% credible interval: [{posterior.ppf(0.025):.3f}, {posterior.ppf(0.975):.3f}]")
# "There's a 95% probability the true rate is between 12.7% and 16.3%"
# Compare to frequentist: "If we repeated this experiment, 95% of CI would contain true value"
\`\`\`

## Credible Intervals vs Confidence Intervals

\`\`\`python
# The critical difference in interpretation:

# --- Frequentist 95% CI ---
from statsmodels.stats.proportion import proportion_confint

ci = proportion_confint(150, 1000, alpha=0.05, method='normal')
print(f"Frequentist 95% CI: [{ci[0]:.3f}, {ci[1]:.3f}]")
# Correct interpretation: "If we repeated the experiment many times,
# 95% of constructed intervals would contain the true rate"
# WRONG interpretation: "95% probability the true rate is in this interval"

# --- Bayesian 95% Credible Interval ---
credible_lower = posterior.ppf(0.025)
credible_upper = posterior.ppf(0.975)
print(f"Bayesian 95% CI: [{credible_lower:.3f}, {credible_upper:.3f}]")
# Correct interpretation: "Given our prior and data, there's 95% probability
# the true rate is in this interval"
# This IS the intuitive statement people want to make

# Highest Density Interval (HDI) — shortest interval with 95% probability:
from scipy.optimize import minimize_scalar

def hdi(distribution, credible_mass=0.95):
    # Find the narrowest interval containing credible_mass probability
    def interval_width(lower_percentile):
        upper_percentile = lower_percentile + credible_mass
        return distribution.ppf(upper_percentile) - distribution.ppf(lower_percentile)

    result = minimize_scalar(interval_width, bounds=(0, 0.05), method='bounded')
    lower = distribution.ppf(result.x)
    upper = distribution.ppf(result.x + credible_mass)
    return lower, upper

hdi_lower, hdi_upper = hdi(posterior)
print(f"HDI: [{hdi_lower:.3f}, {hdi_upper:.3f}]")
\`\`\`

## Bayesian A/B Testing

\`\`\`python
# Bayesian A/B test: compute P(B > A) directly
# No p-values, no fixed sample size, can check anytime

# Control: 120 conversions from 1,000 visitors
# Treatment: 150 conversions from 1,000 visitors

alpha_A = 10 + 120;  beta_A = 90 + 880   # posterior for A
alpha_B = 10 + 150;  beta_B = 90 + 850   # posterior for B

posterior_A = stats.beta(alpha_A, beta_A)
posterior_B = stats.beta(alpha_B, beta_B)

# Monte Carlo simulation to compute P(B > A):
n_samples = 100_000
samples_A = posterior_A.rvs(n_samples)
samples_B = posterior_B.rvs(n_samples)

prob_B_better = (samples_B > samples_A).mean()
expected_lift = ((samples_B - samples_A) / samples_A).mean()
prob_5pct_lift = (samples_B > samples_A * 1.05).mean()

print(f"P(B > A): {prob_B_better:.2%}")        # e.g., 97.3%
print(f"Expected lift: {expected_lift:.2%}")    # e.g., 22.1%
print(f"P(B has 5%+ lift): {prob_5pct_lift:.2%}")  # e.g., 89.4%

# Unlike frequentist: these probabilities are exactly what they say
# "There's a 97.3% chance that B is actually better than A"
\`\`\`

## PyMC: Probabilistic Programming

\`\`\`python
import pymc as pm
import arviz as az

# PyMC for models where conjugate priors don't apply

# Example: Estimate sales growth rate from monthly data
monthly_sales = [100, 108, 115, 125, 130, 142, 155, 168, 178, 195, 210, 225]

with pm.Model() as growth_model:
    # Prior: monthly growth rate probably 5-15%
    growth_rate = pm.Beta('growth_rate', alpha=5, beta=45)  # ~10%

    # Prior: initial sales around 100
    initial_sales = pm.Normal('initial_sales', mu=100, sigma=20)

    # Expected sales at each time point:
    t = np.arange(len(monthly_sales))
    expected = initial_sales * (1 + growth_rate) ** t

    # Likelihood: observed sales with some noise:
    sigma = pm.HalfNormal('sigma', sigma=10)
    observed = pm.Normal('observed', mu=expected, sigma=sigma, observed=monthly_sales)

    # Sample from posterior:
    trace = pm.sample(2000, return_inferencedata=True, random_seed=42)

# Summarize posterior:
print(az.summary(trace, var_names=['growth_rate', 'initial_sales']))
az.plot_posterior(trace, var_names=['growth_rate'])

# Extract: "Our estimated monthly growth rate is 8.2% (95% HDI: 6.1% to 10.4%)"
\`\`\`

\`\`\`takeaways
["Bayesian credible intervals have the natural interpretation: '95% probability the parameter is in this range' — frequentist CIs do not.", "Beta distribution is the natural prior for probabilities — Beta(α, β) encodes α 'prior successes' and β 'prior failures'.", "Bayesian A/B testing: P(B > A) is a direct probability you can act on — no fixed sample size or peeking problem.", "Beta(prior_α + k, prior_β + n - k) is the exact posterior for binomial data — no MCMC needed.", "PyMC handles complex models where conjugate priors don't apply — MCMC samples the posterior numerically.", "Bayesian updating is sequential: today's posterior becomes tomorrow's prior as new data arrives."]
\`\`\`
`,
    },
  ],
};
