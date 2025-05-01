const nodemailer = require('nodemailer');

// Créer un transporteur SMTP réutilisable
let transporterGMAIL = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'votreadresse@gmail.com', // Votre adresse e-mail Gmail
		pass: 'votremotdepasse', // Mot de passe de votre compte Gmail
	},
});

let transporterOUTLOOK = nodemailer.createTransport({
	host: 'smtp-mail.outlook.com',
	port: 587,
	secure: false, // true pour le port 465, false pour les autres ports
	auth: {
		user: 'votreadresse@outlook.com', // Votre adresse e-mail Outlook.com
		pass: 'votremotdepasse', // Mot de passe de votre compte Outlook.com
	},
});

// Paramètres de l'e-mail
let mailOptions = {
	from: 'votreadresse@gmail.com', // Adresse e-mail de l'expéditeur
	to: 'adressedestinataire@example.com', // Adresse e-mail du destinataire
	subject: "Test d'envoi d'e-mail avec Node.js", // Sujet de l'e-mail
	text: "Ceci est un test d'envoi d'e-mail avec Node.js.", // Corps de l'e-mail (format texte)
	// html: '<h1>Ceci est un test d\'envoi d\'e-mail avec Node.js</h1>' // Vous pouvez également envoyer un e-mail au format HTML
};

//## SMTP PERSO

let transporter = nodemailer.createTransport({
	// host: 'smtp.sendgrid.net',
	host: 'eliazoura.fr',
	port: 587,
	secure: false, // true pour le port 465, false pour les autres ports
	auth: {
		user: 'eli@eliazoura.fr', // Votre clé API SendGrid
		pass: 'YachaR#398@', // Mot de passe vide ou votre clé API SendGrid
	},
});

const mailOptions = {
	from: 'eli@eliazoura.fr',
	to: 'recipient@example.com',
	subject: 'Test email from personal SMTP server',
};

// Envoyer l'e-mail
transporter.sendMail(mailOptions, function (error, info) {
	if (error) {
		console.log(error);
	} else {
		console.log('Email envoyé: ' + info.response);
	}
});
//
