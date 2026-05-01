"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export function FinalCTA({
  headline,
  body,
  primaryHref = "/intake",
  primaryLabel = "Start for free",
  secondaryHref = "/auth/login",
  secondaryLabel = "Sign in",
}: {
  headline: string; // may include <em>
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="kl-mkt-final-cta">
      <h2 dangerouslySetInnerHTML={{ __html: headline }} />
      <p>{body}</p>
      <div className="row">
        <Link href={primaryHref} className="kl-mkt-cta-gold">
          {primaryLabel} <ArrowRight size={14} />
        </Link>
        <Link href={secondaryHref} className="kl-mkt-cta-ghost">
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}

export function FeatureGrid({
  features,
}: {
  features: { icon: LucideIcon; title: string; body: string }[];
}) {
  return (
    <div className="kl-mkt-feature-grid">
      {features.map((f) => {
        const Ic = f.icon;
        return (
          <div key={f.title} className="kl-mkt-feature">
            <div className="ic" aria-hidden>
              <Ic size={18} strokeWidth={1.6} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        );
      })}
    </div>
  );
}
