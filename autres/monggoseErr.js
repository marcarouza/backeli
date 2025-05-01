// if (err.code === 11000) {
// 	// Erreur de duplication (email ou pseudo déjà existant)
// 	return res.status(400).json({
// 		message: 'Ce mail ou ce pseudo existe déjà.',
// 	});
// } else if (err instanceof mongoose.Error.CastError) {
// 	console.error('Cast Error:', err.message);
// 	return res.status(400).json({
// 		err: err.message,
// 		name: err.name,
// 		message: `⚠️ Erreur de conversion de données`,
// 	});
// } else if (err instanceof mongoose.mongo.MongoServerError) {
// 	console.error('MongoServerError:', err.message);
// 	return res.status(400).json({
// 		err: err.message,
// 		message: `⚠️ Erreur de serveur MongoDB`,
// 	});
// } else if (err instanceof mongoose.Error.ValidationError) {
// 	console.error('Validation Error:', err.message);
// 	return res.status(400).json({
// 		err: err.message,
// 		name: err.name,

// 		message: `⚠️ Données incompatibles `,
// 	});
// } else {
// 	console.error(
// 		'FROM LOGUSER-POST in routesControl unexpected ERR occurred:',
// 		err
// 	);

// 	console.error(JSON.stringify(err, null, 10));

// 	console.error('ORIGINALE ERREUR', err);

// 	return res.status(400).json({
// 		message: `⚠️ La connexion est temporairement indisponible. Veuillez réessayer dans quelques minutes.`,
// 	});
// }
