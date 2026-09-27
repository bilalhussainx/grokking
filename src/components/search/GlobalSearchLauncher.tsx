"use client";

import { lazy, Suspense, useEffect, useState } from "react";

// GlobalSearch imports every course (the whole catalogue, ~4.8 MB gzip).
// Mount this tiny launcher on every page instead; it loads the real search
// only when someone first opens it (Ctrl/Cmd+K or the TopNav search button).
const GlobalSearch = lazy(() => import("./GlobalSearch"));

export default function GlobalSearchLauncher() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    const open = () => setLoad(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-global-search", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-global-search", open);
    };
  }, [load]);

  if (!load) return null;
  return (
    <Suspense fallback={null}>
      <GlobalSearch defaultOpen />
    </Suspense>
  );
}
