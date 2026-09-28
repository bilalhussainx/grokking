"use client";

// Today (GATE D4.2): one clear next step, ruled rows of ongoing work, and
// quieter support. Renders only the strings in `model`; nothing here reads the
// clock, so server HTML and hydrated HTML are identical (the React #418 fix).
// Coach opens only when the student chooses it.
import "./today.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import AiBadge from "@/components/app-shell/AiBadge";
import { openFamilyMode } from "@/components/app-shell/coach-actions";
import type { TodayModel } from "@/app/cc/dashboard/today-model";
import AskKairos from "./AskKairos";
import GradeQuestion from "./GradeQuestion";
import YourPeople from "./YourPeople";

function DayMark() {
  return (
    <svg className="td-daymark" viewBox="0 0 100 76" aria-hidden="true">
      <path d="M12 55a38 38 0 0 1 76 0" fill="#FCE4CD" />
      <path d="M27 55a23 23 0 0 1 46 0" fill="#FFF7EE" />
      <path d="M6 65c25-15 50 15 88-4" stroke="#315B4C" strokeWidth="3" fill="none" />
      <path d="M50 3v12M10 26l8 5m64 0 8-5" stroke="#A13E24" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function TodayDashboard({ model }: { model: TodayModel }) {
  const coach = useCoachKairos();
  const { setVariantKey } = coach;
  const router = useRouter();
  const [inviteHidden, setInviteHidden] = useState(false);
  const [gradeSkipped, setGradeSkipped] = useState(false);
  const [stageHelp, setStageHelp] = useState(model.grade9 && model.blockedNotice);
  const [status, setStatus] = useState("");
  const helpRef = useRef<HTMLHeadingElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const talkRef = useRef<HTMLButtonElement>(null);
  const inviteToggled = useRef(false);

  // Coach turns started from Today carry the stage's guidance block.
  useEffect(() => {
    setVariantKey(model.variantKey);
    return () => setVariantKey(null);
  }, [setVariantKey, model.variantKey]);

  // Middleware sends grade-9 deep links here with ?blocked=grade9. The server
  // already rendered the explanation; drop the flag so a reload won't repeat it.
  useEffect(() => {
    if (!model.blockedNotice) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("blocked")) {
      url.searchParams.delete("blocked");
      window.history.replaceState(window.history.state, "", url.pathname + url.search);
    }
  }, [model.blockedNotice]);

  useEffect(() => {
    if (stageHelp) helpRef.current?.focus();
  }, [stageHelp]);

  useEffect(() => {
    if (!inviteToggled.current) return;
    (inviteHidden ? restoreRef : talkRef).current?.focus();
  }, [inviteHidden]);

  const talk = () => coach.openWithVariant(model.variantKey);
  const showInvite = model.suggestionsOn && !inviteHidden;

  return (
    <div className="td">
      {model.grade9 && stageHelp && (
        <section className="td-clarify" aria-labelledby="td-stage-help">
          <span className="af-chip">Grade 9 · Focus on exploration</span>
          <h2 id="td-stage-help" ref={helpRef} tabIndex={-1}>That tool opens later.</h2>
          <p>
            Essays, applications, test planning and interview prep aren&apos;t available in grade 9. You can explore
            majors, record activities and plan high-school coursework now.
          </p>
          <div className="td-actions">
            <button type="button" className="af-quiet" onClick={talk}>Ask Coach about my stage</button>
            <button type="button" className="af-quiet" onClick={() => setStageHelp(false)}>Got it</button>
          </div>
        </section>
      )}

      <section className="td-welcome">
        <div>
          <span className="af-chip">{model.stageLabel}</span>
          <h1>{model.headline[0]}<br />{model.headline[1]}</h1>
          <p className="td-intro">{model.intro}</p>
        </div>
        <DayMark />
      </section>

      <AskKairos />

      <div className="td-grid">
        <div>
          {model.unavailable ? (
            <section className="td-clarify" aria-labelledby="td-unavailable">
              <h2 id="td-unavailable">We won&apos;t fill in the blanks.</h2>
              <p>
                We couldn&apos;t load your planning details. That is different from having no saved work. Try again, or
                open the part of your plan you need from the menu.
              </p>
              <div className="td-actions">
                <button type="button" className="af-primary" onClick={() => router.refresh()}>Try again</button>
              </div>
            </section>
          ) : (
            <>
              {model.askGrade && !gradeSkipped && (
                <GradeQuestion onSkip={() => { setGradeSkipped(true); setStatus("Skipped for now. Nothing was saved."); }} />
              )}
              {model.askGrade && gradeSkipped && (
                <section className="td-clarify" aria-labelledby="td-skipped">
                  <h2 id="td-skipped">We can start with your question.</h2>
                  <p>You can explore without choosing a grade. We&apos;ll ask before offering stage-specific guidance.</p>
                  <div className="td-actions">
                    <button type="button" className="af-primary" onClick={() => coach.openWithDraft("")}>Open Coach Kairos</button>
                  </div>
                </section>
              )}
              {model.step && (
                <section className="td-step" aria-labelledby="td-step-title">
                  <p className="af-eyebrow">{model.step.eyebrow}</p>
                  <h2 id="td-step-title">{model.step.title}</h2>
                  <p className="td-step-body">{model.step.body}</p>
                  <div className="td-actions">
                    <Link className="af-primary" href={model.step.cta.href}>
                      {model.step.cta.label}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                  <p className="td-basis">{model.step.basis}</p>
                </section>
              )}
              <section className="td-notes" aria-labelledby="td-notes-title">
                <div className="td-section-head">
                  <h2 id="td-notes-title">{model.rowsTitle}</h2>
                  <span className="af-caption">From your saved work</span>
                </div>
                {model.rows.map((row) => (
                  <Link key={row.id} className="td-row" href={row.href}>
                    <div>
                      <strong>{row.label}</strong>
                      <p>{row.detail}</p>
                    </div>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </section>
              {model.grade9 && !stageHelp && (
                <div className="td-permission">
                  <span>Application tools come later.</span>
                  <button type="button" className="af-quiet" onClick={() => setStageHelp(true)}>What can I use now?</button>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="td-side" aria-label="People and support">
          {showInvite ? (
            <section className="td-coach-note" aria-labelledby="td-coach-title">
              <p className="td-coach-label">Coach Kairos{" "}<AiBadge /></p>
              <h3 id="td-coach-title">A place to think it through.</h3>
              {model.observation ? (
                <p>
                  <span className="af-eyebrow">{model.observation.eyebrow}</span>
                  <br />
                  {model.observation.text}
                </p>
              ) : (
                <p>Bring the question that feels hardest to start. We can take it one step at a time.</p>
              )}
              <div className="td-actions">
                <button ref={talkRef} type="button" onClick={talk}>Talk with Coach</button>
                <button
                  type="button"
                  className="af-quiet"
                  onClick={() => { inviteToggled.current = true; setInviteHidden(true); setStatus("Coach invitation hidden for this visit."); }}
                >
                  Not today
                </button>
              </div>
            </section>
          ) : (
            <section className="td-support" aria-labelledby="td-coach-quiet">
              <h3 id="td-coach-quiet">Coach is here when you need it.{" "}<AiBadge /></h3>
              <p>No conversation starts until you choose.</p>
              <div className="td-actions">
                <button type="button" className="af-quiet" onClick={talk}>Open Coach Kairos</button>
                {model.suggestionsOn && (
                  <button
                    ref={restoreRef}
                    type="button"
                    className="af-quiet"
                    onClick={() => { inviteToggled.current = true; setInviteHidden(false); setStatus(""); }}
                  >
                    Show the invitation
                  </button>
                )}
              </div>
            </section>
          )}
          <YourPeople />
          <section className="td-support" aria-labelledby="td-family">
            <h3 id="td-family">Bring your family in.</h3>
            <p>Talk through college and cost in a language that feels comfortable.</p>
            <button type="button" className="af-quiet" onClick={() => openFamilyMode(coach)}>Open family mode</button>
          </section>
        </aside>
      </div>

      <p className="af-sr-only" role="status">{status}</p>
    </div>
  );
}
