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
