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

export function useCounselorRole(): CounselorRoleState {
  const { user } = useAuth();
  const [state, setState] = useState<CounselorRoleState>({ ...EMPTY, loading: true });

  useEffect(() => {
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

    fetch("/api/counselor/me")
      .then((r) => (r.ok ? r.json() : { counselor: null, membership: null }))
      .then(
        (data: {
          counselor: { id: string; slug: string } | null;
          membership: { agencyId: string; role: "head" | "counselor"; requiresReview: boolean } | null;
        }) => {
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
        },
      )
      .catch(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [user]);

  return state;
}
