import Setting from './setting.js';

export default class Option extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		const options = document.querySelectorAll('[type="radio"]');
		const locale = chrome.i18n.getUILanguage();
		this.updateOptionState(name, options);
		// @todo Should getting current Tab go there?
		// Maybe in Setting parent class?
		button.addEventListener('click', () => {
			const selectedOption = document.querySelector(`[name="option-${name}"]:checked`);
			const selected = selectedOption ? selectedOption.value : 'all';
			this.clickHandler(name, button, selected, locale, options);
		});
	}

	clickHandler(name, button, selected, locale, options) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				super.toggleCSS(`${name}-${locale}_${selected}`, tabs[0].id, checked);
				button.setAttribute('aria-checked', !checked);
				options.forEach(el => el.disabled = !checked);
				super.storeStatus(`${name}`, !checked, tabs[0].id);
				super.storeStatus(`${name}-option`, selected, tabs[0].id);
			});
	}

	updateOptionState(name, options) {
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				chrome.storage.local.get(`${tabs[0].id}-${name}-option`)
					.then(setting => {
						const option = Object.keys(setting).length > 0 ? setting[`${tabs[0].id}-${name}-option`] : 'all';
						document.querySelector(`[name="option-${name}"][value="${option}"]`).checked = true;
						if (option !== 'all') {
							options.forEach(el => el.disabled = true);
						}
					}).then(this.onGot, this.onError);
			}).then(this.onGot, this.onError);
	}
}
