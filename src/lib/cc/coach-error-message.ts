const GENERIC = "Sorry, I had trouble responding. Try again?";

// A usage limit (402 cap or 429 Pro fair use) comes with a server message the
// student should read; retrying won't help. Anything else gets the generic retry line.
export function coachErrorMessage(status: number, body: unknown): string {
  const error = body && typeof body === "object" ? (body as { error?: unknown }).error : undefined;
  if ((status === 402 || status === 429) && typeof error === "string" && error.trim()) return error;
  return GENERIC;
}
