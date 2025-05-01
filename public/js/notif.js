document.addEventListener('DOMContentLoaded', () => {
	const userNotif = {};

	const showNotif = document.getElementById('showNotif');
	const notif = document.getElementById('notif');
	const toast_body = document.getElementById('toast_body');
	const toastONE = new bootstrap.Toast(notif);

	showNotif.addEventListener('click', () => {
		notif.classList.add('fade-in');
		toast_body.textContent = 'Hello';
		toastONE.show();

		// setTimeout(() => {
		// 	notification.classList.add('fade-out');
		// 	notification.classList.remove('fade-in');

		// 	setTimeout(() => {
		// 		toastONE.hide();
		// 		notification.classList.remove('fade-out');
		// 	}, 5000); // Duration of fade-out animation
		// }, 3000); // Duration the notification is shown
	});

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

	//
	// const notif = document.getElementById('notif');
	// console.log('🚀 ~ NOTIF Container : ', notif);

	// const text_notif = document.getElementById('text_notif');
	// console.log('🚀 ~ TEXT NOTIF : ', text_notif);
	// const toast = new bootstrap.Toast(notif);

	// const submit = document.getElementById('submit');
	// console.log('🚀 ~  ~ SUBMIT:', submit);

	// const showNotif = (userNotif) => {
	// 	notif.textContent = userNotif;
	// 	notif.classList.add('fade-in');
	// 	toast.show();

	// 	setTimeout(() => {
	// 		notif.classList.add('fade-out');
	// 		notif.classList.remove('fade-in');

	// 		setTimeout(() => {
	// 			toast.hide();
	// 			notif.classList.remove('fade-out');
	// 		}, 500); // Duration of fade-out animation
	// 	}, 3000);
	// };

	// submit.addEventListener('click', (e) => {
	// 	// e.preventDefault();
	// 	showNotif(userNotif);
	// });
});
