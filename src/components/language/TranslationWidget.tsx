"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, Languages, Volume2, Copy, Check, Mic, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranslationWidgetProps {
  className?: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const COMMON_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

export function TranslationWidget({ className }: TranslationWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fromLang, setFromLang] = useState<string>("en");
  const [toLang, setToLang] = useState<string>("es");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState<"from" | "to" | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Load saved language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("grokking_translate_prefs");
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (prefs.fromLang) setFromLang(prefs.fromLang);
        if (prefs.toLang) setToLang(prefs.toLang);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save language preference when changed
  useEffect(() => {
    localStorage.setItem(
      "grokking_translate_prefs",
      JSON.stringify({ fromLang, toLang })
    );
  }, [fromLang, toLang]);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setShowLangSelector(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for text selection on the page
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.length > 0 && selection.length < 200) {
        setInputText(selection);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError("");
    setTranslatedText("");
    setPronunciation("");

    try {
      const resp = await fetch("/api/language/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          fromLang,
          toLang,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Translation failed");
      }

      const data = await resp.json();
      setTranslatedText(data.translatedText);
      if (data.pronunciation) {
        setPronunciation(data.pronunciation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, fromLang, toLang]);

  const handleCopy = useCallback(() => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [translatedText]);

  const handlePlayAudio = useCallback(async () => {
    if (!translatedText || isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      const resp = await fetch("/api/language/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translatedText, language: toLang }),
      });

      if (!resp.ok) throw new Error("TTS failed");

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setIsPlayingAudio(false);
    }
  }, [translatedText, toLang, isPlayingAudio]);

  const swapLanguages = useCallback(() => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  }, [fromLang, toLang, inputText, translatedText]);

  const fromLanguage = COMMON_LANGUAGES.find((l) => l.code === fromLang);
  const toLanguage = COMMON_LANGUAGES.find((l) => l.code === toLang);

  return (
    <div
      ref={widgetRef}
      className={cn(
        "fixed bottom-4 left-4 z-50 transition-all duration-300",
        className
      )}
    >
      {/* Collapsed State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700 shadow-lg hover:bg-slate-700/90 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Languages className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-slate-200 group-hover:text-white">
            Translate
          </span>
          <span className="text-xs text-slate-500 ml-1">
            {fromLanguage?.flag} → {toLanguage?.flag}
          </span>
        </button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="w-80 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-slate-200 text-sm">Translate</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            {/* From Language */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowLangSelector(showLangSelector === "from" ? null : "from")
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span className="text-lg">{fromLanguage?.flag}</span>
                <span className="text-sm text-slate-200">{fromLanguage?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showLangSelector === "from" && (
                <div className="absolute bottom-full left-0 mb-1 w-40 max-h-48 overflow-y-auto rounded-lg bg-slate-800 border border-slate-700 shadow-lg">
                  {COMMON_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setFromLang(lang.code);
                        setShowLangSelector(null);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-700 transition-colors",
                        fromLang === lang.code && "bg-indigo-500/20"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-slate-200">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <button
              onClick={swapLanguages}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span className="text-lg">⇄</span>
            </button>

            {/* To Language */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowLangSelector(showLangSelector === "to" ? null : "to")
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span className="text-lg">{toLanguage?.flag}</span>
                <span className="text-sm text-slate-200">{toLanguage?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showLangSelector === "to" && (
                <div className="absolute bottom-full right-0 mb-1 w-40 max-h-48 overflow-y-auto rounded-lg bg-slate-800 border border-slate-700 shadow-lg">
                  {COMMON_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setToLang(lang.code);
                        setShowLangSelector(null);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-700 transition-colors",
                        toLang === lang.code && "bg-indigo-500/20"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-slate-200">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 resize-none focus:outline-none focus:border-indigo-500/50"
              />
              {inputText && (
                <button
                  onClick={() => setInputText("")}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-slate-700 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isLoading}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? "Translating..." : "Translate (1 credit)"}
            </button>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            {/* Result */}
            {translatedText && (
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-200 flex-1">{translatedText}</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={handlePlayAudio}
                      disabled={isPlayingAudio}
                      className={cn(
                        "p-1.5 rounded hover:bg-slate-700 transition-colors",
                        isPlayingAudio ? "text-indigo-400 animate-pulse" : "text-slate-400 hover:text-slate-200"
                      )}
                      title={isPlayingAudio ? "Playing..." : "Play pronunciation"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pronunciation */}
                {pronunciation && (
                  <p className="mt-2 text-xs text-slate-500 italic">
                    Pronunciation: {pronunciation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">
              Select text on the page to auto-fill
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
