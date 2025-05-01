// transition.js
document.addEventListener('DOMContentLoaded', () => {
	const body = document.body;

	// Ajouter la classe "fade-out" au corps lors du clic sur un lien
	document.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', (e) => {
			if (
				e.target.hasAttribute('href') &&
				!e.target.hasAttribute('target')
			) {
				e.preventDefault();
				body.classList.add('fade-out');

				// Attendre la fin de l'animation, puis charger la nouvelle page
				setTimeout(() => {
					window.location.href = e.target.href;
				}, 1000);
			}
		});
	});

	// Ajouter la classe "fade-in" au corps après un court délai lors du chargement de la page
	setTimeout(() => {
		body.classList.add('fade-in');
	}, 10);
});
