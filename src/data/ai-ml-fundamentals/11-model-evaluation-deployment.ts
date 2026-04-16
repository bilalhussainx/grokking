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

A single train/test split is unreliable: depending on which 20% becomes the test set, accuracy might range from 78% to 88% by chance. **Cross-validation** gives a more stable estimate of generalization by training and evaluating on K different splits — every data point serves as test data exactly once.

\`\`\`concept
{ "title": "Every Point Is Test Data Exactly Once", "variant": "info", "content": "K-fold CV splits data into K equal folds. Train on K-1 folds, evaluate on the held-out fold. Repeat K times, each time holding out a different fold. Final performance = mean (± std) over K test scores. With K=5: each model trains on 80% and tests on 20%, giving 5 evaluation scores that we average for a robust estimate." }
\`\`\`

## Stratified K-Fold

For classification with class imbalance (e.g., 95% negative, 5% positive), random splitting might put all positive examples in one fold. Stratified K-fold preserves the class ratio in every fold — each fold has the same class distribution as the full dataset.

\`\`\`playground
{ "title": "K-Fold Cross-Validation from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass KFold:\\n    def __init__(self, n_splits=5, shuffle=True):\\n        self.n_splits = n_splits\\n        self.shuffle = shuffle\\n\\n    def split(self, X):\\n        n = len(X)\\n        indices = np.arange(n)\\n        if self.shuffle:\\n            np.random.shuffle(indices)\\n        fold_sizes = np.full(self.n_splits, n // self.n_splits)\\n        fold_sizes[:n % self.n_splits] += 1\\n        current = 0\\n        for fold_size in fold_sizes:\\n            start, stop = current, current + fold_size\\n            val_idx = indices[start:stop]\\n            train_idx = np.concatenate([indices[:start], indices[stop:]])\\n            yield train_idx, val_idx\\n            current = stop\\n\\ndef logistic_train(X, y, lr=0.1, epochs=200):\\n    w = np.zeros(X.shape[1])\\n    b = 0.0\\n    for _ in range(epochs):\\n        z = X @ w + b\\n        pred = 1 / (1 + np.exp(-z))\\n        w -= lr * X.T @ (pred - y) / len(y)\\n        b -= lr * (pred - y).mean()\\n    return w, b\\n\\ndef accuracy(X, y, w, b):\\n    pred = (1 / (1 + np.exp(-(X @ w + b))) > 0.5).astype(int)\\n    return (pred == y).mean()\\n\\nnp.random.seed(42)\\nX = np.random.randn(100, 4)\\nw_true = np.array([1.5, -2.0, 0.5, -1.0])\\ny = (X @ w_true + np.random.randn(100)*0.5 > 0).astype(int)\\n\\nkf = KFold(n_splits=5)\\nscores = []\\nfor fold, (train_idx, val_idx) in enumerate(kf.split(X)):\\n    w, b = logistic_train(X[train_idx], y[train_idx])\\n    score = accuracy(X[val_idx], y[val_idx], w, b)\\n    scores.append(score)\\n    print(f'Fold {fold+1}: val accuracy = {score:.3f}')\\n\\nprint(f'\\\\nMean CV accuracy: {np.mean(scores):.3f} ± {np.std(scores):.3f}')\\n", "runnable": true }
\`\`\`

## Leave-One-Out Cross-Validation (LOOCV)

LOOCV is K-fold where K = N (leave one sample out each time). Lowest bias (almost all data used for training) but highest variance and computationally expensive. Only use for very small datasets (<50 samples) where 5-fold CV would be too noisy.

\`\`\`compare
{ "title": "CV Strategy Comparison", "left": { "label": "5-Fold CV", "points": ["5 train/test splits", "Each model trains on 80% of data", "5 evaluation scores", "Good bias-variance balance", "Use for most situations (N > 200)"] }, "right": { "label": "Stratified K-Fold", "points": ["Same as K-Fold but preserves class ratios", "Critical for imbalanced datasets", "E.g., 5% fraud → each fold has ~5% fraud", "Use whenever class distribution is uneven", "Default choice for classification tasks"] } }
\`\`\`

\`\`\`quiz
{ "question": "A dataset has 1000 samples: 950 negative, 50 positive. You use standard (non-stratified) 5-fold CV. What risk does this create?", "options": ["Training takes 5× longer than a single split", "Some folds might have 0 positive examples in the validation set — accuracy would be 100% by predicting all negative, giving a misleadingly high score", "The model overfits to the majority class in every fold", "Standard K-Fold cannot handle binary labels"], "answer": 1, "explanation": "With 50 positives and 5 folds, each fold has ~10 positives on average — but random splitting might put 0 positives in a fold. A model that predicts all-negative gets 100% accuracy on a fold with no positives. With stratified K-fold: each fold has exactly 10 positives, making the evaluation meaningful. Stratified CV also ensures the model sees enough positive examples in every training fold." }
\`\`\`

\`\`\`takeaways
{ "points": ["K-fold CV gives K accuracy estimates — more reliable than a single split; use K=5 or K=10", "Stratified K-fold preserves class ratios in every fold — use for any classification with class imbalance", "Report mean ± std across folds — the std tells you how sensitive accuracy is to which data ends up in each fold", "LOOCV (K=N): maximum training data but expensive and high variance — only for very small datasets"] }
\`\`\``,
    },
    {
      id: "hyperparameter-search",
      slug: "hyperparameter-search",
      title: "Grid Search and Random Search",
      content: `# Grid Search and Random Search

A model's hyperparameters (learning rate, hidden layer size, dropout rate) dramatically affect performance but are not learned during training — they must be chosen externally. **Grid search** and **random search** are the two workhorse approaches to finding good hyperparameters automatically.

\`\`\`concept
{ "title": "Hyperparameters vs Parameters", "variant": "info", "content": "Parameters (weights, biases): learned from data during training by gradient descent. Hyperparameters: set before training — learning rate, batch size, number of layers, dropout rate, regularization strength, number of clusters K. Hyperparameter search runs many training jobs with different configs and picks the one with the best validation score." }
\`\`\`

## Grid Search vs Random Search

\`\`\`compare
{ "title": "Grid Search vs Random Search", "left": { "label": "Grid Search", "points": ["Tries all combinations of a discrete grid", "3 values × 3 values × 3 values = 27 experiments", "Exhaustive — guaranteed to find grid optimum", "Exponential scaling: adding one HP → multiply experiments", "Wastes budget on unimportant HPs (equally spaced)", "Use when few HPs (<3) and small grid"] }, "right": { "label": "Random Search", "points": ["Samples hyperparameters randomly from distributions", "Same budget covers more unique values per HP", "Provably more efficient when some HPs matter more than others", "Stops when budget exhausted", "Easy to add HPs without exponential blowup", "Default choice for most problems"] } }
\`\`\`

\`\`\`playground
{ "title": "Random Search from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef evaluate_model(lr, dropout, hidden_size, X_val, y_val):\\n    # Simulate model performance (in practice: train model, evaluate on val set)\\n    # True optimum around lr=0.01, dropout=0.3, hidden=64\\n    lr_score = 1 - abs(np.log10(lr) - np.log10(0.01))\\n    drop_score = 1 - 2 * abs(dropout - 0.3)\\n    size_score = 1 - abs(np.log2(hidden_size) - np.log2(64)) / 5\\n    base = 0.85 + 0.12 * (lr_score + drop_score + size_score) / 3\\n    return base + np.random.randn() * 0.01\\n\\n# Hyperparameter search space\\nparam_space = {\\n    'lr': ('log_uniform', 1e-4, 1e-1),     # log-uniform between 1e-4 and 0.1\\n    'dropout': ('uniform', 0.0, 0.6),        # uniform between 0 and 0.6\\n    'hidden_size': ('choice', [32, 64, 128, 256])\\n}\\n\\ndef sample_params(space):\\n    params = {}\\n    for name, spec in space.items():\\n        if spec[0] == 'log_uniform':\\n            lo, hi = np.log10(spec[1]), np.log10(spec[2])\\n            params[name] = 10 ** np.random.uniform(lo, hi)\\n        elif spec[0] == 'uniform':\\n            params[name] = np.random.uniform(spec[1], spec[2])\\n        elif spec[0] == 'choice':\\n            params[name] = np.random.choice(spec[1])\\n    return params\\n\\nnp.random.seed(42)\\nbest_score, best_params = 0, None\\nprint(f'{\"Trial\":<6} {\"LR\":<10} {\"Dropout\":<10} {\"Hidden\":<8} {\"Val Acc\"}')\\nprint('-' * 50)\\nfor trial in range(15):\\n    params = sample_params(param_space)\\n    score = evaluate_model(params['lr'], params['dropout'], params['hidden_size'], None, None)\\n    if score > best_score:\\n        best_score = score\\n        best_params = params.copy()\\n    print(f'{trial+1:<6} {params[\"lr\"]:<10.5f} {params[\"dropout\"]:<10.3f} {int(params[\"hidden_size\"]):<8} {score:.4f}')\\n\\nprint(f'\\\\nBest: lr={best_params[\"lr\"]:.5f}, dropout={best_params[\"dropout\"]:.3f}, hidden={int(best_params[\"hidden_size\"])}, score={best_score:.4f}')\\n", "runnable": true }
\`\`\`

## Bayesian Optimization: Smarter Search

Both grid and random search are naive — they don't use the results of previous trials to decide where to search next. **Bayesian optimization** builds a surrogate model of the objective function and proposes the most promising next configuration. Tools: Optuna, Hyperopt, Weights & Biases Sweeps. 3-5× more efficient than random search on expensive models.

\`\`\`tabs
{ "tabs": [ { "label": "Key hyperparameters to tune", "content": "Most impactful (tune first):\\n1. Learning rate (most important — log scale: 1e-4 to 1e-1)\\n2. Batch size (32, 64, 128, 256)\\n3. Number of layers / hidden size\\n4. Dropout rate (0.0 to 0.5)\\n5. Weight decay (1e-5 to 1e-2)\\n\\nLess impactful (tune last):\\n- β₁, β₂ for Adam\\n- Warmup steps\\n- Data augmentation strength" }, { "label": "Practical tips", "content": "- Always tune on a VALIDATION set, not test set. Test set = final evaluation only.\\n- Use log-scale for LR, weight decay: 1e-4 to 1e-1 is uniform in log space.\\n- Run a few quick sanity checks first: can the model overfit a tiny batch? If not, fix the code.\\n- Budget: 20-50 random search trials typically suffice for finding a good config." } ] }
\`\`\`

\`\`\`quiz
{ "question": "You're searching over learning_rate and batch_size. Grid search tries [0.001, 0.01, 0.1] × [32, 64, 128] = 9 experiments. Random search with 9 experiments samples 9 random (lr, batch_size) pairs. If learning_rate is much more important than batch_size, which method covers more learning_rate values?", "options": ["Grid search — it exhaustively covers all 3 values of each hyperparameter", "Random search — with 9 experiments it samples ~9 different learning rates (vs 3 for grid search, since each lr is tried with 3 batch sizes)", "They are equivalent — both try 9 configurations", "Grid search wins because it guarantees coverage of all combinations"], "answer": 1, "explanation": "In grid search, each learning_rate value is tried 3 times (once per batch_size value) — effectively 3 unique LR values. In random search, all 9 experiments can have different LR values — 9 unique LR values explored. If LR is the critical HP, random search explores 3× more of the LR axis. This is the core insight from Bergstra & Bengio (2012): random search dominates when some HPs are more important than others." }
\`\`\`

\`\`\`takeaways
{ "points": ["Hyperparameters are set before training and must be found by search, not gradient descent", "Random search dominates grid search when some hyperparameters matter more than others — covers more unique values per HP", "Always tune on a validation set and report final performance on a held-out test set — never tune on test data", "Bayesian optimization (Optuna, Hyperopt) is 3-5× more efficient than random search for expensive experiments"] }
\`\`\``,
    },
    {
      id: "model-calibration",
      slug: "model-calibration",
      title: "Probability Calibration and Reliability Diagrams",
      content: `# Probability Calibration and Reliability Diagrams

A model that outputs P(positive) = 0.9 should be correct 90% of the time on such examples. If it's only correct 60% of the time, the model is **overconfident** and poorly calibrated. In risk-sensitive applications (medical diagnosis, credit risk, fraud detection), calibration matters as much as accuracy.

\`\`\`concept
{ "title": "The Calibration Question", "variant": "info", "content": "Calibration asks: 'Across all examples where I predicted 70% probability, were approximately 70% actually positive?' Perfect calibration means predicted probability = empirical frequency at every threshold. Poorly calibrated models can be accurate but useless for decision-making because their probabilities can't be trusted as actual likelihoods." }
\`\`\`

## Reliability Diagram (Calibration Curve)

\`\`\`playground
{ "title": "Calibration Curve from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef calibration_curve(y_true, y_prob, n_bins=10):\\n    bin_edges = np.linspace(0, 1, n_bins + 1)\\n    bin_means_pred = []\\n    bin_means_true = []\\n    bin_counts = []\\n    for i in range(n_bins):\\n        lo, hi = bin_edges[i], bin_edges[i+1]\\n        mask = (y_prob >= lo) & (y_prob < hi)\\n        if mask.sum() > 0:\\n            bin_means_pred.append(y_prob[mask].mean())\\n            bin_means_true.append(y_true[mask].mean())\\n            bin_counts.append(mask.sum())\\n    return np.array(bin_means_pred), np.array(bin_means_true), np.array(bin_counts)\\n\\nnp.random.seed(42)\\nN = 1000\\ny_true = (np.random.rand(N) > 0.5).astype(int)\\n# Overconfident model: probabilities too extreme\\ny_prob_overconf = np.clip(0.5 + 2 * (np.random.rand(N) - 0.5) * (y_true * 0.8 + 0.1), 0.01, 0.99)\\n# Well-calibrated model\\ny_prob_good = np.clip(y_true * 0.7 + np.random.randn(N) * 0.15 + 0.15, 0.01, 0.99)\\n\\nprint('=== Overconfident Model ===')\\npred, true, counts = calibration_curve(y_true, y_prob_overconf)\\nprint(f'{\"Pred prob\":<12} {\"Actual freq\":<13} {\"N samples\":<10} {\"Gap\"}')\\nfor p, t, c in zip(pred, true, counts):\\n    gap = '*' * int(abs(p-t)*20)\\n    print(f'{p:<12.2f} {t:<13.2f} {c:<10} {gap}')\\n\\nprint('\\\\n=== Well-Calibrated Model ===')\\npred, true, counts = calibration_curve(y_true, y_prob_good)\\nfor p, t, c in zip(pred, true, counts):\\n    gap = '*' * int(abs(p-t)*20)\\n    print(f'{p:<12.2f} {t:<13.2f} {c:<10} {gap}')\\n", "runnable": true }
\`\`\`

## Calibration Methods

\`\`\`tabs
{ "tabs": [ { "label": "Platt Scaling", "content": "Train a logistic regression on top of the model's raw scores (logits) using a calibration set.\\nz = model_logit(x)\\np_calibrated = sigmoid(a * z + b)   # learn a, b on calibration set\\n\\nFast, simple, works well for SVMs and small neural networks.\\nAssumes sigmoid is the right shape — fails if miscalibration is more complex." }, { "label": "Isotonic Regression", "content": "Nonparametric: fit a piecewise constant monotone function mapping predicted → actual probabilities.\\nMore flexible than Platt scaling, but needs more calibration data (~1000+ samples).\\nRisk of overfitting with small calibration sets." }, { "label": "Temperature Scaling", "content": "For neural networks: divide logits by a single learned scalar T before softmax.\\np = softmax(logits / T)\\n\\nT > 1: softer predictions (reduces overconfidence)\\nT < 1: harder predictions (increases confidence)\\nSingle parameter, no distribution shift. Standard approach for deep learning." } ] }
\`\`\`

\`\`\`quiz
{ "question": "A fraud detection model outputs P(fraud)=0.95 for 100 transactions. Only 60 are actually fraud. The model is:", "options": ["Well-calibrated — 0.95 is close to 1.0 and 60% is close to 100%", "Overconfident — it claims 95% probability but the actual positive rate is only 60%", "Underconfident — it should output a higher probability given that 60% are fraud", "Uncalibrated only if it was trained with cross-entropy loss"], "answer": 1, "explanation": "Perfect calibration: for all examples where P(fraud)=0.95, approximately 95% should be fraud. Here, only 60% are fraud — the model is overconfident. It claims near-certainty (0.95) but is only correct 60% of the time. This matters in practice: a risk manager who trusts these probabilities will be surprised by 40% false positives. Temperature scaling (T > 1) would soften the predictions toward 0.60." }
\`\`\`

\`\`\`takeaways
{ "points": ["Calibration: P(positive | model outputs p) should equal p. Plot reliability diagram to diagnose.", "Reliability diagram: divide predictions into bins, compare mean predicted probability vs mean actual frequency", "Temperature scaling: divide logits by scalar T before softmax. T>1 softens predictions. Standard for deep learning.", "ECE (Expected Calibration Error): weighted average of |pred - actual| across bins — single number for calibration quality"] }
\`\`\``,
    },
    {
      id: "model-serialization",
      slug: "model-serialization",
      title: "Serializing and Loading Models with NumPy",
      content: `# Serializing and Loading Models with NumPy

Training a neural network takes minutes to hours. Without serialization, you'd retrain from scratch every time the program restarts. **Serialization** saves trained weights to disk so they can be loaded instantly for inference or further training.

\`\`\`concept
{ "title": "What Needs to Be Saved?", "variant": "info", "content": "A trained model is fully described by: (1) Architecture — layer types, sizes, activation functions. (2) Weights — the learned parameter values. (3) Preprocessing config — the scaler/tokenizer fit during training, needed to transform test data the same way. Missing any one of these makes the saved model unusable." }
\`\`\`

## Serialization Options

\`\`\`tabs
{ "tabs": [ { "label": "np.save / np.load", "content": "For NumPy-only models: save weights as .npy files.\\nnp.save('w1.npy', W1)\\nnp.save('b1.npy', b1)\\nW1_loaded = np.load('w1.npy')\\n\\nAdvantage: simple, no dependencies.\\nDisadvantage: must save each array separately; no architecture info." }, { "label": "pickle", "content": "Serialize any Python object including full model class instances.\\nimport pickle\\nwith open('model.pkl', 'wb') as f:\\n    pickle.dump(model, f)\\n\\nAdvantage: saves everything in one file.\\nDisadvantage: Python-version dependent; insecure from untrusted sources; can't load in different languages." }, { "label": "PyTorch / TF native", "content": "PyTorch: torch.save(model.state_dict(), 'model.pth')\\nmodel.load_state_dict(torch.load('model.pth'))\\n\\nTensorFlow: model.save('model.keras')\\nmodel = tf.keras.models.load_model('model.keras')\\n\\nBest practice: save state_dict (weights only), not full model — more robust to code changes." } ] }
\`\`\`

\`\`\`playground
{ "title": "Save and Load a Trained Model", "language": "python", "code": "import numpy as np\\nimport pickle\\n\\nclass LogisticModel:\\n    def __init__(self, n_features):\\n        self.W = np.zeros(n_features)\\n        self.b = 0.0\\n        self.scaler_mean = None\\n        self.scaler_std = None\\n\\n    def fit(self, X, y, lr=0.1, epochs=100):\\n        # Fit scaler (MUST be done on training data only)\\n        self.scaler_mean = X.mean(axis=0)\\n        self.scaler_std = X.std(axis=0) + 1e-8\\n        X_scaled = (X - self.scaler_mean) / self.scaler_std\\n        for _ in range(epochs):\\n            z = X_scaled @ self.W + self.b\\n            pred = 1 / (1 + np.exp(-z))\\n            self.W -= lr * X_scaled.T @ (pred - y) / len(y)\\n            self.b -= lr * (pred - y).mean()\\n\\n    def predict_proba(self, X):\\n        X_scaled = (X - self.scaler_mean) / self.scaler_std\\n        z = X_scaled @ self.W + self.b\\n        return 1 / (1 + np.exp(-z))\\n\\n    def save(self, path):\\n        state = {\\n            'W': self.W,\\n            'b': self.b,\\n            'scaler_mean': self.scaler_mean,\\n            'scaler_std': self.scaler_std,\\n        }\\n        np.savez(path, **state)\\n        print(f'Model saved to {path}.npz')\\n\\n    @classmethod\\n    def load(cls, path):\\n        data = np.load(path + '.npz')\\n        model = cls(n_features=len(data['W']))\\n        model.W = data['W']\\n        model.b = float(data['b'])\\n        model.scaler_mean = data['scaler_mean']\\n        model.scaler_std = data['scaler_std']\\n        print(f'Model loaded from {path}.npz')\\n        return model\\n\\n# Train\\nnp.random.seed(42)\\nX = np.random.randn(100, 4) * [1, 10, 0.1, 100]  # different scales\\ny = (X @ [1, -0.5, 2, 0.01] + np.random.randn(100)*0.5 > 0).astype(int)\\n\\nmodel = LogisticModel(n_features=4)\\nmodel.fit(X, y)\\noriginal_pred = model.predict_proba(X[:3])\\nprint('Original predictions:', original_pred.round(4))\\n\\n# Save and reload\\nmodel.save('/tmp/my_model')\\nloaded = LogisticModel.load('/tmp/my_model')\\nloaded_pred = loaded.predict_proba(X[:3])\\nprint('Loaded predictions: ', loaded_pred.round(4))\\nprint('Match:', np.allclose(original_pred, loaded_pred))\\n", "runnable": true }
\`\`\`

\`\`\`quiz
{ "question": "You train a model on training data with StandardScaler (mean=10, std=5). At inference time, you forget to apply the scaler to test data. What happens?", "options": ["Nothing — neural networks are scale-invariant", "The model sees test features with mean=10 instead of mean=0 — the weights were trained for scaled input, leading to incorrect predictions", "The model retrains itself to adapt to the unscaled input", "Only the first layer is affected — subsequent layers normalize the input"], "answer": 1, "explanation": "The model's weights were learned assuming inputs are standardized (mean=0, std=1). If test features have mean=10, the dot product W·x is 10× larger than during training — the model outputs completely wrong logits. This is a common production bug: always save the scaler alongside the model, and always apply the same preprocessing at inference time as at training time." }
\`\`\`

\`\`\`takeaways
{ "points": ["Save weights AND preprocessing config (scaler, tokenizer) — inference requires both", "np.savez saves multiple arrays to one file; pickle saves entire Python objects", "PyTorch best practice: save state_dict (weights only), reload into a fresh model instance", "Test your saved model: save → load → compare predictions on a few examples — catches serialization bugs immediately"] }
\`\`\``,
    },
    {
      id: "inference-pipeline",
      slug: "inference-pipeline",
      title: "Building a Reproducible Inference Pipeline",
      content: `# Building a Reproducible Inference Pipeline

A model trained in a Jupyter notebook rarely goes to production as-is. The inference pipeline must handle: raw input → same preprocessing as training → model forward pass → postprocessing → output. Any break in this chain produces silent errors that are hard to debug.

\`\`\`concept
{ "title": "Train-Serve Skew", "variant": "info", "content": "Train-serve skew: the preprocessing applied at training time differs from what's applied at serving time. Example: you train with log(1+x) for the 'amount' feature, but the serving code uses x directly. The model was never trained on raw amounts — outputs are wrong. This is one of the most common production ML bugs. The solution: bundle preprocessing and model into one artifact." }
\`\`\`

## The Pipeline Pattern

\`\`\`playground
{ "title": "Reproducible Inference Pipeline", "language": "python", "code": "import numpy as np\\n\\nclass Pipeline:\\n    def __init__(self, steps):\\n        '''steps: list of (name, transform_object) tuples'''\\n        self.steps = steps\\n\\n    def fit(self, X, y=None):\\n        X_t = X.copy()\\n        for name, step in self.steps[:-1]:  # all except last are transforms\\n            if hasattr(step, 'fit'):\\n                step.fit(X_t, y)\\n            X_t = step.transform(X_t)\\n        # Fit the final estimator\\n        name, estimator = self.steps[-1]\\n        estimator.fit(X_t, y)\\n        return self\\n\\n    def predict(self, X):\\n        X_t = X.copy()\\n        for name, step in self.steps[:-1]:\\n            X_t = step.transform(X_t)\\n        return self.steps[-1][1].predict(X_t)\\n\\n# --- Components ---\\nclass StandardScaler:\\n    def fit(self, X, y=None):\\n        self.mean_ = X.mean(axis=0)\\n        self.std_ = X.std(axis=0) + 1e-8\\n    def transform(self, X):\\n        return (X - self.mean_) / self.std_\\n\\nclass LogisticRegression:\\n    def fit(self, X, y, lr=0.1, epochs=100):\\n        self.W = np.zeros(X.shape[1])\\n        self.b = 0.0\\n        for _ in range(epochs):\\n            z = X @ self.W + self.b\\n            p = 1 / (1 + np.exp(-z))\\n            self.W -= lr * X.T @ (p - y) / len(y)\\n            self.b -= lr * (p - y).mean()\\n    def predict(self, X):\\n        z = X @ self.W + self.b\\n        return (1 / (1 + np.exp(-z)) > 0.5).astype(int)\\n\\n# Build and use pipeline\\nnp.random.seed(42)\\nX_train = np.random.randn(200, 3) * [1, 10, 100]\\ny_train = (X_train @ [1, 0.1, 0.01] > 0).astype(int)\\nX_test = np.random.randn(50, 3) * [1, 10, 100]\\ny_test = (X_test @ [1, 0.1, 0.01] > 0).astype(int)\\n\\npipe = Pipeline([\\n    ('scaler', StandardScaler()),\\n    ('model', LogisticRegression()),\\n])\\n\\npipe.fit(X_train, y_train)\\npreds = pipe.predict(X_test)\\nacc = (preds == y_test).mean()\\nprint(f'Pipeline test accuracy: {acc:.3f}')\\nprint('Scaler mean:', pipe.steps[0][1].mean_.round(2))\\nprint('Preprocessing and prediction are bundled — no skew possible')\\n", "runnable": true }
\`\`\`

## Latency Benchmarking

\`\`\`playground
{ "title": "Inference Latency Profiling", "language": "python", "code": "import numpy as np\\nimport time\\n\\n# Profile single-sample vs batch inference\\nclass MockModel:\\n    def __init__(self, n_features=100, n_layers=5, n_units=256):\\n        self.layers = [np.random.randn(n_units, n_features if i==0 else n_units) * 0.01\\n                       for i in range(n_layers)]\\n\\n    def predict(self, X):\\n        h = X\\n        for W in self.layers:\\n            h = np.maximum(0, h @ W.T)  # ReLU\\n        return h.sum(axis=-1)\\n\\nmodel = MockModel()\\n\\nfor batch_size in [1, 10, 100, 1000]:\\n    X = np.random.randn(batch_size, 100)\\n    n_runs = max(10, 1000 // batch_size)\\n    start = time.perf_counter()\\n    for _ in range(n_runs):\\n        model.predict(X)\\n    elapsed = (time.perf_counter() - start) / n_runs * 1000\\n    per_sample = elapsed / batch_size\\n    print(f'Batch size {batch_size:5d}: total={elapsed:.2f}ms, per-sample={per_sample:.3f}ms')\\n\\nprint('\\\\nBatching amortizes overhead — batch of 100 much cheaper per sample than 100 individual requests')\\n", "runnable": true }
\`\`\`

\`\`\`quiz
{ "question": "Your model processes features [age, income, log_income]. At training time you compute log_income = log(income+1). At serving time the feature engineering code uses log_income = log(income). For income=0 (some users have no income), what happens?", "options": ["The model handles it gracefully — log transformations are always valid", "log(0) = -infinity — the feature becomes NaN or -inf, causing the model to output garbage predictions for those users", "The model clips the value to 0 automatically", "The difference between log(0+1)=0 and log(0)=-inf only affects the gradient, not predictions"], "answer": 1, "explanation": "log(0) is undefined (mathematically -infinity). In practice, numpy returns -inf and subsequent computations propagate NaN. The model was trained on log(income+1), which is well-defined at income=0 (gives 0). This is a train-serve skew bug: a small difference in preprocessing produces undefined values for edge cases. The fix: bundle the exact preprocessing logic into the inference pipeline and test with boundary inputs." }
\`\`\`

\`\`\`takeaways
{ "points": ["Bundle preprocessing and model into one Pipeline object — eliminates train-serve skew by construction", "Test the saved pipeline end-to-end on edge cases (zeros, nulls, extreme values) before deployment", "Batch inference is much more efficient per sample than individual calls — always batch when possible", "Log latency at p50 and p99 — average latency hides tail latency spikes that affect user experience"] }
\`\`\``,
    },
    {
      id: "ml-system-design-intro",
      slug: "ml-system-design-intro",
      title: "ML System Design Primer: From Notebook to Production",
      content: `# ML System Design Primer: From Notebook to Production

A Jupyter notebook prototype is not a production ML system. Bridging the gap requires addressing: data pipelines, model monitoring, retraining triggers, feature stores, and A/B testing infrastructure. This lesson maps the gap and gives you the vocabulary to reason about it.

\`\`\`concept
{ "title": "The ML System is 90% Not the Model", "variant": "info", "content": "Google's seminal paper 'Hidden Technical Debt in Machine Learning Systems' (2015) observed that the actual ML code is a tiny fraction of a production ML system. Surrounding it: data ingestion, validation, feature extraction, serving infrastructure, monitoring, retraining pipelines, and evaluation frameworks. The model is easy; the system is hard." }
\`\`\`

## The ML Development Lifecycle

\`\`\`steps
{ "steps": [ { "title": "Data pipeline", "description": "Raw data → cleaned, validated, feature-engineered training data. Must be reproducible: same pipeline run again produces same output. Tools: Apache Beam, dbt, Spark." }, { "title": "Training pipeline", "description": "Parameterized training job: reads data, trains model, logs metrics, saves artifact. Should run identically in dev and prod. Tools: MLflow, Weights & Biases, Kubeflow." }, { "title": "Model registry", "description": "Versioned store of trained model artifacts with metadata: training data version, hyperparameters, evaluation metrics. Enables rollback to any previous version." }, { "title": "Serving infrastructure", "description": "REST API or gRPC service wrapping the model. Handles input validation, preprocessing, batching, and output formatting. Tools: TorchServe, TF Serving, FastAPI + model pickle." }, { "title": "Monitoring and retraining", "description": "Track: (1) data drift — input distribution changing. (2) concept drift — P(y|x) changing (labels changing). (3) model performance — accuracy/AUC falling on live data. Trigger retraining when drift detected." } ] }
\`\`\`

## Data Drift vs Concept Drift

\`\`\`compare
{ "title": "Types of Drift", "left": { "label": "Data Drift (covariate shift)", "points": ["Input feature distribution P(X) changes", "Example: users skew younger over time", "Model may still be valid — just extrapolating", "Detect: monitor feature statistics over time", "Fix: retrain on recent data or adjust weights"] }, "right": { "label": "Concept Drift", "points": ["The relationship P(Y|X) changes", "Example: 'good credit' criteria change post-recession", "Model fundamentally wrong — labels shift", "Harder to detect: requires labeled recent data", "Fix: collect new labels, retrain. No shortcut."] } }
\`\`\`

## A/B Testing ML Models

\`\`\`concept
{ "title": "Shadow Mode vs Live A/B", "variant": "info", "content": "Shadow mode: new model runs in parallel, predictions logged but not served. Compare offline. Risk: zero. Cost: compute. Use to validate correctness before serving. Live A/B: traffic split between model A and B. Measure business metrics (CTR, revenue, conversion) on live traffic. Requires statistical testing to detect real differences. Standard for production rollouts." }
\`\`\`

\`\`\`playground
{ "title": "Statistical Significance in A/B Tests", "language": "python", "code": "import numpy as np\\nfrom scipy import stats\\n\\ndef ab_test(n_a, conversions_a, n_b, conversions_b, alpha=0.05):\\n    p_a = conversions_a / n_a\\n    p_b = conversions_b / n_b\\n    # Two-proportion z-test\\n    p_pool = (conversions_a + conversions_b) / (n_a + n_b)\\n    se = np.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))\\n    z = (p_b - p_a) / (se + 1e-12)\\n    p_value = 2 * (1 - stats.norm.cdf(abs(z)))\\n    significant = p_value < alpha\\n    lift = (p_b - p_a) / p_a * 100\\n    print(f'Model A: {p_a:.4f} ({conversions_a}/{n_a})')\\n    print(f'Model B: {p_b:.4f} ({conversions_b}/{n_b})')\\n    print(f'Lift: {lift:+.2f}%')\\n    print(f'p-value: {p_value:.4f}')\\n    print(f'Significant at alpha={alpha}: {significant}')\\n    return p_value\\n\\n# Scenario: new model improves CTR from 3.5% to 3.8%\\nprint('=== Large sample (n=10000 each) ===')\\nab_test(10000, 350, 10000, 380)\\nprint()\\nprint('=== Small sample (n=500 each) ===')\\nab_test(500, 17, 500, 19)\\n", "runnable": true }
\`\`\`

\`\`\`quiz
{ "question": "Your fraud detection model's precision drops from 92% to 81% over 3 months with no code changes. Feature distributions look stable. What is the most likely cause?", "options": ["Data drift — input features have shifted", "Concept drift — fraudsters changed their behavior, making old patterns less predictive", "Model serialization corruption over time", "The validation set was too small, causing unreliable baseline measurement"], "answer": 1, "explanation": "Stable feature distributions (no data drift) but degrading performance strongly indicates concept drift: P(Y|X) has changed. Fraudsters adapt their behavior to evade detection — they learn which patterns get flagged and evolve new ones. The model was trained on old fraud patterns that no longer dominate. Fix: continuously collect new labeled fraud examples and retrain. Feature drift would show up in distribution monitoring; serialization corruption would be sudden, not gradual." }
\`\`\`

\`\`\`takeaways
{ "points": ["Production ML is 90% infrastructure: data pipelines, monitoring, serving, retraining — not the model", "Data drift: P(X) changes. Concept drift: P(Y|X) changes — harder to detect, requires new labels to fix", "Monitor both feature statistics (drift detection) and model metrics (performance degradation) in production", "A/B testing: shadow mode first (zero risk), then live split with statistical significance testing"] }
\`\`\``,
    },
    {
      id: "capstone-checkpoint",
      slug: "capstone-checkpoint",
      title: "Capstone: End-to-End ML Project",
      content: `# Capstone: End-to-End ML Project

\`\`\`callout
{ "variant": "info", "title": "Course Capstone", "content": "This capstone consolidates all 11 modules: data preprocessing, linear/logistic regression, neural networks, optimization, CNNs, NLP, unsupervised learning, and evaluation. Build a complete ML pipeline, evaluate it rigorously, and produce a model card." }
\`\`\`

## Capstone Task: Income Prediction (Census Data)

Predict whether a person's income exceeds $50K/year from census features: age, education, occupation, hours-per-week, marital status, etc. Binary classification with mixed numeric/categorical features.

## Phase 1: Data Preprocessing

\`\`\`playground
{ "title": "Complete Preprocessing Pipeline", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\nN = 500\\n\\n# Simulate census-style dataset\\nage        = np.random.randint(18, 90, N).astype(float)\\neduc_years = np.random.randint(8, 20, N).astype(float)\\nhours_pw   = np.random.randint(20, 80, N).astype(float)\\n# Binary-encoded categoricals (in practice: one-hot encode)\\nmarried    = (np.random.rand(N) > 0.5).astype(float)\\nprof_job   = (np.random.rand(N) > 0.6).astype(float)\\n\\n# True relationship\\nlogit = (0.04*age + 0.15*educ_years + 0.02*hours_pw + 0.8*married + 1.2*prof_job - 7)\\ny = (logit + np.random.randn(N)*1.5 > 0).astype(int)\\nprint(f'Label distribution: {y.mean():.1%} positive (>$50K)')\\n\\nX = np.column_stack([age, educ_years, hours_pw, married, prof_job])\\n\\n# Train/val/test split (60/20/20)\\nidx = np.random.permutation(N)\\ntrain_end = int(0.6 * N)\\nval_end   = int(0.8 * N)\\nX_train, y_train = X[idx[:train_end]], y[idx[:train_end]]\\nX_val,   y_val   = X[idx[train_end:val_end]], y[idx[train_end:val_end]]\\nX_test,  y_test  = X[idx[val_end:]], y[idx[val_end:]]\\n\\n# Standardize using TRAINING stats only\\nmean = X_train.mean(axis=0)\\nstd  = X_train.std(axis=0) + 1e-8\\nX_train_s = (X_train - mean) / std\\nX_val_s   = (X_val   - mean) / std\\nX_test_s  = (X_test  - mean) / std\\n\\nprint(f'Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}')\\nprint('Preprocessing complete — scaler fit on train only')\\n", "runnable": true }
\`\`\`

## Phase 2: Model Comparison

\`\`\`playground
{ "title": "Compare Multiple Models with CV", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\nN = 500\\nage        = np.random.randint(18, 90, N).astype(float)\\neduc_years = np.random.randint(8, 20, N).astype(float)\\nhours_pw   = np.random.randint(20, 80, N).astype(float)\\nmarried    = (np.random.rand(N) > 0.5).astype(float)\\nprof_job   = (np.random.rand(N) > 0.6).astype(float)\\nlogit = 0.04*age + 0.15*educ_years + 0.02*hours_pw + 0.8*married + 1.2*prof_job - 7\\ny = (logit + np.random.randn(N)*1.5 > 0).astype(int)\\nX = np.column_stack([age, educ_years, hours_pw, married, prof_job])\\nmean, std = X.mean(axis=0), X.std(axis=0) + 1e-8\\nX_s = (X - mean) / std\\n\\ndef sigmoid(z): return 1 / (1 + np.exp(-np.clip(z, -20, 20)))\\n\\ndef logistic_cv(X, y, k=5, lr=0.1, epochs=200):\\n    n = len(X)\\n    idx = np.random.permutation(n)\\n    scores = []\\n    for fold in range(k):\\n        val_mask = np.zeros(n, dtype=bool)\\n        val_mask[idx[fold*n//k:(fold+1)*n//k]] = True\\n        Xtr, ytr = X[~val_mask], y[~val_mask]\\n        Xv,  yv  = X[val_mask],  y[val_mask]\\n        W, b = np.zeros(X.shape[1]), 0.0\\n        for _ in range(epochs):\\n            p = sigmoid(Xtr @ W + b)\\n            W -= lr * Xtr.T @ (p - ytr) / len(ytr)\\n            b -= lr * (p - ytr).mean()\\n        preds = (sigmoid(Xv @ W + b) > 0.5).astype(int)\\n        scores.append((preds == yv).mean())\\n    return np.mean(scores), np.std(scores)\\n\\nresults = []\\nfor lr in [0.01, 0.05, 0.1, 0.5]:\\n    mean_acc, std_acc = logistic_cv(X_s, y, lr=lr)\\n    results.append((lr, mean_acc, std_acc))\\n    print(f'LR={lr:<6} CV accuracy: {mean_acc:.3f} ± {std_acc:.3f}')\\n\\nbest = max(results, key=lambda r: r[1])\\nprint(f'\\\\nBest LR={best[0]}, CV accuracy={best[1]:.3f}')\\n", "runnable": true }
\`\`\`

## Phase 3: Model Card

\`\`\`concept
{ "title": "The Model Card", "variant": "info", "content": "A model card documents: (1) Intended use — what the model is for, what it is NOT for. (2) Training data — source, size, date range, known biases. (3) Evaluation metrics — overall and by subgroup (fairness). (4) Limitations — failure modes, edge cases. (5) Ethical considerations — potential for bias or harm. Model cards (Gebru et al., 2018) are now standard in responsible ML." }
\`\`\`

## Final Quiz Battery

\`\`\`quiz
{ "question": "Your capstone model achieves 88% accuracy overall but 92% accuracy on the majority class and 61% on the minority class. What metric better captures this disparity?", "options": ["F1 score — the harmonic mean of precision and recall, weighted by class frequency", "Balanced accuracy = (sensitivity + specificity) / 2 — gives equal weight to both classes regardless of class frequency", "AUC-ROC — area under the receiver operating characteristic curve", "All three of B and C are better than accuracy for imbalanced evaluation"], "answer": 3, "explanation": "Accuracy is misleading with imbalanced classes. Balanced accuracy averages recall per class — 61% and 92% average to 76.5%, much lower than 88% accuracy. F1-score (macro) similarly accounts for class imbalance. AUC-ROC measures discrimination ability across all thresholds. All three are more informative than accuracy for imbalanced problems." }
\`\`\`

\`\`\`quiz
{ "question": "You find a hyperparameter config that achieves 91% on the validation set after 50 random search trials. You then evaluate on the test set and get 85%. Why?", "options": ["The test set is harder than the validation set", "Optimization over the validation set caused overfitting to that split — the 91% is optimistic", "50 trials is too few — more trials would have prevented this", "The model was not regularized enough"], "answer": 1, "explanation": "When you run 50 hyperparameter trials and pick the best by validation score, you're implicitly overfitting to the validation set — the best config may have benefited from validation set luck. This is called 'hyperparameter overfitting'. The test set gives an unbiased estimate. Mitigations: nested cross-validation, or a separate hyperparameter search set (train/hparam-val/test split)." }
\`\`\`

\`\`\`quiz
{ "question": "Your preprocessed features include the target variable (income) leaking through a correlated proxy. What is the expected symptom?", "options": ["Training loss fails to decrease", "Unusually high validation accuracy during development, followed by catastrophic performance drop in production", "The model fails to converge", "The model outputs only the majority class"], "answer": 1, "explanation": "Data leakage: a feature correlated with the target through non-causal paths (e.g., tax bracket derived from income) makes the training and validation artificially easy. CV and validation look amazing. In production, the leaked feature is unavailable at prediction time (you don't know income before predicting it), so accuracy collapses. Always check: could this feature be computed before or independently of the target?" }
\`\`\`

\`\`\`takeaways
{ "points": ["Always split data BEFORE any fitting — scaler, PCA, tokenizer must be fit on training data only, then applied to val/test", "Model comparison via CV: train multiple models/configs, pick winner by val score, final report on untouched test set", "Model card: document intended use, training data, per-group metrics, limitations, and ethical considerations", "Data leakage produces unrealistically high development metrics that collapse in production — the single most dangerous bug in ML"] }
\`\`\``,
    },
  ],
};
