# Supabase Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace localStorage auth and progress with Supabase (real auth + Postgres database), keeping the app frontend-only.

**Architecture:** Supabase client SDK connects directly from the browser. Auth uses Supabase Auth (email/password). Progress data stored in a `lesson_progress` Postgres table with Row Level Security (RLS) so users can only read/write their own data. The existing `AuthContext` and `progress.ts` interfaces stay the same — only the underlying implementation changes.

**Tech Stack:** `@supabase/supabase-js`, Supabase Auth, Supabase Postgres + RLS

---

## Prerequisites (Manual — Do Before Running Tasks)

### Step A: Create Supabase Project

1. Go to https://supabase.com and sign up (free tier)
2. Click "New Project"
3. Name it `grokking`, choose a region close to you, set a database password
4. Wait for project to provision (~2 minutes)

### Step B: Get Your Keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these two values:
   - `Project URL` (looks like `https://abcdefg.supabase.co`)
   - `anon public` key (starts with `eyJ...`)
3. Create a file `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> These are safe to expose in the browser — RLS protects the data.

### Step C: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Run this SQL:

```sql
-- Lesson progress table
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_slug text not null,
  lesson_id text not null,
  completed_at timestamptz default now() not null,
  unique(user_id, course_slug, lesson_id)
);

-- Enable Row Level Security
alter table public.lesson_progress enable row level security;

-- Users can only see their own progress
create policy "Users read own progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

-- Users can only insert their own progress
create policy "Users insert own progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own progress
create policy "Users delete own progress"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);

-- Index for fast lookups
create index idx_progress_user_course
  on public.lesson_progress(user_id, course_slug);
```

3. Verify: Go to **Table Editor** and confirm `lesson_progress` table exists

### Step D: Configure Auth Settings

1. In Supabase dashboard, go to **Authentication → Providers**
2. Ensure **Email** provider is enabled (it is by default)
3. Optional: Disable "Confirm email" under **Authentication → Settings** if you want instant signup without email verification (recommended for development)

---

## Task 1: Install Supabase SDK + Create Client

**Files:**
- Modify: `package.json` (add dependency)
- Create: `src/lib/supabase.ts`

**Step 1: Install the package**

Run:
```bash
npm install @supabase/supabase-js
```

**Step 2: Create the Supabase client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Step 3: Verify it compiles**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds (the client is created but not used yet)

**Step 4: Commit**

```bash
git add src/lib/supabase.ts package.json package-lock.json
git commit -m "feat: add Supabase client SDK"
```

---

## Task 2: Replace Auth with Supabase Auth

**Files:**
- Rewrite: `src/lib/auth.ts`
- Modify: `src/contexts/AuthContext.tsx`

**Step 1: Rewrite `src/lib/auth.ts`**

Replace the entire file with:

```typescript
import { supabase } from "./supabase";

export interface Session {
  userId: string;
  name: string;
  email: string;
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  if (!name.trim()) {
    return { ok: false, error: "Name is required." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: { name: name.trim() },
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data.user) {
    return { ok: false, error: "Signup failed. Please try again." };
  }

  const session: Session = {
    userId: data.user.id,
    name: name.trim(),
    email: data.user.email ?? email,
  };

  return { ok: true, session };
}

export async function login(
  email: string,
  password: string
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data.user) {
    return { ok: false, error: "Login failed. Please try again." };
  }

  const session: Session = {
    userId: data.user.id,
    name: (data.user.user_metadata?.name as string) ?? "User",
    email: data.user.email ?? email,
  };

  return { ok: true, session };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;

  const user = data.session.user;
  return {
    userId: user.id,
    name: (user.user_metadata?.name as string) ?? "User",
    email: user.email ?? "",
  };
}
```

**Key changes:**
- `signup/login` now call Supabase Auth instead of localStorage
- `logout` is now async
- `getSession` is now async
- No more `User` type or `passwordHash` — Supabase handles all that
- Name stored in `user_metadata`

**Step 2: Update `src/contexts/AuthContext.tsx`**

Replace the entire file with:

```typescript
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getSession,
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  type Session,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: Session | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    getSession().then((session) => {
      setUser(session);
      setLoading(false);
    });

    // Listen for auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            userId: session.user.id,
            name: (session.user.user_metadata?.name as string) ?? "User",
            email: session.user.email ?? "",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result.ok) {
      setUser(result.session);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await authSignup(name, email, password);
      if (result.ok) {
        setUser(result.session);
        return { ok: true };
      }
      return { ok: false, error: result.error };
    },
    []
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

**Key changes:**
- `getSession()` is now awaited (async)
- Added `onAuthStateChange` listener for real-time auth state sync
- Cleanup subscription on unmount

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Manual test**

1. Open `http://localhost:3000/signup`
2. Create an account with any email/password
3. Verify you're redirected to home and see your name
4. Refresh the page — should still be logged in
5. Log out, then log back in
6. Check Supabase dashboard → Authentication → Users — your user should appear

**Step 5: Commit**

```bash
git add src/lib/auth.ts src/contexts/AuthContext.tsx
git commit -m "feat: replace localStorage auth with Supabase Auth"
```

---

## Task 3: Replace Progress with Supabase Database

**Files:**
- Rewrite: `src/lib/progress.ts`

**Step 1: Rewrite `src/lib/progress.ts`**

Replace the entire file with:

```typescript
import { supabase } from "./supabase";

export async function getCompletedLessons(courseSlug: string): Promise<Set<string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Set();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", session.user.id)
    .eq("course_slug", courseSlug);

  if (error || !data) return new Set();
  return new Set(data.map((row) => row.lesson_id));
}

export async function markLessonComplete(
  courseSlug: string,
  lessonId: string
): Promise<Set<string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Set();

  await supabase.from("lesson_progress").upsert(
    {
      user_id: session.user.id,
      course_slug: courseSlug,
      lesson_id: lessonId,
    },
    { onConflict: "user_id,course_slug,lesson_id" }
  );

  return getCompletedLessons(courseSlug);
}

export async function markLessonIncomplete(
  courseSlug: string,
  lessonId: string
): Promise<Set<string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Set();

  await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", session.user.id)
    .eq("course_slug", courseSlug)
    .eq("lesson_id", lessonId);

  return getCompletedLessons(courseSlug);
}

export async function getCourseProgress(
  courseSlug: string,
  totalLessons: number
): Promise<number> {
  if (totalLessons <= 0) return 0;
  const completed = await getCompletedLessons(courseSlug);
  return Math.round((completed.size / totalLessons) * 100);
}
```

**Key changes:**
- All functions are now `async` (return `Promise`)
- Data stored in Supabase `lesson_progress` table
- RLS ensures users only see their own progress
- `upsert` prevents duplicate entries
- Falls back to empty set if not authenticated

**Step 2: Commit**

```bash
git add src/lib/progress.ts
git commit -m "feat: replace localStorage progress with Supabase database"
```

---

## Task 4: Update LessonPage to Use Async Progress

**Files:**
- Modify: `src/components/lesson/LessonPage.tsx`

**Step 1: Update LessonPage**

The progress functions are now async. Update `src/components/lesson/LessonPage.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import CourseLayout from "@/components/layout/CourseLayout";
import { SidebarModule } from "@/components/layout/Sidebar";
import LessonContent from "./LessonContent";
import LessonNav from "./LessonNav";
import IDEPanel from "@/components/ide/IDEPanel";
import {
  getCompletedLessons,
  getCourseProgress,
  markLessonComplete,
  markLessonIncomplete,
} from "@/lib/progress";

interface LessonPageProps {
  courseTitle: string;
  courseSlug: string;
  modules: SidebarModule[];
  lesson: {
    id: string;
    slug: string;
    title: string;
    content: string;
    starterCode?: string;
    solutionCode?: string;
  };
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
  totalLessons: number;
}

export default function LessonPage({
  courseTitle,
  courseSlug,
  modules,
  lesson,
  prevLesson,
  nextLesson,
  totalLessons,
}: LessonPageProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadProgress() {
      const completed = await getCompletedLessons(courseSlug);
      setCompletedLessons(completed);
      const pct = await getCourseProgress(courseSlug, totalLessons);
      setProgress(pct);
    }
    loadProgress();
  }, [courseSlug, totalLessons]);

  const toggleComplete = async () => {
    let updated: Set<string>;
    if (completedLessons.has(lesson.id)) {
      updated = await markLessonIncomplete(courseSlug, lesson.id);
    } else {
      updated = await markLessonComplete(courseSlug, lesson.id);
    }
    setCompletedLessons(updated);
    setProgress(Math.round((updated.size / totalLessons) * 100));
  };

  return (
    <CourseLayout
      courseTitle={courseTitle}
      courseSlug={courseSlug}
      modules={modules}
      currentLessonId={lesson.id}
      completedLessons={completedLessons}
      progress={progress}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {lesson.title}
        </h1>

        <LessonContent content={lesson.content} />

        {lesson.starterCode && lesson.solutionCode && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 gradient-text-subtle">
              Try it yourself
            </h2>
            <IDEPanel
              starterCode={lesson.starterCode}
              solutionCode={lesson.solutionCode}
            />
          </div>
        )}

        <LessonNav
          courseSlug={courseSlug}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          isCompleted={completedLessons.has(lesson.id)}
          onToggleComplete={toggleComplete}
        />
      </div>
    </CourseLayout>
  );
}
```

**Key changes:**
- `useEffect` now uses async function for `getCompletedLessons` and `getCourseProgress`
- `toggleComplete` is now `async`

**Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Manual test**

1. Open a lesson page
2. Click "Mark Complete" — should persist
3. Refresh the page — should still show completed
4. Open a different browser/incognito — same account should show same progress
5. Check Supabase dashboard → Table Editor → `lesson_progress` — rows should appear

**Step 4: Commit**

```bash
git add src/components/lesson/LessonPage.tsx
git commit -m "feat: wire LessonPage to async Supabase progress"
```

---

## Task 5: Add `.env.local` to `.gitignore`

**Files:**
- Modify: `.gitignore`

**Step 1: Ensure `.env.local` is not committed**

Run:
```bash
echo "" >> .gitignore && echo "# Supabase" >> .gitignore && echo ".env.local" >> .gitignore
```

**Step 2: Create `.env.local.example` for other developers**

Create `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Step 3: Commit**

```bash
git add .gitignore .env.local.example
git commit -m "chore: add .env.local.example and gitignore Supabase keys"
```

---

## Task 6: Clean Up Old localStorage Code

**Files:**
- Verify: `src/lib/auth.ts` (no localStorage references)
- Verify: `src/lib/progress.ts` (no localStorage references)

**Step 1: Search for any remaining localStorage usage**

Run:
```bash
grep -r "localStorage" src/
```

Expected: Only `src/components/layout/TopNav.tsx` (theme toggle) should remain. Auth and progress should have zero localStorage references.

**Step 2: Final build + test**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git commit --allow-empty -m "chore: verify localStorage cleanup complete"
```

---

## Summary of Changes

| File | Before | After |
|------|--------|-------|
| `src/lib/supabase.ts` | *(new)* | Supabase client singleton |
| `src/lib/auth.ts` | localStorage + SHA-256 | Supabase Auth SDK |
| `src/lib/progress.ts` | localStorage JSON | Supabase Postgres + RLS |
| `src/contexts/AuthContext.tsx` | Sync getSession | Async + onAuthStateChange listener |
| `src/components/lesson/LessonPage.tsx` | Sync progress calls | Async progress calls |
| `.env.local` | *(new)* | Supabase URL + anon key |
| `.env.local.example` | *(new)* | Template for other devs |

**What stays the same:**
- All UI components (pages, forms, buttons) — zero visual changes
- `Session` type interface (userId, name, email)
- Progress function signatures (just async now)
- Theme toggle (still localStorage — that's fine, it's not user data)

**What you get:**
- Real authentication (password hashing, JWT tokens, session refresh)
- Progress syncs across devices and browsers
- Data persists even if browser cache is cleared
- Free tier: 50K monthly active users, 500MB database
- Ready for future features: social auth (Google/GitHub), user profiles, leaderboards
