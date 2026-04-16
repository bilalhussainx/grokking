import { Module } from "../types";

export const module5: Module = {
  id: "capstone-pipeline",
  title: "End-to-End Data Science Project",
  description: "Build a complete data science pipeline from raw data to deployed predictions — integrating all skills into a real project",
  lessons: [
    {
      id: "end-to-end-project",
      slug: "end-to-end-project",
      title: "Complete Data Science Pipeline: House Price Prediction",
      content: `# End-to-End Data Science Project

Real data science isn't isolated steps — it's an iterative pipeline from raw data to deployed model. This capstone integrates everything.

---

## Project Overview

\`\`\`sysdiag
{
  "type": "pipeline",
  "title": "Data Science Pipeline",
  "steps": [
    { "step": "Data Ingestion", "detail": "Load raw data (CSV/API/DB), initial inspection" },
    { "step": "EDA", "detail": "Distributions, correlations, outliers, missing patterns" },
    { "step": "Data Cleaning", "detail": "Handle missing, outliers, type fixes, duplicates" },
    { "step": "Feature Engineering", "detail": "Create new features, encode, scale" },
    { "step": "Model Selection", "detail": "Baseline → try candidates → cross-validate" },
    { "step": "Hyperparameter Tuning", "detail": "RandomizedSearch, optuna" },
    { "step": "Evaluation", "detail": "Test set metrics, error analysis, business context" },
    { "step": "Deployment", "detail": "Save model, build API, monitor in production" }
  ]
}
\`\`\`

---

## The Complete Pipeline

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ========================================================
# 1. DATA LOADING & INITIAL INSPECTION
# ========================================================
df = pd.read_csv('house_prices.csv')
print(f"Shape: {df.shape}")
print(df.head())
print(df.dtypes)
print(df.describe())

# ========================================================
# 2. EDA
# ========================================================
# Target distribution
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
sns.histplot(df['SalePrice'], bins=50, kde=True)
plt.title('Sale Price Distribution')

plt.subplot(1, 2, 2)
sns.histplot(np.log1p(df['SalePrice']), bins=50, kde=True)
plt.title('Log Sale Price Distribution')
plt.tight_layout()
plt.show()
# Log transform if skewed — makes many regression models work better

# Top correlations with target:
corr = df.corr()['SalePrice'].sort_values(ascending=False)
print(corr.head(15))

# ========================================================
# 3. FEATURE ENGINEERING & CLEANING
# ========================================================
# Define feature types
numeric_features = ['GrLivArea', 'TotalBsmtSF', 'GarageArea', 'YearBuilt', 'OverallQual']
categorical_features = ['Neighborhood', 'HouseStyle', 'Exterior1st', 'Foundation']

# Create new features:
df['HouseAge'] = 2024 - df['YearBuilt']
df['TotalSF'] = df['GrLivArea'] + df['TotalBsmtSF']
df['HasGarage'] = (df['GarageArea'] > 0).astype(int)

X = df[numeric_features + categorical_features + ['HouseAge', 'TotalSF', 'HasGarage']]
y = np.log1p(df['SalePrice'])   # Log transform target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ========================================================
# 4. PIPELINE (preprocessing + model)
# ========================================================
numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler',  StandardScaler()),
])

categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot',  OneHotEncoder(handle_unknown='ignore', sparse_output=False)),
])

all_numeric = numeric_features + ['HouseAge', 'TotalSF', 'HasGarage']
preprocessor = ColumnTransformer([
    ('num', numeric_transformer,  all_numeric),
    ('cat', categorical_transformer, categorical_features),
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', GradientBoostingRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        random_state=42,
    )),
])

# ========================================================
# 5. TRAIN & EVALUATE
# ========================================================
# Cross-validation:
cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='neg_rmse')
print(f"CV RMSE: {(-cv_scores).mean():.4f} ± {(-cv_scores).std():.4f}")

# Train and test:
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)

# Convert back from log space:
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)

print(f"Test RMSE: {rmse:.4f} (log scale)")
print(f"Test RMSE: \${np.expm1(rmse):,.0f} (dollar scale)")
print(f"R²: {r2:.4f}")

# Error analysis:
residuals = y_test - y_pred
plt.figure(figsize=(10, 4))
plt.subplot(1,2,1)
plt.scatter(y_pred, residuals, alpha=0.4)
plt.axhline(0, color='r', linestyle='--')
plt.xlabel('Predicted'); plt.ylabel('Residual')
plt.title('Residual Plot')

plt.subplot(1,2,2)
sns.histplot(residuals, bins=30, kde=True)
plt.title('Residual Distribution')
plt.tight_layout()
plt.show()

# ========================================================
# 6. FEATURE IMPORTANCE
# ========================================================
model = pipeline.named_steps['model']
feature_names = (
    all_numeric
    + pipeline.named_steps['preprocessor']
         .transformers_[1][1]
         .named_steps['onehot']
         .get_feature_names_out(categorical_features).tolist()
)
importance_df = pd.DataFrame({
    'feature': feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False).head(15)

sns.barplot(data=importance_df, x='importance', y='feature')
plt.title('Top 15 Feature Importances')
plt.tight_layout()
plt.show()

# ========================================================
# 7. SAVE MODEL
# ========================================================
joblib.dump(pipeline, 'house_price_model.pkl')

# Load and use:
# model = joblib.load('house_price_model.pkl')
# prediction = np.expm1(model.predict(new_data))
\`\`\`

## Serving the Model as an API

\`\`\`python
# app.py — FastAPI serving the saved model
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

app = FastAPI()
model = joblib.load('house_price_model.pkl')

class HouseFeatures(BaseModel):
    GrLivArea: float
    TotalBsmtSF: float
    GarageArea: float
    YearBuilt: int
    OverallQual: int
    Neighborhood: str
    HouseStyle: str
    Exterior1st: str
    Foundation: str

@app.post('/predict')
def predict_price(features: HouseFeatures):
    data = features.model_dump()
    data['HouseAge'] = 2024 - data['YearBuilt']
    data['TotalSF'] = data['GrLivArea'] + data['TotalBsmtSF']
    data['HasGarage'] = int(data['GarageArea'] > 0)

    df = pd.DataFrame([data])
    log_pred = model.predict(df)[0]
    price = float(np.expm1(log_pred))

    return {
        'predicted_price': round(price, 2),
        'confidence_range': [
            round(price * 0.9, 2),
            round(price * 1.1, 2),
        ]
    }
\`\`\`

\`\`\`takeaways
["Log-transform skewed targets (house prices, salaries) — makes residuals more normal and metrics more stable", "ColumnTransformer handles numeric and categorical preprocessing in a single pipeline — prevents leakage", "Error analysis (residual plot) is more informative than a single RMSE number — check for patterns", "Feature importance explains WHAT the model uses — sanity-check against domain knowledge", "joblib.dump saves the entire pipeline including fitted preprocessors — load and predict with zero extra code", "Deploy as FastAPI: Pydantic validates input, model predicts, expm1 reverses the log transform"]
\`\`\`
`,
    },
  ],
};
