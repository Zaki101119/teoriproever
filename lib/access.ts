import crypto from "crypto";

/**
 * Lightweight, DB-free access model.
 *
 * When a payment succeeds, we issue a signed token that encodes an expiry
 * timestamp (now + ACCESS_DURATION_DAYS). The token is stored in an
 * httpOnly cookie. On protected routes we verify the signature and check
 * the expiry. No user accounts or database required for the MVP.
 *
 * For production at scale you'd likely move this to a real DB row keyed to
 * a customer, but this keeps the 50 DKK / 7-day model simple to launch.
 */

const SECRET = process.env.STRIPE_WEBHOOK_SECRET || "dev-fallback-secret-change-me";

export function createAccessToken(expiresAtMs: number): string {
  const payload = String(expiresAtMs);
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAccessToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  if (Number.isNaN(expiresAt)) return false;
  return Date.now() < expiresAt;
}

export function accessDurationMs(): number {
  const days = Number(process.env.ACCESS_DURATION_DAYS || "7");
  return days * 24 * 60 * 60 * 1000;
}
