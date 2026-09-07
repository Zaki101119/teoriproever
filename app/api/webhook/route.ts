import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAccessToken, accessDurationMs } from "@/lib/access";

/**
 * Stripe calls this endpoint after a successful payment.
 * We verify the signature, then (for this simple MVP) the client picks up
 * access on the /success page via the session id. The webhook is where you'd
 * also record the purchase, send a receipt email, etc.
 *
 * Note: cookies can't be reliably set from a Stripe->server webhook because
 * there's no browser in that request. So the actual access cookie is granted
 * on /success after we confirm the session is paid (see /api/verify-access).
 * This webhook is the source of truth / audit log.
 */

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !whsec || key.includes("REPLACE_ME")) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(key);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, whsec);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad signature";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Here you would persist: session.id, session.customer_details?.email, paid=true
    // For the MVP we just acknowledge. Access is granted on /success.
    console.log("Payment completed for session:", session.id);
    // Token creation shown for reference; issued to the browser on /success.
    void createAccessToken(Date.now() + accessDurationMs());
  }

  return NextResponse.json({ received: true });
}
