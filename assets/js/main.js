import { initCollapsable } from './collapsable.js';

initCollapsable();

document.body.addEventListener('submit', function (event) {
	const test = event.target.closest('.c-test');

	if (!test) {
		return;
	}

	fetch(event.target.action, {method: event.target.method})
		.then(function (response) {
			console.log(response);
			if (response.ok) {
				var status = test.querySelector('.c-status');

				if(status) {
					console.log('found one!');
					status.classList.remove('c-status--failed');
					status.classList.add('c-status--solved');
					status.innerHTML = 'Solved';

					test.querySelector('.c-collapsable').classList.add('c-collapsable--collapsed');
				}
			}
		});

	event.preventDefault();
});