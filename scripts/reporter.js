import Setting from './setting.js';

export default class Reporter extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				chrome.tabs.sendMessage(tabs[0].id, { checkalts: true })
					.then(response => {
						if (response === 'isUseless') {
							button.setAttribute('aria-disabled', 'true');
						} else {
							button.addEventListener('click', () => {
								this.clickHandler(name, button);
							});
						}
					}).then(this.onGot, this.onError);
			}).then(this.onGot, this.onError);
	}

	clickHandler(name, button, filename = name) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				chrome.tabs.sendMessage(tabs[0].id, { a11ycss_action: name });
				button.setAttribute('aria-checked', String(!checked));
				super.storeStatus(name, !checked, tabs[0].id);
			});
	}
}

