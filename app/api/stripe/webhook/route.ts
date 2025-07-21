// app/api/stripe/webhook/route.ts
import { stripe } from "@/lib/stripe";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import type { Stripe } from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const rawBody = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const buf = Buffer.from(rawBody);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    if (email) {
      await connectToDatabase();
      await User.findOneAndUpdate({ email }, { isPro: true });
    }
  }

  return new Response("Success", { status: 200 });
}