"use client";

import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider, useAI } from "@/contexts/AIContext";
import { TopNavProvider } from "@/contexts/TopNavContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AICoach from "@/components/ai/AICoach";
import SessionNotes from "@/components/ai/SessionNotes";
import { TranslationBar } from "@/components/language/TranslationBar";
import TopNav from "@/components/layout/TopNav";
import GlobalSearch from "@/components/search/GlobalSearch";
import ShortcutsHelp from "@/components/ui/ShortcutsHelp";
import { GraduationCap, X, FileText } from "lucide-react";

/**
 * Coach Sidebar — right-side panel that PUSHES content instead of overlaying.
 *
 * The key difference from the old design: instead of `position: fixed` (which
 * overlays the IDE), the sidebar is part of the flex layout in the wrapper div.
 * The main content shrinks to accommodate it — no overlap.
 */
function CoachSidebar() {
  const { isPanelOpen, closePanel } = useAI();
  const [activeTab, setActiveTab] = useState<"coach" | "notes">("coach");

  if (!isPanelOpen) return null;

  return (
    <div className="w-80 shrink-0 h-[calc(100vh-3.5rem)] border-l border-white/[0.08] bg-[var(--background)] flex flex-col overflow-hidden">
      <button
        onClick={closePanel}
        className="absolute top-3 right-3 z-10 p-1 rounded-md hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Tab switcher */}
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

      {activeTab === "coach" ? <AICoach /> : <SessionNotes />}
    </div>
  );
}

function CoachFAB() {
  const { isPanelOpen, openPanel, lessonContext } = useAI();

  if (isPanelOpen || !lessonContext) return null;

  return (
    <button
      onClick={openPanel}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-3 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
    >
      <GraduationCap className="w-5 h-5" />
      Coach Alex
    </button>
  );
}

/**
 * AppLayout — wraps children + coach sidebar in a flex row.
 * When coach is open, children shrink and sidebar takes 320px.
 * No overlays, no z-index fights.
 *
 * Global TopNav renders here so every page gets a nav bar.
 * CourseLayout can override nav props via TopNavContext.
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

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
      <TopNavProvider>
        <AIProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <CoachFAB />
          <GlobalSearch />
          <ShortcutsHelp />
          <TranslationBar />
        </AIProvider>
      </TopNavProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
