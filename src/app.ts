import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import 'dotenv/config';
import AuthMiddleware from './middleware/AuthMiddleware';

import pkg from './package.json';
import config from './config.json';

// Import des routes
import api from './routes/api';
import api_db from './routes/api.db';
import api_ai from './routes/api.ai';
import user from './routes/user';
import money from './routes/money';
import admin from './routes/admin';

const app = express();
export const httpServer = createServer(app);
import './ws'; 

// Middlewares
app.use(cors(config.corsOptions));
app.use(cookieParser(process.env.COOKIE_SIGN_KEY));
app.use(morgan('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(AuthMiddleware);


// Routes
app.use('/api', api);
app.use('/api/ai', api_ai);
app.use('/api/db', api_db);
app.use('/user', user);
app.use('/admin', admin);
app.use('/money', money);



app.get('/version', (req, res) => {
  res.json({ v: pkg.version })
})


// 404
app.use((req: Request, res: Response) => {

  res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});






// Démarrage serveur
httpServer.listen(config.PORT, () => {
  console.log(`Serveur Express + WebSocket sur le port ${config.PORT}`);
});

