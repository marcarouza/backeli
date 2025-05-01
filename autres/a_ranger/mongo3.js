const express = require("express");
//const app = express();
const morgan = require("morgan");

//Voici un exemple de script pour établir une connexion à une base de données MongoDB à l'aide de Mongoose, une bibliothèque ODM (Object Data Modeling) pour MongoDB dans Node.js :

const mongoose = require("mongoose");

// URL de connexion à la base de données MongoDB
//const dbURI = "mongodb://localhost:27017/ma_base_de_donnees";
//const dbURI = "mongodb://localhost:27017/test";
const dbURI =
	"mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/?retryWrites=true&w=majority";
//const dbURI = "mongodb://user:password@127.0.0.1:27017/test";

//mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/?retryWrites=true&w=majority

// Options de configuration de la connexion (facultatif)
//const options = {
//	useNewUrlParser: true,
//	useUnifiedTopology: true,
//};

// Établir la connexion à la base de données
mongoose
	.connect(dbURI)
	.then(() => {
		console.log(
			"Connexion à la base de données MongoDB établie avec succès"
		);
	})
	.catch((err) => {
		console.error(
			"Erreur lors de la connexion à la base de données MongoDB :",
			err
		);
	});

// Écouter les événements de connexion et d'erreur
mongoose.connection.on("connected", () => {
	console.log("Connexion MongoDB établie");
});

mongoose.connection.on("error", (err) => {
	console.error("Erreur de connexion à la base de données MongoDB :", err);
});

mongoose.connection.on("disconnected", () => {
	console.log("Déconnexion de la base de données MongoDB");
});

// Fonction pour fermer la connexion à la base de données
const closeDBConnection = () => {
	mongoose.connection.close(() => {
		console.log("Connexion à la base de données MongoDB fermée");
		process.exit(0); // Terminer le processus Node.js
	});
};

// Gérer les événements SIGINT (Ctrl+C) pour fermer la connexion proprement
process.on("SIGINT", closeDBConnection);
