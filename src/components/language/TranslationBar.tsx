"use client";

import { useState, useCallback, useRef } from "react";
import { Languages, ArrowRightLeft, Volume2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAI } from "@/contexts/AIContext";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
];

export function TranslationBar({ className }: { className?: string }) {
  const { isPanelOpen } = useAI();
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const native = localStorage.getItem('native-language');
      return native && native !== 'en' ? native : 'es';
    }
    return 'es';
  });
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTranslate = useCallback(async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult("");
    try {
      const resp = await fetch("/api/language/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, fromLang, toLang }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setResult(data.translatedText);
      }
    } catch {
      setResult("Translation failed");
    } finally {
      setIsLoading(false);
    }
  }, [input, fromLang, toLang]);

  const handlePlayAudio = useCallback(async () => {
    if (!result || isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const resp = await fetch("/api/language/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result, language: toLang }),
      });
      if (!resp.ok) throw new Error();
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsPlayingAudio(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsPlayingAudio(false); URL.revokeObjectURL(url); };
      await audio.play();
    } catch {
      setIsPlayingAudio(false);
    }
  }, [result, toLang, isPlayingAudio]);

  const swapLangs = useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInput(result);
    setResult(input);
  }, [fromLang, toLang, input, result]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  // Minimized: just a small pill
  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-0 left-0 right-0 z-30", isPanelOpen ? "hidden md:block" : "", className)}>
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <button
            onClick={() => { setIsMinimized(false); setTimeout(() => inputRef.current?.focus(), 100); }}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 text-slate-400 text-xs md:text-sm hover:text-white hover:bg-slate-800 transition-all shadow-lg"
            title="Translate words or phrases between languages"
          >
            <Languages className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
            <span className="hidden sm:inline">Translate a word or phrase</span>
            <span className="sm:hidden">Translate</span>
          </button>
        </div>
      </div>
    );
  }

  // Expanded: persistent bottom bar
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800", isPanelOpen ? "hidden md:block" : "", className)}>
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* From Language */}
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500/50"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>

          {/* Swap */}
          <button onClick={swapLangs} className="text-slate-500 hover:text-white transition-colors">
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          {/* To Language */}
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500/50"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>

          {/* Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to translate..."
              className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600"
            />
          </div>

          {/* Result */}
          {result && (
            <div className="flex items-center gap-2 max-w-[30%]">
              <span className="text-sm text-indigo-300 truncate">{result}</span>
              <button
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                className={cn(
                  "p-1 rounded transition-colors",
                  isPlayingAudio ? "text-indigo-400 animate-pulse" : "text-slate-400 hover:text-white"
                )}
              >
                {isPlayingAudio ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Loading */}
          {isLoading && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}

          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
