import { Module } from "../types";

export const module2: Module = {
  id: "express-advanced",
  title: "Express.js: Advanced Patterns & REST APIs",
  description: "Production Express.js: middleware pipeline, error handling, validation, rate limiting, and API design",
  lessons: [
    {
      id: "express-patterns",
      slug: "express-patterns",
      title: "Express Middleware, Error Handling & REST Patterns",
      content: `
# Production Express.js

## Middleware Pipeline

\`\`\`javascript
const express = require('express');
const app = express();

// Middleware: (req, res, next) => void
// Runs in order — ORDER MATTERS!

// 1. Built-in middleware:
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 2. Third-party middleware:
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

app.use(helmet());            // security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  credentials: true,
}));
app.use(morgan('combined'));  // HTTP logging

// Rate limiting:
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// 3. Custom middleware:
function requestLogger(req, res, next) {
  console.log(\`\${req.method} \${req.path} — \${new Date().toISOString()}\`);
  next(); // must call next() or the request hangs!
}

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Apply selectively:
app.use('/api/public', requestLogger);
app.use('/api/protected', authenticate, requestLogger);
\`\`\`

## Router Modules

\`\`\`javascript
// routes/users.js
const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');

const router = Router();

// Validation middleware:
const validateUser = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('age').optional().isInt({ min: 0, max: 150 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

// RESTful routes:
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const users = await User.findMany({ page, limit, search });
    res.json({ data: users, page, limit });
  } catch (err) {
    next(err); // forward to error handler
  }
});

router.post('/', authenticate, validateUser, async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', param('id').isUUID(), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authenticate, validateUser, async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await User.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// app.js:
app.use('/api/users', require('./routes/users'));
\`\`\`

## Error Handling

\`\`\`javascript
// Custom error class:
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // vs programming errors
  }
}

// Async handler wrapper (avoids try/catch in every route):
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Usage:
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  res.json(user);
}));

// Global error handler (4 params — Express knows it's an error handler):
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Prisma duplicate key error:
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  // Operational errors (expected):
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Programming errors (unexpected):
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler (must be last):
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "How does Express know a function is an error handler?",
      "options": [
        "By registering it with app.error()",
        "By having exactly 4 parameters: (err, req, res, next)",
        "By calling app.use() with a second argument",
        "By naming the function 'errorHandler'"
      ],
      "answer": 1,
      "explanation": "Express identifies error-handling middleware by function arity (number of parameters). An error handler MUST have exactly 4 parameters: (err, req, res, next). Even if you don't use 'next', you must include it so Express recognizes it as an error handler."
    },
    {
      "q": "Why use next(err) instead of throwing in Express route handlers?",
      "options": [
        "next(err) is faster",
        "In async code, throw may not reach Express's error handler — next(err) always routes to the error middleware",
        "throw is not available in Node.js",
        "No reason — they work identically"
      ],
      "answer": 1,
      "explanation": "Synchronous throws inside middleware DO work with Express. But in async callbacks/promises, an unhandled rejection may crash Node.js (or be silently ignored). Always use next(err) or use a wrapper like asyncHandler that catches promise rejections and forwards them."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
