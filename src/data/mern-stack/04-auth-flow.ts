import { Module } from "../types";

export const authFlowModule: Module = {
  id: "mern-auth-flow",
  title: "Full-Stack Auth",
  description:
    "Implement JWT-based authentication across the full stack -- backend token generation, login/register UI, and protected routes.",
  lessons: [
    {
      id: "jwt-backend",
      slug: "jwt-backend",
      title: "JWT Backend",
      content: `## JWT Authentication on the Server

JSON Web Tokens (JWT) allow stateless authentication. The server signs a token containing the user's ID; the client sends it back on subsequent requests.

### Installation

\`\`\`bash
npm install jsonwebtoken bcryptjs
\`\`\`

### User Model

\`\`\`javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
\`\`\`

### Auth Route -- Register & Login

\`\`\`javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const user = await User.create({ name, email, password });
  res.status(201).json({ _id: user._id, name, email, token: generateToken(user._id) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, name: user.name, email, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});
\`\`\`

### Auth Middleware

\`\`\`javascript
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Token invalid" });
  }
};
\`\`\``,
      starterCode: `const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "mysecretkey";

// TODO: Write a function generateToken(userId)
// It should return a JWT signed with JWT_SECRET, expiring in "30d"


// TODO: Write an async function hashPassword(plainText)
// It should return the bcrypt hash with 10 salt rounds


// TODO: Write an async function comparePasswords(plain, hashed)
// It should return true/false


// Test your functions
async function main() {
  const token = generateToken("user123");
  console.log("Token:", token);

  const hashed = await hashPassword("myPassword");
  console.log("Hashed:", hashed);

  const match = await comparePasswords("myPassword", hashed);
  console.log("Match:", match);

  const noMatch = await comparePasswords("wrong", hashed);
  console.log("No match:", noMatch);
}

main();
`,
      solutionCode: `const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "mysecretkey";

// Generate a JWT for a user ID
function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "30d" });
}

// Hash a plaintext password
async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, 10);
}

// Compare a plaintext password with a hash
async function comparePasswords(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

// Test
async function main() {
  const token = generateToken("user123");
  console.log("Token:", token);

  const hashed = await hashPassword("myPassword");
  console.log("Hashed:", hashed);

  const match = await comparePasswords("myPassword", hashed);
  console.log("Match:", match);

  const noMatch = await comparePasswords("wrong", hashed);
  console.log("No match:", noMatch);
}

main();
`,
    },
    {
      id: "login-register-ui",
      slug: "login-register-ui",
      title: "Login & Register UI",
      content: `## Building Login and Register Forms in React

The frontend needs forms that collect credentials and send them to your auth API.

### Auth Context

Manage auth state globally with React Context:

\`\`\`jsx
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
\`\`\`

### Login Form Component

\`\`\`jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Log In</button>
    </form>
  );
}
\`\`\`

### Best Practices

- Store tokens in \`localStorage\` for persistence across refreshes.
- Clear storage on logout.
- Show loading states during API calls.
- Display server error messages to the user.`,
      starterCode: `import { useState } from "react";

function RegisterForm() {
  // TODO: Create state variables for name, email, password, and error

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Validate that all fields are filled
    // If not, set error to "All fields are required"

    // TODO: Log the form data object { name, email, password }
    console.log("Registration submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {/* TODO: Show error message if error state is not null */}

      {/* TODO: Add input fields for name, email, password */}
      {/* Each input should be controlled (value + onChange) */}

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
`,
      solutionCode: `import { useState } from "react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setError(null);
    console.log("Registration submitted", { name, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
`,
    },
    {
      id: "protected-routes",
      slug: "protected-routes",
      title: "Protected Routes",
      content: `## Protecting Routes on Client and Server

Protected routes ensure only authenticated users can access certain pages and API endpoints.

### Server-Side: Auth Middleware

Apply the \`protect\` middleware to any route that requires authentication:

\`\`\`javascript
const { protect } = require("../middleware/auth");

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

router.get("/dashboard", protect, async (req, res) => {
  const data = await Dashboard.find({ user: req.user._id });
  res.json(data);
});
\`\`\`

### Client-Side: PrivateRoute Component

\`\`\`jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
\`\`\`

### Using PrivateRoute

\`\`\`jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } />
</Routes>
\`\`\`

### Sending the Token with Requests

Set the Authorization header using an Axios interceptor:

\`\`\`javascript
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = \\\`Bearer \\\${user.token}\\\`;
  }
  return config;
});
\`\`\`

### Complete Auth Flow

1. User submits login form
2. Server validates credentials, returns JWT
3. Client stores JWT in localStorage
4. Axios interceptor attaches JWT to every request
5. Server middleware verifies JWT on protected routes
6. If token is missing/invalid, server returns 401
7. Client redirects to login on 401 response`,
      starterCode: `import { Navigate } from "react-router-dom";

// Simulate an auth context
const useAuth = () => ({
  user: null, // Change to { name: "Test" } to simulate logged in
});

// TODO: Create a PrivateRoute component
// - It should accept { children } as props
// - Use useAuth() to check if user exists
// - If user exists, render children
// - If not, redirect to "/login" using <Navigate>


// TODO: Create a simple Dashboard component
// that displays "Welcome to your dashboard!"


// Example usage (for reference):
// <PrivateRoute><Dashboard /></PrivateRoute>

// Export both components
`,
      solutionCode: `import { Navigate } from "react-router-dom";

const useAuth = () => ({
  user: null, // Change to { name: "Test" } to simulate logged in
});

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Dashboard() {
  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
    </div>
  );
}

// Usage: <PrivateRoute><Dashboard /></PrivateRoute>

export { PrivateRoute, Dashboard };
`,
    },
  ],
};
