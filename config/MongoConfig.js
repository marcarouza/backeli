// config/mongoConfig.js

// Assurez-vous que les variables d'environnement ont déjà été chargées (avec dotenv dans votre serveur par exemple)
const uriMEMBRES = process.env.URI_MEMBRES;

if (!uriMEMBRES) {
	throw new Error(
		"L'URI pour MongoDB (URI_MEMBRES) n'est pas définie dans les variables d'environnement."
	);
}

// Extraire le nom du cluster depuis l'URI et le mettre en majuscules
const clusterName = uriMEMBRES.match(/@([^.]*)\./)[1].toUpperCase();

// Vous pouvez garder vos logs ici pour vérifier la configuration ou les déplacer selon vos besoins
console.log('🚀 ~ mongoConfig.js ~ uriMEMBRES  ==> ', uriMEMBRES);
console.log('🚀 ~ mongoConfig.js ~ clusterName  ==> ', clusterName);

module.exports = {
	uriMEMBRES,
	clusterName,
};
