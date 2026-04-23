"use client";

export function Toggle({
  checked,
  onChange,
  label,
  className = "",
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const aria = ariaLabel ?? label;
  return (
    <label className={`inline-flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={aria}
        onClick={() => onChange(!checked)}
        className={`kl-toggle${checked ? " is-on" : ""}`}
      >
        <span className="kl-toggle-thumb" aria-hidden />
      </button>
      {label && (
        <span
          className="text-[13px]"
          style={{ color: checked ? "#fff" : "rgba(255,255,255,0.70)" }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
