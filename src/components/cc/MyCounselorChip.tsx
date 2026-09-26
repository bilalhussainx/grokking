"use client";

import { useEffect, useState } from "react";

type Counselor = { displayName: string; agencyName: string | null };

// Shows linked students who their counselor is (QA-05). Renders nothing for
// unlinked students or when the lookup fails.
export default function MyCounselorChip() {
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  useEffect(() => {
    fetch("/api/cc/my-counselor")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCounselor(d?.counselor ?? null))
      .catch(() => {});
  }, []);
  if (!counselor) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <p className="text-xs text-white/50">
        Your counselor: <span className="text-[#D4AF37] font-medium">{counselor.displayName}</span>
        {counselor.agencyName && counselor.agencyName !== counselor.displayName ? ` · ${counselor.agencyName}` : ""}
      </p>
    </div>
  );
}
