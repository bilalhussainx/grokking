"use client";

import { useCoachKairos } from "@/contexts/CoachKairosContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, X, Volume2, VolumeX, Languages, Check } from "lucide-react";
import { useState } from "react";
import CoachChat from "./CoachChat";
import { COACH_LANGUAGES, getCoachLanguage } from "@/lib/cc/coach-languages";
import { FAMILY_MODE_LANGUAGES } from "@/lib/cc/family-mode-strings";
import HandToParentButton from "@/components/family-mode/HandToParentButton";
import FamilyModeView from "@/components/family-mode/FamilyModeView";
import WorkingLatePrompt from "@/components/cc/WorkingLatePrompt";

// Pages where the floating Coach drawer is suppressed — pre-auth surfaces and
// pages where the page IS the voice UI. Essay workspace used to be suppressed
// but the Revise phase's 'Talk through with Coach' button needs the drawer to
// actually open, so essays are allowed again. On brainstorm/outline/draft the
// floating drawer is a secondary entry point — students typically use the
// in-page chats instead, and having both open is harmless.
const HIDDEN_PATHS = ["/login", "/signup", "/onboarding", "/landing", "/talk"];

export default function CoachKairosShell() {
  const { user } = useAuth();
  const {
    isOpen, toggle, close, isStreaming,
    language, setLanguage,
    voiceEnabled, setVoiceEnabled,
    isSpeaking, stopSpeaking,
    familyMode, toggleFamilyMode,
  } = useCoachKairos();
  const pathname = usePathname();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  if (!user) return null;
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const currentLang = getCoachLanguage(language);

  return (
    <>
      {familyMode && (
        <FamilyModeView
          language={language}
          onExit={() => toggleFamilyMode(false)}
        />
      )}
      <WorkingLatePrompt />
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggle}
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center hover:bg-[#C4A030] transition-colors group"
          >
            <GraduationCap className="w-7 h-7 text-black" />
            {isStreaming && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            )}
            {isSpeaking && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-sky-400 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 z-[9999] md:hidden"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[9999] w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/10 flex flex-col"
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">Coach Kairos</h3>
                    <p className="text-[10px] text-white/40 truncate">
                      {voiceEnabled ? `Voice: ${currentLang.nativeName}` : "Your college counselor"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <HandToParentButton
                    onClick={() => toggleFamilyMode(true)}
                    disabled={!(FAMILY_MODE_LANGUAGES as readonly string[]).includes(language)}
                  />
                  <div className="relative">
                    <button
                      onClick={() => setLangMenuOpen((o) => !o)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"
                      title={`Language: ${currentLang.name}`}
                    >
                      <Languages className="w-4 h-4" />
                      <span className="text-[10px]">{currentLang.flag}</span>
                    </button>

                    <AnimatePresence>
                      {langMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setLangMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl bg-[#151515] border border-white/10 shadow-xl overflow-hidden"
                          >
                            <div className="px-3 py-2 text-[10px] uppercase tracking-wide text-white/40 border-b border-white/5">
                              Coach language
                            </div>
                            {COACH_LANGUAGES.map((l) => (
                              <button
                                key={l.code}
                                onClick={() => {
                                  setLanguage(l.code);
                                  setLangMenuOpen(false);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-white/5 text-left"
                              >
                                <span className="text-base">{l.flag}</span>
                                <span className="flex-1 text-xs text-white/80">{l.nativeName}</span>
                                {l.code === language && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Urdu used to be text-only; it's now wired through Deepgram
                      nova-3 STT + Google Cloud TTS via voice-provider-router.ts
                      (GOOGLE_TTS_LANGUAGES). The dedicated Urdu-disabled branch
                      that lived here was stale. Every coach language now uses
                      the same toggle. */}
                  <button
                    onClick={() => {
                      if (isSpeaking) stopSpeaking();
                      setVoiceEnabled(!voiceEnabled);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      voiceEnabled
                        ? "bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                        : "hover:bg-white/5 text-white/40 hover:text-white/60"
                    }`}
                    title={voiceEnabled ? "Voice on — click to disable" : "Voice off — click to enable"}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={close}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {voiceEnabled && isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="mx-4 mt-3 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-300 hover:bg-sky-500/15 transition-colors flex items-center gap-2 self-start"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Speaking in {currentLang.nativeName} — tap to stop
                </button>
              )}

              <CoachChat />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
