const dbName = 'eliusers';
const mongoose = require('mongoose');
//
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
//####################################################
const User = mongoose.model('User', userSchema);
//####################################################
const dbURI =
	'mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/eliusers?retryWrites=true&w=majority';
//mongodb://localhost:27017
mongoose
	.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
	.then((result) => {
		console.log('Connected to MongoDB');
		//app.listen(port, () => {
		//	console.log("Server is running on http://localhost : " + port);
		//}
		//);
	})
	.catch((err) => console.log(err));
//#####################################################

// URL de connexion à la base de données MongoDB
//const url = "mongodb://localhost:27017";

// Fonction pour se connecter à la base de données
async function connectToDatabase() {
	const client = new MongoClient(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	console.log('Connecté à la base de données');
	return client.db(dbName);
}

module.exports = {connectToDatabase};
