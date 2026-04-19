# Counselor-Share Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let students generate a single share link that gives counselors, parents, and mentors a read-only view of selected CC data without needing an account.

**Architecture:** One `cc_share_links` row per student with a 32-char hex token. JSONB `visible_sections` controls which of 5 sections are shown. Three authenticated API routes manage the link; one public route returns data for enabled sections. A settings page has toggles + link management; a public page renders the read-only view.

**Tech Stack:** Next.js 14 App Router, Supabase (PostgreSQL), TypeScript, Tailwind CSS, Lucide icons

---

### Task 1: Database Migration File

**Files:**
- Create: `supabase/migrations/031_share_links.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- 031_share_links.sql
-- Unified share links for CC student portfolios

CREATE TABLE cc_share_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES cc_student_profiles(id),
  share_token text NOT NULL UNIQUE,
  visible_sections jsonb NOT NULL DEFAULT '{"essays":true,"activities":true,"schoolList":true,"recommendations":true,"interviewScores":true}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_share_links_student ON cc_share_links(student_id);
CREATE INDEX idx_share_links_token ON cc_share_links(share_token) WHERE is_active = true;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/031_share_links.sql
git commit -m "feat(credentials): cc_share_links migration"
```

---

### Task 2: Share Link Management API (POST / PATCH / GET)

**Files:**
- Create: `src/app/api/cc/share-link/route.ts`

**Context:** Uses `requireAuth()`, `unauthorized()`, `createAdminSupabase()` from `src/app/api/cc/helpers.ts`. Token generation uses `randomBytes(16).toString("hex")` matching the existing essay share pattern in `src/app/api/cc/essays/[id]/share/route.ts`.

- [ ] **Step 1: Write the route file**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";
import { randomBytes } from "crypto";

interface VisibleSections {
  essays: boolean;
  activities: boolean;
  schoolList: boolean;
  recommendations: boolean;
  interviewScores: boolean;
}

const DEFAULT_SECTIONS: VisibleSections = {
  essays: true,
  activities: true,
  schoolList: true,
  recommendations: true,
  interviewScores: true,
};

function buildShareUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://kairos.ai";
  return `${base}/cc/shared/${token}`;
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ shareLink: null });
  }

  const { data: link } = await db
    .from("cc_share_links")
    .select("share_token, visible_sections, is_active")
    .eq("student_id", profile.id)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ shareLink: null });
  }

  return NextResponse.json({
    shareLink: {
      shareToken: link.share_token,
      shareUrl: buildShareUrl(link.share_token),
      visibleSections: link.visible_sections,
      isActive: link.is_active,
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const { data: existing } = await db
    .from("cc_share_links")
    .select("share_token, visible_sections, is_active")
    .eq("student_id", profile.id)
    .eq("is_active", true)
    .single();

  if (existing) {
    return NextResponse.json({
      shareToken: existing.share_token,
      shareUrl: buildShareUrl(existing.share_token),
      visibleSections: existing.visible_sections,
      isActive: existing.is_active,
    });
  }

  const body = await req.json().catch(() => ({}));
  const visibleSections = { ...DEFAULT_SECTIONS, ...(body.visibleSections || {}) };
  const shareToken = randomBytes(16).toString("hex");

  const { error } = await db
    .from("cc_share_links")
    .insert({
      student_id: profile.id,
      share_token: shareToken,
      visible_sections: visibleSections,
    });

  if (error) {
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }

  return NextResponse.json({
    shareToken,
    shareUrl: buildShareUrl(shareToken),
    visibleSections,
    isActive: true,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: link } = await db
    .from("cc_share_links")
    .select("id, share_token, visible_sections")
    .eq("student_id", profile.id)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ error: "No active share link" }, { status: 404 });
  }

  const body = await req.json();

  if (body.revoke === true) {
    await db
      .from("cc_share_links")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", link.id);
    return NextResponse.json({ revoked: true });
  }

  if (body.visibleSections) {
    const updated = { ...(link.visible_sections as VisibleSections), ...body.visibleSections };
    await db
      .from("cc_share_links")
      .update({ visible_sections: updated, updated_at: new Date().toISOString() })
      .eq("id", link.id);
    return NextResponse.json({
      shareToken: link.share_token,
      shareUrl: buildShareUrl(link.share_token),
      visibleSections: updated,
      isActive: true,
    });
  }

  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}
```

- [ ] **Step 2: Test manually**

Start dev server, verify:
1. `GET /api/cc/share-link` returns `{ shareLink: null }` when no link exists
2. `POST /api/cc/share-link` creates a new link with 32-char hex token
3. `GET /api/cc/share-link` now returns the active link
4. `PATCH /api/cc/share-link` with `{ visibleSections: { essays: false } }` updates
5. `PATCH /api/cc/share-link` with `{ revoke: true }` deactivates
6. `GET /api/cc/share-link` returns `null` after revocation
7. `POST /api/cc/share-link` creates a new token after revocation

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/share-link/route.ts
git commit -m "feat(share): POST/PATCH/GET share-link management API"
```

---

### Task 3: Public Shared View Data API

**Files:**
- Create: `src/app/api/cc/shared/[token]/route.ts`

**Context:** No authentication required. Looks up `cc_share_links` by token, then fetches student data from the same tables used by authenticated routes: `cc_student_profiles` (name via `preferred_name || legal_first_name`), `cc_essays` (type, prompt, content, word_count, phase), `cc_activities` (position, activity_type, organization, role, description_150, hours_per_week), `cc_honors` (title, level, description_100), `cc_student_schools` joined with `cc_schools`, `cc_recommenders` (name, recommender_type, subject, status), and `interview_sessions` + `interview_performance` for scores.

- [ ] **Step 1: Write the public API route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-server";

const REC_LABELS: Record<number, string> = {
  1: "Do not recommend",
  2: "Recommend with concerns",
  3: "Neutral",
  4: "Recommend",
  5: "Strongly recommend",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = createAdminSupabase();

  const { data: link } = await db
    .from("cc_share_links")
    .select("student_id, visible_sections, is_active")
    .eq("share_token", token)
    .eq("is_active", true)
    .single();

  if (!link) {
    return NextResponse.json({ error: "Link not active" }, { status: 404 });
  }

  const sections = link.visible_sections as Record<string, boolean>;
  const studentId = link.student_id;

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("preferred_name, legal_first_name")
    .eq("id", studentId)
    .single();

  const studentName = profile?.preferred_name || profile?.legal_first_name || "Student";

  const result: Record<string, unknown> = {
    studentName,
    visibleSections: sections,
  };

  if (sections.essays) {
    const { data: essays } = await db
      .from("cc_essays")
      .select("essay_type, prompt_text, content, word_count, phase")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false });
    result.essays = (essays || []).map((e) => ({
      essayType: e.essay_type,
      promptText: e.prompt_text,
      content: e.content,
      wordCount: e.word_count,
      phase: e.phase,
    }));
  }

  if (sections.activities) {
    const { data: activities } = await db
      .from("cc_activities")
      .select("position, activity_type, organization, role, description_150, hours_per_week")
      .eq("student_id", studentId)
      .order("position");
    result.activities = (activities || []).map((a) => ({
      position: a.position,
      activityType: a.activity_type,
      organization: a.organization,
      role: a.role,
      description150: a.description_150,
      hoursPerWeek: a.hours_per_week,
    }));

    const { data: honors } = await db
      .from("cc_honors")
      .select("title, level, description_100")
      .eq("student_id", studentId)
      .order("position");
    result.honors = (honors || []).map((h) => ({
      title: h.title,
      level: h.level,
      description100: h.description_100,
    }));
  }

  if (sections.schoolList) {
    const { data: schools } = await db
      .from("cc_student_schools")
      .select("application_status, cc_schools(name, city, state)")
      .eq("student_id", studentId);
    result.schoolList = (schools || []).map((s) => {
      const school = s.cc_schools as { name: string; city: string; state: string } | null;
      return {
        schoolName: school?.name || "Unknown",
        city: school?.city || "",
        state: school?.state || "",
        applicationStatus: s.application_status,
      };
    });
  }

  if (sections.recommendations) {
    const { data: recs } = await db
      .from("cc_recommenders")
      .select("name, recommender_type, subject, status")
      .eq("student_id", studentId)
      .order("created_at");
    result.recommendations = (recs || []).map((r) => ({
      name: r.name,
      recommenderType: r.recommender_type,
      subject: r.subject,
      status: r.status,
    }));
  }

  if (sections.interviewScores) {
    const { data: profileRow } = await db
      .from("cc_student_profiles")
      .select("user_id")
      .eq("id", studentId)
      .single();

    if (profileRow) {
      const { data: sessions } = await db
        .from("interview_sessions")
        .select("id, college_persona_id, status")
        .eq("user_id", profileRow.user_id)
        .eq("category", "college")
        .not("college_persona_id", "is", null);

      if (sessions && sessions.length > 0) {
        const sessionIds = sessions.map((s) => s.id);
        const { data: perfs } = await db
          .from("interview_performance")
          .select("session_id, overall_score")
          .in("session_id", sessionIds);

        const scoreMap = new Map<string, number>();
        for (const p of perfs || []) {
          scoreMap.set(p.session_id, p.overall_score);
        }

        const grouped: Record<string, { totalSessions: number; currentArcStep: number; latestRecommendation: string }> = {};
        for (const s of sessions) {
          const pid = s.college_persona_id as string;
          if (!grouped[pid]) {
            grouped[pid] = { totalSessions: 0, currentArcStep: 1, latestRecommendation: "Neutral" };
          }
          grouped[pid].totalSessions += 1;
        }
        for (const pid of Object.keys(grouped)) {
          const g = grouped[pid];
          g.currentArcStep = Math.min(g.totalSessions + 1, 4);

          const pidSessions = sessions.filter((s) => s.college_persona_id === pid);
          const scores = pidSessions
            .map((s) => scoreMap.get(s.id))
            .filter((x): x is number => x !== undefined);

          if (scores.length > 0) {
            const latest = scores[scores.length - 1];
            const rec = Math.max(1, Math.min(5, Math.round((latest / 10) * 5)));
            g.latestRecommendation = REC_LABELS[rec] || "Neutral";
          }
        }
        result.interviewScores = grouped;
      }
    }
  }

  return NextResponse.json(result);
}
```

- [ ] **Step 2: Test manually**

With a valid share token from Task 2, verify:
1. `GET /api/cc/shared/<token>` returns student data with only enabled sections
2. Invalid token returns `{ error: "Link not active" }` with 404
3. Toggling a section off via PATCH removes it from the public response

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/shared/[token]/route.ts
git commit -m "feat(share): public shared view data API"
```

---

### Task 4: Middleware Update

**Files:**
- Modify: `src/middleware.ts:24` — add `/cc/shared` to `PUBLIC_PREFIXES`

- [ ] **Step 1: Add the prefix**

In `src/middleware.ts`, find the `PUBLIC_PREFIXES` array and add `"/cc/shared"` and `"/api/cc/shared/"` to it:

```typescript
// Before:
const PUBLIC_PREFIXES = ["/ref/", "/_next/", "/favicon", "/api/webhooks/", "/api/admin/", "/api/courses/", "/api/submissions", "/api/call/", "/api/cc/intake/", "/talk", "/call", "/career", "/admin/survey", "/landing", "/blog", "/about", "/comparison", "/pathways", "/tools", "/privacy", "/terms", "/interviews", "/college-interviews", "/history", "/achievements", "/leaderboard", "/faq", "/intake"];

// After:
const PUBLIC_PREFIXES = ["/ref/", "/_next/", "/favicon", "/api/webhooks/", "/api/admin/", "/api/courses/", "/api/submissions", "/api/call/", "/api/cc/intake/", "/api/cc/shared/", "/talk", "/call", "/career", "/admin/survey", "/landing", "/blog", "/about", "/comparison", "/pathways", "/tools", "/privacy", "/terms", "/interviews", "/college-interviews", "/history", "/achievements", "/leaderboard", "/faq", "/intake", "/cc/shared"];
```

Two additions: `"/api/cc/shared/"` (public API route) and `"/cc/shared"` (public page).

- [ ] **Step 2: Verify**

Run: `npm run build` — confirm no middleware errors.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(share): add /cc/shared to public prefixes"
```

---

### Task 5: Share Settings Page

**Files:**
- Create: `src/app/cc/share-settings/layout.tsx`
- Create: `src/app/cc/share-settings/page.tsx`

**Context:** Follows the same "use client" pattern as other CC pages (e.g., `src/app/cc/activities-optimizer/page.tsx`). Dark theme with `bg-[#141414]`, white text, gold accent (`#D4AF37`). Uses Lucide icons. Auto-saves toggle changes via PATCH with 1s debounce.

- [ ] **Step 1: Write the layout**

```typescript
import type { ReactNode } from "react";

export const metadata = {
  title: "Share Settings — Kairos.ai",
  description: "Generate a share link for counselors and mentors",
};

export default function ShareSettingsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Write the settings page**

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Link2, Copy, Check, Loader2, Trash2, Share2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface VisibleSections {
  essays: boolean;
  activities: boolean;
  schoolList: boolean;
  recommendations: boolean;
  interviewScores: boolean;
}

const SECTION_META: { key: keyof VisibleSections; label: string; description: string }[] = [
  { key: "essays", label: "Essays", description: "Your essay drafts and prompts" },
  { key: "activities", label: "Activities & Honors", description: "Your Common App activities list" },
  { key: "schoolList", label: "School List", description: "Schools you're applying to with status" },
  { key: "recommendations", label: "Recommendations", description: "Your recommender list and status" },
  { key: "interviewScores", label: "Interview Scores", description: "Practice interview scorecards" },
];

export default function ShareSettingsPage() {
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sections, setSections] = useState<VisibleSections>({
    essays: true,
    activities: true,
    schoolList: true,
    recommendations: true,
    interviewScores: true,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/cc/share-link")
      .then((r) => r.json())
      .then((data) => {
        if (data.shareLink) {
          setShareToken(data.shareLink.shareToken);
          setShareUrl(data.shareLink.shareUrl);
          setSections(data.shareLink.visibleSections);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const generateLink = async () => {
    setGenerating(true);
    const res = await fetch("/api/cc/share-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibleSections: sections }),
    });
    const data = await res.json();
    if (data.shareToken) {
      setShareToken(data.shareToken);
      setShareUrl(data.shareUrl);
      setSections(data.visibleSections);
    }
    setGenerating(false);
  };

  const toggleSection = (key: keyof VisibleSections) => {
    const updated = { ...sections, [key]: !sections[key] };
    setSections(updated);

    if (!shareToken) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch("/api/cc/share-link", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibleSections: updated }),
      });
    }, 1000);
  };

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revokeLink = async () => {
    if (!confirmRevoke) {
      setConfirmRevoke(true);
      return;
    }
    setRevoking(true);
    await fetch("/api/cc/share-link", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoke: true }),
    });
    setShareToken(null);
    setShareUrl(null);
    setConfirmRevoke(false);
    setRevoking(false);
    setSections({
      essays: true,
      activities: true,
      schoolList: true,
      recommendations: true,
      interviewScores: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 max-w-2xl mx-auto">
      <Link href="/cc" className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Coach Kairos
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Share2 className="w-6 h-6 text-[#D4AF37]" />
        <h1 className="text-2xl font-bold">Share with Counselor</h1>
      </div>
      <p className="text-white/60 mb-8">
        Generate a link to share your college application progress with counselors, parents, or mentors. They won't need an account.
      </p>

      <div className="space-y-3 mb-8">
        {SECTION_META.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => toggleSection(key)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <div className="text-left">
              <div className="font-medium">{label}</div>
              <div className="text-sm text-white/50">{description}</div>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition ${sections[key] ? "bg-[#D4AF37]" : "bg-white/20"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${sections[key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>
        ))}
      </div>

      {!shareToken ? (
        <button
          onClick={generateLink}
          disabled={generating}
          className="w-full py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#C4A030] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Link2 className="w-4 h-4" /> Generate Share Link</>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl || ""}
              className="flex-1 bg-transparent text-sm text-white/80 outline-none truncate"
            />
            <button
              onClick={copyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#D4AF37] text-black text-sm font-medium hover:bg-[#C4A030] shrink-0"
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <button
            onClick={revokeLink}
            disabled={revoking}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {revoking ? "Revoking..." : confirmRevoke ? "Click again to confirm revocation" : "Revoke Link"}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Test in browser**

1. Navigate to `/cc/share-settings`
2. All 5 toggles should be ON by default
3. Click "Generate Share Link" — URL appears
4. Copy link — clipboard should have the URL
5. Toggle a section off — wait 1s — the PATCH should fire
6. Click "Revoke Link" — confirmation appears — click again — UI resets
7. Generate a new link — new token should differ from the old one

- [ ] **Step 4: Commit**

```bash
git add src/app/cc/share-settings/layout.tsx src/app/cc/share-settings/page.tsx
git commit -m "feat(share): share settings page with toggles"
```

---

### Task 6: Public Shared View Page

**Files:**
- Create: `src/app/cc/shared/[token]/layout.tsx`
- Create: `src/app/cc/shared/[token]/page.tsx`

**Context:** Server component (no `"use client"`). Fetches data from `GET /api/cc/shared/[token]` at render time using the internal URL. Dark theme matching the settings page. Shows Kairos.ai branding. Only renders cards for enabled sections.

- [ ] **Step 1: Write the layout with dynamic OG metadata**

```typescript
import type { ReactNode } from "react";
import type { Metadata } from "next";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { token } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cc/shared/${token}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        title: "Shared Portfolio — Kairos.ai",
        description: "Shared college application materials",
      };
    }
    const data = await res.json();
    return {
      title: `${data.studentName}'s College Application Portfolio — Kairos.ai`,
      description: "Shared college application materials",
      openGraph: {
        title: `${data.studentName}'s College Application Portfolio — Kairos.ai`,
        description: "Shared college application materials",
      },
    };
  } catch {
    return {
      title: "Shared Portfolio — Kairos.ai",
      description: "Shared college application materials",
    };
  }
}

export default function SharedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Write the public shared view page**

```typescript
import { notFound } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

interface SharedData {
  studentName: string;
  visibleSections: Record<string, boolean>;
  essays?: { essayType: string; promptText: string; content: string; wordCount: number; phase: string }[];
  activities?: { position: number; activityType: string; organization: string; role: string; description150: string; hoursPerWeek: number }[];
  honors?: { title: string; level: string; description100: string }[];
  schoolList?: { schoolName: string; city: string; state: string; applicationStatus: string }[];
  recommendations?: { name: string; recommenderType: string; subject: string; status: string }[];
  interviewScores?: Record<string, { totalSessions: number; currentArcStep: number; latestRecommendation: string }>;
}

async function fetchSharedData(token: string): Promise<SharedData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/cc/shared/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const STATUS_COLORS: Record<string, string> = {
  applying: "bg-blue-500/20 text-blue-300",
  applied: "bg-yellow-500/20 text-yellow-300",
  accepted: "bg-green-500/20 text-green-300",
  denied: "bg-red-500/20 text-red-300",
  deferred: "bg-orange-500/20 text-orange-300",
  waitlisted: "bg-purple-500/20 text-purple-300",
};

const ARC_LABELS = ["Assess Narrative", "Weak Areas", "Full Mock", "Essay Coaching"];

export default async function SharedViewPage({ params }: Props) {
  const { token } = await params;
  const data = await fetchSharedData(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white p-6">
        <div className="text-[#D4AF37] text-3xl font-bold mb-4">Kairos.ai</div>
        <p className="text-white/60 text-center max-w-md">
          This link is no longer active. Ask the student for a new one.
        </p>
      </div>
    );
  }

  const hasAnySections = Object.values(data.visibleSections).some(Boolean);

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 max-w-4xl mx-auto">
      <div className="text-[#D4AF37] text-sm font-semibold mb-1">Kairos.ai</div>
      <h1 className="text-2xl font-bold mb-6">{data.studentName}&apos;s College Application Portfolio</h1>

      {!hasAnySections && (
        <p className="text-white/50">No sections shared yet.</p>
      )}

      <div className="space-y-6">
        {data.essays && data.essays.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Essays</h2>
            <div className="space-y-4">
              {data.essays.map((e, i) => (
                <div key={i} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/70">{e.essayType.replace(/_/g, " ")}</span>
                    <span className="text-xs text-white/40">{e.wordCount} words &middot; {e.phase}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{e.promptText}</p>
                  {e.content && (
                    <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">{e.content}</pre>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.activities && data.activities.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Activities</h2>
            <div className="space-y-3">
              {data.activities.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xs text-white/40 mt-1 w-4 shrink-0">{a.position}.</span>
                  <div>
                    <div className="font-medium text-sm">{a.role || a.activityType}{a.organization ? ` — ${a.organization}` : ""}</div>
                    <p className="text-sm text-white/60">{a.description150}</p>
                    {a.hoursPerWeek && <span className="text-xs text-white/40">{a.hoursPerWeek} hrs/week</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.honors && data.honors.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Honors</h2>
            <div className="space-y-2">
              {data.honors.map((h, i) => (
                <div key={i}>
                  <div className="font-medium text-sm">{h.title} <span className="text-xs text-white/40">({h.level})</span></div>
                  <p className="text-sm text-white/60">{h.description100}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.schoolList && data.schoolList.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">School List</h2>
            <div className="grid gap-2">
              {data.schoolList.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <div className="font-medium text-sm">{s.schoolName}</div>
                    <div className="text-xs text-white/40">{s.city}, {s.state}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[s.applicationStatus] || "bg-white/10 text-white/60"}`}>
                    {s.applicationStatus}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Recommendations</h2>
            <div className="space-y-2">
              {data.recommendations.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-white/40">{r.recommenderType}{r.subject ? ` — ${r.subject}` : ""}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">{r.status}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.interviewScores && Object.keys(data.interviewScores).length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Interview Scores</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(data.interviewScores).map(([personaId, info]) => (
                <div key={personaId} className="p-3 rounded-lg bg-white/5">
                  <div className="font-medium text-sm capitalize">{personaId.replace(/-/g, " ").replace("undergrad", "").trim()}</div>
                  <div className="text-xs text-white/50 mt-1">{info.totalSessions} session{info.totalSessions !== 1 ? "s" : ""} completed</div>
                  <div className="flex gap-1 mt-2">
                    {ARC_LABELS.map((label, step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full ${step < info.totalSessions ? "bg-green-500" : step < info.currentArcStep ? "bg-[#D4AF37]" : "bg-white/10"}`}
                        title={label}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-white/60 mt-1">{info.latestRecommendation}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-12 text-center text-xs text-white/30">
        Powered by Kairos.ai
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Test in browser**

1. Open `/cc/shared/<valid-token>` — should show student name + enabled sections
2. Open `/cc/shared/invalid-token` — should show "This link is no longer active" message
3. Toggle off a section via share settings, reload shared page — section should disappear
4. Check OG metadata in page source (view-source or dev tools Network tab)

- [ ] **Step 4: Commit**

```bash
git add src/app/cc/shared/[token]/layout.tsx src/app/cc/shared/[token]/page.tsx
git commit -m "feat(share): public shared view page with section cards"
```

---

### Task 7: Delete Parent-Summary Stubs

**Files:**
- Delete: `src/app/api/cc/parent-summary/generate/route.ts`
- Delete: `src/app/api/cc/parent-summary/[share_token]/route.ts`

- [ ] **Step 1: Delete the stub files**

```bash
rm src/app/api/cc/parent-summary/generate/route.ts
rm src/app/api/cc/parent-summary/\[share_token\]/route.ts
rmdir src/app/api/cc/parent-summary/generate
rmdir src/app/api/cc/parent-summary/\[share_token\]
rmdir src/app/api/cc/parent-summary
```

- [ ] **Step 2: Verify no imports reference them**

```bash
grep -r "parent-summary" src/ --include="*.ts" --include="*.tsx"
```

Expected: no results (or only test/doc references).

- [ ] **Step 3: Commit**

```bash
git add -A src/app/api/cc/parent-summary/
git commit -m "chore: remove parent-summary stubs (replaced by share-link)"
```

---

### Task 8: Verify Build

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: no TypeScript errors, all pages compile successfully.

- [ ] **Step 2: Fix any build errors**

If errors, fix and re-run build.

- [ ] **Step 3: End-to-end verification**

Start dev server and walk through the full flow:
1. Go to `/cc/share-settings` — generate a link
2. Toggle some sections off
3. Copy the link, open in incognito — verify public view shows only enabled sections
4. Revoke the link — reload incognito — should show "no longer active"
5. Generate a new link — new URL — incognito shows data again
