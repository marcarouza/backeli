document.addEventListener('DOMContentLoaded', () => {
	fetch('/api/random-user')
		.then((response) => response.json())
		.then((data) => {
			console.log('Fetched random user:', data);

			const userPseudoEL = document.getElementById('user');
			console.log('🚀 ~ . ~ userPseudoEL:', userPseudoEL);
			const userEmailEL = document.getElementById('email');
			console.log('🚀 ~ . ~ userEmailEL:', userEmailEL);
			const userPwdEL = document.getElementById('pwd');
			console.log('🚀 ~ . ~ userPwdEL:', userPwdEL);

			const userNotif = {};

			const fillFakeUser = () => {
				if (userPseudoEL && userEmailEL && userPwdEL) {
					userPseudoEL.value = data.username;
					userEmailEL.value = data.email;
					userPwdEL.value = data.password;

					userNotif.user = data.username;
					userNotif.email = data.email;
					userNotif.pwd = data.password;
				}
			};

			console.log('🚀 ~ . ~ userNotif:', userNotif);

			fillFakeUser();
		})
		.catch((error) => {
			console.error(
				"ERREUR DE RECUPERATION DE DATA DEPUIS FETCH, voici l'erreur ",
				error
			);
		});
});
