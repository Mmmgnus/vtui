export default function initSections (context) {
	const container = context || document.body;

	const sections = container.querySelectorAll('[data-section]');
	console.log(sections);
	sections.forEach(function (section) {
		document.body.addEventListener('update-section', function (event) {
			const [updateId, updateType, updateValue] = event.detail.split('_');
			const [sectionId, sectionType, sectionValue] = section.dataset.section.split('_');


			console.log('updated', updateId, updateType, updateValue);
			console.log('section', sectionId, sectionType, sectionValue);
			if (event.detail === section.dataset.section) {
				console.log('showing', section.dataset.section);
				section.classList.remove('u-hidden');
			}
			else if (updateId === sectionId && updateType === sectionType) {
				console.log('hiding', section.dataset.section, updateType, sectionType);
				section.classList.add('u-hidden');
			}
		});
	});
}