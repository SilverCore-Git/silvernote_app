"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../assets/ts/database"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'route api' });
});
router.get('/get_news', (req, res) => {
    res.json({
        message: 'Un message passionant : lorem ipsum',
        title: 'le titre',
        btn: false,
        href: ''
    });
});
router.post('/save_db', async (req, res) => {
    const { Notes, Tags, user } = req.body;
    database_1.default.push(Notes, Tags, user)
        .then(() => {
        res.json({ success: true });
    })
        .catch(err => {
        res.json({ error: true, message: err });
    });
});
router.post('/get_db', (req, res) => {
    const { user } = req.body;
    res.json(database_1.default.get(user));
});
exports.default = router;
