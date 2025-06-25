const { lambdaModel } = require('../models/allSchemas');
const jwt = require('jsonwebtoken');



const createToken = (id) => {
	return jwt.sign({id}, process.env.JET, {expiresIn: process.env.MAX_AGE || '31d'});
};

//##                LOG OUT                               -

module.exports.Post_LogOUT= async (req, res) => {
	try {
		const {fromID} = req.body;
		console.log('🚨 FromID dans logOutApi : ', fromID);
		console.log('🚨🚨 logOutApi Req.body:', req.body);

		const oneUser = await lambdaModel.findById(fromID);
		console.log('🚀 🚫 🚀 logOutApi_post= ~ oneUser:', oneUser);

		if (oneUser) {
			oneUser.isActive = false;
			await oneUser.save();
			console.log(
				`🟢 Utilisateur ${oneUser.pseudo.toUpperCase()} mis à jour : inactif`
			);

			res.cookie('jwt', '', {
				httpOnly: false, // Changé à true pour plus de sécurité
				maxAge: 1,
				sameSite: 'None',
				secure: true,
				path: '/',
			});

			res.status(200).json({
				message: '✅ FROM SERVER => Déconnecté avec succès : en DataBase et côté CLIENT',
			});
		} else {
			return res.status(404).json({message: 'Utilisateur non trouvé'});
		}
	} catch (err) {
		console.error('Erreur lors de la déconnexion :', err);
		res.status(500).json({
			message: '🚨 FROM SERVER => Erreur lors de la déconnexion',
		});
	}
};


//##                CONNEXION REELLE                                   -

module.exports.Post_LogIN = async (req, res) => {
	const {email, pwd} = req.body;

	try {
		// Appel de la méthode login du modèle
		const user = await lambdaModel.login(email, pwd);

		console.log('🚀 ~ PostLog_IN&Out.js : 63 ~ module.exports.logUserPage_post= ~ user  ==> ', user)

		const token = createToken(user._id);
		res.cookie('jwt', token, {
			httpOnly: true, // Changé à true pour plus de sécurité
			maxAge: 31 * 24 * 60 * 60 * 1000,
			sameSite: 'None',
			secure: true,
		});

		// Ajouter le token à l'en-tête HTTP
		res.setHeader('Authorization', `Bearer ${token}`);

		// Si la connexion réussit, envoyer une réponse positive
		res.status(200).json({success: true, user});
	} catch (err) {


		console.error(
			'🚀 ~ Post_Log_IN-OUT.js:78~ module.exports.Post_LogIN= ~ err  ==> ',
			err.message
		);
		res.status(400).json({success: false, message: err.message}); // Renvoie l'erreur au frontend
	}
};
