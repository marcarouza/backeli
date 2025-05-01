const mongoose = require('mongoose');
const {lambdaModel} = require('../models/allSchemas'); // Chemin correct vers votre modèle
console.log('🚀 ~ UserTempo:', lambdaModel);

mongoose.connect(
	'mongodb+srv://eli:eli@clustereli.1mm4wrw.mongodb.net/membres?retryWrites=true&w=majority&appName=ClusterEli'
);

async function addIsActiveField() {
	try {
		// Met à jour tous les utilisateurs, en définissant le champ isActive à false si ce champ est manquant
		const result = await lambdaModel.updateMany(
			{isActive: {$exists: true}}, // Trouve les documents sans le champ isActive
			{$set: {isActive: false}} // Ajoute le champ isActive avec la valeur true
		);
		console.log(
			`Nombre de documents mis à jour : ${result.modifiedCount}`
		);
	} catch (err) {
		console.error('Erreur lors de la mise à jour des utilisateurs:', err);
	} finally {
		mongoose.connection.close();
	}
}

addIsActiveField();
