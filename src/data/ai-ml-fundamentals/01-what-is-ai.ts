import { Module } from "../types";

export const whatIsAIModule: Module = {
  id: "aiml-what-is-ai",
  title: "What is AI?",
  description:
    "Understand the history, core concepts, and taxonomy of artificial intelligence. Learn to distinguish between narrow AI, general AI, and the major paradigms that power modern intelligent systems.",
  lessons: [
    {
      id: "aiml-history-of-ai",
      slug: "history-of-ai",
      title: "A Brief History of AI",
      content: `## A Brief History of AI

<!-- voice:section_check -->

Artificial Intelligence has gone through dramatic cycles of hype and disappointment since its inception. Understanding this history helps you separate real capabilities from marketing buzz.

### The Birth (1950s-1960s)

In 1950, Alan Turing published "Computing Machinery and Intelligence," posing the famous question: "Can machines think?" He proposed the **Turing Test** — if a machine can fool a human into thinking it is human in conversation, it exhibits intelligence.

In 1956, John McCarthy organized the **Dartmouth Conference**, coining the term "Artificial Intelligence." Early optimism was enormous. Herbert Simon predicted in 1965 that "machines will be capable, within twenty years, of doing any work a man can do."

### The First AI Winter (1970s)

Reality hit hard. Early AI systems were **brittle** — they worked on toy problems but failed on real-world complexity. The Lighthill Report (1973) in the UK concluded that AI had failed to achieve its grand ambitions, leading to massive funding cuts.

### Expert Systems Era (1980s)

AI rebounded with **expert systems** — programs encoding human expertise as if-then rules. XCON at DEC saved the company \$40 million per year by configuring computer orders. But expert systems were expensive to maintain and could not learn from data.

### The Second AI Winter (Late 1980s-1990s)

Expert systems proved too rigid. The Japanese Fifth Generation Computer project failed to meet expectations. Funding dried up again.

<!-- voice:key_insight -->

### The Deep Learning Revolution (2010s-Present)

Three factors converged to ignite the modern AI boom:

1. **Data**: The internet generated massive datasets for training
2. **Compute**: GPUs made large-scale neural network training feasible
3. **Algorithms**: Breakthroughs in deep learning architectures (AlexNet 2012, Transformers 2017)

Key milestones:
- **2012**: AlexNet wins ImageNet, cutting error rates in half
- **2016**: AlphaGo defeats world Go champion Lee Sedol
- **2017**: "Attention Is All You Need" introduces the Transformer architecture
- **2022-2024**: Large Language Models (GPT-4, Claude) demonstrate remarkable language understanding

### Key Takeaway

AI progress is not linear. It comes in waves driven by algorithmic breakthroughs, hardware advances, and data availability. The current wave is powered by deep learning and massive compute, but the fundamental challenge remains: building systems that truly *understand* rather than pattern-match.

### Reflection Questions

- Why do you think AI has gone through cycles of hype and disappointment?
- What distinguishes the current AI wave from previous ones?

### Further Reading

- Turing, A. (1950). "Computing Machinery and Intelligence." *Mind*, 59(236).
- McCarthy, J. et al. (1955). "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence."
- LeCun, Y., Bengio, Y., & Hinton, G. (2015). "Deep learning." *Nature*, 521, 436-444.`,
    },
    {
      id: "aiml-types-of-ai",
      slug: "types-of-ai",
      title: "Types of AI: Narrow, General, and Super",
      content: `## Types of AI: Narrow, General, and Super

<!-- voice:section_check -->

Not all AI is created equal. Understanding the taxonomy helps you evaluate claims about what AI can and cannot do.

### Narrow AI (ANI) — What We Have Today

**Narrow AI** (also called Weak AI) is designed to perform a specific task. Every AI system you interact with today is narrow AI:

- Spam filters classify emails
- Recommendation engines suggest videos
- Self-driving cars navigate roads
- ChatGPT generates text

Narrow AI can be superhuman at its specific task (chess, Go, protein folding) while being completely unable to do anything outside its training.

### General AI (AGI) — The Aspiration

**Artificial General Intelligence** would match human cognitive ability across all domains — reasoning, learning, planning, creativity, common sense. AGI does not exist yet and there is active debate about whether and when it will.

Key challenges:
- **Transfer learning**: Humans learn one thing and apply it to novel situations. AI struggles with this.
- **Common sense**: Humans know that "you can pull a string but you cannot push it." AI lacks this intuitive physics.
- **Causal reasoning**: Humans understand *why* things happen. Most AI systems only find correlations.

### Superintelligence (ASI) — The Hypothetical

**Artificial Superintelligence** would surpass the best human minds in every domain. This is purely speculative and is primarily discussed in the context of AI safety research.

<!-- voice:key_insight -->

### The Machine Learning Landscape

Modern AI is dominated by **Machine Learning (ML)** — systems that learn patterns from data rather than following explicit rules.

\`\`\`mermaid
graph TD
    AI["Artificial Intelligence"] --> ML["Machine Learning"]
    AI --> SYM["Symbolic AI"]
    AI --> EVO["Evolutionary Algorithms"]
    AI --> ROB["Robotics"]
    ML --> SUP["Supervised Learning"]
    ML --> UNSUP["Unsupervised Learning"]
    ML --> RL["Reinforcement Learning"]
    ML --> DL["Deep Learning"]
    DL --> CNN["CNNs (Images)"]
    DL --> RNN["RNNs/LSTMs (Sequences)"]
    DL --> TF["Transformers (Language, Vision)"]

    style AI fill:#4f46e5,color:#fff
    style ML fill:#7c3aed,color:#fff
    style DL fill:#a855f7,color:#fff
\`\`\`

### Supervised vs. Unsupervised vs. Reinforcement Learning

| Paradigm | Input | Goal | Example |
|----------|-------|------|---------|
| **Supervised** | Labeled data (X, y pairs) | Predict labels for new data | Email spam detection |
| **Unsupervised** | Unlabeled data (X only) | Find hidden structure | Customer segmentation |
| **Reinforcement** | Environment + rewards | Maximize cumulative reward | Game-playing agents |

### Key Takeaway

All current AI is narrow AI. The field of machine learning provides the tools — supervised, unsupervised, and reinforcement learning — that power today's intelligent systems. Deep learning, a subset of ML using neural networks, drives most recent breakthroughs.

### Reflection Questions

- Can you think of an everyday AI system you use? What type of learning does it likely employ?
- Why might AGI require fundamentally different approaches than narrow AI?`,
    },
    {
      id: "aiml-python-for-ml",
      slug: "python-for-ml",
      title: "Exercise: Python for ML Basics",
      content: `## Exercise: Python for ML Basics

Before diving into ML algorithms, let us ensure you are comfortable with the Python tools we will use throughout this course.

### NumPy Essentials

**NumPy** is the foundation of scientific computing in Python. Every ML library builds on it.

\`\`\`python
import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 3))        # 3x3 matrix of zeros
c = np.random.randn(100)    # 100 random numbers from normal distribution

# Vectorized operations (no loops needed!)
result = a * 2 + 1          # [3, 5, 7, 9, 11]
dot = np.dot(a, a)           # 55 (dot product)
mean = np.mean(c)            # approximately 0.0
\`\`\`

### Why Vectorization Matters

In ML, we operate on large matrices. Vectorized NumPy operations are 10-100x faster than Python loops because they run in optimized C code.

### Your Task

Implement basic statistical functions using only NumPy. These are the building blocks of every ML algorithm.

### Hints

- \`np.sum()\` adds elements; \`np.sqrt()\` takes square root
- Standard deviation = sqrt(mean of squared differences from the mean)
- Normalization scales values to 0-1 range using min and max`,
      starterCode: `import numpy as np

def compute_mean(data):
    """Compute the mean of a numpy array WITHOUT using np.mean().

    Args:
        data: numpy array of numbers
    Returns:
        float: the arithmetic mean
    """
    # TODO: Sum all elements and divide by count
    pass

def compute_std(data):
    """Compute the standard deviation of a numpy array WITHOUT using np.std().

    Args:
        data: numpy array of numbers
    Returns:
        float: the standard deviation
    """
    # TODO: 1. Compute the mean
    # TODO: 2. Compute squared differences from mean
    # TODO: 3. Take mean of squared differences
    # TODO: 4. Take square root
    pass

def normalize(data):
    """Normalize data to [0, 1] range using min-max normalization.

    Formula: (x - min) / (max - min)

    Args:
        data: numpy array of numbers
    Returns:
        numpy array: values scaled to [0, 1]
    """
    # TODO: Apply min-max normalization
    pass

def euclidean_distance(a, b):
    """Compute the Euclidean distance between two numpy arrays.

    Formula: sqrt(sum((a_i - b_i)^2))

    Args:
        a, b: numpy arrays of same length
    Returns:
        float: Euclidean distance
    """
    # TODO: Compute distance
    pass

# Test cases
data = np.array([2.0, 4.0, 6.0, 8.0, 10.0])
print(compute_mean(data))
# Expected: 6.0

print(round(compute_std(data), 4))
# Expected: 2.8284

print(normalize(data))
# Expected: [0.   0.25 0.5  0.75 1.  ]

a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 6.0, 3.0])
print(round(euclidean_distance(a, b), 4))
# Expected: 5.0`,
      solutionCode: `import numpy as np

def compute_mean(data):
    """Compute the mean of a numpy array WITHOUT using np.mean().

    Args:
        data: numpy array of numbers
    Returns:
        float: the arithmetic mean
    """
    return np.sum(data) / len(data)

def compute_std(data):
    """Compute the standard deviation of a numpy array WITHOUT using np.std().

    Args:
        data: numpy array of numbers
    Returns:
        float: the standard deviation
    """
    mean = np.sum(data) / len(data)
    squared_diffs = (data - mean) ** 2
    variance = np.sum(squared_diffs) / len(data)
    return np.sqrt(variance)

def normalize(data):
    """Normalize data to [0, 1] range using min-max normalization.

    Formula: (x - min) / (max - min)

    Args:
        data: numpy array of numbers
    Returns:
        numpy array: values scaled to [0, 1]
    """
    return (data - np.min(data)) / (np.max(data) - np.min(data))

def euclidean_distance(a, b):
    """Compute the Euclidean distance between two numpy arrays.

    Formula: sqrt(sum((a_i - b_i)^2))

    Args:
        a, b: numpy arrays of same length
    Returns:
        float: Euclidean distance
    """
    return np.sqrt(np.sum((a - b) ** 2))

# Time complexity: All operations are O(n) where n is array length
# Space complexity: O(n) for intermediate arrays

# Test cases
data = np.array([2.0, 4.0, 6.0, 8.0, 10.0])
print(compute_mean(data))
# Expected: 6.0

print(round(compute_std(data), 4))
# Expected: 2.8284

print(normalize(data))
# Expected: [0.   0.25 0.5  0.75 1.  ]

a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 6.0, 3.0])
print(round(euclidean_distance(a, b), 4))
# Expected: 5.0`,
    },
    {
      id: "aiml-what-is-ai-checkpoint",
      slug: "what-is-ai-checkpoint",
      title: "Checkpoint: What is AI?",
      content: `## Checkpoint: What is AI?

<!-- voice:section_check -->

Let us review the key concepts from this module before moving on to supervised learning.

---

### Question 1
Which event is widely considered the "birth" of AI as a field?

A) Alan Turing's 1950 paper "Computing Machinery and Intelligence"
B) The 1956 Dartmouth Conference organized by John McCarthy
C) The invention of the perceptron in 1957
D) The release of AlexNet in 2012

**Answer: B** — While Turing's paper laid the philosophical groundwork, the 1956 Dartmouth Conference is where the term "Artificial Intelligence" was coined and the field was formally established as a research discipline.

---

### Question 2
A system that can beat the world champion at Go but cannot write a poem or drive a car is best classified as:

A) Artificial General Intelligence (AGI)
B) Artificial Narrow Intelligence (ANI)
C) Artificial Superintelligence (ASI)
D) Expert System

**Answer: B** — This is narrow AI. It excels at one specific task (playing Go) but has no ability to transfer that intelligence to other domains. All current AI systems are narrow AI.

---

### Question 3
What three factors converged to enable the deep learning revolution starting around 2012?

A) Expert systems, symbolic reasoning, and genetic algorithms
B) Large datasets, GPU computing power, and algorithmic breakthroughs
C) Quantum computing, blockchain, and 5G networks
D) Cloud storage, mobile phones, and social media

**Answer: B** — The deep learning revolution was enabled by massive internet-scale datasets, GPU hardware that could train large neural networks efficiently, and algorithmic innovations like deep convolutional networks and later Transformers.

---

### Question 4
In supervised learning, the model is given:

A) Unlabeled data and must discover structure on its own
B) Labeled data (input-output pairs) and must learn the mapping
C) An environment with rewards and must maximize cumulative reward
D) A set of logical rules to follow

**Answer: B** — Supervised learning uses labeled data where each input has a known correct output. The model learns to predict outputs for new, unseen inputs.

---

### Question 5
Why is NumPy vectorization important for machine learning?

A) It makes code look cleaner
B) It runs operations in optimized C code, making them 10-100x faster than Python loops
C) It automatically parallelizes across GPUs
D) It provides automatic differentiation

**Answer: B** — NumPy's vectorized operations are implemented in C and operate on contiguous memory, making them dramatically faster than Python for-loops. This matters because ML involves millions of operations on large matrices.`,
    },
  ],
};
