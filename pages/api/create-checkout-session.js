// pages/api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { priceId, quantity = 1 } = req.body; // or construct line_items directly

    // Example: line_items with priceId (recommended: create Prices in Stripe dashboard)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Checkout will also show wallet buttons when available
      mode: "payment",
      line_items: [
        // { price: priceId || "price_XXXXXXXX", quantity: quantity }
          {
      price_data: {
        currency: "usd",
        product_data: { name: "Test Item" },
        unit_amount: 1000, // $10
      },
      quantity: 1,
    },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      // optional: collect_shipping_address: true,
      // optional: metadata, customer_email, etc.
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
}
