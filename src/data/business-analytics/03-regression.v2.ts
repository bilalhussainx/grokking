import { Module } from "../types";

export const regressionModule: Module = {
  id: "ba-regression",
  title: "Regression Analysis",
  description: "Master simple and multiple linear regression, interpreting output, logistic regression, and common pitfalls.",
  lessons: [
    {
      id: "ba-simple-regression",
      slug: "simple-linear-regression",
      title: "Simple Linear Regression",
      content: `## Simple Linear Regression

Linear regression is the workhorse of business analytics. It models the relationship between a dependent variable (Y) and one or more independent variables (X). HBS analytics courses use regression extensively because it is interpretable, powerful, and applicable to nearly every business domain.

### The Model

Simple linear regression fits a straight line through data:

Y = b0 + b1 * X + error

- Y: dependent variable (what you want to predict)
- X: independent variable (the predictor)
- b0: intercept (Y value when X = 0)
- b1: slope (change in Y for a one-unit change in X)
- error: unexplained variation

### Business Example

Predict monthly sales based on advertising spend:

Sales = 10,000 + 5.2 * AdvertisingSpend

Interpretation: For every additional \\$1 spent on advertising, sales increase by \\$5.20. With zero advertising, baseline sales are \\$10,000.

### Key Statistics

**R-squared (R2)**: The proportion of variance in Y explained by X. Ranges from 0 to 1. An R2 of 0.75 means 75% of the variation in sales is explained by advertising spend.

**p-value (for b1)**: Tests whether the relationship is statistically significant. If p < 0.05, there is strong evidence that X affects Y.

**Residuals**: The difference between actual and predicted values. Examining residuals helps diagnose model problems.

### Assumptions

Linear regression assumes:
1. **Linearity**: The relationship between X and Y is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of errors
4. **Normality**: Errors are normally distributed

Violating these assumptions can produce misleading results.

### Key Takeaway

Simple linear regression is the starting point for predictive analytics. It is interpretable, widely applicable, and provides a foundation for more advanced techniques. Always check assumptions and examine residuals.

**Sources**: HBS Online, "Business Analytics" course. James, G. et al. (2013). *An Introduction to Statistical Learning*. Springer.`,
      starterCode: `# Simple Linear Regression in Python
# Predict sales based on advertising spend

# Sample data
ad_spend = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55]  # thousands $
sales = [100, 120, 150, 180, 200, 210, 250, 270, 300, 320]  # thousands $

# TODO: Calculate the regression line
# 1. Calculate means of X and Y
# 2. Calculate slope (b1) and intercept (b0)
# 3. Calculate R-squared
# 4. Predict sales for $60K ad spend

n = len(ad_spend)
mean_x = sum(ad_spend) / n
mean_y = sum(sales) / n

# Hint for slope: b1 = sum((xi - mean_x)(yi - mean_y)) / sum((xi - mean_x)^2)
print("Simple Linear Regression")
print("=" * 30)`,
      solutionCode: `# Simple Linear Regression in Python
ad_spend = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
sales = [100, 120, 150, 180, 200, 210, 250, 270, 300, 320]

n = len(ad_spend)
mean_x = sum(ad_spend) / n
mean_y = sum(sales) / n

# Calculate slope (b1)
numerator = sum((ad_spend[i] - mean_x) * (sales[i] - mean_y) for i in range(n))
denominator = sum((ad_spend[i] - mean_x) ** 2 for i in range(n))
b1 = numerator / denominator

# Calculate intercept (b0)
b0 = mean_y - b1 * mean_x

print("Simple Linear Regression")
print("=" * 30)
print(f"Equation: Sales = {b0:.1f} + {b1:.2f} * AdSpend")
print(f"Slope: For every \\$1K in ad spend, sales increase by \\\${b1:.2f}K")
print(f"Intercept: Baseline sales = \\\${b0:.1f}K")

# R-squared
predicted = [b0 + b1 * x for x in ad_spend]
ss_res = sum((sales[i] - predicted[i]) ** 2 for i in range(n))
ss_tot = sum((sales[i] - mean_y) ** 2 for i in range(n))
r_squared = 1 - ss_res / ss_tot
print(f"R-squared: {r_squared:.4f} ({r_squared*100:.1f}% of variance explained)")

# Prediction
new_spend = 60
prediction = b0 + b1 * new_spend
print(f"\\nPrediction for \\$60K ad spend: \\\${prediction:.1f}K in sales")`,
    },
    {
      id: "ba-multiple-regression",
      slug: "multiple-regression",
      title: "Multiple Regression",
      content: `## Multiple Regression

Multiple regression extends simple regression to include two or more independent variables. In business, outcomes are almost always influenced by multiple factors, making multiple regression the standard analytical tool for understanding complex relationships.

### The Model

Y = b0 + b1*X1 + b2*X2 + ... + bn*Xn + error

**Example**: Sales = 5,000 + 4.8*AdSpend + 120*SalesReps - 2.1*CompetitorPrice

Interpretation (holding other variables constant):
- Each \\$1K in ad spend increases sales by \\$4.8K
- Each additional sales rep increases sales by \\$120K
- Each \\$1 increase in competitor's price decreases our sales by \\$2.1K

### Key Advantages Over Simple Regression

1. **Better predictions**: Including relevant variables improves predictive accuracy
2. **Control for confounding**: Isolate the effect of one variable while controlling for others
3. **Identify relative importance**: Compare which factors have the largest impact

### Interpreting Multiple Regression Output

| Statistic | Interpretation |
|-----------|---------------|
| Adjusted R2 | Proportion of variance explained (adjusted for number of variables) |
| F-statistic | Overall model significance |
| Coefficient (b) | Change in Y for a 1-unit change in X, holding other variables constant |
| p-value (per coefficient) | Significance of each individual variable |
| Standard error | Precision of the coefficient estimate |

### Variable Selection

Not all variables should be included. Too many variables cause overfitting. Methods for selecting variables:

- **Domain knowledge**: Include variables that theory suggests are important
- **Stepwise selection**: Algorithmically add/remove variables based on statistical criteria
- **Regularization**: Techniques (Lasso, Ridge) that penalize unnecessary variables

### Key Takeaway

Multiple regression is the analytical backbone of business analytics. It allows you to understand which factors drive business outcomes, control for confounding variables, and make predictions based on multiple inputs. Always check for multicollinearity and overfitting.

**Sources**: HBS Online, "Business Analytics" course. James, G. et al. (2013). *An Introduction to Statistical Learning*.`,
    },
    {
      id: "ba-interpreting-output",
      slug: "interpreting-regression-output",
      title: "Interpreting Regression Output",
      content: `## Interpreting Regression Output

The ability to read and interpret regression output is one of the most valuable analytics skills. HBS teaches that **you do not need to build models to benefit from regression -- you need to interpret them critically.**

### The Key Numbers

**R-squared and Adjusted R-squared**
- R2 tells you how much of the variation in Y is explained by your model
- Adjusted R2 penalizes for adding unnecessary variables
- Good R2 depends on context: 0.3 might be excellent for predicting human behavior; 0.95 might be expected for physical processes

**Coefficients**
- Each coefficient represents the expected change in Y for a one-unit increase in X, holding all other variables constant
- Standardized coefficients allow comparison of relative importance across variables with different scales

**P-values**
- Tests whether each coefficient is significantly different from zero
- p < 0.05: evidence that the variable has a real effect
- p > 0.05: insufficient evidence (does NOT mean no effect exists)

**Confidence Intervals for Coefficients**
- Provide a range of plausible values for each coefficient
- If the CI includes zero, the effect is not statistically significant

**F-statistic**
- Tests overall model significance
- A significant F-statistic means at least one variable has a real effect on Y

### Reading a Regression Output Example

| Variable | Coefficient | Std Error | p-value |
|----------|-----------|-----------|--------|
| Intercept | 15,200 | 2,100 | 0.000 |
| Ad Spend (\\$K) | 4.82 | 0.91 | 0.000 |
| Sales Reps | 118.5 | 32.4 | 0.001 |
| Competitor Price | -2.13 | 1.45 | 0.148 |

R2 = 0.84, Adjusted R2 = 0.82, F = 45.3 (p < 0.001)

**Interpretation**:
- The model explains 82% of sales variation (strong)
- Ad spend and sales reps are significant predictors
- Competitor price is NOT significant (p = 0.148) -- may not belong in the model
- Each \\$1K in ad spend is associated with \\$4.82K more sales

### Common Mistakes

1. **Ignoring p-values**: Including variables with high p-values adds noise, not signal
2. **Overfitting R-squared**: Adding variables always increases R2, even if they are meaningless. Use Adjusted R2.
3. **Confusing correlation with causation**: Regression shows association, not causation (unless from an experiment)
4. **Extrapolating beyond the data range**: A model trained on ad spend of \\$10-50K should not predict at \\$500K

### Key Takeaway

Interpreting regression output is about telling a coherent business story from numbers. Focus on: Are the coefficients significant? What is their practical magnitude? Does the overall model explain a meaningful amount of variation? Are the assumptions reasonable?

**Sources**: HBS Online, "Business Analytics" course. Wheelan, C. (2013). *Naked Statistics*.`,
    },
    {
      id: "ba-logistic-regression",
      slug: "logistic-regression",
      title: "Logistic Regression for Classification",
      content: `## Logistic Regression for Classification

While linear regression predicts continuous outcomes (revenue, price), many business questions involve binary outcomes: Will this customer churn? Will this loan default? Will this lead convert? **Logistic regression** is the standard method for predicting binary outcomes.

### The Model

Logistic regression predicts the probability of an outcome (between 0 and 1) using the logistic function:

P(Y=1) = 1 / (1 + e^-(b0 + b1*X1 + b2*X2 + ...))

The output is always between 0 and 1, making it interpretable as a probability.

### Business Applications

| Application | Y=1 | Predictors |
|-------------|-----|------------|
| Churn prediction | Customer churns | Usage, tenure, support tickets, satisfaction |
| Credit scoring | Loan defaults | Income, debt ratio, credit history, employment |
| Lead scoring | Lead converts | Industry, company size, engagement level |
| Fraud detection | Transaction is fraud | Amount, location, time, frequency |

### Interpreting Logistic Regression

**Odds Ratios**: Each coefficient represents the change in log-odds. The exponentiated coefficient (e^b) gives the odds ratio:
- e^b = 1.5 means a one-unit increase in X increases the odds by 50%
- e^b = 0.8 means a one-unit increase in X decreases the odds by 20%

**Classification Threshold**: The model outputs probabilities. You choose a threshold (commonly 0.5) to classify:
- P(churn) > 0.5: Predict churn
- P(churn) <= 0.5: Predict no churn

**Evaluation Metrics**:
- **Accuracy**: % of correct predictions
- **Precision**: Of predicted positives, how many are actually positive?
- **Recall**: Of actual positives, how many did we correctly predict?
- **AUC-ROC**: Overall model discrimination ability

### Key Takeaway

Logistic regression is the go-to method for binary classification problems in business. It is interpretable (you can explain why a customer was classified as high-risk), reliable, and widely understood. For many business problems, logistic regression performs nearly as well as more complex methods while being far more interpretable.

**Sources**: HBS Online, "Business Analytics" course. James, G. et al. (2013). *An Introduction to Statistical Learning*.`,
    },
    {
      id: "ba-regression-pitfalls",
      slug: "regression-pitfalls",
      title: "Regression Pitfalls",
      content: `## Regression Pitfalls

Regression is powerful but dangerous if misapplied. HBS analytics courses dedicate significant time to **common pitfalls** that lead to misleading conclusions and poor decisions.

### Pitfall 1: Multicollinearity

When independent variables are highly correlated with each other, regression coefficients become unstable and hard to interpret.

**Symptom**: Large standard errors, coefficients that flip sign, nonsensical coefficient values.

**Detection**: Calculate Variance Inflation Factor (VIF). VIF > 5-10 suggests problematic multicollinearity.

**Solution**: Remove one of the correlated variables, or combine them into a single variable.

### Pitfall 2: Overfitting

A model that fits the training data too well captures noise rather than signal, performing poorly on new data.

**Symptom**: Very high R2 on training data, poor R2 on test data.

**Detection**: Use train/test split or cross-validation to evaluate out-of-sample performance.

**Solution**: Use fewer variables, regularization (Lasso/Ridge), or simpler models.

### Pitfall 3: Omitted Variable Bias

Leaving out an important variable that is correlated with both X and Y biases the coefficient estimates.

**Example**: Regression of ice cream sales on temperature, omitting "summer" variable. Temperature coefficient absorbs the effect of summer activities.

**Solution**: Include relevant control variables based on domain knowledge.

### Pitfall 4: Extrapolation

Using a model to predict outside the range of the training data. A model trained on ad spend of \\$10-50K should not predict at \\$500K -- the relationship may be completely different.

### Pitfall 5: Confusing Correlation with Causation

Regression measures association, not causation. A significant coefficient means X and Y move together -- not that X causes Y.

**Solution**: Use experimental design (A/B tests) to establish causation. Use regression for prediction and hypothesis generation, not for causal claims (unless the study design supports it).

### Pitfall 6: Non-Linearity

If the true relationship is curved (diminishing returns, exponential growth), a linear model will be biased.

**Detection**: Plot residuals vs. predicted values. Patterns suggest non-linearity.

**Solution**: Add polynomial terms (X2), use log transformations, or use non-linear models.

### Key Takeaway

Regression is not plug-and-play. Critical interpretation requires checking assumptions, testing for pitfalls, and understanding the limitations of the method. The goal is not a perfect model but a model that is useful for decision-making.

**Sources**: HBS Online, "Business Analytics" course. Angrist, J. D. & Pischke, J. S. (2009). *Mostly Harmless Econometrics*. Princeton University Press.`,
    },
  ],
};
