// 1. Chargement des variables d'environnement
require('dotenv').config();

// 2. Importations et configuration du back office
const {setupApp} = require('./config/backoffice.js/app');
const {logger} = require('./config/backoffice.js/logger');

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

const checkLoggedUser = require('./middlewares/authMiddle');

const routes = require('./controllers/routesControl');


const app = express();

// 4. Configuration du middleware CORS
const corsOptions = {
	origin: '*', // Autorise toutes les origines. Adaptez si nécessaire.
	methods: ['GET', 'POST'],
	credentials: true,
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 5. Configuration des parsers (corps des requêtes, cookies, détection du User-Agent)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(useragent.express());

// 6. Configuration de express-session
app.use(
	session({
		secret: process.env.JET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // Le cookie expire après 24 heures
			secure: process.env.NODE_ENV === 'production', // Utiliser HTTPS en production
			httpOnly: true, // Empêche l'accès via JavaScript côté client
		},
	})
);


// 8. Route d'exemple d'utilisation de la session
app.get('/api/session', (req, res) => {
	if (req.session.views) {
		req.session.views++;
		console.log('🚀 ~ server.js:48 ~ session  ==> ', req.session.views);
		res.send(`Nombre de vues : ${req.session.views}`);
	} else {
		req.session.views = 1;
		console.log('🚀 ~ server.js:56 ~ session  ==> Première visite');
		res.send("Bienvenue, c'est votre première visite !");
	}
});

// 9. Middleware de log des en-têtes de la requête (à des fins de debug)
app.use((req, res, next) => {
	console.log('❤️ En-têtes de la requête :', req.headers);
	next();
});

// 10. Connexion à MongoDB
const {uriMEMBRES} = require('./config/MongoConfig');
mongoose.set('debug', true);
mongoose
	.connect(uriMEMBRES)
	.then(() =>
		console.log(
			`BDD connectée: ${mongoose.connection.name.toUpperCase()}`
		)
	)
	.catch((error) => console.error('Erreur de connexion à la BDD :', error));

// 11. Application des configurations globales personnalisées
// setupApp(app);


app.use(checkLoggedUser); // Ajoute le middleware globalement


// 15. Configuration des fichiers statiques
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routes);

// 13. Debug: Affichage de la liste des endpoints disponibles
// console.log('Liste des endpoints :', listEndpoints(app));

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


const urlEntryPoint = path.join(__dirname, 'dist', 'index.html');



app.get('/', (req, res) => {
	res.sendFile(urlEntryPoint);
});

// Pour toute autre route, renvoyer index.html (pour supporter le mode history de la SPA)
app.get('*', (req, res) => {
	res.sendFile(urlEntryPoint);
});

// 16. Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	const serverUrl = `http://localhost:${PORT}`;
	console.log(`✅ Serveur démarré sur : ${serverUrl}`);
	logger.info(`Server running on port ${PORT}`);
	logger.info(`Node.js version: ${process.version}`);
});
