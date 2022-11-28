import Setting from './setting.js';

export default class Switch extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		button.addEventListener('click', () => {
			this.clickHandler(name, button);
		});
	}

	clickHandler(name, button) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				super.toggleCSS(name, tabs[0].id, checked);
				button.setAttribute('aria-checked', !checked);
				super.storeStatus(name, !checked, tabs[0].id);
			});
	}
}

