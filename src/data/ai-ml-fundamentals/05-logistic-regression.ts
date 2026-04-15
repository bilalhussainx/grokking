import { Module } from "../types";

export const logisticRegressionModule: Module = {
  id: "logistic-regression",
  title: "Logistic Regression and Binary Classification",
  description: "Build a binary classifier from scratch using the sigmoid function, cross-entropy loss, and gradient descent. Evaluate with precision, recall, and ROC curves.",
  lessons: [
    {
      id: "classification-problem",
      slug: "classification-problem",
      title: "The Classification Problem: From Regression to Probabilities",
      content: `# The Classification Problem: From Regression to Probabilities

Imagine you're building a spam filter. For each email, you want a simple answer: spam or not spam. You already know how to build a linear regression model that predicts numbers — so why not just use that?

In this lesson you'll discover exactly why linear regression breaks down for classification tasks, and how the **sigmoid function** elegantly solves the problem by squashing any real number into a probability between 0 and 1.

---

## What Makes Classification Different?

In **regression**, your output is a continuous value: house price, temperature tomorrow, stock return. In **classification**, your output is a discrete label drawn from a finite set.

\`\`\`concept
{ "title": "Classification vs Regression", "variant": "mental-model", "content": "Regression asks 'how much?' — it predicts a quantity on a continuous scale. Classification asks 'which one?' — it assigns a label from a fixed set of categories. The key difference isn't the input features; it's the nature of the output you're trying to predict." }
\`\`\`

Consider these contrasting tasks:

| Task | Output Type | Algorithm Family |
|---|---|---|
| Predict house price | \`$425,000\` (continuous) | Regression |
| Is this email spam? | \`spam / not-spam\` (discrete) | Classification |
| What digit is this? | \`0–9\` (discrete, 10 classes) | Classification |
| Predict tomorrow's rainfall | \`12.3 mm\` (continuous) | Regression |

**Binary classification** is the simplest case: exactly two possible outcomes. A spam filter is binary. A COVID test result (positive/negative) is binary. Most real-world binary classifiers ultimately output a *probability*, then apply a threshold to produce a label.

---

## Why Linear Regression Fails for Classification

Let's try the naive approach: use a linear model directly for a binary label (0 or 1) and see what breaks.

\`\`\`trace
{ "title": "Linear Regression on a Binary Label", "language": "python", "code": "import numpy as np\\n\\n# Hours studied vs pass(1)/fail(0)\\nhours  = np.array([0.5, 1.0, 1.5, 2.0, 4.0, 5.0, 6.0, 8.0, 10.0])\\nlabels = np.array([0,   0,   0,   0,   1,   1,   1,   1,   1  ])\\n\\n# Fit a line: y = w*x + b\\nw, b = np.polyfit(hours, labels, 1)\\nprint(f'w={w:.3f}, b={b:.3f}')\\n\\n# Predict on extreme inputs\\nfor x in [-5, 0, 3, 12, 20]:\\n    pred = w * x + b\\n    print(f'hours={x:>3} -> prediction={pred:.3f}')", "frames": [ { "line": 1, "vars": {}, "note": "Import NumPy — our only dependency", "stdout": "" }, { "line": 4, "vars": { "hours": "[0.5 ... 10.0]", "labels": "[0 0 0 0 1 1 1 1 1]" }, "note": "Binary dataset: fail (0) or pass (1) based on study hours", "stdout": "" }, { "line": 8, "vars": { "w": 0.124, "b": -0.101 }, "note": "polyfit fits the best straight line through the 0/1 labels", "stdout": "w=0.124, b=-0.101" }, { "line": 11, "vars": { "x": -5 }, "note": "Negative hours: prediction goes BELOW zero. A probability can't be negative!", "stdout": "hours= -5 -> prediction=-0.722" }, { "line": 11, "vars": { "x": 20 }, "note": "Large input: prediction goes ABOVE one. A probability can't exceed 1!", "stdout": "hours= 20 -> prediction=2.378" } ], "speed": 900 }
\`\`\`

The model predicts \`-0.72\` for negative hours and \`2.38\` for 20 hours. **These are not valid probabilities.** Probabilities must live in [0, 1].

\`\`\`callout
{ "type": "danger", "title": "Three Fatal Problems with Linear Regression for Classification", "content": "1. **Unbounded outputs** — predictions fall outside [0, 1], which can't represent probability.\\n2. **No natural threshold** — where do you draw the line between 'class 0' and 'class 1'?\\n3. **Sensitive to outliers** — one extreme data point drags the fitted line, shifting the decision boundary wildly." }
\`\`\`

---

## Enter the Sigmoid Function

We need a function that:
- Accepts **any real number** as input (the raw output of a linear model)
- Returns a value **strictly between 0 and 1**
- Is **smooth and differentiable** (so gradient descent can work)
- Has an **S-shaped curve** that saturates gracefully at both ends

The **sigmoid function** (also called the logistic function) delivers all four:

$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

\`\`\`concept
{ "title": "The Sigmoid as a Probability Squasher", "variant": "analogy", "content": "Think of the sigmoid as a dimmer switch for probability. A raw score z can be anything — -100, 0, +50. The sigmoid takes that score and maps it to a dimmer value between 0 (fully off = class 0) and 1 (fully on = class 1). Near z=0 you're uncertain; far from zero you're very confident." }
\`\`\`

Let's visualise what happens at key values:

\`\`\`algoviz
{ "title": "Sigmoid Output at Key Input Values", "type": "array", "data": [-6, -4, -2, -1, 0, 1, 2, 4, 6], "frames": [ { "highlight": [4], "label": "z=0 → σ=0.500 (maximum uncertainty, 50/50)", "stats": { "z": 0, "σ(z)": 0.5 } }, { "highlight": [5], "label": "z=1 → σ=0.731 (slight lean toward class 1)", "stats": { "z": 1, "σ(z)": 0.731 } }, { "highlight": [6], "label": "z=2 → σ=0.880 (fairly confident class 1)", "stats": { "z": 2, "σ(z)": 0.88 } }, { "highlight": [7], "label": "z=4 → σ=0.982 (very confident class 1)", "stats": { "z": 4, "σ(z)": 0.982 } }, { "highlight": [8], "label": "z=6 → σ=0.998 (near-certain class 1)", "stats": { "z": 6, "σ(z)": 0.998 } }, { "highlight": [3], "label": "z=-1 → σ=0.269 (slight lean toward class 0)", "stats": { "z": -1, "σ(z)": 0.269 } }, { "highlight": [1], "label": "z=-4 → σ=0.018 (very confident class 0)", "stats": { "z": -4, "σ(z)": 0.018 } }, { "highlight": [0], "label": "z=-6 → σ=0.002 (near-certain class 0)", "stats": { "z": -6, "σ(z)": 0.002 } } ], "speed": 700 }
\`\`\`

---

## Building the Sigmoid from Scratch

\`\`\`playground
{ "title": "Implement and Explore the Sigmoid", "language": "python", "code": "import numpy as np\\n\\ndef sigmoid(z):\\n    \\"\\"\\"Map any real number to (0, 1).\\"\\"\\"\\n    return 1 / (1 + np.exp(-z))\\n\\n# --- Core properties ---\\nprint('=== Sigmoid properties ===')\\nprint(f'sigmoid(0)    = {sigmoid(0):.4f}  <- always exactly 0.5')\\nprint(f'sigmoid(1)    = {sigmoid(1):.4f}')\\nprint(f'sigmoid(-1)   = {sigmoid(-1):.4f}  <- symmetric around 0.5')\\nprint(f'sigmoid(100)  = {sigmoid(100):.4f}  <- saturates near 1')\\nprint(f'sigmoid(-100) = {sigmoid(-100):.4f}  <- saturates near 0')\\n\\n# --- Apply to a linear model output ---\\nprint('\\\\n=== Logistic regression pipeline ===')\\nweights = np.array([0.5, -0.3])   # learned weights\\nbias    = 0.1                      # learned bias\\n\\nX = np.array([[2.0, 1.0],   # sample 1\\n              [0.5, 3.0],   # sample 2\\n              [4.0, 0.2]])  # sample 3\\n\\nz     = X @ weights + bias   # linear step: shape (3,)\\nprobs = sigmoid(z)            # sigmoid step: shape (3,)\\n\\nfor i, (zi, pi) in enumerate(zip(z, probs)):\\n    label = 1 if pi >= 0.5 else 0\\n    print(f'Sample {i+1}: z={zi:.3f} -> P(y=1)={pi:.3f} -> label={label}')\\n", "runnable": true }
\`\`\`

Notice the pipeline: **linear combination → sigmoid → probability → threshold → label**. This is the entire forward pass of logistic regression.

\`\`\`concept
{ "title": "The Logistic Regression Forward Pass", "variant": "rule", "content": "Step 1 — Linear: z = w·x + b (unbounded real number)\\nStep 2 — Sigmoid: p = σ(z) = 1/(1+e^{-z}) (probability in (0,1))\\nStep 3 — Threshold: ŷ = 1 if p ≥ 0.5 else 0 (discrete prediction)\\n\\nThe sigmoid links a linear model — which you already understand — to a probability output suitable for classification." }
\`\`\`

---

## The Decision Boundary

When \`p = 0.5\`, the sigmoid's input is exactly \`z = 0\`. That means:

\`\`\`
w·x + b = 0   ←  this is the decision boundary
\`\`\`

For a 2-feature problem, this equation defines a **line** in feature space. Points on one side get classified as 1; points on the other side as 0.

\`\`\`tabs
{ "tabs": [ { "label": "1D boundary", "icon": "📍", "content": "With one feature \`x\` and weights \`w, b\`:\\n\\nThe boundary is a single **point**: \`x* = -b/w\`\\n\\n- If \`x > x*\` → positive class\\n- If \`x < x*\` → negative class\\n\\nExample: if \`w=2, b=-4\`, the boundary is at \`x=2\`." }, { "label": "2D boundary", "icon": "📐", "content": "With two features \`x₁, x₂\` and weights \`w₁, w₂, b\`:\\n\\nThe boundary is a **line**: \`w₁x₁ + w₂x₂ + b = 0\`\\n\\nThis divides the 2D feature plane into two half-planes, one per class.\\n\\nLogistic regression can only draw **linear** decision boundaries — which is both a strength (interpretable) and a limitation (can't handle non-linearly separable data)." }, { "label": "Higher dimensions", "icon": "🌐", "content": "With \`n\` features, the boundary is a **hyperplane** in n-dimensional space:\\n\\n\`w₁x₁ + w₂x₂ + ... + wₙxₙ + b = 0\`\\n\\nStill linear! For non-linear boundaries you'd need:\\n- Feature engineering (polynomial features)\\n- Kernel methods (SVM)\\n- Neural networks (stacking multiple linear boundaries)" } ] }
\`\`\`

---

## Practice: Fill in the Sigmoid

\`\`\`fillblank
{ "title": "Implement the Sigmoid Step-by-Step", "prompt": "Complete the sigmoid function and the decision rule below:", "language": "python", "template": "import numpy as np\\n\\ndef sigmoid(z):\\n    return ___ / (1 + np.exp(___))\\n\\ndef predict(z, threshold=0.5):\\n    prob = sigmoid(z)\\n    return (prob >= ___).astype(int)\\n\\n# Test\\nprint(sigmoid(0))          # should print 0.5\\nprint(predict(np.array([2.0, -1.0, 0.0])))", "blanks": [ { "answer": "1", "hint": "The numerator of 1/(1+e^{-z}) is just the number one" }, { "answer": "-z", "hint": "The exponent in the denominator is the negative of the input" }, { "answer": "threshold", "hint": "We classify as 1 when probability meets or exceeds this value" } ] }
\`\`\`

---

## Putting It All Together

\`\`\`playground
{ "title": "Logistic Regression Classifier (No Frameworks)", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-z))\\n\\n# ---- Toy dataset: tumour size (cm) → malignant (1) or benign (0) ----\\nX = np.array([1.2, 1.8, 2.5, 3.0, 3.5, 4.2, 5.0, 5.8, 6.5, 7.0])\\ny = np.array([0,   0,   0,   0,   1,   1,   1,   1,   1,   1  ])\\n\\n# Pre-learned weights (we'll derive these in the next lesson)\\nw = 1.8\\nb = -6.5\\n\\n# Forward pass\\nz     = w * X + b\\nprobs = sigmoid(z)\\npreds = (probs >= 0.5).astype(int)\\n\\nprint('Size(cm) | P(malignant) | Predicted | Actual | Correct?')\\nprint('-' * 55)\\nfor xi, pi, pred_i, yi in zip(X, probs, preds, y):\\n    correct = '✓' if pred_i == yi else '✗'\\n    print(f'{xi:^8.1f} | {pi:^12.3f} | {pred_i:^9} | {yi:^6} | {correct}')\\n\\nacc = np.mean(preds == y)\\nprint(f'\\\\nAccuracy: {acc*100:.0f}%')\\n", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Where Do the Weights Come From?", "content": "In this example the weights \`w=1.8, b=-6.5\` were provided for you. In the next lesson you'll see how **gradient descent minimises cross-entropy loss** to *learn* optimal weights automatically from data. The sigmoid is the bridge between a linear model and a learnable probability." }
\`\`\`

---

## Common Misconception Alert

\`\`\`callout
{ "type": "warning", "title": "Logistic Regression Is NOT a Regression Algorithm", "content": "The name is misleading. Despite containing 'regression', logistic regression is a **classification** algorithm. It uses a regression-style linear model internally, but the sigmoid transforms its output into a probability, and a threshold converts that into a discrete class label. It belongs firmly in the classification family." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Classification Foundations", "questions": [ { "question": "You train a linear regression model on binary labels (0/1). For a new input, the model outputs 1.73. What is the fundamental problem?", "options": ["The model will be too slow to compute", "1.73 cannot be interpreted as a valid probability — it exceeds the [0,1] range", "The model cannot learn from binary data at all", "Linear regression requires more than two classes"], "answer": 1, "explanation": "Probabilities must lie in [0, 1]. A raw linear model output of 1.73 has no valid probabilistic interpretation, which is exactly why we need the sigmoid to squash outputs into that range." }, { "question": "What is the output of sigmoid(0)?", "options": ["0.0", "1.0", "0.5", "It is undefined"], "answer": 2, "explanation": "σ(0) = 1/(1+e^0) = 1/(1+1) = 0.5. At z=0 the model is maximally uncertain — it assigns equal probability to both classes." }, { "question": "For a logistic regression model with one feature, where does the decision boundary lie?", "options": ["At the point where the predicted probability equals 1.0", "At the point where the linear combination w·x + b equals zero", "At the mean of the training data", "At the point where the loss function is maximised"], "answer": 1, "explanation": "The decision boundary is where p = 0.5, which occurs when σ(z) = 0.5, which occurs when z = 0, i.e., w·x + b = 0. In 2D this is a line; in nD it is a hyperplane." }, { "question": "Which property of the sigmoid function makes it suitable for use with gradient descent?", "options": ["It produces integer outputs", "It is smooth and continuously differentiable everywhere", "It is computationally free to evaluate", "It can only output values above 0.5"], "answer": 1, "explanation": "Gradient descent requires computing derivatives of the loss with respect to model parameters. The sigmoid's smooth S-curve has a well-defined derivative at every point: σ'(z) = σ(z)(1 - σ(z)), which we'll use in the next lesson." } ] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Classification predicts discrete labels from a finite set; regression predicts continuous values — the difference is in the output, not the input features.", "Linear regression applied to binary labels produces unbounded outputs that cannot represent probabilities, making it unsuitable for classification.", "The sigmoid function σ(z) = 1/(1+e^{-z}) squashes any real number into (0, 1), giving a valid probability interpretation to linear model outputs.", "The decision boundary of logistic regression is where z = w·x + b = 0 — a linear hyperplane separating the two classes.", "Despite its name, logistic regression is a classification algorithm: it uses a linear model internally but the sigmoid + threshold turns it into a classifier.", "The full forward pass is: linear combination → sigmoid → probability → threshold → discrete label." ] }
\`\`\`

---

**Up next:** You'll see how to measure the error between predicted probabilities and true labels using **cross-entropy loss**, and how gradient descent adjusts the weights to minimise it — learning the decision boundary from data.`,
      starterCode: `import math

# =============================================================
# Exercise: From Regression to Probabilities
# =============================================================
# In this exercise you will:
#   1. See why raw linear regression scores are bad for classification
#   2. Implement the sigmoid function to squash scores into probabilities
#   3. Use those probabilities to make a binary classification decision
# =============================================================

# --- Part 1: The problem with linear regression for classification ---
# A linear model produces a raw score (can be any real number).
# These scores are NOT valid probabilities (they can be > 1 or < 0).

raw_scores = [-3.5, -1.2, 0.0, 1.8, 4.1]

print("Raw linear regression scores:")
for score in raw_scores:
    print(f"  score = {score:.2f}")

# TODO 1: Print a warning message explaining why these scores can't
# be used directly as probabilities. (Just a print statement is fine.)
# Hint: what's wrong with a 'probability' of -3.5 or 4.1?


# --- Part 2: Implement the sigmoid function ---
# The sigmoid function maps any real number to the range (0, 1),
# making it suitable as a probability estimate.
#
# Formula:  sigmoid(z) = 1 / (1 + e^(-z))
#
# You may use math.exp() for the exponential.

def sigmoid(z):
    """
    Convert a raw linear score z into a probability in (0, 1).

    Args:
        z (float): raw linear score

    Returns:
        float: probability between 0 and 1
    """
    # TODO 2: Implement the sigmoid formula and return the result.
    pass


# --- Part 3: Apply sigmoid and classify ---
# Use a decision threshold of 0.5:
#   probability >= 0.5  →  class 1 (positive)
#   probability <  0.5  →  class 0 (negative)

def classify(z, threshold=0.5):
    """
    Return the predicted class label (0 or 1) for a raw score z.

    Args:
        z         (float): raw linear score
        threshold (float): decision boundary (default 0.5)

    Returns:
        int: 0 or 1
    """
    # TODO 3: Call sigmoid(z) to get a probability, then return
    # 1 if probability >= threshold, else return 0.
    pass


# --- Part 4: Run it ---
print("\\nScore  →  Sigmoid Probability  →  Predicted Class")
print("-" * 52)
for score in raw_scores:
    # TODO 4: Call sigmoid() and classify() for each score and
    # print a formatted line, e.g.:
    #   score = -3.50  →  prob = 0.0293  →  class 0
    pass
`,
      solutionCode: `import math

# =============================================================
# Solution: From Regression to Probabilities
# =============================================================

# --- Part 1: The problem with linear regression for classification ---
raw_scores = [-3.5, -1.2, 0.0, 1.8, 4.1]

print("Raw linear regression scores:")
for score in raw_scores:
    print(f"  score = {score:.2f}")

# Part 1 answer: explain why raw scores fail
print("\\nProblem: raw scores can be outside [0, 1].")
print("A 'probability' of -3.5 or 4.1 is meaningless.")
print("We need a function that squashes any real number into (0, 1).\\n")


# --- Part 2: Implement the sigmoid function ---
def sigmoid(z):
    """
    Convert a raw linear score z into a probability in (0, 1).

    Formula: sigmoid(z) = 1 / (1 + e^(-z))

    Key properties:
      - sigmoid(0)   = 0.5   (decision boundary)
      - sigmoid(+∞)  → 1.0   (strongly positive)
      - sigmoid(-∞)  → 0.0   (strongly negative)
    """
    return 1.0 / (1.0 + math.exp(-z))


# --- Part 3: Apply sigmoid and classify ---
def classify(z, threshold=0.5):
    """
    Return the predicted class label (0 or 1) for a raw score z.

    The sigmoid squashes z into a probability; if that probability
    is at or above the threshold we predict the positive class (1),
    otherwise the negative class (0).
    """
    probability = sigmoid(z)
    return 1 if probability >= threshold else 0


# --- Part 4: Run it ---
print("Score  →  Sigmoid Probability  →  Predicted Class")
print("-" * 52)
for score in raw_scores:
    prob = sigmoid(score)
    label = classify(score)
    print(f"  score = {score:+.2f}  →  prob = {prob:.4f}  →  class {label}")

# Expected output:
#   score = -3.50  →  prob = 0.0293  →  class 0
#   score = -1.20  →  prob = 0.2315  →  class 0
#   score =  0.00  →  prob = 0.5000  →  class 1   ← boundary case
#   score = +1.80  →  prob = 0.8581  →  class 1
#   score = +4.10  →  prob = 0.9837  →  class 1

# Notice:
#   - ALL probabilities are now strictly between 0 and 1 ✓
#   - The decision flips exactly at score = 0 (where sigmoid = 0.5) ✓
#   - Large positive scores → high confidence (near 1) ✓
#   - Large negative scores → low confidence (near 0) ✓
`,
    },
    {
      id: "sigmoid-cross-entropy",
      slug: "sigmoid-cross-entropy",
      title: "Sigmoid Activation and Cross-Entropy Loss",
      content: `# Sigmoid Activation and Cross-Entropy Loss

Every classification model needs to answer one question: *how confident am I that this input belongs to class 1?* Linear models output raw scores — numbers that could be −∞ to +∞. That's not a probability. To turn a raw score into something meaningful between 0 and 1, we need the **sigmoid function**. And to train the model, we need a loss that penalizes confident wrong answers far more than uncertain ones — that's **binary cross-entropy**.

In this lesson you'll derive cross-entropy directly from probability theory (maximum likelihood estimation), implement both functions from scratch in NumPy, and verify the gradient analytically.

---

## Part 1 — The Sigmoid Function

\`\`\`concept
{ "title": "Sigmoid as a Probability Converter", "variant": "mental-model", "content": "Think of the sigmoid as a squashing machine. No matter how large or small a number you feed it, it returns a value strictly between 0 and 1. A raw model score of +5 becomes ~0.993 (very confident: class 1). A score of −5 becomes ~0.007 (very confident: class 0). A score of 0 maps exactly to 0.5 — maximum uncertainty." }
\`\`\`

The sigmoid function is defined as:

$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

where \`z\` is any real number (called the **logit** — the raw pre-activation score).

### Key Properties

| Property | Value | Why it matters |
|---|---|---|
| Output range | (0, 1) — exclusive | Directly interpretable as probability |
| At z = 0 | σ(0) = 0.5 | Model is maximally uncertain |
| As z → +∞ | σ(z) → 1 | Saturates — vanishing gradient risk |
| As z → −∞ | σ(z) → 0 | Saturates — vanishing gradient risk |
| Derivative | σ(z)(1 − σ(z)) | Elegantly self-referential |

The derivative formula \`σ'(z) = σ(z)(1 − σ(z))\` is particularly beautiful — the gradient is expressed entirely in terms of the function's own output. You'll use this in backpropagation.

\`\`\`callout
{ "type": "warning", "title": "The Vanishing Gradient Problem", "content": "When |z| is large (e.g., z = 10 or z = −10), σ(z) is near 0 or 1. The derivative σ(z)(1−σ(z)) becomes nearly 0 — gradients vanish and weights stop updating. This is why sigmoid is avoided in hidden layers of deep networks, but remains appropriate as the output activation for binary classification." }
\`\`\`

### Watching the Sigmoid in Action

\`\`\`trace
{ "title": "Sigmoid Evaluation Step-by-Step", "language": "python", "code": "import numpy as np\\n\\ndef sigmoid(z):\\n    return 1.0 / (1.0 + np.exp(-z))\\n\\nz = 2.0\\nexp_neg_z = np.exp(-z)\\ndenominator = 1.0 + exp_neg_z\\nresult = 1.0 / denominator\\nprint(f'sigmoid({z}) = {result:.6f}')", "frames": [ { "line": 4, "vars": { "z": 2.0 }, "note": "Input logit z = 2.0 — moderate positive score, model leans toward class 1", "stdout": "" }, { "line": 5, "vars": { "z": 2.0, "exp_neg_z": 0.135335 }, "note": "Compute e^(-2) ≈ 0.1353", "stdout": "" }, { "line": 6, "vars": { "z": 2.0, "exp_neg_z": 0.135335, "denominator": 1.135335 }, "note": "Add 1 to get the denominator", "stdout": "" }, { "line": 7, "vars": { "z": 2.0, "exp_neg_z": 0.135335, "denominator": 1.135335, "result": 0.880797 }, "note": "Divide 1 by denominator → probability ≈ 0.881. Model is 88.1% confident this is class 1.", "stdout": "" }, { "line": 8, "vars": { "z": 2.0, "result": 0.880797 }, "note": "Output printed", "stdout": "sigmoid(2.0) = 0.880797" } ], "speed": 900 }
\`\`\`

---

## Part 2 — Why Not Use MSE for Classification?

Before deriving cross-entropy, it's worth understanding why **mean squared error (MSE)** is a poor choice for binary classification.

\`\`\`tabs
{ "tabs": [ { "label": "MSE on Classification", "icon": "❌", "content": "With MSE, loss = (y_hat - y)^2. Suppose the true label is y=1 and our model predicts y_hat = 0.99. Loss = (0.99-1)^2 = 0.0001 — negligible, which is correct.\\n\\nBut suppose y_hat = 0.01 (confidently wrong). Loss = (0.01-1)^2 = 0.9801. That sounds large, but the **gradient** of MSE through the sigmoid nearly vanishes for confident wrong predictions — exactly when we need the strongest correction signal. The learning process stalls." }, { "label": "Cross-Entropy on Classification", "icon": "✅", "content": "With binary cross-entropy, a confident wrong prediction is penalized **logarithmically and without bound**.\\n\\nIf y=1 and y_hat ≈ 0 (confidently wrong): Loss = -log(0.001) ≈ 6.9. The penalty grows to infinity as y_hat approaches 0.\\n\\nCrucially, when we combine sigmoid + cross-entropy, the gradient simplifies to just (y_hat - y) — no vanishing gradient from the activation. This is called the **log-loss cancellation** and is the mathematical reason this pair is always used together." } ] }
\`\`\`

---

## Part 3 — Deriving Cross-Entropy from MLE

This is the core of the lesson. Rather than pulling the loss function out of thin air, let's *derive* it from first principles using **Maximum Likelihood Estimation (MLE)**.

\`\`\`steps
{ "title": "MLE Derivation of Binary Cross-Entropy", "steps": [ { "title": "Model the probability", "content": "We model P(y=1 | x) = σ(z) = ŷ. For a single training example with true label y ∈ {0, 1}, the probability of observing that label is:\\n\\nP(y | x) = ŷ^y · (1 - ŷ)^(1-y)\\n\\nWhen y=1: P = ŷ^1 · (1-ŷ)^0 = ŷ\\nWhen y=0: P = ŷ^0 · (1-ŷ)^1 = 1-ŷ\\n\\nThis single expression elegantly handles both cases." }, { "title": "Write the likelihood over N examples", "content": "Assuming i.i.d. training examples, the joint likelihood of observing the entire dataset is the product over all N examples:\\n\\nL(θ) = ∏(i=1 to N) ŷᵢ^yᵢ · (1 - ŷᵢ)^(1-yᵢ)\\n\\nWe want to find parameters θ that **maximize** this." }, { "title": "Take the log (log-likelihood)", "content": "Products are numerically unstable and hard to differentiate. Taking the natural log converts the product to a sum:\\n\\nlog L(θ) = Σ [ yᵢ · log(ŷᵢ) + (1 - yᵢ) · log(1 - ŷᵢ) ]\\n\\nThis is the **log-likelihood**. Maximizing log L is equivalent to maximizing L (log is monotonic)." }, { "title": "Negate to get a minimizable loss", "content": "Optimization algorithms minimize, not maximize. So we negate and average:\\n\\nBCE(y, ŷ) = -(1/N) · Σ [ yᵢ · log(ŷᵢ) + (1 - yᵢ) · log(1 - ŷᵢ) ]\\n\\n**This is binary cross-entropy loss** — derived, not assumed. Minimizing BCE is identical to maximizing the likelihood of the training data." }, { "title": "Compute the gradient", "content": "Using chain rule (∂BCE/∂z = ∂BCE/∂ŷ · ∂ŷ/∂z), and using ∂σ/∂z = σ(z)(1-σ(z)):\\n\\n∂BCE/∂z = ŷ - y\\n\\nThe sigmoid's gradient cancels the 1/(ŷ(1-ŷ)) term from the log's derivative — this is the log-loss cancellation. The gradient is simply **prediction minus ground truth**." } ] }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "The Beautiful Cancellation", "content": "∂BCE/∂z = ŷ − y is one of the most elegant results in ML. It means: if you predicted 0.9 but the true label is 0, the gradient is +0.9 — a strong push downward. If you predicted 0.5 for y=1, the gradient is −0.5 — a moderate push upward. The correction is proportional to your error, exactly as intuition demands." }
\`\`\`

---

## Part 4 — Implementation

Now let's implement both functions and verify the gradient numerically.

\`\`\`playground
{ "title": "Sigmoid + Binary Cross-Entropy from Scratch", "language": "python", "code": "import numpy as np\\n\\n# ── Sigmoid ──────────────────────────────────────────\\ndef sigmoid(z):\\n    \\"\\"\\"Maps any real number to (0, 1).\\"\\"\\"\\n    return 1.0 / (1.0 + np.exp(-z))\\n\\n# ── Binary Cross-Entropy Loss ─────────────────────────\\ndef binary_cross_entropy(y_true, y_pred, eps=1e-12):\\n    \\"\\"\\"\\n    BCE = -(1/N) * sum[ y*log(ŷ) + (1-y)*log(1-ŷ) ]\\n    eps clips predictions away from 0/1 to avoid log(0).\\n    \\"\\"\\"\\n    y_pred = np.clip(y_pred, eps, 1 - eps)\\n    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))\\n\\n# ── Gradient of BCE w.r.t. logit z ───────────────────\\ndef bce_gradient(y_true, y_pred):\\n    \\"\\"\\"∂BCE/∂z = (ŷ - y) / N\\"\\"\\"\\n    return (y_pred - y_true) / len(y_true)\\n\\n# ── Numerical gradient check ──────────────────────────\\ndef numerical_gradient(z, y_true, h=1e-5):\\n    \\"\\"\\"Approximate ∂BCE/∂z via finite differences.\\"\\"\\"\\n    loss_plus  = binary_cross_entropy(y_true, sigmoid(z + h))\\n    loss_minus = binary_cross_entropy(y_true, sigmoid(z - h))\\n    return (loss_plus - loss_minus) / (2 * h)\\n\\n# ── Demo ──────────────────────────────────────────────\\nnp.random.seed(42)\\nN = 5\\nz      = np.array([ 2.1, -1.3,  0.5, -0.8,  3.2])  # logits\\ny_true = np.array([   1,    0,    1,    0,    1], dtype=float)\\ny_pred = sigmoid(z)\\n\\nloss = binary_cross_entropy(y_true, y_pred)\\nprint(f\\"Logits:       {z}\\")\\nprint(f\\"Predictions:  {np.round(y_pred, 4)}\\")\\nprint(f\\"True labels:  {y_true.astype(int)}\\")\\nprint(f\\"BCE Loss:     {loss:.6f}\\")\\nprint()\\n\\n# Verify gradient for each element\\nprint(\\"Gradient check (analytic vs numeric):\\")\\nprint(f\\"{'z':>8} {'y':>6} {'analytic':>12} {'numeric':>12} {'match':>8}\\")\\nfor i in range(N):\\n    zi = np.array([z[i]])\\n    yi = np.array([y_true[i]])\\n    analytic = bce_gradient(yi, sigmoid(zi))[0]\\n    numeric  = numerical_gradient(zi, yi)[0]\\n    match    = '✓' if abs(analytic - numeric) < 1e-6 else '✗'\\n    print(f\\"{z[i]:>8.2f} {int(y_true[i]):>6} {analytic:>12.8f} {numeric:>12.8f} {match:>8}\\")\\n", "runnable": true }
\`\`\`

### What to look for in the output

When you run the code above, every gradient pair should match to 6+ decimal places. This **numerical gradient check** is the gold standard for verifying backpropagation implementations — you'll use this technique throughout the course whenever you implement a new gradient.

\`\`\`callout
{ "type": "tip", "title": "Always Clip Predictions", "content": "The line \`y_pred = np.clip(y_pred, eps, 1 - eps)\` protects against log(0) = -∞. In practice, sigmoid rarely produces exactly 0 or 1, but numerical underflow can make np.exp(-z) overflow for very large z. Clipping at 1e-12 is safe and standard." }
\`\`\`

---

## Part 5 — Visualizing the Loss Surface

Let's see how BCE behaves as a function of a single prediction \`ŷ\` for both possible true labels:

\`\`\`playground
{ "title": "BCE Loss Curve — Visualized", "language": "python", "code": "import numpy as np\\n\\neps = 1e-12\\ny_hat = np.linspace(eps, 1 - eps, 500)\\n\\nloss_y1 = -np.log(y_hat)          # y=1: only -log(ŷ) term survives\\nloss_y0 = -np.log(1 - y_hat)      # y=0: only -log(1-ŷ) term survives\\n\\nprint(\\"BCE loss for y=1:\\")\\nprint(f\\"  ŷ=0.99 (correct, confident): {-np.log(0.99):.4f}\\")\\nprint(f\\"  ŷ=0.50 (uncertain):          {-np.log(0.50):.4f}\\")\\nprint(f\\"  ŷ=0.10 (wrong, confident):   {-np.log(0.10):.4f}\\")\\nprint(f\\"  ŷ=0.01 (very wrong):         {-np.log(0.01):.4f}\\")\\n\\nprint()\\nprint(\\"BCE loss for y=0:\\")\\nprint(f\\"  ŷ=0.01 (correct, confident): {-np.log(1-0.01):.4f}\\")\\nprint(f\\"  ŷ=0.50 (uncertain):          {-np.log(1-0.50):.4f}\\")\\nprint(f\\"  ŷ=0.90 (wrong, confident):   {-np.log(1-0.90):.4f}\\")\\nprint(f\\"  ŷ=0.99 (very wrong):         {-np.log(1-0.99):.4f}\\")\\n\\nprint()\\nprint(\\"Key insight: wrong + confident = catastrophic loss (approaches infinity)\\")\\n", "runnable": true }
\`\`\`

The output reveals the **asymmetric penalty structure** of cross-entropy: being confidently correct earns a near-zero loss, while being confidently wrong earns a loss that grows without bound. This is what forces the model to be calibrated.

---

## Part 6 — Practice

\`\`\`fillblank
{ "title": "Implement the Sigmoid Derivative", "prompt": "The sigmoid derivative is σ'(z) = σ(z)(1 − σ(z)). Fill in the blanks to implement it correctly.", "language": "python", "template": "def sigmoid(z):\\n    return 1.0 / (1.0 + np.exp(-z))\\n\\ndef sigmoid_derivative(z):\\n    s = ___(z)\\n    return s * (1 - ___)\\n\\n# Test: sigmoid_derivative(0) should equal 0.25\\nprint(sigmoid_derivative(0))  # Expected: 0.25", "blanks": [ { "answer": "sigmoid", "hint": "Call the sigmoid function on z first, store it as s" }, { "answer": "s", "hint": "The formula is s * (1 - s), so reuse s here" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Complete the BCE Loss Function", "prompt": "Fill in the blanks to implement binary cross-entropy. The formula is: BCE = -(1/N) * Σ[y·log(ŷ) + (1-y)·log(1-ŷ)]", "language": "python", "template": "import numpy as np\\n\\ndef bce_loss(y_true, y_pred, eps=1e-12):\\n    y_pred = np.clip(y_pred, eps, 1 - eps)\\n    per_sample = y_true * np.log(___) + (1 - y_true) * np.log(1 - ___)\\n    return -np.___( per_sample )\\n\\n# Test\\ny_true = np.array([1.0, 0.0, 1.0])\\ny_pred = np.array([0.9, 0.1, 0.8])\\nprint(f'{bce_loss(y_true, y_pred):.4f}')  # Expected: ~0.1643", "blanks": [ { "answer": "y_pred", "hint": "The log of the prediction ŷ goes inside np.log()" }, { "answer": "y_pred", "hint": "Same variable — (1 - y_pred) is the second log argument" }, { "answer": "mean", "hint": "We want the average loss across all N samples" } ] }
\`\`\`

---

## Part 7 — The Full Forward Pass

Here's how sigmoid and BCE fit together in a single forward pass of logistic regression:

\`\`\`algoviz
{ "title": "Logistic Regression Forward Pass", "type": "array", "data": ["x·w+b = z", "σ(z) = ŷ", "BCE(y,ŷ) = L"], "frames": [ { "highlight": [0], "label": "Step 1: Linear combination. Compute logit z = x·w + b (dot product + bias)", "stats": { "input": "x, w, b", "output": "z (any real number)" } }, { "highlight": [1], "label": "Step 2: Sigmoid activation. Squash z into probability ŷ = 1/(1+e^(-z)) ∈ (0,1)", "stats": { "input": "z", "output": "ŷ ∈ (0,1)" } }, { "highlight": [2], "label": "Step 3: Compute BCE loss. L = -(y·log(ŷ) + (1-y)·log(1-ŷ)). This is what gradient descent minimizes.", "stats": { "input": "y (true), ŷ (predicted)", "output": "L ≥ 0" } } ], "speed": 1000 }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Sigmoid and Cross-Entropy", "questions": [ { "question": "What is the output of sigmoid(0)?", "options": ["0", "0.5", "1", "Undefined"], "answer": 1, "explanation": "σ(0) = 1/(1+e^0) = 1/(1+1) = 0.5. A logit of zero means maximum uncertainty — the model assigns equal probability to both classes." }, { "question": "Where does binary cross-entropy loss come from mathematically?", "options": ["It is a heuristic chosen to work well in practice", "It is derived from minimizing mean squared error on probabilities", "It is the negative log-likelihood under the Bernoulli probability model", "It is a special case of Huber loss for probabilities"], "answer": 2, "explanation": "BCE is derived from Maximum Likelihood Estimation. We model P(y|x) = ŷ^y · (1-ŷ)^(1-y), maximize the log-likelihood over all training examples, and negate it to get a minimizable loss. This gives exactly the BCE formula." }, { "question": "What is the gradient of BCE loss with respect to the logit z (after applying sigmoid)?", "options": ["σ(z) · (1 - σ(z))", "y · log(ŷ) + (1-y) · log(1-ŷ)", "ŷ - y", "y - ŷ"], "answer": 2, "explanation": "∂BCE/∂z = ŷ - y. The sigmoid's derivative and the cross-entropy's derivative cancel elegantly through the chain rule. This is why sigmoid + BCE is always paired: the gradient is simply prediction minus ground truth." }, { "question": "A model outputs logit z = −8 for a sample with true label y = 1. What will happen during training?", "options": ["A very large loss and a gradient close to 0 (vanishing gradient on the logit)", "A very large loss and a large gradient (ŷ ≈ 0, so ŷ-y ≈ -1)", "A small loss because the model correctly identifies uncertainty", "The gradient is undefined for z < 0"], "answer": 1, "explanation": "When z = -8, sigmoid(-8) ≈ 0.0003 = ŷ. The loss is -log(0.0003) ≈ 8.1 — very large. The gradient ∂BCE/∂z = ŷ - y ≈ 0.0003 - 1 = -0.9997 — a strong negative gradient that will push z upward. The cancellation ensures gradients do NOT vanish at the logit level, even though σ'(-8) is tiny." }, { "question": "Why do we clip predictions with eps before computing BCE?", "options": ["To speed up computation by avoiding expensive log calls", "To prevent log(0) which is negative infinity, causing numerical instability", "To enforce the output stays above 0.5", "To prevent the sigmoid from saturating"], "answer": 1, "explanation": "log(0) = -∞. If y_pred reaches exactly 0 or 1 due to floating point underflow or overflow in exp(-z), the loss becomes infinite. Clipping at a tiny epsilon (e.g., 1e-12) prevents this without meaningfully changing the loss for normal predictions." } ] }
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The sigmoid function σ(z) = 1/(1+e^{-z}) maps any real logit to a probability in (0,1), making it ideal for binary classification output layers.", "Binary cross-entropy is not arbitrary — it is derived from maximum likelihood estimation by modeling outputs as Bernoulli probabilities and taking the negative log-likelihood.", "The gradient of BCE with respect to the logit z simplifies to (ŷ − y) due to an elegant cancellation between the log derivative and sigmoid derivative, ensuring healthy gradients during training.", "Sigmoid suffers from the vanishing gradient problem in deep hidden layers (saturates near 0 and 1), but remains the correct choice as the output activation for binary classification.", "Always verify your gradient implementation numerically using finite differences: if analytic and numeric gradients agree to ~6 decimal places, your backprop is correct.", "Clip predictions between a small epsilon and 1−epsilon before computing log to prevent log(0) = −∞ numerical errors." ] }
\`\`\`

---

## What's Next

You now have both the mathematical foundation and working NumPy implementations of sigmoid and cross-entropy. In the next lesson, **Gradient Descent for Logistic Regression**, you'll plug these components together: compute predictions with sigmoid, measure error with BCE, compute the gradient \`(ŷ − y)\`, and update weights — closing the training loop and building a complete binary classifier from scratch.`,
      starterCode: `import numpy as np

# Sigmoid Activation and Binary Cross-Entropy Loss
# In logistic regression / binary classification, the sigmoid function
# maps any real value to (0, 1), interpreted as a probability.
#
# From MLE, minimizing negative log-likelihood gives us binary cross-entropy:
#   L(y, y_hat) = -[y * log(y_hat) + (1 - y) * log(1 - y_hat)]
#
# Its gradient w.r.t. the pre-activation z is simply: (y_hat - y)

def sigmoid(z):
    """
    Compute the sigmoid activation: sigma(z) = 1 / (1 + exp(-z))

    Args:
        z: numpy array of pre-activation values (any shape)

    Returns:
        numpy array of the same shape, values in (0, 1)
    """
    # TODO: Implement the sigmoid function
    pass


def binary_cross_entropy(y_true, y_pred):
    """
    Compute mean binary cross-entropy loss over a batch.

    L = -mean( y * log(y_pred) + (1 - y) * log(1 - y_pred) )

    Args:
        y_true: numpy array of true binary labels {0, 1}, shape (N,)
        y_pred: numpy array of predicted probabilities in (0, 1), shape (N,)

    Returns:
        Scalar mean loss value
    """
    # TODO: Implement binary cross-entropy
    # Hint: use np.log — and add a small epsilon (1e-15) inside each log
    # to avoid log(0)
    epsilon = 1e-15
    pass


def bce_gradient(y_true, y_pred):
    """
    Compute the gradient of binary cross-entropy loss w.r.t. the
    pre-activation z, given that y_pred = sigmoid(z).

    When BCE is composed with sigmoid, the gradient simplifies to:
        dL/dz = (y_pred - y_true) / N

    Args:
        y_true: numpy array of true labels, shape (N,)
        y_pred: numpy array of sigmoid outputs, shape (N,)

    Returns:
        numpy array of gradients, shape (N,)
    """
    # TODO: Implement the gradient
    pass


# ----- Verification -----
if __name__ == "__main__":
    np.random.seed(42)
    N = 5
    z = np.array([-2.0, -0.5, 0.0, 0.5, 2.0])
    y_true = np.array([0, 0, 1, 1, 1], dtype=float)

    # TODO: Compute y_pred using your sigmoid function
    y_pred = None

    print("z       :", z)
    print("sigmoid :", y_pred)

    # TODO: Compute the loss
    loss = None
    print(f"BCE loss: {loss:.4f}")

    # TODO: Compute the gradient
    grad = None
    print("Gradient:", grad)

    # Sanity checks
    assert y_pred is not None, "sigmoid not implemented"
    assert np.all(y_pred > 0) and np.all(y_pred < 1), "sigmoid outputs must be in (0, 1)"
    assert abs(sigmoid(0.0) - 0.5) < 1e-9, "sigmoid(0) must equal 0.5"
    assert loss is not None and loss > 0, "loss must be a positive scalar"
    assert grad is not None and grad.shape == z.shape, "gradient shape must match z"
    # Gradient check: grad ≈ (y_pred - y_true) / N
    expected_grad = (y_pred - y_true) / N
    assert np.allclose(grad, expected_grad, atol=1e-9), "gradient formula incorrect"
    print("\\nAll checks passed!")
`,
      solutionCode: `import numpy as np

# Sigmoid Activation and Binary Cross-Entropy Loss
#
# Derivation sketch (MLE → BCE):
#   Assume y | x ~ Bernoulli(sigma(z)), z = w^T x.
#   Log-likelihood for one sample: log p(y|x) = y*log(sigma(z)) + (1-y)*log(1-sigma(z))
#   Negating and averaging over N samples gives binary cross-entropy.
#
# Gradient of BCE w.r.t. z (chain rule):
#   dL/dz = dL/d(y_hat) * d(y_hat)/dz
#         = [(-y/y_hat) + (1-y)/(1-y_hat)] * y_hat*(1-y_hat)
#         = (y_hat - y)          ← the beautiful cancellation
#   Averaged over N: dL/dz = (y_pred - y_true) / N

def sigmoid(z):
    """
    Compute the sigmoid activation: sigma(z) = 1 / (1 + exp(-z))

    Args:
        z: numpy array of pre-activation values (any shape)

    Returns:
        numpy array of the same shape, values in (0, 1)
    """
    return 1.0 / (1.0 + np.exp(-z))


def binary_cross_entropy(y_true, y_pred):
    """
    Compute mean binary cross-entropy loss over a batch.

    L = -mean( y * log(y_pred) + (1 - y) * log(1 - y_pred) )

    Clipping y_pred away from 0 and 1 (via epsilon) prevents log(0) = -inf.

    Args:
        y_true: numpy array of true binary labels {0, 1}, shape (N,)
        y_pred: numpy array of predicted probabilities in (0, 1), shape (N,)

    Returns:
        Scalar mean loss value
    """
    epsilon = 1e-15
    # Clip predictions to avoid numerical instability
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    per_sample_loss = -(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
    return np.mean(per_sample_loss)


def bce_gradient(y_true, y_pred):
    """
    Gradient of BCE loss w.r.t. the pre-activation z, where y_pred = sigmoid(z).

    The sigmoid derivative cancels with the BCE derivative, leaving:
        dL/dz = (y_pred - y_true) / N

    This is why sigmoid + cross-entropy is the standard pairing in logistic
    regression: the gradient is clean and numerically stable.

    Args:
        y_true: numpy array of true labels, shape (N,)
        y_pred: numpy array of sigmoid outputs, shape (N,)

    Returns:
        numpy array of gradients, shape (N,)
    """
    N = len(y_true)
    return (y_pred - y_true) / N


# ----- Verification -----
if __name__ == "__main__":
    np.random.seed(42)
    N = 5
    z = np.array([-2.0, -0.5, 0.0, 0.5, 2.0])
    y_true = np.array([0, 0, 1, 1, 1], dtype=float)

    # Compute predictions via sigmoid
    y_pred = sigmoid(z)

    print("z       :", z)
    print("sigmoid :", np.round(y_pred, 4))

    # Compute the loss
    loss = binary_cross_entropy(y_true, y_pred)
    print(f"BCE loss: {loss:.4f}")

    # Compute the gradient
    grad = bce_gradient(y_true, y_pred)
    print("Gradient:", np.round(grad, 4))

    # Sanity checks
    assert np.all(y_pred > 0) and np.all(y_pred < 1), "sigmoid outputs must be in (0, 1)"
    assert abs(sigmoid(0.0) - 0.5) < 1e-9, "sigmoid(0) must equal 0.5"
    assert loss > 0, "loss must be a positive scalar"
    assert grad.shape == z.shape, "gradient shape must match z"
    expected_grad = (y_pred - y_true) / N
    assert np.allclose(grad, expected_grad, atol=1e-9), "gradient formula incorrect"
    print("\\nAll checks passed!")
`,
    },
    {
      id: "logistic-gradient-descent",
      slug: "logistic-gradient-descent",
      title: "Training Logistic Regression with Gradient Descent",
      content: `# Training Logistic Regression with Gradient Descent

Linear regression predicts a number. Logistic regression predicts a **probability** — and probabilities must live between 0 and 1. The sigmoid function makes that happen. Gradient descent then iteratively nudges the model's parameters until those predicted probabilities closely match the true labels.

In this lesson you will build a complete logistic regression trainer from scratch using only NumPy: the forward pass that transforms raw scores into probabilities, the backward pass that computes exact gradients, and the update loop that minimizes cross-entropy loss epoch by epoch.

---

\`\`\`concept
{ "title": "The Two Phases of Every Training Step", "variant": "mental-model", "content": "Think of training as two alternating moves:\\n\\n**Forward Pass (predict):** Feed features through the model to get a probability ŷ ∈ (0, 1). Measure how wrong you were with the cross-entropy loss.\\n\\n**Backward Pass (learn):** Use calculus to find which direction increases the loss most steeply — the gradient. Then step in the *opposite* direction, shrinking the loss a little.\\n\\nRepeat for hundreds of epochs. The decision boundary sharpens with every step." }
\`\`\`

---

## The Math in Three Lines

Everything in logistic regression flows from three equations:

| Step | Formula | What it does |
|------|---------|--------------|
| Linear combo | \`z = Xw + b\` | Projects features onto a real-valued score |
| Sigmoid | \`ŷ = 1 / (1 + e^{-z})\` | Squashes z into probability (0, 1) |
| Cross-entropy loss | \`L = -mean(y·log(ŷ) + (1-y)·log(1-ŷ))\` | Penalizes confident wrong predictions heavily |

The gradients for the backward pass are derived by applying the chain rule to L. The result is remarkably clean:

\`\`\`
dL/dw = (1/m) × Xᵀ · (ŷ − y)
dL/db = mean(ŷ − y)
\`\`\`

The term \`(ŷ − y)\` is just the **prediction error** — how much ŷ overshoots or undershoots the true label. When ŷ = y exactly, both gradients are zero and parameters stop changing. That is convergence.

> **Numerical stability note:** \`log(0) = -∞\`, which breaks training. Always clip ŷ to \`[1e-9, 1 - 1e-9]\` before computing the loss. It has negligible effect on math but prevents NaN explosions.

---

## Tracing One Forward + Backward Step

Watch every variable transform as we process a single training sample with weights initialized to zero:

\`\`\`trace
{ "title": "Single Forward + Backward Pass (Step by Step)", "language": "python", "code": "import numpy as np\\n\\nx   = np.array([1.0, 2.0])  # one training sample\\ny   = 1.0                    # true label (positive class)\\nw   = np.array([0.0, 0.0])  # weights initialised to zero\\nb   = 0.0                    # bias initialised to zero\\nlr  = 0.1                    # learning rate\\n\\n# Forward pass\\nz     = np.dot(x, w) + b\\ny_hat = 1 / (1 + np.exp(-z))\\nloss  = -(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))\\n\\n# Backward pass\\nerror = y_hat - y\\ndw    = x * error\\ndb    = error\\n\\n# Parameter update\\nw = w - lr * dw\\nb = b - lr * db", "frames": [ { "line": 3, "vars": {"x": "[1.0, 2.0]"}, "note": "Single sample: 2 features" }, { "line": 4, "vars": {"x": "[1.0, 2.0]", "y": 1.0}, "note": "True label = 1 (positive class)" }, { "line": 5, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]"}, "note": "Weights start at zero" }, { "line": 6, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0}, "note": "Bias starts at zero" }, { "line": 10, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0, "z": 0.0}, "note": "z = 1x0 + 2x0 + 0 = 0 — no signal yet" }, { "line": 11, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0, "z": 0.0, "y_hat": 0.5}, "note": "sigmoid(0) = 0.5 — maximum uncertainty, the model knows nothing" }, { "line": 12, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0, "z": 0.0, "y_hat": 0.5, "loss": 0.693}, "note": "Loss = -log(0.5) ≈ 0.693 — high! we need to learn" }, { "line": 15, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0, "z": 0.0, "y_hat": 0.5, "loss": 0.693, "error": -0.5}, "note": "error = ŷ - y = 0.5 - 1.0 = -0.5 (we under-predicted)" }, { "line": 16, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0, "z": 0.0, "y_hat": 0.5, "loss": 0.693, "error": -0.5, "dw": "[-0.5, -1.0]"}, "note": "dw = x * error = [1, 2] * (-0.5) = [-0.5, -1.0]" }, { "line": 17, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.0, 0.0]", "b": 0.0, "z": 0.0, "y_hat": 0.5, "loss": 0.693, "error": -0.5, "dw": "[-0.5, -1.0]", "db": -0.5}, "note": "db = error = -0.5" }, { "line": 20, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.05, 0.1]", "b": 0.0, "z": 0.0, "y_hat": 0.5, "loss": 0.693, "error": -0.5, "dw": "[-0.5, -1.0]", "db": -0.5}, "note": "w = [0,0] - 0.1*[-0.5,-1.0] = [0.05, 0.1] — weights grew toward the signal" }, { "line": 21, "vars": {"x": "[1.0, 2.0]", "y": 1.0, "w": "[0.05, 0.1]", "b": 0.05, "z": 0.0, "y_hat": 0.5, "loss": 0.693, "error": -0.5, "dw": "[-0.5, -1.0]", "db": -0.5}, "note": "b = 0 - 0.1*(-0.5) = 0.05 — bias also adjusts upward" } ], "speed": 900 }
\`\`\`

Notice the key insight: because \`error = -0.5\` (we under-predicted a positive example), the gradients are **negative**, so subtracting them makes both weights and bias increase. The model corrects in exactly the right direction.

---

## Full Implementation: Train on 100 Samples

Now we scale from one sample to a matrix of 100 — and let gradient descent do its work over 200 epochs:

\`\`\`playground
{ "title": "Train Logistic Regression from Scratch", "language": "python", "code": "import numpy as np\\n\\n# --- Toy dataset: 100 samples, 2 features, linearly separable ---\\nnp.random.seed(42)\\nm = 100\\nX = np.random.randn(m, 2)\\ny = (X[:, 0] + X[:, 1] > 0).astype(float)\\n\\n# --- Core functions ---\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-z))\\n\\ndef binary_cross_entropy(y, y_hat):\\n    y_hat = np.clip(y_hat, 1e-9, 1 - 1e-9)  # avoid log(0)\\n    return -np.mean(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))\\n\\n# --- Training loop ---\\ndef train(X, y, lr=0.1, epochs=200):\\n    m, n = X.shape\\n    w = np.zeros(n)   # shape: (2,)\\n    b = 0.0\\n\\n    for epoch in range(epochs):\\n        # Forward pass\\n        z = X @ w + b          # shape: (100,)\\n        y_hat = sigmoid(z)     # shape: (100,), values in (0, 1)\\n        loss = binary_cross_entropy(y, y_hat)\\n\\n        # Backward pass\\n        error = y_hat - y      # shape: (100,)\\n        dw = (X.T @ error) / m # shape: (2,)\\n        db = np.mean(error)    # scalar\\n\\n        # Update parameters\\n        w -= lr * dw\\n        b -= lr * db\\n\\n        if epoch % 50 == 0:\\n            print(f\\"Epoch {epoch:3d} | Loss: {loss:.4f}\\")\\n\\n    return w, b\\n\\nw, b = train(X, y)\\n\\n# --- Evaluate ---\\ny_hat = sigmoid(X @ w + b)\\ny_pred = (y_hat >= 0.5).astype(float)\\naccuracy = np.mean(y_pred == y)\\nprint()\\nprint(f\\"Final accuracy: {accuracy:.1%}\\")\\nprint(f\\"Learned weights: {w.round(3)}\\")\\nprint(f\\"Learned bias:    {b:.3f}\\")", "runnable": true }
\`\`\`

Run this and watch the loss drop from ~0.69 toward ~0.12 over 200 epochs, landing at ~97% accuracy. The weights converge to approximately \`[0.9, 0.9]\` — matching the true rule \`x1 + x2 > 0\` almost exactly.

---

## Practice: Complete the Backward Pass

The forward pass is given. Fill in the three blank expressions to implement the gradients:

\`\`\`fillblank
{ "title": "Implement the Backward Pass", "prompt": "Complete the backward_pass function. The gradients of cross-entropy with respect to w and b are derived from the chain rule.", "language": "python", "template": "def backward_pass(X, y, y_hat):\\n    m = X.shape[0]          # number of training samples\\n    error = ___ - y         # prediction error\\n    dw = (X.T @ ___) / m   # gradient of loss w.r.t. weights\\n    db = np.mean(___)       # gradient of loss w.r.t. bias\\n    return dw, db", "blanks": [ { "answer": "y_hat", "hint": "The gradient formula is (ŷ - y), not (y - ŷ)" }, { "answer": "error", "hint": "The gradient uses the error computed on the line above" }, { "answer": "error", "hint": "Same error vector — averaged over all m samples" } ] }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What does sigmoid(0) equal?", "options": ["0.0", "0.25", "0.5", "1.0"], "answer": 2, "explanation": "sigmoid(0) = 1/(1 + e^0) = 1/2 = 0.5. When z = 0 the model assigns equal probability to both classes — it is maximally uncertain. This is why zero-initialized weights produce ŷ = 0.5 on the very first forward pass." }, { "question": "In gradient descent, how are the weights updated relative to the gradient dw?", "options": ["w = w + lr × dw", "w = w − lr × dw", "w = w × (1 − lr × dw)", "w = w / (lr × dw)"], "answer": 1, "explanation": "We subtract the gradient because we want to descend toward the minimum of the loss surface. The gradient points in the direction of steepest ascent, so moving opposite to it decreases the loss." }, { "question": "What is the shape of dw (gradient of loss w.r.t. weights) for a dataset with m=100 samples and n=2 features?", "options": ["(100,)", "(100, 2)", "(2,)", "scalar"], "answer": 2, "explanation": "dw = Xᵀ · error / m. Xᵀ has shape (2, 100) and error has shape (100,), so Xᵀ @ error produces shape (2,) — one gradient per weight, matching w's shape." }, { "question": "Why do we clip ŷ to [1e-9, 1 − 1e-9] before computing binary cross-entropy?", "options": ["To speed up matrix operations", "To prevent log(0) which equals negative infinity", "To keep predictions within the valid probability range [0, 1]", "To add L2 regularization implicitly"], "answer": 1, "explanation": "log(0) = -∞. If the sigmoid output reaches exactly 0 or 1 (which can happen due to floating-point extremes), the log term becomes undefined, producing NaN values that propagate through the entire model. Clipping prevents this with negligible effect on the math." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The forward pass computes z = Xw + b → ŷ = sigmoid(z) → loss = binary cross-entropy(y, ŷ)", "The backward pass uses the chain rule: gradients are dw = Xᵀ·(ŷ−y)/m and db = mean(ŷ−y)", "Gradient descent subtracts lr × gradient from each parameter every epoch — moving toward lower loss", "Initialize weights to zero: sigmoid(0) = 0.5 gives a neutral starting point before any training", "Clip ŷ before log to avoid log(0) = -∞ and NaN propagation during training" ] }
\`\`\``,
      starterCode: `import numpy as np

# Toy dataset: 2 features, binary labels (0 or 1)
np.random.seed(42)
X = np.array([
    [1.0, 2.0],
    [2.0, 3.0],
    [3.0, 1.0],
    [4.0, 3.0],
    [1.0, 0.5],
    [2.5, 2.5],
])
y = np.array([0, 0, 1, 1, 0, 1])  # binary labels

# Initialize weights and bias
W = np.zeros(X.shape[1])  # shape (2,)
b = 0.0
learning_rate = 0.1
epochs = 100


def sigmoid(z):
    """
    TODO: Implement the sigmoid activation function.
    Formula: sigma(z) = 1 / (1 + exp(-z))
    """
    pass


def forward(X, W, b):
    """
    TODO: Implement the forward pass.
    Steps:
      1. Compute the linear combination z = X @ W + b
      2. Apply sigmoid to get predictions y_hat
    Return y_hat.
    """
    pass


def compute_loss(y, y_hat):
    """
    TODO: Implement binary cross-entropy loss.
    Formula: L = -mean( y*log(y_hat) + (1-y)*log(1-y_hat) )
    Hint: add a small epsilon (1e-8) inside log to avoid log(0).
    """
    pass


def backward(X, y, y_hat):
    """
    TODO: Implement the backward pass.
    The gradients of cross-entropy loss w.r.t. W and b are:
      dW = (1/m) * X.T @ (y_hat - y)
      db = (1/m) * sum(y_hat - y)
    where m is the number of samples.
    Return (dW, db).
    """
    pass


# Training loop
for epoch in range(epochs):
    # TODO: Call forward() to get predictions
    y_hat = None

    # TODO: Call compute_loss() and store in variable \`loss\`
    loss = None

    # TODO: Call backward() to get gradients dW and db
    dW, db = None, None

    # TODO: Update W and b using gradient descent
    # W = W - learning_rate * dW
    # b = b - learning_rate * db

    if epoch % 10 == 0:
        print(f"Epoch {epoch:3d} | Loss: {loss:.4f}")

print("\\nFinal weights:", W)
print("Final bias:   ", b)
print("Predictions:  ", (forward(X, W, b) >= 0.5).astype(int))
print("Ground truth: ", y)
`,
      solutionCode: `import numpy as np

# Toy dataset: 2 features, binary labels (0 or 1)
np.random.seed(42)
X = np.array([
    [1.0, 2.0],
    [2.0, 3.0],
    [3.0, 1.0],
    [4.0, 3.0],
    [1.0, 0.5],
    [2.5, 2.5],
])
y = np.array([0, 0, 1, 1, 0, 1])  # binary labels

# Initialize weights and bias
W = np.zeros(X.shape[1])  # shape (2,)
b = 0.0
learning_rate = 0.1
epochs = 100


def sigmoid(z):
    """Squashes any real number into the range (0, 1)."""
    return 1 / (1 + np.exp(-z))


def forward(X, W, b):
    """Compute predicted probabilities for each sample."""
    z = X @ W + b      # linear combination, shape (m,)
    y_hat = sigmoid(z) # predicted probability of class 1
    return y_hat


def compute_loss(y, y_hat):
    """Binary cross-entropy: measures how far predictions are from true labels."""
    m = len(y)
    eps = 1e-8  # prevents log(0)
    loss = -np.mean(y * np.log(y_hat + eps) + (1 - y) * np.log(1 - y_hat + eps))
    return loss


def backward(X, y, y_hat):
    """
    Compute gradients of loss w.r.t. W and b.

    The elegant result: gradient of cross-entropy + sigmoid is just (y_hat - y),
    so the update rule looks the same as linear regression.
    """
    m = len(y)
    error = y_hat - y            # shape (m,)
    dW = (X.T @ error) / m      # shape (2,)
    db = np.sum(error) / m      # scalar
    return dW, db


# Training loop
for epoch in range(epochs):
    # Forward pass: compute predictions
    y_hat = forward(X, W, b)

    # Compute loss to track learning progress
    loss = compute_loss(y, y_hat)

    # Backward pass: compute gradients
    dW, db = backward(X, y, y_hat)

    # Gradient descent update: move W and b opposite to the gradient
    W = W - learning_rate * dW
    b = b - learning_rate * db

    if epoch % 10 == 0:
        print(f"Epoch {epoch:3d} | Loss: {loss:.4f}")

print("\\nFinal weights:", W)
print("Final bias:   ", b)
print("Predictions:  ", (forward(X, W, b) >= 0.5).astype(int))
print("Ground truth: ", y)
`,
    },
    {
      id: "decision-boundary",
      slug: "decision-boundary",
      title: "Decision Boundaries and Threshold Tuning",
      content: `# Decision Boundaries and Threshold Tuning

Your logistic regression model has finished training. It has learned weights that produce a probability for every input. But how does it *draw the line* between "yes" and "no"? And what happens when that line is in the wrong place?

This lesson answers both questions — from the geometry of the decision boundary to the art of tuning your classification threshold for real-world objectives.

---

## What Is a Decision Boundary?

When logistic regression outputs a probability, it needs a rule to convert that probability into a class label. The simplest rule: if \`P(y=1|x) ≥ 0.5\`, predict class 1; otherwise predict class 0.

The **decision boundary** is the set of all input points where \`P(y=1|x) = 0.5\` exactly — the model is perfectly uncertain. On one side you get class 1, on the other side class 0.

\`\`\`concept
{ "title": "Decision Boundary", "variant": "mental-model", "content": "The decision boundary is a surface in feature space where the model outputs exactly 0.5 probability. Points above the boundary are predicted positive; points below are predicted negative. For logistic regression, this surface is always a hyperplane — a straight line in 2D." }
\`\`\`

For logistic regression, the sigmoid outputs 0.5 when its argument equals 0:

\`\`\`
σ(z) = 0.5  ⟺  z = 0  ⟺  w₁x₁ + w₂x₂ + b = 0
\`\`\`

This is exactly the equation of a line (in 2D) or a hyperplane (in higher dimensions). Logistic regression is a **linear classifier** — it can only draw straight decision boundaries.

\`\`\`callout
{ "type": "info", "title": "Linear Boundaries Only", "content": "Logistic regression can only separate classes that are *linearly separable* — no curved or wavy boundaries. If your data requires a more complex boundary (like an XOR pattern), you need polynomial features or a different model class." }
\`\`\`

---

## Plotting the Decision Boundary

Let's build a logistic regression from scratch and visualize what the learned weights actually look like in feature space.

\`\`\`playground
{ "title": "Logistic Regression: Train and Inspect the Decision Boundary", "language": "python", "code": "import numpy as np\\n\\n# ---- Sigmoid and loss ----\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\\n\\ndef bce_loss(y, y_hat):\\n    eps = 1e-9\\n    return -np.mean(y * np.log(y_hat + eps) + (1 - y) * np.log(1 - y_hat + eps))\\n\\n# ---- Generate separable 2-D data ----\\nnp.random.seed(42)\\nN = 100\\nX_neg = np.random.randn(N, 2) + np.array([-1.5, -1.5])\\nX_pos = np.random.randn(N, 2) + np.array([1.5, 1.5])\\nX = np.vstack([X_neg, X_pos])\\ny = np.array([0] * N + [1] * N)\\n\\n# ---- Train with gradient descent ----\\nw = np.zeros(2)\\nb = 0.0\\nlr = 0.1\\n\\nfor epoch in range(300):\\n    z = X @ w + b\\n    y_hat = sigmoid(z)\\n    error = y_hat - y\\n    w -= lr * (X.T @ error) / len(y)\\n    b -= lr * np.mean(error)\\n\\n# ---- Decision boundary: w[0]*x1 + w[1]*x2 + b = 0\\n# Solving for x2: x2 = -(w[0]*x1 + b) / w[1]\\nx1_range = np.linspace(-4, 4, 100)\\nx2_boundary = -(w[0] * x1_range + b) / w[1]\\n\\nprint(f'Learned weights: w = {w.round(3)}, b = {b:.3f}')\\nprint(f'Loss: {bce_loss(y, sigmoid(X @ w + b)):.4f}')\\nprint()\\nprint('Decision boundary: x2 = {:.3f}*x1 + {:.3f}'.format(-w[0]/w[1], -b/w[1]))\\nprint()\\n\\n# ---- Evaluate at threshold = 0.5 ----\\nprobs = sigmoid(X @ w + b)\\npreds = (probs >= 0.5).astype(int)\\naccuracy = np.mean(preds == y)\\nprint(f'Accuracy at threshold 0.5: {accuracy*100:.1f}%')\\n\\n# Show a few probabilities near the boundary\\nprint('\\\\nSample probabilities (sorted):')\\nfor i in np.argsort(np.abs(probs - 0.5))[:8]:\\n    print(f'  x={X[i].round(2)}, P(y=1)={probs[i]:.3f}, pred={preds[i]}, true={y[i]}')\\n", "runnable": true }
\`\`\`

The decision boundary formula \`x2 = -(w[0]/w[1]) * x1 - b/w[1]\` comes directly from rearranging the linear equation. Notice the model outputs probabilities close to 0.5 for points *near* the boundary — these are the model's most uncertain predictions.

---

## Tracing Through a Prediction

Let's trace exactly how a single point gets classified — from raw features to final label.

\`\`\`trace
{ "title": "Classification: From Features to Label", "language": "python", "code": "w = [1.8, 1.9]\\nb = -0.3\\nx = [1.2, 0.4]\\n\\nz = w[0]*x[0] + w[1]*x[1] + b\\nprob = 1 / (1 + 2.718**(-z))\\nthreshold = 0.5\\nlabel = 1 if prob >= threshold else 0\\nprint(label)", "frames": [ { "line": 4, "vars": { "w": "[1.8, 1.9]", "b": -0.3, "x": "[1.2, 0.4]" }, "note": "Input: feature vector x = [1.2, 0.4]" }, { "line": 6, "vars": { "z": 2.62 }, "note": "Compute linear combination: z = 1.8×1.2 + 1.9×0.4 + (-0.3) = 2.62" }, { "line": 7, "vars": { "z": 2.62, "prob": 0.932 }, "note": "Sigmoid squashes z → probability: σ(2.62) ≈ 0.932" }, { "line": 8, "vars": { "threshold": 0.5 }, "note": "Apply threshold: if prob ≥ 0.5, predict 1" }, { "line": 9, "vars": { "label": 1 }, "note": "prob (0.932) ≥ threshold (0.5) → label = 1 ✓", "stdout": "" }, { "line": 10, "vars": { "label": 1 }, "note": "Final prediction: class 1 (positive)", "stdout": "1" } ], "speed": 900 }
\`\`\`

---

## Why 0.5 Isn't Always the Right Threshold

The default threshold of 0.5 treats false positives and false negatives as equally bad. In practice, they rarely are.

\`\`\`concept
{ "title": "The Asymmetry of Errors", "variant": "insight", "content": "In fraud detection, a false negative (missing real fraud) costs thousands of dollars. A false positive (flagging a legitimate transaction) costs one customer service call. These are not symmetric — you want high recall even at the cost of precision. Threshold tuning lets you encode this business logic without retraining." }
\`\`\`

### Precision and Recall Refresher

| Metric | Formula | Optimized By |
|--------|---------|--------------|
| **Precision** | TP / (TP + FP) | Raising the threshold |
| **Recall** | TP / (TP + FN) | Lowering the threshold |
| **F1 Score** | 2 × P×R / (P+R) | Balanced compromise |

\`\`\`callout
{ "type": "warning", "title": "The Precision-Recall Tradeoff", "content": "Raising the threshold → fewer positives predicted → higher precision, lower recall. Lowering the threshold → more positives predicted → higher recall, lower precision. You cannot improve both simultaneously with threshold tuning alone — it requires a better model." }
\`\`\`

---

## Threshold Tuning in Practice

\`\`\`playground
{ "title": "Sweep Thresholds: Observe Precision-Recall Tradeoff", "language": "python", "code": "import numpy as np\\n\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\\n\\nnp.random.seed(0)\\n\\n# Simulate a trained model's output probabilities\\n# Imbalanced: 80% negative, 20% positive (like fraud detection)\\nN_neg, N_pos = 800, 200\\nprobs_neg = np.random.beta(2, 6, N_neg)   # most negatives score low\\nprobs_pos = np.random.beta(5, 2, N_pos)   # most positives score high\\n\\nprobs = np.concatenate([probs_neg, probs_pos])\\ny_true = np.array([0]*N_neg + [1]*N_pos)\\n\\ndef metrics_at_threshold(probs, y_true, threshold):\\n    preds = (probs >= threshold).astype(int)\\n    TP = np.sum((preds == 1) & (y_true == 1))\\n    FP = np.sum((preds == 1) & (y_true == 0))\\n    FN = np.sum((preds == 0) & (y_true == 1))\\n    TN = np.sum((preds == 0) & (y_true == 0))\\n    precision = TP / (TP + FP + 1e-9)\\n    recall    = TP / (TP + FN + 1e-9)\\n    f1        = 2 * precision * recall / (precision + recall + 1e-9)\\n    return precision, recall, f1, TP, FP, FN\\n\\nprint(f'{'Threshold':>10}  {'Precision':>9}  {'Recall':>7}  {'F1':>6}  {'TP':>4}  {'FP':>4}  {'FN':>4}')\\nprint('-' * 65)\\nfor t in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]:\\n    p, r, f1, tp, fp, fn = metrics_at_threshold(probs, y_true, t)\\n    print(f'{t:>10.1f}  {p:>9.3f}  {r:>7.3f}  {f1:>6.3f}  {tp:>4}  {fp:>4}  {fn:>4}')\\n\\nprint('\\\\n--- Best F1 threshold ---')\\nbest_t, best_f1 = 0.5, 0\\nfor t in np.linspace(0.01, 0.99, 200):\\n    _, _, f1, _, _, _ = metrics_at_threshold(probs, y_true, t)\\n    if f1 > best_f1:\\n        best_f1, best_t = f1, t\\nprint(f'Optimal threshold = {best_t:.2f}, F1 = {best_f1:.3f}')\\n", "runnable": true }
\`\`\`

Run this and examine the table. Notice:
- At **threshold = 0.2**: recall is very high — you catch almost all fraud, but many false alarms (FP is large)
- At **threshold = 0.8**: precision is high — when you flag fraud, you're almost always right, but you miss a lot
- The F1 sweep finds the threshold where both are best balanced

---

## Visualizing the Tradeoff: ROC Space

The **ROC curve** plots True Positive Rate (Recall) vs False Positive Rate at every possible threshold.

\`\`\`algoviz
{ "title": "ROC Curve — Each Point is a Different Threshold", "type": "array", "data": [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "frames": [ { "highlight": [0], "label": "Threshold = 0.2: High recall (0.95), high FPR (0.40) — catch everything, many false alarms", "stats": { "threshold": 0.2, "TPR": 0.95, "FPR": 0.40 } }, { "highlight": [1], "label": "Threshold = 0.3: TPR = 0.90, FPR = 0.28 — still strong recall", "stats": { "threshold": 0.3, "TPR": 0.90, "FPR": 0.28 } }, { "highlight": [2], "label": "Threshold = 0.4: TPR = 0.82, FPR = 0.18 — improving precision", "stats": { "threshold": 0.4, "TPR": 0.82, "FPR": 0.18 } }, { "highlight": [3], "label": "Threshold = 0.5 (default): TPR = 0.72, FPR = 0.10 — balanced but not optimal", "stats": { "threshold": 0.5, "TPR": 0.72, "FPR": 0.10 } }, { "highlight": [4], "label": "Threshold = 0.6: Precision climbs, recall drops", "stats": { "threshold": 0.6, "TPR": 0.60, "FPR": 0.06 } }, { "highlight": [5], "label": "Threshold = 0.7: Very precise, missing ~40% of positives", "stats": { "threshold": 0.7, "TPR": 0.55, "FPR": 0.03 } }, { "highlight": [6], "label": "Threshold = 0.8: Only very confident positives flagged", "stats": { "threshold": 0.8, "TPR": 0.40, "FPR": 0.01 } }, { "highlight": [7], "label": "Threshold = 0.9: Extreme precision — but missing most fraud", "stats": { "threshold": 0.9, "TPR": 0.20, "FPR": 0.00 } } ], "speed": 1000 }
\`\`\`

\`\`\`concept
{ "title": "AUC-ROC: Threshold-Independent Performance", "variant": "rule", "content": "The Area Under the ROC Curve (AUC) measures overall model quality independent of any specific threshold. AUC = 1.0 is perfect; AUC = 0.5 is a random classifier. AUC tells you how well the model *ranks* positives above negatives. Once you have a good AUC, threshold tuning picks the operating point." }
\`\`\`

---

## Computing the Full ROC Curve

\`\`\`playground
{ "title": "Build and Evaluate the ROC Curve", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\n# Simulate model probabilities (same setup as before)\\nN_neg, N_pos = 800, 200\\nprobs_neg = np.random.beta(2, 6, N_neg)\\nprobs_pos = np.random.beta(5, 2, N_pos)\\nprobs = np.concatenate([probs_neg, probs_pos])\\ny_true = np.array([0]*N_neg + [1]*N_pos)\\n\\nthresholds = np.linspace(0, 1, 100)\\ntprs, fprs = [], []\\n\\nfor t in thresholds:\\n    preds = (probs >= t).astype(int)\\n    TP = np.sum((preds == 1) & (y_true == 1))\\n    FP = np.sum((preds == 1) & (y_true == 0))\\n    FN = np.sum((preds == 0) & (y_true == 1))\\n    TN = np.sum((preds == 0) & (y_true == 0))\\n    tprs.append(TP / (TP + FN + 1e-9))\\n    fprs.append(FP / (FP + TN + 1e-9))\\n\\n# AUC via trapezoidal rule\\nfprs_arr = np.array(fprs[::-1])\\ntprs_arr = np.array(tprs[::-1])\\nauc = np.trapz(tprs_arr, fprs_arr)\\n\\nprint(f'AUC-ROC: {auc:.4f}')\\nprint()\\n\\n# Find the Youden J statistic threshold (maximizes TPR - FPR)\\nyouden = np.array(tprs) - np.array(fprs)\\nbest_idx = np.argmax(youden)\\nbest_t = thresholds[best_idx]\\nprint(f'Youden J optimal threshold: {best_t:.2f}')\\nprint(f'  TPR = {tprs[best_idx]:.3f}, FPR = {fprs[best_idx]:.3f}')\\n\\n# Print a mini ROC table\\nprint()\\nprint('ROC curve sample points:')\\nprint(f'{'FPR':>6}  {'TPR':>6}  {'Threshold':>10}')\\nfor i in range(0, 100, 10):\\n    print(f'{fprs[i]:>6.3f}  {tprs[i]:>6.3f}  {thresholds[i]:>10.2f}')\\n", "runnable": true }
\`\`\`

---

## Choosing Your Threshold Strategy

Different scenarios demand different optimization targets:

\`\`\`tabs
{ "tabs": [ { "label": "Fraud Detection", "icon": "🚨", "content": "**Goal:** Minimize false negatives (missed fraud).\\n\\n**Strategy:** Lower the threshold below 0.5. A threshold of 0.2–0.3 is common.\\n\\n**Metric to optimize:** Recall (catch as much fraud as possible).\\n\\n**Acceptable cost:** Higher false positive rate — more legitimate transactions flagged for review.\\n\\n\`\`\`python\\n# Find threshold that achieves recall >= 0.95\\nfor t in np.arange(0.01, 1.0, 0.01):\\n    preds = (probs >= t).astype(int)\\n    recall = TP / (TP + FN)\\n    if recall >= 0.95:\\n        print(f'Threshold: {t:.2f} achieves recall = {recall:.3f}')\\n        break\\n\`\`\`" }, { "label": "Medical Screening", "icon": "🏥", "content": "**Goal:** Minimize false negatives (missing a disease).\\n\\n**Strategy:** Very low threshold — err heavily toward flagging positives.\\n\\n**Metric to optimize:** Recall / Sensitivity (catching all actual cases).\\n\\n**Acceptable cost:** High false positive rate. Patients flagged incorrectly will receive follow-up testing.\\n\\n**Note:** In high-stakes medicine, thresholds may be set by clinical guidelines rather than purely ML metrics." }, { "label": "Spam Filter", "icon": "📧", "content": "**Goal:** Minimize false positives (real email in spam folder).\\n\\n**Strategy:** Raise the threshold above 0.5. Only flag as spam when very confident.\\n\\n**Metric to optimize:** Precision (when flagged, it really is spam).\\n\\n**Acceptable cost:** Some spam slips through — better than losing important emails.\\n\\n\`\`\`python\\n# Find threshold that achieves precision >= 0.99\\nfor t in np.arange(0.99, 0.0, -0.01):\\n    preds = (probs >= t).astype(int)\\n    precision = TP / (TP + FP + 1e-9)\\n    if precision >= 0.99:\\n        best_t = t\\nprint(f'Min threshold for 99% precision: {best_t:.2f}')\\n\`\`\`" }, { "label": "Balanced (F1)", "icon": "⚖️", "content": "**Goal:** Balance precision and recall equally.\\n\\n**Strategy:** Find threshold that maximizes F1 score on the validation set.\\n\\n**When to use:** When false positives and false negatives have similar costs.\\n\\n\`\`\`python\\nbest_f1, best_t = 0, 0.5\\nfor t in np.arange(0.01, 1.0, 0.01):\\n    preds = (probs >= t).astype(int)\\n    TP = np.sum((preds == 1) & (y_true == 1))\\n    FP = np.sum((preds == 1) & (y_true == 0))\\n    FN = np.sum((preds == 0) & (y_true == 1))\\n    p = TP / (TP + FP + 1e-9)\\n    r = TP / (TP + FN + 1e-9)\\n    f1 = 2 * p * r / (p + r + 1e-9)\\n    if f1 > best_f1:\\n        best_f1, best_t = f1, t\\nprint(f'Best F1 threshold: {best_t:.2f}, F1 = {best_f1:.3f}')\\n\`\`\`" } ] }
\`\`\`

---

## Practice: Fill in the Gaps

\`\`\`fillblank
{ "title": "Implement Threshold-Based Evaluation", "prompt": "Complete the function that computes precision and recall at a given threshold:", "language": "python", "template": "def evaluate(probs, y_true, threshold):\\n    preds = (probs >= ___).astype(int)\\n    TP = np.sum((preds == 1) & (y_true == ___))\\n    FP = np.sum((preds == 1) & (y_true == 0))\\n    FN = np.sum((preds == ___) & (y_true == 1))\\n    precision = TP / (TP + ___ + 1e-9)\\n    recall    = TP / (TP + ___ + 1e-9)\\n    return precision, recall", "blanks": [ { "answer": "threshold", "hint": "What value do we compare probabilities against?" }, { "answer": "1", "hint": "True Positives: predicted positive AND actually..." }, { "answer": "0", "hint": "False Negatives: predicted negative (0), actually positive" }, { "answer": "FP", "hint": "Precision denominator: TP + false positives" }, { "answer": "FN", "hint": "Recall denominator: TP + false negatives" } ] }
\`\`\`

---

## Common Pitfalls

\`\`\`callout
{ "type": "danger", "title": "Never Tune the Threshold on Your Test Set", "content": "Threshold tuning should happen on a held-out **validation set**, not the test set. If you search over thresholds using test data, you are essentially training on it — the result will overfit to test noise and won't generalize. Split: train → validation (threshold search) → test (final report)." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Imbalanced Classes Distort the 0.5 Default", "content": "When 95% of your data is class 0, a model can get 95% accuracy by always predicting 0. The default threshold perpetuates this. Always check class distribution first. With imbalanced data, use precision-recall curves and F1 rather than accuracy as your primary metric." }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Decision Boundaries and Threshold Tuning", "questions": [ { "question": "What does the decision boundary represent in a logistic regression model?", "options": [ "The set of points where the model outputs the maximum probability", "The set of points where the model outputs probability = 0.5 (equal uncertainty)", "The hyperplane that separates all training examples without error", "The line connecting the centroids of the two class clusters" ], "answer": 1, "explanation": "The decision boundary is where P(y=1|x) = 0.5 — the model assigns equal probability to both classes. It is defined by w·x + b = 0, since σ(0) = 0.5." }, { "question": "A medical screening model currently has recall = 0.72 and precision = 0.85. To catch more cases of disease (increase recall), what should you do?", "options": [ "Retrain the model with more features", "Raise the classification threshold above 0.5", "Lower the classification threshold below 0.5", "Normalize the input features before prediction" ], "answer": 2, "explanation": "Lowering the threshold means the model predicts positive at lower probability values, catching more true positives (higher recall). The cost is more false positives (lower precision), which is acceptable in medical screening." }, { "question": "Which statement about the ROC AUC score is correct?", "options": [ "AUC measures model performance at a specific threshold of 0.5", "AUC = 0.5 means the model has perfect discrimination", "AUC measures the model's ability to rank positives above negatives, independent of threshold", "AUC penalizes models that output probabilities instead of hard labels" ], "answer": 2, "explanation": "AUC-ROC integrates performance across all thresholds, measuring how well the model ranks positives above negatives. AUC = 1.0 is perfect; AUC = 0.5 is random (no discrimination ability)." }, { "question": "You are building a spam filter where false positives (real email in spam) are very costly. Which threshold strategy makes sense?", "options": [ "Lower the threshold to 0.2 to maximize recall", "Raise the threshold to 0.9 to maximize precision", "Use threshold = 0.5 since it is always balanced", "Remove all threshold tuning and use raw probabilities" ], "answer": 1, "explanation": "When false positives are costly (real email incorrectly flagged as spam), you want high precision. Raising the threshold means the model only predicts spam when it is very confident, reducing false positives at the expense of some missed spam." }, { "question": "Why is threshold tuning NOT the same as hyperparameter tuning?", "options": [ "Threshold tuning retrains the model weights; hyperparameter tuning does not", "Threshold tuning adjusts how the model's output probabilities are interpreted, while hyperparameter tuning affects how the model learns its weights", "Hyperparameter tuning only applies to neural networks, not logistic regression", "Threshold tuning uses the test set; hyperparameter tuning uses the training set" ], "answer": 1, "explanation": "Threshold tuning is a post-training step: the model's weights are fixed, and you only change the cutoff used to convert probabilities to labels. Hyperparameter tuning (like regularization strength) affects the learning process and changes the model itself." } ] }
\`\`\`

---

## Putting It All Together: Full Pipeline

\`\`\`steps
{ "title": "End-to-End: Train, Evaluate, and Tune", "steps": [ { "title": "Train the model", "content": "Fit logistic regression weights using gradient descent on your training set. The model learns \`w\` and \`b\` that minimize binary cross-entropy loss." }, { "title": "Generate validation probabilities", "content": "Run \`sigmoid(X_val @ w + b)\` to get probability scores for every validation example. Do NOT use the test set yet." }, { "title": "Define your objective metric", "content": "Choose what you're optimizing:\\n- **Recall** → fraud detection, medical screening\\n- **Precision** → spam filters, recommendation systems\\n- **F1** → balanced tradeoff\\n- **Youden J** → maximizes TPR − FPR, common in diagnostics" }, { "title": "Sweep thresholds on validation set", "content": "\`\`\`python\\nbest_score, best_t = 0, 0.5\\nfor t in np.linspace(0.01, 0.99, 200):\\n    p, r, f1 = compute_metrics(val_probs, y_val, t)\\n    if f1 > best_score:  # or recall, or precision\\n        best_score, best_t = f1, t\\n\`\`\`" }, { "title": "Report final metrics on test set", "content": "Apply the single chosen threshold to your test set **once**. Report precision, recall, F1, and AUC. Never re-tune after looking at test results." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The decision boundary is where a logistic regression model outputs P(y=1) = 0.5 — defined by the linear equation w·x + b = 0", "Logistic regression produces only linear boundaries; complex patterns require nonlinear models or feature engineering", "The default threshold of 0.5 is rarely optimal — it assumes false positives and false negatives are equally costly", "Lowering the threshold increases recall (catches more positives) but decreases precision; raising it does the opposite", "Threshold tuning happens post-training on a validation set, not the test set", "AUC-ROC measures overall model quality independent of threshold; threshold selection picks the operating point for deployment", "Always ask: which error (false positive vs false negative) is more costly in your specific application?" ] }
\`\`\``,
      starterCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, confusion_matrix

# Generate a binary classification dataset
X, y = make_classification(
    n_samples=500, n_features=2, n_informative=2,
    n_redundant=0, random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train a logistic regression classifier
model = LogisticRegression()
model.fit(X_train, y_train)

# TODO 1: Get predicted probabilities for the positive class (class 1)
# on the test set using model.predict_proba()
# Store the probabilities in a variable called \`y_proba\`
y_proba = None

# TODO 2: Define a list of thresholds to evaluate
# Use np.arange() to create thresholds from 0.1 to 0.9 in steps of 0.1
thresholds = None

# TODO 3: Loop over each threshold and compute precision and recall
# For each threshold:
#   - Convert probabilities to binary predictions: 1 if prob >= threshold, else 0
#   - Compute precision and recall using precision_score() and recall_score()
#   - Print: "Threshold: {t:.1f} | Precision: {p:.3f} | Recall: {r:.3f}"
print("Threshold | Precision | Recall")
print("-" * 35)
for t in (thresholds if thresholds is not None else []):
    # TODO: apply threshold to y_proba
    y_pred = None
    # TODO: compute precision and recall
    precision = None
    recall = None
    print(f"  {t:.1f}     |   {precision:.3f}   |  {recall:.3f}")

# TODO 4: Identify the threshold where precision and recall are closest
# (i.e., minimise abs(precision - recall))
# Print that threshold and its precision/recall values
best_threshold = None
print(f"\\nBest balanced threshold: {best_threshold}")
`,
      solutionCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score

# Generate a binary classification dataset
X, y = make_classification(
    n_samples=500, n_features=2, n_informative=2,
    n_redundant=0, random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train a logistic regression classifier
model = LogisticRegression()
model.fit(X_train, y_train)

# Step 1: Get predicted probabilities for the positive class
# predict_proba returns [[prob_class0, prob_class1], ...]
# We take column index 1 for the positive class probability
y_proba = model.predict_proba(X_test)[:, 1]

# Step 2: Define thresholds from 0.1 to 0.9
thresholds = np.arange(0.1, 1.0, 0.1)

# Step 3: Evaluate precision and recall at each threshold
# Higher threshold → model is more conservative → higher precision, lower recall
# Lower threshold → model flags more positives → higher recall, lower precision
results = []
print("Threshold | Precision | Recall")
print("-" * 35)
for t in thresholds:
    # Apply the threshold: positive prediction if probability >= t
    y_pred = (y_proba >= t).astype(int)

    # zero_division=0 handles the edge case where no positives are predicted
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)

    results.append((t, precision, recall))
    print(f"  {t:.1f}     |   {precision:.3f}   |  {recall:.3f}")

# Step 4: Find the threshold where precision and recall are closest
# This is the "balanced" point on the precision-recall curve
best = min(results, key=lambda x: abs(x[1] - x[2]))
best_threshold, best_precision, best_recall = best
print(f"\\nBest balanced threshold: {best_threshold:.1f}")
print(f"  Precision: {best_precision:.3f}")
print(f"  Recall:    {best_recall:.3f}")
print("\\nKey insight: lowering the threshold increases recall (catches more positives)")
print("but reduces precision (more false positives). Choose based on your use case.")
`,
    },
    {
      id: "evaluation-metrics",
      slug: "evaluation-metrics",
      title: "Evaluation Metrics: Accuracy, Precision, Recall, F1, ROC-AUC",
      content: `# Evaluation Metrics: Accuracy, Precision, Recall, F1, ROC-AUC

Your logistic regression model just finished training. It says "97% accurate!" — should you celebrate?

Not so fast. If 97% of your dataset is "not spam," a model that *always* predicts "not spam" is 97% accurate — and completely useless. This lesson teaches you to see through that illusion, and implement every major evaluation metric from scratch using only NumPy.

---

## The Confusion Matrix: Your Model's Report Card

Before computing any metric, you need to understand what your model got right *and* wrong. The **confusion matrix** organizes predictions into four categories:

\`\`\`concept
{ "title": "The Four Outcomes of Binary Classification", "variant": "mental-model", "content": "Every prediction falls into one of four buckets:\\n\\n- **True Positive (TP):** Predicted positive, actually positive. A correct alarm.\\n- **True Negative (TN):** Predicted negative, actually negative. Correctly stayed silent.\\n- **False Positive (FP):** Predicted positive, actually negative. A false alarm (Type I error).\\n- **False Negative (FN):** Predicted negative, actually positive. A missed detection (Type II error).\\n\\nAll metrics are derived from these four numbers." }
\`\`\`

Here's how the matrix looks visually:

|  | **Predicted Positive** | **Predicted Negative** |
|---|---|---|
| **Actually Positive** | TP (hit) | FN (miss) |
| **Actually Negative** | FP (false alarm) | TN (correct reject) |

\`\`\`callout
{ "type": "warning", "title": "FP vs FN: The Cost Asymmetry", "content": "In most real problems, FP and FN have *very different* costs. Missing a cancer diagnosis (FN) is far worse than a false positive requiring a follow-up test. The right metric depends on which error is more costly in your domain." }
\`\`\`

---

## Building the Confusion Matrix from Scratch

\`\`\`playground
{ "title": "Confusion Matrix from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef confusion_matrix(y_true, y_pred):\\n    \\"\\"\\"Compute TP, FP, FN, TN from ground truth and predictions.\\"\\"\\"\\n    y_true = np.array(y_true)\\n    y_pred = np.array(y_pred)\\n    \\n    TP = np.sum((y_pred == 1) & (y_true == 1))\\n    TN = np.sum((y_pred == 0) & (y_true == 0))\\n    FP = np.sum((y_pred == 1) & (y_true == 0))\\n    FN = np.sum((y_pred == 0) & (y_true == 1))\\n    \\n    return TP, TN, FP, FN\\n\\n# Simulated predictions on a medical test dataset\\n# 1 = disease present, 0 = healthy\\ny_true = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0,\\n          1, 0, 1, 0, 1, 0, 1, 0, 0, 1]\\ny_pred = [1, 1, 0, 1, 0, 0, 0, 1, 0, 0,\\n          1, 0, 1, 1, 0, 0, 1, 0, 0, 1]\\n\\nTP, TN, FP, FN = confusion_matrix(y_true, y_pred)\\nprint(f'True  Positives (TP): {TP}')\\nprint(f'True  Negatives (TN): {TN}')\\nprint(f'False Positives (FP): {FP}')\\nprint(f'False Negatives (FN): {FN}')\\nprint(f'\\\\nMatrix:')\\nprint(f'  Predicted:  POS   NEG')\\nprint(f'Actual POS:  {TP:3d}   {FN:3d}')\\nprint(f'Actual NEG:  {FP:3d}   {TN:3d}')\\nprint(f'\\\\nTotal samples: {TP+TN+FP+FN}')", "runnable": true }
\`\`\`

---

## The Five Core Metrics

\`\`\`tabs
{ "tabs": [
  { "label": "Accuracy", "icon": "🎯", "content": "### Accuracy\\n\\n**Formula:** (TP + TN) / (TP + TN + FP + FN)\\n\\nAccuracy measures the fraction of all predictions that were correct.\\n\\n**When to use:** Only when classes are balanced (roughly equal positives and negatives).\\n\\n**When it misleads:** On imbalanced datasets. A model predicting all-negative on a 99% negative dataset has 99% accuracy but zero utility.\\n\\n\`\`\`python\\ndef accuracy(TP, TN, FP, FN):\\n    return (TP + TN) / (TP + TN + FP + FN)\\n\`\`\`" },
  { "label": "Precision", "icon": "🔬", "content": "### Precision\\n\\n**Formula:** TP / (TP + FP)\\n\\nOf all the times your model said \\"positive\\", how often was it right?\\n\\n**Intuition:** Precision is about *trust*. High precision means when the model raises an alarm, you can trust it.\\n\\n**When to care most about precision:** Spam filters (don't delete real emails), ad targeting (don't annoy uninterested users).\\n\\n\`\`\`python\\ndef precision(TP, FP):\\n    return TP / (TP + FP) if (TP + FP) > 0 else 0.0\\n\`\`\`" },
  { "label": "Recall", "icon": "🔍", "content": "### Recall (Sensitivity)\\n\\n**Formula:** TP / (TP + FN)\\n\\nOf all the actual positives, how many did your model catch?\\n\\n**Intuition:** Recall is about *coverage*. High recall means the model misses very few real positives.\\n\\n**When to care most about recall:** Disease screening (catch all sick patients), fraud detection (catch all fraud), safety-critical systems.\\n\\n\`\`\`python\\ndef recall(TP, FN):\\n    return TP / (TP + FN) if (TP + FN) > 0 else 0.0\\n\`\`\`" },
  { "label": "F1 Score", "icon": "⚖️", "content": "### F1 Score\\n\\n**Formula:** 2 × (Precision × Recall) / (Precision + Recall)\\n\\nF1 is the **harmonic mean** of precision and recall. It penalizes extreme imbalance between the two.\\n\\n**Why harmonic mean?** Arithmetic mean (P+R)/2 would reward a model that gets 100% precision with 0% recall. The harmonic mean forces both to be high.\\n\\n**Example:**\\n- Model A: Precision=0.9, Recall=0.1 → F1 = 0.18 (bad)\\n- Model B: Precision=0.7, Recall=0.7 → F1 = 0.70 (good)\\n\\n\`\`\`python\\ndef f1_score(precision, recall):\\n    if precision + recall == 0:\\n        return 0.0\\n    return 2 * (precision * recall) / (precision + recall)\\n\`\`\`" },
  { "label": "ROC-AUC", "icon": "📈", "content": "### ROC Curve and AUC\\n\\nROC (Receiver Operating Characteristic) plots the **True Positive Rate** vs **False Positive Rate** across all possible classification thresholds.\\n\\n- **TPR (Recall):** TP / (TP + FN) — how many positives we catch\\n- **FPR:** FP / (FP + TN) — how many negatives we wrongly flag\\n\\n**AUC (Area Under the Curve):** A single number summarizing the ROC curve.\\n- AUC = 1.0: Perfect classifier\\n- AUC = 0.5: Random guessing (the diagonal line)\\n- AUC = 0.0: Perfectly wrong (every prediction flipped)\\n\\n**Key insight:** AUC measures *ranking quality* — can your model correctly rank a random positive above a random negative?" }
] }
\`\`\`

---

## Implementing All Metrics Together

\`\`\`playground
{ "title": "All Metrics from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass BinaryClassifierMetrics:\\n    def __init__(self, y_true, y_pred, threshold=0.5):\\n        y_true = np.array(y_true)\\n        y_scores = np.array(y_pred)\\n        y_pred_binary = (y_scores >= threshold).astype(int)\\n        \\n        self.TP = int(np.sum((y_pred_binary == 1) & (y_true == 1)))\\n        self.TN = int(np.sum((y_pred_binary == 0) & (y_true == 0)))\\n        self.FP = int(np.sum((y_pred_binary == 1) & (y_true == 0)))\\n        self.FN = int(np.sum((y_pred_binary == 0) & (y_true == 1)))\\n        self.y_true = y_true\\n        self.y_scores = y_scores\\n    \\n    def accuracy(self):\\n        total = self.TP + self.TN + self.FP + self.FN\\n        return (self.TP + self.TN) / total\\n    \\n    def precision(self):\\n        denom = self.TP + self.FP\\n        return self.TP / denom if denom > 0 else 0.0\\n    \\n    def recall(self):\\n        denom = self.TP + self.FN\\n        return self.TP / denom if denom > 0 else 0.0\\n    \\n    def f1(self):\\n        p, r = self.precision(), self.recall()\\n        return 2 * p * r / (p + r) if (p + r) > 0 else 0.0\\n    \\n    def roc_auc(self):\\n        \\"\\"\\"Compute AUC using the trapezoidal rule.\\"\\"\\"\\n        thresholds = np.sort(np.unique(self.y_scores))[::-1]\\n        tprs, fprs = [0.0], [0.0]\\n        \\n        pos = np.sum(self.y_true == 1)\\n        neg = np.sum(self.y_true == 0)\\n        \\n        for t in thresholds:\\n            pred = (self.y_scores >= t).astype(int)\\n            tp = np.sum((pred == 1) & (self.y_true == 1))\\n            fp = np.sum((pred == 1) & (self.y_true == 0))\\n            tprs.append(tp / pos)\\n            fprs.append(fp / neg)\\n        \\n        tprs.append(1.0); fprs.append(1.0)\\n        # Trapezoidal rule: area = sum of trapezoids\\n        auc = np.trapz(tprs, fprs)\\n        return abs(auc)  # abs handles descending FPR order\\n    \\n    def report(self):\\n        print('=' * 40)\\n        print('       CLASSIFICATION REPORT')\\n        print('=' * 40)\\n        print(f'  Confusion Matrix:')\\n        print(f'    TP={self.TP}  FN={self.FN}')\\n        print(f'    FP={self.FP}  TN={self.TN}')\\n        print('-' * 40)\\n        print(f'  Accuracy : {self.accuracy():.4f}')\\n        print(f'  Precision: {self.precision():.4f}')\\n        print(f'  Recall   : {self.recall():.4f}')\\n        print(f'  F1 Score : {self.f1():.4f}')\\n        print(f'  ROC-AUC  : {self.roc_auc():.4f}')\\n        print('=' * 40)\\n\\n# --- Test on an imbalanced dataset ---\\nnp.random.seed(42)\\n# 90% negative, 10% positive\\ny_true = np.array([0]*90 + [1]*10)\\nnp.random.shuffle(y_true)\\n\\n# A lazy model: always predicts 0 (negative)\\ny_scores_lazy = np.zeros(100)  # all zeros → all negative\\n\\n# A decent model\\ny_scores_decent = np.where(y_true == 1,\\n    np.random.uniform(0.55, 0.95, 100),\\n    np.random.uniform(0.05, 0.55, 100))\\n\\nprint('--- LAZY MODEL (always predicts negative) ---')\\nBinaryClassifierMetrics(y_true, y_scores_lazy).report()\\n\\nprint('\\\\n--- DECENT MODEL ---')\\nBinaryClassifierMetrics(y_true, y_scores_decent).report()", "runnable": true }
\`\`\`

---

## Tracing the Precision-Recall Trade-off

As you lower the classification threshold, you catch more positives (recall goes up) but also make more false alarms (precision goes down). This is the **precision-recall trade-off**.

\`\`\`trace
{ "title": "Threshold Effect on Precision & Recall", "language": "python", "code": "import numpy as np\\n\\ny_true  = [1, 1, 0, 1, 0, 0, 1, 0]\\ny_scores = [0.9, 0.75, 0.6, 0.55, 0.45, 0.4, 0.35, 0.2]\\nthreshold = 0.5\\npred = [1 if s >= threshold else 0 for s in y_scores]\\nTP = sum((p==1 and t==1) for p,t in zip(pred,y_true))\\nFP = sum((p==1 and t==0) for p,t in zip(pred,y_true))\\nFN = sum((p==0 and t==1) for p,t in zip(pred,y_true))\\nprecision = TP / (TP + FP)\\nrecall = TP / (TP + FN)", "frames": [
  { "line": 4, "vars": { "threshold": 0.5, "pred": "computing..." }, "note": "Threshold=0.5: predict 1 if score >= 0.5", "stdout": "" },
  { "line": 4, "vars": { "threshold": 0.5, "pred": "[1,1,1,1,0,0,0,0]" }, "note": "Scores 0.9,0.75,0.6,0.55 are >= 0.5 → predicted positive", "stdout": "" },
  { "line": 5, "vars": { "TP": 3, "threshold": 0.5 }, "note": "TP=3: caught positives at scores 0.9, 0.75, 0.55", "stdout": "" },
  { "line": 6, "vars": { "TP": 3, "FP": 1, "threshold": 0.5 }, "note": "FP=1: score 0.6 was negative but predicted positive", "stdout": "" },
  { "line": 7, "vars": { "TP": 3, "FP": 1, "FN": 1, "threshold": 0.5 }, "note": "FN=1: score 0.35 was positive but predicted negative", "stdout": "" },
  { "line": 8, "vars": { "precision": 0.75, "threshold": 0.5 }, "note": "Precision = 3/(3+1) = 0.75", "stdout": "" },
  { "line": 9, "vars": { "precision": 0.75, "recall": 0.75, "threshold": 0.5 }, "note": "Recall = 3/(3+1) = 0.75. Lower threshold → more recall, less precision.", "stdout": "threshold=0.5: precision=0.75, recall=0.75" }
], "speed": 900 }
\`\`\`

---

## The Precision-Recall Spectrum

\`\`\`concept
{ "title": "High Precision vs High Recall: Pick Your Priority", "variant": "rule", "content": "**High Precision (minimize FP):** Use when false alarms are costly.\\n- Spam filter: Don't delete real emails\\n- Content moderation: Don't silence valid speech\\n- Ad recommendation: Don't irritate users\\n\\n**High Recall (minimize FN):** Use when missed detections are costly.\\n- Cancer screening: Don't miss sick patients\\n- Fraud detection: Don't let fraud through\\n- Security alerts: Don't miss intrusions\\n\\n**F1 Score:** Use when you need a single balanced metric for model selection.\\n\\n**ROC-AUC:** Use when you want threshold-independent evaluation, or when comparing models regardless of operating point." }
\`\`\`

---

## Visualizing the ROC Curve

\`\`\`playground
{ "title": "Draw the ROC Curve (ASCII)", "language": "python", "code": "import numpy as np\\n\\ndef compute_roc(y_true, y_scores):\\n    y_true = np.array(y_true)\\n    y_scores = np.array(y_scores)\\n    thresholds = np.sort(np.unique(y_scores))[::-1]\\n    \\n    pos = np.sum(y_true == 1)\\n    neg = np.sum(y_true == 0)\\n    tprs, fprs = [], []\\n    \\n    for t in thresholds:\\n        pred = (y_scores >= t).astype(int)\\n        tp = np.sum((pred == 1) & (y_true == 1))\\n        fp = np.sum((pred == 1) & (y_true == 0))\\n        tprs.append(tp / pos)\\n        fprs.append(fp / neg)\\n    \\n    auc = abs(np.trapz([0] + tprs + [1], [0] + fprs + [1]))\\n    return fprs, tprs, auc\\n\\ndef ascii_roc(fprs, tprs, auc, size=20):\\n    grid = [['.' for _ in range(size)] for _ in range(size)]\\n    # Draw diagonal (random baseline)\\n    for i in range(size):\\n        grid[size-1-i][i] = '-'\\n    # Plot ROC points\\n    for fpr, tpr in zip(fprs, tprs):\\n        x = min(int(fpr * size), size-1)\\n        y = min(int((1-tpr) * size), size-1)\\n        grid[y][x] = '*'\\n    \\n    print(f'ROC Curve  (AUC = {auc:.3f})')\\n    print('TPR')\\n    print('1.0 +' + '-'*size + '+')\\n    for row in grid:\\n        print('    |' + ''.join(row) + '|')\\n    print('0.0 +' + '-'*size + '+')\\n    print('    0.0' + ' '*14 + '1.0  FPR')\\n    print('  * = our model    - = random baseline (AUC=0.5)')\\n\\n# Generate two models for comparison\\nnp.random.seed(7)\\nn = 200\\ny_true = (np.random.rand(n) > 0.6).astype(int)\\n\\n# Strong model\\nscores_strong = np.where(y_true == 1,\\n    np.random.beta(5, 2, n),\\n    np.random.beta(2, 5, n))\\n\\nfprs, tprs, auc = compute_roc(y_true, scores_strong)\\nascii_roc(fprs, tprs, auc)\\n\\nprint()\\n# Weak model (barely better than random)\\nscores_weak = np.where(y_true == 1,\\n    np.random.beta(2, 2, n),\\n    np.random.beta(2, 2, n))\\nfprs2, tprs2, auc2 = compute_roc(y_true, scores_weak)\\nprint(f'Weak model AUC: {auc2:.3f}')", "runnable": true }
\`\`\`

---

## Confusion Matrix Walkthrough

\`\`\`algoviz
{ "title": "Building a Confusion Matrix Step by Step", "type": "array", "data": [1, 0, 1, 1, 0, 1, 0, 0, 1, 0], "frames": [
  { "highlight": [], "label": "Ground truth labels: 1=positive, 0=negative", "stats": { "TP": 0, "TN": 0, "FP": 0, "FN": 0 } },
  { "highlight": [0], "label": "Index 0: true=1, pred=1 → TRUE POSITIVE", "stats": { "TP": 1, "TN": 0, "FP": 0, "FN": 0 } },
  { "highlight": [1], "label": "Index 1: true=0, pred=0 → TRUE NEGATIVE", "stats": { "TP": 1, "TN": 1, "FP": 0, "FN": 0 } },
  { "highlight": [2], "label": "Index 2: true=1, pred=0 → FALSE NEGATIVE (missed!)", "stats": { "TP": 1, "TN": 1, "FP": 0, "FN": 1 } },
  { "highlight": [3], "label": "Index 3: true=1, pred=1 → TRUE POSITIVE", "stats": { "TP": 2, "TN": 1, "FP": 0, "FN": 1 } },
  { "highlight": [4], "label": "Index 4: true=0, pred=1 → FALSE POSITIVE (false alarm!)", "stats": { "TP": 2, "TN": 1, "FP": 1, "FN": 1 } },
  { "highlight": [5], "label": "Index 5: true=1, pred=1 → TRUE POSITIVE", "stats": { "TP": 3, "TN": 1, "FP": 1, "FN": 1 } },
  { "highlight": [6, 7], "label": "Index 6,7: true=0, pred=0 → TRUE NEGATIVES", "stats": { "TP": 3, "TN": 3, "FP": 1, "FN": 1 } },
  { "highlight": [8], "label": "Index 8: true=1, pred=1 → TRUE POSITIVE", "stats": { "TP": 4, "TN": 3, "FP": 1, "FN": 1 } },
  { "highlight": [9], "label": "Index 9: true=0, pred=0 → TRUE NEGATIVE", "stats": { "TP": 4, "TN": 4, "FP": 1, "FN": 1 } },
  { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "Final: Precision=4/5=0.8, Recall=4/5=0.8, F1=0.8", "stats": { "TP": 4, "TN": 4, "FP": 1, "FN": 1 } }
], "speed": 800 }
\`\`\`

---

## Practice: Fill in the Formulas

\`\`\`fillblank
{ "title": "Implement Precision and Recall", "prompt": "Complete the precision and recall functions. Precision = TP / (TP + FP). Recall = TP / (TP + FN).", "language": "python", "template": "import numpy as np\\n\\ndef precision(TP, FP):\\n    if TP + FP == 0:\\n        return 0.0\\n    return ___ / (TP + ___)\\n\\ndef recall(TP, FN):\\n    if TP + FN == 0:\\n        return 0.0\\n    return ___ / (TP + ___)\\n\\n# Test\\nprint(precision(8, 2))   # Expected: 0.8\\nprint(recall(8, 4))      # Expected: 0.666...", "blanks": [
  { "answer": "TP", "hint": "The numerator for precision is the true positives" },
  { "answer": "FP", "hint": "The denominator adds false positives to TP" },
  { "answer": "TP", "hint": "The numerator for recall is also the true positives" },
  { "answer": "FN", "hint": "The denominator for recall adds false negatives to TP" }
] }
\`\`\`

---

## When to Use Each Metric

| Metric | Best When | Watch Out For |
|--------|-----------|---------------|
| **Accuracy** | Balanced classes | Useless on imbalanced data |
| **Precision** | FP cost is high | Ignores FN entirely |
| **Recall** | FN cost is high | Can be 1.0 by predicting all positive |
| **F1** | Need balance of P & R | Ignores TN, treats P and R equally |
| **ROC-AUC** | Comparing models; imbalanced data | Can be misleading with very skewed classes (use PR-AUC instead) |

\`\`\`callout
{ "type": "tip", "title": "Imbalanced Datasets: Use F1 or PR-AUC", "content": "When your dataset has many more negatives than positives (e.g., fraud detection at 0.1% positive rate), accuracy and ROC-AUC can both look good while your model still mostly fails. For heavily imbalanced problems, **Precision-Recall AUC** is more informative than ROC-AUC." }
\`\`\`

---

## Putting It All Together: Model Comparison

\`\`\`playground
{ "title": "Compare Three Models on an Imbalanced Dataset", "language": "python", "code": "import numpy as np\\n\\nclass Metrics:\\n    @staticmethod\\n    def compute(y_true, y_pred_binary, y_scores=None):\\n        TP = np.sum((y_pred_binary==1) & (y_true==1))\\n        TN = np.sum((y_pred_binary==0) & (y_true==0))\\n        FP = np.sum((y_pred_binary==1) & (y_true==0))\\n        FN = np.sum((y_pred_binary==0) & (y_true==1))\\n        \\n        acc = (TP+TN)/(TP+TN+FP+FN)\\n        prec = TP/(TP+FP) if (TP+FP)>0 else 0\\n        rec  = TP/(TP+FN) if (TP+FN)>0 else 0\\n        f1   = 2*prec*rec/(prec+rec) if (prec+rec)>0 else 0\\n        \\n        auc = 0.5\\n        if y_scores is not None:\\n            pos = np.sum(y_true==1)\\n            neg = np.sum(y_true==0)\\n            thresholds = np.sort(np.unique(y_scores))[::-1]\\n            tprs, fprs = [0],[0]\\n            for t in thresholds:\\n                p = (y_scores>=t).astype(int)\\n                tprs.append(np.sum((p==1)&(y_true==1))/pos)\\n                fprs.append(np.sum((p==1)&(y_true==0))/neg)\\n            tprs.append(1); fprs.append(1)\\n            auc = abs(np.trapz(tprs, fprs))\\n        \\n        return dict(acc=acc, prec=prec, rec=rec, f1=f1, auc=auc)\\n\\nnp.random.seed(0)\\nn = 1000\\ny_true = (np.random.rand(n) < 0.1).astype(int)  # 10% positive\\n\\n# Model A: Always predicts negative\\nscores_a = np.zeros(n)\\n\\n# Model B: Random scores (no real learning)\\nscores_b = np.random.rand(n)\\n\\n# Model C: Good discriminator\\nscores_c = np.where(y_true==1,\\n    np.random.beta(6, 2, n),\\n    np.random.beta(2, 6, n))\\n\\nmodels = {'Always-Negative': scores_a,\\n          'Random':          scores_b,\\n          'Good Model':      scores_c}\\n\\nprint(f'{'Model':<20} {'Accuracy':>9} {'Precision':>10} {'Recall':>7} {'F1':>7} {'AUC':>7}')\\nprint('-' * 65)\\nfor name, scores in models.items():\\n    pred = (scores >= 0.5).astype(int)\\n    m = Metrics.compute(y_true, pred, scores)\\n    print(f'{name:<20} {m[\\"acc\\"]:>9.3f} {m[\\"prec\\"]:>10.3f} {m[\\"rec\\"]:>7.3f} {m[\\"f1\\"]:>7.3f} {m[\\"auc\\"]:>7.3f}')", "runnable": true }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Evaluation Metrics Quiz", "questions": [
  {
    "question": "A spam filter misclassifies 5 legitimate emails as spam (FP=5) but catches 95 of 100 spam emails (TP=95, FN=5). There are 900 legitimate emails. What is the precision?",
    "options": ["95/100 = 0.95", "95/(95+5) = 0.95", "95/(95+5) ≈ 0.95", "90/(95+5) ≈ 0.95 — wait, TP/(TP+FP) = 95/100 = 0.95"],
    "answer": 1,
    "explanation": "Precision = TP / (TP + FP) = 95 / (95 + 5) = 95/100 = 0.95. Out of 100 emails flagged as spam, 95 were actually spam."
  },
  {
    "question": "Your cancer screening model has 99% accuracy on a dataset where 1% of patients have cancer. Why is this misleading?",
    "options": [
      "Accuracy is always misleading for medical data",
      "A model predicting everyone is healthy achieves 99% accuracy while detecting zero cancer cases",
      "Precision should be used instead of accuracy for all datasets",
      "The model should use a different threshold"
    ],
    "answer": 1,
    "explanation": "On a 99%-healthy dataset, predicting 'healthy' for everyone gives 99% accuracy with TP=0, FN=all_sick. The model catches zero cancer cases. This is the class imbalance problem — accuracy is useless here."
  },
  {
    "question": "Model A has Precision=0.90, Recall=0.10. Model B has Precision=0.70, Recall=0.70. Which has a higher F1 score?",
    "options": [
      "Model A (higher precision wins)",
      "Model B (balanced P and R gives higher F1)",
      "They are equal because their precision+recall sums are the same",
      "Cannot determine without more information"
    ],
    "answer": 1,
    "explanation": "F1(A) = 2 × 0.9 × 0.1 / (0.9 + 0.1) = 0.18/1.0 = 0.18. F1(B) = 2 × 0.7 × 0.7 / (0.7 + 0.7) = 0.98/1.4 ≈ 0.70. The harmonic mean severely penalizes imbalance between precision and recall."
  },
  {
    "question": "What does an ROC-AUC of 0.5 mean?",
    "options": [
      "The model is 50% accurate",
      "The model performs at chance — no better than random guessing",
      "The model's recall equals its precision",
      "The model should use a 0.5 threshold"
    ],
    "answer": 1,
    "explanation": "AUC = 0.5 means the ROC curve lies on the diagonal — the model cannot distinguish positive from negative samples at any threshold. It performs equivalently to random guessing."
  },
  {
    "question": "You are building a fraud detection system. Missing a fraudulent transaction (FN) costs $500. Blocking a legitimate transaction (FP) costs $5 in customer service. Which metric should guide your model selection?",
    "options": [
      "Precision — minimize false positives",
      "Accuracy — overall correctness matters most",
      "Recall — minimize false negatives to catch most fraud",
      "F1 — always use a balanced metric"
    ],
    "answer": 2,
    "explanation": "When FN cost >> FP cost, recall is the priority metric. Missing fraud at $500/miss is 100x worse than blocking a legitimate transaction. You want to catch as many fraudulent transactions as possible, accepting more false alarms."
  }
] }
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The confusion matrix (TP, TN, FP, FN) is the foundation of all binary classification metrics.",
  "Accuracy is misleading on imbalanced datasets — a model predicting all-negative can achieve high accuracy while being useless.",
  "Precision answers 'when we predict positive, how often are we right?' — minimize FP.",
  "Recall answers 'of all actual positives, how many did we catch?' — minimize FN.",
  "F1 is the harmonic mean of precision and recall — it punishes models that sacrifice one for the other.",
  "ROC-AUC measures ranking quality across all thresholds; it equals the probability that the model ranks a random positive above a random negative.",
  "Choose your metric based on the cost of FP vs FN in your specific domain, not convention."
] }
\`\`\`

---

**Next up:** Now that you can evaluate a classifier rigorously, the next lesson covers **Regularization in Logistic Regression** — using L1 and L2 penalties to prevent overfitting and improve generalization on unseen data.`,
      starterCode: `import numpy as np

# Binary classification predictions and ground truth
y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 0])
y_scores = np.array([0.9, 0.1, 0.8, 0.3, 0.2, 0.95, 0.6, 0.05, 0.85, 0.4])


def confusion_matrix(y_true, y_pred):
    """
    Compute the confusion matrix.
    Returns (TP, FP, FN, TN) as a tuple.
    """
    # TODO: Compute True Positives (predicted 1, actually 1)
    TP = None

    # TODO: Compute False Positives (predicted 1, actually 0)
    FP = None

    # TODO: Compute False Negatives (predicted 0, actually 1)
    FN = None

    # TODO: Compute True Negatives (predicted 0, actually 0)
    TN = None

    return TP, FP, FN, TN


def accuracy(TP, FP, FN, TN):
    """Fraction of all predictions that are correct."""
    # TODO: return (correct predictions) / (total predictions)
    pass


def precision(TP, FP):
    """Of all positive predictions, how many are actually positive?"""
    # TODO: return TP / (TP + FP); handle division by zero -> return 0.0
    pass


def recall(TP, FN):
    """Of all actual positives, how many did we catch?"""
    # TODO: return TP / (TP + FN); handle division by zero -> return 0.0
    pass


def f1_score(prec, rec):
    """Harmonic mean of precision and recall."""
    # TODO: return 2 * (precision * recall) / (precision + recall)
    # Handle the case where precision + recall == 0 -> return 0.0
    pass


def roc_auc(y_true, y_scores):
    """
    Compute ROC-AUC using the trapezoidal rule.
    Steps:
      1. Sort thresholds from high to low (use unique scores + inf sentinel)
      2. At each threshold, compute TPR = TP/(TP+FN) and FPR = FP/(FP+TN)
      3. Use np.trapz to integrate the ROC curve (AUC)
    """
    # TODO: get sorted thresholds (descending), including a sentinel of +inf
    thresholds = None

    tprs, fprs = [], []
    for thresh in thresholds:
        # TODO: predict 1 where y_scores >= thresh
        preds = None

        # TODO: compute TP, FP, FN, TN for these preds
        TP, FP, FN, TN = None, None, None, None

        # TODO: compute TPR (sensitivity) and FPR (1 - specificity)
        tpr = None
        fpr = None

        tprs.append(tpr)
        fprs.append(fpr)

    # TODO: use np.trapz(tprs, fprs) to compute area under the curve
    # Note: fprs should be increasing for trapz, so sort if needed
    return None


# --- Run and print results ---
TP, FP, FN, TN = confusion_matrix(y_true, y_pred)
print(f"Confusion Matrix  -> TP={TP}, FP={FP}, FN={FN}, TN={TN}")

prec = precision(TP, FP)
rec  = recall(TP, FN)
f1   = f1_score(prec, rec)
auc  = roc_auc(y_true, y_scores)

print(f"Accuracy  : {accuracy(TP, FP, FN, TN):.4f}")
print(f"Precision : {prec:.4f}")
print(f"Recall    : {rec:.4f}")
print(f"F1 Score  : {f1:.4f}")
print(f"ROC-AUC   : {auc:.4f}")
`,
      solutionCode: `import numpy as np

# Binary classification predictions and ground truth
y_true   = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred   = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 0])
y_scores = np.array([0.9, 0.1, 0.8, 0.3, 0.2, 0.95, 0.6, 0.05, 0.85, 0.4])


def confusion_matrix(y_true, y_pred):
    """
    Compute the four cells of the confusion matrix via boolean masks.
    TP: model said 1, truth is 1
    FP: model said 1, truth is 0
    FN: model said 0, truth is 1
    TN: model said 0, truth is 0
    """
    TP = int(np.sum((y_pred == 1) & (y_true == 1)))
    FP = int(np.sum((y_pred == 1) & (y_true == 0)))
    FN = int(np.sum((y_pred == 0) & (y_true == 1)))
    TN = int(np.sum((y_pred == 0) & (y_true == 0)))
    return TP, FP, FN, TN


def accuracy(TP, FP, FN, TN):
    """Fraction of correct predictions over all samples."""
    return (TP + TN) / (TP + FP + FN + TN)


def precision(TP, FP):
    """
    Of everything the model labelled positive, how many are truly positive?
    High precision -> few false alarms.
    """
    return TP / (TP + FP) if (TP + FP) > 0 else 0.0


def recall(TP, FN):
    """
    Of all actual positives, how many did the model catch?
    High recall -> few missed positives.
    """
    return TP / (TP + FN) if (TP + FN) > 0 else 0.0


def f1_score(prec, rec):
    """
    Harmonic mean of precision and recall.
    Balances both concerns; useful when classes are imbalanced.
    """
    return 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0.0


def roc_auc(y_true, y_scores):
    """
    ROC-AUC via threshold sweep + trapezoidal integration.

    At each threshold we ask: "classify as positive if score >= threshold".
    Sweeping from high to low traces the ROC curve from (0,0) to (1,1).
    AUC = area under that curve (1.0 is perfect, 0.5 is random).
    """
    # Sentinel +inf ensures the first point is (FPR=0, TPR=0)
    thresholds = np.sort(np.unique(np.append(y_scores, np.inf)))[::-1]

    tprs, fprs = [], []
    for thresh in thresholds:
        preds = (y_scores >= thresh).astype(int)
        TP, FP, FN, TN = confusion_matrix(y_true, preds)

        # TPR (True Positive Rate / Sensitivity): TP / P
        tpr = TP / (TP + FN) if (TP + FN) > 0 else 0.0
        # FPR (False Positive Rate): FP / N
        fpr = FP / (FP + TN) if (FP + TN) > 0 else 0.0

        tprs.append(tpr)
        fprs.append(fpr)

    # np.trapz integrates y over x; fprs must be increasing
    fprs = np.array(fprs)
    tprs = np.array(tprs)
    # Sort by FPR ascending so trapz moves left-to-right
    order = np.argsort(fprs)
    return float(np.trapz(tprs[order], fprs[order]))


# --- Run and print results ---
TP, FP, FN, TN = confusion_matrix(y_true, y_pred)
print(f"Confusion Matrix  -> TP={TP}, FP={FP}, FN={FN}, TN={TN}")
# Expected: TP=4, FP=1, FN=1, TN=4

prec = precision(TP, FP)
rec  = recall(TP, FN)
f1   = f1_score(prec, rec)
auc  = roc_auc(y_true, y_scores)

print(f"Accuracy  : {accuracy(TP, FP, FN, TN):.4f}")  # 0.8000
print(f"Precision : {prec:.4f}")                        # 0.8000
print(f"Recall    : {rec:.4f}")                         # 0.8000
print(f"F1 Score  : {f1:.4f}")                          # 0.8000
print(f"ROC-AUC   : {auc:.4f}")                         # ~0.9600
`,
    },
    {
      id: "multiclass-softmax",
      slug: "multiclass-softmax",
      title: "Multiclass Classification with Softmax",
      content: `# Multiclass Classification with Softmax

Binary classification draws a single line — is this email spam or not? But most real problems have more than two answers: is this handwritten digit 0 through 9? Is this news article politics, sports, or tech? Multiclass classification handles exactly these scenarios, and **softmax** is the key that unlocks them.

In this lesson you'll extend logistic regression to *K* classes, derive softmax from first principles, implement categorical cross-entropy, and compare softmax against the simpler one-vs-rest baseline — all in pure NumPy.

---

## From Binary to K Classes

Recall binary logistic regression: you compute one score \`z = w·x + b\`, pass it through sigmoid to get P(y=1), and P(y=0) = 1 − P(y=1).

With *K* classes you need *K* scores — one per class — and you need them to form a proper probability distribution (non-negative, sum to 1). That's precisely what the softmax function delivers.

\`\`\`concept
{ "title": "Softmax as a Probability Projector", "variant": "mental-model", "content": "Softmax takes a vector of raw scores (logits) — which can be any real numbers — and projects them onto the probability simplex: a K-dimensional space where all values are between 0 and 1 and sum to exactly 1. Think of it as normalizing a vote count: if class A gets 10 votes and class B gets 5, A wins with probability 10/15 ≈ 0.67. Softmax does the same, but with exponentials to amplify differences." }
\`\`\`

---

## The Softmax Formula

Given a logit vector **z** = [z₁, z₂, …, z_K], the softmax output for class k is:

$$\\text{softmax}(\\mathbf{z})_k = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}}$$

The exponential does two things: it forces all values positive (even if logits are negative), and it amplifies differences — a logit 2 points higher than another becomes ~7× more likely after exponentiation.

\`\`\`callout
{ "type": "warning", "title": "Numerical Instability", "content": "Computing exp(z) directly overflows when z is large (e.g. exp(1000) = inf). The standard fix: subtract the max before exponentiating.\\n\\n\`softmax(z) = softmax(z - max(z))\`\\n\\nThis is mathematically identical (the constant cancels in numerator and denominator) but prevents overflow entirely." }
\`\`\`

### Visualizing Softmax Step-by-Step

\`\`\`algoviz
{ "title": "Softmax on 4 Logits", "type": "array", "data": [2.0, 1.0, 0.1, -1.0], "frames": [ { "highlight": [0,1,2,3], "label": "Raw logits: z = [2.0, 1.0, 0.1, -1.0]", "stats": { "step": "input" } }, { "highlight": [0,1,2,3], "label": "Subtract max (2.0): shifted = [0.0, -1.0, -1.9, -3.0]", "stats": { "max": 2.0, "step": "shift" } }, { "highlight": [0], "label": "Exponentiate: exp(0.0) = 1.000", "stats": { "exp_0": 1.0 } }, { "highlight": [1], "label": "Exponentiate: exp(-1.0) = 0.368", "stats": { "exp_1": 0.368 } }, { "highlight": [2], "label": "Exponentiate: exp(-1.9) = 0.150", "stats": { "exp_2": 0.150 } }, { "highlight": [3], "label": "Exponentiate: exp(-3.0) = 0.050", "stats": { "exp_3": 0.050 } }, { "highlight": [0,1,2,3], "label": "Sum of exponentials = 1.568", "stats": { "sum": 1.568 } }, { "highlight": [0,1,2,3], "label": "Divide each by sum → probabilities: [0.638, 0.234, 0.096, 0.032]", "stats": { "sum_probs": 1.0, "step": "normalize" } } ], "speed": 900 }
\`\`\`

---

## Implementing Softmax in NumPy

\`\`\`playground
{ "title": "Softmax from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef softmax(z):\\n    \\"\\"\\"Numerically stable softmax for a 1D logit vector.\\"\\"\\"\\n    shifted = z - np.max(z)          # subtract max for stability\\n    exp_z   = np.exp(shifted)\\n    return exp_z / np.sum(exp_z)\\n\\n# --- Try it ---\\nlogits = np.array([2.0, 1.0, 0.1, -1.0])\\nprobs  = softmax(logits)\\n\\nprint(\\"Logits:       \\", logits)\\nprint(\\"Softmax probs:\\", np.round(probs, 4))\\nprint(\\"Sum of probs: \\", np.sum(probs))   # must be 1.0\\n\\n# Batch version — rows are samples, columns are classes\\ndef softmax_batch(Z):\\n    \\"\\"\\"Z shape: (N, K) — N samples, K classes.\\"\\"\\"\\n    shifted = Z - Z.max(axis=1, keepdims=True)\\n    exp_Z   = np.exp(shifted)\\n    return exp_Z / exp_Z.sum(axis=1, keepdims=True)\\n\\nZ_batch = np.array([[2.0, 1.0, 0.1],\\n                     [0.5, 2.5, 0.3],\\n                     [-1., 0.0, 1.5]])\\nP_batch = softmax_batch(Z_batch)\\nprint(\\"\\\\nBatch probs (each row sums to 1):\\")\\nprint(np.round(P_batch, 4))\\nprint(\\"Row sums:\\", np.round(P_batch.sum(axis=1), 6))", "runnable": true }
\`\`\`

---

## Categorical Cross-Entropy Loss

For *K* classes the loss function is **categorical cross-entropy**. Given the true one-hot label **y** and predicted probabilities **ŷ** = softmax(**z**):

$$\\mathcal{L} = -\\sum_{k=1}^{K} y_k \\log(\\hat{y}_k)$$

Because **y** is one-hot (exactly one 1, rest 0s), this simplifies to just:

$$\\mathcal{L} = -\\log(\\hat{y}_{\\text{true}})$$

You only pay attention to the probability assigned to the *correct* class. A confident correct prediction (ŷ_true ≈ 1) gives near-zero loss; a wrong confident prediction (ŷ_true ≈ 0) gives huge loss (−log(ε) → ∞).

\`\`\`trace
{ "title": "Cross-Entropy Loss Calculation", "language": "python", "code": "import numpy as np\\n\\ny_true = np.array([0, 1, 0])      # true class is index 1\\nlogits = np.array([0.5, 2.0, 0.3])\\n\\ndef softmax(z):\\n    e = np.exp(z - z.max())\\n    return e / e.sum()\\n\\nprobs = softmax(logits)\\ncorrect_prob = probs[1]           # class 1 probability\\nloss = -np.log(correct_prob)\\nprint(loss)", "frames": [ { "line": 3, "vars": { "y_true": "[0,1,0]", "logits": "[0.5, 2.0, 0.3]" }, "note": "True label is class 1 (one-hot encoded)" }, { "line": 9, "vars": { "probs": "[0.207, 0.649, 0.144]" }, "note": "Softmax converts logits to probabilities — class 1 gets 64.9%" }, { "line": 10, "vars": { "correct_prob": 0.649 }, "note": "We only care about the probability at the true class index" }, { "line": 11, "vars": { "loss": 0.433 }, "note": "-log(0.649) = 0.433 — low loss since model is fairly confident", "stdout": "0.4329" } ], "speed": 1000 }
\`\`\`

### Gradient of Softmax + Cross-Entropy

The beautiful result from combining softmax with cross-entropy is that the gradient simplifies dramatically:

$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}} = \\hat{\\mathbf{y}} - \\mathbf{y}$$

This is **identical in form** to binary logistic regression's gradient (ŷ − y), just extended to vectors. The weight update for class k's weight vector **w_k** is:

$$\\mathbf{w}_k \\leftarrow \\mathbf{w}_k - \\alpha \\cdot (\\hat{y}_k - y_k) \\cdot \\mathbf{x}$$

---

## Building a Full Softmax Classifier

\`\`\`playground
{ "title": "Softmax Classifier — Full Training Loop", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\n# ── Synthetic 3-class dataset ──────────────────────────────────\\nN, K = 150, 3\\n# 3 Gaussian clusters\\nX = np.vstack([\\n    np.random.randn(50, 2) + [0,  3],   # class 0\\n    np.random.randn(50, 2) + [3, -1],   # class 1\\n    np.random.randn(50, 2) + [-3,-1],   # class 2\\n])\\ny = np.array([0]*50 + [1]*50 + [2]*50)\\n\\n# One-hot encode labels\\nY = np.zeros((N, K))\\nY[np.arange(N), y] = 1\\n\\n# ── Softmax helpers ────────────────────────────────────────────\\ndef softmax(Z):\\n    Z_s = Z - Z.max(axis=1, keepdims=True)\\n    E   = np.exp(Z_s)\\n    return E / E.sum(axis=1, keepdims=True)\\n\\ndef cross_entropy_loss(P, Y):\\n    eps = 1e-12\\n    return -np.mean(np.sum(Y * np.log(P + eps), axis=1))\\n\\ndef accuracy(P, y):\\n    return np.mean(np.argmax(P, axis=1) == y)\\n\\n# ── Initialize weights ─────────────────────────────────────────\\nW = np.random.randn(2, K) * 0.01   # (features, classes)\\nb = np.zeros(K)                      # (classes,)\\nlr = 0.1\\n\\n# ── Training loop ─────────────────────────────────────────────\\nfor epoch in range(200):\\n    # Forward pass\\n    Z = X @ W + b                    # (N, K)\\n    P = softmax(Z)                   # (N, K)\\n\\n    # Gradients\\n    dZ = (P - Y) / N                 # (N, K)\\n    dW = X.T @ dZ                    # (features, K)\\n    db = dZ.sum(axis=0)              # (K,)\\n\\n    # Update\\n    W -= lr * dW\\n    b -= lr * db\\n\\n    if epoch % 50 == 0:\\n        loss = cross_entropy_loss(P, Y)\\n        acc  = accuracy(P, y)\\n        print(f\\"Epoch {epoch:3d} | Loss: {loss:.4f} | Acc: {acc:.2%}\\")\\n\\n# Final evaluation\\nZ_final = X @ W + b\\nP_final = softmax(Z_final)\\nprint(f\\"\\\\nFinal accuracy: {accuracy(P_final, y):.2%}\\")", "runnable": true }
\`\`\`

---

## One-vs-Rest: The Baseline Approach

Before softmax existed as a unified multiclass solution, practitioners used **one-vs-rest (OvR)** — also called one-vs-all (OvA). The idea is simple: train *K* independent binary classifiers, each answering "is this sample class k vs. everything else?"

\`\`\`tabs
{ "tabs": [ { "label": "Softmax", "icon": "🎯", "content": "**Single model, K outputs**\\n\\n- Train one weight matrix W of shape (features × K)\\n- All classes compete in a single softmax normalization\\n- Probabilities are mutually exclusive and sum to 1\\n- Gradient flows through all classes simultaneously\\n- **Best for:** when classes are truly mutually exclusive\\n\\n\`\`\`\\nW shape: (D, K)\\nZ = X @ W + b  → shape (N, K)\\nP = softmax(Z) → each row sums to 1\\n\`\`\`" }, { "label": "One-vs-Rest", "icon": "⚔️", "content": "**K separate binary models**\\n\\n- Train K independent logistic regression classifiers\\n- Classifier k learns: P(class k) vs P(not class k)\\n- Outputs are independent sigmoids — do NOT sum to 1\\n- Prediction: pick class with highest sigmoid score\\n- **Best for:** quick baseline, large K, imbalanced classes\\n\\n\`\`\`\\nFor k in 0..K:\\n    y_binary = (y == k).astype(int)\\n    w_k, b_k = train_logistic(X, y_binary)\\n\\nPredict:\\n    scores = [sigmoid(X @ w_k + b_k) for k in range(K)]\\n    pred   = argmax(scores)\\n\`\`\`" }, { "label": "When to Use Which", "icon": "🤔", "content": "| Scenario | Recommendation |\\n|---|---|\\n| Mutually exclusive classes | **Softmax** |\\n| Multi-label (image has cat AND dog) | Sigmoid per class |\\n| Quick baseline, no hypertuning | **OvR** |\\n| Classes heavily imbalanced | OvR (each binary is tunable) |\\n| Neural network output layer | **Softmax** always |\\n| Huge K (10,000+ classes) | Hierarchical softmax or sampled softmax |" } ] }
\`\`\`

### OvR Implementation

\`\`\`playground
{ "title": "One-vs-Rest Classifier", "language": "python", "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\n# Same 3-class data\\nX = np.vstack([\\n    np.random.randn(50, 2) + [0,  3],\\n    np.random.randn(50, 2) + [3, -1],\\n    np.random.randn(50, 2) + [-3,-1],\\n])\\ny = np.array([0]*50 + [1]*50 + [2]*50)\\n\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))\\n\\ndef train_binary(X, y_bin, lr=0.1, epochs=200):\\n    w = np.zeros(X.shape[1])\\n    b = 0.0\\n    for _ in range(epochs):\\n        p   = sigmoid(X @ w + b)\\n        err = p - y_bin\\n        w  -= lr * X.T @ err / len(y_bin)\\n        b  -= lr * err.mean()\\n    return w, b\\n\\n# Train K=3 binary classifiers\\nK       = 3\\nmodels  = []\\nfor k in range(K):\\n    y_bin = (y == k).astype(float)   # 1 if class k, else 0\\n    w, b  = train_binary(X, y_bin)\\n    models.append((w, b))\\n    print(f\\"Trained classifier {k}: class {k} vs rest\\")\\n\\n# Predict: argmax of raw sigmoid scores\\nscores = np.column_stack([\\n    sigmoid(X @ w + b) for w, b in models\\n])\\npreds = np.argmax(scores, axis=1)\\nacc   = np.mean(preds == y)\\nprint(f\\"\\\\nOvR accuracy: {acc:.2%}\\")\\nprint(\\"Note: row sums are NOT 1 (sigmoids are independent):\\")\\nprint(np.round(scores[:3], 3))", "runnable": true }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement Softmax Loss", "prompt": "Complete the categorical cross-entropy loss function and its gradient.", "language": "python", "template": "import numpy as np\\n\\ndef softmax(Z):\\n    E = np.exp(Z - Z.max(axis=1, keepdims=True))\\n    return E / E.sum(axis=1, keepdims=True)\\n\\ndef cross_entropy(P, Y):\\n    # Sum over classes, mean over samples\\n    return -np.mean(np.sum(___ * np.log(P + 1e-12), axis=___))\\n\\ndef softmax_gradient(P, Y, N):\\n    # Gradient of loss w.r.t. logits Z\\n    return (___ - ___) / N", "blanks": [ { "answer": "Y", "hint": "Multiply log-probabilities by the true one-hot labels" }, { "answer": "1", "hint": "Sum across the class dimension (axis=1 for shape (N, K))" }, { "answer": "P", "hint": "Predicted probabilities (softmax output)" }, { "answer": "Y", "hint": "True one-hot labels — the gradient is simply P minus Y" } ] }
\`\`\`

---

## Common Pitfalls

\`\`\`callout
{ "type": "danger", "title": "Softmax ≠ Calibrated Probabilities", "content": "Softmax outputs look like probabilities but are often overconfident. A model can assign 99.9% to a class even when uncertain. If you need calibrated confidence (e.g., medical AI), apply **temperature scaling** post-training:\\n\\n\`P_calibrated = softmax(Z / T)\`\\n\\nwhere T > 1 flattens the distribution (more uncertain) and T < 1 sharpens it (more confident)." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Don't Use Softmax for Multi-label Problems", "content": "Softmax enforces mutual exclusivity — probabilities sum to 1. If an input can belong to *multiple* classes simultaneously (e.g., a movie tagged as both Action and Comedy), use **independent sigmoid activations** per class instead. Each output then represents P(class k is present) independently." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Multiclass Classification with Softmax", "questions": [ { "question": "What does the softmax function guarantee about its output vector?", "options": [ "All values are between -1 and 1", "All values are positive and sum to 1", "All values are positive and the maximum value equals 1", "Values are between 0 and 1 but may not sum to 1" ], "answer": 1, "explanation": "Softmax exponentiates all logits (making them positive) then normalizes by their sum. The result is a valid probability distribution: all values in (0,1) and the vector sums to exactly 1." }, { "question": "Why do we subtract the maximum logit before computing exp(z) in a numerically stable softmax?", "options": [ "To center the distribution around zero", "To prevent exp() from producing infinity for large inputs", "To make the gradient computation easier", "To ensure the probabilities are sorted in descending order" ], "answer": 1, "explanation": "exp(1000) overflows to infinity in floating point. Subtracting max(z) shifts all values to be ≤ 0, so exp() stays in a safe range. Mathematically this is identical because the constant cancels in the numerator and denominator of the softmax fraction." }, { "question": "What is the gradient of categorical cross-entropy loss with respect to the logits z when softmax is used as the output activation?", "options": [ "sigmoid(z) − y", "z − y", "softmax(z) − y", "y × log(softmax(z))" ], "answer": 2, "explanation": "When softmax and categorical cross-entropy are combined, the gradient simplifies beautifully to (ŷ − y), where ŷ = softmax(z). This is the same form as binary logistic regression's gradient, extended to K-dimensional vectors." }, { "question": "In one-vs-rest (OvR) classification with K=5 classes, how many binary classifiers are trained?", "options": [ "1", "4", "5", "10" ], "answer": 2, "explanation": "OvR trains exactly K binary classifiers — one per class. Classifier k is trained on the binary problem 'is this sample class k?' vs. 'is this sample any other class?'. With K=5, you train 5 separate binary logistic regressors." }, { "question": "An image can be tagged as both 'sunny' and 'beach'. Which activation is appropriate for this multi-label problem?", "options": [ "Softmax — because it outputs a probability distribution", "Sigmoid per class — because labels are not mutually exclusive", "ReLU — because we need positive outputs", "Tanh — because we need outputs between -1 and 1" ], "answer": 1, "explanation": "Softmax enforces mutual exclusivity (probabilities sum to 1), making it inappropriate when multiple labels can coexist. Independent sigmoid activations treat each class as a separate binary decision, which is correct for multi-label classification." } ] }
\`\`\`

---

## Putting It Together: The Full Picture

\`\`\`steps
{ "title": "Building a Softmax Classifier from Scratch", "steps": [ { "title": "Compute logits", "content": "Perform the linear transformation:\\n\\n\`\`\`\\nZ = X @ W + b   # shape: (N, K)\\n\`\`\`\\n\\nW has shape \`(D, K)\` — one weight vector per class. b has shape \`(K,)\`." }, { "title": "Apply softmax", "content": "Convert raw scores to probabilities:\\n\\n\`\`\`python\\nshifted = Z - Z.max(axis=1, keepdims=True)  # numerical stability\\nE = np.exp(shifted)\\nP = E / E.sum(axis=1, keepdims=True)         # shape: (N, K)\\n\`\`\`" }, { "title": "Compute cross-entropy loss", "content": "Measure how wrong the predictions are:\\n\\n\`\`\`python\\nloss = -np.mean(np.sum(Y_onehot * np.log(P + 1e-12), axis=1))\\n\`\`\`\\n\\nWhere Y_onehot is the one-hot encoded label matrix of shape \`(N, K)\`." }, { "title": "Compute gradients", "content": "The gradient w.r.t. logits Z:\\n\\n\`\`\`python\\ndZ = (P - Y_onehot) / N   # shape: (N, K)\\ndW = X.T @ dZ              # shape: (D, K)\\ndb = dZ.sum(axis=0)        # shape: (K,)\\n\`\`\`" }, { "title": "Update weights", "content": "Apply gradient descent:\\n\\n\`\`\`python\\nW -= lr * dW\\nb -= lr * db\\n\`\`\`\\n\\nRepeat for all epochs. Monitor loss going down and accuracy going up." }, { "title": "Predict", "content": "At inference time, take the class with the highest probability:\\n\\n\`\`\`python\\nZ_test = X_test @ W + b\\nP_test = softmax_batch(Z_test)\\ny_pred = np.argmax(P_test, axis=1)  # predicted class indices\\n\`\`\`" } ] }
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Softmax converts a K-dimensional logit vector into a probability distribution — all values in (0,1) summing to 1 — making outputs interpretable as class probabilities.", "Subtract the maximum logit before computing exp() to prevent numerical overflow; the result is mathematically identical.", "Categorical cross-entropy paired with softmax yields an elegant gradient: dL/dz = P̂ − y (predicted minus true one-hot label).", "One-vs-rest trains K independent binary classifiers as a simpler baseline; softmax trains a single unified model where all classes compete jointly.", "Softmax assumes mutually exclusive classes; for multi-label problems (multiple labels per sample) use independent sigmoid outputs instead.", "The full training loop in NumPy: Z = X@W+b → P = softmax(Z) → loss → gradient (P−Y)/N → update W, b." ] }
\`\`\``,
      starterCode: `import numpy as np

# Dataset: 3-class classification (Iris-like)
# Features: [sepal_length, sepal_width], Labels: 0, 1, 2
np.random.seed(42)
X = np.vstack([
    np.random.randn(30, 2) + [0, 0],   # class 0
    np.random.randn(30, 2) + [3, 3],   # class 1
    np.random.randn(30, 2) + [0, 4],   # class 2
])
y = np.array([0]*30 + [1]*30 + [2]*30)

num_classes = 3
num_features = X.shape[1]


def softmax(z):
    """
    TODO: Implement the softmax function.
    - z: numpy array of shape (N, K) where K = num_classes
    - Subtract max for numerical stability before exponentiating
    - Return array of shape (N, K) where each row sums to 1
    """
    pass


def one_hot(y, num_classes):
    """Convert integer labels to one-hot encoded matrix."""
    N = len(y)
    Y = np.zeros((N, num_classes))
    Y[np.arange(N), y] = 1
    return Y


def cross_entropy_loss(probs, Y_onehot):
    """
    TODO: Implement categorical cross-entropy loss.
    - probs: softmax output, shape (N, K)
    - Y_onehot: one-hot labels, shape (N, K)
    - Return the mean loss (scalar)
    - Hint: loss = -mean(sum(Y * log(probs), axis=1))
    """
    pass


def train_softmax(X, y, lr=0.1, epochs=500):
    """
    TODO: Train a softmax regression model.
    Steps:
    1. Initialize weights W (shape: num_features x num_classes) and
       bias b (shape: 1 x num_classes) to zeros
    2. One-hot encode y
    3. For each epoch:
       a. Compute logits: z = X @ W + b
       b. Apply softmax to get probabilities
       c. Compute and print loss every 100 epochs
       d. Compute gradients:
            dW = (1/N) * X.T @ (probs - Y_onehot)
            db = (1/N) * sum(probs - Y_onehot, axis=0, keepdims=True)
       e. Update W and b using gradient descent
    4. Return W, b
    """
    pass


def predict(X, W, b):
    """TODO: Return predicted class indices (argmax of softmax output)."""
    pass


def one_vs_rest_baseline(X, y, num_classes):
    """
    TODO: Implement a simple One-vs-Rest baseline.
    For each class c:
      - Create binary labels: 1 if y==c else 0
      - Train a logistic regression (sigmoid) classifier
      - Store the weights
    Then predict by picking the class with highest raw score.

    You can use a simple sigmoid + binary cross-entropy loop,
    or just compute the score as X @ w + b for each class.
    Return predicted labels for X.

    Hint: train each binary classifier for 300 epochs with lr=0.1
    """
    pass


# --- Main ---
print("=== Softmax Regression ===")
W, b = train_softmax(X, y, lr=0.1, epochs=500)
y_pred = predict(X, W, b)
print(f"Softmax accuracy: {np.mean(y_pred == y):.2%}\\n")

print("=== One-vs-Rest Baseline ===")
y_ovr = one_vs_rest_baseline(X, y, num_classes)
print(f"OvR accuracy: {np.mean(y_ovr == y):.2%}")
`,
      solutionCode: `import numpy as np

# Dataset: 3-class classification (Iris-like)
np.random.seed(42)
X = np.vstack([
    np.random.randn(30, 2) + [0, 0],   # class 0
    np.random.randn(30, 2) + [3, 3],   # class 1
    np.random.randn(30, 2) + [0, 4],   # class 2
])
y = np.array([0]*30 + [1]*30 + [2]*30)

num_classes = 3
num_features = X.shape[1]


def softmax(z):
    """
    Softmax: converts raw scores (logits) into probabilities.
    Subtracting max per row prevents overflow when exponentiating.
    """
    # Subtract row-wise max for numerical stability
    z_stable = z - np.max(z, axis=1, keepdims=True)
    exp_z = np.exp(z_stable)
    return exp_z / np.sum(exp_z, axis=1, keepdims=True)  # shape (N, K)


def one_hot(y, num_classes):
    """Convert integer labels to one-hot encoded matrix."""
    N = len(y)
    Y = np.zeros((N, num_classes))
    Y[np.arange(N), y] = 1
    return Y


def cross_entropy_loss(probs, Y_onehot):
    """
    Categorical cross-entropy: measures how well predicted probabilities
    match the true one-hot labels.
    """
    N = len(Y_onehot)
    # Clip to avoid log(0)
    log_probs = np.log(np.clip(probs, 1e-12, 1.0))
    return -np.mean(np.sum(Y_onehot * log_probs, axis=1))


def train_softmax(X, y, lr=0.1, epochs=500):
    """
    Softmax regression via gradient descent.
    The gradient of cross-entropy loss w.r.t. logits is simply (probs - Y_onehot),
    which makes the update rule clean and intuitive.
    """
    N = X.shape[0]
    W = np.zeros((num_features, num_classes))  # (F, K)
    b = np.zeros((1, num_classes))             # (1, K)
    Y_onehot = one_hot(y, num_classes)         # (N, K)

    for epoch in range(epochs):
        # Forward pass
        z = X @ W + b                          # logits: (N, K)
        probs = softmax(z)                     # probabilities: (N, K)

        # Log loss every 100 epochs
        if epoch % 100 == 0:
            loss = cross_entropy_loss(probs, Y_onehot)
            print(f"  Epoch {epoch:4d} | loss: {loss:.4f}")

        # Gradients (closed-form for cross-entropy + softmax)
        error = probs - Y_onehot               # (N, K)
        dW = (1 / N) * X.T @ error             # (F, K)
        db = (1 / N) * np.sum(error, axis=0, keepdims=True)  # (1, K)

        # Gradient descent update
        W -= lr * dW
        b -= lr * db

    return W, b


def predict(X, W, b):
    """Predict class with highest softmax probability."""
    z = X @ W + b
    probs = softmax(z)
    return np.argmax(probs, axis=1)


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def one_vs_rest_baseline(X, y, num_classes):
    """
    One-vs-Rest: train K independent binary classifiers.
    Each classifier learns to separate class c from all others.
    Prediction picks the class whose binary classifier fires most strongly.
    """
    N, F = X.shape
    scores = np.zeros((N, num_classes))  # raw scores for each class

    for c in range(num_classes):
        # Binary labels: 1 for class c, 0 for everything else
        y_binary = (y == c).astype(float)

        # Initialize binary classifier weights
        w = np.zeros(F)
        b = 0.0
        lr = 0.1

        for _ in range(300):
            z = X @ w + b
            p = sigmoid(z)                         # shape (N,)
            error = p - y_binary                   # shape (N,)
            w -= lr * (X.T @ error) / N
            b -= lr * np.mean(error)

        # Store the raw logit score for this class
        scores[:, c] = X @ w + b

    # Predict the class with the highest score
    return np.argmax(scores, axis=1)


# --- Main ---
print("=== Softmax Regression ===")
W, b = train_softmax(X, y, lr=0.1, epochs=500)
y_pred = predict(X, W, b)
print(f"Softmax accuracy: {np.mean(y_pred == y):.2%}\\n")

print("=== One-vs-Rest Baseline ===")
y_ovr = one_vs_rest_baseline(X, y, num_classes)
print(f"OvR accuracy: {np.mean(y_ovr == y):.2%}")
`,
    },
    {
      id: "logistic-checkpoint",
      slug: "logistic-checkpoint",
      title: "Checkpoint: Spam Classifier",
      content: `# Checkpoint: Spam Classifier

This checkpoint wires together everything from this module into one working system: bag-of-words feature extraction, logistic regression trained with gradient descent, and evaluation with a full classification report — all in NumPy, no frameworks.

\`\`\`concept
{
  "title": "The Full Pipeline at a Glance",
  "variant": "mental-model",
  "content": "Raw email text → bag-of-words binary vector → logistic regression (sigmoid + cross-entropy) → spam probability. Gradient descent adjusts weights so spam-correlated words increase the probability and ham-correlated words decrease it. Evaluation requires precision, recall, and F1 — accuracy alone hides class imbalance failures."
}
\`\`\`

## The Dataset

A spam classifier is trained on labeled email examples. Each email is a text string; the label is **1** (spam) or **0** (ham).

| Label | Email |
|-------|-------|
| spam | "win free money now click here" |
| spam | "congratulations you won a prize" |
| spam | "free offer limited time claim now" |
| spam | "buy cheap meds online discount" |
| ham | "meeting tomorrow at 10am" |
| ham | "can you review my pull request" |
| ham | "lunch today at the cafeteria" |
| ham | "project deadline is friday" |
| spam | "win lottery claim your cash prize" |
| ham | "hello friend how are you doing" |

Five spam, five ham — balanced dataset, which is why accuracy is a reasonable metric here. Production datasets rarely stay balanced.

---

## Stage 1 — Bag-of-Words Feature Extraction

Logistic regression cannot process raw text. **Bag-of-words (BoW)** converts each email into a fixed-length binary vector of vocabulary size *n*: position *i* is **1** if vocabulary word *i* appears in the email, **0** otherwise. Word order and frequency are discarded.

Given vocabulary \`["buy", "free", "money", "now", "win"]\`, the email \`"win free money now"\` maps to:

\`\`\`
Index:  0     1     2      3     4
Word:  buy  free  money  now   win
Value:  0     1     1     1     1
\`\`\`

\`\`\`algoviz
{
  "title": "Bag-of-Words: Vectorizing 'win free money now'",
  "type": "array",
  "data": [0, 1, 1, 1, 1],
  "frames": [
    {"highlight": [], "label": "Vocabulary: [buy, free, money, now, win]. All positions start at 0.", "stats": {"found": 0, "remaining": 4}},
    {"highlight": [4], "label": "Scan 'win' → in email → index 4 = 1", "stats": {"found": 1, "remaining": 3}},
    {"highlight": [1], "label": "Scan 'free' → in email → index 1 = 1", "stats": {"found": 2, "remaining": 2}},
    {"highlight": [2], "label": "Scan 'money' → in email → index 2 = 1", "stats": {"found": 3, "remaining": 1}},
    {"highlight": [3], "label": "Scan 'now' → in email → index 3 = 1", "stats": {"found": 4, "remaining": 0}},
    {"highlight": [0], "label": "'buy' not in email → index 0 stays 0", "stats": {"found": 4, "absent": 1}},
    {"highlight": [0,1,2,3,4], "label": "Final vector [0,1,1,1,1] — 5-dimensional input for logistic regression", "stats": {"nonzero": 4, "size": 5}}
  ],
  "speed": 850
}
\`\`\`

---

## Stage 2 — Logistic Regression

Given feature matrix **X** (shape *m × n*), weights **w** (length *n*), and bias **b**, logistic regression computes:

**z = Xw + b** → **ŷ = σ(z) = 1 / (1 + e⁻ᶻ)**

Classify as spam when **ŷ ≥ 0.5**.

Training minimizes **cross-entropy loss** across all *m* examples:

**L = −(1/m) Σ [ y·log(ŷ) + (1−y)·log(1−ŷ) ]**

Gradient updates per epoch:

**∂L/∂w = (1/m) Xᵀ(ŷ − y)** &emsp; **∂L/∂b = (1/m) Σ(ŷ − y)**

At epoch 0 with all-zero weights, **σ(0) = 0.5** for every email, giving cross-entropy loss ≈ **0.693** (ln 2) — the random-chance baseline.

---

## Stage 3 — Evaluation Metrics

Accuracy alone hides failure modes. Use all three metrics:

| Metric | Formula | What It Answers |
|--------|---------|----------------|
| **Precision** | TP / (TP + FP) | Of emails flagged as spam, what fraction were actually spam? |
| **Recall** | TP / (TP + FN) | Of all actual spam, what fraction did the filter catch? |
| **F1 Score** | 2·P·R / (P+R) | Harmonic mean — penalizes both missed spam and false alarms |

A high-recall filter misses very little spam but may annoy users with false alarms. A high-precision filter never wrongly blocks legitimate mail but lets some spam through.

---

## Build It — Full Spam Classifier

\`\`\`playground
{
  "title": "Spam Classifier from Scratch (NumPy Only)",
  "language": "python",
  "code": "import numpy as np\\n\\n# ── Dataset ──────────────────────────────────────────────\\nemails = [\\n    'win free money now click here',\\n    'congratulations you won a prize',\\n    'free offer limited time claim now',\\n    'buy cheap meds online discount',\\n    'meeting tomorrow at 10am',\\n    'can you review my pull request',\\n    'lunch today at the cafeteria',\\n    'project deadline is friday',\\n    'win lottery claim your cash prize',\\n    'hello friend how are you doing'\\n]\\nlabels = np.array([1, 1, 1, 1, 0, 0, 0, 0, 1, 0])\\n\\n# ── Bag-of-Words ─────────────────────────────────────────\\ndef build_vocab(corpus):\\n    vocab = set()\\n    for text in corpus:\\n        vocab.update(text.lower().split())\\n    return sorted(vocab)\\n\\ndef vectorize(text, vocab):\\n    words = set(text.lower().split())\\n    return np.array([1 if w in words else 0 for w in vocab])\\n\\nvocab = build_vocab(emails)\\nX = np.array([vectorize(e, vocab) for e in emails])\\nprint(f'Vocabulary size : {len(vocab)}')\\nprint(f'Feature matrix  : {X.shape}  (rows=emails, cols=vocab words)')\\n\\n# ── Logistic Regression ──────────────────────────────────\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(-z))\\n\\ndef cross_entropy(y, y_hat, eps=1e-9):\\n    return -np.mean(y * np.log(y_hat + eps) + (1 - y) * np.log(1 - y_hat + eps))\\n\\ndef train(X, y, lr=0.1, epochs=400):\\n    m, n = X.shape\\n    w = np.zeros(n)\\n    b = 0.0\\n    for epoch in range(epochs + 1):\\n        y_hat = sigmoid(X @ w + b)\\n        if epoch % 100 == 0:\\n            loss = cross_entropy(y, y_hat)\\n            print(f'  Epoch {epoch:3d}  loss={loss:.4f}')\\n        dw = (X.T @ (y_hat - y)) / m\\n        db = np.mean(y_hat - y)\\n        w -= lr * dw\\n        b -= lr * db\\n    return w, b\\n\\nprint()\\nprint('Training...')\\nw, b = train(X, labels)\\n\\n# ── Predict ──────────────────────────────────────────────\\ndef predict(X, w, b, threshold=0.5):\\n    return (sigmoid(X @ w + b) >= threshold).astype(int)\\n\\ny_pred = predict(X, w, b)\\n\\n# ── Classification Report ────────────────────────────────\\ndef classification_report(y_true, y_pred):\\n    tp = int(np.sum((y_pred == 1) & (y_true == 1)))\\n    fp = int(np.sum((y_pred == 1) & (y_true == 0)))\\n    fn = int(np.sum((y_pred == 0) & (y_true == 1)))\\n    tn = int(np.sum((y_pred == 0) & (y_true == 0)))\\n    prec = tp / (tp + fp) if tp + fp > 0 else 0.0\\n    rec  = tp / (tp + fn) if tp + fn > 0 else 0.0\\n    f1   = 2 * prec * rec / (prec + rec) if prec + rec > 0 else 0.0\\n    acc  = float(np.mean(y_pred == y_true))\\n    print()\\n    print('=== Classification Report ===')\\n    print(f'  Confusion : TP={tp}  FP={fp}  FN={fn}  TN={tn}')\\n    print(f'  Accuracy  : {acc:.2f}')\\n    print(f'  Precision : {prec:.2f}')\\n    print(f'  Recall    : {rec:.2f}')\\n    print(f'  F1 Score  : {f1:.2f}')\\n\\nclassification_report(labels, y_pred)\\n\\n# ── Test on unseen emails ─────────────────────────────────\\nnew_emails = [\\n    'win free cash prize click now',\\n    'can we schedule a team meeting',\\n    'limited offer buy now get discount'\\n]\\nprint()\\nprint('=== New Email Predictions ===')\\nfor email in new_emails:\\n    xv = vectorize(email, vocab).reshape(1, -1)\\n    prob = float(sigmoid(xv @ w + b)[0])\\n    tag = 'SPAM' if prob >= 0.5 else 'HAM '\\n    print(f'  [{tag}]  p={prob:.2f}  {email}')",
  "runnable": true
}
\`\`\`

---

## Trace: How Gradient Descent Lowers the Loss

Watch the key variables evolve across the first few steps of training:

\`\`\`trace
{
  "title": "Gradient Descent — First Four Steps",
  "language": "python",
  "code": "w = np.zeros(n)\\nb = 0.0\\ny_hat = sigmoid(X @ w + b)\\nloss = cross_entropy(y, y_hat)\\ndw = (X.T @ (y_hat - y)) / m\\ndb = np.mean(y_hat - y)\\nw = w - lr * dw\\nb = b - lr * db\\ny_hat2 = sigmoid(X @ w + b)\\nloss2 = cross_entropy(y, y_hat2)",
  "frames": [
    {"line": 1, "vars": {"w": "zeros(n)", "b": 0.0, "n": 45}, "note": "All feature weights start at zero — the model knows nothing yet"},
    {"line": 3, "vars": {"y_hat": "all 0.5"}, "note": "With w=0 and b=0, every z=0, so sigma(0)=0.5 for every email"},
    {"line": 4, "vars": {"loss": 0.693}, "note": "Cross-entropy = ln(2) ≈ 0.693 — the random-chance baseline for a balanced dataset"},
    {"line": 5, "vars": {"dw": "shape (45,)"}, "note": "Spam-associated words get positive gradient (they predicted ham too strongly)"},
    {"line": 6, "vars": {"db": 0.0}, "note": "Bias gradient is zero — equally confused about spam and ham at start"},
    {"line": 7, "vars": {"w": "updated, lr=0.1"}, "note": "Weights for spam words nudge upward; ham-only words nudge downward"},
    {"line": 8, "vars": {"b": 0.0}, "note": "Bias unchanged this step (gradient was zero)"},
    {"line": 9, "vars": {"y_hat2": "closer to labels"}, "note": "Probabilities now spread: spam emails trend above 0.5, ham below"},
    {"line": 10, "vars": {"loss2": 0.52}, "note": "Loss dropped 0.693 → ~0.52 after one gradient step — learning is happening"}
  ],
  "speed": 900
}
\`\`\`

---

## Practice: Fill in the Core Equations

\`\`\`fillblank
{
  "title": "Implement the Three Core Building Blocks",
  "prompt": "Complete the sigmoid activation, cross-entropy loss, and weight gradient — the three equations that drive logistic regression training:",
  "language": "python",
  "template": "# 1. Sigmoid: maps any real number to (0, 1)\\ndef sigmoid(z):\\n    return 1 / (1 + np.exp(___))\\n\\n# 2. Cross-entropy: penalizes confident wrong predictions\\ndef cross_entropy(y, y_hat, eps=1e-9):\\n    return -np.mean(\\n        y * np.log(y_hat + eps) + ___ * np.log(1 - y_hat + eps)\\n    )\\n\\n# 3. Weight gradient averaged over m training examples\\ny_hat = sigmoid(X @ w + b)\\ndw = (X.T @ ___) / m\\nw -= lr * dw",
  "blanks": [
    {"answer": "-z", "hint": "The sigmoid formula is 1/(1+e^{-z}) — the exponent must negate z"},
    {"answer": "(1 - y)", "hint": "The second cross-entropy term uses (1 minus the true label) as its coefficient"},
    {"answer": "(y_hat - y)", "hint": "The gradient is the prediction error: predicted probability minus true label"}
  ]
}
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{
  "title": "Spam Classifier — Checkpoint Quiz",
  "questions": [
    {
      "question": "After calling build_vocab() on 10 training emails you get 45 unique words. What is the shape of the feature matrix X?",
      "options": [
        "(45, 10) — one column per email",
        "(10, 45) — one row per email, one column per vocab word",
        "(10, 1) — one scalar feature per email",
        "(45, 45) — a square vocabulary matrix"
      ],
      "answer": 1,
      "explanation": "X has shape (m, n): m rows (one per training example) and n columns (one per vocabulary word). With 10 emails and 45 vocab words, X.shape = (10, 45). The matrix-vector product X @ w then has shape (10,) — one logit per email."
    },
    {
      "question": "A deployed spam filter reports Precision=0.98 and Recall=0.35. Which statement accurately describes its real-world behavior?",
      "options": [
        "It catches 98% of all spam in the inbox",
        "It almost never flags a legitimate email as spam, but lets 65% of spam through",
        "It is overfitting to the training set",
        "It has a well-balanced trade-off between false positives and false negatives"
      ],
      "answer": 1,
      "explanation": "Precision=0.98 means 98% of emails it flags are genuine spam (very few false positives). Recall=0.35 means it only catches 35% of all real spam — 65% slips through undetected (high false negative rate). The filter is extremely conservative: it flags only emails it is nearly certain about."
    },
    {
      "question": "At epoch 0, all weights w and bias b are zero. What cross-entropy loss does the model produce on a balanced (50% spam) dataset?",
      "options": [
        "0.0 — no error since weights have not been updated yet",
        "0.5 — the model is right half the time",
        "≈ 0.693 — because sigmoid(0) = 0.5 for every example",
        "1.0 — maximum possible cross-entropy"
      ],
      "answer": 2,
      "explanation": "When w=0 and b=0, every z=0 and sigmoid(0)=0.5. Cross-entropy for a single example becomes −[y·log(0.5)+(1−y)·log(0.5)] = −log(0.5) = log(2) ≈ 0.693. This is the random-chance baseline — any useful model must drive loss below this threshold."
    },
    {
      "question": "The email 'not spam not spam' is misclassified as spam. Which fundamental bag-of-words limitation best explains this error?",
      "options": [
        "BoW does not record word frequency, so repeated words carry no extra weight",
        "BoW ignores word order, so 'not spam' and 'spam not' produce identical feature vectors",
        "The vocabulary built from training data is too small to include 'not'",
        "BoW cannot handle emails shorter than five words"
      ],
      "answer": 1,
      "explanation": "Bag-of-words encodes only presence or absence. Both 'not spam' and 'spam not' produce the same vector: {not:1, spam:1}. The word 'not' provides no negation context for 'spam' — word order is entirely discarded. This is BoW's most important structural limitation for natural language tasks."
    }
  ]
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "This Model Memorizes — It Does Not Generalize",
  "content": "With 10 training emails and a 45-word vocabulary, high training accuracy is meaningless. The model has more parameters than examples. Production spam filters train on millions of labeled emails and are evaluated on a held-out test split the model never saw. Always separate your data into train, validation, and test sets before drawing any performance conclusions."
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Bag-of-words converts text to a binary vector of length n (vocabulary size): 1 if a word is present, 0 if absent. Word order and frequency are both discarded.",
    "Logistic regression applies sigmoid to a linear combination of features. At initialization with all-zero weights, every output is 0.5 and cross-entropy loss ≈ 0.693 — the random-chance baseline.",
    "Gradient descent updates are: dw = (1/m)·Xᵀ(ŷ−y) and db = (1/m)·Σ(ŷ−y). Spam-correlated words accumulate positive weight; ham-correlated words accumulate negative weight.",
    "Precision measures false alarm rate (flagged emails that were actually ham). Recall measures miss rate (spam that slipped through). F1 is their harmonic mean and the most useful single-number summary.",
    "BoW's core limitation: 'not spam' and 'spam not' are identical feature vectors. Negation and context require more advanced representations such as n-grams or word embeddings."
  ]
}
\`\`\``,
      starterCode: `# Spam Classifier Checkpoint
# Build a bag-of-words spam classifier using logistic regression

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

# Sample dataset: (text, label) where 1=spam, 0=ham
data = [
    ("Win a free iPhone now! Click here!", 1),
    ("Hey, are we still on for lunch tomorrow?", 0),
    ("Congratulations! You've been selected for a cash prize!", 1),
    ("Can you send me the meeting notes?", 0),
    ("URGENT: Your account has been compromised. Verify now!", 1),
    ("Reminder: dentist appointment at 3pm", 0),
    ("Claim your free gift card today — limited offer!", 1),
    ("Thanks for the help earlier, really appreciate it", 0),
    ("You are a winner! Reply to collect your reward", 1),
    ("Let me know when you're free to chat", 0),
    ("Exclusive deal just for you — act fast!", 1),
    ("I'll be a bit late to the call, sorry", 0),
    ("Buy cheap meds online, no prescription needed", 1),
    ("Can you review my pull request?", 0),
    ("Double your income working from home — guaranteed!", 1),
    ("See you at the conference next week", 0),
]

texts = [d[0] for d in data]
labels = [d[1] for d in data]

# TODO 1: Split the data into training and test sets
# Use test_size=0.25 and random_state=42
X_train, X_test, y_train, y_test = None, None, None, None

# TODO 2: Create a CountVectorizer and fit it on the TRAINING data only,
# then transform both training and test sets
vectorizer = CountVectorizer()
X_train_vec = None  # fit and transform training data
X_test_vec = None   # transform test data (do NOT fit again)

# TODO 3: Train a LogisticRegression model on the vectorized training data
model = LogisticRegression()
# ... train the model

# TODO 4: Generate predictions on the test set
y_pred = None

# TODO 5: Print the classification report using y_test and y_pred
# Target names: ['ham', 'spam']
print("Classification Report:")
# ... print the report
`,
      solutionCode: `# Spam Classifier Checkpoint — Solution

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

# Sample dataset: (text, label) where 1=spam, 0=ham
data = [
    ("Win a free iPhone now! Click here!", 1),
    ("Hey, are we still on for lunch tomorrow?", 0),
    ("Congratulations! You've been selected for a cash prize!", 1),
    ("Can you send me the meeting notes?", 0),
    ("URGENT: Your account has been compromised. Verify now!", 1),
    ("Reminder: dentist appointment at 3pm", 0),
    ("Claim your free gift card today — limited offer!", 1),
    ("Thanks for the help earlier, really appreciate it", 0),
    ("You are a winner! Reply to collect your reward", 1),
    ("Let me know when you're free to chat", 0),
    ("Exclusive deal just for you — act fast!", 1),
    ("I'll be a bit late to the call, sorry", 0),
    ("Buy cheap meds online, no prescription needed", 1),
    ("Can you review my pull request?", 0),
    ("Double your income working from home — guaranteed!", 1),
    ("See you at the conference next week", 0),
]

texts = [d[0] for d in data]
labels = [d[1] for d in data]

# Step 1: Split into training and test sets
# Keeping random_state fixed ensures reproducible results
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.25, random_state=42
)

# Step 2: Extract bag-of-words features
# Fit ONLY on training data to avoid data leakage —
# the model should never "see" test vocabulary during training
vectorizer = CountVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)  # learn vocab + encode
X_test_vec = vectorizer.transform(X_test)         # encode using learned vocab

# Step 3: Train logistic regression classifier
# max_iter increased to ensure convergence on small datasets
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# Step 4: Predict on the test set
y_pred = model.predict(X_test_vec)

# Step 5: Print full classification report
# Shows precision, recall, f1-score for both 'ham' and 'spam' classes
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=['ham', 'spam']))
`,
    },
  ],
};
