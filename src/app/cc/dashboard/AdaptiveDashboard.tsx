"use client";

import "./dashboard.css";

import Link from "next/link";
import { useCallback, useEffect, type MouseEvent } from "react";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  BookOpen,
  Calendar,
  ChartNoAxesColumn,
  Compass,
  DollarSign,
  FileText,
  Flame,
  GraduationCap,
  Hourglass,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  Sun,
} from "lucide-react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import type { DashboardData, IconName, Variant, VariantKey } from "./variants";

// Any href that starts with "/" or "?" pointing at the legacy "open coach via
// URL" mechanism. We intercept clicks on these and call openWithVariant
// in-place — that way the user stays on /cc/dashboard with their grade-correct
// variant rendered, instead of bouncing through `/` → onboarding logic →
// landing back on the senior dashboard.
function isCoachOpenHref(href: string): boolean {
  return href.includes("coach=open");
}

// Variants ship icon names as strings (Server→Client serialization can't carry
// React component references). Resolve them to the actual lucide components here.
const ICONS: Record<IconName, typeof Sparkles> = {
  activity: Activity,
  arrowLeftRight: ArrowLeftRight,
  book: BookOpen,
  calendar: Calendar,
  chart: ChartNoAxesColumn,
  compass: Compass,
  dollar: DollarSign,
  fileText: FileText,
  grad: GraduationCap,
  hourglass: Hourglass,
  mail: Mail,
  mapPin: MapPin,
  message: MessageSquare,
  sparkles: Sparkles,
  sun: Sun,
};

const VARIANT_LABEL: Record<VariantKey, string> = {
  g9: "Grade 9 · building foundation",
  g10: "Grade 10 · adding depth",
  junior: "Junior · runway to senior year",
  senior_writing: "Senior · writing phase",
  senior_post_submit: "Senior · submitted, waiting",
  senior_decisions: "Senior · decisions in",
  transfer: "Transfer applicant",
  unknown: "Welcome",
};

function timeAwareGreeting(name: string | null): string {
  const h = new Date().getHours();
  const greet = h < 5 ? "Hey" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${greet}, ${name}` : greet;
}

export default function AdaptiveDashboard({
  data,
  variant,
  variantKey,
}: {
  data: DashboardData;
  variant: Variant;
  variantKey: VariantKey;
}) {
  const coach = useCoachKairos();
  // Register the variant with the coach context on mount + clear on unmount.
  // This ensures every coach turn (including auto-greets that don't go
  // through openWithVariant) gets the right per-grade guidance block in
  // the system prompt.
  useEffect(() => {
    coach.setVariantKey(variantKey);
    return () => coach.setVariantKey(null);
  }, [coach, variantKey]);
  const handleCoachClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e.preventDefault();
      coach.openWithVariant(variantKey);
    },
    [coach, variantKey],
  );
  return (
    <div className="kl-dash">
      <div className="container">
        {/* Header */}
        <div className="top-line" aria-label="Status">
          <span className="dot" />
          <span>{VARIANT_LABEL[variantKey]}</span>
          {variantKey === "junior" && data.daysToCommonApp > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{data.daysToCommonApp} days until Common App opens</span>
            </>
          )}
        </div>
        <h1 className="greet">
          {timeAwareGreeting(data.preferredName)}
          {data.preferredName ? "" : "."}
        </h1>
        <p className="status-line">
          {variantKey === "transfer" && data.transferCurrentSchool
            ? `Currently at ${data.transferCurrentSchool}${data.transferTargetTerm ? ` · target ${data.transferTargetTerm}` : ""}.`
            : data.urgentDeadlineCount > 0
              ? `${data.urgentDeadlineCount} deadline${data.urgentDeadlineCount === 1 ? "" : "s"} within 14 days.`
              : "Your dashboard is calibrated to where you are right now."}
        </p>

        {/* Hero card */}
        <section
          className={"hero" + (variant.hero.urgent ? " urgent" : "")}
          aria-labelledby="hero-headline"
        >
          <div className="eyebrow">
            <span className="rule" /> {variant.hero.eyebrow}
          </div>
          <h2
            id="hero-headline"
            // headline contains <em> so we render it as HTML; the source is hard-coded
            // in variants.ts (no user input).
            dangerouslySetInnerHTML={{ __html: variant.hero.headline }}
          />
          <p>{variant.hero.body}</p>
          <div className="cta-row">
            {isCoachOpenHref(variant.hero.ctaHref) ? (
              <button type="button" onClick={handleCoachClick} className="btn-gold">
                {variant.hero.ctaLabel} <ArrowRight size={14} />
              </button>
            ) : (
              <Link href={variant.hero.ctaHref} className="btn-gold">
                {variant.hero.ctaLabel} <ArrowRight size={14} />
              </Link>
            )}
            <button type="button" onClick={handleCoachClick} className="btn-ghost">
              Talk to Coach Kairos
            </button>
          </div>
        </section>

        {/* Priority modules */}
        <section className="priority" aria-label="Priority modules">
          {variant.priority.map((p) => {
            const Ic = ICONS[p.icon] ?? Sparkles;
            const isCoach = isCoachOpenHref(p.href);
            const inner = (
              <>
                <div className="ic" aria-hidden>
                  <Ic size={16} />
                </div>
                <div className="label">{p.label}</div>
                <div className="value">
                  {p.valueKind === "num" ? (
                    <>
                      <span className="num">{p.valueNum}</span>
                      {p.valueSuffix && (
                        <span style={{ fontSize: 14, color: "rgba(242,237,227,.55)", marginLeft: 6 }}>
                          {p.valueSuffix}
                        </span>
                      )}
                    </>
                  ) : (
                    p.valueText
                  )}
                </div>
                <div className="meta">{p.meta}</div>
              </>
            );
            const className = "priority-card" + (p.urgent ? " urgent" : "");
            if (isCoach) {
              return (
                <button
                  key={`${p.label}-${p.href}`}
                  type="button"
                  onClick={handleCoachClick}
                  className={className}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link key={`${p.label}-${p.href}`} href={p.href} className={className}>
                {inner}
              </Link>
            );
          })}
        </section>

        {/* Tile grid */}
        {variant.tiles.length > 0 && (
          <>
            <div className="tile-row-label">Everything else</div>
            <section className="tiles" aria-label="Feature tiles">
              {variant.tiles.map((t) => {
                const Ic = ICONS[t.icon] ?? Sparkles;
                if (t.locked) {
                  return (
                    <div key={`${t.label}-${t.href}`} className="tile locked" aria-disabled>
                      <div className="tic" aria-hidden>
                        <Ic size={16} />
                      </div>
                      <div className="tlabel">{t.label}</div>
                      {t.cap && <div className="tcap">{t.cap}</div>}
                    </div>
                  );
                }
                if (isCoachOpenHref(t.href)) {
                  return (
                    <button
                      key={`${t.label}-${t.href}`}
                      type="button"
                      onClick={handleCoachClick}
                      className="tile"
                    >
                      <div className="tic" aria-hidden>
                        <Ic size={16} />
                      </div>
                      <div className="tlabel">{t.label}</div>
                      {t.cap && <div className="tcap">{t.cap}</div>}
                    </button>
                  );
                }
                return (
                  <Link key={`${t.label}-${t.href}`} href={t.href} className="tile">
                    <div className="tic" aria-hidden>
                      <Ic size={16} />
                    </div>
                    <div className="tlabel">{t.label}</div>
                    {t.cap && <div className="tcap">{t.cap}</div>}
                  </Link>
                );
              })}
            </section>
          </>
        )}

        {/* Widget strip */}
        <section className="widgets" aria-label="At a glance">
          <div className="widget">
            <span className="num gold">{data.schoolCount}</span>
            <span className="lbl">Schools on list</span>
          </div>
          <div className="widget">
            <span className="num">{data.activitiesCount}</span>
            <span className="lbl">Activities</span>
          </div>
          <div className="widget">
            <span className="num">{data.essaysSubmittedCount}</span>
            <span className="lbl">Essays submitted</span>
          </div>
          {data.nextDeadline && (
            <div className="widget" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
              {data.nextDeadline.days < 14 ? (
                <Flame size={16} style={{ color: "#fda4af" }} />
              ) : (
                <MapPin size={16} style={{ color: "rgba(242,237,227,.45)" }} />
              )}
              <div>
                <div className="num" style={{ fontSize: 16 }}>
                  {data.nextDeadline.days}d
                </div>
                <span className="lbl">{data.nextDeadline.schoolName} · {data.nextDeadline.key}</span>
              </div>
            </div>
          )}
          {variantKey === "junior" && data.daysToCommonApp > 0 && (
            <div className="widget" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
              <GraduationCap size={16} style={{ color: "#d4a84b" }} />
              <div>
                <div className="num" style={{ fontSize: 16 }}>
                  {data.daysToCommonApp}d
                </div>
                <span className="lbl">Until Common App opens</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
