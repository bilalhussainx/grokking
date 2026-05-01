"use client";

import "./marketing.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Counselor", href: "/product/counselor" },
  { label: "Essays", href: "/product/essays" },
  { label: "Schools", href: "/product/schools" },
  { label: "Pricing", href: "/pricing" },
  { label: "Stories", href: "/stories" },
];

export default function MarketingShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => setOpen(false), [pathname]);

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
            <Link href="/auth/login" className="kl-mkt-cta-ghost">
              Sign in
            </Link>
            <Link href="/intake" className="kl-mkt-cta-gold">
              Start for free <ArrowRight size={14} />
            </Link>
          </div>

          <button
            type="button"
            className="kl-mkt-burger"
            onClick={() => setOpen((v) => !v)}
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
              <Link href="/auth/login" className="kl-mkt-cta-ghost">
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

      {/* Footer */}
      <footer className="kl-mkt-foot">
        <div className="kl-mkt-foot-inner">
          <div className="kl-mkt-foot-brand">
            <div className="kl-mkt-seal" aria-hidden>
              k
            </div>
            <span>
              <em>Kairos</em>Learn
            </span>
          </div>
          <nav className="kl-mkt-foot-links" aria-label="Footer">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="kl-mkt-foot-cta">
            <Link href="/auth/login">Sign in</Link>
            <Link href="/intake" className="kl-mkt-cta-gold">
              Start for free <ArrowRight size={14} />
            </Link>
          </div>
          <div className="kl-mkt-foot-fine">
            © {new Date().getFullYear()} KairosLearn. <Link href="/privacy">Privacy</Link> ·{" "}
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
