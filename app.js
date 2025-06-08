const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const config = require('./config.json');

const app = express();
const PORT = config.PORT;


app.use(cors(config.corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 


const api = require('./routes/api');
const user = require('./routes/user');

app.use('/api', api);
app.use('/user', user);

app.get('/', (req, res) => {
  res.send('/');
});


// 404
app.use((req, res) => {
  res.status(404).json({ route: req.path, error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
