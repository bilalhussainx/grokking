import { Module } from "../types";

export const rlTradingModule: Module = {
  id: "fml-rl",
  title: "Reinforcement Learning for Trading",
  description: "Apply reinforcement learning to trading — formulating trading as an MDP, implementing DQN for portfolio management, policy gradient methods, and building complete trading agents with FinRL.",
  lessons: [
    {
      id: "fml-rl-for-trading",
      slug: "rl-for-trading",
      title: "Reinforcement Learning for Trading",
      content: `## Reinforcement Learning for Trading

Reinforcement learning (RL) offers a fundamentally different approach to trading compared to supervised learning. Instead of predicting returns and then deciding how to trade, RL learns trading policies directly — optimizing sequences of buy, sell, and hold decisions to maximize cumulative risk-adjusted returns. This end-to-end approach can discover trading strategies that are difficult to specify manually.

### Why RL for Trading?

Traditional ML for trading follows a two-step process: (1) predict returns, then (2) convert predictions to positions. This separation is suboptimal because the prediction model does not know about transaction costs, position limits, or risk constraints.

RL unifies prediction and execution into a single optimization:

| Aspect | Supervised ML | Reinforcement Learning |
|--------|--------------|----------------------|
| **Objective** | Minimize prediction error | Maximize cumulative reward |
| **Awareness of costs** | Added post-hoc | Built into the reward |
| **Position sizing** | Separate module | Learned as part of the policy |
| **Sequential decisions** | Each prediction independent | Considers future consequences |
| **Risk management** | External constraints | Learned through reward shaping |

### The RL Framework for Trading

\`\`\`python
import numpy as np

class TradingEnvironment:
    """
    Simple trading environment for RL.
    State: [position, return_1d, return_5d, volatility, cash_ratio]
    Actions: 0=sell, 1=hold, 2=buy
    Reward: portfolio return minus transaction costs
    """
    def __init__(self, prices, initial_cash=100000, transaction_cost=0.001):
        self.prices = prices
        self.initial_cash = initial_cash
        self.tc = transaction_cost
        self.reset()

    def reset(self):
        self.step_idx = 20  # start after enough history
        self.cash = self.initial_cash
        self.shares = 0
        self.portfolio_values = [self.initial_cash]
        return self._get_state()

    def _get_state(self):
        i = self.step_idx
        prices = self.prices
        position = 1 if self.shares > 0 else 0
        ret_1d = (prices[i] - prices[i-1]) / prices[i-1]
        ret_5d = (prices[i] - prices[i-5]) / prices[i-5]
        vol = np.std(np.diff(prices[i-20:i]) / prices[i-20:i-1])
        portfolio_val = self.cash + self.shares * prices[i]
        cash_ratio = self.cash / max(portfolio_val, 1)
        return np.array([position, ret_1d, ret_5d, vol, cash_ratio])

    def step(self, action):
        price = self.prices[self.step_idx]
        old_value = self.cash + self.shares * price

        if action == 2 and self.cash > 0:  # buy
            shares_to_buy = int(self.cash * 0.95 / price)
            cost = shares_to_buy * price * (1 + self.tc)
            if cost <= self.cash:
                self.shares += shares_to_buy
                self.cash -= cost
        elif action == 0 and self.shares > 0:  # sell
            revenue = self.shares * price * (1 - self.tc)
            self.cash += revenue
            self.shares = 0

        self.step_idx += 1
        new_price = self.prices[self.step_idx]
        new_value = self.cash + self.shares * new_price

        reward = (new_value - old_value) / old_value
        done = self.step_idx >= len(self.prices) - 1
        self.portfolio_values.append(new_value)

        return self._get_state(), reward, done

# Example usage
np.random.seed(42)
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, 500)))

env = TradingEnvironment(prices)
state = env.reset()

# Random agent baseline
total_reward = 0
while True:
    action = np.random.choice([0, 1, 2])
    state, reward, done = env.step(action)
    total_reward += reward
    if done:
        break

final_value = env.portfolio_values[-1]
total_return = (final_value - env.initial_cash) / env.initial_cash
print(f"Random agent total return: {total_return:.4f}")
print(f"Buy-and-hold return: {(prices[-1] - prices[20]) / prices[20]:.4f}")
\`\`\`

### Key Components of an RL Trading System

**State space:** What information the agent observes:
- Current portfolio position (long, short, flat)
- Recent returns at multiple horizons
- Volatility measures
- Technical indicators
- Portfolio metrics (cash ratio, unrealized P&L)

**Action space:** What the agent can do:
- Discrete: buy, hold, sell (simplest)
- Continuous: target portfolio weight in [-1, 1] (more flexible)
- Multi-asset: weight vector across multiple assets

**Reward function:** What the agent optimizes:
- Raw return (simplest but ignores risk)
- Sharpe ratio (risk-adjusted)
- Return minus transaction costs (cost-aware)
- Sortino ratio (penalizes only downside risk)
- Custom: any financial metric

### Reward Shaping for Trading

The choice of reward function dramatically affects learned behavior:

| Reward | Learned Behavior | Risk Profile |
|--------|-----------------|-------------|
| Raw return | Aggressive, high turnover | Volatile |
| Return - costs | Cost-aware, lower turnover | Moderate |
| Differential Sharpe | Risk-adjusted, balanced | Conservative |
| Return with drawdown penalty | Drawdown-averse | Defensive |

### Key Takeaway

RL offers a principled framework for learning trading policies that account for transaction costs, risk constraints, and sequential decision-making. However, it requires careful environment design, reward shaping, and extensive validation to avoid overfitting to historical market dynamics.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a simple TradingEnvironment with:
# - State: [position, 1d_return, 5d_return, volatility, cash_ratio]
# - Actions: buy, hold, sell
# - Reward: portfolio return minus transaction costs

# TODO: Run a random agent and compare to buy-and-hold
`,
      solutionCode: `import numpy as np

class TradingEnvironment:
    def __init__(self, prices, initial_cash=100000, tc=0.001):
        self.prices = prices
        self.initial_cash = initial_cash
        self.tc = tc
        self.reset()

    def reset(self):
        self.idx = 20
        self.cash = self.initial_cash
        self.shares = 0
        return self._state()

    def _state(self):
        p = self.prices
        i = self.idx
        return np.array([
            1 if self.shares > 0 else 0,
            (p[i] - p[i-1]) / p[i-1],
            (p[i] - p[i-5]) / p[i-5],
            np.std(np.diff(p[i-20:i]) / p[i-20:i-1]),
            self.cash / max(self.cash + self.shares * p[i], 1)
        ])

    def step(self, action):
        price = self.prices[self.idx]
        old_val = self.cash + self.shares * price
        if action == 2 and self.cash > 0:
            n = int(self.cash * 0.95 / price)
            self.shares += n
            self.cash -= n * price * (1 + self.tc)
        elif action == 0 and self.shares > 0:
            self.cash += self.shares * price * (1 - self.tc)
            self.shares = 0
        self.idx += 1
        new_val = self.cash + self.shares * self.prices[self.idx]
        reward = (new_val - old_val) / old_val
        done = self.idx >= len(self.prices) - 1
        return self._state(), reward, done

np.random.seed(42)
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, 500)))
env = TradingEnvironment(prices)
state = env.reset()
while True:
    state, reward, done = env.step(np.random.choice([0, 1, 2]))
    if done:
        break

final = env.cash + env.shares * prices[env.idx]
print(f"Random agent: {(final - 100000) / 100000:.4f}")
print(f"Buy-and-hold: {(prices[-1] - prices[20]) / prices[20]:.4f}")
`,
    },
    {
      id: "fml-mdp-finance",
      slug: "mdps-in-finance",
      title: "MDPs in Finance",
      content: `## Markov Decision Processes in Finance

The Markov Decision Process (MDP) is the mathematical framework underlying all reinforcement learning. Formulating a financial problem as an MDP requires careful decisions about state representation, action space, transition dynamics, and reward function. Getting these choices right is the difference between an RL agent that learns meaningful trading policies and one that overfits to noise.

### The MDP Framework

An MDP is defined by the tuple (S, A, P, R, gamma):

- **S (State space)** — All possible states the agent can observe
- **A (Action space)** — All possible actions the agent can take
- **P (Transition probability)** — P(s'|s,a) — probability of transitioning to state s' given state s and action a
- **R (Reward function)** — R(s,a,s') — immediate reward received after transitioning
- **gamma (Discount factor)** — How much to value future rewards vs. immediate rewards (0 < gamma <= 1)

The **Markov property** states that the future depends only on the current state, not on the history of how we got there. This is an approximation in finance — markets have memory — but a useful one when the state representation is rich enough.

### Designing the State Space

The state should contain all information the agent needs to make optimal decisions:

\`\`\`python
import numpy as np

def construct_financial_state(prices, volumes, position, cash,
                               portfolio_value, step, lookback=20):
    """
    Construct a comprehensive state vector for a trading MDP.
    """
    i = step
    state = {}

    # Price-based features
    returns = np.diff(prices[i-lookback:i+1]) / prices[i-lookback:i]
    state['return_1d'] = returns[-1]
    state['return_5d'] = (prices[i] - prices[i-5]) / prices[i-5]
    state['return_20d'] = (prices[i] - prices[i-20]) / prices[i-20]

    # Volatility
    state['volatility'] = np.std(returns) * np.sqrt(252)

    # Volume features
    vol_ma = np.mean(volumes[i-20:i])
    state['volume_ratio'] = volumes[i] / max(vol_ma, 1)

    # Technical indicators
    sma_short = np.mean(prices[i-5:i+1])
    sma_long = np.mean(prices[i-20:i+1])
    state['ma_cross'] = (sma_short - sma_long) / sma_long

    # RSI
    changes = np.diff(prices[i-14:i+1])
    gains = np.mean(changes[changes > 0]) if np.any(changes > 0) else 0
    losses = -np.mean(changes[changes < 0]) if np.any(changes < 0) else 1e-10
    state['rsi'] = 100 - 100 / (1 + gains / losses)

    # Portfolio state
    state['position'] = 1 if position > 0 else (-1 if position < 0 else 0)
    state['cash_ratio'] = cash / max(portfolio_value, 1)
    state['unrealized_pnl'] = 0  # simplified

    return np.array(list(state.values()))

np.random.seed(42)
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, 500)))
volumes = np.random.lognormal(15, 0.5, 500)

state = construct_financial_state(
    prices, volumes, position=100, cash=50000,
    portfolio_value=100000, step=50
)
print(f"State dimension: {len(state)}")
print(f"State vector: {np.round(state, 4)}")
\`\`\`

### Action Space Design

The action space determines the agent's degrees of freedom:

| Action Space | Description | Pros | Cons |
|-------------|-------------|------|------|
| **Discrete (3)** | Buy, hold, sell | Simple, easy to train | No position sizing |
| **Discrete (5)** | Strong buy, buy, hold, sell, strong sell | Position sizing via signal strength | More complex |
| **Discrete (11)** | Target weights: -1.0, -0.8, ..., 0.8, 1.0 | Precise allocation | Large action space |
| **Continuous** | Target weight in [-1, 1] | Maximum flexibility | Harder to train |
| **Multi-asset** | Weight vector (w1, w2, ..., wN) | Portfolio optimization | Very high dimensional |

### Reward Function Design

The reward function is the most critical design choice. It must balance multiple objectives:

\`\`\`python
def compute_reward(old_value, new_value, transaction_cost,
                   max_drawdown, risk_free_rate=0.02/252):
    """
    Multi-objective reward function for trading.
    """
    # Return component
    portfolio_return = (new_value - old_value) / old_value

    # Cost penalty
    cost_penalty = transaction_cost

    # Risk penalty (penalize large drawdowns)
    drawdown_penalty = 0.0
    if max_drawdown < -0.10:  # penalize drawdowns > 10%
        drawdown_penalty = 0.5 * (max_drawdown + 0.10)

    # Excess return over risk-free rate
    excess_return = portfolio_return - risk_free_rate

    # Combined reward
    reward = excess_return - cost_penalty + drawdown_penalty

    return reward
\`\`\`

### The Discount Factor in Finance

The discount factor gamma controls how much the agent values future rewards:

- **gamma = 0.99** — Values long-term performance (good for position trading)
- **gamma = 0.95** — Balanced short and long-term (good for swing trading)
- **gamma = 0.90** — Focuses on near-term performance (good for day trading)

In finance, the discount factor also implicitly captures the time value of money and the increasing uncertainty of future market conditions.

### Challenges of MDPs in Finance

**Partial observability** — The true state of the market is not fully observable. Important factors (institutional order flow, insider information, macroeconomic shocks) are hidden. Technically, financial markets are POMDPs (Partially Observable MDPs), but MDP approximations work in practice when the state representation is rich enough.

**Non-stationary transitions** — Unlike board games or robotics, financial market dynamics change over time. An agent trained on bull market data may fail in a bear market.

**Continuous state space** — Financial states are continuous and high-dimensional, requiring function approximation (neural networks) rather than tabular methods.

### Key Takeaway

Formulating trading as an MDP requires thoughtful design of state representations, action spaces, and reward functions. The state must capture relevant market information and portfolio status; the action space should match the strategy's complexity; and the reward function must align with the actual trading objectives including transaction costs and risk management.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a state construction function that includes:
# - Price-based features (returns, volatility, MA cross)
# - Volume features
# - Portfolio state (position, cash ratio)

# TODO: Generate synthetic price/volume data

# TODO: Construct and print a sample state vector
`,
      solutionCode: `import numpy as np

def construct_state(prices, volumes, position, cash, total_val, step):
    i = step
    returns = np.diff(prices[i-20:i+1]) / prices[i-20:i]
    sma5 = np.mean(prices[i-5:i+1])
    sma20 = np.mean(prices[i-20:i+1])
    changes = np.diff(prices[i-14:i+1])
    gains = np.mean(changes[changes > 0]) if np.any(changes > 0) else 0
    losses = -np.mean(changes[changes < 0]) if np.any(changes < 0) else 1e-10

    return np.array([
        returns[-1],
        (prices[i] - prices[i-5]) / prices[i-5],
        np.std(returns) * np.sqrt(252),
        volumes[i] / max(np.mean(volumes[i-20:i]), 1),
        (sma5 - sma20) / sma20,
        100 - 100 / (1 + gains / losses),
        1 if position > 0 else 0,
        cash / max(total_val, 1),
    ])

np.random.seed(42)
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, 500)))
volumes = np.random.lognormal(15, 0.5, 500)

state = construct_state(prices, volumes, 100, 50000, 100000, 50)
print(f"State dim: {len(state)}")
print(f"State: {np.round(state, 4)}")
`,
    },
    {
      id: "fml-dqn-portfolio",
      slug: "dqn-for-portfolio",
      title: "DQN for Portfolio Management",
      content: `## DQN for Portfolio Management

Deep Q-Networks (DQN) combine Q-learning with deep neural networks to learn optimal trading policies in large state spaces. Originally developed by DeepMind for Atari games, DQN has been adapted for portfolio management where the agent learns to allocate capital across multiple assets to maximize risk-adjusted returns.

### From Q-Learning to DQN

In standard Q-learning, a table stores the expected return for each state-action pair. This is infeasible for continuous financial states. DQN approximates the Q-function with a neural network:

\`\`\`
Q(state, action) ≈ Neural_Network(state)[action]
\`\`\`

The network takes the state as input and outputs Q-values for each possible action. The agent selects the action with the highest Q-value (with epsilon-greedy exploration).

### DQN Architecture for Trading

\`\`\`python
import numpy as np

class SimpleDQN:
    """
    Simplified DQN for portfolio management.
    Uses a basic two-layer network approximation.
    """
    def __init__(self, state_dim, n_actions, learning_rate=0.001,
                 gamma=0.99, epsilon=1.0, epsilon_decay=0.995):
        self.state_dim = state_dim
        self.n_actions = n_actions
        self.lr = learning_rate
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = 0.01

        # Simple linear Q-network (in practice, use PyTorch/TF)
        self.weights = np.random.randn(state_dim, n_actions) * 0.01
        self.bias = np.zeros(n_actions)

        # Experience replay buffer
        self.memory = []
        self.memory_size = 10000
        self.batch_size = 32

    def get_q_values(self, state):
        """Compute Q-values for all actions given a state."""
        return state @ self.weights + self.bias

    def select_action(self, state):
        """Epsilon-greedy action selection."""
        if np.random.random() < self.epsilon:
            return np.random.randint(self.n_actions)
        q_values = self.get_q_values(state)
        return np.argmax(q_values)

    def store_experience(self, state, action, reward, next_state, done):
        """Store experience in replay buffer."""
        if len(self.memory) >= self.memory_size:
            self.memory.pop(0)
        self.memory.append((state, action, reward, next_state, done))

    def train(self):
        """Train on a batch from replay buffer."""
        if len(self.memory) < self.batch_size:
            return 0.0

        # Sample random batch
        indices = np.random.choice(len(self.memory), self.batch_size, replace=False)
        batch = [self.memory[i] for i in indices]

        total_loss = 0.0
        for state, action, reward, next_state, done in batch:
            target = reward
            if not done:
                target += self.gamma * np.max(self.get_q_values(next_state))

            q_values = self.get_q_values(state)
            error = target - q_values[action]

            # Simple gradient update
            self.weights[:, action] += self.lr * error * state
            self.bias[action] += self.lr * error
            total_loss += error ** 2

        # Decay epsilon
        self.epsilon = max(self.epsilon_min,
                          self.epsilon * self.epsilon_decay)

        return total_loss / self.batch_size

# Training loop
np.random.seed(42)
n_days = 500
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, n_days)))

state_dim = 5  # [position, ret_1d, ret_5d, vol, cash_ratio]
n_actions = 3  # sell, hold, buy

agent = SimpleDQN(state_dim, n_actions)

# Simulate training episodes
n_episodes = 50
episode_returns = []

for episode in range(n_episodes):
    # Simple state: random features (in practice, from environment)
    portfolio_value = 100000
    total_reward = 0

    for t in range(20, min(20 + 100, n_days - 1)):
        state = np.array([
            0,  # position
            (prices[t] - prices[t-1]) / prices[t-1],
            (prices[t] - prices[t-5]) / prices[t-5],
            np.std(np.diff(prices[t-20:t]) / prices[t-20:t-1]),
            0.5  # cash ratio
        ])

        action = agent.select_action(state)
        reward = np.random.normal(0.001, 0.01)  # simplified reward

        next_state = np.array([
            action - 1,
            (prices[t+1] - prices[t]) / prices[t],
            (prices[t+1] - prices[t-4]) / prices[t-4],
            np.std(np.diff(prices[t-19:t+1]) / prices[t-19:t]),
            0.5
        ])

        done = (t >= 119)
        agent.store_experience(state, action, reward, next_state, done)
        loss = agent.train()
        total_reward += reward

    episode_returns.append(total_reward)

print(f"Training complete: {n_episodes} episodes")
print(f"Average return (first 10):  {np.mean(episode_returns[:10]):.4f}")
print(f"Average return (last 10):   {np.mean(episode_returns[-10:]):.4f}")
print(f"Final epsilon: {agent.epsilon:.4f}")
\`\`\`

### Key DQN Enhancements for Trading

**Experience replay** — Store past experiences and sample random batches for training. This breaks temporal correlation in the data and stabilizes learning.

**Target network** — Use a separate network for computing target Q-values, updated periodically. This prevents the moving-target problem where the network chases its own predictions.

**Double DQN** — Use one network to select actions and another to evaluate them. This reduces the overestimation bias in Q-value estimates.

**Prioritized replay** — Sample experiences with high TD-error more frequently. The agent focuses on surprising or informative experiences.

### Multi-Asset Portfolio DQN

For portfolio management across N assets, the action space can be:
- Discrete weight grid: each asset has K possible weights (e.g., 0%, 25%, 50%, 75%, 100%)
- The total action space is K^N, which grows exponentially with assets
- For N=5, K=5: 3,125 possible actions (manageable)
- For N=20: must use continuous action spaces (policy gradient methods)

### Key Takeaway

DQN provides a practical framework for learning portfolio management policies that account for transaction costs, risk, and sequential decision-making. The key innovations — experience replay, target networks, and epsilon-greedy exploration — stabilize training in the noisy financial environment. For multi-asset portfolios with many assets, continuous action space methods (policy gradients) are necessary.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a SimpleDQN class with:
# - Q-value computation
# - Epsilon-greedy action selection
# - Experience replay buffer
# - Training on batches

# TODO: Run a training loop and show improvement over episodes
`,
      solutionCode: `import numpy as np

class SimpleDQN:
    def __init__(self, state_dim, n_actions, lr=0.001, gamma=0.99, eps=1.0):
        self.weights = np.random.randn(state_dim, n_actions) * 0.01
        self.bias = np.zeros(n_actions)
        self.lr, self.gamma, self.epsilon = lr, gamma, eps
        self.memory, self.batch_size = [], 32

    def get_q(self, state):
        return state @ self.weights + self.bias

    def select_action(self, state, n_actions=3):
        if np.random.random() < self.epsilon:
            return np.random.randint(n_actions)
        return np.argmax(self.get_q(state))

    def store(self, s, a, r, s2, d):
        if len(self.memory) > 10000: self.memory.pop(0)
        self.memory.append((s, a, r, s2, d))

    def train(self):
        if len(self.memory) < self.batch_size: return
        idx = np.random.choice(len(self.memory), self.batch_size, replace=False)
        for i in idx:
            s, a, r, s2, d = self.memory[i]
            target = r if d else r + self.gamma * np.max(self.get_q(s2))
            error = target - self.get_q(s)[a]
            self.weights[:, a] += self.lr * error * s
            self.bias[a] += self.lr * error
        self.epsilon = max(0.01, self.epsilon * 0.995)

np.random.seed(42)
prices = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, 500)))
agent = SimpleDQN(5, 3)

for ep in range(50):
    total = 0
    for t in range(20, 120):
        s = np.array([0, (prices[t]-prices[t-1])/prices[t-1],
                       (prices[t]-prices[t-5])/prices[t-5],
                       np.std(np.diff(prices[t-20:t])/prices[t-20:t-1]), 0.5])
        a = agent.select_action(s)
        r = np.random.normal(0.001, 0.01)
        s2 = np.array([a-1, (prices[t+1]-prices[t])/prices[t],
                        (prices[t+1]-prices[t-4])/prices[t-4],
                        np.std(np.diff(prices[t-19:t+1])/prices[t-19:t]), 0.5])
        agent.store(s, a, r, s2, t >= 119)
        agent.train()
        total += r
    if ep % 10 == 0: print(f"Episode {ep}: return={total:.4f}, eps={agent.epsilon:.3f}")
`,
    },
    {
      id: "fml-policy-gradients",
      slug: "policy-gradients-trading",
      title: "Policy Gradient Methods",
      content: `## Policy Gradient Methods for Trading

While DQN works well for discrete action spaces, portfolio management often requires continuous action spaces — allocating precise weight percentages across multiple assets. Policy gradient methods directly learn a policy (a mapping from states to actions) without computing Q-values, making them natural for continuous action spaces and multi-asset portfolio optimization.

### Policy Gradients vs. Q-Learning

| Feature | Q-Learning (DQN) | Policy Gradients |
|---------|------------------|-----------------|
| **Output** | Action values | Action probabilities/parameters |
| **Action space** | Discrete (natural) | Continuous (natural) |
| **Exploration** | Epsilon-greedy | Stochastic policy (built-in) |
| **Convergence** | Can oscillate | Smoother but potentially slow |
| **Multi-asset** | Exponential action space | Linear in number of assets |

### The REINFORCE Algorithm

REINFORCE is the simplest policy gradient method. The policy is parameterized by theta and outputs action probabilities. The gradient of expected return with respect to theta is:

\`\`\`
gradient = E[sum(grad_log(pi(a|s)) * G_t)]
\`\`\`

where G_t is the cumulative future return from time t.

\`\`\`python
import numpy as np

class PolicyGradientAgent:
    """
    Simple policy gradient agent for continuous portfolio allocation.
    Outputs target weights for N assets.
    """
    def __init__(self, state_dim, n_assets, lr=0.001):
        self.n_assets = n_assets
        self.lr = lr
        # Linear policy: state -> mean weights
        self.W_mean = np.random.randn(state_dim, n_assets) * 0.01
        self.log_std = np.zeros(n_assets)  # learned standard deviation
        self.episode_log_probs = []
        self.episode_rewards = []

    def select_action(self, state):
        """Sample portfolio weights from Gaussian policy."""
        mean = state @ self.W_mean
        std = np.exp(self.log_std)
        # Sample action
        raw_action = mean + std * np.random.randn(self.n_assets)
        # Softmax to get valid weights (sum to 1, all positive)
        weights = np.exp(raw_action) / np.sum(np.exp(raw_action))

        # Store log probability for training
        log_prob = -0.5 * np.sum(((raw_action - mean) / std) ** 2
                                  + 2 * self.log_std)
        self.episode_log_probs.append((log_prob, state, raw_action, mean, std))

        return weights

    def store_reward(self, reward):
        self.episode_rewards.append(reward)

    def update(self):
        """REINFORCE update at end of episode."""
        if len(self.episode_rewards) == 0:
            return

        # Compute returns (cumulative discounted reward)
        returns = []
        G = 0
        gamma = 0.99
        for r in reversed(self.episode_rewards):
            G = r + gamma * G
            returns.insert(0, G)

        returns = np.array(returns)
        # Normalize returns (variance reduction)
        if np.std(returns) > 0:
            returns = (returns - np.mean(returns)) / (np.std(returns) + 1e-8)

        # Policy gradient update
        for t, (log_prob, state, action, mean, std) in enumerate(self.episode_log_probs):
            # Gradient of log probability w.r.t. mean parameters
            grad = (action - mean) / (std ** 2)
            # Outer product gives gradient w.r.t. W_mean
            self.W_mean += self.lr * returns[t] * np.outer(state, grad)

        # Clear episode data
        self.episode_log_probs = []
        self.episode_rewards = []

# Example: 3-asset portfolio optimization
np.random.seed(42)
state_dim = 5
n_assets = 3

agent = PolicyGradientAgent(state_dim, n_assets, lr=0.001)

# Simulate training
n_episodes = 100
episode_returns = []

for ep in range(n_episodes):
    ep_return = 0
    for t in range(50):
        state = np.random.normal(0, 1, state_dim)
        weights = agent.select_action(state)

        # Simulate asset returns
        asset_returns = np.random.normal(
            [0.0005, 0.0003, 0.0001],  # different expected returns
            [0.02, 0.015, 0.005],       # different volatilities
        )

        # Portfolio return
        portfolio_return = np.sum(weights * asset_returns)
        agent.store_reward(portfolio_return)
        ep_return += portfolio_return

    agent.update()
    episode_returns.append(ep_return)

print(f"Average return (first 20):  {np.mean(episode_returns[:20]):.6f}")
print(f"Average return (last 20):   {np.mean(episode_returns[-20:]):.6f}")

# Show learned allocation preference
test_state = np.random.normal(0, 1, state_dim)
weights = agent.select_action(test_state)
print(f"\\nSample allocation: {np.round(weights, 4)}")
print(f"(Asset 1 highest return -> should get highest weight)")
\`\`\`

### Actor-Critic Methods

Actor-Critic combines policy gradients (actor) with value function estimation (critic):

- **Actor** — Learns the policy (what action to take)
- **Critic** — Learns the value function (how good the current state is)

The critic reduces the variance of policy gradient estimates, leading to faster and more stable learning. Advantage Actor-Critic (A2C) uses the advantage function A(s,a) = Q(s,a) - V(s) to further reduce variance.

### Proximal Policy Optimization (PPO)

PPO is the most popular policy gradient method for trading due to its stability:

- Clips the policy update to prevent large changes (avoids catastrophic forgetting)
- Uses multiple epochs of updates per episode (more sample-efficient)
- Maintains good exploration through entropy regularization
- Works well with both discrete and continuous actions

### Multi-Asset Portfolio Policy

For N assets, the policy outputs a weight vector:

1. Neural network outputs raw scores for each asset
2. Softmax transforms scores to valid weights (positive, sum to 1)
3. For long-short portfolios, use a different normalization (sum of absolute weights = 1)

### Key Takeaway

Policy gradient methods are the natural choice for continuous portfolio allocation problems. REINFORCE provides the simplest implementation; Actor-Critic methods improve stability; PPO offers the best balance of performance and simplicity. The key challenge is variance reduction — financial rewards are noisy, and policy gradients amplify this noise unless properly controlled.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a PolicyGradientAgent for 3-asset portfolio

# TODO: Train for 100 episodes with simulated asset returns

# TODO: Show that the agent learns to allocate more weight
# to the highest-returning asset
`,
      solutionCode: `import numpy as np

class PolicyGradientAgent:
    def __init__(self, state_dim, n_assets, lr=0.001):
        self.W = np.random.randn(state_dim, n_assets) * 0.01
        self.lr = lr
        self.history = []

    def select_action(self, state):
        mean = state @ self.W
        action = mean + 0.1 * np.random.randn(len(mean))
        weights = np.exp(action) / np.sum(np.exp(action))
        self.history.append((state, action, mean))
        return weights

    def update(self, rewards):
        returns = []
        G = 0
        for r in reversed(rewards):
            G = r + 0.99 * G
            returns.insert(0, G)
        returns = np.array(returns)
        if np.std(returns) > 0:
            returns = (returns - np.mean(returns)) / (np.std(returns) + 1e-8)
        for t, (state, action, mean) in enumerate(self.history):
            grad = (action - mean) / 0.01
            self.W += self.lr * returns[t] * np.outer(state, grad)
        self.history = []

np.random.seed(42)
agent = PolicyGradientAgent(5, 3)
ep_returns = []

for ep in range(100):
    rewards = []
    for t in range(50):
        state = np.random.normal(0, 1, 5)
        w = agent.select_action(state)
        r = np.sum(w * np.random.normal([0.0005, 0.0003, 0.0001], [0.02, 0.015, 0.005]))
        rewards.append(r)
    agent.update(rewards)
    ep_returns.append(sum(rewards))

print(f"First 20 avg: {np.mean(ep_returns[:20]):.6f}")
print(f"Last 20 avg:  {np.mean(ep_returns[-20:]):.6f}")
w = agent.select_action(np.random.normal(0, 1, 5))
print(f"Learned weights: {np.round(w, 4)}")
`,
    },
    {
      id: "fml-finrl",
      slug: "finrl-walkthrough",
      title: "FinRL Framework Walkthrough",
      content: `## FinRL Framework Walkthrough

FinRL is an open-source deep reinforcement learning library specifically designed for financial applications. It provides pre-built environments, data pipelines, and agent implementations that dramatically reduce the time required to prototype and deploy RL-based trading strategies. This lesson walks through the FinRL architecture and demonstrates how to use it for portfolio management.

### What is FinRL?

FinRL is built on top of stable_baselines3 (for RL algorithms), gym (for environments), and popular data providers (Yahoo Finance, Alpaca). It provides three layers:

\`\`\`
Layer 3: Applications     [Stock Trading, Portfolio Allocation, Crypto]
Layer 2: Agents           [DQN, PPO, A2C, DDPG, SAC, TD3]
Layer 1: Environments     [StockTradingEnv, PortfolioAllocationEnv]
Layer 0: Data Pipeline    [Yahoo Finance, Alpaca, WRDS, RiceQuant]
\`\`\`

### FinRL Environment Design

\`\`\`python
import numpy as np

class FinRLStyleEnv:
    """
    FinRL-style portfolio allocation environment.
    Mimics the key design patterns of FinRL's StockPortfolioEnv.
    """
    def __init__(self, prices_array, feature_array, initial_amount=1000000,
                 transaction_cost=0.001):
        """
        prices_array: (n_days, n_stocks) daily close prices
        feature_array: (n_days, n_stocks, n_features) features per stock
        """
        self.prices = prices_array
        self.features = feature_array
        self.n_days, self.n_stocks = prices_array.shape
        self.initial_amount = initial_amount
        self.tc = transaction_cost
        self.day = 0
        self.weights = np.ones(self.n_stocks) / self.n_stocks

    def reset(self):
        self.day = 0
        self.weights = np.ones(self.n_stocks) / self.n_stocks
        self.portfolio_value = self.initial_amount
        self.portfolio_history = [self.initial_amount]
        return self._get_obs()

    def _get_obs(self):
        """Observation: current features + portfolio weights."""
        features_flat = self.features[self.day].flatten()
        return np.concatenate([features_flat, self.weights])

    def step(self, action):
        """
        action: target portfolio weights (n_stocks,)
        Must be non-negative and sum to 1.
        """
        # Normalize action to valid weights
        action = np.maximum(action, 0)
        action_sum = np.sum(action)
        if action_sum > 0:
            new_weights = action / action_sum
        else:
            new_weights = np.ones(self.n_stocks) / self.n_stocks

        # Transaction costs
        turnover = np.sum(np.abs(new_weights - self.weights))
        tc_cost = turnover * self.tc

        # Portfolio return
        if self.day < self.n_days - 1:
            daily_returns = (self.prices[self.day + 1] / self.prices[self.day]) - 1
            portfolio_return = np.sum(new_weights * daily_returns) - tc_cost
        else:
            portfolio_return = 0

        # Update state
        self.weights = new_weights
        self.portfolio_value *= (1 + portfolio_return)
        self.portfolio_history.append(self.portfolio_value)
        self.day += 1

        # Reward: risk-adjusted return
        reward = portfolio_return

        done = self.day >= self.n_days - 1
        obs = self._get_obs() if not done else np.zeros_like(self._get_obs())

        info = {
            'portfolio_value': self.portfolio_value,
            'portfolio_return': portfolio_return,
            'turnover': turnover,
            'weights': new_weights.copy()
        }

        return obs, reward, done, info

    def compute_metrics(self):
        """Compute strategy performance metrics."""
        values = np.array(self.portfolio_history)
        returns = np.diff(values) / values[:-1]

        total_return = (values[-1] / values[0]) - 1
        ann_return = (1 + total_return) ** (252 / len(returns)) - 1
        ann_vol = np.std(returns) * np.sqrt(252)
        sharpe = ann_return / ann_vol if ann_vol > 0 else 0

        peak = np.maximum.accumulate(values)
        max_dd = np.min((values - peak) / peak)

        return {
            'total_return': total_return,
            'ann_return': ann_return,
            'sharpe_ratio': sharpe,
            'max_drawdown': max_dd,
        }

# Simulate a 5-stock portfolio environment
np.random.seed(42)
n_days = 252
n_stocks = 5
n_features = 3

# Generate correlated stock prices
base_market = np.cumsum(np.random.normal(0.0003, 0.01, n_days))
prices = np.zeros((n_days, n_stocks))
for i in range(n_stocks):
    stock_specific = np.cumsum(np.random.normal(0.0001 * (i+1), 0.005, n_days))
    prices[:, i] = 100 * np.exp(base_market + stock_specific)

# Generate features (returns, volatility, momentum)
features = np.random.normal(0, 1, (n_days, n_stocks, n_features))

# Create environment and run with a simple strategy
env = FinRLStyleEnv(prices, features)
obs = env.reset()

# Simple momentum strategy: allocate based on recent returns
for day in range(n_days - 1):
    if day > 5:
        recent_returns = (prices[day] / prices[day - 5]) - 1
        weights = np.exp(recent_returns)
        weights = weights / np.sum(weights)
    else:
        weights = np.ones(n_stocks) / n_stocks

    obs, reward, done, info = env.step(weights)
    if done:
        break

metrics = env.compute_metrics()
print("Momentum Strategy Performance:")
for name, value in metrics.items():
    print(f"  {name:20s}: {value:.4f}")

# Compare with equal-weight
env_eq = FinRLStyleEnv(prices, features)
env_eq.reset()
for day in range(n_days - 1):
    _, _, done, _ = env_eq.step(np.ones(n_stocks) / n_stocks)
    if done:
        break

eq_metrics = env_eq.compute_metrics()
print("\\nEqual-Weight Benchmark:")
for name, value in eq_metrics.items():
    print(f"  {name:20s}: {value:.4f}")
\`\`\`

### FinRL Agent Selection Guide

| Algorithm | Action Space | Best For | Complexity |
|-----------|-------------|----------|-----------|
| **DQN** | Discrete | Single-stock trading | Low |
| **A2C** | Both | Fast prototyping | Low |
| **PPO** | Both | Robust portfolio allocation | Medium |
| **DDPG** | Continuous | Multi-asset portfolios | Medium |
| **SAC** | Continuous | Exploration-heavy environments | High |
| **TD3** | Continuous | Reducing overestimation in volatile markets | High |

### Production Deployment Considerations

**Paper trading:** Always paper trade (simulate live trading without real money) for at least 3-6 months before deploying real capital.

**Model retraining:** Markets change; retrain models periodically (monthly or quarterly) with recent data.

**Risk limits:** Implement hard limits on position sizes, sector exposures, and maximum drawdown that override the RL agent's decisions.

**Monitoring:** Track live performance vs. backtest expectations. If Sharpe ratio drops significantly below backtest levels, investigate or reduce allocation.

**Ensemble methods:** Run multiple RL agents with different algorithms and combine their signals. This reduces model risk and provides diversification.

### Key Takeaway

FinRL provides a production-ready framework for applying reinforcement learning to trading and portfolio management. Its strength is the integration of data pipelines, environments, and state-of-the-art RL algorithms into a cohesive system. For production deployment, combine FinRL's agent outputs with traditional risk management, paper trade extensively, and monitor continuously for model decay.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Implement a FinRL-style portfolio environment
# with 5 stocks, transaction costs, and performance metrics

# TODO: Run a simple momentum strategy and compute metrics

# TODO: Compare with an equal-weight benchmark
`,
      solutionCode: `import numpy as np

np.random.seed(42)
n_days, n_stocks = 252, 5
base = np.cumsum(np.random.normal(0.0003, 0.01, n_days))
prices = np.zeros((n_days, n_stocks))
for i in range(n_stocks):
    prices[:, i] = 100 * np.exp(base + np.cumsum(np.random.normal(0.0001*(i+1), 0.005, n_days)))

# Momentum strategy
port_val = 1000000
weights = np.ones(n_stocks) / n_stocks
values = [port_val]
for d in range(n_days - 1):
    if d > 5:
        ret = prices[d] / prices[d-5] - 1
        new_w = np.exp(ret) / np.sum(np.exp(ret))
    else:
        new_w = np.ones(n_stocks) / n_stocks
    tc = np.sum(np.abs(new_w - weights)) * 0.001
    daily_ret = np.sum(new_w * (prices[d+1] / prices[d] - 1)) - tc
    port_val *= (1 + daily_ret)
    weights = new_w
    values.append(port_val)

values = np.array(values)
rets = np.diff(values) / values[:-1]
total = values[-1] / values[0] - 1
sharpe = (np.mean(rets) / np.std(rets)) * np.sqrt(252)
peak = np.maximum.accumulate(values)
max_dd = np.min((values - peak) / peak)

print(f"Momentum: return={total:.4f}, sharpe={sharpe:.4f}, max_dd={max_dd:.4f}")

# Equal weight
eq_val = 1000000
eq_vals = [eq_val]
for d in range(n_days - 1):
    eq_ret = np.mean(prices[d+1] / prices[d] - 1)
    eq_val *= (1 + eq_ret)
    eq_vals.append(eq_val)
eq_total = eq_vals[-1] / eq_vals[0] - 1
print(f"Equal-wt: return={eq_total:.4f}")
`,
    },
  ],
};
