"use client";

import Link from "next/link";
import {
  ArrowRight,
  Activity,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Layers,
  ListChecks,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  PenLine,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────
// Icon registry — server pages pass icon NAMES (strings) instead of
// component references because Next.js can't serialize a React component
// across the server -> client boundary. The client component looks up
// the actual lucide icon here.
// ─────────────────────────────────────────────────────────────────────
const ICONS = {
  activity: Activity,
  book: BookOpen,
  calendar: Calendar,
  check: CheckCircle2,
  clock: Clock,
  compass: Compass,
  dollar: DollarSign,
  fileText: FileText,
  globe: Globe,
  grad: GraduationCap,
  languages: Languages,
  layers: Layers,
  listChecks: ListChecks,
  mail: Mail,
  mapPin: MapPin,
  message: MessageSquare,
  mic: Mic,
  penLine: PenLine,
  shield: ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  target: Target,
  trend: TrendingUp,
} as const;

export type IconName = keyof typeof ICONS;

export function FinalCTA({
  headline,
  body,
  primaryHref = "/intake",
  primaryLabel = "Start for free",
  secondaryHref = "/login",
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
  features: { icon: IconName; title: string; body: string }[];
}) {
  return (
    <div className="kl-mkt-feature-grid">
      {features.map((f) => {
        const Ic = ICONS[f.icon] ?? Sparkles;
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
