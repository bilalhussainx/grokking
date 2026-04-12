import { Module } from "../types";

export const crudAppModule: Module = {
  id: "mern-crud-app",
  title: "CRUD Application",
  description: "Build a complete CRUD application -- Mongoose models, API endpoints, React forms, and a polished UI.",
  lessons: [
    {
      id: "mongoose-models",
      slug: "mongoose-models",
      title: "Mongoose Models",
      content: `## Defining Mongoose Models

A Mongoose model maps to a MongoDB collection and defines the shape of documents within it.

### Schema Basics

\`\`\`javascript
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title:   { type: String, required: [true, "Title is required"], trim: true },
    body:    { type: String, required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags:    [{ type: String }],
    likes:   { type: Number, default: 0 },
    status:  { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Post", postSchema);
\`\`\`

### Schema Types Reference

| Type | Example | Notes |
|------|---------|-------|
| String | \`{ type: String }\` | Can add trim, minlength, maxlength |
| Number | \`{ type: Number }\` | Can add min, max |
| Boolean | \`{ type: Boolean }\` | Defaults to false |
| Date | \`{ type: Date }\` | \`default: Date.now\` |
| ObjectId | \`{ type: Schema.Types.ObjectId, ref: "Model" }\` | For relationships |
| Array | \`[{ type: String }]\` | Array of strings |

### Validation

Mongoose validates data before saving. If validation fails, the save is rejected:

\`\`\`javascript
const user = new User({ email: "" }); // missing required fields
await user.save(); // throws ValidationError
\`\`\`

### Virtual Fields

Computed properties that are not stored in the database:

\`\`\`javascript
postSchema.virtual("summary").get(function () {
  return this.body.substring(0, 100) + "...";
});
\`\`\`

### Indexing

\`\`\`javascript
postSchema.index({ title: "text", body: "text" }); // text search
postSchema.index({ author: 1, createdAt: -1 });     // compound index
\`\`\``,
      starterCode: `const mongoose = require("mongoose");

// TODO: Define a "Product" schema with these fields:
// - name: String, required, trimmed
// - price: Number, required, minimum 0
// - category: String, enum of ["electronics", "clothing", "food"]
// - inStock: Boolean, default true
// - createdAt: Date, default Date.now


// TODO: Export the model

`,
      solutionCode: `const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  price:     { type: Number, required: true, min: 0 },
  category:  { type: String, enum: ["electronics", "clothing", "food"] },
  inStock:   { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
`,
    },
    {
      id: "api-endpoints",
      slug: "api-endpoints",
      title: "API Endpoints",
      content: `## CRUD API Endpoints

Each Mongoose model typically has five REST endpoints. Here is the full pattern for a "Post" resource.

### Route File: \`routes/posts.js\`

\`\`\`javascript
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect } = require("../middleware/auth");

// GET /api/posts -- List all posts
router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });
  res.json(posts);
});

// GET /api/posts/:id -- Get single post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST /api/posts -- Create post (auth required)
router.post("/", protect, async (req, res) => {
  const post = await Post.create({
    ...req.body,
    author: req.user._id,
  });
  res.status(201).json(post);
});

// PUT /api/posts/:id -- Update post (auth required)
router.put("/:id", protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// DELETE /api/posts/:id -- Delete post (auth required)
router.delete("/:id", protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  await post.deleteOne();
  res.json({ message: "Post removed" });
});

module.exports = router;
\`\`\`

### Key Patterns

- **\`populate()\`** fills in referenced documents (like JOIN in SQL).
- **\`protect\`** middleware ensures only logged-in users can create, update, or delete.
- **Authorization check** ensures users can only modify their own posts.
- **\`sort({ createdAt: -1 })\`** returns newest posts first.`,
      starterCode: `const express = require("express");
const router = express.Router();

// Simulated database
let products = [
  { _id: "1", name: "Laptop", price: 999, category: "electronics" },
  { _id: "2", name: "T-Shirt", price: 25, category: "clothing" },
];

// TODO: GET / - Return all products


// TODO: GET /:id - Return a single product
// Return 404 if not found


// TODO: POST / - Create a product from req.body
// Assign a new _id and return status 201


// TODO: PUT /:id - Update a product
// Return 404 if not found


// TODO: DELETE /:id - Delete a product
// Return 404 if not found


module.exports = router;
`,
      solutionCode: `const express = require("express");
const router = express.Router();

let products = [
  { _id: "1", name: "Laptop", price: 999, category: "electronics" },
  { _id: "2", name: "T-Shirt", price: 25, category: "clothing" },
];

// GET / - Return all products
router.get("/", (req, res) => {
  res.json(products);
});

// GET /:id - Return a single product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST / - Create a product
router.post("/", (req, res) => {
  const product = {
    _id: String(products.length + 1),
    ...req.body,
  };
  products.push(product);
  res.status(201).json(product);
});

// PUT /:id - Update a product
router.put("/:id", (req, res) => {
  const index = products.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE /:id - Delete a product
router.delete("/:id", (req, res) => {
  const index = products.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products.splice(index, 1);
  res.json({ message: "Product deleted" });
});

module.exports = router;
`,
    },
    {
      id: "react-forms",
      slug: "react-forms",
      title: "React Forms",
      content: `## Building Forms in React

Forms are the primary way users create and edit data in a CRUD app. React's controlled components pattern keeps form state predictable.

### Controlled Form Pattern

\`\`\`jsx
import { useState } from "react";
import api from "../services/api";

function CreatePostForm({ onPostCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()),
      };
      const { data } = await api.post("/posts", payload);
      onPostCreated(data);
      setFormData({ title: "", body: "", tags: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="body" value={formData.body} onChange={handleChange} placeholder="Write your post..." required />
      <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
\`\`\`

### Reusable Form for Create and Edit

Use the same component for both creating and editing by accepting initial values:

\`\`\`jsx
function PostForm({ initialData = {}, onSubmit, buttonLabel = "Save" }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    body: initialData.body || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <input name="title" value={formData.title} onChange={handleChange} />
      <textarea name="body" value={formData.body} onChange={handleChange} />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
}
\`\`\`

### Validation Tips

- Check required fields before submitting.
- Show inline error messages next to the relevant field.
- Disable the submit button while the request is in flight.
- Reset the form after a successful create.`,
      starterCode: `import { useState } from "react";

// TODO: Build a ProductForm component that:
// 1. Has fields for name, price, and category
// 2. Uses a single formData state object
// 3. Has a handleChange function using [e.target.name]
// 4. Validates that name and price are not empty
// 5. Logs the form data on submit

function ProductForm() {
  // Your code here

  return (
    <form>
      <h2>Add Product</h2>
      {/* Add your form fields here */}
    </form>
  );
}

export default ProductForm;
`,
      solutionCode: `import { useState } from "react";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "electronics",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError("Name and price are required");
      return;
    }
    setError(null);
    console.log("Product submitted:", {
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product name"
      />
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
      />
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food</option>
      </select>
      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;
`,
    },
    {
      id: "full-crud-ui",
      slug: "full-crud-ui",
      title: "Full CRUD UI",
      content: `## Putting It All Together: Full CRUD Interface

A complete CRUD interface lets users list, create, edit, and delete items -- all wired to your API.

### Component Architecture

\`\`\`
App
  PostList          -- Fetches and displays all posts
    PostCard        -- Displays a single post with edit/delete buttons
  PostForm          -- Reusable create/edit form
  EditPostPage      -- Loads a post and passes it to PostForm
\`\`\`

### PostList with Delete

\`\`\`jsx
import { useState, useEffect } from "react";
import api from "../services/api";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then(({ data }) => setPosts(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(\\\`/posts/\\\${id}\\\`);
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.body.substring(0, 150)}...</p>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Edit Flow

1. User clicks "Edit" on a PostCard.
2. Navigate to \`/posts/:id/edit\`.
3. Fetch the post data and populate PostForm.
4. On submit, send a PUT request and redirect back to the list.

\`\`\`jsx
function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(\\\`/posts/\\\${id}\\\`).then(({ data }) => setPost(data));
  }, [id]);

  const handleUpdate = async (formData) => {
    await api.put(\\\`/posts/\\\${id}\\\`, formData);
    navigate("/posts");
  };

  if (!post) return <p>Loading...</p>;

  return <PostForm initialData={post} onSubmit={handleUpdate} buttonLabel="Update" />;
}
\`\`\`

### UX Best Practices

- Show a **confirmation dialog** before deleting.
- Display **loading spinners** during API calls.
- Show **success toasts** after create/update/delete.
- Handle **optimistic updates** for instant feedback.
- Add **empty states** when no items exist yet.`,
      starterCode: `import { useState } from "react";

// TODO: Build a complete task manager UI with:
// 1. A list of tasks
// 2. An input to add new tasks
// 3. A delete button for each task
// 4. A toggle to mark tasks as complete

const initialTasks = [
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build MERN app", done: false },
];

function TaskManager() {
  // TODO: Set up state for tasks and newTask input

  // TODO: addTask function - adds a new task to the list

  // TODO: deleteTask function - removes a task by id

  // TODO: toggleTask function - toggles the done status

  return (
    <div>
      <h1>Task Manager</h1>
      {/* TODO: Add input and button for new tasks */}
      {/* TODO: Render task list with delete and toggle */}
    </div>
  );
}

export default TaskManager;
`,
      solutionCode: `import { useState } from "react";

const initialTasks = [
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Build MERN app", done: false },
];

function TaskManager() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, done: false },
    ]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.done ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
`,
    },
  ],
};
