import express, { Request, Response } from 'express';
const router = express.Router();

import Token from '../assets/ts/token';

interface User {
  passwd: string;
  mail: string;
  name: string;
  data: { 
    user_key: string;
    d: string;
    access: {
      token: string;
      open: boolean;
      date: number;
    };
  };
};

const user_accounts: User[] = [
  { passwd: "mon_pass", mail: "fds@fds.fds", name: "jean", data: { user_key: '9e85834271241421d99e06a1c230419a', d: "data", access: { token: '', open: false, date: -1 } } },
  { passwd: "passwd", mail: "mail@mail.mail", name: "michel", data: { user_key: '8a6db5829db4fb1e523b2546f5786931', d: "data", access: { token: '', open: false, date: -1 } } }
];

router.get('/', (req: Request, res: Response) => {
  res.json({ message: '/user' });
});

router.post('/session/create', (req: Request, res: Response): void => {

  const { passwd, mail } = req.body;

  if (passwd && mail) {

    const account = user_accounts.filter(user => user.mail == mail && user.passwd == passwd)[0];

    if (account && account.passwd == passwd && account.mail == mail) {

      account.data.access = { token: Token.create(account), open: true, date: new Date().getDate() };

      res.status(201).json({ success: true, key: account.data.access.token });
      
    } 
    else
    {
      res.status(402).json({ error: true, message: "Donnée de connections incorect." });
    };

  };

});

router.post('/session/verify', (req: Request, res: Response): any => {

  const { token } = req.body;

  try {

    const session = Token.verify(token);

    if (session) {
      res.status(201).json(session);
    }

  }
  catch (err) {

  };

});


router.post('/login', (req: Request, res: Response): any => {

  const { passwd, mail } = req.body;

  if (passwd && mail) {

    const account = user_accounts.filter(user => user.mail == mail && user.passwd == passwd)[0];

    if (account && account.passwd == passwd && account.mail == mail) {
      res.status(200).json({ success: true, message: "Connecté avec success", data: account });
    } 
    else
    {
      res.status(402).json({ error: true, message: "Donnée de connections incorect." });
    };

  };

});


export default router;