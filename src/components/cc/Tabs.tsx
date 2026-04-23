"use client";

export type TabOption<T extends string> = {
  value: T;
  label: string;
};

export function Tabs<T extends string>({
  options,
  active,
  onChange,
  className = "",
  ariaLabel,
}: {
  options: TabOption<T>[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={`kl-tabs ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`kl-tab${isActive ? " is-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
