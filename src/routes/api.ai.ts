import { UUID, randomUUID } from 'crypto';
import { Router, Request, Response, NextFunction } from 'express';
import OpenAI from "openai";
import { prompt_system } from '../assets/config/jeremy_ai.json';
import db from '../assets/ts/database';
import notes_db from '../assets/ts/notes';
import * as Y from 'yjs';
import { io } from 'socket.io-client';
import tags_db from '../assets/ts/tags';
const AIclient = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

const router = Router();
const socket = io('http://localhost:3000', { path: "/socket.io/share" });
socket.on('connect', () => {
  console.log('Connected to ws');
});

type Chat = { uuid: UUID, userID: string, data: { notes: any, tags: any }, messages: { role: "system" | "user" | "assistant", content: string  }[] }
let chats: Chat[]  = [];


function verify_auth (req: Request, res: Response, next: NextFunction) {

    const sk = process.env.SECRET_AI_API_KEY;
    const apiKey = req.headers["authorization"];

    if (apiKey && sk && apiKey == sk) {
        next();
        return;
    }

    res.json({ error: true, message: 'Need api key' })
    return;

}

function write_on_note({ uuid, content }: { uuid: string; content: string }) {

    const ydoc = new Y.Doc();
    const ytext = ydoc.getText('note');

    socket.emit('join-room', { room: uuid })

    ytext.delete(0, ytext.length)
    ytext.insert(0, content)

    const update = Y.encodeStateAsUpdate(ydoc)

    socket.emit('y-update', update)

}



router.post('/create', verify_auth, async (req: Request, res: Response) => {

    const { user } = req.body;

    try {

        const notes = await notes_db.getNoteByUserId(user.id);
        const tags = await tags_db.getTagsByUserId(user.id);

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


router.post('/close', verify_auth, async (req: Request, res: Response) => {

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

router.post('/send', verify_auth, async (req: Request, res: Response) => {

    const { uuid, message } = req.body;
    const note = req.body?.note || undefined;

    try {

        const chat = chats.find(chat => chat.uuid == uuid);

        if (!chat) {
            res.json({ error: true, message: 'Chat non trouvé' });
            return;
        }

        let prompt: string = '';

        if (!note) {
            prompt = `Message de l'utilisateur : ${message}`;
        }
        else {
            const notes = await notes_db.getNoteByUUID(note);
            prompt = `Note ouverte : ${JSON.stringify(notes)}\n Message de l'utilisateur : ${message}`;
        }
 
        chat.messages.push({
            role: 'user',
            content: prompt
        });

        const stream = await AIclient.chat.completions.create({
            model: "gpt-5-mini",
            messages: chat.messages,
            stream: true
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();
        res.socket?.setNoDelay(true);

        let assistantMessage: string = "";
        let buffer: string = '';

        for await (const chunk of stream) {

            const token = chunk.choices[0]?.delta?.content || "";
            if (!token) continue;

            assistantMessage += token;
            buffer += token;

            const itsJSON = buffer.trim().startsWith('{');

            if (itsJSON) {

                try {

                    const jsonAction = JSON.parse(buffer);
                    res.write(`data: ${JSON.stringify(jsonAction.response).replace('"', '')}\n\n`);
                    
                    if (jsonAction.action == "edit.note.content") {
                        console.log('editing note : ', jsonAction.uuid)
                        write_on_note({
                            uuid: jsonAction.uuid,
                            content: jsonAction.content
                        });
                        
                    }
                    
                    buffer = "";
                } catch (e) {}

            } else {
                res.write(`data: ${token}\n\n`);
            }

        }

        chat.messages.push({
            role: 'assistant',
            content: assistantMessage
        });

        res.write("data: [DONE]\n\n");

        res.end();

    } catch (err) {
        res.status(500).json({ error: true, message: err });
    }

});




export default router;
