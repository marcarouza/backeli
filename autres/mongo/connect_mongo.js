const mongoose = require('mongoose');
//
//
//## 'User' : C'est le nom du modèle.
//## Le premier argument de mongoose.model est le nom SINGULIER que nous donnons au modèle.
//## Mongoose transforme automatiquement en pluriel le nom du modèle lors de la recherche de la collection correspondante dans MongoDB. Donc, dans ce cas, Mongoose va chercher la collection 'users' dans la base de données.

//
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	motDePasse: {
		type: String,
		required: true,
	},
});
//

//
const player = mongoose.model('player', userSchema);

//####################################################
const DB_NAME = process.env.DB_NAME;
const DB_COLEC = process.env.DB_COLEC;
//
const USER_NAME = process.env.USER_NAME;
const USER_PASS = process.env.USER_PASS;
//
const URI1 = process.env.URI1;
console.log('🚀 TYPEOF URI1:', typeof URI1);
//
const URI2 = process.env.URI2;
const URI3 = process.env.URI3;
//
const dbURI = `${URI1}${USER_NAME}:${USER_PASS}${URI2}${DB_NAME}${URI3}`;
// const dbURI = `${URI1}${pass}${URI2}${dbColec}${URI3}`;

console.log('🚀🚀🚀 ~ dbURIfinal:', dbURI, 'typeof', typeof dbURI);

//####################################################
// const dbURI ='mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/?retryWrites=true&w=majority';//## NOTE DE RAPPEL

const connectDB = function () {
	mongoose
		.connect(dbURI)
		.then((result) => {
			console.log(
				'Connecté à MONGO avec la DataBase : ' +
					DB_NAME +
					' avec la collection : ' +
					DB_COLEC
			);
		})
		.catch((err) => console.log(err));
};

//#####################################################

module.exports = {player, player2, connectDB};
