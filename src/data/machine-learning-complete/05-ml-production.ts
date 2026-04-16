import { Module } from "../types";

export const module5: Module = {
  id: "ml-production",
  title: "ML in Production: MLOps & Model Deployment",
  description: "Feature stores, model versioning with MLflow, serving via FastAPI, monitoring for drift, and the full MLOps lifecycle",
  lessons: [
    {
      id: "mlops-deployment",
      slug: "mlops-deployment",
      title: "MLOps: Taking Models from Notebook to Production",
      content: `# MLOps: Production Machine Learning

A model in a Jupyter notebook is not a product. MLOps is the discipline of deploying, monitoring, and maintaining ML systems reliably.

---

\`\`\`concept
{
  "title": "The MLOps Lifecycle",
  "variant": "mental-model",
  "content": "ML code is only ~5% of a production ML system. The rest: data pipelines, feature stores, training infrastructure, serving infrastructure, monitoring, and feedback loops. MLOps borrows from DevOps: automated pipelines, version control for models and data, testing, CI/CD for ML."
}
\`\`\`

---

## MLflow: Experiment Tracking & Model Registry

\`\`\`python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
import json

# Start MLflow tracking:
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("house-price-model")

with mlflow.start_run(run_name="rf-baseline"):
    # Log parameters:
    params = {"n_estimators": 200, "max_depth": 10, "min_samples_leaf": 5}
    mlflow.log_params(params)

    # Train:
    model = RandomForestClassifier(**params, random_state=42)
    model.fit(X_train, y_train)

    # Log metrics:
    y_pred = model.predict(X_test)
    mlflow.log_metrics({
        "accuracy": accuracy_score(y_test, y_pred),
        "f1_score": f1_score(y_test, y_pred, average='macro'),
    })

    # Log artifacts:
    mlflow.log_figure(fig, "learning_curves.png")
    mlflow.log_dict({"feature_names": feature_names}, "features.json")

    # Register model:
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="fraud-detector",
        input_example=X_test[:5],
        signature=mlflow.models.infer_signature(X_train, model.predict(X_train)),
    )

# Load the registered model:
model = mlflow.sklearn.load_model("models:/fraud-detector/Production")
\`\`\`

## Model Serving with FastAPI

\`\`\`python
# production/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
import joblib
import numpy as np
import pandas as pd
from typing import List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ML Model API", version="1.0.0")

# Load model at startup (not per-request):
@app.on_event("startup")
async def load_model():
    app.state.model   = joblib.load("model.pkl")
    app.state.scaler  = joblib.load("scaler.pkl")
    app.state.feature_names = joblib.load("features.pkl")
    logger.info("Model loaded successfully")

class PredictionInput(BaseModel):
    features: List[float] = Field(..., min_items=20, max_items=20)

    @validator('features')
    def check_no_nan(cls, v):
        if any(x != x for x in v):   # NaN check
            raise ValueError('Features cannot contain NaN')
        return v

class PredictionOutput(BaseModel):
    prediction: int
    probability: float
    model_version: str = "1.0.0"

@app.post("/predict", response_model=PredictionOutput)
async def predict(data: PredictionInput):
    try:
        X = np.array(data.features).reshape(1, -1)
        X_scaled = app.state.scaler.transform(X)
        pred = int(app.state.model.predict(X_scaled)[0])
        prob = float(app.state.model.predict_proba(X_scaled)[0, pred])

        logger.info(f"Prediction: {pred}, Probability: {prob:.4f}")
        return PredictionOutput(prediction=pred, probability=prob)

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": hasattr(app.state, 'model')}
\`\`\`

## Monitoring: Data & Concept Drift

\`\`\`python
# Drift = production data distribution differs from training data
# Data drift: feature distributions change (e.g., user demographics shift)
# Concept drift: relationship between features and target changes
#                (e.g., fraud patterns change after new card security)

import evidently
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, ClassificationPreset

# Compare training (reference) vs production (current) data:
report = Report(metrics=[
    DataDriftPreset(),       # Detect feature drift using statistical tests
    ClassificationPreset(),  # Model performance metrics
])

report.run(
    reference_data=X_train_df.assign(target=y_train),
    current_data=production_data.assign(target=production_labels),
)

report.save_html("drift_report.html")
# Opens in browser with drift scores per feature + overall model degradation

# Alerting strategy:
# PSI (Population Stability Index) > 0.2 → significant drift
# KS test p-value < 0.05 → distribution shift detected
# Model accuracy drop > 5% → trigger retraining

# Automated retraining trigger:
if drift_score > 0.2 or accuracy < baseline_accuracy * 0.95:
    trigger_retraining_pipeline()
\`\`\`

## The Full MLOps Stack

\`\`\`sysdiag
{
  "type": "pipeline",
  "title": "Production ML Pipeline",
  "steps": [
    { "step": "Data Sources", "detail": "DBs, APIs, logs → raw data" },
    { "step": "Feature Store", "detail": "Feast/Tecton — consistent features for train + serve" },
    { "step": "Training Pipeline", "detail": "Airflow/Kubeflow — automated training + HPO" },
    { "step": "Experiment Tracking", "detail": "MLflow — params, metrics, artifacts, model registry" },
    { "step": "Model Registry", "detail": "Staging → Production promotion with approval" },
    { "step": "Serving Layer", "detail": "FastAPI/Triton — predictions with SLAs" },
    { "step": "Monitoring", "detail": "Evidently/WhyLabs — drift, performance, data quality" },
    { "step": "Feedback Loop", "detail": "Label production data → trigger retraining" }
  ]
}
\`\`\`

\`\`\`takeaways
["MLflow tracks experiments, versions models, and stores artifacts — essential for reproducibility", "Load models at server startup (not per-request) to avoid 200ms+ latency per prediction", "Pydantic validators in FastAPI catch malformed inputs before they reach the model", "Data drift ≠ concept drift: features changing vs. the feature-target relationship changing", "Population Stability Index (PSI) > 0.2 and KS test p < 0.05 are standard drift alert thresholds", "A/B test model upgrades: route 10% traffic to new model, compare metrics before full rollout"]
\`\`\`
`,
    },
  ],
};
