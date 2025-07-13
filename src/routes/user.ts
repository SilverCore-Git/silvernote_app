import express, { Request, Response } from 'express';
const router = express.Router();

import db from '../assets/ts/database';


// route de création de session
router.post('/session/create', async (req: Request, res: Response) => {

  const { platform, userId } = req.body; // platform => app type (web, electron, capacitor)
  let sessions; 

  if (!userId) return

  try {

    if (!await db.exist_user(userId)) db.add_user(userId);

    sessions = await db.new_session(userId);

    if (platform == 'web') {

      res.cookie('session_id', sessions.id, {
        httpOnly: false,
        secure: false, // remettre true apres
      });

      res.cookie('user_id', userId, {
        httpOnly: false,
        secure: false, // remettre true apres
      });

      res.cookie('_platform', 'web', {
        httpOnly: false,
        secure: false, // remettre true apres
      });

    }

  }
  catch (err) {
    res.json({ error: true, message: err });
    throw err;
  }

  res.json(sessions);

})

// route de fermeture de session
router.post('/session/close', async (req: Request, res: Response) => {

  const session_id: any = req.cookies.session_id;

  const sessions = await db.verify_session(session_id);
  
  if (sessions) {

    const close = await db.close_session(session_id)

    res.clearCookie('session_id');

    res.clearCookie('user_id');

    res.json(close);

  }

})


// route de vérification de session
router.post('/session/verify', async (req: Request, res: Response) => {

  const session_id = req.cookies.session_id;

  const sessions: boolean = await db.verify_session(session_id);
  
  res.json(sessions);

})


export default router;