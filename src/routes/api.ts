import { Router, Request, Response } from 'express';
import fs from 'fs';
import type { News } from '../assets/ts/types';
import path from 'path';
import JsonListManager from '../assets/ts/db_json_manager';
import { randomUUID } from 'crypto';
import notes from '../assets/ts/notes';

const router = Router();


router.get('/get_news', async (req: Request, res: Response) => {

    const data = await fs.promises.readFile(path.join(__dirname, '../config.json'), 'utf-8');
    const news: Promise<News> = JSON.parse(data).news;

    res.json( (await news).active ? news : false );

})



// partage de notes
const share = new JsonListManager('share');

interface Share { 

    user_id: string;
    uuid: string;
    note_uuid: string;

    parms: {
        life: number; // age en milliseconde
        passwd?: string;
    }

    created_at: string;

    visitor: string[]; // user ids
    banned: string[]; // user ids

}

router.get('/share/:uuid/:visitor_userid', async (req, res) => {

    const { uuid, visitor_userid } = req.params;
    const passwd = req.query.passwd;

    const TheShare = await share.getByUUID(uuid);

    if (TheShare) {

        if (TheShare.parms.passwd && TheShare.parms.passwd !== passwd) {
            res.json({ success: false, need: 'passwd' });
            return;
        }

        if (TheShare.banned.includes(visitor_userid)) {
            res.json({ success: false, banned: true });
            return;
        }

        TheShare.visitor.push(visitor_userid);

        await share.update(TheShare);

        const note = await notes.getNoteByUUID(TheShare.note_uuid);

        res.json({ success: true, note });

    }

})

router.get('/share/data', async (req, res) => {
    
    const { uuid } = req.body;

    res.json({ share: await share.getByUUID(uuid) });
    return;

})

router.post('/share', async (req, res) => {

    const { user_id, note_uuid, parms } = req.body;

    try {

        const TheShare: Share = await share.push({

            uuid: randomUUID(),
            user_id,
            note_uuid,

            parms,

            created_at: new Date().toString(),

            visitor: [],
            banned: [],

        })

        res.json({ success: true, share: TheShare });
        return;

    }

    catch (err) {
        res.json({ error: true, message: err });
        return;
    }

})

router.post('/share/banned', async (req, res) => {

    const { uuid, banned_id } = req.body;

    try {

        const TheShare = await share.getByUUID(uuid);

        if (TheShare) {

            TheShare.banned.push(banned_id);

            await share.update(TheShare);

            res.json({ success: true, share: TheShare });
            return;

        }

        res.json({ success: false });
        return;

    }

    catch (err) {
        res.json({ error: true, message: err });
        return;
    }

})


export default router;
