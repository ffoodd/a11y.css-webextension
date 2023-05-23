(() => {
	document.body.setAttribute('lang', chrome.i18n.getUILanguage());
	const elementsToLocalize = document.querySelectorAll('.localizeMe');
	elementsToLocalize.forEach(element => {
		element.innerHTML = chrome.i18n.getMessage(element.dataset.message);
	});
})();
