"use client";

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

export function ChipBar<T extends string>({
  options,
  active,
  onChange,
  className = "",
  ariaLabel,
}: {
  options: ChipOption<T>[];
  active: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`kl-chip${isActive ? " is-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span className="opacity-70">· {opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
