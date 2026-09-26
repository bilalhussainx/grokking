import { timingSafeEqual } from "node:crypto";

// Shared-secret check for internal admin routes. Fails closed: with the env
// var unset or empty, nothing matches (these routes used to fall back to a
// secret committed in the repo).
export function hasAdminSecret(
  provided: string | null | undefined,
  envName: "ADMIN_SECRET" | "TEACHER_SECRET_KEY",
): boolean {
  const expected = process.env[envName];
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Fails closed when
// the env var is unset or empty; constant-time compare.
export function hasBearerSecret(authorization: string | null, envName: "CRON_SECRET"): boolean {
  const prefix = "Bearer ";
  if (!authorization?.startsWith(prefix)) return false;
  const expected = process.env[envName];
  if (!expected) return false;
  const a = Buffer.from(authorization.slice(prefix.length));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
