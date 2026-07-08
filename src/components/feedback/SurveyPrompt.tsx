"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const SURVEY_DELAY_MS = 3 * 60 * 1000; // 3 minutes
const DISMISS_KEY = "survey-prompt-dismissed";
const COMPLETED_KEY = "survey-completed";

/**
 * Auto-shows a survey prompt after 3 minutes of active use.
 * Only shows once per session. Remembers if dismissed or completed.
 */
export default function SurveyPrompt() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or completed
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY) || localStorage.getItem(COMPLETED_KEY)) return;
    if (!user) return; // Only for logged-in users

    const timer = setTimeout(() => {
      // Double-check in case they dismissed during the wait
      if (!localStorage.getItem(DISMISS_KEY) && !localStorage.getItem(COMPLETED_KEY)) {
        setShow(true);
      }
    }, SURVEY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [user]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const goToSurvey = () => {
    localStorage.setItem(COMPLETED_KEY, "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[340px] rounded-2xl border border-[#D4AF37]/25 bg-[#141414] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Gradient top accent */}
          <div className="h-1 bg-[#D4AF37]" />

          <div className="p-5">
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon + Message */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">How's your experience?</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Take a 2-minute survey to help us improve KairosLearn. Your feedback directly shapes what we build next.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-2 mt-4">
              {/*
                Plain <a> tag — Next.js <Link> tries to prefetch survey.html
                as an RSC payload which 404s because it's a static file in
                public/, not an app-router page. (Bug fix 2026-04-07)
              */}
              <a
                href="/survey.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={goToSurvey}
                className="flex-1 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold text-center hover:opacity-90 transition-opacity"
              >
                Take Survey
              </a>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:bg-white/10 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
