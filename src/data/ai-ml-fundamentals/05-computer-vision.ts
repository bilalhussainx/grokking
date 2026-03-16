import { Module } from "../types";

export const computerVisionModule: Module = {
  id: "aiml-computer-vision",
  title: "Computer Vision Intro",
  description:
    "Learn how machines see images through convolutions, feature maps, and pooling. Understand the architecture of CNNs and implement key operations from scratch.",
  lessons: [
    {
      id: "aiml-how-machines-see",
      slug: "how-machines-see",
      title: "How Machines See Images",
      content: `## How Machines See Images

<!-- voice:section_check -->

To a computer, an image is just a matrix of numbers. Understanding this representation is the first step to building systems that "see."

### Images as Arrays

A grayscale image is a 2D array where each value (0-255) represents pixel brightness:

\`\`\`python
# A tiny 3x3 grayscale image
image = np.array([
    [0,   128, 255],   # black, gray, white
    [64,  192, 32],
    [255, 0,   128]
])
\`\`\`

A color image has 3 channels (Red, Green, Blue), forming a 3D array:
- Shape: (height, width, 3)
- A 1080p image: (1080, 1920, 3) = 6.2 million values

### Why Regular Neural Networks Fail on Images

A fully connected network treating each pixel as a feature would need:
- 1080 * 1920 * 3 = 6,220,800 input weights per hidden neuron
- Ignores spatial structure (nearby pixels are related)
- No translation invariance (a cat in the corner vs. center requires different weights)

### The Key Insight: Local Patterns

Images have **spatial locality** — nearby pixels form edges, textures, and shapes. We do not need every pixel connected to every neuron. We need **local feature detectors** that scan across the image.

<!-- voice:key_insight -->

### Convolution: The Core Operation

A **convolution** slides a small filter (kernel) across the image, computing a dot product at each position:

\`\`\`
Input (5x5)          Filter (3x3)         Output (3x3)
1 0 1 0 1            1  0 -1              ? ? ?
0 1 0 1 0            0  1  0              ? ? ?
1 0 1 0 1            -1 0  1              ? ? ?
0 1 0 1 0
1 0 1 0 1
\`\`\`

At each position, multiply element-wise and sum. The filter detects a specific pattern (edges, corners, textures).

### Pooling: Downsampling

**Max pooling** takes the maximum value in each region, reducing spatial dimensions:

\`\`\`
Input (4x4)           Max Pool (2x2)      Output (2x2)
1 3 | 2 1            stride=2             3 2
0 2 | 1 0            -------->            4 3
----+----
4 1 | 0 3
2 0 | 1 2
\`\`\`

Benefits: reduces computation, provides translation invariance, keeps strongest activations.

### CNN Architecture

A typical CNN stacks: Conv -> ReLU -> Pool -> Conv -> ReLU -> Pool -> Flatten -> Dense -> Output

- Early layers detect edges and textures
- Middle layers detect parts (eyes, wheels)
- Late layers detect objects (faces, cars)

### Key Takeaway

CNNs exploit the spatial structure of images through local convolution filters that are shared across all positions. This dramatically reduces parameters and builds in translation invariance.

### Further Reading

- LeCun, Y. et al. (1998). "Gradient-based learning applied to document recognition." *Proceedings of the IEEE*.
- Krizhevsky, A., Sutskever, I., & Hinton, G. (2012). "ImageNet classification with deep convolutional neural networks." *NeurIPS*.`,
    },
    {
      id: "aiml-convolution-exercise",
      slug: "convolution-exercise",
      title: "Exercise: Implement 2D Convolution",
      content: `## Exercise: Implement 2D Convolution

Build the convolution and max pooling operations from scratch. These are the building blocks of every CNN.

### Convolution Details

For an input of size (H, W) and kernel of size (K, K):
- Output size: (H - K + 1, W - K + 1) with no padding
- At each position (i, j): sum of element-wise product of the kernel and the input region

### Max Pooling Details

For an input of size (H, W) and pool size (P, P) with stride P:
- Output size: (H // P, W // P)
- At each position: take the maximum value in the PxP region

### Hints

- Use nested loops for clarity (production code uses optimized libraries)
- For convolution: \`output[i, j] = np.sum(region * kernel)\`
- Edge detection kernel: \`[[-1,-1,-1],[0,0,0],[1,1,1]]\` detects horizontal edges`,
      starterCode: `import numpy as np

def convolve2d(image, kernel):
    """Apply a 2D convolution (no padding, stride 1).

    Args:
        image: 2D numpy array of shape (H, W)
        kernel: 2D numpy array of shape (K, K)
    Returns:
        2D numpy array: convolution output
    """
    H, W = image.shape
    K = kernel.shape[0]

    # TODO: Compute output dimensions
    out_h = None
    out_w = None
    output = np.zeros((out_h, out_w))

    # TODO: Slide kernel across image and compute dot product
    for i in range(out_h):
        for j in range(out_w):
            # TODO: Extract region and compute sum of element-wise product
            pass

    return output

def max_pool2d(image, pool_size=2):
    """Apply 2D max pooling with given pool size and stride = pool_size.

    Args:
        image: 2D numpy array of shape (H, W)
        pool_size: size of the pooling window
    Returns:
        2D numpy array: pooled output
    """
    H, W = image.shape

    # TODO: Compute output dimensions
    out_h = None
    out_w = None
    output = np.zeros((out_h, out_w))

    # TODO: For each pool_size x pool_size region, take the max
    for i in range(out_h):
        for j in range(out_w):
            pass

    return output

def apply_edge_detection(image):
    """Apply horizontal and vertical edge detection kernels.

    Args:
        image: 2D numpy array
    Returns:
        tuple: (horizontal_edges, vertical_edges)
    """
    # TODO: Define horizontal edge kernel [[-1,-1,-1],[0,0,0],[1,1,1]]
    # TODO: Define vertical edge kernel [[-1,0,1],[-1,0,1],[-1,0,1]]
    # TODO: Apply both kernels using convolve2d
    pass

# Test cases
image = np.array([
    [1, 2, 3, 0, 1],
    [0, 1, 2, 3, 0],
    [3, 0, 1, 2, 1],
    [1, 2, 0, 1, 3],
    [0, 1, 3, 2, 0]
], dtype=float)

kernel = np.array([
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
], dtype=float)

result = convolve2d(image, kernel)
print(f"Convolution output shape: {result.shape}")
# Expected: (3, 3)

print(f"Convolution output:\\n{result}")
# Expected: 3x3 matrix with edge-detected values

pooled = max_pool2d(image, pool_size=2)
print(f"\\nMax pool output shape: {pooled.shape}")
# Expected: (2, 2)

print(f"Max pool output:\\n{pooled}")
# Expected: [[2, 3], [3, 3]] (taking max in each 2x2 region)

h_edges, v_edges = apply_edge_detection(image)
print(f"\\nHorizontal edges shape: {h_edges.shape}")
# Expected: (3, 3)`,
      solutionCode: `import numpy as np

def convolve2d(image, kernel):
    """Apply a 2D convolution (no padding, stride 1).

    Args:
        image: 2D numpy array of shape (H, W)
        kernel: 2D numpy array of shape (K, K)
    Returns:
        2D numpy array: convolution output
    """
    H, W = image.shape
    K = kernel.shape[0]

    out_h = H - K + 1
    out_w = W - K + 1
    output = np.zeros((out_h, out_w))

    for i in range(out_h):
        for j in range(out_w):
            region = image[i:i + K, j:j + K]
            output[i, j] = np.sum(region * kernel)

    return output

def max_pool2d(image, pool_size=2):
    """Apply 2D max pooling with given pool size and stride = pool_size.

    Args:
        image: 2D numpy array of shape (H, W)
        pool_size: size of the pooling window
    Returns:
        2D numpy array: pooled output
    """
    H, W = image.shape

    out_h = H // pool_size
    out_w = W // pool_size
    output = np.zeros((out_h, out_w))

    for i in range(out_h):
        for j in range(out_w):
            region = image[
                i * pool_size:(i + 1) * pool_size,
                j * pool_size:(j + 1) * pool_size
            ]
            output[i, j] = np.max(region)

    return output

def apply_edge_detection(image):
    """Apply horizontal and vertical edge detection kernels.

    Args:
        image: 2D numpy array
    Returns:
        tuple: (horizontal_edges, vertical_edges)
    """
    h_kernel = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=float)
    v_kernel = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=float)
    return convolve2d(image, h_kernel), convolve2d(image, v_kernel)

# Time complexity: O(out_h * out_w * K * K) for convolution
# Space complexity: O(out_h * out_w) for output

# Test cases
image = np.array([
    [1, 2, 3, 0, 1],
    [0, 1, 2, 3, 0],
    [3, 0, 1, 2, 1],
    [1, 2, 0, 1, 3],
    [0, 1, 3, 2, 0]
], dtype=float)

kernel = np.array([
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
], dtype=float)

result = convolve2d(image, kernel)
print(f"Convolution output shape: {result.shape}")
# Expected: (3, 3)

print(f"Convolution output:\\n{result}")
# Expected: 3x3 matrix with edge-detected values

pooled = max_pool2d(image, pool_size=2)
print(f"\\nMax pool output shape: {pooled.shape}")
# Expected: (2, 2)

print(f"Max pool output:\\n{pooled}")
# Expected: [[2, 3], [3, 3]] (taking max in each 2x2 region)

h_edges, v_edges = apply_edge_detection(image)
print(f"\\nHorizontal edges shape: {h_edges.shape}")
# Expected: (3, 3)`,
    },
    {
      id: "aiml-cv-checkpoint",
      slug: "computer-vision-checkpoint",
      title: "Checkpoint: Computer Vision",
      content: `## Checkpoint: Computer Vision

<!-- voice:section_check -->

Test your understanding of how CNNs process images.

---

### Question 1
A 6x6 grayscale image is convolved with a 3x3 kernel (no padding, stride 1). What is the output size?

A) 6x6
B) 4x4
C) 3x3
D) 8x8

**Answer: B** — Output size = (H - K + 1, W - K + 1) = (6 - 3 + 1, 6 - 3 + 1) = (4, 4). The kernel cannot be centered on edge pixels without padding, so the output shrinks.

---

### Question 2
Why do CNNs use shared weights (the same filter applied at every spatial position)?

A) To reduce memory usage during inference
B) To achieve translation invariance — detecting a feature regardless of its position
C) To make training faster
D) To prevent overfitting

**Answer: B** — Weight sharing means the same filter detects the same pattern (e.g., a vertical edge) everywhere in the image. A cat's ear is detected by the same filter whether it appears in the top-left or bottom-right corner.

---

### Question 3
What does max pooling accomplish?

A) It increases the spatial resolution of feature maps
B) It adds non-linearity to the network
C) It downsamples feature maps, reducing computation and providing some translation invariance
D) It normalizes pixel values

**Answer: C** — Max pooling reduces spatial dimensions by taking the maximum value in each pooling window. This reduces computation for subsequent layers and provides small translation invariance (the exact position of a feature within the pooling window does not matter).

---

### Question 4
In a typical CNN, what do the early convolutional layers tend to learn?

A) Complete objects (faces, cars)
B) Low-level features like edges and textures
C) Semantic concepts and categories
D) Color histograms

**Answer: B** — Visualization studies (Zeiler & Fergus, 2014) show that early layers learn simple edge detectors and texture patterns. Deeper layers combine these into parts (eyes, wheels), and the deepest layers represent whole objects.

---

### Question 5
A fully connected network on a 224x224x3 image with a hidden layer of 1000 neurons would have how many weights in just the first layer?

A) About 150,000
B) About 1.5 million
C) About 150 million
D) About 1.5 billion

**Answer: C** — 224 * 224 * 3 * 1000 = 150,528,000. This is why CNNs with weight sharing are essential — a 3x3 conv filter has only 27 parameters regardless of image size.`,
    },
  ],
};
