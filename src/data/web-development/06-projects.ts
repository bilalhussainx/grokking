import { Module } from "../types";

export const projectsModule: Module = {
  id: "wd-portfolio-projects",
  title: "Portfolio Projects",
  description: "Apply everything you have learned by building three portfolio-worthy projects: a landing page, a portfolio site, and a responsive blog layout.",
  lessons: [
    {
      id: "landing-page-project",
      slug: "landing-page-project",
      title: "Landing Page",
      content: `## Project: Landing Page

Build a complete landing page for a fictional product. This project practices semantic HTML, CSS layout, and responsive design.

### Requirements

- Hero section with headline, subtitle, and CTA button
- Features section with 3 cards in a row
- Testimonial section
- Footer with links
- Fully responsive (mobile, tablet, desktop)
- Clean, modern design

### HTML Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProductX - Landing Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="navbar">
    <div class="logo">ProductX</div>
    <nav>
      <a href="#features">Features</a>
      <a href="#testimonials">Testimonials</a>
      <a href="#" class="btn">Get Started</a>
    </nav>
  </header>

  <section class="hero">
    <h1>Build Better Products, Faster</h1>
    <p>The all-in-one platform that helps teams ship quality software.</p>
    <a href="#" class="btn btn-large">Start Free Trial</a>
  </section>

  <section id="features" class="features">
    <h2>Why Choose ProductX?</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h3>Fast Setup</h3>
        <p>Get started in minutes, not days.</p>
      </div>
      <div class="feature-card">
        <h3>Team Collaboration</h3>
        <p>Work together in real time.</p>
      </div>
      <div class="feature-card">
        <h3>Analytics</h3>
        <p>Track everything that matters.</p>
      </div>
    </div>
  </section>

  <section id="testimonials" class="testimonials">
    <h2>What Our Users Say</h2>
    <blockquote>
      "ProductX transformed our workflow completely."
      <cite>-- Jane Smith, CTO at TechCo</cite>
    </blockquote>
  </section>

  <footer>
    <p>&copy; 2024 ProductX. All rights reserved.</p>
  </footer>
</body>
</html>
\`\`\`

### Design Tips

- Use a bold, contrasting color for CTA buttons.
- Keep the hero section visually dominant -- large text, ample whitespace.
- Use consistent spacing (multiples of 8px).
- Limit your color palette to 2-3 colors.`,
      starterCode: `<!-- TODO: Build a landing page for a fitness app called "FitTrack" -->
<!-- Include: navbar, hero section, 3 feature cards, footer -->
<!-- Make it responsive using your CSS knowledge -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FitTrack - Your Fitness Companion</title>
  <style>
    /* TODO: Add your CSS here */
    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; }

    /* Navbar */

    /* Hero section */

    /* Features grid (3 columns on desktop, 1 on mobile) */

    /* Footer */

    /* Responsive breakpoints */
  </style>
</head>
<body>
  <!-- TODO: Build your HTML structure here -->
</body>
</html>
`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FitTrack - Your Fitness Companion</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background: #1a1a2e;
      color: white;
    }
    .navbar .logo { font-size: 24px; font-weight: bold; }
    .navbar nav a {
      color: #ccc;
      text-decoration: none;
      margin-left: 20px;
    }
    .btn {
      background: #e94560;
      color: white;
      padding: 10px 24px;
      border-radius: 6px;
      text-decoration: none;
      display: inline-block;
    }

    .hero {
      text-align: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: white;
    }
    .hero h1 { font-size: 2.5rem; margin-bottom: 16px; }
    .hero p { font-size: 1.2rem; margin-bottom: 30px; color: #ccc; }

    .features {
      padding: 60px 20px;
      text-align: center;
    }
    .features h2 { margin-bottom: 40px; }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .feature-card {
      padding: 30px;
      border: 1px solid #eee;
      border-radius: 8px;
    }
    .feature-card h3 { margin-bottom: 10px; color: #e94560; }

    footer {
      text-align: center;
      padding: 30px;
      background: #1a1a2e;
      color: #aaa;
    }

    @media (max-width: 768px) {
      .feature-grid { grid-template-columns: 1fr; }
      .hero h1 { font-size: 1.75rem; }
      .navbar { flex-direction: column; gap: 10px; }
    }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="logo">FitTrack</div>
    <nav>
      <a href="#features">Features</a>
      <a href="#" class="btn">Download App</a>
    </nav>
  </header>

  <section class="hero">
    <h1>Track Your Fitness Journey</h1>
    <p>Set goals, log workouts, and see your progress over time.</p>
    <a href="#" class="btn">Get Started Free</a>
  </section>

  <section id="features" class="features">
    <h2>Why FitTrack?</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h3>Workout Tracking</h3>
        <p>Log exercises, sets, and reps with one tap.</p>
      </div>
      <div class="feature-card">
        <h3>Progress Charts</h3>
        <p>Visualize your gains with beautiful charts.</p>
      </div>
      <div class="feature-card">
        <h3>Community</h3>
        <p>Connect with friends and share achievements.</p>
      </div>
    </div>
  </section>

  <footer>
    <p>&copy; 2024 FitTrack. All rights reserved.</p>
  </footer>
</body>
</html>
`,
    },
    {
      id: "portfolio-site-project",
      slug: "portfolio-site-project",
      title: "Portfolio Site",
      content: `## Project: Personal Portfolio Site

Build a portfolio website to showcase your projects and skills. This is one of the most valuable projects for any web developer.

### Required Sections

1. **Hero / About** -- Your name, title, brief introduction
2. **Skills** -- Technologies you know, displayed visually
3. **Projects** -- Cards showcasing your work with links
4. **Contact** -- A form or contact information
5. **Navigation** -- Smooth scroll to each section

### Layout Strategy

\`\`\`css
/* Use CSS Grid for the overall page layout */
.portfolio {
  display: grid;
  grid-template-areas:
    "nav"
    "hero"
    "skills"
    "projects"
    "contact"
    "footer";
}

/* Use Flexbox for individual components */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
\`\`\`

### Project Card Design

\`\`\`html
<div class="project-card">
  <img src="project-screenshot.jpg" alt="Project name screenshot">
  <div class="project-info">
    <h3>Project Name</h3>
    <p>Brief description of what the project does.</p>
    <div class="project-tags">
      <span class="tag">HTML</span>
      <span class="tag">CSS</span>
      <span class="tag">JavaScript</span>
    </div>
    <div class="project-links">
      <a href="#">Live Demo</a>
      <a href="#">GitHub</a>
    </div>
  </div>
</div>
\`\`\`

### Smooth Scrolling

\`\`\`css
html {
  scroll-behavior: smooth;
}
\`\`\`

\`\`\`html
<nav>
  <a href="#about">About</a>
  <a href="#projects">Projects</a>
  <a href="#contact">Contact</a>
</nav>

<section id="about">...</section>
<section id="projects">...</section>
<section id="contact">...</section>
\`\`\`

### Portfolio Best Practices

- Keep it **simple and clean** -- let your work speak.
- Make sure it is **responsive** -- recruiters view on all devices.
- Include **live demo links** and **source code links**.
- Use **real project screenshots** -- not placeholder images.
- Add a **downloadable resume** link.
- Ensure **fast load times** -- optimize images.`,
      starterCode: `<!-- TODO: Build the projects section of your portfolio -->
<!-- Create 3 project cards in a responsive grid -->

<section id="projects" class="projects-section">
  <h2>My Projects</h2>

  <div class="project-grid">
    <!-- TODO: Project Card 1 -->
    <!-- Include: image, title, description, tech tags, links -->

    <!-- TODO: Project Card 2 -->

    <!-- TODO: Project Card 3 -->
  </div>
</section>

<style>
  /* TODO: Style the projects section */
  /* - Centered heading */
  /* - Responsive grid (3 cols desktop, 1 col mobile) */
  /* - Card with image, padding, shadow, rounded corners */
  /* - Tech tags as inline badges */
  /* - Hover effect on cards */
</style>
`,
      solutionCode: `<section id="projects" class="projects-section">
  <h2>My Projects</h2>

  <div class="project-grid">
    <div class="project-card">
      <img src="https://placeholder.com/weather-app.jpg" alt="Weather app screenshot">
      <div class="project-info">
        <h3>Weather Dashboard</h3>
        <p>Real-time weather data with 5-day forecasts and location search.</p>
        <div class="project-tags">
          <span class="tag">JavaScript</span>
          <span class="tag">API</span>
          <span class="tag">CSS</span>
        </div>
        <div class="project-links">
          <a href="#">Live Demo</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </div>

    <div class="project-card">
      <img src="https://placeholder.com/task-app.jpg" alt="Task manager screenshot">
      <div class="project-info">
        <h3>Task Manager</h3>
        <p>A full-stack CRUD app with user authentication and drag-and-drop.</p>
        <div class="project-tags">
          <span class="tag">React</span>
          <span class="tag">Node.js</span>
          <span class="tag">MongoDB</span>
        </div>
        <div class="project-links">
          <a href="#">Live Demo</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </div>

    <div class="project-card">
      <img src="https://placeholder.com/blog.jpg" alt="Blog screenshot">
      <div class="project-info">
        <h3>Tech Blog</h3>
        <p>A responsive blog with markdown support and dark mode.</p>
        <div class="project-tags">
          <span class="tag">HTML</span>
          <span class="tag">CSS</span>
          <span class="tag">JavaScript</span>
        </div>
        <div class="project-links">
          <a href="#">Live Demo</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .projects-section {
    padding: 60px 20px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .projects-section h2 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .project-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .project-info {
    padding: 20px;
  }

  .project-info h3 { margin-bottom: 8px; }
  .project-info p { color: #666; margin-bottom: 12px; }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .tag {
    background: #e8f0fe;
    color: #1a73e8;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
  }

  .project-links a {
    margin-right: 16px;
    color: #1a73e8;
    text-decoration: none;
    font-weight: bold;
  }

  .project-links a:hover {
    text-decoration: underline;
  }
</style>
`,
    },
    {
      id: "responsive-blog-layout",
      slug: "responsive-blog-layout",
      title: "Responsive Blog Layout",
      content: `## Project: Responsive Blog Layout

Build a complete blog layout with a header, featured post, post grid, sidebar, and footer. This project brings together all the HTML, CSS, and responsive design skills from this course.

### Layout Design

**Desktop (3-column):**
\`\`\`
|         Header / Nav          |
|-------------------------------|
|       Featured Post           |
|-------------------------------|
| Post | Post | Sidebar         |
| Post | Post |                 |
|-------------------------------|
|          Footer               |
\`\`\`

**Mobile (single column):**
\`\`\`
| Header  |
| Featured|
| Post    |
| Post    |
| Sidebar |
| Footer  |
\`\`\`

### CSS Grid for the Layout

\`\`\`css
.blog-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 300px;
  grid-template-areas:
    "header header header"
    "featured featured featured"
    "posts posts sidebar"
    "footer footer footer";
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .blog-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "featured"
      "posts"
      "sidebar"
      "footer";
  }
}
\`\`\`

### Blog Post Card

\`\`\`html
<article class="post-card">
  <img src="post-image.jpg" alt="Post title">
  <div class="post-content">
    <span class="post-category">CSS</span>
    <h3>Understanding Flexbox</h3>
    <p>A complete guide to CSS Flexbox layout...</p>
    <div class="post-meta">
      <span>March 10, 2024</span>
      <span>5 min read</span>
    </div>
  </div>
</article>
\`\`\`

### Sidebar Widgets

Include these common blog sidebar elements:
- **Search** -- Input with search button
- **Categories** -- List of topic links
- **Recent Posts** -- Titles linking to posts
- **Newsletter** -- Email signup form

### Typography for Readability

\`\`\`css
.post-body {
  font-size: 18px;
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto;
  color: #333;
}

.post-body h2 {
  margin-top: 2em;
  margin-bottom: 0.5em;
}

.post-body p {
  margin-bottom: 1.5em;
}
\`\`\`

Good reading typography uses 16-20px font size, 1.6-1.8 line height, and a maximum line length of about 70 characters.`,
      starterCode: `<!-- TODO: Build a responsive blog layout -->
<!-- Use CSS Grid for the overall layout -->
<!-- Include: header, featured post, post grid, sidebar, footer -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tech Blog</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; color: #333; }

    /* TODO: Create .blog-layout grid with areas:
       header, featured, posts, sidebar, footer */

    /* TODO: Style the header with nav links */

    /* TODO: Style the featured post (full-width, large) */

    /* TODO: Style the post grid (2 columns within the posts area) */

    /* TODO: Style the sidebar with widgets */

    /* TODO: Style the footer */

    /* TODO: Add responsive breakpoint for mobile */
  </style>
</head>
<body>
  <div class="blog-layout">
    <!-- TODO: Build your blog structure here -->
  </div>
</body>
</html>
`,
      solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Tech Blog</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; color: #333; background: #f8f8f8; }

    .blog-layout {
      display: grid;
      grid-template-columns: 1fr 1fr 300px;
      grid-template-areas:
        "header header header"
        "featured featured featured"
        "posts posts sidebar"
        "footer footer footer";
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .blog-header {
      grid-area: header;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 2px solid #333;
    }
    .blog-header h1 { font-size: 1.75rem; }
    .blog-header nav a {
      margin-left: 20px;
      text-decoration: none;
      color: #555;
    }

    .featured {
      grid-area: featured;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      padding: 40px;
    }
    .featured .category { color: #e94560; font-size: 14px; text-transform: uppercase; }
    .featured h2 { font-size: 2rem; margin: 10px 0; }
    .featured p { color: #666; line-height: 1.6; }

    .posts {
      grid-area: posts;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .post-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .post-card img { width: 100%; height: 160px; object-fit: cover; }
    .post-card .post-content { padding: 16px; }
    .post-card h3 { font-size: 1.1rem; margin-bottom: 8px; }
    .post-card p { font-size: 14px; color: #666; }
    .post-meta { font-size: 12px; color: #999; margin-top: 10px; }

    .sidebar {
      grid-area: sidebar;
    }
    .widget {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .widget h4 { margin-bottom: 12px; }
    .widget ul { list-style: none; }
    .widget li { padding: 6px 0; border-bottom: 1px solid #eee; }
    .widget input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .blog-footer {
      grid-area: footer;
      text-align: center;
      padding: 30px;
      border-top: 2px solid #333;
      color: #777;
    }

    @media (max-width: 768px) {
      .blog-layout {
        grid-template-columns: 1fr;
        grid-template-areas:
          "header"
          "featured"
          "posts"
          "sidebar"
          "footer";
      }
      .posts { grid-template-columns: 1fr; }
      .blog-header { flex-direction: column; gap: 10px; }
    }
  </style>
</head>
<body>
  <div class="blog-layout">
    <header class="blog-header">
      <h1>TechBlog</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">Articles</a>
        <a href="#">About</a>
      </nav>
    </header>

    <section class="featured">
      <span class="category">Featured</span>
      <h2>The Complete Guide to CSS Grid</h2>
      <p>Learn how to build complex, responsive layouts with CSS Grid. This comprehensive guide covers everything from basic concepts to advanced techniques.</p>
      <div class="post-meta">March 10, 2024 &middot; 10 min read</div>
    </section>

    <section class="posts">
      <article class="post-card">
        <img src="https://placeholder.com/flexbox.jpg" alt="Flexbox guide">
        <div class="post-content">
          <h3>Flexbox in 10 Minutes</h3>
          <p>A quick guide to mastering CSS Flexbox layout.</p>
          <div class="post-meta">Mar 8 &middot; 5 min</div>
        </div>
      </article>
      <article class="post-card">
        <img src="https://placeholder.com/javascript.jpg" alt="JavaScript tips">
        <div class="post-content">
          <h3>10 JavaScript Tips</h3>
          <p>Useful tricks every JavaScript developer should know.</p>
          <div class="post-meta">Mar 5 &middot; 7 min</div>
        </div>
      </article>
      <article class="post-card">
        <img src="https://placeholder.com/git.jpg" alt="Git workflow">
        <div class="post-content">
          <h3>Git Workflow for Teams</h3>
          <p>Best practices for collaborating with Git and GitHub.</p>
          <div class="post-meta">Mar 3 &middot; 6 min</div>
        </div>
      </article>
      <article class="post-card">
        <img src="https://placeholder.com/responsive.jpg" alt="Responsive design">
        <div class="post-content">
          <h3>Mobile-First Design</h3>
          <p>Why starting with mobile leads to better websites.</p>
          <div class="post-meta">Mar 1 &middot; 4 min</div>
        </div>
      </article>
    </section>

    <aside class="sidebar">
      <div class="widget">
        <h4>Search</h4>
        <input type="text" placeholder="Search articles...">
      </div>
      <div class="widget">
        <h4>Categories</h4>
        <ul>
          <li>HTML (4)</li>
          <li>CSS (8)</li>
          <li>JavaScript (12)</li>
          <li>Git (3)</li>
        </ul>
      </div>
      <div class="widget">
        <h4>Newsletter</h4>
        <p style="font-size:14px;margin-bottom:8px;">Get weekly articles in your inbox.</p>
        <input type="email" placeholder="Your email">
        <button style="width:100%;padding:8px;background:#333;color:white;border:none;border-radius:4px;cursor:pointer;">Subscribe</button>
      </div>
    </aside>

    <footer class="blog-footer">
      <p>&copy; 2024 TechBlog. Built with HTML & CSS.</p>
    </footer>
  </div>
</body>
</html>
`,
    },
  ],
};
