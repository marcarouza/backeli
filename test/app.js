const express = require('express');
const app = express();

// Configuration des middlewares
app.use(express.json());
// Montage des routes
app.use('/api/mailContact', require('../controllers/routesControl'));

// Autres configurations ...

// Exportation de l'app pour le tester ou démarrer le serveur
module.exports = app;
