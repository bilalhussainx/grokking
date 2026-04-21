import { Module } from "../types";

export const microgradModule: Module = {
  id: "nn-micrograd",
  title: "Micrograd: Backpropagation Engine",
  description: "Build an autograd engine and a small neural network library from scratch. Based on Karpathy's 'The spelled-out intro to neural networks and backpropagation: building micrograd' (https://www.youtube.com/watch?v=VMj-3S1tku0).",
  lessons: [
    {
      id: "nn-micrograd-what-is-nn",
      slug: "what-is-a-neural-network",
      title: "What is a Neural Network?",
      content: `## What is a Neural Network?

> **Lecture Resource:** [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0) by Andrej Karpathy

A **neural network** is a differentiable mathematical function that learns patterns from data by adjusting internal parameters — **weights** and **biases** — to minimize a loss function. It is built from simple computational units called **neurons**, organized into layers and connected in a directed acyclic graph (DAG).

The "learning" part is what makes neural networks powerful: because every computation is differentiable, we can compute the gradient of the loss with respect to every parameter and nudge each weight in the direction that reduces error. This module builds that machinery from scratch.

\`\`\`concept
{ "title": "A Neural Network is a Differentiable Program", "variant": "mental-model", "content": "Think of a neural network not as a brain analogy, but as a program where every operation is differentiable. Because we can compute the gradient of the loss with respect to every parameter, we can nudge each weight in the direction that reduces the loss. The network doesn't 'understand' anything — it optimizes. Karpathy's micrograd makes this concrete: every number remembers how it was computed, so gradients can flow backward through any expression." }
\`\`\`

### The Single Neuron

The fundamental unit of every network is a **neuron** (also called a unit or node). A neuron with \`n\` inputs computes:

\`\`\`
output = activation(w₁·x₁ + w₂·x₂ + … + wₙ·xₙ + b)
\`\`\`

Where:
- \`x₁ … xₙ\` — input values (features or prior-layer outputs)
- \`w₁ … wₙ\` — **weights** (learnable; the strength of each connection)
- \`b\` — **bias** (learnable; shifts the activation threshold)
- \`activation\` — a non-linear function applied to the weighted sum

\`\`\`steps
{ "title": "How a Neuron Computes Its Output", "steps": [ { "title": "Receive inputs", "content": "The neuron receives a vector of input values \`[x₁, x₂, …, xₙ]\`. These could be raw features (pixel values, embeddings) or outputs from the previous layer." }, { "title": "Multiply by weights", "content": "Each input \`xᵢ\` is scaled by its corresponding weight \`wᵢ\`. A large weight means that input matters a lot; a weight near zero means it barely influences the result. Weights are the primary learnable parameters." }, { "title": "Add the bias", "content": "A scalar bias \`b\` is added to the weighted sum. Without bias, a neuron that sees all-zero inputs would always produce the same output regardless of training — bias frees the network to shift its decision boundary." }, { "title": "Apply the activation function", "content": "The raw weighted sum is passed through a non-linear function. This step is critical: without it, composing layers produces only another linear map with no added expressive power." }, { "title": "Emit output to next layer", "content": "The activated value propagates forward. During training, gradients will flow backward through this exact computation — every operation we just performed will participate in backpropagation." } ] }
\`\`\`

### Watching a Neuron Execute

Let's trace a concrete 2-input neuron: \`w₁=0.5\`, \`w₂=−1.0\`, \`b=1.0\`, tanh activation, on inputs \`x₁=2.0\`, \`x₂=3.0\`.

\`\`\`trace
{ "title": "Single Neuron Forward Pass", "language": "python", "code": "import math\\n\\nx1, x2 = 2.0, 3.0\\nw1, w2 = 0.5, -1.0\\nb = 1.0\\n\\nweighted_sum = x1*w1 + x2*w2\\npre_act = weighted_sum + b\\noutput = math.tanh(pre_act)\\nprint(output)", "frames": [ { "line": 3, "vars": {"x1": 2.0, "x2": 3.0}, "note": "Inputs arrive. These will not change — only weights and bias are learnable." }, { "line": 4, "vars": {"x1": 2.0, "x2": 3.0, "w1": 0.5, "w2": -1.0}, "note": "Weights loaded — w₁ amplifies x₁ slightly, w₂ inverts and amplifies x₂." }, { "line": 5, "vars": {"x1": 2.0, "x2": 3.0, "w1": 0.5, "w2": -1.0, "b": 1.0}, "note": "Bias b=1.0 will shift the pre-activation value upward." }, { "line": 7, "vars": {"x1": 2.0, "x2": 3.0, "w1": 0.5, "w2": -1.0, "b": 1.0, "weighted_sum": -2.0}, "note": "2.0×0.5 + 3.0×(−1.0) = 1.0 − 3.0 = −2.0. The negative weight on x₂ dominates." }, { "line": 8, "vars": {"weighted_sum": -2.0, "b": 1.0, "pre_act": -1.0}, "note": "Add bias: −2.0 + 1.0 = −1.0 (the pre-activation, or 'logit')." }, { "line": 9, "vars": {"pre_act": -1.0, "output": -0.7616}, "note": "tanh(−1.0) ≈ −0.7616. The output is squashed into the range (−1, 1)." }, { "line": 10, "vars": {"output": -0.7616}, "note": "Output emitted. In training, ∂loss/∂output will flow back through tanh → pre_act → w₁, w₂, b.", "stdout": "-0.7615941559557649" } ], "speed": 900 }
\`\`\`

### Activation Functions

Without activation functions, stacking layers would collapse to a single linear map — \`W₃(W₂(W₁x)) = Wx\`. Non-linearity is what gives deep networks expressive power.

\`\`\`tabs
{ "tabs": [ { "label": "Tanh", "icon": "〰️", "content": "**Formula:** \`tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)\`\\n\\n**Range:** (−1, 1)\\n\\n**Why micrograd uses it:** Tanh is zero-centered — outputs near zero when input is near zero, and symmetric around the origin. This makes gradient flow better-behaved than sigmoid during early training.\\n\\n**Watch out:** For large |x|, the derivative approaches 0 (the function saturates), causing **vanishing gradients** in deep networks. This was a significant problem before ReLU gained traction." }, { "label": "ReLU", "icon": "📐", "content": "**Formula:** \`ReLU(x) = max(0, x)\`\\n\\n**Range:** [0, ∞)\\n\\n**Why it dominates modern networks:** Computationally trivial (a single comparison) and doesn't saturate for positive values, so gradients flow freely through active neurons.\\n\\n**Watch out:** The **dying ReLU** problem — neurons that consistently receive negative pre-activations produce zero output and zero gradient, effectively dying. Leaky ReLU (slope 0.01 for x < 0) is a common fix." }, { "label": "Sigmoid", "icon": "σ", "content": "**Formula:** \`σ(x) = 1 / (1 + e⁻ˣ)\`\\n\\n**Range:** (0, 1)\\n\\n**Best for:** Binary classification **output** layers where the result should be interpretable as a probability.\\n\\n**Watch out:** Not zero-centered (all outputs positive), and saturates at both extremes — both factors slow down gradient descent in hidden layers. Largely replaced by tanh/ReLU for hidden layers." } ] }
\`\`\`

### The Computation Graph

Every neural network computation unfolds as a **directed acyclic graph (DAG)**. Each node is either a raw input value or the result of an arithmetic operation. Edges carry data forward during the **forward pass** and gradients backward during **backpropagation**. This graph is what makes automatic differentiation possible.

\`\`\`mermaid
graph LR
    x1["x₁ = 2.0"] --> mul1["×"]
    w1["w₁ = 0.5"] --> mul1
    mul1 --> add["Σ"]
    x2["x₂ = 3.0"] --> mul2["×"]
    w2["w₂ = −1.0"] --> mul2
    mul2 --> add
    b["b = 1.0"] --> add
    add --> tanh["tanh"]
    tanh --> out["output = −0.7616"]
\`\`\`

\`\`\`callout
{ "type": "info", "title": "The Graph is Built Dynamically", "content": "In micrograd (and PyTorch's eager mode), this graph does not exist until you run the forward pass. Each time you write \`c = a + b\` on a \`Value\` object, a new node is created and \`a\`, \`b\` are recorded as its parents. Calling \`.backward()\` traverses the graph in reverse topological order, applying the chain rule at each node to accumulate gradients." }
\`\`\`

### Layers and Multi-Layer Perceptrons

A single neuron can only draw one hyperplane through its input space. Stack multiple neurons into a **layer**, and stack layers into a **Multi-Layer Perceptron (MLP)**, and you get a universal function approximator.

\`\`\`sysdiag
{ "title": "A 3-Layer MLP (2 inputs → 3 hidden → 1 output)", "width": 580, "height": 320, "nodes": [ {"id": "x1", "label": "x₁", "x": 60, "y": 100, "kind": "client"}, {"id": "x2", "label": "x₂", "x": 60, "y": 220, "kind": "client"}, {"id": "h1", "label": "h₁", "x": 240, "y": 70, "kind": "service"}, {"id": "h2", "label": "h₂", "x": 240, "y": 160, "kind": "service"}, {"id": "h3", "label": "h₃", "x": 240, "y": 250, "kind": "service"}, {"id": "out", "label": "ŷ", "x": 440, "y": 160, "kind": "service"} ], "edges": [ {"from": "x1", "to": "h1"}, {"from": "x1", "to": "h2"}, {"from": "x1", "to": "h3"}, {"from": "x2", "to": "h1"}, {"from": "x2", "to": "h2"}, {"from": "x2", "to": "h3"}, {"from": "h1", "to": "out"}, {"from": "h2", "to": "out"}, {"from": "h3", "to": "out"} ], "annotations": { "x1": "Input features — fixed values, not learned. Each input connects to every hidden neuron.", "h1": "Hidden neuron — computes weighted sum + bias, applies tanh. This layer learns intermediate representations.", "out": "Output neuron — produces prediction ŷ, compared against ground truth y to compute the loss." } }
\`\`\`

### Why Build From Scratch?

In this course, you will not start with \`torch.nn.Linear\`. Following Karpathy's philosophy, you will implement:

1. A \`Value\` class that records every arithmetic operation it participates in
2. A \`.backward()\` method that propagates gradients through the full DAG
3. \`Neuron\`, \`Layer\`, and \`MLP\` classes built entirely on \`Value\`
4. A training loop using gradient descent

This is not about avoiding frameworks — it is about **understanding what they do**. When you later call \`loss.backward()\` in PyTorch, you will know that it is traversing a dynamically-built DAG identical to the one you wrote yourself.

\`\`\`callout
{ "type": "tip", "title": "Micrograd is ~150 Lines Total", "content": "The complete micrograd implementation — autograd engine plus the neural network library on top — is roughly 150 lines of Python. It is small enough to understand completely, yet it demonstrates every concept present in PyTorch's autograd: dynamic graph construction, reverse-mode autodiff, and parameter update via gradient descent." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why does a neural network need non-linear activation functions?", "options": [ "To speed up the forward pass computation", "To ensure outputs are bounded between 0 and 1", "Because composing linear layers produces only another linear map, adding no expressive power", "To prevent weights from becoming too large during training" ], "answer": 2, "explanation": "Composing linear transformations is itself linear: W₃(W₂(W₁x)) = Wx. Non-linearity (tanh, ReLU, etc.) breaks this collapse and enables networks to approximate arbitrary functions." }, { "question": "In the perceptron formula, what is the role of the bias \`b\`?", "options": [ "It normalizes the input values before multiplication", "It shifts the activation threshold, allowing the neuron to fire even when all inputs are zero", "It controls the learning rate during gradient descent", "It regularizes the weights to prevent overfitting" ], "answer": 1, "explanation": "Without bias, a neuron receiving all-zero inputs always outputs activation(0) — a fixed value. Bias allows the network to position decision boundaries freely anywhere in the input space." }, { "question": "Micrograd builds a computation graph to enable backpropagation. When is this graph constructed?", "options": [ "At network initialization time, before any data is seen", "Dynamically, during the forward pass, as each arithmetic operation executes", "Once during the first training step and then cached for reuse", "Only during the backward pass when \`.backward()\` is called" ], "answer": 1, "explanation": "Each arithmetic operation on a \`Value\` object creates a new node and records its parent nodes. The graph is built dynamically during the forward pass — this is the same approach used by PyTorch's eager mode." }, { "question": "Which of these statements best describes why tanh is preferred over sigmoid for hidden layers?", "options": [ "Tanh is computationally cheaper than sigmoid", "Tanh outputs probabilities, sigmoid does not", "Tanh is zero-centered with range (−1, 1), while sigmoid is not zero-centered with range (0, 1)", "Tanh has no vanishing gradient problem" ], "answer": 2, "explanation": "Tanh is zero-centered (symmetric around 0), which produces better-conditioned gradients than sigmoid's all-positive outputs. Both suffer from vanishing gradients for large |x|, but tanh's symmetry makes it better suited for hidden layers." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A neural network is a differentiable program — every computation tracks how it depends on parameters, making gradient-based learning possible.", "A single neuron computes a weighted sum of its inputs, adds a learnable bias, and applies a non-linear activation function.", "Non-linear activations (tanh, ReLU, sigmoid) are essential: without them, stacking layers gains zero expressive power over a single linear map.", "Every network computation unfolds as a DAG; backpropagation traverses this graph in reverse topological order, applying the chain rule at each node.", "Micrograd (~150 lines of Python) builds the full autograd engine from scratch — understanding it gives you an accurate mental model of every modern deep learning framework." ] }
\`\`\``,
    },
    {
      id: "nn-micrograd-value-class",
      slug: "building-value-class",
      title: "Building a Value Class",
      content: `## Building a Value Class

The \`Value\` class is the atom of our autograd engine. Every number in the computation becomes a \`Value\` object that remembers how it was created and can compute its own gradient.

\`\`\`concept
{ "title": "Value as a Graph Node", "variant": "mental-model", "content": "Think of \`Value\` as a sticky note attached to a number. The note records: (1) the number itself, (2) how it was produced (which operation), (3) who its parents were, and (4) a slot for the gradient to be filled in during backpropagation. The 'sticky note' idea is exactly how PyTorch's autograd works under the hood — micrograd is just the 30-line teaching version." }
\`\`\`

---

### What Each Value Tracks

Every \`Value\` instance carries five pieces of information:

| Field | Purpose | Default |
|---|---|---|
| \`data\` | The actual scalar (float) | required |
| \`grad\` | ∂L/∂self — filled during backward | \`0.0\` |
| \`_prev\` | Set of parent \`Value\` nodes | \`set()\` |
| \`_op\` | String label for the operation | \`''\` |
| \`_backward\` | Closure that distributes \`out.grad\` to parents | \`lambda: None\` |

---

### Implementing \`__init__\` and Operator Overloading

Python's dunder methods let us write \`c = a + b\` and silently build the graph in the background. Here is the minimal implementation:

\`\`\`playground
{ "title": "Value class — core operations", "language": "python", "code": "import math\\n\\nclass Value:\\n    def __init__(self, data, _children=(), _op=''):\\n        self.data = data\\n        self.grad = 0.0\\n        self._backward = lambda: None\\n        self._prev = set(_children)\\n        self._op = _op\\n\\n    def __repr__(self):\\n        return f\\"Value(data={self.data}, grad={self.grad})\\"\\n\\n    def __add__(self, other):\\n        other = other if isinstance(other, Value) else Value(other)\\n        out = Value(self.data + other.data, (self, other), '+')\\n        def _backward():\\n            self.grad += out.grad\\n            other.grad += out.grad\\n        out._backward = _backward\\n        return out\\n\\n    def __mul__(self, other):\\n        other = other if isinstance(other, Value) else Value(other)\\n        out = Value(self.data * other.data, (self, other), '*')\\n        def _backward():\\n            self.grad += other.data * out.grad\\n            other.grad += self.data * out.grad\\n        out._backward = _backward\\n        return out\\n\\n# Try it:\\na = Value(2.0)\\nb = Value(-3.0)\\nc = a * b\\nprint(c)          # Value(data=-6.0, grad=0.0)\\nprint(c._prev)    # {Value(data=2.0), Value(data=-3.0)}\\nprint(c._op)      # *", "runnable": true }
\`\`\`

---

### Tracing a Forward Pass

Let's trace exactly what objects get created for \`d = a * b + c\`:

\`\`\`trace
{ "title": "d = a * b + c (forward pass)", "language": "python", "code": "a = Value(2.0)\\nb = Value(-3.0)\\nc = Value(10.0)\\nab = a * b\\nd = ab + c", "frames": [ { "line": 1, "vars": { "a": "Value(2.0)" }, "note": "Leaf node — no parents, no op." }, { "line": 2, "vars": { "a": "Value(2.0)", "b": "Value(-3.0)" }, "note": "Another leaf node." }, { "line": 3, "vars": { "a": "Value(2.0)", "b": "Value(-3.0)", "c": "Value(10.0)" }, "note": "Third leaf node." }, { "line": 4, "vars": { "ab": "Value(-6.0, op='*')", "_prev": "{a, b}" }, "note": "__mul__ fires: data = 2.0 * -3.0 = -6.0. Stores closure that knows a.data and b.data." }, { "line": 5, "vars": { "d": "Value(4.0, op='+')", "_prev": "{ab, c}" }, "note": "__add__ fires: data = -6.0 + 10.0 = 4.0. Now d.grad=0 — backprop hasn't run yet." } ], "speed": 900 }
\`\`\`

The graph that forms looks like this:

\`\`\`mermaid
graph LR
  a["a = 2.0"] --> mul["* → ab = -6.0"]
  b["b = -3.0"] --> mul
  mul --> add["+ → d = 4.0"]
  c["c = 10.0"] --> add
\`\`\`

---

### Why \`+=\` When Accumulating Gradients

\`\`\`concept
{ "title": "Gradient Accumulation at Shared Nodes", "variant": "rule", "content": "If a Value node is used in *multiple* downstream operations, its gradient is the **sum** of all incoming contributions. This is the multivariable chain rule: if L = f(a, g(a)), then dL/da = ∂f/∂a + ∂g/∂a · ∂a/∂a. Using \`=\` instead of \`+=\` would silently overwrite one path's contribution, producing wrong gradients." }
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Wrong — overwrites gradient", "code": "def _backward():\\n    self.grad = other.data * out.grad   # = loses earlier contribution\\n    other.grad = self.data * out.grad" }, "after": { "label": "Correct — accumulates gradient", "code": "def _backward():\\n    self.grad += other.data * out.grad  # += sums all paths\\n    other.grad += self.data * out.grad" } }
\`\`\`

A concrete example where this matters:

\`\`\`python
a = Value(3.0)
b = a * a          # a is used TWICE — two backward paths
# d(b)/d(a) should be 2*a = 6.0
# With +=: a.grad = a.data * 1.0 + a.data * 1.0 = 6.0  ✓
# With  =: a.grad = a.data * 1.0 = 3.0                  ✗
\`\`\`

---

### Completing the Operator Set

\`\`\`tabs
{ "tabs": [ { "label": "Power", "icon": "🔢", "content": "\`\`\`python\\ndef __pow__(self, other):\\n    assert isinstance(other, (int, float))\\n    out = Value(self.data ** other, (self,), f'**{other}')\\n    def _backward():\\n        # d/dx [x^n] = n * x^(n-1)\\n        self.grad += other * (self.data ** (other - 1)) * out.grad\\n    out._backward = _backward\\n    return out\\n\`\`\`\\n\\nOnly supports scalar exponents (int or float), not \`Value ** Value\`. That is an intentional simplification in micrograd." }, { "label": "Neg / Sub / Div", "icon": "➗", "content": "\`\`\`python\\ndef __neg__(self):          # -a\\n    return self * -1\\n\\ndef __sub__(self, other):   # a - b\\n    return self + (-other)\\n\\ndef __truediv__(self, other):  # a / b\\n    return self * other**-1\\n\`\`\`\\n\\nAll three are **derived** from \`__mul__\` and \`__pow__\`. No new backward logic needed — the chain rule composes automatically through the existing operations." }, { "label": "Tanh", "icon": "📈", "content": "\`\`\`python\\nimport math\\n\\ndef tanh(self):\\n    x = self.data\\n    t = (math.exp(2*x) - 1) / (math.exp(2*x) + 1)\\n    out = Value(t, (self,), 'tanh')\\n    def _backward():\\n        # d/dx tanh(x) = 1 - tanh(x)^2\\n        self.grad += (1 - t**2) * out.grad\\n    out._backward = _backward\\n    return out\\n\`\`\`\\n\\nThe derivative of tanh is \`1 - tanh(x)²\`. Because we already computed \`t = tanh(x)\` during the forward pass and captured it in the closure, the backward is a single multiply — no transcendental functions re-evaluated." }, { "label": "radd / rmul", "icon": "🔄", "content": "\`\`\`python\\ndef __radd__(self, other):  # supports: 2 + Value\\n    return self + other\\n\\ndef __rmul__(self, other):  # supports: 3 * Value\\n    return self * other\\n\`\`\`\\n\\nWithout these, \`2 + a\` raises a \`TypeError\` because Python first tries \`int.__add__(Value)\`, fails, and then calls \`Value.__radd__(2)\` as a fallback. With them, raw numbers can appear on either side of any expression." } ] }
\`\`\`

---

### The Full Computation Graph in One Example

\`\`\`python
a = Value(2.0);  b = Value(-3.0);  c = Value(10.0)
d = a * b + c        # d.data = 4.0
e = d.tanh()         # e.data = tanh(4.0) ≈ 0.9993
\`\`\`

\`\`\`algoviz
{ "title": "Graph nodes built during forward pass", "type": "array", "data": ["a=2.0", "b=-3.0", "c=10.0", "ab=-6.0", "d=4.0", "e≈0.999"], "frames": [ { "highlight": [0, 1, 2], "label": "Three leaf Values created — no parents.", "stats": { "leaves": 3, "ops": 0 } }, { "highlight": [3], "label": "a * b → Value(-6.0, op='*'). Parents: {a, b}.", "stats": { "leaves": 3, "ops": 1 } }, { "highlight": [4], "label": "ab + c → Value(4.0, op='+'). Parents: {ab, c}.", "stats": { "leaves": 3, "ops": 2 } }, { "highlight": [5], "label": "d.tanh() → Value(≈0.999, op='tanh'). Parent: {d}.", "stats": { "leaves": 3, "ops": 3 } } ], "speed": 900 }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why does \`Value.__init__\` initialise \`self.grad = 0.0\` rather than \`None\`?", "options": [ "To match PyTorch's API exactly", "Gradients accumulate with \`+=\`, so a numeric zero is the correct identity element", "Python does not allow \`None\` in arithmetic", "It gets overwritten immediately by the first backward call anyway" ], "answer": 1, "explanation": "Gradients are accumulated via \`self.grad += ...\`. Starting at 0.0 means the first contribution is added correctly without a special-case check. Starting at \`None\` would raise a \`TypeError\` on the first \`+=\`." }, { "question": "What is stored in \`_prev\` for a leaf Value like \`a = Value(2.0)\`?", "options": [ "The empty set \`set()\`", "\`None\`", "A list containing the integer 0", "A tuple \`(a,)\` pointing to itself" ], "answer": 0, "explanation": "\`_children\` defaults to \`()\`, and \`set(())\` is \`set()\`. Leaf nodes have no parents in the computation graph — they are the inputs we ultimately want gradients with respect to." }, { "question": "Which line would produce a *wrong* gradient for \`b\` in \`out = a * b\`?", "options": [ "\`self.grad += other.data * out.grad\`", "\`other.grad += self.data * out.grad\`", "\`other.grad = self.data * out.grad\`", "\`self.grad += out.grad\`" ], "answer": 2, "explanation": "Using \`=\` instead of \`+=\` discards any gradient already accumulated in \`b.grad\` from a previous operation that also used \`b\`. The correct form is \`+=\` to sum all contributions from every path through the graph." }, { "question": "Why is \`__truediv__\` implemented as \`self * other**-1\` rather than writing its own \`_backward\` closure?", "options": [ "Python does not support closures inside methods", "Reusing \`__mul__\` and \`__pow__\` means the chain rule composes automatically through existing, already-tested backward functions", "Division backward requires matrix operations not available at this stage", "It avoids a division-by-zero check" ], "answer": 1, "explanation": "Composing from primitives means you get the correct backward pass for free. Each intermediate \`Value\` created by \`__pow__\` and \`__mul__\` already carries its own \`_backward\`, so the gradient flows back correctly without writing any new differentiation code." } ] }
\`\`\`

---

\`\`\`callout
{ "type": "warning", "title": "Template Literal Pitfall (Python f-strings)", "content": "If you are embedding this code inside a TypeScript template literal, Python f-strings like \`f\\"Value(data=\\\\\${self.data})\\"\` must have the \`$\` escaped as \`\\\\$\` to prevent JavaScript from interpreting \`\\\\\${self.data}\` as a JS interpolation. Always grep for unescaped \`\\\\\${\` after pasting Python into \`.ts\` files." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A \`Value\` wraps a float with a gradient slot, parent pointers (\`_prev\`), an op label, and a \`_backward\` closure that encodes the local derivative of that specific operation.", "The computation graph is built *dynamically* during the forward pass — every \`__add__\` or \`__mul__\` call creates a new node and registers a backward function.", "Gradients must be *accumulated* with \`+=\` not assigned with \`=\`, because a single node may receive gradient contributions from multiple downstream paths (multivariable chain rule).", "Complex operations like subtraction, division, and power are derived from the primitives \`__add__\`, \`__mul__\`, and \`__pow__\` — no extra backward logic is needed.", "The \`_backward\` closure captures the forward-pass values it needs (e.g., \`t\` in tanh) at the time the node is created, making the backward pass a cheap local calculation." ] }
\`\`\``,
      starterCode: `# Build the Value class step by step
# Implement __add__, __mul__, and tanh

import math

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __repr__(self):
        return f"Value(data={self.data})"

    def __add__(self, other):
        # TODO: Handle the case where other is not a Value
        # TODO: Create the output Value with proper children and op
        # TODO: Define the _backward function
        pass

    def __mul__(self, other):
        # TODO: Similar to __add__ but for multiplication
        # TODO: Remember: d(a*b)/da = b, d(a*b)/db = a
        pass

    def tanh(self):
        # TODO: Compute tanh of self.data
        # TODO: The derivative of tanh(x) is 1 - tanh(x)**2
        pass

# Test your implementation
a = Value(2.0)
b = Value(-3.0)
c = a + b
print(c)  # Should print Value(data=-1.0)

d = a * b
print(d)  # Should print Value(data=-6.0)
`,
      solutionCode: `import math

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __repr__(self):
        return f"Value(data={self.data})"

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')

        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')

        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def __pow__(self, other):
        assert isinstance(other, (int, float))
        out = Value(self.data ** other, (self,), f'**{other}')

        def _backward():
            self.grad += other * (self.data ** (other - 1)) * out.grad
        out._backward = _backward
        return out

    def __neg__(self):
        return self * -1

    def __sub__(self, other):
        return self + (-other)

    def __truediv__(self, other):
        return self * other**-1

    def __radd__(self, other):
        return self + other

    def __rmul__(self, other):
        return self * other

    def tanh(self):
        x = self.data
        t = (math.exp(2*x) - 1) / (math.exp(2*x) + 1)
        out = Value(t, (self,), 'tanh')

        def _backward():
            self.grad += (1 - t**2) * out.grad
        out._backward = _backward
        return out

# Test
a = Value(2.0)
b = Value(-3.0)
c = a + b
print(c)  # Value(data=-1.0)

d = a * b
print(d)  # Value(data=-6.0)

e = a.tanh()
print(e)  # Value(data=0.9640...)
`,
    },
    {
      id: "nn-micrograd-backprop",
      slug: "backpropagation-from-scratch",
      title: "Backpropagation from Scratch",
      content: `## Backpropagation from Scratch

Backpropagation is the algorithm that computes gradients for every parameter in a neural network. It is not magic — it is the **chain rule from calculus**, applied systematically backward through a computation graph. Every framework you will ever use (PyTorch, TensorFlow, JAX) runs this exact algorithm under the hood.

\`\`\`concept
{ "title": "Backpropagation = Chain Rule + Topological Order", "variant": "mental-model", "content": "Each node in a computation graph knows its local gradient — how its output changes with respect to its inputs. Backpropagation chains those local gradients together, from the loss back to every leaf, to get the global gradient: how the final loss changes with respect to any value in the graph. The only bookkeeping trick is topological sort, which guarantees we process each node after all nodes that depend on it." }
\`\`\`

### The Chain Rule

If \`y = f(g(x))\`, the derivative is:

\`\`\`
dy/dx = (dy/dg) × (dg/dx)
\`\`\`

In a graph, this means: the gradient arriving at a node gets **multiplied by the local derivative** before being pushed to each child. That multiplication is the chain rule — nothing more.

\`\`\`concept
{ "title": "Local vs. Global Gradient", "variant": "insight", "content": "Every operation only needs to know two things: (1) its own local gradient — how its output changes with its input — and (2) the gradient flowing in from above (the upstream gradient). Multiply them together and pass the result downstream. The global picture emerges automatically from many such local multiplications." }
\`\`\`

### Topological Sort

Before running backward, we must visit nodes in **reverse topological order** — a node is only processed after every node that depends on its output has already been processed.

\`\`\`steps
{ "title": "Building the Backward Pass", "steps": [ { "title": "Build the topological order", "content": "Do a depth-first traversal of the computation graph, starting from the loss node. Append each node *after* visiting all its children. This gives a list ordered from inputs to output." }, { "title": "Seed the loss gradient", "content": "Set \`loss.grad = 1.0\`. This is the base case: \`dL/dL = 1\`. Every other gradient is measured relative to L." }, { "title": "Walk in reverse", "content": "Iterate the topological list backwards — from the loss back to the leaf inputs. At each node, call \`_backward()\`, which multiplies the upstream gradient by the local gradient and accumulates it into each child's \`.grad\`." }, { "title": "Gradient accumulation with +=", "content": "Each \`_backward()\` uses \`+=\`, not \`=\`. If a value appears in multiple places in the graph, its gradient contributions from all paths add up — the multivariate chain rule." } ] }
\`\`\`

\`\`\`python
def backward(self):
    topo = []
    visited = set()

    def build_topo(v):
        if v not in visited:
            visited.add(v)
            for child in v._prev:
                build_topo(child)
            topo.append(v)

    build_topo(self)

    self.grad = 1.0          # dL/dL = 1
    for v in reversed(topo):
        v._backward()
\`\`\`

### Step-by-Step Worked Example

Consider this small computation graph:

\`\`\`python
a = Value(2.0)
b = Value(-3.0)
c = a * b        # c = -6.0
d = Value(10.0)
e = c + d        # e =  4.0
f = Value(-2.0)
L = e * f        # L = -8.0
\`\`\`

The graph has 7 nodes. Let's trace every gradient, one node at a time.

\`\`\`trace
{ "title": "Backprop Through L = (a*b + d) * f", "language": "python", "code": "a = Value(2.0)\\nb = Value(-3.0)\\nc = a * b        # c = -6.0\\nd = Value(10.0)\\ne = c + d        # e =  4.0\\nf = Value(-2.0)\\nL = e * f        # L = -8.0\\n\\nL.backward()", "frames": [ { "line": 7, "vars": { "L.data": -8.0, "L.grad": 1.0 }, "note": "Seed: dL/dL = 1.0" }, { "line": 6, "vars": { "e.grad": -2.0, "f.grad": 4.0 }, "note": "Multiply backwards: e.grad = f.data * L.grad = -2 * 1 = -2.0; f.grad = e.data * L.grad = 4 * 1 = 4.0" }, { "line": 4, "vars": { "c.grad": -2.0, "d.grad": -2.0 }, "note": "Addition passes gradient unchanged: both c.grad and d.grad = 1.0 * e.grad = -2.0" }, { "line": 2, "vars": { "a.grad": 6.0, "b.grad": -4.0 }, "note": "Multiply backwards: a.grad = b.data * c.grad = -3 * -2 = 6.0; b.grad = a.data * c.grad = 2 * -2 = -4.0" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Addition is a gradient distributor", "content": "For \`e = c + d\`, the local gradients are \`de/dc = 1\` and \`de/dd = 1\`. So the upstream gradient flows through to both children unchanged. Addition never amplifies or shrinks gradients — it just copies them to each input." }
\`\`\`

### Gradient Accumulation — The Silent Bug

When a variable is used **more than once**, its gradient contributions from every path through the graph must be **summed**. This is a direct consequence of the multivariate chain rule.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Bug: = instead of +=", "code": "# Multiply backward (WRONG)\\ndef _backward():\\n    self._prev[0].grad = other.data * self.grad   # overwrites!\\n    self._prev[1].grad = self._prev[0].data * self.grad" }, "after": { "label": "Correct: accumulate gradients", "code": "# Multiply backward (CORRECT)\\ndef _backward():\\n    self._prev[0].grad += other.data * self.grad  # accumulates\\n    self._prev[1].grad += self._prev[0].data * self.grad" } }
\`\`\`

\`\`\`playground
{ "title": "See Gradient Accumulation in Action", "language": "python", "code": "# Minimal Value class to demonstrate accumulation\\nclass Value:\\n    def __init__(self, data):\\n        self.data = data\\n        self.grad = 0.0\\n\\n# When a variable is used twice, both paths contribute\\n# Analytically: if b = a + a, then db/da = 2\\na = Value(3.0)\\n\\n# Simulate two uses of a:\\n# path 1 contributes gradient 1.0\\na.grad += 1.0\\n# path 2 also contributes gradient 1.0\\na.grad += 1.0\\n\\nprint(f'a.grad = {a.grad}')  # Should be 2.0\\n\\n# If we had used = instead of +=:\\na.grad = 0.0\\na.grad = 1.0   # path 1\\na.grad = 1.0   # path 2 OVERWRITES, not adds!\\nprint(f'a.grad (wrong) = {a.grad}')  # 1.0 — incorrect!", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Always zero gradients before a new backward pass", "content": "Because gradients accumulate with \`+=\`, running \`.backward()\` twice without resetting \`.grad = 0\` will double-count every gradient. PyTorch's \`optimizer.zero_grad()\` exists for exactly this reason." }
\`\`\`

### Verifying with Numerical Gradients

Before trusting your implementation, verify it with numerical gradients — the finite-difference approximation of the derivative:

\`\`\`
df/dx ≈ (f(x + h) − f(x − h)) / (2h)     h ≈ 1e-5
\`\`\`

This two-sided (central) difference is more accurate than the one-sided form because its error is O(h²) rather than O(h).

\`\`\`playground
{ "title": "Numerical Gradient Checker", "language": "python", "code": "def numerical_gradient(func, x, h=1e-5):\\n    \\"\\"\\"Central-difference numerical gradient.\\"\\"\\"\\n    return (func(x + h) - func(x - h)) / (2 * h)\\n\\n# Test: f(x) = x^3, analytical df/dx = 3x^2\\nf = lambda x: x**3\\nx = 2.0\\n\\nanalytical = 3 * x**2          # = 12.0\\nnumerical  = numerical_gradient(f, x)\\n\\nprint(f'Analytical: {analytical}')\\nprint(f'Numerical:  {numerical:.6f}')\\nprint(f'Match: {abs(analytical - numerical) < 1e-4}')", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The 5-decimal rule", "content": "If your analytical gradient matches the numerical gradient to about 5 decimal places, your \`_backward()\` implementation is correct. A mismatch almost always means you used \`=\` where you needed \`+=\`, or got the local gradient formula wrong for a specific operation." }
\`\`\`

### The Full Algorithm at a Glance

\`\`\`tabs
{ "tabs": [ { "label": "Forward Pass", "icon": "➡️", "content": "Walk inputs → loss, computing each operation and building the graph.\\n\\n\`\`\`python\\na = Value(2.0)\\nb = Value(-3.0)\\nc = a * b   # graph edge: c._prev = {a, b}\\nL = c + Value(10.0)\\n\`\`\`\\n\\nEach Value stores: \`.data\` (the number), \`.grad\` (starts at 0), \`._prev\` (parent nodes), \`._backward\` (closure that knows local gradients)." }, { "label": "Backward Pass", "icon": "⬅️", "content": "Walk loss → inputs in reverse topological order, applying the chain rule at each node.\\n\\n\`\`\`python\\nL.grad = 1.0          # seed\\nfor v in reversed(topo):\\n    v._backward()     # push grads to children\\n\`\`\`\\n\\nAfter this loop, every leaf node's \`.grad\` holds \`dL/d(leaf)\` — exactly the gradient gradient descent needs." }, { "label": "PyTorch Parallel", "icon": "🔥", "content": "What PyTorch's \`loss.backward()\` does is identical:\\n\\n1. Retrieve the dynamically built computation graph\\n2. Topologically sort the graph nodes\\n3. Seed \`loss.grad = 1.0\`\\n4. Walk in reverse, calling each op's \`backward\` function\\n\\nThe only difference: PyTorch operates on tensors (batches of scalars) rather than individual scalars, and the backward kernels are written in C++/CUDA for speed." } ] }
\`\`\`

### The micrograd Reality Check

\`\`\`concept
{ "title": "Under 150 Lines of Python", "variant": "insight", "content": "Karpathy's micrograd implements a fully functional autograd engine in engine.py (< 100 lines) and a neural network library in nn.py (~60 lines). The entire thing — computation graphs, backpropagation, and training a multi-layer perceptron — fits in under 150 lines of pure Python. Scalar-level granularity makes it slow for real workloads, but it makes the math completely transparent." }
\`\`\`

\`\`\`quiz
{ "title": "Backpropagation Checkpoint", "questions": [ { "question": "Why must we visit nodes in reverse topological order during backpropagation?", "options": [ "To avoid computing the same gradient twice", "To ensure a node is only processed after all nodes that depend on it have already received their gradient", "To keep memory usage low by freeing nodes early", "Topological order is just a convention — any order works" ], "answer": 1, "explanation": "A node's _backward() multiplies the upstream gradient by its local gradient. If we process a node before all its dependents have propagated their gradients to it, its .grad will be incomplete and the chain rule breaks. Reverse topological order guarantees all upstream contributions have arrived before we propagate downstream." }, { "question": "Variable \`x\` is used in two separate branches of a computation graph and both branches contribute to the final loss L. Which statement is correct?", "options": [ "x.grad = gradient from branch 1, ignoring branch 2", "x.grad = gradient from branch 2, overwriting branch 1", "x.grad = sum of gradients from both branches", "x.grad = product of gradients from both branches" ], "answer": 2, "explanation": "This is the multivariate chain rule. When x appears in multiple paths, each path contributes an additive term to dL/dx. That's why every _backward() uses += not =. Using = would silently discard all but the last gradient." }, { "question": "You seed the backward pass by setting loss.grad = 1.0. What does this value represent?", "options": [ "The learning rate for the first update step", "dL/dL — the derivative of the loss with respect to itself, which is always 1", "The magnitude of the loss on this forward pass", "An arbitrary initialization that gets corrected during backprop" ], "answer": 1, "explanation": "The chain rule multiplies upstream gradients by local gradients at each step. The very first 'upstream' gradient at the loss node is dL/dL, which is 1 by definition. Every other gradient in the graph is computed relative to this base case." }, { "question": "A numerical gradient check passes for addition but fails for multiplication. The most likely cause is:", "options": [ "The numerical gradient function has a bug in its formula", "The multiplication _backward() used = instead of += somewhere", "Floating-point precision is too low for multiplication", "Topological sort is incorrect for nodes created by multiplication" ], "answer": 1, "explanation": "The most common implementation bug is using assignment (=) instead of accumulation (+=) in a _backward() closure. This silently overwrites previously accumulated gradients, causing a mismatch with the numerical gradient which sums all path contributions correctly." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Backpropagation is the chain rule applied in reverse topological order through a computation graph — nothing more.", "Every operation stores a _backward closure that knows its local gradient and pushes it (multiplied by the upstream gradient) to its children.", "Gradients accumulate with += because a variable used in multiple places contributes to the loss through every path simultaneously.", "Always seed loss.grad = 1.0 before the backward pass — this is the base case dL/dL = 1.", "Verify your implementation with numerical gradients (central difference, h ≈ 1e-5). A 5-decimal match confirms correctness.", "micrograd's entire autograd engine is under 100 lines of Python — complexity hides in the math, not the code." ] }
\`\`\``,
      starterCode: `import math

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __repr__(self):
        return f"Value(data={self.data}, grad={self.grad})"

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def tanh(self):
        x = self.data
        t = (math.exp(2*x) - 1) / (math.exp(2*x) + 1)
        out = Value(t, (self,), 'tanh')
        def _backward():
            self.grad += (1 - t**2) * out.grad
        out._backward = _backward
        return out

    def backward(self):
        # TODO: Implement topological sort
        # TODO: Set self.grad = 1.0
        # TODO: Call _backward() on each node in reverse topological order
        pass

# Test
a = Value(2.0)
b = Value(-3.0)
c = a * b
d = c + Value(10.0)
L = d * Value(-2.0)
L.backward()
print(f"a.grad = {a.grad}")  # Should be 6.0
print(f"b.grad = {b.grad}")  # Should be -4.0
`,
      solutionCode: `import math

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __repr__(self):
        return f"Value(data={self.data}, grad={self.grad})"

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def tanh(self):
        x = self.data
        t = (math.exp(2*x) - 1) / (math.exp(2*x) + 1)
        out = Value(t, (self,), 'tanh')
        def _backward():
            self.grad += (1 - t**2) * out.grad
        out._backward = _backward
        return out

    def backward(self):
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)
        self.grad = 1.0
        for v in reversed(topo):
            v._backward()

# Test
a = Value(2.0)
b = Value(-3.0)
c = a * b
d = c + Value(10.0)
L = d * Value(-2.0)
L.backward()
print(f"a.grad = {a.grad}")  # 6.0
print(f"b.grad = {b.grad}")  # -4.0
`,
    },
    {
      id: "nn-micrograd-neuron-layer-mlp",
      slug: "building-neuron-layer-mlp",
      title: "Building a Neuron/Layer/MLP",
      content: `## Building a Neuron, Layer, and MLP

With our \`Value\` class and backpropagation engine in place, we can now compose it into actual neural network components — climbing from a single neuron up to a full multi-layer perceptron. Every class we write is just a thin wrapper around \`Value\` objects, so the computation graph — and thus every gradient — stays intact end to end.

\`\`\`concept
{ "title": "A Neural Network Is Nested Function Composition", "variant": "mental-model", "content": "A neuron is a function. A layer is a list of functions applied in parallel to the same input. An MLP is a chain of layers applied in sequence. Because every component is built from Value objects, a single output.backward() call propagates gradients through the entire network — no matter how deep." }
\`\`\`

---

### The Neuron

A neuron takes \`n\` inputs, multiplies each by a weight, adds a bias, and squashes the result through \`tanh\`:

\`\`\`python
import random

class Neuron:
    def __init__(self, nin):
        self.w = [Value(random.uniform(-1, 1)) for _ in range(nin)]
        self.b = Value(random.uniform(-1, 1))

    def __call__(self, x):
        act = sum((wi * xi for wi, xi in zip(self.w, x)), self.b)
        out = act.tanh()
        return out

    def parameters(self):
        return self.w + [self.b]
\`\`\`

\`__call__\` makes the neuron usable like a function: \`neuron(inputs)\`. \`parameters()\` exposes every learnable \`Value\` — the training loop will iterate over these to apply gradient updates.

Here is the forward pass traced on a concrete two-input neuron:

\`\`\`trace
{ "title": "Neuron Forward Pass — Concrete Walkthrough", "language": "python", "code": "w = [Value(0.5), Value(-0.3)]\\nb = Value(0.1)\\nx = [Value(2.0), Value(3.0)]\\n\\nact = sum((wi*xi for wi, xi in zip(w, x)), b)\\nout = act.tanh()\\nprint(out.data)", "frames": [ { "line": 1, "vars": { "w[0]": 0.5, "w[1]": -0.3 }, "note": "Weights initialised (random.uniform in practice)" }, { "line": 2, "vars": { "b": 0.1 }, "note": "Bias initialised" }, { "line": 3, "vars": { "x[0]": 2.0, "x[1]": 3.0 }, "note": "Caller provides input values" }, { "line": 5, "vars": { "w[0]*x[0]": 1.0, "w[1]*x[1]": -0.9, "act.data": 0.2 }, "note": "Weighted sum: 0.5×2.0 + (−0.3)×3.0 + 0.1 = 0.2" }, { "line": 6, "vars": { "out.data": 0.197 }, "note": "tanh(0.2) ≈ 0.197 — output is squashed into (−1, 1)" }, { "line": 7, "vars": {}, "stdout": "0.19737532022490396", "note": "out is a full Value node connected to the computation graph" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why tanh?", "content": "tanh maps any real number into (−1, 1), is differentiable everywhere, and its derivative — 1 − tanh²(x) — is cheap to compute once the forward value is known. Without a non-linear activation, stacking any number of layers collapses to a single linear transformation, completely eliminating the benefit of depth." }
\`\`\`

---

### The Layer

A layer is a list of neurons that all receive the same input and each produce one output:

\`\`\`python
class Layer:
    def __init__(self, nin, nout):
        self.neurons = [Neuron(nin) for _ in range(nout)]

    def __call__(self, x):
        outs = [n(x) for n in self.neurons]
        return outs[0] if len(outs) == 1 else outs

    def parameters(self):
        return [p for neuron in self.neurons for p in neuron.parameters()]
\`\`\`

\`Layer(3, 4)\` creates 4 neurons each with 3 inputs. The single-element shortcut — returning \`outs[0]\` instead of a one-element list — is a convenience so the output layer of an MLP returns a bare \`Value\` scalar directly comparable to a training target.

---

### The MLP

An MLP chains layers in sequence. The output of one layer becomes the input of the next:

\`\`\`python
class MLP:
    def __init__(self, nin, nouts):
        sz = [nin] + nouts
        self.layers = [Layer(sz[i], sz[i+1]) for i in range(len(nouts))]

    def __call__(self, x):
        for layer in self.layers:
            x = layer(x)
        return x

    def parameters(self):
        return [p for layer in self.layers for p in layer.parameters()]
\`\`\`

\`MLP(3, [4, 4, 1])\` wires three layers together:

\`\`\`mermaid
graph LR
    subgraph Input["Input (3)"]
        x1[x₁]
        x2[x₂]
        x3[x₃]
    end
    subgraph L1["Layer 1 (4 neurons)"]
        n11[N] 
        n12[N]
        n13[N]
        n14[N]
    end
    subgraph L2["Layer 2 (4 neurons)"]
        n21[N]
        n22[N]
        n23[N]
        n24[N]
    end
    subgraph Out["Output (1 neuron)"]
        o[N]
    end
    x1 & x2 & x3 --> n11 & n12 & n13 & n14
    n11 & n12 & n13 & n14 --> n21 & n22 & n23 & n24
    n21 & n22 & n23 & n24 --> o
\`\`\`

---

### Counting Parameters

Every weight and bias is a separate, learnable \`Value\`:

| Layer | Neurons | Params per neuron | Total |
|-------|---------|-------------------|-------|
| Layer 1 | 4 | 3 weights + 1 bias = 4 | 16 |
| Layer 2 | 4 | 4 weights + 1 bias = 5 | 20 |
| Output | 1 | 4 weights + 1 bias = 5 | 5 |
| **Total** | | | **41** |

\`\`\`python
model = MLP(3, [4, 4, 1])
print(f"Number of parameters: {len(model.parameters())}")
# → 41
\`\`\`

Modern GPT-scale models have billions of parameters across hundreds of layers, but the underlying structure — fully connected layers of neurons, each with weights and a bias — is identical. The scale differs; the principle does not.

---

### The OOP Contract: Micrograd → PyTorch

Every class we wrote follows the same three-method contract. This is not accidental — it mirrors exactly what PyTorch's \`nn.Module\` enforces:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Micrograd (our engine)", "code": "class Neuron:\\n    def __init__(self, nin):\\n        # 1. Create parameters\\n        self.w = [Value(random.uniform(-1,1)) for _ in range(nin)]\\n        self.b = Value(random.uniform(-1,1))\\n\\n    def __call__(self, x):\\n        # 2. Define the forward pass\\n        act = sum((wi*xi for wi, xi in zip(self.w, x)), self.b)\\n        return act.tanh()\\n\\n    def parameters(self):\\n        # 3. Expose learnable params\\n        return self.w + [self.b]" }, "after": { "label": "PyTorch nn.Module (same contract)", "code": "import torch.nn as nn\\n\\nclass Neuron(nn.Module):\\n    def __init__(self, nin):\\n        super().__init__()\\n        # 1. Create parameters\\n        self.linear = nn.Linear(nin, 1)\\n\\n    def forward(self, x):\\n        # 2. Define the forward pass\\n        return torch.tanh(self.linear(x))\\n\\n    # 3. parameters() is inherited automatically" } }
\`\`\`

When you later write \`class MyModel(nn.Module)\`, you define \`__init__\` and \`forward\` — PyTorch's version of \`__call__\` — and \`parameters()\` is provided by the base class. The contract is identical; only the scale changes.

---

### Quiz

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A Layer(5, 3) object contains how many total learnable parameters?", "options": ["15  (5 weights × 3 neurons, no bias)", "18  (5 weights + 1 bias = 6 per neuron, × 3 neurons)", "16  (5 weights × 3 neurons + 1 shared bias)", "8   (5 inputs + 3 outputs)"], "answer": 1, "explanation": "Each of the 3 neurons has 5 weights plus 1 independent bias = 6 parameters. 6 × 3 = 18 total. Biases are never shared between neurons." }, { "question": "What happens if you remove the tanh activation from every neuron in an MLP with multiple hidden layers?", "options": ["Training becomes faster because gradients are cheaper to compute", "The network can only learn linearly separable functions, regardless of depth", "The network can still learn non-linear functions if there are enough neurons", "Backpropagation fails because tanh's derivative is required by the chain rule"], "answer": 1, "explanation": "Without non-linearity, composing layers is just matrix multiplication: W_n × … × W_1 × x. Any depth collapses to a single linear map. No number of additional layers recovers non-linear expressiveness." }, { "question": "Why does Layer.__call__ return outs[0] when len(outs) == 1, instead of always returning a list?", "options": ["To avoid a Python list allocation that would slow down training", "So the output layer of MLP(3,[4,4,1]) returns a scalar Value directly comparable to a training target", "Because single-neuron layers represent scalars in the mathematical formalism", "To exactly replicate PyTorch's behaviour for single-output layers"], "answer": 1, "explanation": "The output layer typically has one neuron. Returning a bare Value (not a list) means you can write loss = (output - target)**2 directly, without indexing." }, { "question": "After model = MLP(3, [4, 4, 1]) and output = model(x), how do you compute gradients for all 41 parameters?", "options": ["Call model.backward()", "Call output.backward()", "Manually call backward() on each Layer in order", "Gradients are accumulated automatically during the forward pass"], "answer": 1, "explanation": "output is the root Value of the computation graph that connects all 41 parameters. output.backward() triggers reverse-mode autodiff through every node in that graph." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A neuron = weighted sum of inputs + bias, passed through a non-linear activation (tanh). It is the atomic unit of every neural network.", "A layer = N neurons applied in parallel to the same input — each neuron produces one output, so a Layer(3, 4) maps 3 values to 4.", "An MLP = layers chained in sequence; each layer's output list becomes the next layer's input.", "Every class follows the same three-method contract: __init__ (create parameters), __call__ (forward pass), parameters() (expose learnable Values). PyTorch's nn.Module enforces this same contract.", "Non-linearity is essential: without it, any depth of stacked layers collapses to a single linear transformation.", "All parameters live in one computation graph — calling output.backward() on the final Value gradients all 41 parameters in a single reverse pass." ] }
\`\`\``,
      starterCode: `import random
import math

# Assume Value class is already implemented (from previous lessons)
class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += out.grad; other.grad += out.grad
        out._backward = _backward
        return out
    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad; other.grad += self.data * out.grad
        out._backward = _backward
        return out
    def __radd__(self, other): return self + other
    def __rmul__(self, other): return self * other
    def tanh(self):
        t = (math.exp(2*self.data)-1)/(math.exp(2*self.data)+1)
        out = Value(t, (self,), 'tanh')
        def _backward():
            self.grad += (1 - t**2) * out.grad
        out._backward = _backward
        return out
    def backward(self):
        topo, visited = [], set()
        def build(v):
            if v not in visited:
                visited.add(v)
                for c in v._prev: build(c)
                topo.append(v)
        build(self)
        self.grad = 1.0
        for v in reversed(topo): v._backward()

class Neuron:
    def __init__(self, nin):
        # TODO: Initialize weights and bias with random values
        pass

    def __call__(self, x):
        # TODO: Compute w*x + b, then apply tanh
        pass

    def parameters(self):
        # TODO: Return all learnable parameters
        pass

class Layer:
    def __init__(self, nin, nout):
        # TODO: Create nout neurons
        pass

    def __call__(self, x):
        # TODO: Call each neuron and return outputs
        pass

    def parameters(self):
        # TODO: Gather params from all neurons
        pass

class MLP:
    def __init__(self, nin, nouts):
        # TODO: Build layers
        pass

    def __call__(self, x):
        # TODO: Forward through all layers
        pass

    def parameters(self):
        # TODO: Gather params from all layers
        pass

# Test
model = MLP(3, [4, 4, 1])
x = [Value(1.0), Value(2.0), Value(3.0)]
output = model(x)
print(f"Output: {output.data:.4f}")
print(f"Parameters: {len(model.parameters())}")
`,
      solutionCode: `import random
import math

class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        def _backward():
            self.grad += out.grad; other.grad += out.grad
        out._backward = _backward
        return out
    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        def _backward():
            self.grad += other.data * out.grad; other.grad += self.data * out.grad
        out._backward = _backward
        return out
    def __radd__(self, other): return self + other
    def __rmul__(self, other): return self * other
    def tanh(self):
        t = (math.exp(2*self.data)-1)/(math.exp(2*self.data)+1)
        out = Value(t, (self,), 'tanh')
        def _backward():
            self.grad += (1 - t**2) * out.grad
        out._backward = _backward
        return out
    def backward(self):
        topo, visited = [], set()
        def build(v):
            if v not in visited:
                visited.add(v)
                for c in v._prev: build(c)
                topo.append(v)
        build(self)
        self.grad = 1.0
        for v in reversed(topo): v._backward()

class Neuron:
    def __init__(self, nin):
        self.w = [Value(random.uniform(-1, 1)) for _ in range(nin)]
        self.b = Value(random.uniform(-1, 1))

    def __call__(self, x):
        act = sum((wi * xi for wi, xi in zip(self.w, x)), self.b)
        out = act.tanh()
        return out

    def parameters(self):
        return self.w + [self.b]

class Layer:
    def __init__(self, nin, nout):
        self.neurons = [Neuron(nin) for _ in range(nout)]

    def __call__(self, x):
        outs = [n(x) for n in self.neurons]
        return outs[0] if len(outs) == 1 else outs

    def parameters(self):
        return [p for n in self.neurons for p in n.parameters()]

class MLP:
    def __init__(self, nin, nouts):
        sz = [nin] + nouts
        self.layers = [Layer(sz[i], sz[i+1]) for i in range(len(nouts))]

    def __call__(self, x):
        for layer in self.layers:
            x = layer(x)
        return x

    def parameters(self):
        return [p for layer in self.layers for p in layer.parameters()]

# Test
model = MLP(3, [4, 4, 1])
x = [Value(1.0), Value(2.0), Value(3.0)]
output = model(x)
print(f"Output: {output.data:.4f}")
print(f"Parameters: {len(model.parameters())}")  # 41
`,
    },
    {
      id: "nn-micrograd-training-loop",
      slug: "training-loop",
      title: "Training Loop",
      content: `## The Training Loop

We now have all the pieces. A \`Value\` class that tracks gradients. A \`Neuron\`, \`Layer\`, and \`MLP\` that build the computation graph. The training loop is the engine that drives everything: **forward → backward → update → repeat**.

\`\`\`concept
{ "title": "The Training Loop", "variant": "mental-model", "content": "Think of training as a sculptor refining a block of marble. Each iteration, the loss function tells you *how wrong* the shape is. Backprop tells you *which direction to chisel*. The parameter update is the chisel stroke. After enough strokes the sculpture emerges — your model learns the pattern." }
\`\`\`

---

## The Loss Function: Measuring Wrongness

For our regression-style task (outputs near +1 or −1), we use **mean squared error (MSE)**:

$$L = \\frac{1}{n} \\sum_{i=1}^{n} (\\hat{y}_i - y_i)^2$$

Squaring the error does two things: it makes all errors positive, and it penalises large errors disproportionately more than small ones. A prediction of 0.5 instead of 1.0 contributes 0.25 to the loss; a prediction of −0.5 instead of 1.0 contributes 2.25.

---

## Building the Loop

\`\`\`steps
{ "title": "The Three Critical Steps", "steps": [ { "title": "1 — Forward Pass", "content": "Run each input through the model, collect predictions, then compute the loss:\\n\\n\`\`\`python\\nypred = [model(x) for x in xs]\\nloss = sum((yout - ygt)**2 for ygt, yout in zip(ys, ypred))\\n\`\`\`\\n\\nThis builds the entire computation graph — every \`Value\` node, every edge, every operation — ready for backward." }, { "title": "2 — Zero Gradients, then Backward", "content": "**Zero all gradients first.** The \`Value\` class accumulates gradients with \`+=\`, so leftover gradients from the previous step would corrupt the current one.\\n\\n\`\`\`python\\nfor p in model.parameters():\\n    p.grad = 0.0\\nloss.backward()\\n\`\`\`\\n\\nAfter \`loss.backward()\`, every parameter holds \`∂L/∂p\` — the direction of steepest loss increase." }, { "title": "3 — Update Parameters", "content": "Nudge each parameter *against* its gradient:\\n\\n\`\`\`python\\nlearning_rate = 0.05\\nfor p in model.parameters():\\n    p.data += -learning_rate * p.grad\\n\`\`\`\\n\\nThe negative sign is the heart of gradient descent: the gradient points uphill, so we subtract it to go downhill." } ] }
\`\`\`

---

## The Full Loop

\`\`\`playground
{ "title": "Training Loop (100 steps)", "language": "python", "code": "# Assumes Value, Neuron, Layer, MLP are already defined\\n\\nxs = [\\n    [2.0, 3.0, -1.0],\\n    [3.0, -1.0, 0.5],\\n    [0.5, 1.0, 1.0],\\n    [1.0, 1.0, -1.0],\\n]\\nys = [1.0, -1.0, -1.0, 1.0]\\n\\nmodel = MLP(3, [4, 4, 1])\\n\\nfor step in range(100):\\n    # 1. Forward pass\\n    ypred = [model(x) for x in xs]\\n    loss = sum((yout - ygt)**2 for ygt, yout in zip(ys, ypred))\\n\\n    # 2. Zero grads, backward\\n    for p in model.parameters():\\n        p.grad = 0.0\\n    loss.backward()\\n\\n    # 3. Update\\n    lr = 0.05\\n    for p in model.parameters():\\n        p.data += -lr * p.grad\\n\\n    if step % 10 == 0:\\n        print(f\\"Step {step}, Loss: {loss.data:.4f}\\")", "runnable": true }
\`\`\`

---

## Watching the Loss Descend

\`\`\`trace
{ "title": "Loss Over 100 Training Steps", "language": "python", "code": "step = 0\\nloss = 5.3421\\n\\n# Step 10\\nstep = 10\\nloss = 1.2873\\n\\n# Step 20\\nstep = 20\\nloss = 0.4152\\n\\n# Step 30\\nstep = 30\\nloss = 0.1203\\n\\n# Step 40\\nstep = 40\\nloss = 0.0341", "frames": [ { "line": 2, "vars": { "step": 0, "loss": 5.3421 }, "note": "Initial random weights — predictions are far off. MSE is high." }, { "line": 5, "vars": { "step": 10, "loss": 1.2873 }, "note": "After 10 updates the model has found a rough slope toward the targets." }, { "line": 8, "vars": { "step": 20, "loss": 0.4152 }, "note": "Loss cut by 10×. Gradients are smaller now — each step moves less." }, { "line": 11, "vars": { "step": 30, "loss": 0.1203 }, "note": "Converging. Predictions are close but not exact." }, { "line": 14, "vars": { "step": 40, "loss": 0.0341 }, "note": "Near zero. Model predicts ~0.98 for target 1.0, ~-0.97 for target -1.0." } ], "speed": 900 }
\`\`\`

---

## Learning Rate: The Most Important Knob

\`\`\`concept
{ "title": "Learning Rate", "variant": "rule", "content": "The learning rate is a multiplier on each gradient step. Too large and the updates overshoot the minimum — the loss bounces or diverges. Too small and training crawls. The typical sweet spot for our tiny micrograd net is 0.01–0.1." }
\`\`\`

| Learning Rate | Behaviour |
|---|---|
| \`1.0\` | Loss oscillates wildly — updates overshoot the minimum |
| \`0.1\` | Fast, steady convergence — good starting point |
| \`0.01\` | Slower but reliable for noisier landscapes |
| \`0.0001\` | Effectively no learning — loss barely moves |

A common practical trick is **learning rate decay**: start moderate, shrink over time so early steps explore broadly and late steps refine carefully:

\`\`\`python
lr = 0.1 - 0.09 * (step / max_steps)  # linearly decays 0.1 → 0.01
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Gradient Zeroing Is Not Optional", "content": "Skipping \`p.grad = 0.0\` before \`loss.backward()\` is one of the most common bugs when hand-rolling a training loop. Because our \`Value._backward\` uses \`+=\`, gradients from step N will still be sitting on the parameters when step N+1 runs, effectively tripling or quadrupling the update magnitude. The loss will appear to diverge — but the bug is accumulation, not the learning rate." }
\`\`\`

---

## Diagnosing Training Problems

\`\`\`tabs
{ "tabs": [ { "label": "Loss Explodes", "icon": "💥", "content": "**Symptom:** Loss spikes to \`inf\` or \`nan\` after a few steps.\\n\\n**Cause:** Learning rate too high — each parameter update overshoots the minimum.\\n\\n**Fix:** Halve the learning rate. If still unstable, try gradient clipping or check for division-by-zero in your activations." }, { "label": "Loss Plateaus", "icon": "📉", "content": "**Symptom:** Loss decreases quickly then flatlines well above zero.\\n\\n**Cause (1):** Learning rate too small — you've settled into a local gradient plateau.\\n**Cause (2):** Model capacity too low for the task — add neurons or layers.\\n\\n**Fix:** Try a 10× larger learning rate first. If that doesn't help, increase model width." }, { "label": "Loss Oscillates", "icon": "〰️", "content": "**Symptom:** Loss zigzags up and down every few steps without a clear trend.\\n\\n**Cause:** Usually forgetting to zero gradients, or a learning rate that's borderline too large.\\n\\n**Fix:** Confirm \`p.grad = 0.0\` runs *before* every \`loss.backward()\` call. Then reduce the learning rate by 2–5×." }, { "label": "Loss Stays High", "icon": "🔴", "content": "**Symptom:** Loss decreases but never gets below ~0.5 even after 500 steps.\\n\\n**Cause:** Underfitting — the model is too small to represent the function, or the learning rate is too small to find a good minimum.\\n\\n**Fix:** Increase model size (more layers, wider layers) or train longer with a higher learning rate." } ] }
\`\`\`

---

## Quiz: Test Your Understanding

\`\`\`quiz
{ "title": "Training Loop", "questions": [ { "question": "Why must you zero all parameter gradients before calling \`loss.backward()\`?", "options": [ "To free memory before the new computation graph is built", "Because the Value class uses += to accumulate gradients, old values persist and corrupt the new update", "To ensure the learning rate is applied correctly", "Because backward() raises an error if gradients are already set" ], "answer": 1, "explanation": "Our Value._backward uses +=, so each call to backward() adds to whatever .grad currently holds. If you don't reset to 0.0 first, the gradient from step N is still there when step N+1 runs, making every update roughly 2× too large and growing." }, { "question": "Why do we subtract the gradient (\`p.data -= lr * p.grad\`) rather than add it?", "options": [ "It's a convention — both directions work equally well", "The gradient points in the direction of steepest loss *increase*, so we go the opposite way to minimise loss", "Subtracting prevents the weights from growing too large", "The loss function is concave, so we must go uphill" ], "answer": 1, "explanation": "The gradient ∂L/∂p tells us how loss changes as p increases. To reduce loss, we move p in the *opposite* direction — hence the minus sign. This is the core of gradient descent." }, { "question": "A model's loss drops from 5.0 to 4.8 after 50 steps. What is the most likely cause?", "options": [ "The model has successfully converged", "The learning rate is too large, causing oscillation", "The learning rate is too small, causing near-zero updates", "The dataset is too large for 50 steps" ], "answer": 2, "explanation": "A drop of only 0.2 over 50 steps (from 5.0) suggests parameters are barely moving — a classic sign of a learning rate that is orders of magnitude too small. Try multiplying it by 10 and observing whether loss drops faster." }, { "question": "What does the loss function measure in a supervised learning setting?", "options": [ "The total number of operations in the forward pass", "The L2 norm of all model parameters", "The discrepancy between the model's predictions and the true target values", "The time taken to complete one training step" ], "answer": 2, "explanation": "The loss function (e.g. MSE) quantifies how wrong the model's predictions are relative to the ground truth. Minimising it over training steps is the goal of the entire procedure." } ] }
\`\`\`

---

## What We Actually Built

Take a moment to appreciate the full stack you assembled from nothing:

\`\`\`mermaid
graph LR
    A["Value class\\n(autograd engine)"] --> B["Neuron\\n(weighted sum + tanh)"]
    B --> C["Layer\\n(list of neurons)"]
    C --> D["MLP\\n(list of layers)"]
    D --> E["Training Loop\\n(forward → backward → update)"]
    E --> F["Trained Network\\n(learns from data)"]
\`\`\`

No PyTorch. No TensorFlow. No imported autodiff. Just:
- **\`Value\`** — tracks data and gradient, chains \`_backward\` closures
- **\`Neuron / Layer / MLP\`** — composes Values into a network
- **Training loop** — drives gradient descent

\`\`\`callout
{ "type": "success", "title": "This Is the Core of All Deep Learning", "content": "Convolutional networks, transformers, diffusion models — they all follow this same pattern. The complexity of modern deep learning comes from the *architectures* (what the forward pass computes) and the *scale* (billions of parameters, terabytes of data), not from the training algorithm. You now understand the algorithm at the level of first principles." }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "The training loop has exactly three moving parts: forward pass (build graph + compute loss), backward pass (zero grads then call loss.backward()), and parameter update (p.data -= lr * p.grad).", "Forgetting to zero gradients is the single most common training bug — gradients accumulate via += and will corrupt updates if not reset each step.", "The learning rate is the most critical hyperparameter: too high causes divergence, too low causes near-zero learning. Start around 0.05–0.1 and decay toward the end of training.", "A healthy loss curve decreases smoothly and quickly; plateaus suggest too-small LR or too-small model; explosions suggest too-large LR or a gradient computation bug.", "Everything in deep learning — including transformers and diffusion models — is this same loop applied to larger architectures and bigger datasets." ] }
\`\`\``,
      starterCode: `# Training loop for our MLP
# Assume Value, Neuron, Layer, MLP classes are defined above

# Dataset
xs = [
    [2.0, 3.0, -1.0],
    [3.0, -1.0, 0.5],
    [0.5, 1.0, 1.0],
    [1.0, 1.0, -1.0],
]
ys = [1.0, -1.0, -1.0, 1.0]

model = MLP(3, [4, 4, 1])

# TODO: Implement the training loop
# For 100 steps:
#   1. Forward pass: compute predictions and loss
#   2. Zero gradients
#   3. Backward pass
#   4. Update parameters with learning_rate = 0.05
#   5. Print loss every 10 steps

for step in range(100):
    # Forward pass
    # TODO

    # Zero gradients
    # TODO

    # Backward pass
    # TODO

    # Update
    # TODO

    pass

# Print final predictions
for x, y in zip(xs, ys):
    print(f"Target: {y}, Predicted: {model(x).data:.4f}")
`,
      solutionCode: `# Training loop for our MLP
xs = [
    [2.0, 3.0, -1.0],
    [3.0, -1.0, 0.5],
    [0.5, 1.0, 1.0],
    [1.0, 1.0, -1.0],
]
ys = [1.0, -1.0, -1.0, 1.0]

model = MLP(3, [4, 4, 1])

for step in range(100):
    # Forward pass
    ypred = [model(x) for x in xs]
    loss = sum((yout - ygt)**2 for ygt, yout in zip(ys, ypred))

    # Zero gradients
    for p in model.parameters():
        p.grad = 0.0

    # Backward pass
    loss.backward()

    # Update
    learning_rate = 0.05
    for p in model.parameters():
        p.data += -learning_rate * p.grad

    if step % 10 == 0:
        print(f"Step {step}, Loss: {loss.data:.6f}")

# Final predictions
print("\\nFinal predictions:")
for x, y in zip(xs, ys):
    print(f"Target: {y}, Predicted: {model(x).data:.4f}")
`,
    },
  ],
};
