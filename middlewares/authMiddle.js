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
			console.log('☘️ ☘️ ☘️  ~requireAuth ~ decodedToken:', decodedToken);
			next();
		});
	} else {
		// return res.status(401).json({error: 'Token required'});
		res.redirect('/logPage');
	}
};

// const checkLoggedUser = (req, res, next) => {
// 	const token = req.cookies.jwt;

// 	if (token) {
// 		jwt.verify(token, process.env.JET, async (err, decodedToken) => {
// 			if (err) {
// 				console.log('FROM authMiddle : ', err.message);
// 				res.locals.user = null;

// 				next();
// 			} else {
// 				console.log(
// 					'🚀FROM CHECK USER🚀 decodedToken:',
// 					decodedToken
// 				);
// 				const user = await lambdaModel.findById(decodedToken.id);
// 				res.locals.user = user;
// 				next();
// 			}
// 		});
// 	} 
// };


const checkLoggedUser = async (req, res, next) => {
	const token = req.cookies.jwt;


	if (token) {

		console.log(
			'🙋 👉  ~ authMiddle.js:57 ~ checkLoggedUser ~ token  ==> ',
			token
		);

		jwt.verify(
			token,
			process.env.JWT_SECRET_KEY,
			async (err, decodedToken) => {
				if (err) {
					console.error(
						'MIDDLEWARE checkLoggedUser ==> Err de vérification du token :',
						err.message
					);
					res.locals.user = null;
					return next();
				}

				const user = await lambdaModel.findById(decodedToken.id);
				res.locals.user = user || null;
				next();
			}
		);
	} else {
		res.locals.user = null;
		return next(); // Aucun token, donc l'utilisateur est considéré comme non connecté
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Assurez-vous que votre variable d'environnement est bien définie
		const user = await lambdaModel.findById(decodedToken.id);

		if (user) {
			console.log(
				'🐱🐱🐱 ~ authMiddle.js:84 ~ checkLoggedUser ~ user  ==> ',
				user
			);

			res.locals.user = user;
			return next();
		}

		else {
			console.log('Aucun utilisateur trouvé avec ce token.');
			res.locals.user = null;
			}
	} catch (err) {
		console.error(
			'MIDDLEWARE checkLoggedUser ==> Erreur de vérification du token :',
			err.message
		);
		res.locals.user = null;
	}

	next();
};

module.exports = checkLoggedUser;


