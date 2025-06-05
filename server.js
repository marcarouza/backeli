// 🔹 Chargement du BACK OFFICE 

import { setupApp } from './config/backoffice.js/app.js';
import {logger} from './config/backoffice.js/logger.js';


// Setup app with middleware
setupApp(app);


// Error handling middleware (must be registered last)
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}`);
	logger.error(err.stack);
	
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({
	  success: false,
	  error: err.message || 'Server Error',
	  ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
	});
});
 


// 🔹 Chargement des variables d'environnement (en premier)
require('dotenv').config();

const listEndpoints = require('express-list-endpoints');

const router = require('express').Router();

// 🔹 Modules système
// const fs = require('fs');
// const path = require('path');

// 🔹 Modules tiers
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const {countDoc} = require('./actionDB');

const useragent = require('express-useragent');

// 🎯 Initialisation Express
const app = express();

const {uriMEMBRES, clusterName} = require('./config/MongoConfig');

// 🔹 Importation des CONTROLERS

const {
	// GET routes
	Get_Agent,
	Get_CheckUserStatus,
	Get_CheckCookies,
	Get_AllMembers,
	Get_JwtToken,

	// POST routes
	Post_SignUser,
	Post_ChangePwd,
	Post_MailSignOK,
	Post_MailContact,
	Post_LogIN,
	Post_LogOUT,
	Post_Reject_1Friend,
} = require('./controllers/routesControl');

//??// 🔹 Chargement des route

router.use(express.json());

mongoose.set('debug', true);

mongoose
	.connect(uriMEMBRES)
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
	origin: allowedOrigins,
	methods: ['GET', 'POST'],
	credentials: true,
	optionsSuccessStatus: 200,
};

// 🔹 Middleware CORS (placé avant le traitement des requêtes)
app.use(cors(corsOptions));

// 🔹 Middleware pour le parsing des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 🔹 Middleware Cookie-parser
app.use(cookieParser());

// 🔹 Détection du User-Agent
app.use(useragent.express());

// 🌐 Connexion à MongoDB
const dbURI =
	process.env.URI_MEMBRES || 'mongodb://localhost:27017/nomDeTonProjet';

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('✅ Connexion à MongoDB réussie'))
	.catch((error) =>
		console.error('❌ Erreur de connexion à MongoDB :', error)
	);

// 🔹 Route de test pour vérifier le serveur
app.get('/', (req, res) => {
	res.send('✅ Serveur en ligne sur Render et connecté à MongoDB !');
});

// ⚠️ Gestion des erreurs (toujours en dernier)
app.use((err, req, res, next) => {
	console.error('❌ Erreur détectée :', err.stack);
	res.status(500).send('Erreur serveur interne');
});

console.log('Liste des endpoints :', listEndpoints(app));

// 🔹 Routes GET
const routes = require('./controllers/routesControl');

app.use('/', routes);

// 🌐 Définition du PORT
const PORT = process.env.PORT || 3000;

// 🚀 Démarrage du serveur (écoute sur 0.0.0.0 pour Render)
app.listen(PORT, () => {
	// console.log(`✅ Serveur démarré sur le PORT ${PORT}, Host: ${myHost}`);
	const serverUrl = `http://localhost:${PORT}`;
	console.log(`✅ Serveur démarré sur : ${serverUrl}`);

	logger.info(`Server running on port ${PORT}`);
	logger.info(`Node.js version: ${process.version}`);

	// const db = mongoose.connection;
	// db.once('open', () => {
	// 	console.log(`Connexion à ${clusterName} réussie!`);
	// 	countDoc('lambdas')
	// 		.then((count) =>
	// 			console.log('Documents dans la collection:', count)
	// 		)
	// 		.catch((error) =>
	// 			console.error(
	// 				'Erreur lors du comptage des documents:',
	// 				error
	// 			)
	// 		);
	// });

	// db.on(
	// 	'error',
	// 	console.error.bind(
	// 		console,
	// 		'Erreur de connexion à la base de données:'
	// 	)
	// );
});
