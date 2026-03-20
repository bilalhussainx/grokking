"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_SUPPORTED_LANGUAGES } from "@/lib/voice-provider-router";
import { ChevronRight, Globe, BookOpen, Mic, MessageSquare, GraduationCap, Sparkles } from "lucide-react";

const STEPS = ["language", "interests", "style", "privacy", "summary"] as const;
type Step = typeof STEPS[number];

const INTEREST_CATEGORIES = [
  { id: "coding", name: "Programming & CS", icon: "💻", examples: "Python, JavaScript, Data Structures" },
  { id: "ai-ml", name: "AI & Machine Learning", icon: "🤖", examples: "Prompt Engineering, RAG, Neural Networks" },
  { id: "system-design", name: "System Design", icon: "🏗️", examples: "Architecture, Scalability, Microservices" },
  { id: "interview-prep", name: "Interview Prep", icon: "🎯", examples: "Coding Interviews, Behavioral, Mock Interviews" },
  { id: "finance", name: "Finance & Business", icon: "📈", examples: "Investing, Accounting, Economics" },
  { id: "languages", name: "Language Learning", icon: "🌍", examples: "Spanish, French, Hindi, Chinese" },
  { id: "religion", name: "Religion & Philosophy", icon: "📖", examples: "Islam, Christianity, Buddhism, Stoicism" },
  { id: "personal-growth", name: "Personal Growth", icon: "🌱", examples: "Leadership, Mindfulness, Negotiation" },
];

const FLUENCY_LEVELS = [
  { id: "beginner", name: "Beginner", desc: "I'm just starting to learn English" },
  { id: "intermediate", name: "Intermediate", desc: "I can read and understand most English text" },
  { id: "advanced", name: "Advanced", desc: "I'm fluent but not a native speaker" },
  { id: "native", name: "Native", desc: "English is my first language" },
];

const LEARNING_STYLES = [
  { id: "auditory", name: "Listen & Discuss", icon: <Mic className="w-5 h-5" />, desc: "I learn best by listening to explanations and discussing" },
  { id: "reading", name: "Read & Write", icon: <BookOpen className="w-5 h-5" />, desc: "I prefer reading material and typing my questions" },
  { id: "balanced", name: "Mix of Both", icon: <MessageSquare className="w-5 h-5" />, desc: "I like switching between voice and text depending on the topic" },
];

const COMM_MODES = [
  { id: "voice_and_text", name: "Voice + Text", desc: "Coach speaks to me, I can speak or type" },
  { id: "voice_only", name: "Voice Only", desc: "Full voice conversation with Coach" },
  { id: "text_only", name: "Text Only", desc: "I prefer reading and typing only" },
];

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <OnboardingInner />
    </Suspense>
  );
}

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const isNewUser = searchParams.get("new") === "1";

  // If this is a new user (sent here by auth callback), clear any stale localStorage
  useEffect(() => {
    if (isNewUser) {
      localStorage.removeItem("onboarding_complete");
    }
  }, [isNewUser]);

  // Only redirect if onboarding was completed AND this is not a fresh signup redirect
  const [shouldRedirect, setShouldRedirect] = useState(false);
  useEffect(() => {
    if (!isNewUser && localStorage.getItem("onboarding_complete") === "true") {
      setShouldRedirect(true);
      router.replace("/");
    }
  }, [router, isNewUser]);

  if (shouldRedirect) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse text-white/40">Redirecting...</div>
      </div>
    );
  }

  const [step, setStep] = useState<Step>("language");
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [instructionLanguage, setInstructionLanguage] = useState("en");
  const [wantInstruction, setWantInstruction] = useState<boolean | null>(null);
  const [englishFluency, setEnglishFluency] = useState("intermediate");
  const [interests, setInterests] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState("balanced");
  const [commMode, setCommMode] = useState("voice_and_text");
  const [personalizationConsent, setPersonalizationConsent] = useState(false);
  const [saving, setSaving] = useState(false);

  const stepIdx = STEPS.indexOf(step);

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const finalInstructionLang = wantInstruction ? instructionLanguage : "en";

      // Save to Supabase
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          native_language: nativeLanguage,
          instruction_language: finalInstructionLang,
          english_fluency: englishFluency,
          learning_interests: interests,
          learning_style: learningStyle,
          communication_mode: commMode,
          onboarding_completed: true,
          personalization_consent: personalizationConsent,
        }),
      });

      // Also save to localStorage for immediate coach use
      localStorage.setItem("native-language", nativeLanguage);
      localStorage.setItem("coach-language", finalInstructionLang);
      localStorage.setItem("learning-style", learningStyle);
      localStorage.setItem("comm-mode", commMode);
      localStorage.setItem("learning-interests", JSON.stringify(interests));
      localStorage.setItem("english-fluency", englishFluency);
      localStorage.setItem("onboarding_complete", "true");

      // Redeem pending invite code from signup
      const pendingCode = localStorage.getItem("pending-invite-code");
      if (pendingCode) {
        try {
          const resp = await fetch("/api/invite/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: pendingCode }),
          });
          if (resp.ok) {
            const result = await resp.json();
            console.log("[Onboarding] Invite code redeemed:", result.granted);
          }
        } catch {}
        localStorage.removeItem("pending-invite-code");
      }

      router.push("/");
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSaving(false);
    }
  };

  // Step 1: Language
  const languageStep = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">What language do you speak?</h2>
        <p className="text-sm text-white/50">Coach Alex can explain lessons in your language</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm text-white/70">My native language</label>
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
          {ALL_SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setNativeLanguage(lang.code);
                if (lang.code !== "en") setWantInstruction(null); // Reset choice
              }}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                nativeLanguage === lang.code
                  ? "border-violet-500/50 bg-violet-500/10 text-white"
                  : "border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div>
                <div className="text-sm font-medium">{lang.name}</div>
                <div className="text-[10px] text-white/40">{lang.native}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {nativeLanguage !== "en" && (
        <div className="space-y-3 pt-2">
          <label className="text-sm text-white/70">How well do you understand English?</label>
          <div className="space-y-2">
            {FLUENCY_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setEnglishFluency(level.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  englishFluency === level.id
                    ? "border-cyan-500/50 bg-cyan-500/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="text-sm font-medium text-white">{level.name}</div>
                <div className="text-xs text-white/40">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {nativeLanguage !== "en" && (
        <div className="space-y-3 pt-2">
          <label className="text-sm text-white/70">
            Would you like Coach Alex to explain lessons in {ALL_SUPPORTED_LANGUAGES.find(l => l.code === nativeLanguage)?.name || "your language"}?
          </label>
          <p className="text-xs text-white/30">Course text stays in English, but the voice coach explains concepts in your chosen language. You can switch back to English anytime by telling Coach Alex.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setWantInstruction(true); setInstructionLanguage(nativeLanguage); }}
              className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                wantInstruction === true ? "border-violet-500/50 bg-violet-500/10 text-white" : "border-white/[0.08] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              <div className="text-sm font-medium">Yes, explain in {ALL_SUPPORTED_LANGUAGES.find(l => l.code === nativeLanguage)?.name}</div>
            </button>
            <button
              onClick={() => { setWantInstruction(false); setInstructionLanguage("en"); }}
              className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                wantInstruction === false ? "border-cyan-500/50 bg-cyan-500/10 text-white" : "border-white/[0.08] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              <div className="text-sm font-medium">No, keep it in English</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Step 2: Interests
  const interestsStep = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">What interests you?</h2>
        <p className="text-sm text-white/50">Pick as many as you like — we'll recommend courses</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {INTEREST_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleInterest(cat.id)}
            className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
              interests.includes(cat.id)
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <div className="text-sm font-medium text-white">{cat.name}</div>
              <div className="text-xs text-white/40">{cat.examples}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 3: Learning style & communication
  const styleStep = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">How do you like to learn?</h2>
        <p className="text-sm text-white/50">Coach Alex adapts to your preferred style</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm text-white/70">Learning approach</label>
        <div className="space-y-2">
          {LEARNING_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => setLearningStyle(style.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                learningStyle === style.id
                  ? "border-violet-500/50 bg-violet-500/10"
                  : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className={`${learningStyle === style.id ? "text-violet-400" : "text-white/40"}`}>
                {style.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{style.name}</div>
                <div className="text-xs text-white/40">{style.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm text-white/70">How do you want to communicate with Coach?</label>
        <div className="space-y-2">
          {COMM_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setCommMode(mode.id)}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                commMode === mode.id
                  ? "border-cyan-500/50 bg-cyan-500/10"
                  : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className="text-sm font-medium text-white">{mode.name}</div>
              <div className="text-xs text-white/40">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 4: Privacy & Personalization Consent
  const privacyStep = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Personalization & Privacy</h2>
        <p className="text-sm text-white/50">Help us make your experience better</p>
      </div>

      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">
          We can use your language, location, and learning preferences to personalize your experience — recommending relevant courses, adapting Coach Alex's teaching style, and matching you with the right voice and accent.
        </p>

        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <h4 className="text-sm font-medium text-emerald-400 mb-2">Our Privacy Promise</h4>
          <ul className="text-xs text-white/60 space-y-1.5">
            <li>- Your data is <strong className="text-white/80">never shared</strong> with other companies</li>
            <li>- Personalization data is <strong className="text-white/80">only used</strong> to improve YOUR learning experience</li>
            <li>- Data is stored in encrypted form and is <strong className="text-white/80">not accessible</strong> in any way that could identify you to third parties</li>
            <li>- You can delete all personalization data at any time from Settings</li>
            <li>- Coach conversations are <strong className="text-white/80">not used to train AI models</strong></li>
          </ul>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={personalizationConsent}
            onChange={(e) => setPersonalizationConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
          />
          <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
            I consent to personalized learning based on my language, preferences, and usage patterns. I understand this data stays on this platform and is never shared.
          </span>
        </label>
      </div>

      <p className="text-xs text-white/30">
        You can use the platform without consent — you'll still have full access to all courses and features, just with less personalization.
      </p>
    </div>
  );

  // Step 5: Summary
  const summaryStep = (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">You're all set!</h2>
        <p className="text-sm text-white/50">Here's how we'll personalize your experience</p>
      </div>

      <div className="space-y-3">
        <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-violet-400" />
            <div>
              <div className="text-sm text-white">Native: {ALL_SUPPORTED_LANGUAGES.find(l => l.code === nativeLanguage)?.name || nativeLanguage}</div>
              <div className="text-xs text-white/40">
                Coach speaks in: {wantInstruction ? ALL_SUPPORTED_LANGUAGES.find(l => l.code === instructionLanguage)?.name : "English"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <div className="text-sm text-white">
              Interests: {interests.length > 0 ? interests.map(i => INTEREST_CATEGORIES.find(c => c.id === i)?.name).join(", ") : "Not selected yet"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div className="text-sm text-white">
              Style: {LEARNING_STYLES.find(s => s.id === learningStyle)?.name} / {COMM_MODES.find(m => m.id === commMode)?.name}
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30">
          You can change any of these in Settings. Tell Coach Alex &quot;switch to English&quot; at any time during a lesson.
        </p>

        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 mt-4">
          <p className="text-xs text-amber-400 font-medium mb-1">Your Free Pro Trial</p>
          <p className="text-xs text-white/50">
            You have 1 month of full Pro access and 300 AI credits. After your trial, you can subscribe for $15/mo or continue with free-tier access (first 3 lessons of each premium course).
          </p>
        </div>
      </div>
    </div>
  );

  const stepContent = { language: languageStep, interests: interestsStep, style: styleStep, privacy: privacyStep, summary: summaryStep };
  const canProceed = step === "language"
    ? nativeLanguage === "en" || wantInstruction !== null
    : step === "interests"
    ? true // Interests are optional
    : true;

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIdx ? "bg-violet-500" : "bg-white/[0.08]"}`} />
          ))}
        </div>

        {/* Content */}
        {stepContent[step]}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {stepIdx > 0 ? (
            <button
              onClick={() => setStep(STEPS[stepIdx - 1])}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              Back
            </button>
          ) : (
            <div /> /* Empty spacer — onboarding cannot be skipped */
          )}

          {step === "summary" ? (
            <button
              onClick={savePreferences}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-cyan-400 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? "Saving..." : "Start Learning"}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setStep(STEPS[stepIdx + 1])}
              disabled={!canProceed}
              className="px-6 py-2.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/30 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
