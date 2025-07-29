import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

type Mode = "payment" | "subscription";
const Mode = (value: string) => { return value === "payment" || value === "subscription"; }
type PricesId = "price_1RqJczI2ZY3BvIYk2afc7OQE" | "price_1RmDmAI2ZY3BvIYklqDlUwoH";

interface CheckoutParams {
  mode: Mode;
  priceId: string;
  quantity?: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function create_checkout (
    {
        mode,
        priceId,
        quantity = 1
    }: CheckoutParams
) {

    try {

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],
            mode,

            line_items: [
                {
                    price: priceId,
                    quantity,
                },
            ],
            success_url: `https://www.silvernote.fr/pay/success?plan=${priceId}&user=user`,
            cancel_url: `https://www.silvernote.fr/pay/cancel?plan=${priceId}&user=user`,

        });

        return session.url;

    } catch (err: any) {
        console.error('Error creating checkout session:', err.message);
        return { error: true, message: err.message };
    }

} 

router.post('/create/checkout/link/for/:priceId/withmode/:mode', async (req, res) => {

    const rawPricesId: string = req.params.priceId;
    const priceId: string = rawPricesId;

    const rawMode: string = req.params.mode;
    const mode: Mode = Mode(rawMode) ? rawMode : "payment";

    const session = await create_checkout({ mode, priceId });

    res.json(session);

});

export default router;
