import { Module } from "../types";

export const responsiveModule: Module = {
  id: "responsive-design",
  title: "Responsive Design",
  description: "Learn to build websites that work on all screen sizes using media queries, mobile-first design, and CSS frameworks.",
  lessons: [
    {
      id: "responsive-media-queries",
      slug: "media-queries",
      title: "Media Queries",
      content: `## Media Queries

**Media queries** let you apply CSS rules conditionally based on the device's characteristics, most commonly the viewport width.

### Syntax

\`\`\`css
@media (max-width: 768px) {
    /* Styles for screens 768px and narrower */
    .sidebar { display: none; }
}

@media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet styles */
}
\`\`\`

### Common Breakpoints

| Breakpoint | Target |
|-----------|--------|
| 480px | Small phones |
| 768px | Tablets |
| 1024px | Small laptops |
| 1200px | Desktops |
| 1440px | Large screens |

### Media Features

- \`width\`, \`min-width\`, \`max-width\` — Viewport width
- \`orientation: portrait | landscape\`
- \`prefers-color-scheme: dark | light\`
- \`hover: hover | none\` — Touch vs mouse devices

### The Viewport Meta Tag

Always include this for responsive pages:

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

### Problem

Make a two-column layout that stacks vertically on mobile.`,
      starterCode: `<!-- Create a layout that:
     - Shows two columns side-by-side on desktop (> 768px)
     - Stacks vertically on mobile (<= 768px)
     - Changes the nav from horizontal to vertical on mobile
-->

<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; }

    /* TODO: Base styles (desktop) */

    /* TODO: Navigation - horizontal on desktop */

    /* TODO: Two-column layout on desktop */

    /* TODO: Media query for mobile (<= 768px)
       - Stack navigation vertically
       - Stack columns vertically
       - Full width for each section
    */
</style>

<nav class="nav">
    <span class="nav-brand">MySite</span>
    <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</nav>

<div class="content">
    <main class="main">
        <h1>Main Content</h1>
        <p>This is the primary content area.</p>
    </main>
    <aside class="sidebar">
        <h2>Sidebar</h2>
        <p>This is the sidebar with additional info.</p>
    </aside>
</div>
`,
      solutionCode: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; }

    .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #2d3436;
        padding: 16px 24px;
    }

    .nav-brand {
        color: #ffffff;
        font-size: 20px;
        font-weight: bold;
    }

    .nav-links {
        display: flex;
        list-style: none;
        gap: 20px;
    }

    .nav-links a {
        color: #dfe6e9;
        text-decoration: none;
    }

    .content {
        display: flex;
        gap: 24px;
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .main {
        flex: 2;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sidebar {
        flex: 1;
        background-color: #f8f9fa;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .main h1 { margin-bottom: 12px; }
    .sidebar h2 { margin-bottom: 12px; }
    p { line-height: 1.6; color: #555; }

    @media (max-width: 768px) {
        .nav {
            flex-direction: column;
            gap: 12px;
        }

        .nav-links {
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .content {
            flex-direction: column;
        }

        .main, .sidebar {
            flex: none;
            width: 100%;
        }
    }
</style>

<nav class="nav">
    <span class="nav-brand">MySite</span>
    <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</nav>

<div class="content">
    <main class="main">
        <h1>Main Content</h1>
        <p>This is the primary content area. On desktop this appears alongside the sidebar. On mobile it stacks vertically.</p>
    </main>
    <aside class="sidebar">
        <h2>Sidebar</h2>
        <p>This is the sidebar with additional info. It moves below the main content on mobile.</p>
    </aside>
</div>
`,
    },
    {
      id: "responsive-mobile-first",
      slug: "mobile-first",
      title: "Mobile-First Design",
      content: `## Mobile-First Design

**Mobile-first** means writing your base CSS for mobile screens, then using \`min-width\` media queries to add complexity for larger screens.

### Why Mobile-First?

1. **Performance** — Mobile devices load only the CSS they need
2. **Content priority** — Forces you to focus on essential content
3. **Progressive enhancement** — Start simple, add features for capable devices
4. **Growing mobile traffic** — Over 50% of web traffic is mobile

### Mobile-First vs Desktop-First

\`\`\`css
/* MOBILE-FIRST (recommended) */
.container { width: 100%; }
@media (min-width: 768px) { .container { width: 750px; } }
@media (min-width: 1024px) { .container { width: 960px; } }

/* DESKTOP-FIRST */
.container { width: 960px; }
@media (max-width: 1024px) { .container { width: 750px; } }
@media (max-width: 768px) { .container { width: 100%; } }
\`\`\`

### Responsive Units

| Unit | Description |
|------|-------------|
| \`%\` | Relative to parent |
| \`vw/vh\` | Viewport width/height |
| \`rem\` | Relative to root font-size |
| \`em\` | Relative to parent font-size |
| \`clamp()\` | Fluid sizing with min/max |

### Problem

Build a pricing page using mobile-first approach.`,
      starterCode: `<!-- Build a pricing page with mobile-first approach:
     - Mobile: Single column, cards stacked
     - Tablet (768px+): 2 cards per row
     - Desktop (1024px+): 3 cards per row
     Use min-width media queries (mobile-first)
-->

<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f5f5f5; }

    /* TODO: Mobile base styles (no media query needed) */
    /* - Full width cards */
    /* - Stacked layout */
    /* - Appropriate padding and spacing */

    /* TODO: Tablet (min-width: 768px) */
    /* - 2 cards per row */

    /* TODO: Desktop (min-width: 1024px) */
    /* - 3 cards per row */
</style>

<h1 class="page-title">Pricing Plans</h1>
<div class="pricing-grid">
    <div class="pricing-card">
        <h2>Free</h2>
        <p class="price">$0<span>/mo</span></p>
        <ul>
            <li>5 Projects</li>
            <li>1GB Storage</li>
            <li>Email Support</li>
        </ul>
        <button>Get Started</button>
    </div>
    <div class="pricing-card featured">
        <h2>Pro</h2>
        <p class="price">$29<span>/mo</span></p>
        <ul>
            <li>Unlimited Projects</li>
            <li>50GB Storage</li>
            <li>Priority Support</li>
        </ul>
        <button>Get Started</button>
    </div>
    <div class="pricing-card">
        <h2>Enterprise</h2>
        <p class="price">$99<span>/mo</span></p>
        <ul>
            <li>Unlimited Everything</li>
            <li>500GB Storage</li>
            <li>Dedicated Support</li>
        </ul>
        <button>Get Started</button>
    </div>
</div>
`,
      solutionCode: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: Arial, sans-serif;
        background: #f5f5f5;
        padding: 20px;
    }

    /* Mobile-first base styles */
    .page-title {
        text-align: center;
        color: #333;
        margin-bottom: 24px;
        font-size: clamp(24px, 5vw, 36px);
    }

    .pricing-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .pricing-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 32px 24px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        width: 100%;
    }

    .pricing-card.featured {
        border: 2px solid #3b82f6;
    }

    .pricing-card h2 {
        color: #333;
        margin-bottom: 8px;
    }

    .price {
        font-size: 48px;
        font-weight: bold;
        color: #3b82f6;
        margin-bottom: 24px;
    }

    .price span {
        font-size: 16px;
        color: #999;
    }

    .pricing-card ul {
        list-style: none;
        margin-bottom: 24px;
    }

    .pricing-card li {
        padding: 8px 0;
        color: #666;
        border-bottom: 1px solid #f0f0f0;
    }

    .pricing-card button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
    }

    .pricing-card button:hover {
        background: #2563eb;
    }

    /* Tablet: 2 cards per row */
    @media (min-width: 768px) {
        .pricing-card {
            width: calc(50% - 10px);
        }
    }

    /* Desktop: 3 cards per row */
    @media (min-width: 1024px) {
        .pricing-card {
            width: calc(33.333% - 14px);
        }
    }
</style>

<h1 class="page-title">Pricing Plans</h1>
<div class="pricing-grid">
    <div class="pricing-card">
        <h2>Free</h2>
        <p class="price">$0<span>/mo</span></p>
        <ul>
            <li>5 Projects</li>
            <li>1GB Storage</li>
            <li>Email Support</li>
        </ul>
        <button>Get Started</button>
    </div>
    <div class="pricing-card featured">
        <h2>Pro</h2>
        <p class="price">$29<span>/mo</span></p>
        <ul>
            <li>Unlimited Projects</li>
            <li>50GB Storage</li>
            <li>Priority Support</li>
        </ul>
        <button>Get Started</button>
    </div>
    <div class="pricing-card">
        <h2>Enterprise</h2>
        <p class="price">$99<span>/mo</span></p>
        <ul>
            <li>Unlimited Everything</li>
            <li>500GB Storage</li>
            <li>Dedicated Support</li>
        </ul>
        <button>Get Started</button>
    </div>
</div>
`,
    },
    {
      id: "responsive-frameworks",
      slug: "responsive-frameworks",
      title: "CSS Frameworks Overview",
      content: `## CSS Frameworks

CSS frameworks provide pre-built components and utility classes to speed up development. Understanding them helps you choose the right tool.

### Popular Frameworks

| Framework | Approach | Best For |
|-----------|----------|----------|
| **Bootstrap** | Component-based | Rapid prototyping |
| **Tailwind CSS** | Utility-first | Custom designs |
| **Bulma** | Flexbox-based | Clean, modern layouts |
| **Foundation** | Enterprise | Complex responsive layouts |

### Bootstrap Grid System

Bootstrap uses a 12-column grid:

\`\`\`html
<div class="container">
    <div class="row">
        <div class="col-md-6">Half width on medium+</div>
        <div class="col-md-6">Half width on medium+</div>
    </div>
</div>
\`\`\`

### Tailwind CSS Approach

Utility classes applied directly in HTML:

\`\`\`html
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold text-gray-800">Title</h2>
</div>
\`\`\`

### When to Use a Framework vs Custom CSS

| Use Framework | Use Custom CSS |
|---------------|----------------|
| Rapid prototyping | Unique brand design |
| Admin dashboards | Performance-critical |
| Team consistency | Small projects |
| Standard UI patterns | Learning CSS deeply |

### Problem

Build a responsive grid system from scratch (like a mini-Bootstrap).`,
      starterCode: `<!-- Build a simple 12-column grid system from scratch.
     Create classes: .row, .col-1 through .col-12
     Make it responsive: full width on mobile, grid on desktop
-->

<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 20px; }

    /* TODO: Create .row container using flexbox */

    /* TODO: Create .col-1 through .col-12
       Each column width = (n / 12) * 100%
       Add padding for gutters
    */

    /* TODO: On mobile (< 768px), all columns become full width */

    /* Helper styles for visibility */
    .demo-box {
        background: #3b82f6;
        color: white;
        padding: 16px;
        text-align: center;
        border-radius: 4px;
        margin-bottom: 8px;
    }
</style>

<h2>12-Column Grid System</h2>
<div class="row">
    <div class="col-12"><div class="demo-box">col-12</div></div>
</div>
<div class="row">
    <div class="col-6"><div class="demo-box">col-6</div></div>
    <div class="col-6"><div class="demo-box">col-6</div></div>
</div>
<div class="row">
    <div class="col-4"><div class="demo-box">col-4</div></div>
    <div class="col-4"><div class="demo-box">col-4</div></div>
    <div class="col-4"><div class="demo-box">col-4</div></div>
</div>
<div class="row">
    <div class="col-3"><div class="demo-box">col-3</div></div>
    <div class="col-3"><div class="demo-box">col-3</div></div>
    <div class="col-3"><div class="demo-box">col-3</div></div>
    <div class="col-3"><div class="demo-box">col-3</div></div>
</div>
<div class="row">
    <div class="col-8"><div class="demo-box">col-8</div></div>
    <div class="col-4"><div class="demo-box">col-4</div></div>
</div>
`,
      solutionCode: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 20px; }

    h2 { margin-bottom: 20px; color: #333; }

    .row {
        display: flex;
        flex-wrap: wrap;
        margin-left: -8px;
        margin-right: -8px;
    }

    [class^="col-"] {
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
    }

    .demo-box {
        background: #3b82f6;
        color: white;
        padding: 16px;
        text-align: center;
        border-radius: 4px;
        margin-bottom: 8px;
    }

    @media (min-width: 768px) {
        .col-1  { width: 8.333%; }
        .col-2  { width: 16.666%; }
        .col-3  { width: 25%; }
        .col-4  { width: 33.333%; }
        .col-5  { width: 41.666%; }
        .col-6  { width: 50%; }
        .col-7  { width: 58.333%; }
        .col-8  { width: 66.666%; }
        .col-9  { width: 75%; }
        .col-10 { width: 83.333%; }
        .col-11 { width: 91.666%; }
        .col-12 { width: 100%; }
    }
</style>

<h2>12-Column Grid System</h2>
<div class="row">
    <div class="col-12"><div class="demo-box">col-12</div></div>
</div>
<div class="row">
    <div class="col-6"><div class="demo-box">col-6</div></div>
    <div class="col-6"><div class="demo-box">col-6</div></div>
</div>
<div class="row">
    <div class="col-4"><div class="demo-box">col-4</div></div>
    <div class="col-4"><div class="demo-box">col-4</div></div>
    <div class="col-4"><div class="demo-box">col-4</div></div>
</div>
<div class="row">
    <div class="col-3"><div class="demo-box">col-3</div></div>
    <div class="col-3"><div class="demo-box">col-3</div></div>
    <div class="col-3"><div class="demo-box">col-3</div></div>
    <div class="col-3"><div class="demo-box">col-3</div></div>
</div>
<div class="row">
    <div class="col-8"><div class="demo-box">col-8</div></div>
    <div class="col-4"><div class="demo-box">col-4</div></div>
</div>
`,
    },
  ],
};
