"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, BookOpen, BarChart3, ArrowRight, Sparkles, Zap, GraduationCap, Users, Terminal, Play, CheckCircle2 } from "lucide-react";
import { courses } from "@/data";
import { getAllLessons } from "@/data/types";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

// Typewriter code for the hero IDE mockup
const codeLines = [
  { text: "def two_sum(nums, target):", color: "text-blue-400" },
  { text: '    """Find two numbers that add up to target."""', color: "text-emerald-400/60" },
  { text: "    seen = {}", color: "text-[var(--foreground)]" },
  { text: "    for i, num in enumerate(nums):", color: "text-blue-400" },
  { text: "        complement = target - num", color: "text-[var(--foreground)]" },
  { text: "        if complement in seen:", color: "text-violet-400" },
  { text: "            return [seen[complement], i]", color: "text-pink-400" },
  { text: "        seen[num] = i", color: "text-[var(--foreground)]" },
  { text: "    return []", color: "text-pink-400" },
];

function TypewriterCode() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => (prev < codeLines.length ? prev + 1 : prev));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-[13px] leading-6">
      {codeLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3 }}
          className={i >= visibleLines ? "opacity-0" : ""}
        >
          <span className="text-white/20 mr-4 select-none">{String(i + 1).padStart(2)}</span>
          <span className={line.color}>{line.text}</span>
        </motion.div>
      ))}
      {visibleLines >= codeLines.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 pt-3 border-t border-white/[0.06]"
        >
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> All tests passed — 2ms
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  const { user, logout, loading } = useAuth();
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-[var(--background)]/60 backdrop-blur-2xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25">
              G
            </div>
            <span className="text-xl font-bold tracking-tight">Grokking</span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/classrooms" className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-white hover:bg-white/10 transition-all">
                      <GraduationCap className="w-3.5 h-3.5" /> Classrooms
                    </Link>
                    <Link href="/sessions" className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-white hover:bg-white/10 transition-all">
                      <Zap className="w-3.5 h-3.5" /> Sessions
                    </Link>
                    <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <button
                      onClick={() => { logout(); window.location.href = "/login"; }}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/10">
                      Log in
                    </Link>
                    <Link href="/signup" className="btn-gradient rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-all">
                      Sign up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12)_0%,rgba(139,92,246,0.06)_40%,transparent_70%)]" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 md:pt-28 md:pb-24"
        >
          {/* Centered headline */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div variants={item}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-[var(--muted-foreground)]">Free &amp; Open Source</span>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[0.95]"
            >
              Master{" "}
              <span className="gradient-text">Coding Interviews</span>
              <br />
              <span className="text-[var(--foreground)]">&amp; System Design</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto md:text-xl"
            >
              Interactive courses with hands-on Python exercises and an in-browser IDE.
              Learn 16 coding patterns and design 10+ real-world systems.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={courses.length > 0 ? `/course/${courses[0].slug}` : "#courses"}
                className="btn-gradient btn-glow group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all"
              >
                Start Learning
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
              >
                Browse Courses
              </a>
            </motion.div>
          </div>

          {/* IDE Mockup */}
          <motion.div
            variants={item}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="relative">
              {/* Glow behind the IDE */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50" />

              {/* IDE Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1117] border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="ml-3 text-xs text-white/40 font-mono">two_sum.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                      <Play className="w-3 h-3" fill="currentColor" /> Run
                    </button>
                  </div>
                </div>

                {/* Code + Output split */}
                <div className="grid grid-cols-1 md:grid-cols-5">
                  {/* Code editor */}
                  <div className="md:col-span-3 bg-[#0d1117] p-5 min-h-[280px]">
                    <TypewriterCode />
                  </div>

                  {/* Output panel */}
                  <div className="md:col-span-2 bg-[#090d14] border-l border-white/[0.06] p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Terminal className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                      <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Output</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5 }}
                      className="font-mono text-xs space-y-2"
                    >
                      <div className="text-white/40">
                        <span className="text-blue-400">$</span> python two_sum.py
                      </div>
                      <div className="text-[var(--foreground)]">
                        Input: nums = [2, 7, 11, 15], target = 9
                      </div>
                      <div className="text-emerald-400 font-semibold">
                        Output: [0, 1]
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/[0.06] text-white/30">
                        <span className="text-emerald-400">PASS</span> &middot; 3 test cases &middot; 2ms
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-3xl mx-auto"
          >
            {[
              { value: "130+", label: "Lessons", icon: <BookOpen className="w-5 h-5" /> },
              { value: "16", label: "Coding Patterns", icon: <Code2 className="w-5 h-5" /> },
              { value: "10+", label: "System Designs", icon: <BarChart3 className="w-5 h-5" /> },
              { value: "80+", label: "Practice Problems", icon: <Terminal className="w-5 h-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-[var(--muted-foreground)]">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {[
              {
                icon: <Code2 className="w-6 h-6" />,
                title: "In-Browser IDE",
                description: "Write and run Python code directly in your browser. No setup required.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-400",
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Pattern-Based Learning",
                description: "Learn reusable patterns that solve entire categories of problems.",
                gradient: "from-violet-500/20 to-purple-500/20",
                iconColor: "text-violet-400",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Track Your Progress",
                description: "Mark lessons complete and track your journey across courses.",
                gradient: "from-pink-500/20 to-rose-500/20",
                iconColor: "text-pink-400",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-strong group rounded-2xl p-7 transition-all hover:scale-[1.02]"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Features — Live Sessions & Writing Lab */}
      <section className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Beyond <span className="gradient-text">Solo Practice</span>
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)] text-lg">
              Real-time collaboration tools for teachers and students
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/sessions" className="card-gradient-border group block rounded-2xl glass-strong p-8 transition-all h-full">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl shadow-lg shadow-blue-600/20">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-blue-400">Live Sessions</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                  Pick a lesson from any course, launch a live session with pre-loaded exercises. AI tutor assists, students code independently, submit for grading.
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><Sparkles className="w-3.5 h-3.5" /> AI Tutor</div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><Code2 className="w-3.5 h-3.5" /> Pre-loaded IDE</div>
                  <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-all">Enter <ArrowRight className="w-3.5 h-3.5" /></div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/classrooms" className="card-gradient-border group block rounded-2xl glass-strong p-8 transition-all h-full">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-600 text-2xl shadow-lg shadow-violet-600/20">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-violet-400">Classrooms</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                  Structured courses with gated progression. Teachers create classrooms, students solve exercises class by class, AI grades submissions, teachers unlock the next class.
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><Sparkles className="w-3.5 h-3.5" /> AI Grading</div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"><BookOpen className="w-3.5 h-3.5" /> Gated Classes</div>
                  <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-violet-400 opacity-0 group-hover:opacity-100 transition-all">Enter <ArrowRight className="w-3.5 h-3.5" /></div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="relative z-10 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Choose Your <span className="gradient-text">Path</span>
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)] text-lg">
              Two comprehensive courses to ace your technical interviews
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {courses.map((course, i) => {
              const allLessons = getAllLessons(course);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <Link
                    href={`/course/${course.slug}`}
                    className="card-gradient-border group block rounded-2xl glass-strong p-8 transition-all"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl shadow-lg shadow-violet-600/20">
                      {course.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-blue-400">{course.title}</h3>
                    <p className="mb-6 text-sm text-[var(--muted-foreground)] leading-relaxed">{course.description}</p>
                    <div className="flex items-center gap-5 pt-5 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <BookOpen className="w-3.5 h-3.5" /> {course.modules.length} modules
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <Code2 className="w-3.5 h-3.5" /> {allLessons.length} lessons
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                        Start Course <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold">G</div>
              Grokking
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Built for learning. Not affiliated with Educative, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
