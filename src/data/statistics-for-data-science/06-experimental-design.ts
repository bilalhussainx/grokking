import { Module } from "../types";

export const module6: Module = {
  id: "experimental-design",
  title: "Experimental Design & Causal Inference",
  description: "Randomized controlled trials, confounding and Simpson's paradox, difference-in-differences, regression discontinuity, instrumental variables, and multi-armed bandits",
  lessons: [
    {
      id: "experimental-design",
      slug: "experimental-design",
      title: "Experimental Design & Causal Inference",
      content: `# Experimental Design & Causal Inference

Correlation is everywhere. Causation is rare. Identifying causal effects — the gold standard for decision-making — requires experimental design or clever observational methods.

---

\`\`\`concept
{
  "title": "The Fundamental Problem of Causal Inference",
  "variant": "mental-model",
  "content": "To know the causal effect of a treatment, you'd need to observe the same person under treatment AND no treatment simultaneously — the same person in two parallel universes. This is impossible. The fundamental problem is that you observe only the factual (what happened), never the counterfactual (what would have happened). RCTs solve this by making the control group a good counterfactual for the treatment group on average. All other causal methods are attempts to construct a credible counterfactual from observational data."
}
\`\`\`

---

## Randomized Controlled Trials (RCTs)

\`\`\`python
import numpy as np
import pandas as pd
from scipy import stats

# A proper RCT:
# 1. Random assignment to treatment/control (eliminates selection bias)
# 2. Blinding: participants (and ideally analysts) don't know treatment assignment
# 3. Sufficient sample size (power calculation before the experiment)
# 4. Pre-registered analysis plan (prevents p-hacking)

# Power calculation: how many users do we need?
from statsmodels.stats.power import TTestIndPower

analysis = TTestIndPower()
# Effect size (Cohen's d): expected difference / pooled std deviation
effect_size = 0.3    # "medium" effect (Cohen's convention: 0.2 small, 0.5 medium, 0.8 large)
alpha = 0.05
power = 0.80

n = analysis.solve_power(effect_size=effect_size, alpha=alpha, power=power)
print(f"Required sample per group: {int(np.ceil(n))}")  # ~175

# Randomization in code:
def assign_treatment(user_id: str, salt: str = "experiment-v1") -> str:
    # Hash-based assignment: deterministic and stable for same user
    import hashlib
    hash_val = int(hashlib.md5(f"{user_id}{salt}".encode()).hexdigest(), 16)
    return "treatment" if (hash_val % 100) < 50 else "control"  # 50/50 split

# Balance check: verify randomization worked
control = df[df['group'] == 'control']
treatment = df[df['group'] == 'treatment']

# Check pre-experiment covariates are balanced:
for col in ['age', 'tenure_days', 'revenue_30d']:
    t_stat, p_val = stats.ttest_ind(control[col], treatment[col])
    print(f"{col}: p = {p_val:.3f}", "✓" if p_val > 0.05 else "⚠️ IMBALANCED")
\`\`\`

## Confounding & Simpson's Paradox

\`\`\`python
# Simpson's Paradox: overall trend reverses within subgroups
# Classic example: UC Berkeley admissions

data = pd.DataFrame({
    'department': ['A', 'A', 'B', 'B', 'C', 'C'],
    'gender': ['M', 'F', 'M', 'F', 'M', 'F'],
    'applied': [825, 108, 560, 25, 325, 593],
    'admitted': [512, 89, 353, 17, 120, 202],
})
data['rate'] = data['admitted'] / data['applied']

# Overall: women have lower admission rate (confound: women applied to harder depts)
overall = data.groupby('gender')[['applied', 'admitted']].sum()
overall['rate'] = overall['admitted'] / overall['applied']
print(overall['rate'])  # Men: 0.46, Women: 0.30 → looks like bias

# Within department: women have HIGHER or EQUAL admission rate
print(data.pivot(index='department', columns='gender', values='rate'))
# Dept A: M=0.62, F=0.82 | Dept B: M=0.63, F=0.68 | Dept C: M=0.37, F=0.34

# Lesson: always analyze within strata before drawing conclusions
# The confounder (department selectivity) was hiding the true effect

# Testing for confounders in regression:
# Unadjusted: Y ~ treatment
model_unadj = sm.OLS(y, sm.add_constant(df[['treatment']])).fit()

# Adjusted: Y ~ treatment + confounders
model_adj = sm.OLS(y, sm.add_constant(df[['treatment', 'age', 'prior_behavior']])).fit()

# If treatment coefficient changes substantially → confounders matter
print("Unadjusted effect:", model_unadj.params['treatment'])
print("Adjusted effect:", model_adj.params['treatment'])
\`\`\`

## Quasi-Experimental Methods

\`\`\`python
# When RCTs aren't possible: use natural experiments

# --- Difference-in-Differences (DiD) ---
# Before/After × Treatment/Control
# Assumes parallel trends: without treatment, both groups would move similarly

# DiD estimate = (Treatment Post - Treatment Pre) - (Control Post - Control Pre)

df_did = pd.DataFrame({
    'group': ['treatment', 'treatment', 'control', 'control'],
    'period': ['pre', 'post', 'pre', 'post'],
    'outcome': [100, 120, 100, 105]
})

# Treatment effect = (120 - 100) - (105 - 100) = 20 - 5 = 15
# Control is the counterfactual for what treatment would have done without intervention

# In regression form (more flexible, allows controls):
df['post'] = (df['period'] == 'post').astype(int)
df['treated'] = (df['group'] == 'treatment').astype(int)
df['interaction'] = df['post'] * df['treated']

model = sm.OLS(df['outcome'], sm.add_constant(df[['post', 'treated', 'interaction']])).fit()
print("DiD estimate:", model.params['interaction'])  # the causal effect

# --- Regression Discontinuity (RD) ---
# Treatment assigned based on a cutoff in a continuous variable
# Example: scholarship given to students with GPA ≥ 3.5
# Students just above and below the cutoff are similar in all ways except treatment

from sklearn.linear_model import LinearRegression

cutoff = 3.5
bandwidth = 0.2  # look only at students within 0.2 GPA points of cutoff

local_data = df[abs(df['gpa'] - cutoff) <= bandwidth].copy()
local_data['above_cutoff'] = (local_data['gpa'] >= cutoff).astype(int)
local_data['gpa_centered'] = local_data['gpa'] - cutoff

# Estimate jump at cutoff:
model = sm.OLS(
    local_data['outcome'],
    sm.add_constant(local_data[['above_cutoff', 'gpa_centered']])
).fit()
rd_estimate = model.params['above_cutoff']
print(f"RD causal estimate: {rd_estimate:.2f}")
\`\`\`

## Multi-Armed Bandits

\`\`\`python
# Bandit: balance exploration (learning) vs exploitation (using what works)
# A/B test explores for fixed duration, then exploits winner
# Bandit adapts: routes more traffic to better-performing variants during the test

import numpy as np

# Thompson Sampling: Bayesian bandit algorithm
class BetaThompsonBandit:
    def __init__(self, n_arms: int):
        self.alphas = np.ones(n_arms)  # successes + 1
        self.betas = np.ones(n_arms)   # failures + 1

    def select_arm(self) -> int:
        # Sample from each arm's posterior:
        samples = [np.random.beta(a, b) for a, b in zip(self.alphas, self.betas)]
        return np.argmax(samples)  # choose arm with highest sample

    def update(self, arm: int, reward: int):
        if reward:
            self.alphas[arm] += 1
        else:
            self.betas[arm] += 1

    def arm_win_probs(self) -> np.ndarray:
        # Simulate: which arm would win if we sampled 10k times?
        samples = np.random.beta(self.alphas, self.betas, size=(10000, len(self.alphas)))
        return (samples.argmax(axis=1)[..., np.newaxis] == np.arange(len(self.alphas))).mean(axis=0)

# Use: show different headlines, route to highest-converting
bandit = BetaThompsonBandit(n_arms=3)  # 3 headline variants

for user in users:
    arm = bandit.select_arm()
    show_variant(user, arm)
    clicked = get_user_response(user)
    bandit.update(arm, clicked)

# After 1000 users: bandit has already shifted 70%+ traffic to the winner
# Traditional A/B test: would still be running with even split
\`\`\`

\`\`\`takeaways
["Hash-based treatment assignment is stable and deterministic — same user always gets same variant across sessions.", "Balance checks before analysis: if pre-experiment covariates are unbalanced, randomization failed.", "Simpson's Paradox: always analyze within natural strata before drawing conclusions from aggregated data.", "DiD requires parallel trends assumption — test it by checking pre-period trends are parallel.", "Regression discontinuity is credibly causal near the cutoff — validity degrades as you move farther from the threshold.", "Thompson Sampling bandit adapts during the experiment — routes majority traffic to the winner 70% faster than fixed A/B tests."]
\`\`\`
`,
    },
  ],
};
