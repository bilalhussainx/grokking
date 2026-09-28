"use client";

// Unknown grade: one friendly question, never a silent grade-9 default. The
// choice is saved through the existing PATCH /api/cc/profile/identity;
// transfer goes to the existing transfer profile form. Skipping saves nothing.
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GRADES: Array<[number, string]> = [[9, "Grade 9"], [10, "Grade 10"], [11, "Grade 11"], [12, "Grade 12"]];

export default function GradeQuestion({ onSkip }: { onSkip: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  async function choose(grade: number) {
    setSaving(grade);
    setFailed(false);
    try {
      const res = await fetch("/api/cc/profile/identity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade_level: grade }),
      });
      if (!res.ok) throw new Error(String(res.status));
      router.refresh(); // the server re-selects the stage for Today and the rail
    } catch {
      setFailed(true);
    } finally {
      setSaving(null);
    }
  }

  return (
    <section className="td-clarify" aria-labelledby="td-grade-question">
      <p className="af-eyebrow">Just one question</p>
      <h2 id="td-grade-question">Which grade are you in?</h2>
      <p>If you&apos;re already in college, choose transfer.</p>
      <div className="td-grade-options">
        {GRADES.map(([grade, label]) => (
          <button key={grade} type="button" disabled={saving !== null} onClick={() => void choose(grade)}>
            {saving === grade ? "Saving…" : label}
          </button>
        ))}
        <Link href="/cc/transfer-profile">I&apos;m transferring</Link>
      </div>
      {failed && <p role="alert" className="td-error">We couldn&apos;t save that. Try again, or skip for now.</p>}
      <button type="button" className="af-quiet" onClick={onSkip}>I&apos;m not sure / skip for now</button>
      <p className="af-caption">Your existing work stays available under More.</p>
    </section>
  );
}
