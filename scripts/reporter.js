import Setting from './setting.js';

export default class Reporter extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		button.addEventListener('click', () => {
			this.clickHandler(name, button);
		});
	}

	clickHandler(name, button, filename = name) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				chrome.tabs.sendMessage(tabs[0].id, { a11ycss_action: name })
					.catch(error => console.error(error));
				button.setAttribute('aria-checked', String(!checked));
				super.storeStatus(name, !checked, tabs[0].id);
			});
	}
}

