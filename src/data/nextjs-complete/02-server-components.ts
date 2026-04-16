import { Module } from "../types";

export const module2: Module = {
  id: "server-components",
  title: "Server Components vs Client Components",
  description: "React Server Components, Client Components, the boundary between them, and when to use each",
  lessons: [
    {
      id: "rsc-fundamentals",
      slug: "rsc-fundamentals",
      title: "React Server Components & Client Components",
      content: `
# Server vs Client Components

## The Mental Model

\`\`\`concept
{
  "title": "Server vs Client Components",
  "description": "Next.js App Router runs components in two environments — server and client",
  "points": [
    "Server Components (default): render on server, zero JS sent to client, can async/await directly",
    "Client Components ('use client'): render on client AND server (hydration), can use hooks/events",
    "Server Components CAN import Client Components (but not vice versa — no 'use client' in server)",
    "You can pass Server Component output as children prop to Client Components",
    "Server Components: can access DB, filesystem, secrets — never exposed to browser",
    "Client Components: browser APIs (window, localStorage), useState, useEffect, event handlers"
  ]
}
\`\`\`

## Server Components

\`\`\`typescript
// app/users/page.tsx — Server Component (default, no 'use client')
// Can directly await async operations — no useEffect needed!

async function getUsers() {
  // This runs on the server — DB credentials never reach the client
  const res = await fetch('https://api.example.com/users', {
    cache: 'no-store', // or { next: { revalidate: 60 } }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers(); // direct await — no loading state needed

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Benefits:
// - No client-side JS for data fetching
// - DB queries run server-side (secure, faster)
// - Automatic streaming with loading.tsx
// - SEO-friendly (HTML rendered on server)
\`\`\`

## Client Components

\`\`\`typescript
// components/Counter.tsx
'use client'; // Marks as Client Component

import { useState, useEffect } from 'react';

export function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount);

  // hooks work in Client Components:
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
}

// Use Client Components for:
// - onClick, onChange, onSubmit
// - useState, useReducer, useContext
// - useEffect, useLayoutEffect
// - Browser APIs: window, document, localStorage
// - Third-party libraries that need DOM
\`\`\`

## The Boundary — Passing Data Between Environments

\`\`\`typescript
// ✅ CORRECT: Server Component passes data/children to Client Component

// Server Component:
import { UserProfile } from './UserProfile'; // Client Component
import { db } from '@/lib/db';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // Fetch on server (access DB directly):
  const user = await db.user.findUnique({ where: { id: params.id } });

  // Pass serializable data to Client Component:
  return <UserProfile user={user} />;
}

// components/UserProfile.tsx
'use client';
import { useState } from 'react';
import type { User } from '@prisma/client';

export function UserProfile({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  // user data came from server, interaction logic lives here
  return <div>...</div>;
}

// ❌ WRONG: Importing Server Component into Client Component
// 'use client';
// import { ServerOnlyThing } from './server-only'; // ERROR or breaks

// ✅ CORRECT: Pass Server Component as children prop
'use client';
export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div>{children}</div>; // children can be Server Components!
}

// In a Server Component:
// <Shell><ServerComponent /></Shell> — works!
\`\`\`

## Data Fetching Patterns

\`\`\`typescript
// Pattern 1: Parallel fetching in Server Components
export default async function Dashboard() {
  // Both fetch in parallel — same as Promise.all but more readable
  const [user, posts, analytics] = await Promise.all([
    fetchUser(),
    fetchRecentPosts(),
    fetchAnalytics(),
  ]);

  return <DashboardView user={user} posts={posts} analytics={analytics} />;
}

// Pattern 2: Streaming with Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Fast content loads immediately */}
      <UserCard />
      {/* Slow content streams in when ready */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics /> {/* async Server Component */}
      </Suspense>
    </div>
  );
}

// Pattern 3: Sequential fetching (when needed)
async function Comments({ postId }: { postId: string }) {
  const post = await getPost(postId);          // first
  const comments = await getComments(post.id); // then
  return <CommentList comments={comments} />;
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Can you use useState in a Server Component?",
      "options": [
        "Yes, always",
        "No — useState requires 'use client'. Server Components cannot use hooks.",
        "Only in async Server Components",
        "Yes, but only in layouts"
      ],
      "answer": 1,
      "explanation": "Server Components run on the server and do not have access to React hooks like useState, useEffect, useContext, etc. These hooks require a browser environment. Use 'use client' for any component that needs hooks or interactivity."
    },
    {
      "q": "What is the advantage of fetching data in a Server Component vs useEffect?",
      "options": [
        "No advantage — they work the same",
        "Server Components: no loading state, no waterfall, secrets stay on server, less JS shipped, better SEO",
        "useEffect is faster",
        "Server Components don't support async operations"
      ],
      "answer": 1,
      "explanation": "Server Components fetch data directly with async/await — no useEffect, no loading spinner needed, no client-side JS for the fetch. Database credentials and API keys stay on the server. The HTML is generated server-side, improving SEO and initial page load."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
