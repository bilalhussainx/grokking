import { Module } from "../types";

export const frontendSetupModule: Module = {
  id: "mern-frontend-setup",
  title: "Frontend Setup",
  description:
    "Scaffold a React frontend with Vite, connect it to your Express API, and add client-side routing.",
  lessons: [
    {
      id: "react-with-vite",
      slug: "react-with-vite",
      title: "React with Vite",
      content: `## Setting Up React with Vite

Vite is a modern build tool that offers instant hot module replacement (HMR) and fast production builds. It is now the recommended way to bootstrap React projects.

### Creating the Project

\`\`\`bash
npm create vite@latest client -- --template react
cd client
npm install
npm run dev
\`\`\`

This creates a React app at \`http://localhost:5173\`.

### Project Structure

\`\`\`
client/
  src/
    App.jsx          # Root component
    main.jsx         # Entry point (renders App)
    components/      # Reusable UI components
    pages/           # Page-level components
    services/        # API helper functions
  index.html         # Single HTML file
  vite.config.js     # Vite configuration
\`\`\`

### Configuring the API Proxy

To avoid CORS issues during development, proxy API calls through Vite. In \`vite.config.js\`:

\`\`\`javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
\`\`\`

Now any request to \`/api/*\` from your React app will be forwarded to your Express server on port 5000.

### Your First Component

\`\`\`jsx
function App() {
  return (
    <div className="app">
      <h1>My MERN App</h1>
      <p>Frontend is running!</p>
    </div>
  );
}

export default App;
\`\`\``,
      starterCode: `// Create a simple React component that displays
// app info in a card layout

function App() {
  // TODO: Define an appInfo object with:
  //   name, stack, and version properties

  return (
    <div className="app">
      {/* TODO: Display the app name in an h1 */}
      {/* TODO: Display the stack in a p tag */}
      {/* TODO: Display the version in a small tag */}
    </div>
  );
}

export default App;
`,
      solutionCode: `// Create a simple React component that displays
// app info in a card layout

function App() {
  const appInfo = {
    name: "My MERN App",
    stack: "MongoDB, Express, React, Node.js",
    version: "1.0.0",
  };

  return (
    <div className="app">
      <h1>{appInfo.name}</h1>
      <p>{appInfo.stack}</p>
      <small>v{appInfo.version}</small>
    </div>
  );
}

export default App;
`,
    },
    {
      id: "axios-integration",
      slug: "axios-integration",
      title: "Axios Integration",
      content: `## Connecting React to Your API with Axios

Axios is a promise-based HTTP client that simplifies API calls from the browser.

### Installation

\`\`\`bash
npm install axios
\`\`\`

### Creating an API Service

Create \`src/services/api.js\`:

\`\`\`javascript
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
\`\`\`

### Using the Service in a Component

\`\`\`jsx
import { useState, useEffect } from "react";
import api from "../services/api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await api.get("/todos");
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo._id}>{todo.text}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Axios vs. Fetch

| Feature | Axios | Fetch |
|---------|-------|-------|
| JSON parsing | Automatic | Manual (\`.json()\`) |
| Error handling | Rejects on 4xx/5xx | Only rejects on network errors |
| Interceptors | Built-in | Requires wrapper |
| Request cancellation | Built-in | AbortController |

### Adding an Interceptor

\`\`\`javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
\`\`\``,
      starterCode: `import { useState, useEffect } from "react";
import axios from "axios";

// TODO: Create an axios instance with baseURL "/api"
const api = null; // replace this

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch users from "/users" using the api instance
    // - Set users state on success
    // - Set error state on failure
    // - Set loading to false in both cases
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
`,
      solutionCode: `import { useState, useEffect } from "react";
import axios from "axios";

// Create an axios instance with baseURL "/api"
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
`,
    },
    {
      id: "react-router-setup",
      slug: "react-router-setup",
      title: "React Router",
      content: `## Client-Side Routing with React Router

React Router enables navigation between pages without full page reloads.

### Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

### Setting Up Routes

In \`App.jsx\`:

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Dynamic Routes

\`\`\`jsx
<Route path="/users/:id" element={<UserProfile />} />
\`\`\`

Access the parameter in the component:

\`\`\`jsx
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  return <h2>User {id}</h2>;
}
\`\`\`

### Programmatic Navigation

\`\`\`jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ... login logic
    navigate("/dashboard");
  };

  return <button onClick={handleLogin}>Log In</button>;
}
\`\`\`

### Navigation Guards

Wrap private routes in a layout component that checks authentication:

\`\`\`jsx
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Usage
<Route path="/dashboard" element={
  <PrivateRoute><Dashboard /></PrivateRoute>
} />
\`\`\``,
      starterCode: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Simple page components
function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

// TODO: Create a NotFound component for 404 pages

function App() {
  return (
    <BrowserRouter>
      {/* TODO: Add a nav bar with Links to Home, About, Contact */}

      {/* TODO: Define Routes for all four pages */}
      {/* Use path="*" for the NotFound page */}
    </BrowserRouter>
  );
}

export default App;
`,
      solutionCode: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`,
    },
  ],
};
