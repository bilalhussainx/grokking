"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Building2, List, GitCompare, MessageSquare, Globe, Unlock, BadgePercent, ClipboardList, type LucideIcon } from "lucide-react";
import SchoolCard from "@/components/cc/SchoolCard";
import SchoolCompareModal from "@/components/cc/SchoolCompareModal";
import { useCoachKairos } from "@/contexts/CoachKairosContext";

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  school_type: string;
  acceptance_rate: number;
  avg_net_price: number;
  test_policy: string;
  regular_deadline: string;
  early_deadline: string | null;
}

interface MySchoolEntry {
  id: string;
  school_id: string;
  chancing_band: string;
  application_status: string;
  application_plan: string | null;
  cc_schools: School;
}

const STATES = ["CA", "NY", "MA", "TX", "FL", "PA", "IL", "GA", "NC", "VA", "MI", "OH", "NJ", "IN", "WI", "WA", "CO", "MN", "AZ", "MD", "TN", "CT", "DC"];
const TYPES = ["public", "private"];
const BAND_ORDER = ["reach", "match", "safety", "unknown"];

export default function SchoolsPage() {
  const coach = useCoachKairos();
  const [tab, setTab] = useState<"my-list" | "browse">("my-list");

  // My Schools state
  const [mySchools, setMySchools] = useState<MySchoolEntry[]>([]);
  const [myLoading, setMyLoading] = useState(true);

  // Browse state
  const [schools, setSchools] = useState<School[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [needBlindIntl, setNeedBlindIntl] = useState(false);
  const [meetsFullNeedIntl, setMeetsFullNeedIntl] = useState(false);
  const [cssProfileRequired, setCssProfileRequired] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const loadMySchools = useCallback(async () => {
    setMyLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/cc/school-list");
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error || `Failed to load (${res.status})`);
      } else {
        setMySchools(data.schools || []);
        setAddedIds(new Set((data.schools || []).map((s: MySchoolEntry) => s.school_id)));
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Network error");
    }
    setMyLoading(false);
  }, []);

  useEffect(() => {
    loadMySchools();
  }, [loadMySchools]);

  // Auto-open Coach Kairos on first mount so guests arriving from the hero
  // chat handoff link continue the conversation without an extra click. Only
  // opens once per page visit — if the user closes it, it stays closed.
  const coachAutoOpened = useRef(false);
  useEffect(() => {
    if (coachAutoOpened.current) return;
    if (!coach.isOpen) {
      coach.open();
    }
    coachAutoOpened.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(async (q: string, state: string, type: string, nbi: boolean, mfni: boolean, css: boolean) => {
    setBrowseLoading(true);
    const body: Record<string, unknown> = { limit: 50 };
    if (q) body.query = q;
    if (state) body.state = state;
    if (type) body.type = type;
    if (nbi) body.need_blind_international = true;
    if (mfni) body.meets_full_need_international = true;
    if (css) body.css_profile_required = true;

    const res = await fetch("/api/cc/schools/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setSchools(data.schools || []);
    }
    setBrowseLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "browse") search(query, stateFilter, typeFilter, needBlindIntl, meetsFullNeedIntl, cssProfileRequired);
  }, [query, stateFilter, typeFilter, needBlindIntl, meetsFullNeedIntl, cssProfileRequired, search, tab]);

  const handleAdd = async (schoolId: string) => {
    const res = await fetch("/api/cc/school-list/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id: schoolId }),
    });
    if (res.ok || res.status === 409) {
      setAddedIds((prev) => new Set([...prev, schoolId]));
      loadMySchools();
    }
  };

  const handlePlanChange = async (entryId: string, plan: string | null) => {
    setMySchools((prev) =>
      prev.map((s) => (s.id === entryId ? { ...s, application_plan: plan } : s))
    );
    await fetch(`/api/cc/school-list/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_plan: plan ?? "" }),
    });
  };

  const handleRemove = async (entryId: string) => {
    const res = await fetch(`/api/cc/school-list/${entryId}`, { method: "DELETE" });
    if (res.ok) {
      setMySchools((prev) => prev.filter((s) => s.id !== entryId));
      setAddedIds((prev) => {
        const next = new Set(prev);
        const removed = mySchools.find((s) => s.id === entryId);
        if (removed) next.delete(removed.school_id);
        return next;
      });
    }
  };

  const grouped = BAND_ORDER.reduce<Record<string, MySchoolEntry[]>>((acc, band) => {
    acc[band] = mySchools.filter((s) => s.chancing_band === band);
    return acc;
  }, {});

  const BAND_LABELS: Record<string, string> = {
    reach: "Reach",
    match: "Match",
    safety: "Safety",
    unknown: "Unclassified",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-[#D4AF37]" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">School List</h1>
          <p className="text-sm text-white/40">Build and manage your college list</p>
        </div>
        {mySchools.length >= 2 && (
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20"
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare two
          </button>
        )}
      </div>

      {showCompare && (
        <SchoolCompareModal
          schools={mySchools.map((s) => ({ id: s.school_id, name: s.cc_schools.name }))}
          onClose={() => setShowCompare(false)}
        />
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/5 border border-white/10">
        <button
          onClick={() => setTab("my-list")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "my-list"
              ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <List className="w-4 h-4" />
          My Schools {mySchools.length > 0 && `(${mySchools.length})`}
        </button>
        <button
          onClick={() => { setTab("browse"); search(query, stateFilter, typeFilter, needBlindIntl, meetsFullNeedIntl, cssProfileRequired); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "browse"
              ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          <Search className="w-4 h-4" />
          Browse
        </button>
      </div>

      {tab === "my-list" && (
        <>
          {loadError && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-300">
              Couldn&apos;t load your schools: {loadError}
            </div>
          )}
          {myLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
            </div>
          ) : mySchools.length === 0 ? (
            <div className="py-10">
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <Building2 className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-1">Build your school list</h3>
                  <p className="text-white/40 text-sm">
                    Two ways to get started — Coach Kairos can draft a balanced list, or you can add schools yourself.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      coach.open();
                      coach.sendMessage(
                        "Help me build a balanced school list with reach, match, and safety options based on my profile.",
                        { sourceEvent: "schools-empty-state" }
                      );
                    }}
                    className="group text-left p-4 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a1610] to-[#141414] hover:border-[#D4AF37]/50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">Recommended</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Talk to Coach Kairos</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Chat through your goals and get a balanced list — reach, match, and safety — drafted for you.
                    </p>
                  </button>
                  <button
                    onClick={() => { setTab("browse"); search("", "", "", false, false, false); }}
                    className="group text-left p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Search className="w-4 h-4 text-white/50" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-white/40">Manual</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">Browse schools</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Search by name, state, or type and add schools to your list one by one.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {BAND_ORDER.map((band) => {
                const list = grouped[band];
                if (!list || list.length === 0) return null;
                return (
                  <div key={band}>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                        {BAND_LABELS[band]}
                      </h2>
                      <span className="text-xs text-white/20">({list.length})</span>
                    </div>
                    <div className="grid gap-3">
                      {list.map((entry) => (
                        <SchoolCard
                          key={entry.id}
                          school={entry.cc_schools}
                          listEntryId={entry.id}
                          chancingBand={entry.chancing_band}
                          applicationPlan={entry.application_plan}
                          onPlanChange={handlePlanChange}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "browse" && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="">All states</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="">All types</option>
              {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
          </div>

          <details className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <summary className="cursor-pointer px-4 py-3 text-[11px] uppercase tracking-wider text-white/60 flex items-center gap-2 hover:bg-white/[0.02]">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              Financial aid for international students
            </summary>
            <div className="px-4 pb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <FilterPill active={needBlindIntl} onClick={() => setNeedBlindIntl((v) => !v)} icon={Unlock} label="Need-blind intl" />
                <FilterPill active={meetsFullNeedIntl} onClick={() => setMeetsFullNeedIntl((v) => !v)} icon={BadgePercent} label="Meets full need intl" />
                <FilterPill active={cssProfileRequired} onClick={() => setCssProfileRequired((v) => !v)} icon={ClipboardList} label="Accepts CSS Profile" />
              </div>
              {needBlindIntl && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-200 leading-relaxed flex items-start gap-2">
                  <Unlock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Showing schools that are need-blind for international students. These schools will not penalize you for needing financial aid. There are currently {schools.length} in our database.
                </div>
              )}
            </div>
          </details>

          {browseLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
            </div>
          ) : schools.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-12">No schools found.</p>
          ) : (
            <div className="grid gap-3">
              {schools.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onAdd={handleAdd}
                  showAddButton
                  added={addedIds.has(school.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: LucideIcon; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
        active
          ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
          : "bg-white/5 border-white/10 text-white/60 hover:text-white/80 hover:bg-white/10"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
