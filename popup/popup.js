(() => {
	document.body.setAttribute('lang', chrome.i18n.getUILanguage());
	const elementsToLocalize = document.querySelectorAll('.localize');
	elementsToLocalize.forEach(element => {
		element.innerHTML = chrome.i18n.getMessage(element.dataset.message);
	});
})();
