const nodemailer = require('nodemailer');

const transporterEli = nodemailer.createTransport({
	host: 'eliazoura.fr',
	port: 587,
	secure: false,
	auth: {
		user: 'eli@eliazoura.fr',
		pass: process.env.EMAIL_PASS,
	},
});

const goMail = (options, res) => {
	transporterEli.sendMail(options, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
			return res.status(500).send(error.toString());
		}
		console.log('Email sent:', info.response);
		res.status(200).json({
			message: 'Email sent',
			response: info.response,
		});
	});
};

module.exports = goMail;
