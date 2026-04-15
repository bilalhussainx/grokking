"use client";

// Resume list + upload. One-click: drop a file, go to detail page for rewrites.
// Spec: CollegeVCareers.md SP-16.

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Upload, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ResumeDoc {
  id: string;
  original_filename: string;
  file_type: string;
  updated_at: string;
  created_at: string;
}

export default function ResumesListClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<ResumeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?next=/resumes");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/resumes");
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
        const data = await res.json();
        setResumes(data.resumes || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, router]);

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/resumes", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const doc = await res.json();
      router.push(`/resumes/${doc.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setResumes((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Resumes</h1>
          <p className="text-sm text-white/50">Upload once. Rewrite per role.</p>
        </div>

        {/* Upload dropzone */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const f = e.dataTransfer.files?.[0];
            if (f) handleUpload(f);
          }}
          className={`p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors mb-8 ${
            uploading
              ? "border-violet-500/40 bg-violet-500/[0.04]"
              : "border-white/10 bg-white/[0.02] hover:border-violet-500/40 hover:bg-violet-500/[0.04]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-violet-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm text-white/70">Parsing your resume…</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-white/40 mx-auto mb-3" />
              <p className="text-sm text-white/70 mb-1">Drop a PDF, DOCX, or TXT here</p>
              <p className="text-xs text-white/30">or click to browse · max 4MB · no scanned PDFs</p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.2] text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <p className="text-center text-sm text-white/40 py-8">
            No resumes yet. Upload one above to get started.
          </p>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider text-white/40 mb-3">Your resumes</h2>
            {resumes.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition"
              >
                <FileText className="w-4 h-4 text-white/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/resumes/${r.id}`}
                    className="block text-sm font-medium text-white/80 truncate hover:text-white"
                  >
                    {r.original_filename}
                  </Link>
                  <div className="text-[11px] text-white/40">
                    {r.file_type.toUpperCase()} · updated {new Date(r.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 rounded-lg text-white/30 hover:text-red-300 hover:bg-red-500/10 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
