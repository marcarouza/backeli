const express = require('express');
const routeRegLog = express.Router();

routeRegLog.get('/register', (req, res) => {
	//

	res.render('conlog/register', {});
});

routeRegLog.get('/connect', (req, res) => {
	//
	console.log('🚀 ~ CONNECT MIDDLEWARE ');

	res.render('conlog/connect', {});
});

module.exports = routeRegLog;
