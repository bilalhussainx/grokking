"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ExternalLink } from "lucide-react";

const INTL_RESOURCES: Array<{ name: string; href: string; desc: string; external?: boolean }> = [
  {
    name: "CSS Profile Guide",
    href: "/profile/css-guide",
    desc: "Step-by-step walkthrough for the financial aid form most need-blind schools require of internationals.",
  },
  {
    name: "Need-blind for international students",
    href: "/schools?filter=need-blind-intl",
    desc: "The 8 US colleges that don't factor aid need into international admission decisions.",
  },
  {
    name: "TOEFL vs IELTS",
    href: "https://www.ets.org/toefl/test-takers/ibt/about.html",
    desc: "Which English proficiency test your target schools accept (most take either).",
    external: true,
  },
  {
    name: "F-1 Visa process overview",
    href: "https://studyinthestates.dhs.gov/students/prepare/students-and-the-form-i-20",
    desc: "Form I-20 + consular interview basics once an admission offer lands.",
    external: true,
  },
];

export default function InternationalGuideCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-emerald-400/30 bg-[#141414] p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">International Applicant Guide</h3>
          <p className="text-white/50 text-sm">Finance, testing, and visa resources for applying from outside the US.</p>
        </div>
      </div>
      <ul className="space-y-3">
        {INTL_RESOURCES.map((r) => (
          <li key={r.name}>
            <Link
              href={r.href}
              {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start gap-3 rounded-xl border border-white/5 hover:border-emerald-400/40 bg-white/[0.02] p-3 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{r.name}</span>
                  {r.external && (
                    <ExternalLink className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
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
