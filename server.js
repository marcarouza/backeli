// 🔹 Chargement des variables d'environnement (en premier)
require('dotenv').config();

// 🔹 Chargement du BACK OFFICE
const {setupApp} = require('./config/backoffice.js/app.js');
const {logger} = require('./config/backoffice.js/logger.js');

const listEndpoints = require('express-list-endpoints');
const path = require('path');

// 🔹 Modules tiers
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');

// 🎯 Initialisation Express
const app = express();

// Application des middlewares et configurations définis dans setupApp
setupApp(app);

// Récupération de la configuration MongoDB
const {uriMEMBRES, clusterName} = require('./config/MongoConfig');

// Activation du mode debug de Mongoose
mongoose.set('debug', true);

// Connexion à MongoDB en utilisant uriMEMBRES du fichier de configuration
mongoose
	.connect(uriMEMBRES, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(() =>
		console.log(
			`BDD connectée: ${mongoose.connection.name.toUpperCase()}`
		)
	)
	.catch((error) => console.error('Erreur de connexion à la BDD:', error));
// 🌍 Configuration CORS avec gestion des origines dynamiques
const allowedOrigins = [
	'https://eliazoura.fr',
	'http://eliazoura.fr',
	'http://front.eliazoura.fr',
	'https://front.eliazoura.fr',
	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	'https://back.eliazoura.fr',
	'http://back.eliazoura.fr',
	/192\.168\.3\.19:\d+$/,
	/192\.234\.164\.249:\d+$/,
	/localhost:\d+$/,
];


const corsOptions = {
	origin: (origin, callback) => {
		// Afficher l'origine de la requête dans la console
		console.log(' ☘️ Origine de la requête => ', origin);
		// Pour les requêtes sans origin (ex : certains outils ou cas non-navigateur), on les autorise
		if (!origin) return callback(null, true);

		const allowed = allowedOrigins.some((allowedOrigin) => {
		console.log('☘️ Origine de la requête => ', origin);

			return allowedOrigin instanceof RegExp
				? allowedOrigin.test(origin)
				: allowedOrigin === origin;
		});

		// Si l'origine est autorisée, renvoyer exactement cette origine
		if (allowed) {
			return callback(null, origin);
		} else {
			return callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST'],
	credentials: true,
	optionsSuccessStatus: 200,
};

// const corsOptions = {
// 	origin: (origin, callback) => {
// 		// Si l'origine n'est pas définie (par exemple dans certains cas comme les requêtes faites via Postman),
// 		// on la laisse passer.
// 		if (!origin) return callback(null, true);
// 		// Pour toutes les autres requêtes, on renvoie exactement l'origine de la requête.
// 		callback(null, origin);
// 	},
// 	credentials: false,
// 	optionsSuccessStatus: 200,
// };

console.log('🚀 -------------------------------------------------🚀');
console.log('🚀 ~ server.js:85 ~ corsOptions  ==> ', corsOptions);

console.log('🚀 -------------------------------------------------🚀');

// Application du middleware CORS (si non défini dans setupApp)
app.use(cors(corsOptions));

// Si nécessaire, ré-appliquer le parsing JSON, les cookies et la détection du User-Agent.
// (Ces middlewares peuvent déjà être installés dans setupApp, à adapter selon vos besoins.)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(useragent.express());

// Servir les fichiers statiques depuis le dossier "views"
app.use(express.static(path.join(__dirname, '..', 'views')));

// Définir la route d'accueil pour servir le fichier index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '.', 'views', 'index.html'));
});

// Afficher la liste des endpoints pour debug
console.log('Liste des endpoints :', listEndpoints(app));

// 🔹 Chargement des routes depuis le module centralisé
const routes = require('./controllers/routesControl');
app.use('/', routes);

// Middleware global de gestion d'erreurs (doit être enregistré en dernier)
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}`);
	logger.error(err.stack);
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({
		success: false,
		error: err.message || 'Server Error',
		...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
	});
});

// 🌐 Définition du PORT et démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	const serverUrl = `http://localhost:${PORT}`;
	console.log(`✅ Serveur démarré sur : ${serverUrl}`);
	logger.info(`Server running on port ${PORT}`);
	logger.info(`Node.js version: ${process.version}`);
});
