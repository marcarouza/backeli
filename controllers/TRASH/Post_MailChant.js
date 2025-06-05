const {transporterEli} = require('../../config/NodeMailerConfig');

//##                ENVOIS DE MAIL pour FORMULAIRE CONTACT CELINE          -

module.exports.contactFormChant = async (req, res) => {
	const {firstName, lastName, email, phone, subject, message} = req.body;

	console.log('🚀 ~ router.post ~ CONTACT REQ.BODY:', req.body);

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

	if (!firstName || !lastName || !email || !subject || !phone || !message) {
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

		// res.status(200).json({
		// 	message: '✅ ✅ from CONTACTPage => 2 Emails USER & ADMIN sent successfully',
		// });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({
			error: error.toString(),
			message: '🍌 🍌 🍌 FROM contactForm_post => CATCH ERR  occurred while sending email. (199).',
		});
	}
};

module.exports.contactForm_chant_post = async (req, res) => {
	const {firstname, lastname, email, phone, subject, message} = req.body;

	console.log('🚀 ~ router.post ~ CONTACT REQ.BODY:', req.body);

	if (!firstname || !lastname || !email || phone || !subject || !message) {
		return res.status(400).json({
			error: '🍌 🍌 🍌 🍌 🍌 FROM contactForm_post => All fields required.',
		});
	}

	const mailAdminContact = {
		from: email,
		to: 'celine@celine-azoura.fr',
		replyTo: email,
		subject: `${subject}: Nouvelle demande de contact`,
		text: `Nom: ${lastname}\nPrénom: ${firstname}\nCode:\nPhone: ${phone}\n\nMessage:\n${message}`,
	};

	const mailUserContact = {
		from: 'celine@celine-azoura.fr',
		to: email,
		replyTo: 'celine@celine-azoura.fr',
		subject: `Copie de votre message envoyé depuis eliazoura.fr - ${subject}`,
		text: `Voici la copie du message que vous venez de m'envoyer sur mon site / Nom: ${lastname}\nPrénom: ${firstname}\nCode:\nPhone: ${phone}\n\nMessage:\n${message}`,
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
