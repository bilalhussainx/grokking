"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Crown, Zap, BookOpen, Mic, Award, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PaywallModalProps {
  courseTitle: string;
  trigger: "course_locked" | "credits_depleted" | "interview_locked" | "voice_locked";
  onClose: () => void;
}

const TRIGGER_MESSAGES = {
  course_locked: {
    title: "This course requires Pro",
    subtitle: "Upgrade to unlock all 13+ courses and accelerate your learning.",
    icon: Lock,
  },
  credits_depleted: {
    title: "You're out of credits",
    subtitle: "Upgrade to Pro for 500 AI credits per month — coaching, hints, and interviews.",
    icon: Zap,
  },
  interview_locked: {
    title: "Mock interviews are Pro-only",
    subtitle: "Practice with AI interviewers that teach and evaluate — unlimited with Pro.",
    icon: Mic,
  },
  voice_locked: {
    title: "Voice coaching is Pro-only",
    subtitle: "Talk with AI coaches in real-time — choose your voice and persona.",
    icon: Mic,
  },
};

export default function PaywallModal({ courseTitle, trigger, onClose }: PaywallModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [hovering, setHovering] = useState(false);
  const msg = TRIGGER_MESSAGES[trigger];
  const isLoggedOut = !user;
  const Icon = msg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-white/[0.08] bg-[var(--background)] shadow-2xl overflow-hidden">
        {/* Gradient accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Icon className="w-8 h-8 text-amber-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">{msg.title}</h2>
          <p className="text-sm text-white/50 mb-1">{msg.subtitle}</p>
          {courseTitle && trigger === "course_locked" && (
            <p className="text-xs text-white/30 mb-6">Trying to access: {courseTitle}</p>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              { icon: BookOpen, text: "All 13+ courses" },
              { icon: Zap, text: "500 credits/month" },
              { icon: Mic, text: "Voice coaching" },
              { icon: Award, text: "Certificates" },
            ].map(({ icon: FIcon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-white/60">
                <FIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          {isLoggedOut ? (
            <>
              <button
                onClick={() => router.push("/signup")}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-cyan-500 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
              >
                Create Free Account
              </button>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2.5 mt-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white hover:bg-white/10 transition-all"
              >
                Already have an account? Sign in
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/pricing")}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Crown className={`w-4 h-4 transition-transform ${hovering ? "scale-110" : ""}`} />
                Upgrade to Pro — $10/mo
              </button>
              <p className="text-[10px] text-white/20 mt-3">Cancel anytime. 7-day money-back guarantee.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
