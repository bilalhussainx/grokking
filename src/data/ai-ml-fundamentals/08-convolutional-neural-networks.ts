import { Module } from "../types";

export const convolutionalNeuralNetworksModule: Module = {
  id: "convolutional-neural-networks",
  title: "Convolutional Neural Networks",
  description: "Master the convolution operation, pooling, and CNN architectures. Build and train a CNN from scratch, then explore transfer learning for practical image classification.",
  lessons: [
    {
      id: "convolution-operation",
      slug: "convolution-operation",
      title: "The Convolution Operation from Scratch",
      content: `# The Convolution Operation from Scratch

A fully connected layer treating a 224×224 image as a flat vector has 224×224×3 = 150,528 input weights per neuron — absurd, slow, and ignoring spatial structure entirely. **Convolution** exploits three properties of images: local connectivity, weight sharing, and translation invariance. One small filter slides across the entire image, detecting the same pattern anywhere it appears.

\`\`\`concept
{ "title": "Convolution: A Sliding Detector", "variant": "analogy", "content": "Imagine you're looking for the letter 'e' in text. You don't use different detector circuits for 'e at position 1', 'e at position 2' etc. You use the same mental pattern and slide it left to right. A convolution filter does exactly this: one set of weights (the kernel) is applied at every position in the image, producing a feature map that shows where the pattern was detected." }
\`\`\`

## The Math

For a 2D input X and kernel K of size (kH, kW):

\`\`\`
Output[i, j] = sum over m,n of: X[i+m, j+n] * K[m, n] + bias
\`\`\`

Output spatial dimensions (no padding, stride=1):
- Output H = (Input H - kernel H) + 1
- Output W = (Input W - kernel W) + 1

\`\`\`playground
{ "title": "2D Convolution from Scratch", "language": "python", "code": "import numpy as np\\n\\ndef conv2d(X, K, stride=1, padding=0):\\n    if padding > 0:\\n        X = np.pad(X, padding, mode='constant')\\n    H, W = X.shape\\n    kH, kW = K.shape\\n    out_H = (H - kH) // stride + 1\\n    out_W = (W - kW) // stride + 1\\n    output = np.zeros((out_H, out_W))\\n    for i in range(out_H):\\n        for j in range(out_W):\\n            patch = X[i*stride:i*stride+kH, j*stride:j*stride+kW]\\n            output[i, j] = np.sum(patch * K)\\n    return output\\n\\n# Horizontal edge detector kernel\\nhorizontal_edge = np.array([\\n    [-1, -1, -1],\\n    [ 0,  0,  0],\\n    [ 1,  1,  1]\\n])\\n\\n# Simple image (1=bright, 0=dark)\\nimage = np.array([\\n    [0, 0, 0, 0, 0],\\n    [0, 0, 0, 0, 0],\\n    [1, 1, 1, 1, 1],  # horizontal edge here\\n    [1, 1, 1, 1, 1],\\n    [1, 1, 1, 1, 1],\\n])\\n\\nresult = conv2d(image, horizontal_edge)\\nprint('Input image:')\\nprint(image)\\nprint('Feature map (horizontal edge detector):')\\nprint(result)\\nprint('High values indicate edge locations')\\n", "runnable": true }
\`\`\`

## Weight Sharing and Parameter Efficiency

A 3×3 filter on a 28×28 image produces a 26×26 feature map. Number of parameters: just 9 (the filter weights) + 1 bias = **10 parameters** — regardless of image size. A fully connected layer from 784 to 676 neurons would need 784×676 = 530,184 parameters. Convolution is ~53,000× more parameter-efficient here.

\`\`\`concept
{ "title": "Three Key Properties", "variant": "info", "content": "1. Local connectivity: each output depends only on a local patch (the receptive field). 2. Weight sharing: the same filter weights are reused at every position — one edge detector finds edges everywhere. 3. Translation equivariance: if the input pattern shifts right by 3 pixels, the feature map shifts right by 3 pixels." }
\`\`\`

\`\`\`quiz
{ "question": "A 5×5 image is convolved with a 3×3 kernel, stride=1, no padding. What is the output spatial size?", "options": ["5×5 — same as input", "3×3 — same as kernel", "7×7 — larger than input", "3×3 computed as (5-3)/1+1=3"], "answer": 3, "explanation": "Output size = (H - kH) / stride + 1 = (5 - 3) / 1 + 1 = 3. So the output is 3×3. Without padding, convolution reduces spatial dimensions by (kH - 1) = 2 pixels in each dimension. To preserve spatial size, use 'same' padding: pad by (kH-1)/2 = 1 pixel on each side, giving (5+2-3)/1+1 = 5×5." }
\`\`\`

\`\`\`takeaways
{ "points": ["Convolution slides a filter across the input — one filter detects one pattern everywhere in the image", "Parameter count = kH × kW × in_channels × out_channels + bias — independent of image size", "Output size = (H + 2·pad - kH) / stride + 1", "Same padding (pad=(kH-1)/2) preserves spatial dimensions; valid padding (pad=0) reduces them"] }
\`\`\``,
    },
    {
      id: "pooling-and-stride",
      slug: "pooling-and-stride",
      title: "Pooling, Stride, and Receptive Fields",
      content: `# Pooling, Stride, and Receptive Fields

After convolution, feature maps are still spatially large. **Pooling** and **stride** reduce spatial dimensions, making computations tractable and building translation invariance. The **receptive field** determines how much of the original image influences each output neuron.

\`\`\`concept
{ "title": "Why Reduce Spatial Dimensions?", "variant": "info", "content": "A VGG-16 processing a 224×224 image through 13 conv layers would produce a 224×224×512 feature map without downsampling — 25.7 million values just for one forward pass. Pooling and stride progressively compress spatial resolution while increasing channel depth, making the network computationally feasible and increasingly abstract." }
\`\`\`

\`\`\`playground
{ "title": "Max and Average Pooling", "language": "python", "code": "import numpy as np\\n\\ndef max_pool2d(x, pool_size=2, stride=2):\\n    H, W = x.shape\\n    out_H = (H - pool_size) // stride + 1\\n    out_W = (W - pool_size) // stride + 1\\n    out = np.zeros((out_H, out_W))\\n    for i in range(out_H):\\n        for j in range(out_W):\\n            patch = x[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]\\n            out[i, j] = patch.max()\\n    return out\\n\\ndef avg_pool2d(x, pool_size=2, stride=2):\\n    H, W = x.shape\\n    out_H = (H - pool_size) // stride + 1\\n    out_W = (W - pool_size) // stride + 1\\n    out = np.zeros((out_H, out_W))\\n    for i in range(out_H):\\n        for j in range(out_W):\\n            patch = x[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]\\n            out[i, j] = patch.mean()\\n    return out\\n\\nfeat = np.array([\\n    [0.1, 0.9, 0.2, 0.8],\\n    [0.2, 0.7, 0.1, 0.6],\\n    [0.8, 0.3, 0.9, 0.2],\\n    [0.7, 0.4, 0.8, 0.1],\\n])\\n\\nprint('Input (4x4):')\\nprint(feat.round(1))\\nprint('Max Pool 2x2 stride 2:')\\nprint(max_pool2d(feat).round(2))\\nprint('Avg Pool 2x2 stride 2:')\\nprint(avg_pool2d(feat).round(2))\\n", "runnable": true }
\`\`\`

## Receptive Field Growth

For L conv layers with kernel size k, stride 1: **Receptive field = (k-1)×L + 1**

With stride-2 or pooling, it grows multiplicatively. Deep networks have huge receptive fields — a VGG unit in layer 13 sees the entire 224×224 input.

\`\`\`compare
{ "title": "Max Pool vs Strided Convolution", "left": { "label": "Max Pooling", "points": ["No learnable parameters", "Hard downsampling — discards non-max values", "Translation invariant by design", "Gradient blocked for non-max values", "Standard for classification (LeNet, VGG)"] }, "right": { "label": "Strided Convolution", "points": ["Learnable downsampling", "Softer information compression", "Used in modern architectures (ResNet, DCGAN)", "Gradients flow everywhere", "Replaces pooling in many contemporary designs"] } }
\`\`\`

\`\`\`quiz
{ "question": "A CNN has two conv layers (3×3 kernel, stride=1) followed by one 2×2 max pool (stride=2). What is the receptive field of one output unit of the max pool?", "options": ["3×3", "5×5", "6×6", "10×10"], "answer": 2, "explanation": "After first conv (3×3): RF=3. After second conv on layer 1 output: RF=(3+2)=5 in original space. After 2×2 max pool stride 2: each pool output covers 2×2 of conv2 output, mapping to (5+1)=6 of the original input. RF=6×6." }
\`\`\`

\`\`\`takeaways
{ "points": ["Max pool retains strongest activation — answers 'was the feature present anywhere in this region?'", "Strided conv is a learnable alternative to pooling — preferred in modern architectures", "Receptive field grows with depth — deep networks see more of the input per output unit", "Global Average Pooling (GAP) replaces FC layers: average spatial dimensions per channel"] }
\`\`\``,
    },
    {
      id: "cnn-architectures",
      slug: "cnn-architectures",
      title: "Classic CNN Architectures: LeNet, VGG, and ResNet",
      content: `# Classic CNN Architectures: LeNet, VGG, and ResNet

The history of CNN architectures solves successive problems: insufficient depth (VGG), vanishing gradients (ResNet), and computational efficiency (bottleneck blocks). Each breakthrough enabled a new scale of depth and accuracy.

\`\`\`concept
{ "title": "Architecture Evolution", "variant": "info", "content": "LeNet (1989): proof of concept for convolutions. AlexNet (2012): deep conv nets on ImageNet — started the deep learning era. VGG (2014): systematic depth with 3×3 kernels. ResNet (2015): skip connections enabling 100+ layer networks. Each step addresses a specific failure mode of the previous generation." }
\`\`\`

## VGG: Depth with 3×3 Kernels

VGG's key insight: two stacked 3×3 conv layers have the same receptive field as one 5×5 layer, but fewer parameters (2×9=18 vs 25) and an extra nonlinearity. Systematically stacking blocks of 2-3 conv layers before each max pool gives VGG-16/19.

## ResNet: Solving Vanishing Gradients

\`\`\`concept
{ "title": "The Residual Block", "variant": "info", "content": "Adding more layers to VGG makes training worse — gradients vanish through 20+ layers. ResNet's solution: skip connections. Instead of learning H(x), the block learns F(x) = H(x) - x (the residual). Output = F(x) + x. If the optimal mapping is the identity, F(x)=0 is easier to learn than H(x)=x. Crucially, gradients flow directly through the skip connection." }
\`\`\`

\`\`\`playground
{ "title": "Residual Block in NumPy", "language": "python", "code": "import numpy as np\\n\\ndef relu(x):\\n    return np.maximum(0, x)\\n\\ndef batch_norm(x):\\n    return (x - x.mean()) / (x.std() + 1e-5)\\n\\ndef residual_block(x, W1, b1, W2, b2):\\n    # Standard path\\n    z1 = relu(batch_norm(W1 @ x + b1))\\n    z2 = batch_norm(W2 @ z1 + b2)\\n    # Skip connection: add input directly\\n    return relu(z2 + x)\\n\\nnp.random.seed(42)\\nd = 64\\nW1 = np.random.randn(d, d) * 0.01\\nb1 = np.zeros(d)\\nW2 = np.random.randn(d, d) * 0.01\\nb2 = np.zeros(d)\\n\\nx_in = np.random.randn(d)\\nx_out = residual_block(x_in, W1, b1, W2, b2)\\n\\nprint(f'Input norm:  {np.linalg.norm(x_in):.4f}')\\nprint(f'Output norm: {np.linalg.norm(x_out):.4f}')\\nprint(f'At init (near-zero W), residual is ~0, so output ~ input')\\nprint(f'||out - in|| = {np.linalg.norm(x_out - x_in):.4f}')\\n", "runnable": true }
\`\`\`

\`\`\`compare
{ "title": "VGG-16 vs ResNet-50", "left": { "label": "VGG-16", "points": ["16 layers (13 conv + 3 FC)", "138M parameters", "No skip connections", "Training degrades past ~19 layers", "Top-5 error: 7.3% on ImageNet"] }, "right": { "label": "ResNet-50", "points": ["50 layers with residual blocks", "25M parameters (fewer than VGG!)", "Skip connections every 2-3 layers", "Scales to 152+ layers", "Top-5 error: 5.25% on ImageNet"] } }
\`\`\`

\`\`\`quiz
{ "question": "VGG uses two 3×3 conv layers instead of one 5×5 layer. What are the two main advantages?", "options": ["Fewer parameters and one extra ReLU nonlinearity — strictly more expressive per parameter", "Larger receptive field and faster training speed", "Better translation invariance and higher memory efficiency", "More channels and smaller feature maps"], "answer": 0, "explanation": "Two 3×3 layers: 2×(3×3×C×C)=18C² parameters. One 5×5: 25C² parameters — 28% more. Two layers also add an extra ReLU between them. Same 5×5 receptive field, fewer parameters, more nonlinearity." }
\`\`\`

\`\`\`takeaways
{ "points": ["VGG: stack 3×3 layers — fewer parameters, more nonlinearities than large kernels with same receptive field", "ResNet skip connections: output = F(x) + x — at init, F(x)≈0, so output≈input — stable gradients from day one", "ResNet-50 uses 1×1→3×3→1×1 bottleneck blocks to reduce channel count before expensive 3×3 conv", "Use a pretrained ResNet (or EfficientNet) as starting point rather than training from scratch"] }
\`\`\``,
    },
    {
      id: "transfer-learning",
      slug: "transfer-learning",
      title: "Transfer Learning: Fine-Tuning Pretrained Models",
      content: `# Transfer Learning: Fine-Tuning Pretrained Models

Training a ResNet-50 on ImageNet from scratch requires ~90 GPU-hours. Transfer learning starts from a model that already understands edges, textures, shapes, and object parts — and adapts it to your task in minutes with a small dataset.

\`\`\`concept
{ "title": "Features Transfer Across Domains", "variant": "analogy", "content": "A biologist learning to diagnose X-rays doesn't start from scratch learning what lines and shadows look like — they transfer that visual knowledge and learn only the disease-specific patterns. CNN layers similarly learn general visual features (early: edges, textures) that transfer across domains, leaving only the task-specific head to learn from scratch." }
\`\`\`

## Three Transfer Learning Strategies

\`\`\`tabs
{ "tabs": [ { "label": "Feature extraction (frozen)", "content": "Freeze all pretrained weights. Replace the final FC layer with a new head matching your class count. Only train the new head.\\n\\nBest for: very small dataset (<1K images), domain similar to ImageNet.\\nAdvantage: fast, minimal data, no catastrophic forgetting." }, { "label": "Fine-tuning last blocks", "content": "Start from pretrained weights. Unfreeze last 1-3 blocks + new head. Train with LR 10-100× smaller than normal.\\n\\nBest for: medium dataset (1K-100K), slightly different domain.\\nAdvantage: adapts high-level features to your domain." }, { "label": "Full fine-tuning", "content": "Unfreeze all layers. Train end-to-end with small LR and warmup.\\n\\nBest for: large dataset, domain quite different from ImageNet.\\nAdvantage: maximum adaptation. Risk: catastrophic forgetting if LR too high." } ] }
\`\`\`

\`\`\`playground
{ "title": "Transfer Learning Strategy Selector", "language": "python", "code": "import numpy as np\\n\\ndef recommend_strategy(n_images, domain_similarity):\\n    '''\\n    n_images: training set size\\n    domain_similarity: 'high' (natural photos) | 'medium' | 'low' (medical, satellite)\\n    '''\\n    print(f'Dataset size: {n_images} images')\\n    print(f'Domain similarity to ImageNet: {domain_similarity}')\\n    print()\\n    if n_images < 1000:\\n        strategy = 'Feature extraction (frozen backbone, train head only)'\\n        lr = '1e-3 for head'\\n    elif n_images < 10000:\\n        if domain_similarity == 'high':\\n            strategy = 'Unfreeze last 1-2 blocks + head'\\n            lr = '1e-4 for blocks, 1e-3 for head'\\n        else:\\n            strategy = 'Unfreeze last 2-3 blocks + head'\\n            lr = '5e-5 for blocks, 1e-4 for head'\\n    else:\\n        if domain_similarity == 'low':\\n            strategy = 'Full fine-tuning with warmup'\\n            lr = '1e-4 with 500-step warmup'\\n        else:\\n            strategy = 'Unfreeze last 3-4 blocks + head'\\n            lr = '1e-4 for blocks'\\n    print(f'Recommended strategy: {strategy}')\\n    print(f'Learning rate: {lr}')\\n\\nprint('=== Scenario 1: 500 chest X-rays ===')\\nrecommend_strategy(500, 'low')\\nprint()\\nprint('=== Scenario 2: 5,000 product photos ===')\\nrecommend_strategy(5000, 'high')\\nprint()\\nprint('=== Scenario 3: 50,000 satellite images ===')\\nrecommend_strategy(50000, 'low')\\n", "runnable": true }
\`\`\`

\`\`\`quiz
{ "question": "You have 500 labeled X-ray images for pneumonia classification. Which approach is best?", "options": ["Full fine-tuning from ImageNet weights, normal LR", "Feature extraction only (frozen backbone, train new head)", "Train ResNet-50 from scratch on 500 images", "Feature extraction, then fine-tune last 2 blocks with LR=1e-5"], "answer": 3, "explanation": "500 images is too few for full fine-tuning (overfitting risk). Pure feature extraction may underfit because X-rays differ substantially from ImageNet. Best: feature extraction first (get a good head), then carefully fine-tune the last few blocks at very low LR (1e-5), letting the network adapt high-level features to the medical domain without destroying low-level detectors." }
\`\`\`

\`\`\`takeaways
{ "points": ["Start from a pretrained model — training from scratch on small data is almost always worse", "Frozen backbone: only train the head — works with <1K images, safe from catastrophic forgetting", "Fine-tune last blocks with LR 10-100× smaller than normal to prevent destroying pretrained features", "The more different your domain from ImageNet, the more layers you should unfreeze"] }
\`\`\``,
    },
    {
      id: "data-augmentation",
      slug: "data-augmentation",
      title: "Data Augmentation for Image Models",
      content: `# Data Augmentation for Image Models

A model's generalization is bounded by its training data diversity. Data augmentation synthetically expands the training set by applying label-preserving transformations — rotations, flips, crops, color jitter. A dog rotated 90° is still a dog. The model must learn to be invariant to these transformations.

\`\`\`concept
{ "title": "Augmentation as a Regularizer", "variant": "info", "content": "Data augmentation is one of the most effective regularization techniques, especially for small datasets. It prevents memorizing exact pixel patterns and forces learning of robust, transformation-invariant features. Unlike dropout or L2, augmentation adds genuine new information derived from the problem domain's structure." }
\`\`\`

\`\`\`playground
{ "title": "Augmentation Pipeline from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass Augmentor:\\n    def __init__(self, flip_p=0.5, brightness_range=0.2):\\n        self.flip_p = flip_p\\n        self.brightness_range = brightness_range\\n\\n    def horizontal_flip(self, img):\\n        if np.random.rand() < self.flip_p:\\n            return img[:, ::-1]\\n        return img\\n\\n    def brightness_jitter(self, img):\\n        factor = 1 + np.random.uniform(-self.brightness_range, self.brightness_range)\\n        return np.clip(img * factor, 0, 1)\\n\\n    def random_crop(self, img, crop_ratio=0.85):\\n        H, W = img.shape[:2]\\n        new_H, new_W = int(H * crop_ratio), int(W * crop_ratio)\\n        top  = np.random.randint(0, H - new_H + 1)\\n        left = np.random.randint(0, W - new_W + 1)\\n        return img[top:top+new_H, left:left+new_W]\\n\\n    def __call__(self, img):\\n        img = self.horizontal_flip(img)\\n        img = self.brightness_jitter(img)\\n        img = self.random_crop(img)\\n        return img\\n\\nnp.random.seed(42)\\nimg = np.random.rand(8, 8)\\naug = Augmentor()\\nprint('Original shape:', img.shape)\\nfor i in range(3):\\n    a = aug(img)\\n    print(f'Augmented {i+1} shape: {a.shape}, mean: {a.mean():.3f}')\\n", "runnable": true }
\`\`\`

## Augmentation Techniques by Strength

\`\`\`tabs
{ "tabs": [ { "label": "Standard (always use)", "content": "- Random horizontal flip (not vertical for natural images)\\n- Random crop + resize (crop 80-100%, resize to original)\\n- Color jitter: brightness, contrast, saturation (small amounts)\\n- Normalize: subtract ImageNet mean [0.485, 0.456, 0.406], divide std [0.229, 0.224, 0.225]" }, { "label": "Strong (small datasets)", "content": "- Cutout / Random Erasing: zero out a random rectangle\\n- MixUp: blend two images x=lambda*x1+(1-lambda)*x2, blend labels too\\n- CutMix: paste a crop from image B onto image A, mix labels by area ratio\\n- RandAugment: randomly apply N transforms from a fixed policy" }, { "label": "Test-Time Augmentation (TTA)", "content": "At inference: apply multiple augmentations to the same test image, average predictions.\\nExample: original + horizontal flip + center crop → average 3 softmax outputs.\\nTypically +0.2-0.5% accuracy at cost of 3× inference time." } ] }
\`\`\`

\`\`\`quiz
{ "question": "MixUp creates x = 0.7·x₁ + 0.3·x₂ with label y = 0.7·y₁ + 0.3·y₂. What property does this encourage?", "options": ["The model learns to detect which of the two images is dominant", "The model's outputs should interpolate linearly between classes when inputs are linearly interpolated — smoother decision boundaries", "The model learns to ignore blended inputs and focus on sharp features", "The model learns to detect image composition artifacts"], "answer": 1, "explanation": "MixUp enforces that the model's predictions must be linear in the input space. If the model predicts 'cat' for x₁ and 'dog' for x₂, it should predict 70% cat / 30% dog for 0.7x₁+0.3x₂. This regularization produces smoother decision boundaries and reduces overconfident out-of-distribution predictions." }
\`\`\`

\`\`\`takeaways
{ "points": ["Random crop + horizontal flip + color jitter is the standard baseline — always use for image classification", "MixUp and CutMix enforce linear interpolation of predictions — typically +1-2% accuracy on benchmarks", "Test-time augmentation averages predictions over multiple augmented versions — free accuracy at inference time", "Augmentation should be domain-appropriate: horizontal flip OK for natural images, not for medical imaging"] }
\`\`\``,
    },
    {
      id: "object-detection-intro",
      slug: "object-detection-intro",
      title: "From Classification to Detection: YOLO Intuition",
      content: `# From Classification to Detection: YOLO Intuition

Image classification answers "what is in this image?" Object detection answers "what is it and where?" — outputting both class labels and bounding boxes. This changes the problem from a simple softmax to a multi-output regression + classification task.

\`\`\`concept
{ "title": "Detection as Three Simultaneous Problems", "variant": "info", "content": "A detector must solve: (1) Is there an object here? (objectness score), (2) What class is it? (classification), (3) Where exactly? (bounding box regression: x_center, y_center, width, height). These are trained jointly with a combined loss. The challenge: doing this efficiently for many possible objects in one image." }
\`\`\`

## YOLO: You Only Look Once

\`\`\`steps
{ "steps": [ { "title": "Divide image into S×S grid", "description": "E.g., 7×7 = 49 cells. Each cell is responsible for detecting objects whose center falls in that cell." }, { "title": "Each cell predicts B bounding boxes", "description": "B=2 per cell: each box predicts (x, y, w, h, confidence). Confidence = P(object) × IoU(predicted, ground truth)." }, { "title": "Each cell predicts C class probabilities", "description": "C class scores (e.g., 80 for COCO). Output tensor: S×S×(B×5 + C) = 7×7×90. One forward pass, all predictions." }, { "title": "Non-Maximum Suppression", "description": "Multiple cells may detect the same object. NMS keeps the highest-confidence box and suppresses overlapping boxes with IoU > threshold (typically 0.5)." } ] }
\`\`\`

\`\`\`playground
{ "title": "IoU Calculation", "language": "python", "code": "import numpy as np\\n\\ndef iou(box1, box2):\\n    # boxes: [x1, y1, x2, y2] (top-left, bottom-right)\\n    ix1 = max(box1[0], box2[0])\\n    iy1 = max(box1[1], box2[1])\\n    ix2 = min(box1[2], box2[2])\\n    iy2 = min(box1[3], box2[3])\\n    inter = max(0, ix2-ix1) * max(0, iy2-iy1)\\n    area1 = (box1[2]-box1[0]) * (box1[3]-box1[1])\\n    area2 = (box2[2]-box2[0]) * (box2[3]-box2[1])\\n    union = area1 + area2 - inter\\n    return inter / union if union > 0 else 0\\n\\ndef nms(boxes, scores, iou_threshold=0.5):\\n    # boxes: list of [x1,y1,x2,y2], scores: list of floats\\n    order = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)\\n    keep = []\\n    while order:\\n        i = order.pop(0)\\n        keep.append(i)\\n        order = [j for j in order if iou(boxes[i], boxes[j]) < iou_threshold]\\n    return keep\\n\\ngt = [10, 10, 50, 50]\\npred1 = [12, 12, 48, 48]  # good overlap\\npred2 = [40, 40, 80, 80]  # poor overlap\\nprint(f'IoU (good):  {iou(gt, pred1):.3f}  (>0.5 = correct detection)')\\nprint(f'IoU (poor):  {iou(gt, pred2):.3f}')\\n\\n# NMS demo\\nboxes = [[10,10,50,50], [12,12,48,48], [100,100,150,150]]\\nscores = [0.9, 0.85, 0.7]\\nkept = nms(boxes, scores)\\nprint(f'\\\\nNMS keeps box indices: {kept}')\\nprint('Box 0 and 1 overlap (IoU>0.5), lower score box 1 suppressed')\\n", "runnable": true }
\`\`\`

\`\`\`quiz
{ "question": "YOLO uses a 7×7 grid on a 448×448 image. A dog's bounding box center is at pixel (200, 150). Which grid cell is responsible?", "options": ["Cell (row=3, col=2)", "Cell (row=0, col=0) — top-left always handles primary object", "Cell (row=3, col=3) — the center cell", "Whichever cell has highest confidence after forward pass"], "answer": 0, "explanation": "Each cell covers 448/7=64 pixels. Column index = floor(200/64)=3, Row index = floor(150/64)=2. So cell (row=2, col=3) — or expressed as (3,2) by some conventions. Responsibility is assigned by where the ground truth bounding box center falls — unambiguous during training." }
\`\`\`

\`\`\`takeaways
{ "points": ["Object detection = classification + bounding box regression done simultaneously in one forward pass", "YOLO: S×S grid, each cell predicts B boxes and C class scores — one pass, real-time capable (30-90 FPS)", "IoU = intersection/union — measures box overlap; >0.5 is correct detection by PASCAL VOC convention", "NMS removes duplicate detections: keep highest-confidence box, suppress any overlapping box with IoU>threshold"] }
\`\`\``,
    },
    {
      id: "cnn-checkpoint",
      slug: "cnn-checkpoint",
      title: "Checkpoint: Build a CNN Image Classifier",
      content: `# Checkpoint: Build a CNN Image Classifier

\`\`\`callout
{ "variant": "info", "title": "Module Checkpoint", "content": "This checkpoint consolidates convolution, pooling, architectures, transfer learning, and augmentation. Work through the quiz battery, then implement the architecture blueprint below." }
\`\`\`

## Architecture Blueprint: Fashion-MNIST

\`\`\`playground
{ "title": "CNN for Fashion-MNIST — Architecture Analysis", "language": "python", "code": "import numpy as np\\n\\n# Architecture: Input 28x28x1\\n# Conv1: 32 filters 3x3, stride=1, same padding -> 28x28x32 -> ReLU -> MaxPool 2x2 -> 14x14x32\\n# Conv2: 64 filters 3x3, stride=1, same padding -> 14x14x64 -> ReLU -> MaxPool 2x2 -> 7x7x64\\n# Flatten: 7*7*64 = 3136\\n# FC1: 3136 -> 256 -> ReLU -> Dropout(0.5)\\n# FC2: 256 -> 10 -> Softmax\\n\\nlayers = [\\n    ('Conv1', '32x3x3x1 + 32', 32*(3*3*1)+32, '28x28x32'),\\n    ('MaxPool', 'none', 0, '14x14x32'),\\n    ('Conv2', '64x3x3x32 + 64', 64*(3*3*32)+64, '14x14x64'),\\n    ('MaxPool', 'none', 0, '7x7x64'),\\n    ('Flatten', 'none', 0, '3136'),\\n    ('FC1', '256x3136 + 256', 256*3136+256, '256'),\\n    ('Dropout', 'p=0.5', 0, '256'),\\n    ('FC2', '10x256 + 10', 10*256+10, '10'),\\n]\\n\\nprint(f'{\"Layer\":<12} {\"Output Shape\":<14} {\"Params\":>10}')\\nprint('-' * 42)\\ntotal = 0\\nfor name, desc, params, shape in layers:\\n    print(f'{name:<12} {shape:<14} {params:>10,}')\\n    total += params\\nprint('-' * 42)\\nprint(f'{\"TOTAL\":<12} {\"\":<14} {total:>10,}')\\n\\nprint()\\nprint('Expected accuracy benchmarks on Fashion-MNIST:')\\nbenchmarks = [\\n    ('Logistic Regression', '84%'),\\n    ('2-layer MLP', '88%'),\\n    ('This CNN (no augmentation)', '92-93%'),\\n    ('CNN + augmentation + dropout', '94-95%'),\\n]\\nfor name, acc in benchmarks:\\n    print(f'  {name:<35} {acc}')\\n", "runnable": true }
\`\`\`

## Quiz Battery

\`\`\`quiz
{ "question": "A CNN outputs logits [2.1, -0.3, 1.5, 0.8, -1.2, 0.4, 1.9, -0.5, 0.7, 0.1]. Which class is predicted without computing softmax?", "options": ["Class 2 (logit 1.5)", "Class 0 (logit 2.1)", "Class 6 (logit 1.9)", "Cannot determine without softmax"], "answer": 1, "explanation": "Softmax is order-preserving — it never changes the ranking of values. argmax(softmax(z)) = argmax(z) always. Class 0 has logit 2.1, the highest. No need to compute exponentials for prediction — only needed when you need probability values." }
\`\`\`

\`\`\`quiz
{ "question": "Your CNN achieves 99% train accuracy and 72% validation accuracy. The best single intervention is:", "options": ["Add more conv layers for better feature extraction", "Increase the learning rate to escape the local minimum", "Add Dropout(0.5) before the FC layer and apply random crop + flip augmentation", "Use a larger batch size for better gradient estimates"], "answer": 2, "explanation": "A 27% train/val gap is severe overfitting. The direct fixes are regularization (dropout) and data diversity (augmentation). More layers increase capacity — worsening overfitting. Higher LR addresses speed, not generalization. Dropout + augmentation together typically close such a gap to 3-5%." }
\`\`\`

\`\`\`quiz
{ "question": "Training a CNN for medical image classification with 2,000 labeled images. The BEST approach is:", "options": ["Train ResNet-50 from scratch on 2,000 images", "Pretrained ResNet-50, freeze all layers, train new head for your classes", "Logistic regression on flattened pixel values", "Train a 10-layer CNN from scratch with heavy augmentation"], "answer": 1, "explanation": "2,000 images is too small to train any deep CNN from scratch — severe overfitting guaranteed. Feature extraction from pretrained ResNet-50 gives you benefits of 1.2M ImageNet training images. Low-level features (edges, textures) transfer even from natural photos to medical images. With 20K+ images, unfreeze the last blocks for further adaptation." }
\`\`\`

\`\`\`takeaways
{ "points": ["Always use pretrained models for small datasets — even mismatched domains benefit from transferred feature detectors", "Overfitting (large train/val gap): fix with dropout + augmentation + weight decay, not more capacity", "argmax(logits) = argmax(softmax) — compute softmax only when you need probability values", "Fashion-MNIST baseline: CNN gets ~93% without augmentation; +augmentation+dropout gets ~95%"] }
\`\`\``,
    },
  ],
};
