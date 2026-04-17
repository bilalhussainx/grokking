"use client";

import { useState, useEffect } from "react";
import { X, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], desc: "Search courses & lessons" },
  { keys: ["N"], desc: "Next lesson" },
  { keys: ["P"], desc: "Previous lesson" },
  { keys: ["H"], desc: "Toggle Coach Kairos hints" },
  { keys: ["?"], desc: "Show this help" },
  { keys: ["Esc"], desc: "Close dialogs" },
];

export default function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }
    window.addEventListener("show-shortcuts-help", handleOpen);
    return () => window.removeEventListener("show-shortcuts-help", handleOpen);
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={() => setIsOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Keyboard className="w-4 h-4 text-blue-400" />
            Keyboard Shortcuts
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div
              key={s.desc}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-slate-400">{s.desc}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-slate-300 min-w-[28px] text-center"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-600 mt-5 text-center">
          Shortcuts are disabled when typing in inputs or code editor
        </p>
      </div>
    </div>
  );
}
