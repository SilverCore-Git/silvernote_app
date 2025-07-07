import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import config from './config.json';

const app = express();
const PORT: number = config.PORT;

// Middlewares
app.use(cors(config.corsOptions));
app.use(cookieParser('ma_clé_de_signature')); 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public', 'index.html')));

// Import routes
import api from './routes/api';
import user from './routes/user';

app.use('/', api);
app.use('/user', user);


// err 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
