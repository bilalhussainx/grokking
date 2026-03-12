import { Module } from "../types";

export const collisionModule: Module = {
  id: "collision-detection",
  title: "Collision Detection",
  description:
    "Detect when game objects overlap — rectangle vs rectangle, circle vs circle, and how to respond to collisions.",
  lessons: [
    {
      id: "aabb-collision",
      slug: "aabb-collision",
      title: "AABB Collision",
      content: `## AABB Collision Detection

**AABB** stands for **Axis-Aligned Bounding Box** — a rectangle whose sides are parallel to the screen edges. This is the simplest and most common collision check in 2D games.

### The Algorithm

Two rectangles overlap when ALL four of these conditions are true:

\`\`\`
A.left < B.right   AND
A.right > B.left   AND
A.top < B.bottom   AND
A.bottom > B.top
\`\`\`

In code (using x, y, width, height):

\`\`\`javascript
function rectsOverlap(a, b) {
  return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
}
\`\`\`

### Why "Axis-Aligned"?

These boxes do not rotate. If you need rotated collision detection, you need more advanced algorithms (SAT — Separating Axis Theorem). For most 2D games, AABB is sufficient.

### Common Uses

- Player touching enemies or hazards
- Bullets hitting targets
- Player picking up items
- Checking if something is on screen

### Your Task

Implement AABB collision detection and test it with various object arrangements.`,
      starterCode: `// TODO: Write function rectsOverlap(a, b) that returns true if
// rectangles a and b overlap. Each rect has { x, y, width, height }.


// TODO: Write function findCollisions(player, objects) that returns
// an array of all objects the player is currently colliding with.


// Test cases
const player = { x: 100, y: 100, width: 40, height: 40 };

const objects = [
  { x: 120, y: 110, width: 30, height: 30, name: "coin" },     // overlaps
  { x: 300, y: 100, width: 30, height: 30, name: "far-coin" }, // no overlap
  { x: 130, y: 130, width: 50, height: 50, name: "enemy" },    // overlaps
  { x: 90, y: 90, width: 10, height: 10, name: "tiny-coin" },  // no overlap (just misses)
  { x: 139, y: 100, width: 20, height: 20, name: "edge-coin" }, // overlaps (just barely)
];

// TODO: Test individual collisions:
// for (const obj of objects) {
//   console.log(\`Player vs \${obj.name}: \${rectsOverlap(player, obj)}\`);
// }

// TODO: Find all collisions:
// const hits = findCollisions(player, objects);
// console.log("Colliding with:", hits.map(h => h.name));
`,
      solutionCode: `// AABB collision detection
function rectsOverlap(a, b) {
  return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
}

// Find all collisions with the player
function findCollisions(player, objects) {
  return objects.filter(obj => rectsOverlap(player, obj));
}

// Test cases
const player = { x: 100, y: 100, width: 40, height: 40 };

const objects = [
  { x: 120, y: 110, width: 30, height: 30, name: "coin" },
  { x: 300, y: 100, width: 30, height: 30, name: "far-coin" },
  { x: 130, y: 130, width: 50, height: 50, name: "enemy" },
  { x: 90, y: 90, width: 10, height: 10, name: "tiny-coin" },
  { x: 139, y: 100, width: 20, height: 20, name: "edge-coin" },
];

// Test individual collisions
for (const obj of objects) {
  console.log(\`Player vs \${obj.name}: \${rectsOverlap(player, obj)}\`);
}

// Find all collisions
const hits = findCollisions(player, objects);
console.log("Colliding with:", hits.map(h => h.name));
`,
    },
    {
      id: "circle-collision",
      slug: "circle-collision",
      title: "Circle Collision",
      content: `## Circle Collision Detection

Circle collision is perfect for round objects like balls, planets, and explosions. It uses **distance** rather than edge comparison.

### The Algorithm

Two circles overlap when the **distance between their centers** is less than the **sum of their radii**:

\`\`\`javascript
function circlesOverlap(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}
\`\`\`

### Optimization: Skip the Square Root

\`Math.sqrt\` is relatively expensive. You can compare squared distances instead:

\`\`\`javascript
function circlesOverlapFast(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const radiusSum = a.radius + b.radius;
  return distSq < radiusSum * radiusSum;
}
\`\`\`

### Circle vs Rectangle

For checking if a circle hits a rectangle, find the **closest point** on the rectangle to the circle's center, then check if that point is within the circle's radius.

### Your Task

Implement circle collision detection and a circle-vs-rectangle check.`,
      starterCode: `// TODO: Write function circlesOverlap(a, b) that returns true
// if circles a and b overlap. Each circle has { x, y, radius }.


// TODO: Write function distanceBetween(a, b) that returns the distance
// between two circles' centers.


// TODO: Write function circleRectOverlap(circle, rect) that returns true
// if a circle overlaps a rectangle.
// Algorithm:
//   1. Find closest x on rect to circle: clamp(circle.x, rect.x, rect.x + rect.width)
//   2. Find closest y on rect to circle: clamp(circle.y, rect.y, rect.y + rect.height)
//   3. Check if distance from circle center to closest point < circle.radius
// Helper: function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }


// Test circle vs circle
const ball1 = { x: 100, y: 100, radius: 30 };
const ball2 = { x: 150, y: 120, radius: 25 };
const ball3 = { x: 300, y: 300, radius: 20 };

// console.log("ball1 vs ball2:", circlesOverlap(ball1, ball2));
// console.log("Distance:", distanceBetween(ball1, ball2).toFixed(1));
// console.log("ball1 vs ball3:", circlesOverlap(ball1, ball3));
// console.log("Distance:", distanceBetween(ball1, ball3).toFixed(1));

// Test circle vs rectangle
const circle = { x: 150, y: 150, radius: 30 };
const wall = { x: 170, y: 100, width: 200, height: 40 };
const farWall = { x: 400, y: 400, width: 50, height: 50 };

// console.log("Circle vs wall:", circleRectOverlap(circle, wall));
// console.log("Circle vs farWall:", circleRectOverlap(circle, farWall));
`,
      solutionCode: `// Circle collision detection
function circlesOverlap(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}

function distanceBetween(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function circleRectOverlap(circle, rect) {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

// Test circle vs circle
const ball1 = { x: 100, y: 100, radius: 30 };
const ball2 = { x: 150, y: 120, radius: 25 };
const ball3 = { x: 300, y: 300, radius: 20 };

console.log("ball1 vs ball2:", circlesOverlap(ball1, ball2));
console.log("Distance:", distanceBetween(ball1, ball2).toFixed(1));
console.log("ball1 vs ball3:", circlesOverlap(ball1, ball3));
console.log("Distance:", distanceBetween(ball1, ball3).toFixed(1));

// Test circle vs rectangle
const circle = { x: 150, y: 150, radius: 30 };
const wall = { x: 170, y: 100, width: 200, height: 40 };
const farWall = { x: 400, y: 400, width: 50, height: 50 };

console.log("Circle vs wall:", circleRectOverlap(circle, wall));
console.log("Circle vs farWall:", circleRectOverlap(circle, farWall));
`,
    },
    {
      id: "collision-response",
      slug: "collision-response",
      title: "Collision Response",
      content: `## Collision Response

Detecting a collision is only half the job. You also need to **respond** to it — bounce the ball, collect the coin, damage the player.

### Types of Collision Response

| Response | Example |
|----------|---------|
| **Stop** | Player hits a wall, cannot move further |
| **Bounce** | Ball reflects off a surface |
| **Collect** | Player touches a coin, coin disappears, score increases |
| **Damage** | Enemy hits player, lose a life |
| **Push** | Two objects push each other apart |

### Bouncing a Ball

Reverse the velocity component that caused the collision:

\`\`\`javascript
if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
  ball.vx *= -1; // reverse horizontal velocity
}
if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
  ball.vy *= -1; // reverse vertical velocity
}
\`\`\`

### Collecting Items

Remove the item from the array when the player touches it:

\`\`\`javascript
coins = coins.filter(coin => {
  if (rectsOverlap(player, coin)) {
    score += coin.value;
    return false; // remove this coin
  }
  return true; // keep this coin
});
\`\`\`

### Your Task

Build a mini-game simulation with bouncing balls, collectible coins, and enemy damage.`,
      starterCode: `// Collision response mini-game simulation

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
      && a.y < b.y + b.height && a.y + a.height > b.y;
}

const canvas = { width: 800, height: 600 };

// Ball that bounces off walls
const ball = { x: 100, y: 100, radius: 15, vx: 4, vy: 3 };

// Collectible coins
let coins = [
  { x: 200, y: 200, width: 20, height: 20, value: 10 },
  { x: 400, y: 150, width: 20, height: 20, value: 25 },
  { x: 600, y: 300, width: 20, height: 20, value: 50 },
];

const player = { x: 190, y: 190, width: 40, height: 40, lives: 3 };
let score = 0;

// TODO: Write function bounceBall(ball, canvas) that:
//   1. Updates ball position: ball.x += ball.vx, ball.y += ball.vy
//   2. If ball hits left/right walls, reverse ball.vx
//   3. If ball hits top/bottom walls, reverse ball.vy
//   4. Print "Bounce!" when a bounce occurs


// TODO: Write function collectCoins(player, coins) that:
//   1. Filters the coins array - remove coins that overlap with player
//   2. For each collected coin, add its value to score
//   3. Print "Collected coin worth X! Score: Y" for each collection
//   4. Returns the remaining coins array


// TODO: Write function checkEnemyHit(player, ball) that:
//   1. Creates a bounding rect for the ball: { x: ball.x-ball.radius, y: ball.y-ball.radius,
//      width: ball.radius*2, height: ball.radius*2 }
//   2. If it overlaps with player, decrement player.lives and print "Hit! Lives: X"
//   3. Return true if hit, false if not


// Simulate 5 frames:
// for (let frame = 1; frame <= 5; frame++) {
//   console.log("--- Frame " + frame + " ---");
//   bounceBall(ball, canvas);
//   coins = collectCoins(player, coins);
//   checkEnemyHit(player, ball);
//   console.log(\`Ball: (\${ball.x}, \${ball.y}) | Coins left: \${coins.length} | Score: \${score} | Lives: \${player.lives}\`);
// }
`,
      solutionCode: `// Collision response mini-game simulation

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
      && a.y < b.y + b.height && a.y + a.height > b.y;
}

const canvas = { width: 800, height: 600 };

const ball = { x: 100, y: 100, radius: 15, vx: 4, vy: 3 };

let coins = [
  { x: 200, y: 200, width: 20, height: 20, value: 10 },
  { x: 400, y: 150, width: 20, height: 20, value: 25 },
  { x: 600, y: 300, width: 20, height: 20, value: 50 },
];

const player = { x: 190, y: 190, width: 40, height: 40, lives: 3 };
let score = 0;

function bounceBall(ball, canvas) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.vx *= -1;
    console.log("Bounce!");
  }
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.vy *= -1;
    console.log("Bounce!");
  }
}

function collectCoins(player, coins) {
  return coins.filter(coin => {
    if (rectsOverlap(player, coin)) {
      score += coin.value;
      console.log(\`Collected coin worth \${coin.value}! Score: \${score}\`);
      return false;
    }
    return true;
  });
}

function checkEnemyHit(player, ball) {
  const ballRect = {
    x: ball.x - ball.radius,
    y: ball.y - ball.radius,
    width: ball.radius * 2,
    height: ball.radius * 2,
  };
  if (rectsOverlap(player, ballRect)) {
    player.lives--;
    console.log("Hit! Lives: " + player.lives);
    return true;
  }
  return false;
}

// Simulate 5 frames
for (let frame = 1; frame <= 5; frame++) {
  console.log("--- Frame " + frame + " ---");
  bounceBall(ball, canvas);
  coins = collectCoins(player, coins);
  checkEnemyHit(player, ball);
  console.log(\`Ball: (\${ball.x}, \${ball.y}) | Coins left: \${coins.length} | Score: \${score} | Lives: \${player.lives}\`);
}
`,
    },
  ],
};
