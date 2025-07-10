import express, { Request, Response } from 'express';
const router = express.Router();

import db from '../assets/ts/database';


// route de création de session
router.post('/session/create', async (req: Request, res: Response) => {

  const { user_id, platform } = req.body; // id => user id || type => app type (web, electron, capacitor)

  const sessions = await db.new_session(user_id);

  if (platform == 'web') {

    res.cookie('session_id', sessions.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('user_id', user_id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('_platform', 'web', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

  }

  res.json(sessions);

})

// route de fermeture de session
router.post('/session/close', async (req: Request, res: Response) => {

  const session_id = req.cookies.session_id;

  const sessions = await db.verify_session(session_id);
  
  if (sessions) {

    const close = await db.close_session(session_id)


    res.clearCookie('session_id', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('user_id', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.json(close);

  }

})


// route de vérification de session
router.post('/session/verify', async (req: Request, res: Response) => {

  const session_id = req.cookies.session_id;

  const sessions = await db.verify_session(session_id);
  
  res.json(sessions);

})


export default router;