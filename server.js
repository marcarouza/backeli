// 🔹 Chargement des variables d'environnement (en premier)
require('dotenv').config();

const listEndpoints = require('express-list-endpoints');


// 🔹 Modules système
const fs = require('fs');
const path = require('path');

// 🔹 Modules tiers
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {countDoc} = require('./actionDB');

const useragent = require('express-useragent');

// 🎯 Initialisation Express
const app = express();

let myHost;
let ipAddressGlobal;

//??// 🔹 Chargement des route
// 
// 
// Import de la fonction getInfo depuis le contrôleur
const { getInfo } = require("./controllers/ControlAgent");

// Définition de la route /info qui va utiliser la fonction getInfo
router.get("/info", getInfo);

// 
// 
// 
// s


// Configuration de MongoDB
const uriMEMBRES = process.env.URI_MEMBRES;

console.log('🚀 ------------------------------------------------🚀');
console.log('🚀 ~ server.js:192 ~ uriMEMBRES  ==> ', uriMEMBRES);
console.log('🚀 ------------------------------------------------🚀');

const clusterName = uriMEMBRES.match(/@([^.]*)\./)[1].toUpperCase();

console.log('🚀 --------------------------------------------------🚀');
console.log('🚀 ~ server.js:198 ~ clusterName  ==> ', clusterName);
console.log('🚀 --------------------------------------------------🚀');

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
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
	optionsSuccessStatus: 200,
};


// 🛠️ Application des middlewares

// 🔹 Enregistrer l'adresse IP de la requête
// app.use((req, res, next) => {
// 	ipAddressGlobal =
// 		req.headers['x-forwarded-for'] || req.socket.remoteAddress;
// 	console.log('📍 IP enregistrée :', ipAddressGlobal);
// 	next();
// });

// 🔹 Middleware CORS (placé avant le traitement des requêtes)
app.use(cors(corsOptions));

// 🔹 Middleware pour le parsing des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 🔹 Middleware Cookie-parser
app.use(cookieParser());

// 🔹 Détection du User-Agent
app.use(useragent.express());

// 🔹 Log de l'hôte de la requête
// app.use((req, res, next) => {
// 	myHost = req.get('host');
// 	console.log('🚀 ~ Host de la requête :', myHost);
// 	next();
// });



// 🔹 Configuration des vues
app.set('view engine', 'ejs');
app.set('views', [
	path.join(__dirname, 'views'),
	path.join(__dirname, 'views/partials'),
	path.join(__dirname, 'views/pages'),
	path.join(__dirname, 'more_views'),
]);

// 🔹 Gestion des fichiers statiques
app.use(express.static('public'));
app.use('/js', express.static(path.join(__dirname, 'js')));

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



// Routes
const routes = require('./routes/routes');

app.get('/', (req, res) => {
	res.send('Hello Render!');
});
app.get('/test', (req, res) => {
	res.send('Hello TEST Render!');
});

app.use('/', routes);




console.log('Liste des endpoints :', listEndpoints(app));




// 🌐 Définition du PORT
const PORT = process.env.PORT || 3000;

// 🚀 Démarrage du serveur (écoute sur 0.0.0.0 pour Render)
app.listen(PORT, () => {
	console.log(`✅ Serveur démarré sur le PORT ${PORT}, Host: ${myHost}`);
	const serverUrl = `http://localhost:${PORT}`;
	console.log(`✅ Serveur démarré sur : ${serverUrl}`);

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
