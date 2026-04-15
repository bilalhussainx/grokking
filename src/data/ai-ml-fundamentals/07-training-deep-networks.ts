import { Module } from "../types";

export const trainingDeepNetworksModule: Module = {
  id: "training-deep-networks",
  title: "Training Deep Networks: Optimization and Regularization",
  description: "Move beyond vanilla SGD with Adam, momentum, and learning rate schedules. Prevent overfitting with dropout, batch norm, and early stopping.",
  lessons: [
    {
      id: "sgd-momentum",
      slug: "sgd-momentum",
      title: "SGD with Momentum and Nesterov Acceleration",
      content: `# SGD with Momentum and Nesterov Acceleration

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Implement classical momentum and Nesterov momentum. Visualize how they speed up convergence and dampen oscillation in ravines.

## Preview of topics

- The core ideas that make **SGD with Momentum and Nesterov Acceleration** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "adaptive-optimizers",
      slug: "adaptive-optimizers",
      title: "Adaptive Optimizers: RMSProp and Adam",
      content: `# Adaptive Optimizers: RMSProp and Adam

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Derive and implement RMSProp and Adam from scratch. Understand bias correction and when Adam outperforms SGD+momentum.

## Preview of topics

- The core ideas that make **Adaptive Optimizers: RMSProp and Adam** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "learning-rate-schedules",
      slug: "learning-rate-schedules",
      title: "Learning Rate Schedules and Warmup",
      content: `# Learning Rate Schedules and Warmup

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Implement step decay, cosine annealing, and linear warmup schedules. Connect learning rate to the loss landscape.

## Preview of topics

- The core ideas that make **Learning Rate Schedules and Warmup** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "dropout-regularization",
      slug: "dropout-regularization",
      title: "Dropout: Regularization by Random Deactivation",
      content: `# Dropout: Regularization by Random Deactivation

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Implement inverted dropout in the forward and backward passes. Train with dropout and observe its effect on generalization.

## Preview of topics

- The core ideas that make **Dropout: Regularization by Random Deactivation** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "batch-normalization",
      slug: "batch-normalization",
      title: "Batch Normalization: Normalizing Hidden Layers",
      content: `# Batch Normalization: Normalizing Hidden Layers

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Derive batch norm statistics, implement the forward and backward pass including learnable gamma/beta parameters.

## Preview of topics

- The core ideas that make **Batch Normalization: Normalizing Hidden Layers** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "early-stopping-validation",
      slug: "early-stopping-validation",
      title: "Early Stopping and Validation Curves",
      content: `# Early Stopping and Validation Curves

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Monitor validation loss during training, implement patience-based early stopping, and distinguish overfitting from underfitting.

## Preview of topics

- The core ideas that make **Early Stopping and Validation Curves** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "optimization-checkpoint",
      slug: "optimization-checkpoint",
      title: "Checkpoint: Ablation Study on MNIST",
      content: `# Checkpoint: Ablation Study on MNIST

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Training Deep Networks: Optimization and Regularization**." }
\\\`\\\`\\\`

## What you'll learn here

Practice checkpoint — run a systematic ablation: compare SGD vs Adam, no-dropout vs dropout, with vs without batch norm, and report findings.

## Preview of topics

- The core ideas that make **Checkpoint: Ablation Study on MNIST** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};
