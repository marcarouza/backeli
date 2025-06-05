import express from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import listEndpoints from 'express-list-endpoints';
import {fileURLToPath} from 'url';
import path from 'path';
import {logger} from './logger.js';
import {requestLogger} from '../middleware/logger.js';

// Get directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup Express application with middleware
 * @param {express.Application} app - Express application
 */
export const setupApp = (app) => {
	// Basic middleware
	app.use(compression()); // Compress responses
	app.use(cors()); // Enable CORS
	app.use(useragent.express()); // Parse user agent
	app.use(cookieParser()); // Parse cookies

	// Body parsers
	app.use(bodyParser.json({limit: '10mb'}));
	app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

	// Set view engine and views directory
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '..', 'views'));

	// Static files directory
	app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

	// Request logging
	app.use(
		morgan('dev', {
			stream: {write: (message) => logger.info(message.trim())},
		})
	);
	app.use(requestLogger);

	// Health check endpoint
	app.get('/health', (req, res) => {
		res.status(200).json({
			status: 'ok',
			timestamp: new Date().toISOString(),
		});
	});

	// Print API endpoints on startup
	app.use((req, res, next) => {
		if (req.path === '/api-docs' && req.method === 'GET') {
			return res.json(listEndpoints(app));
		}
		next();
	});

	// Add API documentation endpoint
	app.get('/api-docs', (req, res) => {
		const endpoints = listEndpoints(app);
		res.json(endpoints);
	});

	return app;
};
