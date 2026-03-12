"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Document, DocumentComment } from "@/types/writing";

export function useDocument(documentId: string | null) {
  const [document, setDocument] = useState<Document | null>(null);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    async function fetchDocument() {
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (!error && data) {
        setDocument(data as Document);
      }

      const { data: commentsData } = await supabase
        .from("document_comments")
        .select("*")
        .eq("document_id", documentId)
        .order("created_at", { ascending: true });

      if (commentsData) {
        setComments(commentsData as DocumentComment[]);
      }

      setLoading(false);
    }

    fetchDocument();

    const channel = supabase
      .channel(`document:${documentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${documentId}`,
        },
        (payload) => {
          setDocument(payload.new as Document);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "document_comments",
          filter: `document_id=eq.${documentId}`,
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new as DocumentComment]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [documentId]);

  const saveContent = useCallback(
    (content: Record<string, unknown>, plainText: string) => {
      if (!documentId) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        setSaving(true);
        await fetch(`/api/documents/${documentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, plain_text: plainText }),
        });
        setSaving(false);
      }, 1000);
    },
    [documentId]
  );

  const updateTitle = useCallback(
    async (title: string) => {
      if (!documentId) return;
      await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    },
    [documentId]
  );

  const addComment = useCallback(
    async (comment: Omit<DocumentComment, "id" | "created_at" | "document_id">) => {
      if (!documentId) return;
      const res = await fetch(`/api/documents/${documentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      return res.json();
    },
    [documentId]
  );

  const resolveComment = useCallback(
    async (commentId: string) => {
      await supabase
        .from("document_comments")
        .update({ resolved: true })
        .eq("id", commentId);

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
      );
    },
    []
  );

  return {
    document,
    comments,
    loading,
    saving,
    saveContent,
    updateTitle,
    addComment,
    resolveComment,
  };
}
