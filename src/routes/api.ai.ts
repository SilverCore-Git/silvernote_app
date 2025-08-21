import { UUID, randomUUID } from 'crypto';
import { Router, Request, Response } from 'express';
import OpenAI from "openai";
import { prompt_system } from '../assets/config/jeremy_ai.json';
import db from '../assets/ts/database';
const AIclient = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

const router = Router();

let chats: { uuid: UUID, userID: string, messages: { role: "system" | "user" | "assistant", content: string }[] }[] = [];



router.post('/create', async (req: Request, res: Response) => {

    const { userID } = req.body;

    try {

        if (!await db.get_user(userID)) res.status(400).json({ error: true, message: 'Utilisateur introuvable.' });

        chats.push({ 
            uuid: randomUUID(),
            userID,
            messages: [
                { role: "system", content: prompt_system }
            ]
        })

        res.json({ success: true })

    }
    catch (err) {
        res.status(500).json({ error: true, message: err })
    }

    
});


router.post('/close', async (req: Request, res: Response) => {

    const { uuid, userID } = req.body;

    try {

        if (!await db.get_user(userID)) res.status(400).json({ error: true, message: 'Utilisateur introuvable.' });

        chats = chats.filter(chat => chat.uuid !== uuid);

        res.json({ success: true })

    }

    catch (err) {
        res.status(500).json({ error: true, message: err })
    }

});


router.post('/send', async (req: Request, res: Response) => {

    const { uuid, userID, message } = req.body;

    try {

        if (!await db.get_user(userID)) res.status(400).json({ error: true, message: 'Utilisateur introuvable.' });

        const chat = chats.find(chat => chat.uuid == uuid && chat.userID == userID);
        if (!chat) res.json({ error: true, message: 'idk // chat is not defined' })
        
        chat!.messages.push({
            role: 'user',
            content: message
        })

        const response = await AIclient.chat.completions.create({
            model: "gpt-5-mini",
            messages: chat!.messages
        });

        res.json({ output: response.choices[0].message.content, allout: response.choices })

    }

    catch (err) {
        res.status(500).json({ error: true, message: err })
    }

});



export default router;
