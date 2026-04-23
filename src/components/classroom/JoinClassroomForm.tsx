"use client";

import { useState } from "react";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";

interface JoinClassroomFormProps {
  onJoin: (code: string) => Promise<void>;
}

export default function JoinClassroomForm({ onJoin }: JoinClassroomFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await onJoin(code.trim().toUpperCase());
      setSuccess("Enrolled successfully.");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <KeyRound className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold">Join a Classroom</h3>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter 6-letter code"
          maxLength={6}
          className="glass-input flex-1 px-4 py-2.5 rounded-xl text-sm font-mono tracking-widest uppercase"
        />
        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="btn-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      {success && <p className="text-emerald-400 text-xs mt-2">{success}</p>}
    </div>
  );
}
