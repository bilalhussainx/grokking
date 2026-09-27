"use client";

import * as React from "react";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, id, className, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;
    const descriptionIds = [describedBy, hint ? hintId : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="db-field">
        <label className="db-label" htmlFor={selectId}>{label}</label>
        <select
          {...props}
          ref={ref}
          id={selectId}
          className={["db-select", className].filter(Boolean).join(" ")}
          aria-describedby={descriptionIds || undefined}
          aria-invalid={error ? true : ariaInvalid}
        >
          {children}
        </select>
        {hint && <div className="db-hint" id={hintId}>{hint}</div>}
        {error && <div className="db-error" id={errorId}>{error}</div>}
      </div>
    );
  },
);
Select.displayName = "Select";
