const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
require('dotenv').config();
require('./database');

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.get('/', (req, res) => {
    res.send('world hello');
});

const routes = require('./routes/routes');
app.use('/api', routes);

app.use(express.json());

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    
});

module.exports = app;
