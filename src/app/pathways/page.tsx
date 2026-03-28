"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Briefcase, BookOpen } from "lucide-react";
import { pathways } from "@/data/pathways";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function PathwaysPage() {
  return (
    <div className="min-h-screen bg-black">
      <motion.div
        className="max-w-6xl mx-auto px-4 pt-20 pb-24"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Hero */}
        <motion.div variants={item} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium mb-6">
            <Briefcase className="w-3.5 h-3.5" />
            {pathways.length} Career Pathways
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Pick your{" "}
            <span className="text-[#D4AF37]">
              career path
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Each pathway is a curated sequence of courses that prepares you for
            a specific role. Follow it end-to-end or jump to what you need.
          </p>
        </motion.div>

        {/* Pathway Cards Grid */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {pathways.map((pathway) => (
            <motion.div key={pathway.id} variants={item}>
              <Link href={`/pathways/${pathway.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 p-6 h-full cursor-pointer transition-all hover:border-[#D4AF37]/30 hover:bg-white/5">
                  {/* Gradient glow */}
                  <div
                    className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-10 bg-gradient-to-br ${pathway.color} group-hover:opacity-20 transition-opacity`}
                  />

                  <div className="relative z-10">
                    {/* Icon + Title */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{pathway.icon}</span>
                        <h2 className="text-xl font-bold text-white">
                          {pathway.title}
                        </h2>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/50 leading-relaxed mb-5 line-clamp-2">
                      {pathway.description}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-white/40">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {pathway.courses.length} courses
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        ~{pathway.estimatedWeeks} weeks
                      </span>
                    </div>

                    {/* Roles */}
                    <div className="flex flex-wrap gap-1.5">
                      {pathway.roles.slice(0, 3).map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-xs text-white/50"
                        >
                          {role}
                        </span>
                      ))}
                      {pathway.roles.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-white/40">
                          +{pathway.roles.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
