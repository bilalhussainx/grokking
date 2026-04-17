"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Building2 } from "lucide-react";
import SchoolCard from "@/components/cc/SchoolCard";

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

const STATES = ["CA", "NY", "MA", "TX", "FL", "PA", "IL", "GA", "NC", "VA", "MI", "OH", "NJ", "IN", "WI", "WA", "CO", "MN", "AZ", "MD", "TN", "CT", "DC"];
const TYPES = ["public", "private"];
const TEST_POLICIES = ["required", "optional", "blind", "free"];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const search = useCallback(async (q: string, state: string, type: string) => {
    setLoading(true);
    const body: Record<string, unknown> = { limit: 50 };
    if (q) body.query = q;
    if (state) body.state = state;
    if (type) body.type = type;

    const res = await fetch("/api/cc/schools/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setSchools(data.schools || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    search(query, stateFilter, typeFilter);
  }, [query, stateFilter, typeFilter, search]);

  useEffect(() => {
    fetch("/api/cc/school-list")
      .then((r) => r.ok ? r.json() : { schools: [] })
      .then((d) => {
        const ids = new Set<string>((d.schools || []).map((s: { school_id: string }) => s.school_id));
        setAddedIds(ids);
      })
      .catch(() => {});
  }, []);

  const handleAdd = async (schoolId: string) => {
    const res = await fetch("/api/cc/school-list/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id: schoolId }),
    });
    if (res.ok || res.status === 409) {
      setAddedIds((prev) => new Set([...prev, schoolId]));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-[#D4AF37]" />
        <div>
          <h1 className="text-xl font-bold text-white">Browse Schools</h1>
          <p className="text-sm text-white/40">Search colleges and add them to your list</p>
        </div>
      </div>

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

      {loading ? (
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
    </div>
  );
}
