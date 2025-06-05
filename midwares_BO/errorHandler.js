const {logger} = require('../config/logger.js');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
	constructor(message, statusCode, errors = []) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Middleware to handle not found routes
 */
const notFoundHandler = (req, res, next) => {
	const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
	next(error);
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
	// Définir des valeurs par défaut
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Something went wrong';

	// Journaliser l'erreur
	if (statusCode === 500) {
		logger.error(
			`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`
		);
		logger.error(err.stack);
	} else {
		logger.warn(
			`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`
		);
	}

	// Envoyer la réponse d'erreur
	res.status(statusCode).json({
		success: false,
		status: statusCode,
		message,
		...(err.errors && {errors: err.errors}),
		...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
	});
};

/**
 * Middleware to handle async route handlers
 * @param {Function} fn - Async route handler
 * @returns {Function} Middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
	ApiError,
	notFoundHandler,
	errorHandler,
	asyncHandler,
};
