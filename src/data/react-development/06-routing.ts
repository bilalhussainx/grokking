import { Module } from "../types";

export const routingModule: Module = {
  id: "routing",
  title: "React Router",
  description:
    "Understand client-side routing by building a router from scratch — route matching, parameterized routes, navigation, and nested layouts.",
  lessons: [
    {
      id: "routing-intro",
      slug: "routing-intro",
      title: "Introduction to Client-Side Routing",
      content: `## Client-Side Routing

In a traditional web app, every navigation triggers a full page reload from the server. **Client-side routing** intercepts navigation and updates the UI without reloading — making apps feel fast and seamless.

### How Client-Side Routing Works

1. User clicks a link or types a URL
2. The router **intercepts** the navigation (prevents full reload)
3. The router **matches** the URL against defined routes
4. The matched component is **rendered** in place

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

### Route Priority

When multiple routes could match, specificity wins:

1. Exact matches first (\`/users/new\`)
2. Parameterized routes next (\`/users/:id\`)
3. Wildcard routes last (\`/*\`)

In these exercises, you will build a router system from scratch to understand how React Router works internally.`,
    },
    {
      id: "routing-matcher",
      slug: "route-matcher",
      title: "Route Matcher",
      content: `## Route Matcher

### Problem Statement

Implement a \`createRouter(routes)\` function that matches URL paths to route definitions. Each route has a \`path\` pattern and a \`handler\` function.

The router should support:
- **Exact paths**: \`/about\` matches only \`/about\`
- **Path parameters**: \`/users/:id\` matches \`/users/42\` and extracts \`{ id: "42" }\`
- **Multiple parameters**: \`/posts/:postId/comments/:commentId\`
- **Wildcard**: \`/*\` matches any unmatched path
- **Query string parsing**: \`/search?q=react&page=2\` extracts query params

The router's \`match(url)\` method returns \`{ handler, params, query }\` or \`null\` if no match.

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

### Hints

- Split both pattern and pathname on "/" to compare segment by segment
- Segments starting with ":" are parameters — capture the corresponding path segment
- Parse query strings by splitting on "&" then on "="`,
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

### Examples

\`\`\`
const nav = createNavigator([
  { path: "/", handler: "home" },
  { path: "/dashboard", handler: "dashboard" },
]);

nav.navigate("/");
nav.navigate("/dashboard");
nav.getCurrentRoute().handler; // "dashboard"
nav.back();
nav.getCurrentRoute().handler; // "home"
\`\`\`

### Hints

- Use an array as the history stack and an index pointer
- Navigating after going back should discard forward history
- Guards are checked before navigation — if any returns false, block it`,
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
