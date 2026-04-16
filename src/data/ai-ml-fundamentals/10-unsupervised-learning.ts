import { Module } from "../types";

export const unsupervisedLearningModule: Module = {
  id: "unsupervised-learning",
  title: "Unsupervised Learning: Clustering and Dimensionality Reduction",
  description: "Find structure in unlabeled data. Implement K-Means and DBSCAN clustering, reduce dimensions with PCA and t-SNE, and build autoencoders for learned compression.",
  lessons: [
    {
      id: "kmeans-clustering",
      slug: "kmeans-clustering",
      title: "K-Means Clustering",
      content: `# K-Means Clustering

Most real-world data is unlabeled. **Clustering** finds natural groupings without supervision — customer segments, document topics, image regions. **K-Means** is the simplest and most widely used clustering algorithm: partition N points into K clusters by minimizing the within-cluster sum of squared distances.

\`\`\`concept
{ "title": "K-Means: Alternating Assignment and Update", "variant": "analogy", "content": "Imagine K magnets on a table with N iron filings. Each filing attaches to its nearest magnet (assignment step). Then each magnet repositions to the centroid of its attached filings (update step). Repeat until magnets stop moving. K-Means does exactly this, provably converging to a local minimum of the within-cluster sum of squared distances." }
\`\`\`

## The Algorithm

\`\`\`steps
{ "steps": [ { "title": "Initialize K centroids", "description": "Random init: pick K random data points as starting centroids. K-Means++ (better): pick first centroid randomly, then pick subsequent centroids with probability proportional to squared distance from nearest existing centroid — spreads out initial centroids." }, { "title": "Assignment step", "description": "Assign each point to its nearest centroid: label(x_i) = argmin_k ||x_i - mu_k||^2. Complexity: O(N × K × d) per iteration." }, { "title": "Update step", "description": "Recompute each centroid as the mean of its assigned points: mu_k = (1/|C_k|) × sum of x_i in cluster k." }, { "title": "Repeat until convergence", "description": "Stop when assignments don't change (or change < epsilon). Typically 10-100 iterations. Guaranteed to converge but may reach a local minimum." } ] }
\`\`\`

\`\`\`playground
{ "title": "K-Means from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass KMeans:\\n    def __init__(self, k=3, max_iters=100, tol=1e-4):\\n        self.k = k\\n        self.max_iters = max_iters\\n        self.tol = tol\\n        self.centroids = None\\n\\n    def fit(self, X):\\n        # K-Means++ initialization\\n        np.random.seed(42)\\n        idx = np.random.randint(len(X))\\n        self.centroids = [X[idx]]\\n        for _ in range(self.k - 1):\\n            dists = np.array([min(np.sum((x - c)**2) for c in self.centroids) for x in X])\\n            probs = dists / dists.sum()\\n            self.centroids.append(X[np.random.choice(len(X), p=probs)])\\n        self.centroids = np.array(self.centroids)\\n\\n        for iteration in range(self.max_iters):\\n            # Assignment step\\n            labels = self._assign(X)\\n            # Update step\\n            new_centroids = np.array([X[labels == k].mean(axis=0)\\n                                      if (labels == k).any() else self.centroids[k]\\n                                      for k in range(self.k)])\\n            shift = np.linalg.norm(new_centroids - self.centroids)\\n            self.centroids = new_centroids\\n            if shift < self.tol:\\n                print(f'Converged at iteration {iteration+1}')\\n                break\\n        return labels\\n\\n    def _assign(self, X):\\n        dists = np.array([[np.sum((x - c)**2) for c in self.centroids] for x in X])\\n        return np.argmin(dists, axis=1)\\n\\n    def inertia(self, X, labels):\\n        return sum(np.sum((X[labels==k] - self.centroids[k])**2)\\n                   for k in range(self.k) if (labels==k).any())\\n\\n# Generate 3 Gaussian clusters\\nnp.random.seed(0)\\nX = np.vstack([\\n    np.random.randn(50, 2) + [0, 0],\\n    np.random.randn(50, 2) + [5, 0],\\n    np.random.randn(50, 2) + [2.5, 4],\\n])\\n\\nkm = KMeans(k=3)\\nlabels = km.fit(X)\\nprint(f'Cluster sizes: {[(labels==k).sum() for k in range(3)]}')\\nprint(f'Centroids:\\\\n{km.centroids.round(2)}')\\nprint(f'Inertia: {km.inertia(X, labels):.2f}')\\n", "runnable": true }
\`\`\`

## Choosing K: The Elbow Method

\`\`\`playground
{ "title": "Elbow Method for Optimal K", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(0)\\nX = np.vstack([\\n    np.random.randn(50, 2) + [0, 0],\\n    np.random.randn(50, 2) + [5, 0],\\n    np.random.randn(50, 2) + [2.5, 4],\\n])\\n\\ndef kmeans_inertia(X, k, n_iter=50):\\n    centroids = X[np.random.choice(len(X), k, replace=False)]\\n    for _ in range(n_iter):\\n        dists = np.array([[np.sum((x-c)**2) for c in centroids] for x in X])\\n        labels = np.argmin(dists, axis=1)\\n        centroids = np.array([X[labels==i].mean(axis=0) if (labels==i).any()\\n                              else centroids[i] for i in range(k)])\\n    return sum(np.sum((X[labels==i] - centroids[i])**2) for i in range(k) if (labels==i).any())\\n\\nnp.random.seed(42)\\nprint('K  |  Inertia  | Notes')\\nprint('-' * 40)\\nfor k in range(1, 7):\\n    inertia = kmeans_inertia(X, k)\\n    note = '<-- elbow (true K=3)' if k == 3 else ''\\n    print(f'{k}  |  {inertia:8.1f} | {note}')\\n", "runnable": true }
\`\`\`

\`\`\`quiz
{ "question": "K-Means is run twice on the same data with K=3. Run 1 gives inertia=120, Run 2 gives inertia=95. Which run's centroids should be used?", "options": ["Run 1 — lower inertia always means worse clustering", "Run 2 — lower inertia means tighter clusters (less within-cluster variance)", "Neither — the results should be averaged", "Run 1 — it explored more of the solution space"], "answer": 1, "explanation": "K-Means minimizes within-cluster sum of squared distances (inertia). Lower inertia = tighter clusters = better solution. K-Means can get stuck in local minima depending on initialization. The standard practice: run K-Means 10+ times with different random initializations and keep the run with the lowest inertia. This is what sklearn's n_init parameter does." }
\`\`\`

\`\`\`takeaways
{ "points": ["K-Means: alternates between assigning each point to nearest centroid and recomputing centroids as cluster means", "K-Means++ initialization spreads initial centroids — reduces bad local minima significantly", "Run K-Means multiple times (n_init=10+) and keep the lowest-inertia result", "Elbow method: plot inertia vs K, look for the 'elbow' where adding K gives diminishing returns"] }
\`\`\``,
    },
    {
      id: "dbscan-clustering",
      slug: "dbscan-clustering",
      title: "DBSCAN: Density-Based Clustering",
      content: `# DBSCAN: Density-Based Clustering

K-Means requires specifying K upfront and only finds spherical clusters. Real data has clusters of arbitrary shapes (crescents, rings) and outliers. **DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) finds clusters as dense regions separated by sparse regions — and labels sparse points as noise/outliers.

\`\`\`concept
{ "title": "Core Points, Border Points, Noise", "variant": "info", "content": "DBSCAN has two parameters: epsilon (neighborhood radius) and min_samples (minimum density). A point is a Core Point if at least min_samples neighbors are within epsilon distance. A Border Point is within epsilon of a core point but has fewer than min_samples neighbors itself. A Noise Point is neither — an outlier." }
\`\`\`

## The Algorithm

\`\`\`steps
{ "steps": [ { "title": "Find all core points", "description": "For each point p, count neighbors within epsilon. If count >= min_samples, p is a core point." }, { "title": "Expand clusters from core points", "description": "Pick an unvisited core point, start a new cluster. Add all neighbors within epsilon to the cluster. If a neighbor is also a core point, recursively add its neighbors too (density-reachability)." }, { "title": "Assign border points", "description": "Border points: within epsilon of a core point but not core themselves. Assigned to the cluster of the nearest core point." }, { "title": "Label noise", "description": "Any point not reachable from any core point is labeled noise (-1). No manual K required — number of clusters is data-driven." } ] }
\`\`\`

\`\`\`playground
{ "title": "DBSCAN from Scratch", "language": "python", "code": "import numpy as np\\nfrom collections import deque\\n\\nclass DBSCAN:\\n    def __init__(self, eps=0.5, min_samples=5):\\n        self.eps = eps\\n        self.min_samples = min_samples\\n\\n    def fit(self, X):\\n        n = len(X)\\n        labels = np.full(n, -1)  # -1 = noise\\n        cluster_id = 0\\n\\n        for i in range(n):\\n            if labels[i] != -1:\\n                continue  # already visited\\n            neighbors = self._neighbors(X, i)\\n            if len(neighbors) < self.min_samples:\\n                continue  # noise (for now)\\n            # Expand cluster\\n            labels[i] = cluster_id\\n            queue = deque(neighbors)\\n            while queue:\\n                j = queue.popleft()\\n                if labels[j] == -1:\\n                    labels[j] = cluster_id  # border or core\\n                elif labels[j] >= 0:\\n                    continue  # already in a cluster\\n                labels[j] = cluster_id\\n                j_neighbors = self._neighbors(X, j)\\n                if len(j_neighbors) >= self.min_samples:\\n                    queue.extend(j_neighbors)\\n            cluster_id += 1\\n        return labels\\n\\n    def _neighbors(self, X, i):\\n        dists = np.linalg.norm(X - X[i], axis=1)\\n        return list(np.where(dists <= self.eps)[0])\\n\\n# Test on synthetic data with two rings\\nnp.random.seed(42)\\ntheta = np.linspace(0, 2*np.pi, 80)\\nring1 = np.column_stack([np.cos(theta), np.sin(theta)]) + np.random.randn(80,2)*0.1\\nring2 = 2.5 * np.column_stack([np.cos(theta), np.sin(theta)]) + np.random.randn(80,2)*0.1\\nnoise = np.random.uniform(-4, 4, (10, 2))\\nX = np.vstack([ring1, ring2, noise])\\n\\ndb = DBSCAN(eps=0.3, min_samples=5)\\nlabels = db.fit(X)\\n\\nunique = set(labels)\\nprint(f'Clusters found: {len([c for c in unique if c >= 0])}')\\nprint(f'Noise points:   {(labels == -1).sum()}')\\nfor c in sorted(unique):\\n    name = f'Cluster {c}' if c >= 0 else 'Noise'\\n    print(f'  {name}: {(labels==c).sum()} points')\\n", "runnable": true }
\`\`\`

\`\`\`compare
{ "title": "K-Means vs DBSCAN", "left": { "label": "K-Means", "points": ["Requires K specified upfront", "Finds spherical clusters only", "Every point assigned to a cluster", "Sensitive to outliers (pulls centroids)", "Fast O(N×K×d×iterations)", "Use when K known, clusters roughly spherical"] }, "right": { "label": "DBSCAN", "points": ["K not required — discovered from data", "Finds arbitrary-shape clusters", "Can label points as noise (-1)", "Robust to outliers — noise labeled separately", "O(N²) naive, O(N log N) with spatial index", "Use when K unknown or clusters are non-spherical"] } }
\`\`\`

\`\`\`quiz
{ "question": "DBSCAN with eps=0.5 and min_samples=5 is run on a dataset. Point A has 3 neighbors within eps=0.5 (including itself). Point B is 0.4 units from A and has 6 neighbors within eps. How are A and B classified?", "options": ["A=core, B=border", "A=noise (or border), B=core", "A=core, B=core", "A=noise, B=noise"], "answer": 1, "explanation": "B has 6 neighbors within eps >= min_samples=5 → B is a Core Point. A has 3 neighbors < min_samples=5 → A is NOT a core point. A is within eps=0.5 of B (a core point) → A is a Border Point, assigned to B's cluster. If A had no core point within eps, it would be Noise." }
\`\`\`

\`\`\`takeaways
{ "points": ["DBSCAN requires no K — number of clusters is discovered from data density", "Core point: ≥ min_samples neighbors within eps. Border: near a core but not core itself. Noise: isolated", "DBSCAN handles arbitrary cluster shapes and identifies outliers — K-Means cannot do either", "Parameter tuning: use k-distance graph (plot eps at which each point gets its k-th neighbor) to find natural eps value"] }
\`\`\``,
    },
    {
      id: "pca",
      slug: "pca",
      title: "Principal Component Analysis (PCA)",
      content: `# Principal Component Analysis (PCA)

High-dimensional data (1,000 features) is hard to visualize, slow to train on, and often has redundant dimensions. **PCA** finds the directions of maximum variance in the data and projects onto a lower-dimensional subspace — losing as little information as possible.

\`\`\`concept
{ "title": "PCA: Finding the Axes of Variance", "variant": "analogy", "content": "Imagine a cloud of points in 3D space that mostly lies along a tilted plane. If you rotate your coordinate system to align one axis with the plane's longest direction and another with its second-longest direction, you can describe 90%+ of the variance with just 2 coordinates instead of 3. PCA finds this optimal rotation mathematically using eigenvectors of the covariance matrix." }
\`\`\`

## The PCA Algorithm

\`\`\`steps
{ "steps": [ { "title": "Center the data", "description": "Subtract the mean: X_centered = X - mean(X). PCA finds variance around the mean, not the origin." }, { "title": "Compute covariance matrix", "description": "C = (1/N) × X_centered^T × X_centered. Shape: (d × d) where d = number of features." }, { "title": "Eigendecomposition", "description": "C = V × Lambda × V^T. Eigenvectors V = principal components (directions of variance). Eigenvalues Lambda = variance explained by each direction." }, { "title": "Select top-k components", "description": "Sort eigenvectors by eigenvalue (descending). Keep top-k: V_k. Project: X_reduced = X_centered × V_k. Shape changes from (N × d) to (N × k)." } ] }
\`\`\`

\`\`\`playground
{ "title": "PCA from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass PCA:\\n    def __init__(self, n_components):\\n        self.n_components = n_components\\n        self.components = None\\n        self.mean = None\\n        self.explained_variance_ratio = None\\n\\n    def fit_transform(self, X):\\n        self.mean = X.mean(axis=0)\\n        X_c = X - self.mean\\n        C = (X_c.T @ X_c) / len(X)\\n        eigenvalues, eigenvectors = np.linalg.eigh(C)\\n        # Sort by eigenvalue descending\\n        idx = np.argsort(eigenvalues)[::-1]\\n        eigenvalues = eigenvalues[idx]\\n        eigenvectors = eigenvectors[:, idx]\\n        self.components = eigenvectors[:, :self.n_components]\\n        total_var = eigenvalues.sum()\\n        self.explained_variance_ratio = eigenvalues[:self.n_components] / total_var\\n        return X_c @ self.components\\n\\n# High-dimensional correlated data\\nnp.random.seed(42)\\nt = np.random.randn(200)\\nX = np.column_stack([\\n    t + 0.1 * np.random.randn(200),     # dim 1: mostly t\\n    2*t + 0.1 * np.random.randn(200),   # dim 2: mostly 2t\\n    -t + 0.2 * np.random.randn(200),    # dim 3: mostly -t\\n    np.random.randn(200) * 0.3,          # dim 4: pure noise\\n])\\n\\npca = PCA(n_components=2)\\nX_2d = pca.fit_transform(X)\\n\\nprint(f'Original shape: {X.shape}')\\nprint(f'Reduced shape:  {X_2d.shape}')\\nprint(f'Variance explained by PC1: {pca.explained_variance_ratio[0]:.1%}')\\nprint(f'Variance explained by PC2: {pca.explained_variance_ratio[1]:.1%}')\\nprint(f'Total explained (2 PCs):   {pca.explained_variance_ratio.sum():.1%}')\\n", "runnable": true }
\`\`\`

## When to Use PCA

\`\`\`tabs
{ "tabs": [ { "label": "Good uses", "content": "- Visualization: reduce to 2-3 dims for scatter plots\\n- Preprocessing: remove low-variance dimensions before training\\n- Noise reduction: low-variance components often capture noise\\n- Storage compression: encode data in k << d dimensions\\n- Speed up training: fewer input features = faster model" }, { "label": "Limitations", "content": "- Linear only: can't capture nonlinear structure (use t-SNE or autoencoder)\\n- Interpretability: PCs are linear combinations of all features — hard to name\\n- Supervised label information ignored: may discard class-discriminative variance\\n- Scaling matters: must standardize features before PCA" } ] }
\`\`\`

\`\`\`quiz
{ "question": "PCA is applied to a 100-dimensional dataset. The first principal component explains 60% of variance, the second explains 20%. You keep 2 components. What information is lost?", "options": ["Nothing — PCA is lossless", "The 20% of variance in dimensions 3-100 that is not captured by the first 2 PCs", "The correlation structure between the 100 features", "The mean of the data — PCA centers data, discarding means"], "answer": 1, "explanation": "The first 2 PCs together explain 60%+20%=80% of variance. The remaining 98 PCs together explain 20% of variance — this is the information lost by keeping only 2 components. Whether 20% loss is acceptable depends on the task. Reconstruction error = ||X - X_reconstructed||^2 is proportional to the sum of discarded eigenvalues." }
\`\`\`

\`\`\`takeaways
{ "points": ["PCA finds orthogonal directions (principal components) that maximize explained variance", "Steps: center → covariance matrix → eigendecomposition → sort by eigenvalue → project onto top-k eigenvectors", "Always standardize features before PCA — features with larger scales dominate the covariance matrix", "Scree plot: plot explained variance vs number of PCs, keep components before the 'elbow'"] }
\`\`\``,
    },
    {
      id: "tsne-visualization",
      slug: "tsne-visualization",
      title: "t-SNE: Nonlinear Dimensionality Reduction",
      content: `# t-SNE: Nonlinear Dimensionality Reduction

PCA is linear — it can't unroll a Swiss roll or visualize clusters that lie on curved manifolds. **t-SNE** (t-Distributed Stochastic Neighbor Embedding) is a nonlinear technique that preserves local structure: nearby points in high-D stay nearby in 2D. It's the standard tool for visualizing word embeddings, neural activations, and single-cell RNA-seq data.

\`\`\`concept
{ "title": "Two Probability Distributions, One Objective", "variant": "info", "content": "t-SNE defines two probability distributions: P_ij (in high-D) = probability that points i and j are neighbors (based on Gaussian distances). Q_ij (in low-D) = probability that points i and j are neighbors in the 2D embedding (based on Student-t distances). The objective: minimize KL divergence between P and Q. Points that are close in high-D must be close in 2D, or the KL divergence grows large." }
\`\`\`

## Why Student-t Distribution in Low-D?

The Student-t distribution has heavier tails than Gaussian. In 2D, this means non-neighbors (moderate distance in high-D) get pushed far apart — creating the white space between clusters that makes t-SNE plots visually clear. The Gaussian in high-D + t-distribution in low-D combination is the key trick.

\`\`\`playground
{ "title": "t-SNE Core Math: High-D Similarities", "language": "python", "code": "import numpy as np\\n\\ndef compute_pairwise_affinities(X, perplexity=30, n_iter=50):\\n    '''Compute symmetric P matrix from high-dimensional X'''\\n    n = len(X)\\n    P = np.zeros((n, n))\\n    # For each point, find sigma such that perplexity is achieved\\n    dists = np.sum((X[:, None, :] - X[None, :, :])**2, axis=-1)  # (n, n)\\n    for i in range(n):\\n        # Binary search for sigma_i\\n        beta = 1.0  # beta = 1/(2*sigma^2)\\n        lo, hi = -np.inf, np.inf\\n        for _ in range(n_iter):\\n            row = np.exp(-beta * dists[i])\\n            row[i] = 0\\n            row_sum = row.sum() + 1e-10\\n            H = np.log(row_sum) + beta * np.sum(row * dists[i]) / row_sum\\n            H_diff = H - np.log(perplexity)\\n            if abs(H_diff) < 1e-4:\\n                break\\n            if H_diff > 0:\\n                lo = beta\\n                beta = (beta + hi) / 2 if hi != np.inf else beta * 2\\n            else:\\n                hi = beta\\n                beta = (beta + lo) / 2 if lo != -np.inf else beta / 2\\n        P[i] = row / row_sum\\n    P = (P + P.T) / (2 * n)  # Symmetrize\\n    return np.maximum(P, 1e-12)\\n\\n# Small demo\\nnp.random.seed(42)\\nX_small = np.vstack([\\n    np.random.randn(10, 4) + [3, 0, 0, 0],\\n    np.random.randn(10, 4) + [-3, 0, 0, 0],\\n])\\nP = compute_pairwise_affinities(X_small, perplexity=5)\\nprint('P matrix shape:', P.shape)\\nprint('Within cluster 1 (avg similarity):', P[:10, :10].mean().round(4))\\nprint('Between clusters (avg similarity):', P[:10, 10:].mean().round(4))\\nprint('Similarity within cluster >> between clusters — t-SNE will push them apart')\\n", "runnable": true }
\`\`\`

## Practical t-SNE Guidelines

\`\`\`tabs
{ "tabs": [ { "label": "Perplexity", "content": "Perplexity controls the effective number of neighbors per point. Typical range: 5-50.\\nSmall perplexity: preserves very local structure, may fragment large clusters.\\nLarge perplexity: smoother, more global structure.\\nRule of thumb: perplexity = sqrt(N) as a starting point." }, { "label": "Interpretation caveats", "content": "t-SNE DOES preserve: local neighborhood structure (nearby clusters are truly nearby in high-D).\\nt-SNE DOES NOT preserve: distances between clusters (inter-cluster distances are meaningless), global structure, cluster sizes.\\nDo NOT: compare cluster sizes, interpret distances between clusters, draw conclusions from cluster positions." }, { "label": "Use PCA first", "content": "For high-dimensional data (>50 dims), run PCA first to reduce to 30-50 dims, then t-SNE. Reasons: (1) removes noise/irrelevant dimensions, (2) makes t-SNE much faster O(N^2 is expensive), (3) PCA preserves global structure t-SNE would distort anyway." } ] }
\`\`\`

\`\`\`quiz
{ "question": "A t-SNE plot of word embeddings shows 'cat', 'dog', 'fish' in one cluster and 'red', 'blue', 'green' in another. The distance between the clusters on the plot is large. Can you conclude that animals are more different from colors than from each other?", "options": ["Yes — t-SNE preserves all distances proportionally", "No — inter-cluster distances in t-SNE are not meaningful; only within-cluster structure (nearby points are truly similar in high-D) can be interpreted", "Yes, if perplexity was set correctly", "No — t-SNE always places clusters at equal distances regardless of actual similarity"], "answer": 1, "explanation": "t-SNE's objective is KL(P||Q), which heavily penalizes placing similar high-D points far apart in 2D. It does NOT penalize placing dissimilar points near each other much. The result: t-SNE is excellent at local structure (cluster membership) but distorts global structure. The positions and spacings between clusters in a t-SNE plot are not interpretable as actual distances in the original space." }
\`\`\`

\`\`\`takeaways
{ "points": ["t-SNE preserves local structure: nearby points in high-D stay nearby in 2D — good for cluster visualization", "Perplexity controls neighborhood size (5-50); run with multiple perplexity values to check stability", "Inter-cluster distances in t-SNE plots are NOT interpretable — only cluster membership is reliable", "Standard workflow: PCA to 30-50 dims → t-SNE to 2D for visualization"] }
\`\`\``,
    },
    {
      id: "autoencoders",
      slug: "autoencoders",
      title: "Autoencoders: Learned Compression",
      content: `# Autoencoders: Learned Compression

PCA finds the best linear compression. **Autoencoders** find the best nonlinear compression using neural networks. An autoencoder is trained to reconstruct its input through a bottleneck — the bottleneck forces the network to learn a compact representation (the **latent code**) that captures the essential structure of the data.

\`\`\`concept
{ "title": "Encoder-Bottleneck-Decoder", "variant": "analogy", "content": "Think of compressing an image for sending over a slow internet connection. The encoder compresses the image into a small file; the decoder reconstructs the image at the other end. Autoencoders learn to do this compression automatically — but unlike JPEG (hand-designed compression), autoencoders learn the optimal compression for their specific training data." }
\`\`\`

## Architecture

\`\`\`
Input (d) → Encoder → Latent code (k << d) → Decoder → Reconstruction (d)
Loss = ||x - x_hat||^2  (mean squared error)
\`\`\`

- **Encoder**: reduces dimensionality d → k with nonlinear layers
- **Latent code / bottleneck**: the compressed representation
- **Decoder**: reconstructs from k → d

\`\`\`playground
{ "title": "Autoencoder from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef relu(x): return np.maximum(0, x)\\ndef relu_grad(x): return (x > 0).astype(float)\\ndef sigmoid(x): return 1 / (1 + np.exp(-np.clip(x, -10, 10)))\\n\\nclass Autoencoder:\\n    def __init__(self, input_dim=16, hidden_dim=8, latent_dim=2, lr=0.01):\\n        np.random.seed(42)\\n        s = 0.1\\n        # Encoder weights\\n        self.W1 = np.random.randn(hidden_dim, input_dim) * s\\n        self.b1 = np.zeros(hidden_dim)\\n        self.W2 = np.random.randn(latent_dim, hidden_dim) * s\\n        self.b2 = np.zeros(latent_dim)\\n        # Decoder weights\\n        self.W3 = np.random.randn(hidden_dim, latent_dim) * s\\n        self.b3 = np.zeros(hidden_dim)\\n        self.W4 = np.random.randn(input_dim, hidden_dim) * s\\n        self.b4 = np.zeros(input_dim)\\n        self.lr = lr\\n\\n    def encode(self, x):\\n        h = relu(self.W1 @ x + self.b1)\\n        z = self.W2 @ h + self.b2\\n        return z, h\\n\\n    def decode(self, z):\\n        h = relu(self.W3 @ z + self.b3)\\n        x_hat = sigmoid(self.W4 @ h + self.b4)\\n        return x_hat, h\\n\\n    def train_step(self, x):\\n        # Forward\\n        z, h1 = self.encode(x)\\n        x_hat, h2 = self.decode(z)\\n        loss = np.mean((x - x_hat)**2)\\n        # Backward (simplified gradient update)\\n        d_out = -2 * (x - x_hat) / len(x)\\n        # Crude param update (full backprop omitted for brevity)\\n        self.W4 -= self.lr * np.outer(d_out, h2)\\n        self.b4 -= self.lr * d_out\\n        return loss\\n\\n# Train on random binary data\\nnp.random.seed(0)\\ndata = (np.random.rand(100, 16) > 0.5).astype(float)\\nae = Autoencoder(input_dim=16, latent_dim=2, lr=0.05)\\n\\nfor epoch in range(5):\\n    losses = [ae.train_step(x) for x in data]\\n    print(f'Epoch {epoch+1}: loss={np.mean(losses):.4f}')\\n\\n# Test compression\\nx_test = data[0]\\nz, _ = ae.encode(x_test)\\nx_hat, _ = ae.decode(z)\\nprint(f'\\\\nCompression: {len(x_test)}D → {len(z)}D → {len(x_hat)}D')\\nprint(f'Reconstruction MSE: {np.mean((x_test-x_hat)**2):.4f}')\\n", "runnable": true }
\`\`\`

## Applications of Autoencoders

\`\`\`tabs
{ "tabs": [ { "label": "Anomaly detection", "content": "Train autoencoder on normal data. At test time: reconstruct each input. Normal inputs → low reconstruction error. Anomalies → high reconstruction error (the network was never trained to reconstruct them).\\nUsed for: fraud detection, industrial defect detection, network intrusion detection." }, { "label": "Denoising", "content": "Denoising autoencoder: corrupt input with noise, train to reconstruct the clean version.\\nForces the latent code to capture only the essential structure (noise-free signal).\\nBonus: latent representations generalize better than standard autoencoders." }, { "label": "Variational Autoencoder (VAE)", "content": "VAE: encoder outputs a Gaussian distribution (mean, variance) over the latent space instead of a single point.\\nDecoder samples from this distribution. Latent space is continuous and smooth.\\nApplications: image generation, molecule design, data augmentation.\\nLoss = reconstruction loss + KL divergence regularizer." } ] }
\`\`\`

\`\`\`quiz
{ "question": "An autoencoder is trained on credit card transactions. At inference time, a fraudulent transaction gets reconstruction error=8.5 while normal transactions average 0.3. Why does this indicate fraud?", "options": ["The autoencoder was trained to detect fraud — it learned to output high error for fraud", "The autoencoder was trained on normal transactions only — it learned to reconstruct them well. Fraudulent patterns are unlike the training distribution, so the decoder can't reconstruct them accurately", "The autoencoder overfit to the training data, causing high error on everything", "Reconstruction error=8.5 is below the fraud threshold and should be classified as normal"], "answer": 1, "explanation": "An anomaly detection autoencoder is trained ONLY on normal data. Its decoder learned to reconstruct normal transaction patterns (small amounts, typical merchants, normal times). A fraudulent transaction has patterns the decoder never learned (unusual merchant, large amount, odd time). The mismatch between input and reconstruction reveals the anomaly. This is a zero-shot detection approach — no labeled fraud examples needed during training." }
\`\`\`

\`\`\`takeaways
{ "points": ["Autoencoder = nonlinear PCA: encoder compresses to latent code, decoder reconstructs, trained to minimize ||x - x̂||²", "Bottleneck forces the network to learn the most informative low-dimensional representation of the data", "Anomaly detection: train on normal data only, high reconstruction error = anomaly at inference time", "VAE adds a probabilistic latent space: encoder outputs (mean, variance), enabling smooth interpolation and generation"] }
\`\`\``,
    },
    {
      id: "unsupervised-checkpoint",
      slug: "unsupervised-checkpoint",
      title: "Checkpoint: Customer Segmentation Pipeline",
      content: `# Checkpoint: Customer Segmentation Pipeline

\`\`\`callout
{ "variant": "info", "title": "Module Checkpoint", "content": "Apply K-Means, PCA, and t-SNE to a customer segmentation problem. This is one of the most common real-world unsupervised learning tasks. Work through the pipeline, then validate with the quiz battery." }
\`\`\`

## The Task

You have behavioral data for 1,000 customers: purchase frequency, average order value, product categories, time since last purchase (recency), and 45 other features. Goal: identify meaningful customer segments for targeted marketing.

## Recommended Pipeline

\`\`\`steps
{ "steps": [ { "title": "Standardize features", "description": "Z-score standardization: subtract mean, divide by std for each feature. Critical: 'purchase frequency' (0-50) and 'average order value' (0-5000) are incomparable scales. StandardScaler makes them equal-weight for distance computation." }, { "title": "PCA to 10 dimensions", "description": "50 features → PCA → 10 components. Typically captures 80-90% of variance. Reduces noise, speeds up K-Means, removes correlated features." }, { "title": "K-Means with elbow method", "description": "Run K-Means for K=2..10. Plot inertia and silhouette score. Typical result: K=4-6 meaningful segments." }, { "title": "Profile the segments", "description": "For each cluster, compute mean of original features. Name the segments: 'High-value loyals', 'Price-sensitive occasionals', 'Recent one-timers', 'Dormant high-value'." }, { "title": "Visualize with t-SNE", "description": "Project 10-dim PCA embeddings to 2D with t-SNE, color by cluster label. Visual validation: are the clusters well-separated?" } ] }
\`\`\`

\`\`\`playground
{ "title": "Customer Segmentation Demo", "language": "python", "code": "import numpy as np\\nfrom collections import Counter\\n\\nnp.random.seed(42)\\nN = 200\\n\\n# Simulate 4 customer types\\nsegments = {\\n    'High-value loyal': np.column_stack([\\n        np.random.randn(50)*0.5 + 8,   # high frequency\\n        np.random.randn(50)*50 + 500,  # high order value\\n        np.random.randn(50)*0.5 + 0.2, # low recency (recent)\\n    ]),\\n    'Price-sensitive': np.column_stack([\\n        np.random.randn(50)*0.5 + 5,\\n        np.random.randn(50)*20 + 80,\\n        np.random.randn(50)*0.5 + 0.3,\\n    ]),\\n    'Occasional high-value': np.column_stack([\\n        np.random.randn(50)*0.5 + 2,\\n        np.random.randn(50)*100 + 400,\\n        np.random.randn(50)*0.5 + 0.6,\\n    ]),\\n    'Dormant': np.column_stack([\\n        np.random.randn(50)*0.3 + 1,\\n        np.random.randn(50)*30 + 100,\\n        np.random.randn(50)*0.5 + 0.95,\\n    ]),\\n}\\n\\ntrue_labels = []\\nX_list = []\\nfor name, data in segments.items():\\n    X_list.append(data)\\n    true_labels.extend([name] * 50)\\nX = np.vstack(X_list)\\n\\n# Standardize\\nX_std = (X - X.mean(axis=0)) / X.std(axis=0)\\n\\n# Simple K-Means\\nfrom collections import defaultdict\\nnp.random.seed(0)\\ncentroids = X_std[np.random.choice(len(X_std), 4, replace=False)]\\nfor _ in range(50):\\n    dists = np.linalg.norm(X_std[:, None] - centroids[None], axis=2)\\n    labels = np.argmin(dists, axis=1)\\n    centroids = np.array([X_std[labels==k].mean(axis=0) for k in range(4)])\\n\\nprint('Cluster profiles (original scale):')\\ncols = ['Frequency/month', 'Avg order ($)', 'Recency (0=recent)']\\nfor k in range(4):\\n    mask = labels == k\\n    print(f'\\\\nCluster {k} (n={mask.sum()}):')\\n    for col, val in zip(cols, X[mask].mean(axis=0)):\\n        print(f'  {col:<25} {val:.1f}')\\n", "runnable": true }
\`\`\`

## Quiz Battery

\`\`\`quiz
{ "question": "Before applying K-Means to customer data with features [age (20-80), annual_spend ($1,000-$100,000), n_purchases (1-50)], you must:", "options": ["Normalize all features to [0,1] range or standardize to zero mean/unit variance — otherwise annual_spend dominates distance calculations", "Increase K to account for the different feature scales", "Apply PCA first — K-Means doesn't work with mixed-scale features", "Nothing — K-Means handles mixed scales automatically through its centroid initialization"], "answer": 0, "explanation": "K-Means minimizes Euclidean distance. annual_spend ranges from 1,000 to 100,000 — a difference of 1,000 in spend vastly outweighs a difference of 30 in age or 49 in purchases. Without standardization, spend completely dominates and clusters are purely ordered by spending level. StandardScaler (zero mean, unit std) makes each feature contribute equally to distance." }
\`\`\`

\`\`\`quiz
{ "question": "K-Means produces 4 clusters on customer data. A business analyst says 'Cluster 3 looks like two different customer types — one high-frequency low-value, one low-frequency high-value.' What should you do?", "options": ["Re-run K-Means with K=5 or K=6 and check if the split produces more interpretable segments", "Add more features to the dataset and re-run with K=4", "Use the current clustering — K-Means always finds the optimal number of clusters", "Replace K-Means with linear regression for better segment boundaries"], "answer": 0, "explanation": "The analyst's observation is valuable domain knowledge: a cluster that appears heterogeneous to a business expert likely contains multiple subgroups. Increasing K by 1-2 may split this cluster into meaningful sub-segments. Also consider running K-Means with K=3..8 and evaluating with silhouette scores — the elbow in silhouette score may appear at K=5 or K=6 rather than K=4." }
\`\`\`

\`\`\`takeaways
{ "points": ["Standardize features before K-Means — features with large scales dominate Euclidean distance", "Pipeline: standardize → PCA (optional) → K-Means with elbow method → t-SNE visualization → domain expert validation", "Cluster labels are arbitrary integers — always profile clusters with mean feature values and give business names", "Silhouette score: measures how similar a point is to its own cluster vs. other clusters — higher is better (range -1 to 1)"] }
\`\`\``,
    },
  ],
};
