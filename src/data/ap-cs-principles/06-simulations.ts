import { Module } from "../types";

export const simulationsModule: Module = {
  id: "ap-csp-simulations",
  title: "Simulations",
  description:
    "Use Python to create simulations that model real-world phenomena using randomness and iteration.",
  lessons: [
    {
      id: "ap-csp-what-are-simulations",
      slug: "what-are-simulations",
      title: "What Are Simulations?",
      content: `## What Are Simulations?

<!-- voice:key_insight -->

A **simulation** is a program that models a real-world process or system. Scientists, engineers, and economists use simulations to study situations that are too expensive, dangerous, or time-consuming to test in reality.

### Why Simulate?

- **Safety**: Crash-test a car design thousands of times without building a single car
- **Speed**: Simulate 100 years of climate change in minutes
- **Cost**: Test a business strategy without risking real money
- **Ethics**: Study disease spread without exposing real people

### Randomness in Simulations

Many real-world processes involve chance. Python's \`random\` module lets you add randomness:

\`\`\`python
import random

# Random integer between 1 and 6 (like a die roll)
roll = random.randint(1, 6)

# Random decimal between 0 and 1
chance = random.random()

# Random choice from a list
color = random.choice(["red", "blue", "green"])
\`\`\`

### Limitations of Simulations

Simulations are **models**, not reality. They are only as good as their assumptions:

- If you simulate weather but ignore ocean currents, your prediction will be off
- If you simulate a coin flip but assume 60% heads (biased coin), results reflect that bias
- More detail = more accurate, but also slower and more complex

### Analogy: Simulations Are Like Dress Rehearsals

A theater group does dress rehearsals before the real performance. The rehearsal simulates the show -- it catches problems and builds confidence, but it is not identical to the real thing.

### Deeper Reading
- AP CSP: Big Idea 3 -- Simulations
- Nicky Case's interactive simulations: ncase.me

### Reflection Questions
1. Name a real-world situation where simulation is better than a physical experiment.
2. What role does randomness play in making simulations realistic?
3. What happens if a simulation's assumptions are wrong?`,
    },
    {
      id: "ap-csp-simulation-exercises",
      slug: "simulation-exercises",
      title: "Practice: Building Simulations",
      content: `## Practice: Building Simulations

Let's build some simulations! You will model coin flips, dice rolls, and a simple random walk.

### Your Task

Complete the simulation functions below.`,
      starterCode: `import random

def coin_flip_simulation(num_flips):
    """Simulate flipping a coin num_flips times.
    Return a dictionary with counts of 'heads' and 'tails'.

    Example: coin_flip_simulation(1000) -> {'heads': 503, 'tails': 497}
    (approximately, since it is random)
    """
    # TODO: Use random.choice(['heads', 'tails']) in a loop
    pass

def estimate_pi(num_points):
    """Estimate pi using the Monte Carlo method.

    Imagine a square with side length 2, centered at origin.
    Inside it, a circle with radius 1.
    Randomly throw darts. The ratio of darts inside the circle
    to total darts approximates pi/4.

    pi ≈ 4 * (points inside circle) / (total points)
    """
    # TODO: Generate random x, y in range [-1, 1]
    # A point is inside the circle if x^2 + y^2 <= 1
    pass

def random_walk(num_steps):
    """Simulate a 1D random walk starting at position 0.
    Each step: move +1 or -1 with equal probability.
    Return the final position.

    Example: random_walk(100) -> some integer (varies each run)
    """
    # TODO: Start at 0, randomly add +1 or -1 each step
    pass

# Tests
result = coin_flip_simulation(10000)
print(f"Coin flips: {result}")

pi_estimate = estimate_pi(100000)
print(f"Pi estimate: {pi_estimate:.4f}")

final_pos = random_walk(1000)
print(f"Random walk final position: {final_pos}")
`,
      solutionCode: `import random

def coin_flip_simulation(num_flips):
    """Simulate flipping a coin num_flips times."""
    counts = {'heads': 0, 'tails': 0}
    for _ in range(num_flips):
        result = random.choice(['heads', 'tails'])
        counts[result] += 1
    return counts

def estimate_pi(num_points):
    """Estimate pi using the Monte Carlo method."""
    inside_circle = 0
    for _ in range(num_points):
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        if x ** 2 + y ** 2 <= 1:
            inside_circle += 1
    return 4 * inside_circle / num_points

def random_walk(num_steps):
    """Simulate a 1D random walk starting at position 0."""
    position = 0
    for _ in range(num_steps):
        step = random.choice([-1, 1])
        position += step
    return position

# Tests
result = coin_flip_simulation(10000)
print(f"Coin flips: {result}")

pi_estimate = estimate_pi(100000)
print(f"Pi estimate: {pi_estimate:.4f}")

final_pos = random_walk(1000)
print(f"Random walk final position: {final_pos}")
`,
    },
    {
      id: "ap-csp-simulations-checkpoint",
      slug: "simulations-checkpoint",
      title: "Checkpoint: Simulations",
      content: `## Checkpoint: Simulations

<!-- voice:section_check -->

### Question 1
What is a simulation, and why do scientists use them?

<details>
<summary>Show Answer</summary>

A simulation is a program that models a real-world process. Scientists use them when real experiments are too expensive, dangerous, slow, or unethical to conduct.
</details>

### Question 2
In the Monte Carlo pi estimation, why does using more points give a better estimate?

<details>
<summary>Show Answer</summary>

With more random points, the ratio of points inside the circle to total points converges closer to the true mathematical ratio (pi/4). This is the **law of large numbers** -- more samples reduce the impact of randomness.
</details>

### Question 3
You simulate rolling two dice 10,000 times and record the sum. Which sum do you expect to appear most often?

<details>
<summary>Show Answer</summary>

**7**. There are more ways to make 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1 = 6 ways) than any other sum. The probability distribution peaks at 7.
</details>

### Question 4
Name one limitation of using simulations to predict real-world outcomes.

<details>
<summary>Show Answer</summary>

Simulations are only as accurate as their assumptions and model. If the model oversimplifies reality or uses incorrect parameters, the results will not match the real world. Simulations approximate -- they do not guarantee.
</details>

### Question 5
Why is \`random.random()\` called a "pseudo-random" number generator?

<details>
<summary>Show Answer</summary>

It uses a mathematical formula (algorithm) to produce numbers that appear random but are actually deterministic. Given the same starting **seed**, the sequence is identical. True randomness requires physical processes (like atmospheric noise).
</details>

### Outstanding!
You have learned to use code to model the real world. Next up: keeping your digital life secure with online security.`,
    },
  ],
};
