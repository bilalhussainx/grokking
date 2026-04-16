import { Module } from "../types";

export const module3: Module = {
  id: "neural-networks",
  title: "Neural Networks & Deep Learning",
  description: "Perceptrons to deep networks, backpropagation intuition, CNNs for images, and training with PyTorch",
  lessons: [
    {
      id: "neural-networks-pytorch",
      slug: "neural-networks-pytorch",
      title: "Neural Networks: From Perceptron to Deep Learning",
      content: `# Neural Networks

Neural networks are universal function approximators. They learn layered representations — early layers detect edges, later layers detect faces. With enough depth and data, they can learn almost anything.

---

\`\`\`concept
{
  "title": "What a Neural Network Really Is",
  "variant": "mental-model",
  "content": "A neural network is nested function composition: output = f_L(f_{L-1}(...f_1(x))). Each layer f_i = activation(weight_matrix × input + bias). Training adjusts weight_matrices using backpropagation — the chain rule applied recursively from output to input. Every 'neuron' computes: activate(sum of weighted inputs)."
}
\`\`\`

---

## The Forward Pass

\`\`\`python
import numpy as np

# A 2-layer neural network from scratch:
class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # Xavier initialization (prevents vanishing/exploding gradients):
        self.W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2 / input_size)
        self.b1 = np.zeros(hidden_size)
        self.W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2 / hidden_size)
        self.b2 = np.zeros(output_size)

    def relu(self, x):
        return np.maximum(0, x)

    def softmax(self, x):
        e = np.exp(x - x.max(axis=1, keepdims=True))  # numerically stable
        return e / e.sum(axis=1, keepdims=True)

    def forward(self, X):
        # Layer 1:
        self.z1 = X @ self.W1 + self.b1      # Linear transform
        self.a1 = self.relu(self.z1)           # Non-linear activation

        # Layer 2 (output):
        self.z2 = self.a1 @ self.W2 + self.b2
        self.a2 = self.softmax(self.z2)        # Probabilities for each class

        return self.a2
\`\`\`

## Activation Functions

\`\`\`compare
{
  "title": "Activation Functions",
  "items": [
    {
      "name": "ReLU",
      "description": "max(0, x). Zero for negatives, identity for positives. Fast, sparse activations. Default for hidden layers. Problem: dying ReLU (neurons stuck at 0). Fix: LeakyReLU or ELU."
    },
    {
      "name": "Sigmoid",
      "description": "1/(1+e^{-x}). Outputs [0,1]. Good for binary classification output. Bad for hidden layers (vanishing gradient — saturates at 0 and 1, gradient → 0)."
    },
    {
      "name": "Softmax",
      "description": "e^{x_i} / sum(e^{x_j}). Outputs probability distribution (sums to 1). Use for multiclass classification output layer."
    },
    {
      "name": "GELU/SiLU",
      "description": "Smooth approximations of ReLU used in transformers (BERT, GPT). Allow slightly negative activations, better gradient flow. Default in modern LLMs."
    }
  ]
}
\`\`\`

## Training with PyTorch

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# --- Data ---
X, y = make_classification(n_samples=5000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)

# Convert to PyTorch tensors:
X_tr = torch.FloatTensor(X_train)
y_tr = torch.LongTensor(y_train)
X_te = torch.FloatTensor(X_test)
y_te = torch.LongTensor(y_test)

train_ds = TensorDataset(X_tr, y_tr)
train_dl = DataLoader(train_ds, batch_size=64, shuffle=True)

# --- Model ---
class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, dropout=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),       # Normalize activations — stabilizes training
            nn.ReLU(),
            nn.Dropout(dropout),              # Randomly zero p% of neurons — prevents overfitting

            nn.Linear(hidden_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),

            nn.Linear(hidden_dim, output_dim),
        )

    def forward(self, x):
        return self.net(x)

model = MLP(input_dim=20, hidden_dim=128, output_dim=2)

# --- Training ---
criterion = nn.CrossEntropyLoss()   # For multiclass: log-softmax + NLLLoss combined
optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-4)  # weight_decay = L2 reg
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5, factor=0.5)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

history = {'train_loss': [], 'val_loss': [], 'val_acc': []}

for epoch in range(100):
    # --- Training phase ---
    model.train()  # Enable dropout + batch norm in training mode
    train_loss = 0
    for X_batch, y_batch in train_dl:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)
        optimizer.zero_grad()          # Clear gradients
        logits = model(X_batch)
        loss = criterion(logits, y_batch)
        loss.backward()                # Backpropagate
        optimizer.step()               # Update weights
        train_loss += loss.item()

    # --- Validation phase ---
    model.eval()   # Disable dropout + use running stats for batch norm
    with torch.no_grad():  # No gradient computation needed
        val_logits = model(X_te.to(device))
        val_loss = criterion(val_logits, y_te.to(device)).item()
        val_preds = val_logits.argmax(dim=1).cpu()
        val_acc = (val_preds == y_te).float().mean().item()

    scheduler.step(val_loss)
    history['train_loss'].append(train_loss / len(train_dl))
    history['val_loss'].append(val_loss)
    history['val_acc'].append(val_acc)

    if epoch % 10 == 0:
        print(f"Epoch {epoch}: train_loss={train_loss/len(train_dl):.4f}, val_acc={val_acc:.4f}")
\`\`\`

## CNNs for Image Classification

\`\`\`python
# Convolutional Neural Networks — exploit spatial structure of images

class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            # Conv layer: (in_channels, out_channels, kernel_size)
            nn.Conv2d(1, 32, kernel_size=3, padding=1),  # 28x28 → 28x28
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),                           # 28x28 → 14x14

            nn.Conv2d(32, 64, kernel_size=3, padding=1), # 14x14 → 14x14
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),                           # 14x14 → 7x7
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * 7 * 7, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes),
        )

    def forward(self, x):
        return self.classifier(self.features(x))

# CNNs key ideas:
# - Conv layer: learn local filters (edge detectors, texture patterns)
# - MaxPool: spatial downsampling, translation invariance
# - Deep CNN: early layers = low-level features, deep = high-level semantics
\`\`\`

\`\`\`takeaways
["model.train() enables dropout + batch norm in train mode; model.eval() disables them for inference", "optimizer.zero_grad() → loss.backward() → optimizer.step() is the core training loop", "BatchNorm normalizes activations per batch — dramatically stabilizes training of deep networks", "Dropout randomly zeros neurons during training — forces redundant representations, prevents overfitting", "Adam optimizer: adaptive learning rates per parameter — usually better than SGD for initial experiments", "ReduceLROnPlateau: halves LR when validation loss plateaus — fine-grained convergence control"]
\`\`\`
`,
    },
  ],
};
