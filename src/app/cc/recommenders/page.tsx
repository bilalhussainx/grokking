"use client";

import { useState, useEffect } from "react";
import { Plus, UserCheck, Clock, CheckCircle, Send, FileText, Mail, Trash2, Loader2 } from "lucide-react";

interface Recommender {
  id: string;
  name: string;
  subject: string | null;
  email: string | null;
  recommender_type: string;
  status: string;
  brag_sheet_url: string | null;
  asked_at: string | null;
  submitted_at: string | null;
}

interface BragSheet {
  introduction: string;
  academicHighlights: string[];
  activityHighlights: string[];
  personalQualities: string[];
  specificAnecdotes: string[];
  closingNote: string;
}

interface EmailDraft {
  subject: string;
  body: string;
}

const STATUS_LABELS: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  considering: { label: "Considering", icon: Clock, color: "text-white/40" },
  asked: { label: "Asked", icon: Send, color: "text-blue-400" },
  confirmed: { label: "Confirmed", icon: UserCheck, color: "text-[#D4AF37]" },
  submitted: { label: "Submitted", icon: CheckCircle, color: "text-green-400" },
};

const REC_TYPES = ["Teacher", "Counselor", "Coach", "Employer", "Mentor", "Other"];

export default function RecommendersPage() {
  const [recs, setRecs] = useState<Recommender[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addSubject, setAddSubject] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addType, setAddType] = useState("Teacher");
  const [adding, setAdding] = useState(false);

  const [activeRecId, setActiveRecId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"brag" | "email" | null>(null);
  const [bragSheet, setBragSheet] = useState<BragSheet | null>(null);
  const [emailDraft, setEmailDraft] = useState<EmailDraft | null>(null);
  const [generating, setGenerating] = useState(false);
  const [contextNotes, setContextNotes] = useState("");
  const [classTaken, setClassTaken] = useState("");
  const [whatAppreciated, setWhatAppreciated] = useState("");

  const loadRecs = () => {
    fetch("/api/cc/recommenders")
      .then((r) => r.json())
      .then((d) => setRecs(d.recommenders || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRecs(); }, []);

  const handleAdd = async () => {
    if (!addName.trim()) return;
    setAdding(true);
    await fetch("/api/cc/recommenders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addName,
        subject: addSubject || null,
        email: addEmail || null,
        recommender_type: addType,
      }),
    });
    setAddName(""); setAddSubject(""); setAddEmail(""); setShowAdd(false);
    setAdding(false);
    loadRecs();
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: Record<string, unknown> = { status };
    if (status === "asked") updates.asked_at = new Date().toISOString();
    if (status === "submitted") updates.submitted_at = new Date().toISOString();
    await fetch(`/api/cc/recommenders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    loadRecs();
  };

  const deleteRec = async (id: string) => {
    await fetch(`/api/cc/recommenders/${id}`, { method: "DELETE" });
    loadRecs();
  };

  const generateBragSheet = async (id: string) => {
    setActiveRecId(id); setActiveTab("brag"); setBragSheet(null);
    setGenerating(true);
    const res = await fetch(`/api/cc/recommenders/${id}/brag-sheet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context_notes: contextNotes }),
    });
    const data = await res.json();
    if (data.bragSheet) setBragSheet(data.bragSheet);
    setGenerating(false);
  };

  const generateEmail = async (id: string) => {
    setActiveRecId(id); setActiveTab("email"); setEmailDraft(null);
    setGenerating(true);
    const res = await fetch(`/api/cc/recommenders/${id}/email-draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_taken: classTaken, what_appreciated: whatAppreciated }),
    });
    const data = await res.json();
    if (data.email) setEmailDraft(data.email);
    setGenerating(false);
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Recommendations</h1>
          <p className="text-sm text-white/40 mt-1">Track recommenders, generate brag sheets &amp; ask emails</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 p-5 rounded-2xl border border-white/10 bg-[#141414] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">Name *</label>
              <input value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Ms. Johnson" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Type</label>
              <select value={addType} onChange={(e) => setAddType(e.target.value)} className={inputClass}>
                {REC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 block mb-1">Subject</label>
              <input value={addSubject} onChange={(e) => setAddSubject(e.target.value)} placeholder="AP Chemistry" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1">Email</label>
              <input value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="teacher@school.edu" className={inputClass} />
            </div>
          </div>
          <button onClick={handleAdd} disabled={adding || !addName.trim()} className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-40">
            {adding ? "Adding..." : "Add Recommender"}
          </button>
        </div>
      )}

      {/* Recommender list */}
      {recs.length === 0 ? (
        <div className="text-center py-16">
          <UserCheck className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/30">No recommenders yet. Most students need 2-3.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recs.map((rec) => {
            const status = STATUS_LABELS[rec.status] || STATUS_LABELS.considering;
            const StatusIcon = status.icon;
            const isActive = activeRecId === rec.id;

            return (
              <div key={rec.id} className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{rec.name}</p>
                      <p className="text-xs text-white/40">
                        {rec.recommender_type}{rec.subject ? ` — ${rec.subject}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                    </span>

                    <select
                      value={rec.status}
                      onChange={(e) => updateStatus(rec.id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                    >
                      <option value="considering">Considering</option>
                      <option value="asked">Asked</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="submitted">Submitted</option>
                    </select>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => { setActiveRecId(isActive && activeTab === "brag" ? null : rec.id); setActiveTab("brag"); setBragSheet(null); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/50 border border-white/10 hover:text-white/70 hover:border-white/20 transition-colors"
                  >
                    <FileText className="w-3 h-3" /> Brag Sheet
                  </button>
                  <button
                    onClick={() => { setActiveRecId(isActive && activeTab === "email" ? null : rec.id); setActiveTab("email"); setEmailDraft(null); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/50 border border-white/10 hover:text-white/70 hover:border-white/20 transition-colors"
                  >
                    <Mail className="w-3 h-3" /> Ask Email
                  </button>
                  <button
                    onClick={() => deleteRec(rec.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400/40 hover:text-red-400/70 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Brag sheet panel */}
                {isActive && activeTab === "brag" && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    {!bragSheet && !generating && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/40 block mb-1">Notes about your relationship with this teacher (optional)</label>
                          <textarea value={contextNotes} onChange={(e) => setContextNotes(e.target.value)} rows={2} placeholder="e.g., I had them for AP Chem junior year, they supervised my independent research project..." className={`${inputClass} resize-none`} />
                        </div>
                        <button onClick={() => generateBragSheet(rec.id)} className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030]">
                          Generate Brag Sheet
                        </button>
                      </div>
                    )}
                    {generating && (
                      <div className="flex items-center gap-2 py-4">
                        <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                        <span className="text-xs text-white/40">Generating brag sheet...</span>
                      </div>
                    )}
                    {bragSheet && (
                      <div className="space-y-3">
                        <p className="text-xs text-white/60 leading-relaxed">{bragSheet.introduction}</p>
                        {[
                          { title: "Academic Highlights", items: bragSheet.academicHighlights },
                          { title: "Activity Highlights", items: bragSheet.activityHighlights },
                          { title: "Personal Qualities", items: bragSheet.personalQualities },
                          { title: "Suggested Anecdotes", items: bragSheet.specificAnecdotes },
                        ].map((section) => (
                          <div key={section.title}>
                            <h4 className="text-[10px] text-white/30 uppercase tracking-wide mb-1">{section.title}</h4>
                            <ul className="space-y-1">
                              {section.items.map((item, i) => (
                                <li key={i} className="text-xs text-white/50 flex gap-1.5">
                                  <span className="text-[#D4AF37] shrink-0">-</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <p className="text-xs text-white/40 italic">{bragSheet.closingNote}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Email draft panel */}
                {isActive && activeTab === "email" && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    {!emailDraft && !generating && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-white/40 block mb-1">Class you took with them</label>
                            <input value={classTaken} onChange={(e) => setClassTaken(e.target.value)} placeholder="AP Chemistry" className={inputClass} />
                          </div>
                          <div>
                            <label className="text-xs text-white/40 block mb-1">What you appreciated</label>
                            <input value={whatAppreciated} onChange={(e) => setWhatAppreciated(e.target.value)} placeholder="Their patience during labs" className={inputClass} />
                          </div>
                        </div>
                        <button onClick={() => generateEmail(rec.id)} className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030]">
                          Draft Ask Email
                        </button>
                      </div>
                    )}
                    {generating && (
                      <div className="flex items-center gap-2 py-4">
                        <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                        <span className="text-xs text-white/40">Drafting email...</span>
                      </div>
                    )}
                    {emailDraft && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/30 uppercase mb-1">Subject</p>
                          <p className="text-sm text-white">{emailDraft.subject}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/30 uppercase mb-1">Body</p>
                          <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{emailDraft.body}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`);
                          }}
                          className="px-4 py-1.5 rounded-lg text-xs text-[#D4AF37] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 transition-colors"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
