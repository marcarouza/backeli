//##                ROUTES DU BLOG                                   -

//?? ---- ROUTE API BLOG ----------------------------

module.exports.allPosts_get = async (req, res) => {
	console.log('🚨 FROM  allPosts_get =+> req :', req);
	console.log(`TEST ACCES ROUTE API POST allPosts_get`);
	try {
		const allPosts = await postModel.find({});
		console.log(
			'✅ ℹ️ FROM  allPosts-get : ',
			allPosts,
			'TYPE OF : ',
			typeof allPosts
		);
		res.status(200).json({success: true, data: allPosts});
	} catch (err) {
		console.error(
			`🧨 FROM allPosts_post ERR impossible de récupérer tous les POSTS`,
			err
		);
		res.status(500).json({
			success: false,
			error: "Erreur technique lors de l'accès aux POSTS",
			message: 'Veuillez nous excuser pour la gêne occasionnée 🚫 .',
		});
	}
};

module.exports.OnePostById_get = async (req, res) => {
	console.log(`TEST ACCES ROUTE API POST getPostById`);
	try {
		const postId = req.params.id; // Récupère l'ID du post depuis les paramètres de l'URL
		const post = await postModel.findById(postId); // Utilise l'ID pour trouver le post

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post non trouvé 🚫 ',
			});
		}

		console.log('✅ ℹ️ FROM getPostById : ', post);
		res.status(200).json({success: true, data: post});
	} catch (err) {
		console.error(
			`🧨 FROM getPostById ERR impossible de récupérer le POST`,
			err
		);
		res.status(500).json({
			success: false,
			error: "Erreur technique lors de l'accès au POST",
			message: 'Veuillez nous excuser pour la gêne occasionnée 🚫 ',
		});
	}
};

module.exports.addOnePost_post = async (req, res) => {
	try {
		// Récupérer les données du corps de la requête
		const {title, content, categories, tags, author} = req.body;

		// Créer un nouvel objet post basé sur le modèle
		const newPost = new postModel({
			title: title,
			content: content,
			categories: categories,
			tags: tags,
			author: author,

			date: new Date(), // Ajouter la date actuelle
		});

		// Sauvegarder le nouveau post dans la base de données
		const savedPost = await newPost.save();

		// Répondre avec le post sauvegardé
		res.status(201).json({
			success: true,
			message: 'Post créé avec succès',
			post: savedPost,
		});
	} catch (err) {
		// Gérer les erreurs éventuelles
		console.error(`🧨 Erreur lors de la création du post :`, err);
		res.status(500).json({
			success: false,
			message: 'Erreur lors de la création du post',
			error: err.message,
		});
	}
};

module.exports.blog_get = (req, res) => {
	res.render('pages/blogPages/blog');
};

module.exports.postWrite_get = (req, res) => {
	res.render('pages/blogPages/postWrite');
};

module.exports.postSearch_get = (req, res) => {
	res.render('pages/blogPages/postSearch');
};
