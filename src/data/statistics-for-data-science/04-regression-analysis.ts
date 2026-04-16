import { Module } from "../types";

export const module4: Module = {
  id: "regression-analysis",
  title: "Regression Analysis: Linear, Logistic & Beyond",
  description: "Multiple linear regression assumptions and diagnostics, logistic regression for classification, regularization (Ridge, Lasso, Elastic Net), and interpreting coefficients correctly",
  lessons: [
    {
      id: "regression-analysis",
      slug: "regression-analysis",
      title: "Regression Analysis Deep Dive",
      content: `# Regression Analysis

Regression is the most used statistical technique in practice. Used correctly it reveals causal relationships; used incorrectly it produces misleading conclusions that look convincing.

---

\`\`\`concept
{
  "title": "Correlation is NOT Causation — But Regression Can Get Closer",
  "variant": "warning",
  "content": "A regression coefficient says 'holding all other variables constant, a 1-unit increase in X is associated with a β change in Y.' This is correlation, not causation. To claim causation you need: (1) randomization (RCT), (2) a natural experiment, or (3) a carefully constructed observational design with controls for confounders. Regression with more controls gets closer to causal estimates but never crosses the line without design support. Always say 'associated with' not 'causes' unless you have experimental evidence."
}
\`\`\`

---

## Multiple Linear Regression

\`\`\`python
import pandas as pd
import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt
from scipy import stats

# OLS: minimize sum of squared residuals
# Y = β₀ + β₁X₁ + β₂X₂ + ... + βₙXₙ + ε

df = pd.read_csv('housing.csv')
X = sm.add_constant(df[['sqft', 'bedrooms', 'age', 'distance_to_city']])
y = df['price']

model = sm.OLS(y, X).fit()
print(model.summary())

# Interpret coefficients:
# sqft coeff = 150: each sq ft adds \$150, holding other vars constant
# bedrooms coeff = -5000: surprising — maybe bedrooms proxy for smaller rooms?
# age coeff = -2000: each year of age reduces price \$2,000
# const = 100000: price when all predictors = 0 (often not meaningful)

# Coefficient significance:
# P>|t| < 0.05 → variable has significant effect (controlling for others)
# P>|t| > 0.05 → can't reject H0: coefficient = 0

# Model fit:
# R²: 0.82 → model explains 82% of price variance
# Adjusted R²: penalizes adding useless variables
# F-statistic p-value: does the model as a whole have predictive power?
\`\`\`

## OLS Assumptions & Diagnostics

\`\`\`python
# The LINE assumptions:
# L — Linearity: relationship between X and Y is linear
# I — Independence: observations are independent
# N — Normality: residuals are normally distributed
# E — Equal variance (homoscedasticity): residual variance constant across X

residuals = model.resid
fitted = model.fittedvalues

# --- 1. Residuals vs Fitted (linearity + homoscedasticity) ---
plt.scatter(fitted, residuals, alpha=0.5)
plt.axhline(0, color='red')
plt.xlabel('Fitted values')
plt.ylabel('Residuals')
plt.title('Residuals vs Fitted')
# Want: random scatter around 0, no pattern
# Problem signs: funnel shape (heteroscedasticity), curve (nonlinearity)

# --- 2. Q-Q plot (normality) ---
stats.probplot(residuals, plot=plt)
plt.title('Q-Q Plot of Residuals')
# Want: points on the diagonal line
# Problem signs: S-curve (heavy tails), bent ends (skewed distribution)

# --- 3. Scale-Location plot (homoscedasticity) ---
plt.scatter(fitted, np.sqrt(np.abs(residuals)), alpha=0.5)
# Want: flat horizontal red line
# Problem: increasing spread = heteroscedasticity

# --- 4. Variance Inflation Factor (multicollinearity) ---
from statsmodels.stats.outliers_influence import variance_inflation_factor

vif_data = pd.DataFrame()
vif_data["feature"] = X.columns[1:]  # exclude constant
vif_data["VIF"] = [variance_inflation_factor(X.values, i+1) for i in range(X.shape[1]-1)]
print(vif_data)
# VIF < 5: acceptable
# VIF 5-10: moderate multicollinearity (interpret cautiously)
# VIF > 10: severe multicollinearity (drop one of the correlated features)

# --- Fix violations ---
# Heteroscedasticity → log-transform Y, or use weighted least squares (WLS)
# Nonlinearity → add polynomial terms (X² ), or use log(X)
# Outliers → check leverage (Cook's distance), consider robust regression
\`\`\`

## Logistic Regression for Classification

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, roc_curve

# Logistic regression: models P(Y=1 | X) using the sigmoid function
# log(p/(1-p)) = β₀ + β₁X₁ + β₂X₂  (log-odds = linear combination)

model = LogisticRegression(C=1.0, max_iter=1000)
model.fit(X_train, y_train)
y_prob = model.predict_proba(X_test)[:, 1]  # P(class=1)

# --- Interpreting coefficients (log-odds) ---
coefs = pd.Series(model.coef_[0], index=feature_names)
print(coefs)
# coef = 0.5 → every 1-unit increase in X multiplies odds by e^0.5 = 1.65 (65% increase in odds)
# coef = -0.3 → every 1-unit increase multiplies odds by e^{-0.3} = 0.74 (26% decrease in odds)

odds_ratios = np.exp(coefs)
print("Odds Ratios:", odds_ratios)

# --- Choosing threshold ---
# Default: 0.5 (classify as positive if P > 0.5)
# In practice: adjust based on cost of false positives vs false negatives
# Cancer screening: lower threshold (minimize false negatives even at cost of more FP)
# Fraud detection: adjust to balance precision and recall

from sklearn.metrics import precision_recall_curve
precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
# Plot PR curve to choose threshold based on business needs

# --- ROC AUC ---
auc = roc_auc_score(y_test, y_prob)
print(f"AUC: {auc:.3f}")
# AUC = 0.5: no better than random
# AUC = 0.8: good
# AUC = 0.95+: excellent (or suspicious — check for data leakage)
\`\`\`

## Regularization: Ridge, Lasso, Elastic Net

\`\`\`python
from sklearn.linear_model import Ridge, Lasso, ElasticNet
from sklearn.model_selection import cross_val_score
import numpy as np

# Why regularization:
# OLS with many features → overfits, large coefficients, poor generalization
# Regularization adds a penalty for large coefficients

# --- Ridge (L2): penalize sum of squared coefficients ---
# Cost = MSE + α * Σβᵢ²
# Effect: shrinks all coefficients toward 0 but keeps all features
ridge = Ridge(alpha=1.0)  # alpha is the regularization strength
ridge.fit(X_train, y_train)

# --- Lasso (L1): penalize sum of absolute coefficients ---
# Cost = MSE + α * Σ|βᵢ|
# Effect: drives some coefficients exactly to 0 → automatic feature selection
lasso = Lasso(alpha=0.1)
lasso.fit(X_train, y_train)
selected_features = [f for f, c in zip(feature_names, lasso.coef_) if c != 0]
print(f"Selected {len(selected_features)} features:", selected_features)

# --- Elastic Net: L1 + L2 combined ---
# l1_ratio=1.0 → pure Lasso; l1_ratio=0.0 → pure Ridge
enet = ElasticNet(alpha=0.1, l1_ratio=0.5)

# --- Cross-validate to find optimal alpha ---
from sklearn.linear_model import RidgeCV, LassoCV

ridge_cv = RidgeCV(alphas=[0.001, 0.01, 0.1, 1.0, 10.0, 100.0], cv=5)
ridge_cv.fit(X_train, y_train)
print(f"Best Ridge alpha: {ridge_cv.alpha_}")

lasso_cv = LassoCV(alphas=None, cv=5, max_iter=10000)
lasso_cv.fit(X_train, y_train)
print(f"Best Lasso alpha: {lasso_cv.alpha_}")
\`\`\`

\`\`\`compare
{
  "title": "Regularization Comparison",
  "items": [
    {
      "name": "Ridge (L2)",
      "description": "Penalty = α × Σβᵢ². Shrinks all coefficients proportionally. Keeps all features. Best when all features contribute to the outcome. Handles multicollinearity well."
    },
    {
      "name": "Lasso (L1)",
      "description": "Penalty = α × Σ|βᵢ|. Drives some coefficients to exactly 0. Built-in feature selection. Best when you have many features and expect only a few to matter."
    },
    {
      "name": "Elastic Net",
      "description": "Combines L1 + L2. Handles correlated features better than pure Lasso (which picks one arbitrarily). Best of both worlds but adds a hyperparameter (l1_ratio)."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Log-transform skewed targets (house prices, income) before linear regression — residuals become more normally distributed.", "VIF > 10 indicates severe multicollinearity — drop the correlated variable or use Ridge regression.", "Logistic regression coefficients are in log-odds units — exponentiate for odds ratios (more interpretable).", "Lasso's feature selection is automatic but arbitrary when features are correlated — use Elastic Net for correlated features.", "Cross-validate alpha in Ridge/Lasso — RidgeCV and LassoCV do this efficiently with built-in CV.", "Always check residual plots — a pattern in residuals means the model is systematically wrong, not just imprecise."]
\`\`\`
`,
    },
  ],
};
