

//##                CHECK USER STATUS                               -

module.exports.Get_CheckUserStatus = (req, res) => {
	console.log(
		'🚀 ~ routesControl.js:647 ~ res.locals.user  ==> ',
		res.locals.user
	);
	return res.json({
		user: res.locals.user,
	});
};
