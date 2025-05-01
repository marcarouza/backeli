document.addEventListener('DOMContentLoaded', () => {
	fetch('/api/random-user')
		.then((response) => response.json())
		.then((data) => {
			console.log('Fetched random user:', data);

			const userPseudoEL = document.getElementById('user');
			console.log('🚀 ~ .then ~ userPseudoEL:', userPseudoEL);
			const userEmailEL = document.getElementById('email');
			console.log('🚀 ~ .then ~ userEmailEL:', userEmailEL);
			const userPwdEL = document.getElementById('pwd');
			console.log('🚀 ~ .then ~ userPwdEL:', userPwdEL);

			const fillFakeUser = () => {
				if (userPseudoEL) userPseudoEL.value = data.username;
				if (userEmailEL) userEmailEL.value = data.email;
				if (userPwdEL) userPwdEL.value = data.password;
			};

			fillFakeUser();
		})
		.catch((error) => {
			console.error(
				"ERREUR DE RECUPERATION DE DATA DEPUIS FETCH, voici l'erreur ",
				error
			);
		});
});
