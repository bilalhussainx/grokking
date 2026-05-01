"use client";

import "./dashboard.css";

import Link from "next/link";
import { ArrowRight, Flame, MapPin, GraduationCap } from "lucide-react";
import type { DashboardData, Variant, VariantKey } from "./variants";

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
            <Link href={variant.hero.ctaHref} className="btn-gold">
              {variant.hero.ctaLabel} <ArrowRight size={14} />
            </Link>
            <Link href="/?coach=open" className="btn-ghost">
              Talk to Coach Kairos
            </Link>
          </div>
        </section>

        {/* Priority modules */}
        <section className="priority" aria-label="Priority modules">
          {variant.priority.map((p) => {
            const Ic = p.icon;
            return (
              <Link
                key={`${p.label}-${p.href}`}
                href={p.href}
                className={"priority-card" + (p.urgent ? " urgent" : "")}
              >
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
                const Ic = t.icon;
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
