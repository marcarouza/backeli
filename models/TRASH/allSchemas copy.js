const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

// Schemas complemententaires
const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'lambda',
		required: true,
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'lambda',
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const chatSchema = new mongoose.Schema({
	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'lambda',
			required: true,
		},
	],
	messages: [messageSchema],
});

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'lambda',
			required: true,
		},
		category: {
			type: String, // La catégorie est maintenant une seule chaîne de caractères
			required: true,
		},
		tags: [String], // Les tags restent un tableau de chaînes de caractères
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

const userSchema = new mongoose.Schema({
	user: {
		type: String,
		unique: true,
		required: true,
		minlength: [
			3,
			'USER_MIN_SCHEM ==> Le nom doit contenir au moins 3 caractères FROM SCHEM',
		],
		maxlength: [
			24,
			'USER_MAX_SCHEM ==>  Le nom doit contenir au plus 24 caractères FROM SCHEM',
		],
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		unique: true,
		required: [true, "MAIL_REQ  ==>  L'email est requis FROM SCHEM"],
		validate: [isEmail, 'MAIL_VAL ==>  : email non valide FROM SCHEM'],
	},
	pwd: {
		type: String,
		required: [true, 'PWD_REQ ==>  mot de passe requis FROM SCHEM'],
		minlength: [8, 'PWD_MIN ==>  pwd min 8 caractères FROM SCHEM'],
	},
	role: {
		type: String,
		enum: ['normal', 'premium', 'admin'],
		default: 'normal',
	},
	dateInscription: {
		type: Date,
		default: Date.now,
	},
	friends: [
		{
			friendId: {
				type: mongoose.Schema.Types.ObjectId, // Utilisation d'un ObjectId pour stocker l'ID de l'ami
				required: true,
			},
			pseudo: String, // Optionnellement, stocker le nom de l'ami
		},
	],
	blocked: [
		{
			blockedId: {
				type: mongoose.Schema.Types.ObjectId, // Peut contenir l'ID de l'utilisateur bloqué en tant que chaîne
				required: true,
			},
			blocked: String, // Optionnellement, stocker le nom de l'utilisateur bloqué
		},
	],
	friendRequestsSent: [
		{
			toId: {
				type: mongoose.Schema.Types.ObjectId, // ID de l'utilisateur à qui la demande est envoyée
				required: true,
			},
			toPseudo: String, // Optionnellement, stocker le nom de l'utilisateur
			status: {
				type: String,
				enum: ['pending', 'accepted', 'rejected'],
				default: 'pending',
			},
			dateSent: {
				type: Date,
				default: Date.now,
			},
		},
	],
	friendRequestsReceived: [
		{
			fromId: {
				type: mongoose.Schema.Types.ObjectId, // ID de l'utilisateur qui a envoyé la demande
				required: true,
			},
			fromPseudo: String, // Optionnellement, stocker le nom de l'utilisateur
			fromEmail: String, // Optionnellement, stocker l'email de l'utilisateur
			status: {
				type: String,
				enum: ['pending', 'accepted', 'rejected'],
				default: 'pending',
			},
			dateReceived: {
				type: Date,
				default: Date.now,
			},
		},
	],
	chat: [chatSchema], // Ajout du sous-schéma des conversations ici
});

userSchema.statics.login = async function (email, pwd) {
	try {
		const user = await this.findOne({email});
		console.log('✅ FROM allSchemas static.login ==>  user :', user);

		if (!user) {
			throw new Error('😤 📬 ERR_MAIL_LOGIN: Email non trouvé');
		}

		const isMatch = await bcrypt.compare(pwd, user.pwd);

		if (!isMatch) {
			throw new Error('😤 🎲 ERR_PWD_LOGIN: Mot de passe incorrect');
		}

		return user;
	} catch (err) {
		throw err; // Relancer l'erreur d'origine
	}
};

// userSchema.statics.login = async function (email, pwd) {
// 	const user = await this.findOne({email});
// 	console.log('🚀 ~ user:', user);

// 	if (user) {
// 		const auth = await bcrypt.compare(pwd, user.pwd);
// 		if (auth) {
// 			return user;
// 		}
// 		throw new Error(
// 			'ERR_PWD_LOGIN => PWD_INCORRECT /// EMAIL OK from Schema.static.LOGIN'
// 		);
// 	}
// 	throw new Error(
// 		'ERR_MAIL_LOGIN => MAIL_INEXISTANT EN BDD from Schema.static.LOGIN'
// 	);
// };

// userSchema.statics.register = async function (userData) {
// 	// Renommage de 'user' à 'userData' pour éviter la confusion avec le champ 'user'
// 	try {
// 		// Vérifier si l'utilisateur existe déjà
// 		const existingUser = await this.findOne({user: userData.user});
// 		if (existingUser) {
// 			throw new Error('🚫  ERR_USER_EXIST => UTILISATEUR EXISTANT');
// 		}

// 		// Créer un nouvel utilisateur
// 		const newUser = new this(userData);
// 		await newUser.save();
// 		return newUser;
// 	} catch (err) {
// 		throw err;
// 	}
// };

userSchema.pre('save', async function (next) {
	try {
		if (this.isModified('pwd')) {
			const salt = await bcrypt.genSalt(10);
			// console.log('🚀 ~ userSchema.pre ~ salt:', salt);
			this.pwd = await bcrypt.hash(this.pwd, salt);
			console.log('🚀 ~ userSchema.pre ~ this.pwd:', this.pwd);
		}
		next();
	} catch (error) {
		console.log(
			'♥︎  ♥︎  ♥︎ ~ ERROR FROM userSchema / preSAVE :::',
			error
		);
		next(error);
	}
});

const lambdaModel = mongoose.model('lambda', userSchema);

const chatModel = mongoose.model('chat', chatSchema);

const postModel = mongoose.model('post', postSchema);

module.exports = {lambdaModel, postModel, chatModel, messageSchema};
