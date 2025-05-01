const originsOK = require('../config/allowedOrigins');

const corsOptions = {
	origin: (origin, callback) => {
		console.log('🚀 ~ origin:', origin);
		if (originsOK.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200,
};

module.exports = corsOptions;
