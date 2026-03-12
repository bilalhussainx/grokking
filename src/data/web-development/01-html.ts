import { Module } from "../types";

export const htmlModule: Module = {
  id: "html-basics",
  title: "HTML Basics",
  description:
    "Learn the building blocks of the web: HTML document structure, common elements, forms, and semantic HTML.",
  lessons: [
    {
      id: "html-structure",
      slug: "html-structure",
      title: "HTML Document Structure",
      content: `## HTML Document Structure

**HTML** (HyperText Markup Language) is the standard language for creating web pages. Every web page starts with a basic document structure.

### The Essential Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
\`\`\`

### Key Parts

| Element | Purpose |
|---------|---------|
| \`<!DOCTYPE html>\` | Declares HTML5 document type |
| \`<html>\` | Root element of the page |
| \`<head>\` | Metadata, links to CSS/JS, title |
| \`<body>\` | Visible page content |
| \`<meta charset>\` | Character encoding (always UTF-8) |
| \`<meta viewport>\` | Responsive design on mobile |

### Nesting Rules

- Elements must be properly nested: \`<b><i>text</i></b>\` not \`<b><i>text</b></i>\`
- Some elements are self-closing: \`<br>\`, \`<img>\`, \`<input>\`, \`<meta>\`
- Block elements can contain inline elements, but not vice versa

### Problem

Create a complete HTML page with a title, heading, paragraph, and an image.`,
      starterCode: `<!-- Create a complete HTML5 page with:
     1. A page title of "My First Page"
     2. An h1 heading saying "Hello, World!"
     3. A paragraph with any text
     4. An image tag (use any src) with alt text
-->

<!-- Write your HTML below -->
`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to my very first HTML page. This is where I start my web development journey.</p>
    <img src="https://via.placeholder.com/300x200" alt="A placeholder image">
</body>
</html>
`,
    },
    {
      id: "html-elements",
      slug: "html-elements",
      title: "Common HTML Elements",
      content: `## Common HTML Elements

### Text Elements

| Element | Use |
|---------|-----|
| \`<h1>\` to \`<h6>\` | Headings (h1 is largest) |
| \`<p>\` | Paragraph |
| \`<strong>\` | Bold/important text |
| \`<em>\` | Italic/emphasized text |
| \`<br>\` | Line break |
| \`<hr>\` | Horizontal rule |
| \`<blockquote>\` | Block quotation |
| \`<code>\` | Inline code |
| \`<pre>\` | Preformatted text |

### Lists

- **Ordered list**: \`<ol>\` with \`<li>\` items (numbered)
- **Unordered list**: \`<ul>\` with \`<li>\` items (bulleted)
- **Description list**: \`<dl>\` with \`<dt>\` (term) and \`<dd>\` (description)

### Links and Images

\`\`\`html
<a href="https://example.com" target="_blank">Click me</a>
<img src="photo.jpg" alt="Description" width="300">
\`\`\`

### Tables

\`\`\`html
<table>
    <thead>
        <tr><th>Name</th><th>Age</th></tr>
    </thead>
    <tbody>
        <tr><td>Alice</td><td>25</td></tr>
    </tbody>
</table>
\`\`\`

### Problem

Build a recipe page using headings, lists, an image, and a table for nutritional information.`,
      starterCode: `<!-- Build a recipe page for "Chocolate Chip Cookies" with:
     1. An h1 title
     2. An image placeholder
     3. An h2 "Ingredients" section with an unordered list (at least 5 items)
     4. An h2 "Instructions" section with an ordered list (at least 4 steps)
     5. An h2 "Nutrition" section with a table (calories, fat, sugar, protein)
-->

<!-- Write your HTML below -->
`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Chocolate Chip Cookies</title>
</head>
<body>
    <h1>Chocolate Chip Cookies</h1>
    <img src="https://via.placeholder.com/400x300" alt="Freshly baked chocolate chip cookies">

    <h2>Ingredients</h2>
    <ul>
        <li>2 1/4 cups all-purpose flour</li>
        <li>1 cup butter, softened</li>
        <li>3/4 cup sugar</li>
        <li>2 large eggs</li>
        <li>2 cups chocolate chips</li>
        <li>1 tsp vanilla extract</li>
        <li>1 tsp baking soda</li>
    </ul>

    <h2>Instructions</h2>
    <ol>
        <li>Preheat oven to 375°F (190°C).</li>
        <li>Mix butter, sugar, and vanilla until creamy.</li>
        <li>Beat in eggs. Gradually blend in flour and baking soda.</li>
        <li>Stir in chocolate chips.</li>
        <li>Drop rounded tablespoons onto ungreased baking sheets.</li>
        <li>Bake for 9 to 11 minutes or until golden brown.</li>
    </ol>

    <h2>Nutrition</h2>
    <table border="1">
        <thead>
            <tr>
                <th>Nutrient</th>
                <th>Amount per Cookie</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Calories</td><td>180</td></tr>
            <tr><td>Fat</td><td>9g</td></tr>
            <tr><td>Sugar</td><td>12g</td></tr>
            <tr><td>Protein</td><td>2g</td></tr>
        </tbody>
    </table>
</body>
</html>
`,
    },
    {
      id: "html-forms",
      slug: "html-forms",
      title: "HTML Forms",
      content: `## HTML Forms

Forms are how users send data to a server. They are essential for login pages, search bars, registration, and any user input.

### Form Elements

| Element | Purpose |
|---------|---------|
| \`<form>\` | Container for form controls |
| \`<input>\` | Text, email, password, checkbox, radio, etc. |
| \`<textarea>\` | Multi-line text input |
| \`<select>\` / \`<option>\` | Dropdown menu |
| \`<button>\` | Clickable button |
| \`<label>\` | Labels for form controls (accessibility) |
| \`<fieldset>\` / \`<legend>\` | Group related controls |

### Input Types

\`\`\`html
<input type="text" placeholder="Name">
<input type="email" placeholder="Email">
<input type="password" placeholder="Password">
<input type="number" min="0" max="100">
<input type="date">
<input type="checkbox"> Remember me
<input type="radio" name="plan" value="free"> Free
<input type="radio" name="plan" value="pro"> Pro
<input type="submit" value="Submit">
\`\`\`

### Form Attributes

- \`action\` — URL to send data to
- \`method\` — GET (in URL) or POST (in body)
- \`required\` — Makes a field mandatory
- \`pattern\` — Regex validation
- \`placeholder\` — Hint text

### Problem

Build a user registration form with validation.`,
      starterCode: `<!-- Build a registration form with:
     1. Full name (text, required)
     2. Email (email type, required)
     3. Password (password type, required, min 8 chars)
     4. Age (number, min 13)
     5. Gender (radio buttons: Male, Female, Other)
     6. Favorite language (select dropdown: JavaScript, Python, Java, C++)
     7. Bio (textarea)
     8. "I agree to terms" checkbox (required)
     9. Submit button
     Each input should have a proper <label>
-->

<!-- Write your HTML below -->
`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Registration Form</title>
</head>
<body>
    <h1>Create an Account</h1>
    <form action="/register" method="POST">
        <div>
            <label for="name">Full Name:</label><br>
            <input type="text" id="name" name="name" required placeholder="John Doe">
        </div>
        <br>
        <div>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required placeholder="john@example.com">
        </div>
        <br>
        <div>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required minlength="8" placeholder="Min 8 characters">
        </div>
        <br>
        <div>
            <label for="age">Age:</label><br>
            <input type="number" id="age" name="age" min="13" placeholder="18">
        </div>
        <br>
        <fieldset>
            <legend>Gender:</legend>
            <label><input type="radio" name="gender" value="male"> Male</label><br>
            <label><input type="radio" name="gender" value="female"> Female</label><br>
            <label><input type="radio" name="gender" value="other"> Other</label>
        </fieldset>
        <br>
        <div>
            <label for="language">Favorite Language:</label><br>
            <select id="language" name="language">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
            </select>
        </div>
        <br>
        <div>
            <label for="bio">Bio:</label><br>
            <textarea id="bio" name="bio" rows="4" cols="40" placeholder="Tell us about yourself..."></textarea>
        </div>
        <br>
        <div>
            <label><input type="checkbox" name="terms" required> I agree to the terms and conditions</label>
        </div>
        <br>
        <button type="submit">Register</button>
    </form>
</body>
</html>
`,
    },
    {
      id: "html-semantic",
      slug: "semantic-html",
      title: "Semantic HTML",
      content: `## Semantic HTML

**Semantic HTML** uses elements that clearly describe their meaning to both the browser and the developer. Using semantic elements improves accessibility, SEO, and code readability.

### Semantic vs Non-Semantic

| Non-Semantic | Semantic | Purpose |
|-------------|----------|---------|
| \`<div>\` | \`<header>\` | Page/section header |
| \`<div>\` | \`<nav>\` | Navigation links |
| \`<div>\` | \`<main>\` | Main content |
| \`<div>\` | \`<article>\` | Self-contained content |
| \`<div>\` | \`<section>\` | Thematic grouping |
| \`<div>\` | \`<aside>\` | Sidebar/related content |
| \`<div>\` | \`<footer>\` | Page/section footer |
| \`<div>\` | \`<figure>\` | Image with caption |
| \`<i>\` | \`<em>\` | Emphasis |
| \`<b>\` | \`<strong>\` | Strong importance |

### Why Semantic HTML Matters

1. **Accessibility** — Screen readers use semantic elements to navigate
2. **SEO** — Search engines understand page structure better
3. **Maintainability** — Code is self-documenting
4. **Standards** — Following HTML5 best practices

### Page Layout Pattern

\`\`\`html
<header>Logo + Nav</header>
<main>
    <article>Blog post</article>
    <aside>Sidebar</aside>
</main>
<footer>Copyright</footer>
\`\`\`

### Problem

Convert a div-heavy page layout into proper semantic HTML.`,
      starterCode: `<!-- Convert this non-semantic HTML to semantic HTML.
     Replace divs with appropriate semantic elements.
     Keep the same content but use proper tags.
-->

<!-- NON-SEMANTIC VERSION (convert this): -->
<div class="header">
    <div class="logo">MyBlog</div>
    <div class="navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </div>
</div>
<div class="main-content">
    <div class="blog-post">
        <div class="post-title">My First Post</div>
        <div class="post-date">March 10, 2026</div>
        <div class="post-body">
            This is my first blog post. I am learning semantic HTML.
        </div>
    </div>
    <div class="sidebar">
        <div class="sidebar-title">About Me</div>
        <div class="sidebar-text">I am a web developer learning HTML.</div>
    </div>
</div>
<div class="footer">
    <div>Copyright 2026 MyBlog</div>
</div>

<!-- Write your SEMANTIC version below -->
`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyBlog</title>
</head>
<body>
    <header>
        <h1>MyBlog</h1>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>

    <main>
        <article>
            <h2>My First Post</h2>
            <time datetime="2026-03-10">March 10, 2026</time>
            <p>This is my first blog post. I am learning semantic HTML.</p>
        </article>

        <aside>
            <h3>About Me</h3>
            <p>I am a web developer learning HTML.</p>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 MyBlog</p>
    </footer>
</body>
</html>
`,
    },
  ],
};
