require('dotenv').config();
const {lambdaModel} = require('../models/allSchemas');

const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.JET, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				// return res.status(401).json({error: 'Invalid token'});
				res.redirect('/logPage');
			}
			req.user = decodedToken;
			console.log('🚀 ~ jwt.verify ~ decodedToken:', decodedToken);
			next();
		});
	} else {
		// return res.status(401).json({error: 'Token required'});
		res.redirect('/logPage');
	}
};

const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.JET, async (err, decodedToken) => {
			if (err) {
				console.log('FROM authMiddle : ', err.message);
				res.locals.user = null;

				next();
			} else {
				console.log(
					'🚀FROM CHECK USER🚀 decodedToken:',
					decodedToken
				);
				const user = await lambdaModel.findById(decodedToken.id);
				res.locals.user = user;
				next();
			}
		});
	} 
};

module.exports = {requireAuth, checkUser};
