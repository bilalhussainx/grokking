import { Module } from "../types";

export const module1: Module = {
  id: "app-router",
  title: "App Router, File-Based Routing & Layouts",
  description: "Next.js App Router fundamentals: file conventions, nested layouts, route groups, and loading/error states",
  lessons: [
    {
      id: "app-router-fundamentals",
      slug: "app-router-fundamentals",
      title: "App Router Fundamentals & File Conventions",
      content: `
# Next.js App Router

Next.js 13+ introduced the **App Router** — a file-system based router built on React Server Components.

\`\`\`concept
{
  "title": "App Router File Conventions",
  "description": "Special filenames in the app/ directory create UI with specific roles",
  "points": [
    "page.tsx — unique UI for a route, makes it publicly accessible",
    "layout.tsx — shared UI that wraps child routes, maintains state across navigations",
    "loading.tsx — instant loading skeleton using Suspense (auto-wraps page in <Suspense>)",
    "error.tsx — error boundary for route segment (must be 'use client')",
    "not-found.tsx — 404 UI for notFound() calls or unmatched routes",
    "route.ts — API endpoint handler (no UI)",
    "template.tsx — like layout but re-mounted on navigation (no state preservation)"
  ]
}
\`\`\`

## Folder Structure & Route Mapping

\`\`\`
app/
├── layout.tsx            → / (root layout — wraps everything)
├── page.tsx              → / (home page)
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── layout.tsx        → /blog/* (blog layout)
│   ├── page.tsx          → /blog
│   └── [slug]/
│       ├── page.tsx      → /blog/any-slug
│       └── loading.tsx   → loading state for /blog/[slug]
├── (marketing)/          → Route Group — no URL segment!
│   ├── pricing/page.tsx  → /pricing
│   └── features/page.tsx → /features
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx          → /dashboard
│   └── settings/
│       └── page.tsx      → /dashboard/settings
└── api/
    └── users/
        └── route.ts      → /api/users (GET, POST, etc.)
\`\`\`

## Layouts

\`\`\`typescript
// app/layout.tsx — Root Layout (required)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>Navigation here</nav>
        {children}
        <footer>Footer here</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx — Nested Layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside>Dashboard sidebar</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
\`\`\`

## Dynamic Routes

\`\`\`typescript
// app/blog/[slug]/page.tsx

// params type is automatically inferred
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate static paths at build time:
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Generate metadata dynamically:
export async function generateMetadata({ params }: Props) {
  const post = await fetchPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: [post.coverImage] },
  };
}

export default async function BlogPost({ params, searchParams }: Props) {
  const post = await fetchPost(params.slug);
  if (!post) notFound(); // triggers not-found.tsx

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Catch-all routes:
// app/docs/[...slug]/page.tsx → /docs/a/b/c → params.slug = ['a','b','c']
// app/docs/[[...slug]]/page.tsx → also matches /docs (optional catch-all)
\`\`\`

## Loading, Error & Not Found

\`\`\`typescript
// app/blog/[slug]/loading.tsx — Instant UI while page loads
export default function BlogLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

// app/blog/[slug]/error.tsx — Error boundary
'use client'; // required!
export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Post Not Found</h2>
      <p>The post you're looking for doesn't exist.</p>
    </div>
  );
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between layout.tsx and template.tsx?",
      "options": [
        "layout.tsx is for pages, template.tsx is for components",
        "layout.tsx persists across navigations (state preserved); template.tsx re-mounts on every navigation (no state)",
        "They are identical",
        "template.tsx is deprecated"
      ],
      "answer": 1,
      "explanation": "layout.tsx wraps child routes and maintains its state across navigations to child routes — the component is NOT re-mounted. template.tsx creates a new instance for each child, re-mounting on every navigation. Use template.tsx when you want CSS entry animations or need to re-run effects on route change."
    },
    {
      "q": "What does a (folder) in parentheses do in the app directory?",
      "options": [
        "Makes the route private",
        "Creates a route group — organizes files without adding a URL segment",
        "Creates a parallel route",
        "Marks the folder as a Server Component"
      ],
      "answer": 1,
      "explanation": "Route groups (folder) let you organize your app directory without affecting the URL structure. You can also use them to apply a different layout to a subset of routes while sharing the same URL prefix."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
