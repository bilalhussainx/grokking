import { Module } from "../types";

export const modelEvaluationDeploymentModule: Module = {
  id: "model-evaluation-deployment",
  title: "Model Evaluation, Selection, and Deployment Readiness",
  description: "Move from a trained model to a production-ready artifact: cross-validation, hyperparameter search, calibration, serialization, and inference pipelines.",
  lessons: [
    {
      id: "cross-validation",
      slug: "cross-validation",
      title: "K-Fold and Stratified Cross-Validation",
      content: `# K-Fold and Stratified Cross-Validation

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Implement k-fold cross-validation from scratch. Understand why a single train/test split gives unreliable estimates of generalization.

## Preview of topics

- The core ideas that make **K-Fold and Stratified Cross-Validation** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "hyperparameter-search",
      slug: "hyperparameter-search",
      title: "Grid Search and Random Search",
      content: `# Grid Search and Random Search

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Implement grid search and random search over hyperparameter grids. Compare cost vs coverage and understand when random search wins.

## Preview of topics

- The core ideas that make **Grid Search and Random Search** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "model-calibration",
      slug: "model-calibration",
      title: "Probability Calibration and Reliability Diagrams",
      content: `# Probability Calibration and Reliability Diagrams

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Detect miscalibrated classifiers using reliability diagrams. Apply Platt scaling and isotonic regression to produce calibrated probabilities.

## Preview of topics

- The core ideas that make **Probability Calibration and Reliability Diagrams** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "model-serialization",
      slug: "model-serialization",
      title: "Serializing and Loading Models with NumPy",
      content: `# Serializing and Loading Models with NumPy

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Save trained weight matrices to disk with np.save/np.load and pickle. Write a clean Predictor class that loads weights and runs inference.

## Preview of topics

- The core ideas that make **Serializing and Loading Models with NumPy** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "inference-pipeline",
      slug: "inference-pipeline",
      title: "Building a Reproducible Inference Pipeline",
      content: `# Building a Reproducible Inference Pipeline

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Bundle preprocessing transforms and model weights into a single inference pipeline object. Test it on unseen data and benchmark latency.

## Preview of topics

- The core ideas that make **Building a Reproducible Inference Pipeline** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "ml-system-design-intro",
      slug: "ml-system-design-intro",
      title: "ML System Design Primer: From Notebook to Production",
      content: `# ML System Design Primer: From Notebook to Production

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Survey the gap between a Jupyter notebook and a production ML system: data drift, monitoring, retraining triggers, and A/B testing basics.

## Preview of topics

- The core ideas that make **ML System Design Primer: From Notebook to Production** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "capstone-checkpoint",
      slug: "capstone-checkpoint",
      title: "Capstone: End-to-End ML Project",
      content: `# Capstone: End-to-End ML Project

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Model Evaluation, Selection, and Deployment Readiness**." }
\\\`\\\`\\\`

## What you'll learn here

Final capstone — choose a dataset, preprocess it, train at least two model types from scratch, run cross-validated hyperparameter search, and present a model card with metrics, limitations, and an inference snippet.

## Preview of topics

- The core ideas that make **Capstone: End-to-End ML Project** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};
