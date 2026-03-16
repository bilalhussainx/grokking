"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SessionRoom from "@/components/sessions/SessionRoom";
import type { LiveSession } from "@/types/sessions";
import { Loader2 } from "lucide-react";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    async function loadSession() {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) {
          setError("Session not found");
          return;
        }
        const data = await res.json();

        // Extract lesson/course info from settings JSONB into top-level fields
        // so SessionRoom can access them via (session as any).course_slug etc.
        if (data.settings) {
          const settings = typeof data.settings === "string" ? JSON.parse(data.settings) : data.settings;
          if (settings.course_slug) data.course_slug = settings.course_slug;
          if (settings.lesson_id) data.lesson_id = settings.lesson_id;
          if (settings.module_id) data.module_id = settings.module_id;
        }

        setSession(data);
      } catch {
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Session not found"}</p>
          <button onClick={() => router.push("/sessions")} className="text-sm text-blue-400 hover:underline">
            Back to sessions
          </button>
        </div>
      </div>
    );
  }

  const userRole = session.teacher_id === user.id ? "teacher" : "student";

  return (
    <SessionRoom
      session={session}
      userId={user.id}
      userName={user.user_metadata?.full_name || user.email || ""}
      userRole={userRole}
    />
  );
}
