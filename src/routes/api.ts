import { Router, Request, Response } from 'express';
import fs from 'fs';
import type { News, Note } from '../assets/ts/types';
import path from 'path';
import JsonListManager from '../assets/ts/db_json_manager';
import notes from '../assets/ts/notes';
import { clerkClient } from "@clerk/express";
import { randomUUID } from 'crypto';

const router = Router();


router.get('/get_news', async (req: Request, res: Response) => {

    const data = await fs.promises.readFile(path.join(__dirname, '../config.json'), 'utf-8');
    const news: Promise<News> = JSON.parse(data).news;

    res.json( (await news).active ? news : false );

})

router.get('/uuid', (req, res) => {
    res.json({ id: randomUUID() })
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
        editable: boolean;
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
            share.delete(uuid);
            res.json({ expired: isExpired });
            delete_a_share(TheShare.uuid);
            return;
        }

        const note = await notes.getNoteByUUID(TheShare.note_uuid);

        res.json({ 
            success: true, 
            editable: TheShare.parms.editable, 
            note: note.note, 
            user_id: TheShare.user_id,
            visitor: TheShare.visitor
        });
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

        if (await share.getByUUID(note_uuid)) {
            await share.delete(note_uuid);
        }

        const TheShare: Share = await share.push({

            uuid: note_uuid,
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

router.get('/share/for/me', async (req, res) => {

    const { user_id } = req.cookies;

    try {

        const share_db: Share[] = await share.getAll();

        const share_for_me: Share[] = share_db.filter(share => share.visitor.includes(user_id) || share.user_id == user_id);

        if (share_for_me.length) {

            let shared_notes: Note[] = [];

            for (const share of share_for_me) {

                const note: Note | undefined = (await notes.getNoteByUUID(share.note_uuid)).note;

                if (!note) continue;
                shared_notes.push(note);

            }

            res.json({ length: shared_notes.length, notes: shared_notes });

        }
        else {
            res.json({ length: 0, notes: null });
            return;
        }

    }
    catch (err) {
        res.json({ error: true, message: err });
        return;
    }

})


router.get('/user/by/id/:userid', async (req, res) => {

    const userid: string = req.params.userid;
    const client_userId = req.cookies.user_id;

    const user = await clerkClient.users.getUser(userid);

    res.json({ 
        isMe: client_userId == userid,
        user_id: userid,
        username: user.username,
        imageUrl: user.imageUrl 
    });

})


export default router;
