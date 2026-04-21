import { Module } from "../types";

export const gameProjectsModule: Module = {
  id: "game-projects",
  title: "Build Games",
  description: "Put it all together by building four classic games — Pong, Snake, Breakout, and a Space Shooter.",
  lessons: [
    {
      id: "pong-game",
      slug: "pong-game",
      title: "Pong",
      content: `## Build Pong

Pong is the "Hello World" of game development. Two paddles, one ball, simple physics — yet it teaches core game mechanics.

### Game Elements

- **Ball** — moves diagonally, bounces off walls and paddles
- **Two Paddles** — one per player, move up and down
- **Score** — point awarded when the ball passes a paddle
- **Win Condition** — first to a target score

### Key Concepts Used

- Game loop (update + render)
- Keyboard input (W/S for player 1, ArrowUp/ArrowDown for player 2)
- AABB collision between ball and paddles
- Ball bouncing physics
- Score tracking

### Design

\`\`\`
|  [P1]          o          [P2]  |
|  [  ]                     [  ]  |
|              Score              |
|           P1: 3  P2: 2         |
\`\`\`

### Your Task

Build a complete Pong game simulation. The ball bounces between paddles, and scores are tracked.`,
      starterCode: `// PONG - Complete Game Simulation

const CANVAS = { width: 800, height: 400 };
const WINNING_SCORE = 3;

// TODO: Create the game state object with:
//   ball: { x: 400, y: 200, radius: 8, vx: 5, vy: 3 }
//   paddle1: { x: 20, y: 170, width: 10, height: 60 } (left player)
//   paddle2: { x: 770, y: 170, width: 10, height: 60 } (right player)
//   score: { p1: 0, p2: 0 }
//   gameOver: false
//   winner: null


// TODO: Write function movePaddle(paddle, direction, canvas)
//   direction is "up" (-8) or "down" (+8)
//   Clamp paddle.y between 0 and canvas.height - paddle.height


// TODO: Write function updateBall(state)
//   1. Move ball by vx and vy
//   2. Bounce off top/bottom walls (reverse vy)
//   3. Check collision with paddle1 (ball.x - ball.radius <= paddle1.x + paddle1.width
//      AND ball.y is between paddle1.y and paddle1.y + paddle1.height)
//      If hit: reverse vx, increase speed slightly (vx *= 1.1)
//   4. Same check for paddle2 on the right side
//   5. If ball goes past left edge: score for player 2, reset ball
//   6. If ball goes past right edge: score for player 1, reset ball
//   7. If any score >= WINNING_SCORE, set gameOver and winner


// TODO: Write function resetBall(ball, canvas)
//   Center the ball, give it random direction


// TODO: Write function printState(state)
//   Print ball position, paddle positions, and score


// Simulate a game: alternate moves and update ball each frame
// const state = /* your game state */;
// const moves = [
//   { p1: "up", p2: "down" },
//   { p1: "up", p2: "up" },
//   { p1: "down", p2: "up" },
//   { p1: "down", p2: "down" },
//   { p1: "up", p2: "up" },
// ];
//
// for (let frame = 0; frame < 50 && !state.gameOver; frame++) {
//   const move = moves[frame % moves.length];
//   movePaddle(state.paddle1, move.p1, CANVAS);
//   movePaddle(state.paddle2, move.p2, CANVAS);
//   updateBall(state);
//   if (frame % 10 === 0) printState(state);
// }
// console.log("Final Score - P1:", state.score.p1, "P2:", state.score.p2);
// if (state.winner) console.log("Winner:", state.winner);
`,
      solutionCode: `// PONG - Complete Game Simulation

const CANVAS = { width: 800, height: 400 };
const WINNING_SCORE = 3;

const state = {
  ball: { x: 400, y: 200, radius: 8, vx: 5, vy: 3 },
  paddle1: { x: 20, y: 170, width: 10, height: 60 },
  paddle2: { x: 770, y: 170, width: 10, height: 60 },
  score: { p1: 0, p2: 0 },
  gameOver: false,
  winner: null,
};

function movePaddle(paddle, direction, canvas) {
  const speed = 8;
  if (direction === "up") paddle.y -= speed;
  if (direction === "down") paddle.y += speed;
  paddle.y = Math.max(0, Math.min(paddle.y, canvas.height - paddle.height));
}

function resetBall(ball, canvas) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
  ball.vy = (Math.random() > 0.5 ? 1 : -1) * 3;
}

function updateBall(state) {
  const { ball, paddle1, paddle2 } = state;
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Bounce off top/bottom
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= CANVAS.height) {
    ball.vy *= -1;
  }

  // Hit paddle1 (left)
  if (ball.x - ball.radius <= paddle1.x + paddle1.width
      && ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height
      && ball.vx < 0) {
    ball.vx *= -1.1;
    console.log("Paddle 1 hit!");
  }

  // Hit paddle2 (right)
  if (ball.x + ball.radius >= paddle2.x
      && ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height
      && ball.vx > 0) {
    ball.vx *= -1.1;
    console.log("Paddle 2 hit!");
  }

  // Score for player 2
  if (ball.x < 0) {
    state.score.p2++;
    console.log("Point for Player 2! Score:", state.score.p1, "-", state.score.p2);
    resetBall(ball, CANVAS);
  }

  // Score for player 1
  if (ball.x > CANVAS.width) {
    state.score.p1++;
    console.log("Point for Player 1! Score:", state.score.p1, "-", state.score.p2);
    resetBall(ball, CANVAS);
  }

  if (state.score.p1 >= WINNING_SCORE) { state.gameOver = true; state.winner = "Player 1"; }
  if (state.score.p2 >= WINNING_SCORE) { state.gameOver = true; state.winner = "Player 2"; }
}

function printState(state) {
  console.log(\`Ball: (\${state.ball.x.toFixed(0)}, \${state.ball.y.toFixed(0)}) | P1 paddle: \${state.paddle1.y} | P2 paddle: \${state.paddle2.y} | Score: \${state.score.p1}-\${state.score.p2}\`);
}

const moves = [
  { p1: "up", p2: "down" },
  { p1: "up", p2: "up" },
  { p1: "down", p2: "up" },
  { p1: "down", p2: "down" },
  { p1: "up", p2: "up" },
];

for (let frame = 0; frame < 50 && !state.gameOver; frame++) {
  const move = moves[frame % moves.length];
  movePaddle(state.paddle1, move.p1, CANVAS);
  movePaddle(state.paddle2, move.p2, CANVAS);
  updateBall(state);
  if (frame % 10 === 0) printState(state);
}
console.log("Final Score - P1:", state.score.p1, "P2:", state.score.p2);
if (state.winner) console.log("Winner:", state.winner);
`,
    },
    {
      id: "snake-game",
      slug: "snake-game",
      title: "Snake",
      content: `## Build Snake

Snake is a grid-based game where you control a growing snake. Eat food to grow, but do not hit the walls or yourself.

### Game Elements

- **Snake** — an array of grid cells (the head moves, body follows)
- **Food** — random position on the grid, eaten by the snake head
- **Grid** — the game world divided into cells (e.g., 20x20)
- **Direction** — up, down, left, right (cannot reverse into yourself)

### Key Concepts

- Grid-based movement (move one cell at a time)
- Array manipulation (unshift head, pop tail)
- Self-collision (head overlaps any body segment)
- Food spawning (random cell not occupied by snake)

### Movement Logic

Each frame:
1. Calculate new head position based on direction
2. Add new head to front of snake array
3. If head is on food: grow (do not remove tail), spawn new food
4. If head is NOT on food: remove the last segment (tail)
5. Check for wall collision or self collision

### Your Task

Build a complete Snake game simulation.`,
      starterCode: `// SNAKE - Complete Game Simulation

const GRID = { width: 20, height: 15, cellSize: 20 };

// TODO: Create game state:
//   snake: [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }]  (head first)
//   direction: "right"
//   food: { x: 15, y: 7 }
//   score: 0
//   gameOver: false


// TODO: Write function changeDirection(state, newDir)
//   Prevent reversing (can't go "left" if currently "right", etc.)
//   Valid: up/down/left/right


// TODO: Write function moveSnake(state)
//   1. Calculate new head based on direction:
//      right: x+1, left: x-1, up: y-1, down: y+1
//   2. Check wall collision (new head out of bounds) -> game over
//   3. Check self collision (new head matches any body segment) -> game over
//   4. Add new head to front of snake array
//   5. If new head matches food position:
//      - Increment score
//      - Spawn new food (call spawnFood)
//      - Do NOT remove tail (snake grows)
//   6. If not eating: remove last element (tail)


// TODO: Write function spawnFood(state)
//   Place food at random grid position not occupied by snake
//   Simple approach: random x (0 to width-1), random y (0 to height-1)
//   Check if any snake segment is at that position, retry if so


// TODO: Write function printGrid(state)
//   Print a simple text representation:
//   - "H" for snake head, "o" for body, "F" for food, "." for empty
//   (Only print a small area around the action to keep output manageable)


// Simulate a game with predetermined moves:
// const moves = ["right","right","right","right","right","down","down","left","left","left"];
// for (let i = 0; i < moves.length && !state.gameOver; i++) {
//   changeDirection(state, moves[i]);
//   moveSnake(state);
//   console.log(\`Turn \${i+1}: Head at (\${state.snake[0].x}, \${state.snake[0].y}), Length: \${state.snake.length}, Score: \${state.score}\`);
// }
`,
      solutionCode: `// SNAKE - Complete Game Simulation

const GRID = { width: 20, height: 15, cellSize: 20 };

const state = {
  snake: [{ x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }],
  direction: "right",
  food: { x: 15, y: 7 },
  score: 0,
  gameOver: false,
};

function changeDirection(state, newDir) {
  const opposites = { up: "down", down: "up", left: "right", right: "left" };
  if (newDir !== opposites[state.direction]) {
    state.direction = newDir;
  }
}

function spawnFood(state) {
  let x, y, onSnake;
  do {
    x = Math.floor(Math.random() * GRID.width);
    y = Math.floor(Math.random() * GRID.height);
    onSnake = state.snake.some(seg => seg.x === x && seg.y === y);
  } while (onSnake);
  state.food = { x, y };
  console.log(\`Food spawned at (\${x}, \${y})\`);
}

function moveSnake(state) {
  const head = state.snake[0];
  const newHead = { x: head.x, y: head.y };

  if (state.direction === "right") newHead.x++;
  if (state.direction === "left") newHead.x--;
  if (state.direction === "up") newHead.y--;
  if (state.direction === "down") newHead.y++;

  // Wall collision
  if (newHead.x < 0 || newHead.x >= GRID.width || newHead.y < 0 || newHead.y >= GRID.height) {
    state.gameOver = true;
    console.log("Game Over! Hit the wall.");
    return;
  }

  // Self collision
  if (state.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    state.gameOver = true;
    console.log("Game Over! Hit yourself.");
    return;
  }

  state.snake.unshift(newHead);

  // Check food
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    state.score += 10;
    console.log("Ate food! Score: " + state.score);
    spawnFood(state);
  } else {
    state.snake.pop();
  }
}

function printGrid(state) {
  const head = state.snake[0];
  for (let y = Math.max(0, head.y - 3); y <= Math.min(GRID.height - 1, head.y + 3); y++) {
    let row = "";
    for (let x = Math.max(0, head.x - 5); x <= Math.min(GRID.width - 1, head.x + 5); x++) {
      if (state.snake[0].x === x && state.snake[0].y === y) row += "H ";
      else if (state.snake.some(s => s.x === x && s.y === y)) row += "o ";
      else if (state.food.x === x && state.food.y === y) row += "F ";
      else row += ". ";
    }
    console.log(row);
  }
}

// Simulate a game
const moves = ["right","right","right","right","right","down","down","left","left","left"];
for (let i = 0; i < moves.length && !state.gameOver; i++) {
  changeDirection(state, moves[i]);
  moveSnake(state);
  console.log(\`Turn \${i+1}: Head at (\${state.snake[0].x}, \${state.snake[0].y}), Length: \${state.snake.length}, Score: \${state.score}\`);
}
printGrid(state);
`,
    },
    {
      id: "breakout-game",
      slug: "breakout-game",
      title: "Breakout",
      content: `## Build Breakout

Breakout (Brick Breaker) adds brick destruction to the bouncing ball formula. Break all the bricks to clear the level.

### Game Elements

- **Paddle** — moves left/right at the bottom, controlled by the player
- **Ball** — bounces off walls, paddle, and bricks
- **Bricks** — grid of destructible blocks at the top
- **Lives** — lose a life when the ball falls below the paddle
- **Levels** — clear all bricks to advance, new layout appears

### Key Concepts

- Paddle-ball collision with angle control
- Brick grid generation
- Tracking which bricks are destroyed
- Level progression

### Brick Layout

Bricks are typically arranged in a grid:

\`\`\`
[B][B][B][B][B][B][B][B]
[B][B][B][B][B][B][B][B]
[B][B][B][B][B][B][B][B]
\`\`\`

Different rows can have different point values or hit points.

### Your Task

Build a Breakout game with a paddle, bouncing ball, and destructible bricks.`,
      starterCode: `// BREAKOUT - Complete Game Simulation

const CANVAS = { width: 800, height: 600 };

// TODO: Write function createBricks(rows, cols, brickWidth, brickHeight, padding, offsetX, offsetY)
//   Returns a 1D array of brick objects:
//   { x, y, width, height, alive: true, points: (row+1) * 10 }
//   Each brick is positioned based on its row/col with padding between them


// TODO: Create game state:
//   paddle: { x: 350, y: 560, width: 100, height: 15 }
//   ball: { x: 400, y: 545, radius: 8, vx: 4, vy: -4 }
//   bricks: createBricks(4, 8, 80, 25, 5, 55, 40)
//   score: 0
//   lives: 3
//   level: 1


// TODO: Write function updateBreakout(state)
//   1. Move ball
//   2. Bounce off left/right/top walls
//   3. If ball goes below paddle (y > canvas.height):
//      - Lose a life, reset ball to above paddle
//      - If lives <= 0, game over
//   4. Check ball-paddle collision: bounce ball upward
//   5. Check ball-brick collision for each alive brick:
//      - If hit: set brick.alive = false, reverse ball.vy, add points
//   6. If all bricks destroyed: next level (recreate bricks, increase ball speed)


// TODO: Write function printBreakout(state)
//   Print: level, score, lives, bricks remaining, ball position


// Simulate 30 frames:
// for (let frame = 1; frame <= 30; frame++) {
//   updateBreakout(state);
//   if (frame % 10 === 0) printBreakout(state);
// }
`,
      solutionCode: `// BREAKOUT - Complete Game Simulation

const CANVAS = { width: 800, height: 600 };

function createBricks(rows, cols, brickWidth, brickHeight, padding, offsetX, offsetY) {
  const bricks = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      bricks.push({
        x: offsetX + col * (brickWidth + padding),
        y: offsetY + row * (brickHeight + padding),
        width: brickWidth,
        height: brickHeight,
        alive: true,
        points: (row + 1) * 10,
      });
    }
  }
  return bricks;
}

const state = {
  paddle: { x: 350, y: 560, width: 100, height: 15 },
  ball: { x: 400, y: 545, radius: 8, vx: 4, vy: -4 },
  bricks: createBricks(4, 8, 80, 25, 5, 55, 40),
  score: 0,
  lives: 3,
  level: 1,
  gameOver: false,
};

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
      && a.y < b.y + b.height && a.y + a.height > b.y;
}

function updateBreakout(state) {
  const { ball, paddle } = state;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall bounces
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= CANVAS.width) ball.vx *= -1;
  if (ball.y - ball.radius <= 0) ball.vy *= -1;

  // Ball falls below paddle
  if (ball.y > CANVAS.height) {
    state.lives--;
    console.log("Lost a life! Lives: " + state.lives);
    if (state.lives <= 0) {
      state.gameOver = true;
      console.log("GAME OVER! Final score: " + state.score);
      return;
    }
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius - 1;
    ball.vx = 4;
    ball.vy = -4;
  }

  // Paddle collision
  const ballRect = { x: ball.x - ball.radius, y: ball.y - ball.radius, width: ball.radius * 2, height: ball.radius * 2 };
  if (rectsOverlap(ballRect, paddle) && ball.vy > 0) {
    ball.vy *= -1;
    const hitPos = (ball.x - paddle.x) / paddle.width;
    ball.vx = 8 * (hitPos - 0.5);
  }

  // Brick collisions
  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    if (rectsOverlap(ballRect, brick)) {
      brick.alive = false;
      ball.vy *= -1;
      state.score += brick.points;
      console.log(\`Brick destroyed! +\${brick.points} pts (Score: \${state.score})\`);
      break;
    }
  }

  // Level clear
  if (state.bricks.every(b => !b.alive)) {
    state.level++;
    console.log("Level " + state.level + "!");
    state.bricks = createBricks(4, 8, 80, 25, 5, 55, 40);
    ball.vx *= 1.2;
    ball.vy *= 1.2;
  }
}

function printBreakout(state) {
  const bricksLeft = state.bricks.filter(b => b.alive).length;
  console.log(\`Level: \${state.level} | Score: \${state.score} | Lives: \${state.lives} | Bricks: \${bricksLeft} | Ball: (\${state.ball.x.toFixed(0)}, \${state.ball.y.toFixed(0)})\`);
}

// Simulate 30 frames
for (let frame = 1; frame <= 30 && !state.gameOver; frame++) {
  updateBreakout(state);
  if (frame % 10 === 0) printBreakout(state);
}
`,
    },
    {
      id: "space-shooter-game",
      slug: "space-shooter-game",
      title: "Space Shooter",
      content: `## Build a Space Shooter

A scrolling space shooter with enemies, bullets, explosions, and a score system. This is the capstone project combining everything you have learned.

### Game Elements

- **Player Ship** — moves left/right, fires bullets upward
- **Enemies** — spawn at the top, move downward in patterns
- **Bullets** — fired by the player, destroy enemies on contact
- **Explosions** — visual feedback when enemies are destroyed
- **Score & Waves** — increasing difficulty with each wave

### Architecture

\`\`\`
Update Phase:
  1. Move player based on input
  2. Move all bullets upward
  3. Move all enemies downward
  4. Spawn new enemies (wave system)
  5. Check bullet-enemy collisions -> explosion + score
  6. Check enemy-player collisions -> damage
  7. Remove off-screen bullets and enemies
  8. Update explosions (fade out)

Render Phase:
  1. Draw starfield background
  2. Draw player
  3. Draw enemies
  4. Draw bullets
  5. Draw explosions
  6. Draw HUD (score, lives, wave)
\`\`\`

### Your Task

Build the complete Space Shooter game simulation.`,
      starterCode: `// SPACE SHOOTER - Complete Game Simulation

const CANVAS = { width: 600, height: 800 };

// TODO: Create game state:
//   player: { x: 280, y: 720, width: 40, height: 40, speed: 6, lives: 3 }
//   bullets: []   (each bullet: { x, y, width: 4, height: 10, speed: 8 })
//   enemies: []   (each enemy: { x, y, width: 35, height: 35, speed: 2, points: 100 })
//   explosions: [] (each: { x, y, radius: 20, life: 10 })
//   score: 0
//   wave: 1
//   frameCount: 0
//   gameOver: false


// TODO: Write function spawnEnemy(state)
//   Create enemy at random x (0 to canvas.width - 35), y = -35
//   Push to state.enemies


// TODO: Write function fireBullet(state)
//   Create bullet at player center (player.x + player.width/2 - 2, player.y - 10)
//   Push to state.bullets
//   Print "Fire!"


// TODO: Write function updateShooter(state)
//   1. Increment frameCount
//   2. Move all bullets up (y -= bullet.speed), remove if y < -10
//   3. Move all enemies down (y += enemy.speed), remove if y > canvas.height
//      - If enemy passes bottom: lose a life
//   4. Spawn enemy every 15 frames
//   5. Check bullet-enemy collisions:
//      For each bullet, for each enemy: if overlap, remove both,
//      add explosion, add enemy.points to score
//   6. Update explosions: decrement life, remove if life <= 0
//   7. Every 100 frames: increment wave, increase enemy speed
//   8. If lives <= 0: gameOver


// TODO: Write function printShooter(state)
//   Print wave, score, lives, enemies count, bullets count


// Simulate the game:
// const inputs = ["fire","fire","","fire","","","fire","","fire","","","","fire","","fire","","","","","fire"];
// for (let i = 0; i < 60 && !state.gameOver; i++) {
//   if (inputs[i % inputs.length] === "fire") fireBullet(state);
//   updateShooter(state);
//   if (i % 15 === 0) printShooter(state);
// }
// console.log("=== GAME RESULTS ===");
// console.log("Score:", state.score, "| Wave:", state.wave, "| Survived:", state.frameCount, "frames");
`,
      solutionCode: `// SPACE SHOOTER - Complete Game Simulation

const CANVAS = { width: 600, height: 800 };

const state = {
  player: { x: 280, y: 720, width: 40, height: 40, speed: 6, lives: 3 },
  bullets: [],
  enemies: [],
  explosions: [],
  score: 0,
  wave: 1,
  frameCount: 0,
  gameOver: false,
};

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
      && a.y < b.y + b.height && a.y + a.height > b.y;
}

function spawnEnemy(state) {
  state.enemies.push({
    x: Math.floor(Math.random() * (CANVAS.width - 35)),
    y: -35,
    width: 35,
    height: 35,
    speed: 2 + state.wave * 0.5,
    points: 100 + state.wave * 25,
  });
}

function fireBullet(state) {
  state.bullets.push({
    x: state.player.x + state.player.width / 2 - 2,
    y: state.player.y - 10,
    width: 4,
    height: 10,
    speed: 8,
  });
  console.log("Fire!");
}

function updateShooter(state) {
  state.frameCount++;

  // Move bullets
  state.bullets.forEach(b => b.y -= b.speed);
  state.bullets = state.bullets.filter(b => b.y > -10);

  // Move enemies
  state.enemies.forEach(e => e.y += e.speed);
  const passed = state.enemies.filter(e => e.y > CANVAS.height);
  if (passed.length > 0) {
    state.player.lives -= passed.length;
    console.log(\`\${passed.length} enemy passed! Lives: \${state.player.lives}\`);
  }
  state.enemies = state.enemies.filter(e => e.y <= CANVAS.height);

  // Spawn enemies
  if (state.frameCount % 15 === 0) spawnEnemy(state);

  // Bullet-enemy collisions
  const hitBullets = new Set();
  const hitEnemies = new Set();
  for (let bi = 0; bi < state.bullets.length; bi++) {
    for (let ei = 0; ei < state.enemies.length; ei++) {
      if (hitEnemies.has(ei)) continue;
      if (rectsOverlap(state.bullets[bi], state.enemies[ei])) {
        hitBullets.add(bi);
        hitEnemies.add(ei);
        const enemy = state.enemies[ei];
        state.explosions.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, radius: 20, life: 10 });
        state.score += enemy.points;
        console.log(\`Enemy destroyed! +\${enemy.points} pts (Score: \${state.score})\`);
      }
    }
  }
  state.bullets = state.bullets.filter((_, i) => !hitBullets.has(i));
  state.enemies = state.enemies.filter((_, i) => !hitEnemies.has(i));

  // Update explosions
  state.explosions.forEach(e => e.life--);
  state.explosions = state.explosions.filter(e => e.life > 0);

  // Wave progression
  if (state.frameCount % 100 === 0) {
    state.wave++;
    console.log("Wave " + state.wave + "!");
  }

  // Game over check
  if (state.player.lives <= 0) {
    state.gameOver = true;
    console.log("GAME OVER!");
  }
}

function printShooter(state) {
  console.log(\`Wave: \${state.wave} | Score: \${state.score} | Lives: \${state.player.lives} | Enemies: \${state.enemies.length} | Bullets: \${state.bullets.length}\`);
}

// Simulate the game
const inputs = ["fire","fire","","fire","","","fire","","fire","","","","fire","","fire","","","","","fire"];
for (let i = 0; i < 60 && !state.gameOver; i++) {
  if (inputs[i % inputs.length] === "fire") fireBullet(state);
  updateShooter(state);
  if (i % 15 === 0) printShooter(state);
}
console.log("=== GAME RESULTS ===");
console.log("Score:", state.score, "| Wave:", state.wave, "| Survived:", state.frameCount, "frames");
`,
    },
  ],
};
