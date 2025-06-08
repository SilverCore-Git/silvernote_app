"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const token_1 = __importDefault(require("../assets/ts/token"));
;
const user_accounts = [
    { passwd: "mon_pass", mail: "fds@fds.fds", name: "jean", data: { user_key: '9e85834271241421d99e06a1c230419a', d: "data", access: { token: '', open: false, date: -1 } } },
    { passwd: "passwd", mail: "mail@mail.mail", name: "michel", data: { user_key: '8a6db5829db4fb1e523b2546f5786931', d: "data", access: { token: '', open: false, date: -1 } } }
];
router.get('/', (req, res) => {
    res.json({ message: '/user' });
});
router.post('/session/create', (req, res) => {
    const { passwd, mail } = req.body;
    if (passwd && mail) {
        const account = user_accounts.filter(user => user.mail == mail && user.passwd == passwd)[0];
        if (account && account.passwd == passwd && account.mail == mail) {
            account.data.access = { token: token_1.default.create(account), open: true, date: new Date().getDate() };
            res.status(201).json({ success: true, key: account.data.access.token });
        }
        else {
            res.status(402).json({ error: true, message: "Donnée de connections incorect." });
        }
        ;
    }
    ;
});
router.post('/session/verify', (req, res) => {
    const { token } = req.body;
    try {
        const session = token_1.default.verify(token);
        if (session) {
            res.status(201).json(session);
        }
    }
    catch (err) {
    }
    ;
});
router.post('/login', (req, res) => {
    const { passwd, mail } = req.body;
    if (passwd && mail) {
        const account = user_accounts.filter(user => user.mail == mail && user.passwd == passwd)[0];
        if (account && account.passwd == passwd && account.mail == mail) {
            res.status(200).json({ success: true, message: "Connecté avec success", data: account });
        }
        else {
            res.status(402).json({ error: true, message: "Donnée de connections incorect." });
        }
        ;
    }
    ;
});
exports.default = router;
