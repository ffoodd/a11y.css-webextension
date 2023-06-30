import Setting from './setting.js';

export default class Reporter extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		const tab = super.getCurrentTab();
		if ( super.isFirefox() ) {
			browser.runtime.onMessage.addListener(message => {
				if (message.a11ycss_reporter && message.a11ycss_reporter === name) {
					this.enableButton(button, name, message.a11ycss_reported === 0);
				}
			});
		} else {
			super.getCurrentTab().then(tab => {
				chrome.tabs.sendMessage(tab.id, { a11ycss_should_report: name })
					.then(response => {
						this.enableButton(button, name, response === 'nope');
					});
			})
		}
	}

	async clickHandler(name, button, filename = name) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		const tab = await super.getCurrentTab();
		void chrome.tabs.sendMessage(tab.id, { a11ycss_action: name });
		button.setAttribute('aria-checked', String(!checked));
		void super.storeStatus(name, !checked, tab.id);
	}

	enableButton(button, name, isUseless) {
		if (isUseless) {
			button.setAttribute('aria-disabled', 'true');
		} else {
			button.addEventListener('click', () => {
				void this.clickHandler(name, button);
			});
		}
	}
}

