// 1. Chargement des variables d'environnement
require('dotenv').config();

// 2. Importations et configuration du back office
const {setupApp} = require('./config/backoffice.js/app.js');
const {logger} = require('./config/backoffice.js/logger.js');

// 3. Importations des modules tiers
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const path = require('path');
const listEndpoints = require('express-list-endpoints');

const session = require('express-session');



const app = express();

// Configuration de express-session
app.use(session({
	secret: process.env.JET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24, // Le cookie expire après 24 heures
		secure: process.env.NODE_ENV === 'production', // en production, utilisez HTTPS
		httpOnly: true // Empêche l'accès via JavaScript côté client
	}
	
},



));




 app.get('/api/session', (req, res) => {
	// Exemple d'utilisation de la session
	if (req.session.views) {
		req.session.views++;
console.log('🚀 ~ server.js:48 ~ session  ==> ', session);
		
		res.send(`Nombre de vues : ${req.session.views}`);
		
	} else {
		req.session.views = 1;
		
		res.send('Bienvenue, cette est votre première visite !');
console.log('🚀 ~ server.js:56 ~ session  ==> ', session,`typeof : `, typeof session);
		
	}
 });




app.use((req, res, next) => {
	console.log('❤️ En-têtes de la requête :', req.headers);
	next();
});


//!! 

// app.use((req, res, next) => {
// 	res.setHeader(
// 		'Access-Control-Allow-Origin',
// 		'https://elifront.onrender.com'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Methods',
// 		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Content-Type, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	next();
// });



// app.use((req, res, next) => {
// 	res.setHeader(
// 		'Access-Control-Allow-Origin',
// 		'https://test.eliazoura.fr'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Methods',
// 		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Content-Type, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	next();
// });


// app.use((req, res, next) => {
// 	res.setHeader(
// 		'Access-Control-Allow-Origin',
// 		'https://back.eliazoura.fr'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Methods',
// 		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Content-Type, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	next();
// });

// app.use((req, res, next) => {
// 	res.setHeader(
// 		'Access-Control-Allow-Origin',
// 		'https://front.eliazoura.fr'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Methods',
// 		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Content-Type, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	next();
// });

//!!

// Pour toute autre route, renvoyer index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 5. Connexion à MongoDB
const {uriMEMBRES} = require('./config/MongoConfig');
mongoose.set('debug', true);
mongoose
	.connect(uriMEMBRES, {
		// useNewUrlParser et useUnifiedTopology ne sont plus nécessaires dans les versions récentes
	})
	.then(() =>
		console.log(
			`BDD connectée: ${mongoose.connection.name.toUpperCase()}`
		)
	)
	.catch((error) => console.error('Erreur de connexion à la BDD :', error));

// 6. Middleware global pour logger les en-têtes de chaque requête
app.use((req, res, next) => {
	console.log('❤️ En-têtes de la requête :', req.headers);
	next();
});

// 7. Configuration et application du middleware CORS
const allowedOrigins = [
	'https://eliazoura.fr',
	'http://eliazoura.fr',
	'http://front.eliazoura.fr',
	'https://front.eliazoura.fr',
	'https://elifront.onrender.com',
	'https://back.eliazoura.fr',
	'http://back.eliazoura.fr',
	'http://test.eliazoura.fr',
	'https://test.eliazoura.fr',
	/^(https?:\/\/)?(.*\.)?(eliazoura\.fr|onrender\.com)(?::\d+)?$/,
	/localhost(?:\:\d+)?$/,
	/93\.9\.238\.29(?::\d+)?$/, // Autorise 93.9.238.29, avec ou sans port
];
 

// const corsOptions = {
// 	origin: (origin, callback) => {
// 		console.log('☘️ Origine de la requête =>', origin);
// 		// Autoriser les requêtes sans origine (par exemple Postman)
// 		if (!origin) return callback(null, true);

// 		// Valider l'origine par rapport à la liste autorisée
// 		const allowed = allowedOrigins.some((allowedOrigin) =>
// 			allowedOrigin instanceof RegExp
// 				? allowedOrigin.test(origin)
// 				: allowedOrigin === origin
// 		);
// 		return allowed
// 			? callback(null, origin)
// 			: callback(new Error('Not allowed by CORS'));
// 	},
// 	methods: ['GET', 'POST'],
// 	credentials: true,
// 	optionsSuccessStatus: 200,
// };

const corsOptions = {
	origin: '*', // Permet toutes les origines
	methods: ['GET', 'POST'], // Méthodes autorisées
	credentials: true, // Si vous devez gérer des cookies
	optionsSuccessStatus: 200, // Statut de succès pour les requêtes OPTIONS
};


app.use(cors(corsOptions));

// 8. Parsers pour le corps des requêtes, les cookies et la détection du User-Agent
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(useragent.express());

// 9. Application des configurations globales depuis setupApp (par exemple, gestion de la sécurité ou d'autres middlewares custom)
setupApp(app);



// 12. Chargement et utilisation des routes centralisées
const routes = require('./controllers/routesControl');
app.use('/', routes);

// 13. Debug: Affichage de la liste des endpoints disponibles
console.log('Liste des endpoints :', listEndpoints(app));

// 14. Middleware global de gestion d'erreurs (placé en dernier)
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


console.log('🚀 --------------------------------------------------------🚀');
console.log('🚀 ~ server.js:178 ~ app.get ~ __dirname  ==> ', __dirname);
console.log('🚀 --------------------------------------------------------🚀');

const urlEntryPoint = __dirname + '/dist/index.html';

console.log('🚀 ------------------------------------------------------🚀')
console.log('🚀 ~ server.js:172 ~ urlEntryPoint  ==> ', urlEntryPoint)
console.log('🚀 ------------------------------------------------------🚀')
// Configuration des fichiers statiques
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'dist')));

// Routes fallback pour le front-end (SPA)
app.get('/', (req, res) => {
	res.sendFile(path.join(urlEntryPoint));
});


// 15. Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	const serverUrl = `http://localhost:${PORT}`;
	console.log(`✅ Serveur démarré sur : ${serverUrl}`);
	logger.info(`Server running on port ${PORT}`);
	logger.info(`Node.js version: ${process.version}`);
});
