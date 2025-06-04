const {lambdaModel} = require('../models/allSchemas');

//##                LOG OUT                               -

module.exports.logOut_post = async (req, res) => {
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

// module.exports.logOut_get = (req, res) => {
// 	res.cookie('jwt', '', {
// 		httpOnly: false, // Changé à true pour plus de sécurité
// 		maxAge: 1,
// 		sameSite: 'None',
// 		secure: true,
// 		path: '/',
// 	});
// 	res.redirect('/');
// };

//##                CONNEXION REELLE                                   -

module.exports.logUserPage_post = async (req, res) => {
	const {email, pwd} = req.body;

	try {
		// Appel de la méthode login du modèle
		const user = await lambdaModel.login(email, pwd);
		console.log(
			'✅ ✅ ✅~ USER ID FROM LOGIN USER LOGIN USER  POST:',
			user._id
		);
		const token = createToken(user._id);
		res.cookie('jwt', token, {
			httpOnly: false, // Changé à true pour plus de sécurité
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
			'🧨 🧨 🧨 FROM LOGUSER-POST in routesControl unexpected ERR occurred:',
			err.message
		);
		res.status(400).json({success: false, message: err.message}); // Renvoie l'erreur au frontend
	}
};
