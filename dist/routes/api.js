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
            res.json({ expired: isExpired });
            delete_a_share(TheShare.uuid);
            return;
        }
        const note = await notes_1.default.getNoteByUUID(TheShare.note_uuid);
        res.json({ success: true, editable: TheShare.parms.editable, note: note.note });
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
exports.default = router;
