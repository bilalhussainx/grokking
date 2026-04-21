"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, FileText, Check, X, AlertCircle, ClipboardPaste } from "lucide-react";

interface ParsedActivity {
  position: number;
  activity_type: string | null;
  organization: string | null;
  role: string | null;
  description_150: string | null;
  grades_participated: number[];
  hours_per_week: number | null;
  weeks_per_year: number | null;
  is_continuing: boolean;
}

interface ParsedHonor {
  position: number;
  title: string | null;
  level: string | null;
  grade: number | null;
  description_100: string | null;
}

interface ParseResult {
  activities: ParsedActivity[];
  honors: ParsedHonor[];
  notes: string | null;
}

interface Props {
  onImported: () => void;
}

export default function ResumeUpload({ onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"file" | "paste">("file");
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [replaceAll, setReplaceAll] = useState(false);

  const handleFile = (f: File | null) => {
    setFile(f);
    setParsed(null);
    setError("");
    setSkipped(new Set());
  };

  const upload = async () => {
    if (!file) return;
    setParsing(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/cc/activities/parse-resume", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Parse failed (${res.status})`);
        return;
      }
      setParsed(data.parsed);
    } catch {
      setError("Upload failed — try again");
    } finally {
      setParsing(false);
    }
  };

  const parsePaste = async () => {
    if (pasteText.trim().length < 20) {
      setError("Paste at least a few lines");
      return;
    }
    setParsing(true);
    setError("");
    try {
      const res = await fetch("/api/cc/activities/parse-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Parse failed (${res.status})`);
        return;
      }
      setParsed(data.parsed);
    } catch {
      setError("Parse failed — try again");
    } finally {
      setParsing(false);
    }
  };

  const toggle = (key: string) => {
    setSkipped((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const save = async () => {
    if (!parsed) return;
    setSaving(true);
    try {
      const activities = parsed.activities.filter((a) => !skipped.has(`a-${a.position}`));
      const honors = parsed.honors.filter((h) => !skipped.has(`h-${h.position}`));
      const res = await fetch("/api/cc/activities/save-parsed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities, honors, replaceAll }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        return;
      }
      setParsed(null);
      setFile(null);
      setPasteText("");
      onImported();
    } catch {
      setError("Save failed — try again");
    } finally {
      setSaving(false);
    }
  };

  if (parsed) {
    const keptCount =
      parsed.activities.filter((a) => !skipped.has(`a-${a.position}`)).length +
      parsed.honors.filter((h) => !skipped.has(`h-${h.position}`)).length;

    return (
      <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-[#D4AF37]" />
          <p className="text-sm font-medium text-white">Review what we pulled from your resume</p>
        </div>

        {parsed.notes && (
          <p className="text-xs text-white/50 italic mb-3">{parsed.notes}</p>
        )}

        {parsed.activities.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-white/40 uppercase tracking-wide mb-2">
              Activities ({parsed.activities.length})
            </p>
            <div className="space-y-2">
              {parsed.activities.map((a) => {
                const key = `a-${a.position}`;
                const isSkipped = skipped.has(key);
                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-lg border text-xs transition-opacity ${
                      isSkipped ? "border-white/5 bg-white/[0.02] opacity-40" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">
                          {a.organization || a.role || "Untitled"}
                          {a.role && a.organization && <span className="text-white/40"> — {a.role}</span>}
                        </p>
                        <p className="text-white/50 mt-0.5 leading-relaxed">{a.description_150 || ""}</p>
                        <p className="text-[10px] text-white/30 mt-1">
                          {a.activity_type || "—"} · grades {(a.grades_participated || []).join(",") || "?"} ·{" "}
                          {a.hours_per_week || "?"}h/wk
                        </p>
                      </div>
                      <button
                        onClick={() => toggle(key)}
                        className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
                        aria-label={isSkipped ? "Include" : "Skip"}
                      >
                        {isSkipped ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {parsed.honors.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-white/40 uppercase tracking-wide mb-2">
              Honors ({parsed.honors.length})
            </p>
            <div className="space-y-2">
              {parsed.honors.map((h) => {
                const key = `h-${h.position}`;
                const isSkipped = skipped.has(key);
                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-lg border text-xs transition-opacity ${
                      isSkipped ? "border-white/5 bg-white/[0.02] opacity-40" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{h.title || "Untitled"}</p>
                        <p className="text-white/50 mt-0.5 leading-relaxed">{h.description_100 || ""}</p>
                        <p className="text-[10px] text-white/30 mt-1">
                          {h.level || "—"} · grade {h.grade || "?"}
                        </p>
                      </div>
                      <button
                        onClick={() => toggle(key)}
                        className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {isSkipped ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-[11px] text-white/50 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={replaceAll}
            onChange={(e) => setReplaceAll(e.target.checked)}
            className="rounded border-white/20 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]/40"
          />
          Replace my existing activities and honors (otherwise merges by position)
        </label>

        {error && (
          <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={saving || keptCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] disabled:opacity-40 transition-colors"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            Save {keptCount} {keptCount === 1 ? "entry" : "entries"}
          </button>
          <button
            onClick={() => {
              setParsed(null);
              setFile(null);
              setPasteText("");
            }}
            className="px-3 py-1.5 rounded-lg text-white/40 text-xs hover:text-white/60 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#141414] p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Upload className="w-4 h-4 text-[#D4AF37]" />
        <p className="text-sm font-medium text-white">Import your activities</p>
      </div>

      <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 mb-3">
        <button
          onClick={() => setMode("file")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
            mode === "file" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-white/40 hover:text-white/60"
          }`}
        >
          <Upload className="w-3 h-3" /> Upload PDF/image
        </button>
        <button
          onClick={() => setMode("paste")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
            mode === "paste" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-white/40 hover:text-white/60"
          }`}
        >
          <ClipboardPaste className="w-3 h-3" /> Paste text
        </button>
      </div>

      {mode === "file" ? (
        <>
          <p className="text-xs text-white/40 mb-3">
            Upload a PDF or image. Claude reads it and fills in your activities and honors — you review before saving.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 transition-colors"
            >
              Choose file
            </button>
            {file && (
              <span className="text-[11px] text-white/50 truncate max-w-[200px]">{file.name}</span>
            )}
            {file && (
              <button
                onClick={upload}
                disabled={parsing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/25 disabled:opacity-40 transition-colors"
              >
                {parsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                {parsing ? "Reading..." : "Parse resume"}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-white/40 mb-3">
            Paste your activity list — bullets, paragraphs, or a rough list. Claude structures it for the Common App.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={8}
            placeholder="Paste activities and honors here. Example:&#10;• Varsity Soccer — captain senior year, led team to state semis, 20 hrs/wk&#10;• Founded coding club, 30 members, taught weekly workshops&#10;• National Merit Finalist, grade 11"
            className="w-full px-3 py-2 rounded-lg text-xs text-white bg-white/5 border border-white/10 placeholder:text-white/25 focus:outline-none focus:border-[#D4AF37]/50 resize-y"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-white/30 tabular-nums">
              {pasteText.length} / 15,000
            </span>
            <button
              onClick={parsePaste}
              disabled={parsing || pasteText.trim().length < 20}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/25 disabled:opacity-40 transition-colors"
            >
              {parsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ClipboardPaste className="w-3 h-3" />}
              {parsing ? "Parsing..." : "Parse text"}
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
