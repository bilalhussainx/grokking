"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface GlossaryTerm {
  term_slug: string;
  term: string;
  definition: string;
  category: string;
  translations: Record<string, { definition: string }> | null;
}

interface GlossaryContextValue {
  terms: GlossaryTerm[];
  lookupTerm: (slug: string) => GlossaryTerm | undefined;
  loaded: boolean;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  terms: [],
  lookupTerm: () => undefined,
  loaded: false,
});

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cc/glossary")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.terms) {
          setTerms(d.terms);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const slugMap = new Map(terms.map((t) => [t.term_slug, t]));

  function lookupTerm(slug: string) {
    return slugMap.get(slug);
  }

  return (
    <GlossaryContext.Provider value={{ terms, lookupTerm, loaded }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return useContext(GlossaryContext);
}
