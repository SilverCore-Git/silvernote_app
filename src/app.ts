import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import Token from './assets/ts/token';
import 'dotenv/config'

import config from './config.json';

const app = express();
const PORT: number = config.PORT;

// Middlewares
//app.use(clerkMiddleware())
app.use(cors(config.corsOptions));
app.use(cookieParser(process.env.COOKIE_SIGN_KEY)); 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {

  try {

    let token = req.cookies.api_token;

    if (!token) {
      token = await Token.create();
      res.cookie('api_token', token, { maxAge: 12 * 60 * 3600 * 100, httpOnly: true });
    }

    const verify = await Token.verify(token);

    if (!verify) {
      token = await Token.create();
      res.cookie('api_token', token, { maxAge: 12 * 60 * 3600 * 100, httpOnly: true });
    }

    next();

  } catch (err) {
    res.status(500).json({ error: true, message: err });
    return;
  }
});



// Import routes
import api from './routes/api';
import api_db from './routes/api.db';
import api_ai from './routes/api.ai';
import user from './routes/user';
import money from './routes/money';

app.use('/api', api);
app.use('/api/ai', api_ai);
app.use('/api/db', api_db);
app.use('/user', user);
app.use('/money', money);

// err 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
