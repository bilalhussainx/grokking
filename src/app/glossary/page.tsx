"use client";

import { useState, useMemo } from "react";
import { Search, Volume2, BookOpen } from "lucide-react";
import { useGlossary, type GlossaryTerm } from "@/contexts/GlossaryContext";

function TermCard({ term }: { term: GlossaryTerm }) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleListen = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      const resp = await fetch("/api/language/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: term.definition, language: "en" }),
      });
      if (!resp.ok) return;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{term.term}</h3>
          <p className={`text-xs text-white/50 mt-1 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {term.definition}
          </p>
        </div>
        {term.category && (
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/30 font-medium">
            {term.category.replace(/-/g, " ")}
          </span>
        )}
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleListen();
            }}
            disabled={playing}
            className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#C4A030] disabled:opacity-50 transition-colors"
          >
            <Volume2 size={14} className={playing ? "animate-pulse" : ""} />
            {playing ? "Playing..." : "Listen"}
          </button>
        </div>
      )}
    </button>
  );
}

export default function GlossaryPage() {
  const { terms, loaded } = useGlossary();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(terms.map((t) => t.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [terms]);

  const filtered = useMemo(() => {
    let result = terms;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    return result;
  }, [terms, search, activeCategory]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-[#D4AF37]" />
        <div>
          <h1 className="text-xl font-bold text-white">Glossary</h1>
          <p className="text-sm text-white/40">College admissions terms and definitions</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !activeCategory
                ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]"
                : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20"
            }`}
          >
            All ({terms.length})
          </button>
          {categories.map((cat) => {
            const count = terms.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]"
                    : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20"
                }`}
              >
                {cat.replace(/-/g, " ")} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-12">
          {search ? `No terms matching "${search}"` : "No glossary terms available yet."}
        </p>
      ) : (
        <div className="grid gap-2">
          {filtered.map((term) => (
            <TermCard key={term.term_slug} term={term} />
          ))}
        </div>
      )}
    </div>
  );
}
