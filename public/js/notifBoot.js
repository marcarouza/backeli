document.addEventListener('DOMContentLoaded', () => {
	const showNotificationBtn = document.getElementById('testLog');
	const notification = document.getElementById('toast-body');
	console.log(
		'🚀 ~ document.addEventListener ~ notification:',
		notification
	);
	const toast = new bootstrap.Toast(notification);

	showNotificationBtn.addEventListener('click', () => {
		const email = document.getElementById('email').value;
		const pwd = document.getElementById('pwd').value;

		if (email === '' || pwd === '') {
			alert('Veuillez remplir tous les champs');
		} else {
			// notification.classList.add('fade-in');
			notification.innerHTML = 'Connexion réussie !';
			toast.show();

			setTimeout(() => {
				notification.classList.add('fade-out');
				notification.classList.remove('fade-in');

				setTimeout(() => {
					toast.hide();
					notification.classList.remove('fade-out');
				}, 500); // Duration of fade-out animation
			}, 3000); // Duration the notification is shown
		}
	});
});
