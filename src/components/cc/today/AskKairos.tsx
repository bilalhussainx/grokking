"use client";

// Amendment A: a plain-language command box on Today. Submitting (button or
// Enter) opens the existing Coach with the words already in its composer;
// nothing is sent until the student presses send there. Agent result cards
// arrive with the agent work, not here.
import { useId, useState, type FormEvent } from "react";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import AiBadge from "@/components/app-shell/AiBadge";

export default function AskKairos() {
  const coach = useCoachKairos();
  const [text, setText] = useState("");
  const id = useId();

  function submit(e: FormEvent) {
    e.preventDefault();
    coach.openWithDraft(text.trim());
    setText("");
  }

  return (
    <form className="td-ask" onSubmit={submit}>
      <label className="td-ask-label" htmlFor={`${id}-ask`}>
        Ask Kairos{" "}<AiBadge />
      </label>
      <div className="td-ask-row">
        <input
          id={`${id}-ask`}
          type="text"
          dir="auto"
          autoComplete="off"
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about schools, costs or what's next"
        />
        <button type="submit" className="af-primary">Open in Coach</button>
      </div>
      <p className="td-ask-note">Coach opens with your words ready. Nothing is sent until you press send.</p>
    </form>
  );
}
