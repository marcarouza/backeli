const {transporterEli} = require('../config/NodeMailerConfig');

//##                       ENVOI MAIL  FORMULAIRE INSCRIPTION                            -

module.exports.signConfirm_post = async (req, res) => {
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
