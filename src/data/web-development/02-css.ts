import { Module } from "../types";

export const cssModule: Module = {
  id: "css-fundamentals",
  title: "CSS Fundamentals",
  description:
    "Master CSS selectors, the box model, Flexbox layout, and CSS Grid to style and layout web pages.",
  lessons: [
    {
      id: "css-selectors",
      slug: "css-selectors",
      title: "CSS Selectors & Properties",
      content: `## CSS Selectors & Properties

**CSS** (Cascading Style Sheets) controls the visual presentation of HTML elements.

### How to Add CSS

1. **Inline**: \`<p style="color: red;">\` (avoid)
2. **Internal**: \`<style>\` tag in \`<head>\`
3. **External**: \`<link rel="stylesheet" href="style.css">\` (preferred)

### Selector Types

| Selector | Example | Selects |
|----------|---------|---------|
| Element | \`p\` | All \`<p>\` elements |
| Class | \`.card\` | Elements with \`class="card"\` |
| ID | \`#header\` | Element with \`id="header"\` |
| Descendant | \`div p\` | \`<p>\` inside \`<div>\` |
| Child | \`div > p\` | Direct \`<p>\` children of \`<div>\` |
| Pseudo-class | \`a:hover\` | \`<a>\` on mouse hover |
| Attribute | \`[type="text"]\` | Elements with \`type="text"\` |

### Specificity (Priority)

\`!important\` > Inline > ID > Class > Element

### Common Properties

\`\`\`css
color: #333;
background-color: #f0f0f0;
font-size: 16px;
font-family: Arial, sans-serif;
margin: 10px;
padding: 15px;
border: 1px solid #ccc;
border-radius: 8px;
\`\`\`

### Problem

Style a card component using various selectors.`,
      starterCode: `<!-- Style the card below using CSS -->
<style>
    /* TODO: Style the card container
       - White background
       - Border radius of 8px
       - Box shadow
       - Padding of 20px
       - Max width of 400px
    */

    /* TODO: Style the card title
       - Dark color
       - Font size 24px
       - Bottom margin
    */

    /* TODO: Style the card text
       - Gray color
       - Line height of 1.6
    */

    /* TODO: Style the button
       - Blue background, white text
       - No border
       - Padding, border radius
       - Cursor pointer
       - Hover effect (darker blue)
    */
</style>

<div class="card">
    <h2 class="card-title">Card Title</h2>
    <p class="card-text">This is a card component styled with CSS selectors and properties.</p>
    <button class="card-button">Learn More</button>
</div>
`,
      solutionCode: `<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        display: flex;
        justify-content: center;
        padding: 40px;
    }

    .card {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        max-width: 400px;
    }

    .card-title {
        color: #1a1a1a;
        font-size: 24px;
        margin-bottom: 12px;
        margin-top: 0;
    }

    .card-text {
        color: #666666;
        line-height: 1.6;
        margin-bottom: 16px;
    }

    .card-button {
        background-color: #3b82f6;
        color: #ffffff;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
    }

    .card-button:hover {
        background-color: #2563eb;
    }
</style>

<div class="card">
    <h2 class="card-title">Card Title</h2>
    <p class="card-text">This is a card component styled with CSS selectors and properties.</p>
    <button class="card-button">Learn More</button>
</div>
`,
    },
    {
      id: "css-box-model",
      slug: "css-box-model",
      title: "The Box Model",
      content: `## The CSS Box Model

Every HTML element is a rectangular box. The **box model** describes the space an element occupies.

### Box Model Layers (inside out)

1. **Content** — The actual text/image
2. **Padding** — Space between content and border
3. **Border** — Edge of the element
4. **Margin** — Space between this element and others

### box-sizing

| Value | Width includes |
|-------|---------------|
| \`content-box\` (default) | Only content |
| \`border-box\` | Content + padding + border |

Always use \`border-box\` — it makes sizing predictable:

\`\`\`css
* { box-sizing: border-box; }
\`\`\`

### Margin Collapsing

Vertical margins between adjacent block elements **collapse** — the larger margin wins. This does not happen with horizontal margins, padding, or flexbox/grid items.

### Display Property

| Value | Behavior |
|-------|----------|
| \`block\` | Full width, new line |
| \`inline\` | Only as wide as content, no width/height |
| \`inline-block\` | Inline but respects width/height |
| \`none\` | Hidden, removed from flow |

### Problem

Create a profile card demonstrating the box model with visible layers.`,
      starterCode: `<!-- Create a profile card that demonstrates the box model.
     Use background colors on padding and borders to make
     each layer visible.
-->

<style>
    * {
        box-sizing: border-box;
    }

    /* TODO: Style the outer container with margin */

    /* TODO: Style the profile card with:
       - Visible border (e.g., 3px solid)
       - Padding to create space inside
       - Background color
       - Fixed width of 350px
    */

    /* TODO: Style the avatar image
       - Circular (border-radius: 50%)
       - Fixed size (100px x 100px)
       - Centered with margin auto
       - Display block
    */

    /* TODO: Style name and bio text */
</style>

<div class="container">
    <div class="profile-card">
        <img class="avatar" src="https://via.placeholder.com/100" alt="Avatar">
        <h2 class="name">Jane Developer</h2>
        <p class="bio">Full-stack web developer passionate about clean code and great UX.</p>
        <div class="stats">
            <span class="stat">Posts: 42</span>
            <span class="stat">Followers: 1.2k</span>
        </div>
    </div>
</div>
`,
      solutionCode: `<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
    }

    .container {
        margin: 40px auto;
        max-width: 600px;
        padding: 20px;
    }

    .profile-card {
        background-color: #ffffff;
        border: 3px solid #3b82f6;
        border-radius: 12px;
        padding: 30px;
        width: 350px;
        margin: 0 auto;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: block;
        margin: 0 auto 16px auto;
        border: 3px solid #e5e7eb;
    }

    .name {
        color: #1a1a1a;
        font-size: 22px;
        margin-bottom: 8px;
    }

    .bio {
        color: #666666;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 16px;
        padding: 0 10px;
    }

    .stats {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
    }

    .stat {
        color: #3b82f6;
        font-weight: bold;
        font-size: 14px;
    }
</style>

<div class="container">
    <div class="profile-card">
        <img class="avatar" src="https://via.placeholder.com/100" alt="Avatar">
        <h2 class="name">Jane Developer</h2>
        <p class="bio">Full-stack web developer passionate about clean code and great UX.</p>
        <div class="stats">
            <span class="stat">Posts: 42</span>
            <span class="stat">Followers: 1.2k</span>
        </div>
    </div>
</div>
`,
    },
    {
      id: "css-flexbox",
      slug: "css-flexbox",
      title: "Flexbox Layout",
      content: `## Flexbox Layout

**Flexbox** is a one-dimensional layout method for arranging items in rows or columns. It makes it easy to align, distribute space, and handle dynamic sizing.

### Container Properties

\`\`\`css
.container {
    display: flex;
    flex-direction: row;        /* row | column | row-reverse | column-reverse */
    justify-content: center;     /* flex-start | flex-end | center | space-between | space-around | space-evenly */
    align-items: center;         /* flex-start | flex-end | center | stretch | baseline */
    flex-wrap: wrap;            /* nowrap | wrap | wrap-reverse */
    gap: 16px;                  /* Space between items */
}
\`\`\`

### Item Properties

\`\`\`css
.item {
    flex-grow: 1;    /* How much item grows relative to others */
    flex-shrink: 0;  /* How much item shrinks */
    flex-basis: 200px; /* Initial size before growing/shrinking */
    align-self: flex-end; /* Override container's align-items */
    order: 2;        /* Change visual order */
}
\`\`\`

### Common Patterns

- **Center anything**: \`display: flex; justify-content: center; align-items: center;\`
- **Navigation bar**: \`display: flex; justify-content: space-between;\`
- **Equal columns**: \`display: flex;\` with children having \`flex: 1;\`

### Problem

Build a responsive navigation bar and a card layout using Flexbox.`,
      starterCode: `<!-- Build a page with:
     1. A nav bar with logo on left and links on right
     2. A section of 3 cards in a row that wrap on small screens
-->

<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; }

    /* TODO: Style the navbar
       - Use flexbox
       - Logo on left, links on right
       - Background color, padding
    */

    /* TODO: Style the nav links
       - Horizontal layout with gap
       - Remove list style
    */

    /* TODO: Style the cards container
       - Flexbox with wrapping
       - Gap between cards
       - Centered content
       - Padding
    */

    /* TODO: Style each card
       - Flex basis for 3 columns
       - Min width so they wrap
       - Padding, background, shadow
    */
</style>

<nav class="navbar">
    <div class="logo">FlexSite</div>
    <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</nav>

<section class="cards-container">
    <div class="card">
        <h3>Card One</h3>
        <p>Flexbox makes layout simple and responsive.</p>
    </div>
    <div class="card">
        <h3>Card Two</h3>
        <p>Items align and distribute space automatically.</p>
    </div>
    <div class="card">
        <h3>Card Three</h3>
        <p>Wrapping allows responsive behavior without media queries.</p>
    </div>
</section>
`,
      solutionCode: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background-color: #f5f5f5; }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #1a1a2e;
        padding: 16px 32px;
    }

    .logo {
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
    }

    .nav-links {
        display: flex;
        list-style: none;
        gap: 24px;
    }

    .nav-links a {
        color: #e0e0e0;
        text-decoration: none;
        font-size: 16px;
    }

    .nav-links a:hover {
        color: #ffffff;
    }

    .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        padding: 40px 32px;
        justify-content: center;
    }

    .card {
        flex: 1 1 280px;
        max-width: 350px;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
        color: #1a1a2e;
        margin-bottom: 12px;
    }

    .card p {
        color: #666;
        line-height: 1.6;
    }
</style>

<nav class="navbar">
    <div class="logo">FlexSite</div>
    <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</nav>

<section class="cards-container">
    <div class="card">
        <h3>Card One</h3>
        <p>Flexbox makes layout simple and responsive.</p>
    </div>
    <div class="card">
        <h3>Card Two</h3>
        <p>Items align and distribute space automatically.</p>
    </div>
    <div class="card">
        <h3>Card Three</h3>
        <p>Wrapping allows responsive behavior without media queries.</p>
    </div>
</section>
`,
    },
    {
      id: "css-grid",
      slug: "css-grid",
      title: "CSS Grid",
      content: `## CSS Grid

**CSS Grid** is a two-dimensional layout system. While Flexbox handles rows OR columns, Grid handles rows AND columns simultaneously.

### Container Properties

\`\`\`css
.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* 3 columns */
    grid-template-rows: auto 1fr auto;     /* 3 rows */
    gap: 16px;                             /* Row and column gap */
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
}
\`\`\`

### Item Properties

\`\`\`css
.item {
    grid-column: 1 / 3;     /* Span columns 1-2 */
    grid-row: 1 / 2;        /* Span row 1 */
    grid-area: header;      /* Named area */
}
\`\`\`

### Flexbox vs Grid

| | Flexbox | Grid |
|-|---------|------|
| Dimension | 1D (row or column) | 2D (rows and columns) |
| Best for | Components, nav bars | Page layouts, dashboards |
| Content-driven | Yes | Layout-driven |

### Useful Functions

- \`repeat(3, 1fr)\` — Three equal columns
- \`minmax(200px, 1fr)\` — Min 200px, max available
- \`auto-fill\` / \`auto-fit\` — Responsive without media queries

### Problem

Build a dashboard layout using CSS Grid with header, sidebar, main content, and footer.`,
      starterCode: `<!-- Build a dashboard layout using CSS Grid:
     - Header spanning full width
     - Sidebar on left (250px)
     - Main content area (flexible)
     - Footer spanning full width
-->

<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; }

    /* TODO: Create the grid layout
       - Use grid-template-areas
       - Header and footer span full width
       - Sidebar is 250px, main is flexible
       - Full viewport height (min-height: 100vh)
    */

    /* TODO: Style header, sidebar, main, footer
       - Assign grid-area to each
       - Add background colors and padding
    */
</style>

<div class="dashboard">
    <header class="header">Dashboard Header</header>
    <aside class="sidebar">
        <h3>Menu</h3>
        <ul>
            <li>Dashboard</li>
            <li>Analytics</li>
            <li>Settings</li>
            <li>Profile</li>
        </ul>
    </aside>
    <main class="main-content">
        <h2>Welcome to Dashboard</h2>
        <div class="widgets">
            <div class="widget">Users: 1,234</div>
            <div class="widget">Revenue: $5,678</div>
            <div class="widget">Orders: 89</div>
            <div class="widget">Growth: +12%</div>
        </div>
    </main>
    <footer class="footer">Dashboard Footer &copy; 2026</footer>
</div>
`,
      solutionCode: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; }

    .dashboard {
        display: grid;
        grid-template-columns: 250px 1fr;
        grid-template-rows: 60px 1fr 50px;
        grid-template-areas:
            "header header"
            "sidebar main"
            "footer footer";
        min-height: 100vh;
    }

    .header {
        grid-area: header;
        background-color: #1a1a2e;
        color: #ffffff;
        display: flex;
        align-items: center;
        padding: 0 24px;
        font-size: 20px;
        font-weight: bold;
    }

    .sidebar {
        grid-area: sidebar;
        background-color: #16213e;
        color: #e0e0e0;
        padding: 24px;
    }

    .sidebar h3 {
        margin-bottom: 16px;
        color: #ffffff;
    }

    .sidebar ul {
        list-style: none;
    }

    .sidebar li {
        padding: 10px 0;
        border-bottom: 1px solid #1a1a2e;
        cursor: pointer;
    }

    .sidebar li:hover {
        color: #ffffff;
    }

    .main-content {
        grid-area: main;
        background-color: #f5f5f5;
        padding: 24px;
    }

    .main-content h2 {
        margin-bottom: 24px;
        color: #1a1a2e;
    }

    .widgets {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
    }

    .widget {
        background-color: #ffffff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    .footer {
        grid-area: footer;
        background-color: #1a1a2e;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }
</style>

<div class="dashboard">
    <header class="header">Dashboard Header</header>
    <aside class="sidebar">
        <h3>Menu</h3>
        <ul>
            <li>Dashboard</li>
            <li>Analytics</li>
            <li>Settings</li>
            <li>Profile</li>
        </ul>
    </aside>
    <main class="main-content">
        <h2>Welcome to Dashboard</h2>
        <div class="widgets">
            <div class="widget">Users: 1,234</div>
            <div class="widget">Revenue: $5,678</div>
            <div class="widget">Orders: 89</div>
            <div class="widget">Growth: +12%</div>
        </div>
    </main>
    <footer class="footer">Dashboard Footer &copy; 2026</footer>
</div>
`,
    },
  ],
};
