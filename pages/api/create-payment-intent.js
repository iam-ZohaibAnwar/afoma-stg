import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }
        const { amount, productName ,currency_code } = req.body;

        if (!amount || !productName ||!currency_code) {
            return res
                .status(400)
                .json({ error: "Missing required fields: amount or productName" });
        }

        // Convert dollars to cents
        const amountInCents = amount;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, //amount in cents
            currency: currency_code,
            payment_method_types: ["card"], // Apple Pay works through card networks
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}