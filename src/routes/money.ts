import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

type Mode = "payment" | "subscription";
const Mode = (value: string) => { return value === "payment" || value === "subscription"; }

interface CheckoutParams {
    mode: Mode;
    priceId: string;
    quantity?: number;
}

interface PriceParams {
    name: string;
    description: string;
    amount: number;
    interval: 'day' | 'month' | 'week' | 'year';
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function create_checkout (
    {
        mode,
        priceId,
        quantity = 1
    }: CheckoutParams,
    {
        name,
        description,
        amount,
        interval
    }: PriceParams
) {

    try {

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],
            mode,

            line_items: [

                {

                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name,
                            description,
                        },
                        unit_amount: amount, // en centimes (ex: 19.99€ = 1999)
                        recurring: {
                            interval, // 'mounth' ou 'year'
                        }
                    },
                    quantity
                }
                    
            ],

            success_url: `http://localhost:5173/pay/success?plan=${priceId}&user=user`,
            cancel_url: `http://localhost:5173/pay/cancel?plan=${priceId}&user=user`,

        });

        return { error: false, url: session.url };

    } catch (err: any) {
        console.error('Error creating checkout session:', err.message);
        return { error: true, message: err.message };
    }

} 

router.post('/create/checkout/link/for/:priceId/withmode/:mode', async (req, res) => {

    const { name, description, amount, interval } = req.body;

    const rawPricesId: string = req.params.priceId;
    const priceId: string = rawPricesId;

    const rawMode: string = req.params.mode;
    const mode: Mode = Mode(rawMode) ? rawMode : "payment";

    const session = await create_checkout(
        { mode, priceId },
        { name, description, amount, interval }
    );

    res.json(session);

});

export default router;
