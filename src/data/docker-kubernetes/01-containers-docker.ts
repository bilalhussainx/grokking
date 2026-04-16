import { Module } from "../types";

export const module1: Module = {
  id: "containers-docker",
  title: "Containers & Docker Fundamentals",
  description: "What containers are, how Docker works, images, layers, and running your first containerized app",
  lessons: [
    {
      id: "why-containers",
      slug: "why-containers",
      title: "Why Containers? The Problem They Solve",
      content: `# Why Containers?

"Works on my machine" killed countless deployments. Containers solve that by bundling the app AND its environment into one portable unit.

---

\`\`\`concept
{
  "title": "Container vs VM: The Key Insight",
  "variant": "mental-model",
  "content": "A VM emulates hardware — runs a full OS kernel, boots in minutes, uses gigabytes. A container shares the host OS kernel — has its own filesystem, process space, and network, but no kernel overhead. Result: millisecond startup, megabyte images, tens of containers per machine where only 3 VMs fit."
}
\`\`\`

---

## The Deployment Problem Timeline

\`\`\`sysdiag
{
  "type": "timeline",
  "title": "Evolution of Deployment",
  "steps": [
    { "era": "2000s", "name": "Bare Metal", "description": "App runs directly on server. Works in dev, fails in prod due to OS/lib differences. 'Works on my machine' era." },
    { "era": "2008", "name": "Virtual Machines", "description": "VMs isolate environments. Works but heavyweight: 5-minute boots, GB-sized images, low density." },
    { "era": "2013", "name": "Docker Containers", "description": "Lightweight isolation using Linux namespaces + cgroups. Millisecond start, MB-sized images, 10x density." },
    { "era": "2014", "name": "Kubernetes", "description": "Orchestrates thousands of containers: scheduling, scaling, self-healing, service discovery." }
  ]
}
\`\`\`

## How Docker Actually Works

\`\`\`sysdiag
{
  "type": "layered",
  "title": "Docker Architecture",
  "layers": [
    { "name": "Your App (Node/Python/Go)", "color": "blue" },
    { "name": "Container (isolated process)", "color": "teal" },
    { "name": "Docker Engine (containerd + runc)", "color": "green" },
    { "name": "Host OS Kernel (Linux)", "color": "gray" },
    { "name": "Hardware", "color": "dark" }
  ],
  "note": "The kernel is SHARED — containers don't have their own. That's what makes them lightweight."
}
\`\`\`

## Three Core Concepts

\`\`\`compare
{
  "title": "Image vs Container vs Registry",
  "items": [
    {
      "name": "Image",
      "description": "A read-only template — like a class in OOP. Contains app code, runtime, libraries, config. Built from a Dockerfile. Immutable once built."
    },
    {
      "name": "Container",
      "description": "A running instance of an image — like an object from a class. Has a writable layer on top of the image. Ephemeral by default."
    },
    {
      "name": "Registry",
      "description": "Stores and distributes images. Docker Hub is the default public registry. AWS ECR, GCP Artifact Registry for private. Pull = download image."
    }
  ]
}
\`\`\`

## Your First Docker Commands

\`\`\`bash
# Pull and run nginx (web server):
docker run -d -p 8080:80 --name my-nginx nginx

# -d = detached (background)
# -p 8080:80 = host port 8080 → container port 80
# --name = give it a name
# nginx = image name (pulled from Docker Hub if not local)

# List running containers:
docker ps

# CONTAINER ID   IMAGE   STATUS         PORTS                  NAMES
# a3f8c1d2e4b6   nginx   Up 2 minutes   0.0.0.0:8080->80/tcp   my-nginx

# View logs:
docker logs my-nginx
docker logs -f my-nginx   # -f = follow (live stream)

# Shell into a running container:
docker exec -it my-nginx bash
# -i = interactive, -t = TTY (gives you a proper terminal)

# Stop and remove:
docker stop my-nginx && docker rm my-nginx

# Or force remove a running container:
docker rm -f my-nginx
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does a Docker container share with the host that a VM does NOT?",
      "options": [
        "The filesystem",
        "The OS kernel",
        "The network stack",
        "The CPU architecture"
      ],
      "answer": 1,
      "explanation": "Containers share the host OS kernel — that's the fundamental difference from VMs. VMs run their own full OS kernel (via a hypervisor), which is why they boot slowly and consume more memory. Containers use Linux namespaces to isolate the process, filesystem, and network without a separate kernel."
    }
  ]
}
\`\`\`
`,
    },
    {
      id: "dockerfiles",
      slug: "dockerfiles",
      title: "Writing Dockerfiles: Layers, Caching & Best Practices",
      content: `# Writing Dockerfiles

A Dockerfile is a recipe for building an image. Every instruction creates a layer. Understanding layers is the key to fast builds and small images.

---

## Anatomy of a Dockerfile

\`\`\`dockerfile
# Every Dockerfile starts with FROM — the base image
FROM node:20-alpine

# WORKDIR sets the working directory inside the container
WORKDIR /app

# COPY files from host → container
# Copy package files FIRST (for layer caching)
COPY package.json package-lock.json ./

# RUN executes commands at BUILD time
RUN npm ci --only=production

# Now copy app source (after deps — so source changes don't bust the cache)
COPY src/ ./src/

# EXPOSE documents the port (doesn't actually open it — that's -p at runtime)
EXPOSE 3000

# ENV sets environment variables
ENV NODE_ENV=production

# CMD is the default command when the container starts
# Use exec form (JSON array) — NOT shell form
CMD ["node", "src/index.js"]
\`\`\`

## Layer Caching: The Critical Insight

\`\`\`sysdiag
{
  "type": "flow",
  "title": "Docker Layer Cache — How It Works",
  "steps": [
    { "step": "FROM node:20-alpine", "cache": "Always cached if image pulled", "color": "green" },
    { "step": "COPY package*.json ./", "cache": "Cached UNTIL package.json changes", "color": "green" },
    { "step": "RUN npm ci", "cache": "Cached — npm install only runs on dep changes!", "color": "green" },
    { "step": "COPY src/ ./src/", "cache": "Invalidated on EVERY source change", "color": "orange" },
    { "step": "CMD [...]", "cache": "Invalidated when COPY above changes", "color": "orange" }
  ],
  "note": "A cache miss on any layer invalidates ALL subsequent layers. Order matters!"
}
\`\`\`

## Multi-Stage Builds — Slim Production Images

\`\`\`dockerfile
# Stage 1: Build (heavy — has compilers, dev dependencies)
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci                      # installs ALL deps including devDeps
COPY . .
RUN npm run build               # TypeScript → JavaScript

# Stage 2: Production (lean — only what's needed to run)
FROM node:20-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production    # only runtime deps

# Copy ONLY the compiled output from the build stage:
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]

# Result: build image ~800MB → production image ~120MB
\`\`\`

## Best Practices

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Use Alpine",
      "icon": "🏔️",
      "content": "### Use Alpine Base Images\\n\\nAlpine Linux is a minimal distribution (~5MB) vs Debian/Ubuntu (~80-200MB).\\n\\n\`\`\`dockerfile\\n# ❌ Full image — 900MB+\\nFROM node:20\\n\\n# ✅ Alpine — 130MB\\nFROM node:20-alpine\\n\\n# ✅ Even smaller for Go (scratch = zero-byte base):\\nFROM golang:1.22-alpine AS builder\\nRUN CGO_ENABLED=0 go build -o app .\\n\\nFROM scratch\\nCOPY --from=builder /app .\\nCMD [\\"/app\\"]\\n# Final image: ~10MB!\\n\`\`\`"
    },
    {
      "label": ".dockerignore",
      "icon": "🙈",
      "content": "### Always Use .dockerignore\\n\\n\`\`\`text\\n# .dockerignore — like .gitignore for Docker\\nnode_modules\\n.git\\n*.log\\ndist\\n.env\\n.env.local\\nREADME.md\\n*.test.ts\\ncoverage/\\n\`\`\`\\n\\nWithout .dockerignore, COPY . . sends node_modules (often GB!) into the build context, making every build slow even if deps didn't change."
    },
    {
      "label": "Non-root user",
      "icon": "🔐",
      "content": "### Run as Non-Root User\\n\\n\`\`\`dockerfile\\n# By default containers run as root — security risk\\n# Create a non-root user:\\nFROM node:20-alpine\\n\\nWORKDIR /app\\nCOPY --chown=node:node package*.json ./\\nRUN npm ci --only=production\\nCOPY --chown=node:node . .\\n\\n# Switch to non-root user\\nUSER node\\n\\nEXPOSE 3000\\nCMD [\\"node\\", \\"index.js\\"]\\n\`\`\`\\n\\nIf someone exploits a vulnerability in your app, they get 'node' user permissions, not root."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Order FROM → COPY package.json → RUN npm install → COPY src/ for optimal cache hits", "Multi-stage builds: build in a fat image, copy artifacts to a slim production image", "Use Alpine base images — 10x smaller than full Debian images", ".dockerignore prevents node_modules from bloating the build context", "CMD uses exec form [node, index.js] not shell form — exec form handles signals correctly"]
\`\`\`
`,
      starterCode: `# Write a Dockerfile for a Python Flask app
# Requirements:
# 1. Use python:3.12-slim (not full python:3.12)
# 2. Set WORKDIR to /app
# 3. Install dependencies from requirements.txt BEFORE copying app code
# 4. Run as non-root user 'appuser'
# 5. Expose port 5000
# 6. Start command: python app.py

# app.py contents (for reference):
# from flask import Flask
# app = Flask(__name__)
# @app.route('/')
# def hello(): return 'Hello from Docker!'
# if __name__ == '__main__': app.run(host='0.0.0.0', port=5000)`,
      solutionCode: `FROM python:3.12-slim

WORKDIR /app

# Copy and install deps first (layer cache optimization)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

# Copy app source (after deps so source changes don't bust pip cache)
COPY --chown=appuser:appuser app.py .

# Switch to non-root
USER appuser

EXPOSE 5000

CMD ["python", "app.py"]`,
    },
  ],
};
