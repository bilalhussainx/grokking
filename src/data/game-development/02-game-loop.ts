import { Module } from "../types";

export const gameLoopModule: Module = {
  id: "game-loop",
  title: "The Game Loop",
  description: "Master the game loop pattern — manage game state, separate update from render, and handle frame-independent movement.",
  lessons: [
    {
      id: "game-state",
      slug: "game-state",
      title: "Game State",
      content: `## Game State

Every game tracks data: the player's position, the current score, remaining lives, whether the game is paused. This collection of data is the **game state**.

### Organizing State with Objects

Instead of scattered variables, group related data into objects:

\`\`\`javascript
const gameState = {
  player: { x: 400, y: 500, width: 40, height: 40, speed: 5 },
  score: 0,
  lives: 3,
  level: 1,
  isRunning: true,
  isPaused: false,
};
\`\`\`

### Why Objects?

- **Easy to pass around** — one parameter instead of many
- **Easy to reset** — copy from a template object
- **Easy to save** — serialize to JSON for save/load

### Enemies and Collectibles

Use arrays of objects for dynamic collections:

\`\`\`javascript
const enemies = [
  { x: 100, y: 50, width: 30, height: 30, speed: 2 },
  { x: 300, y: 80, width: 30, height: 30, speed: 3 },
];
\`\`\`

### Your Task

Create a complete game state object and write functions to manipulate it.`,
      starterCode: `// TODO: Create a gameState object with:
//   - player: { x: 400, y: 500, width: 40, height: 40, speed: 5, lives: 3 }
//   - score: 0
//   - level: 1
//   - isGameOver: false
//   - enemies: an empty array


// TODO: Write a function addEnemy(state, x, y) that pushes a new enemy object
// { x, y, width: 30, height: 30, speed: 2 } into state.enemies


// TODO: Write a function addScore(state, points) that:
//   1. Adds points to state.score
//   2. If score reaches a multiple of 100, increment state.level
//   3. Print "Level up! Now level X" when leveling up


// TODO: Write a function loseLife(state) that:
//   1. Decrements state.player.lives
//   2. If lives reach 0, set state.isGameOver to true and print "GAME OVER"
//   3. Otherwise print "Lives remaining: X"


// Test it out:
// addEnemy(gameState, 100, 50);
// addEnemy(gameState, 250, 80);
// console.log("Enemies:", gameState.enemies.length);
// addScore(gameState, 50);
// console.log("Score:", gameState.score, "Level:", gameState.level);
// addScore(gameState, 50);
// console.log("Score:", gameState.score, "Level:", gameState.level);
// loseLife(gameState);
// loseLife(gameState);
// loseLife(gameState);
`,
      solutionCode: `// Create game state
const gameState = {
  player: { x: 400, y: 500, width: 40, height: 40, speed: 5, lives: 3 },
  score: 0,
  level: 1,
  isGameOver: false,
  enemies: [],
};

// Add an enemy to the game
function addEnemy(state, x, y) {
  state.enemies.push({ x, y, width: 30, height: 30, speed: 2 });
}

// Add points and check for level up
function addScore(state, points) {
  const oldLevel = Math.floor(state.score / 100);
  state.score += points;
  const newLevel = Math.floor(state.score / 100);
  if (newLevel > oldLevel) {
    state.level = newLevel + 1;
    console.log("Level up! Now level " + state.level);
  }
}

// Lose a life, check for game over
function loseLife(state) {
  state.player.lives--;
  if (state.player.lives <= 0) {
    state.isGameOver = true;
    console.log("GAME OVER");
  } else {
    console.log("Lives remaining: " + state.player.lives);
  }
}

// Test it out
addEnemy(gameState, 100, 50);
addEnemy(gameState, 250, 80);
console.log("Enemies:", gameState.enemies.length);
addScore(gameState, 50);
console.log("Score:", gameState.score, "Level:", gameState.level);
addScore(gameState, 50);
console.log("Score:", gameState.score, "Level:", gameState.level);
loseLife(gameState);
loseLife(gameState);
loseLife(gameState);
`,
    },
    {
      id: "update-and-render",
      slug: "update-and-render",
      title: "Update & Render",
      content: `## Update & Render

A clean game loop separates **update logic** (moving things, checking collisions) from **rendering** (drawing things). This separation makes your code easier to debug and maintain.

### The Pattern

\`\`\`javascript
function update(state) {
  // Move enemies, check collisions, update score
  // NO drawing here!
}

function render(state, ctx) {
  // Clear canvas, draw everything
  // NO game logic here!
}

function gameLoop() {
  update(gameState);
  render(gameState, ctx);
  requestAnimationFrame(gameLoop);
}
\`\`\`

### Why Separate?

1. **Testability** — you can test update logic without a canvas
2. **Clarity** — each function has one job
3. **Flexibility** — you can run updates at a different rate than rendering

### Update Responsibilities

- Move entities based on their speed
- Check for collisions
- Spawn/remove enemies
- Update score, lives, level

### Render Responsibilities

- Clear the screen
- Draw the background
- Draw all game entities
- Draw UI (score, lives)

### Your Task

Build a complete update-render loop for a simple game with a moving player and falling enemies.`,
      starterCode: `// Game state
const state = {
  player: { x: 400, y: 550, width: 40, height: 40 },
  enemies: [
    { x: 100, y: 0, width: 30, height: 30, speed: 5 },
    { x: 300, y: -50, width: 30, height: 30, speed: 3 },
    { x: 500, y: -100, width: 30, height: 30, speed: 4 },
  ],
  score: 0,
  canvasHeight: 600,
};

// TODO: Write function update(state) that:
//   1. Loops through each enemy and moves it down (increase y by its speed)
//   2. If an enemy's y > state.canvasHeight, reset its y to -30 (wraps to top)
//      and increment state.score by 10 (player survived that enemy)
//   3. Print nothing — update is silent


// TODO: Write function render(state) that:
//   1. Prints "--- Rendering ---"
//   2. Prints the player position: "Player at (x, y)"
//   3. Loops through enemies and prints "Enemy at (x, y)" for each
//   4. Prints "Score: X"


// Simulate 5 frames
// for (let frame = 1; frame <= 5; frame++) {
//   console.log("=== Frame " + frame + " ===");
//   update(state);
//   render(state);
// }
`,
      solutionCode: `// Game state
const state = {
  player: { x: 400, y: 550, width: 40, height: 40 },
  enemies: [
    { x: 100, y: 0, width: 30, height: 30, speed: 5 },
    { x: 300, y: -50, width: 30, height: 30, speed: 3 },
    { x: 500, y: -100, width: 30, height: 30, speed: 4 },
  ],
  score: 0,
  canvasHeight: 600,
};

// Update: move enemies, check bounds, update score
function update(state) {
  for (const enemy of state.enemies) {
    enemy.y += enemy.speed;
    if (enemy.y > state.canvasHeight) {
      enemy.y = -30;
      state.score += 10;
    }
  }
}

// Render: display the current state
function render(state) {
  console.log("--- Rendering ---");
  console.log(\`Player at (\${state.player.x}, \${state.player.y})\`);
  for (const enemy of state.enemies) {
    console.log(\`Enemy at (\${enemy.x}, \${enemy.y})\`);
  }
  console.log("Score: " + state.score);
}

// Simulate 5 frames
for (let frame = 1; frame <= 5; frame++) {
  console.log("=== Frame " + frame + " ===");
  update(state);
  render(state);
}
`,
    },
    {
      id: "delta-time",
      slug: "delta-time",
      title: "Delta Time",
      content: `## Delta Time

If your game says "move 5 pixels per frame," the speed depends on the frame rate. At 60 FPS the object moves 300 px/sec, but at 30 FPS it moves only 150 px/sec. **Delta time** fixes this.

### What Is Delta Time?

Delta time (\`dt\`) is the number of seconds since the last frame. You multiply speed by \`dt\` so movement is consistent regardless of frame rate:

\`\`\`javascript
// Instead of: enemy.x += speed;
enemy.x += speed * dt;  // speed is now "pixels per SECOND"
\`\`\`

### Calculating Delta Time

\`\`\`javascript
let lastTime = 0;
function gameLoop(currentTime) {
  const dt = (currentTime - lastTime) / 1000; // convert ms to seconds
  lastTime = currentTime;
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
\`\`\`

### Frame-Independent Movement

| Without dt | With dt |
|------------|---------|
| \`x += 5\` (per frame) | \`x += 300 * dt\` (per second) |
| 60 FPS = 300 px/s | 60 FPS = 300 px/s |
| 30 FPS = 150 px/s | 30 FPS = 300 px/s |

### Your Task

Implement delta time in a game loop and verify that total distance is consistent across different frame rates.`,
      starterCode: `// Simulate delta time at different frame rates

// TODO: Write function simulateFrames(fps, durationSeconds, speedPixelsPerSec)
// that:
//   1. Calculates dt = 1 / fps
//   2. Calculates totalFrames = fps * durationSeconds
//   3. Starts with position x = 0
//   4. For each frame, adds speedPixelsPerSec * dt to x
//   5. Returns the final x position
// This demonstrates frame-rate independent movement.


// TODO: Test with different frame rates over 2 seconds at 200 px/sec:
// const dist60 = simulateFrames(60, 2, 200);
// const dist30 = simulateFrames(30, 2, 200);
// const dist15 = simulateFrames(15, 2, 200);
// console.log("60 FPS, 2 sec @ 200px/s:", dist60, "px");
// console.log("30 FPS, 2 sec @ 200px/s:", dist30, "px");
// console.log("15 FPS, 2 sec @ 200px/s:", dist15, "px");
// console.log("All distances equal?", dist60 === dist30 && dist30 === dist15);


// TODO: Now show what happens WITHOUT delta time.
// Write function simulateWithoutDt(fps, durationSeconds, speedPerFrame)
//   1. totalFrames = fps * durationSeconds
//   2. x = 0, each frame adds speedPerFrame
//   3. Returns final x


// TODO: Test without dt — speed 5 per frame for 2 seconds:
// const bad60 = simulateWithoutDt(60, 2, 5);
// const bad30 = simulateWithoutDt(30, 2, 5);
// console.log("Without dt at 60 FPS:", bad60, "px");
// console.log("Without dt at 30 FPS:", bad30, "px");
// console.log("Distances equal?", bad60 === bad30, "(they should NOT be!)");
`,
      solutionCode: `// Simulate delta time at different frame rates

function simulateFrames(fps, durationSeconds, speedPixelsPerSec) {
  const dt = 1 / fps;
  const totalFrames = fps * durationSeconds;
  let x = 0;
  for (let i = 0; i < totalFrames; i++) {
    x += speedPixelsPerSec * dt;
  }
  return Math.round(x * 100) / 100; // round to avoid floating point noise
}

// Test with different frame rates over 2 seconds at 200 px/sec
const dist60 = simulateFrames(60, 2, 200);
const dist30 = simulateFrames(30, 2, 200);
const dist15 = simulateFrames(15, 2, 200);
console.log("60 FPS, 2 sec @ 200px/s:", dist60, "px");
console.log("30 FPS, 2 sec @ 200px/s:", dist30, "px");
console.log("15 FPS, 2 sec @ 200px/s:", dist15, "px");
console.log("All distances equal?", dist60 === dist30 && dist30 === dist15);

// Without delta time
function simulateWithoutDt(fps, durationSeconds, speedPerFrame) {
  const totalFrames = fps * durationSeconds;
  let x = 0;
  for (let i = 0; i < totalFrames; i++) {
    x += speedPerFrame;
  }
  return x;
}

// Test without dt — speed 5 per frame for 2 seconds
const bad60 = simulateWithoutDt(60, 2, 5);
const bad30 = simulateWithoutDt(30, 2, 5);
console.log("Without dt at 60 FPS:", bad60, "px");
console.log("Without dt at 30 FPS:", bad30, "px");
console.log("Distances equal?", bad60 === bad30, "(they should NOT be!)");
`,
    },
  ],
};
