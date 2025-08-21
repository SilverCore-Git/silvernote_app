import { randomUUID, UUID } from 'crypto';
import express from 'express';
import Stripe from 'stripe';
import db from '../assets/ts/database';

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
    family: boolean;
}

let session_db: { 

    session_id: UUID, 
    client_id: string, 
    date: Date, 
    plan: string, 
    plan_data: {
        strip_session_id: string,
        each: string,
        family: Boolean,
        family_data?: {
            owner: Boolean
        }
    } 

}[] = [];

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
        family,
        interval
    }: PriceParams
) {

    try {

        const user = await db.get_user(client_id);
        const customer = (await user)?.customerId; console.log(customer);
        const session_id: UUID = randomUUID();

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],
            mode,
            customer,

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
                            interval, // 'month' ou 'year'
                        } : undefined
                    },
                    quantity
                }
                    
            ],

            success_url: `http://localhost:5173/pay/success?plan=${priceId}&session_id=${session_id}`,
            cancel_url: `http://localhost:5173/pay/cancel?plan=${priceId}&session_id=${session_id}`,

        });


        const client_session = { 
                            session_id, 
                            client_id, 
                            date: new Date(), 
                            plan: priceId,
                            plan_data: {
                                strip_session_id: session.id,
                                each: interval,
                                family,
                                family_data: family ? {
                                    owner: true
                                } : undefined
                            },
                        };

        session_db.push(client_session)
        console.log('nouvelle session client :', client_session); // a enlever en prod

        return { error: false, url: session.url, session_id: session.subscription };

    } catch (err: any) {
        console.error('Error creating checkout session:', err.message);
        return { error: true, message: err.message };
    }

} 


async function delet_sub (subId: string) {

    try {
    
        await stripe.subscriptions.update(subId, {
            cancel_at_period_end: true, 
        });

        return { success: true };
    
    } catch (err) {

        console.error(err);
        return { error: true };
    
    }

}

async function createStripeCustomer(user: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
}) {
    const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: user.metadata, // optionnel : stocke ton `client_id` interne par ex.
    });

    console.log("Customer créé :", customer.id);
    return customer.id; // ex : 'cus_L8s9erM3DvJt2a'
}

router.post('/create/checkout/link/for/:priceId/withmode/:mode', async (req, res) => {

    const { name, description, amount, interval, user_id, family } = req.body;

    const rawPricesId: string = req.params.priceId;
    const priceId: string = rawPricesId;

    const rawMode: string = req.params.mode;
    const mode: Mode = Mode(rawMode) ? rawMode : "payment";

    const session = await create_checkout(
        user_id,
        { mode, priceId },
        { name, description, amount, interval, family }
    );

    res.json(session);

});

router.post('/success/checkout', async (req, res) => {

    const { session_id, user_id } = req.body;

    const session = session_db.find(session => session.session_id === session_id);
    
    const stripe_session = await stripe.checkout.sessions.retrieve(session!.plan_data.strip_session_id);

    const user = db.get_user(user_id);

    session_db.filter(session => session.session_id !== session_id)

    res.json({ 
                ok: true, 
                plan: session?.plan, 
                plan_data: session?.plan_data,
                sub_id: stripe_session.subscription,
                customerId: (await user)?.customerId
            });

})

router.post('/cancel/checkout', async (req, res) => {
    const { session_id } = req.body;

    session_db.filter(session => session.session_id !== session_id)

})



router.post('/cancel/subscription', async (req, res) => {

    const { subId } = req.body.userId;
    

    
});




router.get('/customer/:id/:secondid', async (req, res) => {

  try {

    const user = await db.get_user(req.params.secondid);

    const customerId = req.params.id;

    const customer = await stripe.customers.retrieve(customerId);

    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
    });

    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });

    res.json({
        localuser: user,
        customer,
        subscriptions: subscriptions.data,
        paymentMethods: paymentMethods.data,
    });

  } catch (err) {
        console.error('Erreur Stripe:', err);
        res.status(500).json({ error: err });
  }

});


export default router;
