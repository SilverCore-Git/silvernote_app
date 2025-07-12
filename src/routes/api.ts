import { Router, Request, Response } from 'express';
import fs from 'fs';
import type { News } from '../assets/ts/types';
import path from 'path';


const router = Router();

router.get('/get_news', async (req: Request, res: Response) => {

    const data = await fs.promises.readFile(path.join(__dirname, '../config.json'), 'utf-8');
    const news: Promise<News> = JSON.parse(data).news;

    res.json( (await news).active ? news : false );

})

export default router;
