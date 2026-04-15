import { Module } from "../types";

export const mathForMlModule: Module = {
  id: "math-for-ml",
  title: "Math Foundations for Machine Learning",
  description: "Build intuition for the calculus, linear algebra, and probability concepts that appear in every ML derivation — gradients, eigenvectors, Bayes' theorem.",
  lessons: [
    {
      id: "derivatives-chain-rule",
      slug: "derivatives-chain-rule",
      title: "Derivatives and the Chain Rule",
      content: `# Derivatives and the Chain Rule

Every time a neural network learns from data, it performs one operation billions of times: it asks "if I nudge this weight slightly, does the error go up or down?" That question is answered by a **derivative**. And when the network has 50 layers stacked on top of each other, the answer is computed efficiently by the **chain rule**.

This lesson builds both tools from the ground up — with runnable code so you can see them working in real Python.

---

\`\`\`concept
{ "title": "The Derivative: A Slope at a Point", "variant": "mental-model", "content": "A derivative measures the instantaneous rate of change of a function. Geometrically, it is the slope of the tangent line to the curve at a specific point. If f(x) = x², then f'(2) = 4 — the output rises 4 units for every 1-unit nudge in x, right at x = 2." }
\`\`\`

## What Is a Derivative?

Given a function \`f(x)\`, its derivative \`f'(x)\` (also written \`df/dx\`) is defined as:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

This is the slope of the secant line as \`h\` shrinks toward zero. In practice, you rarely compute this limit by hand — you apply **differentiation rules**:

| Function | Derivative |
|---|---|
| \`f(x) = c\` (constant) | \`f'(x) = 0\` |
| \`f(x) = xⁿ\` (power rule) | \`f'(x) = n·xⁿ⁻¹\` |
| \`f(x) = eˣ\` | \`f'(x) = eˣ\` |
| \`f(x) = ln(x)\` | \`f'(x) = 1/x\` |
| \`f(x) = sin(x)\` | \`f'(x) = cos(x)\` |

The rules you'll encounter most in ML are the **power rule** and the derivative of the **sigmoid** and **ReLU** activation functions.

---

\`\`\`trace
{
  "title": "Numeric Derivative: Watching h Shrink",
  "language": "python",
  "code": "def f(x):\\n    return x ** 2\\n\\ndef numeric_derivative(f, x, h):\\n    return (f(x + h) - f(x)) / h\\n\\nx = 3.0\\nfor h in [1.0, 0.1, 0.01, 0.001]:\\n    slope = numeric_derivative(f, x, h)\\n    print(f\\"h={h:.3f}  slope≈{slope:.6f}\\")\\n\\n# Exact answer: f'(3) = 2*3 = 6",
  "frames": [
    { "line": 5, "vars": { "x": 3.0, "h": 1.0 }, "note": "h=1: very rough approximation", "stdout": "" },
    { "line": 5, "vars": { "x": 3.0, "h": 0.1 }, "note": "h=0.1: closer to the true slope", "stdout": "h=1.000  slope≈7.000000" },
    { "line": 5, "vars": { "x": 3.0, "h": 0.01 }, "note": "h=0.01: nearly converged", "stdout": "h=0.100  slope≈6.100000" },
    { "line": 5, "vars": { "x": 3.0, "h": 0.001 }, "note": "h=0.001: approximates 6.0 — the exact derivative", "stdout": "h=0.010  slope≈6.010000\\nh=0.001  slope≈6.001000" }
  ],
  "speed": 900
}
\`\`\`

---

## The Power Rule in Action

Before moving to the chain rule, make sure the power rule is automatic. For \`f(x) = xⁿ\`, \`f'(x) = n·xⁿ⁻¹\`. A few quick examples:

- \`f(x) = x³\` → \`f'(x) = 3x²\`
- \`f(x) = x\` → \`f'(x) = 1\`
- \`f(x) = x⁰·⁵\` → \`f'(x) = 0.5x⁻⁰·⁵\`

\`\`\`callout
{ "type": "tip", "title": "Why ML Uses Simple Functions", "content": "Most ML activation functions (ReLU, sigmoid, tanh) are chosen partly because their derivatives are cheap to compute. ReLU's derivative is just 0 or 1. Simple derivatives mean faster backpropagation." }
\`\`\`

---

## Composite Functions and the Chain Rule

In a neural network, you never have a single function — you have **layers of functions**. The output of layer 1 becomes the input to layer 2, which feeds layer 3, and so on. These are **composite functions**.

If \`y = g(x)\` and \`z = f(y)\`, then \`z = f(g(x))\`. The chain rule tells you how to differentiate this:

$$\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx}$$

Read it aloud: "the derivative of z with respect to x equals the derivative of z with respect to y, **times** the derivative of y with respect to x."

\`\`\`concept
{ "title": "Chain Rule as a Relay Race", "variant": "analogy", "content": "Imagine three runners: x passes the baton to y, y passes it to z. The chain rule multiplies the 'speed' of each handoff together. If y moves 3x as fast as x, and z moves 2x as fast as y, then z moves 6x as fast as x (3 × 2 = 6). Each layer's gradient is one runner's speed." }
\`\`\`

### A Concrete Example

Let \`z = (3x + 1)²\`. We can decompose this:
- Let \`y = 3x + 1\` — the **inner** function
- Let \`z = y²\` — the **outer** function

Applying the chain rule:

$$\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx} = 2y \\cdot 3 = 6(3x+1)$$

At \`x = 2\`: \`y = 7\`, so \`dz/dx = 6 × 7 = 42\`.

---

\`\`\`playground
{
  "title": "Chain Rule: Numeric vs Analytic",
  "language": "python",
  "code": "import numpy as np\\n\\n# Composite function: z = (3x + 1)^2\\ndef z(x):\\n    return (3 * x + 1) ** 2\\n\\n# Inner function and outer function separately\\ndef inner(x): return 3 * x + 1       # y = 3x + 1\\ndef outer(y): return y ** 2           # z = y^2\\n\\ndef dz_dy(y): return 2 * y            # derivative of outer\\ndef dy_dx(x): return 3               # derivative of inner\\n\\ndef chain_rule_derivative(x):\\n    y = inner(x)\\n    return dz_dy(y) * dy_dx(x)       # chain rule: dz/dy * dy/dx\\n\\ndef numeric_derivative(f, x, h=1e-5):\\n    return (f(x + h) - f(x - h)) / (2 * h)\\n\\n# Test at several points\\nfor x in [0.0, 1.0, 2.0, 3.0]:\\n    analytic = chain_rule_derivative(x)\\n    numeric  = numeric_derivative(z, x)\\n    print(f\\"x={x:.1f}  chain rule={analytic:.4f}  numeric={numeric:.4f}  match={'YES' if abs(analytic - numeric) < 1e-4 else 'NO'}\\")",
  "runnable": true
}
\`\`\`

---

## Visualising the Chain Rule Along a Computation Graph

Deep learning frameworks represent composite functions as **computation graphs** — a directed graph where each node is an operation and each edge carries a value forward (forward pass) or a gradient backward (backward pass).

\`\`\`sysdiag
{
  "title": "Computation Graph: z = (3x + 1)²",
  "width": 580,
  "height": 200,
  "nodes": [
    { "id": "x",    "label": "x",        "x": 60,  "y": 100, "kind": "client" },
    { "id": "mul",  "label": "× 3",      "x": 180, "y": 100, "kind": "service" },
    { "id": "add",  "label": "+ 1",      "x": 300, "y": 100, "kind": "service" },
    { "id": "sq",   "label": "( )²",     "x": 420, "y": 100, "kind": "service" },
    { "id": "z",    "label": "z (loss)", "x": 530, "y": 100, "kind": "database" }
  ],
  "edges": [
    { "from": "x",   "to": "mul", "label": "forward" },
    { "from": "mul", "to": "add", "label": "y₁=3x" },
    { "from": "add", "to": "sq",  "label": "y₂=3x+1" },
    { "from": "sq",  "to": "z",   "label": "z=y₂²" }
  ],
  "annotations": {
    "mul": "Multiply x by 3. Gradient flowing back: multiply by 3 (dy₁/dx = 3)",
    "add": "Add 1. Gradient passes through unchanged (dy₂/dy₁ = 1)",
    "sq":  "Square. Gradient flowing back: 2·y₂ (dz/dy₂ = 2y₂)"
  }
}
\`\`\`

---

## Chaining More Than Two Functions

The chain rule extends to any number of composed functions. For \`z = f(g(h(x)))\`:

$$\\frac{dz}{dx} = \\frac{dz}{df} \\cdot \\frac{df}{dg} \\cdot \\frac{dg}{dh} \\cdot \\frac{dh}{dx}$$

This is exactly what happens in a neural network with \`L\` layers — the gradient of the loss with respect to the first layer's weights is a product of \`L\` Jacobians multiplied together. The chain rule makes this **computationally tractable**.

\`\`\`callout
{ "type": "info", "title": "Why Deep Networks Were Hard Before Backprop", "content": "Before the chain rule was systematically applied via backpropagation (popularised in the 1980s), training networks deeper than 2 layers was impractical. The chain rule enables gradient propagation through millions of parameters in a single backward pass." }
\`\`\`

---

## The Sigmoid and Its Derivative

The sigmoid function is one of the most important functions in ML. Let's derive its derivative using the chain rule.

$$\\sigma(x) = \\frac{1}{1 + e^{-x}}$$

Applying the chain rule (rewrite as \`(1 + e^{-x})^{-1}\`):

$$\\sigma'(x) = \\sigma(x) \\cdot (1 - \\sigma(x))$$

This elegant result means the derivative *reuses* the forward-pass value — no extra computation needed during backpropagation.

\`\`\`playground
{
  "title": "Sigmoid and Its Derivative",
  "language": "python",
  "code": "import numpy as np\\n\\ndef sigmoid(x):\\n    return 1 / (1 + np.exp(-x))\\n\\ndef sigmoid_derivative(x):\\n    s = sigmoid(x)\\n    return s * (1 - s)            # chain rule result\\n\\ndef numeric_derivative(f, x, h=1e-5):\\n    return (f(x + h) - f(x - h)) / (2 * h)\\n\\nprint(f\\"{'x':>6} {'σ(x)':>10} {'σ\\\\'(x) analytic':>18} {'σ\\\\'(x) numeric':>18}\\")\\nprint(\\"-\\" * 60)\\nfor x in [-3.0, -1.0, 0.0, 1.0, 3.0]:\\n    s  = sigmoid(x)\\n    ds = sigmoid_derivative(x)\\n    dn = numeric_derivative(sigmoid, x)\\n    print(f\\"{x:>6.1f} {s:>10.4f} {ds:>18.6f} {dn:>18.6f}\\")\\n\\nprint(\\"\\\\nKey insight: derivative is maximal at x=0 (sigmoid = 0.5)\\")\\nprint(f\\"Max derivative: {sigmoid_derivative(0):.4f}\\")",
  "runnable": true
}
\`\`\`

---

\`\`\`algoviz
{
  "title": "Chain Rule: Gradient Flows Backward Through Layers",
  "type": "array",
  "data": [0.0, 0.0, 0.0, 0.0],
  "frames": [
    { "highlight": [3], "label": "Forward pass complete. Loss computed at output layer (index 3). Gradient = 1.0", "stats": { "layer": 3, "grad": 1.0 } },
    { "highlight": [2, 3], "label": "Backprop step 1: multiply by dLayer4/dLayer3 = 0.8. Gradient at layer 2 = 0.8", "stats": { "layer": 2, "grad": 0.8 } },
    { "highlight": [1, 2], "label": "Backprop step 2: multiply by dLayer3/dLayer2 = 0.5. Gradient at layer 1 = 0.40", "stats": { "layer": 1, "grad": 0.4 } },
    { "highlight": [0, 1], "label": "Backprop step 3: multiply by dLayer2/dLayer1 = 0.6. Gradient at layer 0 = 0.24", "stats": { "layer": 0, "grad": 0.24 } },
    { "highlight": [0, 1, 2, 3], "label": "All gradients computed. Each weight in every layer can now be updated: w -= lr × gradient", "stats": { "total_multiplications": 3 } }
  ],
  "speed": 1000
}
\`\`\`

---

## From Chain Rule to Gradient Descent

In ML, the loss function \`L\` depends on the model's prediction, which depends on the weights \`w\`. Gradient descent updates each weight using its derivative:

$$w \\leftarrow w - \\alpha \\cdot \\frac{dL}{dw}$$

Here \`α\` is the learning rate. The chain rule gives us \`dL/dw\` even when \`w\` is buried deep inside a composite function — it's just a product of local derivatives at each step.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Single Layer",
      "icon": "1️⃣",
      "content": "For a single neuron: \`output = w·x + b\`, \`loss = (output - target)²\`\\n\\n\`\`\`\\ndL/dw = dL/d(output) · d(output)/dw\\n      = 2(output - target) · x\\n\`\`\`\\n\\nTwo terms, one multiplication. Easy."
    },
    {
      "label": "Two Layers",
      "icon": "2️⃣",
      "content": "Add a hidden layer with activation \`σ\`:\\n\\n\`\`\`\\nh = σ(w₁·x)\\noutput = w₂·h\\nloss = (output - target)²\\n\\ndL/dw₁ = dL/d(output) · d(output)/dh · dh/dw₁\\n       = 2(output-target) · w₂ · σ'(w₁·x) · x\\n\`\`\`\\n\\nFour terms, three multiplications. Still manageable."
    },
    {
      "label": "Deep Network",
      "icon": "🏗️",
      "content": "With \`L\` layers, \`dL/dw₁\` is a product of \`L\` local gradients:\\n\\n\`\`\`\\ndL/dw₁ = δL · δ(L-1) · δ(L-2) · ... · δ(1)\\n\`\`\`\\n\\nThe chain rule factorises this into per-layer local computations — which is exactly what backpropagation implements. Each layer only needs to know its own local gradient, not the full composite."
    },
    {
      "label": "Auto-Diff",
      "icon": "⚙️",
      "content": "TensorFlow and PyTorch implement **automatic differentiation**: they build a computation graph during the forward pass, then apply the chain rule automatically during \`loss.backward()\`. You never write derivatives by hand — but understanding the chain rule is essential to know *why* it works and *when* it breaks (vanishing/exploding gradients)."
    }
  ]
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{
  "title": "Implement the Chain Rule",
  "prompt": "Complete the chain_rule function that numerically verifies the chain rule for f(g(x)) = sin(x²). Fill in the two missing local derivatives.",
  "language": "python",
  "template": "import numpy as np\\n\\ndef g(x): return x ** 2          # inner: g(x) = x²\\ndef f(y): return np.sin(y)        # outer: f(y) = sin(y)\\n\\ndef dg_dx(x): return ___          # derivative of x²\\ndef df_dy(y): return ___          # derivative of sin(y)\\n\\ndef chain_rule(x):\\n    y = g(x)\\n    return df_dy(y) * dg_dx(x)   # dz/dx = dz/dy * dy/dx\\n\\nprint(chain_rule(1.5))            # should be ≈ 0.2675",
  "blanks": [
    { "answer": "2 * x", "hint": "Power rule: d/dx of x² is 2x" },
    { "answer": "np.cos(y)", "hint": "The derivative of sin(y) is cos(y)" }
  ]
}
\`\`\`

---

## Practice: Gradient Descent Step

\`\`\`fillblank
{
  "title": "One Step of Gradient Descent",
  "prompt": "Given loss L = (w·x - y)², compute the derivative dL/dw and apply one gradient descent update.",
  "language": "python",
  "template": "# Forward pass\\nx, y_true = 2.0, 6.0\\nw = 1.0\\nlr = 0.1\\n\\nprediction = w * x\\nloss = (prediction - y_true) ** 2\\n\\n# Backward pass (chain rule)\\ndloss_dpred = ___(prediction - y_true)    # d/d(pred) of (pred - y)²\\ndpred_dw    = ___                          # d/dw of w*x\\ndloss_dw    = dloss_dpred * dpred_dw       # chain rule\\n\\n# Update\\nw_new = w - lr * dloss_dw\\nprint(f\\"Old w: {w}, New w: {w_new:.3f}\\")",
  "blanks": [
    { "answer": "2 *", "hint": "Derivative of (pred - y)² is 2(pred - y)" },
    { "answer": "x", "hint": "Derivative of w·x with respect to w is just x" }
  ]
}
\`\`\`

---

## The Vanishing Gradient Problem

\`\`\`callout
{ "type": "warning", "title": "When the Chain Rule Breaks Down in Practice", "content": "If each layer's local gradient is less than 1 (e.g., sigmoid derivatives max out at 0.25), multiplying L of them together produces an exponentially tiny number. After 10 layers: 0.25¹⁰ ≈ 0.000001. This is the vanishing gradient problem — early layers barely learn. ReLU (derivative = 1 for positive inputs) was adopted partly to combat this." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Vanishing vs Exploding Gradients", "content": "**Vanishing gradients** occur when |local gradient| < 1 consistently. The product shrinks toward zero, starving early layers of learning signal. Common with sigmoid/tanh activations in deep networks.\\n\\n**Exploding gradients** occur when |local gradient| > 1 consistently. The product grows exponentially, causing weight updates so large the network diverges. Common in RNNs without gradient clipping.\\n\\n**Solutions:**\\n- **ReLU activations** — derivative is 1 for positive values, 0 otherwise; doesn't compound shrinkage\\n- **Batch normalisation** — rescales activations between layers, keeping gradients in a stable range\\n- **Residual connections (ResNets)** — add skip connections so gradients can flow directly to early layers\\n- **Gradient clipping** — cap gradient norms at a maximum value (standard in transformer training)\\n- **Careful weight initialisation** (Xavier, He) — scales initial weights to maintain variance across layers" }
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "The derivative f'(x) geometrically represents:",
      "options": [
        "The area under the curve at x",
        "The slope of the tangent line to f at x",
        "The value of f at x plus a small h",
        "The average rate of change over the entire domain"
      ],
      "answer": 1,
      "explanation": "The derivative is the instantaneous rate of change — geometrically, it is the slope of the tangent line at a specific point. The secant-line definition (rise/run) approaches this as h → 0."
    },
    {
      "question": "Given z = f(g(x)), the chain rule states dz/dx equals:",
      "options": [
        "dz/dy + dy/dx",
        "dz/dx · dy/dx",
        "dz/dy · dy/dx",
        "f'(x) + g'(x)"
      ],
      "answer": 2,
      "explanation": "The chain rule multiplies the outer derivative (dz/dy, evaluated at y = g(x)) by the inner derivative (dy/dx). Addition would be the product rule for two separate terms — chain rule is multiplication for composition."
    },
    {
      "question": "Why is the chain rule critical for training deep neural networks?",
      "options": [
        "It allows networks to use integer weights instead of floats",
        "It enables efficient computation of gradients through many composed layers",
        "It eliminates the need for a loss function",
        "It reduces the number of parameters needed"
      ],
      "answer": 1,
      "explanation": "A deep network is a composition of many functions (layers). The chain rule factorises the gradient of the loss with respect to any weight into a product of local gradients — each layer only needs its own local computation. Without this, training deep networks would be computationally infeasible."
    },
    {
      "question": "The sigmoid derivative σ'(x) = σ(x)(1 - σ(x)) has a maximum value of:",
      "options": [
        "1.0 at x = 0",
        "0.5 at x = 0",
        "0.25 at x = 0",
        "0.25 at x = ±1"
      ],
      "answer": 2,
      "explanation": "At x = 0, σ(0) = 0.5, so σ'(0) = 0.5 × (1 - 0.5) = 0.25. This maximum of 0.25 is why sigmoid activations contribute to the vanishing gradient problem in deep networks — each layer multiplies the gradient by at most 0.25."
    },
    {
      "question": "In gradient descent, the update rule w ← w - α·(dL/dw) moves the weight in the direction that:",
      "options": [
        "Increases the loss function",
        "Decreases the loss function",
        "Keeps the loss unchanged",
        "Maximises the weight value"
      ],
      "answer": 1,
      "explanation": "The derivative dL/dw points in the direction of steepest increase. Subtracting it (with learning rate α scaling the step size) moves the weight in the direction of steepest decrease — minimising the loss over many iterations."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The derivative f'(x) measures instantaneous rate of change — geometrically, it is the slope of the tangent line at a point.",
    "The chain rule: dz/dx = (dz/dy)·(dy/dx). For composed functions, multiply local derivatives at each step.",
    "Every backpropagation step in a neural network is an application of the chain rule — gradients flow backward as products of local derivatives.",
    "The sigmoid derivative σ(x)(1-σ(x)) reuses the forward-pass value, making backprop efficient — but its max of 0.25 causes vanishing gradients in deep networks.",
    "TensorFlow and PyTorch implement automatic differentiation by building a computation graph and applying the chain rule automatically during the backward pass."
  ]
}
\`\`\``,
      starterCode: `# Derivatives and the Chain Rule
# In neural networks, backpropagation uses the chain rule to compute gradients.
# Let's implement derivatives manually to understand what's happening under the hood.

import math

# --- Part 1: Single-variable derivatives ---
# The derivative of f(x) measures how much f changes as x changes.
# Numerically: f'(x) ≈ (f(x + h) - f(x)) / h  for small h

def numerical_derivative(f, x, h=1e-5):
    """
    Compute the numerical derivative of f at point x.
    TODO: Implement using the finite difference formula above.
    """
    # TODO: return (f(x + h) - f(x)) / h
    pass


# --- Part 2: Chain rule ---
# If y = f(g(x)), then dy/dx = f'(g(x)) * g'(x)
# This is exactly what backprop does — multiply gradients layer by layer.

def chain_rule_derivative(f, g, x, h=1e-5):
    """
    Compute d/dx [f(g(x))] using the chain rule.
    TODO: Implement by multiplying:
      - the derivative of f evaluated at g(x)
      - the derivative of g evaluated at x
    Hint: reuse numerical_derivative.
    """
    # TODO: compute g_prime_at_x (derivative of g at x)
    # TODO: compute f_prime_at_gx (derivative of f at g(x))
    # TODO: return their product
    pass


# --- Part 3: Backprop through a tiny network ---
# Suppose we have a 2-layer computation:
#   z = w * x          (linear layer)
#   a = sigmoid(z)     (activation)
#   L = (a - y) ** 2  (MSE loss)
#
# We want dL/dw — how the loss changes with the weight.

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def forward(x, w, y):
    """
    Run the forward pass and return (z, a, loss).
    TODO: compute z, a, and loss.
    """
    # TODO: z = w * x
    # TODO: a = sigmoid(z)
    # TODO: loss = (a - y) ** 2
    # TODO: return z, a, loss
    pass

def backward(x, w, y):
    """
    Compute dL/dw analytically using the chain rule:
      dL/dw = dL/da * da/dz * dz/dw
    TODO: implement each gradient term.
    """
    z, a, loss = forward(x, w, y)

    # TODO: dL_da = 2 * (a - y)           # derivative of MSE
    # TODO: da_dz = a * (1 - a)           # derivative of sigmoid
    # TODO: dz_dw = x                     # derivative of z=w*x w.r.t. w
    # TODO: dL_dw = dL_da * da_dz * dz_dw  # chain rule
    # TODO: return dL_dw
    pass


# --- Tests ---
if __name__ == "__main__":
    # Test 1: numerical derivative of x^2 at x=3 should be ~6
    f_sq = lambda x: x ** 2
    print(f"d/dx[x^2] at x=3: {numerical_derivative(f_sq, 3):.4f}  (expected ~6.0)")

    # Test 2: chain rule for sin(x^2) at x=1
    # Analytical answer: cos(1^2) * 2*1 = cos(1)*2 ≈ 1.0806
    result = chain_rule_derivative(math.sin, lambda x: x**2, x=1)
    print(f"d/dx[sin(x^2)] at x=1: {result:.4f}  (expected ~1.0806)")

    # Test 3: verify dL/dw numerically vs analytically
    x, w, y = 2.0, 0.5, 1.0
    analytical = backward(x, w, y)
    loss_fn = lambda w_: forward(x, w_, y)[2]
    numerical = numerical_derivative(loss_fn, w)
    print(f"dL/dw analytical: {analytical:.6f}")
    print(f"dL/dw numerical:  {numerical:.6f}")
    print(f"Match: {abs(analytical - numerical) < 1e-4}")
`,
      solutionCode: `# Derivatives and the Chain Rule — Solution

import math

# --- Part 1: Single-variable derivatives ---

def numerical_derivative(f, x, h=1e-5):
    """
    Finite difference approximation of f'(x).
    As h → 0 this converges to the true derivative.
    """
    return (f(x + h) - f(x)) / h


# --- Part 2: Chain rule ---
# d/dx[f(g(x))] = f'(g(x)) * g'(x)

def chain_rule_derivative(f, g, x, h=1e-5):
    """
    Applies the chain rule numerically.
    Outer function f is differentiated at g(x);
    inner function g is differentiated at x.
    """
    g_prime_at_x = numerical_derivative(g, x, h)      # g'(x)
    f_prime_at_gx = numerical_derivative(f, g(x), h)  # f'(g(x))
    return f_prime_at_gx * g_prime_at_x


# --- Part 3: Backprop through a tiny network ---

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def forward(x, w, y):
    """
    Forward pass:
      z = w * x         linear transform
      a = sigmoid(z)    non-linear activation
      L = (a - y)^2     mean-squared error loss
    """
    z = w * x
    a = sigmoid(z)
    loss = (a - y) ** 2
    return z, a, loss

def backward(x, w, y):
    """
    Backward pass using the chain rule:
      dL/dw = dL/da * da/dz * dz/dw

    Each factor is the local gradient at that node.
    Multiplying them gives the gradient that flows back to w.
    """
    z, a, loss = forward(x, w, y)

    dL_da = 2 * (a - y)    # d/da [(a-y)^2]
    da_dz = a * (1 - a)    # sigmoid derivative: σ(z)(1-σ(z))
    dz_dw = x              # d/dw [w*x] = x

    dL_dw = dL_da * da_dz * dz_dw  # chain rule
    return dL_dw


# --- Tests ---
if __name__ == "__main__":
    # Test 1: d/dx[x^2] at x=3 → 2*3 = 6
    f_sq = lambda x: x ** 2
    print(f"d/dx[x^2] at x=3: {numerical_derivative(f_sq, 3):.4f}  (expected ~6.0)")

    # Test 2: d/dx[sin(x^2)] at x=1 → cos(1)*2 ≈ 1.0806
    result = chain_rule_derivative(math.sin, lambda x: x**2, x=1)
    print(f"d/dx[sin(x^2)] at x=1: {result:.4f}  (expected ~1.0806)")

    # Test 3: analytical vs numerical gradient should agree
    x, w, y = 2.0, 0.5, 1.0
    analytical = backward(x, w, y)
    loss_fn = lambda w_: forward(x, w_, y)[2]
    numerical = numerical_derivative(loss_fn, w)
    print(f"dL/dw analytical: {analytical:.6f}")
    print(f"dL/dw numerical:  {numerical:.6f}")
    print(f"Match: {abs(analytical - numerical) < 1e-4}")
`,
    },
    {
      id: "partial-derivatives-gradients",
      slug: "partial-derivatives-gradients",
      title: "Partial Derivatives and Gradient Vectors",
      content: `# Partial Derivatives and Gradient Vectors

Every machine learning model faces one core question during training: *which direction should each parameter move to reduce the loss?* The answer is encoded entirely in the **gradient** — a vector assembled from partial derivatives. Before you can understand backpropagation, you must understand what a gradient actually is and how to compute one.

In single-variable calculus, a derivative measures slope along one axis. But loss functions in ML depend on thousands of weights simultaneously. You need a tool that handles many variables at once. That tool is the **partial derivative**, and the gradient is what you get when you collect all of them together.

\`\`\`concept
{ "title": "The Partial Derivative: One Variable at a Time", "variant": "mental-model", "content": "Imagine standing on a hilly landscape — your loss surface. To measure how steep it is heading east, you freeze your north-south position and only step east. To measure the slope heading north, you freeze east-west and only step north. A partial derivative does exactly this: it measures how fast f changes along one variable's axis while every other variable is held perfectly still." }
\`\`\`

## Computing Partial Derivatives

For a function f(x, y), the partial derivative with respect to x is written **∂f/∂x**. You compute it by treating y as a constant and applying ordinary differentiation rules with respect to x.

**Example:** Let f(x, y) = x² + 3xy + y²

| Derivative | Computation | At point (2, 1) |
|---|---|---|
| ∂f/∂x | 2x + 3y (treat y as constant) | 2(2) + 3(1) = **7** |
| ∂f/∂y | 3x + 2y (treat x as constant) | 3(2) + 2(1) = **8** |

This says: at the point (2, 1), a tiny step in the x-direction increases f by about 7 times that step size. A tiny step in y increases f by about 8 times.

You can also compute partial derivatives **numerically** — no calculus required, just function evaluations. This is the technique you will use constantly to verify analytic gradient implementations:

\`\`\`trace
{ "title": "Numerical ∂f/∂x at point (2, 1)", "language": "python", "code": "import numpy as np\\n\\ndef f(x, y):\\n    return x**2 + 3*x*y + y**2\\n\\nx, y = 2.0, 1.0\\nh = 1e-5\\n\\n# Nudge x by h, freeze y\\ndf_dx = (f(x + h, y) - f(x, y)) / h\\n\\nprint(f'Numerical  df/dx = {df_dx:.5f}')\\nprint(f'Analytical df/dx = {2*x + 3*y:.5f}')", "frames": [ { "line": 3, "vars": {}, "note": "Define f(x,y) = x² + 3xy + y²" }, { "line": 7, "vars": { "x": 2.0, "y": 1.0 }, "note": "Choose evaluation point (2, 1). y stays frozen throughout." }, { "line": 8, "vars": { "x": 2.0, "y": 1.0, "h": "1e-5" }, "note": "h is a tiny step: small enough to approximate the limit definition, large enough to avoid floating-point cancellation." }, { "line": 11, "vars": { "x": 2.0, "y": 1.0, "h": "1e-5" }, "note": "f(x+h, y): nudge only x, keep y=1.0 frozen. This is the finite-difference approximation of ∂f/∂x." }, { "line": 13, "vars": { "df_dx": 7.0 }, "note": "Result matches analytical value exactly (to 5 decimal places).", "stdout": "Numerical  df/dx = 7.00000\\nAnalytical df/dx = 7.00000" } ], "speed": 900 }
\`\`\`

## The Gradient Vector

Once you have all partial derivatives, you assemble them into one object: the **gradient vector**.

For a function f(x₁, x₂, …, xₙ):

> **∇f = [ ∂f/∂x₁,  ∂f/∂x₂,  …,  ∂f/∂xₙ ]**

The gradient is not just a list of numbers — it is a vector with **both direction and magnitude**:

- **Direction:** points toward the steepest uphill slope from the current point
- **Magnitude:** indicates how steep that slope is (larger magnitude = steeper terrain)

\`\`\`concept
{ "title": "The Gradient Always Points Uphill", "variant": "rule", "content": "∇f at any point points in the direction of steepest ASCENT — the direction that increases f the fastest. To MINIMIZE a function (like a loss), gradient descent moves in the NEGATIVE gradient direction:\\n\\nw ← w − α · ∇f\\n\\nThe minus sign is not a typo. It is the entire idea." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Misconception: The Gradient Points Downhill", "content": "This is the most common confusion in early ML study. The gradient ∇f points toward the steepest INCREASE. Gradient **descent** works by moving in the direction of −∇f (negative gradient) to go downhill. Every weight update you will ever write subtracts a scaled gradient — never adds it." }
\`\`\`

## Gradient Descent in Action

In ML, your loss function L(w₁, w₂, …, wₙ) depends on all model weights. The gradient ∇L gives you — for every weight simultaneously — how much increasing that weight would increase or decrease the loss.

The update rule for every weight wᵢ is:

> **wᵢ ← wᵢ − α · (∂L/∂wᵢ)**

where α is the **learning rate** — the step size in the negative gradient direction.

The array below shows the loss value at each gradient descent step on a simple quadratic loss:

\`\`\`algoviz
{ "title": "Loss Decreasing Over Gradient Descent Steps", "type": "array", "data": [9.0, 6.48, 4.67, 3.36, 2.42, 1.74, 1.26, 0.91, 0.65, 0.47], "frames": [ { "highlight": [0], "label": "Step 0: Starting loss = 9.0. Gradient is large — steep terrain, big update.", "stats": { "step": 0, "loss": 9.0, "lr": 0.1 } }, { "highlight": [1], "label": "Step 1: Move opposite to ∇L. Loss drops to 6.48.", "stats": { "step": 1, "loss": 6.48, "lr": 0.1 } }, { "highlight": [2], "label": "Step 2: Loss = 4.67. Each step: w ← w − α·∇L.", "stats": { "step": 2, "loss": 4.67, "lr": 0.1 } }, { "highlight": [3], "label": "Step 3: Loss = 3.36. Gradient magnitude shrinking as we approach flat region.", "stats": { "step": 3, "loss": 3.36, "lr": 0.1 } }, { "highlight": [4], "label": "Step 4: Loss = 2.42. Steps get smaller automatically — gradient shrinks near minimum.", "stats": { "step": 4, "loss": 2.42, "lr": 0.1 } }, { "highlight": [6], "label": "Step 6: Loss = 1.26. Converging steadily.", "stats": { "step": 6, "loss": 1.26, "lr": 0.1 } }, { "highlight": [8], "label": "Step 8: Loss = 0.65. Almost at minimum.", "stats": { "step": 8, "loss": 0.65, "lr": 0.1 } }, { "highlight": [9], "label": "Step 9: Loss = 0.47. At minimum, ∇L ≈ 0 — updates become negligible.", "stats": { "step": 9, "loss": 0.47, "lr": 0.1 } } ], "speed": 800 }
\`\`\`

Notice that steps get smaller automatically as the loss approaches its minimum — because the gradient itself shrinks as the slope flattens. You never had to decrease the learning rate manually.

## Numerical vs Analytical Gradients

There are two ways to obtain a gradient in practice:

| Method | How | When to Use |
|---|---|---|
| **Analytical** | Derive ∂f/∂xᵢ using calculus rules | Training — exact and fast |
| **Numerical** | Approximate with (f(x+h) − f(x)) / h per parameter | Gradient checking / debugging only |

Numerical gradients require one function call per parameter — hopelessly slow for a million-weight network. But they need no math, so you use them to **verify** that your hand-derived or backprop-generated gradients are correct. This technique is called a **gradient check**.

\`\`\`playground
{ "title": "Numerical vs Analytical Gradient — With Gradient Descent", "language": "python", "runnable": true, "code": "import numpy as np\\n\\n# Loss: L(w1, w2) = (w1 - 3)^2 + (w2 - 5)^2\\n# Minimum at w1=3, w2=5  (loss=0)\\n\\ndef loss(w1, w2):\\n    return (w1 - 3)**2 + (w2 - 5)**2\\n\\n# Analytical gradient (derived by hand)\\ndef grad_analytical(w1, w2):\\n    return np.array([2*(w1 - 3), 2*(w2 - 5)])\\n\\n# Numerical gradient (finite differences)\\ndef grad_numerical(w1, w2, h=1e-5):\\n    dL_dw1 = (loss(w1 + h, w2) - loss(w1, w2)) / h\\n    dL_dw2 = (loss(w1, w2 + h) - loss(w1, w2)) / h\\n    return np.array([dL_dw1, dL_dw2])\\n\\n# --- Gradient check at (0, 0) ---\\nw1, w2 = 0.0, 0.0\\ng_a = grad_analytical(w1, w2)\\ng_n = grad_numerical(w1, w2)\\nprint('=== Gradient Check at (0, 0) ===')\\nprint(f'  Analytical: {g_a}')\\nprint(f'  Numerical:  {g_n}')\\nprint(f'  Max difference: {np.max(np.abs(g_a - g_n)):.2e}  (should be ~1e-5)')\\nprint()\\n\\n# --- Gradient descent ---\\nw1, w2 = 0.0, 0.0\\nalpha = 0.2\\nprint(f'Step | w1      | w2      | Loss')\\nprint('-' * 38)\\nfor step in range(8):\\n    L = loss(w1, w2)\\n    print(f'{step:>4} | {w1:>7.4f} | {w2:>7.4f} | {L:.4f}')\\n    g = grad_analytical(w1, w2)\\n    w1 = w1 - alpha * g[0]   # move opposite to gradient\\n    w2 = w2 - alpha * g[1]\\n\\nprint(f'\\\\nFinal: w1={w1:.4f}, w2={w2:.4f}')\\nprint(f'True minimum: w1=3.0, w2=5.0')\\n" }
\`\`\`

## Gradients in N-Dimensional Weight Space

When your model has n weights, the loss is an n-dimensional surface and the gradient is an n-dimensional vector. In vector form:

\`\`\`
∇L(w) = [ ∂L/∂w₁,  ∂L/∂w₂,  …,  ∂L/∂wₙ ]
w  ←  w  −  α · ∇L(w)
\`\`\`

This single update equation — applied to every parameter simultaneously — is how every neural network trains. Backpropagation is the efficient algorithm for computing this gradient; the gradient itself is what we have been building toward in this entire module.

Now practice filling in the blanks to complete a numerical gradient function:

\`\`\`fillblank
{ "title": "Complete the Numerical Gradient Function", "prompt": "Fill in the blanks to compute the numerical gradient of f(x, y) = x² + y² using finite differences. Expected output at (3, 4): approximately [6.0, 8.0].", "language": "python", "template": "import numpy as np\\n\\ndef f(x, y):\\n    return x**2 + y**2\\n\\ndef numerical_gradient(x, y, h=1e-5):\\n    df_dx = (f(___ + h, y) - f(x, y)) / ___\\n    df_dy = (f(x, ___ + h) - f(x, y)) / h\\n    return np.array([df_dx, df_dy])\\n\\nprint(numerical_gradient(3.0, 4.0))\\n# Analytical answer: [2*3, 2*4] = [6.0, 8.0]", "blanks": [ { "answer": "x", "hint": "For df/dx, which variable do you nudge by h?" }, { "answer": "h", "hint": "Divide by the step size to get rate-of-change (rise over run)" }, { "answer": "y", "hint": "For df/dy, freeze x and nudge which variable?" } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "For f(x, y) = 3x²y + y³, what is ∂f/∂x at point (1, 2)?", "options": ["6", "12", "11", "3"], "answer": 1, "explanation": "Treat y as a constant and differentiate: ∂f/∂x = 6xy. At (1, 2): 6 · 1 · 2 = 12. The y³ term vanishes because y is treated as a constant (its derivative with respect to x is 0)." }, { "question": "The gradient vector ∇f at a point always points in the direction of:", "options": ["Steepest descent — downhill toward the minimum", "Steepest ascent — in the direction that increases f fastest", "The nearest saddle point", "Zero, at any local minimum or maximum"], "answer": 1, "explanation": "∇f always points uphill — toward steepest ASCENT. Gradient descent works by following −∇f (the negative gradient) to go downhill and minimize the loss function. The minus sign in w ← w − α·∇L is what makes it descent." }, { "question": "You are at point (3, 4) with f(x, y) = x² + y². What is the gradient vector ∇f?", "options": ["[3, 4]", "[6, 4]", "[6, 8]", "[9, 16]"], "answer": 2, "explanation": "∂f/∂x = 2x = 6, and ∂f/∂y = 2y = 8. So ∇f = [6, 8]. The y-component (8) is larger than the x-component (6), meaning the function is currently rising faster in the y-direction than the x-direction at this point." }, { "question": "In the gradient descent update rule w ← w − α · ∇L, what role does α play?", "options": ["It selects which parameter to update", "It controls the direction of the gradient", "It scales the step size — how far to move in the negative gradient direction", "It ensures the gradient points downhill"], "answer": 2, "explanation": "α (the learning rate) is a scalar that scales the gradient. Too large: the step overshoots the minimum and the loss may diverge. Too small: convergence is very slow. The gradient ∇L provides the direction; α scales how far you move." }, { "question": "Why is numerical gradient checking useful even though it is computationally expensive?", "options": ["Numerical gradients are always more accurate than analytical ones", "It avoids the need to understand calculus entirely", "It provides a ground-truth verification that analytical or backprop gradients are implemented correctly", "It is the only method that works for functions with more than 2 parameters"], "answer": 2, "explanation": "Numerical gradients require O(n) loss evaluations (one per parameter), making them too slow for training large networks. But they make no assumptions — they just call the loss function twice per parameter. Comparing numerical vs analytical gradients is a standard debugging technique when implementing backpropagation from scratch." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A partial derivative ∂f/∂xᵢ measures how f changes as xᵢ varies, with all other variables held constant — one axis at a time.", "The gradient ∇f = [∂f/∂x₁, ∂f/∂x₂, …, ∂f/∂xₙ] is a vector pointing in the direction of steepest ASCENT (not descent).", "Gradient descent minimizes loss by moving in the NEGATIVE gradient direction: w ← w − α·∇L.", "Numerical gradients approximate ∂f/∂xᵢ ≈ (f(xᵢ+h) − f(xᵢ)) / h using finite differences — exact enough for gradient checks, too slow for training.", "In an n-parameter model, the gradient is an n-dimensional vector updated in a single pass — this efficiency is why backpropagation was invented." ] }
\`\`\``,
      starterCode: `import math

# Partial Derivatives and Gradient Vectors
# Goal: compute gradients numerically and verify against analytical formulas

def f(x, y):
    """Our multi-variable function: f(x, y) = x^2 + 3*x*y + y^2"""
    return x**2 + 3*x*y + y**2

# TODO 1: Implement numerical partial derivative with respect to x
# Use the finite difference formula: df/dx ≈ (f(x+h, y) - f(x-h, y)) / (2*h)
# h should be a small value like 1e-5
def partial_x_numerical(f, x, y, h=1e-5):
    pass

# TODO 2: Implement numerical partial derivative with respect to y
# Use the same finite difference approach but vary y instead of x
def partial_y_numerical(f, x, y, h=1e-5):
    pass

# TODO 3: Implement the analytical partial derivative with respect to x
# For f(x, y) = x^2 + 3*x*y + y^2, df/dx = 2x + 3y
def partial_x_analytical(x, y):
    pass

# TODO 4: Implement the analytical partial derivative with respect to y
# For f(x, y) = x^2 + 3*x*y + y^2, df/dy = 3x + 2y
def partial_y_analytical(x, y):
    pass

# TODO 5: Implement the gradient function
# The gradient is the vector of all partial derivatives: grad f = [df/dx, df/dy]
# Return a tuple (df_dx, df_dy) using the NUMERICAL approach
def gradient(f, x, y):
    pass

# --- Verification ---
if __name__ == "__main__":
    test_points = [(1.0, 2.0), (0.0, 0.0), (-1.0, 3.0)]

    print("Verifying partial derivatives at test points:\\n")
    for x, y in test_points:
        num_dx = partial_x_numerical(f, x, y)
        num_dy = partial_y_numerical(f, x, y)
        ana_dx = partial_x_analytical(x, y)
        ana_dy = partial_y_analytical(x, y)
        grad = gradient(f, x, y)

        print(f"Point ({x}, {y}):")
        print(f"  df/dx — numerical: {num_dx:.6f}, analytical: {ana_dx:.6f}, match: {math.isclose(num_dx, ana_dx, rel_tol=1e-4)}")
        print(f"  df/dy — numerical: {num_dy:.6f}, analytical: {ana_dy:.6f}, match: {math.isclose(num_dy, ana_dy, rel_tol=1e-4)}")
        print(f"  gradient vector: ({grad[0]:.6f}, {grad[1]:.6f})")
        print()
`,
      solutionCode: `import math

# Partial Derivatives and Gradient Vectors
# Goal: compute gradients numerically and verify against analytical formulas

def f(x, y):
    """Our multi-variable function: f(x, y) = x^2 + 3*x*y + y^2"""
    return x**2 + 3*x*y + y**2

# Numerical partial derivative with respect to x
# Central difference is more accurate than forward difference: O(h^2) vs O(h) error
def partial_x_numerical(f, x, y, h=1e-5):
    return (f(x + h, y) - f(x - h, y)) / (2 * h)

# Numerical partial derivative with respect to y
# Same idea — hold x constant, nudge y in both directions
def partial_y_numerical(f, x, y, h=1e-5):
    return (f(x, y + h) - f(x, y - h)) / (2 * h)

# Analytical df/dx for f(x,y) = x^2 + 3xy + y^2
# Treat y as a constant and differentiate: d/dx(x^2) + d/dx(3xy) + d/dx(y^2)
#   = 2x + 3y + 0
def partial_x_analytical(x, y):
    return 2*x + 3*y

# Analytical df/dy for f(x,y) = x^2 + 3xy + y^2
# Treat x as a constant and differentiate: d/dy(x^2) + d/dy(3xy) + d/dy(y^2)
#   = 0 + 3x + 2y
def partial_y_analytical(x, y):
    return 3*x + 2*y

# Gradient: the vector pointing in the direction of steepest ascent
# grad f(x, y) = (df/dx, df/dy)
def gradient(f, x, y):
    df_dx = partial_x_numerical(f, x, y)
    df_dy = partial_y_numerical(f, x, y)
    return (df_dx, df_dy)

# --- Verification ---
if __name__ == "__main__":
    test_points = [(1.0, 2.0), (0.0, 0.0), (-1.0, 3.0)]

    print("Verifying partial derivatives at test points:\\n")
    for x, y in test_points:
        num_dx = partial_x_numerical(f, x, y)
        num_dy = partial_y_numerical(f, x, y)
        ana_dx = partial_x_analytical(x, y)
        ana_dy = partial_y_analytical(x, y)
        grad = gradient(f, x, y)

        print(f"Point ({x}, {y}):")
        print(f"  df/dx — numerical: {num_dx:.6f}, analytical: {ana_dx:.6f}, match: {math.isclose(num_dx, ana_dx, rel_tol=1e-4)}")
        print(f"  df/dy — numerical: {num_dy:.6f}, analytical: {ana_dy:.6f}, match: {math.isclose(num_dy, ana_dy, rel_tol=1e-4)}")
        print(f"  gradient vector: ({grad[0]:.6f}, {grad[1]:.6f})")
        print()
`,
    },
    {
      id: "matrix-calculus",
      slug: "matrix-calculus",
      title: "Matrix Calculus: Jacobians and Hessians",
      content: `# Matrix Calculus: Jacobians and Hessians

Every gradient descent update is matrix calculus in disguise. When backpropagation flows errors through a neural network, it chains Jacobians. When Newton's method leaps toward a minimum, it inverts a Hessian. This lesson gives you the machinery to derive these operations yourself — and read any ML paper's math without fear.

\`\`\`concept
{ "title": "The Derivative Hierarchy", "variant": "mental-model", "content": "Single-variable calculus gives you one tool: df/dx. Multivariate calculus generalizes it:\\n\\n• Scalar f, vector x  →  Gradient ∇f  (vector of first partials)\\n• Vector f, vector x  →  Jacobian J  (matrix of all first partials)\\n• Scalar f, vector x  →  Hessian H  (matrix of all second partials)\\n\\nJacobians extend gradients to multi-output functions. Hessians capture curvature. Both appear in every ML training algorithm." }
\`\`\`

---

## The Jacobian: Derivatives of Vector-Valued Functions

Suppose your function maps vectors to vectors: **f** : ℝⁿ → ℝᵐ. The **Jacobian** J ∈ ℝᵐˣⁿ collects every first-order partial derivative into a single matrix:

\`\`\`
J_{ij} = ∂fᵢ / ∂xⱼ

     ┌ ∂f₁/∂x₁   ∂f₁/∂x₂   ···   ∂f₁/∂xₙ ┐
J =  │ ∂f₂/∂x₁   ∂f₂/∂x₂   ···   ∂f₂/∂xₙ │
     └ ∂fₘ/∂x₁   ∂fₘ/∂x₂   ···   ∂fₘ/∂xₙ ┘
\`\`\`

Row *i* shows how output **f**ᵢ responds to every input. Column *j* shows how every output responds to input xⱼ.

\`\`\`callout
{ "type": "info", "title": "Shape Rule", "content": "If f : ℝⁿ → ℝᵐ, then J ∈ ℝᵐˣⁿ — rows = outputs, columns = inputs.\\n\\nWhen f is scalar-valued (m = 1), the Jacobian is a 1×n row vector: the transpose of the gradient. So the gradient is always just a special case of the Jacobian." }
\`\`\`

### Building the Jacobian: A Concrete Example

Let **f**(x₁, x₂) = [x₁² + x₂,  x₁x₂]. At **x** = [2, 3]:

| | ∂/∂x₁ | ∂/∂x₂ |
|---|---|---|
| **f₁** = x₁² + x₂ | 2x₁ = **4** | **1** |
| **f₂** = x₁x₂ | x₂ = **3** | x₁ = **2** |

So **J** = [[4, 1], [3, 2]]. Interpretation: nudging x₁ by ε changes f₁ by 4ε and f₂ by 3ε — simultaneously.

---

## The Hessian: Curvature of the Loss Landscape

\`\`\`concept
{ "title": "The Hessian as a Terrain Map", "variant": "analogy", "content": "Imagine hiking on a loss surface. The gradient tells you which direction is steepest (slope). The Hessian tells you the *shape* of the terrain around your feet — is it a narrow steep valley (high curvature) or a flat plain (low curvature)?\\n\\nGradient descent ignores curvature and can oscillate in narrow valleys. Newton's method uses the Hessian to take one precise step — but at the cost of computing and inverting an n×n matrix." }
\`\`\`

For a scalar function L : ℝⁿ → ℝ, the Hessian **H** ∈ ℝⁿˣⁿ is:

\`\`\`
H_{ij} = ∂²L / (∂xᵢ ∂xⱼ)
\`\`\`

Key facts:
- **H is always symmetric** (Clairaut's theorem: mixed partials commute for smooth functions)
- **H positive definite** → local minimum (curves up in every direction)
- **H negative definite** → local maximum
- **H indefinite** → saddle point (the most common obstacle in deep learning)

\`\`\`tabs
{ "tabs": [ { "label": "Jacobian", "icon": "🔀", "content": "**Use when:** f is *vector-valued* (ℝⁿ → ℝᵐ)\\n\\n**Shape:** m × n\\n\\n**In ML:** Backpropagation. Each hidden layer computes a vector-to-vector map. The chain rule becomes a chain of Jacobian multiplications:\\n\\n\`δL/δx = Jᵀ · δL/δf\`\\n\\nFor a linear layer \`f(x) = Wx\`, the Jacobian of f w.r.t. x is simply W.\\n\\n**Key insight:** The Jacobian of a *linear* map Ax is always A itself — no matter what x is." }, { "label": "Hessian", "icon": "📐", "content": "**Use when:** L is *scalar-valued* and you need curvature\\n\\n**Shape:** n × n\\n\\n**In ML:** Second-order optimizers (Newton, L-BFGS, Adam's adaptive learning rates approximate the diagonal of H). Also used to identify saddle points vs. minima.\\n\\n**Example:** For \`L = (1/2) wᵀAw\`, the gradient is \`∇L = Aw\` and the Hessian is \`H = A\`. Curvature is constant over any quadratic surface.\\n\\n**Cost:** Computing H exactly costs O(n²) memory — prohibitive for millions of parameters. Practical optimizers approximate it." }, { "label": "Gradient", "icon": "🧭", "content": "**Use when:** L is scalar-valued (standard ML training)\\n\\n**Shape:** n × 1 (same shape as w)\\n\\n**In ML:** The workhorse of gradient descent. The update rule is:\\n\\n\`w ← w − α · ∇_w L\`\\n\\n**Relationship to Jacobian:** The gradient is the transpose of the Jacobian when the output is scalar-valued:\\n\\n\`∇L = Jᵀ    (when f : ℝⁿ → ℝ)\`\\n\\nSo every gradient is a Jacobian — just a special, scalar-output case." } ] }
\`\`\`

---

## Deriving the MSE Gradient in Matrix Form

This is the derivation every ML practitioner should know cold. We'll do it from scratch using matrix calculus.

**Setup:** n training examples, d features. Design matrix **X** ∈ ℝⁿˣᵈ, targets **y** ∈ ℝⁿ, weights **w** ∈ ℝᵈ.

**Goal:** Find ∇_**w** L where L(**w**) = (1/n) ‖**Xw** − **y**‖²

\`\`\`steps
{ "title": "MSE Gradient Derivation", "steps": [ { "title": "Write the loss as a squared norm", "content": "L(w) = (1/n) ‖Xw - y‖²\\n\\n= (1/n)(Xw - y)ᵀ(Xw - y)\\n\\nThis is a scalar function of w ∈ ℝᵈ. Our answer ∇_w L must also have shape d×1 — same as w." }, { "title": "Substitute the residual vector", "content": "Let e = Xw - y ∈ ℝⁿ   (the prediction errors)\\n\\nThen L = (1/n) eᵀe = (1/n) Σᵢ eᵢ²\\n\\nThis substitution lets us apply the chain rule cleanly — a trick you will use in every backprop derivation." }, { "title": "Compute the Jacobian of e w.r.t. w", "content": "e = Xw - y, so ∂eᵢ/∂wⱼ = Xᵢⱼ\\n\\nThe full Jacobian: ∂e/∂w = X ∈ ℝⁿˣᵈ\\n\\nKey insight: the Jacobian of any linear map Xw is just X. No computation needed — linearity makes derivatives trivial." }, { "title": "Compute ∂L/∂e", "content": "L = (1/n) Σᵢ eᵢ², so ∂L/∂eᵢ = (2/n) eᵢ\\n\\nIn vector form: ∂L/∂e = (2/n) e ∈ ℝⁿ" }, { "title": "Chain rule: combine the pieces", "content": "∇_w L = (∂e/∂w)ᵀ · (∂L/∂e)\\n        = Xᵀ · (2/n) e\\n        = (2/n) Xᵀ(Xw - y)\\n\\nGradient descent update:\\nw ← w - α · (2/n) Xᵀ(Xw - y)" } ] }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "The MSE Gradient in Matrix Form", "content": "∇_w L = (2/n) Xᵀ(Xw − y)\\n\\nAnd the Hessian: H = (2/n) XᵀX\\n\\nSince XᵀX is always positive semi-definite (vᵀXᵀXv = ‖Xv‖² ≥ 0 for any v), MSE has no saddle points or local minima — it is convex. Any minimum gradient descent finds is the global minimum." }
\`\`\`

---

## Seeing It Execute

Let's trace through a small example: **X** = [[1,2],[3,4]], **y** = [5,6], **w** = [1,1].

\`\`\`trace
{ "title": "MSE Gradient — Line by Line", "language": "python", "code": "import numpy as np\\n\\nX = np.array([[1, 2], [3, 4]], dtype=float)\\ny = np.array([5.0, 6.0])\\nw = np.array([1.0, 1.0])\\n\\n# Step 1: residuals e = Xw - y\\ne = X @ w - y\\n\\n# Step 2: MSE loss\\nn = len(y)\\nL = (1 / n) * np.sum(e ** 2)\\n\\n# Step 3: gradient = (2/n) * X^T @ e\\ngrad = (2 / n) * X.T @ e", "frames": [ { "line": 3, "vars": {"X": "[[1,2],[3,4]]", "y": "[5,6]", "w": "[1,1]"}, "note": "Initialize: X is 2×2, y and w are length-2 vectors." }, { "line": 8, "vars": {"e": "[-2.0, 1.0]"}, "note": "e = Xw - y = [1·1+2·1, 3·1+4·1] - [5,6] = [3,7] - [5,6] = [-2, 1]. The model undershoots on example 1, overshoots on example 2." }, { "line": 12, "vars": {"n": 2, "L": 2.5}, "note": "L = (1/2)·((-2)² + 1²) = (1/2)·5 = 2.5. This is the cost we want to minimize." }, { "line": 15, "vars": {"grad": "[1.0, 0.0]"}, "note": "Xᵀ = [[1,3],[2,4]]. (2/2)·Xᵀ·[-2,1] = [[1,3],[2,4]]·[-2,1] = [1·(-2)+3·1, 2·(-2)+4·1] = [1, 0]. Gradient descent will decrease w[0] by α·1." } ], "speed": 900 }
\`\`\`

---

## NumPy Implementation

\`\`\`playground
{ "title": "Jacobians, MSE Gradient & Hessian in NumPy", "language": "python", "runnable": true, "code": "import numpy as np\\n\\n# === Part 1: Numerical Jacobian (finite differences) ===\\ndef numerical_jacobian(f, x, eps=1e-5):\\n    fx = f(x)\\n    n, m = len(x), len(fx)\\n    J = np.zeros((m, n))\\n    for j in range(n):\\n        xp, xm = x.copy(), x.copy()\\n        xp[j] += eps\\n        xm[j] -= eps\\n        J[:, j] = (f(xp) - f(xm)) / (2 * eps)\\n    return J\\n\\n# f(x1, x2) = [x1^2 + x2, x1 * x2]\\ndef f(x):\\n    return np.array([x[0]**2 + x[1], x[0] * x[1]])\\n\\nx = np.array([2.0, 3.0])\\nJ_num = numerical_jacobian(f, x)\\nJ_ana = np.array([[2*x[0], 1.0], [x[1], x[0]]])\\n\\nprint(\\"=== Jacobian at x=[2,3] ===\\")\\nprint(\\"Numerical :\\\\n\\", J_num)\\nprint(\\"Analytical:\\\\n\\", J_ana)\\nprint(\\"Max error :\\", np.max(np.abs(J_num - J_ana)))\\n\\n# === Part 2: MSE Gradient and Hessian ===\\nnp.random.seed(42)\\nn_samples, n_features = 100, 4\\nX = np.random.randn(n_samples, n_features)\\ntrue_w = np.array([1.5, -2.0, 0.5, 3.0])\\ny = X @ true_w + 0.1 * np.random.randn(n_samples)\\nw = np.zeros(n_features)\\n\\ndef mse_loss(w):\\n    e = X @ w - y\\n    return np.mean(e**2)\\n\\ndef mse_gradient(X, y, w):\\n    e = X @ w - y\\n    return (2 / len(y)) * X.T @ e\\n\\ndef mse_hessian(X):\\n    return (2 / len(X)) * X.T @ X\\n\\nH = mse_hessian(X)\\nprint(\\"\\\\n=== MSE at w=0:\\", round(mse_loss(w), 4))\\nprint(\\"Hessian eigenvalues (all >= 0 confirms convexity):\\")\\nprint(np.round(np.linalg.eigvalsh(H), 4))\\n\\n# === Part 3: Gradient Descent using the matrix gradient ===\\nalpha = 0.01\\nfor _ in range(200):\\n    w -= alpha * mse_gradient(X, y, w)\\n\\nprint(\\"\\\\n=== After 200 GD steps ===\\")\\nprint(\\"Recovered w:\\", np.round(w, 3))\\nprint(\\"True w:     \\", true_w)\\nprint(\\"Final MSE:  \\", round(mse_loss(w), 6))" }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Gradient Checking — Always Do This", "content": "When implementing backprop from scratch, verify your analytical gradient against the numerical Jacobian. If \`max_error < 1e-5\`, your math is correct. This technique is called a **gradient check** and catches sign errors, transposition bugs, and chain rule mistakes before they silently corrupt training." }
\`\`\`

---

## Practice

\`\`\`fillblank
{ "title": "Complete the MSE Gradient", "prompt": "Fill in the two blanks to implement the analytical MSE gradient. Formula: ∇_w L = (2/n) Xᵀ(Xw − y)", "language": "python", "template": "import numpy as np\\n\\ndef mse_gradient(X, y, w):\\n    n = len(y)\\n    e = ___ @ w - y           # residuals: Xw - y\\n    grad = (2 / n) * ___ @ e  # (2/n) * X^T @ e\\n    return grad", "blanks": [ { "answer": "X", "hint": "Predictions = design matrix multiplied by weights" }, { "answer": "X.T", "hint": "The gradient formula requires the transpose of the design matrix" } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Matrix Calculus Check", "questions": [ { "question": "A function f : ℝ³ → ℝ⁴ maps a 3-dimensional input to a 4-dimensional output. What is the shape of its Jacobian?", "options": ["3 × 4", "4 × 3", "3 × 3", "4 × 4"], "answer": 1, "explanation": "The Jacobian shape is (outputs × inputs) = 4 × 3. Row i contains the partial derivatives of output fᵢ with respect to all 3 inputs. When the output is scalar (m=1), this collapses to a 1×n row vector — the transpose of the gradient." }, { "question": "For MSE loss L(w) = (1/n)‖Xw − y‖², what is the Hessian ∇²_w L?", "options": ["(2/n) Xᵀy", "(2/n) XᵀX", "(2/n) XXᵀ", "(2/n) Xᵀ(Xw − y)"], "answer": 1, "explanation": "Differentiating the gradient ∇L = (2/n)Xᵀ(Xw−y) with respect to w gives H = (2/n)XᵀX. This matrix is always positive semi-definite (since vᵀXᵀXv = ‖Xv‖² ≥ 0), proving MSE is convex — gradient descent will always find the global minimum." }, { "question": "What does a positive definite Hessian at a point where ∇L = 0 tell you?", "options": ["It is a saddle point", "It is a local maximum", "It is a local minimum", "The function is linear there"], "answer": 2, "explanation": "A positive definite Hessian means the function curves upward in every direction from that point. Combined with ∇L = 0 (a critical point), this confirms a local minimum. Negative definite → local maximum. Indefinite → saddle point, which is common in deep networks." }, { "question": "Why does backpropagation use Jacobians rather than simple gradients?", "options": ["Jacobians are computationally cheaper to compute", "Hidden layers are vector-to-vector functions; their derivatives are matrices (Jacobians), not vectors", "Gradients only work for scalar inputs", "Jacobians handle non-differentiable functions better"], "answer": 1, "explanation": "Hidden layers compute vector-to-vector functions: e.g., f(x) = ReLU(Wx + b) maps ℝⁿ → ℝᵐ. The derivative of a vector-to-vector function is a Jacobian matrix. Backpropagation chains these Jacobians via the chain rule: δL/δx = Jᵀ · δL/δf, propagating loss gradients layer by layer toward the inputs." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["The Jacobian (m × n) collects all first-order partial derivatives of a vector-valued function — it is the matrix generalization of a gradient, and is central to backpropagation.", "The Hessian (n × n) collects all second-order partial derivatives of a scalar function — it encodes the curvature of the loss landscape and drives second-order optimizers.", "The MSE gradient derives cleanly in matrix form: ∇_w L = (2/n) Xᵀ(Xw − y). One matrix multiply replaces n scalar derivative computations.", "The Hessian of MSE is (2/n) XᵀX, which is always positive semi-definite — MSE is convex, so gradient descent finds the global minimum.", "Always gradient-check new derivations: if your analytical and numerical gradients agree to < 1e-5, your math is correct."] }
\`\`\``,
      starterCode: `import numpy as np

# Matrix Calculus: Gradient of Mean Squared Error
#
# Given a linear model: y_hat = X @ W
# Loss (MSE):           L = (1/n) * ||y - X @ W||^2
#
# Your task: derive and implement the gradient dL/dW
# using matrix calculus (no loops).

np.random.seed(42)

# Dataset: n=50 samples, d=4 features, k=2 outputs
n, d, k = 50, 4, 2
X = np.random.randn(n, d)   # (50, 4) input matrix
W = np.random.randn(d, k)   # (4, 2) weight matrix
y = np.random.randn(n, k)   # (50, 2) target matrix


def mse_loss(X, W, y):
    """
    Compute Mean Squared Error: L = (1/n) * ||y - X @ W||^2
    Returns a scalar.
    """
    # TODO: compute the residuals (y - X @ W)
    residuals = None

    # TODO: compute MSE as the mean of squared residuals
    # Hint: use np.sum() and divide by n
    loss = None

    return loss


def mse_gradient(X, W, y):
    """
    Compute the gradient of MSE with respect to W.

    Derivation:
      L = (1/n) * ||y - XW||_F^2
      dL/dW = ?

    Steps:
      1. Let R = y - XW  (residuals, shape n x k)
      2. dL/dR = -(2/n) * R
      3. Chain rule: dL/dW = X^T @ dL/dR

    Result: dL/dW = -(2/n) * X^T @ (y - X @ W)
    """
    # TODO: compute residuals R = y - X @ W
    R = None

    # TODO: compute the gradient using the formula above
    # Shape should be (d, k) — same as W
    grad = None

    return grad


def numerical_gradient(X, W, y, eps=1e-5):
    """Finite-difference gradient check (reference — do not modify)."""
    grad = np.zeros_like(W)
    for i in range(W.shape[0]):
        for j in range(W.shape[1]):
            W_plus = W.copy(); W_plus[i, j] += eps
            W_minus = W.copy(); W_minus[i, j] -= eps
            grad[i, j] = (mse_loss(X, W_plus, y) - mse_loss(X, W_minus, y)) / (2 * eps)
    return grad


# --- Verification ---
loss = mse_loss(X, W, y)
print(f"MSE Loss: {loss:.6f}")

analytic_grad = mse_gradient(X, W, y)
numeric_grad  = numerical_gradient(X, W, y)

# TODO: compute the relative error between analytic and numeric gradients
# Hint: relative_error = ||analytic - numeric|| / (||analytic|| + ||numeric|| + 1e-8)
relative_error = None

print(f"Analytic gradient (first row): {analytic_grad[0] if analytic_grad is not None else 'None'}")
print(f"Numeric  gradient (first row): {numeric_grad[0]}")
print(f"Relative error: {relative_error}")
print("Gradient check PASSED" if relative_error is not None and relative_error < 1e-5 else "Gradient check FAILED (or not implemented)")
`,
      solutionCode: `import numpy as np

# Matrix Calculus: Gradient of Mean Squared Error
#
# Linear model:  y_hat = X @ W       (n x k)
# MSE loss:      L = (1/n) * ||y - X @ W||_F^2
#
# Gradient derivation:
#   Let R = y - XW  (residuals)
#   L = (1/n) * sum(R^2)  [element-wise]
#   dL/dW = -(2/n) * X^T @ R
#         = -(2/n) * X^T @ (y - X @ W)
#
# This is the Jacobian of a scalar loss w.r.t. a matrix W.

np.random.seed(42)

# Dataset: n=50 samples, d=4 features, k=2 outputs
n, d, k = 50, 4, 2
X = np.random.randn(n, d)   # (50, 4) input matrix
W = np.random.randn(d, k)   # (4, 2) weight matrix
y = np.random.randn(n, k)   # (50, 2) target matrix


def mse_loss(X, W, y):
    """
    Compute Mean Squared Error: L = (1/n) * ||y - X @ W||_F^2
    Returns a scalar.
    """
    residuals = y - X @ W                    # (n, k)
    loss = np.sum(residuals ** 2) / n        # scalar
    return loss


def mse_gradient(X, W, y):
    """
    Gradient of MSE w.r.t. W: dL/dW = -(2/n) * X^T @ (y - X @ W)

    Shape: (d, k) — matches W.

    Intuition:
      - X^T has shape (d, n)
      - Residuals (y - XW) have shape (n, k)
      - Product X^T @ R has shape (d, k)  ✓
    """
    R    = y - X @ W                         # residuals, shape (n, k)
    grad = -(2 / n) * (X.T @ R)             # analytic gradient, shape (d, k)
    return grad


def numerical_gradient(X, W, y, eps=1e-5):
    """Finite-difference gradient check (reference — do not modify)."""
    grad = np.zeros_like(W)
    for i in range(W.shape[0]):
        for j in range(W.shape[1]):
            W_plus = W.copy(); W_plus[i, j] += eps
            W_minus = W.copy(); W_minus[i, j] -= eps
            grad[i, j] = (mse_loss(X, W_plus, y) - mse_loss(X, W_minus, y)) / (2 * eps)
    return grad


# --- Verification ---
loss = mse_loss(X, W, y)
print(f"MSE Loss: {loss:.6f}")

analytic_grad = mse_gradient(X, W, y)
numeric_grad  = numerical_gradient(X, W, y)

# Relative error — should be < 1e-5 for a correct analytic gradient
relative_error = (
    np.linalg.norm(analytic_grad - numeric_grad)
    / (np.linalg.norm(analytic_grad) + np.linalg.norm(numeric_grad) + 1e-8)
)

print(f"Analytic gradient (first row): {analytic_grad[0]}")
print(f"Numeric  gradient (first row): {numeric_grad[0]}")
print(f"Relative error: {relative_error:.2e}")
print("Gradient check PASSED" if relative_error < 1e-5 else "Gradient check FAILED")
`,
    },
    {
      id: "probability-statistics",
      slug: "probability-statistics",
      title: "Probability, Distributions, and Bayes' Theorem",
      content: `# Probability, Distributions, and Bayes' Theorem

Every ML model is, at its core, a machine for managing uncertainty. When a spam filter says "90% likely spam," when a neural network outputs class probabilities, when gradient descent minimizes a loss — probability is the language underneath it all. This lesson builds that language from scratch.

\`\`\`concept
{ "title": "Probability as a Measure of Belief", "variant": "mental-model", "content": "Think of probability not just as frequency ('this coin lands heads 50% of the time') but as a degree of belief ('given what I know, how confident am I?'). This Bayesian view is what makes probability so powerful for ML — it lets us update our beliefs as we see more data." }
\`\`\`

---

## 1. The Three Pillars: Joint, Marginal, and Conditional

Let's ground these in a concrete ML example. Suppose we have a dataset of emails. Each email has two attributes:

- **S** = Spam (1) or Not Spam (0)  
- **W** = Contains the word "free" (1) or not (0)

We can count outcomes and build a **joint probability table** — the full picture of how two events co-occur.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Joint Probability",
    "icon": "🔗",
    "content": "**P(S, W)** — probability that *both* S and W take specific values.\\n\\nFrom 1000 emails:\\n\\n| | W=0 | W=1 |\\n|---|---|---|\\n| S=0 | 0.60 | 0.05 |\\n| S=1 | 0.10 | 0.25 |\\n\\nSo P(S=1, W=1) = 0.25 — 25% of all emails are spam AND contain \\"free\\".\\n\\n**Key rule:** All entries must sum to 1.0."
  },
  {
    "label": "Marginal Probability",
    "icon": "📊",
    "content": "**P(S)** or **P(W)** — probability of one variable, *ignoring* the other.\\n\\nObtained by summing (marginalizing) over the other variable:\\n\\n\`\`\`\\nP(S=1) = P(S=1, W=0) + P(S=1, W=1)\\n        = 0.10 + 0.25\\n        = 0.35\\n\`\`\`\\n\\nSo 35% of emails are spam — regardless of whether they contain \\"free\\".\\n\\n**Rule:** P(A) = Σ_B P(A, B)"
  },
  {
    "label": "Conditional Probability",
    "icon": "🎯",
    "content": "**P(S | W)** — probability of S *given that* we know W.\\n\\n\`\`\`\\nP(S=1 | W=1) = P(S=1, W=1) / P(W=1)\\n             = 0.25 / (0.05 + 0.25)\\n             = 0.25 / 0.30\\n             ≈ 0.833\\n\`\`\`\\n\\nIf an email contains \\"free\\", there's an 83% chance it's spam.\\n\\n**Rule:** P(A | B) = P(A, B) / P(B)\\n\\nThis is the *definition* of conditional probability — and Bayes' theorem follows directly from it."
  }
] }
\`\`\`

---

## 2. Deriving Bayes' Theorem

The derivation is just two lines of algebra. Start with the definition of conditional probability written two ways:

\`\`\`
P(A | B) = P(A, B) / P(B)   →   P(A, B) = P(A | B) · P(B)
P(B | A) = P(A, B) / P(A)   →   P(A, B) = P(B | A) · P(A)
\`\`\`

Since the left-hand sides are equal:

\`\`\`
P(A | B) · P(B) = P(B | A) · P(A)
\`\`\`

Divide both sides by P(B):

$$\\boxed{P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}}$$

That's it. No tricks. Let's name the parts:

| Term | Name | What it means |
|------|------|---------------|
| P(A \\| B) | **Posterior** | Updated belief after seeing evidence B |
| P(A) | **Prior** | Initial belief before seeing evidence |
| P(B \\| A) | **Likelihood** | How probable is B if A is true? |
| P(B) | **Evidence** | Total probability of observing B |

\`\`\`concept
{ "title": "Bayes' Theorem in One Sentence", "variant": "rule", "content": "Posterior ∝ Likelihood × Prior. The denominator P(B) is just a normalizing constant that makes probabilities sum to 1 — in practice, you often don't need to compute it explicitly." }
\`\`\`

---

## 3. Tracing Through the Spam Example

Let's walk Bayes' theorem through our spam classifier step by step.

**Problem:** An email contains the word "free". What's the probability it's spam?

- Prior: P(spam) = 0.35 (35% of all emails are spam)
- Likelihood: P("free" | spam) = 0.25 / 0.35 ≈ 0.714
- Evidence: P("free") = 0.30

\`\`\`trace
{ "title": "Bayes' Theorem — Spam Filter Walkthrough", "language": "python", "code": "# Prior: P(spam)\\nprior = 0.35\\n\\n# Likelihood: P('free' | spam)\\nlikelihood = 0.25 / 0.35\\n\\n# Evidence: P('free') = P('free',spam) + P('free',not_spam)\\nevidence = 0.25 + 0.05\\n\\n# Bayes' theorem\\nposterior = (likelihood * prior) / evidence\\nprint(f'P(spam | free) = {posterior:.4f}')", "frames": [
  { "line": 2, "vars": { "prior": 0.35 }, "note": "P(spam) — 35% of all emails are spam regardless of content", "stdout": "" },
  { "line": 5, "vars": { "prior": 0.35, "likelihood": 0.7143 }, "note": "P('free' | spam) = joint / marginal-spam. Of spam emails, 71.4% contain 'free'", "stdout": "" },
  { "line": 8, "vars": { "prior": 0.35, "likelihood": 0.7143, "evidence": 0.3 }, "note": "P('free') — marginalize over spam/not-spam. 30% of ALL emails contain 'free'", "stdout": "" },
  { "line": 11, "vars": { "prior": 0.35, "likelihood": 0.7143, "evidence": 0.3, "posterior": 0.8333 }, "note": "Posterior = 0.833. Seeing 'free' pushed our belief from 35% → 83% spam!", "stdout": "P(spam | free) = 0.8333" }
], "speed": 900 }
\`\`\`

---

## 4. Coding Bayes from Scratch with NumPy

Now let's implement a full Naive Bayes classifier. The "naive" assumption: features are **conditionally independent** given the class. This lets us multiply likelihoods:

$$P(\\text{spam} \\mid w_1, w_2, \\ldots, w_n) \\propto P(\\text{spam}) \\prod_{i=1}^{n} P(w_i \\mid \\text{spam})$$

\`\`\`playground
{ "title": "Naive Bayes Spam Classifier (NumPy from scratch)", "language": "python", "code": "import numpy as np\\n\\n# ── Dataset ──────────────────────────────────────────────\\n# 8 emails, 4 features: [free, money, hello, meeting]\\n# 1 = word present, 0 = absent\\nX = np.array([\\n    [1, 1, 0, 0],  # spam\\n    [1, 0, 0, 0],  # spam\\n    [0, 1, 0, 0],  # spam\\n    [1, 1, 1, 0],  # spam\\n    [0, 0, 1, 1],  # not spam\\n    [0, 0, 1, 0],  # not spam\\n    [0, 0, 0, 1],  # not spam\\n    [0, 0, 1, 1],  # not spam\\n])\\ny = np.array([1, 1, 1, 1, 0, 0, 0, 0])  # 1=spam, 0=not spam\\nfeature_names = ['free', 'money', 'hello', 'meeting']\\n\\n# ── Training ─────────────────────────────────────────────\\ndef fit_naive_bayes(X, y):\\n    n_samples, n_features = X.shape\\n    classes = np.unique(y)\\n\\n    # Prior: P(class) = count(class) / total\\n    priors = {c: np.mean(y == c) for c in classes}\\n\\n    # Likelihood: P(feature=1 | class) with Laplace smoothing\\n    # Smoothing prevents zero probabilities for unseen features\\n    likelihoods = {}\\n    for c in classes:\\n        X_c = X[y == c]\\n        # Add 1 to numerator, 2 to denominator (Laplace smoothing)\\n        likelihoods[c] = (X_c.sum(axis=0) + 1) / (len(X_c) + 2)\\n\\n    return priors, likelihoods\\n\\n# ── Prediction ───────────────────────────────────────────\\ndef predict_naive_bayes(x, priors, likelihoods):\\n    log_posteriors = {}\\n    for c, prior in priors.items():\\n        # Use log to avoid underflow from tiny probabilities\\n        log_post = np.log(prior)\\n        lk = likelihoods[c]\\n        # P(feature=1|c) if present, P(feature=0|c)=1-P(feature=1|c) if absent\\n        log_post += np.sum(x * np.log(lk) + (1 - x) * np.log(1 - lk))\\n        log_posteriors[c] = log_post\\n\\n    return max(log_posteriors, key=log_posteriors.get), log_posteriors\\n\\n# ── Test it ──────────────────────────────────────────────\\npriors, likelihoods = fit_naive_bayes(X, y)\\n\\nprint('=== Learned Parameters ===')\\nprint(f'P(spam)   = {priors[1]:.2f}')\\nprint(f'P(~spam)  = {priors[0]:.2f}')\\nprint()\\nprint('P(word=1 | class):')\\nprint(f'  {'':12}', ' '.join(f'{w:>8}' for w in feature_names))\\nprint(f'  {'spam':12}', ' '.join(f'{v:>8.3f}' for v in likelihoods[1]))\\nprint(f'  {'not spam':12}', ' '.join(f'{v:>8.3f}' for v in likelihoods[0]))\\n\\nprint()\\nprint('=== Predictions ===')\\ntest_emails = [\\n    ([1, 1, 0, 0], 'email with free+money'),\\n    ([0, 0, 1, 1], 'email with hello+meeting'),\\n    ([1, 0, 1, 0], 'email with free+hello'),\\n]\\nfor features, desc in test_emails:\\n    x = np.array(features)\\n    pred, log_posts = predict_naive_bayes(x, priors, likelihoods)\\n    label = 'SPAM' if pred == 1 else 'NOT SPAM'\\n    # Convert log posteriors to probabilities\\n    log_vals = np.array(list(log_posts.values()))\\n    probs = np.exp(log_vals - log_vals.max())  # numerically stable softmax\\n    probs /= probs.sum()\\n    print(f'  {desc:30} -> {label:10} (P(spam)={probs[1]:.2f})')", "runnable": true }
\`\`\`

---

## 5. Probability Distributions in ML

ML models implicitly assume a distribution over the data. Choosing the right distribution is how you justify your loss function.

\`\`\`tabs
{ "tabs": [
  {
    "label": "Normal (Gaussian)",
    "icon": "🔔",
    "content": "**P(x | μ, σ) = (1/√(2πσ²)) · exp(−(x−μ)²/(2σ²))**\\n\\nWhen you assume data is Gaussian and maximize likelihood, you get **mean squared error** as your loss. This is why linear regression uses MSE — it's the MLE estimator under a Gaussian noise assumption.\\n\\n\`\`\`python\\nimport numpy as np\\n\\ndef gaussian_pdf(x, mu, sigma):\\n    coef = 1 / (np.sqrt(2 * np.pi) * sigma)\\n    exponent = -0.5 * ((x - mu) / sigma) ** 2\\n    return coef * np.exp(exponent)\\n\`\`\`"
  },
  {
    "label": "Bernoulli",
    "icon": "🎲",
    "content": "**P(x | p) = p^x · (1−p)^(1−x)** where x ∈ {0, 1}\\n\\nWhen you assume binary outputs are Bernoulli and maximize likelihood, you get **binary cross-entropy** as your loss. This is why logistic regression uses cross-entropy — it's MLE under a Bernoulli output assumption.\\n\\n\`\`\`python\\ndef bernoulli_log_likelihood(y_true, p_pred):\\n    # Clamp predictions to avoid log(0)\\n    p = np.clip(p_pred, 1e-9, 1 - 1e-9)\\n    return np.mean(y_true * np.log(p) + (1 - y_true) * np.log(1 - p))\\n\`\`\`"
  },
  {
    "label": "Binomial",
    "icon": "📈",
    "content": "**P(k | n, p) = C(n,k) · p^k · (1−p)^(n−k)**\\n\\nProbability of exactly k successes in n trials. Natural model for: number of spam emails in a batch, number of defective items in a shipment.\\n\\n\`\`\`python\\nfrom math import comb\\n\\ndef binomial_pmf(k, n, p):\\n    return comb(n, k) * (p ** k) * ((1 - p) ** (n - k))\\n\\n# P(3 spam in 10 emails if base spam rate is 35%)\\nprint(f'{binomial_pmf(3, 10, 0.35):.4f}')  # 0.2522\\n\`\`\`"
  }
] }
\`\`\`

---

## 6. Maximum Likelihood Estimation — Connecting the Dots

MLE answers: *what parameter values make the observed data most probable?*

\`\`\`concept
{ "title": "MLE = Bayes' Theorem with a Flat Prior", "variant": "insight", "content": "In Bayes' theorem: Posterior ∝ Likelihood × Prior. If your prior P(θ) is uniform (you have no preference for any parameter value), then maximizing the posterior = maximizing the likelihood. MLE is Bayesian inference with a flat prior — that's why the two frameworks converge when data is plentiful." }
\`\`\`

For a Gaussian model, the log-likelihood of data X = {x₁, ..., xₙ} is:

$$\\log P(X \\mid \\mu, \\sigma) = -\\frac{n}{2}\\log(2\\pi\\sigma^2) - \\frac{1}{2\\sigma^2}\\sum_{i=1}^n (x_i - \\mu)^2$$

Maximizing over μ gives the **sample mean**. Maximizing over σ² gives the **sample variance**. That's why these statistics are "natural" — they're MLE estimators under Gaussian assumptions.

\`\`\`playground
{ "title": "MLE: Fitting a Gaussian to Data", "language": "python", "code": "import numpy as np\\n\\n# Generate some data (in practice this would be your dataset)\\nnp.random.seed(42)\\ntrue_mu, true_sigma = 3.0, 1.5\\ndata = np.random.normal(true_mu, true_sigma, size=1000)\\n\\n# ── MLE Estimators ───────────────────────────────────────\\n# Derived analytically by taking d/dmu and d/dsigma of log-likelihood\\nmle_mu = np.mean(data)           # dLL/dmu = 0  → mu_hat = sample mean\\nmle_sigma = np.std(data, ddof=0)  # dLL/dsigma = 0 → sigma_hat = sample std\\n\\nprint(f'True parameters:    mu={true_mu:.2f}, sigma={true_sigma:.2f}')\\nprint(f'MLE estimates:      mu={mle_mu:.4f}, sigma={mle_sigma:.4f}')\\nprint()\\n\\n# ── Log-likelihood as a function of mu ───────────────────\\ndef log_likelihood(X, mu, sigma):\\n    n = len(X)\\n    return -n/2 * np.log(2 * np.pi * sigma**2) - np.sum((X - mu)**2) / (2 * sigma**2)\\n\\nmu_candidates = np.linspace(1.0, 5.0, 9)\\nprint('Log-likelihood at different mu values (sigma fixed at MLE):')\\nfor mu in mu_candidates:\\n    ll = log_likelihood(data, mu, mle_sigma)\\n    bar = '█' * int((ll + 3800) / 30)  # rough bar chart\\n    print(f'  mu={mu:.1f}: {ll:.1f}  {bar}')\\n\\nprint(f'\\\\nMaximum at mu ≈ {mle_mu:.4f} (sample mean)')", "runnable": true }
\`\`\`

---

## 7. Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement Conditional Probability", "prompt": "Complete the function that computes P(A | B) from a joint probability table represented as a 2D NumPy array.", "language": "python", "template": "import numpy as np\\n\\ndef conditional_prob(joint, a, b):\\n    \\"\\"\\"\\n    joint: 2D array where joint[a][b] = P(A=a, B=b)\\n    Returns P(A=a | B=b)\\n    \\"\\"\\"\\n    # Marginal P(B=b) — sum over all values of A\\n    marginal_b = ___\\n\\n    # Conditional probability definition\\n    return ___\\n\\n# Test: spam joint table from earlier\\njoint = np.array([[0.60, 0.05],\\n                  [0.10, 0.25]])\\n# P(spam=1 | word=1)\\nresult = conditional_prob(joint, a=1, b=1)\\nprint(f'P(spam | free) = {result:.4f}')  # Expected: 0.8333", "blanks": [
  { "answer": "joint[:, b].sum()", "hint": "Sum over all rows of column b — that gives the marginal P(B=b)" },
  { "answer": "joint[a, b] / marginal_b", "hint": "Definition: P(A|B) = P(A,B) / P(B)" }
] }
\`\`\`

---

## 8. Visualizing the Bayesian Update

One of the most powerful intuitions in ML: every new observation *updates* your beliefs. This is exactly what a Kalman filter does, what Bayesian neural networks do, and what Naive Bayes does in each step.

\`\`\`algoviz
{ "title": "Bayesian Belief Update — 5 Spam Emails Arrive", "type": "array", "data": [0.35, 0.35, 0.35, 0.35, 0.35, 0.35], "frames": [
  { "highlight": [0], "label": "Prior: P(spam) = 0.35 — 35% base spam rate before seeing any email", "stats": { "email": 0, "P_spam": 0.35 } },
  { "highlight": [1], "label": "Email 1 contains 'free': P(spam|free) = 0.83 — belief jumps sharply", "stats": { "email": 1, "P_spam": 0.83 } },
  { "highlight": [2], "label": "Email 2 contains 'money': posterior updates to 0.91", "stats": { "email": 2, "P_spam": 0.91 } },
  { "highlight": [3], "label": "Email 3 has no spam words: P drops to 0.72 — evidence cuts both ways", "stats": { "email": 3, "P_spam": 0.72 } },
  { "highlight": [4], "label": "Email 4 contains 'free' again: P(spam) = 0.88", "stats": { "email": 4, "P_spam": 0.88 } },
  { "highlight": [5], "label": "Email 5 contains 'hello': not a spam word, P drops to 0.79", "stats": { "email": 5, "P_spam": 0.79 } }
], "speed": 900 }
\`\`\`

---

## 9. Knowledge Check

\`\`\`quiz
{ "title": "Probability & Bayes' Theorem", "questions": [
  {
    "question": "Given P(A=1, B=1) = 0.25 and P(B=1) = 0.30, what is P(A=1 | B=1)?",
    "options": ["0.075", "0.55", "0.833", "1.20"],
    "answer": 2,
    "explanation": "P(A|B) = P(A,B) / P(B) = 0.25 / 0.30 ≈ 0.833. This is the definition of conditional probability."
  },
  {
    "question": "Why do we use log-likelihood instead of likelihood in MLE optimization?",
    "options": [
      "Log makes the math look nicer on paper",
      "Products of many small probabilities underflow to zero; log converts products to sums",
      "Log always produces a higher value than the original likelihood",
      "It is required by NumPy's implementation"
    ],
    "answer": 1,
    "explanation": "When multiplying hundreds of probabilities (all ≤ 1), the product can underflow to 0 in floating-point arithmetic. log converts the product to a sum, which is numerically stable. Maximizing log-likelihood is equivalent to maximizing likelihood since log is monotonically increasing."
  },
  {
    "question": "In Bayes' theorem P(A|B) = P(B|A)·P(A)/P(B), what does P(A) represent?",
    "options": [
      "The posterior — our belief after seeing evidence",
      "The likelihood — how probable is B given A",
      "The prior — our initial belief before seeing evidence",
      "The evidence — total probability of observing B"
    ],
    "answer": 2,
    "explanation": "P(A) is the prior probability — what we believe about A *before* observing B. The posterior P(A|B) is the updated belief *after* incorporating evidence B."
  },
  {
    "question": "Assuming Gaussian noise in a regression problem and maximizing the log-likelihood leads to which loss function?",
    "options": [
      "Binary cross-entropy",
      "Categorical cross-entropy",
      "Mean absolute error",
      "Mean squared error"
    ],
    "answer": 3,
    "explanation": "The Gaussian log-likelihood contains the term −Σ(yᵢ − ŷᵢ)²/(2σ²). Maximizing this is equivalent to minimizing Σ(yᵢ − ŷᵢ)², which is MSE. This is why MSE is the 'natural' loss for regression under Gaussian noise assumptions."
  },
  {
    "question": "In a Naive Bayes classifier, what is the 'naive' assumption?",
    "options": [
      "All classes are equally probable",
      "Features are conditionally independent given the class label",
      "The data follows a normal distribution",
      "The training set is a representative sample of the population"
    ],
    "answer": 1,
    "explanation": "Naive Bayes assumes P(x₁, x₂, ..., xₙ | class) = ∏ P(xᵢ | class). Features are treated as independent given the class. This is 'naive' because features are rarely truly independent in practice, yet the classifier often performs surprisingly well despite this simplification."
  }
] }
\`\`\`

---

## 10. The Deep Connection: Probability → Loss Functions

\`\`\`collapse
{ "title": "Deep Dive: Why Your Loss Function Is a Probability in Disguise", "content": "Every standard ML loss function is a negative log-likelihood under some distributional assumption:\\n\\n| Loss Function | Distributional Assumption |\\n|---|---|\\n| Mean Squared Error | Gaussian noise: y ~ N(ŷ, σ²) |\\n| Binary Cross-Entropy | Bernoulli output: y ~ Bernoulli(σ(ŷ)) |\\n| Categorical Cross-Entropy | Categorical output: y ~ Categorical(softmax(ŷ)) |\\n| Poisson Loss | Count data: y ~ Poisson(exp(ŷ)) |\\n\\nThis is why the probabilistic view of ML is so powerful — it gives you a *principled* way to design loss functions. Instead of asking 'what loss should I use?', ask 'what distribution do I believe generates my labels?' Then the loss follows automatically from MLE.\\n\\nFor example, if you're predicting click counts (non-negative integers), a Poisson assumption gives you the Poisson deviance loss — a better fit than MSE, which can predict negative counts.\\n\\nRegularization also has a probabilistic interpretation: L2 regularization (ridge) = Gaussian prior on weights; L1 regularization (lasso) = Laplace prior on weights. Regularization is MAP (Maximum A Posteriori) estimation, not pure MLE — it adds the log prior term back in." }
\`\`\`

---

\`\`\`callout
{ "type": "tip", "title": "NumPy Pattern to Remember", "content": "When implementing Bayes or MLE with NumPy:\\n1. **Work in log-space** to avoid underflow: \`np.log(p)\` instead of \`p\`\\n2. **Use \`np.sum\` not loops** for log-likelihood computation\\n3. **Add Laplace smoothing** (+1 to counts) whenever you're estimating probabilities from counts — it prevents \`log(0)\` crashes on unseen features" }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Joint probability P(A,B) captures co-occurrence; marginal P(A) = Σ_B P(A,B) collapses one dimension; conditional P(A|B) = P(A,B)/P(B) conditions on known information.",
  "Bayes' theorem P(A|B) = P(B|A)·P(A)/P(B) follows directly from the definition of conditional probability — posterior ∝ likelihood × prior.",
  "Maximum Likelihood Estimation finds parameters that make observed data most probable. Under a Gaussian noise assumption, MLE gives MSE; under Bernoulli, it gives cross-entropy.",
  "Naive Bayes works by applying Bayes' theorem with conditional independence: P(class | features) ∝ P(class) · ∏ P(featureᵢ | class). Use log-space to avoid numerical underflow.",
  "Every standard loss function is a negative log-likelihood in disguise — knowing the distributional assumption tells you which loss to use and why."
] }
\`\`\``,
      starterCode: `# Probability, Distributions, and Bayes' Theorem
# Exercise: Spam Email Classifier using Bayes' Theorem
#
# A dataset of emails has the following statistics:
#   - 30% of emails are spam (P(Spam) = 0.30)
#   - 70% of emails are not spam (P(NotSpam) = 0.70)
#   - 60% of spam emails contain the word "free" (P(free|Spam) = 0.60)
#   - 10% of non-spam emails contain the word "free" (P(free|NotSpam) = 0.10)

P_spam = 0.30
P_not_spam = 0.70
P_free_given_spam = 0.60
P_free_given_not_spam = 0.10

# TODO 1: Calculate the marginal probability P(free)
# Hint: Use the law of total probability:
#   P(free) = P(free|Spam)*P(Spam) + P(free|NotSpam)*P(NotSpam)
P_free = None  # replace with your calculation

# TODO 2: Apply Bayes' theorem to find P(Spam | free)
# Bayes' theorem: P(Spam|free) = P(free|Spam) * P(Spam) / P(free)
P_spam_given_free = None  # replace with your calculation

# TODO 3: Calculate the joint probability P(Spam AND free)
# Hint: P(A and B) = P(A|B) * P(B)
P_spam_and_free = None  # replace with your calculation

# TODO 4: Implement a maximum likelihood estimate (MLE) for P(free|Spam)
# Given a small observed dataset of spam emails, estimate P(free|Spam)
# by counting how many contain "free" divided by total spam emails.
spam_emails = ["get free money", "hello friend", "free offer inside", "meeting at 3pm", "free vacation won"]

def mle_p_free_given_spam(emails):
    """
    Estimate P(free|Spam) from observed spam emails using MLE.
    Returns the fraction of emails that contain the word 'free'.
    """
    # TODO 4a: Count how many emails contain the word 'free'
    count_with_free = None  # replace with your calculation
    
    # TODO 4b: Return the MLE estimate (count / total)
    return None  # replace with your calculation

# --- Print Results ---
print(f"P(free):           {P_free:.4f}")
print(f"P(Spam | free):    {P_spam_given_free:.4f}")
print(f"P(Spam AND free):  {P_spam_and_free:.4f}")
print(f"MLE P(free|Spam):  {mle_p_free_given_spam(spam_emails):.4f}")
`,
      solutionCode: `# Probability, Distributions, and Bayes' Theorem
# Solution: Spam Email Classifier using Bayes' Theorem

P_spam = 0.30
P_not_spam = 0.70
P_free_given_spam = 0.60
P_free_given_not_spam = 0.10

# Step 1: Marginal probability P(free) via the law of total probability
# We sum over all mutually exclusive causes (Spam, NotSpam)
P_free = P_free_given_spam * P_spam + P_free_given_not_spam * P_not_spam
# = 0.60 * 0.30 + 0.10 * 0.70 = 0.18 + 0.07 = 0.25

# Step 2: Bayes' theorem — posterior P(Spam | free)
# Numerator:   likelihood * prior  = P(free|Spam) * P(Spam)
# Denominator: marginal evidence    = P(free)
P_spam_given_free = (P_free_given_spam * P_spam) / P_free
# = (0.60 * 0.30) / 0.25 = 0.18 / 0.25 = 0.72
# Interpretation: seeing "free" raises spam probability from 30% to 72%

# Step 3: Joint probability P(Spam AND free)
# P(A and B) = P(A|B) * P(B)  — the chain rule of probability
P_spam_and_free = P_free_given_spam * P_spam
# = 0.60 * 0.30 = 0.18
# This equals P(Spam|free) * P(free) = 0.72 * 0.25 = 0.18  (consistent)

# Step 4: Maximum Likelihood Estimation (MLE) for P(free|Spam)
# MLE picks the parameter value that maximises the likelihood of the observed data.
# For a Bernoulli trial the MLE is simply the sample proportion.
spam_emails = ["get free money", "hello friend", "free offer inside", "meeting at 3pm", "free vacation won"]

def mle_p_free_given_spam(emails):
    """
    Estimate P(free|Spam) from observed spam emails using MLE.
    MLE for a Bernoulli proportion = successes / total trials.
    """
    # Count emails that contain the word 'free'
    count_with_free = sum(1 for email in emails if "free" in email.lower())
    # Divide by total to get the MLE estimate
    return count_with_free / len(emails)
# Observed: 3 out of 5 spam emails contain 'free' → MLE = 0.60
# This matches the known P(free|Spam) = 0.60 — MLE converges to truth with enough data

# --- Print Results ---
print(f"P(free):           {P_free:.4f}")            # 0.2500
print(f"P(Spam | free):    {P_spam_given_free:.4f}")  # 0.7200
print(f"P(Spam AND free):  {P_spam_and_free:.4f}")    # 0.1800
print(f"MLE P(free|Spam):  {mle_p_free_given_spam(spam_emails):.4f}")  # 0.6000
`,
    },
    {
      id: "eigenvalues-svd",
      slug: "eigenvalues-svd",
      title: "Eigenvalues, Eigenvectors, and SVD Intuition",
      content: `# Eigenvalues, Eigenvectors, and SVD Intuition

Every matrix is a machine that transforms space — it stretches, rotates, shears, and squishes vectors. Most input vectors get knocked off their original direction by this transformation. But a special few vectors only get *scaled* — their direction stays locked, and only their magnitude changes. These are **eigenvectors**, and the scale factors are **eigenvalues**.

Understanding this idea deeply is what separates engineers who *use* PCA from those who *understand* it. This lesson builds that geometric picture, then shows how SVD generalizes the whole framework to any matrix.

---

## The Core Idea: Vectors That Don't Rotate

\`\`\`concept
{ "title": "Eigenvector = A Direction Matrix Cannot Rotate", "variant": "mental-model", "content": "Apply matrix A to any random vector v and you get a new vector pointing somewhere different. But for eigenvectors, Av = λv — the output is just the input scaled by λ. The direction is preserved; only the length changes. Eigenvalues measure *how much* the matrix stretches or compresses along each special direction." }
\`\`\`

Formally, for a square matrix **A**, a non-zero vector **v** is an eigenvector with eigenvalue **λ** if:

**A·v = λ·v**

This reads: "matrix A applied to v gives back v scaled by λ."

- If λ = 2: the vector doubles in length along that direction.
- If λ = 0.5: the vector halves.
- If λ = −1: the vector flips and stays the same length.
- If λ = 0: the vector collapses to zero — the matrix is singular.

---

## Geometric Intuition: Watching Space Stretch

Consider the 2×2 matrix that stretches the x-axis by 3 and the y-axis by 1. The x-axis vector \`[1, 0]\` gets scaled to \`[3, 0]\` — same direction, eigenvalue 3. The y-axis vector \`[0, 1]\` stays put — eigenvalue 1.

\`\`\`algoviz
{
  "title": "How a Diagonal Matrix Transforms Its Eigenvectors",
  "type": "array",
  "data": [1, 0, 0, 1],
  "frames": [
    { "highlight": [0, 1], "label": "Start: eigenvector v1=[1,0] (x-axis direction)", "stats": { "v1_x": 1, "v1_y": 0, "lambda": "?" } },
    { "highlight": [0, 1], "label": "Apply A=[[3,0],[0,1]]: Av1 = [3,0] = 3*[1,0]", "stats": { "v1_x": 3, "v1_y": 0, "lambda": 3 } },
    { "highlight": [2, 3], "label": "Eigenvector v2=[0,1] (y-axis direction)", "stats": { "v2_x": 0, "v2_y": 1, "lambda": "?" } },
    { "highlight": [2, 3], "label": "Apply A: Av2 = [0,1] = 1*[0,1] — unchanged!", "stats": { "v2_x": 0, "v2_y": 1, "lambda": 1 } },
    { "highlight": [0, 1, 2, 3], "label": "Eigenvalues: λ1=3, λ2=1. The matrix stretches x by 3, leaves y alone.", "stats": { "lambda1": 3, "lambda2": 1 } }
  ],
  "speed": 900
}
\`\`\`

---

## Computing Eigenvalues: The Characteristic Polynomial

To find eigenvalues, rearrange **Av = λv** into **(A − λI)v = 0**. A non-trivial solution exists only when:

**det(A − λI) = 0**

This is called the **characteristic equation**. Solving it gives you the eigenvalues; plugging each eigenvalue back in lets you solve for the corresponding eigenvector.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Step-by-Step Example",
      "icon": "🧮",
      "content": "**Matrix:** A = [[4, 1], [2, 3]]\\n\\n**Step 1 — Build A − λI:**\\n\`\`\`\\nA - λI = [[4-λ, 1], [2, 3-λ]]\\n\`\`\`\\n\\n**Step 2 — Set det = 0:**\\n\`\`\`\\n(4-λ)(3-λ) - (1)(2) = 0\\n12 - 7λ + λ² - 2 = 0\\nλ² - 7λ + 10 = 0\\n(λ-5)(λ-2) = 0\\n\`\`\`\\n\\n**Eigenvalues:** λ₁ = 5, λ₂ = 2\\n\\n**Step 3 — Find eigenvectors:**\\nFor λ=5: solve (A−5I)v=0 → v₁ = [1, 1]\\nFor λ=2: solve (A−2I)v=0 → v₂ = [1, −2]"
    },
    {
      "label": "Key Properties",
      "icon": "📐",
      "content": "**Trace = sum of eigenvalues**\\ntr(A) = λ₁ + λ₂ + ... + λₙ\\n\\n**Determinant = product of eigenvalues**\\ndet(A) = λ₁ × λ₂ × ... × λₙ\\n\\n**Symmetric matrices always have real eigenvalues** — crucial for covariance matrices in PCA.\\n\\n**Orthogonal eigenvectors** — for symmetric A, eigenvectors corresponding to *distinct* eigenvalues are always perpendicular to each other.\\n\\n**Positive definite** — all eigenvalues > 0. Covariance matrices are always positive semi-definite (λ ≥ 0)."
    },
    {
      "label": "ML Relevance",
      "icon": "🤖",
      "content": "**PCA** decomposes the data covariance matrix C = XᵀX into its eigenvectors (principal components) and eigenvalues (variance explained).\\n\\n**Graph Neural Networks** use the graph Laplacian's eigenvectors as spectral filters.\\n\\n**PageRank** finds the dominant eigenvector of the web link matrix.\\n\\n**Stability analysis** — a dynamical system is stable iff all eigenvalues have negative real parts.\\n\\n**Kernel methods** — the kernel matrix eigendecomposition underlies kernel PCA."
    }
  ]
}
\`\`\`

---

## Hands-On: Computing Eigenvalues with NumPy

\`\`\`playground
{
  "title": "Eigenvalues & Eigenvectors from Scratch",
  "language": "python",
  "code": "import numpy as np\\n\\n# Define a symmetric matrix (like a covariance matrix)\\nA = np.array([[4, 2],\\n              [2, 3]], dtype=float)\\n\\n# NumPy's built-in\\neigenvalues, eigenvectors = np.linalg.eig(A)\\n\\nprint(\\"Matrix A:\\")\\nprint(A)\\nprint()\\nprint(\\"Eigenvalues:\\", eigenvalues)\\nprint()\\nprint(\\"Eigenvectors (columns):\\")\\nprint(eigenvectors)\\nprint()\\n\\n# Verify: A @ v = lambda * v\\nfor i in range(len(eigenvalues)):\\n    lam = eigenvalues[i]\\n    v = eigenvectors[:, i]  # i-th column\\n    lhs = A @ v\\n    rhs = lam * v\\n    print(f\\"lambda={lam:.3f}: Av = {lhs.round(4)}, lam*v = {rhs.round(4)}, match={np.allclose(lhs, rhs)}\\")\\n\\nprint()\\nprint(\\"Trace of A:\\", np.trace(A), \\"= sum of eigenvalues:\\", eigenvalues.sum().round(6))\\nprint(\\"Det of A:\\", np.linalg.det(A).round(6), \\"= product of eigenvalues:\\", (eigenvalues[0]*eigenvalues[1]).round(6))",
  "runnable": true
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Use eigh() for Symmetric Matrices", "content": "np.linalg.eigh() is specifically for real symmetric (or complex Hermitian) matrices. It's faster, guaranteed to return real eigenvalues, and returns them sorted in ascending order. Covariance matrices are always symmetric, so always use eigh() in PCA." }
\`\`\`

---

## Eigendecomposition: Factoring a Matrix

For a diagonalizable matrix **A** with eigenvectors stacked as columns of **Q** and eigenvalues on the diagonal of **Λ**:

**A = Q Λ Q⁻¹**

For *symmetric* matrices (like covariance matrices), the eigenvectors are orthonormal, so Q⁻¹ = Qᵀ:

**A = Q Λ Qᵀ**

This is the **spectral decomposition**. It tells you: this matrix is just "stretch by λᵢ along direction qᵢ."

\`\`\`concept
{ "title": "Eigendecomposition = Change Basis → Scale → Change Back", "variant": "rule", "content": "A = QΛQᵀ means: (1) Qᵀ rotates your vector into the eigenvector coordinate system, (2) Λ scales each axis by its eigenvalue, (3) Q rotates back. The matrix does nothing exotic — it just stretches space along its eigenvector axes." }
\`\`\`

---

## From Eigendecomposition to SVD

Eigendecomposition has a major limitation: it only works for *square* matrices, and not always even then. But data matrices are almost never square — you have n samples and p features.

**SVD solves this.** Every matrix **M** of shape (m × n) — no matter what — can be decomposed as:

**M = U Σ Vᵀ**

| Factor | Shape | Meaning |
|--------|-------|---------|
| **U** | m × m | Left singular vectors — orthonormal basis for the output space (rows of M) |
| **Σ** | m × n | Diagonal with singular values σ₁ ≥ σ₂ ≥ ... ≥ 0 |
| **Vᵀ** | n × n | Right singular vectors — orthonormal basis for the input space (columns of M) |

\`\`\`concept
{ "title": "SVD = Rotation → Stretch → Rotation", "variant": "analogy", "content": "Think of M as a transformation pipeline: Vᵀ first rotates your input vector into a natural coordinate system, Σ stretches each axis by its singular value (σᵢ), then U rotates the result into output space. Unlike eigendecomposition, SVD handles any shape matrix and always produces real, non-negative singular values." }
\`\`\`

---

## The Connection: SVD and Eigenvalues

SVD and eigendecomposition are deeply linked:

- The **columns of V** (right singular vectors) are eigenvectors of **MᵀM**
- The **columns of U** (left singular vectors) are eigenvectors of **MMᵀ**
- The **singular values** σᵢ satisfy: **σᵢ = √λᵢ** where λᵢ are eigenvalues of MᵀM

This means you can compute SVD by doing eigendecomposition on MᵀM — but direct SVD algorithms (Golub-Reinsch) are more numerically stable.

\`\`\`playground
{
  "title": "SVD: Decompose and Reconstruct a Matrix",
  "language": "python",
  "code": "import numpy as np\\n\\n# A data matrix: 4 samples, 3 features\\nM = np.array([[1, 2, 3],\\n              [4, 5, 6],\\n              [7, 8, 9],\\n              [1, 0, 2]], dtype=float)\\n\\nU, sigma, Vt = np.linalg.svd(M, full_matrices=True)\\n\\nprint(\\"Original M shape:\\", M.shape)\\nprint(\\"U shape:\\", U.shape, \\"(left singular vectors)\\")\\nprint(\\"sigma:\\", sigma.round(4), \\"(singular values)\\")\\nprint(\\"Vt shape:\\", Vt.shape, \\"(right singular vectors transposed)\\")\\n\\n# Reconstruct M = U @ Sigma_full @ Vt\\nSigma_full = np.zeros_like(M)\\nfor i in range(len(sigma)):\\n    Sigma_full[i, i] = sigma[i]\\n\\nM_reconstructed = U @ Sigma_full @ Vt\\nprint()\\nprint(\\"Reconstruction error:\\", np.linalg.norm(M - M_reconstructed).round(10))\\n\\n# Low-rank approximation: keep only top k singular values\\nprint(\\"\\\\n--- Low-rank approximations ---\\")\\nfor k in [1, 2, 3]:\\n    M_approx = U[:, :k] @ np.diag(sigma[:k]) @ Vt[:k, :]\\n    error = np.linalg.norm(M - M_approx)\\n    variance = (sigma[:k]**2).sum() / (sigma**2).sum()\\n    print(f\\"k={k}: error={error:.4f}, variance captured={variance:.2%}\\")",
  "runnable": true
}
\`\`\`

---

## PCA via SVD: The Full Picture

Principal Component Analysis (PCA) finds directions of maximum variance in your data. Here's how SVD does this in four clean steps:

\`\`\`steps
{
  "title": "PCA via SVD — Step by Step",
  "steps": [
    {
      "title": "Center the Data",
      "content": "Subtract the column means so your data is centered at the origin:\\n\`\`\`python\\nX_centered = X - X.mean(axis=0)\\n\`\`\`\\nThis removes the effect of the average value — we care about *spread*, not *location*."
    },
    {
      "title": "Compute SVD",
      "content": "Decompose the centered data matrix:\\n\`\`\`python\\nU, sigma, Vt = np.linalg.svd(X_centered, full_matrices=False)\\n\`\`\`\\nThe rows of **Vt** are the principal components — directions of maximum variance."
    },
    {
      "title": "Rank Singular Values by Variance",
      "content": "Singular values are already sorted descending. The variance explained by each component is:\\n\`\`\`python\\nvariance_ratio = (sigma**2) / (sigma**2).sum()\\n\`\`\`\\nPlot a **scree plot** of cumulative variance to pick k."
    },
    {
      "title": "Project to k Dimensions",
      "content": "Keep only the top k right singular vectors:\\n\`\`\`python\\nX_reduced = X_centered @ Vt[:k].T   # shape: (n_samples, k)\\n\`\`\`\\nYou've gone from p features to k components, preserving maximum variance."
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why Not Use the Covariance Matrix Directly?", "content": "You *could* compute C = XᵀX / (n-1), then eigendecompose C to get principal components. SVD on the centered X is numerically equivalent — but SVD on X is more stable than forming XᵀX explicitly, since squaring condition numbers can amplify floating-point errors. Sklearn's PCA uses truncated SVD under the hood." }
\`\`\`

---

## Trace Through a Minimal PCA

\`\`\`trace
{
  "title": "Tracing PCA on a Tiny Dataset",
  "language": "python",
  "code": "import numpy as np\\nX = np.array([[2,1],[4,3],[6,5],[8,7]], dtype=float)\\nX_c = X - X.mean(axis=0)\\nU, s, Vt = np.linalg.svd(X_c, full_matrices=False)\\nvar = s**2 / (s**2).sum()\\nX_1d = X_c @ Vt[0]",
  "frames": [
    { "line": 1, "vars": {}, "note": "Import numpy" },
    { "line": 2, "vars": { "X": "[[2,1],[4,3],[6,5],[8,7]]" }, "note": "4 samples, 2 features — highly correlated" },
    { "line": 3, "vars": { "mean": "[5.0, 4.0]", "X_c": "[[-3,-3],[-1,-1],[1,1],[3,3]]" }, "note": "Subtract column means → centered data" },
    { "line": 4, "vars": { "s": "[5.657, 0.0]", "Vt": "[[0.707,0.707],[-0.707,0.707]]" }, "note": "SVD: σ1≈5.66 dominates, σ2≈0 → data is essentially 1D" },
    { "line": 5, "vars": { "var": "[1.0, 0.0]" }, "note": "First PC captures 100% of variance — perfect correlation!" },
    { "line": 6, "vars": { "X_1d": "[-4.24, -1.41, 1.41, 4.24]" }, "note": "Project onto PC1: 4 2D points → 4 scalars, zero information lost" }
  ],
  "speed": 900
}
\`\`\`

---

## Practice: Fill in the SVD Reconstruction

\`\`\`fillblank
{
  "title": "Complete the Low-Rank Approximation",
  "prompt": "Fill in the blanks to reconstruct a rank-2 approximation of matrix M using its SVD. The top-k approximation formula is: M_k = U[:, :k] @ diag(sigma[:k]) @ Vt[:k, :]",
  "language": "python",
  "template": "import numpy as np\\n\\nM = np.random.randn(5, 4)\\nU, sigma, Vt = np.linalg.svd(M, full_matrices=False)\\n\\nk = 2\\nM_approx = U[:, :___] @ np.diag(sigma[:___]) @ Vt[:___, :]\\n\\nprint(\\"Approx shape:\\", M_approx.shape)\\nprint(\\"Frobenius error:\\", np.linalg.norm(M - M_approx).round(4))",
  "blanks": [
    { "answer": "k", "hint": "How many columns of U do we keep?" },
    { "answer": "k", "hint": "How many singular values do we use on the diagonal?" },
    { "answer": "k", "hint": "How many rows of Vt correspond to the top-k components?" }
  ]
}
\`\`\`

---

## The Eckart–Young Theorem: SVD is the Best Low-Rank Approximation

\`\`\`concept
{ "title": "SVD Gives the Optimal Compression", "variant": "insight", "content": "The Eckart–Young theorem proves that the rank-k truncated SVD gives the best possible rank-k approximation of a matrix in both Frobenius norm and spectral norm. No other rank-k matrix is closer. This is why SVD-based compression (images, recommender systems, NLP) is so powerful — you're not guessing; you're provably optimal." }
\`\`\`

This has direct ML applications:

| Application | What gets SVD'd | What k controls |
|-------------|-----------------|-----------------|
| **PCA** | Centered data matrix X | Number of principal components |
| **LSA / LSI** | Term-document matrix | Semantic topic dimensions |
| **Collaborative filtering** | User-item rating matrix | Latent factor dimensions |
| **Image compression** | Pixel matrix per channel | Compression ratio |
| **Noise reduction** | Any measurement matrix | Signal vs. noise cutoff |

---

## Quiz

\`\`\`quiz
{
  "title": "Eigenvalues, Eigenvectors, and SVD",
  "questions": [
    {
      "question": "Vector v is an eigenvector of matrix A with eigenvalue λ = 0. What does this tell you about A?",
      "options": [
        "A is the identity matrix",
        "A is invertible",
        "A is singular (non-invertible)",
        "v must be the zero vector"
      ],
      "answer": 2,
      "explanation": "If λ = 0 is an eigenvalue, then det(A − 0·I) = det(A) = 0, meaning A has no inverse. Eigenvalue 0 always signals a singular matrix. Note: eigenvectors are by definition non-zero vectors."
    },
    {
      "question": "A covariance matrix C has eigenvalues [9, 4, 1]. What percentage of total variance is captured by keeping only the first principal component?",
      "options": [
        "33.3%",
        "64.3%",
        "100%",
        "90%"
      ],
      "answer": 1,
      "explanation": "Total variance = 9 + 4 + 1 = 14. The first PC captures 9/14 ≈ 64.3% of variance. Eigenvalues of the covariance matrix directly represent variance along each principal direction."
    },
    {
      "question": "In the SVD M = UΣVᵀ, what are the columns of V (right singular vectors)?",
      "options": [
        "Eigenvectors of MMᵀ",
        "Eigenvectors of MᵀM",
        "The principal components of the row space of U",
        "The diagonal entries of Σ squared"
      ],
      "answer": 1,
      "explanation": "The columns of V are eigenvectors of MᵀM. Similarly, columns of U are eigenvectors of MMᵀ. The singular values σᵢ equal the square roots of the corresponding eigenvalues of MᵀM."
    },
    {
      "question": "Why should you use np.linalg.eigh() instead of np.linalg.eig() for covariance matrices?",
      "options": [
        "eigh() runs on GPU automatically",
        "eigh() is designed for symmetric/Hermitian matrices, returns real sorted eigenvalues, and is more numerically stable",
        "eig() cannot handle 2D arrays",
        "eigh() uses exact arithmetic instead of floating point"
      ],
      "answer": 1,
      "explanation": "np.linalg.eigh() exploits the symmetry of the matrix (covariance matrices are always symmetric) to guarantee real eigenvalues, return them sorted, and use a more stable algorithm. np.linalg.eig() is general-purpose and may return complex values due to floating-point noise even for symmetric inputs."
    },
    {
      "question": "The Eckart–Young theorem states that the rank-k truncated SVD is:",
      "options": [
        "The fastest way to compute a low-rank approximation",
        "The only decomposition that works for rectangular matrices",
        "The best possible rank-k approximation in Frobenius and spectral norm",
        "An approximation that only works when k=1"
      ],
      "answer": 2,
      "explanation": "The Eckart–Young theorem proves that among all rank-k matrices, the truncated SVD M_k = UₖΣₖVₖᵀ minimizes ||M − M_k|| in both Frobenius norm and spectral norm. This is the theoretical foundation for why SVD-based compression and dimensionality reduction are so widely used."
    }
  ]
}
\`\`\`

---

## Putting It All Together: Full PCA Pipeline

\`\`\`playground
{
  "title": "Complete PCA Pipeline on Synthetic Data",
  "language": "python",
  "code": "import numpy as np\\n\\nnp.random.seed(42)\\n\\n# Generate correlated 2D data\\nn = 200\\nt = np.linspace(0, 2*np.pi, n)\\nX = np.column_stack([\\n    np.cos(t) * 3 + np.random.randn(n) * 0.3,\\n    np.cos(t) * 2 + np.random.randn(n) * 0.3\\n])\\n\\nprint(\\"Data shape:\\", X.shape)\\nprint(\\"Feature means (before centering):\\", X.mean(axis=0).round(3))\\n\\n# Step 1: Center\\nX_c = X - X.mean(axis=0)\\n\\n# Step 2: SVD\\nU, sigma, Vt = np.linalg.svd(X_c, full_matrices=False)\\n\\n# Step 3: Variance explained\\nvar_ratio = sigma**2 / (sigma**2).sum()\\nprint()\\nprint(\\"Singular values:\\", sigma.round(4))\\nprint(\\"Variance explained per PC:\\", var_ratio.round(4))\\nprint(\\"Cumulative variance:\\", var_ratio.cumsum().round(4))\\n\\n# Step 4: Principal components (rows of Vt)\\nprint()\\nprint(\\"PC1 direction:\\", Vt[0].round(4))\\nprint(\\"PC2 direction:\\", Vt[1].round(4))\\nprint(\\"Are PCs orthogonal?\\", np.isclose(Vt[0] @ Vt[1], 0))\\n\\n# Step 5: Project to 1D\\nX_1d = X_c @ Vt[0]\\nprint()\\nprint(\\"Projected data (first 5):\\", X_1d[:5].round(3))\\nprint(\\"Variance in 1D projection:\\", X_1d.var().round(4))\\nprint(\\"Original total variance:\\", np.trace(np.cov(X.T)).round(4))\\nprint(f\\"Captured: {X_1d.var() / np.trace(np.cov(X.T)):.1%}\\")",
  "runnable": true
}
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Numerical Stability and When SVD Beats Eigendecomposition", "content": "**The condition number problem:**\\nWhen you form XᵀX explicitly and eigendecompose it, you square the condition number of X. If X has condition number κ, then XᵀX has condition number κ². In floating-point arithmetic, this doubles the number of digits of precision you lose.\\n\\n**Example:** If X has condition number 10⁶ (not unusual for ill-conditioned data), XᵀX has condition number 10¹². On a 64-bit double with ~15 decimal digits of precision, you've lost 12 digits — only 3 remain reliable.\\n\\n**Direct SVD avoids this:** Algorithms like Golub-Reinsch bidiagonalization work directly on X without forming XᵀX, keeping the condition number at κ rather than κ².\\n\\n**Truncated/Randomized SVD:**\\nFor very large matrices (millions of rows), computing the full SVD is expensive: O(min(m,n)²·max(m,n)). Randomized SVD (Halko et al., 2011) uses random projections to find an approximate rank-k SVD in O(mnk) time, which is dramatically faster when k << min(m,n). Scikit-learn's \`TruncatedSVD\` and \`PCA(svd_solver='randomized')\` use this approach." }
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Eigenvectors are directions a matrix cannot rotate — only scale. The scale factor is the eigenvalue.",
    "Find eigenvalues by solving det(A − λI) = 0. The trace equals their sum; the determinant equals their product.",
    "Eigendecomposition A = QΛQᵀ works for symmetric square matrices. It means: rotate into eigenvector basis → scale → rotate back.",
    "SVD generalizes eigendecomposition to any matrix shape: M = UΣVᵀ. Singular values are always real and non-negative.",
    "PCA via SVD: center the data, decompose with SVD, project onto the top-k right singular vectors (rows of Vt).",
    "The Eckart–Young theorem guarantees that rank-k truncated SVD is the provably optimal low-rank approximation.",
    "Always use np.linalg.eigh() for symmetric matrices (covariance matrices), and prefer direct SVD over forming XᵀX for numerical stability."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# Exercise: Eigenvalues, Eigenvectors, and SVD Intuition
#
# In this exercise you will:
#   1. Compute eigenvalues and eigenvectors of a 2x2 matrix
#   2. Verify the eigenvector equation: A @ v == lambda * v
#   3. Perform SVD and relate singular values to the matrix's scaling
#   4. Reconstruct the matrix from its SVD components

# --- Setup ---
A = np.array([[3, 1],
              [1, 3]], dtype=float)

# ── Part 1: Eigendecomposition ────────────────────────────────────────────────

# TODO: Compute the eigenvalues and eigenvectors of A.
# Hint: use np.linalg.eig(A)
eigenvalues = None
eigenvectors = None  # columns are eigenvectors

print("Eigenvalues:", eigenvalues)
print("Eigenvectors (columns):\\n", eigenvectors)

# TODO: Verify the eigenvector equation for the FIRST eigenvector.
# A @ v should equal lambda * v  (within floating-point tolerance)
v0 = None        # first eigenvector (first column of eigenvectors)
lambda0 = None   # first eigenvalue

lhs = None  # A @ v0
rhs = None  # lambda0 * v0

print("\\nEigenvector equation check (should be ~zero):", np.allclose(lhs, rhs))

# ── Part 2: SVD ───────────────────────────────────────────────────────────────

# TODO: Compute the Singular Value Decomposition of A.
# np.linalg.svd returns (U, S, Vt) where S is a 1-D array of singular values.
U = None
S = None
Vt = None

print("\\nSingular values:", S)
print("U:\\n", U)
print("Vt:\\n", Vt)

# TODO: Reconstruct A from U, S, Vt.
# Hint: you need np.diag(S) to turn S into a diagonal matrix, then multiply.
A_reconstructed = None

print("\\nReconstruction matches original:", np.allclose(A_reconstructed, A))

# ── Part 3: Reflection ────────────────────────────────────────────────────────
# TODO: Print the ratio S[0] / S[1].
# For a symmetric matrix, singular values equal the absolute eigenvalues.
# What does this ratio tell you about how much A stretches space in each direction?
print("\\nSingular value ratio S[0]/S[1]:", None)
`,
      solutionCode: `import numpy as np

# Exercise: Eigenvalues, Eigenvectors, and SVD Intuition

# --- Setup ---
A = np.array([[3, 1],
              [1, 3]], dtype=float)

# ── Part 1: Eigendecomposition ────────────────────────────────────────────────

# Compute eigenvalues and eigenvectors.
# np.linalg.eig returns (values, vectors) where each COLUMN of \`vectors\`
# is the eigenvector corresponding to the same-index eigenvalue.
eigenvalues, eigenvectors = np.linalg.eig(A)

print("Eigenvalues:", eigenvalues)          # [4. 2.]
print("Eigenvectors (columns):\\n", eigenvectors)

# Verify A @ v == lambda * v for the first eigenvector.
v0      = eigenvectors[:, 0]   # first eigenvector
lambda0 = eigenvalues[0]       # first eigenvalue (4.0)

lhs = A @ v0          # matrix-vector product
rhs = lambda0 * v0    # scalar stretch along eigenvector direction

# np.allclose tolerates tiny floating-point differences.
print("\\nEigenvector equation check (should be True):", np.allclose(lhs, rhs))
# Both sides equal [2.83, 2.83], confirming A merely scales v0 by 4.

# ── Part 2: SVD ───────────────────────────────────────────────────────────────

# Decompose A = U @ diag(S) @ Vt
# U  : left singular vectors  (output directions after transformation)
# S  : singular values        (how much A stretches each direction)
# Vt : right singular vectors transposed (input directions)
U, S, Vt = np.linalg.svd(A)

print("\\nSingular values:", S)   # [4. 2.] — same magnitudes as eigenvalues here
print("U:\\n", U)
print("Vt:\\n", Vt)

# Reconstruct A = U @ diag(S) @ Vt
# np.diag(S) converts the 1-D singular-value array into a 2x2 diagonal matrix.
A_reconstructed = U @ np.diag(S) @ Vt

print("\\nReconstruction matches original:", np.allclose(A_reconstructed, A))  # True

# ── Part 3: Reflection ────────────────────────────────────────────────────────
# The ratio of singular values describes the 'eccentricity' of the transformation.
# S[0]/S[1] = 2.0 means A stretches its primary direction TWICE as much as its
# secondary direction — like an ellipse with axes 4 and 2.
# In PCA this ratio tells you how much variance is captured by each principal component.
print("\\nSingular value ratio S[0]/S[1]:", S[0] / S[1])  # 2.0
`,
    },
    {
      id: "math-checkpoint",
      slug: "math-checkpoint",
      title: "Checkpoint: Numerical Gradient Checker",
      content: `# Checkpoint: Numerical Gradient Checker

You've spent the last several lessons deriving gradients by hand — chain rule, partial derivatives, Jacobians. Now it's time to **verify** those derivations with code.

A numerical gradient checker is the single most important debugging tool in ML. Every serious practitioner uses one. Andrew Ng has called gradient checking "one of the most useful debugging tools you can have." This checkpoint walks you through building one from scratch and running it against three loss functions.

\`\`\`concept
{
  "title": "The Core Idea",
  "variant": "mental-model",
  "content": "Your analytic gradient is a formula you derived with calculus. A numerical gradient is a measurement — you nudge a parameter by a tiny amount ε, observe how the loss changes, and divide. If your formula and your measurement agree to many decimal places, your derivation is almost certainly correct. If they disagree, your backprop has a bug."
}
\`\`\`

---

## The Finite Difference Formula

The simplest numerical approximation is the **forward difference**:

$$\\frac{\\partial L}{\\partial \\theta_i} \\approx \\frac{L(\\theta + \\varepsilon \\hat{e}_i) - L(\\theta)}{\\varepsilon}$$

But we use the **central difference** instead — it's more accurate because the first-order error terms cancel:

$$\\frac{\\partial L}{\\partial \\theta_i} \\approx \\frac{L(\\theta + \\varepsilon \\hat{e}_i) - L(\\theta - \\varepsilon \\hat{e}_i)}{2\\varepsilon}$$

Here $\\hat{e}_i$ is a unit vector in the direction of parameter $i$, and $\\varepsilon$ is a small step, typically \`1e-5\`.

\`\`\`callout
{
  "type": "warning",
  "title": "Why ε = 1e-5?",
  "content": "Too large (e.g. 0.1) and the linear approximation breaks down — the curve has curvature. Too small (e.g. 1e-12) and floating-point cancellation errors dominate. The sweet spot is around 1e-5 to 1e-7."
}
\`\`\`

### Comparing Numerical and Analytic Gradients

Once you have both gradients, you compute a **relative error** to decide if they match:

$$\\text{rel\\_err} = \\frac{\\| g_\\text{analytic} - g_\\text{numerical} \\|_2}{\\| g_\\text{analytic} \\|_2 + \\| g_\\text{numerical} \\|_2}$$

| Relative Error | Verdict |
|---|---|
| < 1e-7 | Excellent — almost certainly correct |
| 1e-7 to 1e-5 | Acceptable — small floating-point issues |
| 1e-5 to 1e-3 | Suspicious — likely a bug somewhere |
| > 1e-3 | Bug — go find it |

---

## How the Checker Works

\`\`\`steps
{
  "title": "Building the Gradient Checker",
  "steps": [
    {
      "title": "Flatten all parameters into a vector",
      "content": "The checker treats every parameter uniformly. If your model has weights W (shape 3×4) and bias b (shape 4), concatenate them into a single 1D vector θ of length 16. This makes the loop over parameters simple."
    },
    {
      "title": "Loop over each parameter θᵢ",
      "content": "For each index i, create two copies of θ: one with θᵢ += ε, one with θᵢ -= ε. Reshape back to the original parameter shapes, run the forward pass both times, record L⁺ and L⁻."
    },
    {
      "title": "Compute the numerical gradient",
      "content": "numerical_grad[i] = (L⁺ - L⁻) / (2 * ε)\\n\\nThis is the finite difference approximation of ∂L/∂θᵢ."
    },
    {
      "title": "Compute the analytic gradient",
      "content": "Run your normal forward + backward pass (or analytic formula) on the original θ to get the gradient vector g. Flatten it the same way as θ."
    },
    {
      "title": "Measure relative error",
      "content": "rel_err = ||g_analytic - g_numerical||₂ / (||g_analytic||₂ + ||g_numerical||₂ + 1e-8)\\n\\nIf rel_err < 1e-5, you pass. Otherwise, investigate which parameters have the largest discrepancy."
    }
  ]
}
\`\`\`

---

## Tracing Through One Parameter

Let's trace the checker on a single parameter to build intuition before writing the full implementation.

\`\`\`trace
{
  "title": "Central Difference on MSE Loss — Single Parameter",
  "language": "python",
  "code": "import numpy as np\\n\\ndef mse_loss(w, x, y):\\n    pred = x * w\\n    return np.mean((pred - y) ** 2)\\n\\nw = np.array([2.0])\\nx = np.array([1.0, 2.0, 3.0])\\ny = np.array([1.5, 3.0, 4.5])\\neps = 1e-5\\n\\n# Central difference\\nw_plus  = w + eps\\nw_minus = w - eps\\nL_plus  = mse_loss(w_plus,  x, y)\\nL_minus = mse_loss(w_minus, x, y)\\nnumerical = (L_plus - L_minus) / (2 * eps)\\n\\n# Analytic: dL/dw = 2/n * sum((wx - y) * x)\\nanalytic = np.mean(2 * (x * w - y) * x)\\n\\nrel_err = abs(numerical - analytic) / (abs(numerical) + abs(analytic) + 1e-8)",
  "frames": [
    {
      "line": 1,
      "vars": {},
      "note": "Import NumPy — the only dependency we need.",
      "stdout": ""
    },
    {
      "line": 3,
      "vars": {},
      "note": "Define MSE loss: prediction = x*w, loss = mean squared error.",
      "stdout": ""
    },
    {
      "line": 8,
      "vars": { "w": "[2.0]", "x": "[1,2,3]", "y": "[1.5,3,4.5]", "eps": "1e-5" },
      "note": "Initialize: w=2.0 is our parameter. y = 1.5x (perfect slope = 1.5, so w=2.0 is wrong).",
      "stdout": ""
    },
    {
      "line": 12,
      "vars": { "w_plus": "[2.00001]", "w_minus": "[1.99999]" },
      "note": "Create perturbed versions — nudge w up and down by ε = 1e-5.",
      "stdout": ""
    },
    {
      "line": 14,
      "vars": { "L_plus": "0.08334...", "L_minus": "0.08327..." },
      "note": "Forward pass twice. L_plus > L_minus because w is already above the true slope of 1.5.",
      "stdout": ""
    },
    {
      "line": 16,
      "vars": { "numerical": "0.33334..." },
      "note": "Numerical gradient = rise/run = (L+ - L-) / (2ε). This says: increasing w by 1 increases loss by ~0.333.",
      "stdout": ""
    },
    {
      "line": 19,
      "vars": { "analytic": "0.33333..." },
      "note": "Analytic: dMSE/dw = (2/n) Σ (wx - y)·x. Computed directly from the formula.",
      "stdout": ""
    },
    {
      "line": 21,
      "vars": { "rel_err": "3.0e-8" },
      "note": "Relative error = 3e-8. Far below 1e-5 threshold. Gradient check PASSED.",
      "stdout": "rel_err = 3.0e-8 ✓ PASS"
    }
  ],
  "speed": 900
}
\`\`\`

---

## Full Implementation

Now let's build the complete checker and test it against three loss functions: MSE, binary cross-entropy, and the softmax cross-entropy loss.

\`\`\`playground
{
  "title": "Numerical Gradient Checker — Three Loss Functions",
  "language": "python",
  "runnable": true,
  "code": "import numpy as np\\n\\n# ─── Gradient Checker ─────────────────────────────────────────────────────────\\n\\ndef numerical_gradient(loss_fn, params, eps=1e-5):\\n    \\"\\"\\"\\n    Compute numerical gradient of loss_fn w.r.t. params using central differences.\\n    params: dict of {name: numpy array}\\n    Returns: dict of {name: gradient array}\\n    \\"\\"\\"\\n    grads = {}\\n    for name, param in params.items():\\n        grad = np.zeros_like(param)\\n        it = np.nditer(param, flags=['multi_index'])\\n        while not it.finished:\\n            idx = it.multi_index\\n            original = param[idx]\\n            param[idx] = original + eps\\n            L_plus = loss_fn(params)\\n            param[idx] = original - eps\\n            L_minus = loss_fn(params)\\n            param[idx] = original  # restore\\n            grad[idx] = (L_plus - L_minus) / (2 * eps)\\n            it.iternext()\\n        grads[name] = grad\\n    return grads\\n\\n\\ndef relative_error(g_analytic, g_numerical):\\n    diff = np.linalg.norm(g_analytic - g_numerical)\\n    denom = np.linalg.norm(g_analytic) + np.linalg.norm(g_numerical) + 1e-8\\n    return diff / denom\\n\\n\\ndef check_gradient(name, loss_fn, analytic_grad_fn, params):\\n    g_num  = numerical_gradient(loss_fn, params)\\n    g_ana  = analytic_grad_fn(params)\\n    print(f\\"\\\\n{'='*50}\\")\\n    print(f\\"  Checking: {name}\\")\\n    for key in params:\\n        err = relative_error(g_ana[key], g_num[key])\\n        status = \\"PASS\\" if err < 1e-5 else \\"FAIL\\"\\n        print(f\\"  d_loss/d_{key}: rel_err = {err:.2e}  [{status}]\\")\\n\\n\\n# ─── Loss 1: Mean Squared Error ───────────────────────────────────────────────\\n\\nnp.random.seed(42)\\nn, d = 50, 3\\nX = np.random.randn(n, d)\\ntrue_w = np.array([1.5, -0.5, 2.0])\\nY = X @ true_w + 0.1 * np.random.randn(n)\\n\\ndef mse_loss(params):\\n    w = params['w']\\n    preds = X @ w\\n    return np.mean((preds - Y) ** 2)\\n\\ndef mse_analytic_grads(params):\\n    w = params['w']\\n    preds = X @ w\\n    dw = (2 / len(Y)) * X.T @ (preds - Y)\\n    return {'w': dw}\\n\\ncheck_gradient(\\"MSE Loss\\", mse_loss, mse_analytic_grads, {'w': np.zeros(d)})\\n\\n\\n# ─── Loss 2: Binary Cross-Entropy ─────────────────────────────────────────────\\n\\nY_bin = (Y > Y.mean()).astype(float)\\n\\ndef sigmoid(z):\\n    return 1.0 / (1.0 + np.exp(-z))\\n\\ndef bce_loss(params):\\n    w = params['w']\\n    p = sigmoid(X @ w)\\n    p = np.clip(p, 1e-12, 1 - 1e-12)\\n    return -np.mean(Y_bin * np.log(p) + (1 - Y_bin) * np.log(1 - p))\\n\\ndef bce_analytic_grads(params):\\n    w = params['w']\\n    p = sigmoid(X @ w)\\n    dw = X.T @ (p - Y_bin) / len(Y_bin)\\n    return {'w': dw}\\n\\ncheck_gradient(\\"Binary Cross-Entropy\\", bce_loss, bce_analytic_grads, {'w': np.zeros(d)})\\n\\n\\n# ─── Loss 3: L2-Regularized MSE ───────────────────────────────────────────────\\n\\nlambda_ = 0.1\\n\\ndef mse_l2_loss(params):\\n    w = params['w']\\n    preds = X @ w\\n    mse = np.mean((preds - Y) ** 2)\\n    l2  = lambda_ * np.sum(w ** 2)\\n    return mse + l2\\n\\ndef mse_l2_analytic_grads(params):\\n    w = params['w']\\n    preds = X @ w\\n    dw = (2 / len(Y)) * X.T @ (preds - Y) + 2 * lambda_ * w\\n    return {'w': dw}\\n\\ncheck_gradient(\\"L2-Regularized MSE\\", mse_l2_loss, mse_l2_analytic_grads, {'w': np.zeros(d)})\\n\\nprint(\\"\\\\nAll checks complete.\\")\\n"
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Only use the checker for debugging",
  "content": "The checker loops over every parameter individually — for a network with 1 million parameters, that means 2 million forward passes. It's strictly a correctness tool, not something you run during training. Turn it on when you suspect a gradient bug, verify, then turn it off."
}
\`\`\`

---

## Visualizing What's Happening

The central difference is computing the slope of the loss curve at each parameter value. Here's how the approximation converges as ε shrinks.

\`\`\`algoviz
{
  "title": "How Central Difference Approximates the True Slope",
  "type": "array",
  "data": [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001],
  "frames": [
    {
      "highlight": [0],
      "label": "ε = 0.1 — step is large, curvature introduces error",
      "stats": { "ε": 0.1, "rel_err": "2.3e-3" }
    },
    {
      "highlight": [1],
      "label": "ε = 0.01 — smaller step, curvature error shrinks",
      "stats": { "ε": 0.01, "rel_err": "2.3e-5" }
    },
    {
      "highlight": [2],
      "label": "ε = 0.001 — good range, error drops further",
      "stats": { "ε": 0.001, "rel_err": "2.3e-7" }
    },
    {
      "highlight": [3],
      "label": "ε = 1e-4 — excellent approximation",
      "stats": { "ε": "1e-4", "rel_err": "2.3e-8" }
    },
    {
      "highlight": [4],
      "label": "ε = 1e-5 — sweet spot: curvature error ≈ float rounding error",
      "stats": { "ε": "1e-5", "rel_err": "3.1e-8" }
    },
    {
      "highlight": [5],
      "label": "ε = 1e-6 — float cancellation starts increasing error again",
      "stats": { "ε": "1e-6", "rel_err": "1.2e-7" }
    }
  ],
  "speed": 1000
}
\`\`\`

---

## Practice: Complete the Checker

Fill in the blanks to implement the central difference formula inside the checker loop.

\`\`\`fillblank
{
  "title": "Implement Central Difference",
  "prompt": "Complete the numerical gradient function. For each parameter index, perturb up by eps, evaluate loss, perturb down by eps, evaluate loss, then compute the slope.",
  "language": "python",
  "template": "def numerical_gradient_single(loss_fn, params, param_name, eps=1e-5):\\n    param = params[param_name]\\n    grad = np.zeros_like(param)\\n    for idx in np.ndindex(param.shape):\\n        original = param[idx]\\n        param[idx] = original + ___\\n        L_plus = loss_fn(___)\\n        param[idx] = original - ___\\n        L_minus = loss_fn(___)\\n        param[idx] = original\\n        grad[idx] = (L_plus - ___) / (2 * ___)\\n    return grad",
  "blanks": [
    { "answer": "eps", "hint": "Add the small perturbation to move the parameter up" },
    { "answer": "params", "hint": "Pass the full parameter dict to the loss function" },
    { "answer": "eps", "hint": "Subtract the same perturbation to move the parameter down" },
    { "answer": "params", "hint": "Pass the full parameter dict again" },
    { "answer": "L_minus", "hint": "Central difference numerator is L+ minus L-" },
    { "answer": "eps", "hint": "Denominator of central difference formula is 2*eps" }
  ]
}
\`\`\`

---

## Common Bugs the Checker Catches

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Wrong Chain Rule",
      "icon": "🔗",
      "content": "**Symptom:** rel_err > 1e-3 on a specific layer.\\n\\n**What happened:** You forgot to multiply by a downstream gradient term. For example, in a two-layer network, the gradient of W₁ is δ₂ · W₂ᵀ · activation_grad · X — if you missed the activation_grad term, your analytic gradient is off by a factor.\\n\\n**How to isolate it:** Run the checker layer-by-layer (freeze all but one layer's parameters at a time)."
    },
    {
      "label": "Transposed Matrices",
      "icon": "↔️",
      "content": "**Symptom:** rel_err is large, but the magnitude of the analytic gradient looks right.\\n\\n**What happened:** You wrote \`X @ delta\` instead of \`X.T @ delta\`, or vice versa. The result has the same Frobenius norm but points in the wrong direction.\\n\\n**Fix:** Double-check every matrix multiply in your backward pass against the shapes from your forward pass."
    },
    {
      "label": "Off-by-1/n",
      "icon": "➗",
      "content": "**Symptom:** Analytic gradient is exactly n× larger or smaller than the numerical gradient.\\n\\n**What happened:** Your loss averages over the batch (\`mean\`) but your gradient uses \`sum\`, or you applied the 1/n factor twice.\\n\\n**Fix:** Check that your loss function and gradient function make consistent choices — both \`mean\` or both \`sum\`."
    },
    {
      "label": "Wrong Activation Derivative",
      "icon": "📐",
      "content": "**Symptom:** rel_err is moderate (1e-3 to 1e-2), not catastrophic.\\n\\n**What happened:** Common error is using \`sigmoid(z)\` instead of \`sigmoid(z) * (1 - sigmoid(z))\` for the sigmoid derivative, or writing the ReLU derivative as \`z > 0\` applied to the wrong variable.\\n\\n**Fix:** Verify each activation's derivative formula with a unit test before plugging into the network."
    }
  ]
}
\`\`\`

---

## Quiz

\`\`\`quiz
{
  "title": "Numerical Gradient Checker",
  "questions": [
    {
      "question": "Why is the central difference formula more accurate than the forward difference formula?",
      "options": [
        "It uses a smaller value of ε",
        "The first-order error terms cancel, leaving only second-order error",
        "It requires fewer forward passes",
        "It avoids floating-point arithmetic entirely"
      ],
      "answer": 1,
      "explanation": "Central difference is (f(x+ε) - f(x-ε)) / (2ε). Expanding both terms in a Taylor series, the O(ε) error terms have opposite signs and cancel, leaving O(ε²) error. Forward difference only cancels the O(1) term, leaving O(ε) error — one order worse."
    },
    {
      "question": "You run a gradient check and get rel_err = 4.2e-4. What does this most likely indicate?",
      "options": [
        "The gradients are correct — this is within acceptable range",
        "There is likely a bug in the analytic gradient computation",
        "The value of ε is too small",
        "The loss function is non-differentiable"
      ],
      "answer": 1,
      "explanation": "A relative error of 4.2e-4 is in the 1e-5 to 1e-3 range, which is suspicious and likely indicates a bug. Correct implementations typically achieve rel_err below 1e-5. Only errors above 1e-3 are definitively catastrophic bugs, but 4.2e-4 warrants investigation."
    },
    {
      "question": "Why should you NOT use the numerical gradient checker during routine training?",
      "options": [
        "It produces incorrect gradients that would corrupt the model",
        "It requires modifying the model architecture",
        "Computing it requires 2 forward passes per parameter — prohibitively slow for large models",
        "It only works for convex loss functions"
      ],
      "answer": 2,
      "explanation": "For each parameter θᵢ, central difference requires two forward passes (θ + ε and θ - ε). A network with one million parameters needs two million forward passes just to compute one gradient vector. This makes it 2M× slower than a single backprop and completely impractical for training."
    },
    {
      "question": "You are checking gradients for a function with parameters W (shape 10×5) and b (shape 5). How many forward passes does the numerical checker perform?",
      "options": [
        "10",
        "55",
        "110",
        "100"
      ],
      "answer": 2,
      "explanation": "W has 10×5 = 50 parameters, b has 5 parameters, for 55 total. Each requires 2 forward passes (plus and minus perturbation), giving 55 × 2 = 110 forward passes."
    },
    {
      "question": "Which of the following correctly describes the relative error formula used to compare analytic and numerical gradients?",
      "options": [
        "||g_a - g_n||₁ / ||g_a||₁",
        "||g_a - g_n||₂ / (||g_a||₂ + ||g_n||₂)",
        "max(|g_a - g_n|) / max(|g_a|)",
        "mean(|g_a - g_n|) / mean(|g_a| + |g_n|)"
      ],
      "answer": 1,
      "explanation": "The standard formula divides the L2 norm of the difference by the sum of the L2 norms of both gradients. This normalizes by the scale of the gradients themselves, so a difference of 0.01 when the gradients are ~0.01 is flagged as large, while the same absolute difference when gradients are ~1000 is small."
    }
  ]
}
\`\`\`

---

## Extending the Checker

\`\`\`collapse
{
  "title": "Deep Dive: Gradient Checking for Neural Networks with Multiple Layers",
  "content": "When you build a multi-layer network, you want to check gradients for every parameter — W1, b1, W2, b2, etc. The trick is to **flatten all parameters into a single vector** θ, then reshape after perturbing.\\n\\nHere is a pattern that generalizes cleanly:\\n\\n\`\`\`python\\ndef pack_params(param_dict):\\n    \\"\\"\\"Flatten all params into a 1D vector.\\"\\"\\"\\n    shapes = {k: v.shape for k, v in param_dict.items()}\\n    flat   = np.concatenate([v.ravel() for v in param_dict.values()])\\n    return flat, shapes\\n\\ndef unpack_params(flat, shapes):\\n    \\"\\"\\"Restore dict of arrays from flat vector.\\"\\"\\"\\n    params = {}\\n    offset = 0\\n    for name, shape in shapes.items():\\n        size = int(np.prod(shape))\\n        params[name] = flat[offset:offset+size].reshape(shape)\\n        offset += size\\n    return params\\n\`\`\`\\n\\nThen your checker becomes:\\n\\n\`\`\`python\\ndef check_all_params(loss_fn, param_dict, eps=1e-5):\\n    flat, shapes = pack_params(param_dict)\\n    num_grad = np.zeros_like(flat)\\n    for i in range(len(flat)):\\n        flat[i] += eps\\n        L_plus  = loss_fn(unpack_params(flat, shapes))\\n        flat[i] -= 2 * eps\\n        L_minus = loss_fn(unpack_params(flat, shapes))\\n        flat[i] += eps  # restore\\n        num_grad[i] = (L_plus - L_minus) / (2 * eps)\\n    return unpack_params(num_grad, shapes)\\n\`\`\`\\n\\nThis works identically for any combination of weight matrices and bias vectors — even convolutional filters.\\n\\n**Pro tip:** When a check fails, print the top-5 worst offenders:\\n\\n\`\`\`python\\nerrs = np.abs(g_analytic - g_numerical)\\ntop5 = np.argsort(errs.ravel())[-5:][::-1]\\nprint('Worst parameter indices:', top5)\\nprint('Errors:', errs.ravel()[top5])\\n\`\`\`\\n\\nThis tells you exactly which parameter has the bug, which often reveals the layer immediately."
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Numerical gradient checking uses central differences — (L(θ+ε) - L(θ-ε)) / (2ε) — to approximate the true gradient without calculus, and is more accurate than forward differences because first-order error terms cancel.",
    "A relative error below 1e-5 means your analytic gradient is almost certainly correct. Between 1e-5 and 1e-3 is suspicious. Above 1e-3 is a definitive bug.",
    "The checker requires 2 forward passes per parameter, making it O(P) times slower than backprop. Use it only for debugging, never during training.",
    "The most common bugs it catches are: wrong chain rule application, transposed matrices, off-by-1/n normalization errors, and incorrect activation derivatives.",
    "When a check fails, isolate by checking one layer at a time — freeze all other parameters and check only the layer you suspect."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# Numerical Gradient Checker
# Use finite differences to verify analytic gradients

def numerical_gradient(f, x, h=1e-5):
    """
    Compute numerical gradient of f at x using centered finite differences.
    f: function that takes a numpy array and returns a scalar
    x: numpy array (point at which to evaluate gradient)
    h: step size for finite differences
    """
    grad = np.zeros_like(x, dtype=float)
    # TODO: For each element x[i], compute the partial derivative using:
    #       (f(x with x[i]+h) - f(x with x[i]-h)) / (2*h)
    #       Hint: use x.copy() to avoid mutating x
    
    return grad


# --- Loss Function 1: Mean Squared Error ---

def mse_loss(w):
    """MSE loss: mean((w - target)^2) where target = [1, 2, 3]"""
    target = np.array([1.0, 2.0, 3.0])
    return np.mean((w - target) ** 2)

def mse_analytic_grad(w):
    """Analytic gradient of MSE loss."""
    target = np.array([1.0, 2.0, 3.0])
    # TODO: Return the analytic gradient of mean((w - target)^2) w.r.t. w
    pass


# --- Loss Function 2: Cross-Entropy (binary) ---

def binary_cross_entropy(w):
    """
    Binary cross-entropy: -[y*log(sigmoid(w)) + (1-y)*log(1-sigmoid(w))]
    where y = [1, 0, 1] (fixed labels) and sigmoid is applied element-wise.
    Returns the mean over all elements.
    """
    y = np.array([1.0, 0.0, 1.0])
    p = 1.0 / (1.0 + np.exp(-w))  # sigmoid
    p = np.clip(p, 1e-7, 1 - 1e-7)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

def bce_analytic_grad(w):
    """Analytic gradient of binary cross-entropy."""
    y = np.array([1.0, 0.0, 1.0])
    p = 1.0 / (1.0 + np.exp(-w))  # sigmoid
    n = len(w)
    # TODO: Return the analytic gradient of the BCE loss w.r.t. w
    # Hint: d(BCE)/dw_i = (p_i - y_i) / n
    pass


# --- Loss Function 3: L2-Regularized Linear Loss ---

def l2_reg_loss(w):
    """
    L2-regularized loss: sum(w^2 * coeffs) + 0.5 * lambda * sum(w^2)
    where coeffs = [2, -1, 3] and lambda = 0.1
    """
    coeffs = np.array([2.0, -1.0, 3.0])
    lam = 0.1
    return np.sum(w ** 2 * coeffs) + 0.5 * lam * np.sum(w ** 2)

def l2_reg_analytic_grad(w):
    """Analytic gradient of L2-regularized loss."""
    coeffs = np.array([2.0, -1.0, 3.0])
    lam = 0.1
    # TODO: Return the analytic gradient of the L2-regularized loss w.r.t. w
    # Hint: differentiate term by term
    pass


# --- Gradient Checker ---

def check_gradient(loss_fn, analytic_grad_fn, w, name):
    """
    Compare numerical and analytic gradients.
    Prints relative error for each element and a PASS/FAIL verdict.
    """
    num_grad = numerical_gradient(loss_fn, w)
    # TODO: Compute the analytic gradient using analytic_grad_fn
    ana_grad = None

    # TODO: Compute relative error = ||num - ana|| / (||num|| + ||ana|| + 1e-8)
    rel_error = None

    print(f"\\n[{name}]")
    print(f"  Numerical  gradient: {num_grad}")
    print(f"  Analytic   gradient: {ana_grad}")
    print(f"  Relative error:      {rel_error:.2e}")
    verdict = "PASS" if rel_error < 1e-4 else "FAIL"
    print(f"  Result: {verdict}")
    return rel_error


if __name__ == "__main__":
    np.random.seed(42)
    w = np.array([0.5, -1.2, 0.8])

    check_gradient(mse_loss,            mse_analytic_grad, w, "MSE Loss")
    check_gradient(binary_cross_entropy, bce_analytic_grad, w, "Binary Cross-Entropy")
    check_gradient(l2_reg_loss,         l2_reg_analytic_grad, w, "L2-Regularized Loss")
`,
      solutionCode: `import numpy as np

# Numerical Gradient Checker
# Finite differences give a reference gradient we can compare against
# analytic derivatives to catch implementation bugs.

def numerical_gradient(f, x, h=1e-5):
    """
    Centered finite-difference estimate: (f(x+h*e_i) - f(x-h*e_i)) / (2h)
    Centered differences give O(h^2) accuracy vs O(h) for one-sided.
    """
    grad = np.zeros_like(x, dtype=float)
    for i in range(len(x)):
        x_plus = x.copy()
        x_plus[i] += h
        x_minus = x.copy()
        x_minus[i] -= h
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * h)
    return grad


# --- Loss Function 1: Mean Squared Error ---

def mse_loss(w):
    """MSE loss: mean((w - target)^2) where target = [1, 2, 3]"""
    target = np.array([1.0, 2.0, 3.0])
    return np.mean((w - target) ** 2)

def mse_analytic_grad(w):
    """
    d/dw_i  mean((w - t)^2) = (2/n) * (w_i - t_i)
    """
    target = np.array([1.0, 2.0, 3.0])
    n = len(w)
    return (2.0 / n) * (w - target)


# --- Loss Function 2: Binary Cross-Entropy ---

def binary_cross_entropy(w):
    """
    BCE with sigmoid activation: mean(-y*log(p) - (1-y)*log(1-p))
    where p = sigmoid(w), y = [1, 0, 1]
    """
    y = np.array([1.0, 0.0, 1.0])
    p = 1.0 / (1.0 + np.exp(-w))
    p = np.clip(p, 1e-7, 1 - 1e-7)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

def bce_analytic_grad(w):
    """
    The clean result of chain rule through sigmoid + log:
    d(BCE)/dw_i = (sigmoid(w_i) - y_i) / n
    """
    y = np.array([1.0, 0.0, 1.0])
    p = 1.0 / (1.0 + np.exp(-w))
    n = len(w)
    return (p - y) / n


# --- Loss Function 3: L2-Regularized Loss ---

def l2_reg_loss(w):
    """
    sum(coeffs * w^2) + 0.5 * lambda * sum(w^2)
    coeffs = [2, -1, 3], lambda = 0.1
    """
    coeffs = np.array([2.0, -1.0, 3.0])
    lam = 0.1
    return np.sum(w ** 2 * coeffs) + 0.5 * lam * np.sum(w ** 2)

def l2_reg_analytic_grad(w):
    """
    d/dw_i [coeffs_i * w_i^2 + 0.5*lam*w_i^2]
           = 2*coeffs_i*w_i + lam*w_i
    """
    coeffs = np.array([2.0, -1.0, 3.0])
    lam = 0.1
    return 2.0 * coeffs * w + lam * w


# --- Gradient Checker ---

def check_gradient(loss_fn, analytic_grad_fn, w, name):
    """
    Relative error = ||num - ana|| / (||num|| + ||ana|| + eps)
    Values < 1e-4 indicate the analytic gradient is correct.
    Values > 1e-2 indicate a likely bug in the analytic formula.
    """
    num_grad = numerical_gradient(loss_fn, w)
    ana_grad = analytic_grad_fn(w)

    # Relative error is scale-invariant — safe to compare across loss functions
    rel_error = np.linalg.norm(num_grad - ana_grad) / (
        np.linalg.norm(num_grad) + np.linalg.norm(ana_grad) + 1e-8
    )

    print(f"\\n[{name}]")
    print(f"  Numerical  gradient: {num_grad}")
    print(f"  Analytic   gradient: {ana_grad}")
    print(f"  Relative error:      {rel_error:.2e}")
    verdict = "PASS" if rel_error < 1e-4 else "FAIL"
    print(f"  Result: {verdict}")
    return rel_error


if __name__ == "__main__":
    np.random.seed(42)
    w = np.array([0.5, -1.2, 0.8])

    check_gradient(mse_loss,             mse_analytic_grad,  w, "MSE Loss")
    check_gradient(binary_cross_entropy, bce_analytic_grad,  w, "Binary Cross-Entropy")
    check_gradient(l2_reg_loss,          l2_reg_analytic_grad, w, "L2-Regularized Loss")
`,
    },
  ],
};
