let btnShowLangAttribute = document.getElementById('btnShowLangAttribute');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeShowLangStatus(strStatus, tab) {
	// Get a11y.css stored status
	let getStatus = chrome.storage.local.get("showLangStatus");
	getStatus.then(
		// when we got something
		(item) => {
			let showLangStatus = [];
			if (item && item.showLangStatus) {
				showLangStatus = item.showLangStatus;
			}
			// Add or replace current tab's value
			showLangStatus[tab.id] = {"status": strStatus};
			// And set it back to the storage
			let setting = chrome.storage.local.set({ showLangStatus });
			setting.then(null, onError); // just in case
		}
	);
}

function showLangAttribute() {
	let oldStylesheet = document.getElementById("a11ycss_showlangattribute");
	if ( oldStylesheet ) { oldStylesheet.parentNode.removeChild(oldStylesheet) }
	let stylesheet = document.createElement("link");
	stylesheet.rel = "stylesheet";
	stylesheet.href = chrome.runtime.getURL("/css/show-lang.css");
	stylesheet.id = "a11ycss_showlangattribute";
	document.getElementsByTagName("head")[0].appendChild(stylesheet);
}

function hideLangAttribute() {
	let oldStylesheet = document.getElementById("a11ycss_showlangattribute");
	if ( oldStylesheet ) { oldStylesheet.parentNode.removeChild(oldStylesheet) }
}

btnShowLangAttribute.addEventListener('click', async (e) => {
	let checked = e.target.getAttribute('aria-checked') === 'true' || false;
	let tab = await getCurrentTab();
	// @note since showLang starts with hideLang, is this really useful?
	// @todo in every option files
	if (checked) {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: hideLangAttribute
		});

	} else {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: showLangAttribute
		});
	}
	e.target.setAttribute('aria-checked', String(!checked));
	storeShowLangStatus(!checked, tab);
});

function showLangOnload() {
	let getStatus = chrome.storage.local.get("showLangStatus");
	getStatus.then(
		// when we got something
		async (item) => {
			if (item && item.showLangStatus) {
				let tab = await getCurrentTab();
				// If a setting is found for this tab
				if (item.showLangStatus[tab.id]) {
					btnShowLangAttribute.setAttribute('aria-checked', item.showLangStatus[tab.id].status);
				}
			}
		},
		// we got nothing
		onError
	);
}
showLangOnload();
