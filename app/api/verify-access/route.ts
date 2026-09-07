import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAccessToken, accessDurationMs, verifyAccessToken } from "@/lib/access";

/**
 * Two jobs:
 *  - GET  : report whether the current visitor has a valid access cookie.
 *  - POST : given a paid Stripe session_id (from /success), confirm it with
 *           Stripe and, if paid, set the signed httpOnly access cookie.
 */

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access")?.value;
  return NextResponse.json({ hasAccess: verifyAccessToken(token) });
}

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("REPLACE_ME")) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ hasAccess: false, error: "Not paid" }, { status: 402 });
    }

    const expiresAt = Date.now() + accessDurationMs();
    const token = createAccessToken(expiresAt);

    const res = NextResponse.json({ hasAccess: true, expiresAt });
    res.cookies.set("access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Math.floor(accessDurationMs() / 1000),
      path: "/",
    });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
