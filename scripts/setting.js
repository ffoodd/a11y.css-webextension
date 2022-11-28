export default class Setting {
	constructor(name) {
		const button = document.getElementById(`btn-${name}`);
		this.updateButtonState(name, button);
	}

	onError(error) {
		console.error(`a11y.css error: ${error}`);
	}

	onGot(item) {
		if (item) {
			console.info(`a11y.css got`, item);
		} else {
			console.info('Item was set');
		}
	}

	toggleCSS(filename, tabID, checked) {
		if (checked) {
			chrome.scripting.removeCSS({
				target: {tabId: tabID},
				files: [`/css/${filename}.css`]
			});
		} else {
			chrome.scripting.insertCSS({
				target: {tabId: tabID},
				files: [`/css/${filename}.css`]
			});
		}
	}

	storeStatus(name, status, tabId) {
		chrome.storage.local.set({
			[`${tabId}-${name}`]: status
		}).then(this.onGot, this.onError);
	}

	updateButtonState(name, button) {
		chrome.tabs.query({ active: true, currentWindow: true })
			.then(tabs => {
				chrome.storage.local.get(`${tabs[0].id}-${name}`)
					.then(setting => {
						const state = setting[`${tabs[0].id}-${name}`];
						button.setAttribute('aria-checked', (typeof state !== 'undefined') ? String(state) : 'false');
					}).then(this.onGot, this.onError);
			}).then(this.onGot, this.onError);
	}
}

