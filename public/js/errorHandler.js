//## ----------------------------           HANDLER EROR           -----------------------------------------------

const errorHandler = (errorResponse) => {
	// console.log('🚀 ~ NAME ~ err:', err.name);
	// console.log('🚀 ~ error.ERRORSSSSSSS : ', err.errors);
	// console.log(
	// 	'🚀 ~ error.ERRORSSSSSSS PROPRIETES : ',
	// 	err.errors.properties
	// );

	if (errorResponse.name === 'ValidationError') {
		const infoReponse =
			'les données non conformes aux règles du schéma Mongoose';

		console.log('🚀 ~ errorHandler ~ infoReponse:', infoReponse);
	}

	if (errorResponse.name === 'CastError') {
		const infoReponse =
			'Mongoose ne peut pas convertir une valeur pour correspondre au type défini dans le schéma.';
		console.log('🚀 ~ errorHandler ~ infoReponse:', infoReponse);
	}

	if (errorResponse.name === 'MongoServerError') {
		const infoReponse =
			'Cette erreur est une erreur générale qui englobe plusieurs erreurs spécifiques à MongoDB qui ne sont pas couvertes par les erreurs ci-dessus.';
		console.log('🚀 ~ errorHandler ~ infoReponse:', infoReponse);
	}

	// const ObjectZERO = Object(err);
	// console.log('🚀 ~  ~ ObjectZERO:', ObjectZERO, typeof ObjectZERO);
	// const ObjectErrONE = Object.values(err);
	// console.log(
	// 	'🚀 ~ errorHandler ~ ObjectErrONE:',
	// 	ObjectErrONE,
	// 	'LONG => ',
	// 	ObjectErrONE.length
	// );
	// const ObjectErrTWO = Object.values(err.errors);
	// console.log(
	// 	'🚀 ~ errorHandler ~ ObjectErrTWO:',
	// 	ObjectErrTWO,
	// 	'LONG => ',
	// 	ObjectErrTWO.length
	// );
	// const errorNb = ObjectErrTWO.length;
	// console.log('🚀 ~ errorHandler ~ errorNb:', errorNb);

	// const errorArray = [];

	// const Error = {};

	// const Error = [];

	// ObjectErrTWO.forEach((oneProp) => {
	// 	console.log('🚀 ~ ObjectErr.forEach ~ oneProp:', oneProp);

	// 	for (let i = 0; i <= errorNb; i++) {
	// 		errorArray.push(oneProp);
	// 	}

	// 	const itemProp = oneProp.properties;

	// 	console.log('🚀 ~ ObjectErr.forEach itemProp ', itemProp);

	// 	Error.message = itemProp.message || undefined;
	// 	Error.type = itemProp.type || undefined;
	// 	Error.path = itemProp.path || undefined;
	// });

	// console.log('🚀 ~  Error :', Error);

	// console.log('🚀 ~  ~ errorArray:', errorArray);

	// return Error;
};

module.exports = errorHandler;

//##Propriétés :
// ??  --- 1. ValidationError
// Les erreurs de validation surviennent lorsque les données ne respectent pas les règles de validation définies dans le schéma Mongoose.

// name: 'ValidationError'
// errors: Un objet contenant les erreurs spécifiques pour chaque champ.

// if (error.name === 'ValidationError') {
// 	const messages = Object.values(error.errors).map((val) => val.message);
// 	return res
// 		.status(400)
// 		.json({message: 'Validation Error', errors: messages});
//}

//??  --- 3. CastError
// Cette erreur se produit lorsque Mongoose ne peut pas convertir une valeur pour correspondre au type défini dans le schéma.

// Propriétés :

// name: 'CastError'
// path: Le champ qui a causé l'erreur.
// value: La valeur qui a causé l'erreur.
// if (error.name === 'CastError') {
// 	return res
// 		.status(400)
// 		.json({message: `Cast Error: Invalid ${error.path}: ${error.value}`});
//}

//?? ---- 4. MongoError ... attention c'est : MongoServerError
// Cette erreur est une erreur générale qui englobe plusieurs erreurs spécifiques à MongoDB qui ne sont pas couvertes par les erreurs ci-dessus.

// Propriétés :

// name: 'MongoError'
// code: Code spécifique de l'erreur MongoDB.
// if (error.name === 'MongoError') {
// 	return res.status(500).json({message: 'MongoDB Error', error});
// }

//  if (err.name === 'ValidationError') {
//       console.error('Erreur de validation:');
//       for (let field in err.errors) {
//         let error = err.errors[field];
//         console.error(`- Champ: ${field}`);
//         console.error(`  Message: ${error.message}`);
//         console.error(`  Type: ${error.kind}`);
//         console.error(`  Valeur fournie: ${error.value}`);
//         if (error.properties) {
//           console.error(`  Propriétés:`);
//           console.error(`    Message: ${error.properties.message}`);
//           console.error(`    Type: ${error.properties.type}`);
//           console.error(`    Path: ${error.properties.path}`);
//           console.error(`    Valeur: ${error.properties.value}`);
//         }
//         if (error.reason) {
//           console.error(`  Raison: ${error.reason.message}`);
//         }

// Structure de l'objet d'erreur détaillée
// err : L'objet d'erreur principal.
// 	name : Le nom de l'erreur, typiquement ValidationError.
// 	errors : Un objet contenant les erreurs pour chaque champ.
// 		<field> : Le nom du champ qui a échoué à la validation.
// 				message : Un message décrivant l'erreur.
// 				name : Le type d'erreur (ValidatorError ou CastError).
// 				kind : Le type de validation qui a échoué (required, min, etc.).
// 				path : Le chemin du champ dans le document.
// 				value : La valeur fournie qui a causé l'erreur.
// 				reason : (optionnelle) Une sous-erreur, souvent présente pour les CastError.
