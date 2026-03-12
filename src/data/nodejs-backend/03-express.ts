import { Module } from "../types";

export const expressModule: Module = {
  id: "express-js",
  title: "Express.js",
  description:
    "Learn Express.js from the ground up: setting up a server, defining routes, using middleware, and handling errors.",
  lessons: [
    {
      id: "express-setup",
      slug: "express-setup",
      title: "Express Setup",
      content: `## Setting Up an Express Server

### What is Express?

**Express** is a minimal, flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It sits on top of Node's built-in \`http\` module and adds:

- Routing
- Middleware support
- Template engine support
- Static file serving

### Basic Server Setup

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

### Key Concepts

| Concept | Description |
|---------|-------------|
| **app** | The Express application instance |
| **req** | The request object (extended from Node's IncomingMessage) |
| **res** | The response object (extended from Node's ServerResponse) |
| **app.listen()** | Binds and listens for connections on the given port |

### Your Task

Implement a function that creates and configures an Express-like application object with \`get\`, \`post\`, \`listen\`, and JSON body parsing.`,
      starterCode: `// Implement a simplified Express-like server setup

function createExpressApp() {
  const routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
  let jsonParsing = false;

  const app = {
    // TODO: Enable JSON body parsing
    useJSON() {
      // Set jsonParsing to true
    },

    // TODO: Register a GET route
    get(path, handler) {
    },

    // TODO: Register a POST route
    post(path, handler) {
    },

    // TODO: Handle an incoming request object
    // This simulates what Express does internally
    handleRequest(req) {
      // 1. Look up the route by method and path
      // 2. If jsonParsing is enabled and body is a string, parse it
      // 3. Create a response object with json() and status() methods
      // 4. Call the handler with (req, res)
      // 5. Return the response object
    }
  };

  return app;
}

// --- Tests ---
const app = createExpressApp();
app.useJSON();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: 12345 });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 1, name, email });
});

app.get('/api/error', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Test 1: GET request
const res1 = app.handleRequest({ method: 'GET', path: '/api/health' });
console.log(res1.statusCode);  // Expected: 200
console.log(res1.body);        // Expected: { status: 'ok', uptime: 12345 }

// Test 2: POST with JSON body
const res2 = app.handleRequest({
  method: 'POST',
  path: '/api/users',
  body: '{"name":"Alice","email":"alice@example.com"}'
});
console.log(res2.statusCode);  // Expected: 201
console.log(res2.body);        // Expected: { id: 1, name: 'Alice', email: 'alice@example.com' }

// Test 3: 404 status
const res3 = app.handleRequest({ method: 'GET', path: '/api/error' });
console.log(res3.statusCode);  // Expected: 404

// Test 4: Unregistered route
const res4 = app.handleRequest({ method: 'GET', path: '/unknown' });
console.log(res4.statusCode);  // Expected: 404
console.log(res4.body);        // Expected: { error: 'Route not found' }
`,
      solutionCode: `// Implement a simplified Express-like server setup

function createExpressApp() {
  const routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
  let jsonParsing = false;

  const app = {
    useJSON() {
      jsonParsing = true;
    },

    get(path, handler) {
      routes.GET[path] = handler;
    },

    post(path, handler) {
      routes.POST[path] = handler;
    },

    handleRequest(req) {
      const { method, path } = req;

      // Parse JSON body if enabled
      if (jsonParsing && typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body);
        } catch (e) {
          req.body = {};
        }
      }

      // Create response object
      const res = {
        statusCode: 200,
        body: null,
        status(code) {
          this.statusCode = code;
          return this; // Enable chaining
        },
        json(data) {
          this.body = data;
          return this;
        }
      };

      // Look up route
      const handler = routes[method] && routes[method][path];
      if (!handler) {
        res.status(404).json({ error: 'Route not found' });
        return res;
      }

      handler(req, res);
      return res;
    }
  };

  return app;
}

// --- Tests ---
const app = createExpressApp();
app.useJSON();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: 12345 });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 1, name, email });
});

app.get('/api/error', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Test 1: GET request
const res1 = app.handleRequest({ method: 'GET', path: '/api/health' });
console.log(res1.statusCode);  // Expected: 200
console.log(res1.body);        // Expected: { status: 'ok', uptime: 12345 }

// Test 2: POST with JSON body
const res2 = app.handleRequest({
  method: 'POST',
  path: '/api/users',
  body: '{"name":"Alice","email":"alice@example.com"}'
});
console.log(res2.statusCode);  // Expected: 201
console.log(res2.body);        // Expected: { id: 1, name: 'Alice', email: 'alice@example.com' }

// Test 3: 404 status
const res3 = app.handleRequest({ method: 'GET', path: '/api/error' });
console.log(res3.statusCode);  // Expected: 404

// Test 4: Unregistered route
const res4 = app.handleRequest({ method: 'GET', path: '/unknown' });
console.log(res4.statusCode);  // Expected: 404
console.log(res4.body);        // Expected: { error: 'Route not found' }
`,
    },
    {
      id: "express-routes",
      slug: "express-routes",
      title: "Express Routes",
      content: `## Express Routing

### Problem Statement

Build a route management system that supports:

1. **Route grouping** with prefixes (like Express Router)
2. **Parameter extraction** from URL paths
3. **Multiple HTTP methods** on the same path
4. **Route listing** for debugging

### Express Router in Practice

\`\`\`javascript
const router = express.Router();

router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);

// Mount with prefix
app.use('/api/v1', router);
// Routes become: /api/v1/users, /api/v1/users/:id
\`\`\`

### Your Task

Implement a Router class that supports route registration, prefix mounting, and request matching with parameter extraction.`,
      starterCode: `// Implement an Express-like Router with grouping and params

function createRouter(prefix = '') {
  const routes = [];
  const subRouters = [];

  function addRoute(method, path, handler) {
    // TODO: Store route with its method, full path (prefix + path), and handler
  }

  function mount(subPrefix, router) {
    // TODO: Mount a sub-router at a given prefix
    // All routes in the sub-router should be prefixed
  }

  function match(method, requestPath) {
    // TODO: Find a matching route
    // 1. Check own routes first
    // 2. Then check sub-routers
    // 3. Support :param extraction
    // Return { handler, params } or null
  }

  function listRoutes() {
    // TODO: Return an array of { method, path } for all registered routes
    // Include sub-router routes
  }

  return {
    get: (path, handler) => addRoute('GET', path, handler),
    post: (path, handler) => addRoute('POST', path, handler),
    put: (path, handler) => addRoute('PUT', path, handler),
    delete: (path, handler) => addRoute('DELETE', path, handler),
    mount,
    match,
    listRoutes,
  };
}

// --- Tests ---
const apiRouter = createRouter();
const usersRouter = createRouter();
const postsRouter = createRouter();

// Users routes
usersRouter.get('/', () => 'list users');
usersRouter.get('/:id', () => 'get user');
usersRouter.post('/', () => 'create user');
usersRouter.put('/:id', () => 'update user');

// Posts routes
postsRouter.get('/', () => 'list posts');
postsRouter.get('/:id', () => 'get post');

// Mount sub-routers
apiRouter.mount('/users', usersRouter);
apiRouter.mount('/posts', postsRouter);

// Test matching
const r1 = apiRouter.match('GET', '/users');
console.log(r1 !== null);              // Expected: true

const r2 = apiRouter.match('GET', '/users/42');
console.log(r2.params);                // Expected: { id: '42' }

const r3 = apiRouter.match('POST', '/users');
console.log(r3 !== null);              // Expected: true

const r4 = apiRouter.match('GET', '/posts/7');
console.log(r4.params);                // Expected: { id: '7' }

const r5 = apiRouter.match('GET', '/unknown');
console.log(r5);                        // Expected: null

// List all routes
const allRoutes = apiRouter.listRoutes();
console.log(allRoutes.length);          // Expected: 6
console.log(allRoutes);
`,
      solutionCode: `// Implement an Express-like Router with grouping and params

function createRouter(prefix = '') {
  const routes = [];
  const subRouters = [];

  function matchPath(pattern, requestPath) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = requestPath.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  function addRoute(method, path, handler) {
    const fullPath = prefix + path;
    routes.push({ method: method.toUpperCase(), path: fullPath, handler });
  }

  function mount(subPrefix, router) {
    subRouters.push({ prefix: prefix + subPrefix, router });
  }

  function match(method, requestPath) {
    // Check own routes
    for (const route of routes) {
      if (route.method !== method.toUpperCase()) continue;
      const params = matchPath(route.path, requestPath);
      if (params !== null) {
        return { handler: route.handler, params };
      }
    }

    // Check sub-routers
    for (const { prefix: subPrefix, router } of subRouters) {
      if (requestPath.startsWith(subPrefix) || requestPath === subPrefix) {
        // Try matching within the sub-router by re-checking its routes
        const subRoutes = router.listRoutes();
        for (const sr of subRoutes) {
          if (sr.method !== method.toUpperCase()) continue;
          const fullPath = subPrefix + sr.path;
          const params = matchPath(fullPath, requestPath);
          if (params !== null) {
            const result = router.match(method, requestPath.slice(subPrefix.length) || '/');
            return result;
          }
        }
      }
    }

    return null;
  }

  function listRoutes() {
    const result = routes.map(r => ({ method: r.method, path: r.path }));
    for (const { prefix: subPrefix, router } of subRouters) {
      const subRoutesList = router.listRoutes();
      for (const sr of subRoutesList) {
        result.push({ method: sr.method, path: subPrefix + sr.path });
      }
    }
    return result;
  }

  return {
    get: (path, handler) => addRoute('GET', path, handler),
    post: (path, handler) => addRoute('POST', path, handler),
    put: (path, handler) => addRoute('PUT', path, handler),
    delete: (path, handler) => addRoute('DELETE', path, handler),
    mount,
    match,
    listRoutes,
  };
}

// --- Tests ---
const apiRouter = createRouter();
const usersRouter = createRouter();
const postsRouter = createRouter();

// Users routes
usersRouter.get('/', () => 'list users');
usersRouter.get('/:id', () => 'get user');
usersRouter.post('/', () => 'create user');
usersRouter.put('/:id', () => 'update user');

// Posts routes
postsRouter.get('/', () => 'list posts');
postsRouter.get('/:id', () => 'get post');

// Mount sub-routers
apiRouter.mount('/users', usersRouter);
apiRouter.mount('/posts', postsRouter);

// Test matching
const r1 = apiRouter.match('GET', '/users');
console.log(r1 !== null);              // Expected: true

const r2 = apiRouter.match('GET', '/users/42');
console.log(r2.params);                // Expected: { id: '42' }

const r3 = apiRouter.match('POST', '/users');
console.log(r3 !== null);              // Expected: true

const r4 = apiRouter.match('GET', '/posts/7');
console.log(r4.params);                // Expected: { id: '7' }

const r5 = apiRouter.match('GET', '/unknown');
console.log(r5);                        // Expected: null

// List all routes
const allRoutes = apiRouter.listRoutes();
console.log(allRoutes.length);          // Expected: 6
console.log(allRoutes);
`,
    },
    {
      id: "express-middleware",
      slug: "express-middleware",
      title: "Middleware Patterns",
      content: `## Common Middleware Patterns

### Problem Statement

Implement several real-world middleware functions that are commonly used in Express applications:

1. **Request Logger** - logs method, path, and response time
2. **CORS Handler** - sets Cross-Origin Resource Sharing headers
3. **Rate Limiter** - limits requests per IP per time window
4. **Body Validator** - validates request body against a schema

### Why Middleware Matters

Middleware is the backbone of Express applications. It allows you to:
- Separate concerns (logging, auth, validation)
- Reuse functionality across routes
- Build a processing pipeline for requests

### Your Task

Build each middleware as a factory function that returns a middleware function \`(req, res, next)\`.`,
      starterCode: `// Implement common Express middleware patterns

// 1. Logger middleware - logs request info and duration
function createLogger() {
  const logs = [];
  // TODO: Return a middleware that:
  // - Records the start time
  // - Calls next()
  // - After next returns, logs: { method, path, statusCode, duration }
  // - Store logs in the logs array
  function middleware(req, res, next) {
  }
  return { middleware, logs };
}

// 2. CORS middleware - sets CORS headers
function createCORS(options = {}) {
  // TODO: Return a middleware that sets these headers on res.headers:
  // - 'Access-Control-Allow-Origin': options.origin || '*'
  // - 'Access-Control-Allow-Methods': options.methods || 'GET,POST,PUT,DELETE'
  // - 'Access-Control-Allow-Headers': options.headers || 'Content-Type,Authorization'
  // If req.method is 'OPTIONS', set statusCode to 204 and don't call next()
  return function(req, res, next) {
  };
}

// 3. Rate limiter middleware
function createRateLimiter(maxRequests, windowMs) {
  // TODO: Return a middleware that:
  // - Tracks requests per IP address (req.ip)
  // - If IP exceeds maxRequests within windowMs, return 429 status
  // - Otherwise, call next()
  const ipCounts = {};
  return function(req, res, next) {
  };
}

// 4. Body validator middleware
function createValidator(schema) {
  // TODO: Return a middleware that:
  // - Checks req.body against the schema object
  // - Schema format: { fieldName: { required: bool, type: string } }
  // - If validation fails, set 400 status with error message
  // - If valid, call next()
  return function(req, res, next) {
  };
}

// --- Tests ---

// Test Logger
const logger = createLogger();
const req1 = { method: 'GET', path: '/api/users' };
const res1 = { statusCode: 200, headers: {} };
logger.middleware(req1, res1, () => { res1.statusCode = 200; });
console.log(logger.logs.length);                // Expected: 1
console.log(logger.logs[0].method);             // Expected: 'GET'
console.log(logger.logs[0].path);               // Expected: '/api/users'
console.log(logger.logs[0].statusCode);         // Expected: 200

// Test CORS
const cors = createCORS({ origin: 'https://myapp.com' });
const req2 = { method: 'GET' };
const res2 = { headers: {} };
cors(req2, res2, () => {});
console.log(res2.headers['Access-Control-Allow-Origin']);  // Expected: 'https://myapp.com'

// Test CORS preflight
const req3 = { method: 'OPTIONS' };
const res3 = { headers: {} };
let nextCalled = false;
cors(req3, res3, () => { nextCalled = true; });
console.log(res3.statusCode);     // Expected: 204
console.log(nextCalled);           // Expected: false

// Test Rate Limiter
const limiter = createRateLimiter(2, 60000);
const reqA = { ip: '1.2.3.4' };
const resA = { headers: {} };
limiter(reqA, resA, () => {});
limiter(reqA, resA, () => {});
limiter(reqA, resA, () => {});     // 3rd request should be blocked
console.log(resA.statusCode);      // Expected: 429

// Test Validator
const validate = createValidator({
  name: { required: true, type: 'string' },
  age: { required: true, type: 'number' },
  email: { required: false, type: 'string' }
});

const req4 = { body: { name: 'Alice', age: 30 } };
const res4 = { headers: {} };
let validPassed = false;
validate(req4, res4, () => { validPassed = true; });
console.log(validPassed);          // Expected: true

const req5 = { body: { name: 'Bob' } };
const res5 = { headers: {} };
let invalidPassed = false;
validate(req5, res5, () => { invalidPassed = true; });
console.log(invalidPassed);        // Expected: false
console.log(res5.statusCode);      // Expected: 400
`,
      solutionCode: `// Implement common Express middleware patterns

// 1. Logger middleware
function createLogger() {
  const logs = [];

  function middleware(req, res, next) {
    const start = Date.now();
    next();
    const duration = Date.now() - start;
    logs.push({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  }

  return { middleware, logs };
}

// 2. CORS middleware
function createCORS(options = {}) {
  return function(req, res, next) {
    res.headers['Access-Control-Allow-Origin'] = options.origin || '*';
    res.headers['Access-Control-Allow-Methods'] = options.methods || 'GET,POST,PUT,DELETE';
    res.headers['Access-Control-Allow-Headers'] = options.headers || 'Content-Type,Authorization';

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return; // Don't call next for preflight
    }
    next();
  };
}

// 3. Rate limiter middleware
function createRateLimiter(maxRequests, windowMs) {
  const ipCounts = {};

  return function(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    if (!ipCounts[ip]) {
      ipCounts[ip] = { count: 0, windowStart: now };
    }

    // Reset window if expired
    if (now - ipCounts[ip].windowStart > windowMs) {
      ipCounts[ip] = { count: 0, windowStart: now };
    }

    ipCounts[ip].count++;

    if (ipCounts[ip].count > maxRequests) {
      res.statusCode = 429;
      res.body = { error: 'Too many requests' };
      return;
    }

    next();
  };
}

// 4. Body validator middleware
function createValidator(schema) {
  return function(req, res, next) {
    const body = req.body || {};
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      if (rules.required && !(field in body)) {
        errors.push(field + ' is required');
        continue;
      }
      if (field in body && rules.type && typeof body[field] !== rules.type) {
        errors.push(field + ' must be of type ' + rules.type);
      }
    }

    if (errors.length > 0) {
      res.statusCode = 400;
      res.body = { errors };
      return;
    }

    next();
  };
}

// --- Tests ---

// Test Logger
const logger = createLogger();
const req1 = { method: 'GET', path: '/api/users' };
const res1 = { statusCode: 200, headers: {} };
logger.middleware(req1, res1, () => { res1.statusCode = 200; });
console.log(logger.logs.length);                // Expected: 1
console.log(logger.logs[0].method);             // Expected: 'GET'
console.log(logger.logs[0].path);               // Expected: '/api/users'
console.log(logger.logs[0].statusCode);         // Expected: 200

// Test CORS
const cors = createCORS({ origin: 'https://myapp.com' });
const req2 = { method: 'GET' };
const res2 = { headers: {} };
cors(req2, res2, () => {});
console.log(res2.headers['Access-Control-Allow-Origin']);  // Expected: 'https://myapp.com'

// Test CORS preflight
const req3 = { method: 'OPTIONS' };
const res3 = { headers: {} };
let nextCalled = false;
cors(req3, res3, () => { nextCalled = true; });
console.log(res3.statusCode);     // Expected: 204
console.log(nextCalled);           // Expected: false

// Test Rate Limiter
const limiter = createRateLimiter(2, 60000);
const reqA = { ip: '1.2.3.4' };
const resA = { headers: {} };
limiter(reqA, resA, () => {});
limiter(reqA, resA, () => {});
limiter(reqA, resA, () => {});     // 3rd request should be blocked
console.log(resA.statusCode);      // Expected: 429

// Test Validator
const validate = createValidator({
  name: { required: true, type: 'string' },
  age: { required: true, type: 'number' },
  email: { required: false, type: 'string' }
});

const req4 = { body: { name: 'Alice', age: 30 } };
const res4 = { headers: {} };
let validPassed = false;
validate(req4, res4, () => { validPassed = true; });
console.log(validPassed);          // Expected: true

const req5 = { body: { name: 'Bob' } };
const res5 = { headers: {} };
let invalidPassed = false;
validate(req5, res5, () => { invalidPassed = true; });
console.log(invalidPassed);        // Expected: false
console.log(res5.statusCode);      // Expected: 400
`,
    },
    {
      id: "express-error-handling",
      slug: "express-error-handling",
      title: "Error Handling",
      content: `## Express Error Handling

### Problem Statement

Implement a robust error handling system for an Express-like application:

1. **Custom Error classes** with status codes and error types
2. **Async error wrapper** to catch promise rejections
3. **Global error handler** middleware that formats errors consistently
4. **Not Found handler** for unmatched routes

### Error Handling in Express

Express error handling middleware has **4 parameters**: \`(err, req, res, next)\`. This is how Express distinguishes error handlers from regular middleware.

\`\`\`
Request -> [Middleware] -> [Route Handler]
                              |
                        throws Error
                              |
                    [Error Handler Middleware]
                              |
                        JSON Response
\`\`\`

### Your Task

Build an error handling pipeline with custom error classes, an async wrapper, and a centralized error handler.`,
      starterCode: `// Implement Express-like error handling

// Custom Error Classes
class AppError {
  constructor(message, statusCode, errorType) {
    // TODO: Store message, statusCode, errorType, and timestamp
  }
}

class NotFoundError extends AppError {
  // TODO: Automatically set statusCode to 404 and errorType to 'NOT_FOUND'
}

class ValidationError extends AppError {
  // TODO: Set statusCode 400, errorType 'VALIDATION_ERROR'
  // Also accept an array of field errors
}

class AuthenticationError extends AppError {
  // TODO: Set statusCode 401, errorType 'AUTH_ERROR'
}

// Async wrapper - catches rejected promises and forwards to error handler
function asyncHandler(fn) {
  // TODO: Return a function (req, res, next) that:
  // - Calls fn(req, res, next)
  // - If fn returns a promise that rejects, call next(error)
  // - If fn throws synchronously, call next(error)
}

// Global error handler middleware
function errorHandler(err, req, res, next) {
  // TODO: Format the error into a consistent JSON response
  // {
  //   status: 'error',
  //   statusCode: err.statusCode || 500,
  //   errorType: err.errorType || 'INTERNAL_ERROR',
  //   message: err.message,
  //   timestamp: err.timestamp || new Date().toISOString()
  // }
}

// Not found handler - for unmatched routes
function notFoundHandler(req, res, next) {
  // TODO: Create a NotFoundError and pass it to next()
}

// --- Tests ---

// Test 1: AppError
const err1 = new AppError('Something went wrong', 500, 'SERVER_ERROR');
console.log(err1.message);       // Expected: 'Something went wrong'
console.log(err1.statusCode);    // Expected: 500
console.log(err1.errorType);     // Expected: 'SERVER_ERROR'

// Test 2: NotFoundError
const err2 = new NotFoundError('User not found');
console.log(err2.statusCode);    // Expected: 404
console.log(err2.errorType);     // Expected: 'NOT_FOUND'

// Test 3: ValidationError with fields
const err3 = new ValidationError('Invalid input', [
  { field: 'email', message: 'Email is required' },
  { field: 'age', message: 'Age must be a number' }
]);
console.log(err3.statusCode);    // Expected: 400
console.log(err3.fields.length); // Expected: 2

// Test 4: AuthenticationError
const err4 = new AuthenticationError('Invalid token');
console.log(err4.statusCode);    // Expected: 401

// Test 5: Error handler output
const res5 = {};
errorHandler(err2, {}, res5, () => {});
console.log(res5.statusCode);    // Expected: 404
console.log(res5.body.status);   // Expected: 'error'
console.log(res5.body.errorType);// Expected: 'NOT_FOUND'

// Test 6: Async handler catches errors
const failingHandler = asyncHandler(async (req, res, next) => {
  throw new ValidationError('Bad data', [{ field: 'name', message: 'Required' }]);
});

const res6 = {};
let caughtError = null;
failingHandler({}, res6, (err) => { caughtError = err; });
// After promise resolves, caughtError should be the ValidationError
setTimeout(() => {
  console.log(caughtError instanceof ValidationError); // Expected: true
  console.log(caughtError.statusCode);                 // Expected: 400
}, 10);
`,
      solutionCode: `// Implement Express-like error handling

// Custom Error Classes
class AppError {
  constructor(message, statusCode, errorType) {
    this.message = message;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.timestamp = new Date().toISOString();
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', fields = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

// Async wrapper
function asyncHandler(fn) {
  return function(req, res, next) {
    try {
      const result = fn(req, res, next);
      if (result && typeof result.catch === 'function') {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

// Global error handler middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorType = err.errorType || 'INTERNAL_ERROR';

  res.statusCode = statusCode;
  res.body = {
    status: 'error',
    statusCode,
    errorType,
    message: err.message,
    timestamp: err.timestamp || new Date().toISOString(),
  };

  if (err.fields) {
    res.body.fields = err.fields;
  }
}

// Not found handler
function notFoundHandler(req, res, next) {
  next(new NotFoundError('Route ' + req.path + ' not found'));
}

// --- Tests ---

// Test 1: AppError
const err1 = new AppError('Something went wrong', 500, 'SERVER_ERROR');
console.log(err1.message);       // Expected: 'Something went wrong'
console.log(err1.statusCode);    // Expected: 500
console.log(err1.errorType);     // Expected: 'SERVER_ERROR'

// Test 2: NotFoundError
const err2 = new NotFoundError('User not found');
console.log(err2.statusCode);    // Expected: 404
console.log(err2.errorType);     // Expected: 'NOT_FOUND'

// Test 3: ValidationError with fields
const err3 = new ValidationError('Invalid input', [
  { field: 'email', message: 'Email is required' },
  { field: 'age', message: 'Age must be a number' }
]);
console.log(err3.statusCode);    // Expected: 400
console.log(err3.fields.length); // Expected: 2

// Test 4: AuthenticationError
const err4 = new AuthenticationError('Invalid token');
console.log(err4.statusCode);    // Expected: 401

// Test 5: Error handler output
const res5 = {};
errorHandler(err2, {}, res5, () => {});
console.log(res5.statusCode);    // Expected: 404
console.log(res5.body.status);   // Expected: 'error'
console.log(res5.body.errorType);// Expected: 'NOT_FOUND'

// Test 6: Async handler catches errors
const failingHandler = asyncHandler(async (req, res, next) => {
  throw new ValidationError('Bad data', [{ field: 'name', message: 'Required' }]);
});

const res6 = {};
let caughtError = null;
failingHandler({}, res6, (err) => { caughtError = err; });
// After promise resolves, caughtError should be the ValidationError
setTimeout(() => {
  console.log(caughtError instanceof ValidationError); // Expected: true
  console.log(caughtError.statusCode);                 // Expected: 400
}, 10);
`,
    },
  ],
};
