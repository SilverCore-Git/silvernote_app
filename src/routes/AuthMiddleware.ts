import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const jwt_key: string | undefined = process.env.JWT_SIGN_KEY;

export default function  AuthMiddleware (req: Request, res: Response, next: NextFunction) {

    
    const token: string | undefined = req.cookies.back_JWT;
    const user_id: string | undefined = req.cookies.user_id;
    
    if (!user_id) return next();

    if (!token) {

        const token = jwt.sign(
            { user_idId: user_id }, 
            jwt_key,
            { expiresIn: "1h" }
        )

        res.cookie("back_JWT", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.redirect(req.host+'/'+req.path);

    }

    else {

        const decoded_jwt = jwt.verify(token, jwt_key);

        if (user_id == decoded_jwt.user_id) return next();
        res.json({ error: true, message: "Invalid token" })

    }

    next();

}