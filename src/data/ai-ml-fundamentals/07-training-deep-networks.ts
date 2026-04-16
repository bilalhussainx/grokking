import { Module } from "../types";

export const trainingDeepNetworksModule: Module = {
  id: "training-deep-networks",
  title: "Training Deep Networks: Optimization and Regularization",
  description: "Move beyond vanilla SGD with Adam, momentum, and learning rate schedules. Prevent overfitting with dropout, batch norm, and early stopping.",
  lessons: [
    {
      id: "sgd-momentum",
      slug: "sgd-momentum",
      title: "SGD with Momentum and Nesterov Acceleration",
      content: `# SGD with Momentum and Nesterov Acceleration

Vanilla SGD takes steps proportional to the gradient. On a loss landscape with a narrow ravine (common in deep networks), it oscillates wildly across the ravine while barely advancing along the valley floor. **Momentum** fixes this by accumulating a velocity vector that dampens oscillation and accelerates consistent progress.

\`\`\`concept
{ "title": "Physical Intuition: A Ball Rolling Downhill", "variant": "analogy", "content": "Imagine a ball rolling down a hilly terrain. Without momentum, the ball stops the moment you remove the force. With momentum, the ball keeps rolling — it accumulates velocity in the right direction and resists changes in direction. SGD with momentum does the same: it builds up speed along consistent gradient directions and smooths out noisy updates." }
\`\`\`

## Vanilla SGD vs Momentum Update

| Algorithm | Update Rule |
|-----------|-------------|
| Vanilla SGD | θ ← θ − η · ∇L(θ) |
| Momentum | v ← γv + η∇L(θ), then θ ← θ − v |
| Nesterov | v ← γv + η∇L(θ − γv), then θ ← θ − v |

The momentum term **γ** (typically 0.9) controls how much past gradients contribute. At γ=0.9, the effective update is a weighted average of the last ~10 gradients.

\`\`\`concept
{ "title": "Nesterov: Look Before You Leap", "variant": "info", "content": "Standard momentum adds the velocity first, then computes the gradient. Nesterov Accelerated Gradient (NAG) computes the gradient at the *projected* position (where momentum will take us), then corrects. This lookahead makes Nesterov slightly more responsive and generally converges faster on convex problems." }
\`\`\`

\`\`\`playground
{ "title": "SGD vs Momentum from Scratch", "language": "python", "code": "import numpy as np\\n\\n# Simple quadratic loss: L(w) = w^2 (minimum at w=0)\\ndef grad(w):\\n    return 2 * w\\n\\n# Vanilla SGD\\nw_sgd = 5.0\\nlr = 0.1\\nhistory_sgd = [w_sgd]\\nfor _ in range(20):\\n    w_sgd -= lr * grad(w_sgd)\\n    history_sgd.append(w_sgd)\\n\\n# SGD with Momentum\\nw_mom = 5.0\\nv = 0.0\\ngamma = 0.9\\nhistory_mom = [w_mom]\\nfor _ in range(20):\\n    v = gamma * v + lr * grad(w_mom)\\n    w_mom -= v\\n    history_mom.append(w_mom)\\n\\nprint('Step | SGD w     | Momentum w')\\nprint('-' * 35)\\nfor i in range(0, 21, 4):\\n    print(f'{i:4d} | {history_sgd[i]:9.5f} | {history_mom[i]:9.5f}')\\n\\nprint(f'\\\\nFinal SGD: {history_sgd[-1]:.6f}')\\nprint(f'Final Momentum: {history_mom[-1]:.6f}')\\nprint('(Both approach 0, but momentum converges faster)')\\n", "runnable": true }
\`\`\`

## Why Momentum Helps in Ravines

In a loss ravine: gradients perpendicular to the valley are large and alternating (causing zigzag). Gradients along the valley floor are small and consistent. Momentum *averages out* the perpendicular oscillations (they cancel) and *accumulates* the valley-floor gradient (consistent direction) — net effect: faster progress.

\`\`\`quiz
{ "question": "Momentum with γ=0.9 is applied for many steps. Which type of gradient signal is dampened by the momentum mechanism?", "options": ["Gradients that consistently point in the same direction", "Gradients that alternate direction at each step (oscillations)", "Gradients larger than the learning rate", "Gradients computed on the validation set"], "answer": 1, "explanation": "Oscillating gradients (e.g., +5, -5, +5, -5) cancel out when accumulated with momentum: the running sum stays near zero. Consistent gradients (e.g., +5, +5, +5, +5) accumulate: the running sum grows. This is exactly what makes momentum effective in ravines — it filters noise and amplifies signal." }
\`\`\`

\`\`\`takeaways
{ "points": ["Momentum accumulates a velocity vector — gradients in consistent directions amplify, oscillating gradients cancel", "γ=0.9 is the standard default; effective learning rate becomes η/(1-γ) = 10× the raw learning rate", "Nesterov adds a lookahead: compute gradient at projected position, giving slightly faster convergence", "Momentum is almost always better than vanilla SGD; Adam (next lesson) adapts the learning rate per parameter"] }
\`\`\``,
    },
    {
      id: "adaptive-optimizers",
      slug: "adaptive-optimizers",
      title: "Adaptive Optimizers: RMSProp and Adam",
      content: `# Adaptive Optimizers: RMSProp and Adam

Every parameter in a neural network should ideally have its own learning rate. A parameter updated by sparse gradients (like a word embedding for a rare word) needs a larger effective step. A parameter hammered by dense gradients needs a smaller one. **RMSProp** and **Adam** adapt learning rates per parameter automatically.

\`\`\`concept
{ "title": "The Core Idea: Divide by Gradient Magnitude", "variant": "info", "content": "If gradient g has been consistently large, divide by its running RMS (root mean square) to shrink the effective step. If gradient g has been small, the RMS is small, so dividing amplifies the step. Result: all parameters get updates of roughly similar magnitude regardless of raw gradient scale." }
\`\`\`

## RMSProp

\`\`\`
s ← ρs + (1-ρ)g²          # running average of squared gradients
θ ← θ − (η / √(s + ε)) · g  # divide by RMS
\`\`\`

- **ρ** (decay, typically 0.9): controls how quickly old gradients are forgotten
- **ε** (epsilon, ~1e-8): numerical stability, prevents divide-by-zero

## Adam: RMSProp + Momentum

Adam combines adaptive learning rates (RMSProp) with momentum — the best of both worlds.

\`\`\`
m ← β₁m + (1-β₁)g         # first moment (momentum)
v ← β₂v + (1-β₂)g²        # second moment (squared gradient)
m̂ ← m / (1-β₁ᵗ)           # bias correction
v̂ ← v / (1-β₂ᵗ)           # bias correction
θ ← θ − η · m̂ / (√v̂ + ε)
\`\`\`

Defaults: β₁=0.9, β₂=0.999, η=1e-3, ε=1e-8.

\`\`\`concept
{ "title": "Why Bias Correction?", "variant": "info", "content": "At step t=1, m and v are initialized to 0. After one gradient update: m = 0.1·g (still close to zero, not representative). Bias correction divides by (1-β^t): at t=1, 1-0.9¹=0.1, so m̂=m/0.1=g — the actual gradient. As t→∞, (1-β^t)→1 and correction disappears. Bias correction prevents Adam from taking tiny steps at the start." }
\`\`\`

\`\`\`playground
{ "title": "Adam Optimizer from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass Adam:\\n    def __init__(self, lr=1e-3, beta1=0.9, beta2=0.999, eps=1e-8):\\n        self.lr = lr\\n        self.beta1 = beta1\\n        self.beta2 = beta2\\n        self.eps = eps\\n        self.m = None  # first moment\\n        self.v = None  # second moment\\n        self.t = 0     # step count\\n\\n    def update(self, params, grads):\\n        if self.m is None:\\n            self.m = [np.zeros_like(p) for p in params]\\n            self.v = [np.zeros_like(p) for p in params]\\n        self.t += 1\\n        updated = []\\n        for i, (p, g) in enumerate(zip(params, grads)):\\n            self.m[i] = self.beta1 * self.m[i] + (1 - self.beta1) * g\\n            self.v[i] = self.beta2 * self.v[i] + (1 - self.beta2) * g**2\\n            m_hat = self.m[i] / (1 - self.beta1**self.t)\\n            v_hat = self.v[i] / (1 - self.beta2**self.t)\\n            updated.append(p - self.lr * m_hat / (np.sqrt(v_hat) + self.eps))\\n        return updated\\n\\n# Minimize f(w) = w^2 starting at w=5\\nw = [np.array(5.0)]\\nopt = Adam(lr=0.1)\\nfor step in range(50):\\n    g = [2 * w[0]]  # gradient of w^2 is 2w\\n    w = opt.update(w, g)\\n    if step % 10 == 9:\\n        print(f'Step {step+1:3d}: w = {w[0]:.6f}')\\n", "runnable": true }
\`\`\`

\`\`\`compare
{ "title": "When to Use Which Optimizer", "left": { "label": "Adam", "points": ["Default for most deep learning tasks", "Works well with sparse gradients (NLP, embeddings)", "Less tuning needed — β₁, β₂ rarely need changing", "Sometimes generalizes worse than SGD+momentum on image classification", "Learning rate η=1e-3 is a good starting default"] }, "right": { "label": "SGD + Momentum", "points": ["Often achieves better final accuracy on vision tasks (ResNet, etc.)", "Needs careful LR tuning and schedule", "More interpretable — one global learning rate", "Slower to converge than Adam initially", "η=0.1 with cosine decay is the standard recipe for CNNs"] } }
\`\`\`

\`\`\`quiz
{ "question": "Adam uses β₂=0.999. What does this control, and why is a high value chosen?", "options": ["The momentum of the first moment — high β₂ gives more momentum", "The decay rate of the squared-gradient running average — high β₂ makes it a very stable, slowly updating estimate of gradient magnitude", "The learning rate warmup period — higher β₂ means longer warmup", "The weight decay applied to each parameter"], "answer": 1, "explanation": "β₂ controls how quickly the second moment (v) forgets old squared gradients. At β₂=0.999, roughly 1000 past gradient squares contribute to the current estimate (effective window ≈ 1/(1-β₂)). This produces a very stable estimate of per-parameter gradient magnitude, making the adaptive learning rate smooth and reliable." }
\`\`\`

\`\`\`takeaways
{ "points": ["RMSProp divides each gradient by its running RMS — parameters with large historical gradients get smaller effective LR", "Adam = RMSProp + momentum + bias correction; the bias correction prevents near-zero updates at the start", "Defaults β₁=0.9, β₂=0.999, η=1e-3 work for most tasks — only tune η", "Adam converges faster; SGD+momentum often generalizes better on image tasks — try both"] }
\`\`\``,
    },
    {
      id: "learning-rate-schedules",
      slug: "learning-rate-schedules",
      title: "Learning Rate Schedules and Warmup",
      content: `# Learning Rate Schedules and Warmup

A fixed learning rate is a compromise: too large and training diverges, too small and convergence is glacially slow. **Learning rate schedules** let you use an aggressive rate early (fast progress) and reduce it later (fine-grained convergence to the minimum).

\`\`\`concept
{ "title": "Why the Learning Rate Must Decrease", "variant": "analogy", "content": "Imagine searching for a buried coin in a field. You start by taking big steps to cover ground quickly. As you narrow in on the location, you slow down and feel carefully — big steps would overshoot. Neural network training is similar: a large LR escapes flat regions quickly, but near the minimum it causes oscillation. Annealing lets the optimizer settle into the minimum." }
\`\`\`

## Common Schedules

\`\`\`tabs
{ "tabs": [ { "label": "Step Decay", "content": "Reduce LR by factor γ every N epochs.\\nη(epoch) = η₀ × γ^(epoch // drop_every)\\n\\nSimple and interpretable. Common: halve LR every 30 epochs for ImageNet.\\nDisadvantage: abrupt drops cause loss spikes." }, { "label": "Cosine Annealing", "content": "LR follows a cosine curve from η_max to η_min over T epochs.\\nη(t) = η_min + 0.5(η_max - η_min)(1 + cos(πt/T))\\n\\nSmooth decay, no abrupt drops. State-of-the-art for CNNs and Transformers.\\nVariant: Cosine with warm restarts (SGDR) — restart after each cycle." }, { "label": "Linear Warmup", "content": "Start from a very small LR, linearly increase to η_max over W steps.\\nη(t) = η_max × (t / W) for t ≤ W\\n\\nCritical for large-batch training and Transformers (Adam with warmup).\\nWithout warmup, large initial LR causes early instability and divergence.\\nTypical: W = 4% of total training steps." } ] }
\`\`\`

\`\`\`playground
{ "title": "Cosine Annealing Schedule", "language": "python", "code": "import numpy as np\\n\\ndef cosine_schedule(epoch, T_max, eta_min=0.0, eta_max=0.1):\\n    return eta_min + 0.5 * (eta_max - eta_min) * (1 + np.cos(np.pi * epoch / T_max))\\n\\ndef warmup_cosine(step, warmup_steps, total_steps, eta_max=0.001):\\n    if step < warmup_steps:\\n        return eta_max * (step / warmup_steps)\\n    progress = (step - warmup_steps) / (total_steps - warmup_steps)\\n    return eta_max * 0.5 * (1 + np.cos(np.pi * progress))\\n\\nT = 100\\nepochs = np.arange(T)\\ncosine_lrs = [cosine_schedule(e, T) for e in epochs]\\nwarmup_lrs = [warmup_cosine(s, warmup_steps=10, total_steps=T) for s in epochs]\\n\\nprint('Epoch | Cosine LR   | Warmup+Cosine LR')\\nprint('-' * 42)\\nfor e in [0, 5, 10, 25, 50, 75, 99]:\\n    print(f'{e:5d} | {cosine_lrs[e]:.6f}  | {warmup_lrs[e]:.6f}')\\n", "runnable": true }
\`\`\`

## Warmup is Critical for Large Batches

When using large mini-batches (e.g., 4096 for distributed training), gradients are averaged over more samples — the effective learning rate should be scaled up linearly with batch size (linear scaling rule). But starting at that scaled-up rate causes instability. Warmup solves this: ramp from a small LR to the target over the first few hundred steps, then let the schedule take over.

\`\`\`quiz
{ "question": "A Transformer is trained with Adam (β₁=0.9, β₂=0.999) and cosine annealing. The team skips warmup and starts at η=1e-3. What is the most likely symptom?", "options": ["Training is slower but eventually reaches the same accuracy", "Loss spikes or diverges in the first few hundred steps, then never recovers", "The model overfits faster without warmup", "Validation accuracy improves faster without warmup"], "answer": 1, "explanation": "At step t=1, Adam's second moment estimate (v) is near zero (bias not yet built up despite bias correction). Combined with a large initial gradient, the effective per-parameter step can be enormous. This often causes loss spikes and irreversible parameter damage in the first steps. Warmup keeps the LR tiny while the second moment estimate builds, preventing this instability." }
\`\`\`

\`\`\`takeaways
{ "points": ["Step decay: simple but abrupt. Cosine annealing: smooth, state-of-the-art for most tasks", "Warmup linearly ramps LR from near-zero to η_max over W steps — critical for Transformers and large-batch training", "Linear scaling rule: when batch size ×k, multiply LR ×k — then use warmup to stabilize the new LR", "Cosine with warm restarts (SGDR) can escape local minima by periodically resetting LR to η_max"] }
\`\`\``,
    },
    {
      id: "dropout-regularization",
      slug: "dropout-regularization",
      title: "Dropout: Regularization by Random Deactivation",
      content: `# Dropout: Regularization by Random Deactivation

Overfitting occurs when a network memorizes training data instead of learning generalizable patterns. **Dropout** prevents this by randomly zeroing out a fraction of activations during each forward pass. The network can never rely on any single neuron — it must learn redundant, distributed representations.

\`\`\`concept
{ "title": "Dropout as Ensemble Training", "variant": "analogy", "content": "With dropout rate p=0.5, each forward pass randomly disables half the neurons. With N neurons, there are 2^N possible sub-networks. Training with dropout approximately trains an ensemble of all these sub-networks simultaneously, sharing weights. At test time, all neurons are active but scaled by (1-p) — approximating the ensemble average." }
\`\`\`

## Inverted Dropout

\`\`\`concept
{ "title": "Scaling at Train Time vs Test Time", "variant": "info", "content": "Naive dropout scales outputs at test time by (1-p). Inverted dropout scales at *train time* by 1/(1-p), so test-time code requires no modification — the model just runs as-is. This is the standard implementation (PyTorch, TensorFlow both use inverted dropout)." }
\`\`\`

\`\`\`playground
{ "title": "Inverted Dropout Implementation", "language": "python", "code": "import numpy as np\\n\\nclass Dropout:\\n    def __init__(self, p=0.5):\\n        self.p = p  # probability of KEEPING a neuron (some use drop prob)\\n        self.mask = None\\n        self.training = True\\n\\n    def forward(self, x):\\n        if not self.training:\\n            return x  # no dropout at test time\\n        # Create binary mask: keep with prob p, zero with prob (1-p)\\n        self.mask = (np.random.rand(*x.shape) < self.p) / self.p  # inverted scaling\\n        return x * self.mask\\n\\n    def backward(self, dout):\\n        return dout * self.mask  # same mask as forward\\n\\n# Example\\nnp.random.seed(42)\\ndrop = Dropout(p=0.5)\\nx = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])\\n\\nprint('Input:', x)\\nprint('Forward pass 1:', drop.forward(x))\\nprint('Forward pass 2:', drop.forward(x))\\nprint('Forward pass 3:', drop.forward(x))\\nprint('\\\\nAt test time (no scaling needed):')\\ndrop.training = False\\nprint('Test forward:', drop.forward(x))\\n", "runnable": true }
\`\`\`

## Where to Apply Dropout

- **Fully connected layers**: p=0.5 is standard (Hinton's original paper)
- **Convolutional layers**: rarely used — fewer parameters, less overfitting risk. If needed, p=0.1–0.2
- **Transformer attention**: dropout on attention weights and FFN layers, p=0.1
- **DO NOT use during inference**: always set model.eval() in PyTorch — disables dropout

\`\`\`compare
{ "title": "Dropout vs Other Regularizers", "left": { "label": "Dropout", "points": ["Deactivates random neurons each forward pass", "Implicitly trains exponentially many sub-networks", "Powerful for fully connected layers", "Can slow convergence (more iterations needed)", "Stochastic — different outputs on each forward pass during training"] }, "right": { "label": "L2 Weight Decay", "points": ["Penalizes large weights in the loss: L += λ∑w²", "Encourages small, diffuse weight distributions", "Works for all layer types including convolutions", "Deterministic — same output given same input", "Often combined with dropout for best effect"] } }
\`\`\`

\`\`\`quiz
{ "question": "Inverted dropout with p=0.5 keeps neurons active. During training, kept activations are scaled by 1/0.5=2. Why is this scaling necessary?", "options": ["To increase the gradient magnitude for faster training", "To preserve the expected value of the activation output — without scaling, the expected activation at test time (where all neurons are active) would be twice the training expectation", "To compensate for the reduced batch size caused by dropping neurons", "To prevent gradients from vanishing in deep networks"], "answer": 1, "explanation": "Without scaling, a layer with p=0.5 produces expected output E[x·mask] = 0.5x during training but x during testing (all neurons active). This 2× mismatch shifts the activation distribution at test time. Inverted dropout multiplies kept activations by 1/p=2 during training, so E[x·mask·2] = x — matching test-time behavior. No test-time modification needed." }
\`\`\`

\`\`\`takeaways
{ "points": ["Dropout randomly zeros p fraction of activations each forward pass — prevents co-adaptation of neurons", "Inverted dropout scales kept activations by 1/(1-p) at train time, so test-time code needs no modification", "p=0.5 for fully connected layers, p=0.1 for transformers, rarely used in convolution layers", "Always disable dropout at inference time (model.eval() in PyTorch)"] }
\`\`\``,
    },
    {
      id: "batch-normalization",
      slug: "batch-normalization",
      title: "Batch Normalization: Normalizing Hidden Layers",
      content: `# Batch Normalization: Normalizing Hidden Layers

Deep networks suffer from **internal covariate shift**: as weights change during training, the distribution of inputs to each layer shifts too. Later layers must constantly adapt to a moving target, slowing convergence. **Batch Normalization** normalizes each layer's inputs to zero mean and unit variance — stabilizing training and enabling much higher learning rates.

\`\`\`concept
{ "title": "What BatchNorm Actually Does", "variant": "info", "content": "For a mini-batch of activations X with shape (batch_size, features), BatchNorm: (1) computes mean μ and variance σ² across the batch for each feature, (2) normalizes: x̂ = (x-μ)/√(σ²+ε), (3) scales and shifts by learnable parameters: y = γx̂ + β. The γ and β let the network learn the optimal scale and mean for each feature — BatchNorm doesn't force zero mean; it lets the network choose." }
\`\`\`

## Forward Pass

\`\`\`
μ = (1/m) Σ xᵢ                   # batch mean
σ² = (1/m) Σ (xᵢ - μ)²           # batch variance
x̂ᵢ = (xᵢ - μ) / √(σ² + ε)       # normalize
yᵢ = γ · x̂ᵢ + β                  # scale and shift (learnable)
\`\`\`

\`\`\`playground
{ "title": "Batch Normalization from Scratch", "language": "python", "code": "import numpy as np\\n\\nclass BatchNorm:\\n    def __init__(self, num_features, eps=1e-5, momentum=0.1):\\n        self.eps = eps\\n        self.momentum = momentum\\n        self.gamma = np.ones(num_features)   # learnable scale\\n        self.beta = np.zeros(num_features)    # learnable shift\\n        self.running_mean = np.zeros(num_features)\\n        self.running_var = np.ones(num_features)\\n        self.training = True\\n        # Cache for backward pass\\n        self.cache = {}\\n\\n    def forward(self, x):\\n        if self.training:\\n            mu = x.mean(axis=0)\\n            var = x.var(axis=0)\\n            self.running_mean = (1 - self.momentum) * self.running_mean + self.momentum * mu\\n            self.running_var  = (1 - self.momentum) * self.running_var  + self.momentum * var\\n        else:\\n            mu = self.running_mean\\n            var = self.running_var\\n        x_hat = (x - mu) / np.sqrt(var + self.eps)\\n        out = self.gamma * x_hat + self.beta\\n        self.cache = {'x': x, 'mu': mu, 'var': var, 'x_hat': x_hat}\\n        return out\\n\\n# Demo: un-normalized vs normalized activations\\nnp.random.seed(0)\\nbatch = np.random.randn(32, 8) * 10 + 5  # shifted and scaled\\nbn = BatchNorm(num_features=8)\\nout = bn.forward(batch)\\nprint(f'Input mean: {batch.mean(axis=0)[:4].round(2)}')\\nprint(f'Input std:  {batch.std(axis=0)[:4].round(2)}')\\nprint(f'After BN mean: {out.mean(axis=0)[:4].round(4)}')\\nprint(f'After BN std:  {out.std(axis=0)[:4].round(4)}')\\n", "runnable": true }
\`\`\`

## Train vs Inference Mode

During training, BatchNorm uses the current mini-batch statistics (μ, σ²). During inference, using a batch of size 1 (or a variable batch) gives unreliable statistics. The solution: track exponential moving averages of μ and σ² during training and use those at inference time.

\`\`\`compare
{ "title": "BatchNorm vs Layer Norm", "left": { "label": "Batch Normalization", "points": ["Normalizes across the batch dimension for each feature", "Depends on batch size — poor with small batches (< 8)", "Standard for CNNs and large-batch training", "Has running mean/var for inference", "Works poorly with batch size 1 (e.g., RNNs)"] }, "right": { "label": "Layer Normalization", "points": ["Normalizes across the feature dimension for each example", "Independent of batch size — works with batch size 1", "Standard for Transformers and RNNs", "No running statistics — same at train and test time", "Generally outperforms BatchNorm for sequence models"] } }
\`\`\`

\`\`\`quiz
{ "question": "BatchNorm has learnable parameters γ (scale) and β (shift). If the network sets γ=σ and β=μ for every layer, what has it effectively learned?", "options": ["The network has learned to undo the normalization, recovering the original pre-BatchNorm distribution", "The network has learned to apply stronger regularization", "The network has learned the optimal batch statistics", "The network has learned to ignore the input entirely"], "answer": 0, "explanation": "If γ=σ and β=μ, then y = γ·x̂ + β = σ·(x-μ)/σ + μ = x. The normalization is perfectly undone. This shows BatchNorm is not imposing a forced constraint — the γ, β parameters give the network the freedom to undo normalization if it helps. In practice, networks use intermediate values that provide some normalization benefit while allowing per-layer distribution control." }
\`\`\`

\`\`\`takeaways
{ "points": ["BatchNorm normalizes activations to μ=0, σ²=1 per mini-batch, then rescales with learnable γ, β", "Enables much higher learning rates — training 10× faster is common", "Use running mean/variance at inference time (not batch statistics)", "Prefer LayerNorm for Transformers/RNNs; BatchNorm for CNNs with large batch sizes"] }
\`\`\``,
    },
    {
      id: "early-stopping-validation",
      slug: "early-stopping-validation",
      title: "Early Stopping and Validation Curves",
      content: `# Early Stopping and Validation Curves

Training longer does not always mean a better model. At some point, the training loss continues decreasing while the validation loss starts rising — the network is memorizing training examples, not learning the underlying function. **Early stopping** monitors validation loss and halts training before overfitting sets in.

\`\`\`concept
{ "title": "The Bias-Variance Trade-off in Training Epochs", "variant": "analogy", "content": "Imagine studying for an exam. Too little studying (underfitting): you miss key concepts. Just right: you understand the material deeply. Too much studying (overfitting): you memorize last year's exact questions but struggle with new variations. Training epochs are your study time — the validation curve tells you when you've crossed from understanding to memorization." }
\`\`\`

## Reading Validation Curves

| Pattern | Diagnosis | Action |
|---------|-----------|--------|
| Both losses decrease | Learning normally | Continue training |
| Train↓, Val→ (flat) | Slow generalization | Continue with patience |
| Train↓, Val↑ | Overfitting | Stop (early stopping) |
| Both losses high | Underfitting | Larger model, more epochs |
| Val < Train | Data leakage or lucky split | Recheck split |

\`\`\`playground
{ "title": "Early Stopping Implementation", "language": "python", "code": "import numpy as np\\n\\nclass EarlyStopping:\\n    def __init__(self, patience=10, min_delta=1e-4):\\n        self.patience = patience\\n        self.min_delta = min_delta\\n        self.best_loss = np.inf\\n        self.counter = 0\\n        self.best_epoch = 0\\n\\n    def step(self, val_loss, epoch):\\n        if val_loss < self.best_loss - self.min_delta:\\n            self.best_loss = val_loss\\n            self.counter = 0\\n            self.best_epoch = epoch\\n            return False  # don't stop\\n        else:\\n            self.counter += 1\\n            return self.counter >= self.patience  # stop if patience exhausted\\n\\n# Simulate training and validation losses\\nnp.random.seed(42)\\ntrain_losses = [1.0 / (1 + 0.1*e) + 0.02*np.random.randn() for e in range(100)]\\nval_losses   = [1.0 / (1 + 0.1*e) + 0.03*e/100 + 0.02*np.random.randn() for e in range(100)]\\n\\nes = EarlyStopping(patience=10, min_delta=1e-3)\\nfor epoch, (tl, vl) in enumerate(zip(train_losses, val_losses)):\\n    should_stop = es.step(vl, epoch)\\n    if epoch % 10 == 0:\\n        print(f'Epoch {epoch:3d}: train={tl:.4f}  val={vl:.4f}  patience={es.counter}')\\n    if should_stop:\\n        print(f'\\\\nEarly stopping at epoch {epoch}! Best epoch: {es.best_epoch}')\\n        break\\n", "runnable": true }
\`\`\`

## Saving the Best Model (Checkpoint)

Early stopping without model checkpointing is incomplete. When patience runs out, the *current* weights are overfitted — you want the weights from the epoch with the lowest validation loss.

\`\`\`concept
{ "title": "Pattern: Checkpoint + Restore Best", "variant": "info", "content": "Best practice: (1) at every epoch, if val_loss improved, save the full model weights to disk, (2) when early stopping triggers, reload the saved weights from the best epoch, (3) this is called 'restore best weights' in Keras, and is done manually in PyTorch with torch.save/torch.load." }
\`\`\`

\`\`\`quiz
{ "question": "You use patience=5 for early stopping. Validation loss at epochs 40-46: [0.45, 0.46, 0.44, 0.47, 0.48, 0.49, 0.50]. At which epoch does early stopping trigger?", "options": ["Epoch 40 — first time loss doesn't improve from previous epoch", "Epoch 46 — after 5 consecutive epochs without improvement from epoch 42's loss of 0.44", "Epoch 44 — when loss starts strictly increasing", "Epoch 47 — after 5 epochs past the final minimum"], "answer": 1, "explanation": "The best validation loss is 0.44 at epoch 42. After epoch 42, loss never drops below 0.44: epochs 43(0.47), 44(0.48), 45(0.49), 46(0.50) — that's 4 consecutive non-improvements after epoch 42. With patience=5, we need 5 consecutive non-improvements. Counting from epoch 41 (first non-improvement from 0.44): 41, 43, 44, 45, 46 — early stopping fires at epoch 46." }
\`\`\`

\`\`\`takeaways
{ "points": ["Monitor validation loss each epoch — divergence between train and val loss signals overfitting", "patience controls how many non-improving epochs to tolerate before stopping (10-20 is typical)", "Always save best model weights (checkpoint) — restore from best epoch, not from when stopping fires", "Combine early stopping with dropout and weight decay for strong regularization"] }
\`\`\``,
    },
    {
      id: "optimization-checkpoint",
      slug: "optimization-checkpoint",
      title: "Checkpoint: Ablation Study on MNIST",
      content: `# Checkpoint: Ablation Study on MNIST

\`\`\`callout
{ "variant": "info", "title": "Module Checkpoint", "content": "This checkpoint consolidates SGD, Adam, BatchNorm, Dropout, and learning rate schedules. Complete the ablation exercise below, then verify your understanding with the quiz battery." }
\`\`\`

## What Is an Ablation Study?

An ablation study removes one component at a time and measures the impact. It answers: "How much does each piece contribute?" For a neural network: train the full model, then retrain with (a) no dropout, (b) no batch norm, (c) SGD instead of Adam — compare validation accuracy.

\`\`\`playground
{ "title": "Mini Ablation Study Framework", "language": "python", "code": "import numpy as np\\n\\n# Simulated results from a 3-layer MLP on MNIST-style data\\n# (Run this to see the ablation table — full training would need a GPU)\\nresults = {\\n    'Full model (Adam + BN + Dropout)': {'val_acc': 0.978, 'epochs_to_converge': 12},\\n    'No Dropout (Adam + BN)':           {'val_acc': 0.971, 'epochs_to_converge': 11},\\n    'No BatchNorm (Adam + Dropout)':    {'val_acc': 0.963, 'epochs_to_converge': 28},\\n    'SGD+Momentum (no Adam, + BN + DO)':{'val_acc': 0.974, 'epochs_to_converge': 25},\\n    'No Regularization (Adam only)':    {'val_acc': 0.952, 'epochs_to_converge': 9},\\n}\\n\\nprint(f'{\\\"Configuration\\\":<40} {\\\"Val Acc\\\":<10} {\\\"Epochs\\\"}')\\nprint('-' * 60)\\nfor config, metrics in results.items():\\n    print(f'{config:<40} {metrics[\\\"val_acc\\\"]:<10.3f} {metrics[\\\"epochs_to_converge\\\"]}')\\n\\nprint('\\\\nKey findings:')\\nprint('- BatchNorm has the largest impact on convergence speed (2x)')\\nprint('- Dropout reduces overfitting (~+1.9% val accuracy)')\\nprint('- Adam converges faster than SGD+momentum')\\n", "runnable": true }
\`\`\`

## Quiz Battery

\`\`\`quiz
{ "question": "A network trained with Adam (lr=1e-3) for 100 epochs reaches 95% train accuracy and 87% val accuracy. Which intervention is MOST likely to close the 8% gap?", "options": ["Increase learning rate to 1e-2", "Add dropout (p=0.5) to fully connected layers and retrain", "Switch from Adam to SGD", "Add more layers to increase model capacity"], "answer": 1, "explanation": "An 8% train/val gap is a textbook overfitting signature. Dropout directly addresses overfitting by preventing co-adaptation of neurons. Increasing LR would destabilize training. Switching to SGD addresses optimizer choice, not overfitting. Adding more layers increases capacity — the opposite of what's needed when the model is already overfitting." }
\`\`\`

\`\`\`quiz
{ "question": "BatchNorm is removed from a deep network and training becomes very slow (100+ epochs to converge vs 20 with BN). What is the primary reason?", "options": ["BatchNorm compresses the loss landscape by stabilizing the scale of activations at each layer, enabling much larger learning rates without divergence", "BatchNorm adds skip connections that make gradients flow directly to early layers", "BatchNorm increases the effective batch size, making gradient estimates more accurate", "BatchNorm initializes weights to better starting values"], "answer": 0, "explanation": "BatchNorm keeps activation distributions stable across layers. Without it, activations can grow or shrink exponentially as they pass through many layers (internal covariate shift). This forces the use of very small learning rates. With BN, you can use 10-100× larger LR and still converge — that's the convergence speed-up. BN doesn't add skip connections (that's ResNets)." }
\`\`\`

\`\`\`quiz
{ "question": "You train with momentum γ=0.9 and Adam β₁=0.9. Both have similar first-moment formulas. What does Adam add that momentum alone doesn't?", "options": ["Momentum uses gradient direction only; Adam also adapts the step size per parameter based on gradient magnitude history (second moment)", "Adam uses a larger effective batch size", "Momentum updates all parameters equally; Adam only updates parameters with gradients above a threshold", "Adam applies L2 regularization automatically"], "answer": 0, "explanation": "Both maintain a running average of gradients (first moment, controlled by β₁=γ=0.9). Adam additionally maintains a running average of squared gradients (second moment, β₂=0.999). The update divides by the square root of the second moment — this per-parameter adaptive scaling is what makes Adam fundamentally different from momentum. Parameters with large historical gradients get smaller steps; sparse parameters get larger steps." }
\`\`\`

\`\`\`takeaways
{ "points": ["Ablation studies quantify each component's contribution — always run them before claiming a technique is necessary", "BatchNorm dominates convergence speed; Dropout dominates generalization — both matter", "Adam is the default optimizer; SGD+momentum sometimes wins on final accuracy for vision tasks", "Combine regularization techniques (dropout + weight decay + early stopping) for robust generalization"] }
\`\`\``,
    },
  ],
};
