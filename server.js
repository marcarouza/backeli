// src/server.js

// 1. Charger les variables d’environnement
require('dotenv').config();

// 2. Importer les dépendances
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const useragent = require('express-useragent');
const path = require('path');
const history = require('connect-history-api-fallback');

// 3. Importer middlewares et routes
const checkLoggedUser = require('./middlewares/authMiddle');
const routes = require('./controllers/routesControl');

// 4. Créer l’app Express
const app = express();

// 5. CORS (autorise ton domaine + localhost + Postman/Curl)
app.use(
	cors({
		origin(origin, cb) {
			if (!origin) return cb(null, true);

			// On autorise eliazoura.fr, localhost, tous les sous-domaines de render.com et onrender.com
			const pattern =
				/^https?:\/\/(?:www\.)?(eliazoura\.fr|localhost|[\w-]+\.(?:render|onrender)\.com)(?::\d+)?$/;

			pattern.test(origin)
				? cb(null, true)
				: cb(new Error(`Origin ${origin} non autorisée`));
		},
		methods: ['GET', 'POST'],
		credentials: true,
	})
);
 

// 6. Parser JSON, urlencoded, cookies, user-agent
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(useragent.express());

// 7. Gestion de session (si tu l’utilises)
app.use(
	session({
		secret: process.env.JET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
		},
	})
);

// 8. Debug : log des headers de chaque requête
app.use((req, res, next) => {
	console.log('>> Headers:', req.headers);
	next();
});

// 9. Connexion à MongoDB
const {uriMEMBRES} = require('./config/MongoConfig');
mongoose
	.connect(uriMEMBRES)
	.then(() => console.log('✅ MongoDB connecté:', mongoose.connection.name))
	.catch((err) => console.error('❌ Erreur BDD :', err));

// 10. Authentification globale (protège les routes suivantes)
app.use(checkLoggedUser);

// 11. Routes API
app.use('/api', routes);

// 12. History-fallback pour le mode history de Vue Router
//    => toute URL non /api/* renvoie index.html
app.use(
	history({
		index: '/index.html',
		verbose: true,
	})
);

// 13. Fichiers statiques (public et build Vue)
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'dist')));

// 14. Catch-all (renvoi index.html si jamais history ne l’a pas fait)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 15. Gestionnaire d’erreurs (dernier middleware)
/*
app.use((err, req, res, next) => {
  console.error('💥 Erreur globale :', err)
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  })
})
*/

// 16. Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
	console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
);
