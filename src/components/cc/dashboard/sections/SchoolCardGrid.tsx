// src/components/cc/dashboard/sections/SchoolCardGrid.tsx
// Up to 4 school cards in a 2-column grid + "Manage list" link to /schools
// for the full list. Returns null when the user has no schools.
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import SchoolCard from "./SchoolCard";
import type { DashboardSummary } from "./types";

const MAX_SCHOOLS_ON_DASHBOARD = 4;

export default function SchoolCardGrid({ summary }: { summary: DashboardSummary }) {
  if (summary.schools.length === 0) return null;
  // Sort by nearest deadline ascending so the most urgent schools surface
  // first. Schools without a deadline fall to the bottom of the visible 4.
  const sorted = [...summary.schools].sort((a, b) => {
    const ad = a.daysToDeadline ?? 9999;
    const bd = b.daysToDeadline ?? 9999;
    return ad - bd;
  });
  const visible = sorted.slice(0, MAX_SCHOOLS_ON_DASHBOARD);
  const hasMore = summary.schools.length > MAX_SCHOOLS_ON_DASHBOARD;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-white/50" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">
            Your schools
          </span>
          {hasMore && (
            <span className="text-[10px] text-white/35">
              · showing {visible.length} of {summary.schools.length}
            </span>
          )}
        </div>
        <Link
          href="/schools"
          className="text-[11px] text-white/40 hover:text-white/60 transition-colors flex items-center gap-1"
        >
          Manage list <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visible.map((school) => (
          <SchoolCard key={school.studentSchoolId} school={school} />
        ))}
      </div>
    </motion.section>
  );
}
