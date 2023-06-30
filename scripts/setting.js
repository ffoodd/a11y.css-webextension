export default class Setting {
	constructor(name) {
		const button = document.getElementById(`btn-${name}`);
		this.getCurrentTab().then(tab => {
			void this.updateButtonState(name, button, tab.id);
		});
	}

	async getCurrentTab() {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		return tab;
	}

	isFirefox() {
		return typeof browser !== 'undefined';
	}

	toggleCSS(filename, tabId, checked) {
		if (checked) {
			chrome.scripting.removeCSS({
				target: {tabId: tabId},
				files: [`/css/${filename}.css`]
			});
		} else {
			chrome.scripting.insertCSS({
				target: {tabId: tabId},
				files: [`/css/${filename}.css`]
			});
		}
	}

	async storeStatus(name, status, tabId) {
		await chrome.storage.local.set({ [`${tabId}-${name}`]: status });
	}

	async updateButtonState(name, button, tabId) {
		const setting = await chrome.storage.local.get(`${tabId}-${name}`);
		const state = setting[`${tabId}-${name}`];
		button.setAttribute('aria-checked', (typeof state !== 'undefined') ? String(state) : 'false');
	}
}

