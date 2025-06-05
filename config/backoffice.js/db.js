const mongoose = require('mongoose');
const {logger} = require('./logger.js');

/**
 * Connect to MongoDB database
 * @returns {Promise<mongoose.Connection>} Mongoose connection
 */
const connectToDatabase = async () => {
	try {
		// MongoDB connection URL (à fournir en variable d'environnement en production)
		const MONGODB_URI =
			process.env.MONGODB_URI || 'mongodb://localhost:27017/tp-nodejs';

		// Configuration de mongoose
		mongoose.set('strictQuery', false);

		// Connexion à MongoDB
		const connection = await mongoose.connect(MONGODB_URI);

		logger.info('MongoDB Connected Successfully');
		return connection;
	} catch (error) {
		logger.error('MongoDB connection error:', error);
		throw error;
	}
};

/**
 * Close MongoDB connection
 */
const closeDatabase = async () => {
	try {
		await mongoose.connection.close();
		logger.info('MongoDB connection closed');
	} catch (error) {
		logger.error('Error closing MongoDB connection:', error);
		throw error;
	}
};

// Surveiller les événements de connexion
mongoose.connection.on('connected', () => {
	logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
	logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
	logger.info('Mongoose disconnected from MongoDB');
});

// Gérer l'arrêt du processus
process.on('SIGINT', async () => {
	await mongoose.connection.close();
	logger.info('MongoDB connection closed due to app termination');
	process.exit(0);
});

module.exports = {
	connectToDatabase,
	closeDatabase,
};
