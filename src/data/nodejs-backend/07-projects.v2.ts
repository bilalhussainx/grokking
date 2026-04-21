import { Module } from "../types";

export const projectsModule: Module = {
  id: "mini-projects",
  title: "Mini Projects",
  description: "Apply everything you have learned to build a rate limiter, a task queue, and a mini Express-like framework from scratch.",
  lessons: [
    {
      id: "project-rate-limiter",
      slug: "project-rate-limiter",
      title: "Build a Rate Limiter",
      content: `## Project: Rate Limiter

### Problem Statement

Build a production-quality **rate limiter** that protects your API from abuse. Your rate limiter should support:

1. **Fixed Window** - count requests in fixed time intervals
2. **Sliding Window** - smooth out burst spikes across window boundaries
3. **Per-key limiting** - different limits for different API keys or IP addresses
4. **Configurable rules** - different limits per endpoint

### Real-World Context

Rate limiting is critical infrastructure. Services like Stripe (100 req/s), GitHub (5000 req/h), and Twitter use sophisticated rate limiters. Without them, a single bad actor can bring down your entire service.

### Rate Limiter Response Headers

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1699999999
\`\`\`

### Your Task

Implement both fixed-window and sliding-window rate limiting algorithms with per-key tracking and proper headers.`,
      starterCode: `// Build a complete rate limiter

function createRateLimiter(options = {}) {
  const {
    windowMs = 60000,      // 1 minute window
    maxRequests = 10,       // max requests per window
    strategy = 'fixed'     // 'fixed' or 'sliding'
  } = options;

  const clients = {};

  function fixedWindowCheck(key, now) {
    // TODO:
    // 1. Get or create client record for this key
    // 2. If current time is past the window, reset the counter
    // 3. Increment counter
    // 4. Return { allowed, remaining, resetTime }
  }

  function slidingWindowCheck(key, now) {
    // TODO:
    // 1. Store individual request timestamps for each key
    // 2. Remove timestamps older than windowMs
    // 3. Check if count exceeds maxRequests
    // 4. Return { allowed, remaining, resetTime }
  }

  function check(key) {
    // TODO: Route to the correct strategy
    // Return: {
    //   allowed: boolean,
    //   remaining: number,
    //   resetTime: number (Unix timestamp),
    //   limit: number,
    //   headers: { 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset' }
    // }
  }

  function middleware(getKey = (req) => req.ip) {
    // TODO: Return Express-like middleware
    // Extract key using getKey function
    // If allowed, set rate limit headers and call next()
    // If blocked, return 429 with Retry-After header
  }

  function reset(key) {
    // TODO: Reset rate limit for a specific key
  }

  return { check, middleware, reset };
}

// --- Tests ---

// Test 1: Fixed window - allows up to max
const fixedLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 3,
  strategy: 'fixed'
});

console.log(fixedLimiter.check('user1').allowed);     // Expected: true
console.log(fixedLimiter.check('user1').remaining);   // Expected: 1
console.log(fixedLimiter.check('user1').allowed);     // Expected: true
console.log(fixedLimiter.check('user1').remaining);   // Expected: 0
console.log(fixedLimiter.check('user1').allowed);     // Expected: false (exceeded)

// Test 2: Different keys are independent
console.log(fixedLimiter.check('user2').allowed);     // Expected: true
console.log(fixedLimiter.check('user2').remaining);   // Expected: 2

// Test 3: Reset works
fixedLimiter.reset('user1');
console.log(fixedLimiter.check('user1').allowed);     // Expected: true

// Test 4: Headers are correct
const result = fixedLimiter.check('user3');
console.log(result.headers['X-RateLimit-Limit']);     // Expected: 3
console.log(typeof result.headers['X-RateLimit-Reset']); // Expected: 'number'

// Test 5: Sliding window
const slidingLimiter = createRateLimiter({
  windowMs: 1000,
  maxRequests: 2,
  strategy: 'sliding'
});

console.log(slidingLimiter.check('ip1').allowed);     // Expected: true
console.log(slidingLimiter.check('ip1').allowed);     // Expected: true
console.log(slidingLimiter.check('ip1').allowed);     // Expected: false

// Test 6: Middleware integration
const limiter = createRateLimiter({ maxRequests: 2, strategy: 'fixed' });
const mw = limiter.middleware((req) => req.ip);
const req1 = { ip: '10.0.0.1' };
const res1 = { headers: {} };
let called1 = false;
mw(req1, res1, () => { called1 = true; });
console.log(called1);                                 // Expected: true

mw(req1, res1, () => {});
mw(req1, res1, () => {});
console.log(res1.statusCode);                         // Expected: 429
`,
      solutionCode: `// Build a complete rate limiter

function createRateLimiter(options = {}) {
  const {
    windowMs = 60000,
    maxRequests = 10,
    strategy = 'fixed'
  } = options;

  const clients = {};

  function fixedWindowCheck(key, now) {
    if (!clients[key]) {
      clients[key] = { count: 0, windowStart: now };
    }

    const client = clients[key];

    // Reset window if expired
    if (now - client.windowStart >= windowMs) {
      client.count = 0;
      client.windowStart = now;
    }

    client.count++;
    const allowed = client.count <= maxRequests;
    const remaining = Math.max(0, maxRequests - client.count);
    const resetTime = Math.ceil((client.windowStart + windowMs) / 1000);

    return { allowed, remaining, resetTime };
  }

  function slidingWindowCheck(key, now) {
    if (!clients[key]) {
      clients[key] = { timestamps: [] };
    }

    const client = clients[key];

    // Remove expired timestamps
    client.timestamps = client.timestamps.filter(t => now - t < windowMs);

    const allowed = client.timestamps.length < maxRequests;

    if (allowed) {
      client.timestamps.push(now);
    }

    const remaining = Math.max(0, maxRequests - client.timestamps.length);
    const oldest = client.timestamps[0] || now;
    const resetTime = Math.ceil((oldest + windowMs) / 1000);

    return { allowed, remaining, resetTime };
  }

  function check(key) {
    const now = Date.now();
    const result = strategy === 'sliding'
      ? slidingWindowCheck(key, now)
      : fixedWindowCheck(key, now);

    return {
      ...result,
      limit: maxRequests,
      headers: {
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.resetTime,
      },
    };
  }

  function middleware(getKey = (req) => req.ip) {
    return function(req, res, next) {
      const key = getKey(req);
      const result = check(key);

      // Set headers
      Object.assign(res.headers || {}, result.headers);
      if (!res.headers) res.headers = result.headers;

      if (!result.allowed) {
        res.statusCode = 429;
        res.body = { error: 'Too Many Requests' };
        res.headers['Retry-After'] = Math.ceil(windowMs / 1000);
        return;
      }

      next();
    };
  }

  function reset(key) {
    delete clients[key];
  }

  return { check, middleware, reset };
}

// --- Tests ---

// Test 1: Fixed window
const fixedLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 3,
  strategy: 'fixed'
});

console.log(fixedLimiter.check('user1').allowed);     // Expected: true
console.log(fixedLimiter.check('user1').remaining);   // Expected: 1
console.log(fixedLimiter.check('user1').allowed);     // Expected: true
console.log(fixedLimiter.check('user1').remaining);   // Expected: 0
console.log(fixedLimiter.check('user1').allowed);     // Expected: false

// Test 2: Different keys independent
console.log(fixedLimiter.check('user2').allowed);     // Expected: true
console.log(fixedLimiter.check('user2').remaining);   // Expected: 2

// Test 3: Reset
fixedLimiter.reset('user1');
console.log(fixedLimiter.check('user1').allowed);     // Expected: true

// Test 4: Headers
const result = fixedLimiter.check('user3');
console.log(result.headers['X-RateLimit-Limit']);     // Expected: 3
console.log(typeof result.headers['X-RateLimit-Reset']); // Expected: 'number'

// Test 5: Sliding window
const slidingLimiter = createRateLimiter({
  windowMs: 1000,
  maxRequests: 2,
  strategy: 'sliding'
});

console.log(slidingLimiter.check('ip1').allowed);     // Expected: true
console.log(slidingLimiter.check('ip1').allowed);     // Expected: true
console.log(slidingLimiter.check('ip1').allowed);     // Expected: false

// Test 6: Middleware
const limiter = createRateLimiter({ maxRequests: 2, strategy: 'fixed' });
const mw = limiter.middleware((req) => req.ip);
const req1 = { ip: '10.0.0.1' };
const res1 = { headers: {} };
let called1 = false;
mw(req1, res1, () => { called1 = true; });
console.log(called1);                                 // Expected: true

mw(req1, res1, () => {});
mw(req1, res1, () => {});
console.log(res1.statusCode);                         // Expected: 429
`,
    },
    {
      id: "project-task-queue",
      slug: "project-task-queue",
      title: "Build a Task Queue",
      content: `## Project: Task Queue

### Problem Statement

Build a **task queue** system that processes jobs asynchronously with:

1. **Priority levels** - urgent jobs run before normal ones
2. **Retry logic** - failed jobs are retried with exponential backoff
3. **Concurrency control** - limit how many jobs run simultaneously
4. **Job lifecycle** - track job states (pending, running, completed, failed)

### Real-World Context

Task queues (like Bull, BullMQ, Celery) power email sending, image processing, report generation, and more. They decouple time-consuming work from the request-response cycle.

### Job States

\`\`\`
PENDING -> RUNNING -> COMPLETED
                  \\-> FAILED -> RETRYING -> RUNNING -> ...
\`\`\`

### Your Task

Implement a complete task queue with priority scheduling, retry logic, and job state management.`,
      starterCode: `// Build a task queue with priority and retry

function createTaskQueue(options = {}) {
  const {
    concurrency = 2,
    maxRetries = 3,
    retryDelay = 100  // base delay in ms
  } = options;

  const jobs = [];
  let running = 0;
  let jobIdCounter = 1;

  function addJob(name, handler, options = {}) {
    // TODO: Create a job with:
    // { id, name, handler, priority (default: 0), maxRetries, attempts: 0,
    //   status: 'pending', result: null, error: null, createdAt }
    // Higher priority number = runs first
    // Return the job object
  }

  function getNextJob() {
    // TODO: Find the highest priority pending job
    // Return it and mark as 'running'
  }

  function processJobs() {
    // TODO:
    // While running < concurrency and there are pending jobs:
    // 1. Get next job
    // 2. Execute its handler
    // 3. On success: mark 'completed', store result
    // 4. On failure: increment attempts
    //    - If attempts < maxRetries: mark 'retrying', re-add after delay
    //    - Else: mark 'failed', store error
    // 5. Decrement running count, try to process more
  }

  function getJob(id) {
    // TODO: Return job by ID
  }

  function getStats() {
    // TODO: Return counts of jobs by status
    // { pending, running, completed, failed, total }
  }

  return { addJob, processJobs, getJob, getStats };
}

// --- Tests ---
const queue = createTaskQueue({ concurrency: 2, maxRetries: 2, retryDelay: 10 });

// Test 1: Add jobs with priorities
const job1 = queue.addJob('email', () => 'sent', { priority: 1 });
const job2 = queue.addJob('report', () => 'generated', { priority: 3 });
const job3 = queue.addJob('log', () => 'logged', { priority: 2 });

console.log(job1.status);                // Expected: 'pending'
console.log(job2.id);                    // Expected: 2

// Test 2: Process jobs
queue.processJobs();

// Allow async processing
setTimeout(() => {
  // High priority jobs should complete first
  console.log(queue.getJob(2).status);   // Expected: 'completed'
  console.log(queue.getJob(2).result);   // Expected: 'generated'

  // Test 3: Stats
  const stats = queue.getStats();
  console.log(stats.completed);          // Expected: 3
  console.log(stats.failed);             // Expected: 0

  // Test 4: Failing job with retries
  let failCount = 0;
  const queue2 = createTaskQueue({ concurrency: 1, maxRetries: 2, retryDelay: 10 });
  queue2.addJob('flaky', () => {
    failCount++;
    if (failCount <= 2) throw new Error('Network error');
    return 'success on retry ' + failCount;
  });

  queue2.processJobs();

  setTimeout(() => {
    const flakyJob = queue2.getJob(1);
    console.log(flakyJob.status);        // Expected: 'completed'
    console.log(flakyJob.result);        // Expected: 'success on retry 3'
    console.log(flakyJob.attempts);      // Expected: 3
  }, 200);

  // Test 5: Job that exceeds max retries
  const queue3 = createTaskQueue({ concurrency: 1, maxRetries: 2, retryDelay: 10 });
  queue3.addJob('always-fail', () => { throw new Error('Fatal'); });
  queue3.processJobs();

  setTimeout(() => {
    const failedJob = queue3.getJob(1);
    console.log(failedJob.status);       // Expected: 'failed'
    console.log(failedJob.attempts);     // Expected: 2
  }, 200);
}, 100);
`,
      solutionCode: `// Build a task queue with priority and retry

function createTaskQueue(options = {}) {
  const {
    concurrency = 2,
    maxRetries = 3,
    retryDelay = 100
  } = options;

  const jobs = [];
  let running = 0;
  let jobIdCounter = 1;

  function addJob(name, handler, opts = {}) {
    const job = {
      id: jobIdCounter++,
      name,
      handler,
      priority: opts.priority || 0,
      maxRetries,
      attempts: 0,
      status: 'pending',
      result: null,
      error: null,
      createdAt: new Date().toISOString(),
    };
    jobs.push(job);
    return job;
  }

  function getNextJob() {
    const pending = jobs
      .filter(j => j.status === 'pending')
      .sort((a, b) => b.priority - a.priority);

    if (pending.length === 0) return null;

    const job = pending[0];
    job.status = 'running';
    return job;
  }

  function processJobs() {
    while (running < concurrency) {
      const job = getNextJob();
      if (!job) break;

      running++;
      executeJob(job);
    }
  }

  function executeJob(job) {
    job.attempts++;

    try {
      const result = job.handler();

      // Handle promise results
      if (result && typeof result.then === 'function') {
        result.then(
          (val) => completeJob(job, val),
          (err) => failJob(job, err)
        );
      } else {
        completeJob(job, result);
      }
    } catch (err) {
      failJob(job, err);
    }
  }

  function completeJob(job, result) {
    job.status = 'completed';
    job.result = result;
    running--;
    processJobs();
  }

  function failJob(job, error) {
    job.error = error.message || String(error);

    if (job.attempts < job.maxRetries) {
      job.status = 'retrying';
      setTimeout(() => {
        job.status = 'pending';
        running--;
        processJobs();
      }, retryDelay * job.attempts);
    } else {
      job.status = 'failed';
      running--;
      processJobs();
    }
  }

  function getJob(id) {
    return jobs.find(j => j.id === id) || null;
  }

  function getStats() {
    const stats = { pending: 0, running: 0, completed: 0, failed: 0, retrying: 0, total: jobs.length };
    for (const job of jobs) {
      if (stats[job.status] !== undefined) stats[job.status]++;
    }
    return stats;
  }

  return { addJob, processJobs, getJob, getStats };
}

// --- Tests ---
const queue = createTaskQueue({ concurrency: 2, maxRetries: 2, retryDelay: 10 });

// Test 1: Add jobs
const job1 = queue.addJob('email', () => 'sent', { priority: 1 });
const job2 = queue.addJob('report', () => 'generated', { priority: 3 });
const job3 = queue.addJob('log', () => 'logged', { priority: 2 });

console.log(job1.status);                // Expected: 'pending'
console.log(job2.id);                    // Expected: 2

// Test 2: Process jobs
queue.processJobs();

setTimeout(() => {
  console.log(queue.getJob(2).status);   // Expected: 'completed'
  console.log(queue.getJob(2).result);   // Expected: 'generated'

  // Test 3: Stats
  const stats = queue.getStats();
  console.log(stats.completed);          // Expected: 3
  console.log(stats.failed);             // Expected: 0

  // Test 4: Failing job with retries
  let failCount = 0;
  const queue2 = createTaskQueue({ concurrency: 1, maxRetries: 2, retryDelay: 10 });
  queue2.addJob('flaky', () => {
    failCount++;
    if (failCount <= 2) throw new Error('Network error');
    return 'success on retry ' + failCount;
  });

  queue2.processJobs();

  setTimeout(() => {
    const flakyJob = queue2.getJob(1);
    console.log(flakyJob.status);        // Expected: 'completed'
    console.log(flakyJob.result);        // Expected: 'success on retry 3'
    console.log(flakyJob.attempts);      // Expected: 3
  }, 200);

  // Test 5: Always-fail job
  const queue3 = createTaskQueue({ concurrency: 1, maxRetries: 2, retryDelay: 10 });
  queue3.addJob('always-fail', () => { throw new Error('Fatal'); });
  queue3.processJobs();

  setTimeout(() => {
    const failedJob = queue3.getJob(1);
    console.log(failedJob.status);       // Expected: 'failed'
    console.log(failedJob.attempts);     // Expected: 2
  }, 200);
}, 100);
`,
    },
    {
      id: "project-mini-express",
      slug: "project-mini-express",
      title: "Build Mini Express",
      content: `## Project: Build Mini Express

### Problem Statement

Bring everything together and build a **mini Express-like framework** that combines:

1. **Routing** with path parameters
2. **Middleware** pipeline
3. **JSON body parsing**
4. **Error handling**
5. **Request/Response helpers**

This is the capstone project that integrates all concepts from the course.

### Architecture

\`\`\`
Request
  -> JSON Body Parser
  -> Logger Middleware
  -> Auth Middleware
  -> Router Match
  -> Route Handler
  -> Error Handler (if error)
  -> Send Response
\`\`\`

### Your Task

Implement a complete mini Express framework with all the features listed above.`,
      starterCode: `// Build a mini Express-like framework

function createMiniExpress() {
  const middlewares = [];
  const routes = [];
  const errorHandlers = [];

  const app = {
    use(fn) {
      // TODO: Add middleware or error handler (4 params = error handler)
    },

    get(path, ...handlers) {
      // TODO: Register a GET route with optional middleware chain
    },

    post(path, ...handlers) {
      // TODO: Register a POST route with optional middleware chain
    },

    put(path, ...handlers) {
      // TODO: Register PUT route
    },

    delete(path, ...handlers) {
      // TODO: Register DELETE route
    },

    handleRequest(rawReq) {
      // TODO:
      // 1. Create enhanced req/res objects
      // 2. Parse JSON body if content-type is json
      // 3. Run global middleware
      // 4. Match route and run route-specific middleware + handler
      // 5. If error occurs, run error handlers
      // 6. Return the response
    }
  };

  // Enhanced response object factory
  function createResponse() {
    // TODO: Create res with:
    // - status(code): set status code, return this
    // - json(data): set body and content-type
    // - send(data): set body as-is
    // - set(header, value): set response header
    // - statusCode (default 200)
    // - headers {}
    // - body: null
  }

  // Route matching with params
  function matchRoute(method, path) {
    // TODO: Find route matching method and path
    // Extract params from :param segments
    // Return { route, params } or null
  }

  return app;
}

// --- Tests ---
const app = createMiniExpress();

// Global middleware: logger
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
  req.duration = Date.now() - req.startTime;
});

// Global middleware: JSON parser
app.use((req, res, next) => {
  if (typeof req.body === 'string') {
    try { req.body = JSON.parse(req.body); } catch(e) {}
  }
  next();
});

// Routes
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

app.get('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Alice' });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ id: 3, ...req.body });
});

app.get('/api/error', (req, res) => {
  throw new Error('Test error');
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Test 1: GET list
const r1 = app.handleRequest({ method: 'GET', path: '/api/users', headers: {} });
console.log(r1.statusCode);          // Expected: 200
console.log(r1.body.length);          // Expected: 2

// Test 2: GET with params
const r2 = app.handleRequest({ method: 'GET', path: '/api/users/42', headers: {} });
console.log(r2.body.id);              // Expected: '42'

// Test 3: POST with body
const r3 = app.handleRequest({
  method: 'POST',
  path: '/api/users',
  headers: { 'content-type': 'application/json' },
  body: '{"name":"Charlie","email":"c@t.com"}'
});
console.log(r3.statusCode);          // Expected: 201
console.log(r3.body.name);            // Expected: 'Charlie'

// Test 4: Error handling
const r4 = app.handleRequest({ method: 'GET', path: '/api/error', headers: {} });
console.log(r4.statusCode);          // Expected: 500
console.log(r4.body.error);           // Expected: 'Test error'

// Test 5: 404 for unmatched route
const r5 = app.handleRequest({ method: 'GET', path: '/api/unknown', headers: {} });
console.log(r5.statusCode);          // Expected: 404
`,
      solutionCode: `// Build a mini Express-like framework

function createMiniExpress() {
  const middlewares = [];
  const routes = [];
  const errorHandlers = [];

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

  function createResponse() {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: null,
      status(code) { this.statusCode = code; return this; },
      json(data) {
        this.headers['Content-Type'] = 'application/json';
        this.body = data;
        return this;
      },
      send(data) { this.body = data; return this; },
      set(header, value) { this.headers[header] = value; return this; },
    };
  }

  const app = {
    use(fn) {
      if (fn.length === 4) {
        errorHandlers.push(fn);
      } else {
        middlewares.push(fn);
      }
    },

    get(path, ...handlers) {
      routes.push({ method: 'GET', path, handlers });
    },

    post(path, ...handlers) {
      routes.push({ method: 'POST', path, handlers });
    },

    put(path, ...handlers) {
      routes.push({ method: 'PUT', path, handlers });
    },

    delete(path, ...handlers) {
      routes.push({ method: 'DELETE', path, handlers });
    },

    handleRequest(rawReq) {
      const req = { ...rawReq, params: {} };
      const res = createResponse();

      // Run middleware chain
      function runMiddlewares(fns, index, callback) {
        if (index >= fns.length) return callback();
        const fn = fns[index];
        try {
          fn(req, res, (err) => {
            if (err) return handleError(err, req, res);
            runMiddlewares(fns, index + 1, callback);
          });
        } catch (err) {
          handleError(err, req, res);
        }
      }

      function handleError(err, req, res) {
        if (errorHandlers.length > 0) {
          for (const handler of errorHandlers) {
            handler(err, req, res, () => {});
          }
        } else {
          res.status(500).json({ error: err.message });
        }
      }

      // Run global middleware, then match route
      runMiddlewares(middlewares, 0, () => {
        // Find matching route
        let matchedRoute = null;
        let params = null;

        for (const route of routes) {
          if (route.method !== req.method) continue;
          const p = matchPath(route.path, req.path);
          if (p !== null) {
            matchedRoute = route;
            params = p;
            break;
          }
        }

        if (!matchedRoute) {
          res.status(404).json({ error: 'Not found' });
          return;
        }

        req.params = params;

        // Run route handlers
        runMiddlewares(matchedRoute.handlers.slice(0, -1), 0, () => {
          const handler = matchedRoute.handlers[matchedRoute.handlers.length - 1];
          try {
            handler(req, res);
          } catch (err) {
            handleError(err, req, res);
          }
        });
      });

      return res;
    }
  };

  return app;
}

// --- Tests ---
const app = createMiniExpress();

// Global middleware: logger
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
  req.duration = Date.now() - req.startTime;
});

// Global middleware: JSON parser
app.use((req, res, next) => {
  if (typeof req.body === 'string') {
    try { req.body = JSON.parse(req.body); } catch(e) {}
  }
  next();
});

// Routes
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

app.get('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Alice' });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ id: 3, ...req.body });
});

app.get('/api/error', (req, res) => {
  throw new Error('Test error');
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Test 1: GET list
const r1 = app.handleRequest({ method: 'GET', path: '/api/users', headers: {} });
console.log(r1.statusCode);          // Expected: 200
console.log(r1.body.length);          // Expected: 2

// Test 2: GET with params
const r2 = app.handleRequest({ method: 'GET', path: '/api/users/42', headers: {} });
console.log(r2.body.id);              // Expected: '42'

// Test 3: POST with body
const r3 = app.handleRequest({
  method: 'POST',
  path: '/api/users',
  headers: { 'content-type': 'application/json' },
  body: '{"name":"Charlie","email":"c@t.com"}'
});
console.log(r3.statusCode);          // Expected: 201
console.log(r3.body.name);            // Expected: 'Charlie'

// Test 4: Error handling
const r4 = app.handleRequest({ method: 'GET', path: '/api/error', headers: {} });
console.log(r4.statusCode);          // Expected: 500
console.log(r4.body.error);           // Expected: 'Test error'

// Test 5: 404
const r5 = app.handleRequest({ method: 'GET', path: '/api/unknown', headers: {} });
console.log(r5.statusCode);          // Expected: 404
`,
    },
  ],
};
