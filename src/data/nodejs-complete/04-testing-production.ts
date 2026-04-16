import { Module } from "../types";

export const module4: Module = {
  id: "testing-production",
  title: "Testing, Security & Production Patterns",
  description: "Jest + Supertest for API testing, Node.js security hardening, logging, and production deployment",
  lessons: [
    {
      id: "testing-security",
      slug: "testing-security",
      title: "Testing APIs & Production Security",
      content: `
# Testing & Production Node.js

## API Testing with Jest + Supertest

\`\`\`javascript
// __tests__/users.test.js
const request = require('supertest');
const app = require('../app');
const { db } = require('../lib/db');

// Setup and teardown:
beforeAll(async () => {
  await db.connect(); // connect test database
});

afterEach(async () => {
  await db.user.deleteMany(); // clean between tests
});

afterAll(async () => {
  await db.disconnect();
});

describe('POST /api/users', () => {
  test('creates a user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'SecurePass1!' })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: 'Alice',
      email: 'alice@example.com',
    });
    expect(response.body.password).toBeUndefined(); // never return password!
  });

  test('returns 422 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Bob', email: 'not-an-email', password: 'SecurePass1!' })
      .expect(422);

    expect(response.body.errors).toBeDefined();
  });

  test('returns 409 for duplicate email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'dup@example.com', password: 'Pass1!' });

    await request(app)
      .post('/api/users')
      .send({ name: 'Alice 2', email: 'dup@example.com', password: 'Pass1!' })
      .expect(409);
  });
});

describe('GET /api/users/:id', () => {
  test('returns 404 for non-existent user', async () => {
    await request(app)
      .get('/api/users/nonexistent-id')
      .expect(404);
  });

  test('requires authentication', async () => {
    await request(app)
      .get('/api/users/some-id')
      .expect(401);
  });

  test('returns user when authenticated', async () => {
    const { body: user } = await request(app).post('/api/users').send({...});
    const { body: { token } } = await request(app).post('/api/auth/login').send({...});

    const response = await request(app)
      .get(\`/api/users/\${user.id}\`)
      .set('Authorization', \`Bearer \${token}\`)
      .expect(200);

    expect(response.body.id).toBe(user.id);
  });
});

// Mock external services:
jest.mock('../lib/email', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({ sent: true }),
}));

const { sendWelcomeEmail } = require('../lib/email');
test('sends welcome email after registration', async () => {
  await request(app).post('/api/users').send({ name: 'Test', email: 'test@test.com', password: 'Pass1!' });
  expect(sendWelcomeEmail).toHaveBeenCalledWith('test@test.com', 'Test');
});
\`\`\`

## Security Hardening

\`\`\`javascript
// Common Node.js security issues and fixes:

// 1. SQL/NoSQL Injection — use parameterized queries:
// ❌ VULNERABLE:
const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);

// ✅ SAFE:
const user = await db.query('SELECT * FROM users WHERE email = \$1', [email]);
// Or use an ORM (Prisma, TypeORM) which handles parameterization

// 2. Password hashing with bcrypt:
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 12; // ~250ms on modern hardware — slow is good for security

async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}
async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

// 3. JWT security:
const jwt = require('jsonwebtoken');

// ❌ INSECURE:
// const token = jwt.sign({ userId }, 'secret'); // short, guessable

// ✅ SECURE:
const ACCESS_TOKEN_EXPIRY = '15m';   // short-lived
const REFRESH_TOKEN_EXPIRY = '7d';   // longer-lived

function createTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'myapp.com',
    audience: 'myapp.com',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return { accessToken, refreshToken };
}

// 4. Avoid exposing stack traces in production:
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.statusCode || 500).json({
    error: err.message,
    ...(isDev && { stack: err.stack }), // stack only in dev!
  });
});

// 5. Input sanitization:
const { escape } = require('validator');
const sanitizedInput = escape(userInput); // escapes HTML entities
\`\`\`

## Production Patterns

\`\`\`javascript
// Structured logging with Pino:
const pino = require('pino');
const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined, // JSON in production for log aggregators
});

// Graceful shutdown:
const server = app.listen(3000);

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  logger.info(\`Received \${signal}. Starting graceful shutdown...\`);

  // Stop accepting new connections:
  server.close(async () => {
    // Finish in-flight requests, then:
    await db.disconnect();
    logger.info('Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 30s:
  setTimeout(() => {
    logger.error('Forced shutdown');
    process.exit(1);
  }, 30_000);
}

// Health check endpoint:
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1'); // verify DB connection
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      memory: process.memoryUsage().heapUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});
\`\`\`

\`\`\`takeaways
["Node.js event loop: timers → I/O callbacks → poll → check (setImmediate) → close; nextTick + Promises drain before each phase", "Use streams for large data — O(chunk_size) memory instead of O(file_size)", "Worker Threads for CPU-bound tasks, Cluster for network scaling across CPU cores", "asyncHandler wrapper eliminates try/catch boilerplate in every route", "Error handlers need exactly 4 params (err, req, res, next) — Express uses arity to detect them", "Supertest + Jest: test your Express app without spinning up a real server", "NEVER return passwords, stack traces, or internal errors in production responses", "Graceful shutdown: close server → finish in-flight requests → disconnect DB → exit"]
\`\`\`
`,
    },
  ],
};
