const bcrypt = require('bcryptjs');
let defaultHash;
const users = [];

// (async () => {
// 	const salt === await bcrypt.genSalt(10);
// 	defaultHash = await bcrypt.hash("1234", salt);

// 	users.push({
// 		id: Date.now().toString(),
// 		//id: 1,
// 		name: "Alex",
// 		email: "alex@alex.com",
// 		password: defaultHash,
// 	});
// 	users.push({
// 		//id: Date.now().toString(),
// 		id: 2,
// 		name: "Eli",
// 		email: "eli@eli.fr",
// 		password: defaultHash,
// 	});
// 	console.log("depuis DATA : ", users);
// })();

module.exports = {
	users,
};
