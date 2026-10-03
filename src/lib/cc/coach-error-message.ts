const GENERIC = "Sorry, I had trouble responding. Try again?";

// A usage limit (402 cap or 429 Pro fair use) comes with a server message the
// student should read; retrying won't help. Anything else gets the generic retry line.
export function coachErrorMessage(status: number, body: unknown): string {
  const error = body && typeof body === "object" ? (body as { error?: unknown }).error : undefined;
  if ((status === 402 || status === 429) && typeof error === "string" && error.trim()) return error;
  return GENERIC;
}

// The S1 agent route returns closed codes, never copy: map its status to fixed
// lines. A 409 is an in-flight or conflicting key; a new send mints a new key.
export function agentTurnErrorMessage(status: number): string {
  if (status === 429) return "You've reached today's fair-use limit for Coach. Try again tomorrow.";
  if (status === 404 || status === 503) return "Coach is unavailable right now. Try again in a little while.";
  if (status === 409) return "That message didn't go through. Please send it again.";
  return GENERIC;
}
