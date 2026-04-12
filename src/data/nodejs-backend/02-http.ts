import { Module } from "../types";

export const httpModule: Module = {
  id: "http-fundamentals",
  title: "HTTP Fundamentals",
  description: "Understand HTTP by building a parser, router, and middleware chain from scratch.",
  lessons: [
    {
      id: "http-intro",
      slug: "http-intro",
      title: "Introduction to HTTP",
      content: `## HTTP Fundamentals

**HTTP** (HyperText Transfer Protocol) is the foundation of data communication on the web. Every backend developer must understand it deeply.

### Anatomy of an HTTP Request

\`\`\`
GET /users/42?fields=name,email HTTP/1.1
Host: api.example.com
Authorization: Bearer abc123
Accept: application/json
\`\`\`

| Part | Description |
|------|-------------|
| **Method** | GET, POST, PUT, DELETE, PATCH, etc. |
| **Path** | The resource being requested (\`/users/42\`) |
| **Query String** | Key-value parameters after \`?\` |
| **HTTP Version** | Usually HTTP/1.1 or HTTP/2 |
| **Headers** | Metadata key-value pairs |
| **Body** | Data payload (for POST, PUT, PATCH) |

### Anatomy of an HTTP Response

\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 45

{"id": 42, "name": "Alice", "email": "a@b.com"}
\`\`\`

### Status Code Families

| Range | Meaning | Examples |
|-------|---------|----------|
| **1xx** | Informational | 100 Continue |
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Moved, 304 Not Modified |
| **4xx** | Client Error | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| **5xx** | Server Error | 500 Internal Server Error, 503 Service Unavailable |

### Key Concepts for Node.js

In Node.js, the \`http\` module gives you raw access to requests and responses. Frameworks like Express add routing, middleware, and convenience methods on top. In the following lessons, you will build these abstractions yourself.`,
    },
    {
      id: "http-parser",
      slug: "http-parser",
      title: "HTTP Parser",
      content: `## HTTP Request Parser

### Problem Statement

Implement a function that parses a **raw HTTP request string** into a structured object. The parser should extract:

1. The HTTP **method** (GET, POST, etc.)
2. The **path** and **query parameters**
3. **Headers** as key-value pairs
4. The **body** (if present)

### Format

A raw HTTP request looks like:

\`\`\`
POST /api/users?role=admin HTTP/1.1
Content-Type: application/json
Authorization: Bearer token123

{"name":"Alice","age":30}
\`\`\`

- First line: method, path (with optional query string), HTTP version
- Headers: one per line, \`Key: Value\`
- Blank line separates headers from body
- Body: everything after the blank line

### Expected Output

\`\`\`javascript
{
  method: "POST",
  path: "/api/users",
  query: { role: "admin" },
  httpVersion: "HTTP/1.1",
  headers: {
    "content-type": "application/json",
    "authorization": "Bearer token123"
  },
  body: '{"name":"Alice","age":30}'
}
\`\`\``,
      starterCode: `// Parse a raw HTTP request string into a structured object

function parseHTTPRequest(rawRequest) {
  // TODO:
  // 1. Split the request into lines
  // 2. Parse the request line (first line): method, path, query, version
  // 3. Parse headers (lines after request line, until empty line)
  // 4. Parse body (everything after the empty line)
  // 5. Parse query string from the path

  return {
    method: '',
    path: '',
    query: {},
    httpVersion: '',
    headers: {},
    body: ''
  };
}

// Helper: parse query string "key1=val1&key2=val2" into object
function parseQueryString(qs) {
  // TODO: Split on '&', then split each part on '='
  // Handle URL-encoded values with decodeURIComponent
}

// --- Tests ---
const req1 = parseHTTPRequest(
  'GET /api/users?page=1&limit=10 HTTP/1.1\\r\\n' +
  'Host: example.com\\r\\n' +
  'Accept: application/json\\r\\n' +
  '\\r\\n'
);
console.log(req1.method);           // Expected: "GET"
console.log(req1.path);             // Expected: "/api/users"
console.log(req1.query);            // Expected: { page: "1", limit: "10" }
console.log(req1.headers['host']);   // Expected: "example.com"
console.log(req1.body);             // Expected: ""

const req2 = parseHTTPRequest(
  'POST /api/login HTTP/1.1\\r\\n' +
  'Content-Type: application/json\\r\\n' +
  'Content-Length: 39\\r\\n' +
  '\\r\\n' +
  '{"username":"alice","password":"s3cur3"}'
);
console.log(req2.method);           // Expected: "POST"
console.log(req2.path);             // Expected: "/api/login"
console.log(req2.headers['content-type']); // Expected: "application/json"
console.log(req2.body);             // Expected: '{"username":"alice","password":"s3cur3"}'

const req3 = parseHTTPRequest(
  'DELETE /api/users/42 HTTP/1.1\\r\\n' +
  'Authorization: Bearer abc123\\r\\n' +
  '\\r\\n'
);
console.log(req3.method);           // Expected: "DELETE"
console.log(req3.path);             // Expected: "/api/users/42"
console.log(req3.query);            // Expected: {}
`,
      solutionCode: `// Parse a raw HTTP request string into a structured object

function parseHTTPRequest(rawRequest) {
  const lines = rawRequest.split('\\r\\n');

  // 1. Parse request line
  const [requestLine, ...rest] = lines;
  const [method, fullPath, httpVersion] = requestLine.split(' ');

  // 2. Parse path and query string
  const [path, queryString] = fullPath.split('?');
  const query = queryString ? parseQueryString(queryString) : {};

  // 3. Parse headers (until empty line)
  const headers = {};
  let bodyStartIndex = -1;

  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '') {
      bodyStartIndex = i + 1;
      break;
    }
    const colonIndex = rest[i].indexOf(':');
    if (colonIndex !== -1) {
      const key = rest[i].slice(0, colonIndex).trim().toLowerCase();
      const value = rest[i].slice(colonIndex + 1).trim();
      headers[key] = value;
    }
  }

  // 4. Parse body
  const body = bodyStartIndex >= 0
    ? rest.slice(bodyStartIndex).join('\\r\\n').trim()
    : '';

  return { method, path, query, httpVersion, headers, body };
}

function parseQueryString(qs) {
  const params = {};
  if (!qs) return params;
  const pairs = qs.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return params;
}

// --- Tests ---
const req1 = parseHTTPRequest(
  'GET /api/users?page=1&limit=10 HTTP/1.1\\r\\n' +
  'Host: example.com\\r\\n' +
  'Accept: application/json\\r\\n' +
  '\\r\\n'
);
console.log(req1.method);           // Expected: "GET"
console.log(req1.path);             // Expected: "/api/users"
console.log(req1.query);            // Expected: { page: "1", limit: "10" }
console.log(req1.headers['host']);   // Expected: "example.com"
console.log(req1.body);             // Expected: ""

const req2 = parseHTTPRequest(
  'POST /api/login HTTP/1.1\\r\\n' +
  'Content-Type: application/json\\r\\n' +
  'Content-Length: 39\\r\\n' +
  '\\r\\n' +
  '{"username":"alice","password":"s3cur3"}'
);
console.log(req2.method);           // Expected: "POST"
console.log(req2.path);             // Expected: "/api/login"
console.log(req2.headers['content-type']); // Expected: "application/json"
console.log(req2.body);             // Expected: '{"username":"alice","password":"s3cur3"}'

const req3 = parseHTTPRequest(
  'DELETE /api/users/42 HTTP/1.1\\r\\n' +
  'Authorization: Bearer abc123\\r\\n' +
  '\\r\\n'
);
console.log(req3.method);           // Expected: "DELETE"
console.log(req3.path);             // Expected: "/api/users/42"
console.log(req3.query);            // Expected: {}
`,
    },
    {
      id: "http-router",
      slug: "router-implementation",
      title: "Router Implementation",
      content: `## Router Implementation

### Problem Statement

Build a **URL router** that matches incoming request paths to registered handler functions, including support for:

1. **Static routes** — exact path matching (\`/users\`)
2. **Dynamic parameters** — \`:param\` segments (\`/users/:id\`)
3. **HTTP method** matching (GET, POST, PUT, DELETE)
4. Extracting **params** from the matched path

This is what frameworks like Express do under the hood.

### Examples

\`\`\`javascript
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id/posts/:postId', deletePost);

router.match('GET', '/users/42');
// { handler: getUser, params: { id: '42' } }

router.match('DELETE', '/users/5/posts/99');
// { handler: deletePost, params: { id: '5', postId: '99' } }
\`\`\``,
      starterCode: `// Implement a URL Router with dynamic parameters

function createRouter() {
  const routes = [];

  function addRoute(method, path, handler) {
    // TODO: Parse the path into segments
    // Mark segments starting with ':' as parameters
    // Store the route definition
  }

  function match(method, requestPath) {
    // TODO:
    // 1. Split the request path into segments
    // 2. Find a registered route that matches:
    //    - Same HTTP method
    //    - Same number of segments
    //    - Static segments match exactly
    //    - Dynamic segments (:param) match anything
    // 3. Extract parameter values
    // 4. Return { handler, params } or null
  }

  return {
    get: (path, handler) => addRoute('GET', path, handler),
    post: (path, handler) => addRoute('POST', path, handler),
    put: (path, handler) => addRoute('PUT', path, handler),
    delete: (path, handler) => addRoute('DELETE', path, handler),
    match,
  };
}

// --- Tests ---
const router = createRouter();

const listUsers = () => 'list users';
const getUser = () => 'get user';
const createUser = () => 'create user';
const updateUser = () => 'update user';
const deletePost = () => 'delete post';
const getHealth = () => 'health check';

router.get('/health', getHealth);
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id/posts/:postId', deletePost);

const r1 = router.match('GET', '/users');
console.log(r1.handler === listUsers);  // Expected: true
console.log(r1.params);                 // Expected: {}

const r2 = router.match('GET', '/users/42');
console.log(r2.handler === getUser);    // Expected: true
console.log(r2.params);                 // Expected: { id: '42' }

const r3 = router.match('DELETE', '/users/5/posts/99');
console.log(r3.handler === deletePost); // Expected: true
console.log(r3.params);                 // Expected: { id: '5', postId: '99' }

const r4 = router.match('POST', '/users');
console.log(r4.handler === createUser); // Expected: true

const r5 = router.match('GET', '/nonexistent');
console.log(r5);                        // Expected: null

const r6 = router.match('POST', '/users/42');
console.log(r6);                        // Expected: null (no POST /users/:id)
`,
      solutionCode: `// Implement a URL Router with dynamic parameters

function createRouter() {
  const routes = [];

  function addRoute(method, path, handler) {
    const segments = path.split('/').filter(Boolean);
    const pattern = segments.map(seg => {
      if (seg.startsWith(':')) {
        return { type: 'param', name: seg.slice(1) };
      }
      return { type: 'static', value: seg };
    });
    routes.push({ method: method.toUpperCase(), pattern, handler });
  }

  function match(method, requestPath) {
    const segments = requestPath.split('/').filter(Boolean);

    for (const route of routes) {
      if (route.method !== method.toUpperCase()) continue;
      if (route.pattern.length !== segments.length) continue;

      const params = {};
      let matched = true;

      for (let i = 0; i < route.pattern.length; i++) {
        const part = route.pattern[i];
        if (part.type === 'static') {
          if (part.value !== segments[i]) {
            matched = false;
            break;
          }
        } else {
          params[part.name] = segments[i];
        }
      }

      if (matched) {
        return { handler: route.handler, params };
      }
    }

    return null;
  }

  return {
    get: (path, handler) => addRoute('GET', path, handler),
    post: (path, handler) => addRoute('POST', path, handler),
    put: (path, handler) => addRoute('PUT', path, handler),
    delete: (path, handler) => addRoute('DELETE', path, handler),
    match,
  };
}

// --- Tests ---
const router = createRouter();

const listUsers = () => 'list users';
const getUser = () => 'get user';
const createUser = () => 'create user';
const updateUser = () => 'update user';
const deletePost = () => 'delete post';
const getHealth = () => 'health check';

router.get('/health', getHealth);
router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id/posts/:postId', deletePost);

const r1 = router.match('GET', '/users');
console.log(r1.handler === listUsers);  // Expected: true
console.log(r1.params);                 // Expected: {}

const r2 = router.match('GET', '/users/42');
console.log(r2.handler === getUser);    // Expected: true
console.log(r2.params);                 // Expected: { id: '42' }

const r3 = router.match('DELETE', '/users/5/posts/99');
console.log(r3.handler === deletePost); // Expected: true
console.log(r3.params);                 // Expected: { id: '5', postId: '99' }

const r4 = router.match('POST', '/users');
console.log(r4.handler === createUser); // Expected: true

const r5 = router.match('GET', '/nonexistent');
console.log(r5);                        // Expected: null

const r6 = router.match('POST', '/users/42');
console.log(r6);                        // Expected: null (no POST /users/:id)
`,
    },
    {
      id: "http-middleware",
      slug: "middleware-chain",
      title: "Middleware Chain",
      content: `## Express-like Middleware Chain

### Problem Statement

Implement an **Express-style middleware system** where:

1. Middleware functions are executed in order
2. Each middleware receives \`(req, res, next)\`
3. Calling \`next()\` passes control to the next middleware
4. Not calling \`next()\` stops the chain (e.g., for auth failures)
5. \`next(error)\` skips to error-handling middleware

### How Express Middleware Works

\`\`\`
Request → [Logger] → [Auth] → [Validator] → [Handler] → Response
                        ↓ (if no token)
                    403 Forbidden
\`\`\`

Each middleware can:
- **Modify** the request or response objects
- **End** the response (stop the chain)
- **Pass control** to the next middleware via \`next()\`

### Examples

\`\`\`javascript
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

app.use((req, res, next) => {
  if (!req.headers.auth) {
    res.status = 401;
    res.body = 'Unauthorized';
    return; // don't call next — chain stops
  }
  next();
});

app.use((req, res, next) => {
  res.status = 200;
  res.body = 'Success';
});
\`\`\``,
      starterCode: `// Implement an Express-like middleware chain

function createApp() {
  const middlewares = [];
  const errorHandlers = [];

  function use(fn) {
    // TODO: Add middleware or error handler
    // Error handlers have 4 parameters: (err, req, res, next)
    // Regular middleware has 3: (req, res, next)
  }

  function handleRequest(req, res) {
    // TODO:
    // 1. Create a chain of middleware functions
    // 2. Execute them in order, passing next() to each
    // 3. If next(error) is called, skip to error handlers
    // 4. If a middleware doesn't call next(), stop the chain
  }

  return { use, handleRequest };
}

// --- Tests ---
const app = createApp();

// Middleware 1: Logger
app.use((req, res, next) => {
  req.log = [];
  req.log.push('logger');
  next();
});

// Middleware 2: Auth check
app.use((req, res, next) => {
  req.log.push('auth');
  if (!req.headers || !req.headers.authorization) {
    res.statusCode = 401;
    res.body = 'Unauthorized';
    return; // Stop chain
  }
  req.user = { id: 1, name: 'Alice' };
  next();
});

// Middleware 3: Handler
app.use((req, res, next) => {
  req.log.push('handler');
  res.statusCode = 200;
  res.body = JSON.stringify({ user: req.user });
  next();
});

// Error handler
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.body = 'Internal Error: ' + err.message;
});

// Test 1: Authorized request
const res1 = {};
const req1 = { headers: { authorization: 'Bearer token' } };
app.handleRequest(req1, res1);
console.log(res1.statusCode);  // Expected: 200
console.log(req1.log);          // Expected: ['logger', 'auth', 'handler']

// Test 2: Unauthorized request (chain stops at auth)
const res2 = {};
const req2 = { headers: {} };
app.handleRequest(req2, res2);
console.log(res2.statusCode);  // Expected: 401
console.log(res2.body);         // Expected: "Unauthorized"
console.log(req2.log);          // Expected: ['logger', 'auth']
`,
      solutionCode: `// Implement an Express-like middleware chain

function createApp() {
  const middlewares = [];
  const errorHandlers = [];

  function use(fn) {
    if (fn.length === 4) {
      errorHandlers.push(fn);
    } else {
      middlewares.push(fn);
    }
  }

  function handleRequest(req, res) {
    let index = 0;

    function next(err) {
      if (err) {
        // Skip to error handlers
        let errIndex = 0;
        function nextError(err2) {
          if (errIndex >= errorHandlers.length) return;
          const handler = errorHandlers[errIndex++];
          handler(err2 || err, req, res, nextError);
        }
        nextError(err);
        return;
      }

      if (index >= middlewares.length) return;

      const middleware = middlewares[index++];
      try {
        middleware(req, res, next);
      } catch (e) {
        next(e);
      }
    }

    next();
  }

  return { use, handleRequest };
}

// --- Tests ---
const app = createApp();

// Middleware 1: Logger
app.use((req, res, next) => {
  req.log = [];
  req.log.push('logger');
  next();
});

// Middleware 2: Auth check
app.use((req, res, next) => {
  req.log.push('auth');
  if (!req.headers || !req.headers.authorization) {
    res.statusCode = 401;
    res.body = 'Unauthorized';
    return; // Stop chain
  }
  req.user = { id: 1, name: 'Alice' };
  next();
});

// Middleware 3: Handler
app.use((req, res, next) => {
  req.log.push('handler');
  res.statusCode = 200;
  res.body = JSON.stringify({ user: req.user });
  next();
});

// Error handler
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.body = 'Internal Error: ' + err.message;
});

// Test 1: Authorized request
const res1 = {};
const req1 = { headers: { authorization: 'Bearer token' } };
app.handleRequest(req1, res1);
console.log(res1.statusCode);  // Expected: 200
console.log(req1.log);          // Expected: ['logger', 'auth', 'handler']

// Test 2: Unauthorized request (chain stops at auth)
const res2 = {};
const req2 = { headers: {} };
app.handleRequest(req2, res2);
console.log(res2.statusCode);  // Expected: 401
console.log(res2.body);         // Expected: "Unauthorized"
console.log(req2.log);          // Expected: ['logger', 'auth']
`,
    },
  ],
};
