const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');

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
			type: String, // Enregistre directement le champ 'user' du userSchema
			required: true,
		},
		tags: [String],
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
	pseudo: {
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
		trim: true,
		lowercase: true,
	},
	pwd: {
		type: String,
		required: [true, 'PWD_REQ ==>  mot de passe requis FROM SCHEM'],
		minlength: [8, 'PWD_MIN ==>  pwd min 8 caractères FROM SCHEM'],
		trim: true,
	},

	firstname: {
		type: String,
		required: false,
		trim: true,
	},
	lastname: {
		type: String,
		required: false,
		trim: true,
	},
	birthDate: {
		type: Date,
		required: false,
		trim: true,
		default: Date.now,
	},

	isActive: {
		type: Boolean,
		default: false,
	},

	role: {
		type: String,
		enum: ['normal', 'premium', 'admin'],
		default: 'normal',
		trim: true,
	},
	dateInscription: {
		type: Date,
		default: Date.now,
	},
	friends: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId, // Utilisation d'un ObjectId pour stocker l'ID de l'ami
				required: true,
			},
			pseudo: String, // Tableau pour stocker plusieurs pseudonymes// Optionnellement, stocker le nom de l'ami
		},
	],

	friendReqIN: [
		{
			fromID: {
				type: mongoose.Schema.Types.ObjectId, // ID de l'utilisateur qui a envoyé la demande
				required: true,
			},
			fromPseudo: String, // Optionnellement, stocker le nom de l'utilisateur
			status: {
				type: String,
				enum: ['pending', 'accepted', 'rejected'],
				default: 'pending',
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],

	friendReqOUT: [
		{
			toID: {
				type: mongoose.Schema.Types.ObjectId, // ID de l'utilisateur à qui la demande est envoyée
				required: true,
			},
			toPseudo: String, // Optionnellement, stocker le nom de l'utilisateur
			status: {
				type: String,
				enum: ['pending', 'accepted', 'rejected'],
				default: 'pending',
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],

	blocked: [
		{
			blockedID: {
				type: mongoose.Schema.Types.ObjectId, // Peut contenir l'ID de l'utilisateur bloqué en tant que chaîne
				required: true,
			},
			pseudo: String, // Optionnellement, stocker le nom de l'utilisateur bloqué
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

		user.isActive = true;
		await user.save(); // Sauvegarder les changements dans la base de données

		return user;
	} catch (err) {
		throw err; // Relancer l'erreur d'origine
	}
};

userSchema.methods.logout = async function () {
	try {
		this.isActive = false; // Définir le statut comme inactif
		await this.save(); // Sauvegarder les changements dans la base de données
		console.log(
			'✅ FROM logout method ==> Utilisateur déconnecté :',
			this.user
		);
		return this.user;
	} catch (err) {
		console.error('Erreur lors de la déconnexion :', err);
		throw err; // Relancer l'erreur d'origine
	}
};

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
		next();
	}
});

const lambdaModel = mongoose.model('lambda', userSchema);

const chatModel = mongoose.model('chat', chatSchema);

const postModel = mongoose.model('post', postSchema);

module.exports = {lambdaModel, postModel, chatModel};