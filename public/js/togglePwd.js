document.addEventListener('DOMContentLoaded', () => {
	const togglePWD = document.getElementById('togglePWD');
	console.log('🚀 ~ document.addEventListener ~ togglePassword:', togglePWD);
	const password = document.getElementById('pwd');

	const inout = () => {
		const icon = togglePWD.querySelector('i');

		const type = password.getAttribute('type');
		if (password.getAttribute('type') === 'password') {
			const type = 'text';
			password.setAttribute('type', type);
		} else {
			if (password.getAttribute('type') === 'text') {
				const type = 'password';
				password.setAttribute('type', type);
			}
		}

		icon.classList.toggle('bi-eye-slash');
		icon.classList.toggle('bi-eye');
	};

	togglePWD.addEventListener('mouseenter', () => inout());

	togglePWD.addEventListener('mouseleave', () => inout());
});
