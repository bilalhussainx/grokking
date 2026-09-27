import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", type = "button", className, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type={type}
      className={["db-button", `db-button--${variant}`, className].filter(Boolean).join(" ")}
    />
  ),
);
Button.displayName = "Button";
