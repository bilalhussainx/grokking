"use client";

// Adaptive home dashboard. One layout. Six variants. Same chrome, swapped
// content. Ports the visual treatment from
// docs/superpowers/designs/handoff/src/dashboard.jsx while feeding live
// data via the existing variants.ts (Variant + DashboardData) shape.
//
// Wiring kept from the previous implementation:
//   - useCoachKairos().setVariantKey(variantKey) on mount, cleared on unmount
//   - Hero "Talk to Coach Kairos" button + tile/priority coach links open
//     the drawer in-place via openWithVariant
//   - ?blocked=grade9 query param renders a dismissible banner
//
// What's new (Phase 2):
//   - Tokenized layout matching handoff: greeting block, gold-edged hero,
//     "Priority this week" / "Explore" section heads, mono-numeral widget
//     strip, gold-on-hover priority modules + tiles
//   - Hero's rose tone fires when variants.ts marks ctaTone='rose' (urgent
//     deadline override)

import "./dashboard.css"; // keep — has the existing keyframes
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import Greeting from "@/components/cc/dashboard/Greeting";
import HeroCard from "@/components/cc/dashboard/HeroCard";
import PriorityModule from "@/components/cc/dashboard/PriorityModule";
import Tile from "@/components/cc/dashboard/Tile";
import WidgetStrip from "@/components/cc/dashboard/WidgetStrip";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import type { DashboardData, Variant, VariantKey } from "./variants";

const VARIANT_LABEL: Record<VariantKey, string> = {
  g9: "Grade 9 · Building foundation",
  g10: "Grade 10 · Adding depth",
  junior: "Junior · runway to senior year",
  senior_writing: "Senior · writing phase",
  senior_post_submit: "Senior · submitted, waiting",
  senior_decisions: "Senior · decisions in",
  transfer: "Transfer applicant",
  unknown: "Welcome",
};

// True when an href points at the legacy "open coach via URL" mechanism.
// We intercept those clicks so the user stays on /cc/dashboard with their
// grade-correct variant rendered, instead of bouncing through `/`.
function isCoachOpenHref(href: string): boolean {
  return href.includes("coach=open");
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

  // Mirror the active variant into the coach context so subsequent turns
  // include the variant guidance block.
  useEffect(() => {
    coach.setVariantKey(variantKey);
    return () => coach.setVariantKey(null);
  }, [coach, variantKey]);

  // ?blocked=grade9 banner — shown when the middleware redirected a g9
  // student off a senior-only route.
  const [showG9Block, setShowG9Block] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("blocked") === "grade9") {
      setShowG9Block(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("blocked");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }
  }, []);

  const handleCoachClick = useCallback(
    (e?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e?.preventDefault();
      coach.openWithVariant(variantKey);
    },
    [coach, variantKey],
  );

  // Hero CTA: if the variant's ctaHref is a coach-open URL, intercept;
  // otherwise let HeroCard render a plain Link.
  const heroPrimaryClick = isCoachOpenHref(variant.hero.ctaHref)
    ? () => handleCoachClick()
    : undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(900px 600px at 50% -10%, rgba(212,175,55,.04), transparent 60%), #05080d",
        color: "#f2ede3",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {showG9Block && (
          <div
            role="status"
            className="flex items-center"
            style={{
              margin: "16px 32px 0",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(212, 175, 55, 0.40)",
              background: "rgba(212, 175, 55, 0.06)",
              color: "#f2ede3",
              fontSize: 13,
              gap: 12,
            }}
          >
            <span>That tool unlocks junior year — let&apos;s keep building your foundation here.</span>
            <button
              type="button"
              onClick={() => setShowG9Block(false)}
              aria-label="Dismiss"
              className="ml-auto cursor-pointer"
              style={{
                background: "transparent", border: "none",
                color: "rgba(242, 237, 227, 0.55)",
                fontSize: 16, lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}

        <Greeting
          preferredName={data.preferredName}
          statusLabel={VARIANT_LABEL[variantKey]}
          statusTone={variant.statusTone ?? "gold"}
        />

        <div className="flex flex-col" style={{ padding: "24px 32px 32px", gap: 0 }}>
          <HeroCard
            hero={variant.hero}
            onPrimaryClick={heroPrimaryClick}
            onCoachClick={() => handleCoachClick()}
          />

          {variant.priority.length > 0 && (
            <>
              <SectionHead
                right={
                  <Link
                    href="/cc/dashboard"
                    style={{
                      fontSize: 11.5,
                      color: "#d4a84b",
                      textDecoration: "none",
                    }}
                  >
                    See all →
                  </Link>
                }
              >
                Priority this week
              </SectionHead>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(variant.priority.length, 3)}, 1fr)`,
                  gap: 14,
                }}
              >
                {variant.priority.map((card) => {
                  const intercepted = isCoachOpenHref(card.href);
                  return (
                    <PriorityModule
                      key={`${card.label}-${card.href}`}
                      card={card}
                      onClick={intercepted ? () => handleCoachClick() : undefined}
                    />
                  );
                })}
              </div>
            </>
          )}

          {variant.tiles.length > 0 && (
            <>
              <SectionHead>Explore</SectionHead>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                {variant.tiles.map((tile) => {
                  const intercepted = isCoachOpenHref(tile.href);
                  return (
                    <Tile
                      key={`${tile.label}-${tile.href}`}
                      tile={tile}
                      onClick={intercepted ? () => handleCoachClick() : undefined}
                    />
                  );
                })}
              </div>
            </>
          )}

          {variant.widgets && variant.widgets.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <WidgetStrip items={variant.widgets} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHead({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ marginBottom: 12, marginTop: 24 }}
    >
      <div
        className="uppercase"
        style={{
          fontSize: 10.5,
          color: "rgba(255,255,255,.55)",
          letterSpacing: ".28em",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
        }}
      >
        {children}
      </div>
      {right}
    </div>
  );
}
