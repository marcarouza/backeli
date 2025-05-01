// Fonction pour se connecter à la base de données
async function connectDB() {
	const client = new MongoClient(dbURIfinal, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	console.log('Connecté à la base de données');
	return client.db(dbName);
}

//## AVEC NODEJS le format de l' URI est celui-ci :
//!! mongodb + srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Ifocop

//## AVEC VSCode le format de l' URI est celui-ci :
//?? mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/
/*
//## Avec MongoDB Compass 
//!! mongodb+srv://eli:<password>@cluster-ifocop.11zdkja.mongodb.net/

//## Avec MongoSH  

//?? mongosh "mongodb+srv://cluster-ifocop.11zdkja.mongodb.net/" --apiVersion 1 --username eli
//?? You will be prompted for the PASSWord for the Database User, eli. When entering your password, make sure all special characters are URL encoded.

L'URI (Uniform Resource Identifier) pour se connecter à une base de données MongoDB a généralement la structure suivante :


mongodb://username:password@host:port/database
où username et password sont les informations d'identification pour se connecter à la base de données, host et port spécifient l'emplacement du serveur MongoDB, et database est le nom de la base de données à utiliser.

Si vous souhaitez spécifier également le nom de la collection à utiliser, vous pouvez ajouter /collection_name à la fin de l'URI :


mongodb://username:password@host:port/database/collection_name
Cependant, notez que cela ne fonctionne que pour certaines opérations, telles que l'insertion de documents dans une collection spécifique. Pour la plupart des opérations CRUD, vous devrez utiliser le modèle Mongoose correspondant à la collection que vous souhaitez utiliser, plutôt que de spécifier le nom de la collection dans l'URI.

*/

//## Code de connexion fourni par MONGO

const {MongoClient, ServerApiVersion} = require('mongodb');
const uri =
	'mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Ifocop';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db('admin').command({ping: 1});
		console.log(
			'Pinged your deployment. You successfully connected to MongoDB!'
		);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);
