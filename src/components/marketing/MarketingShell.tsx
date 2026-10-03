"use client";

import "./marketing.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import DaybreakFooter from "@/components/marketing/daybreak/DaybreakFooter";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Counselor", href: "/product/counselor" },
  { label: "Essays", href: "/product/essays" },
  { label: "Schools", href: "/product/schools" },
  { label: "Pricing", href: "/pricing" },
];

export default function MarketingShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState({ pathname, open: false });
  const open = menu.pathname === pathname && menu.open;

  // Reset during render so navigation closes the menu before it is painted.
  if (menu.pathname !== pathname) {
    setMenu({ pathname, open: false });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="kl-mkt">
      {/* Sticky top nav */}
      <header className={"kl-mkt-nav" + (scrolled ? " is-scrolled" : "")}>
        <div className="kl-mkt-nav-inner">
          <Link href="/" className="kl-mkt-brand">
            <div className="kl-mkt-seal" aria-hidden>
              k
            </div>
            <span>
              <em>Kairos</em>Learn
            </span>
          </Link>

          <nav className="kl-mkt-links" aria-label="Marketing">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={"kl-mkt-link" + (pathname === l.href ? " is-active" : "")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="kl-mkt-cta">
            <Link href="/login" className="kl-mkt-cta-ghost">
              Sign in
            </Link>
            <Link href="/intake" className="kl-mkt-cta-gold">
              Start for free <ArrowRight size={14} />
            </Link>
          </div>

          <button
            type="button"
            className="kl-mkt-burger"
            onClick={() => setMenu({ pathname, open: !open })}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="kl-mkt-mobile">
            <nav>
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={"kl-mkt-link" + (pathname === l.href ? " is-active" : "")}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="kl-mkt-mobile-cta">
              <Link href="/login" className="kl-mkt-cta-ghost">
                Sign in
              </Link>
              <Link href="/intake" className="kl-mkt-cta-gold">
                Start for free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="kl-mkt-main">{children}</main>

      <DaybreakFooter />
    </div>
  );
}
