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
	const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
	browser.tabs.sendMessage(tab.id, { getImagesCount: true }, response => {
		if (response) {
			checkalts.enableButton(document.getElementById('btn-alt'), 'alt', Number(response) === 0);
		}
	});
}
