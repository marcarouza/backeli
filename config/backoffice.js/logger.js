const winston = require('winston');
const path = require('path');
const fs = require('fs');

// __dirname est déjà disponible en CommonJS, inutile d'utiliser fileURLToPath
// Créer le répertoire des logs s'il n'existe pas
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, {recursive: true});
}

// Définir le format de log
const logFormat = winston.format.combine(
	winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
	winston.format.errors({stack: true}),
	winston.format.splat(),
	winston.format.printf(({level, message, timestamp, stack}) => {
		return `${timestamp} [${level.toUpperCase()}]: ${message}${
			stack ? '\n' + stack : ''
		}`;
	})
);

// Créer l'instance de logger
const logger = winston.createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: logFormat,
	defaultMeta: {service: 'tp-nodejs'},
	transports: [
		// Afficher les logs dans la console
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				logFormat
			),
		}),
		// Écrire dans combined.log pour les logs de niveau 'info' et inférieur
		new winston.transports.File({
			filename: path.join(logsDir, 'combined.log'),
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
		// Écrire dans error.log pour les logs d'erreur
		new winston.transports.File({
			filename: path.join(logsDir, 'error.log'),
			level: 'error',
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
	],
	exitOnError: false,
});

// Stream pour l'intégration avec Morgan
const logStream = {
	write: (message) => {
		logger.info(message.trim());
	},
};

// Stream pour une intégration alternative avec Morgan (niveau HTTP par exemple)
const morganStream = {
	write: (message) => {
		// Assurez-vous que "logger.http" existe, sinon utilisez "info"
		if (typeof logger.http === 'function') {
			logger.http(message.trim());
		} else {
			logger.info(message.trim());
		}
	},
};

module.exports = {
	logger,
	logStream,
	morganStream,
};
