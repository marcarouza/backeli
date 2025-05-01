const mongoose = require("mongoose");
const uri =
	"mongodb+srv://eli:eli@cluster-ifocop.11zdkja.mongodb.net/?retryWrites=true&w=majority";
const clientOptions = {
	serverApi: {version: "1", strict: true, deprecationErrors: true},
};

//
main().catch((err) => console.log(err));

//
//async function run() {
//	try {
//		// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//		await mongoose.connect(uri, clientOptions);
//		await mongoose.connection.db.admin().command({ping: 1});
//		console.log(
//			"Pinged your deployment. You successfully connected to MongoDB!"
//		);
//	} finally {
//		// Ensures that the client will close when you finish/error
//		await mongoose.disconnect();
//	}
//}
//run().catch(console.dir);

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/test");

	// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
