import { randomUUID, UUID } from 'crypto';
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

let session_db: { session_id: UUID, client_id: string, date: Date, plan: string }[] = [];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function create_checkout (
    client_id: string,
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

        const session_id: UUID = randomUUID();

        const client_session = { session_id, client_id, date: new Date(), plan: priceId};

        session_db.push(client_session)
        console.log('nouvelle session client :', client_session); // a enlever en prod

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
                        recurring: interval ? {
                            interval, // 'mounth' ou 'year'
                        } : undefined
                    },
                    quantity
                }
                    
            ],

            success_url: `http://localhost:5173/pay/success?plan=${priceId}&session_id=${session_id}`,
            cancel_url: `http://localhost:5173/pay/cancel?plan=${priceId}&session_id=${session_id}`,

        });

        return { error: false, url: session.url };

    } catch (err: any) {
        console.error('Error creating checkout session:', err.message);
        return { error: true, message: err.message };
    }

} 

router.post('/create/checkout/link/for/:priceId/withmode/:mode', async (req, res) => {

    const { name, description, amount, interval, user_id } = req.body;

    const rawPricesId: string = req.params.priceId;
    const priceId: string = rawPricesId;

    const rawMode: string = req.params.mode;
    const mode: Mode = Mode(rawMode) ? rawMode : "payment";

    const session = await create_checkout(
        user_id,
        { mode, priceId },
        { name, description, amount, interval }
    );

    res.json(session);

});

router.post('/success/checkout', async (req, res) => {
    const { session_id, user_id } = req.body;

    console.log(user_id)
    const session = session_db.find(session => session.session_id === session_id);
    session_db.filter(session => session.session_id !== session_id)

    res.json({ ok: true, plan: session?.plan });

})

router.post('/cancel/checkout', async (req, res) => {
    const { session_id } = req.body;

    session_db.filter(session => session.session_id !== session_id)

})


export default router;
