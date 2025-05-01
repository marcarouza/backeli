document.addEventListener('DOMContentLoaded', function () {
	const ul = document.getElementById('dynamicWidth');
	console.log('🚀 ~ document:', document);
	const lis = ul.getElementsByTagName('li');
	console.log('🚀 ~ lis:', lis);

	let maxWidth = 0;

	for (let li of lis) {
		const width = li.offsetWidth;
		console.log('🚀 ~ width:', width);

		if (width) {
			maxWidth = width + 30;
		} else {
			maxWidth = 200;
		}
	}

	ul.style.width = `${maxWidth}px`;
});
