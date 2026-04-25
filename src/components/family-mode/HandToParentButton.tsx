"use client";

import { Users } from "lucide-react";

export default function HandToParentButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Voice not supported for the current language" : "Hand to parent"}
      className="p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      aria-label="Hand to parent"
    >
      <Users className="w-4 h-4" />
    </button>
  );
}
