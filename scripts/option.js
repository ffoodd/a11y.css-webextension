import Setting from './setting.js';

export default class Option extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		const options = document.querySelectorAll('[type="radio"]');
		const locale = chrome.i18n.getUILanguage();
		super.getCurrentTab().then(tab => {
			void this.updateOptionState(name, options, tab.id);
			button.addEventListener('click', () => {
				const selectedOption = document.querySelector(`[name="option-${name}"]:checked`);
				const selected = selectedOption && selectedOption.value !== 'all' ? `_${selectedOption.value}` : '';
				this.clickHandler(name, button, tab.id, selected, locale, options);
			});
		})
	}

	clickHandler(name, button, tabId, selected, locale, options) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		super.toggleCSS(`${name}-${locale}${selected}`, tabId, checked);
		button.setAttribute('aria-checked', !checked);
		options.forEach(el => el.disabled = !checked);
		void super.storeStatus(`${name}`, !checked, tabId);
		void super.storeStatus(`${name}-option`, selected !== '' ? selected : 'all', tabId);
	}

	async updateOptionState(name, options, tabId) {
		const setting = await chrome.storage.local.get(`${tabId}-${name}-option`);
		const option = Object.keys(setting).length > 0 ? setting[`${tabId}-${name}-option`] : 'all';
		document.querySelector(`[name="option-${name}"][value="${option}"]`).checked = true;
		if (option !== 'all') {
			options.forEach(el => el.disabled = true);
		}
	}
}
