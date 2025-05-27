//##                API LOG OUT                               -

module.exports.logOutApi_post = async (req, res) => {
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
