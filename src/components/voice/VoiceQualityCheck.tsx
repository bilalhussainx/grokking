"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, RotateCcw, CheckCircle2 } from "lucide-react";

type Phase =
  | "idle"
  | "permission-asking"
  | "permission-denied"
  | "ready"
  | "recording"
  | "review"
  | "passed";

export default function VoiceQualityCheck({
  language,
  onPassed,
}: {
  language: string;
  onPassed: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
  }, [audioUrl]);

  const grantMic = async () => {
    setPhase("permission-asking");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop()); // release until record press
      setPhase("ready");
    } catch {
      setPhase("permission-denied");
    }
  };

  const startRecording = async () => {
    setPhase("recording");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setPhase("review");
      };
      rec.start();
      stopTimerRef.current = window.setTimeout(
        () => rec.state === "recording" && rec.stop(),
        3000,
      );
    } catch (e) {
      setError(String(e));
      setPhase("ready");
    }
  };

  const confirmPassed = async () => {
    setPhase("passed");
    try {
      await fetch("/api/cc/profile/voice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markVoiceCheckPassed: true }),
      });
    } catch {
      /* non-fatal */
    }
    onPassed();
  };

  const redo = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setPhase("ready");
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-3">
      <h4 className="text-sm font-semibold text-white mb-3">Before we start</h4>

      <div className="flex items-center gap-2 text-[13px] mb-2">
        {phase === "idle" || phase === "permission-asking" ? (
          <button
            onClick={grantMic}
            className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-[12px] hover:bg-[#D4AF37]/20"
          >
            Grant microphone permission
          </button>
        ) : phase === "permission-denied" ? (
          <p className="text-rose-300 text-[12px]">
            <MicOff className="inline w-3.5 h-3.5 mr-1" />
            Click the lock icon in your browser bar &rarr; Microphone &rarr; Allow.
          </p>
        ) : (
          <p className="text-emerald-400 text-[12px]">
            <CheckCircle2 className="inline w-3.5 h-3.5 mr-1" /> Microphone ready
          </p>
        )}
      </div>

      {phase === "ready" && (
        <button
          onClick={startRecording}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-200 text-[12px] hover:bg-rose-500/30"
        >
          <Mic className="inline w-3.5 h-3.5 mr-1" />
          Record 3-second test
        </button>
      )}
      {phase === "recording" && (
        <p className="text-[12px] text-white/70">
          <Mic className="inline w-3.5 h-3.5 mr-1 animate-pulse" /> Recording... say anything for 3 seconds
        </p>
      )}
      {phase === "review" && audioUrl && (
        <div className="space-y-2">
          <audio src={audioUrl} controls className="w-full max-w-xs" />
          <p className="text-[12px] text-white/70">Did that sound clear?</p>
          <div className="flex gap-2">
            <button
              onClick={confirmPassed}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-200 text-[12px] hover:bg-emerald-500/30"
            >
              Yes, sounds good
            </button>
            <button
              onClick={redo}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[12px] hover:bg-white/15"
            >
              <RotateCcw className="inline w-3.5 h-3.5 mr-1" />
              Redo
            </button>
          </div>
        </div>
      )}
      {phase === "passed" && (
        <p className="text-emerald-400 text-[12px]">
          <CheckCircle2 className="inline w-3.5 h-3.5 mr-1" /> All set — voice ready in {language}
        </p>
      )}
      {error && <p className="text-rose-400 text-[11px] mt-2">{error}</p>}
    </div>
  );
}
