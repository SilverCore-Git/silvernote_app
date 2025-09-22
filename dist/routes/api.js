"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_json_manager_1 = __importDefault(require("../assets/ts/db_json_manager"));
const notes_1 = __importDefault(require("../assets/ts/notes"));
const express_2 = require("@clerk/express");
const router = (0, express_1.Router)();
router.get('/get_news', async (req, res) => {
    const data = await fs_1.default.promises.readFile(path_1.default.join(__dirname, '../config.json'), 'utf-8');
    const news = JSON.parse(data).news;
    res.json((await news).active ? news : false);
});
// partage de notes
const share = new db_json_manager_1.default('share.json');
const delete_a_share = (uuid) => {
    setTimeout(async () => {
        await share.delete(uuid);
    }, 1 * 60 * 2600 * 100);
};
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
        if (!TheShare.visitor.includes(visitor_userid))
            TheShare.visitor.push(visitor_userid);
        await share.update(TheShare);
        const createdTime = new Date(TheShare.created_at).getTime();
        const now = Date.now();
        const isExpired = now - createdTime > TheShare.parms.life;
        if (isExpired) {
            share.delete(uuid);
            res.json({ expired: isExpired });
            delete_a_share(TheShare.uuid);
            return;
        }
        const note = await notes_1.default.getNoteByUUID(TheShare.note_uuid);
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
        res.json({ error: true, message: 'Partage non trouvée.' });
    }
});
router.get('/share/data', async (req, res) => {
    const { uuid } = req.body;
    res.json({ share: await share.getByUUID(uuid) });
    return;
});
router.post('/share', async (req, res) => {
    const { note_uuid, parms } = req.body;
    const user_id = req.cookies.user_id;
    try {
        if (await share.getByUUID(note_uuid)) {
            await share.delete(note_uuid);
        }
        const TheShare = await share.push({
            uuid: note_uuid,
            user_id,
            note_uuid,
            parms,
            created_at: new Date().toString(),
            visitor: [],
            banned: [],
        });
        res.json({ success: true, share: TheShare });
        return;
    }
    catch (err) {
        res.json({ error: true, message: err });
        return;
    }
});
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
});
router.get('/share/for/me', async (req, res) => {
    const { user_id } = req.cookies;
    try {
        const share_db = await share.getAll();
        const share_for_me = share_db.filter(share => share.visitor.includes(user_id));
        if (share_for_me.length) {
            let shared_notes = [];
            for (const share of share_for_me) {
                const note = (await notes_1.default.getNoteByUUID(share.note_uuid)).note;
                if (!note)
                    continue;
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
});
router.get('/user/by/id/:userid', async (req, res) => {
    const userid = req.params.userid;
    const client_userId = req.cookies.user_id;
    const user = await express_2.clerkClient.users.getUser(userid);
    res.json({
        isMe: client_userId == userid,
        user_id: userid,
        username: user.username,
        imageUrl: user.imageUrl
    });
});
exports.default = router;
