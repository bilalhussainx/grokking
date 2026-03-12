"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type {
  EditorType,
  SessionBroadcastEvent,
} from "@/types/sessions";

interface UseEditorSyncOptions {
  sessionId: string;
  userId: string;
  role: "student" | "teacher" | "observer";
  sendBroadcast: (event: SessionBroadcastEvent) => void;
  initialContent?: string;
  initialLanguage?: string;
}

const SNAPSHOT_INTERVAL_MS = 10_000;

export function useEditorSync({
  sessionId,
  userId,
  role,
  sendBroadcast,
  initialContent = "",
  initialLanguage = "python",
}: UseEditorSyncOptions) {
  const [content, setContentState] = useState(initialContent);
  const [language, setLanguage] = useState(initialLanguage);
  const [editorType, setEditorType] = useState<EditorType>("code");
  const [output, setOutput] = useState("");
  const [outputIsError, setOutputIsError] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const snapshotRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const contentRef = useRef(content);

  // Update content when initialContent changes (e.g., lesson loaded)
  useEffect(() => {
    if (initialContent && !contentRef.current) {
      setContentState(initialContent);
      contentRef.current = initialContent;
    }
  }, [initialContent]);

  // Keep contentRef in sync
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Both teacher and student can edit freely
  const setContent = useCallback(
    (newContent: string) => {
      setContentState(newContent);
    },
    []
  );

  // Switch editor mode (code only now)
  const switchEditorMode = useCallback(
    (newType: EditorType, newLanguage?: string) => {
      setEditorType(newType);
      if (newLanguage) setLanguage(newLanguage);
    },
    []
  );

  // Set output
  const setOutputAndBroadcast = useCallback(
    (newOutput: string, isError = false) => {
      setOutput(newOutput);
      setOutputIsError(isError);

      if (role === "teacher") {
        sendBroadcast({
          type: "output_sync",
          userId,
          output: newOutput,
          isError,
        });
      }
    },
    [role, userId, sendBroadcast]
  );

  // Teacher: periodic snapshot saves for late-joiners
  useEffect(() => {
    if (role !== "teacher" || !sessionId) return;

    snapshotRef.current = setInterval(async () => {
      if (!contentRef.current) return;
      await supabase.from("session_snapshots").insert({
        session_id: sessionId,
        user_id: userId,
        snapshot_type: "code",
        content: contentRef.current,
        language,
        metadata: { editorType, language, timestamp: Date.now() },
      });
    }, SNAPSHOT_INTERVAL_MS);

    return () => {
      if (snapshotRef.current) clearInterval(snapshotRef.current);
    };
  }, [role, sessionId, userId, editorType, language]);

  // Student: hydrate from latest snapshot if no initial content
  useEffect(() => {
    if (role === "teacher" || !sessionId || isHydrated) return;
    if (initialContent) {
      // Already have lesson content, skip snapshot hydration
      setIsHydrated(true);
      return;
    }

    async function hydrate() {
      const { data } = await supabase
        .from("session_snapshots")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        const snapshot = data as { content: string; language?: string; metadata: Record<string, unknown> };
        setContentState(snapshot.content);
        setLanguage((snapshot.metadata?.language as string) ?? snapshot.language ?? "python");
      }
      setIsHydrated(true);
    }

    hydrate();
  }, [role, sessionId, isHydrated, initialContent]);

  // Listen for broadcast events (students can see teacher output)
  const handleBroadcast = useCallback(
    (event: SessionBroadcastEvent) => {
      if (event.type === "output_sync" && role !== "teacher") {
        setOutput(event.output);
        setOutputIsError(event.isError);
      }
    },
    [role]
  );

  return {
    content,
    setContent,
    language,
    setLanguage: (lang: string) => {
      setLanguage(lang);
    },
    editorType,
    switchEditorMode,
    output,
    outputIsError,
    setOutput: setOutputAndBroadcast,
    isReadOnly: role === "observer",
    isHydrated: role === "teacher" ? true : isHydrated,
    handleBroadcast,
  };
}
