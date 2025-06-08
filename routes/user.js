
const express = require('express');
const router = express.Router();

const Token = require('../assets/js/token');

const user_accounts = [
  { passwd: "mon_pass", mail: "fds@fds.fds", name: "jean", data: { user_key: '9e85834271241421d99e06a1c230419a', d: "data", access: {} } },
  { passwd: "passwd", mail: "mail@mail.mail", name: "michel", data: { user_key: '8a6db5829db4fb1e523b2546f5786931', d: "data", access: {} } }
];

router.get('/', (req, res) => {
  res.json({ message: '/user' });
});

router.post('/session/create', async (req, res) => {

  const { passwd, mail } = req.body;

  if (passwd && mail) {

    const account = user_accounts.filter(user => user.mail == mail && user.passwd == passwd)[0];

    if (account && account.passwd == passwd && account.mail == mail) {

      account.access = { token: await Token.create(account), open: true, date: new Date() };

      res.status(201).json({ success: true, key: account.access.token });
      
    } 
    else
    {
      res.status(402).json({ error: true, message: "Donnée de connections incorect." });
    };

  };

});

router.post('/session/verify', (req, res) => {

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


router.post('/login', (req, res) => {

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


module.exports = router;