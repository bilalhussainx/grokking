"use client";

import * as React from "react";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  items: TabItem[];
  label?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ items, label = "Tabs", defaultValue, value, onValueChange, className, ...props }: TabsProps) {
  const generatedId = React.useId();
  const firstEnabled = items.find((item) => !item.disabled)?.id;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? firstEnabled);
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const selected = items.find((item) => item.id === selectedValue && !item.disabled) ?? items.find((item) => !item.disabled);
  const activeValue = selected?.id;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const activate = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const available = items.filter((item) => !item.disabled);
    if (!available.length) return;
    const currentValue = (event.target as HTMLElement).getAttribute("data-tab-value");
    const currentIndex = available.findIndex((item) => item.id === currentValue);
    if (currentIndex < 0) return;

    const dirElement = rootRef.current?.closest<HTMLElement>("[dir]");
    const direction = dirElement?.dir || document.documentElement.dir || "ltr";
    let nextIndex: number | undefined;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = available.length - 1;
    else if (event.key === "ArrowRight") nextIndex = (currentIndex + (direction === "rtl" ? -1 : 1) + available.length) % available.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex + (direction === "rtl" ? 1 : -1) + available.length) % available.length;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextItem = available[nextIndex];
    activate(nextItem.id);
    Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-tab-value]") ?? [])
      .find((tab) => tab.dataset.tabValue === nextItem.id)?.focus();
  };

  return (
    <div {...props} ref={rootRef} className={["db-tabs", className].filter(Boolean).join(" ")}>
      <div className="db-tablist" role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const tabId = `${generatedId}-tab-${item.id}`;
          const panelId = `${generatedId}-panel-${item.id}`;
          return (
            <button
              key={item.id}
              type="button"
              className="db-tab"
              id={tabId}
              role="tab"
              data-tab-value={item.id}
              aria-selected={activeValue === item.id}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              tabIndex={activeValue === item.id ? 0 : -1}
              onClick={() => activate(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="db-tabpanel"
          id={`${generatedId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${generatedId}-tab-${item.id}`}
          tabIndex={0}
          hidden={item.id !== selected?.id}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
