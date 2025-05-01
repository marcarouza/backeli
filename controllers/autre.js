module.exports.acceptFriendReq_post = async (req, res) => {
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
				message: `🚫 La demande d'ami (envoyée ou reçue) n'existe pas (ou plus). Contacter l'administrateur du site pour en savoir plus.`,
			});
		}

		// Retrouve les pseudos
		const fromPseudo = fromUserOne.user;
		console.log(' ==> fromPseudo : ', fromPseudo);
		const toPseudo = toUserOne.user;
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
		if (fromSTATUS !== 'pending' || toSTATUS !== 'pending') {
			return res.status(400).json({
				message: "⚠️ La demande d'ami a déjà été traitée (acceptée ou refusée). Veuillez contacter l'administrateur du site pour en savoir plus : contact@eliazoura.fr",
			});
		}

		const upDateFROM = async (fromID, toID, newStatus) => {
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
						$push: {
							friends: {
								id: toID,
								pseudo: toPseudo,
							},
						},
					}
				);

				if (result.modifiedCount > 0) {
					console.log(
						"Demande d'ami FROM mise à jour avec succès"
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

		const upDateTO = async (toID, fromID, newStatus) => {
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
						$push: {
							friends: {
								id: fromID,
								pseudo: fromPseudo,
							},
						},
					}
				);

				if (result.modifiedCount > 0) {
					console.log(
						"Demande d'ami TO mise à jour avec succès"
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

		await Promise.all([
			upDateFROM(fromID, toID, 'accepted'),
			upDateTO(toID, fromID, 'accepted'),
		]);

		// Répondre avec succès
		res.json({message: "🎉 Demande d'ami acceptée avec succès !"});
	} catch (err) {
		console.error(
			"Erreur lors de l'acceptation de la demande d'ami:",
			err
		);
		res.status(500).json({message: 'Erreur serveur', error: err.message});
	}
};
