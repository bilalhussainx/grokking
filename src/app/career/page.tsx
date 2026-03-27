"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  TrendingUp,
  Briefcase,
  Code2,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Skill {
  skillId: string;
  skillName: string;
  proficiency: number;
  sourceCourse: string;
}

interface GapData {
  role: { title: string; avgSalary: number };
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedCourses: { slug: string; title: string }[];
}

const CAREER_ROLES = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    icon: <Target className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "finance-analyst",
    title: "Finance Analyst",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-600",
  },
];

export default function CareerPage() {
  const { user, loading: authLoading } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [gapData, setGapData] = useState<Record<string, GapData>>({});
  const [loadingGap, setLoadingGap] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/career/skills");
        if (res.ok) {
          const data = await res.json();
          setSkills(data.skills || []);
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, [user]);

  const fetchGap = useCallback(async (roleId: string) => {
    if (gapData[roleId]) return;
    setLoadingGap(roleId);
    try {
      const res = await fetch(`/api/career/gap?roleId=${roleId}`);
      if (res.ok) {
        const data = await res.json();
        setGapData((prev) => ({ ...prev, [roleId]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch gap:", err);
    } finally {
      setLoadingGap(null);
    }
  }, [gapData]);

  const handleToggleRole = (roleId: string) => {
    if (expandedRole === roleId) {
      setExpandedRole(null);
    } else {
      setExpandedRole(roleId);
      fetchGap(roleId);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = (skill as Skill & { skillType?: string }).skillType || "technical";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Career Intelligence</h1>
          <p className="text-white/50 mb-6">Sign in to see your skills portfolio and career gap analysis.</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Career Intelligence
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Track your skills, identify gaps, and discover which courses will get you closer to your target role.
          </p>

          {/* Top skills badges */}
          {skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {skills.slice(0, 10).map((skill) => (
                <span
                  key={skill.skillId}
                  className="px-3 py-1 text-sm rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30"
                >
                  {skill.skillName}
                </span>
              ))}
              {skills.length > 10 && (
                <span className="px-3 py-1 text-sm rounded-full bg-white/10 text-white/50">
                  +{skills.length - 10} more
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Skills Portfolio */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-violet-400" />
            Your Skills Portfolio
          </h2>

          {loadingSkills ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="rounded-xl bg-white/5 border border-white/10 p-8 text-center">
              <p className="text-white/50 mb-4">
                No skills earned yet. Complete courses to build your skills portfolio.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
              >
                Browse Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["technical", "soft", "tool"] as const).map((type) => (
                <div
                  key={type}
                  className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-6"
                >
                  <h3 className="text-lg font-medium text-white mb-4 capitalize">
                    {type === "tool" ? "Tools" : `${type} Skills`}
                  </h3>
                  <div className="space-y-3">
                    {(groupedSkills[type] || []).map((skill) => (
                      <div key={skill.skillId}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/80">{skill.skillName}</span>
                          <span className="text-white/50">{Math.round(skill.proficiency * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    {!(groupedSkills[type] || []).length && (
                      <p className="text-white/30 text-sm">No {type} skills earned yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Career Roles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Career Roles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAREER_ROLES.map((role, idx) => {
              const gap = gapData[role.id];
              const isExpanded = expandedRole === role.id;
              const isLoading = loadingGap === role.id;

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${role.color} text-white`}>
                          {role.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{role.title}</h3>
                          {gap && (
                            <p className="text-sm text-white/50">
                              Avg. ${gap.role.avgSalary.toLocaleString()}/yr
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Match percentage bar */}
                    {gap && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Match</span>
                          <span
                            className={
                              gap.matchPercentage >= 70
                                ? "text-emerald-400"
                                : gap.matchPercentage >= 40
                                ? "text-amber-400"
                                : "text-red-400"
                            }
                          >
                            {gap.matchPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${gap.matchPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              gap.matchPercentage >= 70
                                ? "bg-emerald-500"
                                : gap.matchPercentage >= 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Matched/Missing skill pills (summary) */}
                    {gap && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {gap.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300"
                          >
                            <CheckCircle className="w-3 h-3" /> {s}
                          </span>
                        ))}
                        {gap.missingSkills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-300"
                          >
                            <XCircle className="w-3 h-3" /> {s}
                          </span>
                        ))}
                        {gap.missingSkills.length > 3 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">
                            +{gap.missingSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleToggleRole(role.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/15 text-white/80 transition"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-violet-400" />
                      ) : isExpanded ? (
                        "Hide Details"
                      ) : (
                        <>
                          View Gap <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && gap && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10 overflow-hidden"
                      >
                        <div className="p-6 space-y-4">
                          {/* Missing skills */}
                          {gap.missingSkills.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-white/70 mb-2">
                                Missing Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {gap.missingSkills.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-lg bg-red-500/10 text-red-300 border border-red-500/20"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommended courses */}
                          {gap.recommendedCourses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-white/70 mb-2">
                                Recommended Courses
                              </h4>
                              <div className="space-y-2">
                                {gap.recommendedCourses.map((course) => (
                                  <Link
                                    key={course.slug}
                                    href={`/course/${course.slug}`}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition group"
                                  >
                                    <span className="text-sm text-white/80">
                                      {course.title}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-violet-400 transition" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {gap.missingSkills.length === 0 && (
                            <p className="text-emerald-400 text-sm font-medium">
                              You have all the required skills for this role!
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
