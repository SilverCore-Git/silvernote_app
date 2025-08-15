import { Router, Request, Response } from 'express';
import fs from 'fs';
import type { News } from '../assets/ts/types';
import path from 'path';
import OpenAI from "openai";
const AIclient = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY });

import db from '../assets/ts/database';
import Notes from '../assets/ts/notes';
import Tags from '../assets/ts/tags';

const router = Router();


router.get('/get_news', async (req: Request, res: Response) => {

    const data = await fs.promises.readFile(path.join(__dirname, '../config.json'), 'utf-8');
    const news: Promise<News> = JSON.parse(data).news;

    res.json( (await news).active ? news : false );

})


router.post('/save/db/notes', async (req: Request, res: Response) => {

    const { notes } = req.body;
    const user_id = req.cookies.user_id;
    const session_id = req.cookies.session_id;

    if (!await db.verify_session(session_id)) {
        res.json({ error: true, message: 'Error on session verfication.' });
        return;
    }

    const save = await Notes.save_notes(user_id, notes);

    res.json(save);

})


router.post('/save/db/tags', async (req: Request, res: Response) => {

    const { tags } = req.body;
    const user_id = req.cookies.user_id;
    const session_id = req.cookies.session_id;

    if (!await db.verify_session(session_id)) {
        res.json({ error: true, message: 'Error on session verfication.' });
        return;
    }

    const save = await Tags.save_tags(user_id, tags);

    res.json(save);

})


router.post('/ai/prompt', async (req: Request, res: Response) => {

    const { prompt } = req.body;

    const input = `Parle francais sauf instruction contraire dans cette demande : ` + prompt

    const response = AIclient.responses.create({
        model: 'gpt-5-mini',
        input
    })

    res.json({ input: prompt, output: (await response).output_text });

})

router.post('/ai/minify', async (req: Request, res: Response) => {
    
    const { note } = req.body;

    if (!note) return;

    const input: string = `Parle francais, voici une note ecrit en html, prise sur l'app de prise de note silvernote. tu dois la resumé de maniere inteligente, organiser et claire, t'a reponse ne doit contenir que la note résumé : ${note}`;

    const response = AIclient.responses.create({
        model: 'gpt-5-mini',
        input
    })

    res.json({ input, output: (await response).output_text });

})



export default router;
