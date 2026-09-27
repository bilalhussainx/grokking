import * as React from "react";

export type StatusChipTone = "neutral" | "success" | "warning";

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusChipTone;
  children: React.ReactNode;
}

const marks: Record<StatusChipTone, string> = { neutral: "•", success: "✓", warning: "!" };

export function StatusChip({ tone = "neutral", className, children, ...props }: StatusChipProps) {
  return (
    <span {...props} className={["db-chip", `db-chip--${tone}`, className].filter(Boolean).join(" ")}>
      <span aria-hidden="true">{marks[tone]}</span>
      {children}
    </span>
  );
}
