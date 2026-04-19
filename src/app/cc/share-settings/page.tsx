"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Link2, Copy, Check, Loader2, Trash2, Share2 } from "lucide-react";
import Link from "next/link";

interface VisibleSections {
  essays: boolean;
  activities: boolean;
  schoolList: boolean;
  recommendations: boolean;
  interviewScores: boolean;
}

const SECTION_META: { key: keyof VisibleSections; label: string; description: string }[] = [
  { key: "essays", label: "Essays", description: "Your essay drafts and prompts" },
  { key: "activities", label: "Activities & Honors", description: "Your Common App activities list" },
  { key: "schoolList", label: "School List", description: "Schools you're applying to with status" },
  { key: "recommendations", label: "Recommendations", description: "Your recommender list and status" },
  { key: "interviewScores", label: "Interview Scores", description: "Practice interview scorecards" },
];

export default function ShareSettingsPage() {
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sections, setSections] = useState<VisibleSections>({
    essays: true,
    activities: true,
    schoolList: true,
    recommendations: true,
    interviewScores: true,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/cc/share-link")
      .then((r) => r.json())
      .then((data) => {
        if (data.shareLink) {
          setShareToken(data.shareLink.shareToken);
          setShareUrl(data.shareLink.shareUrl);
          setSections(data.shareLink.visibleSections);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const generateLink = async () => {
    setGenerating(true);
    const res = await fetch("/api/cc/share-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibleSections: sections }),
    });
    const data = await res.json();
    if (data.shareToken) {
      setShareToken(data.shareToken);
      setShareUrl(data.shareUrl);
      setSections(data.visibleSections);
    }
    setGenerating(false);
  };

  const toggleSection = (key: keyof VisibleSections) => {
    const updated = { ...sections, [key]: !sections[key] };
    setSections(updated);

    if (!shareToken) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch("/api/cc/share-link", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibleSections: updated }),
      });
    }, 1000);
  };

  const copyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revokeLink = async () => {
    if (!confirmRevoke) {
      setConfirmRevoke(true);
      return;
    }
    setRevoking(true);
    await fetch("/api/cc/share-link", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoke: true }),
    });
    setShareToken(null);
    setShareUrl(null);
    setConfirmRevoke(false);
    setRevoking(false);
    setSections({
      essays: true,
      activities: true,
      schoolList: true,
      recommendations: true,
      interviewScores: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 max-w-2xl mx-auto">
      <Link href="/cc" className="flex items-center gap-2 text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Coach Kairos
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Share2 className="w-6 h-6 text-[#D4AF37]" />
        <h1 className="text-2xl font-bold">Share with Counselor</h1>
      </div>
      <p className="text-white/60 mb-8">
        Generate a link to share your college application progress with counselors, parents, or mentors. They won&apos;t need an account.
      </p>

      <div className="space-y-3 mb-8">
        {SECTION_META.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => toggleSection(key)}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <div className="text-left">
              <div className="font-medium">{label}</div>
              <div className="text-sm text-white/50">{description}</div>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition ${sections[key] ? "bg-[#D4AF37]" : "bg-white/20"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${sections[key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>
        ))}
      </div>

      {!shareToken ? (
        <button
          onClick={generateLink}
          disabled={generating}
          className="w-full py-3 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#C4A030] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Link2 className="w-4 h-4" /> Generate Share Link</>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl || ""}
              className="flex-1 bg-transparent text-sm text-white/80 outline-none truncate"
            />
            <button
              onClick={copyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#D4AF37] text-black text-sm font-medium hover:bg-[#C4A030] shrink-0"
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <button
            onClick={revokeLink}
            disabled={revoking}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {revoking ? "Revoking..." : confirmRevoke ? "Click again to confirm revocation" : "Revoke Link"}
          </button>
        </div>
      )}
    </div>
  );
}
