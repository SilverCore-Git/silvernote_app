import { UUID, randomUUID } from 'crypto';
import { Router, Request, Response } from 'express';
import OpenAI from "openai";
import { prompt_system } from '../assets/config/jeremy_ai.json';
import db from '../assets/ts/database';
const AIclient = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

const router = Router();

type Chat = { uuid: UUID, userID: string, data: { notes: any, tags: any }, messages: { role: "system" | "user" | "assistant", content: string  }[] }
let chats: Chat[]  = [];


router.post('/create', async (req: Request, res: Response) => {

    const { user, notes, tags } = req.body;

    try {

        if (!await db.exist_user(user.id)) {
            res.status(400).json({ 
                error: true, 
                message: 'Utilisateur introuvable.', 
                exist_user: await db.exist_user(user.id), 
                user_id: user.id
            });
            return;
        }

        const session: Chat = { 
            uuid: randomUUID(),
            userID: user.id,
            data: {
                notes,
                tags
            },
            messages: [
                { 
                    role: "system", 
                    content: `${prompt_system}. L'utilisateur se nome : ${user.fullName}. Voici les donnés de l'utilisateur en format json : notes: ${JSON.stringify(notes)} tags: ${JSON.stringify(tags)}` 
                }
            ]
        }

        chats.push(session)

        res.json({ success: true, session })

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

    const { uuid, message } = req.body;

    try {

        const chat = chats.find(chat => chat.uuid == uuid);

        if (!chat) { 
            res.json({ error: true, message: 'idk // chat is not defined' })
        }

        else {

            chat!.messages.push({
                role: 'user',
                content: message
            })

            const response = await AIclient.chat.completions.create({
                model: "gpt-5-mini",
                messages: chat!.messages
            });

            chat!.messages.push({
                role: 'assistant',
                content: response.choices[0].message.content || ''
            })

            res.json({ success: true, output: response.choices[0].message.content, allout: response.choices, chat: chat?.messages })

        }

    }

    catch (err) {
        res.status(500).json({ error: true, message: err })
    }

});



export default router;
