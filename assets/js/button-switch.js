export default function buttonSwitch (context) {
	const container = context || document.body;

	container.addEventListener('click', function (event) {
		const buttonSwitch = event.target.closest('.c-button-switch');
		const clickedButton = event.target.closest('.c-button-switch__item');

		if (!clickedButton) {
			return;
		}

		buttonSwitch.querySelector('.is-active').classList.remove('is-active');
		clickedButton.classList.add('is-active');
	});

}