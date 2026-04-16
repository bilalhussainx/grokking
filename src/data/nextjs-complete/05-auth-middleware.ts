import { Module } from "../types";

export const module5: Module = {
  id: "auth-middleware",
  title: "Authentication, Middleware & Route Protection",
  description: "Implementing auth with NextAuth.js/Clerk, middleware for route protection, and session management",
  lessons: [
    {
      id: "auth-nextauth",
      slug: "auth-nextauth",
      title: "Authentication & Route Protection",
      content: `
# Authentication in Next.js

## API Routes (route.ts)

\`\`\`typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  const posts = await db.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ posts, page, limit });
}

// POST /api/posts
export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const post = await db.post.create({
    data: { ...body, authorId: session.user.id },
  });

  return NextResponse.json(post, { status: 201 });
}

// app/api/posts/[id]/route.ts — dynamic API route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.post.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
\`\`\`

## Middleware for Route Protection

\`\`\`typescript
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = ['/', '/login', '/signup', '/about'].includes(
    request.nextUrl.pathname
  );

  // Allow auth routes and public routes:
  if (isAuthRoute || isPublicRoute) return NextResponse.next();

  // Redirect unauthenticated users:
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: validate token, check roles:
  const payload = validateToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // Pass user info via headers to server components:
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Configure which paths middleware runs on:
export const config = {
  matcher: [
    // Skip static files, _next internals:
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
\`\`\`

## Clerk Authentication (recommended)

\`\`\`typescript
// Install: npm install @clerk/nextjs

// middleware.ts with Clerk:
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect(); // redirects to sign-in if not authenticated
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

// app/layout.tsx:
import { ClerkProvider, UserButton } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <nav>
            <UserButton afterSignOutUrl="/" />
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

// In Server Components:
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  return <div>Hello, {user?.firstName}</div>;
}

// In Client Components:
'use client';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

export function Header() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  return user ? <SignOutButton /> : <SignInButton />;
}
\`\`\`

## Environment Variables

\`\`\`typescript
// .env.local — never committed to git
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key

// NEXT_PUBLIC_ prefix = exposed to browser:
NEXT_PUBLIC_STRIPE_KEY=pk_test_...

// Access in code:
// Server-only (any env var):
process.env.DATABASE_URL

// Client (only NEXT_PUBLIC_):
process.env.NEXT_PUBLIC_STRIPE_KEY

// Type-safe env with zod:
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
// Throws at startup if any required var is missing!
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Where does Next.js middleware run?",
      "options": [
        "In the browser",
        "On the server before every request — at the Edge, before the page is rendered",
        "Only for API routes",
        "In a worker thread"
      ],
      "answer": 1,
      "explanation": "Next.js middleware runs at the Edge (before caching) on every matching request. It can read/set cookies, redirect, rewrite URLs, and add headers — before the request reaches your Server Components or API routes. This makes it ideal for auth gating."
    },
    {
      "q": "Why must NEXT_PUBLIC_ prefix be added for browser-accessible env vars?",
      "options": [
        "Performance reasons",
        "Next.js inlines NEXT_PUBLIC_ vars at build time for the client bundle; without the prefix, vars are server-only and never shipped to the browser",
        "Browser APIs require it",
        "It's a convention, not a requirement"
      ],
      "answer": 1,
      "explanation": "Server-side env vars (like DATABASE_URL, JWT_SECRET) must NEVER reach the browser. Next.js only inlines vars prefixed with NEXT_PUBLIC_ into the client bundle. This is a security feature that prevents accidental secret exposure."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Server Components are the default — only add 'use client' when you need hooks or browser APIs", "Server Actions replace most API routes for mutations — less code, automatic CSRF protection", "next/image prevents layout shift and auto-optimizes format/size — always use it over <img>", "next/font self-hosts fonts at build time — zero layout shift, no Google request at runtime", "Middleware runs at the Edge before every request — use it for auth, redirects, header injection", "fetch() in Server Components can be tagged and revalidated — ISR is built into the data layer", "Use generateStaticParams for dynamic routes you want static at build time", "Parallel fetch with Promise.all, stream with Suspense — never await things sequentially when you don't have to"]
\`\`\`
`,
    },
  ],
};
