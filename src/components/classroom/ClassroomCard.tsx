"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Lock, Unlock, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import type { Classroom } from "@/types/classroom";

interface ClassroomCardProps {
  classroom: Classroom;
  index: number;
  role: "teacher" | "student";
}

export default function ClassroomCard({ classroom, index, role }: ClassroomCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(classroom.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    active: "bg-emerald-500/20 text-emerald-400",
    draft: "bg-yellow-500/20 text-yellow-400",
    archived: "bg-white/10 text-[var(--muted-foreground)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/classrooms/${classroom.id}`}
        className="block glass-strong rounded-2xl p-5 hover:bg-white/[0.04] transition-all group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate group-hover:text-blue-400 transition-colors">
              {classroom.title}
            </h3>
            {classroom.description && (
              <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                {classroom.description}
              </p>
            )}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${statusColors[classroom.status]}`}>
            {classroom.status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {classroom.enrollment_count || 0} students
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {classroom.course_slug.replace(/-/g, " ")}
          </span>
        </div>

        {/* Join code for teachers */}
        {role === "teacher" && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] font-mono text-sm tracking-widest">
              {classroom.join_code}
            </div>
            <button
              onClick={copyCode}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Copy join code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
