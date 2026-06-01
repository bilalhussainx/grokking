"use client";

import "./onboarding.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Compass,
  DollarSign,
  Activity,
  FileText,
  Headphones,
  MessageSquare,
  Move,
  Sparkles,
  Book,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Languages — superset matching the design mockup. Voice == TTS+STT in-language.
// Coverage:
//   Deepgram Aura-2 TTS (7) — en, es, fr, de, it, nl, ja
//   Sarvam Bulbul v3 TTS (10) — hi, bn, ta, te, gu, kn, ml, mr, pa, od
//   Google Cloud TTS (8) — ur, zh, ko, ar, vi, pt, ru, tr (top international
//     student source markets for US/UK/Canadian universities, wired May 2026)
// All STT runs through Deepgram nova-3 except Punjabi (Sarvam saaras) and
// Urdu (added to nova-3 in January 2026).
// ─────────────────────────────────────────────────────────────────────────
type Lang = {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  voice: boolean;
  script?: "urdu" | "arabic" | "devanagari" | "gurmukhi" | "bengali" | "tamil";
};

const LANGS: Lang[] = [
  { code: "en", name: "English", flag: "🇺🇸", greeting: "I'm here to listen to your story.", voice: true },
  { code: "es", name: "Español", flag: "🇪🇸", greeting: "Estoy aquí para escuchar tu historia.", voice: true },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", greeting: "मैं तुम्हारी कहानी सुनने के लिए यहाँ हूँ।", voice: true, script: "devanagari" },
  { code: "ur", name: "اردو", flag: "🇵🇰", greeting: "میں تمہاری کہانی سننے کے لیے یہاں ہوں۔", voice: true, script: "urdu" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳", greeting: "ਮੈਂ ਤੁਹਾਡੀ ਕਹਾਣੀ ਸੁਣਨ ਲਈ ਇੱਥੇ ਹਾਂ।", voice: true, script: "gurmukhi" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩", greeting: "তোমার গল্প শুনতে আমি এখানে আছি।", voice: true, script: "bengali" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳", greeting: "உன் கதை கேட்க இங்கே இருக்கிறேன்.", voice: true, script: "tamil" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳", greeting: "તારી વાર્તા સાંભળવા હું અહીં છું.", voice: true },
  { code: "mr", name: "मराठी", flag: "🇮🇳", greeting: "तुझी गोष्ट ऐकायला मी इथे आहे.", voice: true, script: "devanagari" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳", greeting: "నీ కథ వినడానికి నేను ఇక్కడ ఉన్నాను.", voice: true },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳", greeting: "ನಿಮ್ಮ ಕಥೆಯನ್ನು ಕೇಳಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.", voice: true },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳", greeting: "നിങ്ങളുടെ കഥ കേൾക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.", voice: true },
  { code: "od", name: "ଓଡ଼ିଆ", flag: "🇮🇳", greeting: "ତୁମ କଥା ଶୁଣିବାକୁ ମୁଁ ଏଠାରେ ଅଛି.", voice: true },
  { code: "zh", name: "中文", flag: "🇨🇳", greeting: "我在这里聆听你的故事。", voice: true },
  { code: "ko", name: "한국어", flag: "🇰🇷", greeting: "당신의 이야기를 듣고 있어요.", voice: true },
  { code: "ar", name: "العربية", flag: "🇸🇦", greeting: "أنا هنا لأصغي إلى قصتك.", voice: true, script: "arabic" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", greeting: "Tôi ở đây để lắng nghe câu chuyện của bạn.", voice: true },
  { code: "pt", name: "Português", flag: "🇧🇷", greeting: "Estou aqui para ouvir sua história.", voice: true },
  { code: "ru", name: "Русский", flag: "🇷🇺", greeting: "Я здесь, чтобы выслушать твою историю.", voice: true },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", greeting: "Hikayeni dinlemek için buradayım.", voice: true },
  { code: "fr", name: "Français", flag: "🇫🇷", greeting: "Je suis ici pour écouter ton histoire.", voice: true },
  { code: "de", name: "Deutsch", flag: "🇩🇪", greeting: "Ich bin hier, um deine Geschichte zu hören.", voice: true },
  { code: "it", name: "Italiano", flag: "🇮🇹", greeting: "Sono qui per ascoltare la tua storia.", voice: true },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", greeting: "Ik ben hier om je verhaal te horen.", voice: true },
  { code: "ja", name: "日本語", flag: "🇯🇵", greeting: "あなたの物語を聞きにきました。", voice: true },
];

const GRADES = [
  { g: 9, label: "Grade 9", cap: "Build the foundation — explore activities, take ownership of grades.", runway: 25 },
  { g: 10, label: "Grade 10", cap: "Add depth + take PSAT. Start narrowing the story you'll tell.", runway: 50 },
  { g: 11, label: "Grade 11", cap: "Junior year — runway. Test prep peaks, school list takes shape.", runway: 75 },
  { g: 12, label: "Grade 12", cap: "It's go time. Essays, applications, aid, decisions.", runway: 100 },
];

type ConcernId = "deadlines" | "aid" | "essays" | "activities" | "interviews" | "unsure";
const CONCERNS: { id: ConcernId; ic: typeof Calendar; title: string; cap: string }[] = [
  { id: "deadlines", ic: Calendar, title: "Deadlines", cap: "Tracking when everything is due." },
  { id: "aid", ic: DollarSign, title: "Aid", cap: "Making sure I can afford it." },
  { id: "essays", ic: FileText, title: "Essays", cap: "Writing the personal statement." },
  { id: "activities", ic: Activity, title: "Activities", cap: "Telling my story." },
  { id: "interviews", ic: MessageSquare, title: "Interviews", cap: "Getting ready to be interviewed." },
  { id: "unsure", ic: Compass, title: "I don't know yet", cap: "Tell me where to start." },
];

type StepKey = "lang" | "role" | "grade" | "transfer" | "concerns" | "landed";

type TransferForm = {
  school: string;
  credits: string;
  term: string;
  gpa: string;
  why: string;
};

type Profile = {
  lang: string | null;
  role: "hs" | "tx" | null;
  grade: number | null;
  concerns: ConcernId[];
  transfer: TransferForm;
};

const TOTAL_DOTS = 4;
const STEP_DOT_IDX: Record<StepKey, number> = {
  lang: 0,
  role: 1,
  grade: 2,
  transfer: 2,
  concerns: 3,
  landed: 4,
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>("lang");
  const [stepIn, setStepIn] = useState(true);
  const [profile, setProfile] = useState<Profile>({
    lang: null,
    role: null,
    grade: null,
    concerns: [],
    transfer: { school: "", credits: "", term: "", gpa: "", why: "" },
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Only true once /api/cc/onboarding/complete has confirmed the write that
  // sets language_picker_seen_at. The landed step must NOT navigate to the
  // dashboard before this — otherwise middleware sees a null sentinel and
  // bounces the user straight back to /onboarding (BUG-001).
  const [persistedOk, setPersistedOk] = useState(false);
  const completedRef = useRef(false);

  // Cross-fade between steps. The current step fades out, then we swap and
  // fade in. Matches the HTML mockup's 220ms swap.
  const advance = (next: StepKey, patch: Partial<Profile> = {}) => {
    setProfile((p) => ({ ...p, ...patch }));
    setStepIn(false);
    window.setTimeout(() => {
      setStep(next);
      requestAnimationFrame(() => setStepIn(true));
    }, 220);
  };

  const stepDotIdx = STEP_DOT_IDX[step];

  // ── Per-step handlers ────────────────────────────────────────────────
  // Single-select steps use select → Continue (not click-to-auto-advance).
  // Selecting only highlights the choice; the explicit Continue button
  // advances. This gives the user control + obvious feedback that their click
  // registered, instead of a card silently jumping to the next step (BUG-005).
  const selectLang = (code: string) => setProfile((p) => ({ ...p, lang: code }));
  const continueFromLang = () => {
    if (profile.lang) advance("role");
  };
  const selectRole = (role: "hs" | "tx") => setProfile((p) => ({ ...p, role }));
  const continueFromRole = () => {
    if (profile.role === "tx") advance("transfer");
    else if (profile.role === "hs") advance("grade");
  };
  const selectGrade = (g: number) => setProfile((p) => ({ ...p, grade: g }));
  const continueFromGrade = () => {
    const g = profile.grade;
    if (!g) return;
    if (g === 9 || g === 10) {
      advance("landed");
      void persist({ ...profile, grade: g });
    } else {
      advance("concerns");
    }
  };
  const onSubmitTransfer = () => {
    advance("landed");
    void persist({ ...profile, role: "tx" });
  };
  const toggleConcern = (id: ConcernId) =>
    setProfile((p) => {
      const i = p.concerns.indexOf(id);
      if (i !== -1) return { ...p, concerns: p.concerns.filter((x) => x !== id) };
      if (p.concerns.length >= 2) return p;
      return { ...p, concerns: [...p.concerns, id] };
    });
  const onSubmitConcerns = () => {
    advance("landed");
    void persist(profile);
  };

  const persist = async (final: Profile) => {
    if (completedRef.current) return;
    completedRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cc/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: final.lang,
          role: final.role,
          grade: final.grade,
          concerns: final.concerns,
          transfer:
            final.role === "tx"
              ? {
                  currentSchool: final.transfer.school.trim(),
                  creditsCompleted: Number(final.transfer.credits) || null,
                  targetTerm: final.transfer.term.trim(),
                  gpa: final.transfer.gpa.trim(),
                  reason: final.transfer.why.trim(),
                }
              : null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Status ${res.status}`);
      }
      try {
        if (final.lang) {
          localStorage.setItem("coach_kairos_language", final.lang);
          localStorage.setItem("coach-language", final.lang);
        }
      } catch {
        /* ignore quota */
      }
      setPersistedOk(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      completedRef.current = false; // allow retry
    } finally {
      setSubmitting(false);
    }
  };

  const goToDashboard = () => {
    // Hard navigation (not router.push) so the freshly-written onboarding
    // sentinel cookie/session reaches middleware on the /cc/dashboard request.
    // Soft client nav was dropping cookies and looping back to /onboarding.
    window.location.assign("/cc/dashboard");
  };

  const onSkip = async () => {
    if (!confirm("Sign out and return later? Your progress will be saved.")) return;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.push("/landing");
  };

  return (
    <div className="kl-onboard">
      <div className="top">
        <div className="wordmark">
          <div className="seal">k</div>
          <span>
            <em>Kairos</em>Learn
          </span>
        </div>
        <div className="dots" aria-label={`Step ${stepDotIdx + 1} of ${TOTAL_DOTS}`}>
          {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
            <span
              key={i}
              className={"dot " + (i < stepDotIdx ? "done" : i === stepDotIdx ? "active" : "")}
            />
          ))}
        </div>
        <button type="button" className="skip" onClick={onSkip}>
          Sign out
        </button>
      </div>

      <div className="canvas">
        <div className={"step " + (stepIn ? "in" : "")}>
          {step === "lang" && (
            <StepLanguage value={profile.lang} onSelect={selectLang} onContinue={continueFromLang} />
          )}
          {step === "role" && (
            <StepRole value={profile.role} onSelect={selectRole} onContinue={continueFromRole} />
          )}
          {step === "grade" && (
            <StepGrade value={profile.grade} onSelect={selectGrade} onContinue={continueFromGrade} />
          )}
          {step === "transfer" && (
            <StepTransfer
              form={profile.transfer}
              setForm={(t) => setProfile((p) => ({ ...p, transfer: t }))}
              onSubmit={onSubmitTransfer}
            />
          )}
          {step === "concerns" && (
            <StepConcerns
              value={profile.concerns}
              onToggle={toggleConcern}
              onSubmit={onSubmitConcerns}
            />
          )}
          {step === "landed" && (
            <StepLanded
              profile={profile}
              submitting={submitting}
              error={error}
              persistedOk={persistedOk}
              onContinue={goToDashboard}
              onRetry={() => persist(profile)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Language ─────────────────────────────────────────────────────
function StepLanguage({
  value,
  onSelect,
  onContinue,
}: {
  value: string | null;
  onSelect: (code: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="eyebrow">
        <span className="rule" /> Step 01 — Voice
      </div>
      <h1 className="h-display">
        What language do you <em>think in?</em>
      </h1>
      <p className="lede">
        Coach Kairos will speak with you in this language. You can switch any time — your dashboard
        stays in English so handoffs to counselors and parents work.
      </p>

      <div className="lang-grid">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            className={"lang-tile " + (value === l.code ? "active" : "")}
            data-script={l.script ?? undefined}
            onClick={() => onSelect(l.code)}
          >
            <div className="row1">
              <span className="lang-flag" aria-hidden>
                {l.flag}
              </span>
              <span className={"lang-mode " + (l.voice ? "" : "text")}>
                {l.voice ? "Voice + Text" : "Text only"}
              </span>
            </div>
            <div className="lang-name" dir="auto">
              {l.name}
            </div>
            <div className="lang-greet" dir="auto">
              &ldquo;{l.greeting}&rdquo;
            </div>
            <div className="seal-check" aria-hidden>
              <Check size={11} strokeWidth={2.5} />
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
        <button type="button" className="btn-gold" onClick={onContinue} disabled={!value}>
          {value ? "Continue" : "Pick a language to continue"} <ArrowRight size={16} />
        </button>
      </div>

      <div className="lang-foot">
        <div className="pill-info">
          <span className="dot-i" />
          25 languages today &nbsp;·&nbsp; more rolling out through 2026
        </div>
        <div className="pill-info" style={{ color: "rgba(242,237,227,.40)" }}>
          <Headphones size={12} /> Voice mode uses your device mic. We never store raw audio.
        </div>
      </div>
    </>
  );
}

// ── Step 2: Role ─────────────────────────────────────────────────────────
function StepRole({
  value,
  onSelect,
  onContinue,
}: {
  value: "hs" | "tx" | null;
  onSelect: (role: "hs" | "tx") => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="eyebrow">
        <span className="rule" /> Step 02 — Who you are
      </div>
      <h1 className="h-display">
        Where are you in the <em>journey?</em>
      </h1>
      <p className="lede">
        Two paths through KairosLearn. Pick the one that matches today — you can always change it
        from settings.
      </p>

      <div className="choice-grid">
        <button
          type="button"
          className={"choice " + (value === "hs" ? "active" : "")}
          onClick={() => onSelect("hs")}
        >
          <div className="side-rune" aria-hidden>
            <Book size={26} strokeWidth={1.4} />
          </div>
          <div className="eyebrow" style={{ marginTop: 6 }}>
            Path A
          </div>
          <h3>
            I&rsquo;m in <em>high school</em>
          </h3>
          <p>
            Looking ahead to college applications. We&rsquo;ll calibrate by grade and surface what
            matters at your stage.
          </p>
          <div className="meta-row">
            <span>Calibrate by grade · Build the runway</span>
            <span className="arrow-cap">
              <ArrowRight size={14} />
            </span>
          </div>
        </button>

        <button
          type="button"
          className={"choice " + (value === "tx" ? "active" : "")}
          onClick={() => onSelect("tx")}
        >
          <div className="side-rune" aria-hidden>
            <Move size={26} strokeWidth={1.4} />
          </div>
          <div className="eyebrow" style={{ marginTop: 6 }}>
            Path B
          </div>
          <h3>
            I&rsquo;m applying to <em>transfer</em>
          </h3>
          <p>
            Already in college, looking to switch schools. Different timelines, different essays —
            we&rsquo;ll skip the high-school noise.
          </p>
          <div className="meta-row">
            <span>Credit map · Transfer-essay coach</span>
            <span className="arrow-cap">
              <ArrowRight size={14} />
            </span>
          </div>
        </button>
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
        <button type="button" className="btn-gold" onClick={onContinue} disabled={!value}>
          {value ? "Continue" : "Pick your path to continue"} <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

// ── Step 3a: Grade ───────────────────────────────────────────────────────
function StepGrade({
  value,
  onSelect,
  onContinue,
}: {
  value: number | null;
  onSelect: (g: number) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="eyebrow">
        <span className="rule" /> Step 03 — Calibrate
      </div>
      <h1 className="h-display">
        What grade are you <em>in?</em>
      </h1>
      <p className="lede">
        This decides what your dashboard surfaces first. Grade 11 and 12 get application-cycle
        modules; grade 9 and 10 get foundation work.
      </p>

      <div className="grade-row">
        {GRADES.map((g) => (
          <button
            key={g.g}
            type="button"
            className={"grade " + (value === g.g ? "active" : "")}
            onClick={() => onSelect(g.g)}
          >
            <div className="num">{g.g}</div>
            <div className="label">{g.label}</div>
            <div className="cap">{g.cap}</div>
            <div className="runway" aria-hidden>
              <span style={{ width: `${g.runway}%` }} />
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
        <button type="button" className="btn-gold" onClick={onContinue} disabled={!value}>
          {value ? "Continue" : "Pick your grade to continue"} <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

// ── Step 3b: Transfer ────────────────────────────────────────────────────
function StepTransfer({
  form,
  setForm,
  onSubmit,
}: {
  form: TransferForm;
  setForm: (f: TransferForm) => void;
  onSubmit: () => void;
}) {
  const valid = useMemo(
    () =>
      Boolean(
        form.school.trim() &&
          form.credits &&
          form.term.trim() &&
          form.why.trim().length > 12,
      ),
    [form],
  );

  return (
    <>
      <div className="eyebrow">
        <span className="rule" /> Step 03 — Transfer profile
      </div>
      <h1 className="h-display">
        Tell me about <em>where you are.</em>
      </h1>
      <p className="lede">
        Transfer apps run on a different clock — and your story has to explain the why. Five lines
        now means a sharper coach later.
      </p>

      <div className="form-wrap">
        <div className="field">
          <label>
            Current school <span className="req">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rutgers University–New Brunswick"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
        </div>
        <div className="field">
          <label>
            Credits completed <span className="req">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 32"
            min={0}
            max={200}
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: e.target.value })}
          />
          <div className="helper">Including transferred credits from prior schools.</div>
        </div>
        <div className="field">
          <label>
            Target term <span className="req">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Fall 2026"
            value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}
          />
        </div>
        <div className="field">
          <label>
            Current GPA{" "}
            <span
              className="helper"
              style={{ textTransform: "none", letterSpacing: 0, marginLeft: 4 }}
            >
              (optional)
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. 3.65"
            value={form.gpa}
            onChange={(e) => setForm({ ...form, gpa: e.target.value })}
          />
        </div>
        <div className="field full">
          <label>
            Why are you transferring? <span className="req">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="A few sentences is enough. Coach Kairos will draft your transfer essay from this — be honest, not polished."
            value={form.why}
            onChange={(e) => setForm({ ...form, why: e.target.value })}
          />
          <div className="helper">
            {form.why.length} chars · target 80–250 for the best draft seed.
          </div>
        </div>
      </div>

      <div className="advance-bar">
        <div style={{ fontSize: 12, color: "rgba(242,237,227,.45)", fontFamily: "DM Sans" }}>
          We&rsquo;ll skip the grade-level questions — your dashboard goes straight to transfer mode.
        </div>
        <button type="button" className="btn-gold" disabled={!valid} onClick={onSubmit}>
          Take me to my dashboard <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

// ── Step 4: Concerns ─────────────────────────────────────────────────────
function StepConcerns({
  value,
  onToggle,
  onSubmit,
}: {
  value: ConcernId[];
  onToggle: (id: ConcernId) => void;
  onSubmit: () => void;
}) {
  const max = 2;
  const can = value.length > 0;

  return (
    <>
      <div className="eyebrow">
        <span className="rule" /> Step 04 — Pin your dashboard
      </div>
      <h1 className="h-display">
        What&rsquo;s <em>weighing</em> on you?
      </h1>
      <p className="lede">
        Pick up to two. These pin to the top of your dashboard so the right module&rsquo;s always
        one tap away. Everything else is one nav click deeper.
      </p>

      <div className="concerns">
        {CONCERNS.map((c) => {
          const idx = value.indexOf(c.id);
          const isActive = idx !== -1;
          const locked = !isActive && value.length >= max;
          const Ic = c.ic;
          return (
            <button
              key={c.id}
              type="button"
              className={"concern " + (isActive ? "active " : "") + (locked ? "locked" : "")}
              onClick={() => !locked && onToggle(c.id)}
              disabled={locked}
            >
              <div className="ic" aria-hidden>
                <Ic size={16} />
              </div>
              <h4>{c.title}</h4>
              <p>{c.cap}</p>
              {isActive && <div className="order-bullet">{idx + 1}</div>}
            </button>
          );
        })}
      </div>

      <div className="advance-bar">
        <div className="concern-counter">
          <b>{value.length}</b> / {max} pinned · pick up to two
        </div>
        <button type="button" className="btn-gold" disabled={!can} onClick={onSubmit}>
          Take me to my dashboard <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

// ── Final landing ────────────────────────────────────────────────────────
function StepLanded({
  profile,
  submitting,
  error,
  persistedOk,
  onContinue,
  onRetry,
}: {
  profile: Profile;
  submitting: boolean;
  error: string | null;
  persistedOk: boolean;
  onContinue: () => void;
  onRetry: () => void;
}) {
  const langName = LANGS.find((l) => l.code === profile.lang)?.name || "English";

  // Auto-advance to the dashboard 1.5s AFTER the completion write is confirmed
  // (persistedOk). Gating on persistedOk — not just !submitting — prevents the
  // timer firing before the language_picker_seen_at sentinel is committed,
  // which would bounce the user back to /onboarding (BUG-001).
  useEffect(() => {
    if (persistedOk && !error) {
      const t = window.setTimeout(onContinue, 1500);
      return () => window.clearTimeout(t);
    }
  }, [persistedOk, error, onContinue]);

  return (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 84,
          height: 84,
          borderRadius: 999,
          border: "1px solid rgba(212,175,55,.45)",
          background: "rgba(212,175,55,.10)",
          color: "#d4a84b",
          margin: "20px auto 28px",
        }}
      >
        <Sparkles size={32} strokeWidth={1.3} />
      </div>
      <div className="eyebrow" style={{ justifyContent: "center" }}>
        <span className="rule" /> Welcome to KairosLearn
      </div>
      <h1 className="h-display" style={{ textAlign: "center" }}>
        Your dashboard&rsquo;s <em>ready.</em>
      </h1>
      <p className="lede" style={{ margin: "0 auto" }}>
        Coach Kairos is loading your profile. Speaking{" "}
        <b style={{ color: "#d4a84b", fontWeight: 600 }}>{langName}</b>
        {profile.role === "hs" && (
          <>
            , calibrated for{" "}
            <b style={{ color: "#d4a84b", fontWeight: 600 }}>Grade {profile.grade}</b>
          </>
        )}
        {profile.role === "tx" && (
          <>
            , on the <b style={{ color: "#d4a84b", fontWeight: 600 }}>transfer track</b>
          </>
        )}
        {profile.concerns.length > 0 && (
          <>
            , pinned with{" "}
            <b style={{ color: "#d4a84b", fontWeight: 600 }}>{profile.concerns.join(" + ")}</b>
          </>
        )}
        .
      </p>

      <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 12 }}>
        <button
          type="button"
          className="btn-gold"
          onClick={onContinue}
          disabled={!persistedOk || !!error}
        >
          {persistedOk ? "Open my dashboard" : "Saving your profile…"} <ArrowRight size={16} />
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            color: "rgb(252, 165, 165)",
          }}
        >
          <span>Couldn&apos;t save: {error}</span>
          <button type="button" className="btn-ghost" onClick={onRetry}>
            <ArrowLeft size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
