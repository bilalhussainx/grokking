// /counselor/session/[engagementId] — Phase 3 placeholder.
//
// This is the live collaboration room scaffold. Phase 3 implementation
// will mount the WebSocket adapter ported from educator-app's
// essayCollabWebSocket.js and wire Coach Kairos's Deepgram voice agent
// to convert counselor speech into draft inline comments.
//
// Today: the placeholder validates engagement membership and shows the
// planned UI shape so reviewers can see the platform surface area on the
// branch without waiting for the full impl.
//
// See docs/COUNSELOR_MARKETPLACE.md "Phase 3" + the educator-app
// architecture map in docs/PORTED_FROM.md (added when the repos are cloned).

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Mic, MessageSquare, Users, Construction, FileText } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

export default async function CounselorSessionRoom({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}) {
  const { engagementId } = await params;
  const userSupabase = await createServerSupabase();
  const {
    data: { user },
  } = await userSupabase.auth.getUser();
  if (!user) redirect("/login");

  const db = createAdminSupabase();
  const { data: engagement } = await db
    .from("cc_counselor_engagements")
    .select(`
      id, status, scope_jsonb,
      counselor:cc_counselors!counselor_id (id, user_id, display_name, slug),
      student:cc_student_profiles!student_id (id, user_id, preferred_name)
    `)
    .eq("id", engagementId)
    .maybeSingle();
  if (!engagement) notFound();

  type Engagement = {
    id: string;
    status: string;
    scope_jsonb: Record<string, unknown>;
    counselor: { id: string; user_id: string; display_name: string; slug: string } | { id: string; user_id: string; display_name: string; slug: string }[] | null;
    student: { id: string; user_id: string; preferred_name: string | null } | { id: string; user_id: string; preferred_name: string | null }[] | null;
  };
  const e = engagement as Engagement;
  const counselor = Array.isArray(e.counselor) ? e.counselor[0] : e.counselor;
  const student = Array.isArray(e.student) ? e.student[0] : e.student;

  const isParty = counselor?.user_id === user.id || student?.user_id === user.id;
  if (!isParty) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-white/60">
          You&apos;re not a participant in this engagement.
        </p>
      </div>
    );
  }

  const viewerRole = counselor?.user_id === user.id ? "counselor" : "student";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 mb-6">
        <div className="flex items-start gap-3">
          <Construction className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white mb-1">
              Live session room — Phase 3 (under construction)
            </p>
            <p className="text-[12.5px] text-white/65 leading-relaxed">
              The WebSocket layer (ported from educator-app&apos;s
              <code className="mx-1 px-1 py-0.5 rounded bg-black/40 text-amber-200">essayCollabWebSocket.js</code>),
              Liveblocks shared cursors, and Coach Kairos voice-to-comment
              pipeline land in Phase 3. This page is scaffolded today so
              the engagement lifecycle + party validation are reviewable on
              the branch.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-bold text-white mb-1">
        Session with{" "}
        {viewerRole === "counselor"
          ? (student?.preferred_name ?? "Student")
          : (counselor?.display_name ?? "Counselor")}
      </h1>
      <p className="text-[12px] text-white/50 mb-6">
        Engagement {e.id.slice(0, 8)} · status:{" "}
        <span className="text-white/75">{e.status}</span> · viewing as{" "}
        <span className="text-[#D4AF37]">{viewerRole}</span>
      </p>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT: doc panel placeholder */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-wider text-white/45">
            <FileText className="w-3.5 h-3.5" /> Document panel
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed">
            Phase 3 mounts the Liveblocks shared editor here. The counselor
            sees the student&apos;s essay / supplement read-only by default
            with the inline comment composer; the student sees comments
            stream in live with a follow-up reply box.
          </p>
        </div>

        {/* RIGHT: voice + comments rail */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-white/45">
              <Mic className="w-3.5 h-3.5" /> Counselor voice notes
            </div>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Coach Kairos&apos;s Deepgram WebSocket is reused here. The
              counselor speaks; the LLM distills the transcript into draft
              inline comments anchored to the current selection.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-white/45">
              <MessageSquare className="w-3.5 h-3.5" /> Comment stream
            </div>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Resolved / open / by-author filters. Saved to{" "}
              <code className="text-amber-200">cc_counselor_session_comments</code>.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2 text-[11px] uppercase tracking-wider text-white/45">
              <Users className="w-3.5 h-3.5" /> Presence
            </div>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Liveblocks shared cursors + presence chips, same pattern
              educator-app uses.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-[12px] text-white/45">
        Back to{" "}
        <Link href="/cc/dashboard" className="text-[#D4AF37] hover:underline">
          dashboard
        </Link>
      </div>
    </div>
  );
}
