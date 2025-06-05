// module.exports.getInfo = async (req, res) => {
// 	const userAgentInfo = {
// 		browser: req.useragent.browser,
// 		version: req.useragent.version,
// 		os: req.useragent.os,
// 		platform: req.useragent.platform,
// 		isMobile: req.useragent.isMobile,
// 		isDesktop: req.useragent.isDesktop,
// 		isBot: req.useragent.isBot,
// 		source: req.useragent.source,
// 	};

// 	return res.status(200).json({
// 		userAgentInfo,
// 		message: 'Informations récupérées avec succès',
// 	});

// };

/**
 * Récupère les informations de l'user-agent depuis la requête et les renvoie au format JSON.
 *
 * @param {object} req - La requête Express attendue avec un objet useragent.
 * @param {object} res - La réponse Express utilisée pour envoyer le JSON.
 * @returns {Promise<void>}
 */
module.exports.Get_Agent = async (req, res) => {
	try {
	  // Vérifier si les informations de l'user-agent sont présentes dans la requête.
	  if (!req.useragent) {
		 return res.status(400).json({
			message: 'Informations sur l\'user-agent non trouvées dans la requête.',
		 });
	  }
 
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
	} catch (error) {
	  console.error('Erreur lors de la récupération des informations user-agent : ', error);
	  return res.status(500).json({
		 message: 'Erreur interne du serveur.',
	  });
	}
 };
 