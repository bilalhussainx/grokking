import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "api-fundamentals",
  title: "API Design Fundamentals",
  description: "Master the foundational principles of API design — REST, GraphQL, gRPC, versioning, and authentication patterns that interviewers expect you to know.",
  lessons: [
    {
      id: "intro-api-design-interviews",
      slug: "intro-api-design-interviews",
      title: "Intro to API Design Interviews",
      content: `# Intro to API Design Interviews

API design interviews test your ability to design clean, scalable, and developer-friendly interfaces for complex systems. Unlike system design interviews that focus on backend architecture, API design interviews zoom in on the **contract** between client and server.

## What Interviewers Evaluate

| Dimension | What They Look For |
|---|---|
| **Clarity** | Are your endpoints intuitive and self-documenting? |
| **Completeness** | Did you handle edge cases, errors, pagination? |
| **Consistency** | Do naming conventions and patterns stay uniform? |
| **Scalability** | Will this API work at 10x, 100x scale? |
| **Extensibility** | Can new features be added without breaking changes? |

## The API Design Interview Framework

Every API design problem follows a predictable structure. Use this 5-step framework:

### Step 1: Clarify Requirements
Ask questions to narrow scope. Identify the **actors** (who calls the API), **actions** (what they do), and **data** (what flows through).

### Step 2: Define Resources
Map the domain to REST resources or GraphQL types. Identify the core **nouns** — these become your resources.

### Step 3: Define Endpoints
For each resource, define CRUD operations plus any custom actions. Specify HTTP methods, paths, request bodies, and response shapes.

### Step 4: Deep-Dive on Hard Problems
Pick 2-3 areas that are genuinely complex — pagination, real-time updates, consistency, permissions — and design them thoroughly.

### Step 5: Discuss Trade-offs
No design is perfect. Articulate what you optimized for and what you traded away.

## Example: Quick Resource Identification

Given "Design an API for a bookstore":

\`\`\`
Resources identified:
- Book        → /books
- Author      → /authors
- Category    → /categories
- Review      → /books/{id}/reviews
- Order       → /orders
- Cart        → /users/{id}/cart
\`\`\`

## Common Mistakes

1. **Jumping to endpoints without clarifying requirements** — always ask scope questions first
2. **Designing RPC-style APIs** — use \`POST /orders\` not \`POST /createOrder\`
3. **Ignoring error handling** — every endpoint needs defined error responses
4. **Forgetting pagination** — any list endpoint must be paginated
5. **Over-designing** — solve the stated problem, not every possible future feature

In the following lessons, we will build the vocabulary and patterns you need to ace these interviews.`,
    },
    {
      id: "rest-principles",
      slug: "rest-principles",
      title: "REST Principles & Best Practices",
      content: `# REST Principles & Best Practices

REST (Representational State Transfer) is the dominant paradigm for public APIs. Interviewers expect you to know its constraints and how to apply them practically.

## The 6 REST Constraints

1. **Client-Server** — Separate UI concerns from data storage concerns
2. **Stateless** — Each request contains all information needed to process it
3. **Cacheable** — Responses must define themselves as cacheable or non-cacheable
4. **Uniform Interface** — Consistent resource identification, manipulation through representations, self-descriptive messages, and HATEOAS
5. **Layered System** — Client cannot tell if connected directly to the server or an intermediary
6. **Code on Demand** (optional) — Server can extend client functionality by transferring executable code

## HTTP Methods & Semantics

| Method | Purpose | Idempotent | Safe | Typical Status |
|--------|---------|-----------|------|----------------|
| GET | Read resource(s) | Yes | Yes | 200 |
| POST | Create resource | No | No | 201 |
| PUT | Full replace | Yes | No | 200 |
| PATCH | Partial update | No* | No | 200 |
| DELETE | Remove resource | Yes | No | 204 |

*PATCH can be made idempotent with JSON Merge Patch.

## URL Design Best Practices

\`\`\`
# Good — noun-based, hierarchical
GET    /api/v1/users/{userId}/orders
GET    /api/v1/users/{userId}/orders/{orderId}
POST   /api/v1/users/{userId}/orders

# Bad — verb-based, flat
GET    /api/v1/getUserOrders?userId=123
POST   /api/v1/createOrder
POST   /api/v1/deleteOrder
\`\`\`

### Naming Conventions
- Use **plural nouns** for collections: \`/users\`, \`/products\`
- Use **kebab-case** for multi-word resources: \`/order-items\`
- Nest sub-resources when there is a strong parent-child relationship
- Limit nesting to 2 levels: \`/users/{id}/orders/{orderId}\` — not deeper

## Request & Response Design

\`\`\`http
POST /api/v1/users HTTP/1.1
Content-Type: application/json

{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "role": "editor"
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created
Location: /api/v1/users/usr_abc123
Content-Type: application/json

{
  "id": "usr_abc123",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "role": "editor",
  "created_at": "2025-01-15T10:30:00Z"
}
\`\`\`

## Status Code Categories

| Range | Meaning | Common Codes |
|-------|---------|-------------|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests |
| 5xx | Server Error | 500 Internal, 502 Bad Gateway, 503 Unavailable |

Always return structured error bodies — never just a status code.

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email format is invalid",
    "details": [
      { "field": "email", "issue": "must be a valid email address" }
    ]
  }
}
\`\`\`

These REST fundamentals form the foundation for every API design interview. In the next lesson, we compare REST with GraphQL and gRPC.`,
    },
    {
      id: "graphql-rest-grpc",
      slug: "graphql-rest-grpc",
      title: "GraphQL vs REST vs gRPC",
      content: `# GraphQL vs REST vs gRPC

Interviewers often ask you to justify your API style choice. Understanding the strengths and trade-offs of each paradigm lets you make informed decisions.

## REST — Resource-Oriented

REST models everything as resources with standard HTTP methods. It is the default choice for public-facing APIs.

\`\`\`http
GET /api/v1/users/123
GET /api/v1/users/123/posts?limit=10
GET /api/v1/posts/456/comments?limit=5
\`\`\`

**Strengths:** Caching via HTTP, wide tooling support, easy to understand.
**Weaknesses:** Over-fetching (getting fields you do not need), under-fetching (needing multiple requests), no built-in schema.

## GraphQL — Query-Oriented

GraphQL lets clients request exactly the data they need in a single request.

\`\`\`graphql
query {
  user(id: "123") {
    name
    email
    posts(first: 10) {
      title
      comments(first: 5) {
        body
        author { name }
      }
    }
  }
}
\`\`\`

**Strengths:** No over-fetching, single request for nested data, strong typing with schema, great for mobile clients with bandwidth constraints.
**Weaknesses:** Caching is harder (POST-based), query complexity attacks, steeper learning curve, less HTTP-native.

## gRPC — Procedure-Oriented

gRPC uses Protocol Buffers for high-performance, strongly-typed service definitions. Common for internal microservice communication.

\`\`\`protobuf
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);
  rpc CreateUser (CreateUserRequest) returns (User);
}

message GetUserRequest {
  string user_id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
\`\`\`

**Strengths:** Binary protocol (faster), bi-directional streaming, code generation, strict contracts.
**Weaknesses:** Not browser-native (needs gRPC-Web proxy), not human-readable, poor fit for public APIs.

## Decision Matrix

| Factor | REST | GraphQL | gRPC |
|--------|------|---------|------|
| **Best for** | Public APIs, CRUD | Complex client data needs | Internal microservices |
| **Performance** | Good | Good | Excellent |
| **Caching** | Excellent (HTTP) | Challenging | Custom |
| **Browser support** | Native | Native (via HTTP POST) | Needs proxy |
| **Schema/types** | OpenAPI (optional) | Built-in | Built-in (protobuf) |
| **Learning curve** | Low | Medium | Medium-High |
| **Real-time** | SSE / WebSocket | Subscriptions | Streaming (native) |
| **Tooling** | Mature | Growing | Mature |

## Interview Strategy

When an interviewer asks "Design an API for X," default to **REST** unless you have a specific reason:

- Choose **GraphQL** when: clients need flexible queries, mobile bandwidth matters, deeply nested data
- Choose **gRPC** when: internal service-to-service, low latency critical, streaming required
- Choose **REST** when: public-facing, simplicity matters, broad client support needed

You can also combine them: REST for the public API, gRPC between microservices, GraphQL for a dedicated mobile BFF (Backend-for-Frontend).

## Hybrid Example

\`\`\`
[Mobile App] → GraphQL BFF → gRPC → User Service
                            → gRPC → Order Service
[Web App]   → REST API     → gRPC → User Service
                            → gRPC → Order Service
[Partner]   → REST API (public) → gRPC → internal services
\`\`\`

Always justify your choice by connecting it to the requirements you clarified at the start of the interview.`,
    },
    {
      id: "api-versioning",
      slug: "api-versioning",
      title: "API Versioning Strategies",
      content: `# API Versioning Strategies

APIs evolve. Versioning lets you make breaking changes without disrupting existing consumers. Interviewers want to see that you understand the trade-offs of each approach.

## Why Versioning Matters

Breaking changes include: removing fields, renaming endpoints, changing response structure, altering authentication. Without versioning, every client breaks simultaneously.

## Strategy 1: URL Path Versioning

The most common approach. The version is part of the URL path.

\`\`\`http
GET /api/v1/users/123
GET /api/v2/users/123
\`\`\`

**Pros:** Explicit, easy to understand, easy to route, cacheable.
**Cons:** URL pollution, harder to sunset, can lead to code duplication.

**Used by:** Stripe, Twitter, GitHub (partially).

## Strategy 2: Header Versioning

Version specified in a custom request header.

\`\`\`http
GET /api/users/123
API-Version: 2
\`\`\`

Or using the Accept header with a vendor media type:

\`\`\`http
GET /api/users/123
Accept: application/vnd.myapp.v2+json
\`\`\`

**Pros:** Clean URLs, content negotiation aligned.
**Cons:** Harder to test (can't just change the URL), not visible in browser, caching complexity.

**Used by:** GitHub (Accept header), Microsoft.

## Strategy 3: Query Parameter Versioning

\`\`\`http
GET /api/users/123?version=2
\`\`\`

**Pros:** Easy to add, optional (can default to latest).
**Cons:** Easy to forget, pollutes query string, caching issues.

## Strategy 4: No Explicit Versioning (Evolutionary)

Instead of versioning, evolve the API using additive, non-breaking changes only.

\`\`\`
Rules for non-breaking evolution:
- Add new fields (never remove or rename)
- Add new endpoints (never remove)
- Add new optional query parameters
- New enum values only if clients handle unknown values
\`\`\`

**Pros:** Simpler for consumers, no version management overhead.
**Cons:** Constrains design evolution, eventual field bloat, requires disciplined governance.

**Used by:** Slack, many internal APIs.

## Comparison Table

| Strategy | Visibility | Caching | Routing | Complexity |
|----------|-----------|---------|---------|------------|
| URL path | High | Easy | Easy | Low |
| Header | Low | Hard | Medium | Medium |
| Query param | Medium | Hard | Easy | Low |
| Evolutionary | N/A | Easy | Easy | Governance |

## Interview Recommendation

Default to **URL path versioning** — it is the most widely understood and easiest to discuss. Then mention that you would complement it with an **evolutionary approach** within each version to minimize the need for new versions.

\`\`\`
Deprecation lifecycle:
1. Announce v2, keep v1 running
2. Add Sunset header to v1 responses:
   Sunset: Sat, 01 Mar 2026 00:00:00 GMT
   Deprecation: true
3. Monitor v1 usage, notify consumers
4. After sunset date, return 410 Gone
\`\`\`

\`\`\`http
HTTP/1.1 200 OK
Sunset: Sat, 01 Mar 2026 00:00:00 GMT
Deprecation: true
Link: </api/v2/users>; rel="successor-version"
\`\`\`

## Breaking vs Non-Breaking Changes

| Change Type | Breaking? | Example |
|-------------|-----------|---------|
| Add optional field to response | No | Add \`avatar_url\` to user |
| Add required field to request | Yes | Require \`phone\` on signup |
| Remove field from response | Yes | Remove \`legacy_id\` |
| Rename field | Yes | \`userName\` → \`username\` |
| Change field type | Yes | \`age: string\` → \`age: number\` |
| Add new endpoint | No | Add \`GET /api/v1/analytics\` |
| Remove endpoint | Yes | Remove \`GET /api/v1/legacy\` |

Understanding versioning demonstrates API maturity — interviewers want to see you think about the full lifecycle, not just the initial design.`,
    },
    {
      id: "auth-oauth-jwt",
      slug: "auth-oauth-jwt",
      title: "Authentication & Authorization (OAuth/JWT/API Keys)",
      content: `# Authentication & Authorization (OAuth/JWT/API Keys)

Every API needs security. Interviewers expect you to choose the right auth mechanism for the scenario and explain why.

## Authentication vs Authorization

- **Authentication (AuthN):** "Who are you?" — Verifying identity
- **Authorization (AuthZ):** "What can you do?" — Verifying permissions

## API Keys

The simplest approach. A long random string passed with each request.

\`\`\`http
GET /api/v1/weather?city=london
X-API-Key: sk_live_abc123def456ghi789
\`\`\`

**When to use:** Server-to-server communication, third-party developer access, rate limiting per consumer.
**When NOT to use:** User-facing auth (keys cannot represent individual users), mobile/browser apps (key easily exposed).

**Best practices:**
- Prefix keys for identification: \`sk_live_\` (secret live), \`pk_test_\` (public test)
- Hash keys in storage — never store plaintext
- Support key rotation: allow multiple active keys per consumer

## JWT (JSON Web Tokens)

A self-contained token that carries claims (user info + permissions) and is cryptographically signed.

\`\`\`
Header:    { "alg": "RS256", "typ": "JWT" }
Payload:   { "sub": "usr_123", "role": "admin", "exp": 1700000000 }
Signature: RSASHA256(base64(header) + "." + base64(payload), privateKey)
\`\`\`

\`\`\`http
GET /api/v1/users/me
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Strengths:** Stateless verification (no DB lookup), carries claims, works across services.
**Weaknesses:** Cannot be revoked without a blocklist, payload is readable (not encrypted), token size grows with claims.

### Access + Refresh Token Pattern

\`\`\`
POST /auth/login → { access_token (15min), refresh_token (7d) }
POST /auth/refresh → { new access_token }
POST /auth/logout → revoke refresh_token
\`\`\`

\`\`\`json
{
  "access_token": "eyJhbG...",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "rt_abc123..."
}
\`\`\`

## OAuth 2.0

A delegation protocol — lets users grant third-party apps limited access to their data without sharing passwords.

### Authorization Code Flow (most common for web apps)

\`\`\`
1. App redirects user to authorization server:
   GET /oauth/authorize?
     response_type=code&
     client_id=app_123&
     redirect_uri=https://app.com/callback&
     scope=read:profile write:posts&
     state=random_csrf_token

2. User logs in and consents

3. Auth server redirects back with code:
   GET https://app.com/callback?code=AUTH_CODE&state=random_csrf_token

4. App exchanges code for tokens (server-side):
   POST /oauth/token
   { grant_type: "authorization_code", code: "AUTH_CODE",
     client_id: "app_123", client_secret: "secret" }

5. Auth server returns tokens:
   { access_token: "...", refresh_token: "...", expires_in: 3600 }
\`\`\`

### OAuth Scopes

Scopes define granular permissions:

\`\`\`
read:profile    — Read user profile
write:posts     — Create/edit posts
delete:posts    — Delete posts
admin:users     — Manage other users
\`\`\`

## Choosing the Right Auth Method

| Scenario | Recommended Auth |
|----------|-----------------|
| Third-party developer API | API Keys + OAuth |
| Mobile app user login | OAuth 2.0 + PKCE |
| SPA user login | OAuth 2.0 Authorization Code |
| Microservice-to-microservice | JWT (mutual TLS for high security) |
| Webhook verification | HMAC signature |
| Public read-only API | API Key (for rate limiting) |

## Webhook Signature Verification

\`\`\`http
POST /webhooks/stripe
Stripe-Signature: t=1614556800,v1=abc123hash...
Content-Type: application/json

{ "type": "payment_intent.succeeded", ... }
\`\`\`

\`\`\`
expected_sig = HMAC-SHA256(timestamp + "." + raw_body, webhook_secret)
if expected_sig != received_sig → reject (401)
if timestamp older than 5 min → reject (replay attack)
\`\`\`

In API design interviews, always state your auth choice and justify it based on who the consumers are and what security properties matter most.`,
    },
  ],
};
