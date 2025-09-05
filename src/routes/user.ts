import express, { Request, Response } from 'express';
import Stripe from 'stripe';
const router = express.Router();

import db from '../assets/ts/database';
import { User } from '@clerk/express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// route de gestion de plan
router.post('/plan/set', async (req: Request, res: Response) => {

  const { userId, planId, customerId, plan_data, sub_id } = req.body;

  if (!userId || !planId) return;

  try {

    await db.set_user_plan(userId, planId, sub_id, customerId, plan_data);
    
    res.cookie('_sub', sub_id, {
      httpOnly: true,
      secure: true,
    });

  }
  catch (err) {
    res.json({ error: true, message: err });
    throw err;
  }

  res.json(true);

})

// route de création de session
router.post('/session/create', async (req: Request, res: Response) => {

  res.json({});
  return;

  const { platform, userId }: { platform: string, userId: string } = req.body; // platform => app type (web, electron, capacitor)
  let sessions; 

  if (!userId) return

  try {

    if (!await db.exist_user(userId)) return;

    sessions = await db.new_session(userId);

    if (platform == 'web') {

      res.cookie('session_id', sessions.id, {
        httpOnly: true,
        secure: true,
      });

      res.cookie('user_id', userId, {
        httpOnly: true,
        secure: true,
      });

      res.cookie('_platform', 'web', {
        httpOnly: true,
        secure: true,
      });

    }

  }
  catch (err) {
    res.json({ error: true, message: err });
    throw err;
  }

  res.json(sessions);

})

// route de fermeture de session
router.post('/session/close', async (req: Request, res: Response) => {

  res.json({});
  return;

  const session_id: any = req.cookies.session_id;

  const sessions = await db.verify_session(session_id);
  
  if (sessions) {

    const close = await db.close_session(session_id)

    res.clearCookie('session_id');

    res.clearCookie('user_id');

    res.json(close);

  }

})


// route de vérification de session
router.post('/session/verify', async (req: Request, res: Response) => {

  res.json({});
  return;

  const session_id = req.cookies.session_id;

  const sessions: boolean = await db.verify_session(session_id);
  
  res.json(sessions);

})


router.post('/get/data', async (req: Request, res: Response) => {

  const { user_id } = req.body;

  const user = await db.get_user(user_id);

  res.json(user);

})




router.get('/stripe/portal/for/:id', async (req: Request, res: Response) => {

  const customerId = req.params.id;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: 'http://localhost:5173/user/profile',
  });

  if (req.query.redirect == '1') return res.redirect(session.url);
  res.json({ url: session.url });

});

router.post('/stripe/cancel/sub', async (req: Request, res: Response) => {

  const { subId } = req.body;

  const response = await stripe.subscriptions.update(subId, {
    cancel_at_period_end: true,
  });

  res.json(response || true);

});






async function createStripeCustomer(user: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
}) {
    const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
    });

    console.log("Customer créé :", customer.id);
    return customer.id; // ex : 'cus_L8s9erM3DvJt2a'
}



router.post('/create', async (req: Request, res: Response) => {

  const user: User = req.body.user;

  if (!await db.exist_user(user.id)) {

    const strip_user_id: string = await createStripeCustomer({
      email: String(user.emailAddresses[0].emailAddress),
      name: user.fullName!
    })

    await db.add_user({
      userId: user.id,
      customerId: strip_user_id,
      planId: 'Silver'
    })

  };

  res.cookie('user_id', user.id, {
    httpOnly: true,
    secure: false,
  });

  res.json(await db.get_user(user.id));
  
})

router.post('/verify', async (req: Request, res: Response) => {

  const { user_id } = req.body;

  res.json(await db.exist_user(user_id));
  
})



export default router;