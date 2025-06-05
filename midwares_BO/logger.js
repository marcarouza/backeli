const {logger} = require('../config/backoffice.js/logger.js');

/**
 * Middleware pour journaliser les détails des requêtes
 */
const requestLogger = (req, res, next) => {
	// Journaliser le début de la requête
	const start = new Date();
	const {method, originalUrl, ip} = req;

	// Récupérer les informations du user agent
	const userAgentInfo = req.useragent
		? {
				browser: req.useragent.browser,
				version: req.useragent.version,
				os: req.useragent.os,
				platform: req.useragent.platform,
				isMobile: req.useragent.isMobile,
				isDesktop: req.useragent.isDesktop,
		  }
		: 'User agent not available';

	// Journaliser le début de la requête
	logger.info(`Request: ${method} ${originalUrl} from ${ip}`);
	logger.debug(`User agent: ${JSON.stringify(userAgentInfo)}`);

	// Remplacer la méthode end pour journaliser la réponse
	const originalEnd = res.end;
	res.end = function (chunk, encoding) {
		const responseTime = new Date() - start;
		logger.info(
			`Response: ${res.statusCode} ${res.statusMessage} - ${responseTime}ms`
		);
		return originalEnd.call(this, chunk, encoding);
	};

	next();
};

module.exports = {requestLogger};
