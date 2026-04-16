import { Module } from "../types";

export const module3: Module = {
  id: "server-actions-data",
  title: "Server Actions, Data Fetching & Caching",
  description: "Mutations with Server Actions, Next.js fetch caching, revalidation strategies, and the cache API",
  lessons: [
    {
      id: "server-actions",
      slug: "server-actions",
      title: "Server Actions & Mutations",
      content: `
# Server Actions

Server Actions let you call server-side code directly from Client Components — no API route needed.

\`\`\`typescript
// app/actions.ts — define server actions
'use server'; // marks all exports as Server Actions

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  published: z.boolean().default(false),
});

// Server Action — runs on server, called from client
export async function createPost(formData: FormData) {
  const raw = {
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'on',
  };

  const parsed = CreatePostSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const post = await db.post.create({
    data: { ...parsed.data, authorId: getCurrentUserId() },
  });

  revalidatePath('/blog');      // clear cache for /blog
  revalidateTag('posts');       // clear all cached fetches tagged 'posts'
  redirect(\`/blog/\${post.slug}\`); // server-side redirect
}

// Action that returns data (not FormData):
export async function updatePost(id: string, updates: Partial<Post>) {
  const post = await db.post.update({ where: { id }, data: updates });
  revalidatePath(\`/blog/\${post.slug}\`);
  return { success: true, post };
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath('/blog');
  redirect('/blog');
}
\`\`\`

## Using Server Actions in Components

\`\`\`typescript
// Form with Server Action (works without JS!)
export default function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" required minLength={3} />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}

// Client Component with useTransition for loading state:
'use client';
import { useTransition } from 'react';
import { createPost } from './actions';

export function CreatePostClient() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(() => createPost(formData));
  }

  return (
    <form action={handleSubmit}>
      <input name="title" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}

// Using useActionState (React 19 / Next.js 15):
'use client';
import { useActionState } from 'react';
import { createPost } from './actions';

export function CreatePostForm() {
  const [state, action, isPending] = useActionState(createPost, null);

  return (
    <form action={action}>
      {state?.error && <p className="text-red-500">{state.error.title}</p>}
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
\`\`\`

## Data Fetching & Caching

\`\`\`typescript
// Next.js extends fetch with caching options:

// 1. Cached (SSG-like) — cache forever, revalidate on demand:
const data = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] } // tag for revalidateTag()
});

// 2. Time-based revalidation (ISR-like):
const data = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 } // revalidate every 60 seconds
});

// 3. No cache (SSR-like) — fresh every request:
const data = await fetch('https://api.example.com/posts', {
  cache: 'no-store'
});

// Route-level cache control:
// In page.tsx:
export const revalidate = 60;     // revalidate all fetches every 60s
export const dynamic = 'force-dynamic'; // disable caching for this route
export const dynamic = 'force-static';  // always static, error if dynamic

// React's cache() for deduplication across server components:
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});
// Multiple Server Components calling getUser(id) with same id
// → only ONE DB query (deduplicated within request)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the advantage of Server Actions over API routes for mutations?",
      "options": [
        "No advantage",
        "Less boilerplate — call server functions directly, automatic CSRF protection, works without JS (native form), co-located with components",
        "Server Actions are faster",
        "API routes don't support POST"
      ],
      "answer": 1,
      "explanation": "Server Actions eliminate the need to create separate API routes for mutations. They're called directly from components, have automatic CSRF protection, work with progressive enhancement (native HTML forms), and can be co-located with the components that use them."
    },
    {
      "q": "What does revalidatePath('/blog') do?",
      "options": [
        "Deletes the /blog page",
        "Purges cached data for /blog — next visit will re-fetch fresh data",
        "Redirects to /blog",
        "Validates that /blog exists"
      ],
      "answer": 1,
      "explanation": "revalidatePath() triggers cache invalidation for the specified route. On the next request to that route, Next.js will re-fetch data and regenerate the page. Use it after mutations to ensure users see fresh data."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
