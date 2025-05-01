// const data = {};
// data.users = require('../model/users.json'); //simulation de MONGO
// data.setUser = (data) => {
// 	this.users = data;
// };
import users from '../model/users.json'; // Simulation de MONGO

const data = {
	users: users,
	setUser(data) {
		this.users = data;
	},
};

export default data;

//
console.log('🚀 ~ data:', data);

const getAllUsers = (req, res) => {
	res.send(data.users);
};
//
const createUser = (req, res) => {
	const newUser = {
		id: data.users.length + 1,
		nom: req.body.nom,
		prenom: req.body.prenom,
	};

	if (!newUser.prenom || !newUser.nom) {
		return res
			.status(400)
			.json({message: 'Le nom et le prénom sont requis.'});
	}
	//## controler ici si le nom et le prenom existe,t deja
	// if (newUser.prenom || newUser.nom) {
	// 	return res
	// 		.status(400)
	// 		.json({message: 'Ce joueur existe deja.', data});
	// }
	// data.setUser([...data.users, newUser]);
	data.users.push(newUser);
	res.status(201).json(data.users);
};

const updateUser = (req, res) => {
	const user = data.users.find((user) => user.id === req.body.id);
	if (!user) {
		return res.status(400).json({
			message: `Cet utilisateur (ID :  ${req.body.id}) n'existe pas.`,
		});
	}
	if (req.body.prenom) {
		user.prenom = req.body.prenom;
	}
	if (req.body.nom) {
		user.nom = req.body.nom;
	}

	const filteredArray = data.users.filter((user) => user.id !== req.body.id);
	const unsortedArray = [...filteredArray, user];
	data.setUser(
		unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
	);
	res.json(data.users);
};

const deleteUser = (req, res) => {
	res.json({
		id: req.params.id,
	});
};
const getOneUser = (req, res) => {
	res.json({
		id: req.params.id,
	});
};

module.exports = {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
	getOneUser,
};
