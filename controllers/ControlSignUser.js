
const jwt = require('jsonwebtoken');
const {lambdaModel} = require('../models/allSchemas');

// const mongoose = require('mongoose');


const maxAge = 3600000; // 1 heure pour la durée de vie du createToken

const createToken = (id) => {
	return jwt.sign({id}, process.env.JET, {expiresIn: maxAge});
};

module.exports.signUser_post = async (req, res) => {
	const {pseudo, email, pwd, role} = req.body;

	const newUser = new lambdaModel({
		pseudo: pseudo,
		email: email,
		pwd: pwd,
		role: role,
	});

	try {
		// Sauvegarde de l'utilisateur dans la base de données
		const savedUser = await newUser.save();
		console.log(
			'✅ Nouveau membre enregistré dans la base de données :  ',
			savedUser
		);

		// Génération du token après que l'utilisateur ait été sauvegardé
		const token = createToken(savedUser._id);
		console.log('✅ 🚨 FROM createUser_post ==>  TOKEN :', token);

		// Configuration du cookie avec le token
		res.cookie('jwt', token, {
			httpOnly: false, // Changé à true pour plus de sécurité
			maxAge: 31 * 24 * 60 * 60 * 1000,
			sameSite: 'None',
			secure: true,
			path: '/',
		});

		// Réponse au client
		res.status(200).json({
			message: 'Utilisateur créé avec succès',
			user: {
				pseudo: savedUser.pseudo,
				email: savedUser.email,
				role: savedUser.role,
			},
		});

		// Comptage des documents après la création de l'utilisateur
		const manyUsers = await countDoc(lambdaModel);
		console.log('NOUVEAU COMPTE DE LA COLLECTION  : ', manyUsers);
	} catch (err) {
		console.error("Erreur lors de la création de l'utilisateur :", err);

		if (err.code === 11000) {
			// Erreur de duplication (email ou pseudo déjà existant)
			return res.status(400).json({
				message: 'Ce mail ou ce pseudo existe déjà.',
			});
		} else if (err.name === 'ValidationError') {
			// Erreurs de validation de Mongoose
			return res.status(400).json({
				message: 'Erreur de validation des données fournies.',
				errors: err.errors,
			});
		} else {
			// Autres erreurs
			return res.status(500).json({
				message: 'Une erreur inattendue est survenue lors de la création du compte. Veuillez réessayer plus tard.',
			});
		}
	}
};


