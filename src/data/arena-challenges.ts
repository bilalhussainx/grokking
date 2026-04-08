import type { Milestone } from '@/lib/arena-milestones';

export interface ArenaChallenge {
  id: string;
  title: string;
  type: 'micro' | 'feature';
  track: 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'ml-engineer';
  durationMin: number;
  briefMd: string;
  starterRepo?: string;
  testFile?: string;
  milestones: Milestone[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  personaId: string;      // default interviewer for this challenge
}

export const ARENA_CHALLENGES: ArenaChallenge[] = [
  {
    id: 'rate-limiter-api',
    title: 'Build a Rate Limiter API',
    type: 'micro',
    track: 'backend',
    durationMin: 45,
    difficulty: 'medium',
    tags: ['redis', 'middleware', 'distributed-systems'],
    personaId: 'alex-chen',
    briefMd: `# Rate Limiter API

## Objective
Build an Express.js API with token-bucket rate limiting middleware.

## Requirements
1. \`POST /api/message\` — accepts \`{ userId, text }\`, returns \`{ ok: true }\`
2. Rate limit: **10 requests per minute per userId**
3. On limit exceeded: return \`429 Too Many Requests\` with \`{ error: "rate limited", retryAfter: <seconds> }\`
4. Rate limit state must survive server restarts (use Redis or an in-memory store that would swap to Redis in prod)
5. Endpoint \`GET /api/rate-limit-status?userId=\` shows current bucket state

## Test Suite
Run \`npm test\` to validate. Tests cover:
- Normal requests pass through
- 11th request in 60s returns 429
- \`retryAfter\` is a positive integer
- Different userIds have independent buckets

## Bonus
- Add a \`X-RateLimit-Remaining\` header to every response
- Sliding window instead of fixed window
`,
    testFile: 'tests/rate-limiter.test.js',
    milestones: [
      { id: 'express-running', title: 'Express server starts', detector: 'commit_contains', target: 'express', xp: 25 },
      { id: 'endpoint-exists', title: 'POST /api/message exists', detector: 'test_passes', target: 'POST /api/message', xp: 50 },
      { id: 'rate-limit-works', title: 'Rate limit fires at 11th request', detector: 'test_passes', target: '429', xp: 100 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener with Analytics',
    type: 'micro',
    track: 'backend',
    durationMin: 60,
    difficulty: 'medium',
    tags: ['hashing', 'db-schema', 'caching'],
    personaId: 'alex-chen',
    briefMd: `# URL Shortener with Click Analytics

## Objective
Build a URL shortener with click tracking.

## Requirements
1. \`POST /shorten\` — accepts \`{ url }\`, returns \`{ shortCode, shortUrl }\`
2. \`GET /:shortCode\` — redirects to original URL (301)
3. \`GET /analytics/:shortCode\` — returns \`{ clicks, uniqueIps, lastClicked }\`
4. Short codes: 6-character alphanumeric, collision-safe
5. Store in SQLite or an in-memory store

## Test Suite
Run \`npm test\` to validate.

## Bonus
- Expiry: accept \`expiresIn\` (seconds) in POST, return 410 after expiry
- Custom alias: accept \`alias\` field in POST
`,
    testFile: 'tests/url-shortener.test.js',
    milestones: [
      { id: 'shorten-works', title: 'POST /shorten returns shortCode', detector: 'test_passes', target: 'shortCode', xp: 50 },
      { id: 'redirect-works', title: 'Redirect works', detector: 'test_passes', target: '301', xp: 75 },
      { id: 'analytics-works', title: 'Analytics endpoint works', detector: 'test_passes', target: 'clicks', xp: 75 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },
  {
    id: 'auth-service',
    title: 'JWT Auth Microservice',
    type: 'micro',
    track: 'backend',
    durationMin: 45,
    difficulty: 'medium',
    tags: ['jwt', 'security', 'bcrypt'],
    personaId: 'alex-chen',
    briefMd: `# JWT Authentication Microservice

## Objective
Build a stateless JWT auth service.

## Requirements
1. \`POST /auth/register\` — \`{ email, password }\`, hashes password with bcrypt (rounds=12), stores user
2. \`POST /auth/login\` — validates credentials, returns \`{ accessToken, refreshToken }\`
3. \`POST /auth/refresh\` — accepts refresh token, returns new access token
4. \`GET /auth/me\` — protected route, returns user profile from JWT
5. Access token: 15-minute expiry. Refresh token: 7-day expiry.

## Test Suite
Run \`npm test\`

## Bonus
- \`POST /auth/logout\` — invalidates refresh token (token blacklist)
- Rate limit login to 5 attempts per minute per IP
`,
    testFile: 'tests/auth.test.js',
    milestones: [
      { id: 'register-works', title: 'Register endpoint works', detector: 'test_passes', target: 'register', xp: 50 },
      { id: 'login-works', title: 'Login returns JWT', detector: 'test_passes', target: 'accessToken', xp: 75 },
      { id: 'protected-route', title: 'Protected route validates JWT', detector: 'test_passes', target: '/auth/me', xp: 75 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },

  // ─── DATA SCIENCE CHALLENGE ──────────────────────────────────────────────
  {
    id: 'churn-prediction',
    title: 'Subscriber Churn Prediction (XGBoost)',
    type: 'feature',
    track: 'data-science',
    durationMin: 90,
    difficulty: 'medium',
    tags: ['xgboost', 'feature-engineering', 'model-evaluation', 'pandas'],
    personaId: 'dr-priya-sharma',
    briefMd: `# Subscriber Churn Prediction

## Objective
Build a churn prediction model using the provided telecom dataset.

## Dataset
\`/workspace/data/churn.csv\` — 7,043 rows, 21 features (tenure, MonthlyCharges, TotalCharges, Contract type, etc.), binary label \`Churn\`.

## Requirements
1. **EDA** — Distribution of churn label, correlation heatmap, missing value handling
2. **Feature Engineering** — Encode categoricals, scale numerics, handle \`TotalCharges\` empty strings
3. **Model** — XGBoost classifier (or sklearn GradientBoostingClassifier)
4. **Evaluation** — AUC-ROC ≥ 0.85, Precision-Recall curve, confusion matrix
5. **Interpretation** — Top 5 feature importances, one sentence explaining each

## Success Criteria
- Final notebook has ≥ 5 markdown cells documenting your methodology
- AUC-ROC printed in a cell output ≥ 0.85
- Feature importance plot rendered inline

## Bonus
- SHAP values for the top 3 predictions
- Cross-validation with 5 folds
`,
    testFile: undefined,     // DS challenges are evaluated by interviewer + notebook inspection
    milestones: [
      { id: 'eda-complete', title: 'EDA cell executed (correlation heatmap)', detector: 'commit_contains', target: 'corr', xp: 25 },
      { id: 'model-trained', title: 'Model fit() called', detector: 'commit_contains', target: 'fit', xp: 75 },
      { id: 'auc-printed', title: 'AUC-ROC ≥ 0.85 printed', detector: 'commit_contains', target: 'roc_auc', xp: 100 },
      { id: 'feature-importance', title: 'Feature importance plotted', detector: 'commit_contains', target: 'feature_importances', xp: 75 },
    ],
  },

  // ─── FRONTEND CHALLENGE ──────────────────────────────────────────────────
  {
    id: 'realtime-dashboard',
    title: 'Real-time Analytics Dashboard',
    type: 'feature',
    track: 'frontend',
    durationMin: 60,
    difficulty: 'medium',
    tags: ['react', 'websocket', 'charts', 'state-management'],
    personaId: 'alex-chen',
    briefMd: `# Real-time Analytics Dashboard

## Objective
Build a React dashboard that displays live metrics via WebSocket.

## Requirements
1. Connect to \`ws://localhost:4001\` — server emits \`{ metric, value, timestamp }\` events every 500ms
2. Display a live line chart (last 60 data points) for each metric: \`cpu\`, \`memory\`, \`requests_per_sec\`
3. Show current value, min, and max for each metric in a stats card
4. Pause/resume button — stops consuming new data points without disconnecting
5. Auto-reconnect with exponential backoff if WebSocket drops

## Test Suite
Run \`npm test\` to validate.

## Bonus
- Threshold alerts: flash the card red when cpu > 80 or memory > 90
- Export last 5 minutes of data as CSV
`,
    testFile: 'tests/dashboard.test.tsx',
    milestones: [
      { id: 'ws-connected', title: 'WebSocket connection established', detector: 'commit_contains', target: 'WebSocket', xp: 25 },
      { id: 'chart-renders', title: 'Line chart renders with live data', detector: 'test_passes', target: 'chart', xp: 75 },
      { id: 'pause-works', title: 'Pause/resume toggles data ingestion', detector: 'test_passes', target: 'pause', xp: 75 },
      { id: 'all-tests', title: 'All tests pass', detector: 'test_passes', target: 'passing', xp: 150 },
    ],
  },
];

export function getChallenge(id: string): ArenaChallenge | undefined {
  return ARENA_CHALLENGES.find(c => c.id === id);
}
