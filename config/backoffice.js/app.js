const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const listEndpoints = require('express-list-endpoints');
const path = require('path');

const {logger} = require('./logger.js');
const {requestLogger} = require('../../midwares_BO/logger.js');

/**
 * Setup Express application with middleware
 * @param {express.Application} app - Express application
 */
const setupApp = (app) => {
	// Middleware de base
	app.use(compression()); // Compresser les réponses
	app.use(cors()); // Activer CORS
	app.use(useragent.express()); // Parser le user agent
	app.use(cookieParser()); // Parser les cookies

	// Middlewares pour parser le corps des requêtes
	app.use(bodyParser.json({limit: '10mb'}));
	app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

	// Définir le moteur de vues et le répertoire des vues
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '..', 'views'));

	// Répertoires de fichiers statiques
	app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

	// Journalisation des requêtes via Morgan
	app.use(
		morgan('dev', {
			stream: {write: (message) => logger.info(message.trim())},
		})
	);
	app.use(requestLogger);

	// Endpoint de vérification de l'état de l'application
	app.get('/health', (req, res) => {
		res.status(200).json({
			status: 'ok',
			timestamp: new Date().toISOString(),
		});
	});

	// Endpoint de documentation de l'API
	app.get('/api-docs', (req, res) => {
		const endpoints = listEndpoints(app);
		res.json(endpoints);
	});

	return app;
};

module.exports = {setupApp};
