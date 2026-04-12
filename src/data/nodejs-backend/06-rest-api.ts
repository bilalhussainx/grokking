import { Module } from "../types";

export const restApiModule: Module = {
  id: "rest-api-design",
  title: "RESTful API Design",
  description: "Design and implement RESTful APIs: resource naming, HTTP methods, status codes, and API versioning.",
  lessons: [
    {
      id: "rest-resource-design",
      slug: "rest-resource-design",
      title: "Resource Design & Naming",
      content: `## RESTful Resource Design

### What is REST?

**REST** (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods and URL patterns to model operations on resources.

### REST Principles

| Principle | Description |
|-----------|-------------|
| **Resources** | Everything is a resource identified by a URL |
| **HTTP Methods** | Use GET, POST, PUT, PATCH, DELETE semantically |
| **Stateless** | Each request contains all needed information |
| **Uniform Interface** | Consistent URL patterns and response formats |

### URL Design Rules

\`\`\`
Good:
  GET    /api/users          - List users
  GET    /api/users/42       - Get user 42
  POST   /api/users          - Create user
  PUT    /api/users/42       - Replace user 42
  PATCH  /api/users/42       - Update user 42
  DELETE /api/users/42       - Delete user 42

  GET    /api/users/42/posts - List user 42's posts

Bad:
  GET    /api/getUsers
  POST   /api/createUser
  GET    /api/deleteUser/42
\`\`\`

### Your Task

Implement a RESTful API handler that enforces proper resource naming, routes requests to the correct handlers, and returns standardized JSON responses with proper status codes.`,
      starterCode: `// Implement a RESTful API handler

function createRESTAPI() {
  const resources = {};

  function registerResource(name, handlers) {
    // TODO: Register a resource with its CRUD handlers
    // handlers: { list, get, create, update, delete }
    // Resource name should be pluralized and lowercase
  }

  function handleRequest(method, path, body = null) {
    // TODO:
    // 1. Parse the path to extract resource name and optional ID
    //    /api/users     -> resource: 'users', id: null
    //    /api/users/42  -> resource: 'users', id: '42'
    // 2. Map HTTP method + ID presence to CRUD operation:
    //    GET    + no ID = list
    //    GET    + ID    = get
    //    POST   + no ID = create
    //    PUT    + ID    = update
    //    DELETE + ID    = delete
    // 3. Return standardized response:
    //    { statusCode, body, headers }
  }

  function createResponse(statusCode, data, meta = {}) {
    // TODO: Create a standardized API response
    // { statusCode, body: { data, meta, timestamp }, headers }
  }

  return { registerResource, handleRequest };
}

// --- Tests ---
const api = createRESTAPI();

// In-memory data store
const users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' },
];
let nextUserId = 3;

api.registerResource('users', {
  list: () => ({ data: users, meta: { total: users.length } }),
  get: (id) => {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return { error: 'User not found', statusCode: 404 };
    return { data: user };
  },
  create: (body) => {
    const user = { id: nextUserId++, ...body };
    users.push(user);
    return { data: user, statusCode: 201 };
  },
  update: (id, body) => {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return { error: 'User not found', statusCode: 404 };
    Object.assign(user, body);
    return { data: user };
  },
  delete: (id) => {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return { error: 'User not found', statusCode: 404 };
    users.splice(index, 1);
    return { data: null, statusCode: 204 };
  }
});

// Test 1: GET /api/users (list)
const r1 = api.handleRequest('GET', '/api/users');
console.log(r1.statusCode);                  // Expected: 200
console.log(r1.body.data.length);             // Expected: 2

// Test 2: GET /api/users/1 (get one)
const r2 = api.handleRequest('GET', '/api/users/1');
console.log(r2.statusCode);                  // Expected: 200
console.log(r2.body.data.name);               // Expected: 'Alice'

// Test 3: POST /api/users (create)
const r3 = api.handleRequest('POST', '/api/users', { name: 'Charlie', email: 'c@test.com' });
console.log(r3.statusCode);                  // Expected: 201
console.log(r3.body.data.name);               // Expected: 'Charlie'

// Test 4: PUT /api/users/1 (update)
const r4 = api.handleRequest('PUT', '/api/users/1', { name: 'Alice Updated' });
console.log(r4.statusCode);                  // Expected: 200
console.log(r4.body.data.name);               // Expected: 'Alice Updated'

// Test 5: DELETE /api/users/2 (delete)
const r5 = api.handleRequest('DELETE', '/api/users/2');
console.log(r5.statusCode);                  // Expected: 204

// Test 6: GET non-existent resource
const r6 = api.handleRequest('GET', '/api/products');
console.log(r6.statusCode);                  // Expected: 404

// Test 7: GET non-existent user
const r7 = api.handleRequest('GET', '/api/users/999');
console.log(r7.statusCode);                  // Expected: 404

// Test 8: Invalid method
const r8 = api.handleRequest('PATCH', '/api/users/1');
console.log(r8.statusCode);                  // Expected: 405
`,
      solutionCode: `// Implement a RESTful API handler

function createRESTAPI() {
  const resources = {};

  function registerResource(name, handlers) {
    resources[name.toLowerCase()] = handlers;
  }

  function handleRequest(method, path, body = null) {
    // Parse path: /api/resourceName/optionalId
    const parts = path.split('/').filter(Boolean);
    // parts: ['api', 'resourceName', 'id?']

    if (parts.length < 2 || parts[0] !== 'api') {
      return createResponse(400, null, { error: 'Invalid API path' });
    }

    const resourceName = parts[1];
    const id = parts[2] || null;

    const resource = resources[resourceName];
    if (!resource) {
      return createResponse(404, null, { error: 'Resource not found' });
    }

    let result;

    switch (method.toUpperCase()) {
      case 'GET':
        if (id) {
          if (!resource.get) return createResponse(405, null, { error: 'Method not allowed' });
          result = resource.get(id);
        } else {
          if (!resource.list) return createResponse(405, null, { error: 'Method not allowed' });
          result = resource.list();
        }
        break;
      case 'POST':
        if (id) return createResponse(405, null, { error: 'Method not allowed' });
        if (!resource.create) return createResponse(405, null, { error: 'Method not allowed' });
        result = resource.create(body);
        break;
      case 'PUT':
        if (!id) return createResponse(405, null, { error: 'Method not allowed' });
        if (!resource.update) return createResponse(405, null, { error: 'Method not allowed' });
        result = resource.update(id, body);
        break;
      case 'DELETE':
        if (!id) return createResponse(405, null, { error: 'Method not allowed' });
        if (!resource.delete) return createResponse(405, null, { error: 'Method not allowed' });
        result = resource.delete(id);
        break;
      default:
        return createResponse(405, null, { error: 'Method not allowed' });
    }

    if (result.error) {
      return createResponse(result.statusCode || 400, null, { error: result.error });
    }

    return createResponse(result.statusCode || 200, result.data, result.meta || {});
  }

  function createResponse(statusCode, data, meta = {}) {
    return {
      statusCode,
      body: {
        data,
        meta,
        timestamp: new Date().toISOString(),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return { registerResource, handleRequest };
}

// --- Tests ---
const api = createRESTAPI();

const users = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' },
];
let nextUserId = 3;

api.registerResource('users', {
  list: () => ({ data: users, meta: { total: users.length } }),
  get: (id) => {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return { error: 'User not found', statusCode: 404 };
    return { data: user };
  },
  create: (body) => {
    const user = { id: nextUserId++, ...body };
    users.push(user);
    return { data: user, statusCode: 201 };
  },
  update: (id, body) => {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return { error: 'User not found', statusCode: 404 };
    Object.assign(user, body);
    return { data: user };
  },
  delete: (id) => {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return { error: 'User not found', statusCode: 404 };
    users.splice(index, 1);
    return { data: null, statusCode: 204 };
  }
});

// Test 1: GET /api/users (list)
const r1 = api.handleRequest('GET', '/api/users');
console.log(r1.statusCode);                  // Expected: 200
console.log(r1.body.data.length);             // Expected: 2

// Test 2: GET /api/users/1 (get one)
const r2 = api.handleRequest('GET', '/api/users/1');
console.log(r2.statusCode);                  // Expected: 200
console.log(r2.body.data.name);               // Expected: 'Alice'

// Test 3: POST /api/users (create)
const r3 = api.handleRequest('POST', '/api/users', { name: 'Charlie', email: 'c@test.com' });
console.log(r3.statusCode);                  // Expected: 201
console.log(r3.body.data.name);               // Expected: 'Charlie'

// Test 4: PUT /api/users/1 (update)
const r4 = api.handleRequest('PUT', '/api/users/1', { name: 'Alice Updated' });
console.log(r4.statusCode);                  // Expected: 200
console.log(r4.body.data.name);               // Expected: 'Alice Updated'

// Test 5: DELETE /api/users/2 (delete)
const r5 = api.handleRequest('DELETE', '/api/users/2');
console.log(r5.statusCode);                  // Expected: 204

// Test 6: GET non-existent resource
const r6 = api.handleRequest('GET', '/api/products');
console.log(r6.statusCode);                  // Expected: 404

// Test 7: GET non-existent user
const r7 = api.handleRequest('GET', '/api/users/999');
console.log(r7.statusCode);                  // Expected: 404

// Test 8: Invalid method
const r8 = api.handleRequest('PATCH', '/api/users/1');
console.log(r8.statusCode);                  // Expected: 405
`,
    },
    {
      id: "rest-pagination-filtering",
      slug: "rest-pagination-filtering",
      title: "Pagination & Filtering",
      content: `## API Pagination & Filtering

### Problem Statement

Implement pagination, filtering, and sorting for a REST API endpoint. Real-world APIs must handle large datasets efficiently.

### Common Pagination Strategies

| Strategy | Format | Pros | Cons |
|----------|--------|------|------|
| **Offset** | \`?page=2&limit=10\` | Simple, allows jumping to any page | Slow on large datasets |
| **Cursor** | \`?cursor=abc123&limit=10\` | Fast, consistent with real-time data | Cannot jump to arbitrary page |
| **Keyset** | \`?after_id=42&limit=10\` | Very fast with indexed columns | Requires sortable unique column |

### Query Parameters

\`\`\`
GET /api/products?page=2&limit=10&sort=price&order=desc&category=electronics&minPrice=100
\`\`\`

### Your Task

Build a query processor that parses pagination, sorting, and filter parameters, then applies them to an in-memory dataset.`,
      starterCode: `// Implement API pagination, sorting, and filtering

function createQueryProcessor(dataset) {
  function process(queryParams) {
    // TODO: Parse and apply query parameters to the dataset
    // Supported params:
    //   page (default: 1), limit (default: 10)
    //   sort (field name), order ('asc' or 'desc', default: 'asc')
    //   Any other param is a filter (e.g., category=electronics)
    //   Prefix with min/max for range filters (e.g., minPrice=100, maxPrice=500)
    //
    // Return:
    // {
    //   data: [...filtered, sorted, paginated results],
    //   pagination: {
    //     page, limit, total, totalPages,
    //     hasNextPage, hasPrevPage
    //   }
    // }
  }

  return { process };
}

// --- Tests ---
const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', rating: 4.5 },
  { id: 2, name: 'Phone', price: 699, category: 'electronics', rating: 4.2 },
  { id: 3, name: 'Desk', price: 299, category: 'furniture', rating: 4.0 },
  { id: 4, name: 'Chair', price: 199, category: 'furniture', rating: 3.8 },
  { id: 5, name: 'Tablet', price: 499, category: 'electronics', rating: 4.1 },
  { id: 6, name: 'Monitor', price: 349, category: 'electronics', rating: 4.3 },
  { id: 7, name: 'Keyboard', price: 79, category: 'electronics', rating: 4.6 },
  { id: 8, name: 'Bookshelf', price: 149, category: 'furniture', rating: 3.9 },
  { id: 9, name: 'Lamp', price: 49, category: 'furniture', rating: 4.0 },
  { id: 10, name: 'Headphones', price: 199, category: 'electronics', rating: 4.4 },
];

const qp = createQueryProcessor(products);

// Test 1: Basic pagination
const r1 = qp.process({ page: '1', limit: '3' });
console.log(r1.data.length);                     // Expected: 3
console.log(r1.pagination.total);                 // Expected: 10
console.log(r1.pagination.totalPages);            // Expected: 4
console.log(r1.pagination.hasNextPage);           // Expected: true
console.log(r1.pagination.hasPrevPage);           // Expected: false

// Test 2: Second page
const r2 = qp.process({ page: '2', limit: '3' });
console.log(r2.data.length);                     // Expected: 3
console.log(r2.pagination.hasPrevPage);           // Expected: true

// Test 3: Filter by category
const r3 = qp.process({ category: 'furniture' });
console.log(r3.pagination.total);                 // Expected: 4

// Test 4: Sort by price descending
const r4 = qp.process({ sort: 'price', order: 'desc', limit: '3' });
console.log(r4.data[0].name);                    // Expected: 'Laptop' (999)
console.log(r4.data[1].name);                    // Expected: 'Phone' (699)

// Test 5: Range filter
const r5 = qp.process({ minPrice: '100', maxPrice: '500' });
console.log(r5.data.every(p => p.price >= 100 && p.price <= 500)); // Expected: true

// Test 6: Combined filter + sort + paginate
const r6 = qp.process({
  category: 'electronics',
  sort: 'price',
  order: 'asc',
  page: '1',
  limit: '3'
});
console.log(r6.data[0].name);                    // Expected: 'Keyboard' (79)
console.log(r6.pagination.total);                 // Expected: 6
`,
      solutionCode: `// Implement API pagination, sorting, and filtering

function createQueryProcessor(dataset) {
  function process(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const sort = queryParams.sort || null;
    const order = queryParams.order || 'asc';

    // Extract filters (everything except pagination/sort params)
    const reserved = ['page', 'limit', 'sort', 'order'];
    const filters = {};
    const rangeFilters = {};

    for (const [key, value] of Object.entries(queryParams)) {
      if (reserved.includes(key)) continue;
      if (key.startsWith('min')) {
        const field = key.charAt(3).toLowerCase() + key.slice(4);
        rangeFilters[field] = rangeFilters[field] || {};
        rangeFilters[field].min = parseFloat(value);
      } else if (key.startsWith('max')) {
        const field = key.charAt(3).toLowerCase() + key.slice(4);
        rangeFilters[field] = rangeFilters[field] || {};
        rangeFilters[field].max = parseFloat(value);
      } else {
        filters[key] = value;
      }
    }

    // Apply filters
    let results = dataset.filter(item => {
      // Equality filters
      for (const [key, value] of Object.entries(filters)) {
        if (String(item[key]) !== String(value)) return false;
      }
      // Range filters
      for (const [field, range] of Object.entries(rangeFilters)) {
        if (range.min !== undefined && item[field] < range.min) return false;
        if (range.max !== undefined && item[field] > range.max) return false;
      }
      return true;
    });

    const total = results.length;

    // Apply sorting
    if (sort) {
      results.sort((a, b) => {
        const aVal = a[sort];
        const bVal = b[sort];
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    results = results.slice(startIndex, startIndex + limit);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  return { process };
}

// --- Tests ---
const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', rating: 4.5 },
  { id: 2, name: 'Phone', price: 699, category: 'electronics', rating: 4.2 },
  { id: 3, name: 'Desk', price: 299, category: 'furniture', rating: 4.0 },
  { id: 4, name: 'Chair', price: 199, category: 'furniture', rating: 3.8 },
  { id: 5, name: 'Tablet', price: 499, category: 'electronics', rating: 4.1 },
  { id: 6, name: 'Monitor', price: 349, category: 'electronics', rating: 4.3 },
  { id: 7, name: 'Keyboard', price: 79, category: 'electronics', rating: 4.6 },
  { id: 8, name: 'Bookshelf', price: 149, category: 'furniture', rating: 3.9 },
  { id: 9, name: 'Lamp', price: 49, category: 'furniture', rating: 4.0 },
  { id: 10, name: 'Headphones', price: 199, category: 'electronics', rating: 4.4 },
];

const qp = createQueryProcessor(products);

// Test 1: Basic pagination
const r1 = qp.process({ page: '1', limit: '3' });
console.log(r1.data.length);                     // Expected: 3
console.log(r1.pagination.total);                 // Expected: 10
console.log(r1.pagination.totalPages);            // Expected: 4
console.log(r1.pagination.hasNextPage);           // Expected: true
console.log(r1.pagination.hasPrevPage);           // Expected: false

// Test 2: Second page
const r2 = qp.process({ page: '2', limit: '3' });
console.log(r2.data.length);                     // Expected: 3
console.log(r2.pagination.hasPrevPage);           // Expected: true

// Test 3: Filter by category
const r3 = qp.process({ category: 'furniture' });
console.log(r3.pagination.total);                 // Expected: 4

// Test 4: Sort by price descending
const r4 = qp.process({ sort: 'price', order: 'desc', limit: '3' });
console.log(r4.data[0].name);                    // Expected: 'Laptop'
console.log(r4.data[1].name);                    // Expected: 'Phone'

// Test 5: Range filter
const r5 = qp.process({ minPrice: '100', maxPrice: '500' });
console.log(r5.data.every(p => p.price >= 100 && p.price <= 500)); // Expected: true

// Test 6: Combined filter + sort + paginate
const r6 = qp.process({
  category: 'electronics',
  sort: 'price',
  order: 'asc',
  page: '1',
  limit: '3'
});
console.log(r6.data[0].name);                    // Expected: 'Keyboard'
console.log(r6.pagination.total);                 // Expected: 6
`,
    },
    {
      id: "rest-api-versioning",
      slug: "rest-api-versioning",
      title: "API Versioning & Error Responses",
      content: `## API Versioning & Standardized Error Responses

### Problem Statement

Implement two critical production API concerns:

1. **API Versioning** - support multiple API versions simultaneously
2. **Standardized Error Responses** - consistent error format across all endpoints

### Versioning Strategies

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **URL Path** | \`/api/v1/users\` | Simple, visible | URL changes |
| **Header** | \`Accept: application/vnd.api.v1+json\` | Clean URLs | Less discoverable |
| **Query** | \`/api/users?version=1\` | Easy to use | Ugly, pollutes params |

### Your Task

Build a versioned API router that routes to different handlers based on the API version, and includes standardized error responses.`,
      starterCode: `// Implement API versioning and standardized error responses

function createVersionedAPI() {
  const versions = {};

  function version(versionNum, setupFn) {
    // TODO: Register a new API version
    // setupFn receives a router-like object for registering routes
  }

  function handleRequest(method, path, body = null, headers = {}) {
    // TODO:
    // 1. Extract version from path (/api/v1/...) or header (API-Version: 1)
    // 2. Find the correct version's routes
    // 3. Execute the handler
    // 4. Return standardized response
    // 5. If version not found, return error
    // 6. If route not found, return error
  }

  function createErrorResponse(statusCode, code, message, details = null) {
    // TODO: Return a standardized error object
    // {
    //   statusCode,
    //   body: {
    //     error: { code, message, details, timestamp }
    //   }
    // }
  }

  return { version, handleRequest };
}

// --- Tests ---
const api = createVersionedAPI();

// V1 API
api.version(1, (router) => {
  router.get('/users', () => ({
    data: [{ id: 1, name: 'Alice' }],
    format: 'v1'
  }));
  router.get('/users/:id', (params) => ({
    data: { id: params.id, name: 'Alice' },
    format: 'v1'
  }));
});

// V2 API (different response shape)
api.version(2, (router) => {
  router.get('/users', () => ({
    data: [{ id: 1, name: 'Alice', email: 'alice@test.com' }],
    format: 'v2',
    meta: { total: 1 }
  }));
  router.get('/users/:id', (params) => ({
    data: { id: params.id, name: 'Alice', email: 'alice@test.com' },
    format: 'v2'
  }));
});

// Test 1: V1 request via URL path
const r1 = api.handleRequest('GET', '/api/v1/users');
console.log(r1.statusCode);          // Expected: 200
console.log(r1.body.format);         // Expected: 'v1'

// Test 2: V2 request via URL path
const r2 = api.handleRequest('GET', '/api/v2/users');
console.log(r2.statusCode);          // Expected: 200
console.log(r2.body.format);         // Expected: 'v2'

// Test 3: V2 with params
const r3 = api.handleRequest('GET', '/api/v2/users/42');
console.log(r3.body.data.id);        // Expected: '42'

// Test 4: Version not found
const r4 = api.handleRequest('GET', '/api/v99/users');
console.log(r4.statusCode);          // Expected: 400
console.log(r4.body.error.code);     // Expected: 'INVALID_VERSION'

// Test 5: Route not found
const r5 = api.handleRequest('GET', '/api/v1/posts');
console.log(r5.statusCode);          // Expected: 404
console.log(r5.body.error.code);     // Expected: 'NOT_FOUND'

// Test 6: Version via header
const r6 = api.handleRequest('GET', '/api/users', null, { 'API-Version': '2' });
console.log(r6.statusCode);          // Expected: 200
console.log(r6.body.format);         // Expected: 'v2'
`,
      solutionCode: `// Implement API versioning and standardized error responses

function createVersionedAPI() {
  const versions = {};

  function version(versionNum, setupFn) {
    const routes = [];

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

    const router = {
      get(path, handler) { routes.push({ method: 'GET', path, handler }); },
      post(path, handler) { routes.push({ method: 'POST', path, handler }); },
      put(path, handler) { routes.push({ method: 'PUT', path, handler }); },
      delete(path, handler) { routes.push({ method: 'DELETE', path, handler }); },
    };

    setupFn(router);
    versions[versionNum] = { routes, matchPath };
  }

  function handleRequest(method, path, body = null, headers = {}) {
    let versionNum = null;
    let routePath = path;

    // Try to extract version from URL path: /api/v1/...
    const pathMatch = path.match(/^/api/v(d+)(/.*)?$/);
    if (pathMatch) {
      versionNum = parseInt(pathMatch[1]);
      routePath = pathMatch[2] || '/';
    } else if (headers['API-Version']) {
      versionNum = parseInt(headers['API-Version']);
      // Remove /api prefix for matching
      routePath = path.replace(/^/api/, '') || '/';
    }

    if (!versionNum) {
      return createErrorResponse(400, 'INVALID_VERSION', 'API version is required');
    }

    const ver = versions[versionNum];
    if (!ver) {
      return createErrorResponse(400, 'INVALID_VERSION', 'API version ' + versionNum + ' does not exist');
    }

    // Find matching route
    for (const route of ver.routes) {
      if (route.method !== method.toUpperCase()) continue;
      const params = ver.matchPath(route.path, routePath);
      if (params !== null) {
        const result = route.handler(params, body);
        return {
          statusCode: result.statusCode || 200,
          body: result,
        };
      }
    }

    return createErrorResponse(404, 'NOT_FOUND', 'Route not found');
  }

  function createErrorResponse(statusCode, code, message, details = null) {
    return {
      statusCode,
      body: {
        error: {
          code,
          message,
          details,
          timestamp: new Date().toISOString(),
        },
      },
    };
  }

  return { version, handleRequest };
}

// --- Tests ---
const api = createVersionedAPI();

// V1 API
api.version(1, (router) => {
  router.get('/users', () => ({
    data: [{ id: 1, name: 'Alice' }],
    format: 'v1'
  }));
  router.get('/users/:id', (params) => ({
    data: { id: params.id, name: 'Alice' },
    format: 'v1'
  }));
});

// V2 API
api.version(2, (router) => {
  router.get('/users', () => ({
    data: [{ id: 1, name: 'Alice', email: 'alice@test.com' }],
    format: 'v2',
    meta: { total: 1 }
  }));
  router.get('/users/:id', (params) => ({
    data: { id: params.id, name: 'Alice', email: 'alice@test.com' },
    format: 'v2'
  }));
});

// Test 1: V1 request
const r1 = api.handleRequest('GET', '/api/v1/users');
console.log(r1.statusCode);          // Expected: 200
console.log(r1.body.format);         // Expected: 'v1'

// Test 2: V2 request
const r2 = api.handleRequest('GET', '/api/v2/users');
console.log(r2.statusCode);          // Expected: 200
console.log(r2.body.format);         // Expected: 'v2'

// Test 3: V2 with params
const r3 = api.handleRequest('GET', '/api/v2/users/42');
console.log(r3.body.data.id);        // Expected: '42'

// Test 4: Version not found
const r4 = api.handleRequest('GET', '/api/v99/users');
console.log(r4.statusCode);          // Expected: 400
console.log(r4.body.error.code);     // Expected: 'INVALID_VERSION'

// Test 5: Route not found
const r5 = api.handleRequest('GET', '/api/v1/posts');
console.log(r5.statusCode);          // Expected: 404
console.log(r5.body.error.code);     // Expected: 'NOT_FOUND'

// Test 6: Version via header
const r6 = api.handleRequest('GET', '/api/users', null, { 'API-Version': '2' });
console.log(r6.statusCode);          // Expected: 200
console.log(r6.body.format);         // Expected: 'v2'
`,
    },
  ],
};
