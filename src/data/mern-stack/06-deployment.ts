import { Module } from "../types";

export const deploymentModule: Module = {
  id: "mern-deployment",
  title: "Deployment",
  description:
    "Prepare your MERN app for production with environment variables, optimized builds, and Docker containers.",
  lessons: [
    {
      id: "env-vars-production-build",
      slug: "env-vars-production-build",
      title: "Environment Variables & Production Build",
      content: `## Environment Variables and Production Builds

Before deploying, your app needs proper configuration management and an optimized build.

### Environment Variables

Never hard-code secrets. Use \`.env\` files locally and platform-specific config in production.

\`\`\`
# .env (development)
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
JWT_SECRET=dev_secret_key_change_in_prod
CLIENT_URL=http://localhost:5173
\`\`\`

Access in code:

\`\`\`javascript
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
\`\`\`

### .env Best Practices

| Do | Do Not |
|----|--------|
| Add \`.env\` to \`.gitignore\` | Commit \`.env\` to git |
| Create \`.env.example\` with empty values | Use the same secrets in dev and prod |
| Use different secrets per environment | Hard-code connection strings |

### Building React for Production

\`\`\`bash
cd client
npm run build
\`\`\`

This creates an optimized \`dist/\` folder with minified HTML, CSS, and JS.

### Serving the Build from Express

\`\`\`javascript
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
\`\`\`

### Deployment Platforms

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| Render | Yes | Full-stack Node apps |
| Railway | Yes | Quick deployments |
| Vercel | Yes | React frontends |
| Fly.io | Yes | Docker-based deploys |
| AWS / GCP | Trial | Enterprise scale |

### Pre-Deployment Checklist

- [ ] All secrets in environment variables
- [ ] \`.env\` in \`.gitignore\`
- [ ] \`NODE_ENV=production\` set on server
- [ ] React build runs without errors
- [ ] CORS configured for production domain
- [ ] MongoDB Atlas connection string updated`,
      starterCode: `// Build a configuration module that reads from environment
// variables with fallback defaults

// TODO: Create a config object that reads:
// - port from PORT env var (default: 5000)
// - mongoUri from MONGO_URI env var (default: "mongodb://localhost:27017/myapp")
// - jwtSecret from JWT_SECRET env var (default: "default_secret")
// - nodeEnv from NODE_ENV env var (default: "development")
// - clientUrl from CLIENT_URL env var (default: "http://localhost:5173")

const config = {
  // fill in here
};

// TODO: Create a function validateConfig(config)
// that checks if jwtSecret is "default_secret" and
// nodeEnv is "production" -- if so, throw an error
// "Cannot use default JWT secret in production!"

console.log("Config loaded:", config);
`,
      solutionCode: `// Build a configuration module that reads from environment
// variables with fallback defaults

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

function validateConfig(cfg) {
  if (cfg.nodeEnv === "production" && cfg.jwtSecret === "default_secret") {
    throw new Error("Cannot use default JWT secret in production!");
  }
}

validateConfig(config);
console.log("Config loaded:", config);
`,
    },
    {
      id: "docker-basics",
      slug: "docker-basics",
      title: "Docker Basics",
      content: `## Containerizing Your MERN App with Docker

Docker packages your application and its dependencies into a portable container that runs the same way everywhere.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Image** | A read-only template with your app code, runtime, and dependencies |
| **Container** | A running instance of an image |
| **Dockerfile** | Instructions to build an image |
| **docker-compose** | Tool for defining multi-container apps |

### Backend Dockerfile

\`\`\`dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
\`\`\`

### Frontend Dockerfile (Multi-Stage Build)

\`\`\`dockerfile
# client/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### Docker Compose

\`\`\`yaml
# docker-compose.yml
version: "3.8"
services:
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/myapp
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      - mongo

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
\`\`\`

### Common Commands

\`\`\`bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f server

# Stop everything
docker-compose down

# Remove volumes too
docker-compose down -v
\`\`\`

### .dockerignore

\`\`\`
node_modules
.env
.git
*.md
\`\`\`

Docker ensures your MERN app runs identically in development, staging, and production -- eliminating "works on my machine" problems.`,
      starterCode: `// Docker configuration as JavaScript objects
// This helps you understand the structure before writing YAML

// TODO: Define a Dockerfile config for the server
const serverDockerfile = {
  baseImage: "___",        // Node.js Alpine image
  workdir: "___",          // Working directory
  copyFirst: "___",        // What to copy first for layer caching
  installCmd: "___",       // Install production deps only
  expose: null,            // Port number
  startCmd: "___",         // Command to start the app
};

// TODO: Define a docker-compose services config
const dockerCompose = {
  services: {
    server: {
      build: "___",
      ports: ["___"],
      environment: [],     // Add MONGO_URI and JWT_SECRET
      dependsOn: [],
    },
    mongo: {
      image: "___",
      ports: ["___"],
    },
  },
};

console.log("Server Dockerfile:", serverDockerfile);
console.log("Docker Compose:", JSON.stringify(dockerCompose, null, 2));
`,
      solutionCode: `// Docker configuration as JavaScript objects

const serverDockerfile = {
  baseImage: "node:18-alpine",
  workdir: "/app",
  copyFirst: "package*.json",
  installCmd: "npm ci --only=production",
  expose: 5000,
  startCmd: "node server.js",
};

const dockerCompose = {
  services: {
    server: {
      build: "./server",
      ports: ["5000:5000"],
      environment: [
        "MONGO_URI=mongodb://mongo:27017/myapp",
        "JWT_SECRET=\${JWT_SECRET}",
      ],
      dependsOn: ["mongo"],
    },
    mongo: {
      image: "mongo:7",
      ports: ["27017:27017"],
    },
  },
};

console.log("Server Dockerfile:", serverDockerfile);
console.log("Docker Compose:", JSON.stringify(dockerCompose, null, 2));
`,
    },
  ],
};
