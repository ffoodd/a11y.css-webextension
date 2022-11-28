import Setting from './setting.js';

export default class Reporter extends Setting {
	constructor(name) {
		super(name);
		const locale = document.body.getAttribute('lang');
		this.icons = {
			ok: chrome.runtime.getURL("/icons/ok.svg"),
			ko: chrome.runtime.getURL("/icons/ko.svg"),
			info: chrome.runtime.getURL("/icons/info.svg")
		};
		this.strings = {
			ok: this.localize("altOK", locale),
			ko: this.localize("altMissing", locale),
			info: this.localize("altEmpty", locale)
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

	localize(string, locale) {
		return (localeStrings[locale] && localeStrings[locale][string])
			? localeStrings[locale][string]
			: localeStrings['en'][string];
	}
}

