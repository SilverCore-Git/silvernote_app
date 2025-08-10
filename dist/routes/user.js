"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
const database_1 = __importDefault(require("../assets/ts/database"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// route de gestion de plan
router.post('/plan/set', async (req, res) => {
    const { userId, planId, customerId, plan_data, sub_id } = req.body;
    let sessions;
    if (!userId || !planId)
        return;
    try {
        await database_1.default.set_user_plan(userId, planId, sub_id, customerId, plan_data);
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
});
// route de création de session
router.post('/session/create', async (req, res) => {
    const { platform, userId } = req.body; // platform => app type (web, electron, capacitor)
    let sessions;
    if (!userId)
        return;
    try {
        if (!await database_1.default.exist_user(userId))
            database_1.default.add_user(userId);
        sessions = await database_1.default.new_session(userId);
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
});
// route de fermeture de session
router.post('/session/close', async (req, res) => {
    const session_id = req.cookies.session_id;
    const sessions = await database_1.default.verify_session(session_id);
    if (sessions) {
        const close = await database_1.default.close_session(session_id);
        res.clearCookie('session_id');
        res.clearCookie('user_id');
        res.json(close);
    }
});
// route de vérification de session
router.post('/session/verify', async (req, res) => {
    const session_id = req.cookies.session_id;
    const sessions = await database_1.default.verify_session(session_id);
    res.json(sessions);
});
router.post('/get/data', async (req, res) => {
    const { user_id } = req.body;
    const user = await database_1.default.get_user(user_id);
    res.json(user);
});
router.get('/stripe/portal/for/:id', async (req, res) => {
    const customerId = req.params.id;
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: 'http://localhost:5173/user/profile',
    });
    if (req.query.redirect == '1')
        return res.redirect(session.url);
    res.json({ url: session.url });
});
async function createStripeCustomer(user) {
    const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
    });
    console.log("Customer créé :", customer.id);
    return customer.id; // ex : 'cus_L8s9erM3DvJt2a'
}
router.post('/create', async (req, res) => {
    const user = req.body.user;
    const strip_user_id = await createStripeCustomer({
        email: String(user.emailAddresses[0].emailAddress),
        name: user.fullName
    });
    const db_user = await database_1.default.add_user({
        userId: user.id,
        customerId: strip_user_id,
        planId: 'Silver'
    });
    res.json(database_1.default.get_user(user.id));
});
router.post('/verify', async (req, res) => {
    const { user_id } = req.body;
    res.json(await database_1.default.exist_user(user_id));
});
exports.default = router;
