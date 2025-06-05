const express = require('express');
const router = express.Router();

// const {createDB, countDoc, findExistUser} = require('../actionDB');

// ==============================
// Contrôleurs GET
// ==============================
const {Get_Agent} = require('./Get_Agent');
const {Get_CheckUserStatus} = require('./Get_CheckUserStatus');
const {Get_CheckCookies, Get_JwtToken} = require('./Get_Cookies');
const {Get_AllMembers} = require('./Get_AllMembers');

// ==============================
// Contrôleurs POST
// ==============================
const {Post_ChangePwd} = require('./Post_ChangePwd');
const {Post_SignUser} = require('./Post_SignUser');
const {Post_Reject_1Friend} = require('./Post_Reject_1Friend');
const {Post_MailSignOK} = require('./Post_MailSignOK');
const {Post_MailContact} = require('./Post_MailContact');
const {Post_LogIN, Post_LogOUT} = require('./Post_Log_IN-OUT');

// ==============================
// Export des contrôleurs
// ==============================
module.exports = {
	// GET
	Get_Agent,
	Get_CheckUserStatus,
	Get_CheckCookies,
	Get_JwtToken,
	Get_AllMembers,

	// POST
	Post_ChangePwd,
	Post_SignUser,
	Post_Reject_1Friend,
	Post_MailSignOK,
	Post_MailContact,
	Post_LogIN,
	Post_LogOUT,
};


router.get('/getAgent', Get_Agent);
router.get('/checkUser', Get_CheckUserStatus);
router.get('/checkCookies', Get_CheckCookies);
router.get('/getJwtToken', Get_JwtToken);
router.get('/getAllMembers', Get_AllMembers);	

router.post('/changePWD', Post_ChangePwd);
router.post('/signUser', Post_SignUser);
router.post('/reject1Friend', Post_Reject_1Friend);
router.post('/mailSignOK', Post_MailSignOK);
router.post('/mailContact', Post_MailContact);
router.post('/logIN', Post_LogIN);
router.post('/logOUT', Post_LogOUT);	
// ==============================

// Exportation du routeur pour utilisation dans votre application principale
module.exports = router;



// Définition de la route /info qui va utiliser la fonction getAgent
// router.get("/getAgent", getAgent);
// router.get("/checkUser", checkUser);

// Route pour changer le mot de passe
// router
// 	.route('/api/changePWD')

// 	.get(async (req, res) => {
// 		// Par exemple, retourner des informations sur la modification de mot de passe (cela peut être adapté)
// 		res.status(200).json({
// 			message: 'Utilisez POST pour changer votre mot de passe.',
// 		});
// 	})
// 	.post(changePWD_post);

// Route pour créer un nouvel utilisateur
// router.route('/api/signUser').get(async (req, res) => {
// 	// Par exemple, retourner des informations sur la création d'utilisateur (cela peut être adapté)
// 	res.status(200).json({
// 		message: 'Utilisez POST pour créer un nouvel utilisateur.',
// 	});
// }).post(signUser_post);

// router
// 	.route('/api/mailSignOK')
// 	.get(async (req, res) => {
// 		// Par exemple, retourner des informations sur la confirmation d'inscription par email (cela peut être adapté)
// 		res.status(200).json({
// 			message: 'Utilisez POST pour confirmer l’inscription par email.',
// 		});
// 	})
// 	.post(signConfirm_post);

// Exportation du routeur pour utilisation dans votre application principale

//##        création utilisateur du 15 août 2024

// module.exports.signUser_post = async (req, res) => {

// 	console.log(
// 		'🚀 ~ routesControl.js:1114 ~ SIGNUSER ~ req.body  ==> ',
// 		req.body
// 	);

// 	const {pseudo, email, pwd} = req.body;

// 	// Validation des champs requis
// 	if (!pseudo || !email || !pwd) {
// 		return res.status(400).json({
// 			success: false,
// 			message: "FROM LINE 1125 / Les champs 'pseudo', 'email' et 'mot de passe' sont obligatoires.",
// 		});
// 	}

// 	console.log(
// 		'🚀 ~ routesControl.js:1131 ~ module.exports.signUser_post= ~ email  ==> ',
// 		email
// 	);

// 	console.log(
// 		'🚀 ~ routesControl.js:1137 ~ module.exports.signUser_post= ~ pwd  ==> ',
// 		pwd
// 	);
// 	console.log(
// 		'🚀 ~ routesControl.js:1141 ~ module.exports.signUser_post= ~ pseudo  ==> ',
// 		pseudo
// 	);

// 	try {

// 	const newUser = new lambdaModel({
// 		pseudo: pseudo,
// 		email: email,
// 		pwd: pwd,

// 	});
// 		// Sauvegarde de l'utilisateur dans la base de données
// 		const savedUser = await newUser.save();
// 		console.log(
// 			'✅ Nouveau membre enregistré dans la base de données :  ',
// 			savedUser
// 		);

// 		// Génération du token après que l'utilisateur ait été sauvegardé
// 		const token = createToken(savedUser._id);
// 		console.log('✅ 🚨 FROM createUser_post ==>  TOKEN :', token);

// 		// Configuration du cookie avec le token
// 		res.cookie('jwt', token, {
// 			httpOnly: false, // Changé à true pour plus de sécurité
// 			maxAge: 31 * 24 * 60 * 60 * 1000,
// 			sameSite: 'None',
// 			secure: true,
// 			path: '/',
// 		});

// 		// Réponse au client
// 		res.status(200).json({
// 			message: 'Utilisateur créé avec succès',
// 			user: {
// 				pseudo: savedUser.pseudo,
// 				email: savedUser.email,
// 				role: savedUser.role,
// 			},
// 		});

// 		// Comptage des documents après la création de l'utilisateur
// 		const manyUsers = await countDoc(lambdaModel);
// 		console.log('NOUVEAU COMPTE DE LA COLLECTION  : ', manyUsers);
// 	} catch (err) {
// 		console.error(
// 			`🧨 🧨 🧨 FROM signUser_post / routesControl ERR - ERR COMPLETE- ERR MSG : `,
// 			err, err.message
// 			);

// 		res.status(400).json({success: false, message: err.message}); // Renvoie l'erreur au frontend
// 	}
// };

//##                           UTILISATEUR  - -                                -

//##    Méthode de déconnexion valide le 15 août

// module.exports.logOut_get = (req, res) => {
// 	res.cookie('jwt', '', {
// 		httpOnly: false, // Changé à true pour plus de sécurité
// 		maxAge: 1,
// 		sameSite: 'None',
// 		secure: true,
// 		path: '/',
// 	});
// 	res.redirect('/');
// };

// module.exports.search_post = (req, res) => {
// 	const {pseudo, email} = req.body;
// 	console.log('🚀 ~ .post ~ email:', email, '🚀 ~ .post ~ pseudo:', pseudo);
// 	const isit = findExistUser(newUser, 'membres', 'normal');
// 	if (isit) {
// 		res.render('popup', {isit});
// 	} else {
// 		res.render('popup', {isit});
// 	}
// };
