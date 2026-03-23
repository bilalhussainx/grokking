"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic, MicOff, ArrowRight, Globe, Clock, Zap, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const LANGUAGES = [
  { code: "en", name: "English", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "es", name: "Spanish", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "fr", name: "French", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "de", name: "German", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "it", name: "Italian", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "nl", name: "Dutch", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "ja", name: "Japanese", flag: "\u{1F1EF}\u{1F1F5}" },
];

interface TranscriptEntry {
  speaker: "caller" | "callee";
  original: string;
  translated: string;
  timestamp: Date;
}

type CallState = "idle" | "connecting" | "ringing" | "active" | "ended";

export default function CallPage() {
  const { user, credits } = useAuth();
  const [callState, setCallState] = useState<CallState>("idle");
  const [myLang, setMyLang] = useState("en");
  const [theirLang, setTheirLang] = useState("es");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (callState === "active") {
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callState]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const creditsUsed = Math.ceil(duration / 60) * 5;

  const startCall = async () => {
    if (!phoneNumber.trim()) {
      setError("Enter a phone number");
      return;
    }
    setError("");
    setCallState("connecting");

    try {
      const res = await fetch("/api/call/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callerPhone: phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`,
          calleePhone: phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`,
          callerLanguage: myLang,
          calleeLanguage: theirLang,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start call");
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setCallState("ringing");

      // Simulate connection (in production, Twilio webhooks update this)
      setTimeout(() => setCallState("active"), 3000);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
      setCallState("idle");
    }
  };

  const endCall = () => {
    setCallState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const copyTranscript = () => {
    const text = transcript
      .map(t => `${t.speaker === "caller" ? "You" : "Them"}: ${t.original}\n→ ${t.translated}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCall = () => {
    setCallState("idle");
    setTranscript([]);
    setDuration(0);
    setSessionId(null);
    setError("");
  };

  // ─── IDLE STATE: Start a Call ───
  if (callState === "idle") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
              <Phone className="w-3.5 h-3.5" />
              Real-Time Translation
            </div>
            <h1 className="text-3xl font-bold text-white">Translated Call</h1>
            <p className="text-white/40 text-sm mt-2">Talk to anyone in any of 7 languages</p>
          </div>

          {/* Call Form */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
            {/* Language Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">I speak</label>
                <select
                  value={myLang}
                  onChange={e => setMyLang(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">They speak</label>
                <select
                  value={theirLang}
                  onChange={e => setTheirLang(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="bg-slate-900">{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Arrow between languages */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 text-white/20">
                <span className="text-lg">{LANGUAGES.find(l => l.code === myLang)?.flag}</span>
                <ArrowRight className="w-4 h-4" />
                <Globe className="w-4 h-4 text-emerald-400" />
                <ArrowRight className="w-4 h-4" />
                <span className="text-lg">{LANGUAGES.find(l => l.code === theirLang)?.flag}</span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Their phone number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* Call Button — animated gradient with glow */}
            <motion.button
              onClick={startCall}
              disabled={!user || !phoneNumber.trim()}
              className="w-full relative overflow-hidden py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Start Translated Call
              </div>
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.button>

            {/* Cost info */}
            <div className="flex items-center justify-between text-xs text-white/30">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 5 credits/min</span>
              <span>Credits: {credits}</span>
            </div>
          </div>

          {/* Dial-in info */}
          <p className="text-center text-xs text-white/20 mt-6">
            Or dial in: {process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER || "+1-XXX-SAMSARA"}
          </p>

          {!user && (
            <div className="text-center mt-4">
              <Link href="/signup" className="text-violet-400 text-sm hover:underline">
                Sign up free to make calls
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ─── CONNECTING / RINGING ───
  if (callState === "connecting" || callState === "ringing") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Pulsing phone icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6"
          >
            <Phone className="w-10 h-10 text-emerald-400" />
          </motion.div>

          <h2 className="text-xl font-bold text-white mb-2">
            {callState === "connecting" ? "Connecting..." : "Ringing..."}
          </h2>
          <p className="text-white/40 text-sm mb-2">{phoneNumber}</p>
          <p className="text-white/30 text-xs">
            {LANGUAGES.find(l => l.code === myLang)?.flag} {LANGUAGES.find(l => l.code === myLang)?.name}
            {" → "}
            {LANGUAGES.find(l => l.code === theirLang)?.flag} {LANGUAGES.find(l => l.code === theirLang)?.name}
          </p>

          <motion.button
            onClick={endCall}
            className="mt-8 px-6 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── ACTIVE CALL ───
  if (callState === "active") {
    const myLangInfo = LANGUAGES.find(l => l.code === myLang)!;
    const theirLangInfo = LANGUAGES.find(l => l.code === theirLang)!;

    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Live</span>
            <span className="text-sm font-mono text-white/40">{formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{myLangInfo.flag} {myLangInfo.name}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{theirLangInfo.flag} {theirLangInfo.name}</span>
          </div>
        </div>

        {/* Transcript area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {transcript.length === 0 && (
            <div className="text-center py-20">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/20 text-sm"
              >
                Listening for speech...
              </motion.div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {transcript.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${entry.speaker === "caller" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  entry.speaker === "caller"
                    ? "bg-emerald-500/10 border border-emerald-500/20 rounded-br-md"
                    : "bg-white/[0.04] border border-white/[0.08] rounded-bl-md"
                }`}>
                  <p className="text-sm text-white/80">{entry.original}</p>
                  <p className="text-xs text-emerald-400/70 mt-1.5 border-t border-white/[0.06] pt-1.5">
                    → {entry.translated}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={transcriptEndRef} />
        </div>

        {/* Bottom controls */}
        <div className="border-t border-white/[0.06] px-4 py-6">
          <div className="flex items-center justify-center gap-6">
            <motion.button
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <Mic className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <PhoneOff className="w-7 h-7" />
            </motion.button>

            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-mono text-white/60">{creditsUsed}</div>
                <div className="text-[8px] text-white/30">credits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CALL ENDED ───
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Call Ended</h2>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/40">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(duration)}</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {creditsUsed} credits</span>
          </div>
        </div>

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/60">Transcript</h3>
              <button
                onClick={copyTranscript}
                className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {transcript.map((entry, i) => (
                <div key={i} className="text-sm">
                  <p className="text-white/70">
                    <span className="text-white/30">{entry.speaker === "caller" ? "You" : "Them"}:</span> {entry.original}
                  </p>
                  <p className="text-emerald-400/50 text-xs mt-0.5">→ {entry.translated}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.button
          onClick={resetCall}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
          whileTap={{ scale: 0.98 }}
        >
          Start New Call
        </motion.button>
      </motion.div>
    </div>
  );
}
