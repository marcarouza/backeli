// src/server.js

// 1. Charger les variables d’environnement
require('dotenv').config();

// 2. Importer les dépendances principales
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const path = require('path');

// 3. Importer middleware et routes
const checkLoggedUser = require('./middlewares/authMiddle');
const routes = require('./controllers/routesControl');

// 4. Créer l’app Express
const app = express();

// 5. Configurer CORS (origines limitées à ton domaine)
const corsOptions = {
	origin(origin, callback) {
		if (
			!origin ||
			/^https?:\/\/(www\.)?(eliazoura\.fr|localhost)(?::\d+)?$/.test(
				origin
			)
		) {
			return callback(null, true);
		}
		callback(new Error(`Origin ${origin} non autorisée`));
	},
	methods: ['GET', 'POST'],
	credentials: true,
};
app.use(cors(corsOptions));

// 6. Parser JSON, URL-encoded, cookies et user-agent
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(useragent.express());

// 7. Méthode factice pour tester la session (optionnel, voir ci-dessous)
app.get('/api/session', (req, res) => {
	if (req.session?.views) {
		req.session.views++;
		res.send(`Vues : ${req.session.views}`);
	} else {
		req.session = {views: 1};
		res.send('Première visite !');
	}
});

// 8. Log de debug des headers
app.use((req, res, next) => {
	console.log('Headers:', req.headers);
	next();
});

// 9. Connexion à MongoDB
const {uriMEMBRES} = require('./config/MongoConfig');
mongoose
	.connect(uriMEMBRES)
	.then(() => console.log('MongoDB connecté:', mongoose.connection.name))
	.catch((err) => console.error('Erreur BDD :', err));

// 10. Authentification globale
app.use(checkLoggedUser);

// 11. Fichiers statiques (public, puis build Vue)
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'dist')));

// 12. Routes API et controllers
app.use('/api', routes);

// 13. Toutes les autres requêtes renvoient index.html (SPA)
const indexHtml = path.join(__dirname, 'dist', 'index.html');
app.get('*', (req, res) => res.sendFile(indexHtml));

// 14. Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
	console.log(`Serveur en écoute sur http://localhost:${PORT}`)
);
