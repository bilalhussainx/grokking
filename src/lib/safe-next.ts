// Post-auth redirect targets come from the query string. Allow same-origin
// paths only. "//host" and "/\host" are protocol-relative in browsers, and
// browsers strip tab/LF/CR before parsing ("/\t/evil.com" → "//evil.com"),
// so reject control characters and backslashes anywhere, then confirm the
// path resolves to the same origin.
export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return null;
  try {
    if (new URL(raw, "https://same.invalid").origin !== "https://same.invalid") return null;
  } catch {
    return null;
  }
  return raw;
}

// "/signup" or "/login" with the current page's safe ?next= carried over, so
// switching between sign-in and sign-up keeps where the visitor was going
// (e.g. an invite at /join/<code>).
export function authHrefKeepingNext(base: "/signup" | "/login", search: string): string {
  const next = safeNextPath(new URLSearchParams(search).get("next"));
  return next ? `${base}?next=${encodeURIComponent(next)}` : base;
}
