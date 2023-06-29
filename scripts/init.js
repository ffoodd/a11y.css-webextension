import Switch from './switch.js';
import Option from './option.js';
import Reporter from './reporter.js';

new Switch('outline');
new Switch('lang');
new Switch('spacing');
new Option('a11y');
const checkalts = new Reporter('alt');

// Firefox
if (typeof browser !== 'undefined') {
	browser.tabs.query({active: true, currentWindow: true})
		.then(tabs => {
			browser.tabs.sendMessage(tabs[0].id, {getImagesCount: true}, response => {
				if (response) {
					// Rebrancher l’écouteur sur le bouton
					checkalts.enableButton(document.getElementById('btn-alt'), 'alt', Number(response) === 0);
				}
			});
		});
}
