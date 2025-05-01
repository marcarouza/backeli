// urlFilter.js

const allowedOrigins = [
	'https://front.eliazoura.fr',
	'http://front.eliazoura.fr',
	'http://localhost:3000',
	'78.194.241.127',
];

const urlFilter = (req, res, next) => {
	const origin = req.headers.origin || req.headers.referer;

	if (allowedOrigins.includes(origin)) {
		next();
	} else {
		res.status(403).send('Access forbidden: your origin is not allowed');
	}
};

module.exports = urlFilter;
