import { Module } from "../types";

export const routingModule: Module = {
  id: "routing",
  title: "React Router",
  description: "Understand client-side routing by building a router from scratch — route matching, parameterized routes, navigation, and nested layouts.",
  lessons: [
    {
      id: "routing-intro",
      slug: "routing-intro",
      title: "Introduction to Client-Side Routing",
      content: `## Client-Side Routing

In a traditional web app, every navigation triggers a full page reload from the server. **Client-side routing** intercepts navigation and updates the UI without reloading — making apps feel fast and seamless.

\`\`\`concept
{
  "title": "Client-Side Routing",
  "variant": "mental-model",
  "content": "Think of client-side routing like a single-page map app. Instead of redrawing the entire map every time you zoom or move (server reload), the app only updates the visible tiles (UI components) while keeping the frame and controls intact. The URL becomes a bookmarkable state that can recreate the exact view later."
}
\`\`\`

### How Client-Side Routing Works

\`\`\`steps
{
  "title": "The Client-Side Routing Flow",
  "steps": [
    {
      "title": "1. Intercept Navigation",
      "content": "When a user clicks a link, the router prevents the browser's default behavior using \`event.preventDefault()\`"
    },
    {
      "title": "2. Update URL with History API",
      "content": "The router uses \`history.pushState()\` to change the URL without reloading the page"
    },
    {
      "title": "3. Match Against Route Patterns",
      "content": "The new URL is compared against defined route patterns to find the best match"
    },
    {
      "title": "4. Render Matched Component",
      "content": "The router updates the DOM to display the component associated with the matched route"
    }
  ]
}
\`\`\`

\`\`\`trace
{
  "title": "History API in Action",
  "language": "javascript",
  "code": "// Initial state\\nconsole.log('Current URL:', window.location.pathname);\\n\\n// Navigate to new route without reload\\nhistory.pushState({page: 'profile'}, 'Profile', '/users/42');\\nconsole.log('New URL:', window.location.pathname);\\n\\n// Listen for back/forward button\\nwindow.addEventListener('popstate', (event) => {\\n  console.log('Navigated to:', window.location.pathname);\\n  console.log('State data:', event.state);\\n});",
  "frames": [
    {
      "line": 1,
      "vars": {"window.location.pathname": "/"},
      "stdout": "Current URL: /"
    },
    {
      "line": 4,
      "vars": {"window.location.pathname": "/users/42"},
      "stdout": "New URL: /users/42"
    },
    {
      "line": 8,
      "vars": {"window.location.pathname": "/"},
      "event": "User clicked back button",
      "stdout": "Navigated to: /\\nState data: null"
    }
  ],
  "speed": 1000
}
\`\`\`

### React Router Concepts

| Concept | Description |
|---------|-------------|
| **Route** | Maps a URL pattern to a component |
| **Path params** | Dynamic segments like \`/users/:id\` |
| **Query params** | Key-value pairs after \`?\` like \`?sort=name\` |
| **Nested routes** | Routes within routes for layouts |
| **Navigation** | Programmatic route changes |
| **Guards** | Conditional access (auth checks) |

### URL Pattern Matching

Routes use patterns with dynamic segments:

\`\`\`
/users          -> exact match
/users/:id      -> matches /users/42, /users/abc
/posts/:id/edit -> matches /posts/5/edit
/*              -> wildcard, matches anything
\`\`\`

\`\`\`quiz
{
  "title": "Route Matching Patterns",
  "questions": [
    {
      "question": "Which route pattern would match \`/products/laptop/reviews\`?",
      "options": ["/products", "/products/:id", "/products/:id/reviews", "/*"],
      "answer": 2,
      "explanation": "The pattern \`/products/:id/reviews\` has three segments where the middle segment \`:id\` is dynamic, perfectly matching \`/products/laptop/reviews\`"
    },
    {
      "question": "What is the priority order for route matching when multiple routes could match?",
      "options": [
        "Wildcard first, then parameterized, then exact",
        "Exact first, then parameterized, then wildcard",
        "Parameterized first, then exact, then wildcard",
        "All routes have equal priority"
      ],
      "answer": 1,
      "explanation": "React Router ranks routes by specificity: exact matches have highest priority, followed by parameterized routes, then wildcard routes have lowest priority"
    },
    {
      "question": "Which HTML5 API method adds a new entry to the browser's history stack?",
      "options": ["history.replaceState()", "history.pushState()", "history.go()", "history.back()"],
      "answer": 1,
      "explanation": "history.pushState() adds a new entry to the session history stack, while replaceState() modifies the current entry without adding a new one"
    }
  ]
}
\`\`\`

### Route Priority

When multiple routes could match, specificity wins:

1. Exact matches first (\`/users/new\`)
2. Parameterized routes next (\`/users/:id\`)
3. Wildcard routes last (\`/*\`)

\`\`\`callout
{
  "type": "warning",
  "title": "Performance Trade-offs",
  "content": "Client-side routing speeds up subsequent navigation but increases initial load time. The entire application must download before routing works, making the first visit slower than traditional server-side routing."
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "Common Misconception",
  "content": "Despite its popularity, React Router is **not** the official routing solution from Facebook. It's a third-party library that became the de facto standard for React applications."
}
\`\`\`

In these exercises, you will build a router system from scratch to understand how React Router works internally.`,
    },
    {
      id: "routing-matcher",
      slug: "route-matcher",
      title: "Route Matcher",
      content: `## Route Matcher

\`\`\`concept
{"title": "What is a Route Matcher?", "variant": "mental-model", "content": "A route matcher is the engine that decides \\"which code should run for this URL\\". It treats every route definition as a pattern, compares it to the current pathname, and returns the best match along with any extracted parameters. In React Router v6, this happens automatically through a ranking algorithm that prefers static segments over dynamic ones, eliminating the need for manual ordering or the old \`exact\` prop."}
\`\`\`

### Problem Statement

Implement a \`createRouter(routes)\` function that matches URL paths to route definitions. Each route has a \`path\` pattern and a \`handler\` function.

The router should support:
- **Exact paths**: \`/about\` matches only \`/about\`
- **Path parameters**: \`/users/:id\` matches \`/users/42\` and extracts \`{ id: "42" }\`
- **Multiple parameters**: \`/posts/:postId/comments/:commentId\`
- **Wildcard**: \`/*\` matches any unmatched path
- **Query string parsing**: \`/search?q=react&page=2\` extracts query params

The router's \`match(url)\` method returns \`{ handler, params, query }\` or \`null\` if no match.

\`\`\`algoviz
{"title": "Matching /users/42 to /users/:id", "type": "array", "data": ["/users/:id", "/users/42"], "frames": [{"highlight": [0, 1], "label": "Split both pattern and pathname on '/'"}, {"highlight": [0], "label": "Compare segments: 'users' === 'users' ✓"}, {"highlight": [1], "label": "Compare segments: ':id' is param → capture '42'", "stats": {"params": {"id": "42"}}}], "speed": 1000}
\`\`\`

### Examples

\`\`\`
const router = createRouter([
  { path: "/", handler: "home" },
  { path: "/users/:id", handler: "userDetail" },
  { path: "/*", handler: "notFound" },
]);

router.match("/"); // { handler: "home", params: {}, query: {} }
router.match("/users/42"); // { handler: "userDetail", params: { id: "42" }, query: {} }
router.match("/xyz"); // { handler: "notFound", params: {}, query: {} }
\`\`\`

\`\`\`steps
{"title": "Building the Matcher Step-by-Step", "steps": [{"title": "Normalize the URL", "content": "Split the full URL into \`pathname\` and \`search\` parts. The pathname is what we match against; the search becomes the query object."}, {"title": "Segment the Pattern", "content": "Split both the route pattern and the pathname on \\"/\\" so you can compare segment by segment. Empty segments from leading or trailing slashes are ignored."}, {"title": "Match or Capture", "content": "For each position: if pattern segment starts with \\":\\" it’s a parameter—store the corresponding pathname segment in \`params\`. Otherwise the segments must be identical for a match."}, {"title": "Handle Wildcards", "content": "A pattern segment of \\"*\\" matches any remaining pathname segments. It’s lowest priority, so attempt it only after static and dynamic segments fail."}, {"title": "Parse Query String", "content": "Split the search part on \\"&\\", then each chunk on \\"=\\" to build the \`query\` object. Remember to decodeURIComponent both keys and values."}]}
\`\`\`

### Hints

- Split both pattern and pathname on "/" to compare segment by segment
- Segments starting with ":" are parameters — capture the corresponding path segment
- Parse query strings by splitting on "&" then on "="

\`\`\`compare
{"variant": "good-bad", "before": {"label": "Manual Route Ordering (fragile)", "code": "const routes = [\\n  { path: \\"/users/:id\\", handler: User },\\n  { path: \\"/users/new\\", handler: NewUser }, // oops—never reached\\n  { path: \\"/*\\", handler: NotFound }\\n];"}, "after": {"label": "Ranking-Based Matching (robust)", "code": "const routes = [\\n  { path: \\"/users/new\\", handler: NewUser }, // static → higher rank\\n  { path: \\"/users/:id\\", handler: User },   // dynamic\\n  { path: \\"/*\\", handler: NotFound }        // wildcard → lowest rank\\n]; // React Router v6 orders these automatically"}}
\`\`\`

\`\`\`quiz
{"title": "Route Matcher Quiz", "questions": [{"question": "Which pattern will match \`/blog/2023/react-router\` and capture \`2023\` as \`year\`?", "options": ["/blog/:year/*", "/blog/:year/react-router", "/blog/:year/:post"], "answer": 0, "explanation": "The wildcard \`*\` after \`:year\` consumes the remaining segments, making it the most flexible match."}, {"question": "What does React Router v6 rank highest when choosing among several matching routes?", "options": ["Wildcard routes", "Dynamic segments", "Static segments", "Query strings"], "answer": 2, "explanation": "Static segments have the highest specificity, so \`/users/new\` beats \`/users/:id\`."}, {"question": "Which URL will NOT match the pattern \`/posts/:postId/comments/:commentId\`?", "options": ["/posts/abc/comments/xyz", "/posts/123/comments/456/extra", "/posts//comments/"], "answer": 2, "explanation": "Empty dynamic segments are still valid, but the structure must align—missing \`postId\` breaks the pattern."}]}
\`\`\`

\`\`\`playground
{"title": "Implement createRouter", "language": "javascript", "code": "function createRouter(routeDefs) {\\n  const routes = routeDefs.map(r => ({\\n    segments: r.path.split('/').filter(Boolean),\\n    handler: r.handler\\n  }));\\n\\n  return {\\n    match(url) {\\n      const [pathname, search = ''] = url.split('?');\\n      const pathSegments = pathname.split('/').filter(Boolean);\\n      \\n      // Build query object\\n      const query = {};\\n      search.split('&').forEach(pair => {\\n        const [k, v] = pair.split('=');\\n        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');\\n      });\\n\\n      // Try each route in order\\n      for (const route of routes) {\\n        const params = {};\\n        let ok = true;\\n\\n        for (let i = 0; i < route.segments.length; i++) {\\n          const pat = route.segments[i];\\n          if (pat === '*') { ok = true; break; }\\n          const seg = pathSegments[i];\\n          if (pat.startsWith(':')) params[pat.slice(1)] = seg;\\n          else if (pat !== seg) { ok = false; break; }\\n        }\\n\\n        if (ok && pathSegments.length === route.segments.length) {\\n          return { handler: route.handler, params, query };\\n        }\\n      }\\n      return null;\\n    }\\n  };\\n}\\n\\n// Quick test\\nconst r = createRouter([\\n  { path: '/', handler: 'home' },\\n  { path: '/users/:id', handler: 'user' },\\n  { path: '/*', handler: '404' }\\n]);\\nconsole.log(r.match('/users/42')); // → { handler: 'user', params: {id:'42'}, query:{} }", "runnable": true}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Segment-by-segment comparison lets you capture parameters and support wildcards with simple string operations.", "React Router v6 automates route ranking—static beats dynamic beats wildcard—so you no longer need manual ordering or the \`exact\` prop.", "Extracting query strings is orthogonal to pathname matching; do it once after you find the best route.", "A home-built matcher is great for learning, but production code benefits from trie-based structures that can be 60–10 000× faster on large route tables."]}
\`\`\``,
      starterCode: `function createRouter(routes) {
  // TODO: Create a router that:
  // - Stores route definitions
  // - match(url) finds the best matching route
  // - Extracts path params (:param segments)
  // - Parses query strings (?key=value)
  // - Returns { handler, params, query } or null

  function parseQuery(queryString) {
    // TODO: parse "key=value&key2=value2" into an object
  }

  function matchRoute(pattern, pathname) {
    // TODO: check if pathname matches pattern
    // Return { matched: boolean, params: object }
  }

  return {
    match(url) {
      // TODO: split url into pathname and query string
      // Try each route in order, return first match
    },
  };
}

// Test cases
const router = createRouter([
  { path: "/", handler: "home" },
  { path: "/about", handler: "about" },
  { path: "/users", handler: "userList" },
  { path: "/users/:id", handler: "userDetail" },
  { path: "/users/:id/posts", handler: "userPosts" },
  { path: "/posts/:postId/comments/:commentId", handler: "comment" },
  { path: "/*", handler: "notFound" },
]);

// Test 1: Exact match
console.log(router.match("/"));
// Expected: { handler: "home", params: {}, query: {} }

console.log(router.match("/about"));
// Expected: { handler: "about", params: {}, query: {} }

// Test 2: Path parameters
console.log(router.match("/users/42"));
// Expected: { handler: "userDetail", params: { id: "42" }, query: {} }

console.log(router.match("/users/alice"));
// Expected: { handler: "userDetail", params: { id: "alice" }, query: {} }

// Test 3: Nested path with params
console.log(router.match("/users/42/posts"));
// Expected: { handler: "userPosts", params: { id: "42" }, query: {} }

// Test 4: Multiple params
console.log(router.match("/posts/5/comments/12"));
// Expected: { handler: "comment", params: { postId: "5", commentId: "12" }, query: {} }

// Test 5: Query strings
console.log(router.match("/users?sort=name&order=asc"));
// Expected: { handler: "userList", params: {}, query: { sort: "name", order: "asc" } }

// Test 6: Params + query string
console.log(router.match("/users/42?tab=settings"));
// Expected: { handler: "userDetail", params: { id: "42" }, query: { tab: "settings" } }

// Test 7: Wildcard catch-all
console.log(router.match("/unknown/path"));
// Expected: { handler: "notFound", params: {}, query: {} }

// Test 8: No match without wildcard
const strictRouter = createRouter([
  { path: "/home", handler: "home" },
]);
console.log(strictRouter.match("/other"));
// Expected: null
`,
      solutionCode: `function createRouter(routes) {
  function parseQuery(queryString) {
    if (!queryString) return {};
    const params = {};
    const pairs = queryString.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    }
    return params;
  }

  function matchRoute(pattern, pathname) {
    if (pattern === "/*") {
      return { matched: true, params: {} };
    }

    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = pathname.split("/").filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return { matched: false, params: {} };
    }

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return { matched: false, params: {} };
      }
    }

    return { matched: true, params };
  }

  return {
    match(url) {
      const [pathname, queryString] = url.split("?");
      const query = parseQuery(queryString);

      for (const route of routes) {
        const result = matchRoute(route.path, pathname);
        if (result.matched) {
          return {
            handler: route.handler,
            params: result.params,
            query,
          };
        }
      }

      return null;
    },
  };
}

// Test cases
const router = createRouter([
  { path: "/", handler: "home" },
  { path: "/about", handler: "about" },
  { path: "/users", handler: "userList" },
  { path: "/users/:id", handler: "userDetail" },
  { path: "/users/:id/posts", handler: "userPosts" },
  { path: "/posts/:postId/comments/:commentId", handler: "comment" },
  { path: "/*", handler: "notFound" },
]);

// Test 1: Exact match
console.log(router.match("/"));
// Expected: { handler: "home", params: {}, query: {} }

console.log(router.match("/about"));
// Expected: { handler: "about", params: {}, query: {} }

// Test 2: Path parameters
console.log(router.match("/users/42"));
// Expected: { handler: "userDetail", params: { id: "42" }, query: {} }

console.log(router.match("/users/alice"));
// Expected: { handler: "userDetail", params: { id: "alice" }, query: {} }

// Test 3: Nested path with params
console.log(router.match("/users/42/posts"));
// Expected: { handler: "userPosts", params: { id: "42" }, query: {} }

// Test 4: Multiple params
console.log(router.match("/posts/5/comments/12"));
// Expected: { handler: "comment", params: { postId: "5", commentId: "12" }, query: {} }

// Test 5: Query strings
console.log(router.match("/users?sort=name&order=asc"));
// Expected: { handler: "userList", params: {}, query: { sort: "name", order: "asc" } }

// Test 6: Params + query string
console.log(router.match("/users/42?tab=settings"));
// Expected: { handler: "userDetail", params: { id: "42" }, query: { tab: "settings" } }

// Test 7: Wildcard catch-all
console.log(router.match("/unknown/path"));
// Expected: { handler: "notFound", params: {}, query: {} }

// Test 8: No match without wildcard
const strictRouter = createRouter([
  { path: "/home", handler: "home" },
]);
console.log(strictRouter.match("/other"));
// Expected: null
`,
    },
    {
      id: "routing-navigator",
      slug: "route-navigator",
      title: "Navigation System",
      content: `## Navigation System

### Problem Statement

Implement a navigation system that combines the router with a history stack, simulating how React Router manages browser history.

Create \`createNavigator(routes)\` that returns:
- \`navigate(url)\` — pushes a new URL onto the history stack and matches the route
- \`back()\` — goes back one entry in history
- \`forward()\` — goes forward one entry in history
- \`getCurrentRoute()\` — returns the current matched route
- \`getHistory()\` — returns the full history stack
- \`addGuard(fn)\` — adds a navigation guard that can block navigation

Guards receive \`{ from, to }\` and return \`true\` to allow or \`false\` to block.

\`\`\`concept
{
  "title": "History Stack Management",
  "variant": "mental-model",
  "content": "Think of browser history like a stack of cards. Each navigation adds a new card on top. Going back moves your pointer down the stack, while going forward moves it up. When you navigate after going back, you discard all cards above your current position before adding the new one."
}
\`\`\`

### Understanding the History Stack

The history stack is the backbone of client-side routing. When you navigate through an application, each URL change creates a new entry in this stack. The browser's back and forward buttons simply move a pointer through this stack.

\`\`\`algoviz
{
  "title": "History Stack Visualization",
  "type": "array",
  "data": ["/", "/products", "/products/123", "/cart"],
  "frames": [
    { "highlight": [0], "label": "Initial state: pointer at index 0 (/)", "stats": {"pointer": 0, "current": "/" } },
    { "highlight": [1], "label": "Navigate to /products: push and move pointer", "stats": {"pointer": 1, "current": "/products" } },
    { "highlight": [2], "label": "Navigate to /products/123: push and move pointer", "stats": {"pointer": 2, "current": "/products/123" } },
    { "highlight": [1], "label": "Go back: move pointer to index 1", "stats": {"pointer": 1, "current": "/products" } },
    { "highlight": [2], "label": "Go forward: move pointer to index 2", "stats": {"pointer": 2, "current": "/products/123" } },
    { "highlight": [2], "label": "Navigate to /cart: discard forward history, push new", "stats": {"pointer": 2, "current": "/cart" } }
  ],
  "speed": 1000
}
\`\`\`

### Implementation Strategy

The key insight is maintaining both a history array and a current index pointer. This allows efficient back/forward navigation without modifying the history itself - you only move the pointer.

\`\`\`steps
{
  "title": "Building the Navigator",
  "steps": [
    {
      "title": "Initialize State",
      "content": "Start with an empty history array and index at -1. You'll also need to track routes and guards."
    },
    {
      "title": "Handle Navigation",
      "content": "When navigating:\\n1. Check all guards - if any return false, block navigation\\n2. If navigating after going back, truncate history at current index\\n3. Push new URL to history\\n4. Update current index to point to new entry\\n5. Match and return the route"
    },
    {
      "title": "Implement Back/Forward",
      "content": "For back(): decrement index if > 0 and return matched route\\nFor forward(): increment index if < history.length - 1 and return matched route"
    },
    {
      "title": "Add Route Matching",
      "content": "For each navigation, match the URL against your routes array using the same pattern matching logic from previous lessons"
    }
  ]
}
\`\`\`

### Navigation Guards

Navigation guards are functions that can prevent navigation based on custom logic. They're commonly used for authentication checks, unsaved changes warnings, or permission validation.

\`\`\`callout
{
  "type": "info",
  "title": "Real-World Guard Usage",
  "content": "In React Router, navigation guards are implemented through hooks like \`usePrompt\` or custom route guards. They're essential for preventing users from accidentally leaving forms with unsaved data or accessing protected routes without authentication."
}
\`\`\`

### Examples

\`\`\`playground
{
  "title": "Navigator Implementation",
  "language": "javascript",
  "code": "function createNavigator(routes) {\\n  let history = [];\\n  let currentIndex = -1;\\n  let guards = [];\\n  \\n  function matchRoute(url) {\\n    for (const route of routes) {\\n      if (route.path === url) {\\n        return route;\\n      }\\n    }\\n    return null;\\n  }\\n  \\n  function navigate(url) {\\n    const toRoute = matchRoute(url);\\n    if (!toRoute) return null;\\n    \\n    const fromRoute = currentIndex >= 0 ? matchRoute(history[currentIndex]) : null;\\n    \\n    // Check guards\\n    for (const guard of guards) {\\n      if (!guard({ from: fromRoute, to: toRoute })) {\\n        return null;\\n      }\\n    }\\n    \\n    // Truncate forward history if navigating after going back\\n    if (currentIndex < history.length - 1) {\\n      history = history.slice(0, currentIndex + 1);\\n    }\\n    \\n    history.push(url);\\n    currentIndex++;\\n    return toRoute;\\n  }\\n  \\n  function back() {\\n    if (currentIndex > 0) {\\n      currentIndex--;\\n      return matchRoute(history[currentIndex]);\\n    }\\n    return null;\\n  }\\n  \\n  function forward() {\\n    if (currentIndex < history.length - 1) {\\n      currentIndex++;\\n      return matchRoute(history[currentIndex]);\\n    }\\n    return null;\\n  }\\n  \\n  function getCurrentRoute() {\\n    if (currentIndex >= 0) {\\n      return matchRoute(history[currentIndex]);\\n    }\\n    return null;\\n  }\\n  \\n  function getHistory() {\\n    return [...history];\\n  }\\n  \\n  function addGuard(fn) {\\n    guards.push(fn);\\n  }\\n  \\n  return {\\n    navigate,\\n    back,\\n    forward,\\n    getCurrentRoute,\\n    getHistory,\\n    addGuard\\n  };\\n}\\n\\n// Test the implementation\\nconst nav = createNavigator([\\n  { path: \\"/\\", handler: \\"home\\" },\\n  { path: \\"/dashboard\\", handler: \\"dashboard\\" },\\n]);\\n\\nconsole.log(nav.navigate(\\"/\\")); // { path: \\"/\\", handler: \\"home\\" }\\nconsole.log(nav.navigate(\\"/dashboard\\")); // { path: \\"/dashboard\\", handler: \\"dashboard\\" }\\nconsole.log(nav.getCurrentRoute().handler); // \\"dashboard\\"\\nconsole.log(nav.back()); // { path: \\"/\\", handler: \\"home\\" }\\nconsole.log(nav.getCurrentRoute().handler); // \\"home\\"\\nconsole.log(nav.getHistory()); // [\\"/\\", \\"/dashboard\\"]",
  "runnable": true
}
\`\`\`

### Adding Navigation Guards

Let's enhance our navigator with a guard that prevents navigation away from the dashboard:

\`\`\`playground
{
  "title": "Navigation with Guards",
  "language": "javascript",
  "code": "const nav = createNavigator([\\n  { path: \\"/\\", handler: \\"home\\" },\\n  { path: \\"/dashboard\\", handler: \\"dashboard\\" },\\n  { path: \\"/profile\\", handler: \\"profile\\" }\\n]);\\n\\n// Add a guard that blocks navigation from dashboard to home\\nnav.addGuard(({ from, to }) => {\\n  if (from?.handler === \\"dashboard\\" && to?.handler === \\"home\\") {\\n    console.log(\\"Blocked: Cannot go from dashboard to home directly\\");\\n    return false;\\n  }\\n  return true;\\n});\\n\\n// Test navigation with guards\\nconsole.log(\\"Navigating to dashboard:\\", nav.navigate(\\"/dashboard\\"));\\nconsole.log(\\"Current route:\\", nav.getCurrentRoute().handler);\\n\\nconsole.log(\\"\\\\nTrying to go back to home (should be blocked):\\");\\nconsole.log(\\"Back result:\\", nav.back()); // null - blocked by guard\\nconsole.log(\\"Current route:\\", nav.getCurrentRoute().handler); // Still dashboard\\n\\nconsole.log(\\"\\\\nNavigating to profile (allowed):\\");\\nconsole.log(\\"Navigate result:\\", nav.navigate(\\"/profile\\"));\\nconsole.log(\\"Current route:\\", nav.getCurrentRoute().handler);\\n\\nconsole.log(\\"\\\\nNow going back to dashboard (allowed):\\");\\nconsole.log(\\"Back result:\\", nav.back());\\nconsole.log(\\"Current route:\\", nav.getCurrentRoute().handler);",
  "runnable": true
}
\`\`\`

\`\`\`quiz
{
  "title": "Navigation System Quiz",
  "questions": [
    {
      "question": "What happens to the forward history when you navigate after going back?",
      "options": [
        "It remains unchanged",
        "It gets cleared/truncated",
        "It gets duplicated",
        "It gets reversed"
      ],
      "answer": 1,
      "explanation": "When you navigate after going back, all forward history (entries after the current index) is discarded before adding the new entry. This matches browser behavior."
    },
    {
      "question": "In the history stack, what does the current index represent?",
      "options": [
        "The total number of entries",
        "The position of the current route in the stack",
        "The number of guards active",
        "The maximum stack size"
      ],
      "answer": 1,
      "explanation": "The current index is a pointer that indicates which entry in the history array represents the currently active route."
    },
    {
      "question": "What should navigation guards return to allow navigation?",
      "options": [
        "The new URL",
        "true",
        "false",
        "The route object"
      ],
      "answer": 1,
      "explanation": "Navigation guards must return true to allow navigation. Returning false (or any falsy value) blocks the navigation."
    }
  ]
}
\`\`\`

### Edge Cases to Consider

When implementing your navigator, handle these scenarios:

\`\`\`callout
{
  "type": "warning",
  "title": "Edge Cases",
  "content": "- **Empty history**: Handle cases where no navigation has occurred yet\\n- **Invalid URLs**: Return null or a 404 equivalent for unmatched routes\\n- **Guard exceptions**: Consider what happens if a guard throws an error\\n- **Multiple guards**: All guards must return true for navigation to proceed\\n- **Circular navigation**: Prevent infinite loops in guard logic"
}
\`\`\`

### Testing Your Implementation

\`\`\`fillblank
{
  "title": "Complete the Navigator Test",
  "prompt": "Fill in the missing parts to test the navigator's forward functionality",
  "language": "javascript",
  "template": "const nav = createNavigator([\\n  { path: \\"/\\", handler: \\"home\\" },\\n  { path: \\"/about\\", handler: \\"about\\" }\\n]);\\n\\nnav.navigate(\\"/\\");\\nnav.navigate(\\"/about\\");\\nnav.back();\\n\\n// Test forward functionality\\nconst forwardResult = ___();\\nconsole.log(forwardResult.handler); // Should output: ___\\n\\nconsole.log(nav.___().handler); // Should output: \\"about\\"",
  "blanks": [
    { "answer": "nav.forward", "hint": "Call the method to go forward in history" },
    { "answer": "about", "hint": "What handler should be active after going forward?" },
    { "answer": "getCurrentRoute", "hint": "What method returns the current route?" }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "History stack management uses an array and index pointer for efficient back/forward navigation",
    "Navigating after going back truncates forward history, matching browser behavior",
    "Navigation guards provide a way to conditionally block navigation based on custom logic",
    "The current index pointer allows O(1) time complexity for back/forward operations",
    "Client-side routing creates seamless navigation without full page reloads"
  ]
}
\`\`\``,
      starterCode: `function createNavigator(routes) {
  // TODO: Create a navigation system with:
  // - A router (reuse route matching logic)
  // - A history stack and current index
  // - navigate(url): push to history, match route
  // - back(): move index backward
  // - forward(): move index forward
  // - getCurrentRoute(): return current matched route
  // - getHistory(): return the full history array
  // - addGuard(fn): add a navigation guard

  function matchRoute(url) {
    // TODO: match url against routes (same logic as previous exercise)
  }

  return {
    navigate(url) {
      // TODO
    },
    back() {
      // TODO
    },
    forward() {
      // TODO
    },
    getCurrentRoute() {
      // TODO
    },
    getHistory() {
      // TODO
    },
    addGuard(guardFn) {
      // TODO: return a removeGuard function
    },
  };
}

// Test cases
const nav = createNavigator([
  { path: "/", handler: "home" },
  { path: "/about", handler: "about" },
  { path: "/login", handler: "login" },
  { path: "/dashboard", handler: "dashboard" },
  { path: "/users/:id", handler: "userDetail" },
  { path: "/*", handler: "notFound" },
]);

// Test 1: Basic navigation
nav.navigate("/");
console.log(nav.getCurrentRoute().handler);
// Expected: "home"

nav.navigate("/about");
console.log(nav.getCurrentRoute().handler);
// Expected: "about"

// Test 2: History
console.log(nav.getHistory().length);
// Expected: 2

// Test 3: Back navigation
nav.back();
console.log(nav.getCurrentRoute().handler);
// Expected: "home"

// Test 4: Forward navigation
nav.forward();
console.log(nav.getCurrentRoute().handler);
// Expected: "about"

// Test 5: Navigate after back discards forward history
nav.back();
nav.navigate("/login");
console.log(nav.getHistory().length);
// Expected: 2 (forward history was discarded)
console.log(nav.getCurrentRoute().handler);
// Expected: "login"

// Test 6: Navigation with params
nav.navigate("/users/42");
console.log(nav.getCurrentRoute().params);
// Expected: { id: "42" }

// Test 7: Navigation guard
nav.navigate("/dashboard");
const removeGuard = nav.addGuard(({ from, to }) => {
  if (from === "/dashboard" && to !== "/login") {
    return false;
  }
  return true;
});

nav.navigate("/about"); // should be blocked
console.log(nav.getCurrentRoute().handler);
// Expected: "dashboard" (blocked)

nav.navigate("/login"); // should be allowed
console.log(nav.getCurrentRoute().handler);
// Expected: "login"

// Test 8: Remove guard
removeGuard();
nav.navigate("/dashboard");
nav.navigate("/about"); // should work now
console.log(nav.getCurrentRoute().handler);
// Expected: "about"

// Test 9: Back at beginning
nav.navigate("/");
nav.back(); nav.back(); nav.back(); nav.back(); nav.back();
console.log(nav.getCurrentRoute().handler);
// Expected: first entry handler
`,
      solutionCode: `function createNavigator(routes) {
  const history = [];
  let currentIndex = -1;
  const guards = new Set();

  function parseQuery(queryString) {
    if (!queryString) return {};
    const params = {};
    for (const pair of queryString.split("&")) {
      const [key, value] = pair.split("=");
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
    return params;
  }

  function matchRoute(url) {
    const [pathname, queryString] = url.split("?");
    const query = parseQuery(queryString);

    for (const route of routes) {
      if (route.path === "/*") {
        return { handler: route.handler, params: {}, query, url };
      }

      const patternParts = route.path.split("/").filter(Boolean);
      const pathParts = pathname.split("/").filter(Boolean);

      if (patternParts.length !== pathParts.length) continue;

      const params = {};
      let matched = true;
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(":")) {
          params[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          matched = false;
          break;
        }
      }

      if (matched) {
        return { handler: route.handler, params, query, url };
      }
    }

    return null;
  }

  return {
    navigate(url) {
      const fromUrl = currentIndex >= 0 ? history[currentIndex] : null;

      for (const guard of guards) {
        if (!guard({ from: fromUrl, to: url })) {
          return false;
        }
      }

      history.splice(currentIndex + 1);
      history.push(url);
      currentIndex = history.length - 1;
      return true;
    },
    back() {
      if (currentIndex > 0) {
        currentIndex--;
      }
    },
    forward() {
      if (currentIndex < history.length - 1) {
        currentIndex++;
      }
    },
    getCurrentRoute() {
      if (currentIndex < 0) return null;
      return matchRoute(history[currentIndex]);
    },
    getHistory() {
      return [...history];
    },
    addGuard(guardFn) {
      guards.add(guardFn);
      return () => {
        guards.delete(guardFn);
      };
    },
  };
}

// Test cases
const nav = createNavigator([
  { path: "/", handler: "home" },
  { path: "/about", handler: "about" },
  { path: "/login", handler: "login" },
  { path: "/dashboard", handler: "dashboard" },
  { path: "/users/:id", handler: "userDetail" },
  { path: "/*", handler: "notFound" },
]);

// Test 1: Basic navigation
nav.navigate("/");
console.log(nav.getCurrentRoute().handler);
// Expected: "home"

nav.navigate("/about");
console.log(nav.getCurrentRoute().handler);
// Expected: "about"

// Test 2: History
console.log(nav.getHistory().length);
// Expected: 2

// Test 3: Back navigation
nav.back();
console.log(nav.getCurrentRoute().handler);
// Expected: "home"

// Test 4: Forward navigation
nav.forward();
console.log(nav.getCurrentRoute().handler);
// Expected: "about"

// Test 5: Navigate after back discards forward history
nav.back();
nav.navigate("/login");
console.log(nav.getHistory().length);
// Expected: 2 (forward history was discarded)
console.log(nav.getCurrentRoute().handler);
// Expected: "login"

// Test 6: Navigation with params
nav.navigate("/users/42");
console.log(nav.getCurrentRoute().params);
// Expected: { id: "42" }

// Test 7: Navigation guard
nav.navigate("/dashboard");
const removeGuard = nav.addGuard(({ from, to }) => {
  if (from === "/dashboard" && to !== "/login") {
    return false;
  }
  return true;
});

nav.navigate("/about"); // should be blocked
console.log(nav.getCurrentRoute().handler);
// Expected: "dashboard" (blocked)

nav.navigate("/login"); // should be allowed
console.log(nav.getCurrentRoute().handler);
// Expected: "login"

// Test 8: Remove guard
removeGuard();
nav.navigate("/dashboard");
nav.navigate("/about"); // should work now
console.log(nav.getCurrentRoute().handler);
// Expected: "about"

// Test 9: Back at beginning
nav.navigate("/");
nav.back(); nav.back(); nav.back(); nav.back(); nav.back();
console.log(nav.getCurrentRoute().handler);
// Expected: first entry handler
`,
    },
  ],
};
