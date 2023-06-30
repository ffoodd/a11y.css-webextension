import Setting from './setting.js';

export default class Switch extends Setting {
	constructor(name) {
		super(name);
		const button = document.getElementById(`btn-${name}`);
		super.getCurrentTab().then( tab => {
			button.addEventListener('click', () => {
				this.clickHandler(name, button, tab.id);
			});
		});
	}

	clickHandler(name, button, tabId) {
		let checked = button.getAttribute('aria-checked') === 'true' || false;
		super.toggleCSS(name, tabId, checked);
		button.setAttribute('aria-checked', !checked);
		void super.storeStatus(name, !checked, tabId);
	}
}

