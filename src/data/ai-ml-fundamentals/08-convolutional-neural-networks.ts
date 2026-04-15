import { Module } from "../types";

export const convolutionalNeuralNetworksModule: Module = {
  id: "convolutional-neural-networks",
  title: "Convolutional Neural Networks",
  description: "Implement 2D convolution, pooling, and a full CNN forward/backward pass from scratch using NumPy. Train on image classification tasks.",
  lessons: [
    {
      id: "why-cnns",
      slug: "why-cnns",
      title: "Why CNNs? Local Connectivity and Parameter Sharing",
      content: `# Why CNNs? Local Connectivity and Parameter Sharing

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Understand the limitations of fully connected layers on images. Learn how convolution exploits spatial structure with far fewer parameters.

## Preview of topics

- The core ideas that make **Why CNNs? Local Connectivity and Parameter Sharing** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "convolution-operation",
      slug: "convolution-operation",
      title: "The Convolution Operation: Filters, Stride, and Padding",
      content: `# The Convolution Operation: Filters, Stride, and Padding

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Implement a 2D convolution from scratch with configurable kernel size, stride, and same/valid padding. Verify output dimensions.

## Preview of topics

- The core ideas that make **The Convolution Operation: Filters, Stride, and Padding** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "pooling-layers",
      slug: "pooling-layers",
      title: "Pooling Layers: Max Pool and Average Pool",
      content: `# Pooling Layers: Max Pool and Average Pool

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Implement max pooling and average pooling forward passes and their backward passes for spatial downsampling.

## Preview of topics

- The core ideas that make **Pooling Layers: Max Pool and Average Pool** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "cnn-backprop",
      slug: "cnn-backprop",
      title: "Backpropagation Through Conv and Pool Layers",
      content: `# Backpropagation Through Conv and Pool Layers

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Derive the gradient of the loss with respect to filters and input for the convolutional layer using the flip-and-correlate insight.

## Preview of topics

- The core ideas that make **Backpropagation Through Conv and Pool Layers** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "classic-architectures",
      slug: "classic-architectures",
      title: "Classic Architectures: LeNet-5 and VGG-style Blocks",
      content: `# Classic Architectures: LeNet-5 and VGG-style Blocks

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Study the design decisions of LeNet-5 and VGG. Implement a simplified VGG block and understand depth vs width tradeoffs.

## Preview of topics

- The core ideas that make **Classic Architectures: LeNet-5 and VGG-style Blocks** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "transfer-learning-intuition",
      slug: "transfer-learning-intuition",
      title: "Transfer Learning: Reusing Pretrained Features",
      content: `# Transfer Learning: Reusing Pretrained Features

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Understand why lower CNN layers learn universal features. Implement feature extraction by freezing early layers of a pretrained network.

## Preview of topics

- The core ideas that make **Transfer Learning: Reusing Pretrained Features** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "cnn-checkpoint",
      slug: "cnn-checkpoint",
      title: "Checkpoint: CIFAR-10 Image Classifier",
      content: `# Checkpoint: CIFAR-10 Image Classifier

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Convolutional Neural Networks**." }
\\\`\\\`\\\`

## What you'll learn here

Practice checkpoint — build a three-layer CNN, train on CIFAR-10, apply data augmentation, and achieve >70% test accuracy.

## Preview of topics

- The core ideas that make **Checkpoint: CIFAR-10 Image Classifier** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};
