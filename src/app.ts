import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import config from './config.json';

const app = express();
const PORT: number = config.PORT;

// Middlewares
app.use(cors(config.corsOptions)); 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, 'public', 'index.html')));

// Import des routes
import api from './routes/api';
import user from './routes/user';

app.use('/', api);
app.use('/user', user);

// Middleware 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
