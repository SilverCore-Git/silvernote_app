const express = require('express');
const router = express.Router();

const user_accounts = [
  { passwd: "mon_pass", mail: "fds@fds.fds", name: "jean", data: { d: "data", access: {} } },
  { passwd: "passwd", mail: "mail@mail.mail", name: "michel", data: { d: "data", access: {} } }
];

router.get('/', (req, res) => {
  res.json({ message: '/user' });
});

router.post('/create/access', (req, res) => {

  const { passwd, mail } = req.body;

  if (passwd && mail) {

    const account = user_accounts.filter(user => user.mail == mail && user.passwd == passwd)[0];

    if (account && account.passwd == passwd && account.mail == mail) {

      account.access = { access_key: , open: true,  }
      
    } 
    else
    {
      res.status(402).json({ error: true, message: "Donnée de connections incorect." });
    };

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