"use client";

import * as React from "react";

export interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, hint, error, id, className, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const descriptionIds = [describedBy, hint ? hintId : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="db-field">
        <label className="db-label" htmlFor={inputId}>{label}</label>
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={["db-input", className].filter(Boolean).join(" ")}
          aria-describedby={descriptionIds || undefined}
          aria-invalid={error ? true : ariaInvalid}
        />
        {hint && <div className="db-hint" id={hintId}>{hint}</div>}
        {error && <div className="db-error" id={errorId}>{error}</div>}
      </div>
    );
  },
);
Field.displayName = "Field";
