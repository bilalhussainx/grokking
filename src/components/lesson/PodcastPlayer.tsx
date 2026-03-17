"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Headphones, Play, Pause, Loader2, AlertCircle } from "lucide-react";

interface PodcastPlayerProps {
  lessonContent: string;
  lessonTitle: string;
  courseTitle: string;
}

type PlayerState = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Deterministic pseudo-random heights for waveform bars */
const BAR_HEIGHTS = [18, 28, 12, 24, 8, 20, 30, 14, 26, 10, 22, 32, 16, 28, 6, 24, 20, 30, 12, 26, 18, 8, 22, 14];
const BAR_SPEEDS = [1.1, 0.9, 1.3, 1.0, 1.4, 0.8, 1.2, 1.1, 0.7, 1.3, 1.0, 0.9, 1.4, 1.1, 0.8, 1.2, 1.0, 0.9, 1.3, 1.1, 0.7, 1.4, 1.0, 1.2];

/** Simple animated waveform bars */
function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-9 px-2">
      {BAR_HEIGHTS.map((maxH, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-teal-500 to-emerald-400"
          style={{
            height: playing ? `${maxH}px` : "4px",
            animation: playing
              ? `podcastWave${i} ${BAR_SPEEDS[i]}s ease-in-out ${i * 0.04}s infinite alternate`
              : "none",
            transition: playing ? "none" : "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

export default function PodcastPlayer({
  lessonContent,
  lessonTitle,
  courseTitle,
}: PodcastPlayerProps) {
  const [state, setState] = useState<PlayerState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const generatePodcast = useCallback(async () => {
    // If we already have audio, just play it
    if (audioRef.current && blobUrlRef.current) {
      audioRef.current.play();
      setState("playing");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      const resp = await fetch("/api/ai/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonContent, lessonTitle, courseTitle }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate podcast");
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setState("ready");
      });

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("ended", () => {
        setState("ready");
        setCurrentTime(0);
      });

      audio.addEventListener("error", () => {
        setState("error");
        setErrorMsg("Audio playback error");
      });

      // Some browsers need canplaythrough before duration is available
      audio.addEventListener("canplaythrough", () => {
        if (audio.duration && isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      });

      audio.load();
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }, [lessonContent, lessonTitle, courseTitle]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state === "playing") {
      audio.pause();
      setState("paused");
    } else {
      audio.play();
      setState("playing");
    }
  }, [state]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const bar = progressBarRef.current;
      if (!audio || !bar || !duration) return;

      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ─── Idle state: compact button ───
  if (state === "idle") {
    return (
      <button
        onClick={generatePodcast}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-teal-500/10 hover:border-teal-500/30 transition-all duration-200 mb-4"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
          <Headphones className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-white/70 group-hover:text-teal-300 transition-colors">
          Listen as Podcast
        </span>
      </button>
    );
  }

  // ─── Loading state ───
  if (state === "loading") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-teal-500/20 mb-4">
        <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
        <div>
          <p className="text-sm font-medium text-teal-300">Generating podcast...</p>
          <p className="text-xs text-white/30">
            AI is creating a conversation from your lesson. This may take 30-60 seconds.
          </p>
        </div>
      </div>
    );
  }

  // ─── Error state ───
  if (state === "error") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 mb-4">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-300">
            Failed to generate podcast
          </p>
          <p className="text-xs text-white/30 truncate">{errorMsg}</p>
        </div>
        <button
          onClick={() => {
            setState("idle");
            blobUrlRef.current = null;
            audioRef.current = null;
          }}
          className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1"
        >
          Try again
        </button>
      </div>
    );
  }

  // ─── Player (ready / playing / paused) ───
  return (
    <div className="rounded-xl bg-white/[0.04] border border-teal-500/20 p-4 mb-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Headphones className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">Lesson Podcast</p>
            <p className="text-[10px] text-white/30">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Waveform visualization */}
      <WaveformBars playing={state === "playing"} />

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-shadow shrink-0"
        >
          {state === "playing" ? (
            <Pause className="w-4.5 h-4.5 text-white" fill="white" />
          ) : (
            <Play className="w-4.5 h-4.5 text-white ml-0.5" fill="white" />
          )}
        </button>

        {/* Progress bar */}
        <div className="flex-1 min-w-0 space-y-1">
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="h-1.5 bg-white/[0.08] rounded-full cursor-pointer group relative"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-[width] duration-100"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Scrubber dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between text-[10px] text-white/30 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Inject keyframe animations for each bar */}
      <style jsx global>{`
        ${BAR_HEIGHTS.map(
          (maxH, i) => `
          @keyframes podcastWave${i} {
            0% { height: 4px; }
            100% { height: ${maxH}px; }
          }`
        ).join("")}
      `}</style>
    </div>
  );
}
