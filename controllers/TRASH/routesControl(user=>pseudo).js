const {lambdaModel, postModel} = require('../../models/allSchemas');

const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

const maxAge = 3600000; // 1 heure pour la durée de vie du token

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createToken = (id) => {
	return jwt.sign({id}, process.env.JET, {expiresIn: maxAge});
};

const {createDB, countDoc, findExistUser} = require('../../actionDB');

const transporterEli = nodemailer.createTransport({
	host: 'eliazoura.fr',
	port: 587,
	secure: false,
	auth: {
		user: 'eli@eliazoura.fr',
		pass: 'YachaR#398@',
	},
});
const transporterChant = nodemailer.createTransport({
	host: 'celine-azoura.fr',
	port: 587,
	secure: false,
	auth: {
		user: 'celine@celine-azoura.fr',
		pass: 'YachaR#398@',
	},
});

//##                  VERIF DES COOKIES                           -

module.exports.getInfo = async (req, res) => {
	const userAgentInfo = {
		browser: req.useragent.browser,
		version: req.useragent.version,
		os: req.useragent.os,
		platform: req.useragent.platform,
		isMobile: req.useragent.isMobile,
		isDesktop: req.useragent.isDesktop,
		isBot: req.useragent.isBot,
		source: req.useragent.source,
	};

	return res.status(200).json({
		userAgentInfo,
		message: 'Informations récupérées avec succès',
	});

	// res.json(userAgentInfo);
};

//## CHECK  COOKIES

module.exports.checkCookies = (req, res) => {
	const cookies = req.cookies;
	res.json(cookies);
};

//?? CHANGE PASSWORD

module.exports.modifyPWD_post = async (req, res) => {
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

//##                API COOKIES                               -

module.exports.apiGetCookie = (req, res) => {
	const jwtToken = req.cookies.jwt;
	if (jwtToken) {
		res.json({token: jwtToken});
	} else {
		res.status(401).json({
			message: '🧨 🧨 🧨  routesControl/apiGetCookie  : NO JWT found !',
		});
	}
};

//##                CHECK USER STATUS                               -

module.exports.checkUserStatus = (req, res) => {
	res.json({
		user: res.locals.user,
	});
	console.log('🚀 ~ checkUserStatus : ', user);
};

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
				`🟢 Utilisateur ${oneUser.user.toUpperCase()} mis à jour : inactif`
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

//##                MISE A JOUR USER                               -

module.exports.updateUser_get = (req, res) => {
	res.render('modifyUserPage');
};

module.exports.updateUser_post = async (req, res) => {
	const {firstname, lastname, user, birthDate, city, phone} = req.body;
};

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

//
//##                ENVOIS DE MAIL pour FORMULAIRE CONTACT CELINE          -

module.exports.contactFormChant = async (req, res) => {
	const {firstName, lastName, email, phone, contactType, message} = req.body;

	console.log('🚀 ~ router.post ~ CONTACT REQ.BODY:', req.body);

	//

	const mailAdminChant = {
		from: email,
		to: 'celine.azoura@gmail.com',
		replyTo: email,
		subject: `Nouvelle demande de contact`,
		text: `Nom: ${lastName}\nPrénom: ${firstName}\nPhone : ${phone}\n\nMessage:\n${message}`,
	};
	console.log('🚀  ~ mailAdminChant:', mailAdminChant);

	const mailUserChant = {
		from: 'celine.azoura@gmail.com',
		to: email,
		replyTo: 'celine.azoura@gmail.com',
		subject: `Copie de votre message envoyé depuis celine-azoura.fr`,
		text: `Voici la copie du message que vous venez de m'envoyer sur mon site / Nom: ${lastName}\nPrénom: ${firstName}\nPhone : ${phone}\n\nMessage:\n${message}`,
	};
	console.log('🚀 ~  mailUserChant:', mailUserChant);

	//

	if (
		!firstName ||
		!lastName ||
		!email ||
		!contactType ||
		!phone ||
		!message
	) {
		return res.status(400).json({
			error: '🍌 🍌 🍌 FROM contactForm_post => All FIELDS required.',
		});
	}

	try {
		// Envoyer le premier email
		await transporterChant.sendMail(mailAdminChant);
		console.log('✅ from CONTACTPage => MAIL to ADMIN sent ! ');

		// Envoyer le deuxième email
		await transporterChant.sendMail(mailUserChant);
		console.log('✅ from CONTACTPage => MAIL to USER sent ! ');

		res.status(200).json({
			message: '✅ ✅ from CONTACTPage => 2 Emails USER & ADMIN sent successfully',
		});
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({
			error: error.toString(),
			message: '🍌 🍌 🍌 FROM contactForm_post => CATCH ERR  occurred while sending email. (199).',
		});
	}
};

//##                ENVOIS DE MAIL pour FORMULAIRE CONTACT      ELI          -

module.exports.contactForm_post = async (req, res) => {
	const {firstname, lastname, email, code, mobile, subject, message} =
		req.body;

	console.log('🚀 ~ router.post ~ CONTACT REQ.BODY:', req.body);

	if (!firstname || !lastname || !email || !subject || !message) {
		return res.status(400).json({
			error: '🍌 🍌 🍌 🍌 🍌 FROM contactForm_post => All fields required.',
		});
	}

	const mailAdminContact = {
		from: email,
		to: 'eli@eliazoura.fr',
		replyTo: email,
		subject: `${subject}: Nouvelle demande de contact`,
		text: `Nom: ${lastname}\nPrénom: ${firstname}\nCode: ${code}\nMobile: ${mobile}\n\nMessage:\n${message}`,
	};

	const mailUserContact = {
		from: 'eli@eliazoura.fr',
		to: email,
		replyTo: 'eli@eliazoura.fr',
		subject: `Copie de votre message envoyé depuis eliazoura.fr - ${subject}`,
		text: `Voici la copie du message que vous venez de m'envoyer sur mon site / Nom: ${lastname}\nPrénom: ${firstname}\nCode: ${code}\nMobile: ${mobile}\n\nMessage:\n${message}`,
	};

	try {
		// Envoyer le premier email
		await transporterEli.sendMail(mailAdminContact);
		console.log('✅ from CONTACTPage => MAIL to ADMIN sent ! 187');

		// Envoyer le deuxième email
		await transporterEli.sendMail(mailUserContact);
		console.log('✅ from CONTACTPage => MAIL to USER sent ! 192');

		res.status(200).json({
			message: '✅ ✅ from CONTACTPage => 2 Emails USER & ADMIN sent successfully',
		});
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({
			error: error.toString(),
			message: '🍌 🍌 🍌 🍌 🍌 FROM contactForm_post => CATCH ERR  occurred while sending email. (199).',
		});
	}
};

//
//##                       ENVOI MAIL  FORMULAIRE INSCRIPTION                            -

module.exports.signUserMAILConfirm_post = async (req, res) => {
	const {email, pwd, pseudo} = req.body;

	console.log('🚨 ~ routesControl ~ signUserMailConfirm_post:', req.body);

	if (!email || !pwd || !pseudo) {
		return res.status(400).json({
			error: '🍌 🍌 🍌 🍌 🍌 FROM routesControl signUserMailConfirm_post => All fields required.',
		});
	}

	// Email destiné à l'administrateur
	const mailAdminContact = {
		from: email,
		to: 'eli@eliazoura.fr',
		replyTo: email,
		subject: `Nouvelle inscription: ${pseudo}`,
		text: `Un nouvel utilisateur s'est inscrit.\n\nEmail: ${email}\nPseudo: ${pseudo}\nMot de passe: ${pwd}`,
	};

	// Email destiné à l'utilisateur
	const mailUserContact = {
		from: 'eli@eliazoura.fr',
		to: email,
		replyTo: 'eli@eliazoura.fr',
		subject: `Bienvenue sur eliazoura.fr, ${pseudo}`,
		text: `Votre compte a été créé avec succès !\n\nVoici vos informations de connexion :\nEmail: ${email}\nPseudo: ${pseudo}\nMot de passe: ${pwd}\n\nMerci de votre inscription !`,
	};

	try {
		// Envoi de l'email à l'administrateur
		await transporterEli.sendMail(mailAdminContact);
		console.log('✅ from SIGNUP => MAIL to ADMIN sent !');

		// Envoi de l'email à l'utilisateur
		await transporterEli.sendMail(mailUserContact);
		console.log('✅ from SIGNUP => MAIL to USER sent !');

		// Réponse au client après succès de l'envoi des emails
		res.status(200).json({
			message: '✅ ✅ from SIGNUP => 2 Emails USER & ADMIN sent successfully',
		});
	} catch (error) {
		console.error('Error sending email:', error);
		// Réponse au client en cas d'erreur
		res.status(500).json({
			error: error.toString(),
			message: '🍌 🍌 🍌 🍌 🍌 FROM routesControl signUserMailConfirm_post => An error occurred while sending email.',
		});
	}
};

//##                PAGES DIRECTES                                   -

module.exports.cv_get = (req, res) => {
	res.render('pages/cvPage');
};

module.exports.projets_get = (req, res) => {
	res.render('pages/projetsPage');
};

module.exports.contact_get = (req, res) => {
	res.render('pages/contactPage');
};

//##                ROUTES DU BLOG                                   -

//?? ---- ROUTE API BLOG ----------------------------

module.exports.allPosts_get = async (req, res) => {
	console.log('🚨 FROM  allPosts_get =+> req :', req);
	console.log(`TEST ACCES ROUTE API POST allPosts_get`);
	try {
		const allPosts = await postModel.find({});
		console.log(
			'✅ ℹ️ FROM  allPosts-get : ',
			allPosts,
			'TYPE OF : ',
			typeof allPosts
		);
		res.status(200).json({success: true, data: allPosts});
	} catch (err) {
		console.error(
			`🧨 FROM allPosts_post ERR impossible de récupérer tous les POSTS`,
			err
		);
		res.status(500).json({
			success: false,
			error: "Erreur technique lors de l'accès aux POSTS",
			message: 'Veuillez nous excuser pour la gêne occasionnée 🚫 .',
		});
	}
};

module.exports.OnePostById_get = async (req, res) => {
	console.log(`TEST ACCES ROUTE API POST getPostById`);
	try {
		const postId = req.params.id; // Récupère l'ID du post depuis les paramètres de l'URL
		const post = await postModel.findById(postId); // Utilise l'ID pour trouver le post

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post non trouvé 🚫 ',
			});
		}

		console.log('✅ ℹ️ FROM getPostById : ', post);
		res.status(200).json({success: true, data: post});
	} catch (err) {
		console.error(
			`🧨 FROM getPostById ERR impossible de récupérer le POST`,
			err
		);
		res.status(500).json({
			success: false,
			error: "Erreur technique lors de l'accès au POST",
			message: 'Veuillez nous excuser pour la gêne occasionnée 🚫 ',
		});
	}
};

module.exports.addOnePost_post = async (req, res) => {
	try {
		// Récupérer les données du corps de la requête
		const {title, content, categories, tags, author} = req.body;

		// Créer un nouvel objet post basé sur le modèle
		const newPost = new postModel({
			title: title,
			content: content,
			categories: categories,
			tags: tags,
			author: author,

			date: new Date(), // Ajouter la date actuelle
		});

		// Sauvegarder le nouveau post dans la base de données
		const savedPost = await newPost.save();

		// Répondre avec le post sauvegardé
		res.status(201).json({
			success: true,
			message: 'Post créé avec succès',
			post: savedPost,
		});
	} catch (err) {
		// Gérer les erreurs éventuelles
		console.error(`🧨 Erreur lors de la création du post :`, err);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la création du post',
			error: err.message,
		});
	}
};

module.exports.blog_get = (req, res) => {
	res.render('pages/blogPages/blog');
};

module.exports.postWrite_get = (req, res) => {
	res.render('pages/blogPages/postWrite');
};

module.exports.postSearch_get = (req, res) => {
	res.render('pages/blogPages/postSearch');
};

//##              ACCUEIL      -

module.exports.home_get = (req, res) => {
	res.render('index', {});
};

module.exports.home_post = (req, res) => {
	res.json('Route POST pour la racine');
};

//##                CONNEXION REELLE                                   -

module.exports.logUser_post = async (req, res) => {
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
			'🧨 🧨 🧨 FROM LOGUSER-POST 1047 in routesControl unexpected ERR : ',
			err.message
		);
		res.status(400).json({success: false, message: err.message}); // Renvoie l'erreur au frontend
	}
};

module.exports.logUserPage_get = (req, res) => {
	res.render('logUserPage');
};

//##        création utilisateur du 15 août 2024

module.exports.signUser_get = (req, res) => {
	res.render('create_user');
};

module.exports.signUser_post = async (req, res) => {
	const {pseudo, email, pwd, role} = req.body;

	const newUser = new lambdaModel({pseudo, email, pwd, role});

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
				user: savedUser.user,
				email: savedUser.email,
				role: savedUser.role,
			},
		});

		// Comptage des documents après la création de l'utilisateur
		const manyUsers = await countDoc(lambdaModel);
		console.log('NOUVEAU COMPTE DE LA COLLECTION  : ', manyUsers);
	} catch (err) {
		console.error(
			`🧨 🧨 🧨 FROM signUser_post / routesControl ERR / ERR COMPLETE : `,
			err
		);
		console.error(
			`🧨 🧨 🧨 FROM signUser_post / routesControl ERR  / ERR.MESSAGE : `,
			err.message
		);

		res.status(400).json({success: false, message: err.message}); // Renvoie l'erreur au frontend
	}
};

module.exports.signPage_get = (req, res) => {
	res.render('createUserPage');
};

//##                           UTILISATEUR  - -                                -

// module.exports.createUser_get = (req, res) => {
// 	res.render('create_user');
// };

module.exports.createUser_post = async (req, res) => {
	const {user, email, pwd, role} = req.body;

	const newUser = new lambdaModel({
		user: user,
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
				user: savedUser.user,
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

//##    Méthode de déconnexion valide le 15 août

module.exports.logOut_get = (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: false, // Changé à true pour plus de sécurité
		maxAge: 1,
		sameSite: 'None',
		secure: true,
		path: '/',
	});
	res.redirect('/');
};

//##                     WAIT                    -

module.exports.search_get = (req, res) => {
	res.render('search', {});
};

module.exports.search_post = (req, res) => {
	const {user, email} = req.body;
	console.log('🚀 ~ .post ~ email:', email, '🚀 ~ .post ~ user:', user);
	const isit = findExistUser(newUser, 'membres', 'normal');
	if (isit) {
		res.render('popup', {isit});
	} else {
		res.render('popup', {isit});
	}
};

//##                    MANIP BDD                -
module.exports.del_get = (req, res) => {
	res.json("getROUTE pour EFFACEMENT d'une DATABASE OU COLLECTION");
};

module.exports.del_post = (req, res) => {
	const {db, collec} = req.body;
	res.json("postROUTE pour EFFACEMENT d'une DATABASE OU COLLECTION");
};

module.exports.subdb_get = (req, res) => {
	res.render('create_db_colec');
};

module.exports.subdb_post = (req, res) => {
	const {db, collec} = req.body;

	console.log(
		'🚀 FROM CONTROL/AUTH/sudb_post ~ db / collec : ',
		db,
		'/',
		collec
	);

	createDB(db, collec);

	countDoc(lambdaModel);
};
