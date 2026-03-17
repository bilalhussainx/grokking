"use client";

import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider, useAI } from "@/contexts/AIContext";
import { XPProvider, useXP } from "@/contexts/XPContext";
import { TopNavProvider } from "@/contexts/TopNavContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AICoach from "@/components/ai/AICoach";
import SessionNotes from "@/components/ai/SessionNotes";
import { TranslationBar } from "@/components/language/TranslationBar";
import TopNav from "@/components/layout/TopNav";
import GlobalSearch from "@/components/search/GlobalSearch";
import ShortcutsHelp from "@/components/ui/ShortcutsHelp";
import XPFlyUp from "@/components/gamification/XPFlyUp";
import AchievementToast from "@/components/gamification/AchievementToast";
import VariableReward from "@/components/gamification/VariableReward";
import { GraduationCap, X, FileText, ChevronLeft, Mic } from "lucide-react";

/**
 * Coach Sidebar — keeps AICoach ALWAYS mounted so voice stays connected.
 *
 * - Desktop: 320px right panel (hidden via w-0 when closed)
 * - Mobile: Full-screen overlay (hidden via translate-x when closed)
 *
 * CRITICAL: We never unmount AICoach — we hide it with CSS.
 * This keeps the Deepgram WebSocket alive when user toggles the panel.
 */
function CoachSidebar() {
  const { isPanelOpen, closePanel, lessonContext } = useAI();
  const [activeTab, setActiveTab] = useState<"coach" | "notes">("coach");
  // Track if coach has ever been shown (to avoid mounting before needed)
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    if (isPanelOpen) setHasBeenOpened(true);
  }, [isPanelOpen]);

  // Don't mount coach until it's been opened at least once or there's a lesson
  if (!hasBeenOpened && !lessonContext) return null;

  const tabBar = (
    <div className="flex border-b border-white/[0.06] shrink-0">
      <button
        onClick={() => setActiveTab("coach")}
        className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
          activeTab === "coach"
            ? "text-blue-400 border-b-2 border-blue-400"
            : "text-white/30 hover:text-white/50"
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        Coach
      </button>
      <button
        onClick={() => setActiveTab("notes")}
        className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
          activeTab === "notes"
            ? "text-amber-400 border-b-2 border-amber-400"
            : "text-white/30 hover:text-white/50"
        }`}
      >
        <FileText className="w-3.5 h-3.5" />
        Notes
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile: full-screen overlay — slides in/out, never unmounts */}
      <div
        className={`fixed inset-0 z-50 bg-[var(--background)] flex flex-col md:hidden transition-transform duration-300 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.08] shrink-0">
          <button
            onClick={closePanel}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Lesson
          </button>
          <span className="text-[10px] text-white/20">Voice stays active</span>
        </div>

        {tabBar}

        <div className="flex-1 min-h-0 overflow-hidden">
          {/* AICoach is mounted here on mobile — ALWAYS rendered */}
          <div className={activeTab === "coach" ? "h-full" : "hidden"}>
            <AICoach />
          </div>
          <div className={activeTab === "notes" ? "h-full" : "hidden"}>
            <SessionNotes />
          </div>
        </div>
      </div>

      {/* Desktop: side panel — width transitions, never unmounts */}
      <div
        className={`hidden md:flex shrink-0 h-[calc(100vh-3.5rem)] border-l border-white/[0.08] bg-[var(--background)] flex-col overflow-hidden transition-all duration-200 ${
          isPanelOpen ? "w-80" : "w-0 border-l-0"
        }`}
      >
        <div className={`flex flex-col h-full min-w-[320px] ${isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button
            onClick={closePanel}
            className="absolute top-3 right-3 z-10 p-1 rounded-md hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {tabBar}

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className={activeTab === "coach" ? "h-full" : "hidden"}>
              <AICoach />
            </div>
            <div className={activeTab === "notes" ? "h-full" : "hidden"}>
              <SessionNotes />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Floating action button — shows when coach panel is closed.
 * On mobile, shows a small mic indicator if voice is still active.
 */
function CoachFAB() {
  const { isPanelOpen, openPanel, lessonContext } = useAI();

  if (isPanelOpen || !lessonContext) return null;

  return (
    <button
      onClick={openPanel}
      className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-3 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
    >
      <GraduationCap className="w-5 h-5" />
      <span className="hidden sm:inline">Coach Alex</span>
    </button>
  );
}

/**
 * AppLayout — wraps children + coach sidebar.
 * Coach is always mounted (never unmounted) to preserve voice connection.
 */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-auto">
          {children}
        </div>
        <CoachSidebar />
      </div>
    </div>
  );
}

/**
 * Global gamification overlays — XP fly-up + achievement toasts.
 * Must be inside XPProvider to access context.
 */
function GamificationOverlays() {
  const { showXPFlyUp, lastXPAmount, pendingAchievements, dismissAchievement, pendingReward, dismissReward } = useXP();

  return (
    <>
      <XPFlyUp trigger={showXPFlyUp} amount={lastXPAmount} />
      <AchievementToast
        achievements={pendingAchievements}
        onDismiss={dismissAchievement}
      />
      <VariableReward reward={pendingReward} onDismiss={dismissReward} />
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
      <TopNavProvider>
        <AIProvider>
          <XPProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <CoachFAB />
            <GamificationOverlays />
            <GlobalSearch />
            <ShortcutsHelp />
            <TranslationBar />
          </XPProvider>
        </AIProvider>
      </TopNavProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
