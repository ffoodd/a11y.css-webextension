import Setting from './setting.js';

export default class Reporter extends Setting {
	constructor(name) {
		super(name);
		this.icons = {
			ok: chrome.runtime.getURL("/icons/ok.svg"),
			ko: chrome.runtime.getURL("/icons/ko.svg"),
			info: chrome.runtime.getURL("/icons/info.svg")
		};
		this.strings = {
			ok: chrome.i18n.getMessage("altOK"),
			ko: chrome.i18n.getMessage("altMissing"),
			info: chrome.i18n.getMessage("altEmpty")
		};
		const button = document.getElementById(`btn-${name}`);
		button.addEventListener('click', () => {
			this.clickHandler(name, button);
		});
	}

	clickHandler(name, button, filename = name) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				chrome.tabs.sendMessage(tabs[0].id, {
					a11ycss_action: name,
					icons: this.icons,
					strings: this.strings
				});

				button.setAttribute('aria-checked', String(!checked));
				super.storeStatus(name, !checked, tabs[0].id);
			});
	}
}

