// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const { signInWithGoogle, signUpWithEmail, user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const NATIVE_LANGUAGES = [
    { code: "en", name: "English" },
    { code: "es", name: "Espa\u00F1ol" },
    { code: "fr", name: "Fran\u00E7ais" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "hi", name: "\u0939\u093F\u0928\u094D\u0926\u0940 (Hindi)" },
    { code: "zh", name: "\u4E2D\u6587 (Chinese)" },
    { code: "ja", name: "\u65E5\u672C\u8A9E (Japanese)" },
    { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629 (Arabic)" },
    { code: "ur", name: "\u0627\u0631\u062F\u0648 (Urdu)" },
    { code: "pa", name: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40 (Punjabi)" },
    { code: "nl", name: "Nederlands" },
    { code: "pt", name: "Portugu\u00EAs" },
    { code: "ko", name: "\uD55C\uAD6D\uC5B4 (Korean)" },
  ];

  if (user) {
    router.replace("/");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signUpWithEmail(email, password, name);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Save native language for coach to use immediately
      localStorage.setItem('coach-language', nativeLanguage);
      localStorage.setItem('native-language', nativeLanguage);
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
        <div className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
          <p className="text-sm text-white/50">We sent a confirmation link to <strong className="text-white/80">{email}</strong>. Click it to activate your account and get your 50 free credits.</p>
          <Link href="/login" className="text-violet-400 text-sm hover:underline mt-4 inline-block">Back to login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16 bg-[var(--background)]">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Join Grokking
          </h1>
          <p className="text-sm text-white/50 mt-2">Start with 50 free AI credits</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 mb-4 h-11 border-white/10 hover:bg-white/5"
          onClick={signInWithGoogle}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" className="w-5 h-5">
            <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
            <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
            <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" />
            <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="px-3 text-xs text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/70">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nativeLanguage" className="text-white/70">I speak</Label>
            <select
              id="nativeLanguage"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              {NATIVE_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-white/30">Coach Alex will explain lessons in your language</p>
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-md p-2">{error}</p>}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:underline">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
