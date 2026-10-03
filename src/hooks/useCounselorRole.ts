"use client";

// Tells the rest of the app whether the current user is a counselor,
// a student, or both (rare but possible — staff testing). Used by the
// nav layer to swap sidebars and by gated pages to bounce non-counselors.
//
// Cheap to call from anywhere — caches the lookup in localStorage so
// repeated mounts don't refetch on every navigation. The cache is
// invalidated on auth state change (handled by AuthContext).

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface CounselorRoleState {
  isCounselor: boolean;
  counselorId: string | null;
  counselorSlug: string | null;
  // Agency-workspace membership (additive — SP1). All null/false when the
  // user isn't a member of any agency. The sidebar still only reads
  // isCounselor; these fields drive role-aware workspace UI added later.
  agencyId: string | null;
  role: "head" | "counselor" | null;
  requiresReview: boolean;
  isMember: boolean;
  isHead: boolean;
  loading: boolean;
}

// Bumped to v2 because the cached shape gained agency-membership fields.
// v1 caches lack them, so reading a v1 blob would yield undefined for the
// new keys — a fresh key forces a clean refetch.
const CACHE_KEY = "cc_counselor_role_v2";

const EMPTY: Omit<CounselorRoleState, "loading"> = {
  isCounselor: false,
  counselorId: null,
  counselorSlug: null,
  agencyId: null,
  role: null,
  requiresReview: false,
  isMember: false,
  isHead: false,
};

type MeResponse = {
  counselor: { id: string; slug: string } | null;
  membership: { agencyId: string; role: "head" | "counselor"; requiresReview: boolean } | null;
};

// One /api/counselor/me lookup per user, shared by every mounted instance (the
// layout, AppFrame and page each use this hook) and reused briefly. A failed
// lookup is dropped so the next mount retries.
const SHARED_MS = 30_000;
const shared = new Map<string, { at: number; promise: Promise<MeResponse | null> }>();

export function __resetCounselorRoleCache(): void {
  shared.clear();
}

// Right after sign-in there's an auth-settle window where /api/counselor/me can
// transiently 401/500 (cookies not yet propagated). Treating that as "not a
// counselor/member" makes gated pages (roster, team) wrongly redirect to the
// dashboard. So on a non-ok or thrown response we retry once after a short delay.
async function fetchMe(): Promise<MeResponse | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch("/api/counselor/me");
      if (r.ok) return (await r.json()) as MeResponse;
    } catch {
      /* network blip — fall through to retry */
    }
    if (attempt === 0) await new Promise((res) => setTimeout(res, 800));
  }
  return null; // both attempts failed
}

function loadMe(userId: string): Promise<MeResponse | null> {
  const hit = shared.get(userId);
  if (hit && Date.now() - hit.at < SHARED_MS) return hit.promise;
  const promise = fetchMe().then((data) => {
    if (!data) shared.delete(userId);
    return data;
  });
  shared.set(userId, { at: Date.now(), promise });
  return promise;
}

export function useCounselorRole(): CounselorRoleState {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<CounselorRoleState>({ ...EMPTY, loading: true });

  useEffect(() => {
    // Auth itself is still resolving (hard navigation / first paint). This
    // is NOT "signed out" — resolving to loading:false here made gated
    // pages (roster, team) read {isMember:false, loading:false} for a frame
    // and redirect to the dashboard before the session settled. Stay loading.
    if (authLoading) {
      setState((prev) => ({ ...prev, loading: true }));
      return;
    }
    if (!user) {
      setState({ ...EMPTY, loading: false });
      return;
    }

    // Optimistic from cache so the sidebar doesn't flash student → counselor
    // on first paint after the lookup resolves.
    if (typeof window !== "undefined") {
      const cached = window.localStorage.getItem(`${CACHE_KEY}:${user.id}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Omit<CounselorRoleState, "loading">;
          setState({ ...parsed, loading: true });
        } catch { /* ignore */ }
      }
    }

    let cancelled = false;

    loadMe(user.id).then((data) => {
      if (cancelled) return;
      if (!data) {
        // Lookup failed after retry. Don't downgrade a cached membership to
        // "not a member" — just stop loading so cached state (if any) stands.
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }
      const next: CounselorRoleState = {
        isCounselor: Boolean(data.counselor),
        counselorId: data.counselor?.id ?? null,
        counselorSlug: data.counselor?.slug ?? null,
        agencyId: data.membership?.agencyId ?? null,
        role: data.membership?.role ?? null,
        requiresReview: data.membership?.requiresReview ?? false,
        isMember: Boolean(data.membership),
        isHead: data.membership?.role === "head",
        loading: false,
      };
      setState(next);
      if (typeof window !== "undefined") {
        const { loading: _loading, ...persist } = next;
        void _loading;
        window.localStorage.setItem(`${CACHE_KEY}:${user.id}`, JSON.stringify(persist));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return state;
}
