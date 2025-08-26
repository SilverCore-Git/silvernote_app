import { Router, Request, Response } from 'express';
import fs from 'fs';
import type { News, Note } from '../assets/ts/types';
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
const share = new JsonListManager('share.json');

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

const delete_a_share = (uuid: string) => {
    setTimeout(async () => {
        await share.delete(uuid);
    }, 1 * 60 * 2600 * 100)
}

router.get('/share/:uuid', async (req, res) => {

    const { uuid } = req.params;
    const passwd = req.query.passwd;
    const visitor_userid = req.cookies.user_id;

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

        if (!TheShare.visitor.includes(visitor_userid)) TheShare.visitor.push(visitor_userid);

        await share.update(TheShare);

        const createdTime = new Date(TheShare.created_at).getTime();
        const now = Date.now();
        const isExpired: boolean = now - createdTime > TheShare.parms.life;

        if (isExpired) {
            res.json({ expired: isExpired });
            delete_a_share(TheShare.uuid);
            return;
        }

        const note = await notes.getNoteByUUID(TheShare.note_uuid);

        res.json({ success: true, note: note.note });
        return;

    }
    else {
        res.json({ error: true, message: 'Partage non trouvée.' })
    }

})

router.get('/share/data', async (req, res) => {
    
    const { uuid } = req.body;

    res.json({ share: await share.getByUUID(uuid) });
    return;

})

router.post('/share', async (req, res) => {

    const { note_uuid, parms } = req.body;
    const user_id = req.cookies.user_id;

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
