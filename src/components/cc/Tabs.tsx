"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";

export type TabOption<T extends string> = {
  value: T;
  label: ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
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
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={opt.disabled}
            className={`kl-tab${isActive ? " is-active" : ""} inline-flex items-center gap-1.5`}
            style={opt.disabled ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
            onClick={() => !opt.disabled && onChange(opt.value)}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
