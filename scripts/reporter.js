import Setting from './setting.js';

export default class Reporter extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		if ( typeof browser !== 'undefined' ) {
			// Firefox
			browser.runtime.onMessage.addListener(message => {
				this.enableButton(button, name, message?.a11ycss_images_number === 0);
			});
		} else {
			// Edge, Chrome
			chrome.tabs.query({active: true, currentWindow: true})
				.then(tabs => {
					chrome.tabs.sendMessage(tabs[0].id, {a11ycss_should_checkalts: true})
						.then(response => {
							this.enableButton(button, name, response === 'isUseless');
						}).then(this.onGot, this.onError);
				}).then(this.onGot, this.onError);
		}
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

	enableButton(button, name, isUseless) {
		if (isUseless) {
			button.setAttribute('aria-disabled', 'true');
		} else {
			button.addEventListener('click', () => {
				this.clickHandler(name, button);
			});
		}
	}
}

