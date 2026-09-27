import * as React from "react";

export type CardTone = "plain" | "warm" | "sage";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ tone = "plain", className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={["db-card", tone === "plain" ? undefined : `db-card--${tone}`, className]
        .filter(Boolean)
        .join(" ")}
    />
  ),
);
Card.displayName = "Card";
