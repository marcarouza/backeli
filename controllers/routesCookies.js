//##                API COOKIES                               -

module.exports.apiGetCookie = (req, res) => {
	const jwtToken = req.cookies.jwt;
	if (jwtToken) {
		res.json({token: jwtToken});
	} else {
		res.status(401).json({
			message: '🧨 🧨 🧨  routesControl/apiGetCookie  : NO JWT found !',
		});
	}
};
