"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.push(user.role === "teacher" ? "/sessions" : "/");
  }, [user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Panel — Branding */}
      <div className="relative hidden lg:flex h-full flex-col border-r border-white/[0.06] bg-[var(--background)] p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        <div className="z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-base shadow-lg">
            G
          </div>
          <span className="text-xl font-bold tracking-tight">Grokking</span>
        </div>

        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl text-[var(--muted-foreground)]">
              &ldquo;The best way to learn coding patterns is by doing. This platform makes it effortless.&rdquo;
            </p>
            <footer className="text-sm font-semibold text-[var(--muted-foreground)]">
              ~ A happy learner
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="relative flex min-h-screen flex-col justify-center p-6 bg-[var(--background)]">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors lg:hidden">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm space-y-6"
        >
          <div className="flex items-center gap-2.5 lg:hidden mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm shadow-lg">
              G
            </div>
            <span className="text-xl font-bold tracking-tight">Grokking</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">Sign in to continue learning</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--muted-foreground)]">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--muted-foreground)]">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                placeholder="Your password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient btn-glow w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/[0.06]">
            <p className="text-sm text-[var(--muted-foreground)] pt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full text-[var(--foreground)]" viewBox="0 0 696 316" fill="none">
        <title>Background</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.04 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.3 }}
            animate={{
              pathLength: 1,
              opacity: [0.15, 0.3, 0.15],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
