"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";

const FIRST_GEN_RESOURCES = [
  {
    name: "QuestBridge National College Match",
    href: "https://www.questbridge.org/high-school-students/national-college-match",
    desc: "Full 4-year scholarships to 45+ partner colleges for high-achieving, low-income students.",
  },
  {
    name: "Posse Foundation",
    href: "https://www.possefoundation.org/shaping-the-future/becoming-a-posse-scholar",
    desc: "Leadership-based scholarship that sends cohorts (\"posses\") of 10 students to partner colleges.",
  },
  {
    name: "College Advising Corps",
    href: "https://advisingcorps.org/our-work/students/",
    desc: "Free near-peer college advising in underserved high schools across 18 states.",
  },
];

export default function FirstGenResourcesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#D4AF37]/30 bg-[#141414] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Your First-Gen Advantage</h3>
          <p className="text-white/50 text-sm">Programs built specifically for first-generation applicants.</p>
        </div>
      </div>
      <ul className="space-y-3">
        {FIRST_GEN_RESOURCES.map((r) => (
          <li key={r.name}>
            <Link
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-white/5 hover:border-[#D4AF37]/40 bg-white/[0.02] p-3 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{r.name}</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-white/40 text-xs leading-relaxed mt-0.5">{r.desc}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
