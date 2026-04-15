import { Module } from "../types";

export const unsupervisedLearningModule: Module = {
  id: "unsupervised-learning",
  title: "Unsupervised Learning: Clustering and Dimensionality Reduction",
  description: "Discover structure in unlabeled data using K-Means, hierarchical clustering, PCA, and t-SNE implemented from scratch.",
  lessons: [
    {
      id: "kmeans-from-scratch",
      slug: "kmeans-from-scratch",
      title: "K-Means Clustering from Scratch",
      content: `# K-Means Clustering from Scratch

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Unsupervised Learning: Clustering and Dimensionality Reduction**." }
\\\`\\\`\\\`

## What you'll learn here

Implement the K-Means algorithm: random initialization, centroid assignment, centroid update, and convergence detection.

## Preview of topics

- The core ideas that make **K-Means Clustering from Scratch** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "kmeans-plus-plus",
      slug: "kmeans-plus-plus",
      title: "K-Means++ Initialization and Choosing K",
      content: `# K-Means++ Initialization and Choosing K

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Unsupervised Learning: Clustering and Dimensionality Reduction**." }
\\\`\\\`\\\`

## What you'll learn here

Implement the K-Means++ seeding strategy. Use the elbow method and silhouette scores to select the optimal number of clusters.

## Preview of topics

- The core ideas that make **K-Means++ Initialization and Choosing K** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "pca-from-scratch",
      slug: "pca-from-scratch",
      title: "Principal Component Analysis from Scratch",
      content: `# Principal Component Analysis from Scratch

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Unsupervised Learning: Clustering and Dimensionality Reduction**." }
\\\`\\\`\\\`

## What you'll learn here

Derive PCA using the covariance matrix and eigen-decomposition. Implement it with np.linalg.eig and reduce MNIST to 2D for visualization.

## Preview of topics

- The core ideas that make **Principal Component Analysis from Scratch** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "svd-pca-connection",
      slug: "svd-pca-connection",
      title: "SVD, Explained Variance, and Compression",
      content: `# SVD, Explained Variance, and Compression

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Unsupervised Learning: Clustering and Dimensionality Reduction**." }
\\\`\\\`\\\`

## What you'll learn here

Connect PCA to SVD. Select the number of components by explained variance ratio and reconstruct compressed images.

## Preview of topics

- The core ideas that make **SVD, Explained Variance, and Compression** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "tsne-intuition",
      slug: "tsne-intuition",
      title: "t-SNE: Non-Linear Dimensionality Reduction",
      content: `# t-SNE: Non-Linear Dimensionality Reduction

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Unsupervised Learning: Clustering and Dimensionality Reduction**." }
\\\`\\\`\\\`

## What you'll learn here

Understand the high-dimensional and low-dimensional similarity distributions in t-SNE. Use sklearn's implementation to visualize embeddings.

## Preview of topics

- The core ideas that make **t-SNE: Non-Linear Dimensionality Reduction** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "unsupervised-checkpoint",
      slug: "unsupervised-checkpoint",
      title: "Checkpoint: Cluster and Visualize Customer Segments",
      content: `# Checkpoint: Cluster and Visualize Customer Segments

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. In the meantime, complete Modules 1–6 — they give you the NumPy, math, data, linear-regression, logistic-regression, and neural-network foundations needed before tackling **Unsupervised Learning: Clustering and Dimensionality Reduction**." }
\\\`\\\`\\\`

## What you'll learn here

Practice checkpoint — apply PCA + K-Means to a customer transaction dataset, determine optimal clusters, and present a business interpretation.

## Preview of topics

- The core ideas that make **Checkpoint: Cluster and Visualize Customer Segments** click
- How it connects to what you built in Modules 1–6
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};
