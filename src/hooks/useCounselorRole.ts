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
  loading: boolean;
}

const CACHE_KEY = "cc_counselor_role_v1";

export function useCounselorRole(): CounselorRoleState {
  const { user } = useAuth();
  const [state, setState] = useState<CounselorRoleState>({
    isCounselor: false,
    counselorId: null,
    counselorSlug: null,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setState({ isCounselor: false, counselorId: null, counselorSlug: null, loading: false });
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
      .then((r) => (r.ok ? r.json() : { counselor: null }))
      .then((data: { counselor: { id: string; slug: string } | null }) => {
        const next: CounselorRoleState = {
          isCounselor: Boolean(data.counselor),
          counselorId: data.counselor?.id ?? null,
          counselorSlug: data.counselor?.slug ?? null,
          loading: false,
        };
        setState(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            `${CACHE_KEY}:${user.id}`,
            JSON.stringify({
              isCounselor: next.isCounselor,
              counselorId: next.counselorId,
              counselorSlug: next.counselorSlug,
            }),
          );
        }
      })
      .catch(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [user]);

  return state;
}
