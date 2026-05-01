"use client";

/**
 * 1:1 React port of docs/superpowers/designs/kairoslearn-design-system/project/landing/landing.jsx.
 * The design bundle is the source of truth for visual specs. This component renders the
 * entire single-page cinematic landing (Nav → Hero → ForgottenStudent → Pipeline →
 * Testimonials → Pricing → FinalCTA → Footer) at a 1280px design width.
 *
 * Mobile responsiveness is layered in via cinematic-landing-mobile.css — the
 * component still emits its desktop-first inline styles, and the stylesheet
 * overrides specific patterns at <=960 / <=760 / <=480 breakpoints. The hook
 * is the data-landing="cinematic" attribute on the outer wrapper.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";

import "./cinematic-landing-mobile.css";

// ───────── Grain overlay ─────────
function Grain({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: "-50%",
        width: "200%",
        height: "200%",
        opacity,
        zIndex: 1000,
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="kg2">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#kg2)" />
    </svg>
  );
}

// ───────── Neural canvas (hero background) ─────────
function NeuralBg() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = c.offsetWidth * 2;
    c.height = c.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = c.offsetWidth;
    const h = c.offsetHeight;
    const N = 80;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.2 + 0.6,
    }));
    let raf = 0;
    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.strokeStyle = `rgba(212,168,75,${0.32 * (1 - d / 150)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(212,168,75,.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        opacity: 0.7,
      }}
    />
  );
}

// ───────── Nav ─────────
function Nav() {
  return (
    <nav
      style={{
        position: "absolute",
        top: 24,
        left: 40,
        right: 40,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: "rgba(5,8,13,0.55)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(242,237,227,.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "#d4a84b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#05080d",
            fontSize: 17,
          }}
        >
          K
        </div>
        <div
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 19,
            color: "#f2ede3",
            letterSpacing: ".03em",
          }}
        >
          <em style={{ color: "#d4a84b", fontStyle: "italic" }}>Kairos</em>Learn
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 36,
          fontSize: 11,
          letterSpacing: ".24em",
          textTransform: "uppercase",
          color: "rgba(242,237,227,.70)",
          fontWeight: 400,
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        }}
      >
        {(
          [
            ["Counselor", "#counselor"],
            ["Essays", "#pipeline"],
            ["Schools", "#pipeline"],
            ["Pricing", "#pricing"],
            ["Stories", "#stories"],
          ] as const
        ).map(([label, href]) => (
          <a
            key={label}
            href={href}
            style={{
              color: "inherit",
              textDecoration: "none",
              transition: "color .15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#d4a84b";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(242,237,227,.70)";
            }}
          >
            {label}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link
          href="/auth/login"
          style={{
            fontSize: 11,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: "rgba(242,237,227,.65)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            textDecoration: "none",
          }}
        >
          Sign in
        </Link>
        <Link
          href="/intake"
          style={{
            background: "#f2ede3",
            color: "#05080d",
            border: 0,
            padding: "11px 22px",
            fontSize: 10.5,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            textDecoration: "none",
          }}
        >
          Start for free
        </Link>
      </div>
    </nav>
  );
}

// ───────── Coach demo widget (embedded in hero) ─────────
type Msg = { who: "k" | "u"; text: string };

function CoachDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      who: "k",
      text: "Tell me the schools you're considering — I'll tell you honestly if they're reach, match, or safety for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const send = () => {
    if (!input.trim()) return;
    const user = input.trim();
    setMsgs((m) => [...m, { who: "u", text: user }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          who: "k",
          text: `"${user}" — got it. Tell me your unweighted GPA, rough SAT, and whether you need aid. I'll rank it reach/match/safety and flag anything off.`,
        },
      ]);
    }, 600);
  };
  const dmSans: CSSProperties = {
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  };
  return (
    <div
      style={{
        width: 440,
        background: "#0a0d15",
        border: "1px solid rgba(212,168,75,.24)",
        boxShadow:
          "0 40px 100px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(212,168,75,.08)",
      }}
    >
      {/* header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid rgba(242,237,227,.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "#d4a84b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 500,
            color: "#05080d",
            fontSize: 17,
            position: "relative",
          }}
        >
          K
          <span
            style={{
              position: "absolute",
              top: -1,
              right: -1,
              width: 9,
              height: 9,
              borderRadius: 999,
              background: "#34d399",
              boxShadow: "0 0 6px #34d399",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...dmSans, fontSize: 13, fontWeight: 600, color: "#f2ede3" }}>
            Coach Kairos
          </div>
          <div
            style={{
              ...dmSans,
              fontSize: 10.5,
              color: "rgba(242,237,227,.50)",
              marginTop: 1,
            }}
          >
            Free to try · no signup
          </div>
        </div>
        <div
          style={{
            fontSize: 9.5,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "#d4a84b",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#34d399" }} />
          Live
        </div>
      </div>
      {/* transcript */}
      <div
        style={{
          padding: "18px 18px 10px",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {msgs.map((m, i) =>
          m.who === "k" ? (
            <div
              key={i}
              style={{
                ...dmSans,
                background: "rgba(242,237,227,.04)",
                border: "1px solid rgba(242,237,227,.08)",
                padding: "10px 14px",
                maxWidth: 360,
                fontSize: 13,
                color: "#f2ede3",
                lineHeight: 1.55,
              }}
            >
              {m.text}
            </div>
          ) : (
            <div
              key={i}
              style={{
                ...dmSans,
                alignSelf: "flex-end",
                background: "rgba(212,168,75,.18)",
                border: "1px solid rgba(212,168,75,.30)",
                padding: "10px 14px",
                maxWidth: 300,
                fontSize: 13,
                color: "#f2ede3",
                lineHeight: 1.55,
              }}
            >
              {m.text}
            </div>
          )
        )}
        {/* suggested chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
          {["Brown, MIT, UIUC", "My list is too top-heavy", "Chance me for UPenn"].map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              style={{
                ...dmSans,
                background: "transparent",
                color: "rgba(242,237,227,.70)",
                border: "1px solid rgba(242,237,227,.18)",
                padding: "4px 10px",
                fontSize: 10.5,
                letterSpacing: ".02em",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* input */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid rgba(242,237,227,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "rgba(242,237,227,.04)",
            border: "1px solid rgba(212,168,75,.24)",
            padding: "8px 10px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a school name or question…"
            style={{
              ...dmSans,
              background: "transparent",
              border: 0,
              flex: 1,
              color: "#f2ede3",
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            onClick={send}
            style={{
              ...dmSans,
              background: "#d4a84b",
              color: "#05080d",
              border: 0,
              padding: "5px 14px",
              fontSize: 10.5,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
        <div
          style={{
            ...dmSans,
            textAlign: "center",
            fontSize: 10,
            color: "rgba(242,237,227,.35)",
            marginTop: 8,
          }}
        >
          Your answers save automatically — upgrade anytime.
        </div>
      </div>
    </div>
  );
}

// ───────── Hero ─────────
function Hero() {
  return (
    <section
      id="counselor"
      style={{
        position: "relative",
        minHeight: 860,
        background: "#05080d",
        overflow: "hidden",
      }}
    >
      <NeuralBg />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 70% 45%, rgba(212,168,75,.10), transparent 65%)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(5,8,13,.75) 80%)",
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          background: "linear-gradient(to bottom, transparent, #05080d)",
          zIndex: 4,
        }}
      />
      <Nav />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "180px 80px 90px",
          display: "grid",
          gridTemplateColumns: "1fr 480px",
          gap: 64,
          alignItems: "center",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Left copy */}
        <div>
          <div
            style={{
              color: "#d4a84b",
              letterSpacing: ".32em",
              fontSize: 10.5,
              textTransform: "uppercase",
              marginBottom: 28,
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            <span style={{ display: "inline-block", width: 26, height: 1, background: "#d4a84b" }} />
            <span>
              Your AI counselor. For{" "}
              <em
                style={{
                  fontStyle: "italic",
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: 14,
                  color: "#f2ede3",
                }}
              >
                every
              </em>{" "}
              student.
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 88,
              lineHeight: 0.98,
              letterSpacing: "-.015em",
              margin: 0,
              color: "#f2ede3",
            }}
          >
            Every student
            <br />
            deserves a counselor
            <br />
            who <em style={{ color: "#d4a84b", fontStyle: "italic" }}>actually knows</em> them.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(242,237,227,.65)",
              fontWeight: 300,
              marginTop: 36,
              maxWidth: 520,
            }}
          >
            The average U.S. public-school counselor serves{" "}
            <span
              style={{
                color: "#f2ede3",
                fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
                fontSize: 14,
              }}
            >
              415 students
            </span>
            . For first-gen, international, and underprivileged applicants, that means almost no
            time, no translation, no institutional memory.
            <br />
            <br />
            Coach Kairos is one counselor per student — in your language, trained on your profile,
            available at 3 a.m. on a Saturday.
          </p>
          <div style={{ marginTop: 42, display: "flex", gap: 14, alignItems: "center" }}>
            <Link
              href="/intake"
              style={{
                background: "#d4a84b",
                color: "#05080d",
                border: 0,
                padding: "17px 34px",
                fontSize: 11,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                textDecoration: "none",
              }}
            >
              Start for free →
            </Link>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("demo-video");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                background: "transparent",
                color: "#f2ede3",
                border: "1px solid rgba(242,237,227,.28)",
                padding: "16px 28px",
                fontSize: 11,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  border: "1px solid #d4a84b",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#d4a84b">
                  <polygon points="6 4 20 12 6 20" />
                </svg>
              </span>
              Watch 90-sec demo
            </button>
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontSize: 11,
              color: "rgba(242,237,227,.50)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#34d399" }} />
              No credit card
            </span>
            <span>·</span>
            <span>40+ languages</span>
            <span>·</span>
            <span>Used by students across the 2025–26 cycle</span>
          </div>
        </div>
        {/* Right Coach demo */}
        <div>
          <CoachDemo />
        </div>
      </div>
      <Grain opacity={0.08} />
    </section>
  );
}

// ───────── ForgottenStudent ─────────
function ForgottenStudent() {
  const rows = [
    {
      tag: "International",
      title: "Pakistani GPA, translated.",
      copy:
        "Upload a Matric / FSc transcript and Coach Kairos converts your marks to a 4.0 unweighted + 100-point weighted scale the way U.S. admissions officers actually read them.",
      chip: "85.2% FSc → 3.76 UW",
      glyph: "◎",
    },
    {
      tag: "First-gen",
      title: "Hindi, Punjabi, <em>Español</em>.",
      copy:
        "Voice coaching and essay feedback in the language you think in. Switch mid-sentence — your coach follows. 40+ languages, native-level.",
      chip: "हिंदी · ਪੰਜਾਬੀ · Español",
      glyph: "⟡",
    },
    {
      tag: "Under-resourced",
      title: "$0 aid is a real option.",
      copy:
        "Need-aware filters on every school. Net-price calculators baked into chancing. Coach Kairos flags schools that meet 100% of demonstrated need — before you fall in love with a list you can't afford.",
      chip: "Net price · $0 — $4,200",
      glyph: "◈",
    },
  ];
  return (
    <section
      style={{
        background: "#05080d",
        padding: "130px 80px 120px",
        position: "relative",
        borderTop: "1px solid rgba(242,237,227,.06)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 60,
          }}
        >
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
              <span
                style={{
                  color: "#d4a84b",
                  letterSpacing: ".32em",
                  fontSize: 10.5,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                Who it&apos;s for
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 56,
                lineHeight: 1.05,
                color: "#f2ede3",
                margin: 0,
                letterSpacing: "-.01em",
              }}
            >
              Built for the student
              <br />
              <em style={{ color: "#d4a84b", fontStyle: "italic" }}>everyone forgot.</em>
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(242,237,227,.40)",
              letterSpacing: ".10em",
            }}
          >
            03 — three audiences
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {rows.map((r, i) => (
            <div
              key={r.tag}
              style={{
                padding: "38px 34px 40px",
                border: "1px solid rgba(242,237,227,.10)",
                background: i === 0 ? "rgba(212,168,75,.06)" : "transparent",
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    border: "1px solid rgba(212,168,75,.40)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#d4a84b",
                    fontSize: 17,
                  }}
                >
                  {r.glyph}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    color: "rgba(242,237,227,.45)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                >
                  {r.tag}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 30,
                  lineHeight: 1.15,
                  color: "#f2ede3",
                  margin: 0,
                  marginBottom: 18,
                }}
                dangerouslySetInnerHTML={{ __html: r.title }}
              />
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.85,
                  color: "rgba(242,237,227,.60)",
                  fontWeight: 300,
                  margin: 0,
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                {r.copy}
              </p>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 26,
                  fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#d4a84b",
                  letterSpacing: ".04em",
                }}
              >
                → {r.chip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────── Demo video ─────────
function DemoVideo() {
  return (
    <section
      id="demo-video"
      style={{
        background: "#05080d",
        padding: "110px 80px 130px",
        position: "relative",
        borderTop: "1px solid rgba(242,237,227,.06)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 22,
            }}
          >
            <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
            <span
              style={{
                color: "#d4a84b",
                letterSpacing: ".32em",
                fontSize: 10.5,
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              Ninety seconds
            </span>
            <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 56,
              lineHeight: 1.05,
              color: "#f2ede3",
              margin: 0,
              letterSpacing: "-.01em",
              maxWidth: 820,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Intake, school list, essays, interview — <em style={{ color: "#d4a84b", fontStyle: "italic" }}>in one walk.</em>
          </h2>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%" /* 16:9 */,
            background: "#0a0d15",
            border: "1px solid rgba(212,168,75,0.30)",
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,75,0.08)",
            overflow: "hidden",
          }}
        >
          <iframe
            src="/media/kairos-final-demo.html"
            title="KairosLearn 90-second demo"
            loading="lazy"
            allow="autoplay; fullscreen"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              background: "#05080d",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginTop: 32,
            fontSize: 11.5,
            color: "rgba(242,237,227,.45)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            letterSpacing: ".04em",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "#34d399" }} />
            Live walk-through
          </span>
          <span>·</span>
          <span>90 seconds</span>
          <span>·</span>
          <span>Captured from the product</span>
        </div>
      </div>
    </section>
  );
}

// ───────── Pipeline ─────────
function Pipeline() {
  const steps = [
    { n: "01", t: "Intake", sub: "5-minute profile", copy: "Grades, context, goals, need. Coach Kairos builds your profile once — every tool uses it forever." },
    { n: "02", t: "School List", sub: "Reach · Match · Safety", copy: "Chance any school in seconds. Balanced by the numbers, not the marketing." },
    { n: "03", t: "Essays", sub: "Personal + supplements", copy: "Brainstorm → outline → draft → revise. Real feedback at the paragraph level." },
    { n: "04", t: "Interview", sub: "10 alumni AI personas", copy: "Harvard, Yale, Stanford, MIT, and more. In your language. Real-time pronunciation." },
    { n: "05", t: "Financial Aid", sub: "$0 is the goal", copy: "Net price calculators, CSS Profile prep, scholarship matching. We fight for the number." },
  ];
  return (
    <section id="pipeline" style={{ background: "#05080d", padding: "0 80px 130px", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 60, maxWidth: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
            <span
              style={{
                color: "#d4a84b",
                letterSpacing: ".32em",
                fontSize: 10.5,
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              The full pipeline
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 56,
              lineHeight: 1.05,
              color: "#f2ede3",
              margin: 0,
              letterSpacing: "-.01em",
            }}
          >
            One coach, from hello to <em style={{ color: "#d4a84b", fontStyle: "italic" }}>yes.</em>
          </h2>
        </div>
        <div style={{ position: "relative" }}>
          {/* connecting line */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: "8%",
              right: "8%",
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(212,168,75,.4) 10%, rgba(212,168,75,.4) 90%, transparent)",
              zIndex: 0,
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 28,
              position: "relative",
              zIndex: 1,
            }}
          >
            {steps.map((s) => (
              <div
                key={s.n}
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    border: "1px solid rgba(212,168,75,.45)",
                    background: "#05080d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: 32,
                    color: "#d4a84b",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    color: "rgba(242,237,227,.50)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                >
                  {s.sub}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: 28,
                    lineHeight: 1.05,
                    color: "#f2ede3",
                    margin: 0,
                  }}
                >
                  {s.t}
                </h3>
                <p
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.75,
                    color: "rgba(242,237,227,.58)",
                    fontWeight: 300,
                    margin: 0,
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                >
                  {s.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────── Testimonials ─────────
function Testimonials() {
  const quotes = [
    {
      q:
        "I applied to 11 U.S. schools from Karachi. My school had no counselor who'd even heard of the Common App. Kairos walked me through Matric → 4.0 conversion in an hour — and my Stanford supplement twice over.",
      name: "Ayesha R.",
      role: "Accepted — Stanford '29",
      loc: "Karachi, Pakistan",
    },
    {
      q:
        "My parents speak Punjabi. They wanted to help but couldn't. I turned on voice mode and Kairos walked them through the CSS Profile in Punjabi while I translated the numbers. They cried. So did I.",
      name: "Jaskaran S.",
      role: "First-gen · Accepted UMich, UIUC",
      loc: "Brampton, Canada",
    },
    {
      q:
        "I had a list of 15 reaches and zero safety schools. Kairos didn't lecture me — it showed me three schools I'd never heard of that meet 100% of need and were match-tier. I'm graduating debt-free.",
      name: "Maya A.",
      role: "Accepted — Grinnell, full aid",
      loc: "Brooklyn, NY",
    },
  ];
  return (
    <section
      id="stories"
      style={{
        background: "#0c1120",
        padding: "130px 80px",
        borderTop: "1px solid rgba(242,237,227,.08)",
        borderBottom: "1px solid rgba(242,237,227,.08)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 60,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
              <span
                style={{
                  color: "#d4a84b",
                  letterSpacing: ".32em",
                  fontSize: 10.5,
                  textTransform: "uppercase",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                Student stories
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 56,
                lineHeight: 1.05,
                color: "#f2ede3",
                margin: 0,
                maxWidth: 620,
                letterSpacing: "-.01em",
              }}
            >
              From the <em style={{ color: "#d4a84b", fontStyle: "italic" }}>2025–26</em> cycle.
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
              fontSize: 11,
              color: "rgba(242,237,227,.40)",
            }}
          >
            Verified on submission
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {quotes.map((x) => (
            <div
              key={x.name}
              style={{
                padding: "40px 34px",
                border: "1px solid rgba(242,237,227,.10)",
                background: "rgba(5,8,13,.4)",
                display: "flex",
                flexDirection: "column",
                gap: 26,
                minHeight: 380,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: 68,
                  lineHeight: 0.4,
                  color: "#d4a84b",
                  height: 20,
                }}
              >
                &ldquo;
              </div>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 19,
                  lineHeight: 1.45,
                  color: "#f2ede3",
                  margin: 0,
                  flex: 1,
                  fontStyle: "italic",
                }}
              >
                {x.q}
              </p>
              <div
                style={{
                  borderTop: "1px solid rgba(242,237,227,.12)",
                  paddingTop: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    background: "rgba(212,168,75,.20)",
                    border: "1px solid rgba(212,168,75,.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#d4a84b",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  }}
                >
                  {x.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#f2ede3",
                      fontWeight: 500,
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    }}
                  >
                    {x.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "rgba(242,237,227,.50)",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      marginTop: 2,
                    }}
                  >
                    {x.role} · {x.loc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Proof strip removed 2026-05-01: metrics were placeholder, not real.
            Bring it back once we have verifiable numbers from the production
            cohort. */}
      </div>
    </section>
  );
}

// ───────── Pricing ─────────
function Pricing() {
  const kairosFeatures = [
    "Unlimited Coach Kairos — essays, schools, interviews",
    "40+ languages, voice mode included",
    "Full pipeline: intake → aid",
    "Chancing, net-price, scholarship match",
    "Always-on, 3 a.m. on a Saturday",
  ];
  const counselorFeatures = [
    "One counselor, taking on 20+ students",
    "English-only, school hours",
    "Piecemeal — essays cost extra",
    "Generic chancing spreadsheets",
    "Unavailable nights, weekends, crisis moments",
  ];
  return (
    <section id="pricing" style={{ background: "#05080d", padding: "130px 80px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginBottom: 22,
            }}
          >
            <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
            <span
              style={{
                color: "#d4a84b",
                letterSpacing: ".32em",
                fontSize: 10.5,
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              Pricing
            </span>
            <span style={{ width: 26, height: 1, background: "#d4a84b" }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 64,
              lineHeight: 1.02,
              color: "#f2ede3",
              margin: 0,
              letterSpacing: "-.01em",
            }}
          >
            $10, or <em style={{ color: "#d4a84b", fontStyle: "italic" }}>$8,000.</em>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(242,237,227,.60)",
              marginTop: 24,
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            The same counselor work — one costs a coffee, one costs a semester.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {/* KairosLearn side */}
          <div
            style={{
              padding: "48px 44px",
              border: "1px solid rgba(212,168,75,.30)",
              background: "rgba(212,168,75,.06)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -12,
                left: 40,
                background: "#d4a84b",
                color: "#05080d",
                fontSize: 9.5,
                letterSpacing: ".22em",
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "4px 12px",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              Recommended
            </div>
            <div
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: 24,
                color: "#f2ede3",
                marginBottom: 8,
              }}
            >
              <em style={{ color: "#d4a84b", fontStyle: "italic" }}>Kairos</em>Learn
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <div
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 96,
                  lineHeight: 1,
                  color: "#f2ede3",
                  letterSpacing: "-.02em",
                }}
              >
                $10
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(242,237,227,.55)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                / month
              </div>
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "rgba(242,237,227,.55)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              or free for verified low-income & first-gen applicants
            </div>
            <div style={{ height: 1, background: "rgba(242,237,227,.12)", margin: "30px 0" }} />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {kairosFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    fontSize: 13,
                    color: "#f2ede3",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#d4a84b", fontSize: 14, marginTop: 1 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/intake"
              style={{
                marginTop: 36,
                background: "#d4a84b",
                color: "#05080d",
                border: 0,
                padding: "15px 28px",
                fontSize: 11,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                width: "100%",
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              Start for free →
            </Link>
          </div>
          {/* Private counselor side */}
          <div
            style={{
              padding: "48px 44px",
              border: "1px solid rgba(242,237,227,.10)",
              background: "rgba(5,8,13,.5)",
              opacity: 0.78,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "rgba(242,237,227,.55)",
                marginBottom: 8,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              Private counselor
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <div
                style={{
                  fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 96,
                  lineHeight: 1,
                  color: "rgba(242,237,227,.50)",
                  letterSpacing: "-.02em",
                  textDecoration: "line-through",
                  textDecorationThickness: 2,
                }}
              >
                $8,000
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(242,237,227,.45)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                / cycle
              </div>
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "rgba(242,237,227,.45)",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              typical IEC package · $3k — $15k range
            </div>
            <div style={{ height: 1, background: "rgba(242,237,227,.08)", margin: "30px 0" }} />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {counselorFeatures.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    fontSize: 13,
                    color: "rgba(242,237,227,.55)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "rgba(242,237,227,.30)", fontSize: 14, marginTop: 1 }}>
                    —
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled
              style={{
                marginTop: 36,
                background: "transparent",
                color: "rgba(242,237,227,.45)",
                border: "1px solid rgba(242,237,227,.15)",
                padding: "15px 28px",
                fontSize: 11,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                width: "100%",
                cursor: "not-allowed",
              }}
            >
              Out of reach
            </button>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 36,
            fontSize: 12,
            color: "rgba(242,237,227,.45)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontStyle: "italic",
          }}
        >
          Pricing based on 2024 IECA industry survey. We verify income via standard aid documentation.
        </div>
      </div>
      <Grain opacity={0.05} />
    </section>
  );
}

// ───────── Final CTA ─────────
function FinalCTA() {
  return (
    <section
      style={{
        background: "#05080d",
        padding: "140px 80px 150px",
        borderTop: "1px solid rgba(242,237,227,.08)",
        textAlign: "center",
        position: "relative",
      }}
    >
      <span
        style={{
          color: "#d4a84b",
          letterSpacing: ".32em",
          fontSize: 10.5,
          textTransform: "uppercase",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        }}
      >
        Your moment
      </span>
      <h2
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 96,
          lineHeight: 1,
          color: "#f2ede3",
          margin: "32px 0 32px",
          letterSpacing: "-.02em",
        }}
      >
        The right counselor
        <br />
        <em style={{ color: "#d4a84b", fontStyle: "italic" }}>at the right moment.</em>
      </h2>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "rgba(242,237,227,.55)",
          fontWeight: 300,
          maxWidth: 520,
          margin: "0 auto 44px",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        }}
      >
        The 2026–27 cycle opens soon. Start your profile now — it takes five minutes, and the coach
        carries it forward.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <Link
          href="/intake"
          style={{
            background: "#d4a84b",
            color: "#05080d",
            border: 0,
            padding: "18px 44px",
            fontSize: 11,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            textDecoration: "none",
          }}
        >
          Start for free
        </Link>
        <Link
          href="/about"
          style={{
            background: "transparent",
            color: "#f2ede3",
            border: "1px solid rgba(242,237,227,.28)",
            padding: "17px 32px",
            fontSize: 11,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            textDecoration: "none",
          }}
        >
          Talk to the founder
        </Link>
      </div>
      <Grain opacity={0.05} />
    </section>
  );
}

// ───────── Footer ─────────
function Footer() {
  const columns: [string, string[]][] = [
    ["Product", ["Coach Kairos", "Essay Studio", "School List", "Interview Prep", "Financial Aid"]],
    ["Students", ["First-gen", "International", "Pakistan", "India", "Language support"]],
    ["Company", ["About", "Careers", "Blog", "Press", "Contact"]],
  ];
  return (
    <footer
      style={{
        background: "#05080d",
        padding: "60px 80px 44px",
        borderTop: "1px solid rgba(242,237,227,.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "#d4a84b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "#05080d",
                fontSize: 14,
              }}
            >
              K
            </div>
            <span
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: 17,
                color: "#f2ede3",
              }}
            >
              <em style={{ color: "#d4a84b", fontStyle: "italic" }}>Kairos</em>Learn
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(242,237,227,.50)",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: 300,
            }}
          >
            Every student deserves a counselor who actually knows them. In any language, at any
            hour, with the full pipeline — for the price of a coffee.
          </p>
        </div>
        {columns.map(([h, items]) => (
          <div key={h}>
            <div
              style={{
                fontSize: 10,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#d4a84b",
                marginBottom: 16,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              }}
            >
              {h}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "rgba(242,237,227,.65)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1280,
          margin: "50px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(242,237,227,.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), 'JetBrains Mono', monospace",
            fontSize: 10,
            color: "rgba(242,237,227,.40)",
            letterSpacing: ".10em",
          }}
        >
          © 2026 KairosLearn · kairoslearn.com
        </span>
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 10.5,
            color: "rgba(242,237,227,.45)",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            letterSpacing: ".06em",
          }}
        >
          <span>Privacy</span>
          <span>Terms</span>
          <span>Accessibility</span>
          <span>kairos@kairoslearn.com</span>
        </div>
      </div>
    </footer>
  );
}

// ───────── Root ─────────
export default function CinematicLandingV2() {
  return (
    <div
      className="kl-surface-landing"
      data-landing="cinematic"
      style={{
        width: "100%",
        maxWidth: 1280,
        margin: "0 auto",
        background: "#05080d",
        color: "#f2ede3",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        fontWeight: 300,
      }}
    >
      <Hero />
      <ForgottenStudent />
      <DemoVideo />
      <Pipeline />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
