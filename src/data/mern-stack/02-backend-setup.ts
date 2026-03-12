import { Module } from "../types";

export const backendSetupModule: Module = {
  id: "mern-backend-setup",
  title: "Backend Setup",
  description:
    "Set up an Express server, connect to MongoDB, and build your first REST routes.",
  lessons: [
    {
      id: "express-server",
      slug: "express-server",
      title: "Express Server",
      content: `## Setting Up an Express Server

Express is a minimal, unopinionated web framework for Node.js. It handles routing, middleware, and HTTP request/response management.

### Installation

\`\`\`bash
mkdir server && cd server
npm init -y
npm install express dotenv
npm install -D nodemon
\`\`\`

### Basic Server

\`\`\`javascript
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\\\`Server running on port \\\${PORT}\\\`);
});
\`\`\`

### Key Concepts

- **\`express.json()\`** -- Built-in middleware that parses incoming JSON request bodies.
- **\`app.get(path, handler)\`** -- Registers a route handler for GET requests.
- **\`res.json()\`** -- Sends a JSON response and sets the correct Content-Type header.
- **\`dotenv\`** -- Loads variables from a \`.env\` file into \`process.env\`.

### Adding nodemon for Development

In \`package.json\`:

\`\`\`json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
\`\`\`

nodemon watches your files and restarts the server on every save.`,
      starterCode: `const express = require("express");
const app = express();
const PORT = 5000;

// TODO: Add JSON parsing middleware


// TODO: Create a GET route at "/api/health"
// It should return { status: "ok" }


// TODO: Start the server and log the port

`,
      solutionCode: `const express = require("express");
const app = express();
const PORT = 5000;

// Add JSON parsing middleware
app.use(express.json());

// Create a GET route at "/api/health"
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start the server and log the port
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`,
    },
    {
      id: "mongodb-connection",
      slug: "mongodb-connection",
      title: "MongoDB Connection",
      content: `## Connecting to MongoDB with Mongoose

Mongoose is an ODM (Object Data Modeling) library that provides schema validation, type casting, and query building on top of MongoDB's native driver.

### Installation

\`\`\`bash
npm install mongoose
\`\`\`

### Connection Setup

Create \`config/db.js\`:

\`\`\`javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(\\\`MongoDB connected: \\\${conn.connection.host}\\\`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
\`\`\`

### Environment Variable

In your \`.env\` file:

\`\`\`
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/myapp
\`\`\`

### Using the Connection

In \`server.js\`:

\`\`\`javascript
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();
\`\`\`

### Mongoose Connection Events

\`\`\`javascript
mongoose.connection.on("connected", () => console.log("Mongoose connected"));
mongoose.connection.on("error", (err) => console.log("Mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("Mongoose disconnected"));
\`\`\`

### MongoDB Atlas vs. Local

| Feature | Atlas (Cloud) | Local |
|---------|--------------|-------|
| Setup | Create free cluster online | Install MongoDB Community |
| URL | \`mongodb+srv://...\` | \`mongodb://localhost:27017/dbname\` |
| Best for | Production, teams | Offline development |`,
      starterCode: `const mongoose = require("mongoose");

// TODO: Create an async function called connectDB
// - It should connect to mongoose using the MONGO_URI variable
// - Log success message on connection
// - Log error and exit process on failure

const MONGO_URI = "mongodb://localhost:27017/myapp";

// Write your connectDB function here


// Call it
connectDB();
`,
      solutionCode: `const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/myapp";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(\`MongoDB connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();
`,
    },
    {
      id: "rest-routes",
      slug: "rest-routes",
      title: "REST Routes",
      content: `## Building REST Routes in Express

REST (Representational State Transfer) maps HTTP methods to CRUD operations:

| HTTP Method | CRUD | Route Example | Purpose |
|-------------|------|---------------|---------|
| GET | Read | \`/api/items\` | Fetch all items |
| GET | Read | \`/api/items/:id\` | Fetch one item |
| POST | Create | \`/api/items\` | Create new item |
| PUT | Update | \`/api/items/:id\` | Update an item |
| DELETE | Delete | \`/api/items/:id\` | Delete an item |

### Route File Pattern

Create \`routes/items.js\`:

\`\`\`javascript
const express = require("express");
const router = express.Router();

// GET all items
router.get("/", (req, res) => {
  res.json({ message: "Get all items" });
});

// GET single item
router.get("/:id", (req, res) => {
  res.json({ message: \\\`Get item \\\${req.params.id}\\\` });
});

// POST new item
router.post("/", (req, res) => {
  const { name } = req.body;
  res.status(201).json({ message: "Item created", name });
});

// PUT update item
router.put("/:id", (req, res) => {
  res.json({ message: \\\`Updated item \\\${req.params.id}\\\` });
});

// DELETE item
router.delete("/:id", (req, res) => {
  res.json({ message: \\\`Deleted item \\\${req.params.id}\\\` });
});

module.exports = router;
\`\`\`

### Mounting Routes in server.js

\`\`\`javascript
const itemRoutes = require("./routes/items");
app.use("/api/items", itemRoutes);
\`\`\`

### Best Practices

- Use \`express.Router()\` to keep routes modular.
- Return proper HTTP status codes (201 for creation, 404 for not found).
- Validate request bodies before processing.
- Use consistent URL naming: plural nouns, lowercase, hyphens.`,
      starterCode: `const express = require("express");
const router = express.Router();

// In-memory data store
let todos = [
  { id: 1, text: "Learn Express", done: false },
  { id: 2, text: "Build an API", done: false },
];

// TODO: GET /  - return all todos


// TODO: GET /:id  - return a single todo by id
// Return 404 if not found


// TODO: POST /  - create a new todo from req.body
// Return status 201


// TODO: DELETE /:id  - remove a todo by id


module.exports = router;
`,
      solutionCode: `const express = require("express");
const router = express.Router();

// In-memory data store
let todos = [
  { id: 1, text: "Learn Express", done: false },
  { id: 2, text: "Build an API", done: false },
];

// GET / - return all todos
router.get("/", (req, res) => {
  res.json(todos);
});

// GET /:id - return a single todo by id
router.get("/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// POST / - create a new todo
router.post("/", (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    done: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE /:id - remove a todo by id
router.delete("/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== parseInt(req.params.id));
  res.json({ message: "Todo deleted" });
});

module.exports = router;
`,
    },
  ],
};
