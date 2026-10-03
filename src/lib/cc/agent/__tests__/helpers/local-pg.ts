// Guard for destructive local-Postgres tests: only localhost / 127.0.0.1 are allowed.
export function isLocalPgUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}
