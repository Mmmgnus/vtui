export default function initCollapsable (context) {
	const container = context || document.body;

	container.addEventListener('click', function (event) {
		const test_item = event.target.closest('[data-collapsable-target]');

		if (!test_item) {
			return;
		}

		document
			.getElementById(test_item.dataset.collapsableTarget)
			.classList.toggle('c-collapsable--collapsed');
	});

}