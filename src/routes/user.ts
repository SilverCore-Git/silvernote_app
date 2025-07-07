import express, { Request, Response } from 'express';
const router = express.Router();

import db from '../assets/ts/database';

// route de création de session
router.post('/session/create', async (req: Request, res: Response) => {

  const { id } = req.body;

  const sessions = await db.new_session(id);

})


export default router;