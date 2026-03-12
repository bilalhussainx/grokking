import { Module } from "../types";

export const inputHandlingModule: Module = {
  id: "input-handling",
  title: "Player Input",
  description:
    "Handle keyboard and mouse events to let players control the action — from key tracking to smooth movement.",
  lessons: [
    {
      id: "keyboard-events",
      slug: "keyboard-events",
      title: "Keyboard Events",
      content: `## Keyboard Events

To make a game interactive, you need to respond to player input. The most common input for desktop games is the keyboard.

### Event Listeners

The browser fires events when keys are pressed and released:

\`\`\`javascript
document.addEventListener("keydown", (e) => {
  console.log("Key pressed:", e.key);
});

document.addEventListener("keyup", (e) => {
  console.log("Key released:", e.key);
});
\`\`\`

### Tracking Pressed Keys

A common pattern is to maintain a **Set** of currently pressed keys:

\`\`\`javascript
const keys = new Set();

document.addEventListener("keydown", (e) => keys.add(e.key));
document.addEventListener("keyup", (e) => keys.delete(e.key));

// In your update loop:
if (keys.has("ArrowLeft")) player.x -= player.speed;
if (keys.has("ArrowRight")) player.x += player.speed;
\`\`\`

### Common Key Names

| Key | \`e.key\` value |
|-----|---------------|
| Arrow keys | \`"ArrowUp"\`, \`"ArrowDown"\`, \`"ArrowLeft"\`, \`"ArrowRight"\` |
| WASD | \`"w"\`, \`"a"\`, \`"s"\`, \`"d"\` |
| Space | \`" "\` |
| Enter | \`"Enter"\` |
| Escape | \`"Escape"\` |

### Preventing Default Behavior

Call \`e.preventDefault()\` to stop the browser from scrolling when arrow keys or space are pressed.

### Your Task

Build a key tracking system and use it to process a sequence of simulated key events.`,
      starterCode: `// Simulated keyboard input system

// TODO: Create a Set called "keys" to track pressed keys
// const keys = new Set();

// TODO: Write function onKeyDown(key) that:
//   1. Adds the key to the Set
//   2. Prints "Key DOWN: <key>"


// TODO: Write function onKeyUp(key) that:
//   1. Removes the key from the Set
//   2. Prints "Key UP: <key>"


// TODO: Write function isPressed(key) that returns true if the key is in the Set


// TODO: Write function getActiveKeys() that returns an array of all pressed keys


// Simulate a play sequence:
// onKeyDown("ArrowRight");
// onKeyDown("ArrowUp");
// console.log("Active keys:", getActiveKeys());
// console.log("Is ArrowRight pressed?", isPressed("ArrowRight"));
// console.log("Is ArrowLeft pressed?", isPressed("ArrowLeft"));
// onKeyUp("ArrowRight");
// onKeyDown(" ");  // space bar (jump/shoot)
// console.log("Active keys:", getActiveKeys());
// onKeyUp("ArrowUp");
// onKeyUp(" ");
// console.log("Active keys:", getActiveKeys());
`,
      solutionCode: `// Simulated keyboard input system

// Track pressed keys
const keys = new Set();

function onKeyDown(key) {
  keys.add(key);
  console.log("Key DOWN: " + key);
}

function onKeyUp(key) {
  keys.delete(key);
  console.log("Key UP: " + key);
}

function isPressed(key) {
  return keys.has(key);
}

function getActiveKeys() {
  return [...keys];
}

// Simulate a play sequence
onKeyDown("ArrowRight");
onKeyDown("ArrowUp");
console.log("Active keys:", getActiveKeys());
console.log("Is ArrowRight pressed?", isPressed("ArrowRight"));
console.log("Is ArrowLeft pressed?", isPressed("ArrowLeft"));
onKeyUp("ArrowRight");
onKeyDown(" ");  // space bar
console.log("Active keys:", getActiveKeys());
onKeyUp("ArrowUp");
onKeyUp(" ");
console.log("Active keys:", getActiveKeys());
`,
    },
    {
      id: "mouse-events",
      slug: "mouse-events",
      title: "Mouse Events",
      content: `## Mouse Events

Mouse input is essential for menus, aiming, clicking buttons, and many game mechanics.

### Common Mouse Events

| Event | When It Fires |
|-------|--------------|
| \`click\` | Mouse button pressed and released |
| \`mousedown\` | Mouse button pressed |
| \`mouseup\` | Mouse button released |
| \`mousemove\` | Mouse moves over the element |

### Getting Mouse Coordinates

The event object gives you coordinates relative to the page, but for canvas games you need coordinates relative to the canvas:

\`\`\`javascript
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
});
\`\`\`

### Hit Testing

To check if the mouse clicked on a game object, test if the click coordinates fall within the object's bounding box:

\`\`\`javascript
function isInsideRect(mx, my, rect) {
  return mx >= rect.x && mx <= rect.x + rect.width
      && my >= rect.y && my <= rect.y + rect.height;
}
\`\`\`

### Your Task

Build a mouse tracking system with hit testing for UI buttons.`,
      starterCode: `// Simulated mouse system

const mouse = { x: 0, y: 0, clicked: false };

const buttons = [
  { x: 300, y: 200, width: 200, height: 50, label: "Start Game" },
  { x: 300, y: 270, width: 200, height: 50, label: "Options" },
  { x: 300, y: 340, width: 200, height: 50, label: "Quit" },
];

// TODO: Write function onMouseMove(x, y) that updates mouse.x and mouse.y


// TODO: Write function isInsideRect(mx, my, rect) that returns true
// if (mx, my) is inside the rectangle { x, y, width, height }


// TODO: Write function onClick(x, y) that:
//   1. Updates mouse position
//   2. Loops through the buttons array
//   3. If the click is inside a button, print "Clicked: <label>"
//   4. If no button was clicked, print "Clicked empty space at (x, y)"


// TODO: Write function getHoveredButton(x, y) that returns the label
// of the button under the cursor, or null if none


// Test the system:
// onMouseMove(350, 220);
// console.log("Hovered:", getHoveredButton(mouse.x, mouse.y));
// onClick(350, 220);   // Should click "Start Game"
// onClick(400, 290);   // Should click "Options"
// onClick(100, 100);   // Should click empty space
// onClick(350, 360);   // Should click "Quit"
`,
      solutionCode: `// Simulated mouse system

const mouse = { x: 0, y: 0, clicked: false };

const buttons = [
  { x: 300, y: 200, width: 200, height: 50, label: "Start Game" },
  { x: 300, y: 270, width: 200, height: 50, label: "Options" },
  { x: 300, y: 340, width: 200, height: 50, label: "Quit" },
];

function onMouseMove(x, y) {
  mouse.x = x;
  mouse.y = y;
}

function isInsideRect(mx, my, rect) {
  return mx >= rect.x && mx <= rect.x + rect.width
      && my >= rect.y && my <= rect.y + rect.height;
}

function onClick(x, y) {
  onMouseMove(x, y);
  for (const btn of buttons) {
    if (isInsideRect(x, y, btn)) {
      console.log("Clicked: " + btn.label);
      return;
    }
  }
  console.log(\`Clicked empty space at (\${x}, \${y})\`);
}

function getHoveredButton(x, y) {
  for (const btn of buttons) {
    if (isInsideRect(x, y, btn)) {
      return btn.label;
    }
  }
  return null;
}

// Test the system
onMouseMove(350, 220);
console.log("Hovered:", getHoveredButton(mouse.x, mouse.y));
onClick(350, 220);   // Start Game
onClick(400, 290);   // Options
onClick(100, 100);   // Empty space
onClick(350, 360);   // Quit
`,
    },
    {
      id: "player-movement",
      slug: "player-movement",
      title: "Player Movement",
      content: `## Player Movement

Combining keyboard input with the game loop gives us smooth, responsive player movement. This is the foundation of every action game.

### Basic Movement

\`\`\`javascript
function updatePlayer(player, keys, dt) {
  if (keys.has("ArrowLeft"))  player.x -= player.speed * dt;
  if (keys.has("ArrowRight")) player.x += player.speed * dt;
  if (keys.has("ArrowUp"))    player.y -= player.speed * dt;
  if (keys.has("ArrowDown"))  player.y += player.speed * dt;
}
\`\`\`

### Clamping to Bounds

Prevent the player from leaving the screen:

\`\`\`javascript
player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
\`\`\`

### Diagonal Movement Fix

When moving diagonally (e.g., right + up), the player moves faster because both axes add speed. Normalize the movement vector:

\`\`\`javascript
let dx = 0, dy = 0;
if (keys.has("ArrowLeft"))  dx -= 1;
if (keys.has("ArrowRight")) dx += 1;
if (keys.has("ArrowUp"))    dy -= 1;
if (keys.has("ArrowDown"))  dy += 1;

// Normalize so diagonal speed equals straight speed
const length = Math.sqrt(dx * dx + dy * dy);
if (length > 0) {
  dx /= length;
  dy /= length;
}
player.x += dx * player.speed * dt;
player.y += dy * player.speed * dt;
\`\`\`

### Your Task

Implement smooth player movement with bounds clamping and diagonal normalization.`,
      starterCode: `// Player movement system
const canvas = { width: 800, height: 600 };
const player = { x: 400, y: 300, width: 40, height: 40, speed: 200 }; // speed in px/sec
const dt = 1 / 60; // simulate 60 FPS

// TODO: Write function movePlayer(player, pressedKeys, dt, canvas)
//   1. Calculate dx and dy from pressed keys:
//      "ArrowLeft" or "a" -> dx = -1
//      "ArrowRight" or "d" -> dx = +1
//      "ArrowUp" or "w" -> dy = -1
//      "ArrowDown" or "s" -> dy = +1
//   2. Normalize: if length > 0, divide dx and dy by length
//   3. Apply movement: player.x += dx * player.speed * dt
//   4. Clamp to canvas bounds (0 to canvas.width - player.width, etc.)


// Helper to simulate multiple frames of input
function simulate(keys, frames, label) {
  // Reset position
  player.x = 400;
  player.y = 300;
  const pressedKeys = new Set(keys);

  for (let i = 0; i < frames; i++) {
    movePlayer(player, pressedKeys, dt, canvas);
  }
  console.log(\`\${label}: final position (\${player.x.toFixed(1)}, \${player.y.toFixed(1)})\`);
}

// TODO: Uncomment and test:
// simulate(["ArrowRight"], 60, "Right 1 sec");
// simulate(["ArrowUp"], 60, "Up 1 sec");
// simulate(["ArrowRight", "ArrowUp"], 60, "Diagonal 1 sec");
// simulate(["d"], 60, "WASD right 1 sec");

// Verify: right 1 sec should move ~200px. Diagonal should also move ~200px total
// (not ~283px which is what you get without normalization)
`,
      solutionCode: `// Player movement system
const canvas = { width: 800, height: 600 };
const player = { x: 400, y: 300, width: 40, height: 40, speed: 200 }; // speed in px/sec
const dt = 1 / 60; // simulate 60 FPS

function movePlayer(player, pressedKeys, dt, canvas) {
  let dx = 0, dy = 0;

  if (pressedKeys.has("ArrowLeft") || pressedKeys.has("a")) dx -= 1;
  if (pressedKeys.has("ArrowRight") || pressedKeys.has("d")) dx += 1;
  if (pressedKeys.has("ArrowUp") || pressedKeys.has("w")) dy -= 1;
  if (pressedKeys.has("ArrowDown") || pressedKeys.has("s")) dy += 1;

  // Normalize diagonal movement
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length > 0) {
    dx /= length;
    dy /= length;
  }

  // Apply movement
  player.x += dx * player.speed * dt;
  player.y += dy * player.speed * dt;

  // Clamp to canvas bounds
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

// Helper to simulate multiple frames of input
function simulate(keys, frames, label) {
  player.x = 400;
  player.y = 300;
  const pressedKeys = new Set(keys);

  for (let i = 0; i < frames; i++) {
    movePlayer(player, pressedKeys, dt, canvas);
  }
  console.log(\`\${label}: final position (\${player.x.toFixed(1)}, \${player.y.toFixed(1)})\`);
}

// Test movement
simulate(["ArrowRight"], 60, "Right 1 sec");
simulate(["ArrowUp"], 60, "Up 1 sec");
simulate(["ArrowRight", "ArrowUp"], 60, "Diagonal 1 sec");
simulate(["d"], 60, "WASD right 1 sec");
`,
    },
  ],
};
