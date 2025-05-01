require('dotenv').config();
const mongoose = require('mongoose');

//####################################################
const dbURI = process.env.dbURI;
const DB_NAME = process.env.DB_NAME;
const DB_COLEC = process.env.DB_COLEC;
console.log('🚀 ~ dbURI:', dbURI);

//
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
module.exports = {connectDB};
