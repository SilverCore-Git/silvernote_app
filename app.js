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


app.get('/', (req, res) => {
  res.send('le teste en sah !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
});


// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
