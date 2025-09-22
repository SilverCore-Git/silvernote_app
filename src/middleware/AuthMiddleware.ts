import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

const jwt_key: string = process.env.JWT_SIGN_KEY!;

export default function  AuthMiddleware (req: Request, res: Response, next: NextFunction) {

    
    const token: string | undefined = req.cookies.API_JWT;
    const user_id: string | undefined = req.cookies.user_id;
    
    if (!user_id) return next();

    if (!token) {

        const token = jwt.sign(
            { user_id }, 
            jwt_key,
            { expiresIn: "1h" }
        )

        res.cookie("API_JWT", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        })

        console.log('[AuthMiddleware]> Autantification d\'un nouveau client : \n', JSON.stringify({ agent: req.get("User-Agent"), user_id }, null, 2));

        res.redirect(req.originalUrl);

    }

    else {

        const decoded_jwt = jwt.verify(token, jwt_key) as JwtPayload & { user_id: string };

        if (user_id == decoded_jwt.user_id) return next();

        res.clearCookie('API_JWT');
        console.warn('[AuthMiddleware]> Req mal authantifier, token invalid : \n', JSON.stringify({ agent: req.get("User-Agent"), user_id, decoded_jwt }, null, 2));
        res.json({ error: true, message: "Invalid token" });
        return;

    }

}