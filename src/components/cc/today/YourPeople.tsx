"use client";

// "Your people": the linked counselor from the existing /api/cc/my-counselor.
// Unlinked students learn how invite links work; there is no bare /join page,
// so nothing links there. A failed lookup says so rather than implying "none".
import { useEffect, useState } from "react";

type Counselor = { displayName: string; agencyName: string | null };
type State = { status: "loading" } | { status: "linked"; counselor: Counselor } | { status: "none" } | { status: "error" };

export default function YourPeople() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let live = true;
    fetch("/api/cc/my-counselor")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { counselor?: Counselor | null }) => {
        if (live) setState(d.counselor ? { status: "linked", counselor: d.counselor } : { status: "none" });
      })
      .catch(() => { if (live) setState({ status: "error" }); });
    return () => { live = false; };
  }, []);

  return (
    <section className="td-support" aria-busy={state.status === "loading"}>
      <p className="af-eyebrow">Your people</p>
      {state.status === "linked" && (
        <>
          <h3>Your counselor: {state.counselor.displayName}</h3>
          {state.counselor.agencyName && state.counselor.agencyName !== state.counselor.displayName && (
            <p>{state.counselor.agencyName}</p>
          )}
        </>
      )}
      {state.status === "none" && (
        <>
          <h3>A counselor can be part of this.</h3>
          <p>If your school or counselor sent you an invite link, open it to connect. It shows you the workspace before you join.</p>
          <p className="af-caption">No link yet? Ask your counselor for one.</p>
        </>
      )}
      {state.status === "error" && <p>We couldn&apos;t check your counselor connection right now.</p>}
    </section>
  );
}
