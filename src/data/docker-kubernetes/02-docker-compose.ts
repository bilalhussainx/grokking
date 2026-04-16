import { Module } from "../types";

export const module2: Module = {
  id: "docker-compose",
  title: "Docker Compose & Multi-Container Apps",
  description: "Orchestrate multiple containers locally with Docker Compose — volumes, networks, environment variables, and health checks",
  lessons: [
    {
      id: "compose-fundamentals",
      slug: "compose-fundamentals",
      title: "Docker Compose: Multi-Service Local Development",
      content: `# Docker Compose

Real applications aren't one container. They're an app server + database + cache + message queue. Docker Compose wires them together with one file.

---

\`\`\`concept
{
  "title": "What Docker Compose Does",
  "variant": "how-it-works",
  "content": "docker-compose.yml defines all services, their images/builds, ports, volumes, environment variables, and dependencies. 'docker compose up' starts everything. 'docker compose down' tears it all down. One command to spin up your entire stack from scratch — no more 'start the DB, then start Redis, then start the app in the right order.'"
}
\`\`\`

---

## A Real-World docker-compose.yml

\`\`\`yaml
# docker-compose.yml — full-stack web app
version: '3.9'

services:
  # --- App Server ---
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/myapp
      REDIS_URL: redis://cache:6379
      NODE_ENV: development
    env_file:
      - .env.local          # Load from file (don't commit secrets!)
    volumes:
      - ./src:/app/src       # Bind mount for hot reload
      - /app/node_modules    # Anonymous volume — don't overwrite with host
    depends_on:
      db:
        condition: service_healthy   # Wait for health check, not just started
      cache:
        condition: service_started
    restart: unless-stopped

  # --- PostgreSQL ---
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data   # Named volume for persistence
      - ./migrations:/docker-entrypoint-initdb.d  # Auto-run SQL on first start
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # --- Redis Cache ---
  cache:
    image: redis:7-alpine
    command: redis-server --requirepass mypassword
    ports:
      - "6379:6379"      # Only expose if you need access from host

  # --- Nginx (reverse proxy in production-like setup) ---
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro  # :ro = read-only mount
    depends_on:
      - app

volumes:
  postgres_data:         # Named volume — persists across 'docker compose down'
\`\`\`

## Volumes: Three Types

\`\`\`compare
{
  "title": "Docker Volume Types",
  "items": [
    {
      "name": "Named Volume",
      "description": "postgres_data:/var/lib/postgresql/data — Docker manages the storage. Persists across container restarts and 'docker compose down'. Removed only by 'docker compose down -v'. Best for databases."
    },
    {
      "name": "Bind Mount",
      "description": "./src:/app/src — Maps a host directory into the container. Changes on host appear instantly in container (hot reload). Risky for prod (host FS bleeds into container). Best for dev."
    },
    {
      "name": "Anonymous Volume",
      "description": "/app/node_modules — No host path specified. Docker creates a throwaway volume. Prevents host's node_modules from shadowing container's. Deleted on 'docker compose down'."
    }
  ]
}
\`\`\`

## Essential Compose Commands

\`\`\`bash
# Start all services (build if needed):
docker compose up -d --build

# View running services:
docker compose ps

# Stream all logs (or specific service):
docker compose logs -f
docker compose logs -f app

# Execute command in a running service:
docker compose exec app sh
docker compose exec db psql -U postgres myapp

# Stop everything (containers remain):
docker compose stop

# Stop AND remove containers, networks (volumes preserved):
docker compose down

# Nuclear option — remove containers, networks, AND volumes:
docker compose down -v

# Scale a service (run 3 app instances):
docker compose up -d --scale app=3

# Run one-off command (new container, auto-removed):
docker compose run --rm app npm run migrate
\`\`\`

## Compose Profiles (TS 3.x+) — Conditional Services

\`\`\`yaml
services:
  app:
    build: .
    ports: ["3000:3000"]

  db:
    image: postgres:16-alpine
    # Always started (no profile)

  pgadmin:
    image: dpage/pgadmin4
    profiles: ["tools"]    # Only started when 'tools' profile active
    ports: ["5050:80"]

  mailhog:
    image: mailhog/mailhog
    profiles: ["tools"]
    ports: ["8025:8025"]
\`\`\`

\`\`\`bash
# Normal start (no tools):
docker compose up -d

# Start with tools (pgAdmin, MailHog):
docker compose --profile tools up -d
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between 'depends_on: service_started' and 'service_healthy'?",
      "options": [
        "No difference",
        "'service_started' waits for the container to start; 'service_healthy' waits for the healthcheck to pass — meaning the database is actually ready to accept connections",
        "'service_healthy' only works with official images",
        "'service_started' is deprecated"
      ],
      "answer": 1,
      "explanation": "This is a critical difference. 'service_started' means Docker started the container process — but PostgreSQL takes a few seconds to initialize even after the process starts. Your app connecting immediately gets 'connection refused'. 'service_healthy' waits for pg_isready to return success, meaning PostgreSQL is actually accepting connections. Always use 'service_healthy' with databases."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
