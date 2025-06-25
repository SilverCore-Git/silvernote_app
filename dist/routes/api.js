"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
exports.default = router;
