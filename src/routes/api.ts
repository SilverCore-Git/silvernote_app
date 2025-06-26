import { Router, Request, Response } from 'express';

import db from '../assets/ts/database';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'route api' });
});

router.get('/get_news', (req: Request, res: Response) => {
  res.json({
    message: 'Un message passionant : lorem ipsum',
    title: 'le titre',
    btn: false,
    href: ''
  })
})

router.post('/save_db', async (req: Request, res: Response) => {

  const { Notes, Tags, user } = req.body;

  db.push(Notes, Tags, user)
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => { 
      res.json({ error: true, message: err }); 
    })

})

router.post('/get_db', (req: Request, res: Response) => {

  const { user } = req.body;
  res.json(db.get(user));

})

export default router;
