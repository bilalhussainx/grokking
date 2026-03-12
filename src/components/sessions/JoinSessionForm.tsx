"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

export default function JoinSessionForm({ onJoin }: { onJoin: (code: string) => Promise<void> }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (code.length < 6) return; setError(""); setLoading(true);
    try { await onJoin(code.toUpperCase()); } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to join"); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-1">Join a Session</h3>
      <p className="text-xs text-[var(--muted-foreground)] mb-4">Enter the 6-character code from your teacher</p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))} placeholder="ABCD12" className="glass-input flex-1 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.3em] uppercase" maxLength={6} />
        <button type="submit" disabled={code.length < 6 || loading} className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}Join
        </button>
      </form>
      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 text-xs text-red-400"><AlertCircle className="w-3.5 h-3.5" />{error}</motion.div>}
    </motion.div>
  );
}
