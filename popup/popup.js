
// Set language first
let localeNormalCase = 'en'; // default locale, may happen to be capitalised, cf pt-BR
let locale; // this will retrieve a lower-case locale, used for file names etc.

function _t(string, locale) {
	return (localeStrings[locale] && localeStrings[locale][string])
		? localeStrings[locale][string]
		: localeStrings['en'][string];
}

function setLocale() {
	// first find if there is a locale we can use
	let isLocaleFoundYet = false;
	let ualang = navigator.languages; // grab the navigator's languages
	ualang.forEach(function (key) {
		if (locales.includes(key.toLowerCase()) && !isLocaleFoundYet) {
			localeNormalCase = key; // new locale
			isLocaleFoundYet = true;
		}
	});
	// locale is used for all localisation strings, cf. locales.js
	locale = localeNormalCase.toLowerCase();
	// set lang of document
	document.body.setAttribute('lang',localeNormalCase);

	// localise every element
	// @todo Tons of duplicated code here…
	let localizableElts = document.getElementsByClassName('localizeMe');
	for(let i=0 ; i < localizableElts.length ; i++) {
		localizableElts[i].innerHTML = _t(localizableElts[i].getAttribute('id'), locale);
	}

	let localizableEltsOn  = document.getElementsByClassName('localizeOn');
	for(let i=0 ; i < localizableEltsOn.length ; i++) {
		localizableEltsOn[i].innerHTML = _t('localizeOn', locale);
	}

	let localizableEltsOff = document.getElementsByClassName('localizeOff');
	for(let i=0 ; i < localizableEltsOff.length ; i++) {
		localizableEltsOff[i].innerHTML = _t('localizeOff', locale);
	}
}

setLocale();
