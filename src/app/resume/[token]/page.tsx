// Resume link landing page. Anonymous users who dropped their email via
// ExitIntentModal land here after clicking the link in the Resend email.
//
// This is intentionally minimal: we show the saved snapshot and pre-fill a
// signup form. True anon-session restoration across devices needs service-role
// session minting which we haven't built yet — this page bridges the gap by
// using the lead's email as a stable identifier for account creation.
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase-server";
import ResumeSignupForm from "./ResumeSignupForm";

interface Snapshot {
  preferred_name?: string;
  schools?: Array<{ school_id: string; chancing_band: string | null }>;
  essays?: Array<{ id: string; essay_type: string | null; word_count: number | null }>;
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!token || token.length < 24) {
    redirect("/");
  }

  const admin = createAdminSupabase();
  const { data: lead } = await admin
    .from("marketing_leads")
    .select("email, snapshot, guest_user_id, created_at")
    .eq("resume_token", token)
    .maybeSingle();

  if (!lead) {
    redirect("/");
  }

  const snapshot = (lead.snapshot ?? null) as Snapshot | null;
  const preferredName = snapshot?.preferred_name ?? null;
  const schoolCount = snapshot?.schools?.length ?? 0;
  const essayCount = snapshot?.essays?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#05080d] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-white mb-3">
            {preferredName ? `Welcome back, ${preferredName}.` : "Welcome back."}
          </h1>
          <p className="text-white/70 leading-relaxed">
            Create an account to pick up where you left off — your progress is saved.
          </p>
        </div>

        {(schoolCount > 0 || essayCount > 0) && (
          <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="text-xs uppercase tracking-wider text-white/40 mb-2">
              What you saved
            </div>
            <ul className="text-sm text-white/80 space-y-1">
              {schoolCount > 0 && (
                <li>
                  {schoolCount} school{schoolCount === 1 ? "" : "s"} on your list
                </li>
              )}
              {essayCount > 0 && (
                <li>
                  {essayCount} essay draft{essayCount === 1 ? "" : "s"}
                </li>
              )}
            </ul>
          </div>
        )}

        <ResumeSignupForm email={lead.email} token={token} />

        <p className="text-xs text-white/40 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#E0BC4C] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
