// src/lib/paddle.ts
import crypto from "crypto";

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";

/**
 * Verify Paddle webhook signature.
 * Paddle sends: Paddle-Signature header with ts=TIMESTAMP;h1=HASH
 */
export function verifyPaddleWebhook(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!PADDLE_WEBHOOK_SECRET || !signatureHeader) return false;

  try {
    const parts: Record<string, string> = {};
    signatureHeader.split(";").forEach((part) => {
      const [key, value] = part.split("=");
      if (key && value) parts[key.trim()] = value.trim();
    });

    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(ts, 10)) > 300) return false;

    // Compute HMAC
    const signedPayload = `${ts}:${rawBody}`;
    const computed = crypto
      .createHmac("sha256", PADDLE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    // Constant-time comparison
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(h1));
  } catch {
    return false;
  }
}
