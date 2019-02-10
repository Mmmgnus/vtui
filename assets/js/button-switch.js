import triggerCustomEvent from './custom-event.js';

export default function buttonSwitch (context) {
	const container = context || document.body;

	container.addEventListener('click', function (event) {
		const buttonSwitch = event.target.closest('.c-button-switch');
		const clickedButton = event.target.closest('.c-button-switch__item');

		if (!clickedButton) {
			return;
		}

		// const controlFor = document.querySelector('#' + buttonSwitch.dataset.controlFor + '-' + clickedButton.value);
		// const switchPrefix = buttonSwitch.dataset.switchPrefix;
		const activeButton = buttonSwitch.querySelector('.is-active');

		if (activeButton) {
			activeButton.classList.remove('is-active');
		}
		clickedButton.classList.add('is-active');
		triggerCustomEvent(document.body, 'update-section', buttonSwitch.dataset.controlFor + '_' + clickedButton.value);
	});

}