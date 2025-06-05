//## CHECK  COOKIES

module.exports.Get_CheckCookies = (req, res) => {
	const cookies = req.cookies;
	res.json(cookies);
};

//##                API COOKIES                               -

module.exports.Get_JwtToken = (req, res) => {
	const jwtToken = req.cookies.jwt;
	if (jwtToken) {
		res.json({token: jwtToken});
	} else {
		res.status(401).json({
			message: '🧨 🧨 🧨  routesControl/apiGetCookie  : NO JWT found !',
		});
	}
};