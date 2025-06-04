const {lambdaModel} = require('../models/allSchemas');

//##                AFFICHER TOUS LES MEMBRES                      -

module.exports.allMembers_get = async (req, res) => {
	try {
		const allMembers = await lambdaModel.find();
		if (allMembers.length > 0) {
			res.status(200).json(allMembers); // Renvoie les membres en format JSON
		} else {
			res.status(404).json({message: 'Aucun membre trouvé.'});
		}
	} catch (err) {
		console.error(
			'🍌 🍌 🍌 🍌 🍌 FROM allMembers_get Error fetching members:',
			err
		);
		res.status(500).json({
			error: 'Erreur lors de la récupération des membres',
		});
	}
};
