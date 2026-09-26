import { describe, it, expect } from "vitest";
import { coachErrorMessage } from "../coach-error-message";

describe("coachErrorMessage", () => {
  it("shows the server's fair-use message instead of inviting a retry", () => {
    expect(coachErrorMessage(429, { fairUse: true, error: "You've reached today's fair-use limit for this feature. It resets at midnight UTC." }))
      .toBe("You've reached today's fair-use limit for this feature. It resets at midnight UTC.");
  });
  it("shows a limit message for a 402 cap", () => {
    expect(coachErrorMessage(402, { error: "Free plan: 200 coach messages per day." })).toBe("Free plan: 200 coach messages per day.");
  });
  it("falls back to the generic retry message for other failures", () => {
    expect(coachErrorMessage(500, null)).toBe("Sorry, I had trouble responding. Try again?");
    expect(coachErrorMessage(429, {})).toBe("Sorry, I had trouble responding. Try again?");
  });
});
