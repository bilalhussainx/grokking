// SP-7 — holistic fit evaluator page.
import { Suspense } from "react";
import CollegeFitClient from "@/components/college/CollegeFitClient";

export default function CollegeFitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <CollegeFitClient />
      </Suspense>
    </div>
  );
}
