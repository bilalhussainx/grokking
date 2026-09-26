"use client";
import { proMonthlyLabel } from "@/lib/pricing";

// Context-aware upgrade modal. Triggered by useFetchWithUpgrade when a gated
// API route returns HTTP 402. Copy + CTA adapt per capability so the student
// sees the specific reason they're being asked to upgrade — not a generic
// "buy now" wall.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.3.

import { useEffect } from "react";
import { X, Sparkles, Check } from "lucide-react";
import type { Capability } from "@/lib/cc/tier-gate";

export interface UpgradeRequest {
  capability: Capability;
  upgradeTo: "free" | "pro";
  tier: "guest" | "free" | "pro";
  reason?: string;
  limit?: number | null;
}

interface Props {
  request: UpgradeRequest | null;
  onClose: () => void;
  onSignup: () => void;   // opens signup modal for guest → free
  onCheckout: () => void; // routes to /pricing → Stripe checkout for Pro
}

interface Copy {
  headline: string;
  body: string;
  ctaLabel: string;
  bullets: string[];
}

function copyFor(req: UpgradeRequest): Copy {
  const toPro = req.upgradeTo === "pro";

  const proBullets = [
    "Unlimited Coach Kairos messages + voice",
    "Unlimited essay drafts and reviews",
    "All supplemental essays (Why-This-School, etc.)",
    "Mock interview practice unlimited",
    "Counselor share link + financial aid appeal + FAFSA walkthrough",
    "Full scholarship matching + alerts",
  ];
  const freeBullets = [
    "Save your school list + essays across devices",
    "200 Coach Kairos messages per day",
    "1 full essay review",
    "10 minutes of voice coaching daily",
    "1 mock interview session",
  ];

  switch (req.capability) {
    case "schoolsMax":
      return toPro
        ? {
            headline: "Unlock an unlimited school list",
            body: "Pro lets you track every reach, match, and safety you're considering — no cap.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Save your list — it takes 10 seconds",
            body: `You've added the max ${req.limit ?? 3} schools for a guest. Sign up free and keep adding.`,
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "coachMessagesPerDay":
      return toPro
        ? {
            headline: "Unlimited chat with Coach Kairos",
            body: "Upgrade to Pro and keep the conversation going — with a generous fair-use daily limit.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Want to keep talking with Coach Kairos?",
            body: "Sign up free and you'll get 200 messages a day — 10× the guest limit.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "coachVoiceMinutesPerDay":
      return toPro
        ? {
            headline: "Unlimited voice coaching",
            body: "Pro raises the 10-minute daily limit to a generous fair-use allowance — useful for mock-interview prep or long essay debriefs.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Hear Coach Kairos talk back",
            body: "Voice mode unlocks once you sign up free — 10 minutes per day.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "reviewsMax":
      return toPro
        ? {
            headline: "Unlock unlimited essay reviews",
            body: `You just used your free review. Pro gives you unlimited reviews + all supplements for ${proMonthlyLabel()} — most students draft 20–30 essays across their list.`,
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Get your essay reviewed free",
            body: "Sign up and we'll give you 1 full counselor-grade review — the best way to feel what Coach Kairos can do.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "supplementsAllowed":
      return {
        headline: "Supplemental essays are a Pro feature",
        body: "Why-This-School, Why-This-Major, and other supplements live behind Pro. They're the essays that compound — 20–30 across a typical list.",
        ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
        bullets: proBullets,
      };

    case "essaysMax":
      return toPro
        ? {
            headline: "Draft every essay you need",
            body: "Pro gives you unlimited drafts — personal statement plus every supplement.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Draft your essay — free",
            body: "Sign up to save your draft across devices and lock in your one free review.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "activityBulletsMax":
      return toPro
        ? {
            headline: "Optimize all 10 activity slots",
            body: "Pro lets you polish every Common App bullet.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Optimize more activity bullets",
            body: "Free users get 10 bullets optimized — plenty for the Common App.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "resumeParsesMax":
      return toPro
        ? {
            headline: "Parse your resume again",
            body: "Pro lets you re-parse your resume whenever you update it.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Parse your resume — free",
            body: "Sign up and drop in your resume; we'll turn it into Common App activities.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "mockInterviewsMax":
      return toPro
        ? {
            headline: "Unlimited mock interviews",
            body: "You used your free session. Pro gives you unlimited reps with per-school interviewer personas.",
            ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
            bullets: proBullets,
          }
        : {
            headline: "Practice your college interview",
            body: "Sign up to run 1 free mock with the school's interviewer persona.",
            ctaLabel: "Sign up free",
            bullets: freeBullets,
          };

    case "counselorShareLink":
      return {
        headline: "Share your progress with a counselor",
        body: "Counselor share links are a Pro feature — they show your full app package in one read-only page.",
        ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
        bullets: proBullets,
      };

    case "financialAidAppeal":
      return {
        headline: "Appeal your financial aid package",
        body: "Pro generates a counselor-grade appeal letter for your admitted schools.",
        ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
        bullets: proBullets,
      };

    case "fafsaWalkthrough":
      return {
        headline: "FAFSA walkthrough — Pro",
        body: "Line-by-line walkthrough of every FAFSA question, tailored to your situation.",
        ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
        bullets: proBullets,
      };

    case "scholarshipMatching":
      return {
        headline: "Scholarship matching + alerts",
        body: "Pro matches you against 500+ scholarships and pings you when deadlines approach.",
        ctaLabel: `Upgrade to Pro — ${proMonthlyLabel()}`,
        bullets: proBullets,
      };

    default:
      return {
        headline: "Upgrade to continue",
        body: req.reason ?? "Upgrade your account to unlock this feature.",
        ctaLabel: toPro ? `Upgrade to Pro — ${proMonthlyLabel()}` : "Sign up free",
        bullets: toPro ? proBullets : freeBullets,
      };
  }
}

export default function UpgradeModal({ request, onClose, onSignup, onCheckout }: Props) {
  useEffect(() => {
    if (!request) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [request, onClose]);

  if (!request) return null;
  const c = copyFor(request);
  const toPro = request.upgradeTo === "pro";

  const handleCta = () => (toPro ? onCheckout() : onSignup());

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0b0b0b] border border-white/15 rounded-xl w-full max-w-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37]">
              {toPro ? "Kairos Pro" : "Free account"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          <h2 className="text-lg font-semibold text-white mb-2">{c.headline}</h2>
          <p className="text-sm text-white/70 leading-relaxed">{c.body}</p>

          <ul className="mt-4 space-y-2">
            {c.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[13px] text-white/80">
                <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D4AF37]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-[13px] text-white/50 hover:text-white/80 px-3 py-2"
          >
            Not now
          </button>
          <button
            onClick={handleCta}
            className="ml-auto px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-medium text-sm hover:bg-[#c29f2f] transition-colors"
          >
            {c.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
