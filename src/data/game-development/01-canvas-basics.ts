import { Module } from "../types";

export const canvasBasicsModule: Module = {
  id: "canvas-basics",
  title: "Canvas & Drawing",
  description: "Learn HTML5 Canvas fundamentals for game graphics — rectangles, circles, text, images, and animation.",
  lessons: [
    {
      id: "canvas-setup",
      slug: "canvas-setup",
      title: "Setting Up the Canvas",
      content: `## Your Game Canvas

The HTML5 \`<canvas>\` element is your drawing surface for 2D games. Everything you see in a canvas game — characters, backgrounds, UI — is drawn programmatically.

### How Canvas Works

1. **Create a canvas** element with a width and height
2. **Get the 2D rendering context** — this is the object you call drawing methods on
3. **Draw** shapes, images, and text using the context

\`\`\`javascript
const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");
\`\`\`

### Drawing Rectangles

The context provides three rectangle methods:

| Method | Description |
|--------|-------------|
| \`fillRect(x, y, w, h)\` | Draws a filled rectangle |
| \`strokeRect(x, y, w, h)\` | Draws a rectangle outline |
| \`clearRect(x, y, w, h)\` | Clears a rectangular area |

### Coordinate System

Canvas uses a coordinate system where **(0, 0) is the top-left corner**. X increases to the right, Y increases downward.

\`\`\`
(0,0) -----> X
|
|
v
Y
\`\`\`

### Colors

Set \`ctx.fillStyle\` before calling \`fillRect\` to control the fill color. You can use color names, hex codes, or RGB values.

### Your Task

Create a canvas, set a fill color, and draw rectangles at specific positions.`,
      starterCode: `// Mock canvas and context (simulates browser Canvas API)
const canvas = { width: 800, height: 600 };
const ctx = {
  fillStyle: "",
  fillRect(x, y, w, h) {
    console.log(\`fillRect(\${x}, \${y}, \${w}, \${h}) with color "\${this.fillStyle}"\`);
  },
  strokeRect(x, y, w, h) {
    console.log(\`strokeRect(\${x}, \${y}, \${w}, \${h})\`);
  },
  clearRect(x, y, w, h) {
    console.log(\`clearRect(\${x}, \${y}, \${w}, \${h})\`);
  }
};

// TODO: Set fillStyle to "blue" and draw a 100x50 rectangle at (50, 50)


// TODO: Set fillStyle to "red" and draw a 60x60 square at (200, 100)


// TODO: Draw a stroke (outline) rectangle at (350, 50) with size 120x80


// TODO: Print the canvas dimensions
`,
      solutionCode: `// Mock canvas and context (simulates browser Canvas API)
const canvas = { width: 800, height: 600 };
const ctx = {
  fillStyle: "",
  fillRect(x, y, w, h) {
    console.log(\`fillRect(\${x}, \${y}, \${w}, \${h}) with color "\${this.fillStyle}"\`);
  },
  strokeRect(x, y, w, h) {
    console.log(\`strokeRect(\${x}, \${y}, \${w}, \${h})\`);
  },
  clearRect(x, y, w, h) {
    console.log(\`clearRect(\${x}, \${y}, \${w}, \${h})\`);
  }
};

// Set fillStyle to "blue" and draw a 100x50 rectangle at (50, 50)
ctx.fillStyle = "blue";
ctx.fillRect(50, 50, 100, 50);

// Set fillStyle to "red" and draw a 60x60 square at (200, 100)
ctx.fillStyle = "red";
ctx.fillRect(200, 100, 60, 60);

// Draw a stroke (outline) rectangle at (350, 50) with size 120x80
ctx.strokeRect(350, 50, 120, 80);

// Print the canvas dimensions
console.log("Canvas size:", canvas.width, "x", canvas.height);
`,
    },
    {
      id: "drawing-shapes",
      slug: "drawing-shapes",
      title: "Drawing Shapes",
      content: `## Drawing Shapes

Beyond rectangles, Canvas lets you draw circles, lines, and complex paths using the **path API**.

### The Path API

Paths are sequences of points connected by lines or curves:

1. \`beginPath()\` — start a new path
2. \`moveTo(x, y)\` — move the pen without drawing
3. \`lineTo(x, y)\` — draw a line to this point
4. \`arc(x, y, radius, startAngle, endAngle)\` — draw an arc or circle
5. \`closePath()\` — connect back to the starting point
6. \`fill()\` or \`stroke()\` — render the path

### Drawing a Circle

\`\`\`javascript
ctx.beginPath();
ctx.arc(200, 150, 50, 0, Math.PI * 2); // full circle
ctx.fillStyle = "green";
ctx.fill();
\`\`\`

### Drawing Lines

\`\`\`javascript
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(100, 50);
ctx.strokeStyle = "white";
ctx.lineWidth = 2;
ctx.stroke();
\`\`\`

### Colors & Styles

| Property | Description |
|----------|-------------|
| \`fillStyle\` | Color for filled shapes |
| \`strokeStyle\` | Color for outlines/lines |
| \`lineWidth\` | Thickness of lines |
| \`globalAlpha\` | Transparency (0.0 to 1.0) |

### Your Task

Use the path API to draw circles, lines, and a triangle.`,
      starterCode: `// Mock canvas context with path API
const shapes = [];
const ctx = {
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  beginPath() { console.log("beginPath()"); },
  moveTo(x, y) { console.log(\`moveTo(\${x}, \${y})\`); },
  lineTo(x, y) { console.log(\`lineTo(\${x}, \${y})\`); },
  arc(x, y, r, start, end) {
    const type = (end - start >= Math.PI * 2) ? "full circle" : "arc";
    console.log(\`arc(\${x}, \${y}, radius=\${r}) [\${type}]\`);
  },
  closePath() { console.log("closePath()"); },
  fill() { console.log(\`fill() with color "\${this.fillStyle}"\`); },
  stroke() { console.log(\`stroke() with color "\${this.strokeStyle}" width=\${this.lineWidth}\`); }
};

// TODO: Draw a green filled circle at (100, 100) with radius 40
// Hint: beginPath -> arc -> set fillStyle -> fill


// TODO: Draw a red line from (200, 50) to (350, 150) with lineWidth 3
// Hint: beginPath -> moveTo -> lineTo -> set strokeStyle & lineWidth -> stroke


// TODO: Draw a yellow filled triangle with vertices at (400,50), (450,150), (350,150)
// Hint: beginPath -> moveTo to first point -> lineTo to second -> lineTo to third -> closePath -> fill

`,
      solutionCode: `// Mock canvas context with path API
const shapes = [];
const ctx = {
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  beginPath() { console.log("beginPath()"); },
  moveTo(x, y) { console.log(\`moveTo(\${x}, \${y})\`); },
  lineTo(x, y) { console.log(\`lineTo(\${x}, \${y})\`); },
  arc(x, y, r, start, end) {
    const type = (end - start >= Math.PI * 2) ? "full circle" : "arc";
    console.log(\`arc(\${x}, \${y}, radius=\${r}) [\${type}]\`);
  },
  closePath() { console.log("closePath()"); },
  fill() { console.log(\`fill() with color "\${this.fillStyle}"\`); },
  stroke() { console.log(\`stroke() with color "\${this.strokeStyle}" width=\${this.lineWidth}\`); }
};

// Draw a green filled circle at (100, 100) with radius 40
ctx.beginPath();
ctx.arc(100, 100, 40, 0, Math.PI * 2);
ctx.fillStyle = "green";
ctx.fill();

// Draw a red line from (200, 50) to (350, 150) with lineWidth 3
ctx.beginPath();
ctx.moveTo(200, 50);
ctx.lineTo(350, 150);
ctx.strokeStyle = "red";
ctx.lineWidth = 3;
ctx.stroke();

// Draw a yellow filled triangle with vertices at (400,50), (450,150), (350,150)
ctx.beginPath();
ctx.moveTo(400, 50);
ctx.lineTo(450, 150);
ctx.lineTo(350, 150);
ctx.closePath();
ctx.fillStyle = "yellow";
ctx.fill();
`,
    },
    {
      id: "text-and-images",
      slug: "text-and-images",
      title: "Text & Images",
      content: `## Text & Images

Games need text for scores, menus, and dialog. They also need images for sprites, backgrounds, and UI elements.

### Drawing Text

Canvas provides two text methods:

| Method | Description |
|--------|-------------|
| \`fillText(text, x, y)\` | Draw filled text |
| \`strokeText(text, x, y)\` | Draw text outline |

### Text Properties

\`\`\`javascript
ctx.font = "24px Arial";          // size and font family
ctx.fillStyle = "white";          // text color
ctx.textAlign = "center";         // left, center, right
ctx.textBaseline = "middle";      // top, middle, bottom
ctx.fillText("Score: 100", 400, 30);
\`\`\`

### Loading and Drawing Images

Images in canvas require loading before drawing:

\`\`\`javascript
const img = new Image();
img.src = "player.png";
img.onload = () => {
  ctx.drawImage(img, x, y);              // draw at position
  ctx.drawImage(img, x, y, width, height); // draw scaled
};
\`\`\`

### Drawing a Sprite from a Sprite Sheet

\`\`\`javascript
// drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
// s = source rectangle, d = destination rectangle
ctx.drawImage(spriteSheet, 0, 0, 32, 32, 100, 100, 64, 64);
\`\`\`

### Your Task

Draw game UI text (score, title, game over) and simulate image loading.`,
      starterCode: `// Mock canvas context for text and images
const ctx = {
  font: "10px sans-serif",
  fillStyle: "#000",
  strokeStyle: "#000",
  textAlign: "start",
  textBaseline: "alphabetic",
  fillText(text, x, y) {
    console.log(\`fillText("\${text}") at (\${x}, \${y}) [font: \${this.font}, color: \${this.fillStyle}, align: \${this.textAlign}]\`);
  },
  strokeText(text, x, y) {
    console.log(\`strokeText("\${text}") at (\${x}, \${y}) [font: \${this.font}]\`);
  },
  drawImage(img, ...args) {
    if (args.length === 2) {
      console.log(\`drawImage("\${img.src}") at (\${args[0]}, \${args[1]})\`);
    } else if (args.length === 4) {
      console.log(\`drawImage("\${img.src}") at (\${args[0]}, \${args[1]}) scaled to \${args[2]}x\${args[3]}\`);
    }
  }
};

// Mock Image class
class GameImage {
  constructor() { this.src = ""; this.loaded = false; }
  load() { this.loaded = true; console.log(\`Image loaded: \${this.src}\`); }
}

// TODO: Set font to "bold 32px Arial", fillStyle to "white", textAlign to "center"
// Then draw "SPACE INVADERS" at (400, 50)


// TODO: Set font to "20px Arial", fillStyle to "yellow"
// Draw "Score: 1500" at (70, 30) with textAlign "left"


// TODO: Set font to "bold 48px Arial", fillStyle to "red", textAlign to "center"
// Draw "GAME OVER" at (400, 300)


// TODO: Create a new GameImage, set its src to "spaceship.png", load it,
// then drawImage at position (380, 500) scaled to 40x40

`,
      solutionCode: `// Mock canvas context for text and images
const ctx = {
  font: "10px sans-serif",
  fillStyle: "#000",
  strokeStyle: "#000",
  textAlign: "start",
  textBaseline: "alphabetic",
  fillText(text, x, y) {
    console.log(\`fillText("\${text}") at (\${x}, \${y}) [font: \${this.font}, color: \${this.fillStyle}, align: \${this.textAlign}]\`);
  },
  strokeText(text, x, y) {
    console.log(\`strokeText("\${text}") at (\${x}, \${y}) [font: \${this.font}]\`);
  },
  drawImage(img, ...args) {
    if (args.length === 2) {
      console.log(\`drawImage("\${img.src}") at (\${args[0]}, \${args[1]})\`);
    } else if (args.length === 4) {
      console.log(\`drawImage("\${img.src}") at (\${args[0]}, \${args[1]}) scaled to \${args[2]}x\${args[3]}\`);
    }
  }
};

// Mock Image class
class GameImage {
  constructor() { this.src = ""; this.loaded = false; }
  load() { this.loaded = true; console.log(\`Image loaded: \${this.src}\`); }
}

// Draw title
ctx.font = "bold 32px Arial";
ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.fillText("SPACE INVADERS", 400, 50);

// Draw score
ctx.font = "20px Arial";
ctx.fillStyle = "yellow";
ctx.textAlign = "left";
ctx.fillText("Score: 1500", 70, 30);

// Draw game over
ctx.font = "bold 48px Arial";
ctx.fillStyle = "red";
ctx.textAlign = "center";
ctx.fillText("GAME OVER", 400, 300);

// Load and draw an image
const ship = new GameImage();
ship.src = "spaceship.png";
ship.load();
ctx.drawImage(ship, 380, 500, 40, 40);
`,
    },
    {
      id: "animation-loop",
      slug: "animation-loop",
      title: "Animation Loop",
      content: `## Animation Loop

Games are not static images — they update many times per second to create the illusion of movement. This is the **animation loop** (or **game loop**).

### requestAnimationFrame

The browser provides \`requestAnimationFrame(callback)\` which calls your function roughly 60 times per second:

\`\`\`javascript
function gameLoop() {
  // 1. Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 2. Update game state
  x += speed;
  // 3. Draw everything
  ctx.fillRect(x, y, 50, 50);
  // 4. Schedule the next frame
  requestAnimationFrame(gameLoop);
}
gameLoop(); // start the loop
\`\`\`

### The Three Steps

Every frame follows this pattern:

1. **Clear** the canvas (erase the previous frame)
2. **Update** positions, physics, game logic
3. **Draw** everything at its new position

### Why Clear First?

If you do not clear the canvas, old drawings remain. You would see a trail of rectangles instead of one moving rectangle.

### Frame Rate

\`requestAnimationFrame\` targets 60 FPS (frames per second), but the actual rate depends on the display and system load. We will learn how to handle this with **delta time** in the next module.

### Your Task

Simulate an animation loop that moves a square across the screen.`,
      starterCode: `// Simulated animation loop (runs 5 frames instead of infinite)
const canvas = { width: 800, height: 600 };

// Game object
let ballX = 50;
let ballY = 300;
const ballSize = 20;
const speed = 30; // pixels per frame (exaggerated for demo)

let frameCount = 0;
const MAX_FRAMES = 5;

function clearCanvas() {
  console.log(\`--- Frame \${frameCount + 1} ---\`);
  console.log(\`clearRect(0, 0, \${canvas.width}, \${canvas.height})\`);
}

function drawBall() {
  console.log(\`fillRect(\${ballX}, \${ballY}, \${ballSize}, \${ballSize}) color="lime"\`);
}

function gameLoop() {
  if (frameCount >= MAX_FRAMES) {
    console.log("Animation complete! Ball moved from x=50 to x=" + ballX);
    return;
  }

  // TODO: Step 1 - Call clearCanvas()

  // TODO: Step 2 - Update ballX by adding speed

  // TODO: Step 3 - Call drawBall()

  // TODO: Step 4 - Increment frameCount

  // TODO: Step 5 - Call gameLoop() again (simulates requestAnimationFrame)
}

// Start the loop
gameLoop();
`,
      solutionCode: `// Simulated animation loop (runs 5 frames instead of infinite)
const canvas = { width: 800, height: 600 };

// Game object
let ballX = 50;
let ballY = 300;
const ballSize = 20;
const speed = 30; // pixels per frame (exaggerated for demo)

let frameCount = 0;
const MAX_FRAMES = 5;

function clearCanvas() {
  console.log(\`--- Frame \${frameCount + 1} ---\`);
  console.log(\`clearRect(0, 0, \${canvas.width}, \${canvas.height})\`);
}

function drawBall() {
  console.log(\`fillRect(\${ballX}, \${ballY}, \${ballSize}, \${ballSize}) color="lime"\`);
}

function gameLoop() {
  if (frameCount >= MAX_FRAMES) {
    console.log("Animation complete! Ball moved from x=50 to x=" + ballX);
    return;
  }

  // Step 1 - Clear the canvas
  clearCanvas();

  // Step 2 - Update position
  ballX += speed;

  // Step 3 - Draw the ball at new position
  drawBall();

  // Step 4 - Increment frame counter
  frameCount++;

  // Step 5 - Next frame (simulates requestAnimationFrame)
  gameLoop();
}

// Start the loop
gameLoop();
`,
    },
  ],
};
