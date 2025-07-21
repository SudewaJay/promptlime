// app/api/stripe/checkout/route.ts
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?canceled=true`,
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "PromptHubb Pro - Lifetime Access",
          },
          unit_amount: 1500 * 100, // $1500
        },
        quantity: 1,
      },
    ],
    metadata: {
      email: user.email,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}