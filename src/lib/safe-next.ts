// Post-auth redirect targets come from the query string. Allow same-origin
// paths only: "//host" and "/\host" are protocol-relative in browsers.
export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/")) return null;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return null;
  return raw;
}
