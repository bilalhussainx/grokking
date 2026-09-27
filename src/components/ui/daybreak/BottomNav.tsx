import * as React from "react";

export interface BottomNavItem {
  href: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  items: BottomNavItem[];
  currentHref: string;
  label?: string;
}

export function BottomNav({ items, currentHref, label = "Main navigation", className, ...props }: BottomNavProps) {
  return (
    <nav {...props} aria-label={label} className={["db-bottom-nav", className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <a
          key={item.href}
          className="db-bottom-nav-link"
          href={item.href}
          aria-current={item.href === currentHref ? "page" : undefined}
        >
          {item.icon && <span aria-hidden="true">{item.icon}</span>}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
