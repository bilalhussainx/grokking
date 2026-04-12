import { Module } from "../types";

export const authModule: Module = {
  id: "authentication",
  title: "Authentication",
  description: "Implement secure authentication: JWT tokens, password hashing with bcrypt, and protected route middleware.",
  lessons: [
    {
      id: "jwt-auth",
      slug: "jwt-auth",
      title: "JSON Web Tokens (JWT)",
      content: `## JSON Web Tokens

### What is JWT?

A **JSON Web Token** is a compact, URL-safe token format used for securely transmitting information between parties. It consists of three parts separated by dots:

\`\`\`
header.payload.signature
\`\`\`

### JWT Structure

| Part | Content | Example |
|------|---------|---------|
| **Header** | Algorithm + token type | \`{"alg":"HS256","typ":"JWT"}\` |
| **Payload** | Claims (user data + metadata) | \`{"userId":1,"role":"admin","exp":1699999}\` |
| **Signature** | HMAC of header + payload | \`HMACSHA256(base64(header) + "." + base64(payload), secret)\` |

### Common Claims

- \`sub\` - Subject (user ID)
- \`iat\` - Issued At (timestamp)
- \`exp\` - Expiration Time
- \`iss\` - Issuer
- \`aud\` - Audience

### Your Task

Implement JWT creation and verification with base64 encoding, HMAC signing, and expiration checking.`,
      starterCode: `// Implement a simplified JWT system

function createJWTService(secret) {
  // Simple hash function (simulates HMAC - NOT for production)
  function simpleHash(data, secret) {
    let hash = 0;
    const combined = data + secret;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  function base64Encode(obj) {
    // TODO: Convert object to JSON, then to hex-encoded string
  }

  function base64Decode(str) {
    // TODO: Decode hex string back to object
  }

  function sign(payload, expiresInSeconds = 3600) {
    // TODO:
    // 1. Create header: { alg: 'HS256', typ: 'JWT' }
    // 2. Add iat and exp to payload
    // 3. Base64 encode header and payload
    // 4. Create signature = simpleHash(encodedHeader + '.' + encodedPayload, secret)
    // 5. Return: encodedHeader.encodedPayload.signature
  }

  function verify(token) {
    // TODO:
    // 1. Split token into 3 parts
    // 2. Recompute signature and compare
    // 3. Check if token is expired
    // 4. Return decoded payload or throw error
  }

  function decode(token) {
    // TODO: Decode payload WITHOUT verifying (for debugging)
  }

  return { sign, verify, decode };
}

// --- Tests ---
const jwt = createJWTService('my-super-secret-key');

// Test 1: Sign a token
const token = jwt.sign({ userId: 42, role: 'admin' }, 3600);
console.log(typeof token === 'string');      // Expected: true
console.log(token.split('.').length);         // Expected: 3

// Test 2: Verify a valid token
const payload = jwt.verify(token);
console.log(payload.userId);                  // Expected: 42
console.log(payload.role);                    // Expected: 'admin'
console.log('iat' in payload);                // Expected: true
console.log('exp' in payload);                // Expected: true

// Test 3: Decode without verify
const decoded = jwt.decode(token);
console.log(decoded.userId);                  // Expected: 42

// Test 4: Reject tampered token
try {
  const parts = token.split('.');
  parts[1] = jwt.sign({ userId: 99, role: 'hacker' }).split('.')[1];
  jwt.verify(parts.join('.'));
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);                    // Expected: 'Invalid signature'
}

// Test 5: Reject expired token
const expiredToken = jwt.sign({ userId: 1 }, -1);
try {
  jwt.verify(expiredToken);
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);                    // Expected: 'Token expired'
}
`,
      solutionCode: `// Implement a simplified JWT system

function createJWTService(secret) {
  function simpleHash(data, secret) {
    let hash = 0;
    const combined = data + secret;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  function base64Encode(obj) {
    const json = JSON.stringify(obj);
    let result = '';
    for (let i = 0; i < json.length; i++) {
      result += json.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result;
  }

  function base64Decode(str) {
    let json = '';
    for (let i = 0; i < str.length; i += 2) {
      json += String.fromCharCode(parseInt(str.slice(i, i + 2), 16));
    }
    return JSON.parse(json);
  }

  function sign(payload, expiresInSeconds = 3600) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = base64Encode(header);
    const encodedPayload = base64Encode(fullPayload);
    const signature = simpleHash(encodedHeader + '.' + encodedPayload, secret);

    return encodedHeader + '.' + encodedPayload + '.' + signature;
  }

  function verify(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = simpleHash(encodedHeader + '.' + encodedPayload, secret);
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const payload = base64Decode(encodedPayload);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    return payload;
  }

  function decode(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    return base64Decode(parts[1]);
  }

  return { sign, verify, decode };
}

// --- Tests ---
const jwt = createJWTService('my-super-secret-key');

// Test 1: Sign a token
const token = jwt.sign({ userId: 42, role: 'admin' }, 3600);
console.log(typeof token === 'string');      // Expected: true
console.log(token.split('.').length);         // Expected: 3

// Test 2: Verify a valid token
const payload = jwt.verify(token);
console.log(payload.userId);                  // Expected: 42
console.log(payload.role);                    // Expected: 'admin'
console.log('iat' in payload);                // Expected: true
console.log('exp' in payload);                // Expected: true

// Test 3: Decode without verify
const decoded = jwt.decode(token);
console.log(decoded.userId);                  // Expected: 42

// Test 4: Reject tampered token
try {
  const parts = token.split('.');
  parts[1] = jwt.sign({ userId: 99, role: 'hacker' }).split('.')[1];
  jwt.verify(parts.join('.'));
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);                    // Expected: 'Invalid signature'
}

// Test 5: Reject expired token
const expiredToken = jwt.sign({ userId: 1 }, -1);
try {
  jwt.verify(expiredToken);
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);                    // Expected: 'Token expired'
}
`,
    },
    {
      id: "bcrypt-hashing",
      slug: "bcrypt-hashing",
      title: "Password Hashing (bcrypt)",
      content: `## Password Hashing with bcrypt

### Why Hash Passwords?

Storing passwords in plain text is a critical security vulnerability. If your database is compromised, every user's password is exposed. **Hashing** converts passwords into irreversible digests.

### How bcrypt Works

1. Generate a random **salt** (random bytes)
2. Combine salt + password
3. Run through a computationally expensive hash function
4. Store the salt + hash together

### bcrypt vs Other Hashing

| Algorithm | Speed | Security | Notes |
|-----------|-------|----------|-------|
| MD5 | Very fast | Weak | Broken, never use for passwords |
| SHA-256 | Fast | Moderate | Too fast for passwords |
| bcrypt | Slow (tunable) | Strong | Designed for passwords, includes salt |
| Argon2 | Slow (tunable) | Strongest | Memory-hard, modern alternative |

### Your Task

Implement a simplified password hashing system with salting, configurable work factors, and secure comparison.`,
      starterCode: `// Implement simplified password hashing (bcrypt-like)

function createHashService(workFactor = 10) {
  // Simple hash function (simulates bcrypt rounds - NOT for production)
  function hashRounds(input, rounds) {
    let hash = input;
    for (let r = 0; r < rounds; r++) {
      let h = 0;
      for (let i = 0; i < hash.length; i++) {
        h = ((h << 5) - h) + hash.charCodeAt(i);
        h = h & h;
      }
      hash = Math.abs(h).toString(36);
    }
    return hash;
  }

  function generateSalt(length = 16) {
    // TODO: Generate a random string of given length
  }

  function hash(password) {
    // TODO:
    // 1. Generate a random salt
    // 2. Combine salt + password
    // 3. Hash with workFactor rounds
    // 4. Return formatted string: "$2b$<workFactor>$<salt>$<hash>"
  }

  function compare(password, storedHash) {
    // TODO:
    // 1. Parse the stored hash to extract workFactor, salt, and hash
    // 2. Hash the input password with the same salt and work factor
    // 3. Compare using constant-time comparison
  }

  function constantTimeCompare(a, b) {
    // TODO: Compare strings in constant time (prevent timing attacks)
  }

  return { hash, compare, generateSalt };
}

// --- Tests ---
const hasher = createHashService(10);

// Test 1: Hash a password
const hashed = hasher.hash('myPassword123');
console.log(typeof hashed === 'string');       // Expected: true
console.log(hashed.startsWith('$2b$'));        // Expected: true
console.log(hashed.split('$').length);         // Expected: 5

// Test 2: Same password produces different hashes (random salt)
const hashed2 = hasher.hash('myPassword123');
console.log(hashed !== hashed2);               // Expected: true

// Test 3: Verify correct password
console.log(hasher.compare('myPassword123', hashed));   // Expected: true

// Test 4: Reject wrong password
console.log(hasher.compare('wrongPassword', hashed));    // Expected: false

// Test 5: Verify against second hash
console.log(hasher.compare('myPassword123', hashed2));   // Expected: true

// Test 6: Different work factors
const weakHasher = createHashService(4);
const weakHash = weakHasher.hash('test');
console.log(weakHasher.compare('test', weakHash));       // Expected: true
console.log(weakHash.includes('$4$'));                   // Expected: true
`,
      solutionCode: `// Implement simplified password hashing (bcrypt-like)

function createHashService(workFactor = 10) {
  function hashRounds(input, rounds) {
    let hash = input;
    for (let r = 0; r < rounds; r++) {
      let h = 0;
      for (let i = 0; i < hash.length; i++) {
        h = ((h << 5) - h) + hash.charCodeAt(i);
        h = h & h;
      }
      hash = Math.abs(h).toString(36);
    }
    return hash;
  }

  function generateSalt(length = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let salt = '';
    for (let i = 0; i < length; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
  }

  function hash(password) {
    const salt = generateSalt();
    const combined = salt + password;
    const hashed = hashRounds(combined, workFactor);
    return '$2b$' + workFactor + '$' + salt + '$' + hashed;
  }

  function compare(password, storedHash) {
    const parts = storedHash.split('$');
    const storedWorkFactor = parseInt(parts[2], 10);
    const salt = parts[3];
    const storedHashValue = parts[4];

    const combined = salt + password;
    const computedHash = hashRounds(combined, storedWorkFactor);

    return constantTimeCompare(computedHash, storedHashValue);
  }

  function constantTimeCompare(a, b) {
    if (a.length !== b.length) {
      let result = 1;
      const maxLen = Math.max(a.length, b.length);
      for (let i = 0; i < maxLen; i++) {
        const ca = i < a.length ? a.charCodeAt(i) : 0;
        const cb = i < b.length ? b.charCodeAt(i) : 0;
        result |= ca ^ cb;
      }
      return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  return { hash, compare, generateSalt };
}

// --- Tests ---
const hasher = createHashService(10);

// Test 1: Hash a password
const hashed = hasher.hash('myPassword123');
console.log(typeof hashed === 'string');       // Expected: true
console.log(hashed.startsWith('$2b$'));        // Expected: true
console.log(hashed.split('$').length);         // Expected: 5

// Test 2: Same password produces different hashes
const hashed2 = hasher.hash('myPassword123');
console.log(hashed !== hashed2);               // Expected: true

// Test 3: Verify correct password
console.log(hasher.compare('myPassword123', hashed));   // Expected: true

// Test 4: Reject wrong password
console.log(hasher.compare('wrongPassword', hashed));    // Expected: false

// Test 5: Verify against second hash
console.log(hasher.compare('myPassword123', hashed2));   // Expected: true

// Test 6: Different work factors
const weakHasher = createHashService(4);
const weakHash = weakHasher.hash('test');
console.log(weakHasher.compare('test', weakHash));       // Expected: true
console.log(weakHash.includes('$4$'));                   // Expected: true
`,
    },
    {
      id: "protected-routes",
      slug: "protected-routes",
      title: "Protected Routes",
      content: `## Protected Routes & Authorization

### Problem Statement

Build a complete authentication flow combining JWT and password hashing:

1. **User registration** - hash password, store user
2. **User login** - verify password, issue JWT
3. **Auth middleware** - verify JWT on protected routes
4. **Role-based access control** - restrict routes by user role

### Authentication Flow

\`\`\`
Register: password -> hash -> store user
Login:    password -> compare with hash -> issue JWT
Request:  JWT in header -> verify -> extract user -> check role
\`\`\`

### Your Task

Build a mini auth system that ties together user storage, password hashing, JWT tokens, and route protection middleware.`,
      starterCode: `// Implement a complete authentication system

function createAuthSystem(jwtSecret) {
  const users = [];
  let nextId = 1;

  function simpleHash(input) {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = ((h << 5) - h) + input.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h).toString(36);
  }

  function register(username, password, role = 'user') {
    // TODO:
    // 1. Check if username already exists
    // 2. Hash the password
    // 3. Store user with { id, username, passwordHash, role }
    // 4. Return { id, username, role } (never return the hash)
  }

  function login(username, password) {
    // TODO:
    // 1. Find user by username
    // 2. Compare password hash
    // 3. If valid, generate JWT with { userId, username, role }
    // 4. Return { token, user: { id, username, role } }
    // 5. If invalid, throw error
  }

  function authMiddleware(req, res, next) {
    // TODO:
    // 1. Extract token from req.headers.authorization ("Bearer <token>")
    // 2. Verify the JWT
    // 3. Attach decoded payload to req.user
    // 4. Call next() if valid
    // 5. Set 401 status if invalid or missing
  }

  function requireRole(...roles) {
    // TODO: Return middleware that checks req.user.role
    // If not in roles, set 403 status
  }

  return { register, login, authMiddleware, requireRole };
}

// --- Tests ---
const auth = createAuthSystem('test-secret-key-123');

// Test 1: Register
const user1 = auth.register('alice', 'password123', 'admin');
console.log(user1.username);          // Expected: 'alice'
console.log(user1.role);              // Expected: 'admin'
console.log('passwordHash' in user1); // Expected: false

// Test 2: Duplicate registration
try {
  auth.register('alice', 'other', 'user');
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);             // Expected: 'Username already exists'
}

// Test 3: Login success
const loginResult = auth.login('alice', 'password123');
console.log(loginResult.user.username);  // Expected: 'alice'
console.log(typeof loginResult.token);   // Expected: 'string'

// Test 4: Login failure
try {
  auth.login('alice', 'wrongpassword');
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);             // Expected: 'Invalid credentials'
}

// Test 5: Auth middleware - valid
const req5 = { headers: { authorization: 'Bearer ' + loginResult.token } };
const res5 = {};
let next5Called = false;
auth.authMiddleware(req5, res5, () => { next5Called = true; });
console.log(next5Called);              // Expected: true
console.log(req5.user.username);       // Expected: 'alice'

// Test 6: Auth middleware - missing token
const req6 = { headers: {} };
const res6 = {};
let next6Called = false;
auth.authMiddleware(req6, res6, () => { next6Called = true; });
console.log(next6Called);              // Expected: false
console.log(res6.statusCode);         // Expected: 401

// Test 7: Role check - pass
const adminOnly = auth.requireRole('admin');
const req7 = { user: { role: 'admin' } };
const res7 = {};
let next7Called = false;
adminOnly(req7, res7, () => { next7Called = true; });
console.log(next7Called);              // Expected: true

// Test 8: Role check - fail
const req8 = { user: { role: 'user' } };
const res8 = {};
let next8Called = false;
adminOnly(req8, res8, () => { next8Called = true; });
console.log(next8Called);              // Expected: false
console.log(res8.statusCode);         // Expected: 403
`,
      solutionCode: `// Implement a complete authentication system

function createAuthSystem(jwtSecret) {
  const users = [];
  let nextId = 1;

  function simpleHash(input) {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = ((h << 5) - h) + input.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h).toString(36);
  }

  function createToken(payload) {
    const header = simpleHash('header' + jwtSecret);
    const data = JSON.stringify(payload);
    const encodedData = data.split('').map(c =>
      c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join('');
    const signature = simpleHash(header + '.' + encodedData + jwtSecret);
    return header + '.' + encodedData + '.' + signature;
  }

  function verifyToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    const [h, encodedData, sig] = parts;
    const expectedSig = simpleHash(h + '.' + encodedData + jwtSecret);
    if (sig !== expectedSig) throw new Error('Invalid signature');
    let json = '';
    for (let i = 0; i < encodedData.length; i += 2) {
      json += String.fromCharCode(parseInt(encodedData.slice(i, i + 2), 16));
    }
    return JSON.parse(json);
  }

  function register(username, password, role = 'user') {
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    const passwordHash = simpleHash(password);
    const user = { id: nextId++, username, passwordHash, role };
    users.push(user);
    return { id: user.id, username: user.username, role: user.role };
  }

  function login(username, password) {
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('Invalid credentials');

    const passwordHash = simpleHash(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const token = createToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    return {
      token,
      user: { id: user.id, username: user.username, role: user.role }
    };
  }

  function authMiddleware(req, res, next) {
    const authHeader = req.headers && req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.statusCode = 401;
      res.body = 'No token provided';
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyToken(token);
      next();
    } catch (e) {
      res.statusCode = 401;
      res.body = 'Invalid token';
    }
  }

  function requireRole(...roles) {
    return function(req, res, next) {
      if (!req.user || !roles.includes(req.user.role)) {
        res.statusCode = 403;
        res.body = 'Forbidden';
        return;
      }
      next();
    };
  }

  return { register, login, authMiddleware, requireRole };
}

// --- Tests ---
const auth = createAuthSystem('test-secret-key-123');

// Test 1: Register
const user1 = auth.register('alice', 'password123', 'admin');
console.log(user1.username);          // Expected: 'alice'
console.log(user1.role);              // Expected: 'admin'
console.log('passwordHash' in user1); // Expected: false

// Test 2: Duplicate registration
try {
  auth.register('alice', 'other', 'user');
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);             // Expected: 'Username already exists'
}

// Test 3: Login success
const loginResult = auth.login('alice', 'password123');
console.log(loginResult.user.username);  // Expected: 'alice'
console.log(typeof loginResult.token);   // Expected: 'string'

// Test 4: Login failure
try {
  auth.login('alice', 'wrongpassword');
  console.log('Should not reach here');
} catch (e) {
  console.log(e.message);             // Expected: 'Invalid credentials'
}

// Test 5: Auth middleware - valid
const req5 = { headers: { authorization: 'Bearer ' + loginResult.token } };
const res5 = {};
let next5Called = false;
auth.authMiddleware(req5, res5, () => { next5Called = true; });
console.log(next5Called);              // Expected: true
console.log(req5.user.username);       // Expected: 'alice'

// Test 6: Auth middleware - missing token
const req6 = { headers: {} };
const res6 = {};
let next6Called = false;
auth.authMiddleware(req6, res6, () => { next6Called = true; });
console.log(next6Called);              // Expected: false
console.log(res6.statusCode);         // Expected: 401

// Test 7: Role check - pass
const adminOnly = auth.requireRole('admin');
const req7 = { user: { role: 'admin' } };
const res7 = {};
let next7Called = false;
adminOnly(req7, res7, () => { next7Called = true; });
console.log(next7Called);              // Expected: true

// Test 8: Role check - fail
const req8 = { user: { role: 'user' } };
const res8 = {};
let next8Called = false;
adminOnly(req8, res8, () => { next8Called = true; });
console.log(next8Called);              // Expected: false
console.log(res8.statusCode);         // Expected: 403
`,
    },
  ],
};
