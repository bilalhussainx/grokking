"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Building2,
  ClipboardList,
  Users,
  Share2,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import FirstGenResourcesCard from "@/components/cc/resources/FirstGenResourcesCard";
import InternationalGuideCard from "@/components/cc/resources/InternationalGuideCard";

const TOOLS = [
  {
    title: "Essay Studio",
    desc: "AI-guided brainstorming, outline generation, and draft coaching. Personal statements, supplementals, and Why Us essays.",
    href: "/cc/essays",
    icon: BookOpen,
    status: "active",
  },
  {
    title: "Interview Prep",
    desc: "Practice with 10 Ivy+ alumni AI personas. Harvard, Yale, Stanford, MIT, and more. 4-session adaptive arc.",
    href: "/college-interviews",
    icon: Target,
    status: "active",
  },
  {
    title: "Activities Optimizer",
    desc: "AI reviews your Common App activities list. Get description rewrites, impact scoring, and optimal ordering.",
    href: "/cc/activities-optimizer",
    icon: ClipboardList,
    status: "active",
  },
  {
    title: "Recommendations Coach",
    desc: "Build brag sheets for each recommender. AI drafts ask emails, tracks confirmation status.",
    href: "/cc/recommenders",
    icon: Users,
    status: "active",
  },
  {
    title: "School List Builder",
    desc: "Search 1,500+ colleges. Get chancing estimates, compare net prices, and track application status.",
    href: "/intake",
    icon: Building2,
    status: "active",
  },
  {
    title: "Counselor Share Link",
    desc: "Generate one link to share your essays, activities, school list, and scores with counselors and parents.",
    href: "/cc/share-settings",
    icon: Share2,
    status: "active",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

interface ProfileFlags {
  is_first_gen: boolean | null;
  is_international: boolean | null;
}

export default function CCDashboard() {
  const [flags, setFlags] = useState<ProfileFlags>({ is_first_gen: null, is_international: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cc/profile", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.profile) {
          setFlags({
            is_first_gen: data.profile.is_first_gen ?? null,
            is_international: data.profile.is_international ?? null,
          });
        }
      } catch {
        /* unauthenticated or no profile — cards just stay hidden */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showFirstGen = flags.is_first_gen === true;
  const showIntl = flags.is_international === true;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Application Toolkit
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            Everything you need to build a standout college application — essays,
            interviews, activities, recommendations, and more.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.title} variants={item}>
                <Link href={tool.href}>
                  <div className="kl-card-primary group h-full cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="kl-card-icon shrink-0" style={{ marginBottom: 0 }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">
                            {tool.title}
                          </h3>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {(showFirstGen || showIntl) && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {showFirstGen && <FirstGenResourcesCard />}
            {showIntl && <InternationalGuideCard />}
          </div>
        )}
      </div>
    </div>
  );
}
