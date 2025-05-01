window.addEventListener('DOMContentLoaded', () => {
	const openModale = document.getElementById('profil');
	const connexLog = document.getElementById('connexLog');

	const logModal = new bootstrap.Modal(
		document.getElementById('loginModal')
	);

	const close = document.getElementById('close');
	//
	// const submit = document.getElementById('submit');
	//
	// const closeModale = () => {
	// 	openModale.style.display = 'none';
	// };

	close.addEventListener('click', (e) => {
		logModal.hide();
	});

	openModale.addEventListener('click', (e) => {
		logModal.show();
	});
});
