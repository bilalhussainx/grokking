// src/app/cc/agent/activity/page.tsx
// "What Kairos did": the student-reachable S1 activity log (Task 7 ruling).
// Only S1 pilot students see it; for everyone else the route does not exist.
import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/supabase-auth";
import { isAgentS1User } from "@/lib/cc/agent/s1-flag";
import { ActivityLog } from "@/components/cc/agent/ActivityLog";
import "@/components/cc/agent/agent.css";

export const dynamic = "force-dynamic";

export default async function AgentActivityPage() {
  const user = await getAuthUser();
  if (!user || !isAgentS1User(user.id)) notFound();
  return (
    <main className="ka-page">
      <h1 className="ka-page-title">What Kairos did</h1>
      <p className="ka-meta">Everything Kairos checked or suggested for you, and what you confirmed. Kairos never saves anything without your OK.</p>
      <ActivityLog />
    </main>
  );
}
