// horoDat.js
const horoDat = () => {
	const timestamp = Date.now();
	const now = new Date(timestamp);
	const dateLisible = now.toLocaleString();
	console.log('🚀 ~~ date ->: ', dateLisible);
	return dateLisible;
};

module.exports = {horoDat};
