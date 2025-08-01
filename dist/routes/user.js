"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const database_1 = __importDefault(require("../assets/ts/database"));
// route de gestion de plan
router.post('/plan/set', async (req, res) => {
    const { userId, planId, plan_data } = req.body;
    let sessions;
    if (!userId || !planId)
        return;
    try {
        await database_1.default.set_user_plan(userId, planId, plan_data);
        res.cookie('plan_id', planId, {
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
exports.default = router;
