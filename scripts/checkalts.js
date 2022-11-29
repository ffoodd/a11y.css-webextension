let btnCheckalts = document.getElementById('btnCheckalts');

// @todo Quite a fex duplicated things between files, there's probably a better way (in utils.js, maybe?)
// @note getCurrentTab()
// @note storeOptionStatus()
// @note optionOnLoad()
// @note Click handlers
async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeCheckAltsStatus(strStatus, tab) {
	// Get a11y.css stored status
	let getStatus = chrome.storage.local.get("checkAltsStatus");
	getStatus.then(
		// when we got something
		(item) => {
			let checkAltsStatus = [];
			if (item && item.checkAltsStatus) {
				checkAltsStatus = item.checkAltsStatus;
			}
			// Add or replace current tab's value
			checkAltsStatus[tab.id] = {"status": strStatus};
			// And set it back to the storage
			let setting = chrome.storage.local.set({ checkAltsStatus });
			setting.then(null, onError); // just in case
		}
	);
}

btnCheckalts.addEventListener('click', async (e) => {
	let tab = await getCurrentTab();
	let icons = {
		ok: chrome.runtime.getURL("/icons/ok.svg"),
		ko: chrome.runtime.getURL("/icons/ko.svg"),
		info: chrome.runtime.getURL("/icons/info.svg")
	};
	let strings = {
		ok: _t("altOK"),
		ko: _t("altMissing"),
		info: _t("altEmpty")
	};
	chrome.tabs.sendMessage(tab.id, {
		a11ycss_action: "checkalts",
		icons: icons,
		strings: strings
	});
	let checked = e.target.getAttribute('aria-checked') === 'true' || false;
	e.target.setAttribute('aria-checked', String(!checked));
	storeCheckAltsStatus(!checked, tab);
});

function checkAltsOnload() {
	let getStatus = chrome.storage.local.get("checkAltsStatus");
	getStatus.then(
		// when we got something
		async (item) => {
			if (item && item.checkAltsStatus) {
				let tab = await getCurrentTab();
				// If a setting is found for this tab
				if (item.checkAltsStatus[tab.id]) {
					btnCheckalts.setAttribute('aria-checked', item.checkAltsStatus[tab.id].status);
				}
			}
		},
		// we got nothing
		onError
	);
}
checkAltsOnload();
