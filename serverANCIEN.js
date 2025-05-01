require('dotenv').config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {countDoc} = require('./actionDB');
const path = require('path');
const useragent = require('express-useragent');

const fs = require('fs');
const app = express();

let myHost;

// Middleware
app.use((req, res, next) => {
	myHost = req.get('host');
	console.log("🚀 ~ app.use ~ req.get('host'):", myHost);

	next();
});

app.use(
	express.static('dist', {
		maxAge: 1 * 24 * 60 * 60 * 1000, // 15 jours en millisecondes
		immutable: true,
	})
);

let ipAddressGlobal;

// app.use((req, res, next) => {
// 	ipAddressGlobal = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
// 	  console.log('IP enregistrée :', ipAddressGlobal);
//   next();
// });

const options = {
	key: fs.readFileSync('./ssl/localhost.key'),
	cert: fs.readFileSync('./ssl/localhost.crt'),
};

//  TODO : Ajouter une nouvelle fonctionnalité ici
//  IMPORTANT  : Corriger ce bug dans la fonction suivante
// FIXME: Corriger ce bug dans la fonction suivante
// REMARQUE : Corriger ce bug dans la fonction suivante
// remarque : Ce code est temporaire, penser à le supprimer
// CONNECT pour les PAI par exemple

// NOTE: Ce code est temporaire, penser à le supprimer

//## AUTRE POSSIBILITES POUR INCLURE LES ORIGINES
// const allowedOrigins = [
// 	'https://eliazoura.fr',
// 	'https://autredomaine.com',
// 	'https://encoredomaine.com',
// ];

// Configuration CORS
const corsOptionsPROD = {
	origin: function (origin, callback) {
		const allowedOrigins = [
			'https://front.eliazoura.fr',
			'https://eli-front-swjt.onrender.com',
			'https://eli-front.onrender.com',
			'http://localhost:3000',
			'http://localhost:3500',
			'http://localhost:3001',
		];
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
			1;
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
};

const corsOptions2 = {
	origin: true, // Ajustez selon l'origine de votre front-end
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true, // Permet l'envoi des cookies
	optionsSuccessStatus: 200, // Pour les navigateurs anciens comme IE11
};

const allowedOrigins01 = [
	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	'http://localhost:3000',
	'https://back.eliazoura.fr',
	// 'http://localhost:8080',
	// 'http://localhost:4200',
	// 'http://192.168.0.73:8080',
	/192\.168\.3\.19:\d+$/, // Accepte l'adresse IP avec n'importe quel port
	/^http:\/\/localhost:\d+$/, // Accepte localhost avec n'importe quel port en HTTP
	/^https:\/\/localhost:\d+$/,
];

const allowedOrigins02 = [
	'https://eliazoura.fr',
	'http://eliazoura.fr',
	'http://front.eliazoura.fr/	',
	'https://front.eliazoura.fr',

	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	// 'http://localhost:3000',
	'https://back.eliazoura.fr',
	'http://back.eliazoura.fr',

	// 'http://192.168.0.73:8080',
	/192\.168\.3\.19:\d+$/, // Accepte l'adresse IP avec n'importe quel port
	/192\.234\.164\.249:\d+$/, // Accepte l'adresse IP avec n'importe quel port

	/localhost:\d+$/, // Accepte localhost avec n'importe quel port
];

app.use((req, res, next) => {
	const origin = req.headers.origin;

	if (allowedOrigins02.includes(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
	}

	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

const corsOptions = {
	origin: allowedOrigins02,
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
	maxAge: 3601 * 24, // Durée de mise en cache des résultats du contrôle préalable en secondes
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(useragent.express());

// Configuration des vues
app.set('view engine', 'ejs');
app.set('views', [
	path.join(__dirname, 'views'),
	path.join(__dirname, 'views/partials'),
	path.join(__dirname, 'views/pages'),
	path.join(__dirname, 'more_views'),
]);

// Configuration des fichiers statiques
app.use(express.static('public'));
// app.use('/tests-divers', express.static(path.join(__dirname, 'tests-divers')));
app.use('/js', express.static(path.join(__dirname, 'js')));

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

// Routes
const routes = require('./routes/routes');

app.get('/', (req, res) => {
	res.send('Hello Render!');
});
app.get('/test', (req, res) => {
	res.send('Hello TEST Render!');
});

app.use('/', routes);

// Configuration du port
const port = process.env.PORT || 3500;

// Démarrage du serveur
// Assurez-vous de lier le serveur à 0.0.0.0 pour accepter les connexions externes
app.listen(port, '0.0.0.0', () => {
	console.log(`Serveur démarré sur sur le port ${port} et URL : `, myHost);

	const db = mongoose.connection;
	db.once('open', () => {
		console.log(`Connexion à ${clusterName} réussie!`);
		countDoc('lambdas')
			.then((count) =>
				console.log('Documents dans la collection:', count)
			)
			.catch((error) =>
				console.error(
					'Erreur lors du comptage des documents:',
					error
				)
			);
	});

	db.on(
		'error',
		console.error.bind(
			console,
			'Erreur de connexion à la base de données:'
		)
	);
});
