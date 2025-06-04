// Si vous utilisez un fichier .env, n'oubliez pas d'installer dotenv et de l'importer au début
require('dotenv').config();
const nodemailer = require('nodemailer');






// Transporteur pour Eli
const transporterEli = nodemailer.createTransport({
	host: process.env.ELI_SMTP_HOST || 'eliazoura.fr',
	port: Number(process.env.SMTP_PORT) || 587,
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: process.env.ELI_SMTP_USER || 'eli@eliazoura.fr',
		pass: process.env.ELI_SMTP_PASS || 'YachaR#398@',
	},
});

// Transporteur pour Chant
const transporterChant = nodemailer.createTransport({
	host: process.env.CHANT_SMTP_HOST || 'celine-azoura.fr',
	port: Number(process.env.SMTP_PORT) || 587,
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: process.env.CHANT_SMTP_USER || 'celine@celine-azoura.fr',
		pass: process.env.SMTP_PASS || 'YachaR#398@',
	},
});

module.exports = {transporterEli, transporterChant};

//!! CONFIG COMPLETE

// config/mailer.js

// Récupération des paramètres via des variables d'environnement pour plus de flexibilité
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'; // true pour une connexion sur le port 465
const SMTP_USER = process.env.SMTP_USER || 'votre-email@example.com';
const SMTP_PASS = process.env.SMTP_PASS || 'votre-mot-de-passe';

const transporter2 = nodemailer.createTransport({
	host: SMTP_HOST,
	port: SMTP_PORT,
	secure: SMTP_SECURE,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
	pool: true, // Activation du pool de connexions pour de meilleurs envois en masse
	maxConnections: 5, // Nombre maximum de connexions simultanées
	maxMessages: 100, // Nombre maximum de messages envoyés par connexion
	tls: {
		rejectUnauthorized: false, // Utile dans certains environnements pour bypasser les erreurs de certificats auto-signés
		// Vous pouvez ajouter d'autres options TLS, comme spécifier un ensemble de "ciphers" par exemple
	},
	debug: true, // Active les logs de débogage pour suivre le fonctionnement du transporteur
});

// Vérification de la configuration : cette commande permet de s'assurer dès le démarrage que
// la connexion au serveur SMTP peut être établie.
transporter.verify(function (error, success) {
	if (error) {
		console.error(
			'Erreur lors de la vérification du transporteur : ',
			error
		);
	} else {
		console.log(
			'Le transporteur Nodemailer est prêt à envoyer les emails.'
		);
	}
});

module.exports = transporter;
