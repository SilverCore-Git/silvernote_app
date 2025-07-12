"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get('/get_news', async (req, res) => {
    const data = await fs_1.default.promises.readFile(path_1.default.join(__dirname, '../config.json'), 'utf-8');
    const news = JSON.parse(data).news;
    res.json((await news).active ? news : false);
});
exports.default = router;
