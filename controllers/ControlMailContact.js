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
