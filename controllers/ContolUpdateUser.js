//##                MISE A JOUR USER                               -

module.exports.updateUser_get = (req, res) => {
	res.render('modifyUserPage');
};

module.exports.updateUser_post = async (req, res) => {
	const {firstname, lastname, pseudo, birthDate, city, phone} = req.body;
};
