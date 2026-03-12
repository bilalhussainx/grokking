"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [teacherKey, setTeacherKey] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await signup(
      name,
      email,
      password,
      role,
      role === "teacher" ? teacherKey : undefined
    );
    if (result.ok) {
      router.push(role === "teacher" ? "/sessions" : "/");
    } else {
      setError(result.error ?? "Signup failed.");
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
              &ldquo;Interactive coding exercises and pattern-based learning changed how I prepare for interviews.&rdquo;
            </p>
            <footer className="text-sm font-semibold text-[var(--muted-foreground)]">
              ~ A student who got the offer
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel — Signup Form */}
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
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Start your {role === "teacher" ? "teaching" : "learning"} journey
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Role toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2.5 text-sm font-medium transition-all border-r border-white/10 ${
                role === "student"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-[var(--muted-foreground)] hover:bg-white/5"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                role === "teacher"
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-[var(--muted-foreground)] hover:bg-white/5"
              }`}
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-[var(--muted-foreground)]">Full Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                placeholder="Your name"
              />
            </div>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-2.5 text-sm"
                placeholder="At least 6 characters"
              />
            </div>

            {/* Teacher key field */}
            {role === "teacher" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label htmlFor="teacherKey" className="text-sm font-medium text-violet-400">
                  Teacher Key
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/60" />
                  <input
                    id="teacherKey"
                    type="text"
                    required
                    value={teacherKey}
                    onChange={(e) => setTeacherKey(e.target.value.toUpperCase())}
                    className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest border-violet-500/20 focus:border-violet-500/50"
                    placeholder="XXXX-XXXX-XXXX"
                    maxLength={20}
                  />
                </div>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  Contact your administrator for a teacher key
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                role === "student" ? "btn-gradient btn-glow" : ""
              }`}
              style={role === "teacher" ? {
                background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)",
              } : undefined}
            >
              {submitting
                ? "Creating account..."
                : `Create ${role === "teacher" ? "Teacher " : ""}Account`}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/[0.06]">
            <p className="text-sm text-[var(--muted-foreground)] pt-4">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
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
