const myIP = new Promise((resolve, reject) => {
	fetch('https://api.ipify.org?format=json')
		.then((response) => {
			if (!response.ok) {
				throw new Error('La requête IP Publique a échoué');
			}
			return response.json();
		})
		.then((data) => resolve(data.ip)) // Utilisation de resolve pour retourner l'adresse IP
		.catch((error) => {
			reject(
				new Error(
					"Erreur lors de la récupération de l'adresse IP publique : " +
						error.message
				)
			);
		});
});

module.exports = myIP;

// module.exports = fetchIP;
