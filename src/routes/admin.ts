import { Router, Request, Response, NextFunction } from 'express';
import db from '../assets/ts/database';

const router = Router();


function verify_auth (req: Request, res: Response, next: NextFunction) {

    const sk = process.env.secret_admin_api_key;
    const apiKey = req.headers["authorization"];

    if (apiKey && sk && apiKey == sk) {
        next();
        return;
    }

    res.json({ error: true, message: 'Need api key' })
    return;

}


router.get('/users', verify_auth, async (req, res) => {
    res.json({ users: await db.get_all_users() });
})


export default router;
