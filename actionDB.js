const MongoClient = require('mongodb').MongoClient;
const {lambdaModel} = require('./models/allSchemas');

// import {MongoClient} from 'mongodb';

// Import de fichiers locaux
// import {lambdaModel} from './models/allSchemas.js';


//

const uriMEMBRES = process.env.URI_MEMBRES;
console.log('🚀 ~ uriMEMBRES:', uriMEMBRES);

//
const client = new MongoClient(uriMEMBRES);

const createDB = (db, collec) => {
	client
		.connect()
		.then(() => {
			console.log(
				'MSG FROM actionDB/createDB ==> CLIENT connecté avec succès POUR CREATION de DATABSE.'
			);

			return client
				.db(db)
				.createCollection(collec)
				.then(() => {
					console.log(
						`MSG FROM actionDB/createDB ==> collection ${collec} créée dans la base de données ${db} !!!`
					);
				})
				.catch((err) => {
					console.error(
						`MSG FROM actionDB/createDB ==>  erreur lors de la création de la collection ${collec}`,
						err
					);
				});
		})
		.catch((err) => {
			console.error(
				'ERR_ACTIONDB/CREADTEDB  ==>  erreur lors de CONNECT sur CREATE-DB ::: ',
				err
			);
		})
		.finally(() => {
			client
				.close()
				.then(() => {
					console.log(
						'MSG FROM actionDB/createDB ==> Client CREATE-DB fermé avec succès !'
					);
				})
				.catch((err) => {
					console.error(
						'ERR_ACTIONDB/CREADTEDB  ==> ERR de fermeture du client CREATE-DB :::',
						err
					);
				});
		});
};

const createNewUser = (newUser) => {
	// Enregistrer le document dans la base de données
	newUser
		.save()
		.then((savedUser) => {
			console.log(
				'MSG_ACTIONDB/CREADTEDB  newUser enregistré sur BDD = ',
				savedUser
			);
		})
		.catch((err) => {
			console.error('ERR_ACTIONDB/CREADTEDB  ==> SAVE  newUser ', err);
		});
};

//##            COUNT DOC

const countDoc = () => {
	// Récupérer le nom de la collection

	const laCollec = lambdaModel.collection.collectionName.toUpperCase();

	// Retourner le nombre de documents dans la collection
	return lambdaModel
		.countDocuments()
		.then((count) => {
			console.log();
			console.log(
				`Il y a ${count} DOCUMENTS dans la collection ${laCollec}.`
			);
			console.log();

			return count; // Retourner le nombre de documents
		})
		.catch((err) => {
			console.error('ERREUR lors du COMPTE des documents :', err);
			throw err; // Propagation de l'erreur
		});
};

//##        CONNEXION A LA BDD
const connectDB = (db, collec) => {
	client
		.connect()
		.then(() => {
			console.log(`CONNECTÉ à ${db} sur la collection ${collec}`);
		})
		.catch((err) => {
			console.error(
				'Une erreur est survenue lors de le CONNECTDB:',
				err
			);
		})
		.finally(() => {
			client
				.close()
				.then(() => {
					console.log(
						`CONNEXION FERMEE ---> Ok !  ${db} sur la collection ${collec}`
					);
				})
				.catch((err) => {
					console.error(
						'Une erreur est survenue lors de la fermeture du client:',
						err
					);
				});
		});
};

const findExistUser = (newUser) => {
	// Rechercher l'utilisateur dans la collection à l'aide du modèle Mongoose
	return lambdaModel
		.findOne({
			$or: [
				{email: newUser.email}, // Recherche par e-mail
				{pseudo: newUser.pseudo}, // Recherche par nom d'utilisateur
			],
		})
		.then((existUser) => {
			if (existUser) {
				console.log(`Utilisateur AUTORISÉ ! ! !`, existUser);
			} else {
				console.log(
					`'EXISTANT, NOM ou MAIL existant  ${newUser.email} / ${newUser.pseudo}.`
				);
			}
			return existUser; // Retourne l'utilisateur trouvé ou null s'il n'existe pas
		})
		.catch((error) => {
			console.error(
				"Erreur lors de la recherche de l'utilisateur :",
				error
			);
			throw error; // Rejette la promesse en cas d'erreur
		});
};

module.exports = {
	createDB,
	createNewUser,
	countDoc,
	connectDB,
	findExistUser,
};
