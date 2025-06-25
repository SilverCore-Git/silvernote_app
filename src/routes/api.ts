import { Router, Request, Response } from 'express';

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

export default router;
