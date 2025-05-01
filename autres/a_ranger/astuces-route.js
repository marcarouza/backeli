// chaining route handlers
const one = (req, res, next) => {
	console.log('one');
	next();
};

const two = (req, res, next) => {
	console.log('two');
	next();
};

const three = (req, res) => {
	console.log('three');
	res.send('Finished!');
};

app.get('/chain(.html)?', [one, two, three]);
