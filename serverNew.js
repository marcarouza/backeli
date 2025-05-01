// 🔹 Chargement des variables d'environnement (en premier)
import dotenv from 'dotenv';
dotenv.config();

// 🔹 Modules système
import path from 'path';

// 🔹 Modules tiers
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';

// 🌍 Configuration CORS avec gestion des origines dynamiques
const allowedOriginsPROD = [
	'https://front.eliazoura.fr',
	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	'http://localhost:3000',
	'http://localhost:3500',
	'http://localhost:3001',
];

const corsOptionsPROD = {
	origin: (origin, callback) => {
		console.log(`🔹 Vérification de l'origine : ${origin}`);
		if (!origin || allowedOriginsPROD.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('❌ Origine non autorisée par CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
};

// 🔹 Option CORS secondaire
const corsOptions2 = {
	origin: true, // Ajustez selon votre front-end
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true, // Autorise les cookies
	optionsSuccessStatus: 200, // Optimisation pour certains navigateurs anciens
};

// Liste des origines autorisées avec regex
const allowedOrigins01 = [
	'https://eli-front-swjt.onrender.com',
	'https://eli-front.onrender.com',
	'http://localhost:3000',
	'https://back.eliazoura.fr',
	// 'http://localhost:8080',
	// 'http://localhost:4200',
	// 'http://192.168.0.73:8080',
	/192\.168\.3\.19:\d+$/, // Accepte l'adresse IP avec n'importe quel port
	/^http:\/\/localhost:\d+$/, // Autorise localhost avec n'importe quel port en HTTP
	/^https:\/\/localhost:\d+$/, // Idem en HTTPS
];

// 🎯 Initialisation Express
const app = express();

// 🛠️ Application des middlewares
app.use((req, res, next) => {
	console.log('🔹 Middleware CORS activé');
	cors(corsOptionsPROD)(req, res, next);
});

app.use((req, res, next) => {
	console.log('🔹 Body-parser activé');
	bodyParser.json()(req, res, next);
	bodyParser.urlencoded({extended: true})(req, res, next);
});

app.use((req, res, next) => {
	console.log('🔹 Cookies activés');
	cookieParser()(req, res, next);
});

app.use((req, res, next) => {
	console.log(`🚀 Détection du user agent : ${req.useragent}`);
	useragent.express()(req, res, next);
});

// 🔹 Route de test
app.get('/', (req, res) => {
	res.send('✅ Serveur en ligne sur Render !');
});

// ⚠️ Gestion des erreurs (toujours à la fin)
app.use((err, req, res, next) => {
	console.error('❌ Une erreur est survenue :', err.stack);
	res.status(500).send('Erreur serveur interne');
});

// 🌐 Définition du port
const PORT = process.env.PORT || 3000;

// 🎯 Démarrage du serveur sur 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
	console.log(`🚀 Serveur actif sur le port ${PORT}`);
});
