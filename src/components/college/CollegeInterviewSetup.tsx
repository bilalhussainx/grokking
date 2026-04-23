"use client";

// College admissions interview setup page.
// Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md
// Design refresh 2026-04-20: aligned with site dark+gold palette, mobile-first layout,
// persona preview card after selection.

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap, Loader2, ArrowRight, ArrowLeft, Globe2, Sparkles,
  Mic, MessageSquare, Headphones, ChevronRight, CheckCircle2, BookOpen,
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCollegePersonas } from "@/data/college-interviewer-personas";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const SCHOOLS = getAllCollegePersonas();

const FEEDBACK_LANGUAGES = [
  { code: "en", label: "English",   nativeLabel: "English",   flag: "🇺🇸" },
  { code: "es", label: "Spanish",   nativeLabel: "Español",   flag: "🇪🇸" },
  { code: "fr", label: "French",    nativeLabel: "Français",  flag: "🇫🇷" },
  { code: "de", label: "German",    nativeLabel: "Deutsch",   flag: "🇩🇪" },
  { code: "it", label: "Italian",   nativeLabel: "Italiano",  flag: "🇮🇹" },
  { code: "nl", label: "Dutch",     nativeLabel: "Nederlands",flag: "🇳🇱" },
  { code: "ja", label: "Japanese",  nativeLabel: "日本語",     flag: "🇯🇵" },
  { code: "hi", label: "Hindi",     nativeLabel: "हिन्दी",     flag: "🇮🇳" },
  { code: "pa", label: "Punjabi",   nativeLabel: "ਪੰਜਾਬੀ",      flag: "🇮🇳" },
];

const SCHOOL_BADGES: Record<string, { color: string; accent: string }> = {
  "harvard-undergrad":   { color: "from-rose-500/20 to-rose-900/10",    accent: "bg-rose-500"    },
  "yale-undergrad":      { color: "from-blue-500/20 to-blue-900/10",    accent: "bg-blue-500"    },
  "princeton-undergrad": { color: "from-orange-500/20 to-orange-900/10",accent: "bg-orange-500"  },
  "columbia-undergrad":  { color: "from-sky-500/20 to-sky-900/10",      accent: "bg-sky-500"     },
  "penn-undergrad":      { color: "from-indigo-500/20 to-indigo-900/10",accent: "bg-indigo-500"  },
  "brown-undergrad":     { color: "from-amber-700/20 to-amber-900/10",  accent: "bg-amber-700"   },
  "dartmouth-undergrad": { color: "from-emerald-500/20 to-emerald-900/10",accent: "bg-emerald-500"},
  "cornell-undergrad":   { color: "from-red-500/20 to-red-900/10",      accent: "bg-red-500"     },
  "stanford-undergrad":  { color: "from-rose-600/20 to-rose-900/10",    accent: "bg-rose-600"    },
  "mit-undergrad":       { color: "from-slate-400/20 to-slate-900/10",  accent: "bg-slate-400"   },
};

export default function CollegeInterviewSetup() {
  const router = useRouter();
  const { startInterview } = useInterview();
  const { user } = useAuth();

  const [collegePersonaId, setCollegePersonaId] = useState<string>("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [feedbackLanguage, setFeedbackLanguage] = useState<string>("en");
  const [inputMode, setInputMode] = useState<'voice' | 'text'>("voice");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const presetPersona = searchParams.get("persona");
  const presetFeedbackLang = searchParams.get("feedbackLang");
  const returnTo = searchParams.get("returnTo");

  // Auto-pulled from the student's /cc workspace — used to personalize the
  // interview without making them retype what they've already written.
  const [essayContext, setEssayContext] = useState<{ prompt: string; excerpt: string } | undefined>(undefined);
  const [activitiesSummary, setActivitiesSummary] = useState<string[]>([]);

  const selectedPersona = useMemo(
    () => SCHOOLS.find((s) => s.id === collegePersonaId),
    [collegePersonaId]
  );

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    (async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data } = await supabase
          .from("college_applicant_profile")
          .select("intended_major")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setIntendedMajor(data.intended_major || "");
        }
      } catch {
        // ignore
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (presetPersona && !collegePersonaId) setCollegePersonaId(presetPersona);
    if (presetFeedbackLang && feedbackLanguage === "en") setFeedbackLanguage(presetFeedbackLang);
  }, [presetPersona, presetFeedbackLang]);

  // Auto-pull the reviewed Common App personal statement + activities list.
  // The interview coach uses these to ask deeper, non-repetitive questions
  // instead of making the student retype a project + "book that inspired you".
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch("/api/cc/essays");
        const data = await res.json();
        const essays: Array<{ id: string; essay_type?: string; phase?: string; prompt_text?: string }> = data.essays || [];
        // Prefer the Common App personal statement that has been reviewed.
        const reviewed = essays.find((e) => e.essay_type === "personal_statement" && e.phase === "review");
        const target = reviewed
          || essays.find((e) => e.essay_type === "personal_statement" && (e.phase === "revise" || e.phase === "draft"))
          || essays.find((e) => e.phase === "review" || e.phase === "revise" || e.phase === "draft");
        if (target) {
          try {
            const detail = await fetch(`/api/cc/essays/${target.id}`).then((r) => (r.ok ? r.json() : null));
            const essay = detail?.essay;
            if (essay?.content) {
              setEssayContext({
                prompt: essay.prompt_text || target.prompt_text || "",
                excerpt: (essay.content || "").slice(0, 1200),
              });
            }
          } catch {
            // non-fatal
          }
        }
      } catch {
        // non-fatal
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data: profile } = await supabase
          .from("cc_student_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!profile) return;
        const { data: acts } = await supabase
          .from("cc_activities")
          .select("position, activity_type, organization, role, description_150, hours_per_week, weeks_per_year")
          .eq("student_id", profile.id)
          .order("position", { ascending: true });
        if (acts && acts.length > 0) {
          const summary = acts
            .filter((a: { role?: string; organization?: string; description_150?: string }) =>
              (a.role || a.organization || a.description_150)
            )
            .slice(0, 10)
            .map((a: { position?: number; activity_type?: string; organization?: string; role?: string; description_150?: string; hours_per_week?: number; weeks_per_year?: number }) => {
              const parts: string[] = [];
              const label = [a.role, a.organization].filter(Boolean).join(" · ");
              if (label) parts.push(label);
              if (a.activity_type) parts.push(`(${a.activity_type})`);
              if (a.description_150) parts.push(`— ${a.description_150}`);
              if (a.hours_per_week) parts.push(`[${a.hours_per_week}h/wk × ${a.weeks_per_year || '?'}wk]`);
              return parts.join(" ");
            });
          setActivitiesSummary(summary);
        }
      } catch {
        // non-fatal
      }
    })();
  }, [user]);

  const canStart = !!collegePersonaId && !loading;

  const persistProfile = async () => {
    if (!user) return;
    try {
      const supabase = createBrowserSupabase();
      await supabase.from("college_applicant_profile").upsert({
        user_id: user.id,
        intended_major: intendedMajor.trim() || null,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("[CollegeInterviewSetup] Failed to persist profile (non-fatal):", e);
    }
  };

  const handleStart = async () => {
    if (!collegePersonaId) return;
    setLoading(true);
    setError("");

    const applicantProfile = {
      intendedMajor: intendedMajor.trim() || undefined,
      essayContext,
      activitiesSummary: activitiesSummary.length > 0 ? activitiesSummary : undefined,
    };

    try {
      persistProfile();

      let plan;
      if (!user) {
        plan = {
          questions: [],
          interviewerPersona: "Adaptive college admissions interviewer",
          timeAllocation: { intro: 3, questions: 22, wrapUp: 5 },
          fallback: true,
        };
      } else {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
          const res = await fetch("/api/interviews/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: "college",
              collegePersonaId,
              interviewType: "behavioral",
              language: "en",
              applicantProfile,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);
          if (res.ok) plan = await res.json();
        } catch {
          clearTimeout(timeout);
        }
        if (!plan) {
          plan = {
            questions: [],
            interviewerPersona: "Adaptive college admissions interviewer",
            timeAllocation: { intro: 3, questions: 22, wrapUp: 5 },
            fallback: true,
          };
        }
      }

      const sessionId = startInterview({
        interviewType: "behavioral",
        preset: "fullstack",
        jobDescription: `College: ${collegePersonaId}`,
        questionPlan: plan,
        language: "en",
        companyPersonaId: "generic",
        category: "college",
        collegePersonaId,
        applicantProfile,
        feedbackLanguage,
        inputMode,
      });
      if (returnTo) {
        sessionStorage.setItem("cc_interview_returnTo", returnTo);
      }
      router.push(`/college-interviews/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-white relative overflow-hidden">
      {/* Ambient gold glow — signals "college application premium feel" */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/[0.04] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to dashboard
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-semibold mb-5">
            <Sparkles className="w-3 h-3" />
            Alumni Interview Practice
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white mb-3 leading-[1.05]">
            Practice with an <span className="text-[#D4AF37]">Ivy+ alumni</span> interviewer
          </h1>
          <p className="text-sm sm:text-base text-white/55 max-w-2xl leading-relaxed">
            Pick a school. Get an AI trained on how <em>that</em> school&apos;s alumni actually interview. Interview stays in English to mirror the real thing — your feedback comes back in any of 9 languages.
          </p>
        </motion.div>

        {/* Step 1: School picker */}
        <Section number={1} title="Pick a school">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {SCHOOLS.map((s) => {
              const isSelected = collegePersonaId === s.id;
              const badge = SCHOOL_BADGES[s.id] || { color: "from-[#D4AF37]/20 to-[#D4AF37]/5", accent: "bg-[#D4AF37]" };
              return (
                <motion.button
                  key={s.id}
                  onClick={() => setCollegePersonaId(s.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`group relative overflow-hidden p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#D4AF37]/[0.06] border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/10"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-40 pointer-events-none`} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${badge.accent} ${isSelected ? "" : "opacity-60"}`} />
                      <div className={`text-[10px] uppercase tracking-wide ${isSelected ? "text-[#D4AF37]" : "text-white/30"}`}>
                        {isSelected ? "Selected" : "Ivy+"}
                      </div>
                    </div>
                    <div className={`text-[15px] font-semibold mb-0.5 ${isSelected ? "text-white" : "text-white/85"}`}>
                      {s.shortName}
                    </div>
                    <div className="text-[10px] text-white/35 leading-tight">{s.fullName}</div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] absolute top-0 right-0" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Persona preview */}
          {selectedPersona && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent border border-[#D4AF37]/15"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{selectedPersona.shortName} alum</p>
                    <p className="text-[10px] text-white/40">{selectedPersona.fullName}</p>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed mb-3">{selectedPersona.description}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 mb-1.5">
                    <BookOpen className="w-3 h-3" />
                    <span className="uppercase tracking-wide">What this alum cares about</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPersona.schoolFitTopics.slice(0, 4).map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-white/60"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </Section>

        {/* Step 2: Applicant profile */}
        <Section number={2} title="Tell us about you" hint={user ? "saved to your profile" : undefined}>
          {profileLoading ? (
            <div className="text-xs text-white/40">Loading your profile…</div>
          ) : (
            <div className="space-y-3">
              <Field label="Intended major" value={intendedMajor} onChange={setIntendedMajor} placeholder="e.g. Computer Science" />

              {(essayContext || activitiesSummary.length > 0) && (
                <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.04] px-4 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wide">
                      Using your application
                    </span>
                  </div>
                  <ul className="text-[12px] text-white/70 space-y-0.5 leading-relaxed">
                    {essayContext && (
                      <li>• Common App personal statement ({Math.round(essayContext.excerpt.length / 5)} words excerpt)</li>
                    )}
                    {activitiesSummary.length > 0 && (
                      <li>• {activitiesSummary.length} {activitiesSummary.length === 1 ? "activity" : "activities"} from your list</li>
                    )}
                  </ul>
                  <p className="text-[10px] text-white/40 mt-1.5">
                    The alum will go deeper on these instead of generic questions. &quot;Why {selectedPersona?.shortName || "this school"}?&quot; is asked live during the interview.
                  </p>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Step 3: Feedback language */}
        <Section number={3} title="Feedback language" icon={<Globe2 className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {FEEDBACK_LANGUAGES.map((l) => {
              const isSelected = feedbackLanguage === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setFeedbackLanguage(l.code)}
                  className={`px-2.5 py-2.5 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? "bg-[#D4AF37]/[0.08] border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{l.flag}</span>
                    <span className={`text-[11px] font-semibold ${isSelected ? "text-white" : "text-white/70"}`}>
                      {l.nativeLabel}
                    </span>
                  </div>
                  {l.code !== "en" && (
                    <span className="text-[9px] text-white/35 mt-0.5 block">{l.label}</span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-white/35 mt-3 leading-relaxed">
            Interview is always in English (matches the real thing). Your scorecard and feedback come in this language.
          </p>
        </Section>

        {/* Step 4: Voice / Text mode */}
        <Section number={4} title="Interview mode" icon={<Headphones className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-2 gap-2.5">
            <ModeCard
              active={inputMode === "voice"}
              icon={<Mic className="w-4 h-4" />}
              label="Voice"
              desc="Speak your answers — most realistic"
              onClick={() => setInputMode("voice")}
            />
            <ModeCard
              active={inputMode === "text"}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Text"
              desc="No mic needed — type your answers"
              onClick={() => setInputMode("text")}
            />
          </div>
        </Section>

        {/* Error */}
        {error && (
          <motion.div
            className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Sticky mobile CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="sticky bottom-4 z-20 sm:static mt-8"
        >
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`group w-full py-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xl ${
              canStart
                ? "bg-[#D4AF37] hover:bg-[#C4A030] text-black shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-white/5 text-white/30 cursor-not-allowed shadow-none"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing your interview…
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                {selectedPersona ? `Start ${selectedPersona.shortName} interview` : "Start practice interview"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
          {!selectedPersona && !loading && (
            <p className="text-center text-[11px] text-white/30 mt-2">Pick a school to unlock</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Section({
  number, title, hint, icon, children,
}: {
  number: number;
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: number * 0.05 }}
      className="mb-8 sm:mb-10"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[11px] font-bold">
          {icon || number}
        </div>
        <h2 className="text-[11px] font-semibold text-white/70 uppercase tracking-[0.14em]">{title}</h2>
        {hint && <span className="text-[10px] text-white/30 ml-1">· {hint}</span>}
        <ChevronRight className="w-3 h-3 text-white/10 ml-auto hidden sm:block" />
      </div>
      {children}
    </motion.section>
  );
}

function Field({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-white/40 mb-1.5 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-colors"
      />
    </div>
  );
}

function ModeCard({
  active, icon, label, desc, onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-colors ${
        active
          ? "bg-[#D4AF37]/[0.08] border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20"
          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
      }`}
    >
      <div className={`mb-2 ${active ? "text-[#D4AF37]" : "text-white/40"}`}>{icon}</div>
      <div className={`text-sm font-semibold mb-0.5 ${active ? "text-white" : "text-white/75"}`}>{label}</div>
      <div className="text-[10px] text-white/35 leading-tight">{desc}</div>
    </button>
  );
}
