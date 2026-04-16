import { Module } from "../types";

export const module4: Module = {
  id: "unsupervised-evaluation",
  title: "Unsupervised Learning & Model Evaluation",
  description: "K-means, DBSCAN, PCA, t-SNE for dimensionality reduction, and rigorous model evaluation with cross-validation and learning curves",
  lessons: [
    {
      id: "unsupervised-methods",
      slug: "unsupervised-methods",
      title: "Clustering, Dimensionality Reduction & Evaluation",
      content: `# Unsupervised Learning & Model Evaluation

Finding patterns in unlabeled data — and rigorously measuring when your model is actually good.

---

## Clustering

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score, davies_bouldin_score
from sklearn.datasets import make_blobs, make_moons
from sklearn.preprocessing import StandardScaler

# --- K-Means ---
X_blobs, _ = make_blobs(n_samples=500, centers=4, random_state=42)

# Finding optimal k with the Elbow method:
inertias = []
sil_scores = []
for k in range(2, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init='auto')
    km.fit(X_blobs)
    inertias.append(km.inertia_)             # Sum of squared distances to centroids
    sil_scores.append(silhouette_score(X_blobs, km.labels_))

# Plot:
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(range(2, 11), inertias, 'bo-')
axes[0].set_title('Elbow Method — pick k at the elbow')
axes[1].plot(range(2, 11), sil_scores, 'ro-')
axes[1].set_title('Silhouette Score — higher = better (1.0 perfect)')
plt.tight_layout()
plt.show()
# Silhouette: [-1, 1]. 1 = well-separated, 0 = overlapping, -1 = wrong cluster

# --- DBSCAN (Density-Based — no need to specify k) ---
X_moons, _ = make_moons(n_samples=500, noise=0.1, random_state=42)
X_moons_scaled = StandardScaler().fit_transform(X_moons)

# DBSCAN: core points (neighbors ≥ min_samples), border points, noise (-1)
db = DBSCAN(eps=0.3, min_samples=10)
labels = db.fit_predict(X_moons_scaled)
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = (labels == -1).sum()
print(f"Clusters: {n_clusters}, Noise: {n_noise}")

# K-Means vs DBSCAN:
# K-Means: fast, assumes spherical clusters, need k in advance
# DBSCAN: finds arbitrary shapes, finds outliers (noise), no k needed
#         but eps parameter sensitive
\`\`\`

## PCA: Dimensionality Reduction

\`\`\`python
from sklearn.decomposition import PCA
import pandas as pd

# PCA: find directions of maximum variance, project data onto them
# Goal: reduce 100 features → 2-10 components while preserving 90%+ variance

pca = PCA(n_components=None)   # Compute all components
pca.fit(X_train_scaled)

# How many components to keep?
cumvar = np.cumsum(pca.explained_variance_ratio_)
n_components_90 = np.argmax(cumvar >= 0.90) + 1
print(f"Components for 90% variance: {n_components_90}")

plt.plot(cumvar)
plt.xlabel('Number of components')
plt.ylabel('Cumulative explained variance')
plt.axhline(0.90, color='r', linestyle='--', label='90% variance')
plt.legend()
plt.show()

# Apply PCA:
pca_final = PCA(n_components=n_components_90)
X_reduced = pca_final.fit_transform(X_train_scaled)

# 2D visualization (t-SNE for nonlinear, PCA for linear):
pca_2d = PCA(n_components=2)
X_2d = pca_2d.fit_transform(X_train_scaled)
plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y_train, cmap='tab10', alpha=0.5)
plt.title('PCA 2D projection')
plt.show()
\`\`\`

## t-SNE: Nonlinear Visualization

\`\`\`python
from sklearn.manifold import TSNE

# t-SNE: nonlinear dimensionality reduction for VISUALIZATION only
# Preserves local neighborhood structure (clusters)
# WARNING: distances between clusters NOT meaningful — only cluster membership

# Slow on large data: use PCA first to reduce to ~50 dims, then t-SNE
X_pca50 = PCA(n_components=50).fit_transform(X_train_scaled)
tsne = TSNE(n_components=2, perplexity=30, n_iter=1000, random_state=42)
X_tsne = tsne.fit_transform(X_pca50)

plt.figure(figsize=(10, 8))
scatter = plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y_train,
                      cmap='tab10', alpha=0.7, s=10)
plt.colorbar(scatter)
plt.title('t-SNE Visualization')
plt.show()
\`\`\`

## Learning Curves: Diagnose Over/Underfitting

\`\`\`python
from sklearn.model_selection import learning_curve

def plot_learning_curves(model, X, y, cv=5):
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y,
        train_sizes=np.linspace(0.1, 1.0, 10),
        cv=cv, scoring='accuracy', n_jobs=-1
    )
    train_mean = train_scores.mean(axis=1)
    val_mean   = val_scores.mean(axis=1)

    plt.figure(figsize=(8, 5))
    plt.plot(train_sizes, train_mean, 'o-', label='Training score')
    plt.plot(train_sizes, val_mean,   's-', label='Validation score')
    plt.fill_between(train_sizes,
                     train_mean - train_scores.std(axis=1),
                     train_mean + train_scores.std(axis=1), alpha=0.1)
    plt.xlabel('Training set size')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.title('Learning Curves')
    plt.show()

# Reading learning curves:
# High train score + low val score + big gap = OVERFITTING → regularize or more data
# Low train score + low val score + small gap = UNDERFITTING → more complex model
# Both converge at high score = GOOD FIT

plot_learning_curves(RandomForestClassifier(n_estimators=100), X, y)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does the silhouette score measure in clustering?",
      "options": [
        "The number of clusters found",
        "How similar each point is to its own cluster vs. the nearest other cluster. Ranges from -1 (wrong cluster) to 1 (well separated), with 0 meaning overlapping clusters.",
        "The execution time of the clustering algorithm",
        "How many outliers were detected"
      ],
      "answer": 1,
      "explanation": "Silhouette score = (b - a) / max(a, b), where a = mean intra-cluster distance and b = mean nearest-cluster distance. It measures cluster quality without needing ground truth labels. Score of 1 = tight, well-separated clusters. Score of 0 = overlapping clusters. Score of -1 = misassigned points. Use it to choose k in K-means or eps in DBSCAN."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
