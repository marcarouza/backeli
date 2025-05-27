//?? ---  MAIL ASK FOR FRIEND  ----------------

module.exports.mailFriendReq_post = (req, res) => {
	const {fromEmail, toEmail, pseudo, subject, text} = req.body;

	console.log('🚀 ~ mailFriendReq_post REQ BODY : ', req.body);

	if (!fromEmail || !toEmail || !pseudo) {
		return res
			.status(400)
			.send(
				'🧨 🧨 🧨 FROM mailFriendReq_post => fromEmail, toEmail, pseudo : Tous ces paramètres sont requis'
			);
	} else {
		// envoi admin
		const mailAdminContact = {
			from: fromEmail,
			to: 'eli@eliazoura.fr',
			replyTo: fromEmail, // Répondre à l'expéditeur du formulaire
			subject: subject,
			text: text,
		};

		transporterEli.sendMail(mailAdminContact, (error, info) => {
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

		// envoi user
		const mailUserContact = {
			from: 'eli@eliazoura.fr',
			to: fromEmail,
			replyTo: 'eli@eliazoura.fr', // Répondre à l'expéditeur du formulaire
			subject: `Demande d'amis envoyée `,
			text: `Voici la copie du message que vous venez de m'envoyer sur mon site : ${text}`,
		};

		transporterEli.sendMail(mailUserContact, (error, info) => {
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
	}
};

//?? REJECT  FRIEND
module.exports.rejectFriendReq_post = async (req, res) => {
	try {
		const {fromID, toID} = req.body;
		console.log('✅ DEMANDE DE fromID : ', fromID, 'VERS : ', toID);

		// Trouver la demande d'ami envoyée
		const fromUserOne = await lambdaModel.findOne({
			_id: fromID,
			'friendReqOUT.toID': toID,
		});
		console.log(
			'🚀 ~ module.exports.acceptFriendReq_post= ~ fromUserOne:',
			fromUserOne
		);

		const toUserOne = await lambdaModel.findOne({
			_id: toID,
			'friendReqIN.fromID': fromID,
		});

		if (!fromUserOne || !toUserOne) {
			console.log('🧨 FROM USER ONE trouvé !!! : ', fromUserOne);
			return res.status(404).json({
				message: `La demande d'ami (envoyée ou reçue) n'existe pas (ou plus). Contacter l'administrateur du site pour en savoir plus 🚫 .`,
			});
		}

		// Retrouve les pseudos
		const fromPseudo = fromUserOne.pseudo;
		console.log(' ==> fromPseudo : ', fromPseudo);
		const toPseudo = toUserOne.pseudo;
		console.log('==> toPseudo :', toPseudo);

		const askFROM = fromUserOne.friendReqOUT.find((search) =>
			search.toID.equals(toID)
		);

		const askTO = toUserOne.friendReqIN.find((search) =>
			search.fromID.equals(fromID)
		);
		console.log('✅ askTO:', askTO, '✅ askFROM:', askFROM);

		if (!askFROM || !askTO) {
			return res.status(400).json({
				message: "⚠️ La demande d'ami n'a pas été trouvée. Veuillez contacter l'administrateur du site.",
			});
		}

		const fromSTATUS = askFROM.status;
		const toSTATUS = askTO.status;
		console.log('===> askFROM,fromSTATUS :', askFROM, fromSTATUS);
		console.log('===> askTO,toSTATUS : ', askTO, toSTATUS);

		// Vérifier si la demande est toujours en attente
		if (fromSTATUS == 'pending' || toSTATUS == 'pending') {
			const updateFROM = async (fromID, toID, newStatus) => {
				try {
					const result = await lambdaModel.updateOne(
						{
							_id: fromID,
							'friendReqOUT.toID': toID,
						},
						{
							$set: {
								'friendReqOUT.$.status': newStatus,
							},
						}
					);

					if (result.modifiedCount > 0) {
						console.log(
							"REJET d'ami FROM mise à jour avec succès"
						);
					} else {
						console.log(
							"Aucune mise à jour effectuée pour FROM. L'utilisateur ou la demande d'ami n'a pas été trouvé."
						);
					}

					return result;
				} catch (error) {
					console.error(
						"Erreur lors de la mise à jour de la demande d'ami FROM:",
						error
					);
					throw error;
				}
			};

			const updateTO = async (toID, fromID, newStatus) => {
				try {
					const result = await lambdaModel.updateOne(
						{
							_id: toID,
							'friendReqIN.fromID': fromID,
						},
						{
							$set: {
								'friendReqIN.$.status': newStatus,
							},
						}
					);

					if (result.modifiedCount > 0) {
						console.log(
							"REJET d'ami FROM mise à jour avec succès"
						);
					} else {
						console.log(
							"Aucune mise à jour effectuée pour TO. L'utilisateur ou la demande d'ami n'a pas été trouvé."
						);
					}

					return result;
				} catch (error) {
					console.error(
						"Erreur lors de la mise à jour de la demande d'ami TO:",
						error
					);
					throw error;
				}
			};

			//

			await Promise.all([
				updateFROM(fromID, toID, 'rejected'),
				updateTO(toID, fromID, 'rejected'),
			]);

			return res.status(200).json({
				message: `Demande rejetée. ${fromPseudo} ne pourra pas renouveller sa demande. 🚫`,
			});

			// Rejet confirmé
		} else {
			return res.status(400).json({
				message: "⚠️ Votre refus ne peut pas être traité. Veuillez contacter l'administrateur du site pour en savoir plus : contact@eliazoura.fr",
			});
		}
	} catch (err) {
		console.error(
			"Err CATCH GLOBAL lors du REJET  de demande d'ami:",
			err
		);
		res.status(500).json({message: 'Erreur serveur', error: err.message});
	}
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
