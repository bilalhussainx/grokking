"use client";

// College admissions interview setup page.
// Spec: docs/superpowers/specs/2026-04-07-college-admissions-interviews-design.md
//
// Mirrors InterviewSetup.tsx structure but for college applicants:
//   - 10 school cards (Ivies + Stanford + MIT)
//   - 4-field applicant profile (persisted to user)
//   - Per-session "why this school"
//   - Feedback language picker (interview is always English)

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Loader2, ArrowRight, Globe2, Sparkles, Mic, MessageSquare, Headphones } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAllCollegePersonas } from "@/data/college-interviewer-personas";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const SCHOOLS = getAllCollegePersonas();

const FEEDBACK_LANGUAGES = [
  { code: "en", label: "English",   nativeLabel: "English" },
  { code: "es", label: "Spanish",   nativeLabel: "Español" },
  { code: "fr", label: "French",    nativeLabel: "Français" },
  { code: "de", label: "German",    nativeLabel: "Deutsch" },
  { code: "it", label: "Italian",   nativeLabel: "Italiano" },
  { code: "nl", label: "Dutch",     nativeLabel: "Nederlands" },
  { code: "ja", label: "Japanese",  nativeLabel: "日本語" },
  { code: "hi", label: "Hindi",     nativeLabel: "हिन्दी" },
  { code: "pa", label: "Punjabi",   nativeLabel: "ਪੰਜਾਬੀ" },
];

const SCHOOL_EMOJIS: Record<string, string> = {
  "harvard-undergrad": "🟥",
  "yale-undergrad": "🟦",
  "princeton-undergrad": "🟧",
  "columbia-undergrad": "🟦",
  "penn-undergrad": "🟦",
  "brown-undergrad": "🟫",
  "dartmouth-undergrad": "🟩",
  "cornell-undergrad": "⬜",
  "stanford-undergrad": "🟥",
  "mit-undergrad": "⬛",
};

export default function CollegeInterviewSetup() {
  const router = useRouter();
  const { startInterview } = useInterview();
  const { user } = useAuth();

  const [collegePersonaId, setCollegePersonaId] = useState<string>("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [topProjectTitle, setTopProjectTitle] = useState("");
  const [topProjectDescription, setTopProjectDescription] = useState("");
  const [recentInfluence, setRecentInfluence] = useState("");
  const [whyThisSchool, setWhyThisSchool] = useState("");
  const [feedbackLanguage, setFeedbackLanguage] = useState<string>("en");
  const [inputMode, setInputMode] = useState<'voice' | 'text'>("voice");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");

  // Load profile from Supabase if signed in
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
          .select("intended_major, top_project_title, top_project_description, recent_influence")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setIntendedMajor(data.intended_major || "");
          setTopProjectTitle(data.top_project_title || "");
          setTopProjectDescription(data.top_project_description || "");
          setRecentInfluence(data.recent_influence || "");
        }
      } catch {
        // ignore — fields stay empty
      } finally {
        setProfileLoading(false);
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
        top_project_title: topProjectTitle.trim() || null,
        top_project_description: topProjectDescription.trim() || null,
        recent_influence: recentInfluence.trim() || null,
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
      topProjectTitle: topProjectTitle.trim() || undefined,
      topProjectDescription: topProjectDescription.trim() || undefined,
      recentInfluence: recentInfluence.trim() || undefined,
      whyThisSchool: whyThisSchool.trim() || undefined,
    };

    try {
      // Persist profile in background
      persistProfile();

      let plan;
      if (!user) {
        // Guest mode — fallback plan, no API call
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
              language: "en",                  // interview is always English
              applicantProfile,
              whyThisSchool: whyThisSchool.trim() || undefined,
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
        preset: "fullstack",                  // unused in college mode but required by type
        jobDescription: `College: ${collegePersonaId}`,
        questionPlan: plan,
        language: "en",                       // interview voice is English
        companyPersonaId: "generic",
        category: "college",
        collegePersonaId,
        applicantProfile,
        feedbackLanguage,
        inputMode,
      });
      router.push(`/college-interviews/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            College Admissions Interview Practice
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Practice your alumni interview
          </h1>
          <p className="text-sm text-white/50 max-w-xl mx-auto">
            Pick a school. Get an AI alumni interviewer that knows what {"that"} school cares about. Interview is in English (matches the real thing). Feedback comes in your language.
          </p>
        </motion.div>

        {/* School picker */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">1</div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Pick a school</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {SCHOOLS.map((s) => {
              const isSelected = collegePersonaId === s.id;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => setCollegePersonaId(s.id)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`p-3.5 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <div className={`text-2xl mb-2`}>{SCHOOL_EMOJIS[s.id] || "🎓"}</div>
                  <div className={`text-[13px] font-semibold mb-0.5 ${isSelected ? "text-white" : "text-white/70"}`}>{s.shortName}</div>
                  <div className="text-[10px] text-white/30 leading-tight">{s.fullName}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Applicant profile */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">2</div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Tell us about you</h2>
            {user && (
              <span className="text-[10px] text-white/30">saved to your profile</span>
            )}
          </div>

          {profileLoading ? (
            <div className="text-xs text-white/40">Loading your profile…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/40 mb-1">Intended major</label>
                <input
                  type="text"
                  value={intendedMajor}
                  onChange={(e) => setIntendedMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/40 mb-1">A book/article that influenced you</label>
                <input
                  type="text"
                  value={recentInfluence}
                  onChange={(e) => setRecentInfluence(e.target.value)}
                  placeholder="e.g. Sapiens by Yuval Harari"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-white/40 mb-1">Top project / extracurricular — title</label>
                <input
                  type="text"
                  value={topProjectTitle}
                  onChange={(e) => setTopProjectTitle(e.target.value)}
                  placeholder="e.g. Built a machine learning model to detect pneumonia from X-rays"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-white/40 mb-1">Tell the alum about it (100-200 words)</label>
                <textarea
                  value={topProjectDescription}
                  onChange={(e) => setTopProjectDescription(e.target.value)}
                  placeholder="What did you build? Why did you start it? What was the hardest part? What did you learn?"
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors resize-none"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Why this school */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">3</div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Why this school?</h2>
            <span className="text-[10px] text-white/30">just for this session</span>
          </div>
          <input
            type="text"
            value={whyThisSchool}
            onChange={(e) => setWhyThisSchool(e.target.value)}
            placeholder={
              collegePersonaId
                ? `e.g. why ${SCHOOLS.find((s) => s.id === collegePersonaId)?.shortName} specifically — what does this school offer that no other does?`
                : "Pick a school first to see suggestions"
            }
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors"
          />
        </motion.div>

        {/* Feedback language */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">
              <Globe2 className="w-3 h-3" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Feedback language</h2>
          </div>
          <select
            value={feedbackLanguage}
            onChange={(e) => setFeedbackLanguage(e.target.value)}
            className="w-full sm:w-80 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/90 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-colors appearance-none cursor-pointer"
          >
            {FEEDBACK_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                {l.nativeLabel} {l.code !== "en" ? `(${l.label})` : ""}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-white/30 mt-2 leading-relaxed">
            Interview is always in English (matches the real thing). Your scorecard and feedback will be in this language.
          </p>
        </motion.div>

        {/* Voice / Text mode (audit 2026-04-07: text fallback for users without mic) */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 flex items-center justify-center text-xs font-bold">
              <Headphones className="w-3 h-3" />
            </div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Interview mode</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setInputMode("voice")}
              className={`p-3.5 rounded-xl border text-left transition-colors ${
                inputMode === "voice"
                  ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
              }`}
            >
              <Mic className={`w-4 h-4 mb-2 ${inputMode === "voice" ? "text-violet-400" : "text-white/30"}`} />
              <div className={`text-[13px] font-semibold mb-0.5 ${inputMode === "voice" ? "text-white" : "text-white/70"}`}>Voice</div>
              <div className="text-[10px] text-white/30 leading-tight">Speak your answers — most realistic</div>
            </button>
            <button
              type="button"
              onClick={() => setInputMode("text")}
              className={`p-3.5 rounded-xl border text-left transition-colors ${
                inputMode === "text"
                  ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
              }`}
            >
              <MessageSquare className={`w-4 h-4 mb-2 ${inputMode === "text" ? "text-violet-400" : "text-white/30"}`} />
              <div className={`text-[13px] font-semibold mb-0.5 ${inputMode === "text" ? "text-white" : "text-white/70"}`}>Text</div>
              <div className="text-[10px] text-white/30 leading-tight">No mic needed — type your answers</div>
            </button>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Start button */}
        <motion.button
          onClick={handleStart}
          disabled={!canStart}
          className="group w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-500/15 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing interview...
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4" />
              Start Practice Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
