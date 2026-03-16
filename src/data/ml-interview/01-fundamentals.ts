import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "ml-fundamentals",
  title: "ML Fundamentals",
  description:
    "Core machine learning concepts every interview candidate must know — learning paradigms, bias-variance tradeoff, evaluation metrics, and model selection.",
  lessons: [
    {
      id: "ml-fund-1",
      slug: "ml-interview-intro",
      title: "ML Interview Intro",
      content: `# Machine Learning Interview Introduction

## New to Machine Learning? Start Here!

### What is Machine Learning?

**Machine learning (ML)** is a way to teach computers to learn from examples instead of being explicitly programmed with rules. Rather than writing "if the email contains the word 'lottery', mark it as spam," you show the computer thousands of emails labeled "spam" or "not spam," and it figures out the patterns on its own.

You already interact with machine learning every day, even if you do not realize it:

- **Netflix recommendations**: ML looks at what you have watched and what similar users enjoyed, then suggests shows you might like.
- **Email spam filters**: ML learns which emails are junk by studying patterns in millions of spam messages -- suspicious links, certain phrases, unknown senders.
- **Voice assistants (Siri, Alexa)**: ML converts your spoken words into text and figures out what you are asking.
- **Autocorrect on your phone**: ML predicts what word you meant to type based on context and your typing habits.
- **Social media feeds**: ML decides which posts to show you based on what you have liked, shared, and spent time reading.

In all these cases, nobody wrote step-by-step rules. Instead, the computer was given lots of examples and learned the patterns itself.

### Key Terms You Will See in This Course

Before diving in, here are the essential terms explained in plain language:

- **Features**: The input information the model uses to make predictions. For a house price predictor, features might be square footage, number of bedrooms, and zip code. Think of features as the "columns" in a spreadsheet of data.
- **Labels**: The answer the model is trying to predict. For the house price example, the label is the actual sale price. Labels are only available in the training data -- the whole point of ML is to predict labels for new, unseen data.
- **Training**: The process of showing the model many examples (features + labels) so it can learn the patterns. Like studying flashcards before a test.
- **Model**: The end result of training -- a mathematical function that takes in features and outputs a prediction. You can think of it as a "prediction machine" that was built by studying the training data.
- **Dataset**: A collection of examples used for training and testing. Often stored as a table where each row is one example and each column is a feature (plus one column for the label).
- **Classification**: A type of ML problem where the model predicts a category. Example: "Is this email spam or not spam?" or "Is this image a cat, dog, or bird?"
- **Regression**: A type of ML problem where the model predicts a number. Example: "What will this house sell for?" or "What will tomorrow's temperature be?"
- **Pipeline**: A sequence of steps that processes data from raw input to final prediction. Like an assembly line in a factory.

### Libraries Used in This Course

The coding exercises use two popular Python libraries:

- **pandas**: A library for working with data in table form (like spreadsheets). It lets you load, filter, and summarize data with a few lines of code.
- **scikit-learn (sklearn)**: The most popular ML library for Python. It provides ready-made implementations of common ML algorithms so you do not have to code them from scratch.

You do not need to be an expert in these libraries to follow along -- the exercises will guide you step by step.

---

## What ML Interviews Test

Machine learning interviews evaluate your ability to think through problems systematically. Companies assess candidates across several dimensions:

**Core Knowledge Areas:**
- Statistical foundations and probability
- Algorithm selection and tradeoffs
- Feature engineering intuition
- System design for ML at scale
- Coding ability with ML libraries

## The Interview Format

Most ML interviews follow a predictable structure:

### 1. Coding Round
You will implement algorithms from scratch or use sklearn/pandas to solve data problems. Expect questions like "implement gradient descent" or "build a classification pipeline."

### 2. ML Fundamentals
Theory questions on bias-variance, regularization, loss functions, and optimization. Interviewers want to see that you understand *why* algorithms work, not just how to call them.

### 3. ML System Design
Open-ended problems like "Design a recommendation system for YouTube" or "Build a fraud detection pipeline." These test your ability to translate business problems into ML solutions.

### 4. Applied ML / Case Study
Given a dataset or business scenario, walk through your approach end-to-end: problem formulation, data collection, feature engineering, model selection, evaluation, and deployment.

## How to Approach ML Questions

Follow this framework for any ML interview question:

\`\`\`
1. Clarify the problem — What are we optimizing? What data is available?
2. Frame as ML task — Classification? Regression? Ranking?
3. Choose metrics — What defines success?
4. Propose approach — Start simple, then iterate
5. Discuss tradeoffs — Why this approach over alternatives?
\`\`\`

## Key Mindset Shifts

**Think in tradeoffs.** There is no universally best algorithm. Every choice involves tradeoffs between complexity, interpretability, training cost, and performance.

**Start simple.** Always propose a baseline first. A logistic regression baseline (a simple algorithm that draws a straight line to separate categories) that you understand beats a neural network you cannot explain.

**Connect to business impact.** Interviewers want to see that you can translate model metrics into business outcomes. A 2% improvement in AUC (a measure of how well a model ranks its predictions -- more on this in a later lesson) might mean millions in revenue — or it might be noise.

## Exercise

Write a function that loads a dataset and prints basic statistics that would help you understand the ML problem at hand.

### Recommended Resources

If you are new to machine learning, these are excellent places to start:

- [StatQuest with Josh Starmer (YouTube)](https://www.youtube.com/c/joshstarmer) -- The best beginner-friendly channel for understanding ML and statistics concepts. Clear visuals and zero jargon.
- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) -- A free, practical introduction to ML from Google, with interactive exercises.
- [TensorFlow Playground](https://playground.tensorflow.org/) -- An interactive visualization where you can build and train a neural network in your browser. No coding required.
- [Kaggle Learn: Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning) -- Free hands-on micro-course with real datasets and guided exercises.
- [3Blue1Brown: Neural Networks (YouTube)](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi) -- Beautiful visual explanations of how neural networks learn.`,
      starterCode: `import pandas as pd
from sklearn.datasets import load_iris

def explore_dataset():
    """Load the iris dataset and print key statistics
    for understanding the ML problem."""
    # TODO: Load the dataset into a DataFrame
    # TODO: Print shape, dtypes, describe(), and class distribution
    pass

explore_dataset()`,
      solutionCode: `import pandas as pd
from sklearn.datasets import load_iris

def explore_dataset():
    """Load the iris dataset and print key statistics
    for understanding the ML problem."""
    data = load_iris()
    df = pd.DataFrame(data.data, columns=data.feature_names)
    df['target'] = data.target

    print(f"Shape: {df.shape}")
    print(f"\\nData Types:\\n{df.dtypes}")
    print(f"\\nStatistics:\\n{df.describe()}")
    print(f"\\nClass Distribution:\\n{df['target'].value_counts()}")
    print(f"\\nMissing Values:\\n{df.isnull().sum()}")

explore_dataset()`,
    },
    {
      id: "ml-fund-2",
      slug: "learning-paradigms",
      title: "Supervised, Unsupervised & RL",
      content: `# Learning Paradigms: Supervised, Unsupervised & Reinforcement Learning

## The Three Pillars of ML

Every ML algorithm falls into one of three categories based on how it learns from data. Understanding these paradigms is fundamental to framing any ML problem correctly.

## Supervised Learning

In supervised learning, you have labeled data — input-output pairs — and the goal is to learn a mapping function \`f(x) -> y\`.

**Two main tasks:**

\`\`\`
Classification: y is a discrete category
  - Email spam detection (spam / not spam)
  - Image recognition (cat / dog / bird)
  - Disease diagnosis (positive / negative)

Regression: y is a continuous value
  - House price prediction
  - Temperature forecasting
  - Stock price estimation
\`\`\`

**Common algorithms:** Linear Regression, Logistic Regression, Decision Trees, Random Forests, SVMs, Neural Networks

**Interview tip:** When asked "How would you approach X?", first determine if the labels exist. If yes, it is supervised learning.

## Unsupervised Learning

No labels are provided. The algorithm discovers hidden structure in the data.

**Key tasks:**

\`\`\`
Clustering: Group similar data points
  - Customer segmentation
  - Document topic grouping
  - Anomaly detection

Dimensionality Reduction: Compress features
  - PCA for visualization
  - t-SNE for high-dimensional data
  - Autoencoders for feature learning

Association: Find co-occurrence patterns
  - Market basket analysis
  - Recommendation rules
\`\`\`

**Common algorithms:** K-Means, DBSCAN, Hierarchical Clustering, PCA, t-SNE, Gaussian Mixture Models

## Reinforcement Learning

An agent learns by interacting with an environment, receiving rewards or penalties for actions.

\`\`\`
Key concepts:
  Agent      — the learner/decision maker
  Environment — what the agent interacts with
  State      — current situation
  Action     — what the agent can do
  Reward     — feedback signal (+/-)
  Policy     — strategy mapping states to actions
\`\`\`

**Applications:** Game playing (AlphaGo), robotics, autonomous driving, ad bidding strategies, dynamic pricing.

**Interview tip:** RL comes up in system design for problems with sequential decision-making and delayed rewards, such as "optimize notification timing" or "design an ad bidding system."

## How to Choose

Ask these questions when framing an ML problem:
1. Do we have labels? -> Supervised
2. Do we need to discover structure? -> Unsupervised
3. Is there sequential decision-making with feedback? -> RL
4. Can we combine approaches? -> Semi-supervised, self-supervised

## Exercise

Classify each scenario into the correct learning paradigm and implement a basic example.`,
      starterCode: `from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

def supervised_example():
    """Implement a supervised classification example."""
    data = load_iris()
    X, y = data.data, data.target
    # TODO: Split data, train LogisticRegression, print accuracy
    pass

def unsupervised_example():
    """Implement an unsupervised clustering example."""
    data = load_iris()
    X = data.data
    # TODO: Fit KMeans with 3 clusters, print cluster centers
    pass

supervised_example()
unsupervised_example()`,
      solutionCode: `from sklearn.datasets import load_iris
from sklearn.cluster import KMeans
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

def supervised_example():
    """Implement a supervised classification example."""
    data = load_iris()
    X, y = data.data, data.target
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)
    accuracy = model.score(X_test, y_test)
    print(f"Supervised Accuracy: {accuracy:.4f}")

def unsupervised_example():
    """Implement an unsupervised clustering example."""
    data = load_iris()
    X = data.data
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    kmeans.fit(X)
    print(f"Cluster Centers:\\n{kmeans.cluster_centers_}")
    print(f"Inertia: {kmeans.inertia_:.2f}")

supervised_example()
unsupervised_example()`,
    },
    {
      id: "ml-fund-3",
      slug: "bias-variance-tradeoff",
      title: "Bias-Variance Tradeoff",
      content: `# The Bias-Variance Tradeoff

## The Most Important Concept in ML

The bias-variance tradeoff explains *why* models fail and guides every decision about model complexity. Interviewers love this topic because it tests deep understanding.

## Definitions

\`\`\`
Total Error = Bias² + Variance + Irreducible Noise

Bias:     Error from wrong assumptions in the model.
          High bias = underfitting (model too simple).
          Example: Fitting a line to quadratic data.

Variance: Error from sensitivity to training data fluctuations.
          High variance = overfitting (model too complex).
          Example: A deep decision tree that memorizes noise.

Irreducible Noise: Random error inherent in the data.
          Cannot be reduced by any model.
\`\`\`

## Visual Intuition

Think of a dartboard:

\`\`\`
High Bias, Low Variance:    Consistently off-target (same direction)
Low Bias, High Variance:    Scattered around the bullseye
High Bias, High Variance:   Scattered and off-target
Low Bias, Low Variance:     Clustered on the bullseye (ideal)
\`\`\`

## The Tradeoff in Practice

As model complexity increases:
- Bias decreases (model can capture more patterns)
- Variance increases (model becomes more sensitive to training data)
- There is a sweet spot that minimizes total error

\`\`\`
Model Complexity -->

Error
  |  \\
  |   \\___________       Total Error
  |    \\          \\___/
  |     Bias         Variance
  |________________________>
       Sweet Spot
\`\`\`

## Common Interview Questions

**Q: "Your model has high training accuracy but low test accuracy."**
A: This is overfitting — high variance. Solutions: more data, regularization, simpler model, dropout, early stopping.

**Q: "Your model has low training AND low test accuracy."**
A: This is underfitting — high bias. Solutions: more features, more complex model, less regularization, feature engineering.

**Q: "How does regularization relate to bias-variance?"**
A: Regularization (L1/L2) adds a penalty for model complexity, which increases bias slightly but reduces variance significantly. The net effect usually reduces total error.

\`\`\`
L1 (Lasso): Loss + λ * Σ|wᵢ|     → Drives weights to zero (feature selection)
L2 (Ridge): Loss + λ * Σwᵢ²      → Shrinks weights toward zero (weight decay)
\`\`\`

## Practical Diagnosis

Use learning curves to diagnose bias vs. variance:

\`\`\`
High Bias:     Train and val error both high, converge together
High Variance: Train error low, val error high, large gap
\`\`\`

## Exercise

Generate learning curves to diagnose whether a model suffers from high bias or high variance.`,
      starterCode: `import numpy as np
from sklearn.model_selection import learning_curve
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_digits

def plot_learning_curve(model, X, y, model_name):
    """Compute learning curve data and print results."""
    # TODO: Use learning_curve() with cv=5
    # TODO: Print mean train and val scores for each training size
    # TODO: Identify if the model shows high bias or high variance
    pass

data = load_digits()
X, y = data.data, data.target

# Compare a simple model vs a complex model
# plot_learning_curve(LogisticRegression(...), X, y, "Logistic Regression")
# plot_learning_curve(DecisionTreeClassifier(...), X, y, "Decision Tree")`,
      solutionCode: `import numpy as np
from sklearn.model_selection import learning_curve
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_digits

def plot_learning_curve(model, X, y, model_name):
    """Compute learning curve data and print results."""
    train_sizes, train_scores, val_scores = learning_curve(
        model, X, y, cv=5,
        train_sizes=np.linspace(0.1, 1.0, 5),
        scoring='accuracy'
    )
    train_mean = np.mean(train_scores, axis=1)
    val_mean = np.mean(val_scores, axis=1)

    print(f"\\n--- {model_name} ---")
    for size, t_score, v_score in zip(train_sizes, train_mean, val_mean):
        print(f"  N={size:4d}  Train={t_score:.4f}  Val={v_score:.4f}  Gap={t_score - v_score:.4f}")

    gap = train_mean[-1] - val_mean[-1]
    if gap > 0.1:
        print(f"  Diagnosis: HIGH VARIANCE (gap={gap:.4f})")
    elif val_mean[-1] < 0.8:
        print(f"  Diagnosis: HIGH BIAS (val={val_mean[-1]:.4f})")
    else:
        print(f"  Diagnosis: Good fit")

data = load_digits()
X, y = data.data, data.target

plot_learning_curve(LogisticRegression(max_iter=5000), X, y, "Logistic Regression")
plot_learning_curve(DecisionTreeClassifier(max_depth=None), X, y, "Deep Decision Tree")`,
    },
    {
      id: "ml-fund-4",
      slug: "evaluation-metrics",
      title: "Evaluation Metrics",
      content: `# Evaluation Metrics: Precision, Recall, F1 & AUC-ROC

## Why Accuracy Is Not Enough

Accuracy is misleading for imbalanced datasets. If 99% of emails are not spam, a model that always predicts "not spam" achieves 99% accuracy but catches zero spam.

## The Confusion Matrix

Every classification metric derives from four values:

\`\`\`
                 Predicted
              Positive  Negative
Actual  Pos     TP        FN
        Neg     FP        TN

TP = True Positive   (correctly predicted positive)
FP = False Positive  (incorrectly predicted positive — Type I error)
FN = False Negative  (incorrectly predicted negative — Type II error)
TN = True Negative   (correctly predicted negative)
\`\`\`

## Core Metrics

\`\`\`
Precision = TP / (TP + FP)
  "Of all predicted positives, how many are actually positive?"
  High precision = few false alarms.
  Optimize when: false positives are costly (spam filter, legal decisions)

Recall (Sensitivity) = TP / (TP + FN)
  "Of all actual positives, how many did we catch?"
  High recall = few missed positives.
  Optimize when: false negatives are costly (cancer detection, fraud)

F1 Score = 2 * (Precision * Recall) / (Precision + Recall)
  Harmonic mean of precision and recall.
  Use when you need a single balanced metric.

Specificity = TN / (TN + FP)
  "Of all actual negatives, how many did we correctly identify?"
\`\`\`

## AUC-ROC

The ROC curve plots True Positive Rate (Recall) vs False Positive Rate (1 - Specificity) across all classification thresholds.

\`\`\`
AUC = Area Under the ROC Curve

AUC = 1.0  → Perfect classifier
AUC = 0.5  → Random guessing (diagonal line)
AUC < 0.5  → Worse than random (flip predictions)
\`\`\`

**AUC interpretation:** The probability that the model ranks a randomly chosen positive example higher than a randomly chosen negative example.

## When to Use What

\`\`\`
Balanced classes          → Accuracy, F1
Imbalanced classes        → Precision-Recall curve, AUC-ROC
Cost-sensitive            → Weighted F1, custom cost matrix
Ranking problems          → AUC-ROC, NDCG
Regression                → MSE, RMSE, MAE, R²
\`\`\`

## Common Interview Questions

**Q: "Precision vs Recall — which matters more?"**
A: Depends on the cost of errors. Medical diagnosis: optimize recall (do not miss sick patients). Email spam: optimize precision (do not block good emails).

**Q: "What does the F1 score represent?"**
A: The harmonic mean of precision and recall. It punishes extreme imbalance — if either precision or recall is very low, F1 will be low.

## Exercise

Compute all metrics for a classifier and interpret the results.`,
      starterCode: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report
)

def evaluate_classifier():
    """Train a classifier and compute all key metrics."""
    data = load_breast_cancer()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )
    # TODO: Train LogisticRegression
    # TODO: Get predictions and predicted probabilities
    # TODO: Print confusion matrix
    # TODO: Print precision, recall, F1, AUC-ROC
    # TODO: Print full classification report
    pass

evaluate_classifier()`,
      solutionCode: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report
)

def evaluate_classifier():
    """Train a classifier and compute all key metrics."""
    data = load_breast_cancer()
    X_train, X_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.2, random_state=42
    )

    model = LogisticRegression(max_iter=10000)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_pred)
    print(f"Confusion Matrix:\\n{cm}")
    print(f"\\nPrecision: {precision_score(y_test, y_pred):.4f}")
    print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
    print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")
    print(f"AUC-ROC:   {roc_auc_score(y_test, y_proba):.4f}")
    print(f"\\nClassification Report:\\n{classification_report(y_test, y_pred)}")

evaluate_classifier()`,
    },
    {
      id: "ml-fund-5",
      slug: "cross-validation",
      title: "Cross-Validation & Model Selection",
      content: `# Cross-Validation & Model Selection

## Why Train/Test Split Is Not Enough

A single train/test split gives you one estimate of model performance. That estimate is noisy — it depends heavily on which data points ended up in which split. Cross-validation gives you a more robust estimate.

## K-Fold Cross-Validation

The standard approach splits data into K equal folds:

\`\`\`
K-Fold (K=5):
Fold 1: [VAL][Train][Train][Train][Train]
Fold 2: [Train][VAL][Train][Train][Train]
Fold 3: [Train][Train][VAL][Train][Train]
Fold 4: [Train][Train][Train][VAL][Train]
Fold 5: [Train][Train][Train][Train][VAL]

Final score = mean of 5 validation scores
\`\`\`

**Typical values:** K=5 or K=10. Higher K means less bias but more variance in the estimate and higher computational cost.

## Variants

\`\`\`
Stratified K-Fold:  Preserves class distribution in each fold.
                    Essential for imbalanced datasets.

Leave-One-Out (LOO): K = N (each sample is its own fold).
                     Low bias, high variance. Expensive for large N.

Repeated K-Fold:    Runs K-Fold multiple times with different random splits.
                    Most robust estimate, but K * repeats total fits.

Group K-Fold:       Ensures samples from same group stay together.
                    Use when data has natural groups (e.g., patients).

Time Series Split:  Training data is always before validation data.
                    Respects temporal ordering.
\`\`\`

## Model Selection with Cross-Validation

Cross-validation is the backbone of model selection. Compare models fairly by evaluating each with the same CV strategy.

**Hyperparameter Tuning:**

\`\`\`
Grid Search:     Try all combinations of hyperparameters.
                 Exhaustive but expensive.
                 O(n^k) where k = number of hyperparameters.

Random Search:   Sample random combinations.
                 Often finds good solutions faster.
                 Better for high-dimensional search spaces.

Bayesian Opt:    Use previous results to guide search.
                 Most efficient, but more complex to implement.
\`\`\`

## Common Interview Pitfalls

**Data leakage through CV:** If you preprocess (e.g., scaling, feature selection) before splitting, information from the validation set leaks into training. Always use \`Pipeline\` to ensure preprocessing happens inside each fold.

**Overfitting to the validation set:** If you run hundreds of experiments and pick the best CV score, you are overfitting to the validation set. Use a held-out test set for final evaluation.

**Wrong CV for your data:** Using standard K-Fold on time series data ignores temporal dependencies. Always match the CV strategy to the data structure.

## The Golden Rule

\`\`\`
1. Split off a TEST SET first (never touch it during development)
2. Use CROSS-VALIDATION on the remaining data for model selection
3. Evaluate the final chosen model on the TEST SET exactly once
\`\`\`

## Exercise

Compare multiple models using cross-validation and select the best one.`,
      starterCode: `from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

def compare_models():
    """Compare models using stratified 5-fold CV."""
    data = load_wine()
    X, y = data.data, data.target
    # TODO: Create pipelines for LogisticRegression, RandomForest, SVC
    # TODO: Run cross_val_score with cv=5, scoring='accuracy'
    # TODO: Print mean and std for each model
    # TODO: Use GridSearchCV to tune the best model
    pass

compare_models()`,
      solutionCode: `from sklearn.datasets import load_wine
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

def compare_models():
    """Compare models using stratified 5-fold CV."""
    data = load_wine()
    X, y = data.data, data.target

    models = {
        "Logistic Regression": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=5000))
        ]),
        "Random Forest": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", RandomForestClassifier(n_estimators=100, random_state=42))
        ]),
        "SVM": Pipeline([
            ("scaler", StandardScaler()),
            ("clf", SVC())
        ]),
    }

    best_name, best_score = None, 0
    for name, model in models.items():
        scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")
        mean_score = scores.mean()
        print(f"{name}: {mean_score:.4f} (+/- {scores.std():.4f})")
        if mean_score > best_score:
            best_name, best_score = name, mean_score

    print(f"\\nBest model: {best_name}")

    # Tune the SVM with GridSearchCV
    param_grid = {"clf__C": [0.1, 1, 10], "clf__kernel": ["rbf", "linear"]}
    grid = GridSearchCV(models["SVM"], param_grid, cv=5, scoring="accuracy")
    grid.fit(X, y)
    print(f"\\nTuned SVM: {grid.best_score_:.4f}")
    print(f"Best params: {grid.best_params_}")

compare_models()`,
    },
  ],
};
