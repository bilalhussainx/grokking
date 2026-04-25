"use client";

import { Mic, Loader2 } from "lucide-react";

export default function FamilyModeMicButton({
  state,
  onTap,
}: {
  state: "idle" | "listening" | "thinking";
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={state === "thinking"}
      className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition shadow-2xl ${
        state === "listening"
          ? "bg-rose-500 animate-pulse"
          : state === "thinking"
            ? "bg-white/10"
            : "bg-[#D4AF37] hover:bg-[#C4A030]"
      }`}
      aria-label={
        state === "listening" ? "Listening" : state === "thinking" ? "Thinking" : "Tap to speak"
      }
    >
      {state === "thinking" ? (
        <Loader2 className="w-9 h-9 text-white/80 animate-spin" />
      ) : (
        <Mic className="w-9 h-9 text-black" />
      )}
    </button>
  );
}
