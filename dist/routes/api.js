"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../assets/ts/database"));
const notes_1 = __importDefault(require("../assets/ts/notes"));
const tags_1 = __importDefault(require("../assets/ts/tags"));
const router = (0, express_1.Router)();
router.get('/get_news', async (req, res) => {
    const data = await fs_1.default.promises.readFile(path_1.default.join(__dirname, '../config.json'), 'utf-8');
    const news = JSON.parse(data).news;
    res.json((await news).active ? news : false);
});
router.post('/save/db/notes', async (req, res) => {
    const { notes } = req.body;
    const user_id = req.cookies.user_id;
    const session_id = req.cookies.session_id;
    if (!await database_1.default.verify_session(session_id)) {
        res.json({ error: true, message: 'Error on session verfication.' });
        return;
    }
    const save = await notes_1.default.save_notes(user_id, notes);
    res.json(save);
});
router.post('/save/db/tags', async (req, res) => {
    const { tags } = req.body;
    const user_id = req.cookies.user_id;
    const session_id = req.cookies.session_id;
    if (!await database_1.default.verify_session(session_id)) {
        res.json({ error: true, message: 'Error on session verfication.' });
        return;
    }
    const save = await tags_1.default.save_tags(user_id, tags);
    res.json(save);
});
exports.default = router;
