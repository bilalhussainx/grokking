"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, PenTool, ArrowLeft, ArrowRight, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AnimatedBlobs from "@/components/ui/AnimatedBlobs";
import type { Document, DocType } from "@/types/writing";

const DOC_TYPE_CONFIG: Record<DocType, { label: string; color: string; bg: string }> = {
  essay: { label: "Essay", color: "text-violet-400", bg: "from-violet-500/20 to-purple-500/20" },
  technical: { label: "Technical", color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/20" },
  design_doc: { label: "Design Doc", color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/20" },
  free_form: { label: "Free Form", color: "text-pink-400", bg: "from-pink-500/20 to-rose-500/20" },
};

export default function WritingDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?userId=${user.userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setDocuments(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user, fetchDocuments]);

  const createDocument = async (docType: DocType = "essay") => {
    if (!user) return;
    setCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: user.userId,
          title: "Untitled Document",
          doc_type: docType,
        }),
      });
      const doc = await res.json();
      if (doc.id) router.push(`/writing/${doc.id}`);
    } finally {
      setCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <AnimatedBlobs intensity="low" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[var(--background)]/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-lg p-1.5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25">
                <PenTool className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">Writing Lab</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Create New Section */}
        <section>
          <h2 className="text-lg font-bold mb-4">Start Writing</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {(Object.entries(DOC_TYPE_CONFIG) as [DocType, typeof DOC_TYPE_CONFIG[DocType]][]).map(
              ([type, config]) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => createDocument(type)}
                  disabled={creating}
                  className="card-gradient-border glass-strong rounded-2xl p-5 text-left transition-all disabled:opacity-50"
                >
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${config.bg} ${config.color}`}>
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold">{config.label}</div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                    Create a new {config.label.toLowerCase()}
                  </div>
                </motion.button>
              )
            )}
          </div>
        </section>

        {/* Documents List */}
        <section>
          <h2 className="text-lg font-bold mb-4">Your Documents</h2>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-strong rounded-2xl p-5 h-32 animate-pulse" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc, i) => {
                const config = DOC_TYPE_CONFIG[doc.doc_type as DocType] || DOC_TYPE_CONFIG.free_form;
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={`/writing/${doc.id}`}
                      className="card-gradient-border group block rounded-2xl glass-strong p-5 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${config.bg} ${config.color}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                          doc.status === "draft" ? "bg-white/10 text-[var(--muted-foreground)]" :
                          doc.status === "in_review" ? "bg-yellow-500/20 text-yellow-400" :
                          doc.status === "approved" ? "bg-emerald-500/20 text-emerald-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors truncate">
                        {doc.title}
                      </h3>

                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {doc.word_count} words
                        </span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </span>
                        <div className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                          Edit <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-strong rounded-2xl p-12 text-center"
            >
              <PenTool className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-30" />
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">
                Start writing your first essay or technical document with AI assistance.
              </p>
              <button
                onClick={() => createDocument("essay")}
                disabled={creating}
                className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Create Your First Document
              </button>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
