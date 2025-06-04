
//##                  FRIENDS                           -

//?? ---  DEMANDER EN AMI  ----------------

module.exports.askFor1Friend_post = async (req, res) => {
   const {toID, fromID} = req.body;
   console.log(
      'ℹ️ ~ askFor1Friend_post ==> fromID / toID / typeOf : ',
      fromID,
      toID,
      typeof fromID
   );

   if (!toID || !fromID) {
      return res.status(400).json({
         message: '🧨  toID ou fromID MANQUANT dans request body',
      });
   }

   try {
      // Trouver le demandeur
      const fromFriend = await lambdaModel.findById(fromID);
      if (!fromFriend) {
         return res.status(404).json({
            message: '🧨 🧨 🧨 FROM askFor1Friend => fromFriend non trouvé',
         });
      }
      console.log('✎  fromFriend:', fromFriend);

      // Trouver le receveur
      const toFriend = await lambdaModel.findById(toID);
      if (!toFriend) {
         return res.status(404).json({
            message: '🧨 🧨 🧨 FROM askFor1Friend => toFriend non trouvé',
         });
      }

      console.log('✎  toFriend :', toFriend);

      // Vérifier si une demande est déjà en attente
      const reqOUT = toFriend.friendReqIN.some(
         (req) => req.fromID.toString() === fromID.toString()
      );

      const reqIN = fromFriend.friendReqOUT.some(
         (req) => req.toID.toString() === toID.toString()
      );

      if (reqOUT && reqIN) {
         return res.status(400).json({
            message: `Demande déjà envoyée à ${toFriend.pseudo}, veuillez attendre sa réponse 🚫 `,
         });
      }
      console.log(
         ' /////  reqOUT  ////////// reqIN : ',
         reqOUT,
         '////',
         reqIN
      );

      if (reqOUT || reqIN) {
         const statusONE = reqOUT.status;
         const statusTWO = reqIN.status;
         const status = reqOUT?.status || reqIN?.status;

         console.log('===>> status OPT : ', status);

         if (statusONE === 'pending' && statusTWO === 'pending') {
            return res.status(409).json({
               message: `Demande d'ami déjà faite et en attente de réponse 🚨 .`,
            });
         } else if (status === 'accepted') {
            return res.status(409).json({
               message: `Demande d'ami déjà acceptée, vous êtes amis.🚨 `,
            });
         } else if (status === 'rejected') {
            return res.status(409).json({
               message: `Demande d'ami déjà rejetée, vous ne pouvez pas la renouveler 🚨`,
            });
         }
      }

      // Si aucune demande existante, procéder à l'ajout
      try {
         const promiseIONE = lambdaModel.updateOne(
            {_id: fromID},
            {
               $addToSet: {
                  friendReqOUT: {
                     toID: toID,
                     toPseudo: toFriend.pseudo,
                     status: 'pending',
                     date: new Date(),
                  },
               },
            }
         );

         const promiseTWO = lambdaModel.updateOne(
            {_id: toID},
            {
               $addToSet: {
                  friendReqIN: {
                     fromID: fromID,
                     fromPseudo: fromFriend.pseudo,
                     status: 'pending',
                     dateReceived: new Date(),
                  },
               },
            }
         );

         await Promise.all([promiseIONE, promiseTWO]);

         return res.status(200).json({
            message: `✅ Demande d'ami envoyée à ${toFriend.pseudo} avec succès !`,
         });
      } catch (err) {
         console.error(
            '🧨 🧨 🧨 Erreur lors de lenvoi de la demande dami:',
            err
         );
         return res.status(500).json({
            message: '🧨 Une erreur est survenue lors de l envoi de la demande dami.',
         });
      }
   } catch (err) {
      console.error(
         '🧨 🧨 🧨 FROM askFor1Friend toID => ERR TRY Global : ',
         err
      );
      return res.status(500).json({
         err: err,
         message: '🧨  FROM askFor1Friend => ERR CATCH GLOBAL askFor1Friend',
      });
   }
};

// module.exports.askFor1Friend_post = async (req, res) => {
//    const {toID, fromID} = req.body;
//    console.log(
//       'ℹ️ ~ askFor1Friend_post ==> fromID / toID / typeOf : ',
//       fromID,
//       toID,
//       typeof fromID
//    );

//    if (!toID || !fromID) {
//       return res.status(400).json({
//          message: '🧨  toID ou fromID MANQUANT dans request body',
//       });
//    }

//    try {
//       // Trouver le demandeur
//       const fromFriend = await lambdaModel.findById(fromID);
//       if (!fromFriend) {
//          return res.status(404).json({
//             message: '🧨 🧨 🧨 FROM askFor1Friend => fromFriend non trouvé',
//          });
//       }
//       console.log('✎  fromFriend:', fromFriend);

//       // Trouver le receveur
//       const toFriend = await lambdaModel.findById(toID);
//       if (!toFriend) {
//          return res.status(404).json({
//             message: '🧨 🧨 🧨 FROM askFor1Friend => toFriend non trouvé',
//          });
//       }

//       console.log('✎  toFriend :', toFriend);

//       // Vérifier si une demande est déjà en attente
//       const reqOUT = toFriend.friendReqIN.some(
//          (req) => req.fromID.toString() === fromID.toString()
//       );

//       const reqIN = fromFriend.friendReqOUT.some(
//          (req) => req.toID.toString() === toID.toString()
//       );

//       if (reqOUT && reqIN) {
//          return res.status(400).json({
//             message: `Demande déjà envoyée à ${toFriend.user}, veuillez attendre sa réponse 🚫 `,
//          });
//       }
//       console.log(
//          ' /////  reqOUT  ////////// reqIN : ',
//          reqOUT,
//          '////',
//          reqIN
//       );

//       if (reqOUT || reqIN) {
//          const statusONE = reqOUT.status;
//          const statusTWO = reqIN.status;
//          const status = reqOUT?.status || reqIN?.status;

//          console.log('===>> status OPT : ', status);

//          if (statusONE === 'pending' && statusTWO === 'pending') {
//             return res.status(409).json({
//                message: `Demande d'ami déjà faite et en attente de réponse 🚨 .`,
//             });
//          } else if (status === 'accepted') {
//             return res.status(409).json({
//                message: `Demande d'ami déjà acceptée, vous êtes amis.🚨 `,
//             });
//          } else if (status === 'rejected') {
//             return res.status(409).json({
//                message: `Demande d'ami déjà rejetée, vous ne pouvez pas la renouveler 🚨`,
//             });
//          }
//       }

//       // Si aucune demande existante, procéder à l'ajout
//       try {
//          const promiseIONE = lambdaModel.updateOne(
//             {_id: fromID},
//             {
//                $addToSet: {
//                   friendReqOUT: {
//                      toID: toID,
//                      toPseudo: toFriend.user,
//                      status: 'pending',
//                      date: new Date(),
//                   },
//                },
//             }
//          );

//          const promiseTWO = lambdaModel.updateOne(
//             {_id: toID},
//             {
//                $addToSet: {
//                   friendReqIN: {
//                      fromID: fromID,
//                      fromPseudo: fromFriend.user,
//                      status: 'pending',
//                      dateReceived: new Date(),
//                   },
//                },
//             }
//          );

//          await Promise.all([promiseIONE, promiseTWO]);

//          return res.status(200).json({
//             message: `✅ Demande d'ami envoyée à ${toFriend.user}`,
//          });
//       } catch (err) {
//          console.error(
//             '🧨 🧨 🧨 Erreur lors de lenvoi de la demande dami:',
//             err
//          );
//          return res.status(500).json({
//             message: '🧨 Une erreur est survenue lors de l envoi de la demande dami.',
//          });
//       }
//    } catch (err) {
//       console.error(
//          '🧨 🧨 🧨 FROM askFor1Friend toID => ERR TRY Global : ',
//          err
//       );
//       return res.status(500).json({
//          err: err,
//          message: '🧨  FROM askFor1Friend => ERR CATCH GLOBAL askFor1Friend',
//       });
//    }
// };

//?? ACCEPT FRIEND

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
            message: `La demande d'ami (envoyée ou reçue) n'existe pas (ou plus). Contacter l'administrateur du site pour en savoir plus.🚫 `,
         });
      }

      // Retrouve les pseudos
      const fromPseudo = fromUserOne.user;
      console.log(' ==> fromPseudo : ', fromPseudo);
      const toPseudo = toUserOne.user;
      console.log('==> toPseudo :', toPseudo);

      const askFROM = fromUserOne.friendReqOUT.find((search) =>
         search.toID.equals(toID).toString()
      );

      const askTO = toUserOne.friendReqIN.find((search) =>
         search.fromID.equals(fromID).toString()
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
                  "Demande d'ami updateTO mise à jour avec succès"
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
         updateFROM(fromID, toID, 'accepted'),
         updateTO(toID, fromID, 'accepted'),
      ]);

      // Répondre avec succès
      res.json({message: "🎉 Demande d'ami acceptée avec succès !"});
   } catch (err) {
      console.error('🧨 Erreur lors ACCEPT FRIEND', err);
      res.status(500).json({
         message: '🧨 Erreur serveur ACCEPT FRIEND',
         error: err.message,
      });
   }
};

//?? ---  MAIL ASK FOR FRIEND  ----------------

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




//?? ---  ASK FOR A FRIEND  ----------------

module.exports.askFor1Friend_post = async (req, res) => {
   const {toID, fromID} = req.body;
   console.log(
      'ℹ️ ~ askFor1Friend_post ==> fromID / toID / typeOf : ',
      fromID,
      toID,
      typeof fromID
   );

   if (!toID || !fromID) {
      return res.status(400).json({
         message: '🧨  toID ou fromID MANQUANT dans request body',
      });
   }

   try {
      // Trouver le demandeur
      const fromFriend = await lambdaModel.findById(fromID);
      if (!fromFriend) {
         return res.status(404).json({
            message: '🧨 🧨 🧨 FROM askFor1Friend => fromFriend non trouvé',
         });
      }
      console.log('✎  fromFriend:', fromFriend);

      // Trouver le receveur
      const toFriend = await lambdaModel.findById(toID);
      if (!toFriend) {
         return res.status(404).json({
            message: '🧨 🧨 🧨 FROM askFor1Friend => toFriend non trouvé',
         });
      }

      console.log('✎  toFriend :', toFriend);

      // Vérifier si une demande est déjà en attente
      const reqOUT = toFriend.friendReqIN.some(
         (req) => req.fromID.toString() === fromID.toString()
      );

      const reqIN = fromFriend.friendReqOUT.some(
         (req) => req.toID.toString() === toID.toString()
      );

      if (reqOUT && reqIN) {
         return res.status(400).json({
            message: `Demande déjà envoyée à ${toFriend.pseudo}, veuillez attendre sa réponse 🚫 `,
         });
      }
      console.log(
         ' /////  reqOUT  ////////// reqIN : ',
         reqOUT,
         '////',
         reqIN
      );

      if (reqOUT || reqIN) {
         const statusONE = reqOUT.status;
         const statusTWO = reqIN.status;
         const status = reqOUT?.status || reqIN?.status;

         console.log('===>> status OPT : ', status);

         if (statusONE === 'pending' && statusTWO === 'pending') {
            return res.status(409).json({
               message: `Demande d'ami déjà faite et en attente de réponse 🚨 .`,
            });
         } else if (status === 'accepted') {
            return res.status(409).json({
               message: `Demande d'ami déjà acceptée, vous êtes amis.🚨 `,
            });
         } else if (status === 'rejected') {
            return res.status(409).json({
               message: `Demande d'ami déjà rejetée, vous ne pouvez pas la renouveler 🚨`,
            });
         }
      }

      // Si aucune demande existante, procéder à l'ajout
      try {
         const promiseIONE = lambdaModel.updateOne(
            {_id: fromID},
            {
               $addToSet: {
                  friendReqOUT: {
                     toID: toID,
                     toPseudo: toFriend.pseudo,
                     status: 'pending',
                     date: new Date(),
                  },
               },
            }
         );

         const promiseTWO = lambdaModel.updateOne(
            {_id: toID},
            {
               $addToSet: {
                  friendReqIN: {
                     fromID: fromID,
                     fromPseudo: fromFriend.pseudo,
                     status: 'pending',
                     dateReceived: new Date(),
                  },
               },
            }
         );

         await Promise.all([promiseIONE, promiseTWO]);

         return res.status(200).json({
            message: `✅ Demande d'ami envoyée à ${toFriend.pseudo} avec succès !`,
         });
      } catch (err) {
         console.error(
            '🧨 🧨 🧨 Erreur lors de lenvoi de la demande dami:',
            err
         );
         return res.status(500).json({
            message: '🧨 Une erreur est survenue lors de l envoi de la demande dami.',
         });
      }
   } catch (err) {
      console.error(
         '🧨 🧨 🧨 FROM askFor1Friend toID => ERR TRY Global : ',
         err
      );
      return res.status(500).json({
         err: err,
         message: '🧨  FROM askFor1Friend => ERR CATCH GLOBAL askFor1Friend',
      });
   }
};

//?? ACCEPT FRIEND

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
            message: `La demande d'ami (envoyée ou reçue) n'existe pas (ou plus). Contacter l'administrateur du site pour en savoir plus.🚫 `,
         });
      }

      // Retrouve les pseudos
      const fromPseudo = fromUserOne.pseudo;
      console.log(' ==> fromPseudo : ', fromPseudo);
      const toPseudo = toUserOne.pseudo;
      console.log('==> toPseudo :', toPseudo);

      const askFROM = fromUserOne.friendReqOUT.find((search) =>
         search.toID.equals(toID).toString()
      );

      const askTO = toUserOne.friendReqIN.find((search) =>
         search.fromID.equals(fromID).toString()
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
                  "Demande d'ami updateTO mise à jour avec succès"
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
         updateFROM(fromID, toID, 'accepted'),
         updateTO(toID, fromID, 'accepted'),
      ]);

      // Répondre avec succès
      res.json({message: "🎉 Demande d'ami acceptée avec succès !"});
   } catch (err) {
      console.error('🧨 Erreur lors ACCEPT FRIEND', err);
      res.status(500).json({
         message: '🧨 Erreur serveur ACCEPT FRIEND',
         error: err.message,
      });
   }
};

