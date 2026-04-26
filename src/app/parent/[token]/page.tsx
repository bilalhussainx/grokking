// Public parent portal — token-gated, read-only summary in the parent's
// preferred language. The parent doesn't need a Supabase auth session;
// the invite_token IS the auth.
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Invite = {
  id: string;
  student_id: string;
  parent_name: string | null;
  parent_email: string;
  preferred_language: string;
  expires_at: string;
};

const HEADERS: Record<string, { greeting: string; status: string; aid: string; essays: string; voice: string }> = {
  en: {
    greeting: "Welcome",
    status: "Application status",
    aid: "Financial aid posture",
    essays: "Essay progress",
    voice: "Speak with Coach Kairos in your language",
  },
  ur: {
    greeting: "خوش آمدید",
    status: "درخواست کی حیثیت",
    aid: "مالی امداد کی صورتحال",
    essays: "مضمون کی پیش رفت",
    voice: "اپنی زبان میں Coach Kairos سے بات کریں",
  },
  hi: {
    greeting: "स्वागत है",
    status: "आवेदन की स्थिति",
    aid: "वित्तीय सहायता की स्थिति",
    essays: "निबंध की प्रगति",
    voice: "अपनी भाषा में Coach Kairos से बात करें",
  },
  pa: {
    greeting: "ਜੀ ਆਇਆਂ ਨੂੰ",
    status: "ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ",
    aid: "ਮਾਲੀ ਸਹਾਇਤਾ ਦੀ ਸਥਿਤੀ",
    essays: "ਨਿਬੰਧ ਦੀ ਤਰੱਕੀ",
    voice: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ Coach Kairos ਨਾਲ ਗੱਲ ਕਰੋ",
  },
};

export default async function ParentPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const { data: invite } = await supabase
    .from("cc_parent_invites")
    .select("id, student_id, parent_name, parent_email, preferred_language, expires_at")
    .eq("invite_token", token)
    .maybeSingle();

  if (!invite) return notFound();
  const inv = invite as Invite;
  if (new Date(inv.expires_at) < new Date()) {
    return (
      <div className="p-12 max-w-md mx-auto text-center text-white">
        <h1 className="text-xl font-semibold mb-2">Invite expired</h1>
        <p className="text-white/55 text-sm">Ask your child to send you a fresh link.</p>
      </div>
    );
  }

  // Mark accepted on first view.
  await supabase
    .from("cc_parent_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", inv.id)
    .is("accepted_at", null);

  const lang = inv.preferred_language || "en";
  const labels = HEADERS[lang] ?? HEADERS.en;
  const isRTL = lang === "ur";

  // Pull a privacy-restricted student summary.
  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("preferred_name, grade_level, country, affordability_value, needs_full_aid")
    .eq("id", inv.student_id)
    .maybeSingle();

  const { data: schools } = await supabase
    .from("cc_student_schools")
    .select("application_status, chancing_band, cc_schools(name)")
    .eq("student_id", inv.student_id);

  const { data: essays } = await supabase
    .from("cc_essays")
    .select("phase")
    .eq("student_id", inv.student_id);

  type Sch = { application_status: string | null; chancing_band: string | null; cc_schools?: { name?: string } | { name?: string }[] | null };
  const sList = ((schools ?? []) as Sch[]).map((s) => {
    const sch = Array.isArray(s.cc_schools) ? s.cc_schools[0] : s.cc_schools;
    return {
      name: sch?.name ?? "Unknown",
      band: s.chancing_band ?? "n/a",
      status: s.application_status ?? "researching",
    };
  });

  const submitted = (essays ?? []).filter((e) => e.phase === "submitted" || e.phase === "final").length;
  const total = (essays ?? []).length;

  return (
    <div
      lang={lang}
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#05080d] text-white px-6 py-8"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-[12px] text-white/55 uppercase tracking-wider">{labels.greeting}</p>
          <h1 className="text-2xl font-semibold">
            {inv.parent_name ?? inv.parent_email}
          </h1>
          <p className="text-[13px] text-white/65 mt-1">
            {profile?.preferred_name ?? "your student"}
            {profile?.grade_level ? ` · Grade ${profile.grade_level}` : ""}
          </p>
        </div>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold mb-3">{labels.status}</h2>
          {sList.length === 0 ? (
            <p className="text-[12px] text-white/45 italic">No schools yet.</p>
          ) : (
            <ul className="space-y-1.5 text-[13px]">
              {sList.map((s, i) => (
                <li key={i} className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>{s.name}</span>
                  <span className="text-white/55 text-[12px]">{s.band} · {s.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold mb-2">{labels.aid}</h2>
          <p className="text-[13px] text-white/75">
            {profile?.needs_full_aid
              ? "Needs full financial aid — focus on need-blind schools."
              : profile?.affordability_value && profile.affordability_value > 30000
                ? `Affordability ~$${profile.affordability_value}/year — flexible.`
                : "Aid posture not yet specified."}
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-[13px] font-semibold mb-2">{labels.essays}</h2>
          <p className="text-[13px] text-white/75">
            {submitted}/{Math.max(total, submitted)} essays submitted.
          </p>
        </section>

        <section className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4">
          <h2 className="text-[13px] font-semibold mb-2 text-[#D4AF37]">{labels.voice}</h2>
          <p className="text-[12.5px] text-white/75">
            {lang === "ur"
              ? "آپ کا بیٹا/بیٹی اپنے ڈیشبورڈ سے 'Hand to parent' بٹن دبا کر آپ کو فیملی موڈ میں جوڑ سکتا ہے۔"
              : lang === "hi"
                ? "आपका बच्चा अपने डैशबोर्ड पर 'Hand to parent' बटन से आपको Family Mode में जोड़ सकता है।"
                : lang === "pa"
                  ? "ਤੁਹਾਡਾ ਬੱਚਾ ਆਪਣੇ ਡੈਸ਼ਬੋਰਡ 'ਤੇ 'Hand to parent' ਬਟਨ ਰਾਹੀਂ ਤੁਹਾਨੂੰ Family Mode ਵਿੱਚ ਜੋੜ ਸਕਦਾ ਹੈ।"
                  : "Your student can hand you the phone any time using the 'Hand to parent' button on their dashboard, and Coach Kairos will speak with you in your language."}
          </p>
        </section>
      </div>
    </div>
  );
}
