const bcrypt = require('bcrypt');
const {lambdaModel} = require('../models/allSchemas');


//?? CHANGE PASSWORD

module.exports.changePWD_post = async (req, res) => {
	const {fromID, currentPWD, newPWD} = req.body; // ID de la personne qui a envoyé la demande
	console.log('🚀 ~ module.exports.modifyPWD_post= ~ req.body:', req.body);

	try {
		// Trouver l'utilisateur actuel
		const user = await lambdaModel.findById(fromID);
		if (!user) {
			return res
				.status(404)
				.json({message: ' Modif PWD =>  user  non trouvé 🚫'});
		}

		console.log(
			'🚨  module.exports.modifyPWD_post ===>  USER demandé : ',
			user,
			'SON MOT DE PASSE',
			user.pwd
		);

		// Vérifier que l'ancien mot de passe est correct
		const isMatch = await bcrypt.compare(currentPWD, user.pwd);
		console.log('👁️ modifyPWD_post ==> isMatch : ', isMatch);
		if (!isMatch) {
			return res.status(400).json({
				message: "🧨 FROM changePWD_post => L'ancien mot de passe est incorrect.",
			});
		}

		// Valider le nouveau mot de passe (ajoutez vos propres règles de validation)
		if (newPWD.length < 8) {
			return res.status(400).json({
				message: '⚠️ FROM changePWD_post =>  au moins 8 caractères !',
			});
		}

		// Hacher le nouveau mot de passe
		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(newPWD, salt);

		// Mettre à jour le mot de passe dans la base de données
		user.pwd = hashedPassword;
		await user.save();

		res.status(200).json({message: '✅ PWD modifié avec SUCCESS !!!'});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			err: err.message,
			message: 'Modif PWD => CATCH ERR modif PWD impossible 🚫',
		});
	}
};
