"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Mic, BookOpen, ArrowRight, X } from "lucide-react";

interface WelcomeModalProps {
  userName?: string;
}

const STORAGE_KEY = "kairos-welcome-seen";

const actions = [
  {
    title: "Start Your Essays",
    description:
      "AI-guided brainstorming, outline generation, and draft coaching for every essay type.",
    href: "/cc/essays",
    icon: BookOpen,
    accent: "gold",
    bg: "from-[#D4AF37]/10 to-[#D4AF37]/5",
    border: "border-[#D4AF37]/20 hover:border-[#D4AF37]/40",
    iconBg: "bg-[#D4AF37]/10",
    iconColor: "text-[#D4AF37]",
    arrowColor: "text-[#D4AF37]",
  },
  {
    title: "Practice Interviews",
    description:
      "Mock interviews with AI personas from Harvard, Yale, Stanford, MIT, and more.",
    href: "/college-interviews",
    icon: Target,
    accent: "gold",
    bg: "from-[#D4AF37]/10 to-[#D4AF37]/5",
    border: "border-[#D4AF37]/20 hover:border-[#D4AF37]/40",
    iconBg: "bg-[#D4AF37]/10",
    iconColor: "text-[#D4AF37]",
    arrowColor: "text-[#D4AF37]",
  },
  {
    title: "Build Your School List",
    description:
      "Search 1,500+ colleges with chancing estimates, net price, and application tracking.",
    href: "/intake",
    icon: Mic,
    accent: "gold",
    bg: "from-[#D4AF37]/10 to-[#D4AF37]/5",
    border: "border-[#D4AF37]/20 hover:border-[#D4AF37]/40",
    iconBg: "bg-[#D4AF37]/10",
    iconColor: "text-[#D4AF37]",
    arrowColor: "text-[#D4AF37]",
  },
];

export default function WelcomeModal({ userName }: WelcomeModalProps) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setVisible(false);
  }

  function handleCardClick(href: string) {
    dismiss();
    router.push(href);
  }

  const firstName = userName?.split(" ")[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#141414] shadow-2xl shadow-black/40 overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* Gradient glow at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C4A030] to-[#8B7355]" />

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Welcome to KairosLearn
                  {firstName ? `, ${firstName}` : ""}!
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  Here&apos;s what you can do
                </p>
              </div>

              {/* Action cards */}
              <div className="flex flex-col gap-3">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.href}
                      onClick={() => handleCardClick(action.href)}
                      className={`group flex items-center gap-4 w-full text-left p-4 rounded-xl border bg-gradient-to-r ${action.bg} ${action.border} transition-all duration-200`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${action.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">
                          {action.title}
                        </div>
                        <div className="text-xs text-white/45 mt-0.5 leading-relaxed">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 ${action.arrowColor} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Skip button */}
              <div className="mt-5 text-center">
                <button
                  onClick={dismiss}
                  className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
