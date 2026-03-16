import { Module } from "../types";

export const microgradModule: Module = {
  id: "nn-micrograd",
  title: "Micrograd: Backpropagation Engine",
  description:
    "Build an autograd engine and a small neural network library from scratch. Based on Karpathy's 'The spelled-out intro to neural networks and backpropagation: building micrograd' (https://www.youtube.com/watch?v=VMj-3S1tku0).",
  lessons: [
    {
      id: "nn-micrograd-what-is-nn",
      slug: "what-is-a-neural-network",
      title: "What is a Neural Network?",
      content: `## What is a Neural Network?

> **Lecture Resource:** [The spelled-out intro to neural networks and backpropagation: building micrograd](https://www.youtube.com/watch?v=VMj-3S1tku0) by Andrej Karpathy

A neural network is a mathematical function that learns patterns from data. At its core, it is built from simple units called **neurons**, connected together in layers. Each neuron takes inputs, multiplies them by **weights**, adds a **bias**, and passes the result through an **activation function**.

### The Biological Inspiration

The original idea was loosely inspired by biological neurons in the brain. A biological neuron receives electrical signals through dendrites, processes them in the cell body, and fires an output signal through its axon if the combined input exceeds a threshold. Artificial neurons follow a similar pattern, but the analogy should not be taken too literally — modern neural networks are best understood as mathematical optimization machines.

### The Perceptron

The simplest neural network is a single neuron called a **perceptron**:

\`\`\`
output = activation(w1*x1 + w2*x2 + ... + wn*xn + b)
\`\`\`

Where:
- \`x1, x2, ..., xn\` are the inputs
- \`w1, w2, ..., wn\` are the weights (learnable parameters)
- \`b\` is the bias (also learnable)
- \`activation\` is a non-linear function

### Activation Functions

Without activation functions, stacking layers would just produce another linear function. Activation functions introduce **non-linearity**, allowing the network to learn complex patterns.

| Function | Formula | Range | Use Case |
|----------|---------|-------|----------|
| ReLU | \`max(0, x)\` | [0, inf) | Most hidden layers |
| Tanh | \`(e^x - e^-x)/(e^x + e^-x)\` | (-1, 1) | Micrograd default |
| Sigmoid | \`1/(1 + e^-x)\` | (0, 1) | Binary classification |

### Why "From Scratch"?

In this course, we will not start by importing PyTorch and calling \`nn.Linear\`. Instead, following Karpathy's philosophy, we build everything from the ground up. You will implement:

1. A \`Value\` class that tracks computations and gradients
2. Neurons, layers, and full MLPs using that \`Value\` class
3. A training loop with backpropagation and gradient descent

This approach gives you a **deep, intuitive understanding** of what frameworks like PyTorch are doing under the hood. When you later use \`loss.backward()\` in PyTorch, you will know exactly what it means.

### The Computation Graph

Every neural network computation can be visualized as a **directed acyclic graph (DAG)**. Each node is either an input value or the result of an operation. Edges represent data flow. This graph is the key data structure that enables automatic differentiation.

\`\`\`
x1 --(*w1)--> [+] ---> [tanh] ---> output
x2 --(*w2)--/   ^
                 |
                 b
\`\`\`

### What You Will Build

By the end of this module, you will have a working **micrograd** library: a tiny autograd engine (about 100 lines of Python) that can train a multi-layer perceptron. It is small enough to understand completely, yet powerful enough to demonstrate every core concept in deep learning.

### Key Takeaway

Neural networks are differentiable programs. The magic is not in any single neuron — it is in the ability to compute gradients through the entire computation graph and adjust parameters to minimize a loss function. That process is called **backpropagation**, and we will build it from scratch.`,
    },
    {
      id: "nn-micrograd-value-class",
      slug: "building-value-class",
      title: "Building a Value Class",
      content: `## Building a Value Class

The \`Value\` class is the atom of our autograd engine. Every number in the computation becomes a \`Value\` object that remembers how it was created and can compute its own gradient.

### The Core Idea

We need each value to track:
1. **The data** — the actual floating point number
2. **The gradient** — how much the final output changes when this value changes (initialized to 0)
3. **The children** — which values were combined to produce this one
4. **The operation** — what operation produced this value (+, *, tanh, etc.)
5. **The backward function** — how to propagate gradients backward through this operation

### Forward Pass

The forward pass is simply doing the math. When you write \`c = a + b\`, we create a new \`Value\` for \`c\` that stores the result and remembers that it came from adding \`a\` and \`b\`.

\`\`\`python
class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __repr__(self):
        return f"Value(data=\{self.data})"

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
\`\`\`

### Why \`+=\` for Gradients?

Notice we use \`+=\` not \`=\` when accumulating gradients. This is critical: a value might be used in multiple operations. If \`a\` contributes to both \`c = a + b\` and \`d = a * e\`, the gradient must be the **sum** of both contributions. This follows directly from the multivariable chain rule.

### The Computation Graph

Every time you perform an operation, you extend the computation graph:

\`\`\`python
a = Value(2.0)
b = Value(-3.0)
c = Value(10.0)
d = a * b + c   # d = (2.0 * -3.0) + 10.0 = 4.0
\`\`\`

This creates a tree: \`d\` has children \`(a*b)\` and \`c\`, and \`(a*b)\` has children \`a\` and \`b\`. The backward pass will traverse this tree in reverse to compute all gradients.

### Adding More Operations

We also need power, negation, subtraction, division, and activation functions:

\`\`\`python
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
\`\`\`

### Adding Tanh Activation

\`\`\`python
import math

def tanh(self):
    x = self.data
    t = (math.exp(2*x) - 1) / (math.exp(2*x) + 1)
    out = Value(t, (self,), 'tanh')

    def _backward():
        self.grad += (1 - t**2) * out.grad
    out._backward = _backward
    return out
\`\`\`

The derivative of tanh is \`1 - tanh(x)^2\`, which is elegantly simple.

### Key Takeaway

The \`Value\` class is a wrapper around a float that builds a computation graph as you do math. Each operation stores a \`_backward\` function that knows how to compute local gradients. In the next lesson, we will connect all these \`_backward\` calls together via topological sort to implement full backpropagation.`,
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

Backpropagation is the algorithm that computes gradients for every parameter in a neural network. It is simply the **chain rule from calculus**, applied systematically through a computation graph.

### The Chain Rule

If \`y = f(g(x))\`, then:

\`\`\`
dy/dx = dy/dg * dg/dx
\`\`\`

In a computation graph, each node knows its **local gradient** (how its output changes with respect to its inputs). Backpropagation chains these local gradients together to get the **global gradient** (how the final loss changes with respect to any value in the graph).

### Topological Sort

To propagate gradients correctly, we must visit nodes in **reverse topological order** — that is, we process a node only after all nodes that depend on it have been processed.

\`\`\`python
def backward(self):
    # Build topological order
    topo = []
    visited = set()

    def build_topo(v):
        if v not in visited:
            visited.add(v)
            for child in v._prev:
                build_topo(child)
            topo.append(v)

    build_topo(self)

    # Go one variable at a time and apply chain rule
    self.grad = 1.0  # d(self)/d(self) = 1
    for v in reversed(topo):
        v._backward()
\`\`\`

### Step-by-Step Example

Consider this computation:

\`\`\`python
a = Value(2.0)
b = Value(-3.0)
c = a * b       # c = -6.0
d = Value(10.0)
e = c + d       # e = 4.0
f = Value(-2.0)
L = e * f       # L = -8.0
\`\`\`

Starting from \`L\`:

1. \`L.grad = 1.0\` (base case)
2. \`e.grad = f.data * L.grad = -2.0 * 1.0 = -2.0\`
3. \`f.grad = e.data * L.grad = 4.0 * 1.0 = 4.0\`
4. \`c.grad = 1.0 * e.grad = -2.0\` (addition passes gradient through)
5. \`d.grad = 1.0 * e.grad = -2.0\`
6. \`a.grad = b.data * c.grad = -3.0 * -2.0 = 6.0\`
7. \`b.grad = a.data * c.grad = 2.0 * -2.0 = -4.0\`

### Gradient Accumulation

A critical subtlety: when a variable is used more than once, gradients **accumulate** (add up). This is because the total effect of changing that variable is the sum of its effects through all paths.

\`\`\`python
a = Value(3.0)
b = a + a  # a is used twice!
b.backward()
print(a.grad)  # 2.0, not 1.0!
\`\`\`

This is why we use \`+=\` in our backward functions, and why we must **zero gradients** before each new backward pass.

### Verifying with Numerical Gradients

You can always check your analytical gradients against **numerical gradients** using the definition of a derivative:

\`\`\`python
def numerical_gradient(func, x, h=1e-5):
    return (func(x + h) - func(x - h)) / (2 * h)
\`\`\`

If your analytical gradient matches the numerical gradient to about 5 decimal places, your implementation is correct. This is an essential debugging technique.

### The Full Picture

Backpropagation is:
1. **Forward pass** — compute the output (loss)
2. **Set output gradient to 1.0** — because dL/dL = 1
3. **Reverse topological order** — visit each node from output to inputs
4. **Apply chain rule locally** — each node pushes gradients to its children

This is all that PyTorch's \`loss.backward()\` does. It topologically sorts the computation graph and calls the backward function of each operation in reverse order.

### Key Takeaway

Backpropagation is not magic. It is a recursive application of the chain rule, organized by topological sort. Every deep learning framework — PyTorch, TensorFlow, JAX — implements this same algorithm. By building it yourself, you now understand it at its deepest level.`,
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

With our \`Value\` class and backpropagation engine in place, we can now build actual neural network components. We will go from a single neuron up to a full multi-layer perceptron (MLP).

### The Neuron Class

A neuron takes \`n\` inputs, multiplies each by a weight, adds a bias, and applies an activation function:

\`\`\`python
import random

class Neuron:
    def __init__(self, nin):
        self.w = [Value(random.uniform(-1, 1)) for _ in range(nin)]
        self.b = Value(random.uniform(-1, 1))

    def __call__(self, x):
        # w * x + b
        act = sum((wi * xi for wi, xi in zip(self.w, x)), self.b)
        out = act.tanh()
        return out

    def parameters(self):
        return self.w + [self.b]
\`\`\`

The \`__call__\` method lets us use a neuron like a function: \`neuron(inputs)\`. The \`parameters()\` method returns all learnable values — this is essential for the training loop.

### The Layer Class

A layer is simply a collection of neurons that all receive the same input:

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

A \`Layer(3, 4)\` creates 4 neurons, each expecting 3 inputs. When called, it returns 4 outputs (or a single \`Value\` if there is only one neuron — a convenience for the output layer).

### The MLP Class

A multi-layer perceptron chains layers together. The output of one layer becomes the input of the next:

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

The \`nouts\` argument is a list of layer sizes. For example, \`MLP(3, [4, 4, 1])\` creates:
- Layer 1: 3 inputs, 4 outputs
- Layer 2: 4 inputs, 4 outputs
- Layer 3: 4 inputs, 1 output (the final prediction)

### Counting Parameters

\`\`\`python
model = MLP(3, [4, 4, 1])
print(f"Number of parameters: {len(model.parameters())}")
# Layer 1: 4 neurons * (3 weights + 1 bias) = 16
# Layer 2: 4 neurons * (4 weights + 1 bias) = 20
# Layer 3: 1 neuron * (4 weights + 1 bias) = 5
# Total: 41 parameters
\`\`\`

Modern GPT models have billions of parameters, but the structure is the same — just more layers, more neurons, and different activation functions.

### Testing the Forward Pass

\`\`\`python
x = [Value(1.0), Value(2.0), Value(3.0)]
model = MLP(3, [4, 4, 1])
output = model(x)
print(output)  # A Value between -1 and 1 (due to tanh)
\`\`\`

The output is a single \`Value\` object, fully connected to the computation graph. Calling \`output.backward()\` will compute gradients for all 41 parameters.

### The Object-Oriented Design Pattern

Notice the pattern each class follows:
1. \`__init__\` — create parameters (random weights and biases)
2. \`__call__\` — define the forward pass (how inputs map to outputs)
3. \`parameters()\` — return all learnable parameters

This is exactly the pattern that PyTorch's \`nn.Module\` follows. When you later write \`class MyModel(nn.Module)\`, you will define \`__init__\` and \`forward\` (PyTorch's version of \`__call__\`), and \`parameters()\` is provided automatically.

### Key Takeaway

A neural network is just nested function composition. A neuron is a weighted sum plus activation. A layer is a collection of neurons. An MLP is a stack of layers. All built on our \`Value\` class, which tracks everything needed for backpropagation.`,
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

We have the forward pass (compute predictions) and backward pass (compute gradients). The training loop ties them together: forward, backward, update, repeat.

### The Goal: Minimize Loss

A **loss function** measures how wrong our predictions are. For regression-like tasks, we often use **mean squared error (MSE)**:

\`\`\`
L = (1/n) * sum((y_predicted - y_actual)^2)
\`\`\`

The training loop repeatedly adjusts parameters to make this loss smaller.

### A Simple Dataset

\`\`\`python
# 4 examples, each with 3 features
xs = [
    [2.0, 3.0, -1.0],
    [3.0, -1.0, 0.5],
    [0.5, 1.0, 1.0],
    [1.0, 1.0, -1.0],
]
ys = [1.0, -1.0, -1.0, 1.0]  # desired targets
\`\`\`

### The Training Loop

\`\`\`python
model = MLP(3, [4, 4, 1])

for step in range(100):
    # Forward pass
    ypred = [model(x) for x in xs]
    loss = sum((yout - ygt)**2 for ygt, yout in zip(ys, ypred))

    # Backward pass
    # First, zero all gradients
    for p in model.parameters():
        p.grad = 0.0
    loss.backward()

    # Update (gradient descent)
    learning_rate = 0.05
    for p in model.parameters():
        p.data += -learning_rate * p.grad

    if step % 10 == 0:
        print(f"Step {step}, Loss: {loss.data:.4f}")
\`\`\`

### The Three Critical Steps

**1. Forward Pass** — Run each input through the model to get predictions. Compute the loss.

**2. Backward Pass** — Call \`loss.backward()\` to compute gradients. But first, you **must zero all gradients**. Since our \`Value\` class uses \`+=\`, gradients from the previous step would accumulate incorrectly.

**3. Parameter Update** — Nudge each parameter in the direction that reduces the loss:
\`\`\`
parameter -= learning_rate * gradient
\`\`\`

The negative sign is because the gradient points in the direction of steepest **increase**. We want to go downhill.

### Learning Rate

The **learning rate** controls how big each update step is:

| Learning Rate | Effect |
|--------------|--------|
| Too large (1.0) | Loss oscillates wildly, training diverges |
| Too small (0.0001) | Loss decreases extremely slowly |
| Just right (0.01-0.1) | Steady decrease in loss |

Finding the right learning rate is one of the most important hyperparameters. A common strategy is to start with a moderate value and decay it over time:

\`\`\`python
learning_rate = 0.1 - 0.09 * (step / max_steps)
\`\`\`

### Watching the Loss

A healthy training curve shows the loss decreasing smoothly:

\`\`\`
Step 0,  Loss: 5.3421
Step 10, Loss: 1.2873
Step 20, Loss: 0.4152
Step 30, Loss: 0.1203
Step 40, Loss: 0.0341
\`\`\`

If the loss plateaus, try a larger learning rate. If it explodes, try a smaller one. If it oscillates, you might have a bug in gradient computation.

### Checking Predictions

After training, inspect the model's outputs:

\`\`\`python
for x, y in zip(xs, ys):
    pred = model(x)
    print(f"Target: {y}, Predicted: {pred.data:.4f}")
\`\`\`

You should see predictions close to the targets (e.g., 0.98 instead of 1.0, -0.97 instead of -1.0).

### What We Built

Congratulations — you have just trained a neural network **entirely from scratch**. No PyTorch, no TensorFlow, no libraries. Just:
- A \`Value\` class (autograd engine)
- A \`Neuron\`, \`Layer\`, \`MLP\` (network architecture)
- A training loop (forward, backward, update)

This is the foundation of ALL deep learning. Everything else — convolutional networks, transformers, diffusion models — follows this same pattern with more sophisticated architectures and larger datasets.

### Key Takeaway

The training loop is embarrassingly simple: predict, compute loss, compute gradients, update parameters. The complexity of deep learning comes from the architectures (what we compute in the forward pass) and the scale (billions of parameters, terabytes of data), not from the training algorithm itself.`,
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
