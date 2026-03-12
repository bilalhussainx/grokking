import { Module } from "../types";

export const jsDomModule: Module = {
  id: "js-dom",
  title: "JavaScript & DOM",
  description:
    "Learn to make web pages interactive with JavaScript event handling, DOM manipulation, and small hands-on projects.",
  lessons: [
    {
      id: "js-events",
      slug: "js-events",
      title: "Event Handling",
      content: `## JavaScript Event Handling

**Events** are actions that happen in the browser: clicks, key presses, form submissions, mouse movements, page loads, and more. JavaScript lets you respond to these events.

### Adding Event Listeners

\`\`\`javascript
// Method 1: addEventListener (preferred)
button.addEventListener('click', function(event) {
    console.log('Button clicked!');
});

// Method 2: Arrow function
button.addEventListener('click', (e) => {
    console.log('Clicked at', e.clientX, e.clientY);
});

// Method 3: Inline (avoid)
// <button onclick="handleClick()">
\`\`\`

### Common Events

| Event | Fires When |
|-------|-----------|
| \`click\` | Element is clicked |
| \`dblclick\` | Element is double-clicked |
| \`keydown\` / \`keyup\` | Key is pressed/released |
| \`submit\` | Form is submitted |
| \`input\` | Input value changes |
| \`mouseover\` / \`mouseout\` | Mouse enters/leaves |
| \`DOMContentLoaded\` | HTML is fully parsed |
| \`load\` | Page fully loaded (including images) |

### Event Object

Every event handler receives an **event object** with useful properties:
- \`e.target\` — The element that triggered the event
- \`e.preventDefault()\` — Stop default behavior (form submit, link navigation)
- \`e.stopPropagation()\` — Stop event from bubbling up

### Event Delegation

Instead of adding listeners to many child elements, add one to the parent:

\`\`\`javascript
list.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('completed');
    }
});
\`\`\`

### Problem

Create an interactive button counter and keyboard event handler.`,
      starterCode: `<!-- Create an interactive page with:
     1. A counter that increments/decrements with buttons
     2. A keyboard listener that shows the last key pressed
     3. A color-changing box on hover
-->

<style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .counter { font-size: 48px; text-align: center; margin: 20px 0; }
    .btn { padding: 10px 24px; font-size: 18px; cursor: pointer; margin: 0 8px; }
    .key-display { font-size: 24px; text-align: center; padding: 20px; background: #f0f0f0; margin: 20px 0; border-radius: 8px; }
    .color-box { width: 200px; height: 200px; background: #3b82f6; margin: 20px auto; border-radius: 8px; transition: background 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
</style>

<h2>Event Handling Demo</h2>

<div class="counter" id="count">0</div>
<div style="text-align: center;">
    <button class="btn" id="decrement">-</button>
    <button class="btn" id="reset">Reset</button>
    <button class="btn" id="increment">+</button>
</div>

<div class="key-display" id="keyDisplay">Press any key...</div>

<div class="color-box" id="colorBox">Hover me!</div>

<script>
    // TODO: Counter functionality
    // - Increment button increases count
    // - Decrement button decreases count
    // - Reset button sets count to 0
    // - Display updates each time

    // TODO: Keyboard listener
    // - Show the key name in keyDisplay when any key is pressed

    // TODO: Color box
    // - Change background color on mouseover
    // - Restore original color on mouseout
</script>
`,
      solutionCode: `<style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .counter { font-size: 48px; text-align: center; margin: 20px 0; }
    .btn { padding: 10px 24px; font-size: 18px; cursor: pointer; margin: 0 8px; }
    .key-display { font-size: 24px; text-align: center; padding: 20px; background: #f0f0f0; margin: 20px 0; border-radius: 8px; }
    .color-box { width: 200px; height: 200px; background: #3b82f6; margin: 20px auto; border-radius: 8px; transition: background 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; cursor: pointer; }
</style>

<h2>Event Handling Demo</h2>

<div class="counter" id="count">0</div>
<div style="text-align: center;">
    <button class="btn" id="decrement">-</button>
    <button class="btn" id="reset">Reset</button>
    <button class="btn" id="increment">+</button>
</div>

<div class="key-display" id="keyDisplay">Press any key...</div>

<div class="color-box" id="colorBox">Hover me!</div>

<script>
    // Counter
    let count = 0;
    const countDisplay = document.getElementById('count');

    document.getElementById('increment').addEventListener('click', () => {
        count++;
        countDisplay.textContent = count;
    });

    document.getElementById('decrement').addEventListener('click', () => {
        count--;
        countDisplay.textContent = count;
    });

    document.getElementById('reset').addEventListener('click', () => {
        count = 0;
        countDisplay.textContent = count;
    });

    // Keyboard listener
    document.addEventListener('keydown', (e) => {
        document.getElementById('keyDisplay').textContent =
            'Key: ' + e.key + ' (Code: ' + e.code + ')';
    });

    // Color box
    const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const colorBox = document.getElementById('colorBox');

    colorBox.addEventListener('mouseover', () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        colorBox.style.background = randomColor;
    });

    colorBox.addEventListener('mouseout', () => {
        colorBox.style.background = '#3b82f6';
    });
</script>
`,
    },
    {
      id: "js-dom-manipulation",
      slug: "dom-manipulation",
      title: "DOM Manipulation",
      content: `## DOM Manipulation

The **Document Object Model (DOM)** is a tree representation of an HTML page. JavaScript can read and modify this tree to dynamically change page content.

### Selecting Elements

\`\`\`javascript
document.getElementById('myId');           // Single element
document.querySelector('.myClass');         // First match (CSS selector)
document.querySelectorAll('p');            // All matches (NodeList)
document.getElementsByClassName('card');    // HTMLCollection
\`\`\`

### Modifying Elements

\`\`\`javascript
element.textContent = 'New text';          // Change text
element.innerHTML = '<b>Bold</b>';         // Change HTML (careful: XSS risk)
element.style.color = 'red';              // Change inline style
element.classList.add('active');           // Add class
element.classList.remove('active');        // Remove class
element.classList.toggle('active');        // Toggle class
element.setAttribute('href', '/new');     // Set attribute
\`\`\`

### Creating & Removing Elements

\`\`\`javascript
const div = document.createElement('div');
div.textContent = 'New element';
parent.appendChild(div);                   // Add to end
parent.insertBefore(div, reference);       // Insert before
parent.removeChild(child);                 // Remove child
element.remove();                          // Remove self
\`\`\`

### Problem

Build a dynamic to-do list using DOM manipulation.`,
      starterCode: `<!-- Build a to-do list that:
     1. Has an input field and "Add" button
     2. Adds new items to the list when Add is clicked or Enter is pressed
     3. Each item has a "Delete" button
     4. Clicking an item toggles strikethrough (completed state)
     5. Shows the count of remaining items
-->

<style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #333; }
    .input-group { display: flex; gap: 8px; margin-bottom: 20px; }
    .input-group input { flex: 1; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; }
    .input-group button { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
    #todoList { list-style: none; padding: 0; }
    #todoList li { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
    .completed { text-decoration: line-through; color: #999; }
    .delete-btn { background: #ef4444; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
    #itemCount { color: #666; margin-top: 12px; }
</style>

<h1>To-Do List</h1>
<div class="input-group">
    <input type="text" id="todoInput" placeholder="Add a task...">
    <button id="addBtn">Add</button>
</div>
<ul id="todoList"></ul>
<p id="itemCount">0 items remaining</p>

<script>
    // TODO: Implement the to-do list
    // - Add items on button click and Enter key
    // - Toggle completed class on click
    // - Delete items with delete button
    // - Update item count
</script>
`,
      solutionCode: `<style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #333; }
    .input-group { display: flex; gap: 8px; margin-bottom: 20px; }
    .input-group input { flex: 1; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; }
    .input-group button { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
    #todoList { list-style: none; padding: 0; }
    #todoList li { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; }
    .completed { text-decoration: line-through; color: #999; }
    .delete-btn { background: #ef4444; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
    #itemCount { color: #666; margin-top: 12px; }
</style>

<h1>To-Do List</h1>
<div class="input-group">
    <input type="text" id="todoInput" placeholder="Add a task...">
    <button id="addBtn">Add</button>
</div>
<ul id="todoList"></ul>
<p id="itemCount">0 items remaining</p>

<script>
    const input = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const itemCount = document.getElementById('itemCount');

    function updateCount() {
        const remaining = todoList.querySelectorAll('li:not(.completed)').length;
        itemCount.textContent = remaining + ' item' + (remaining !== 1 ? 's' : '') + ' remaining';
    }

    function addTodo() {
        const text = input.value.trim();
        if (!text) return;

        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            li.remove();
            updateCount();
        });

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            updateCount();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

        input.value = '';
        input.focus();
        updateCount();
    }

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTodo();
    });
</script>
`,
    },
    {
      id: "js-mini-projects",
      slug: "js-mini-projects",
      title: "Mini Projects",
      content: `## JavaScript Mini Projects

Apply your HTML, CSS, and JavaScript skills to build small interactive projects.

### Project: Digital Clock with Timer

Build a page that displays:
1. A live digital clock showing current time (updating every second)
2. A countdown timer where the user enters seconds, starts it, and sees it count down
3. A stopwatch with start, stop, and reset functionality

### Concepts Used

- \`setInterval()\` / \`clearInterval()\` — Repeatedly run code at intervals
- \`Date\` object — Get current time
- DOM manipulation — Update display elements
- Event handling — Button clicks
- String formatting — Pad numbers with leading zeros

### Useful Methods

\`\`\`javascript
setInterval(callback, milliseconds);  // Run every N ms
clearInterval(intervalId);            // Stop interval
new Date().toLocaleTimeString();      // Current time string
String(n).padStart(2, '0');           // "5" -> "05"
\`\`\``,
      starterCode: `<!-- Build a clock, countdown timer, and stopwatch -->
<style>
    body { font-family: 'Courier New', monospace; max-width: 600px; margin: 40px auto; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
    h1, h2 { text-align: center; }
    .time-display { font-size: 48px; text-align: center; margin: 20px 0; color: #3b82f6; }
    .controls { text-align: center; margin: 12px 0; }
    .controls button, .controls input { padding: 8px 16px; font-size: 16px; margin: 4px; border: none; border-radius: 4px; cursor: pointer; }
    .controls button { background: #3b82f6; color: white; }
    .controls button:hover { background: #2563eb; }
    .controls input { width: 100px; text-align: center; background: #16213e; color: white; border: 1px solid #3b82f6; }
    .section { border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
</style>

<h1>Time Tools</h1>

<div class="section">
    <h2>Digital Clock</h2>
    <div class="time-display" id="clock">00:00:00</div>
</div>

<div class="section">
    <h2>Countdown Timer</h2>
    <div class="time-display" id="countdown">00:00</div>
    <div class="controls">
        <input type="number" id="timerInput" placeholder="Seconds" min="1">
        <button id="timerStart">Start</button>
        <button id="timerStop">Stop</button>
        <button id="timerReset">Reset</button>
    </div>
</div>

<div class="section">
    <h2>Stopwatch</h2>
    <div class="time-display" id="stopwatch">00:00.00</div>
    <div class="controls">
        <button id="swStart">Start</button>
        <button id="swStop">Stop</button>
        <button id="swReset">Reset</button>
    </div>
</div>

<script>
    // TODO: Digital Clock
    // Update #clock every second with current time

    // TODO: Countdown Timer
    // Read seconds from input, count down, show mm:ss

    // TODO: Stopwatch
    // Track elapsed time, show mm:ss.ms
</script>
`,
      solutionCode: `<style>
    body { font-family: 'Courier New', monospace; max-width: 600px; margin: 40px auto; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
    h1, h2 { text-align: center; }
    .time-display { font-size: 48px; text-align: center; margin: 20px 0; color: #3b82f6; }
    .controls { text-align: center; margin: 12px 0; }
    .controls button, .controls input { padding: 8px 16px; font-size: 16px; margin: 4px; border: none; border-radius: 4px; cursor: pointer; }
    .controls button { background: #3b82f6; color: white; }
    .controls button:hover { background: #2563eb; }
    .controls input { width: 100px; text-align: center; background: #16213e; color: white; border: 1px solid #3b82f6; }
    .section { border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
</style>

<h1>Time Tools</h1>

<div class="section">
    <h2>Digital Clock</h2>
    <div class="time-display" id="clock">00:00:00</div>
</div>

<div class="section">
    <h2>Countdown Timer</h2>
    <div class="time-display" id="countdown">00:00</div>
    <div class="controls">
        <input type="number" id="timerInput" placeholder="Seconds" min="1">
        <button id="timerStart">Start</button>
        <button id="timerStop">Stop</button>
        <button id="timerReset">Reset</button>
    </div>
</div>

<div class="section">
    <h2>Stopwatch</h2>
    <div class="time-display" id="stopwatch">00:00.00</div>
    <div class="controls">
        <button id="swStart">Start</button>
        <button id="swStop">Stop</button>
        <button id="swReset">Reset</button>
    </div>
</div>

<script>
    const pad = (n, len = 2) => String(n).padStart(len, '0');

    // Digital Clock
    function updateClock() {
        const now = new Date();
        document.getElementById('clock').textContent =
            pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Countdown Timer
    let countdownInterval = null;
    let countdownSeconds = 0;

    function updateCountdownDisplay() {
        const mins = Math.floor(countdownSeconds / 60);
        const secs = countdownSeconds % 60;
        document.getElementById('countdown').textContent = pad(mins) + ':' + pad(secs);
    }

    document.getElementById('timerStart').addEventListener('click', () => {
        if (countdownInterval) return;
        if (countdownSeconds === 0) {
            countdownSeconds = parseInt(document.getElementById('timerInput').value) || 0;
        }
        if (countdownSeconds <= 0) return;
        updateCountdownDisplay();
        countdownInterval = setInterval(() => {
            countdownSeconds--;
            updateCountdownDisplay();
            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }, 1000);
    });

    document.getElementById('timerStop').addEventListener('click', () => {
        clearInterval(countdownInterval);
        countdownInterval = null;
    });

    document.getElementById('timerReset').addEventListener('click', () => {
        clearInterval(countdownInterval);
        countdownInterval = null;
        countdownSeconds = 0;
        updateCountdownDisplay();
    });

    // Stopwatch
    let swInterval = null;
    let swElapsed = 0;

    function updateStopwatchDisplay() {
        const totalSeconds = Math.floor(swElapsed / 100);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const centiseconds = swElapsed % 100;
        document.getElementById('stopwatch').textContent =
            pad(mins) + ':' + pad(secs) + '.' + pad(centiseconds);
    }

    document.getElementById('swStart').addEventListener('click', () => {
        if (swInterval) return;
        swInterval = setInterval(() => {
            swElapsed++;
            updateStopwatchDisplay();
        }, 10);
    });

    document.getElementById('swStop').addEventListener('click', () => {
        clearInterval(swInterval);
        swInterval = null;
    });

    document.getElementById('swReset').addEventListener('click', () => {
        clearInterval(swInterval);
        swInterval = null;
        swElapsed = 0;
        updateStopwatchDisplay();
    });
</script>
`,
    },
  ],
};
