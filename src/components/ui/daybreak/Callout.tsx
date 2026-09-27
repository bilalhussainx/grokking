import * as React from "react";

export type CalloutTone = "info" | "error";

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CalloutTone;
  children: React.ReactNode;
}

export function Callout({ tone = "info", className, children, ...props }: CalloutProps) {
  return (
    <div
      {...props}
      className={["db-callout", `db-callout--${tone}`, className].filter(Boolean).join(" ")}
      role={tone === "error" ? "alert" : props.role}
    >
      {children}
    </div>
  );
}
