import { Module } from "../types";

export const numpyFoundationsModule: Module = {
  id: "numpy-foundations",
  title: "NumPy Foundations for ML",
  description: "Master NumPy arrays, vectorized operations, broadcasting, and linear algebra primitives that underpin every ML algorithm in this course.",
  lessons: [
    {
      id: "why-numpy",
      slug: "why-numpy",
      title: "Why NumPy? Vectors, Matrices, and Speed",
      content: `# Why NumPy? Vectors, Matrices, and Speed

Every ML algorithm you will build in this course — linear regression, neural networks, CNNs — reduces to one thing: **large-scale arithmetic on arrays of numbers**. The question is not *whether* you need that arithmetic, but *how fast* you can do it.

Pure Python is honest but slow. A neural network forward pass on a 10,000-sample dataset using Python \`for\` loops takes seconds. The same operation in NumPy takes milliseconds. That 100× gap is not a coincidence — it is architecture.

This lesson explains why.

---

## The Problem with Pure Python

Python lists are general-purpose. Each element is a Python object with its own type tag, reference count, and heap allocation. When you loop over a list of floats to compute a dot product, Python's interpreter is doing far more work per number than just multiplying:

\`\`\`python
# Pure Python dot product — slow path
a = [1.0, 2.0, 3.0]
b = [4.0, 5.0, 6.0]
dot = sum(x * y for x, y in zip(a, b))
\`\`\`

For 1,000 numbers this is fine. For a weight matrix in a neural network — 784 × 256 = 200,704 multiplications — the interpreter overhead dominates.

\`\`\`concept
{ "title": "The Python Object Tax", "variant": "mental-model", "content": "Every Python list element is a full PyObject: 28 bytes minimum, scattered across the heap, requiring a pointer dereference to read. A NumPy float64 array of 1,000 elements is 8,000 bytes, contiguous, one cache line at a time. The 'tax' you pay for Python's flexibility is 3–5× memory and 10–100× latency for numerical work." }
\`\`\`

---

## ndarray: Memory in a Contiguous Block

NumPy's \`ndarray\` is the antidote. It stores all elements of a **single fixed type** in one contiguous block of memory. The array object itself is just a thin Python wrapper holding metadata; the data lives in a C-allocated buffer.

\`\`\`sysdiag
{ "title": "ndarray Memory Layout", "width": 620, "height": 300,
  "nodes": [
    { "id": "wrapper", "label": "ndarray\\n(Python)", "x": 90, "y": 150, "kind": "service" },
    { "id": "meta", "label": "Metadata\\nshape / dtype / strides", "x": 270, "y": 80, "kind": "store" },
    { "id": "buf", "label": "Data Buffer\\n[f64][f64][f64]...", "x": 270, "y": 220, "kind": "store" },
    { "id": "cpu", "label": "CPU Cache", "x": 470, "y": 220, "kind": "external" }
  ],
  "edges": [
    { "from": "wrapper", "to": "meta", "label": "points to" },
    { "from": "wrapper", "to": "buf", "label": "points to" },
    { "from": "buf", "to": "cpu", "label": "loaded in one shot" }
  ],
  "annotations": {
    "wrapper": "Thin Python object — holds shape, dtype, and a pointer to the real data. Almost zero overhead.",
    "meta": "shape=(3,4), dtype=float64, strides=(32,8) — describes how to navigate the buffer.",
    "buf": "Raw C memory: contiguous, homogeneous. No boxing, no pointer chasing, cache-friendly.",
    "cpu": "Modern CPUs load 64-byte cache lines. A contiguous float64 array fills 8 values per line."
  }
}
\`\`\`

The critical property: because every element has the **same byte width**, the CPU can predict addresses, prefetch data, and apply SIMD instructions — processing multiple values in a single CPU instruction cycle.

---

## Trace: What Happens During a Loop vs. Vectorized Add

Watch the interpreter's work when you add two arrays element-by-element in Python versus letting NumPy do it in C:

\`\`\`trace
{ "title": "Python loop vs NumPy vectorized add", "language": "python",
  "code": "import numpy as np\\n\\n# --- Python loop ---\\na_list = [1.0, 2.0, 3.0, 4.0]\\nb_list = [10.0, 20.0, 30.0, 40.0]\\n\\nresult_list = []\\nfor i in range(len(a_list)):\\n    result_list.append(a_list[i] + b_list[i])\\n\\n# --- NumPy vectorized ---\\na = np.array([1.0, 2.0, 3.0, 4.0])\\nb = np.array([10.0, 20.0, 30.0, 40.0])\\n\\nresult = a + b\\nprint(result)",
  "frames": [
    { "line": 4, "vars": { "a_list": "[1.0, 2.0, 3.0, 4.0]", "b_list": "[10.0, 20.0, 30.0, 40.0]" }, "note": "Python list: each number is a heap-allocated PyFloat object." },
    { "line": 7, "vars": { "result_list": "[]", "i": "—" }, "note": "Start Python loop — interpreter enters bytecode LOAD, BINARY_ADD, CALL cycle per iteration." },
    { "line": 9, "vars": { "i": 0, "result_list": "[11.0]" }, "note": "Iteration 0: unbox a_list[0], unbox b_list[0], C add, rebox result, append. ~20 Python ops." },
    { "line": 9, "vars": { "i": 1, "result_list": "[11.0, 22.0]" }, "note": "Iteration 1: same 20 Python ops again. Every element pays this tax." },
    { "line": 9, "vars": { "i": 3, "result_list": "[11.0, 22.0, 33.0, 44.0]" }, "note": "Loop done. 4 elements × ~20 Python ops = 80 interpreter steps total." },
    { "line": 13, "vars": { "a": "ndarray([1,2,3,4])", "b": "ndarray([10,20,30,40])" }, "note": "NumPy arrays created. Data lives in C buffer — no Python boxing." },
    { "line": 16, "vars": { "result": "ndarray([11,22,33,44])" }, "note": "a + b calls numpy's C-compiled add ufunc. ALL 4 additions happen inside one C function call — 1 Python dispatch, not 4.", "stdout": "[11. 22. 33. 44.]" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "What is a ufunc?", "content": "NumPy's universal functions (ufuncs) are C-compiled loops that operate element-wise on entire arrays. \`a + b\`, \`np.sqrt(a)\`, \`np.exp(a)\` are all ufuncs. The loop runs in C at CPU speed — Python never touches individual elements." }
\`\`\`

---

## Live Benchmark: Measure the Speedup Yourself

\`\`\`playground
{ "title": "Python list vs NumPy — speed benchmark", "language": "python", "runnable": true,
  "code": "import numpy as np\\nimport time\\n\\nN = 1_000_000\\n\\n# Build data\\npy_a = list(range(N))\\npy_b = list(range(N))\\nnp_a = np.arange(N, dtype=np.float64)\\nnp_b = np.arange(N, dtype=np.float64)\\n\\n# Time Python loop\\nstart = time.perf_counter()\\nresult_py = [py_a[i] + py_b[i] for i in range(N)]\\npy_time = time.perf_counter() - start\\n\\n# Time NumPy\\nstart = time.perf_counter()\\nresult_np = np_a + np_b\\nnp_time = time.perf_counter() - start\\n\\nprint(f'Python list loop : {py_time*1000:.1f} ms')\\nprint(f'NumPy vectorized : {np_time*1000:.2f} ms')\\nprint(f'Speedup          : {py_time/np_time:.0f}x')\\nprint(f'First 5 results match: {result_py[:5] == list(result_np[:5])}')\\n" }
\`\`\`

You should see roughly **50–200× speedup** depending on the machine. On a typical laptop the Python loop runs in ~150 ms; NumPy finishes in under 2 ms. This gap widens with more complex operations.

---

## The dtype System

Every NumPy array has exactly one **dtype** (data type). This is not a Python runtime decision made per element — it is fixed when the array is created and applies uniformly to all values in the buffer.

\`\`\`tabs
{ "tabs": [
  { "label": "Common dtypes", "icon": "📊", "content": "| dtype | Bytes | Range / Precision | ML use |\\n|-------|-------|-------------------|--------|\\n| \`float64\` | 8 | ~15 decimal digits | Default for weights, gradients |\\n| \`float32\` | 4 | ~7 decimal digits | GPU training, saves 2× memory |\\n| \`float16\` | 2 | ~3 decimal digits | Mixed-precision training |\\n| \`int32\` | 4 | −2B to 2B | Class labels, indices |\\n| \`int64\` | 8 | −9.2×10¹⁸ to 9.2×10¹⁸ | Large index arrays |\\n| \`bool\` | 1 | True / False | Masks, comparisons |" },
  { "label": "Inspecting dtypes", "icon": "🔍", "content": "\`\`\`python\\nimport numpy as np\\n\\na = np.array([1.0, 2.0, 3.0])          # float64 by default\\nb = np.array([1.0, 2.0, 3.0], dtype=np.float32)\\nc = np.array([1, 2, 3])                # int64 by default\\n\\nprint(a.dtype)    # float64\\nprint(b.dtype)    # float32\\nprint(c.dtype)    # int64\\n\\n# Memory used\\nprint(a.nbytes)   # 24 bytes  (3 × 8)\\nprint(b.nbytes)   # 12 bytes  (3 × 4)\\n\`\`\`" },
  { "label": "dtype pitfalls", "icon": "⚠️", "content": "**Overflow without warning:**\\n\`\`\`python\\nimport numpy as np\\n\\nx = np.array([200], dtype=np.int8)   # int8 max = 127\\nx += 100\\nprint(x)  # [-44]  — silent overflow!\\n\`\`\`\\n\\n**Precision loss:**\\n\`\`\`python\\nimport numpy as np\\n\\na = np.array([1.0000001], dtype=np.float16)\\nprint(a)  # [1.0]  — precision silently lost\\n\`\`\`\\n\\n**Always** check dtypes when results look wrong." }
] }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The int/float trap in ML", "content": "If you create a weight array with integer values — \`np.array([1, 2, 3])\` — NumPy defaults to \`int64\`. Dividing integers by integers in NumPy gives integers. Your gradients will be zero. Always explicitly pass \`dtype=np.float64\` (or \`float32\`) for ML computations." }
\`\`\`

---

## Visualizing the ndarray Shape

Before we can do ML, we need to think in shapes. A vector is 1-D, a matrix is 2-D, a batch of images is 4-D. NumPy represents all of these as \`ndarray\` with different \`shape\` tuples.

\`\`\`algoviz
{ "title": "From scalar → vector → matrix", "type": "array",
  "data": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
  "frames": [
    { "highlight": [0], "label": "Scalar: shape=(). A single number — 0 dimensions.", "stats": { "shape": "( )", "ndim": 0 } },
    { "highlight": [0, 1, 2], "label": "Vector: shape=(3,). 1-D array — a row of 3 features.", "stats": { "shape": "(3,)", "ndim": 1 } },
    { "highlight": [0, 1, 2, 3, 4, 5], "label": "Matrix: shape=(2,3). 2 rows × 3 cols — 2 training samples, 3 features each.", "stats": { "shape": "(2,3)", "ndim": 2 } },
    { "highlight": [0, 1, 2], "label": "Row 0 of matrix: np.array([[1,2,3],[4,5,6]])[0] → [1,2,3]", "stats": { "row": 0, "values": "[1,2,3]" } },
    { "highlight": [3, 4, 5], "label": "Row 1 of matrix: np.array([[1,2,3],[4,5,6]])[1] → [4,5,6]", "stats": { "row": 1, "values": "[4,5,6]" } }
  ],
  "speed": 900
}
\`\`\`

In ML you will constantly track shapes to catch bugs early. A weight matrix for a layer that maps 784 inputs → 256 outputs has shape \`(784, 256)\`. A batch of 32 samples has shape \`(32, 784)\`. Matrix multiplication \`X @ W\` requires the inner dimensions to match: \`(32, 784) @ (784, 256) = (32, 256)\`.

---

## The * vs @ Trap

This is one of the most common NumPy mistakes. The \`*\` operator does **element-wise** multiplication. ML matrix multiplication requires the \`@\` operator or \`np.dot()\`.

\`\`\`compare
{ "variant": "good-bad",
  "before": { "label": "Wrong: * is element-wise", "code": "import numpy as np\\n\\nX = np.array([[1, 2], [3, 4]])   # shape (2,2)\\nW = np.array([[5, 6], [7, 8]])   # shape (2,2)\\n\\n# This is NOT matrix multiplication!\\nresult = X * W\\n# [[1*5, 2*6],   →  [[ 5, 12],\\n#  [3*7, 4*8]]   →   [21, 32]]\\nprint(result)" },
  "after": { "label": "Correct: @ is matrix multiplication", "code": "import numpy as np\\n\\nX = np.array([[1, 2], [3, 4]])   # shape (2,2)\\nW = np.array([[5, 6], [7, 8]])   # shape (2,2)\\n\\n# This IS matrix multiplication (dot product)\\nresult = X @ W\\n# [[1*5+2*7, 1*6+2*8],  →  [[19, 22],\\n#  [3*5+4*7, 3*6+4*8]]  →   [43, 50]]\\nprint(result)\\n\\n# np.dot(X, W) is equivalent\\nprint(np.dot(X, W))" }
}
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Build your first ndarray correctly", "prompt": "Create a 1-D NumPy array of five float64 zeros, check its dtype, then replace element at index 2 with 9.9. Fill the blanks.", "language": "python",
  "template": "import numpy as np\\n\\n# Create array of five float64 zeros\\narr = np.___((5,), dtype=np.___)\\n\\n# Check dtype and shape\\nprint(arr.dtype)   # float64\\nprint(arr.___)     # (5,)\\n\\n# Set the middle element\\narr[___] = 9.9\\nprint(arr)         # [0.  0.  9.9  0.  0.]",
  "blanks": [
    { "answer": "zeros", "hint": "NumPy function that fills an array with 0.0 values" },
    { "answer": "float64", "hint": "The 64-bit floating point dtype, default for ML weights" },
    { "answer": "shape", "hint": "The attribute that returns the dimension tuple, e.g. (5,)" },
    { "answer": "2", "hint": "Zero-indexed: 0,1,2,3,4 — middle of 5 elements is index 2" }
  ]
}
\`\`\`

---

## The ML Ecosystem Is Built on ndarray

NumPy is not just fast — it is the **lingua franca** of Python's scientific stack. Every major ML library speaks ndarray:

| Library | How it uses NumPy |
|---------|------------------|
| **Pandas** | DataFrame columns are backed by ndarrays |
| **Scikit-learn** | All inputs/outputs are ndarrays |
| **Matplotlib** | Plots data directly from ndarrays |
| **TensorFlow** | Tensors are inter-convertible with ndarrays via \`.numpy()\` |
| **PyTorch** | \`torch.Tensor\` shares memory with ndarray via zero-copy \`.numpy()\` |

When you learn NumPy, you are learning the data representation that every ML framework understands.

\`\`\`collapse
{ "title": "Deep Dive: Views vs Copies — The Hidden Gotcha", "content": "NumPy avoids memory copies whenever possible for performance. This means many operations return a **view** — a new array object that points to the **same memory** as the original.\\n\\n\`\`\`python\\nimport numpy as np\\n\\na = np.array([1, 2, 3, 4, 5])\\nb = a[1:4]   # b is a VIEW, not a copy\\n\\nb[0] = 99\\nprint(a)     # [1, 99, 3, 4, 5]  — a was modified!\\n\`\`\`\\n\\nThis is great for performance but can cause subtle bugs in ML pipelines where you assume arrays are independent.\\n\\n**Force a copy when you need independence:**\\n\`\`\`python\\nb = a[1:4].copy()   # now b is independent\\nb[0] = 99\\nprint(a)            # [1, 2, 3, 4, 5]  — unchanged\\n\`\`\`\\n\\n**Check if an array is a view:**\\n\`\`\`python\\nprint(b.base is a)   # True = view, False = copy\\n\`\`\`\\n\\nIn gradient computations, accidentally sharing memory between your input and output arrays will corrupt your backprop. Always \`.copy()\` when in doubt." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "NumPy Fundamentals Quiz",
  "questions": [
    {
      "question": "Why are NumPy array operations significantly faster than equivalent Python list loops for numerical computations?",
      "options": [
        "NumPy runs on the GPU by default",
        "NumPy operations are implemented in optimized C/Fortran code and operate on contiguous, homogeneously-typed memory, bypassing Python interpreter overhead",
        "NumPy uses multiple CPU cores automatically for all operations",
        "Python lists use linked-list storage which is inherently slow"
      ],
      "answer": 1,
      "explanation": "NumPy's speed comes from two complementary sources: (1) its core ufuncs are compiled C/Fortran code with no Python interpreter overhead per element, and (2) contiguous homogeneous memory allows CPU cache prefetching and SIMD instructions. It does not use the GPU by default, nor does it automatically multithread most operations."
    },
    {
      "question": "You write \`W = np.array([[1,2],[3,4]]) * np.array([[5,6],[7,8]])\`. What does W contain?",
      "options": [
        "[[19, 22], [43, 50]] — the matrix product",
        "[[5, 12], [21, 32]] — element-wise multiplication",
        "A shape error, because * is undefined for 2-D arrays",
        "[[6, 8], [10, 12]] — element-wise addition"
      ],
      "answer": 1,
      "explanation": "In NumPy, * always performs element-wise multiplication: each position (i,j) of the result equals W1[i,j] * W2[i,j]. For matrix multiplication (the linear algebra operation), you must use the @ operator or np.dot()."
    },
    {
      "question": "You create \`arr = np.array([200, 201, 202], dtype=np.int8)\` and then run \`arr += 100\`. What happens?",
      "options": [
        "NumPy raises an OverflowError",
        "NumPy automatically upcasts arr to int16 to prevent overflow",
        "The values silently overflow and wrap around, producing incorrect results",
        "The operation is blocked until you specify a safe dtype"
      ],
      "answer": 2,
      "explanation": "NumPy does NOT raise an error on integer overflow — it silently wraps around. int8 has a maximum value of 127, so 200+100=300 wraps to 300-256=44... and because 200 is itself out of range for int8 at creation, the actual stored values are already wrapped. This is a real source of hard-to-find bugs. Always choose dtypes carefully and check for unexpected values in results."
    },
    {
      "question": "Which of the following correctly creates a NumPy array suitable for storing ML model weights (floating point, 32-bit)?",
      "options": [
        "\`np.array([0.1, 0.2, 0.3])\`",
        "\`np.array([0.1, 0.2, 0.3], dtype=np.float32)\`",
        "\`np.array([0.1, 0.2, 0.3], dtype=np.int32)\`",
        "\`np.array([0.1, 0.2, 0.3], dtype='string')\`"
      ],
      "answer": 1,
      "explanation": "Option A defaults to float64, not float32. Option C uses int32 which would truncate decimal values to 0. Option D is invalid for ML weights. Option B explicitly specifies float32, which halves memory usage compared to float64 and is the standard dtype for GPU training in frameworks like PyTorch and TensorFlow."
    },
    {
      "question": "You do \`b = a[2:5]\` and then modify \`b[0] = 999\`. What effect does this have on \`a\`?",
      "options": [
        "No effect — slicing always creates an independent copy",
        "\`a[2]\` is also changed to 999, because slices return views sharing the same memory",
        "NumPy raises a ReadOnlyError on the original array",
        "Only \`b\` is affected, but \`a\` must be explicitly synchronized with \`a.update()\`"
      ],
      "answer": 1,
      "explanation": "NumPy slices return views, not copies, to maximize performance. A view shares the underlying data buffer with the original array. Modifying b[0] modifies a[2] as well. To get an independent copy, use \`b = a[2:5].copy()\`. This is a common source of bugs in ML code where you expect array independence."
    }
  ]
}
\`\`\`

---

## Putting It Together: Your First ML-Ready Array Operations

\`\`\`playground
{ "title": "ML array operations — shapes, dtypes, and matrix math", "language": "python", "runnable": true,
  "code": "import numpy as np\\n\\n# --- Represent a mini training dataset ---\\n# 4 samples, 3 features each\\nX = np.array([\\n    [0.1, 0.5, 0.9],\\n    [0.3, 0.7, 0.2],\\n    [0.8, 0.1, 0.4],\\n    [0.6, 0.3, 0.8],\\n], dtype=np.float64)\\n\\nprint('Dataset shape:', X.shape)    # (4, 3)\\nprint('dtype:', X.dtype)            # float64\\nprint('Total elements:', X.size)    # 12\\nprint('Memory (bytes):', X.nbytes)  # 96\\n\\n# --- A weight vector for 3 features → 1 output ---\\nW = np.array([0.2, -0.5, 0.8], dtype=np.float64)\\nprint('\\\\nWeight shape:', W.shape)   # (3,)\\n\\n# --- Matrix-vector product: linear layer forward pass ---\\n# X @ W = dot product of each sample with W\\npredictions = X @ W\\nprint('\\\\nPredictions (X @ W):', predictions)\\nprint('Predictions shape:', predictions.shape)  # (4,)\\n\\n# --- Vectorized activation: apply sigmoid to all predictions ---\\ndef sigmoid(z):\\n    return 1.0 / (1.0 + np.exp(-z))   # exp applied to whole array at once\\n\\nactivations = sigmoid(predictions)\\nprint('\\\\nActivations (sigmoid):', np.round(activations, 4))\\n\\n# --- Summary stats (no loop!) ---\\nprint('\\\\nMean activation:', activations.mean())\\nprint('Max activation:', activations.max())\\n" }
\`\`\`

This is the skeleton of a logistic regression forward pass — and it runs in microseconds on millions of samples because every operation is vectorized.

---

\`\`\`takeaways
{ "title": "Key Takeaways",
  "items": [
    "NumPy's ndarray stores homogeneous data in a contiguous C-allocated buffer — this enables CPU cache efficiency and SIMD acceleration, yielding 50–200× speedups over Python list loops.",
    "Vectorized operations (ufuncs like \`+\`, \`np.exp\`, \`np.dot\`) run inside compiled C/Fortran code — Python never touches individual elements.",
    "Every ndarray has a fixed dtype. Use \`float64\` or \`float32\` for ML weights; ignoring dtypes causes silent overflow, precision loss, and integer-division bugs.",
    "The \`*\` operator is element-wise multiplication. For matrix multiplication (the core of every neural network layer), always use \`@\` or \`np.dot()\`.",
    "NumPy slices return views sharing the original memory — modifying a view modifies the source. Use \`.copy()\` when you need independence.",
    "All major ML libraries — Scikit-learn, TensorFlow, PyTorch, Pandas — accept and return ndarrays. NumPy is the universal currency of Python ML."
  ]
}
\`\`\``,
      starterCode: `import numpy as np
import time

# Exercise: NumPy vs Pure Python Performance
# You'll compare the speed of pure Python loops vs NumPy operations
# and explore NumPy's dtype system and memory layout.

# ─── Part 1: Create NumPy arrays with specific dtypes ───────────────────────

# TODO 1: Create a 1D NumPy array of 1,000,000 elements filled with 1.0
# Use dtype=float64 (the default for floats)
vector = None  # replace with np.ones(...)

# TODO 2: Create a 2D NumPy array (matrix) of shape (1000, 1000) filled with 2
# Use dtype=int32 to save memory compared to int64
matrix = None  # replace with np.full(...)

# TODO 3: Print the dtype and shape of both arrays
# Expected: float64 / (1000000,)  and  int32 / (1000, 1000)
print("vector dtype:", )   # fill in
print("vector shape:", )   # fill in
print("matrix dtype:", )   # fill in
print("matrix shape:", )   # fill in


# ─── Part 2: Benchmark pure Python vs NumPy ──────────────────────────────────
# Task: compute the sum of squares of 1,000,000 numbers

data = list(range(1_000_000))        # Python list
data_np = np.arange(1_000_000, dtype=np.float64)  # NumPy array

# TODO 4: Time a pure Python sum-of-squares using a for loop
# Store the result in \`python_result\` and elapsed seconds in \`python_time\`
start = time.time()
python_result = 0
# for x in data:
#     ...
python_time = time.time() - start

# TODO 5: Time the NumPy equivalent using vectorised operations (no Python loop)
# Hint: square every element with ** or np.square(), then call .sum()
# Store result in \`numpy_result\` and elapsed seconds in \`numpy_time\`
start = time.time()
numpy_result = None  # replace with one NumPy expression
numpy_time = time.time() - start

# TODO 6: Print results and the speedup factor
print(f"\\nPython result : {python_result:.2f}  time: {python_time:.4f}s")
print(f"NumPy  result : {numpy_result:.2f}  time: {numpy_time:.4f}s")
# TODO: print speedup = python_time / numpy_time, rounded to 1 decimal place
print(f"Speedup: ???x")


# ─── Part 3: Memory layout insight ──────────────────────────────────────────

# TODO 7: Print the number of bytes consumed by \`data\` (Python list)
# Hint: use __sizeof__() — note this only measures the list object itself
print(f"\\nPython list size : {data.__sizeof__()} bytes (list object only)")

# TODO 8: Print the number of bytes consumed by \`data_np\`
# Hint: use the .nbytes attribute
print(f"NumPy array size : ???  bytes")
`,
      solutionCode: `import numpy as np
import time

# ─── Part 1: Create NumPy arrays with specific dtypes ───────────────────────

# 1M-element float64 vector
vector = np.ones(1_000_000, dtype=np.float64)

# 1000×1000 int32 matrix filled with 2
matrix = np.full((1000, 1000), 2, dtype=np.int32)

print("vector dtype:", vector.dtype)   # float64
print("vector shape:", vector.shape)   # (1000000,)
print("matrix dtype:", matrix.dtype)   # int32
print("matrix shape:", matrix.shape)   # (1000, 1000)


# ─── Part 2: Benchmark pure Python vs NumPy ──────────────────────────────────

data = list(range(1_000_000))
data_np = np.arange(1_000_000, dtype=np.float64)

# Pure Python: explicit loop — slow because of interpreter overhead per iteration
start = time.time()
python_result = 0
for x in data:
    python_result += x * x
python_time = time.time() - start

# NumPy: vectorised — entire operation runs in compiled C with contiguous memory
start = time.time()
numpy_result = (data_np ** 2).sum()   # or np.square(data_np).sum()
numpy_time = time.time() - start

print(f"\\nPython result : {python_result:.2f}  time: {python_time:.4f}s")
print(f"NumPy  result : {numpy_result:.2f}  time: {numpy_time:.4f}s")
speedup = python_time / numpy_time
print(f"Speedup: {speedup:.1f}x")   # typically 50x–200x


# ─── Part 3: Memory layout insight ──────────────────────────────────────────

# Python list: 8 bytes per *pointer* + overhead per int object (~28 bytes each)
# __sizeof__() reports only the list container, not the pointed-to objects
print(f"\\nPython list size : {data.__sizeof__()} bytes (list object only)")

# NumPy ndarray: 8 bytes per float64, stored contiguously — no per-element overhead
# 1_000_000 × 8 = 8,000,000 bytes (≈7.6 MB)
print(f"NumPy array size : {data_np.nbytes}  bytes")  # 8000000

# Key takeaways:
# 1. dtype controls element size — float64=8B, int32=4B, float32=4B, etc.
# 2. Contiguous C-order layout means the CPU prefetcher works efficiently.
# 3. No Python object overhead per element → far less memory than a Python list.
# 4. Vectorised ops skip the Python interpreter loop → 50–200× faster.
`,
    },
    {
      id: "array-creation-indexing",
      slug: "array-creation-indexing",
      title: "Array Creation, Indexing, and Slicing",
      content: `# Array Creation, Indexing, and Slicing

Every ML algorithm you will build in this course — linear regression, neural networks, CNNs — lives inside arrays. Weights are arrays. Training data is arrays. Gradients are arrays. Before you can build anything, you need to be able to **create**, **navigate**, and **extract** the exact data you need from NumPy arrays with surgical precision.

This lesson covers the full toolkit: creating arrays from scratch, reaching into them with indices, carving out slices, and selecting arbitrary subsets with fancy indexing and boolean masks.

---

## Why NumPy Arrays, Not Python Lists?

\`\`\`concept
{ "title": "NumPy Array vs Python List", "variant": "analogy", "content": "A Python list is like a filing cabinet where each drawer holds a different type of object — flexible but slow to search. A NumPy array is like a block of contiguous memory stamped with a single type — rigid but blazing fast. ML requires millions of arithmetic operations per second; only the array wins that race." }
\`\`\`

The key difference is **contiguous typed memory**. NumPy stores all elements side-by-side in RAM with a fixed type (e.g., \`float64\`), so operations run as compiled C loops — not slow Python loops. A vectorized operation on a 1 million-element array is typically **100–200× faster** than the equivalent Python for-loop.

---

## Part 1 — Creating Arrays

NumPy gives you several creation strategies. Picking the right one makes your code cleaner and your intent obvious.

\`\`\`tabs
{ "tabs": [
  { "label": "From Data", "icon": "📋", "content": "### \`np.array()\` — Wrap existing data\\n\\nThe most direct route: hand NumPy a Python list (or list of lists) and it builds the array.\\n\\n\`\`\`python\\nimport numpy as np\\n\\n# 1-D array\\na = np.array([1, 2, 3, 4, 5])\\nprint(a)        # [1 2 3 4 5]\\nprint(a.dtype)  # int64\\n\\n# 2-D array (matrix)\\nM = np.array([[1, 2, 3],\\n              [4, 5, 6]])\\nprint(M.shape)  # (2, 3) → 2 rows, 3 columns\\n\`\`\`\\n\\nNumPy infers dtype automatically. Force it with \`dtype=np.float64\` when you need precision." },
  { "label": "Ranges", "icon": "📏", "content": "### \`np.arange()\` and \`np.linspace()\`\\n\\n**\`np.arange(start, stop, step)\`** — Like Python's \`range()\` but returns an array.\\n\\n\`\`\`python\\nx = np.arange(0, 10, 2)   # [0 2 4 6 8]\\nt = np.arange(0.0, 1.0, 0.25)  # [0.   0.25 0.5  0.75]\\n\`\`\`\\n\\n**\`np.linspace(start, stop, num)\`** — Gives exactly \`num\` evenly-spaced values *including* both endpoints.\\n\\n\`\`\`python\\ngrid = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]\\n\`\`\`\\n\\n\`linspace\` is preferred when you need a fixed *count* (e.g., 100 evaluation points for plotting a loss curve). \`arange\` is preferred when you need a fixed *step*." },
  { "label": "Zeros / Ones", "icon": "🔢", "content": "### \`np.zeros()\`, \`np.ones()\`, \`np.full()\`\\n\\nInitialize arrays filled with a constant — the backbone of weight initialization.\\n\\n\`\`\`python\\nW = np.zeros((3, 4))      # 3×4 matrix of 0.0\\nb = np.ones(5)             # [1. 1. 1. 1. 1.]\\nsentinel = np.full((2, 2), 99)  # [[99 99] [99 99]]\\n\`\`\`\\n\\n**Why zeros?** Neural network biases are often initialized to zero.\\n**Why ones?** Identity scaling, batch normalization warm-start.\\n\\nThe argument is always a **shape tuple** — even for 1-D: \`np.zeros((5,))\` or simply \`np.zeros(5)\`." },
  { "label": "Random", "icon": "🎲", "content": "### \`np.random\` — Stochastic initialization\\n\\nWeights in neural networks must start *random* to break symmetry.\\n\\n\`\`\`python\\nrng = np.random.default_rng(seed=42)  # reproducible\\n\\n# Uniform [0, 1)\\nU = rng.random((3, 3))\\n\\n# Standard normal (mean=0, std=1)\\nN = rng.standard_normal((3, 3))\\n\\n# Integers\\nidx = rng.integers(0, 10, size=5)  # e.g. [7 2 1 5 3]\\n\`\`\`\\n\\nAlways set a **seed** in experiments so your results are reproducible. \`default_rng(seed)\` is the modern NumPy API — prefer it over the legacy \`np.random.seed()\`." }
] }
\`\`\`

### Run it yourself

\`\`\`playground
{ "title": "Array Creation Playground", "language": "python", "code": "import numpy as np\\n\\n# --- From data ---\\nscores = np.array([88, 92, 75, 100, 61], dtype=np.float64)\\nprint('scores:', scores)\\nprint('dtype:', scores.dtype, '| shape:', scores.shape)\\n\\n# --- arange vs linspace ---\\nsteps = np.arange(0, 1.1, 0.25)\\npoints = np.linspace(0, 1, 5)\\nprint('\\\\narange:', steps)\\nprint('linspace:', points)\\n\\n# --- Zeros and random ---\\nW = np.zeros((2, 3))\\nrng = np.random.default_rng(0)\\nW_init = rng.standard_normal((2, 3)) * 0.01  # tiny random weights\\nprint('\\\\nzero W:\\\\n', W)\\nprint('random W (scaled):\\\\n', W_init.round(4))", "runnable": true }
\`\`\`

---

## Part 2 — Array Anatomy

Before indexing, internalize these four attributes. They come up constantly when debugging shape mismatches in ML code.

| Attribute | What it tells you | Example |
|-----------|-------------------|---------|
| \`.ndim\` | Number of axes | \`2\` |
| \`.shape\` | Size along each axis | \`(3, 4)\` |
| \`.size\` | Total element count | \`12\` |
| \`.dtype\` | Element data type | \`float64\` |

\`\`\`callout
{ "type": "warning", "title": "Shape vs Size", "content": "\`.shape\` returns a tuple: \`(rows, cols)\`. \`.size\` returns a single integer: total elements = rows × cols. Beginners often confuse \`a.shape[0]\` (number of rows) with \`len(a)\` — they're equivalent for 1-D but not for 2-D arrays." }
\`\`\`

---

## Part 3 — Basic Indexing and Slicing

NumPy indexing mirrors Python lists for 1-D, and extends naturally to multiple dimensions.

### 1-D Indexing

\`\`\`python
a = np.array([10, 20, 30, 40, 50])
#              0   1   2   3   4   ← positive indices
#             -5  -4  -3  -2  -1   ← negative indices

print(a[0])    # 10  — first element
print(a[-1])   # 50  — last element
print(a[2])    # 30  — middle element
\`\`\`

### Slicing: \`start:stop:step\`

\`\`\`python
print(a[1:4])    # [20 30 40]  — indices 1, 2, 3 (stop is exclusive)
print(a[::2])    # [10 30 50]  — every other element
print(a[::-1])   # [50 40 30 20 10]  — reversed
\`\`\`

### 2-D Indexing: \`[row, col]\`

\`\`\`python
M = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

print(M[1, 2])    # 6   — row 1, col 2
print(M[0])       # [1 2 3]  — entire first row
print(M[:, 1])    # [2 5 8]  — entire second column
print(M[0:2, 1:]) # [[2 3] [5 6]]  — submatrix
\`\`\`

The \`:\` means "all elements along this axis" — you'll use \`M[:, j]\` constantly when extracting feature columns from a dataset.

### See it in action

\`\`\`algoviz
{ "title": "Slicing a[1:4] on a 1-D array", "type": "array", "data": [10, 20, 30, 40, 50], "frames": [
  { "highlight": [], "label": "Start: a = [10, 20, 30, 40, 50]", "stats": { "start": 0, "stop": 0, "step": 1 } },
  { "highlight": [1], "label": "start=1 → index 1 is the first included element", "stats": { "start": 1, "stop": 0, "step": 1 } },
  { "highlight": [1, 2], "label": "Include index 2", "stats": { "start": 1, "stop": 0, "step": 1 } },
  { "highlight": [1, 2, 3], "label": "Include index 3", "stats": { "start": 1, "stop": 4, "step": 1 } },
  { "highlight": [4], "label": "stop=4 → index 4 is EXCLUDED (stop is exclusive)", "stats": { "start": 1, "stop": 4, "step": 1 } },
  { "highlight": [1, 2, 3], "label": "Result: a[1:4] = [20, 30, 40]", "stats": { "start": 1, "stop": 4, "step": 1 } }
], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Slices are Views, Not Copies", "content": "In NumPy, \`b = a[1:4]\` does NOT copy data — \`b\` is a *view* into \`a\`'s memory. Modifying \`b\` modifies \`a\` too. This is intentional for performance (no copying large tensors), but it surprises beginners. Use \`b = a[1:4].copy()\` when you need independence." }
\`\`\`

---

## Part 4 — Fancy Indexing

When you need **non-contiguous** elements — pick rows 0, 2, 5 from a dataset, for example — slicing won't cut it. Fancy indexing lets you pass an **array of indices**.

\`\`\`python
a = np.array([10, 20, 30, 40, 50])

# Select specific indices
idx = np.array([0, 2, 4])
print(a[idx])   # [10 30 50]

# Works on 2-D: select specific rows
M = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])
rows = np.array([0, 2])
print(M[rows])  # [[1 2] [5 6]]

# Select specific (row, col) pairs
r = np.array([0, 1, 2])
c = np.array([1, 0, 1])
print(M[r, c])  # [2 3 6]  — M[0,1], M[1,0], M[2,1]
\`\`\`

**ML use case:** Shuffle your dataset and pick a random mini-batch:

\`\`\`python
rng = np.random.default_rng(42)
n_samples = X.shape[0]
batch_idx = rng.choice(n_samples, size=32, replace=False)
X_batch = X[batch_idx]   # fancy indexing — grab 32 random rows
y_batch = y[batch_idx]
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Fancy Indexing Always Copies", "content": "Unlike basic slices, fancy indexing (\`a[[0,2,4]]\`) always returns a **copy** — modifying the result never modifies the original. This is the opposite of slice views." }
\`\`\`

---

## Part 5 — Boolean Masks

Boolean masking is the most powerful selection tool in NumPy. A boolean mask is an array of \`True\`/\`False\` values the same shape as your data; \`True\` positions are kept.

\`\`\`python
a = np.array([15, -3, 42, 0, -7, 8])

# Create a mask
mask = a > 0
print(mask)   # [ True False  True False False  True]

# Apply the mask
print(a[mask])        # [15 42  8]

# One-liner
print(a[a > 0])       # [15 42  8]

# Compound conditions
print(a[(a > 0) & (a < 20)])   # [15  8]
\`\`\`

### Where masks shine in ML

| Task | One-liner |
|------|-----------|
| Filter outliers | \`X[X < 3 * X.std()]\` |
| Select a class from labels | \`X[y == 1]\` |
| Zero out negative activations (ReLU) | \`a[a < 0] = 0\` |
| Count positives | \`(y_pred > 0.5).sum()\` |

\`\`\`playground
{ "title": "Fancy Indexing + Boolean Masks", "language": "python", "code": "import numpy as np\\n\\nrng = np.random.default_rng(7)\\n\\n# Simulate 10 data points with labels\\nX = rng.standard_normal((10, 2)).round(2)  # 10 samples, 2 features\\ny = rng.integers(0, 2, size=10)            # binary labels: 0 or 1\\n\\nprint('All labels:', y)\\n\\n# --- Boolean mask: select class 1 samples ---\\nclass1_mask = (y == 1)\\nX_class1 = X[class1_mask]\\nprint(f'Class-1 samples ({class1_mask.sum()} total):')\\nprint(X_class1)\\n\\n# --- Fancy indexing: pick rows 0, 3, 7 ---\\nbatch_idx = np.array([0, 3, 7])\\nprint('\\\\nFancy-indexed mini-batch:')\\nprint(X[batch_idx])\\n\\n# --- Combine: first feature > 0 AND label == 1 ---\\ncombined = X[(X[:, 0] > 0) & (y == 1)]\\nprint('\\\\nFirst feature > 0 and class 1:')\\nprint(combined)", "runnable": true }
\`\`\`

---

## Trace: Step Through Boolean Masking

\`\`\`trace
{ "title": "Boolean mask: a[a > 0]", "language": "python", "code": "import numpy as np\\na = np.array([15, -3, 42, 0, -7, 8])\\nmask = a > 0\\nresult = a[mask]\\nprint(result)", "frames": [
  { "line": 2, "vars": {}, "note": "Import numpy", "stdout": "" },
  { "line": 3, "vars": { "a": "[15, -3, 42, 0, -7, 8]" }, "note": "Create array a with 6 elements", "stdout": "" },
  { "line": 4, "vars": { "a": "[15, -3, 42, 0, -7, 8]", "mask": "[T, F, T, F, F, T]" }, "note": "Compare each element to 0 — produces boolean array", "stdout": "" },
  { "line": 5, "vars": { "a": "[15, -3, 42, 0, -7, 8]", "mask": "[T, F, T, F, F, T]", "result": "[15, 42, 8]" }, "note": "Select elements where mask is True: indices 0, 2, 5", "stdout": "" },
  { "line": 6, "vars": { "result": "[15, 42, 8]" }, "note": "Print the filtered result", "stdout": "[15 42  8]" }
], "speed": 1000 }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Practice: Slicing and Masking", "prompt": "Complete the code to (1) extract every other row of matrix M, and (2) select all columns where the column sum exceeds 10.", "language": "python", "template": "import numpy as np\\nM = np.array([[1, 5, 3],\\n              [4, 2, 8],\\n              [7, 6, 9],\\n              [2, 1, 4]])\\n\\n# Every other row (0, 2)\\nevery_other = M[___]\\n\\n# Column sums\\ncol_sums = M.___\\n\\n# Columns where sum > 10\\nselected_cols = M[:, col_sums ___ 10]", "blanks": [
  { "answer": "::2", "hint": "Use slice notation start:stop:step — you want step=2 starting from the beginning" },
  { "answer": "sum(axis=0)", "hint": "Sum along axis 0 collapses rows — you get one value per column" },
  { "answer": ">", "hint": "Boolean comparison: keep columns whose sum is greater than 10" }
] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Array Creation, Indexing & Slicing", "questions": [
  {
    "question": "What does \`np.linspace(0, 1, 5)\` return?",
    "options": [
      "[0.0, 0.2, 0.4, 0.6, 0.8]",
      "[0.0, 0.25, 0.5, 0.75, 1.0]",
      "[0.0, 0.5, 1.0, 1.5, 2.0]",
      "[0.25, 0.5, 0.75, 1.0, 1.25]"
    ],
    "answer": 1,
    "explanation": "\`linspace(start, stop, num)\` returns \`num\` evenly-spaced values *including both endpoints*. With start=0, stop=1, and num=5, the step is (1-0)/(5-1)=0.25, giving [0.0, 0.25, 0.5, 0.75, 1.0]."
  },
  {
    "question": "Given \`a = np.array([10, 20, 30, 40, 50])\`, what does \`a[1:-1]\` return?",
    "options": [
      "[10, 20, 30, 40]",
      "[20, 30, 40]",
      "[20, 30, 40, 50]",
      "[10, 20, 30]"
    ],
    "answer": 1,
    "explanation": "\`a[1:-1]\` starts at index 1 (value 20) and stops *before* index -1 (which is index 4, value 50). So it returns elements at indices 1, 2, 3: [20, 30, 40]."
  },
  {
    "question": "Which statement about slices vs fancy indexing is TRUE?",
    "options": [
      "Both always return copies of the data",
      "Slices return views; fancy indexing returns copies",
      "Slices return copies; fancy indexing returns views",
      "Both always return views of the data"
    ],
    "answer": 1,
    "explanation": "Basic slices like \`a[1:4]\` return a *view* — modifying the slice modifies the original array. Fancy indexing like \`a[[0,2,4]]\` always returns a *copy* — the original is never affected."
  },
  {
    "question": "What does \`M[:, 0]\` select from a 2-D array M?",
    "options": [
      "The first row",
      "The last column",
      "The first column",
      "A scalar at position (0, 0)"
    ],
    "answer": 2,
    "explanation": "\`M[:, 0]\` means 'all rows (\`:\`) of column 0'. The comma separates row and column indices in 2-D NumPy indexing. This is how you extract a feature vector from a data matrix."
  },
  {
    "question": "You have labels \`y = np.array([0, 1, 0, 1, 1])\` and data \`X\` with shape \`(5, 3)\`. Which expression correctly selects all rows where the label is 1?",
    "options": [
      "X[y]",
      "X[y == 1]",
      "X[[1, 3, 4]]  # hardcoded",
      "X.filter(y == 1)"
    ],
    "answer": 1,
    "explanation": "\`y == 1\` produces a boolean mask \`[False, True, False, True, True]\`. Passing this mask to \`X[...]\` selects exactly the rows where the label is 1 — this is the standard ML pattern for class selection."
  }
] }
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Use np.array() for data you already have, np.arange()/np.linspace() for ranges, np.zeros()/np.ones() for initialized containers, and np.random.default_rng() for reproducible randomness.",
  "Slice notation [start:stop:step] works on any axis. For 2-D arrays, separate row and column indices with a comma: M[row_slice, col_slice].",
  "Slices return views (no copy); modifying a slice modifies the original. Use .copy() when you need independence.",
  "Fancy indexing (passing an array of indices) always returns a copy — essential for mini-batch sampling.",
  "Boolean masks (a[a > 0]) are the most expressive selection tool: combine conditions with & (and) and | (or), and use them to implement operations like ReLU or class filtering in a single line."
] }
\`\`\`

---

## What's Next

You can now create any array and extract exactly the data you need. In the next lesson, **Vectorized Operations and Broadcasting**, you'll see why all this matters for speed: instead of looping over elements, NumPy lets you apply operations to entire arrays at once — and broadcasting makes mismatched shapes work together automatically, which is how the forward pass of a neural network computes predictions for a whole batch in one shot.`,
      starterCode: `import numpy as np

# Exercise: Array Creation, Indexing, and Slicing
# Work through each TODO to practice core NumPy array skills.

# --- Part 1: Array Creation ---

# TODO 1: Create a 1D NumPy array from this list
temperatures = [22.5, 19.0, 25.3, 30.1, 17.8, 28.6, 21.4]
temp_array = None  # Replace with np.array(...)

# TODO 2: Create an array of integers from 0 to 19 (inclusive) using np.arange
indices = None  # Replace with np.arange(...)

# TODO 3: Create a 3x4 array of random floats between 0 and 1 (use np.random.rand)
matrix = None  # Replace with np.random.rand(...)

# --- Part 2: Basic Indexing & Slicing ---

# TODO 4: Get the first temperature value
first_temp = None  # temp_array[?]

# TODO 5: Get the last three temperatures using slicing
last_three = None  # temp_array[?]

# TODO 6: Get every other temperature (step slicing)
every_other = None  # temp_array[?]

# --- Part 3: Fancy Indexing ---

# TODO 7: Use a list of indices to select temperatures at positions 0, 2, and 5
picked = None  # temp_array[[?, ?, ?]]

# --- Part 4: Boolean Masking ---

# TODO 8: Create a boolean mask for temperatures above 25 degrees
hot_mask = None  # temp_array ? 25

# TODO 9: Use the mask to get only the hot temperatures
hot_temps = None  # temp_array[?]

# TODO 10: Count how many hot days there are (use .sum() on the mask)
hot_day_count = None  # hot_mask.?()

# --- Check your work ---
print("Temperature array:", temp_array)
print("Indices:", indices)
print("Random matrix shape:", matrix.shape if matrix is not None else None)
print("First temp:", first_temp)
print("Last three:", last_three)
print("Every other:", every_other)
print("Picked temps:", picked)
print("Hot mask:", hot_mask)
print("Hot temps:", hot_temps)
print("Hot day count:", hot_day_count)
`,
      solutionCode: `import numpy as np

# Exercise: Array Creation, Indexing, and Slicing — Solution

# --- Part 1: Array Creation ---

# Create a 1D NumPy array from a Python list
temperatures = [22.5, 19.0, 25.3, 30.1, 17.8, 28.6, 21.4]
temp_array = np.array(temperatures)

# np.arange(start, stop) produces [0, 1, 2, ..., 19]
indices = np.arange(0, 20)

# np.random.rand(rows, cols) fills with uniform random floats in [0, 1)
matrix = np.random.rand(3, 4)

# --- Part 2: Basic Indexing & Slicing ---

# Index 0 gives the first element
first_temp = temp_array[0]        # 22.5

# Slice [-3:] takes the last three elements
last_three = temp_array[-3:]      # [17.8, 28.6, 21.4]

# Step of 2 skips every other element
every_other = temp_array[::2]     # [22.5, 25.3, 17.8, 21.4]

# --- Part 3: Fancy Indexing ---

# Pass a list of integer positions — NumPy gathers those elements
picked = temp_array[[0, 2, 5]]    # [22.5, 25.3, 28.6]

# --- Part 4: Boolean Masking ---

# Comparison against an array returns a boolean array of the same shape
hot_mask = temp_array > 25        # [F, F, F, T, F, T, F]

# Indexing with a boolean mask keeps only True positions
hot_temps = temp_array[hot_mask]  # [30.1, 28.6]

# True is treated as 1 in arithmetic, so .sum() counts the True values
hot_day_count = hot_mask.sum()    # 2

# --- Output ---
print("Temperature array:", temp_array)
print("Indices:", indices)
print("Random matrix shape:", matrix.shape)   # (3, 4)
print("First temp:", first_temp)              # 22.5
print("Last three:", last_three)              # [17.8 28.6 21.4]
print("Every other:", every_other)            # [22.5 25.3 17.8 21.4]
print("Picked temps:", picked)                # [22.5 25.3 28.6]
print("Hot mask:", hot_mask)                  # [F F F T F T F]
print("Hot temps:", hot_temps)                # [30.1 28.6]
print("Hot day count:", hot_day_count)        # 2
`,
    },
    {
      id: "vectorized-operations",
      slug: "vectorized-operations",
      title: "Vectorized Operations and Broadcasting",
      content: `# Vectorized Operations and Broadcasting

Every ML algorithm you'll build in this course — linear regression, neural networks, CNNs — reduces to one thing at its core: math on arrays. How you perform that math determines whether your code runs in milliseconds or minutes. This lesson teaches you the two tools that make NumPy fast enough for real ML: **vectorized operations** and **broadcasting**.

By the end, you'll replace every slow Python loop with concise, C-speed array expressions — and you'll understand exactly how NumPy handles arrays of mismatched shapes.

---

## Why Loops Are the Wrong Tool

Consider normalizing a batch of 1 million feature values — something you'll do constantly in ML preprocessing. Here are two ways to do it:

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Python Loop (slow)", "code": "import numpy as np\\nimport time\\n\\ndata = np.random.randn(1_000_000)\\nresult = np.zeros_like(data)\\n\\nstart = time.time()\\nfor i in range(len(data)):\\n    result[i] = (data[i] - 0.5) / 2.0\\nprint(f'Loop: {time.time() - start:.3f}s')" }, "after": { "label": "Vectorized (fast)", "code": "import numpy as np\\nimport time\\n\\ndata = np.random.randn(1_000_000)\\n\\nstart = time.time()\\nresult = (data - 0.5) / 2.0\\nprint(f'Vectorized: {time.time() - start:.3f}s')" } }
\`\`\`

The vectorized version is typically **100–300× faster** on large arrays. The difference isn't algorithmic — it's implementation: the loop version pays Python's interpreter overhead on every iteration, while the vectorized version delegates to pre-compiled C/Fortran code that uses CPU-level SIMD instructions to process multiple elements in a single clock cycle.

\`\`\`concept
{ "title": "Vectorized Operations", "variant": "mental-model", "content": "A vectorized operation applies a function to an entire NumPy array at once, not element-by-element in Python. Under the hood, NumPy dispatches the work to compiled C/Fortran routines that exploit SIMD (Single Instruction, Multiple Data) — the CPU literally processes multiple array elements per clock cycle. Your Python code becomes a thin coordinator; the heavy lifting happens in native code." }
\`\`\`

---

## Element-Wise Arithmetic in Practice

All standard arithmetic operators (\`+\`, \`-\`, \`*\`, \`/\`, \`**\`) work element-wise on NumPy arrays. No special syntax required — just apply the operator directly.

\`\`\`playground
{ "title": "Element-wise Operations", "language": "python", "code": "import numpy as np\\n\\n# A batch of 5 model predictions (raw scores)\\nscores = np.array([2.1, -0.5, 3.8, 1.2, -1.9])\\nprint('Scores:', scores)\\n\\n# Shift and scale (common in feature normalization)\\nnormalized = (scores - scores.mean()) / scores.std()\\nprint('Normalized:', normalized.round(3))\\n\\n# Apply sigmoid activation: 1 / (1 + e^-x)\\nsigmoid = 1.0 / (1.0 + np.exp(-scores))\\nprint('Sigmoid:', sigmoid.round(3))\\n\\n# Comparison produces boolean arrays\\npositive_mask = scores > 0\\nprint('Positive:', positive_mask)\\nprint('Positive scores:', scores[positive_mask])", "runnable": true }
\`\`\`

Notice the sigmoid formula: \`1.0 / (1.0 + np.exp(-scores))\`. That single line applies \`exp\` to all 5 elements, adds 1 to all 5 results, divides all 5 results — no loop in sight. This is the exact sigmoid function you'll implement as an activation in the neural network module.

---

## Step-by-Step: How Broadcasting Works

Broadcasting is how NumPy handles arithmetic between arrays of **different shapes**. Rather than requiring identical shapes everywhere, NumPy follows a set of rules to make shapes compatible — without copying data.

\`\`\`concept
{ "title": "Broadcasting = Conceptual Stretching", "variant": "analogy", "content": "Imagine a spreadsheet where you add a single row of column headers to every row of data. You don't duplicate the header row a thousand times — you just apply it once mentally. NumPy does exactly this: the smaller array is 'stretched' conceptually across the larger one. No extra memory is allocated; NumPy just adjusts its stride calculations." }
\`\`\`

\`\`\`steps
{ "title": "The 3 Broadcasting Rules (NumPy's Algorithm)", "steps": [ { "title": "Rule 1 — Pad dimensions on the left", "content": "If arrays have different numbers of dimensions, prepend \`1\`s to the shape of the smaller-dimensional array.\\n\\n\`\`\`\\nA shape: (4, 3)\\nB shape:    (3,)  →  becomes  (1, 3)\\n\`\`\`" }, { "title": "Rule 2 — Stretch size-1 dimensions", "content": "Any dimension with size \`1\` is stretched to match the corresponding size in the other array.\\n\\n\`\`\`\\nA shape: (4, 3)\\nB shape: (1, 3)  →  stretched to  (4, 3)\\n\`\`\`\\n\\nB is now conceptually (4, 3) and the operation proceeds element-wise." }, { "title": "Rule 3 — Error if sizes disagree and neither is 1", "content": "If two dimensions are both not size \`1\` and not equal, NumPy raises a \`ValueError\`.\\n\\n\`\`\`\\nA shape: (4, 3)\\nC shape: (4, 2)  →  ERROR: 3 ≠ 2, neither is 1\\n\`\`\`\\n\\nThis is the most common broadcasting mistake. Fix it by reshaping: \`C.reshape(4, 1)\` would broadcast to (4, 3)." } ] }
\`\`\`

### Visualizing Broadcasting

Here's what happens when you add a \`(3,)\` bias vector to a \`(4, 3)\` weight matrix — a computation that appears in every neural network forward pass:

\`\`\`algoviz
{ "title": "Broadcasting: (4,3) + (3,) → (4,3)", "type": "grid", "data": [[1,2,3],[4,5,6],[7,8,9],[10,11,12]], "frames": [ { "highlight": [0,1,2,3,4,5,6,7,8,9,10,11], "label": "Matrix A has shape (4, 3) — 4 rows, 3 columns", "stats": {"A_shape":"(4,3)","B_shape":"(3,)"} }, { "highlight": [0,3,6,9], "label": "Bias b = [10, 20, 30] — shape (3,) padded to (1, 3)", "stats": {"A_shape":"(4,3)","B_padded":"(1,3)"} }, { "highlight": [0,1,2], "label": "Row 0: [1,2,3] + [10,20,30] = [11,22,33]", "stats": {"row":0,"result":"[11,22,33]"} }, { "highlight": [3,4,5], "label": "Row 1: [4,5,6] + [10,20,30] = [14,25,36]", "stats": {"row":1,"result":"[14,25,36]"} }, { "highlight": [6,7,8], "label": "Row 2: [7,8,9] + [10,20,30] = [17,27,39]", "stats": {"row":2,"result":"[17,27,39]"} }, { "highlight": [9,10,11], "label": "Row 3: [10,11,12] + [10,20,30] = [20,31,42]", "stats": {"row":3,"result":"[20,31,42]"} } ], "speed": 900 }
\`\`\`

The bias vector \`[10, 20, 30]\` was applied to all 4 rows — but NumPy never made 3 extra copies of it. This is the memory efficiency win.

---

## Broadcasting in ML: The Bias Addition Pattern

The most common place you'll use broadcasting is adding a **bias vector** to a **batch of activations**. Here's the exact pattern from a neural network layer:

\`\`\`playground
{ "title": "Neural Network Bias Addition via Broadcasting", "language": "python", "code": "import numpy as np\\n\\n# Batch of 4 samples, each with 3 features (activations from previous layer)\\nZ = np.array([\\n    [1.0, 2.0, 3.0],\\n    [4.0, 5.0, 6.0],\\n    [7.0, 8.0, 9.0],\\n    [10.0, 11.0, 12.0]\\n])\\nprint('Z shape:', Z.shape)   # (4, 3)\\n\\n# Bias vector — one bias per neuron (one per column)\\nbias = np.array([0.1, -0.2, 0.3])\\nprint('bias shape:', bias.shape)  # (3,)\\n\\n# Broadcasting: (4,3) + (3,) → bias applied to every row\\nZ_biased = Z + bias\\nprint('Z_biased shape:', Z_biased.shape)  # (4, 3)\\nprint('Z_biased:\\\\n', Z_biased)\\n\\n# Compare: what the equivalent loop looks like\\nZ_loop = np.zeros_like(Z)\\nfor i in range(Z.shape[0]):\\n    Z_loop[i] = Z[i] + bias  # same operation, row by row\\n\\nprint('Results match:', np.allclose(Z_biased, Z_loop))", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The Reshape Trick", "content": "When broadcasting doesn't work as expected, check shapes explicitly with \`.shape\`. To make a 1D array broadcast along rows instead of columns, reshape it: \`bias.reshape(-1, 1)\` turns a \`(3,)\` vector into \`(3, 1)\`, which then broadcasts across columns.\\n\\n\`\`\`python\\ncol_bias = np.array([1.0, 2.0, 3.0, 4.0]).reshape(-1, 1)  # (4,1)\\nresult = Z + col_bias  # (4,3) + (4,1) → (4,3)\\n\`\`\`" }
\`\`\`

---

## Tracing a Vectorized Computation

Let's trace exactly what NumPy does when computing the **mean squared error** loss — a formula you'll use constantly in linear regression:

\`\`\`trace
{ "title": "MSE Loss: Vectorized Step-by-Step", "language": "python", "code": "import numpy as np\\n\\ny_true = np.array([3.0, -0.5, 2.0, 7.0])\\ny_pred = np.array([2.5, 0.0, 2.1, 7.8])\\n\\ndiff = y_pred - y_true\\nsquared = diff ** 2\\nmse = squared.mean()", "frames": [ { "line": 3, "vars": {"y_true": "[3.0, -0.5, 2.0, 7.0]", "y_pred": "[2.5, 0.0, 2.1, 7.8]"}, "note": "Both arrays have shape (4,) — same shape, no broadcasting needed" }, { "line": 5, "vars": {"y_true": "[3.0, -0.5, 2.0, 7.0]", "y_pred": "[2.5, 0.0, 2.1, 7.8]", "diff": "[-0.5, 0.5, 0.1, 0.8]"}, "note": "Element-wise subtraction: each prediction minus its true value" }, { "line": 6, "vars": {"diff": "[-0.5, 0.5, 0.1, 0.8]", "squared": "[0.25, 0.25, 0.01, 0.64]"}, "note": "Element-wise square — penalizes large errors more than small ones" }, { "line": 7, "vars": {"squared": "[0.25, 0.25, 0.01, 0.64]", "mse": 0.2875}, "note": "Reduce: mean of all squared differences = (0.25+0.25+0.01+0.64)/4", "stdout": "MSE = 0.2875" } ], "speed": 900 }
\`\`\`

Three lines of NumPy replace what would otherwise be a loop, a running sum, and a division. Every ML loss function you implement follows this same pattern: vectorized difference → element-wise transformation → reduce (sum or mean).

---

## Common Broadcasting Patterns in ML

| Operation | Shapes | Result | Use Case |
|---|---|---|---|
| Add bias | \`(N, D) + (D,)\` | \`(N, D)\` | Neural net layer |
| Scale features | \`(N, D) * (D,)\` | \`(N, D)\` | Feature normalization |
| Outer product | \`(N, 1) * (1, D)\` | \`(N, D)\` | Gradient computation |
| Pairwise diff | \`(N, 1, D) - (1, M, D)\` | \`(N, M, D)\` | Distance matrices |
| Batch normalize | \`(N, D) - (N, 1)\` | \`(N, D)\` | Row-wise centering |

The outer product pattern (\`(N,1) * (1,D)\`) deserves special attention — you'll use it when computing gradients in backpropagation.

\`\`\`collapse
{ "title": "Deep Dive: Why Broadcasting Never Copies Memory", "content": "When NumPy 'stretches' a \`(1, 3)\` array to \`(4, 3)\`, it doesn't allocate a new \`(4, 3)\` array filled with repeated rows. Instead, it adjusts the array's **stride** metadata.\\n\\nA stride tells NumPy how many bytes to advance in memory to move one step along each axis. For a normal \`(4, 3)\` float64 array, strides are \`(24, 8)\` — 24 bytes per row, 8 bytes per element.\\n\\nFor a broadcast \`(1, 3)\` array acting as \`(4, 3)\`, NumPy sets the first stride to \`0\`. Moving 'down' a row advances 0 bytes — you keep reading the same data. The computation engine sees a \`(4, 3)\` array, but the underlying buffer is still just 3 elements.\\n\\nThis is why broadcasting is O(1) memory overhead regardless of how many rows you broadcast across." }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Vectorized Feature Scaling", "prompt": "Complete the vectorized min-max normalization function. It should scale each element to the range [0, 1] using the formula: (x - min) / (max - min).", "language": "python", "template": "import numpy as np\\n\\ndef minmax_normalize(X):\\n    x_min = X.___\\n    x_max = X.___\\n    return (X - ___) / (___ - ___)\\n\\ndata = np.array([2.0, 5.0, 1.0, 8.0, 3.0])\\nprint(minmax_normalize(data))\\n# Expected: [0.143, 0.571, 0.0, 1.0, 0.286]", "blanks": [ { "answer": "min()", "hint": "NumPy array method that returns the minimum value" }, { "answer": "max()", "hint": "NumPy array method that returns the maximum value" }, { "answer": "x_min", "hint": "Subtract the minimum to shift the range to start at 0" }, { "answer": "x_max", "hint": "The upper bound of the original range" }, { "answer": "x_min", "hint": "The lower bound of the original range" } ] }
\`\`\`

---

## Putting It Together: Vectorized Dot Product for Linear Regression

Linear regression prediction is \`y_hat = X @ w + b\` — a matrix multiply plus a bias. Here's the full vectorized implementation:

\`\`\`playground
{ "title": "Linear Regression Prediction (Vectorized)", "language": "python", "code": "import numpy as np\\n\\n# Dataset: 5 samples, 3 features each\\nX = np.array([\\n    [1.0, 2.0, 3.0],\\n    [4.0, 5.0, 6.0],\\n    [7.0, 8.0, 9.0],\\n    [2.0, 1.0, 4.0],\\n    [3.0, 6.0, 1.0]\\n])  # shape (5, 3)\\n\\n# Model weights (learned parameters)\\nw = np.array([0.5, -0.2, 0.8])  # shape (3,)\\nb = 1.0                          # scalar\\n\\n# Prediction: matrix multiply + broadcast bias\\n# X @ w → shape (5,)  (dot product of each row with w)\\n# + b   → scalar broadcasts to (5,)\\ny_hat = X @ w + b\\nprint('Predictions:', y_hat.round(2))\\n\\n# Ground truth\\ny_true = np.array([3.0, 6.0, 9.0, 4.0, 2.0])\\n\\n# MSE loss — fully vectorized\\ndiff = y_hat - y_true\\nmse = np.mean(diff ** 2)\\nprint(f'MSE Loss: {mse:.4f}')\\n\\n# Gradient of MSE w.r.t. w (you'll derive this properly later)\\n# dL/dw = (2/n) * X.T @ diff\\ngrad_w = (2 / len(y_true)) * (X.T @ diff)\\nprint('Gradient w.r.t. w:', grad_w.round(4))", "runnable": true }
\`\`\`

This is the complete forward pass and gradient computation for linear regression — 5 lines of NumPy. When you reach the linear regression module, this exact code forms the core of your training loop.

\`\`\`callout
{ "type": "warning", "title": "Shape Errors Are Your Friend", "content": "When NumPy raises \`ValueError: operands could not be broadcast together with shapes (4,3) (3,4)\`, it's saving you from a silent wrong answer. Before every matrix operation, print \`.shape\` on both operands. In ML code, a transposition error (\`w\` vs \`w.T\`) produces valid-looking output with completely wrong values — shape checking catches it immediately." }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Vectorized Operations and Broadcasting", "questions": [ { "question": "Why are NumPy vectorized operations faster than equivalent Python for-loops?", "options": [ "NumPy uses multiple CPU cores automatically for all operations", "NumPy delegates work to compiled C/Fortran code that uses CPU-level SIMD instructions, bypassing Python's interpreter overhead", "NumPy caches results of previous computations to avoid redundancy", "Python loops create copies of data on each iteration, which NumPy avoids" ], "answer": 1, "explanation": "NumPy's backend is written in optimized C/Fortran code that uses SIMD (Single Instruction, Multiple Data) — the CPU processes multiple array elements per clock cycle. Python loops pay interpreter overhead on every iteration; vectorized code pays it only once to dispatch the operation." }, { "question": "You have arrays with shapes (6, 4) and (4,). What shape does broadcasting produce when you add them?", "options": [ "Error — shapes are incompatible", "(4,)", "(6, 4)", "(6,)" ], "answer": 2, "explanation": "By Rule 1, (4,) is padded to (1, 4). By Rule 2, the size-1 first dimension stretches to 6, giving (6, 4). The (4,) vector is applied to every row of the (6,4) matrix — this is the classic bias-addition pattern in neural networks." }, { "question": "What does NumPy actually do to memory when broadcasting a (1, 5) array to act as (8, 5)?", "options": [ "Allocates a new (8, 5) array filled with 8 copies of the original row", "Stores 8 pointers to the same underlying row data", "Sets the first stride to 0 so advancing along that axis re-reads the same data", "Compresses the (8, 5) result using run-length encoding" ], "answer": 2, "explanation": "Broadcasting works by setting the stride for stretched dimensions to 0. The computation engine sees a (8, 5) array, but the underlying buffer is still just 5 elements. No data is copied — this is what makes broadcasting memory-efficient regardless of how many times the array is 'repeated'." }, { "question": "Which of the following pairs of shapes will raise a broadcasting error?", "options": [ "(3, 1) and (1, 4)", "(5, 3) and (3,)", "(4, 6) and (4, 1)", "(3, 4) and (5, 4)" ], "answer": 3, "explanation": "Shapes (3, 4) and (5, 4): the first dimensions are 3 and 5 — neither is 1, and they're not equal. Rule 3 requires that non-unit dimensions must match. The other three pairs all satisfy the broadcasting rules: (3,1)+(1,4)→(3,4); (5,3)+(3,)→(5,3); (4,6)+(4,1)→(4,6)." } ] }
\`\`\`

---

## Takeaways

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Vectorized operations apply arithmetic to entire arrays at once using compiled C/Fortran code — 100–300× faster than Python loops on large datasets due to SIMD CPU instructions.", "Broadcasting lets arrays of different shapes operate together: NumPy pads shapes on the left, stretches size-1 dimensions, and raises an error only when two non-unit dimensions disagree.", "Broadcasting never copies data — it adjusts stride metadata so the CPU re-reads the same memory across stretched dimensions, keeping memory usage constant.", "The core ML patterns — bias addition \`(N,D)+(D,)\`, feature scaling \`(N,D)*(D,)\`, MSE loss \`mean((y_hat-y_true)**2)\` — all reduce to vectorized operations and broadcasting.", "When shapes misbehave, use \`.reshape(-1,1)\` to explicitly add dimensions and control which axis broadcasting occurs along." ] }
\`\`\``,
      starterCode: `import numpy as np

# Exercise: Vectorized Operations and Broadcasting
# Goal: Replace slow for-loops with fast NumPy vectorized operations

# Dataset: daily temperatures (Celsius) for 4 cities over 5 days
temperatures = np.array([
    [22, 25, 19, 30, 27],  # City A
    [15, 18, 14, 20, 16],  # City B
    [35, 38, 33, 40, 36],  # City C
    [10, 12,  9, 14, 11],  # City D
])

# Adjustment to add per city (shape: (4,))
city_adjustments = np.array([1.5, -0.5, 2.0, 0.0])

# --- Part 1: Celsius to Fahrenheit ---
# TODO: Convert the entire temperatures array to Fahrenheit
# Formula: F = C * 9/5 + 32
# Do NOT use a for-loop — use a single vectorized expression
temps_fahrenheit = None  # Replace with your expression

# --- Part 2: Daily mean temperature ---
# TODO: Compute the mean temperature for each day (across all 4 cities)
# Result shape should be (5,) — one value per day
# Hint: use np.mean with the correct axis
daily_mean = None  # Replace with your expression

# --- Part 3: Broadcasting — apply city adjustments ---
# TODO: Add city_adjustments to the temperatures array using broadcasting
# city_adjustments has shape (4,) and temperatures has shape (4, 5)
# Hint: reshape city_adjustments so NumPy can broadcast it correctly
adjusted_temps = None  # Replace with your expression

# --- Part 4: Normalize each city's temperatures ---
# TODO: For each city (row), subtract its own mean and divide by its std
# Result: each row should have mean ≈ 0 and std ≈ 1
# Hint: use np.mean and np.std with axis=1, then reshape for broadcasting
normalized = None  # Replace with your expression

# --- Verification (do not modify) ---
print("Fahrenheit temps (first city):", temps_fahrenheit[0])
print("Daily means:", daily_mean.round(2))
print("Adjusted temps (first city):", adjusted_temps[0])
print("Normalized means (should be ~0):", normalized.mean(axis=1).round(10))
print("Normalized stds  (should be ~1):", normalized.std(axis=1).round(10))
`,
      solutionCode: `import numpy as np

# Dataset: daily temperatures (Celsius) for 4 cities over 5 days
temperatures = np.array([
    [22, 25, 19, 30, 27],  # City A
    [15, 18, 14, 20, 16],  # City B
    [35, 38, 33, 40, 36],  # City C
    [10, 12,  9, 14, 11],  # City D
])

# Adjustment to add per city (shape: (4,))
city_adjustments = np.array([1.5, -0.5, 2.0, 0.0])

# --- Part 1: Celsius to Fahrenheit ---
# NumPy applies the formula element-wise to the entire (4,5) array at once.
# No loop needed — this runs in optimised C under the hood.
temps_fahrenheit = temperatures * 9/5 + 32

# --- Part 2: Daily mean temperature ---
# axis=0 collapses rows (cities), leaving one value per column (day).
daily_mean = np.mean(temperatures, axis=0)  # shape: (5,)

# --- Part 3: Broadcasting — apply city adjustments ---
# city_adjustments is (4,). temperatures is (4, 5).
# Reshape to (4, 1) so NumPy broadcasts across all 5 columns automatically.
adjusted_temps = temperatures + city_adjustments.reshape(4, 1)

# --- Part 4: Normalize each city's temperatures (z-score per row) ---
# Compute per-row mean and std, then reshape to (4, 1) for broadcasting.
city_mean = np.mean(temperatures, axis=1, keepdims=True)  # shape: (4, 1)
city_std  = np.std(temperatures,  axis=1, keepdims=True)  # shape: (4, 1)

# Subtraction and division broadcast across all 5 columns.
normalized = (temperatures - city_mean) / city_std

# --- Verification ---
print("Fahrenheit temps (first city):", temps_fahrenheit[0])
print("Daily means:", daily_mean.round(2))
print("Adjusted temps (first city):", adjusted_temps[0])
print("Normalized means (should be ~0):", normalized.mean(axis=1).round(10))
print("Normalized stds  (should be ~1):", normalized.std(axis=1).round(10))
`,
    },
    {
      id: "linear-algebra-numpy",
      slug: "linear-algebra-numpy",
      title: "Linear Algebra with NumPy",
      content: `# Linear Algebra with NumPy

Every ML algorithm you'll build in this course — regression, neural networks, CNNs — reduces to a handful of matrix operations running millions of times per second. Before you write your first gradient descent loop, you need these operations in muscle memory.

This lesson gives you exactly that: the five linear algebra primitives that power all of ML, implemented with NumPy from first principles.

\`\`\`concept
{ "title": "Linear Algebra is the Language of ML", "variant": "mental-model", "content": "A neural network forward pass is matrix multiplication. Linear regression is a dot product. A convolution is a sliding dot product. When you understand these operations deeply — not just how to call them, but what they compute geometrically — you can reason about why models work, why they fail, and how to fix them. NumPy gives you these operations as building blocks. Your job is to see through the API to the math." }
\`\`\`

---

## Vectors and Dot Products

A **vector** is an ordered list of numbers. In ML, a training example is a vector of features, a model's weights form a weight vector, and every prediction is a dot product between them.

The **dot product** of two vectors **a** and **b** of length *n* is:

\`\`\`
a · b = a[0]*b[0] + a[1]*b[1] + ... + a[n-1]*b[n-1]
\`\`\`

Geometrically, it measures how much two vectors point in the same direction. In regression, \`weights · features\` produces the prediction. In neural networks, each neuron computes a dot product before applying an activation.

\`\`\`playground
{ "title": "Dot Products: From Scratch to NumPy", "language": "python", "code": "import numpy as np\\n\\n# Two feature vectors\\nweights = np.array([0.5, -1.2, 0.8])\\nfeatures = np.array([2.0, 1.5, 3.0])\\n\\n# Manual dot product (so you see what's happening)\\nmanual = sum(w * f for w, f in zip(weights, features))\\nprint(f\\"Manual dot product:  {manual}\\")\\n\\n# NumPy dot product\\nnumpy_dot = np.dot(weights, features)\\nprint(f\\"np.dot result:       {numpy_dot}\\")\\n\\n# @ operator (preferred in modern NumPy)\\nat_operator = weights @ features\\nprint(f\\"@ operator result:   {at_operator}\\")\\n\\n# All three are identical:\\nprint(f\\"\\\\nAll equal: {np.isclose(manual, numpy_dot) and np.isclose(numpy_dot, at_operator)}\\")\\n\\n# In linear regression: prediction = weights @ x + bias\\nbias = 0.1\\nprediction = weights @ features + bias\\nprint(f\\"\\\\nLinear regression prediction: {prediction:.4f}\\")", "runnable": true }
\`\`\`

\`\`\`trace
{ "title": "Dot Product Step by Step", "language": "python", "code": "import numpy as np\\nw = np.array([0.5, -1.2, 0.8])\\nx = np.array([2.0, 1.5, 3.0])\\n\\nacc = 0\\nacc += w[0] * x[0]\\nacc += w[1] * x[1]\\nacc += w[2] * x[2]\\nresult = acc", "frames": [ { "line": 3, "vars": { "w": "[0.5, -1.2, 0.8]", "x": "[2.0, 1.5, 3.0]" }, "note": "Initialize weight and feature vectors" }, { "line": 5, "vars": { "acc": 0 }, "note": "Accumulator starts at 0" }, { "line": 6, "vars": { "acc": 1.0 }, "note": "0.5 × 2.0 = 1.0 — first feature contributes positively" }, { "line": 7, "vars": { "acc": -0.8 }, "note": "-1.2 × 1.5 = -1.8, acc = 1.0 + (-1.8) = -0.8" }, { "line": 8, "vars": { "acc": 1.6 }, "note": "0.8 × 3.0 = 2.4, acc = -0.8 + 2.4 = 1.6" }, { "line": 9, "vars": { "result": 1.6 }, "note": "Final dot product: 1.6 — this is the model's raw output" } ], "speed": 900 }
\`\`\`

---

## Matrix Multiplication

When you want to compute predictions for an entire **batch** of training examples at once, you use matrix multiplication. This is the core operation in every neural network layer.

Given matrix **A** of shape \`(m, k)\` and matrix **B** of shape \`(k, n)\`, their product **C = A @ B** has shape \`(m, n)\`, where:

\`\`\`
C[i, j] = sum over k of A[i, k] * B[k, j]
\`\`\`

Think of it as: each row of A is one example's features, each column of B is one set of weights — every (row, column) pair produces one dot product.

\`\`\`concept
{ "title": "Shape Rule: The Inner Dimensions Must Match", "variant": "rule", "content": "(m, k) @ (k, n) → (m, n)\\n\\nThe two inner dimensions (both k) must be equal. The result takes the two outer dimensions. When a matmul fails with a shape error, check: are the inner dims the same? In a neural network layer mapping 64 inputs to 32 neurons: (batch, 64) @ (64, 32) → (batch, 32)." }
\`\`\`

\`\`\`playground
{ "title": "Batch Matrix Multiplication in a Neural Network Layer", "language": "python", "code": "import numpy as np\\nnp.random.seed(42)\\n\\n# Simulating a dense layer: 4 examples, 3 input features\\nX = np.array([\\n    [1.0, 2.0, 3.0],   # example 0\\n    [4.0, 5.0, 6.0],   # example 1\\n    [7.0, 8.0, 9.0],   # example 2\\n    [0.5, 1.5, 2.5],   # example 3\\n])  # shape: (4, 3)\\n\\n# Weight matrix: 3 inputs → 2 neurons\\nW = np.array([\\n    [0.1, -0.2],\\n    [0.3,  0.4],\\n    [-0.1, 0.5],\\n])  # shape: (3, 2)\\n\\nb = np.array([0.1, -0.1])  # bias: shape (2,)\\n\\n# Forward pass for all 4 examples at once\\nZ = X @ W + b   # shape: (4, 2)\\n\\nprint(f\\"X shape:  {X.shape}\\")\\nprint(f\\"W shape:  {W.shape}\\")\\nprint(f\\"Z shape:  {Z.shape}  ← (4 examples, 2 neurons)\\")\\nprint(f\\"\\\\nPre-activation outputs Z:\\")\\nprint(Z)\\n\\n# Verify: manually compute for example 0\\nz0_manual = X[0] @ W + b\\nprint(f\\"\\\\nManual check for example 0: {z0_manual}\\")\\nprint(f\\"Matches Z[0]:              {np.allclose(z0_manual, Z[0])}\\")", "runnable": true }
\`\`\`

---

## The Transpose

Transposing a matrix **flips it along the diagonal**: rows become columns and columns become rows. Shape \`(m, n)\` becomes \`(n, m)\`.

In ML you encounter transposes constantly:
- Computing gradients in backpropagation: \`dL/dW = X.T @ dL/dZ\`
- Converting a column vector to a row vector (or vice versa)
- Solving the normal equations in linear regression: \`(X.T @ X)^{-1} @ X.T @ y\`

\`\`\`algoviz
{ "title": "Transpose: Rows Become Columns", "type": "grid", "data": [[1,2,3],[4,5,6]], "frames": [ { "highlight": [0,1,2,3,4,5], "label": "Original matrix A — shape (2, 3): two rows, three columns", "stats": { "shape": "2×3" } }, { "highlight": [0,3,1,4,2,5], "label": "Transposing: element A[i,j] moves to position [j,i]", "stats": { "shape": "3×2" } }, { "highlight": [0,1,2,3,4,5], "label": "Result A.T — shape (3, 2): three rows, two columns", "stats": { "shape": "3×2" } } ], "speed": 1000 }
\`\`\`

\`\`\`playground
{ "title": "Transpose Operations in ML Context", "language": "python", "code": "import numpy as np\\n\\nA = np.array([[1, 2, 3],\\n              [4, 5, 6]])\\nprint(f\\"A shape: {A.shape}\\")\\nprint(f\\"A:\\\\n{A}\\")\\n\\nprint(f\\"\\\\nA.T shape: {A.T.shape}\\")\\nprint(f\\"A.T:\\\\n{A.T}\\")\\n\\n# --- Real ML use case: Normal Equation for Linear Regression ---\\n# Given X (features) and y (targets), optimal weights are:\\n# w = (X^T X)^{-1} X^T y\\n\\nnp.random.seed(0)\\nX = np.random.randn(10, 3)  # 10 samples, 3 features\\ntrue_w = np.array([2.0, -1.0, 0.5])\\ny = X @ true_w + 0.01 * np.random.randn(10)  # near-perfect linear data\\n\\n# Normal equation (closed-form solution)\\nXtX = X.T @ X           # (3, 10) @ (10, 3) = (3, 3)\\nXty = X.T @ y           # (3, 10) @ (10,)  = (3,)\\nw_hat = np.linalg.inv(XtX) @ Xty\\n\\nprint(f\\"\\\\n--- Normal Equation ---\\")\\nprint(f\\"True weights:      {true_w}\\")\\nprint(f\\"Recovered weights: {np.round(w_hat, 4)}\\")", "runnable": true }
\`\`\`

---

## Matrix Inverse and Solving Linear Systems

The **inverse** of a square matrix **A** is the matrix **A⁻¹** such that \`A @ A⁻¹ = I\` (the identity matrix). Not all matrices have an inverse — a matrix is **singular** if its determinant is zero.

In ML, the inverse appears in:
- The **normal equation**: the closed-form solution to linear regression
- **Whitening** data to decorrelate features
- Analysis of covariance matrices

\`\`\`callout
{ "type": "warning", "title": "Avoid np.linalg.inv for Large Systems", "content": "Computing the full inverse is O(n³) and numerically unstable. For solving Ax = b, use np.linalg.solve(A, b) instead — it uses LU decomposition and is both faster and more stable. The normal equation (X.T @ X)⁻¹ X.T y works fine for small datasets but gradient descent is preferred for large-scale problems for exactly this reason." }
\`\`\`

\`\`\`playground
{ "title": "Inverse and np.linalg.solve", "language": "python", "code": "import numpy as np\\n\\n# --- Computing an inverse ---\\nA = np.array([[2.0, 1.0],\\n              [5.0, 3.0]])\\n\\nA_inv = np.linalg.inv(A)\\nprint(\\"A_inv:\\")\\nprint(np.round(A_inv, 4))\\n\\n# Verify: A @ A_inv should be identity\\nprint(f\\"\\\\nA @ A_inv (should be I):\\")\\nprint(np.round(A @ A_inv, 10))\\n\\n# --- Better: use solve for Ax = b ---\\nb = np.array([4.0, 11.0])\\n\\n# Method 1: via inverse (less stable)\\nx_inv = A_inv @ b\\n\\n# Method 2: via solve (preferred)\\nx_solve = np.linalg.solve(A, b)\\n\\nprint(f\\"\\\\nSolving Ax = b where b = {b}\\")\\nprint(f\\"Via inverse:  x = {x_inv}\\")\\nprint(f\\"Via solve:    x = {x_solve}\\")\\nprint(f\\"Verify A @ x_solve = {A @ x_solve} (should equal b)\\")\\n\\n# --- Determinant: check if a matrix is invertible ---\\nprint(f\\"\\\\ndet(A) = {np.linalg.det(A):.4f}  (non-zero → invertible)\\")\\n\\nsingular = np.array([[1.0, 2.0], [2.0, 4.0]])  # rows are multiples\\nprint(f\\"det(singular) = {np.linalg.det(singular):.4f}  (zero → NOT invertible)\\")", "runnable": true }
\`\`\`

---

## Vector and Matrix Norms

A **norm** measures the "size" or "length" of a vector or matrix. In ML, norms appear in:
- **L2 regularization** (Ridge): penalizes \`||w||²\` to prevent overfitting
- **L1 regularization** (Lasso): penalizes \`||w||₁\` for sparsity
- **Gradient clipping**: clip if \`||∇||₂ > threshold\`
- **Loss functions**: MSE is related to the L2 norm of residuals

\`\`\`tabs
{ "tabs": [ { "label": "L1 Norm", "icon": "📏", "content": "**L1 Norm (Manhattan / Taxicab):**\\n\\n\`||v||₁ = |v[0]| + |v[1]| + ... + |v[n-1]|\`\\n\\nSum of absolute values. Encourages **sparsity** — in Lasso regression, L1 penalty drives some weights to exactly zero, effectively selecting features.\\n\\n\`\`\`python\\nimport numpy as np\\nv = np.array([3.0, -4.0, 0.0, 1.0])\\nprint(np.linalg.norm(v, ord=1))  # 8.0\\n\`\`\`" }, { "label": "L2 Norm", "icon": "📐", "content": "**L2 Norm (Euclidean):**\\n\\n\`||v||₂ = sqrt(v[0]² + v[1]² + ... + v[n-1]²)\`\\n\\nThe \\"straight-line\\" distance from the origin. This is the default \`np.linalg.norm(v)\`. Used in Ridge regression, gradient clipping, and measuring prediction error.\\n\\n\`\`\`python\\nimport numpy as np\\nv = np.array([3.0, -4.0])\\nprint(np.linalg.norm(v))      # 5.0  (3-4-5 triangle!)\\nprint(np.linalg.norm(v, ord=2))  # same: 5.0\\n\`\`\`" }, { "label": "Frobenius Norm", "icon": "🔲", "content": "**Frobenius Norm (for matrices):**\\n\\n\`||A||_F = sqrt(sum of all squared elements)\`\\n\\nThe matrix equivalent of the L2 norm. Measures the overall magnitude of a weight matrix. Useful when you want to regularize an entire layer's weights as a single value.\\n\\n\`\`\`python\\nimport numpy as np\\nW = np.array([[1.0, 2.0], [3.0, 4.0]])\\nprint(np.linalg.norm(W, 'fro'))  # sqrt(1+4+9+16) = sqrt(30) ≈ 5.477\\n\`\`\`" } ] }
\`\`\`

\`\`\`playground
{ "title": "Norms in ML: Regularization & Gradient Clipping", "language": "python", "code": "import numpy as np\\n\\n# --- L1 and L2 norms ---\\nweights = np.array([0.5, -1.2, 0.0, 0.8, -0.3])\\n\\nl1 = np.linalg.norm(weights, ord=1)\\nl2 = np.linalg.norm(weights)  # default is L2\\nprint(f\\"Weights: {weights}\\")\\nprint(f\\"L1 norm: {l1:.4f}  (sum of |w|)\\")\\nprint(f\\"L2 norm: {l2:.4f}  (sqrt of sum of w^2)\\")\\n\\n# --- Regularized loss ---\\npredictions = np.array([1.2, 0.8, 2.1])\\ntargets     = np.array([1.0, 1.0, 2.0])\\nlambda_reg  = 0.1\\n\\nresiduals = predictions - targets\\nmse_loss  = np.mean(residuals ** 2)\\n\\n# Ridge: MSE + lambda * ||w||^2\\nridge_loss = mse_loss + lambda_reg * np.sum(weights ** 2)\\nprint(f\\"\\\\nMSE loss:    {mse_loss:.4f}\\")\\nprint(f\\"Ridge loss:  {ridge_loss:.4f}  (MSE + L2 penalty)\\")\\n\\n# --- Gradient clipping ---\\ngradient = np.array([10.0, -8.0, 15.0, -3.0])  # large gradient\\nmax_norm = 5.0\\n\\ng_norm = np.linalg.norm(gradient)\\nif g_norm > max_norm:\\n    gradient_clipped = gradient * (max_norm / g_norm)\\nelse:\\n    gradient_clipped = gradient\\n\\nprint(f\\"\\\\nGradient norm before clipping: {g_norm:.4f}\\")\\nprint(f\\"Clipped gradient norm:         {np.linalg.norm(gradient_clipped):.4f}\\")\\nprint(f\\"Clipped gradient: {np.round(gradient_clipped, 4)}\\")", "runnable": true }
\`\`\`

---

## Putting It All Together: Normal Equation from Scratch

Let's verify all five operations work together by deriving and solving a real regression problem using only the linear algebra primitives from this lesson.

The **normal equation** solves \`argmin_w ||Xw - y||²\` analytically:

\`\`\`
w* = (X^T X)^{-1} X^T y
\`\`\`

\`\`\`steps
{ "title": "Deriving the Normal Equation Step by Step", "steps": [ { "title": "Set up the feature matrix X", "content": "Each row is one training example. We add a column of ones to X for the bias term, so \`w\` will contain both the slope(s) and intercept.\\n\\n\`\`\`python\\nimport numpy as np\\nX_raw = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])\\nX = np.hstack([np.ones((5, 1)), X_raw])  # prepend bias column\\n\`\`\`\\n\\nX now has shape \`(5, 2)\`: 5 examples, 2 parameters (bias + slope)." }, { "title": "Compute X^T X (Gram matrix)", "content": "This \`(2, 2)\` matrix captures feature correlations.\\n\\n\`\`\`python\\nXtX = X.T @ X   # (2, 5) @ (5, 2) → (2, 2)\\n\`\`\`\\n\\nFor well-conditioned data, XtX is invertible. If features are collinear (or if you have fewer samples than features), it becomes singular." }, { "title": "Invert X^T X", "content": "Use \`np.linalg.solve\` or \`np.linalg.inv\`. For the normal equation:\\n\\n\`\`\`python\\nXtX_inv = np.linalg.inv(XtX)\\n\`\`\`\\n\\nOr, more stably, \`np.linalg.lstsq(X, y, rcond=None)\` handles the entire normal equation in one call." }, { "title": "Compute X^T y and recover w*", "content": "\`\`\`python\\nXty  = X.T @ y\\nw_star = XtX_inv @ Xty   # optimal weights!\\n\`\`\`\\n\\nThe first element of \`w_star\` is the bias (intercept), the remaining elements are the feature weights (slopes)." }, { "title": "Evaluate predictions and residuals", "content": "\`\`\`python\\ny_hat    = X @ w_star\\nresiduals = y - y_hat\\nmse       = np.mean(residuals ** 2)\\n\`\`\`\\n\\nThe L2 norm of the residuals is \`np.linalg.norm(residuals)\`. The normal equation minimizes exactly this quantity." } ] }
\`\`\`

\`\`\`playground
{ "title": "Complete Normal Equation Implementation", "language": "python", "code": "import numpy as np\\nnp.random.seed(7)\\n\\n# Generate toy dataset: y = 3x + 2 + noise\\nX_raw = np.linspace(0, 10, 20).reshape(-1, 1)\\ny = 3 * X_raw.flatten() + 2 + np.random.randn(20) * 1.5\\n\\n# Step 1: Add bias column\\nX = np.hstack([np.ones((20, 1)), X_raw])\\nprint(f\\"X shape: {X.shape}  (20 examples, 2 params: bias + slope)\\")\\n\\n# Step 2: Gram matrix\\nXtX = X.T @ X\\nprint(f\\"X^T X:\\\\n{np.round(XtX, 2)}\\")\\n\\n# Step 3 & 4: Solve for optimal weights\\nXty   = X.T @ y\\nw_star = np.linalg.solve(XtX, Xty)  # stable alternative to inv\\nprint(f\\"\\\\nOptimal weights: bias={w_star[0]:.4f}, slope={w_star[1]:.4f}\\")\\nprint(f\\"True values:     bias=2.0000, slope=3.0000\\")\\n\\n# Step 5: Evaluate\\ny_hat     = X @ w_star\\nresiduals = y - y_hat\\nmse       = np.mean(residuals ** 2)\\nl2_res    = np.linalg.norm(residuals)\\n\\nprint(f\\"\\\\nMSE:           {mse:.4f}\\")\\nprint(f\\"L2 norm of residuals: {l2_res:.4f}\\")\\nprint(f\\"\\\\nNormal equation minimizes exactly this L2 norm.\\")", "runnable": true }
\`\`\`

---

## Practice: Fill in the Blanks

\`\`\`fillblank
{ "title": "Implement a Neural Network Forward Pass", "prompt": "Complete the forward pass for a single dense layer. The layer takes a batch X of shape (batch, in_features), applies weights W and bias b, and returns the pre-activation output Z.", "language": "python", "template": "import numpy as np\\n\\ndef dense_forward(X, W, b):\\n    # X: (batch, in_features)\\n    # W: (in_features, out_features)\\n    # b: (out_features,)\\n    Z = ___ @ ___ + ___\\n    return Z\\n\\n# Test\\nX = np.random.randn(4, 3)\\nW = np.random.randn(3, 2)\\nb = np.zeros(2)\\nZ = dense_forward(X, W, b)\\nprint(Z.shape)  # should be (4, 2)", "blanks": [ { "answer": "X", "hint": "The input matrix goes on the left of the multiplication" }, { "answer": "W", "hint": "The weight matrix goes on the right; its first dim must match X's last dim" }, { "answer": "b", "hint": "Add the bias vector — NumPy broadcasts it across the batch dimension" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Compute L2 Regularization Penalty", "prompt": "Given a weight matrix W, compute the L2 (Ridge) regularization penalty: lambda * ||W||_F^2, where ||W||_F is the Frobenius norm.", "language": "python", "template": "import numpy as np\\n\\ndef l2_penalty(W, lambda_reg):\\n    return lambda_reg * np.linalg.___(W, ___) ** ___\\n\\nW = np.array([[1.0, -2.0], [3.0, 0.5]])\\nprint(l2_penalty(W, 0.01))  # 0.01 * (1+4+9+0.25) = 0.1425", "blanks": [ { "answer": "norm", "hint": "The NumPy function that computes matrix norms lives in np.linalg" }, { "answer": "'fro'", "hint": "Frobenius norm — the string argument to select it" }, { "answer": "2", "hint": "Square the norm to get ||W||^2" } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Linear Algebra with NumPy", "questions": [ { "question": "You have matrices A of shape (32, 128) and B of shape (64, 128). Which operation produces a valid result?", "options": ["A @ B", "B @ A", "A @ B.T", "B.T @ A"], "answer": 2, "explanation": "Matrix multiplication requires the inner dimensions to match. A is (32, 128) and B.T is (128, 64), so A @ B.T is valid and produces shape (32, 64). B @ A would require (64, 128) @ (32, 128) — inner dims 128 and 32 don't match." }, { "question": "In the normal equation w* = (X^T X)^{-1} X^T y, what role does the transpose play?", "options": ["It makes X square so it can be inverted", "It converts X from (n, p) to (p, n), enabling the Gram matrix (p, p) to be formed", "It reverses the order of rows to stabilize the inverse", "It is only needed when X has more columns than rows"], "answer": 1, "explanation": "X.T converts X from shape (n, p) to (p, n). Multiplying X.T @ X gives a (p, p) square Gram matrix that can be inverted. This is the algebraic step that projects the problem into parameter space." }, { "question": "Why is np.linalg.solve(A, b) preferred over np.linalg.inv(A) @ b for solving Ax = b?", "options": ["solve is always faster due to GPU acceleration", "solve uses LU decomposition, which is numerically more stable and does not compute the full inverse", "solve works for non-square matrices while inv does not", "inv requires A to be symmetric, while solve does not"], "answer": 1, "explanation": "np.linalg.solve uses LU factorization to solve directly without forming A^{-1}. Computing the full inverse is numerically unstable (small errors compound) and wastes work if you only need one solution vector. solve is both more accurate and more efficient." }, { "question": "Which norm encourages sparsity in learned weights (driving some weights to exactly zero)?", "options": ["L2 norm (Frobenius)", "L∞ norm (max absolute value)", "L1 norm (sum of absolute values)", "L0 norm (count of non-zeros)"], "answer": 2, "explanation": "L1 regularization (Lasso) penalizes the sum of absolute weight values. Geometrically, the L1 ball has corners aligned with the axes, so the constrained optimum tends to land on an axis — meaning some weights are exactly zero. L2 (Ridge) shrinks all weights but rarely to exactly zero." }, { "question": "A neural network layer computes Z = X @ W + b. X is (batch_size, 64), W is (64, 32), b is (32,). What is the shape of Z, and what does each dimension represent?", "options": ["(64, 32) — input features × output neurons", "(batch_size, 32) — one output per neuron per example", "(batch_size, 64) — the input is preserved", "(32, batch_size) — the transpose of the expected output"], "answer": 1, "explanation": "(batch_size, 64) @ (64, 32) → (batch_size, 32). The inner dimensions (64) cancel, leaving (batch_size, 32): for each of the batch_size examples, there are 32 neuron pre-activations. The bias vector b of shape (32,) broadcasts across the batch dimension." } ] }
\`\`\`

---

## Summary

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "np.dot(a, b) and a @ b compute the dot product — the fundamental operation in regression and neural network neurons", "Matrix multiplication (A @ B) batches dot products: shape (m, k) @ (k, n) → (m, n). The inner dimensions must match.", "The transpose (A.T) flips shape from (m, n) to (n, m) — essential for the normal equation and backpropagation gradients", "Use np.linalg.solve(A, b) instead of np.linalg.inv(A) @ b — it's more stable and efficient for Ax = b", "L2 norm (default np.linalg.norm) measures Euclidean magnitude; L1 norm encourages sparsity; Frobenius norm generalizes L2 to matrices", "The normal equation w* = (X^T X)^{-1} X^T y chains all five operations — transpose, matmul, inverse, matmul, matmul — into a closed-form solution for linear regression" ] }
\`\`\`

You now have the five building blocks — dot products, matrix multiplication, transpose, inverse, and norms — that every algorithm in this course reduces to. In the next lesson you'll use them to build vectorized linear regression from scratch, replacing the normal equation with gradient descent.`,
      starterCode: `import numpy as np

# Linear Algebra with NumPy
# Master the core matrix operations used in regression and neural networks

def linear_algebra_ops():
    # Setup: Weight matrix and input vectors (as in a neural network layer)
    W = np.array([[0.5, -0.3, 0.8],
                  [0.2,  0.7, -0.1],
                  [-0.4, 0.6,  0.9]])
    
    x = np.array([1.0, 2.0, 3.0])  # input vector
    b = np.array([0.1, -0.2, 0.3]) # bias vector

    # TODO 1: Compute the dot product of x with itself (gives squared magnitude)
    dot_result = None

    # TODO 2: Compute the matrix-vector product W @ x (forward pass in a neural net)
    matmul_result = None

    # TODO 3: Compute the transpose of W
    W_T = None

    # TODO 4: Compute the inverse of W
    # Hint: use np.linalg.inv()
    W_inv = None

    # TODO 5: Verify W @ W_inv ≈ identity matrix
    # Hint: use np.allclose() to check — store True/False in \`is_identity\`
    is_identity = None

    # TODO 6: Compute the L2 norm (Euclidean length) of x
    # This is used in regularization and normalization
    # Hint: use np.linalg.norm()
    l2_norm = None

    # TODO 7: Normalize x to unit length (divide x by its L2 norm)
    x_normalized = None

    # TODO 8: Compute the full affine transform: y = W @ x + b
    # This is one complete neuron layer
    y = None

    return {
        "dot_result": dot_result,
        "matmul_result": matmul_result,
        "W_T": W_T,
        "W_inv": W_inv,
        "is_identity": is_identity,
        "l2_norm": l2_norm,
        "x_normalized": x_normalized,
        "y": y,
    }

results = linear_algebra_ops()
for key, val in results.items():
    print(f"{key}:\\n{val}\\n")
`,
      solutionCode: `import numpy as np

# Linear Algebra with NumPy
# Master the core matrix operations used in regression and neural networks

def linear_algebra_ops():
    # Setup: Weight matrix and input vectors (as in a neural network layer)
    W = np.array([[0.5, -0.3, 0.8],
                  [0.2,  0.7, -0.1],
                  [-0.4, 0.6,  0.9]])
    
    x = np.array([1.0, 2.0, 3.0])  # input vector
    b = np.array([0.1, -0.2, 0.3]) # bias vector

    # 1. Dot product of x with itself = sum of squares = 1² + 2² + 3² = 14.0
    # np.dot on two 1-D arrays computes the scalar inner product
    dot_result = np.dot(x, x)

    # 2. Matrix-vector multiplication: W @ x
    # Each output neuron is a weighted sum of all inputs
    matmul_result = W @ x  # equivalent to np.matmul(W, x)

    # 3. Transpose: flip rows and columns
    # W_T[i][j] == W[j][i]; used in backpropagation (gradient flows through W^T)
    W_T = W.T

    # 4. Inverse: W_inv satisfies W @ W_inv = I
    # Only square, non-singular matrices are invertible
    W_inv = np.linalg.inv(W)

    # 5. Verify W @ W_inv is (approximately) the identity matrix
    # Floating-point arithmetic means exact equality rarely holds; allclose uses tolerance
    is_identity = np.allclose(W @ W_inv, np.eye(3))

    # 6. L2 norm: sqrt(x[0]² + x[1]² + x[2]²)
    # Used in ridge regression penalty, gradient clipping, and normalizing embeddings
    l2_norm = np.linalg.norm(x)

    # 7. Unit vector: divide every component by the norm
    # After normalization, np.linalg.norm(x_normalized) == 1.0
    x_normalized = x / l2_norm

    # 8. Affine transform: y = W @ x + b
    # This is exactly what one fully-connected layer computes before the activation function
    y = W @ x + b

    return {
        "dot_result": dot_result,       # 14.0
        "matmul_result": matmul_result, # [ 3.3, 1.9, 2.5]
        "W_T": W_T,
        "W_inv": W_inv,
        "is_identity": is_identity,     # True
        "l2_norm": l2_norm,             # 3.7416...
        "x_normalized": x_normalized,  # [0.267, 0.535, 0.802]
        "y": y,                         # [ 3.4, 1.7, 2.8]
    }

results = linear_algebra_ops()
for key, val in results.items():
    print(f"{key}:\\n{val}\\n")
`,
    },
    {
      id: "random-seeds-distributions",
      slug: "random-seeds-distributions",
      title: "Random Numbers, Seeds, and Distributions",
      content: `# Random Numbers, Seeds, and Distributions

Every ML experiment you run depends on randomness: the initial weights of your network, which samples form each mini-batch, which neurons get dropped during training. Yet ML also demands **reproducibility** — if you can't recreate results, you can't debug them or compare models fairly. This lesson teaches you to control that tension using NumPy's random module.

By the end you'll be generating synthetic datasets, initializing weights, and simulating dropout masks — all from scratch, with full control.

---

\`\`\`concept
{
  "title": "The PRNG Mental Model",
  "variant": "analogy",
  "content": "Imagine a very long book of pre-shuffled numbers, billions of pages deep. A Pseudorandom Number Generator (PRNG) is just a bookmark in that book. Every call to np.random draws the next number and advances the bookmark one page. The **seed** tells NumPy which page to start on. Same seed → same starting page → same sequence of numbers, every single time. The book itself never changes — only where you begin reading."
}
\`\`\`

---

## Setting the Seed

NumPy's default PRNG uses the Mersenne Twister algorithm — a deterministic formula that produces sequences of numbers that pass statistical randomness tests but are entirely controlled by one integer: the seed.

Call \`np.random.seed(N)\` once at the top of any experiment script. From that point forward, every random draw follows the same reproducible sequence across runs, machines, and collaborators.

\`\`\`trace
{
  "title": "How np.random.seed() Controls the Sequence",
  "language": "python",
  "code": "import numpy as np\\nnp.random.seed(42)\\na = np.random.rand()\\nb = np.random.rand()\\nnp.random.seed(42)\\nc = np.random.rand()\\nprint(a == c)",
  "frames": [
    { "line": 1, "vars": {}, "note": "NumPy imported — PRNG starts in undefined state" },
    { "line": 2, "vars": { "seed": 42 }, "note": "Internal state initialized from seed 42 — bookmark placed at page 42" },
    { "line": 3, "vars": { "a": 0.3745 }, "note": "First draw: bookmark advances to page 43, returns 0.3745..." },
    { "line": 4, "vars": { "a": 0.3745, "b": 0.9507 }, "note": "Second draw: bookmark advances again, returns 0.9507..." },
    { "line": 5, "vars": { "a": 0.3745, "b": 0.9507, "seed": 42 }, "note": "Seed reset to 42 — bookmark returns to page 42, same as line 2" },
    { "line": 6, "vars": { "a": 0.3745, "b": 0.9507, "c": 0.3745 }, "note": "Same first draw as line 3 — c is identical to a" },
    { "line": 7, "vars": { "a": 0.3745, "b": 0.9507, "c": 0.3745 }, "note": "True confirmed — seed reset rewound the sequence", "stdout": "True" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Legacy API vs. the New Generator (NumPy ≥ 1.17)",
  "content": "This lesson uses the legacy \`np.random.seed()\` API because it's universal and you'll see it everywhere. NumPy 1.17+ introduced \`rng = np.random.default_rng(42)\` — a stateless Generator object that's safer for parallel code and testing. Both produce reproducible sequences. For now, \`np.random.seed(42)\` at the top of your script is perfectly correct."
}
\`\`\`

---

## Three Distributions You'll Use in Every ML Project

Different problems need different shapes of randomness. Here are the three you'll reach for constantly.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Uniform",
      "icon": "📏",
      "content": "### np.random.uniform(low, high, size)\\n\\nEvery value in \`[low, high)\` has **equal probability** of being drawn. The distribution is flat — no value is more likely than another.\\n\\n\`\`\`python\\nimport numpy as np\\nnp.random.seed(0)\\nsamples = np.random.uniform(low=0.0, high=1.0, size=5)\\nprint(samples)  # [0.549 0.716 0.603 0.545 0.424]\\n\`\`\`\\n\\n**When to use it in ML:**\\n- Generating synthetic features with no assumed structure\\n- Hyperparameter search (e.g. sample learning rate from a range)\\n- Random train/validation splits\\n- Weight initialization for shallow networks (Xavier uses a bounded uniform)"
    },
    {
      "label": "Normal",
      "icon": "🔔",
      "content": "### np.random.normal(loc, scale, size)\\n\\nThe **bell curve** — values cluster near the mean (\`loc\`), with spread controlled by \`scale\` (standard deviation). ~68% of samples fall within ±1σ of the mean.\\n\\n\`\`\`python\\nimport numpy as np\\nnp.random.seed(0)\\nweights = np.random.normal(loc=0.0, scale=0.01, size=(3, 3))\\nprint(weights)\\n# [[-0.00200 0.00487 0.00303]\\n#  [-0.00152 0.00318 -0.00085]\\n#  [-0.00261 0.00105 0.00542]]\\n\`\`\`\\n\\n**When to use it in ML:**\\n- Neural network weight initialization — small σ prevents exploding/vanishing gradients\\n- Injecting Gaussian noise for data augmentation\\n- Simulating measurement error in synthetic datasets\\n- Bayesian priors over model parameters"
    },
    {
      "label": "Binomial",
      "icon": "🪙",
      "content": "### np.random.binomial(n, p, size)\\n\\nModels **how many successes occur in n independent trials**, each with probability p. When n=1, each draw is 0 or 1 — called a Bernoulli trial.\\n\\n\`\`\`python\\nimport numpy as np\\nnp.random.seed(0)\\n# Dropout mask: keep neuron (1) with 80% probability\\ndropout_mask = np.random.binomial(n=1, p=0.8, size=10)\\nprint(dropout_mask)  # [1 1 1 1 0 1 1 1 1 1]\\nprint(\\"Active neurons:\\", dropout_mask.sum(), \\"/ 10\\")\\n\`\`\`\\n\\n**When to use it in ML:**\\n- Simulating dropout regularization masks\\n- Generating binary classification labels for synthetic datasets\\n- Modeling A/B test outcomes\\n- Simulating any success/failure process (click-through, fraud detection)"
    }
  ]
}
\`\`\`

---

## Seeing All Three in Action

\`\`\`playground
{
  "title": "Sampling from Uniform, Normal, and Binomial Distributions",
  "language": "python",
  "code": "import numpy as np\\n\\n# Reproducible starting point\\nnp.random.seed(42)\\n\\n# --- 1. Uniform distribution ---\\nuniform_samples = np.random.uniform(low=0.0, high=1.0, size=8)\\nprint(\\"Uniform U(0, 1):\\")\\nprint(np.round(uniform_samples, 3))\\nprint(f\\"  mean = {uniform_samples.mean():.3f}  (expected ~0.500)\\")\\n\\n# --- 2. Normal distribution ---\\nnormal_samples = np.random.normal(loc=0.0, scale=1.0, size=8)\\nprint(\\"\\\\nNormal N(0, 1):\\")\\nprint(np.round(normal_samples, 3))\\nprint(f\\"  mean = {normal_samples.mean():.3f}  std = {normal_samples.std():.3f}\\")\\n\\n# --- 3. Binomial — simulate dropout mask (keep with p=0.8) ---\\ndropout = np.random.binomial(n=1, p=0.8, size=12)\\nprint(\\"\\\\nDropout mask (p_keep=0.80):\\")\\nprint(dropout)\\nprint(f\\"  kept {dropout.sum()} / 12 neurons  ({dropout.mean()*100:.0f}%)\\")\\n\\n# --- Build a toy dataset: 200 samples, 3 features, binary label ---\\nnp.random.seed(42)  # reset for reproducibility\\nX = np.random.normal(loc=0.0, scale=1.0, size=(200, 3))\\ny = np.random.binomial(n=1, p=0.5, size=200)\\nprint(f\\"\\\\nDataset: X={X.shape}, y={y.shape}, label balance={y.mean():.2f}\\")",
  "runnable": true
}
\`\`\`

---

## Watching Normal Samples Accumulate

The power of the Normal distribution comes from the **law of large numbers** — as you draw more samples, the empirical mean converges toward the true mean (0) and the empirical std converges toward the true std (1).

\`\`\`algoviz
{
  "title": "8 Draws from N(0, 1) — Running Mean Converges to 0",
  "type": "array",
  "data": [-0.49, 1.16, 0.27, -0.84, 0.63, -1.21, 0.52, -0.09],
  "frames": [
    { "highlight": [0], "label": "Draw 1: -0.49 (left of center)", "stats": { "n": 1, "running_mean": -0.49 } },
    { "highlight": [1], "label": "Draw 2: 1.16 (right tail — pulls mean up)", "stats": { "n": 2, "running_mean": 0.34 } },
    { "highlight": [2], "label": "Draw 3: 0.27 (near center)", "stats": { "n": 3, "running_mean": 0.31 } },
    { "highlight": [3], "label": "Draw 4: -0.84 (left side — mean drops)", "stats": { "n": 4, "running_mean": 0.03 } },
    { "highlight": [4], "label": "Draw 5: 0.63 (right of center)", "stats": { "n": 5, "running_mean": 0.15 } },
    { "highlight": [5], "label": "Draw 6: -1.21 (left tail — mean dips)", "stats": { "n": 6, "running_mean": -0.08 } },
    { "highlight": [6], "label": "Draw 7: 0.52", "stats": { "n": 7, "running_mean": 0.01 } },
    { "highlight": [0, 1, 2, 3, 4, 5, 6, 7], "label": "All 8 samples — mean ≈ 0 as the law of large numbers predicts", "stats": { "n": 8, "running_mean": 0.0 } }
  ],
  "speed": 850
}
\`\`\`

With only 8 samples the mean is already close to 0. With 10,000 samples it would be within ±0.01. This is why ML datasets work — enough samples and the statistics stabilize.

---

\`\`\`concept
{
  "title": "Distributions as Prior Beliefs About Your Data",
  "variant": "insight",
  "content": "Every distribution encodes an assumption. Choosing Normal(0, 0.01) for weight initialization says: 'I believe weights should start near zero with small spread.' Choosing Binomial(1, 0.5) for labels says: 'I expect balanced classes.' Understanding which distribution matches your domain assumption is a skill that separates good ML practitioners from ones who cargo-cult initialization schemes without understanding why they work."
}
\`\`\`

---

## Practice: Build a Reproducible Dataset

\`\`\`fillblank
{
  "title": "Complete the Synthetic Dataset Generator",
  "prompt": "Fill in the three blanks to create a reproducible dataset with 100 training examples. Features come from a standard normal distribution. Labels are binary with a 60% positive-class rate.",
  "language": "python",
  "template": "import numpy as np\\n\\n# Fix the random state for reproducibility\\nnp.random._____(42)\\n\\n# 100 rows, 4 features each — drawn from N(0, 1)\\nX = np.random._____(loc=0.0, scale=1.0, size=(100, 4))\\n\\n# 100 binary labels — 1 with probability 0.6\\ny = np.random._____(n=1, p=0.6, size=100)\\n\\nprint(\\"X shape:\\", X.shape)\\nprint(\\"y shape:\\", y.shape)\\nprint(\\"Label balance:\\", y.mean().round(2))",
  "blanks": [
    { "answer": "seed", "hint": "The function that locks the PRNG to a fixed starting state" },
    { "answer": "normal", "hint": "The bell-curve distribution parameterized by loc (mean) and scale (std)" },
    { "answer": "binomial", "hint": "n=1 gives a Bernoulli trial — produces exactly 0 or 1 per sample" }
  ]
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "You train a model Monday and get validation loss 0.42. You run the identical script Tuesday and get 0.57. You didn't change any code. What is the most likely cause?",
      "options": [
        "The learning rate scheduler behaved differently",
        "The dataset was corrupted overnight",
        "No random seed was set, so weight initialization and batch shuffling differ between runs",
        "NumPy's PRNG changed between Python sessions"
      ],
      "answer": 2,
      "explanation": "Without np.random.seed(), NumPy initializes the PRNG from system entropy — different each run. This changes random weight initialization, mini-batch ordering, and dropout masks, all of which alter the loss trajectory. Fixing the seed with np.random.seed(42) eliminates this variability."
    },
    {
      "question": "You call np.random.seed(7), draw 5 values, then call np.random.seed(7) again and draw 5 more. What happens the second time?",
      "options": [
        "You get 5 different values — seeds are consumed after use",
        "You get the exact same 5 values as the first draw",
        "You continue the sequence from where it left off after the first 5 draws",
        "You get an error — a seed cannot be reused in the same session"
      ],
      "answer": 1,
      "explanation": "Calling seed() resets the PRNG's internal state to the same starting point. Every draw after that follows the identical sequence. This is exactly how reproducibility works: same seed → same state → same numbers, regardless of when you call it."
    },
    {
      "question": "Which NumPy call correctly simulates a neural network dropout mask that keeps each of 512 neurons active with 80% probability?",
      "options": [
        "np.random.uniform(0, 1, size=512) > 0.8",
        "np.random.normal(0.8, 0.1, size=512)",
        "np.random.binomial(n=1, p=0.8, size=512)",
        "np.random.choice([0, 1], size=512)"
      ],
      "answer": 2,
      "explanation": "np.random.binomial(n=1, p=0.8, size=512) produces a Bernoulli draw for each of the 512 neurons — 1 (keep) with probability 0.8 and 0 (drop) with probability 0.2. This is precisely the mask applied to neuron outputs during dropout regularization. Option A would also work statistically but is less semantically clear."
    },
    {
      "question": "You are initializing weights for a 5-layer neural network. Why is Normal(0, 0.01) preferred over initializing all weights to 0?",
      "options": [
        "Zero initialization causes numerical overflow during the first forward pass",
        "Zero initialization makes all neurons compute identical gradients, so they learn the same features and the extra layers provide no benefit",
        "NumPy cannot represent exact zeros in float32 arrays",
        "Zero initialization only works for linear regression, not neural networks"
      ],
      "answer": 1,
      "explanation": "If all weights are identical (including zero), every neuron in a layer receives the same gradient and updates identically — they remain identical throughout training. This 'symmetry problem' means a 100-neuron layer effectively behaves like a 1-neuron layer. Random initialization from Normal(0, small σ) breaks symmetry so each neuron can specialize on different features."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "NumPy's PRNG is deterministic: np.random.seed(N) at the top of every experiment script guarantees the same sequence of random numbers across all runs.",
    "np.random.uniform samples evenly across a range — use it for hyperparameter search and unbiased synthetic features.",
    "np.random.normal samples from a bell curve — the standard choice for neural network weight initialization, where a small standard deviation (e.g. 0.01) prevents gradient explosion.",
    "np.random.binomial(n=1, p=...) is a Bernoulli trial producing 0 or 1 — the building block for dropout masks and binary label generation.",
    "Always verify sampled data: print .mean() and .std() and compare to theoretical values. With ≥ 200 samples these should be close. If they're not, recheck your parameters."
  ]
}
\`\`\``,
      starterCode: `import numpy as np

# TODO: Set a random seed of 42 to ensure reproducibility


# TODO: Generate 1000 samples from a uniform distribution
# between 0 and 1, store in variable 'uniform_data'
uniform_data = None

# TODO: Generate 500 samples from a normal distribution
# with mean=0 and std=1, store in variable 'normal_data'
normal_data = None

# TODO: Generate 200 samples from a binomial distribution
# with n=10 trials and p=0.5 probability, store in variable 'binomial_data'
binomial_data = None

# TODO: Print the shape and mean of each dataset
# Expected output:
#   Uniform  - shape: (1000,), mean: ~0.50
#   Normal   - shape: (500,),  mean: ~0.00
#   Binomial - shape: (200,),  mean: ~5.00


# TODO: Verify reproducibility — set the same seed (42) again
# and regenerate uniform_data. Print whether the first 5 values
# match the original uniform_data[:5]
`,
      solutionCode: `import numpy as np

# Set a random seed for reproducibility
# Any code that calls np.random after this will produce the same results
np.random.seed(42)

# Uniform distribution: values equally likely across the range [0, 1)
uniform_data = np.random.uniform(0, 1, size=1000)

# Normal (Gaussian) distribution: bell curve centered at mean=0, spread=1
normal_data = np.random.normal(loc=0, scale=1, size=500)

# Binomial distribution: counts successes in n=10 trials, each with p=0.5 chance
binomial_data = np.random.binomial(n=10, p=0.5, size=200)

# Print shape and mean for each dataset
print(f"Uniform  - shape: {uniform_data.shape}, mean: {uniform_data.mean():.2f}")
print(f"Normal   - shape: {normal_data.shape}, mean: {normal_data.mean():.2f}")
print(f"Binomial - shape: {binomial_data.shape}, mean: {binomial_data.mean():.2f}")

# Verify reproducibility by resetting the seed and regenerating
np.random.seed(42)
uniform_data_check = np.random.uniform(0, 1, size=1000)

# The first 5 values should be identical to the original uniform_data
print(f"\\nFirst 5 values match: {np.array_equal(uniform_data[:5], uniform_data_check[:5])}")
`,
    },
    {
      id: "numpy-checkpoint",
      slug: "numpy-checkpoint",
      title: "Checkpoint: Build a Mini Data Pipeline",
      content: `# Checkpoint: Build a Mini Data Pipeline

You've spent this module learning NumPy's building blocks — arrays, slicing, broadcasting, vectorized math, and linear algebra. Now it's time to put them all together into something real.

A **data pipeline** is the backbone of every ML project. Before any model sees data, it must be loaded, cleaned, normalized, and split. In this checkpoint you will build that pipeline from scratch using only NumPy — no pandas, no scikit-learn, no shortcuts.

\`\`\`concept
{ "title": "What Is a Data Pipeline?", "variant": "mental-model", "content": "A data pipeline is a sequence of deterministic transformations that converts raw, messy data into a clean, model-ready matrix. Think of it as an assembly line: raw material enters one end, finished product exits the other. Every step — loading, normalization, splitting — must be reproducible and testable independently." }
\`\`\`

---

## The Four Stages You Will Implement

\`\`\`steps
{ "title": "Mini Data Pipeline — Four Stages", "steps": [ { "title": "1. Ingest — Load raw data into a NumPy array", "content": "Real data often arrives as CSV text. We simulate this with a hard-coded 2-D array (rows = samples, columns = features + label). The last column is always the target \`y\`." }, { "title": "2. Inspect — Compute summary statistics", "content": "Before touching the data, understand it: shape, min, max, mean, standard deviation per feature. Surprises here (e.g. a feature ranging 0–1 000 000 next to one ranging 0–1) predict normalization failures later." }, { "title": "3. Normalize — Bring every feature to a common scale", "content": "**Min-Max scaling** maps each feature to [0, 1] using the formula \`x_scaled = (x - x_min) / (x_max - x_min)\`. **Z-score standardization** instead maps to mean=0, std=1 using \`x_std = (x - mean) / std\`. Both are pure vectorized NumPy — no loops required." }, { "title": "4. Split — Divide into train and test sets", "content": "Shuffle row indices with \`np.random.permutation\`, then slice the first 80 % as train and the remaining 20 % as test. The split is deterministic when you fix \`np.random.seed\`." } ] }
\`\`\`

---

## Stage 1 & 2 — Load and Inspect

Let's start with a concrete dataset. Imagine six features about a house: area (sq ft), bedrooms, age (years), distance to city centre (km), number of bathrooms, and garage (0/1). The label is price in thousands.

\`\`\`playground
{ "title": "Load raw data and compute summary statistics", "language": "python", "code": "import numpy as np\\n\\n# Simulated CSV-like dataset\\n# Columns: area, bedrooms, age, dist_km, bathrooms, garage, price_k\\nraw = np.array([\\n    [1200, 3, 15, 5.2, 2, 1, 340],\\n    [850,  2, 30, 8.1, 1, 0, 210],\\n    [2100, 4, 5,  2.0, 3, 1, 580],\\n    [640,  1, 45, 12.3,1, 0, 145],\\n    [1750, 3, 10, 3.8, 2, 1, 460],\\n    [980,  2, 22, 6.7, 2, 0, 270],\\n    [1450, 3, 8,  4.1, 2, 1, 390],\\n    [720,  2, 35, 9.5, 1, 0, 190],\\n    [1900, 4, 3,  1.5, 3, 1, 530],\\n    [1100, 2, 18, 7.0, 2, 1, 300],\\n], dtype=np.float64)\\n\\n# Separate features (X) from labels (y)\\nX = raw[:, :-1]   # all rows, all columns except last\\ny = raw[:, -1]    # all rows, last column only\\n\\nprint('=== Dataset shape ===')\\nprint(f'X shape: {X.shape}   (samples x features)')\\nprint(f'y shape: {y.shape}   (samples,)\\\\n')\\n\\n# Summary statistics — axis=0 collapses over rows → stats per feature\\nfeature_names = ['area', 'bedrooms', 'age', 'dist_km', 'bathrooms', 'garage']\\nprint('=== Feature Summary ===')\\nprint(f'{\\"Feature\\":<12} {\\"Min\\":>8} {\\"Max\\":>8} {\\"Mean\\":>8} {\\"Std\\":>8}')\\nprint('-' * 48)\\nfor i, name in enumerate(feature_names):\\n    col = X[:, i]\\n    print(f'{name:<12} {col.min():>8.2f} {col.max():>8.2f} {col.mean():>8.2f} {col.std():>8.2f}')\\n\\nprint(f'\\\\n=== Label (price_k) ===')\\nprint(f'Min: {y.min():.0f}k   Max: {y.max():.0f}k   Mean: {y.mean():.0f}k   Std: {y.std():.1f}k')\\n", "runnable": true }
\`\`\`

Notice the scale mismatch: \`area\` reaches 2100 while \`garage\` is binary 0/1. If you fed this raw to a gradient-descent algorithm, the \`area\` gradient would dominate and learning would stall. That's exactly why normalization is stage 3.

---

## Stage 3 — Normalize

\`\`\`concept
{ "title": "Min-Max vs Z-Score Normalization", "variant": "rule", "content": "Use **Min-Max** when you need values strictly in [0, 1] (e.g. pixel intensities, neural network inputs with sigmoid output). Use **Z-Score** when the algorithm assumes Gaussian-distributed features (e.g. linear/logistic regression, PCA). Both are computed with a single vectorized line — no Python for-loop needed." }
\`\`\`

\`\`\`trace
{ "title": "Min-Max Normalization — Step by Step", "language": "python", "code": "import numpy as np\\n\\nX = np.array([[1200, 3], [850, 2], [2100, 4], [640, 1]], dtype=np.float64)\\n\\nx_min = X.min(axis=0)\\nx_max = X.max(axis=0)\\n\\nX_norm = (X - x_min) / (x_max - x_min)", "frames": [ { "line": 3, "vars": { "X.shape": "[4, 2]" }, "note": "Raw X — area in col 0, bedrooms in col 1. Scales are wildly different." }, { "line": 5, "vars": { "x_min": "[640, 1]" }, "note": "axis=0 reduces over rows → one minimum per feature column." }, { "line": 6, "vars": { "x_max": "[2100, 4]" }, "note": "Same for max. Range = x_max - x_min = [1460, 3]." }, { "line": 8, "vars": { "X_norm[0]": "[0.38, 0.67]", "X_norm[2]": "[1.00, 1.00]" }, "note": "Broadcasting: (X - x_min) and / (x_max - x_min) both broadcast over all rows simultaneously. No loop." } ], "speed": 900 }
\`\`\`

\`\`\`playground
{ "title": "Implement both normalization strategies", "language": "python", "code": "import numpy as np\\n\\nX = np.array([\\n    [1200, 3, 15, 5.2, 2, 1],\\n    [850,  2, 30, 8.1, 1, 0],\\n    [2100, 4, 5,  2.0, 3, 1],\\n    [640,  1, 45, 12.3,1, 0],\\n    [1750, 3, 10, 3.8, 2, 1],\\n    [980,  2, 22, 6.7, 2, 0],\\n    [1450, 3, 8,  4.1, 2, 1],\\n    [720,  2, 35, 9.5, 1, 0],\\n    [1900, 4, 3,  1.5, 3, 1],\\n    [1100, 2, 18, 7.0, 2, 1],\\n], dtype=np.float64)\\n\\n# --- Min-Max normalization ---\\ndef minmax_normalize(X):\\n    x_min = X.min(axis=0)          # shape (n_features,)\\n    x_max = X.max(axis=0)          # shape (n_features,)\\n    return (X - x_min) / (x_max - x_min)\\n\\n# --- Z-Score standardization ---\\ndef zscore_normalize(X):\\n    mean = X.mean(axis=0)          # shape (n_features,)\\n    std  = X.std(axis=0)           # shape (n_features,)\\n    return (X - mean) / std\\n\\nX_mm  = minmax_normalize(X)\\nX_zsc = zscore_normalize(X)\\n\\nprint('Min-Max result (first 3 rows):')\\nprint(np.round(X_mm[:3], 3))\\nprint(f'Min: {X_mm.min():.3f}   Max: {X_mm.max():.3f}\\\\n')\\n\\nprint('Z-Score result (first 3 rows):')\\nprint(np.round(X_zsc[:3], 3))\\nprint(f'Mean (col 0): {X_zsc[:, 0].mean():.6f}   Std (col 0): {X_zsc[:, 0].std():.3f}')\\n", "runnable": true }
\`\`\`

---

## Stage 4 — Train / Test Split

\`\`\`concept
{ "title": "Why Shuffle Before Splitting?", "variant": "insight", "content": "If your data arrived sorted by label (e.g. all cheap houses first, all expensive houses last), a naive head/tail split would put all cheap houses in train and all expensive ones in test. The model would never learn the expensive end. Shuffling row indices first ensures both sets see the full distribution of labels." }
\`\`\`

\`\`\`algoviz
{ "title": "Shuffle → Split (10 samples, 80/20)", "type": "array", "data": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "frames": [ { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "Original row indices [0..9] — in order, possibly sorted by label", "stats": { "step": "start" } }, { "highlight": [0,1,2,3,4,5,6,7,8,9], "label": "np.random.seed(42) — fixes the shuffle for reproducibility", "stats": { "seed": 42 } }, { "highlight": [6,1,4,9,0,7,3,8,2,5], "label": "np.random.permutation(10) → shuffled index array", "stats": { "permuted": "[6,1,4,9,0,7,3,8,2,5]" } }, { "highlight": [6,1,4,9,0,7], "label": "First 8 indices (80%) → TRAIN set", "stats": { "train_size": 8 } }, { "highlight": [3,8,2,5], "label": "Last 2 indices (20%) → TEST set", "stats": { "test_size": 2 } } ], "speed": 900 }
\`\`\`

---

## Putting It All Together

Now combine all four stages into one clean pipeline function:

\`\`\`playground
{ "title": "Complete mini data pipeline", "language": "python", "code": "import numpy as np\\n\\n# ── Raw data (same as before) ──────────────────────────────────────────────\\nraw = np.array([\\n    [1200,3,15,5.2,2,1,340],[850,2,30,8.1,1,0,210],[2100,4,5,2.0,3,1,580],\\n    [640,1,45,12.3,1,0,145],[1750,3,10,3.8,2,1,460],[980,2,22,6.7,2,0,270],\\n    [1450,3,8,4.1,2,1,390],[720,2,35,9.5,1,0,190],[1900,4,3,1.5,3,1,530],\\n    [1100,2,18,7.0,2,1,300],\\n], dtype=np.float64)\\n\\n# ── Stage 1: Ingest ────────────────────────────────────────────────────────\\ndef load(raw):\\n    X = raw[:, :-1]\\n    y = raw[:, -1]\\n    return X, y\\n\\n# ── Stage 2: Inspect ──────────────────────────────────────────────────────\\ndef summary(X, y):\\n    print(f'Samples: {X.shape[0]}   Features: {X.shape[1]}')\\n    print(f'Label   — mean: {y.mean():.1f}   std: {y.std():.1f}   range: [{y.min():.0f}, {y.max():.0f}]')\\n\\n# ── Stage 3: Normalize (z-score) ──────────────────────────────────────────\\ndef normalize(X):\\n    mean = X.mean(axis=0)\\n    std  = X.std(axis=0)\\n    return (X - mean) / std, mean, std   # return params for inference time\\n\\n# ── Stage 4: Split ────────────────────────────────────────────────────────\\ndef train_test_split(X, y, test_ratio=0.2, seed=42):\\n    np.random.seed(seed)\\n    n = X.shape[0]\\n    idx = np.random.permutation(n)\\n    split = int(n * (1 - test_ratio))\\n    train_idx, test_idx = idx[:split], idx[split:]\\n    return X[train_idx], X[test_idx], y[train_idx], y[test_idx]\\n\\n# ── Run the pipeline ──────────────────────────────────────────────────────\\nX, y           = load(raw)\\nprint('=== Summary (raw) ===')\\nsummary(X, y)\\n\\nX_norm, mu, sigma = normalize(X)\\nprint('\\\\n=== After Z-score normalization ===')\\nprint(f'Col-0 mean: {X_norm[:,0].mean():.6f}   std: {X_norm[:,0].std():.3f}')\\n\\nX_tr, X_te, y_tr, y_te = train_test_split(X_norm, y, test_ratio=0.2)\\nprint(f'\\\\nTrain: {X_tr.shape}   Test: {X_te.shape}')\\nprint(f'Train labels: {y_tr}')\\nprint(f'Test  labels: {y_te}')\\n", "runnable": true }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Fit normalization on TRAIN only", "content": "Always compute \`mean\` and \`std\` (or \`min\`/\`max\`) from the **training set only**, then apply those same parameters to the test set. If you compute stats on the full dataset before splitting, information from the test set leaks into training — a form of data leakage that inflates evaluation metrics." }
\`\`\`

---

## Fill in the Blanks

\`\`\`fillblank
{ "title": "Complete the normalization functions", "prompt": "Implement min-max normalization and z-score standardization using only NumPy operations. Both functions must work without any Python for-loops.", "language": "python", "template": "import numpy as np\\n\\ndef minmax(X):\\n    x_min = X.min(___)\\n    x_max = X.max(axis=0)\\n    return (X - x_min) / (x_max - x_min)\\n\\ndef zscore(X):\\n    mu  = X.___(axis=0)\\n    sig = X.std(___)\\n    return (X - mu) / sig\\n\\n# Quick test\\nA = np.array([[0.0, 100.0], [5.0, 200.0], [10.0, 300.0]])\\nprint(minmax(A))   # [[0,0],[0.5,0.5],[1,1]]\\nprint(zscore(A).mean(axis=0))  # ~[0, 0]", "blanks": [ { "answer": "axis=0", "hint": "Reduce over rows to get one value per column — which axis is that?" }, { "answer": "mean", "hint": "Z-score centers data by subtracting the average value." }, { "answer": "axis=0", "hint": "Same axis as mean — compute std per feature column, not per row." } ] }
\`\`\`

---

## Common Mistakes to Avoid

\`\`\`tabs
{ "tabs": [ { "label": "Leaking test data", "icon": "🚨", "content": "**Wrong:** normalize the full dataset, then split.\\n\\n\`\`\`python\\n# BAD — test stats contaminate training\\nX_norm = zscore(X_all)\\nX_tr, X_te, y_tr, y_te = split(X_norm, y)\\n\`\`\`\\n\\n**Right:** split first, then fit on train only.\\n\\n\`\`\`python\\n# GOOD\\nX_tr, X_te, y_tr, y_te = split(X, y)\\nX_tr_norm, mu, sig = zscore_fit_transform(X_tr)\\nX_te_norm = (X_te - mu) / sig   # reuse train params\\n\`\`\`" }, { "label": "Not fixing the seed", "icon": "🎲", "content": "Without \`np.random.seed(42)\` every run produces a different split, making experiments non-reproducible.\\n\\n\`\`\`python\\n# BAD — different split every run\\nidx = np.random.permutation(n)\\n\\n# GOOD — deterministic\\nnp.random.seed(42)\\nidx = np.random.permutation(n)\\n\`\`\`\\n\\nAlways set the seed **immediately before** the shuffle call, not at the top of the file, so the split is insulated from other random calls." }, { "label": "Zero std division", "icon": "⚠️", "content": "A constant column (e.g. all zeros) has \`std = 0\`, causing division-by-zero in z-score.\\n\\n\`\`\`python\\n# Safe version\\ndef zscore_safe(X):\\n    mu  = X.mean(axis=0)\\n    sig = X.std(axis=0)\\n    sig[sig == 0] = 1.0   # constant features → leave unchanged\\n    return (X - mu) / sig\\n\`\`\`\\n\\nAlways check \`np.any(X.std(axis=0) == 0)\` during the inspect stage." }, { "label": "Shape confusion", "icon": "📐", "content": "When you slice a 2-D array with a single column index, NumPy returns a 1-D array:\\n\\n\`\`\`python\\nX = np.zeros((10, 6))\\ny = X[:, -1]       # shape (10,)  ← 1-D\\ny = X[:, -1:]      # shape (10,1) ← 2-D (keeps the axis)\\n\`\`\`\\n\\nFor labels \`y\` in regression, shape \`(n,)\` is fine. For matrix ops (e.g. \`X.T @ y\`) you may need \`y.reshape(-1, 1)\` to get \`(n, 1)\`." } ] }
\`\`\`

---

## Knowledge Check

\`\`\`quiz
{ "title": "Data Pipeline Checkpoint", "questions": [ { "question": "You have 500 samples. You call \`zscore(X_all)\` to normalize, then split 80/20. What problem does this introduce?", "options": [ "The test set will have wrong labels", "Normalization statistics are computed using test-set values, leaking future information into training", "The split ratio will be incorrect", "Z-score cannot be applied before splitting" ], "answer": 1, "explanation": "Computing mean and std on the full dataset before splitting means the training normalization parameters were influenced by test-set values. The model effectively 'sees' test data during preprocessing — this is data leakage and inflates evaluation metrics." }, { "question": "What does \`X.min(axis=0)\` return for a matrix of shape (100, 6)?", "options": [ "A scalar — the global minimum across all elements", "A 1-D array of shape (100,) — the minimum of each row", "A 1-D array of shape (6,) — the minimum of each column", "A 2-D array of shape (1, 6)" ], "answer": 2, "explanation": "axis=0 collapses the row dimension, producing one value per column. The result has shape (6,) — one minimum per feature. This is exactly what min-max and z-score normalization need." }, { "question": "After \`np.random.seed(42)\` and \`idx = np.random.permutation(10)\`, what is guaranteed?", "options": [ "idx will always be [0,1,2,...,9] in sorted order", "idx will be the same shuffled order every time the code runs", "idx will be different each run but statistically uniform", "The first element of idx will always be 0" ], "answer": 1, "explanation": "Setting the seed fixes NumPy's random number generator state. Every subsequent call to permutation (or any other random function) produces the same sequence, making experiments fully reproducible." }, { "question": "Min-max normalization maps feature values to which range?", "options": [ "(-1, 1)", "(0, 1)", "Mean 0, std 1", "The range depends on the feature's original distribution" ], "answer": 1, "explanation": "Min-max scaling applies \`(x - x_min) / (x_max - x_min)\`. The minimum value maps to 0, the maximum to 1, and all others fall linearly in between." }, { "question": "Which NumPy operation correctly separates features X and labels y from a matrix where the last column is the target?", "options": [ "X = raw[:, 0:-1]  and  y = raw[:, -1]", "X = raw[0:-1, :]  and  y = raw[-1, :]", "X = raw[:, :-1]   and  y = raw[:, -1]", "Both A and C are correct" ], "answer": 3, "explanation": "raw[:, :-1] selects all rows and all columns except the last. raw[:, -1] selects all rows and only the last column. Options A and C are identical Python syntax — both are correct. Option B would split by rows instead of columns, which is wrong." } ] }
\`\`\`

---

## Why This Matters for Everything Ahead

Every ML model you will build in this course — linear regression, logistic regression, neural networks — expects its input matrix \`X\` to be:

1. **Numeric** — no strings, no missing values
2. **Consistently scaled** — so gradient descent converges in reasonable time
3. **Split honestly** — train/test sets independent, no leakage

The four-stage pipeline you built here is not a toy exercise. It is the literal preprocessing skeleton used inside scikit-learn's \`Pipeline\`, PyTorch's \`DataLoader\`, and TensorFlow's \`tf.data\`. When you eventually use those frameworks, you will recognise exactly what they are abstracting.

\`\`\`collapse
{ "title": "Deep Dive: Why does scale affect gradient descent convergence?", "content": "Gradient descent updates weights proportional to the partial derivative of the loss. If feature A has range [0, 1] and feature B has range [0, 10000], the loss surface is shaped like a narrow ravine: gradients point steeply across the ravine (feature B direction) but nearly flat along it (feature A direction).\\n\\nThe optimizer oscillates across the ravine while crawling along it, requiring a tiny learning rate to stay stable. This is slow and fragile.\\n\\nAfter z-score normalization both features have std ≈ 1, the loss surface becomes more spherical, and gradients point more directly toward the minimum. You can use a larger learning rate and convergence is faster and more stable.\\n\\nThis is why every serious ML practitioner normalizes before training — it is not optional polish, it is foundational correctness." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "A data pipeline has four stages: Ingest → Inspect → Normalize → Split. Implement each as a pure function.", "Always compute normalization parameters (mean, std, min, max) on the training set only, then apply them to the test set — computing on the full dataset before splitting is data leakage.", "Use axis=0 to compute per-feature statistics across rows. Broadcasting eliminates all Python for-loops.", "Fix np.random.seed before any shuffle to guarantee reproducible train/test splits across runs.", "Min-max normalization maps to [0, 1]; z-score standardization maps to mean=0, std=1. Choose based on your model's assumptions.", "Guard against zero-std columns (constant features) by replacing std=0 with 1 before dividing." ] }
\`\`\``,
      starterCode: `import numpy as np

# Raw CSV-like data: [age, income, hours_per_week, satisfaction_score]
raw_data = np.array([
    [25, 45000, 40, 7],
    [32, 72000, 45, 8],
    [28, 38000, 35, 6],
    [45, 95000, 50, 9],
    [22, 28000, 30, 5],
    [38, 61000, 42, 7],
    [55, 110000, 48, 8],
    [29, 52000, 38, 6],
    [41, 83000, 44, 9],
    [35, 67000, 41, 7],
], dtype=float)

# TODO 1: Normalize the data using min-max normalization.
# Formula: (x - min) / (max - min)
# Apply column-wise so each feature scales to [0, 1].
# Store result in \`normalized\`.
normalized = None

# TODO 2: Split into train (80%) and test (20%) sets.
# Use the first 80% of rows for training, remaining for testing.
# Store results in \`X_train\` and \`X_test\`.
X_train = None
X_test = None

# TODO 3: Compute summary statistics on the ORIGINAL raw_data (column-wise).
# Calculate: mean, standard deviation, min, and max for each feature.
# Store each as a 1D array of shape (4,).
col_mean = None
col_std = None
col_min = None
col_max = None

# --- Verification (do not modify) ---
print("Normalized data (first 3 rows):")
print(normalized[:3].round(3))
print(f"\\nTrain set shape: {X_train.shape}, Test set shape: {X_test.shape}")
print(f"\\nColumn means:  {col_mean}")
print(f"Column stds:   {col_std.round(2)}")
print(f"Column mins:   {col_min}")
print(f"Column maxes:  {col_max}")
`,
      solutionCode: `import numpy as np

# Raw CSV-like data: [age, income, hours_per_week, satisfaction_score]
raw_data = np.array([
    [25, 45000, 40, 7],
    [32, 72000, 45, 8],
    [28, 38000, 35, 6],
    [45, 95000, 50, 9],
    [22, 28000, 30, 5],
    [38, 61000, 42, 7],
    [55, 110000, 48, 8],
    [29, 52000, 38, 6],
    [41, 83000, 44, 9],
    [35, 67000, 41, 7],
], dtype=float)

# Step 1: Min-max normalization (column-wise)
# axis=0 computes min/max across rows, giving one value per column
col_min_vals = raw_data.min(axis=0)
col_max_vals = raw_data.max(axis=0)
normalized = (raw_data - col_min_vals) / (col_max_vals - col_min_vals)

# Step 2: Train/test split (80/20)
# Calculate the cutoff index and slice the array
n_samples = raw_data.shape[0]          # total number of rows
split_idx = int(n_samples * 0.8)       # 8 rows for train, 2 for test
X_train = normalized[:split_idx]       # rows 0-7
X_test  = normalized[split_idx:]       # rows 8-9

# Step 3: Summary statistics on the original raw data (column-wise)
col_mean = raw_data.mean(axis=0)       # mean of each feature
col_std  = raw_data.std(axis=0)        # standard deviation of each feature
col_min  = raw_data.min(axis=0)        # minimum of each feature
col_max  = raw_data.max(axis=0)        # maximum of each feature

# --- Verification ---
print("Normalized data (first 3 rows):")
print(normalized[:3].round(3))
print(f"\\nTrain set shape: {X_train.shape}, Test set shape: {X_test.shape}")
print(f"\\nColumn means:  {col_mean}")
print(f"Column stds:   {col_std.round(2)}")
print(f"Column mins:   {col_min}")
print(f"Column maxes:  {col_max}")
`,
    },
  ],
};
