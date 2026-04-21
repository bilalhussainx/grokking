import { Module } from "../types";

export const overviewModule: Module = {
  id: "mern-overview",
  title: "MERN Overview",
  description: "Understand what the MERN stack is and how to architect a full-stack JavaScript project.",
  lessons: [
    {
      id: "what-is-mern",
      slug: "what-is-mern",
      title: "What is MERN?",
      content: `## The MERN Stack

The **MERN** stack is a popular full-stack JavaScript framework composed of four technologies:

| Layer | Technology | Role |
|-------|-----------|------|
| **M** | MongoDB | NoSQL document database |
| **E** | Express.js | Backend web framework for Node.js |
| **R** | React | Frontend UI library |
| **N** | Node.js | JavaScript runtime for the server |

### Why MERN?

- **Single language everywhere** -- JavaScript on the client, server, and database queries.
- **JSON end-to-end** -- Data flows as JSON from MongoDB through Express to React.
- **Massive ecosystem** -- npm provides packages for virtually every need.
- **Hiring & community** -- One of the most in-demand stacks in job listings.

### How the Pieces Fit Together

\`\`\`
Browser (React)
    |  HTTP / JSON
    v
Express.js API (Node.js)
    |  Mongoose ODM
    v
MongoDB (Atlas or local)
\`\`\`

React sends HTTP requests to Express routes. Express processes the request, queries MongoDB via Mongoose, and returns JSON. React renders the result.

### When to Use MERN

- Rapid prototyping and MVPs
- Single-page applications with dynamic data
- Real-time dashboards and CRUD-heavy apps
- Projects where your team already knows JavaScript

In the next lesson we will look at how to organize a MERN project for maintainability and scale.`,
      starterCode: `// Explore the MERN stack layers
// Fill in the missing technology for each layer

const mernStack = {
  M: "___",       // Database
  E: "___",       // Backend framework
  R: "___",       // Frontend library
  N: "___",       // Runtime
};

console.log(mernStack);
`,
      solutionCode: `// Explore the MERN stack layers

const mernStack = {
  M: "MongoDB",
  E: "Express.js",
  R: "React",
  N: "Node.js",
};

console.log(mernStack);
`,
    },
    {
      id: "project-architecture",
      slug: "project-architecture",
      title: "Project Architecture",
      content: `## MERN Project Architecture

A well-organized MERN project separates **client** and **server** code while sharing configuration at the root.

### Recommended Folder Structure

\`\`\`
my-mern-app/
  client/            # React frontend
    src/
      components/
      pages/
      services/      # API call functions
      App.jsx
    package.json
  server/            # Express backend
    models/          # Mongoose schemas
    routes/          # API route handlers
    middleware/      # Auth, error handling
    config/          # DB connection, env vars
    server.js        # Entry point
    package.json
  .env               # Shared environment variables
  package.json       # Root scripts (concurrently)
\`\`\`

### Key Architectural Decisions

1. **Monorepo vs. separate repos** -- A monorepo (shown above) is simpler for small teams. Larger teams may split client and server into separate repositories.

2. **API design** -- RESTful routes are the default. Each resource gets its own route file (e.g., \`/api/users\`, \`/api/posts\`).

3. **State management** -- Start with React's built-in \`useState\` and \`useContext\`. Add Redux or Zustand only when prop drilling becomes painful.

4. **Environment variables** -- Store secrets in \`.env\` and access them via \`process.env\`. Never commit \`.env\` to git.

### Running Both Servers

Use the \`concurrently\` package to start client and server with a single command:

\`\`\`json
{
  "scripts": {
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\""
  }
}
\`\`\`

This architecture scales well from a weekend project to a production application.`,
      starterCode: `// Define a basic project structure object
// Fill in the missing folders

const projectStructure = {
  client: {
    src: {
      components: [],
      pages: [],
      services: [],  // What goes here? API call functions
    },
    entryFile: "___",  // Main React file
  },
  server: {
    models: [],
    routes: [],
    middleware: [],
    entryFile: "___",  // Main server file
  },
};

console.log("Client entry:", projectStructure.client.entryFile);
console.log("Server entry:", projectStructure.server.entryFile);
`,
      solutionCode: `// Define a basic project structure object

const projectStructure = {
  client: {
    src: {
      components: [],
      pages: [],
      services: [],  // API call functions
    },
    entryFile: "App.jsx",
  },
  server: {
    models: [],
    routes: [],
    middleware: [],
    entryFile: "server.js",
  },
};

console.log("Client entry:", projectStructure.client.entryFile);
console.log("Server entry:", projectStructure.server.entryFile);
`,
    },
  ],
};
