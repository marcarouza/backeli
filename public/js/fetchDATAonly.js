export async function fetchUserData() {
	try {
		const response = await fetch('/api/random-user');
		const data = await response.json();
		console.log('Fetched random user:', data);
		return data;
	} catch (error) {
		console.error(
			"ERREUR DE RECUPERATION DE DATA DEPUIS FETCH, voici l'erreur ",
			error
		);
		throw error;
	}
}
